import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Building2, User, Download, FileText, ShieldCheck, Clock, Eye, AlertCircle, MapPin, Tag, Briefcase, ArrowRight } from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const HrDashboard = () => {
    const { user } = useAuth();
    const [requisitions, setRequisitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReq, setSelectedReq] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectComment, setRejectComment] = useState('');

    const fetchRequisitions = async () => {
        setLoading(true);
        try {
            const res = await api.get('/approvals/hr/requisitions');
            setRequisitions(res.data);
            console.log("HR Requisitions Loaded:", res.data);
        } catch (err) {
            console.error("Failed to load HR requisitions", err);
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
        const baseUrl = (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '').replace('/api', '');
        return `${baseUrl}/storage/${path}`;
    };

    const handleAction = async (id, action, comment = null) => {
        try {
            const payload = comment ? { comment } : {};
            await api.patch(`/approvals/hr/requisitions/${id}/${action}`, payload);
            alert(`Requisition ${action}d successfully`);
            setSelectedReq(null);
            setShowRejectModal(false);
            setRejectComment('');
            fetchRequisitions();
        } catch (error) {
            alert(`Failed to ${action} requisition`);
            console.error(error);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen w-full selection:bg-brand-yellow/30 px-6 py-6 lg:px-10 ">
            {/* Rejection Comment Modal */}
            <AnimatePresence>
                {showRejectModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
                        onClick={() => setShowRejectModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl border border-gray-100"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
                                    <AlertCircle className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-black text-gray-900 uppercase">Rejection Reason</h3>
                            </div>

                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 ml-1">
                                Please provide a reason for rejecting this requisition. This feedback will be shared with the requester.
                            </p>

                            <textarea
                                value={rejectComment}
                                onChange={(e) => setRejectComment(e.target.value)}
                                placeholder="Enter rejection details..."
                                className="w-full h-32 bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all resize-none mb-6"
                            />

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowRejectModal(false)}
                                    className="flex-1 px-6 py-4 rounded-xl border border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleAction(selectedReq.id, 'reject', rejectComment)}
                                    disabled={!rejectComment.trim()}
                                    className="flex-[1.5] px-6 py-4 rounded-xl bg-red-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Confirm Rejection
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mb-12 flex justify-between items-end">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center shadow-lg">
                            <ShieldCheck className="w-4 h-4 text-brand-yellow" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 uppercase   leading-none ">Review Requests</h1>
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider  ml-12">
                        Pending Approvals • Budget & Policy Check
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32">
                    <div className="w-12 h-12 border-4 border-gray-100 border-t-brand-yellow rounded-full animate-spin mb-6 shadow-xl shadow-brand-yellow/10"></div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider animate-pulse ">Syncing Requisitions...</p>
                </div>
            ) : requisitions.length === 0 ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-32 bg-white rounded-3xl border border-gray-100 flex flex-col items-center shadow-sm">
                    <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-green-100">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h2 className="text-3xl font-bold mb-3 tracking-tight uppercase text-gray-900  leading-none">No Requests</h2>
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-wider  px-6 max-w-md">There are no pending requests for review at this time.</p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-20">
                    <AnimatePresence>
                        {requisitions.map((req) => (
                            <motion.div
                                key={req.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all duration-500 group overflow-hidden relative flex flex-col"
                            >
                                {/* Premium Status Indicator */}
                                <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-[1.5rem] text-[9px] font-black uppercase tracking-[0.2em] z-10 shadow-sm border-l border-b ${req.status === 'pending_hr' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                    req.status === 'pending_ceo' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                        req.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-100' :
                                            req.status === 'approved' ? 'bg-green-50 text-green-600 border-green-100' :
                                                'bg-gray-50 text-gray-600 border-gray-100'
                                    }`}>
                                    {req.status.replace('_', ' ')}
                                </div>

                                <div className="p-8 pb-0">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                                            <Briefcase className="w-4 h-4 text-brand-yellow" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">{req.company?.name || 'Central Unit'}</span>
                                            <h3 className="text-lg font-black text-gray-900 leading-tight tracking-tight line-clamp-1">{req.title} • {req.department?.name || 'Dept'}</h3>
                                        </div>
                                    </div>


                                    <div className="flex items-center gap-2 mb-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                                        <span>Candidate Category: {req.category || 'Professional'}</span>
                                    </div>
                                </div>

                                {/* Progress Section */}
                                <div className="px-8 mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Workflow Phase</span>
                                        <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">HR Audit</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="w-1/3 h-full bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.4)]"></div>
                                    </div>
                                </div>

                                <div className="px-8 pb-8 mt-auto flex flex-col gap-4">
                                    <div className="flex items-center justify-between py-4 border-t border-gray-100/80">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
                                                <User className="w-3.5 h-3.5" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Author</span>
                                                <span className="text-[11px] font-bold text-gray-900 leading-none">{req.user?.name || 'System'}</span>
                                            </div>
                                        </div>
                                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{new Date(req.created_at).toLocaleDateString()}</span>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setSelectedReq(req)}
                                            className="flex-1 bg-gray-50 border border-gray-100 rounded-xl py-4 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-gray-500 hover:bg-white hover:border-gray-900 hover:text-gray-900 transition-all duration-300 active:scale-95"
                                        >
                                            <Eye className="w-3.5 h-3.5" /> Details
                                        </button>
                                        <button
                                            disabled={req.status !== 'pending_hr'}
                                            onClick={() => handleAction(req.id, 'approve')}
                                            className="flex-[1.5] bg-gray-900 text-brand-yellow rounded-xl py-4 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] hover:bg-black transition-all duration-300 shadow-xl shadow-gray-900/10 active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed"
                                        >
                                            Authorize <ArrowRight className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Details Modal - Redesigned for HR Executive view */}
            <AnimatePresence>
                {selectedReq && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl"
                        onClick={() => setSelectedReq(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 50, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 50, opacity: 0 }}
                            className="bg-white rounded-[3rem] w-full max-w-3xl flex flex-col shadow-[0_50px_100px_rgba(0,0,0,0.5)] border border-white/20 overflow-hidden max-h-[90vh]"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Executive Header */}
                            <div className="bg-gray-900 p-12 relative overflow-hidden shrink-0">
                                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-yellow/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-brand-yellow/10 rounded-[1.25rem] flex items-center justify-center border border-brand-yellow/20">
                                                <ShieldCheck className="w-7 h-7 text-brand-yellow" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-black text-brand-yellow uppercase tracking-[0.4em] mb-2">Talent Authorization Protocol</span>
                                                <span className="px-4 py-1.5 bg-brand-yellow/10 border border-brand-yellow/20 rounded-full text-[9px] font-bold text-brand-yellow uppercase tracking-widest inline-block w-fit">
                                                    Sequence #{selectedReq.id} • {selectedReq.status.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>
                                        <button onClick={() => setSelectedReq(null)} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all active:scale-90 border border-white/5">
                                            <XCircle className="w-6 h-6 text-white/40 group-hover:text-white" />
                                        </button>
                                    </div>
                                    <h2 className="text-4xl font-black text-brand-yellow uppercase tracking-tight leading-[0.9]">{selectedReq.title}</h2>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar">
                                {/* Dashboard Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { label: 'Company', value: selectedReq.company?.name, icon: Building2 },
                                        { label: 'Department', value: selectedReq.department?.name, icon: Briefcase },
                                        { label: 'Unit Category', value: selectedReq.category, icon: Tag },
                                    ].map((item, idx) => (
                                        <div key={idx} className="bg-gray-50/80 border border-gray-100 p-5 rounded-[2rem] flex flex-col gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-amber-500">
                                                <item.icon className="w-4 h-4" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</span>
                                                <span className="text-[11px] font-black text-gray-900 uppercase tracking-tight truncate">{item.value || 'N/A'}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Main Content Section */}
                                <div className="flex flex-col gap-8">
                                    <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                                        <div className="w-1.5 h-6 bg-brand-yellow rounded-full"></div>
                                        <h4 className="text-[13px] font-black text-gray-900 uppercase tracking-[0.2em]">Mandate Specification</h4>
                                    </div>
                                    <div className="bg-gray-50/50 border border-gray-100 rounded-[2.5rem] p-10 relative overflow-hidden group">
                                        <FileText className="absolute -bottom-4 -right-4 w-32 h-32 text-gray-100/50 group-hover:scale-110 transition-transform duration-700" />
                                        <div className="relative z-10">
                                            <p className="text-[15px] text-gray-700 font-medium leading-[1.8] whitespace-pre-wrap mb-8">
                                                {selectedReq.description}
                                            </p>

                                            {selectedReq.jd_path && (
                                                <a
                                                    href={getStorageUrl(selectedReq.jd_path)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-3 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-900 hover:bg-gray-900 hover:text-brand-yellow transition-all shadow-sm"
                                                >
                                                    <Download className="w-4 h-4" /> View Job Description (PDF)
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Data */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-10 border-t border-gray-100">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-gray-900 flex items-center justify-center text-brand-yellow text-xl font-black shadow-2xl">
                                            {selectedReq.user?.name?.charAt(0) || 'S'}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1.5">Submitted By</span>
                                            <span className="text-lg font-black text-gray-900 tracking-tight leading-none">{selectedReq.user?.name || 'System'}</span>
                                            <span className="text-[10px] font-bold text-gray-400 mt-1">{selectedReq.user?.email}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-center items-end">
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Request Lifecycle</span>
                                        <div className="flex items-center gap-3 bg-gray-50 px-5 py-3 rounded-full border border-gray-100">
                                            <Clock className="w-3.5 h-3.5 text-amber-500" />
                                            <span className="text-[11px] font-black text-gray-900 uppercase">Initiated {new Date(selectedReq.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sticky Action Bar */}
                            <div className="p-12 bg-white border-t border-gray-100 flex gap-6 shrink-0">
                                <button
                                    onClick={() => handleAction(selectedReq.id, 'approve')}
                                    className="flex-[2] bg-gray-900 text-brand-yellow h-20 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-black transition-all flex items-center justify-center gap-4 shadow-[0_20px_40px_rgba(0,0,0,0.2)] active:scale-95 group"
                                >
                                    Approve Request
                                    <CheckCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                </button>
                                <button
                                    onClick={() => setShowRejectModal(true)}
                                    className="flex-1 bg-white border-2 border-gray-100 text-gray-400 h-20 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all flex items-center justify-center gap-3 active:scale-95"
                                >
                                    Reject <XCircle className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default HrDashboard;
