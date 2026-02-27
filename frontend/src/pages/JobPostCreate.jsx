import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, ArrowLeft, Send, AlertCircle, CheckCircle, Clock, Building2, MapPin, Plus, Edit2, Trash2, Search, Filter, X } from 'lucide-react';
import api from '../api/api';

const JobPostCreate = () => {
    const navigate = useNavigate();
    const [view, setView] = useState('list'); // 'list' or 'form'
    const [allJobs, setAllJobs] = useState([]);
    const [requisitions, setRequisitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        job_requisition_id: '',
        title: '',
        description: '',
        tags: '',
        location: '',
        employment_type: '',
        is_internal: true,
        is_external: true,
        deadline: ''
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [jobsRes, reqsRes] = await Promise.all([
                api.get('/jobs/all'),
                api.get('/requisitions')
            ]);
            setAllJobs(jobsRes.data);

            // Only fetch CEO-approved requisitions ('approved' status)
            setRequisitions(reqsRes.data.filter(r => r.status === 'approved'));
        } catch (err) {
            console.error(err);
            setError('Failed to fetch data from ecosystem');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const resetForm = () => {
        setFormData({
            job_requisition_id: '',
            title: '',
            description: '',
            tags: '',
            location: '',
            employment_type: '',
            is_internal: true,
            is_external: true,
            deadline: ''
        });
        setEditingId(null);
        setError(null);
        setSuccess(false);
    };

    const handleRequisitionChange = (id) => {
        const req = requisitions.find(r => r.id === parseInt(id));
        if (req) {
            setFormData({
                ...formData,
                job_requisition_id: id,
                title: req.title,
                description: req.description,
                location: req.location || '',
                employment_type: req.employment_type || '',
                tags: req.category || ''
            });
        } else {
            setFormData({ ...formData, job_requisition_id: id });
        }
    };

    const handleEdit = (job) => {
        setEditingId(job.id);
        const deadlineDate = job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '';
        setFormData({
            job_requisition_id: job.job_requisition_id,
            title: job.title,
            description: job.description,
            tags: job.tags || '',
            location: job.location || '',
            employment_type: job.employment_type || '',
            is_internal: !!job.is_internal,
            is_external: !!job.is_external,
            deadline: deadlineDate
        });
        setView('form');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you certain you want to de-initialize this job post node?')) return;
        try {
            await api.delete(`/jobs/${id}`);
            setAllJobs(allJobs.filter(j => j.id !== id));
        } catch (err) {
            console.error(err);
            alert('Failed to delete job post');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            if (editingId) {
                await api.put(`/jobs/${editingId}`, formData);
            } else {
                await api.post('/jobs', formData);
            }
            setSuccess(true);
            setTimeout(() => {
                fetchData();
                setView('list');
                resetForm();
            }, 1500);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Transaction failed');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading && allJobs.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-12 h-12 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen w-full px-6 py-12 lg:px-20 font-['Outfit']">
            <div className="max-w-7xl mx-auto mb-16 flex items-center justify-between">
                <div>
                    <h1 className="text-5xl font-black text-gray-900 uppercase tracking-tighter italic leading-none mb-4">Job Dashboard</h1>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] italic">Ecosystem Nodes • Talent Acquisition Management</p>
                </div>

                {view === 'list' ? (
                    <button
                        onClick={() => { resetForm(); setView('form'); }}
                        className="bg-black text-brand-yellow px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] italic hover:bg-brand-yellow hover:text-black transition-all flex items-center gap-3 shadow-xl"
                    >
                        <Plus className="w-4 h-4" /> Initialize New Post
                    </button>
                ) : (
                    <button
                        onClick={() => setView('list')}
                        className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest italic">Back to Postings</span>
                    </button>
                )}
            </div>

            <AnimatePresence mode="wait">
                {view === 'list' ? (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-8"
                    >
                        <div className="bg-gray-50 rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">Node Info</th>
                                        <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">Modality</th>
                                        <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">Status</th>
                                        <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {allJobs.length > 0 ? allJobs.map((job) => (
                                        <tr key={job.id} className="hover:bg-white/50 transition-colors group">
                                            <td className="px-10 py-8">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm font-black text-gray-900 group-hover:text-brand-yellow transition-colors uppercase leading-tight tracking-tight">
                                                        {job.title || job.requisition?.title}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic flex items-center gap-2">
                                                        <MapPin className="w-3 h-3" /> {job.location || job.requisition?.location || 'Unassigned Vector'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <span className="text-[10px] font-black text-gray-900 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-widest italic">
                                                    {job.employment_type || 'Full-Time'}
                                                </span>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className={`inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest italic py-1 px-4 rounded-lg border ${job.status === 'active' ? 'bg-green-50 text-green-600 border-green-100' :
                                                    job.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-100' :
                                                        'bg-yellow-50 text-yellow-600 border-yellow-100'
                                                    }`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${job.status === 'active' ? 'bg-green-600' :
                                                        job.status === 'rejected' ? 'bg-red-600' :
                                                            'bg-yellow-600'
                                                        }`} />
                                                    {job.status.replace('_', ' ')}
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleEdit(job)}
                                                        className="p-3 bg-white border border-gray-100 rounded-xl hover:border-brand-yellow hover:text-brand-yellow transition-all"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(job.id)}
                                                        className="p-3 bg-white border border-gray-100 rounded-xl hover:border-red-500 hover:text-red-500 transition-all"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="px-10 py-24 text-center">
                                                <Briefcase className="w-12 h-12 text-gray-100 mx-auto mb-6" />
                                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] italic">No active job nodes detected</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-8">
                            <div className="lg:col-span-2 space-y-8">
                                {/* Requisition Selection */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block italic">Select Approved Requisition</label>
                                    <select
                                        required
                                        disabled={!!editingId}
                                        value={formData.job_requisition_id}
                                        onChange={(e) => handleRequisitionChange(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-yellow outline-none transition-all italic disabled:opacity-50"
                                    >
                                        <option value="">Select a requisition...</option>
                                        {requisitions
                                            .filter(req => {
                                                const isPosted = allJobs.some(j => Number(j.job_requisition_id) === Number(req.id));
                                                const isCurrentEdit = formData.job_requisition_id === req.id.toString();
                                                return !isPosted || isCurrentEdit;
                                            })
                                            .map(req => (
                                                <option key={req.id} value={req.id}>{req.id} - {req.title} ({req.status})</option>
                                            ))}
                                    </select>
                                </div>

                                {/* Title */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block italic">Public Job Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Software Engineer II..."
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-yellow outline-none transition-all italic"
                                    />
                                </div>

                                {/* Description */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block italic">Job Description / Requirements</label>
                                    <textarea
                                        required
                                        rows={10}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Outline the roles, responsibilities, and requirements..."
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-yellow outline-none transition-all italic resize-none"
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Location */}
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block italic">Override Location</label>
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            placeholder="Addis Ababa, Adama, etc."
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-yellow outline-none transition-all italic"
                                        />
                                    </div>

                                    {/* Tags */}
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block italic">Job Tags (Comma separated)</label>
                                        <input
                                            type="text"
                                            value={formData.tags}
                                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                            placeholder="Health, Pharmacist, Nursing..."
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-yellow outline-none transition-all italic"
                                        />
                                    </div>
                                </div>

                                {/* Employment Type */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block italic">Employment Modality</label>
                                    <select
                                        value={formData.employment_type}
                                        onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-yellow outline-none transition-all italic"
                                    >
                                        <option value="">Select modality...</option>
                                        <option value="Full-time">Full-time</option>
                                        <option value="Part-time">Part-time</option>
                                        <option value="Hybrid">Hybrid</option>
                                        <option value="Remote">Remote</option>
                                        <option value="Contract">Contract</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="bg-gray-50 rounded-[2rem] p-8 border border-gray-100 space-y-8">
                                    <div className="space-y-6">
                                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-tighter italic border-b border-gray-200 pb-2">Posting Configuration</h3>

                                        <div className="space-y-4">
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.is_internal}
                                                        onChange={(e) => setFormData({ ...formData, is_internal: e.target.checked })}
                                                        className="sr-only p-2 peer"
                                                    />
                                                    <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:bg-brand-yellow transition-all"></div>
                                                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-4 transition-all shadow-sm"></div>
                                                </div>
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic group-hover:text-black transition-colors">Internal Posting</span>
                                            </label>

                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.is_external}
                                                        onChange={(e) => setFormData({ ...formData, is_external: e.target.checked })}
                                                        className="sr-only p-2 peer"
                                                    />
                                                    <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:bg-brand-yellow transition-all"></div>
                                                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-4 transition-all shadow-sm"></div>
                                                </div>
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic group-hover:text-black transition-colors">External Posting</span>
                                            </label>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block italic">Application Deadline</label>
                                            <input
                                                type="date"
                                                value={formData.deadline}
                                                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                                className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-[11px] font-bold focus:ring-2 focus:ring-brand-yellow outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting || success}
                                        className="w-full bg-black text-brand-yellow py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] italic hover:bg-brand-yellow hover:text-black transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale"
                                    >
                                        {submitting ? 'Processing...' : success ? 'Post Synchronized!' : editingId ? 'Update Node' : 'Initialize Post'}
                                        {success ? <CheckCircle className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                                    </button>

                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3"
                                        >
                                            <AlertCircle className="w-4 h-4 text-red-500" />
                                            <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest italic">{error}</p>
                                        </motion.div>
                                    )}

                                    {success && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-4 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3"
                                        >
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            <p className="text-[9px] font-bold text-green-500 uppercase tracking-widest italic">
                                                {editingId ? 'Job post details updated in ecosystem.' : 'Job post published immediately to landing hub.'}
                                            </p>
                                        </motion.div>
                                    )}
                                </div>

                                <div className="p-8 bg-black rounded-[2rem] text-white">
                                    <Clock className="w-8 h-8 text-brand-yellow mb-6" />
                                    <h4 className="text-xs font-black uppercase tracking-widest italic mb-2">Transaction Protocol</h4>
                                    <p className="text-[10px] text-gray-400 font-medium leading-relaxed italic">
                                        All nodes are published <span className="text-brand-yellow font-black">Instantly</span> to the landing hub. HR authorization is bypassed for immediate synchronization.
                                    </p>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default JobPostCreate;
