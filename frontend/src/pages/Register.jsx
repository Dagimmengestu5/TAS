import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, Briefcase, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
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
            // FIX: Use register from AuthContext for consistency
            await register(formData);
            alert('Account created successfully.');
            navigate('/');
        } catch (error) {
            alert('Registration failed. Please check your information.');
        } finally {
            setLoading(false);
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
                            className="w-full bg-black text-white py-4 rounded-xl font-bold text-sm hover:bg-yellow-400 hover:text-black transition-all flex items-center justify-center gap-2 group mt-4"
                        >
                            {loading ? 'Creating Profile...' : 'Complete Registration'}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

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
