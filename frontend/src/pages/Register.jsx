import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, Briefcase, ArrowRight, ShieldCheck, Github } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
        professional_background: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await register(formData);
            if (response.requires_verification) {
                navigate('/enter-otp', { state: { email: response.email, message: response.message } });
            } else {
                alert('Account created successfully.');
                navigate('/');
            }
        } catch (error) {
            alert('Registration failed. Please check your information.');
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = async (provider) => {
        try {
            const response = await api.get(`/auth/${provider}/redirect`);
            window.location.href = response.data.url;
        } catch (error) {
            alert(`Failed to initialize ${provider} signup.`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 font-sans">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row"
            >
                {/* Left Branding */}
                <div className="bg-black p-10 md:w-5/12 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center mb-8 shadow-sm">
                            <ShieldCheck className="w-6 h-6 text-black" />
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight mb-4 leading-tight italic">Join the elite network.</h2>
                        <p className="text-gray-400 text-xs leading-relaxed font-medium uppercase tracking-wide">
                            Create your profile today and unlock strategic career opportunities within Droga Group.
                        </p>
                    </div>

                    <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Global Reach</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Smart Pairing</span>
                        </div>
                    </div>

                    {/* Subtle Decor */}
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-yellow-400 opacity-5 rounded-full blur-3xl"></div>
                </div>

                {/* Right Form */}
                <div className="p-8 sm:p-12 flex-1">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Create Account</h1>
                        <p className="text-gray-500 text-xs mt-1">Please fill in your details below</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider px-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                                    <input
                                        type="text" required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider px-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                                    <input
                                        type="email" required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider px-1">Phone</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                                    <input
                                        type="text"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all"
                                        placeholder="+251..."
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider px-1">Discipline</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                                    <select
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-8 py-3 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all appearance-none"
                                        value={formData.professional_background}
                                        onChange={e => setFormData({ ...formData, professional_background: e.target.value })}
                                    >
                                        <option value="">Select Category</option>
                                        <option value="IT">IT & Tech</option>
                                        <option value="Finance">Finance</option>
                                        <option value="Health">Healthcare</option>
                                        <option value="Eng">Engineering</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider px-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                                    <input
                                        type="password" required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider px-1">Confirm</label>
                                <div className="relative">
                                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                                    <input
                                        type="password" required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all"
                                        placeholder="••••••••"
                                        value={formData.password_confirmation}
                                        onChange={e => setFormData({ ...formData, password_confirmation: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-4 rounded-xl font-bold text-sm hover:bg-yellow-400 hover:text-black transition-all flex items-center justify-center gap-2 group mt-4 shadow-lg shadow-black/5"
                        >
                            {loading ? 'Creating Profile...' : 'Complete Registration'}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <div className="mt-8 flex items-center gap-4">
                        <div className="h-px bg-gray-100 flex-1"></div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Or register with</span>
                        <div className="h-px bg-gray-100 flex-1"></div>
                    </div>

                    <div className="flex justify-center gap-4 mt-8">
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

                    <div className="mt-8 pt-6 border-t border-gray-50 text-center">
                        <Link to="/login" className="text-xs font-bold text-gray-500 hover:text-black transition-colors uppercase tracking-widest">
                            Already registered? <span className="text-black border-b border-yellow-400 ml-1">Sign In</span>
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
