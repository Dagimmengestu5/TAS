import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Lock, ChevronRight, LogOut, Cpu, Zap, ArrowRight, ShieldCheck, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';

const UserProfile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        try {
            await api.post('/change-password', passwords);
            alert('Password updated successfully.');
            setPasswords({ current: '', new: '', confirm: '' });
        } catch (error) {
            alert('Failed to update password.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/30 font-sans text-gray-900 selection:bg-yellow-100 pb-40">
            {/* Header */}
            <nav className="p-6 max-w-7xl mx-auto flex justify-between items-center mb-12">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-yellow-400 font-bold">D</div>
                    <span className="text-sm font-bold tracking-tight text-black uppercase">Droga Hub</span>
                </div>
                <button
                    onClick={() => logout().then(() => navigate('/'))}
                    className="flex items-center gap-2 bg-white border border-gray-100 px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-black hover:border-yellow-400 transition-all shadow-sm"
                >
                    <LogOut className="w-4 h-4" /> Sign Out
                </button>
            </nav>

            <main className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* User Profile Card */}
                    <div className="lg:col-span-4 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm flex flex-col items-center text-center"
                        >
                            <div className="relative mb-6">
                                <div className="w-32 h-32 bg-gray-50 rounded-full border-4 border-white flex items-center justify-center text-black text-4xl font-bold shadow-inner">
                                    {user?.name?.charAt(0)}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-yellow-400 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                                    <ShieldCheck className="w-5 h-5 text-black" />
                                </div>
                            </div>

                            <h1 className="text-2xl font-bold tracking-tight mb-2 uppercase">{user?.name}</h1>
                            <div className="inline-flex items-center gap-2 bg-black text-yellow-400 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest mb-8">
                                <Activity className="w-3 h-3" /> Level: {user?.role?.name || 'Member'}
                            </div>

                            <div className="w-full space-y-4 pt-8 border-t border-gray-50 text-left">
                                <div>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email Identity</p>
                                    <p className="text-xs font-bold text-gray-800 break-all">{user?.email}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                                    <p className="flex items-center gap-2 text-[10px] font-bold text-green-600 uppercase">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> Synchronized
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        <div className="p-6 bg-gray-900 rounded-3xl text-white overflow-hidden relative group">
                            <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
                                <Cpu className="w-4 h-4 text-yellow-400" /> System Metrics
                            </h4>
                            <div className="space-y-3">
                                <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-gray-400">
                                    <span>Applications</span>
                                    <span className="text-white">Active</span>
                                </div>
                                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div className="w-2/3 h-full bg-yellow-400"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Settings Area */}
                    <div className="lg:col-span-8 space-y-8">
                        <motion.section
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-3xl border border-gray-100 p-8 md:p-12 shadow-sm"
                        >
                            <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3 uppercase tracking-tight">
                                <Lock className="w-5 h-5 text-yellow-500" /> Security Settings
                            </h3>

                            <form onSubmit={handlePasswordChange} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Current Password</label>
                                        <input
                                            type="password"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all"
                                            value={passwords.current}
                                            onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">New Password</label>
                                        <input
                                            type="password"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all"
                                            value={passwords.new}
                                            onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                                <button className="bg-black text-white px-8 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition-all shadow-lg shadow-black/5 flex items-center gap-2 group">
                                    Update Password <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </form>
                        </motion.section>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Link to="/jobs" className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm hover:border-yellow-400 transition-all group">
                                <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-yellow-400 transition-colors">
                                    <Zap className="w-5 h-5 text-yellow-600 group-hover:text-black" />
                                </div>
                                <h4 className="font-bold uppercase tracking-tight mb-2">My Applications</h4>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-loose">View status of all synchronization attempts.</p>
                            </Link>

                            <Link to="/" className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm hover:border-black transition-all group">
                                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-black transition-colors">
                                    <User className="w-5 h-5 text-gray-400 group-hover:text-white" />
                                </div>
                                <h4 className="font-bold uppercase tracking-tight mb-2">Personal Data</h4>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-loose">Manage your profile visibility settings.</p>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserProfile;
