import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Shield, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/password/email', { email });
            setSubmitted(true);
        } catch (err) {
            const backendError = err.response?.data?.email?.[0] || err.response?.data?.message;
            setError(backendError || 'Failed to send reset link. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 font-sans">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
                <div className="p-8 sm:p-10">
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                            <Shield className="w-6 h-6 text-black" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight text-center">Reset Password</h1>
                        <p className="text-gray-500 text-sm mt-1 text-center">We'll send a recovery link to your email</p>
                    </div>

                    {submitted ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-6"
                        >
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-8 h-8 text-green-500" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Check your email</h2>
                            <p className="text-sm text-gray-500 mb-8 max-w-[240px] mx-auto">
                                If an account exists for {email}, you will receive a password reset link shortly.
                            </p>
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 text-sm font-bold text-black border-b border-yellow-400 hover:text-yellow-600 transition-colors"
                            >
                                Back to Login
                            </Link>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 bg-red-50 rounded-xl text-red-600 text-xs font-bold uppercase tracking-wider">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider ml-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all placeholder:text-gray-400"
                                        placeholder="name@company.com"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white py-4 rounded-xl font-bold text-sm hover:bg-yellow-400 hover:text-black transition-all flex items-center justify-center gap-2 group shadow-lg shadow-black/5"
                            >
                                {loading ? 'Sending Request...' : 'Send Reset Link'}
                                {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                            </button>

                            <div className="text-center">
                                <Link to="/login" className="text-xs font-bold text-gray-500 hover:text-black transition-colors uppercase tracking-widest">
                                    I remember my password
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
