import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Shield, Key, Camera, LayoutGrid, Activity, History, ChevronRight, Zap, Target, Lock, Globe, ShieldCheck, Clock, CheckCircle, MessageSquare, Briefcase, LogOut, Bell, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

const UserProfile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [applications, setApplications] = useState([]);
    const [loadingApps, setLoadingApps] = useState(false);

    useEffect(() => {
        if (activeTab === 'applications') {
            const fetchUserApps = async () => {
                setLoadingApps(true);
                try {
                    const response = await api.get('/applications?scope=self');
                    setApplications(Array.isArray(response.data) ? response.data : []);
                } catch (err) {
                    console.error('Error fetching user apps:', err);
                } finally {
                    setLoadingApps(false);
                }
            };
            fetchUserApps();
        }
    }, [activeTab]);

    return (
        <div className="bg-white min-h-screen w-full selection:bg-brand-yellow/30 px-6 py-6 lg:px-8 ">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Profile Identity Block - Compacted */}
                <div className="lg:w-1/3 flex flex-col gap-6">
                    <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm relative overflow-hidden group/header">
                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="relative group/avatar mb-4">
                                <div className="w-24 h-24 bg-gray-900 rounded-2xl flex items-center justify-center text-brand-yellow text-3xl font-bold shadow-lg border-2 border-white transition-all duration-500 relative overflow-hidden">
                                    {user?.name?.charAt(0)}
                                </div>
                                <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-brand-yellow rounded-lg flex items-center justify-center shadow-lg border-2 border-white hover:scale-110 transition-all active:scale-95">
                                    <Camera className="w-4 h-4 text-black" />
                                </button>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight  mb-1 leading-none">{user?.name}</h1>
                            <span className="bg-gray-900 text-brand-yellow px-3 py-1 rounded text-[8px] font-bold uppercase tracking-wider  mb-4">Master Node: {user?.role?.name}</span>

                            {/* Navigation Tabs */}
                            <div className="flex bg-gray-50 p-1.5 rounded-2xl w-full mt-4 border border-gray-100 shadow-inner">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`flex-1 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all ${activeTab === 'profile' ? 'bg-white text-gray-900 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    Identity Profile
                                </button>
                                <button
                                    onClick={() => setActiveTab('applications')}
                                    className={`flex-1 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all ${activeTab === 'applications' ? 'bg-white text-gray-900 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    Active Signals
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden group/card border border-gray-800">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <h3 className="text-lg font-bold flex items-center gap-3 text-brand-yellow uppercase tracking-tight mb-8  relative z-10">
                            <ShieldCheck className="w-5 h-5" /> Security Layer
                        </h3>
                        <div className="space-y-6 relative z-10">
                            {[
                                { label: 'Clearance', value: 'Level 4 Secured', icon: Lock },
                                { label: 'Protocol', value: 'SHA-512 Sync', icon: Globe },
                                { label: 'Sync', value: 'Realtime Trace', icon: Activity }
                            ].map((stat, i) => (
                                <div key={i} className="flex flex-col gap-2 group/stat">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[8px] font-bold text-gray-500 uppercase tracking-wider ">{stat.label}</span>
                                        <stat.icon className="w-3.5 h-3.5 text-brand-yellow/40 transition-colors" />
                                    </div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-white  group-hover:text-brand-yellow transition-colors leading-none">{stat.value}</p>
                                    <div className="h-0.5 bg-white/5 rounded-full mt-1">
                                        <div className="h-full bg-brand-yellow/10 w-full group-hover:bg-brand-yellow/20 transition-all"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:w-2/3">
                    <AnimatePresence mode="wait">
                        {activeTab === 'profile' ? (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm relative overflow-hidden group/main"
                            >
                                <div className="flex items-center justify-between mb-10">
                                    <div className="flex items-center gap-3">
                                        <Target className="w-5 h-5 text-brand-yellow" />
                                        <h2 className="text-xl font-bold text-gray-900 tracking-tight uppercase ">Identity Matrix</h2>
                                    </div>
                                    <button
                                        onClick={() => navigate('/')}
                                        className="flex items-center gap-2 bg-gray-900 text-brand-yellow px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:scale-105 transition-all shadow-md active:scale-95 border border-gray-800 "
                                    >
                                        <Zap className="w-3.5 h-3.5" /> Back to Home
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        { icon: User, label: 'Node Identifier', val: user?.name, desc: 'Primary identity string.' },
                                        { icon: Mail, label: 'Gateway uplink', val: user?.email, desc: 'Primary transmission uplink.' },
                                        ...(user?.role?.name !== 'candidate' ? [
                                            { icon: Globe, label: 'Operational Hub', val: user?.company?.name || 'Generic Central', desc: 'Assigned corporate node.' },
                                            { icon: LayoutGrid, label: 'Unit Node', val: user?.department?.name || 'General Operations', desc: 'Primary structural unit.' }
                                        ] : []),
                                        { icon: Shield, label: 'Access Protocol', val: user?.role?.name, desc: 'Authorization vector clearance.' }
                                    ].map((item, i) => (
                                        <div key={i} className="group/item cursor-default">
                                            <div className="flex items-center gap-3.5 mb-5">
                                                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-300 border border-gray-50 group-hover/item:bg-gray-900 group-hover/item:text-brand-yellow transition-all shadow-inner">
                                                    <item.icon className="w-5 h-5" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-bold text-brand-yellow uppercase tracking-wider leading-none  mb-1.5 inline-block">{item.label}</span>
                                                    <span className="text-base font-bold text-gray-900 uppercase tracking-tight group-hover/item:text-brand-yellow transition-colors leading-none ">{item.val}</span>
                                                </div>
                                            </div>
                                            <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-50 group-hover/item:bg-white group-hover/item:border-brand-yellow/10 group-hover/item:shadow-md transition-all">
                                                <p className="text-[10px] font-bold text-gray-500 group-hover/item:text-gray-900 transition-colors uppercase tracking-wider leading-relaxed ">
                                                    {item.desc}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-12 pt-8 border-t border-gray-50 flex flex-col md:flex-row gap-4">
                                    <button className="flex-1 bg-gray-900 text-brand-yellow py-4 rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-black transition-all flex items-center justify-center gap-3 shadow-lg border border-gray-800 group/mod active:scale-95 ">
                                        Modulate Identity <Key className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigate('/');
                                            setTimeout(() => logout(), 0);
                                        }}
                                        className="flex-1 bg-white text-red-500 py-4 rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-red-50 transition-all flex items-center justify-center gap-3 shadow-sm border border-gray-100 group/logout active:scale-95 "
                                    >
                                        Sign Out <LogOut className="w-3.5 h-3.5 group-hover/logout:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="applications"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                                    <div className="flex items-center gap-3 mb-8">
                                        <Activity className="w-5 h-5 text-brand-yellow" />
                                        <h2 className="text-xl font-bold text-gray-900 tracking-tight uppercase ">Active Signal Progress</h2>
                                    </div>

                                    {loadingApps ? (
                                        <div className="py-20 flex flex-col items-center gap-4">
                                            <div className="w-10 h-10 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin"></div>
                                            <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 ">Decrypting Cluster...</span>
                                        </div>
                                    ) : applications.length === 0 ? (
                                        <div className="py-20 border-2 border-gray-50 border-dashed rounded-[2rem] flex flex-col items-center justify-center opacity-40 select-none bg-gray-50/30">
                                            <Zap className="w-8 h-8 text-gray-300 mb-4" />
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ">nothing yet applied</span>
                                        </div>
                                    ) : (
                                        <div className="space-y-8">
                                            {applications.map((app) => (
                                                <div key={app.id} className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border-l-8 border-l-brand-yellow group">
                                                    <div className="p-8">
                                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                                                            <div className="flex items-center gap-6">
                                                                <div className="w-14 h-14 bg-gray-900 rounded-[1.25rem] flex items-center justify-center text-brand-yellow font-bold shadow-2xl border border-gray-800 transition-transform group-hover:scale-110">
                                                                    <Briefcase className="w-6 h-6" />
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-[10px] font-bold text-brand-yellow bg-gray-900 px-3 py-1 rounded-lg uppercase tracking-wider mb-1.5 inline-block  w-fit shadow-md">Protocol Node</span>
                                                                    <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tight  leading-none">{app.job_posting?.requisition?.title || 'Unknown Position'}</h3>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col items-start md:items-end">
                                                                <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wider mb-1.5 ">Current Phase Modulation</span>
                                                                <div className="bg-brand-yellow text-black px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-brand-yellow/10 border border-brand-yellow ">
                                                                    {app.status.replace('_', ' ')}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Step-by-Step Progress Visualization */}
                                                        <div className="relative mb-12 px-2">
                                                            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-50 -translate-y-1/2 rounded-full"></div>
                                                            <div className="flex justify-between relative z-10">
                                                                {['submitted', 'written_test', 'interview_1', 'interview_2', 'offer', 'hired'].map((s, i) => {
                                                                    const statusOrder = ['submitted', 'written_test', 'interview_1', 'interview_2', 'offer', 'rejected', 'hired'];
                                                                    const currentIdx = statusOrder.indexOf(app.status.toLowerCase());
                                                                    const thisIdx = statusOrder.indexOf(s);
                                                                    const isCompleted = thisIdx <= currentIdx && app.status !== 'rejected';
                                                                    const isRejected = app.status === 'rejected';

                                                                    return (
                                                                        <div key={s} className="flex flex-col items-center gap-3">
                                                                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border-4 border-white shadow-md transition-all duration-500 ${isCompleted ? 'bg-brand-yellow text-black scale-110' : 'bg-gray-100 text-gray-300'
                                                                                }`}>
                                                                                {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                                                            </div>
                                                                            <span className={`text-[8px] font-bold uppercase tracking-wider  ${isCompleted ? 'text-gray-900' : 'text-gray-300'}`}>{s.replace('_', ' ')}</span>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>

                                                        {/* Audit History Logs */}
                                                        <div className="bg-gray-50/50 rounded-[2rem] p-8 border border-gray-100">
                                                            <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-8  flex items-center gap-4">
                                                                <History className="w-4 h-4 text-brand-yellow" /> TEMPORAL AUDIT TRAIL
                                                            </h4>
                                                            <div className="space-y-8 border-l-2 border-brand-yellow/30 pl-8">
                                                                {app.histories?.map((h, i) => (
                                                                    <div key={i} className="relative group/log">
                                                                        <div className="absolute -left-[41px] top-1 w-4 h-4 bg-white border-2 border-brand-yellow rounded-full shadow-md group-hover/log:scale-125 transition-transform"></div>
                                                                        <div className="flex items-center justify-between mb-2">
                                                                            <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wider">{new Date(h.created_at).toLocaleString()}</span>
                                                                            <span className="text-[9px] font-bold text-gray-900 uppercase tracking-wider  bg-white px-2 py-0.5 rounded shadow-sm border border-gray-100">Vetted by: {h.user?.name || 'System Core'}</span>
                                                                        </div>
                                                                        <div className="flex flex-col gap-1.5">
                                                                            <span className="text-[10px] font-bold text-brand-yellow uppercase  tracking-wider ">{h.status?.replace('_', ' ')} phase transition:</span>
                                                                            <p className="text-[13px] font-medium text-gray-800 tracking-tight leading-relaxed ">"{h.feedback || 'Access Protocol Synchronized.'}"</p>
                                                                            {h.document_path && (
                                                                                <a
                                                                                    href={`${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:8003'}/storage/${h.document_path}`}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="mt-3 w-fit inline-flex items-center gap-2 text-[9px] font-bold text-white bg-gray-900 hover:bg-black px-4 py-2 rounded-xl border border-gray-800 transition-colors shadow-lg shadow-black/5"
                                                                                >
                                                                                    <Download className="w-3.5 h-3.5 text-brand-yellow" /> Download Offer Document
                                                                                </a>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
