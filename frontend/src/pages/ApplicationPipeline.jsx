import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Filter, Search, MoreVertical, Edit2, Mail, Phone, Clock, User, Briefcase, Zap, ShieldAlert, X } from 'lucide-react';
import api from '../api/api';

const ApplicationPipeline = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState(null);

    const stages = [
        'submitted', 'written_test', 'interview_1', 'interview_2', 'offer', 'hired', 'rejected'
    ];

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const response = await api.get('/applications');
                setApplications(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchApps();
    }, []);

    const updateStatus = async (id, newStatus) => {
        try {
            await api.patch(`/applications/${id}/status`, { status: newStatus });
            setApplications(apps => apps.map(a => a.id === id ? { ...a, status: newStatus } : a));
            setSelectedApp(null);
        } catch (err) {
            alert('Status update failed.');
        }
    };

    return (
        <div className="min-h-screen bg-[#fcfcfc] text-gray-900 font-sans selection:bg-yellow-100">
            <header className="px-10 py-12 bg-white border-b border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Talent Pipeline</h1>
                    <p className="text-gray-400 font-bold uppercase text-[9px] tracking-[0.3em] mt-2 flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div> Global Acquisition Monitor
                    </p>
                </div>
                <div className="flex gap-4 w-full lg:w-auto">
                    <div className="relative flex-1 lg:w-72 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Find application..."
                            className="bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-4 py-3 w-full text-xs font-bold uppercase tracking-widest focus:bg-white transition-all focus:border-yellow-400"
                        />
                    </div>
                    <button className="bg-black text-white px-8 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition-all flex items-center gap-3">
                        <Filter className="w-4 h-4" /> Filter Matrix
                    </button>
                </div>
            </header>

            <div className="p-10 overflow-x-auto min-h-[calc(100vh-200px)]">
                <div className="flex gap-8 min-w-max pb-10">
                    {stages.map(stage => (
                        <div key={stage} className="w-80 flex-shrink-0">
                            <div className="flex items-center justify-between mb-6 px-5 py-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                                <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                                    {stage.replace('_', ' ')}
                                </h3>
                                <span className="text-[9px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md uppercase">
                                    {applications.filter(a => a.status === stage).length}
                                </span>
                            </div>

                            <div className="space-y-4">
                                {applications.filter(a => a.status === stage).map(app => (
                                    <motion.div
                                        key={app.id}
                                        layoutId={app.id}
                                        onClick={() => setSelectedApp(app)}
                                        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-yellow-400 transition-all cursor-pointer group relative"
                                    >
                                        <div className="flex justify-between items-start mb-5">
                                            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-900 font-bold text-sm border border-gray-100 group-hover:bg-yellow-400 transition-colors shadow-inner">
                                                {app.candidate.name.charAt(0)}
                                            </div>
                                            <ShieldAlert className="w-3.5 h-3.5 text-gray-200 group-hover:text-yellow-500 transition-colors" />
                                        </div>
                                        <h4 className="font-bold text-gray-900 uppercase tracking-tight text-lg mb-1 leading-tight">{app.candidate.name}</h4>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-6 truncate">
                                            {app.job_posting.requisition.title}
                                        </p>

                                        <div className="flex items-center justify-between text-[9px] font-bold text-gray-300">
                                            <span className="flex items-center gap-1.5 uppercase tracking-widest"><Clock className="w-3.5 h-3.5" /> {new Date(app.created_at).toLocaleDateString()}</span>
                                            {app.test_score && <span className="bg-black text-white px-2 py-0.5 rounded sm shadow-sm">Sc: {app.test_score}</span>}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Slide-over Detail Modal */}
            <AnimatePresence>
                {selectedApp && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-end">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedApp(null)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-[2px]"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="bg-white w-full max-w-xl h-full shadow-2xl relative z-10 p-12 overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-16">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-900 text-2xl font-bold shadow-inner">
                                        {selectedApp.candidate.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Node ID</p>
                                        <p className="font-bold text-sm">#TX-{selectedApp.id}</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedApp(null)} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 transition-all">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <h2 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight uppercase">{selectedApp.candidate.name}</h2>
                            <p className="text-yellow-600 font-bold mb-12 uppercase tracking-[0.3em] text-[10px]">{selectedApp.job_posting.requisition.title}</p>

                            <div className="grid grid-cols-2 gap-4 mb-16 underline-offset-8">
                                <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Digital Uplink</p>
                                    <p className="text-xs font-bold truncate text-gray-800"><Mail className="w-3.5 h-3.5 inline mr-2 text-yellow-600" /> {selectedApp.candidate.email}</p>
                                </div>
                                <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Interface</p>
                                    <p className="text-xs font-bold text-gray-800"><Phone className="w-3.5 h-3.5 inline mr-2 text-yellow-600" /> {selectedApp.candidate.phone || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="mb-16">
                                <h3 className="text-xs font-bold text-gray-400 mb-8 uppercase tracking-[0.2em] flex items-center gap-3">
                                    <Zap className="w-4 h-4 text-yellow-500" /> Status Modulation
                                </h3>
                                <div className="flex flex-wrap gap-2 text-gray-400 font-bold uppercase tracking-widest">
                                    {stages.map(s => (
                                        <button
                                            key={s}
                                            onClick={() => updateStatus(selectedApp.id, s)}
                                            className={`px-5 py-3 rounded-xl text-[9px] transition-all border ${selectedApp.status === s
                                                ? 'bg-black text-white border-black shadow-lg shadow-black/10'
                                                : 'bg-white border-gray-100 hover:border-yellow-400 hover:text-black'
                                                }`}
                                        >
                                            {s.replace('_', ' ')}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="p-8 bg-gray-900 rounded-3xl text-white relative overflow-hidden">
                                <h3 className="text-xs font-bold mb-4 uppercase tracking-widest text-yellow-500">Node Profile Abstract</h3>
                                <p className="text-gray-400 text-xs leading-relaxed font-medium uppercase tracking-wide">
                                    "{selectedApp.candidate.professional_background || 'Node background data packet not provided.'}"
                                </p>
                                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-yellow-400 opacity-5 rounded-full blur-3xl"></div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ApplicationPipeline;
