import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Shield, Github, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
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
            if (error.response?.data?.requires_verification) {
                // Redirect to OTP page passing their email
                navigate('/enter-otp', { state: { email: error.response.data.email, message: error.response.data.message } });
            } else if (error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                alert('Login failed. Please check your credentials.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = async (provider) => {
        try {
            const response = await api.get(`/auth/${provider}/redirect`);
            window.location.href = response.data.url;
        } catch (error) {
            alert(`Failed to initialize ${provider} login.`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 font-sans">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
                <div className="p-5 sm:p-6">
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-9 h-9 bg-yellow-400 rounded-xl flex items-center justify-center mb-2 shadow-sm">
                            <Shield className="w-6 h-6 text-black" />
                        </div>
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Welcome back</h1>
                        <p className="text-gray-500 text-[10px] mt-0.5 uppercase tracking-widest font-bold">Sign in to your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
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
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-12 py-3.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all placeholder:text-gray-400"
                                    placeholder="••••••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
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

                    <div className="mt-6 flex items-center gap-4">
                        <div className="h-px bg-gray-100 flex-1"></div>
                        <span className="text-[9px] uppercase font-bold text-gray-400 tracking-widest">Or continue with</span>
                        <div className="h-px bg-gray-100 flex-1"></div>
                    </div>

                    <div className="flex justify-center gap-4 mt-6">
                        <button
                            onClick={() => handleSocialLogin('google')}
                            className="flex items-center justify-center w-14 h-14 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 hover:shadow-md transition-all shadow-sm group"
                            title="Continue with Google"
                        >
                            <svg className="w-6 h-6 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                <path d="M1 1h22v22H1z" fill="none" />
                            </svg>
                        </button>
                        <button
                            onClick={() => handleSocialLogin('github')}
                            className="flex items-center justify-center w-14 h-14 bg-[#24292e] text-white border border-[#24292e] rounded-2xl hover:bg-[#1a1e22] hover:shadow-md transition-all shadow-sm group"
                            title="Continue with GitHub"
                        >
                            <Github className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        </button>
                    </div>

                    <div className="mt-6 pt-5 border-t border-gray-50 text-center">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                            Don't have an account?{' '}
                            <Link
                                to="/register"
                                className="text-black border-b border-yellow-400 hover:text-yellow-600 transition-colors"
                            >
                                Create an account
                            </Link>
                        </span>
                    </div>
                </div>

            </motion.div>
        </div>
    );
};

export default Login;
