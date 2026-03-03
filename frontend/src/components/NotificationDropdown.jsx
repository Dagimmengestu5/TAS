import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, X, Check, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/api';
import { formatDistanceToNow } from 'date-fns';

const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await api.get('/notifications');
            setNotifications(response.data.notifications);
            setUnreadCount(response.data.count);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll for updates every 60 seconds
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications(notifications.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await api.post('/notifications/mark-all-read');
            setNotifications(notifications.map(n => ({ ...n, read_at: n.read_at || new Date().toISOString() })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2.5 bg-gray-50 hover:bg-white rounded-xl transition-all text-gray-400 hover:text-gray-900 border border-gray-100 shadow-sm active:scale-95 group"
            >
                <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-yellow text-xs font-bold text-gray-900 border-2 border-white shadow-sm animate-bounce-slow">
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                    >
                        <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                                <div className="w-1.5 h-4 bg-brand-yellow rounded-full"></div> Node Notifications
                            </h3>
                            <button
                                onClick={handleMarkAllRead}
                                className="text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-brand-yellow transition-colors"
                            >
                                Clear All
                            </button>
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            {loading && notifications.length === 0 ? (
                                <div className="p-8 text-center">
                                    <div className="w-6 h-6 border-2 border-brand-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Scanning Grid...</p>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="p-12 text-center">
                                    <Bell className="w-8 h-8 text-gray-100 mx-auto mb-3" />
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider leading-relaxed">No active signals detected in the transmission grid.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-50">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            onClick={() => {
                                                if (!notification.read_at) {
                                                    handleMarkAsRead(notification.id);
                                                }
                                                setIsOpen(false);
                                                navigate(`/notifications/${notification.id}`);
                                            }}
                                            className={`p-4 hover:bg-gray-50/80 cursor-pointer transition-all group border-l-4 ${!notification.read_at ? 'border-brand-yellow font-medium' : 'border-transparent opacity-60'}`}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className={`text-sm font-bold uppercase tracking-tight leading-none truncate pr-4 ${!notification.read_at ? 'text-gray-900' : 'text-gray-500'}`}>
                                                    {notification.data.title || 'System Notification'}
                                                </h4>
                                                <div className="flex flex-col items-end gap-1">
                                                    {!notification.read_at && (
                                                        <div className="w-2 h-2 bg-brand-yellow rounded-full animate-pulse shadow-[0_0_8px_rgba(255,242,0,0.6)]"></div>
                                                    )}
                                                    <span className="text-[10px] font-semibold text-gray-400 uppercase  whitespace-nowrap flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500 font-medium leading-relaxed line-clamp-2 uppercase tracking-wide">
                                                {notification.data.message || 'Transmission received at terminal.'}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-3 border-t border-gray-50 bg-gray-50/50 text-center">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Ecosystem Encryption Active</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationDropdown;
