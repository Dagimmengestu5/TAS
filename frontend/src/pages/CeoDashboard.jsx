import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Building2, User, Download, FileText, LayoutDashboard, Clock, Eye, AlertCircle, MapPin, Tag, Briefcase, ArrowRight } from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const CeoDashboard = () => {
    const { user } = useAuth();
    const [requisitions, setRequisitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReq, setSelectedReq] = useState(null);

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
            setSelectedReq(null);
            fetchRequisitions();
        } catch (error) {
            alert(`Failed to ${action} requisition`);
            console.error(error);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen w-full selection:bg-brand-yellow/30 px-6 py-6 lg:px-10 ">

            <div className="mb-12 flex justify-between items-end">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center shadow-lg">
                            <LayoutDashboard className="w-4 h-4 text-brand-yellow" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 uppercase   leading-none ">Final Approvals</h1>
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider  ml-12">
                        Pending Requests • Final Authorization
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-brand-yellow rounded-full animate-spin mb-6 shadow-xl shadow-brand-yellow/10"></div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider animate-pulse ">Loading Requests...</p>
                </div>
            ) : requisitions.length === 0 ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-32 bg-white rounded-3xl border border-gray-100 flex flex-col items-center shadow-sm">
                    <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-green-100">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h2 className="text-3xl font-bold mb-3 tracking-tight uppercase text-gray-900  leading-none">No Requests</h2>
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-wider  px-6 max-w-md">There are no pending requests requiring final authorization at this time.</p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
                    <AnimatePresence>
                        {requisitions.map((req) => (
                            <motion.div
                                key={req.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-xl transition-all duration-300 group overflow-hidden relative flex flex-col"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-400"></div>

                                {/* Compact Header */}
                                <div className="p-5 pb-0 flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-2 py-0.5 bg-gray-900 text-brand-yellow rounded text-[9px] font-bold uppercase tracking-wider">{req.department?.name || 'ORG'}</span>
                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider truncate max-w-[100px]">{req.company?.name || 'HQ'}</span>
                                        </div>
                                        <h3 className="text-base font-bold text-gray-900 leading-tight uppercase tracking-tight">{req.title}</h3>
                                    </div>
                                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                                        <span className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider border flex items-center gap-1 ${req.status === 'pending_ceo' ? 'border-blue-200 bg-blue-50 text-blue-600' :
                                            req.status === 'approved' ? 'border-green-200 bg-green-50 text-green-600' :
                                                req.status === 'rejected' ? 'border-red-200 bg-red-50 text-red-600' :
                                                    'border-amber-200 bg-amber-50 text-amber-600'
                                            }`}>
                                            {req.status === 'pending_ceo' ? <Clock className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                                            {req.status.replace('_', ' ')}
                                        </span>
                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{new Date(req.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                {/* Compact Body */}
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 text-gray-600 mb-4 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100">
                                        <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><User className="w-3 h-3" /></div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-0.5">Requested By</span>
                                            <span className="text-xs font-bold text-gray-900 leading-none">{req.user?.name || 'System Generated'}</span>
                                        </div>
                                    </div>

                                    <div className="text-[12px] text-gray-500 line-clamp-2 leading-relaxed mb-4 flex-1">
                                        {req.description}
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 mt-auto">
                                        {req.jd_path && (
                                            <a href={getStorageUrl(req.jd_path)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-2.5 bg-gray-50 border border-gray-200 rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all group/doc text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                                <Download className="w-3 h-3" /> JD Document
                                            </a>
                                        )}
                                        <button
                                            onClick={() => setSelectedReq(req)}
                                            className={`flex items-center justify-center gap-2 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:text-gray-900 hover:border-gray-900 transition-all group/view ${!req.jd_path ? 'col-span-2' : ''}`}
                                        >
                                            <Eye className="w-3 h-3 group-hover/view:scale-110 transition-transform" /> Details
                                        </button>
                                    </div>
                                </div>

                                {/* Minimal Action Footer */}
                                <div className="flex gap-2 p-5 pt-0 mt-auto">
                                    <button
                                        disabled={req.status !== 'pending_ceo'}
                                        onClick={() => handleAction(req.id, 'approve')}
                                        className="flex-1 bg-gray-900 text-brand-yellow py-3 rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-20 disabled:cursor-not-allowed border border-gray-800"
                                    >
                                        {req.status === 'pending_ceo' ? 'Authorize' : 'Done'} <CheckCircle className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        disabled={req.status !== 'pending_ceo'}
                                        onClick={() => handleAction(req.id, 'reject')}
                                        className="w-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                                    >
                                        <XCircle className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )
            }

            {/* Details Modal */}
            <AnimatePresence>
                {selectedReq && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
                        onClick={() => setSelectedReq(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 30, opacity: 0 }}
                            className="bg-white rounded-[2.5rem] w-full max-w-2xl p-0 shadow-2xl border border-gray-100 overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="bg-gray-900 p-10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-full bg-blue-500/5 skew-x-[30deg] translate-x-32 rotate-12"></div>
                                <div className="relative z-10 flex justify-between items-start">
                                    <div>
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[8px] font-bold text-blue-400 uppercase tracking-wider  mb-4">
                                            <LayoutDashboard className="w-3 h-3" /> Final Review
                                        </div>
                                        <h2 className="text-3xl font-bold text-white  uppercase tracking-tight leading-none">{selectedReq.title}</h2>
                                    </div>
                                    <button onClick={() => setSelectedReq(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-white/40 hover:text-white">
                                        <XCircle className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                                        <label className="text-[8px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Category Unit</label>
                                        <div className="flex items-center gap-2 text-gray-900 font-bold uppercase text-[10px] ">
                                            <Tag className="w-3.5 h-3.5 text-blue-500" />
                                            {selectedReq.category || 'Information Technology'}
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                                        <label className="text-[8px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Geo Location</label>
                                        <div className="flex items-center gap-2 text-gray-900 font-bold uppercase text-[10px] ">
                                            <MapPin className="w-3.5 h-3.5 text-blue-500" />
                                            {selectedReq.location || 'Addis Ababa'}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[9px] font-bold text-gray-900 uppercase tracking-wider px-2 flex items-center gap-2 ">
                                        <FileText className="w-4 h-4 text-blue-500" /> Description
                                    </label>
                                    <div className="p-6 bg-gray-50 border border-gray-100 rounded-[2rem] text-xs text-gray-600 font-medium  leading-relaxed whitespace-pre-wrap">
                                        {selectedReq.description}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-50">
                                    <div>
                                        <label className="text-[8px] font-bold text-gray-400 uppercase tracking-wider block mb-4">Originator</label>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-blue-400 shadow-lg  font-bold text-xs">
                                                {selectedReq.user?.name?.charAt(0) || 'S'}
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-bold text-gray-900 uppercase  tracking-tight">{selectedReq.user?.name || 'System'}</p>
                                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">{selectedReq.user?.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[8px] font-bold text-gray-400 uppercase tracking-wider block mb-4">Structural Context</label>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider  group">
                                                <Building2 className="w-3 h-3 text-blue-500" />
                                                <span className="text-gray-900">{selectedReq.company?.name || 'Droga HQ'}</span>
                                                <span className="text-gray-300 mx-1">/</span>
                                                <span className="text-gray-500">{selectedReq.department?.name || 'Core Unit'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-10 bg-gray-50 border-t border-gray-100 flex gap-4">
                                <button
                                    onClick={() => handleAction(selectedReq.id, 'approve')}
                                    className="flex-[2] bg-gray-900 text-brand-yellow py-5 rounded-2xl font-bold text-[11px] uppercase tracking-wider hover:bg-black transition-all flex items-center justify-center gap-3  shadow-xl shadow-gray-900/10 active:scale-95"
                                >
                                    Approve Request <CheckCircle className="w-5 h-5 font-bold" />
                                </button>
                                <button
                                    onClick={() => handleAction(selectedReq.id, 'reject')}
                                    className="flex-1 bg-white border border-gray-200 text-gray-400 py-5 rounded-2xl font-bold text-[11px] uppercase tracking-wider hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all flex items-center justify-center gap-3  active:scale-95"
                                >
                                    Reject <XCircle className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
};

export default CeoDashboard;
