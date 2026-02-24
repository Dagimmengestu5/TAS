import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, FileText, Building2, User, Clock, ChevronRight, Zap, ShieldCheck, Activity, ArrowRight, DollarSign } from 'lucide-react';
import api from '../api/api';

const CHODashboard = () => {
    const [requisitions, setRequisitions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReqs = async () => {
            try {
                const jobsRes = await api.get('/jobs');
                setRequisitions(jobsRes.data.filter(j => j.requisition.budget_status === 'pending' || j.requisition.status === 'pending'));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchReqs();
    }, []);

    const handleApproval = async (id, status) => {
        try {
            // Mocking approval logic
            setRequisitions(reqs => reqs.filter(r => r.id !== id));
        } catch (err) {
            alert('Approval action failed.');
        }
    };

    return (
        <div className="min-h-screen bg-[#fcfcfc] font-sans text-gray-900 selection:bg-yellow-100">
            <header className="px-12 py-16 bg-white border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">Financial Approval</h1>
                    <p className="text-gray-400 font-bold uppercase text-[9px] tracking-[0.4em] mt-2 flex items-center gap-3 italic">
                        <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full"></div> Executive Authorization Node
                    </p>
                </div>
                <div className="flex bg-gray-50 px-5 py-2.5 rounded-xl border border-gray-100 italic">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Node Status: Secured</span>
                </div>
            </header>

            <div className="p-12">
                {loading ? (
                    <div className="flex justify-center py-40">
                        <div className="w-10 h-10 border-4 border-gray-100 border-t-yellow-400 rounded-full animate-spin"></div>
                    </div>
                ) : requisitions.length === 0 ? (
                    <div className="text-center py-48 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center">
                        <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mb-8">
                            <CheckCircle className="w-8 h-8 text-yellow-600" />
                        </div>
                        <h2 className="text-3xl font-bold mb-3 tracking-tight">Queue Synchronized.</h2>
                        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest italic mb-10">No pending budget authorizations at this time.</p>
                        <button className="bg-black text-white px-10 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition-all shadow-lg shadow-black/5">Refresh Telemetry</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {requisitions.map(req => (
                            <motion.div
                                key={req.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all group"
                            >
                                <div className="flex justify-between items-start mb-10">
                                    <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-yellow-100 transition-colors border border-gray-100">
                                        <Building2 className="w-6 h-6 text-gray-400 group-hover:text-yellow-700" />
                                    </div>
                                    <span className="bg-black text-white px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest">Awaiting Approval</span>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-2 truncate uppercase tracking-tight">
                                    {req.requisition.title}
                                </h3>
                                <div className="flex items-center gap-2 mb-8 text-[9px] font-bold uppercase tracking-widest text-gray-400 italic">
                                    <User className="w-3.5 h-3.5" /> Origin: Unit_Manager_{req.id}
                                </div>

                                <div className="space-y-4 mb-10 pt-8 border-t border-gray-50">
                                    <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-gray-400">
                                        <span>Allocation Area</span>
                                        <span className="text-black">{req.requisition.department}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-gray-400">
                                        <span>Budget Status</span>
                                        <span className="flex items-center gap-1.5 text-yellow-600"><Clock className="w-3.5 h-3.5" /> Review Pending</span>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => handleApproval(req.id, 'approved')}
                                        className="flex-1 bg-black text-white py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/5"
                                    >
                                        Authorize <ShieldCheck className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleApproval(req.id, 'rejected')}
                                        className="w-14 h-14 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-300 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all font-bold"
                                    >
                                        <XCircle className="w-6 h-6" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <div className="fixed bottom-8 left-8 p-3 bg-white border border-gray-100 rounded-2xl shadow-xl flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse shadow-sm shadow-yellow-400/50"></div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 px-1">Network Integrity: Optimal</span>
            </div>
        </div>
    );
};

export default CHODashboard;
