import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, ArrowLeft, Clock, ShieldCheck, Mail, AlertTriangle, MessageSquare, Send, X, User } from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const NotificationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Offer Dialog State ---
    const [messages, setMessages] = useState([]);
    const [msgInput, setMsgInput] = useState('');
    const [msgLoading, setMsgLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const threadRef = useRef(null);

    const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

    useEffect(() => {
        const fetchNotification = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/notifications/${id}`);
                const notif = response.data.notification;
                setNotification(notif);
                setUnreadMessagesCount(response.data.unread_messages_count || 0);

                // If this notification relates to an offer application message, load the dialog
                const appId = notif?.data?.application_id;
                if (appId) {
                    loadMessages(appId);
                }
            } catch (err) {
                console.error('Failed to fetch notification:', err);
                setError('Could not load message details.');
            } finally {
                setLoading(false);
            }
        };
        fetchNotification();
    }, [id]);

    // Scroll to bottom of thread on new messages
    useEffect(() => {
        if (threadRef.current) {
            threadRef.current.scrollTop = threadRef.current.scrollHeight;
        }
    }, [messages]);

    const loadMessages = async (appId) => {
        setMsgLoading(true);
        try {
            const res = await api.get(`/applications/${appId}/messages`);
            setMessages(res.data);
        } catch (e) {
            console.error('Could not load messages:', e);
        } finally {
            setMsgLoading(false);
        }
    };

    const sendMessage = async () => {
        const appId = notification?.data?.application_id;
        const msgText = msgInput.trim();
        if (!appId || !msgText) return;

        // Optimistic UI Update
        const tempId = Date.now();
        const tempMsg = {
            id: tempId,
            user_id: user?.id,
            message: msgText,
            created_at: new Date().toISOString(),
            user: { id: user?.id, name: user?.name },
            isOptimistic: true
        };

        setMessages(prev => [...prev, tempMsg]);
        setMsgInput('');
        setSending(true);

        try {
            const res = await api.post(`/applications/${appId}/messages`, { message: msgText });
            setMessages(prev => prev.map(m => m.id === tempId ? res.data : m));
        } catch (e) {
            setMessages(prev => prev.filter(m => m.id !== tempId));
            setMsgInput(msgText); // Restore input
            alert('Failed to send message. Please try again.');
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-10 h-10 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !notification) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Message Not Found</h2>
                <p className="text-gray-500 mb-8 max-w-xs">{error || "The message you are looking for doesn't exist or was removed."}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" /> Go Back
                </button>
            </div>
        );
    }

    const { title, message, type } = notification.data;
    const applicationId = notification?.data?.application_id;
    const candidateName = notification?.data?.candidate_name;
    const hasDialog = !!applicationId;

    return (
        <div className="min-h-screen bg-gray-50/30 p-6 lg:p-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto"
            >
                {/* Back */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-gray-900 font-bold text-sm mb-8 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>

                {/* Notification Card */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden shadow-gray-200/50">
                    <div className="p-8 lg:p-12">

                        {/* Icon + Timestamp */}
                        <div className="flex justify-between items-start mb-10">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${type === 'approval' ? 'bg-green-500 text-white shadow-green-200' :
                                type === 'rejection' ? 'bg-red-500 text-white shadow-red-200' :
                                    hasDialog ? 'bg-gray-900 text-brand-yellow shadow-gray-200' :
                                        'bg-brand-yellow text-gray-900 shadow-yellow-100'
                                }`}>
                                {hasDialog ? <MessageSquare className="w-6 h-6" /> : <Bell className="w-6 h-6" />}
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Received</p>
                                <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
                                    <Clock className="w-4 h-4 text-gray-300" />
                                    {new Date(notification.created_at).toLocaleString()}
                                </div>
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                            {title || 'System Alert'}
                        </h1>

                        {/* Message body */}
                        <p className="text-lg text-gray-600 leading-relaxed font-medium mb-10">
                            {message}
                        </p>

                        {hasDialog && (
                            <div className="mb-8">
                                <button
                                    onClick={() => {
                                        setShowDialog(!showDialog);
                                        setUnreadMessagesCount(0);
                                    }}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg relative ${showDialog ? 'bg-brand-yellow text-black' : 'bg-gray-900 text-brand-yellow hover:bg-black active:scale-95'}`}
                                >
                                    <MessageSquare className="w-4 h-4" />
                                    {showDialog ? 'Hide Conversation' : 'Offer Conversation'}
                                    {unreadMessagesCount > 0 && !showDialog && (
                                        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white shadow-lg border-2 border-white animate-bounce">
                                            {unreadMessagesCount}
                                        </span>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Offer Conversation logic moved to standalone modal */}

                        {/* Footer badges */}
                        <div className="mt-10 pt-8 border-t border-gray-50 flex flex-wrap gap-4">
                            <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl">
                                <ShieldCheck className="w-4 h-4 text-green-500" />
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Verified Connection</span>
                            </div>
                            <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl">
                                <Mail className="w-4 h-4 text-blue-500" />
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Digital Record</span>
                            </div>
                        </div>
                    </div>

                    {/* Branding Strip */}
                    <div className="bg-gray-900 p-6 text-center">
                        <p className="text-[10px] font-bold text-brand-yellow uppercase tracking-wider opacity-80">
                            Droga Talent Acquisition System
                        </p>
                    </div>
                </div>
            </motion.div>

            <AnimatePresence>
                {showDialog && (
                    <NotificationOfferConversationModal
                        isOpen={showDialog}
                        onClose={() => setShowDialog(false)}
                        messages={messages}
                        msgInput={msgInput}
                        setMsgInput={setMsgInput}
                        msgLoading={msgLoading}
                        sending={sending}
                        sendMessage={sendMessage}
                        user={user}
                        candidateName={candidateName}
                        threadRef={threadRef}
                        loadMessages={() => loadMessages(applicationId)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

const NotificationOfferConversationModal = ({ isOpen, onClose, messages, msgInput, setMsgInput, msgLoading, sending, sendMessage, user, candidateName, threadRef, loadMessages }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                className="relative bg-white w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl flex flex-col max-h-[85vh] border border-white/20"
            >
                <div className="bg-gray-900 px-10 py-8 flex items-center justify-between border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-brand-yellow/10 rounded-2xl flex items-center justify-center border border-brand-yellow/20">
                            <MessageSquare className="w-6 h-6 text-brand-yellow" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-brand-yellow uppercase tracking-[0.3em] mb-1">Encrypted Line</span>
                            <span className="text-lg font-black text-white uppercase tracking-tight">Offer Conversation</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={loadMessages}
                            className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all group active:scale-90 border border-white/5"
                            title="Refresh"
                        >
                            <Clock className="w-5 h-5 text-gray-500 group-hover:text-brand-yellow" />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all group active:scale-90 border border-white/5"
                        >
                            <X className="w-6 h-6 text-gray-500 group-hover:text-white" />
                        </button>
                    </div>
                </div>

                <div
                    ref={threadRef}
                    className="flex-1 overflow-y-auto px-10 py-10 flex flex-col gap-8 bg-gray-50/50"
                >
                    {candidateName && (
                        <div className="flex items-center justify-center gap-3 py-2 border-b border-gray-100 mb-2 opacity-50">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{candidateName}</span>
                        </div>
                    )}

                    {msgLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-6">
                            <div className="w-10 h-10 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(255,242,0,0.2)]" />
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] animate-pulse">Syncing Protocols...</span>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 opacity-20">
                            <MessageSquare className="w-16 h-16 text-gray-400 mb-6" />
                            <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] text-center">No transmissions encrypted yet.</p>
                        </div>
                    ) : messages.map((msg, i) => {
                        const isMe = msg.user_id === user?.id;
                        return (
                            <div key={i} className={`flex flex-col gap-3 ${isMe ? 'items-end' : 'items-start'}`}>
                                <div className="flex items-center gap-3 px-2">
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${isMe ? 'text-brand-yellow' : 'text-gray-400'}`}>
                                        {isMe ? 'User Origin (You)' : (msg.user?.name || 'External Node')}
                                    </span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
                                    <span className="text-[9px] font-bold text-gray-300 uppercase font-sans">
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div className={`max-w-[85%] px-8 py-5 rounded-[2.5rem] text-[15px] font-semibold tracking-tight leading-relaxed shadow-sm transition-all duration-300 ${isMe ? 'bg-gray-900 text-brand-yellow rounded-tr-none hover:shadow-brand-yellow/10' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none hover:shadow-xl hover:shadow-black/5'}`}>
                                    {msg.message}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="p-10 bg-white border-t border-gray-100">
                    <div className="relative group">
                        <textarea
                            rows={3}
                            placeholder="Type your response..."
                            value={msgInput}
                            onChange={(e) => setMsgInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                            className="w-full bg-gray-50/80 border-2 border-gray-100 rounded-[2rem] px-8 py-6 text-base font-bold focus:outline-none focus:ring-8 focus:ring-brand-yellow/5 focus:border-brand-yellow/20 transition-all resize-none placeholder:text-gray-300 placeholder:italic"
                        />
                        <button
                            onClick={sendMessage}
                            disabled={sending || !msgInput.trim()}
                            className="absolute bottom-5 right-5 flex items-center gap-3 bg-gray-900 text-brand-yellow px-8 py-4 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 shadow-2xl shadow-black/20"
                        >
                            {sending ? (
                                <div className="w-4 h-4 border-2 border-brand-yellow border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    Transmit
                                    <Send className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default NotificationDetail;
