import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, Briefcase, TrendingUp, TrendingDown, PieChart, Bell, Settings, LogOut, Cpu, Zap, Activity, ShieldCheck, ChevronRight } from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [metrics, setMetrics] = useState(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await api.get('/reports/metrics');
                setMetrics(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchMetrics();
    }, []);

    const handleLogout = async () => {
        navigate('/');
        await logout();
    };

    return (
        <div className="bg-white min-h-screen w-full px-8 py-8 lg:px-12 ">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Total Units', val: metrics?.total_applications || 0, change: '+12.4%', up: true, icon: Users },
                    { label: 'Active Nodes', val: metrics?.active_postings || 0, change: '+2', up: true, icon: Briefcase },
                    { label: 'Sync Efficiency', val: '94.2%', change: '+0.8%', up: true, icon: TrendingUp },
                    { label: 'Hired Assets', val: metrics?.hired_count || 0, change: '0.0%', up: true, icon: Zap },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden"
                    >
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-gray-900 transition-all duration-300 border border-gray-100">
                                <stat.icon className="w-4 h-4 text-gray-400 group-hover:text-brand-yellow transition-colors" />
                            </div>
                            <span className={`text-[9px] font-bold px-2 py-1 rounded-md border tracking-wider uppercase ${stat.up
                                ? 'bg-green-50 border-green-100 text-green-600'
                                : 'bg-red-50 border-red-100 text-red-600'
                                }`}>
                                {stat.change}
                            </span>
                        </div>
                        <p className="text-[9px] font-bold text-gray-400 group-hover:text-brand-yellow uppercase tracking-wider mb-1 transition-colors  leading-none">{stat.label}</p>
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight uppercase  leading-none">{stat.val}</h2>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="flex justify-between items-center mb-8 relative z-10">
                        <h3 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-3 uppercase ">
                            <div className="w-1.5 h-8 bg-brand-yellow rounded-full shadow-[0_0_10px_#FFF200]"></div> Pipeline Vector Hub
                        </h3>
                        <Link to="/admin/pipeline" className="group flex items-center gap-2.5 bg-gray-900 text-brand-yellow px-5 py-2.5 rounded-lg text-[9px] font-bold uppercase tracking-wider hover:bg-black transition-all shadow-md  border border-gray-800">
                            Examine Cluster <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    <div className="space-y-8 relative z-10">
                        {metrics?.status_breakdown?.map((s, i) => (
                            <div key={i} className="group/item cursor-default">
                                <div className="flex justify-between items-end mb-3 px-1">
                                    <span className="text-[11px] font-bold text-gray-900 uppercase tracking-wider ">{s.status.replace('_', ' ')}</span>
                                    <div className="flex items-center gap-2.5">
                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{s.count} Units active</span>
                                        <span className="text-[9px] font-bold text-gray-900 bg-brand-yellow px-1.5 py-0.5 rounded shadow-sm  leading-none">{Math.round((s.count / metrics.total_applications) * 100)}%</span>
                                    </div>
                                </div>
                                <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-50 shadow-inner">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(s.count / metrics.total_applications) * 100}%` }}
                                        transition={{ duration: 1, ease: 'easeOut' }}
                                        className="h-full bg-gray-900 group-hover/item:bg-brand-yellow rounded-full transition-all"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-gray-900 text-white p-8 rounded-3xl shadow-lg relative overflow-hidden flex flex-col justify-between border border-gray-800 min-h-[400px] group/card">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-[60px] -mr-20 -mt-20"></div>

                        <div className="relative z-10">
                            <h3 className="text-lg font-bold tracking-tight mb-8 flex items-center gap-3 uppercase text-brand-yellow ">
                                <Cpu className="w-5 h-5" /> Node Integrity Trace
                            </h3>
                            <div className="space-y-6">
                                {[
                                    { label: 'Ecosystem Core', status: 'Optimal', health: 100 },
                                    { label: 'Transmission Grid', status: 'Synchronized', health: 98 },
                                    { label: 'Security Protocols', status: 'Encrypted', health: 100 }
                                ].map((s, i) => (
                                    <div key={i} className="flex flex-col gap-2 group/item">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider ">{s.label}</span>
                                            <span className="text-[9px] font-bold text-brand-yellow flex items-center gap-2 uppercase tracking-wider  leading-none">
                                                <span className="w-1.5 h-1.5 bg-brand-yellow rounded-full animate-pulse shadow-[0_0_8px_#FFF200]"></span> {s.status}
                                            </span>
                                        </div>
                                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-brand-yellow/10 w-full group-hover/item:bg-brand-yellow/20 transition-all duration-500"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8 bg-white/5 rounded-xl p-6 border border-white/5 flex items-center gap-5 relative z-10 hover:bg-white/10 transition-all shadow-lg">
                            <div className="w-11 h-11 bg-brand-yellow/10 rounded-xl flex items-center justify-center border border-brand-yellow/20 group-hover/card:bg-brand-yellow group-hover/card:text-gray-900 transition-all shadow-md">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-[12px] font-bold uppercase tracking-wider text-white  leading-none">Protocol Secure</p>
                                <p className="text-[9px] font-bold uppercase tracking-wider text-gray-500  mt-1 leading-none">Authorization Hub active</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-brand-yellow p-8 rounded-3xl shadow-md group cursor-pointer hover:scale-[1.01] transition-all border border-brand-yellow relative overflow-hidden">
                        <div className="flex justify-between items-center mb-4 relative z-10">
                            <TrendingUp className="w-8 h-8 text-black/20 group-hover:text-black transition-all group-hover:rotate-6" />
                            <span className="text-[9px] font-bold uppercase tracking-wider bg-black/10 px-3 py-1.5 rounded-lg  text-black">Live Pulse</span>
                        </div>
                        <h4 className="text-xl font-bold text-black uppercase tracking-tight leading-[0.85] mb-3 relative z-10 ">Optimization Module</h4>
                        <p className="text-black/70 text-[10px] font-bold uppercase tracking-wider  leading-relaxed relative z-10">Global ecosystem synchronization active at optimum capacity thresholds.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
