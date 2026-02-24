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
        await logout();
        navigate('/');
    };

    return (
        <div className="flex min-h-screen bg-[#fcfcfc] font-sans text-gray-900 selection:bg-yellow-100">
            {/* Sidebar */}
            <aside className="w-72 bg-white flex flex-col fixed inset-y-0 border-r border-gray-100 shadow-sm z-50">
                <div className="p-8 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center text-yellow-400 font-bold shadow-sm">D</div>
                        <div className="flex flex-col">
                            <span className="font-bold text-sm tracking-tight uppercase">Droga OS</span>
                            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-tight">Admin Console</span>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    {[
                        { icon: <LayoutDashboard className="w-4 h-4" />, label: 'Overview', active: true, path: '/admin' },
                        { icon: <Briefcase className="w-4 h-4" />, label: 'Job Matrix', path: '/jobs' },
                        { icon: <Users className="w-4 h-4" />, label: 'Candidates', path: '/admin/pipeline' },
                        { icon: <PieChart className="w-4 h-4" />, label: 'Analytics', path: '/admin/reports' },
                    ].map((item, i) => (
                        <Link to={item.path} key={i} className={`flex items-center justify-between px-5 py-3 rounded-xl transition-all group ${item.active ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/10' : 'text-gray-400 hover:text-black hover:bg-gray-50'
                            }`}>
                            <div className="flex items-center gap-3">
                                {item.icon} <span className="uppercase tracking-widest text-[10px] font-bold">{item.label}</span>
                            </div>
                            {item.active && <ChevronRight className="w-3 h-3" />}
                        </Link>
                    ))}
                </nav>

                <div className="p-6">
                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                        <p className="text-[8px] font-bold uppercase tracking-widest text-gray-400 mb-1">Authenticated</p>
                        <p className="font-bold text-[11px] truncate mb-4 uppercase">{user?.name}</p>
                        <button onClick={handleLogout} className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
                            <LogOut className="w-3.5 h-3.5" /> Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-72 p-10 md:p-14">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Command Center</h1>
                        <p className="text-gray-400 font-bold uppercase text-[9px] tracking-[0.3em] mt-2 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> System Pulse: Stable
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-black hover:border-yellow-400 transition-all shadow-sm">
                            <Bell className="w-5 h-5" />
                        </button>
                        <button className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-black hover:border-yellow-400 transition-all shadow-sm">
                            <Settings className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Applications', val: metrics?.total_applications || 0, change: '+12%', up: true },
                        { label: 'Live Roles', val: metrics?.active_postings || 0, change: '+2', up: true },
                        { label: 'Placement Rate', val: '88%', change: '+0.5%', up: true },
                        { label: 'Hired Units', val: metrics?.hired_count || 0, change: '0', up: true },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">{stat.label}</p>
                            <div className="flex items-end justify-between">
                                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{stat.val}</h2>
                                <span className={`text-[8px] font-bold px-2 py-1 rounded-md ${stat.up ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600'
                                    }`}>
                                    {stat.change}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-3 uppercase">
                                <Activity className="w-5 h-5 text-yellow-500" /> Pipeline Status
                            </h3>
                            <button className="text-[10px] font-bold text-yellow-600 hover:text-black uppercase tracking-widest border-b border-yellow-200 pb-0.5">Full Details</button>
                        </div>
                        <div className="space-y-8">
                            {metrics?.status_breakdown?.map((s, i) => (
                                <div key={i} className="group">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wide">{s.status.replace('_', ' ')}</span>
                                        <span className="text-[9px] font-bold text-gray-300 uppercase">{s.count} Node{s.count !== 1 ? 's' : ''}</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(s.count / metrics.total_applications) * 100}%` }}
                                            className="h-full bg-black rounded-full transition-all"
                                        ></motion.div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-4 bg-gray-900 text-white p-8 rounded-3xl shadow-xl shadow-black/10 flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-bold tracking-tight mb-6 flex items-center gap-3 uppercase text-yellow-400">
                                <Cpu className="w-5 h-5" /> Node Health
                            </h3>
                            <div className="space-y-5">
                                {[
                                    { label: 'API Gateway', status: 'Stable' },
                                    { label: 'Talent Engine', status: 'Active' },
                                    { label: 'Storage Node', status: 'Synced' }
                                ].map((s, i) => (
                                    <div key={i} className="flex items-center justify-between border-b border-white/5 pb-3">
                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{s.label}</span>
                                        <span className="text-[9px] font-bold text-yellow-400 flex items-center gap-1.5 uppercase tracking-wide">
                                            <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div> {s.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-12 bg-white/5 rounded-2xl p-5 border border-white/10">
                            <ShieldCheck className="w-8 h-8 text-white/20 mb-3" />
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Security Clearance: Approved</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
