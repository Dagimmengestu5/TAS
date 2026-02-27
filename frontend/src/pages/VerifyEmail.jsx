import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, ArrowRight, Mail } from 'lucide-react';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verify = async () => {
            const verificationUrl = searchParams.get('url');

            if (!verificationUrl) {
                setStatus('error');
                setMessage('Invalid verification link.');
                return;
            }

            try {
                // We useaxios directly or our api instance. 
                // Since the URL is already fully qualified and signed, we call it.
                const response = await axios.get(verificationUrl, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setStatus('success');
                setMessage(response.data.message || 'Email verified successfully!');
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'Verification failed. The link may have expired.');
            }
        };

        verify();
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-black/5 border border-gray-100 p-10 text-center"
            >
                {status === 'verifying' && (
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Verifying Node</h1>
                        <p className="text-sm text-gray-400 font-medium leading-relaxed uppercase tracking-widest text-[10px]">
                            Synchronizing your email identity with the Droga OS core...
                        </p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Uplink Active</h1>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed italic">
                            {message}
                        </p>
                        <Link
                            to="/profile"
                            className="mt-4 w-full bg-black text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition-all flex items-center justify-center gap-2 group"
                        >
                            Return to Profile <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center">
                            <XCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Sync Failed</h1>
                        <p className="text-sm text-red-500/70 font-medium leading-relaxed italic">
                            {message}
                        </p>
                        <div className="w-full flex flex-col gap-3 mt-4">
                            <Link
                                to="/profile"
                                className="w-full bg-gray-50 text-gray-500 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all"
                            >
                                Back to Profile
                            </Link>
                            <Link
                                to="/login"
                                className="w-full bg-black text-white py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition-all shadow-lg shadow-black/5"
                            >
                                Re-authenticate
                            </Link>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default VerifyEmail;
