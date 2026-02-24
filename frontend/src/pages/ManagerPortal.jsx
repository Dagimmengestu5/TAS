import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, FileText, Building2, DollarSign, Send, ChevronLeft, ArrowRight, Zap, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const ManagerPortal = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        department: '',
        budget_status: 'pending',
    });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/jobs', {
                ...formData,
                is_internal: true,
                is_external: false
            });
            setSuccess(true);
            setTimeout(() => navigate('/'), 3000);
        } catch (err) {
            alert('Request submission failed. Please check authorization.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fcfcfc] py-16 px-6 font-sans text-gray-900 selection:bg-yellow-100">
            <div className="max-w-3xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] mb-12 text-gray-400 hover:text-black transition-all group"
                >
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl border border-gray-100 p-10 md:p-14 shadow-sm"
                >
                    <div className="mb-14">
                        <div className="inline-flex items-center gap-2 bg-yellow-400 text-black px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest mb-6">
                            Managerial Resource Request
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">Initialize Requisition</h1>
                        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Level 4 Authorization Detected</p>
                    </div>

                    {success ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-20"
                        >
                            <div className="w-20 h-20 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-yellow-400/20">
                                <Send className="w-8 h-8 text-black" />
                            </div>
                            <h2 className="text-3xl font-bold mb-4">Request Transmitted</h2>
                            <p className="text-gray-500 font-medium uppercase text-[10px] tracking-widest max-w-xs mx-auto leading-loose">The requisition is now in the approval pipeline for resource allocation.</p>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Job Designation</label>
                                <div className="relative">
                                    <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                                    <input
                                        type="text" required
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-4 font-bold text-sm uppercase transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400/30 focus:border-yellow-400"
                                        placeholder="Position Title"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Department</label>
                                    <div className="relative">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                                        <input
                                            type="text" required
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-3.5 font-bold text-xs uppercase transition-all focus:bg-white focus:border-yellow-400 focus:ring-0"
                                            placeholder="Unit Code"
                                            value={formData.department}
                                            onChange={e => setFormData({ ...formData, department: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Budget Allocation</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                                        <select
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-10 py-3.5 font-bold text-xs uppercase transition-all focus:bg-white focus:border-yellow-400 focus:ring-0 appearance-none"
                                            value={formData.budget_status}
                                            onChange={e => setFormData({ ...formData, budget_status: e.target.value })}
                                        >
                                            <option value="pending">Review Budget Availability</option>
                                            <option value="approved">Pre-approved Funds</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Strategic Description</label>
                                <textarea
                                    rows="6" required
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-6 font-medium text-xs leading-relaxed uppercase tracking-wider transition-all focus:bg-white focus:border-yellow-400 focus:ring-0"
                                    placeholder="Outline the necessity for this requisition..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-black text-white py-5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition-all flex items-center justify-center gap-3 shadow-lg shadow-black/5 group"
                            >
                                {submitting ? 'Authenticating Request...' : 'Submit Requisition'}
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default ManagerPortal;
