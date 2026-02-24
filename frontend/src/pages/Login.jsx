import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Shield } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // FIX: Pass credentials as an object to match AuthContext
            await login({ email, password });
            const returnUrl = new URLSearchParams(location.search).get('returnUrl') || '/';
            navigate(returnUrl);
        } catch (error) {
            alert('Login failed. Please check your credentials.');
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
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome back</h1>
                        <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
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

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Password
                                </label>
                                <Link to="/forgot-password" size="sm" className="text-xs font-semibold text-yellow-600 hover:text-yellow-700 transition-colors">
                                    Forgot?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all placeholder:text-gray-400"
                                    placeholder="••••••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-4 rounded-xl font-bold text-sm hover:bg-yellow-400 hover:text-black transition-all flex items-center justify-center gap-2 group shadow-lg shadow-black/5"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                            {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-gray-50 flex flex-col items-center gap-2">
                        <p className="text-sm text-gray-500">Don't have an account?</p>
                        <Link
                            to="/register"
                            className="text-sm font-bold text-black border-b border-yellow-400 hover:text-yellow-600 transition-colors"
                        >
                            Create an account
                        </Link>
                    </div>
                </div>

            </motion.div>
        </div>
    );
};

export default Login;
