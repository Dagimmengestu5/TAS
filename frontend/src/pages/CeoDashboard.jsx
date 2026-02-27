import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Building2, User, Download, FileText, LayoutDashboard, Clock } from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const CeoDashboard = () => {
    const { user } = useAuth();
    const [requisitions, setRequisitions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequisitions = async () => {
        setLoading(true);
        try {
            const res = await api.get('/approvals/ceo/requisitions');
            setRequisitions(res.data);
            console.log("CEO Requisitions Loaded:", res.data);
        } catch (err) {
            console.error("Failed to load CEO requisitions", err);
            alert("Failed to sync pipeline data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequisitions();
    }, []);

    const getStorageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const baseUrl = import.meta.env.VITE_API_URL
            ? import.meta.env.VITE_API_URL.replace('/api', '')
            : `http://${window.location.hostname}:8003`;
        return `${baseUrl}/storage/${path}`;
    };

    const handleAction = async (id, action) => {
        try {
            await api.patch(`/approvals/ceo/requisitions/${id}/${action}`);
            alert(`Requisition ${action}d successfully`);
            fetchRequisitions();
        } catch (error) {
            alert(`Failed to ${action} requisition`);
            console.error(error);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen w-full selection:bg-brand-yellow/30 px-6 py-8 lg:px-12 font-['Outfit']">

            <div className="mb-12 flex justify-between items-end">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center shadow-lg">
                            <LayoutDashboard className="w-5 h-5 text-brand-yellow" />
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">CEO Decision Matrix</h1>
                    </div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.3em] italic ml-14">
                        Pending Requisitions • Final Executive Authorization
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-brand-yellow rounded-full animate-spin mb-6 shadow-xl shadow-brand-yellow/10"></div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse italic">Synchronizing Secure Pipeline...</p>
                </div>
            ) : requisitions.length === 0 ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-32 bg-white rounded-3xl border border-gray-100 flex flex-col items-center shadow-sm">
                    <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-green-100">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h2 className="text-3xl font-black mb-3 tracking-tight uppercase text-gray-900 italic leading-none">Queue Cleared</h2>
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest italic px-6 max-w-md">There are no pending job requisitions requiring executive authorization at this time.</p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
                    <AnimatePresence>
                        {requisitions.map((req) => (
                            <motion.div
                                key={req.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden relative flex flex-col"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>

                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center group-hover:bg-gray-900 transition-all duration-300">
                                        <Building2 className="w-5 h-5 text-gray-400 group-hover:text-brand-yellow" />
                                    </div>
                                    <div className="flex flex-col items-end gap-1.5">
                                        <span className="px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border border-blue-200 bg-blue-50 text-blue-600 italic flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> PENDING CEO
                                        </span>
                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest italic">{new Date(req.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="mb-6 flex-1">
                                    <h3 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-tight italic leading-tight">{req.title}</h3>
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="px-2.5 py-1 bg-gray-900 text-brand-yellow rounded text-[9px] font-black uppercase tracking-widest italic">{req.department?.name || 'ORG'}</span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{req.company?.name || 'HQ'}</span>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 mb-6">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Requested By</label>
                                        <div className="flex items-center gap-2 text-gray-900 font-bold italic text-sm">
                                            <div className="w-6 h-6 rounded-full bg-brand-yellow flex items-center justify-center text-[10px] text-black"><User className="w-3 h-3" /></div>
                                            {req.user?.name || 'System Generated'}
                                        </div>
                                    </div>

                                    <div className="text-sm text-gray-600 italic line-clamp-3 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">{req.description}</div>
                                </div>

                                {req.jd_path && (
                                    <a href={getStorageUrl(req.jd_path)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-2xl hover:border-brand-yellow hover:bg-white transition-all group/doc mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-100"><FileText className="w-4 h-4 text-gray-400 group-hover/doc:text-black" /></div>
                                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest italic group-hover/doc:text-gray-900">Job Description</span>
                                        </div>
                                        <Download className="w-4 h-4 text-gray-400 group-hover/doc:text-brand-yellow" />
                                    </a>
                                )}

                                <div className="flex gap-3 pt-6 border-t border-gray-100 mt-auto">
                                    <button onClick={() => handleAction(req.id, 'approve')} className="flex-1 bg-gray-900 text-brand-yellow py-4 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-brand-yellow hover:text-black transition-all flex items-center justify-center gap-2 italic">
                                        Final Approval <CheckCircle className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleAction(req.id, 'reject')} className="w-16 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all">
                                        <XCircle className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default CeoDashboard;
