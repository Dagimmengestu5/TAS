import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, ArrowLeft, Clock, ShieldCheck, Mail, Info, AlertTriangle } from 'lucide-react';
import api from '../api/api';

const NotificationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNotification = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/notifications/${id}`);
                setNotification(response.data.notification);
            } catch (err) {
                console.error('Failed to fetch notification:', err);
                setError('Could not load message details.');
            } finally {
                setLoading(false);
            }
        };
        fetchNotification();
    }, [id]);

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

    return (
        <div className="min-h-screen bg-gray-50/30 p-6 lg:p-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto"
            >
                {/* Header Actions */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-gray-900 font-bold text-sm mb-8 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </button>

                {/* Content Card */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden shadow-gray-200/50">
                    <div className="p-8 lg:p-12">
                        {/* Type Icon */}
                        <div className="flex justify-between items-start mb-10">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${type === 'approval' ? 'bg-green-500 text-white shadow-green-200' :
                                    type === 'rejection' ? 'bg-red-500 text-white shadow-red-200' :
                                        'bg-brand-yellow text-gray-900 shadow-yellow-100'
                                }`}>
                                <Bell className="w-6 h-6" />
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Received</p>
                                <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
                                    <Clock className="w-4 h-4 text-gray-300" />
                                    {new Date(notification.created_at).toLocaleString()}
                                </div>
                            </div>
                        </div>

                        {/* Text Content */}
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                            {title || 'System Alert'}
                        </h1>

                        <div className="prose prose-gray max-w-none">
                            <p className="text-lg text-gray-600 leading-relaxed font-medium">
                                {message}
                            </p>
                        </div>

                        {/* Footer Info */}
                        <div className="mt-12 pt-10 border-t border-gray-50 flex flex-wrap gap-4">
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
        </div>
    );
};

export default NotificationDetail;
