import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Briefcase, Plus, Search, Filter, Edit2, Trash2,
    CheckCircle, AlertCircle, Clock, MapPin, Building2,
    ChevronRight, ArrowLeft, Send, X, LayoutGrid, Globe, GraduationCap, Award
} from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const JobConsole = () => {
    const { user } = useAuth();
    // --- State Management ---
    const [jobs, setJobs] = useState([]);
    const [requisitions, setRequisitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('list'); // 'list' | 'form'
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        job_requisition_id: '',
        title: '',
        description: '',
        tags: '',
        category: '',
        location: '',
        employment_type: '',
        is_internal: true,
        is_external: true,
        deadline: '',
        education_level: [], // Changed to array
        experience_level: [], // Changed to array
        core_requirements: ['', '', '', ''],
        status: 'posted'
    });

    const EDUCATION_LEVELS = [
        'Tvet', 'Secondary School', 'Certificate', 'Diploma',
        'Bachelors Degree', 'Phd', 'Masters Degree', 'Not Required'
    ];

    const EXPERIENCE_LEVELS = [
        'Entry level', 'Junior', 'Intermediate', 'Senior', 'Expert'
    ];

    // --- Data Fetching ---
    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            // Fetch Jobs
            try {
                const jobsRes = await api.get('/jobs/all');
                setJobs(Array.isArray(jobsRes.data) ? jobsRes.data : []);
            } catch (err) {
                console.error('Jobs Fetch Error:', err);
                // Non-fatal, but we'll log it
            }

            // Fetch Requisitions
            try {
                const reqsRes = await api.get('/requisitions');
                const rawReqs = Array.isArray(reqsRes.data) ? reqsRes.data : (reqsRes.data?.data || []);

                // TA/Admin users need to see approved requisitions to create jobs
                const filteredReqs = rawReqs.filter(r =>
                    !['rejected', 'closed', 'created'].includes(r.status) && !r.job_posting
                );
                setRequisitions(filteredReqs);
            } catch (err) {
                console.error('Requisitions Fetch Error:', err);
                setError('Failed to synchronize requisition data.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // --- Handlers ---
    const handleRequisitionChange = (id) => {
        const req = requisitions.find(r => String(r.id) === String(id));
        if (req) {
            setFormData({
                ...formData,
                job_requisition_id: id,
                title: req.title,
                description: req.description,
                location: req.location || '',
                employment_type: req.employment_type || '',
                tags: req.category || '',
                category: req.category || ''
            });
        } else {
            setFormData({ ...formData, job_requisition_id: id });
        }
    };

    const handleEdit = (job) => {
        setEditingId(job.id);
        setFormData({
            job_requisition_id: job.job_requisition_id || '',
            title: job.title || '',
            description: job.description || '',
            tags: job.tags || '',
            category: job.category || '',
            location: job.location || '',
            employment_type: job.employment_type || '',
            is_internal: !!job.is_internal,
            is_external: !!job.is_external,
            deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '',
            education_level: job.education_level ? job.education_level.split(', ') : [],
            experience_level: job.experience_level ? job.experience_level.split(', ') : [],
            core_requirements: job.core_requirements ? job.core_requirements.split('|') : ['', '', '', ''],
            status: job.status || 'posted'
        });
        setView('form');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you certain you want to permanently delete this job post?')) return;
        try {
            await api.delete(`/jobs/${id}`);
            setJobs(jobs.filter(j => j.id !== id));
        } catch (err) {
            alert('Failed to delete job.');
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
                setEditingId(null);
                setSuccess(false);
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save job');
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            job_requisition_id: '',
            title: '',
            description: '',
            tags: '',
            category: '',
            location: '',
            employment_type: '',
            is_internal: true,
            is_external: true,
            deadline: '',
            education_level: [],
            experience_level: [],
            core_requirements: ['', '', '', ''],
            status: 'posted'
        });
        setEditingId(null);
        setError(null);
    };

    // --- Filtering ---
    const filteredJobs = jobs.filter(job => {
        const matchesSearch = (job.title + ' ' + (job.requisition?.title || '')).toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'posted': return 'bg-brand-yellow/10 text-brand-yellow border-brand-yellow/20';
            case 'created': return 'bg-gray-100 text-gray-500 border-gray-200';
            case 'closed': return 'bg-red-50 text-red-500 border-red-100';
            default: return 'bg-gray-50 text-gray-400';
        }
    };

    // --- UI Rendering ---
    if (loading && jobs.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white ">
                <div className="w-16 h-16 border-4 border-gray-100 border-t-brand-yellow rounded-full animate-spin mb-6"></div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider  animate-pulse">Loading Jobs...</p>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen w-full px-6 py-8 lg:px-12  selection:bg-brand-yellow/30">
            {/* Header Control Unit */}
            <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-50 pb-8">
                <div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 bg-gray-900 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-gray-900/10 border border-gray-800">
                            <Briefcase className="w-6 h-6 text-brand-yellow" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 uppercase   leading-none ">Job Manager</h1>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="w-2 h-2 bg-brand-yellow rounded-full animate-pulse shadow-[0_0_8px_#FFF200]"></div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ">Live System Active</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {view === 'list' ? (
                        <div className="flex items-center gap-3">
                            <div className="relative group min-w-[300px]">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-brand-yellow transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search Jobs..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-16 pr-8 py-3.5 text-[11px] font-bold focus:ring-4 focus:ring-brand-yellow/10 focus:border-brand-yellow outline-none transition-all "
                                />
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                onClick={() => { resetForm(); setView('form'); }}
                                className="bg-gray-900 text-brand-yellow px-8 py-3.5 rounded-xl font-bold text-[10px] uppercase tracking-wider  flex items-center gap-2 shadow-xl shadow-brand-yellow/10 border border-gray-800"
                            >
                                <Plus className="w-4 h-4" /> New Job
                            </motion.button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setView('list')}
                            className="flex items-center gap-3 text-gray-400 hover:text-gray-900 transition-colors group px-6 py-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-[9px] font-bold uppercase tracking-wider ">Back to List</span>
                        </button>
                    )}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {view === 'list' ? (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
                        className="max-w-7xl mx-auto"
                    >
                        {/* Status Filters */}
                        <div className="flex items-center gap-4 mb-10 overflow-x-auto pb-4 no-scrollbar">
                            {['all', 'posted', 'created', 'closed'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-6 py-2.5 rounded-full text-[8.5px] font-bold uppercase tracking-wider  transition-all border ${statusFilter === status
                                        ? 'bg-gray-900 text-brand-yellow border-gray-900 shadow-md'
                                        : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'
                                        }`}
                                >
                                    {status === 'all' ? 'All Roles' : status}
                                </button>
                            ))}
                        </div>

                        {filteredJobs.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-32">
                                {filteredJobs.map((job) => (
                                    <motion.div
                                        key={job.id} layout
                                        className="group bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 relative overflow-hidden flex flex-col"
                                    >
                                        <div className="flex justify-between items-start mb-10">
                                            <div className={`px-5 py-2 rounded-xl border text-[9px] font-bold uppercase tracking-wider  flex items-center gap-2 ${getStatusStyle(job.status)}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${job.status === 'posted' ? 'bg-brand-yellow' : job.status === 'closed' ? 'bg-red-500' : 'bg-gray-400'}`} />
                                                {job.status}
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEdit(job)} className="p-3 bg-gray-50 text-gray-400 hover:bg-gray-900 hover:text-brand-yellow rounded-xl transition-all"><Edit2 className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete(job.id)} className="p-3 bg-gray-50 text-gray-400 hover:bg-red-500 hover:text-white rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-900 uppercase   leading-tight mb-3 group-hover:text-brand-yellow transition-colors ">
                                                {job.title}
                                            </h3>
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                <span className="flex items-center gap-2 text-[9px] font-bold text-gray-400 uppercase tracking-wider  bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                                                    <Building2 className="w-3.5 h-3.5" /> {job.requisition?.company?.name || 'Independent Post'}
                                                </span>
                                                <span className="flex items-center gap-2 text-[8px] font-bold text-gray-400 uppercase tracking-wider  bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                                    <MapPin className="w-3.5 h-3.5" /> {job.location || 'Remote/HQ'}
                                                </span>
                                            </div>

                                            <div className="p-5 bg-gray-50/50 rounded-xl border border-gray-100 text-[10px] text-gray-500  line-clamp-3 leading-relaxed mb-6 font-medium ">
                                                {job.description}
                                            </div>
                                        </div>

                                        <div className="pt-8 border-t border-gray-100 flex items-center justify-between mt-auto">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider ">
                                                <Clock className="w-4 h-4" />
                                                Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Rolling Application'}
                                            </div>
                                            <div className="flex items-center gap-2 text-[9px] font-bold text-gray-900 uppercase ">
                                                ID: {job.id} <ChevronRight className="w-4 h-4 text-brand-yellow" />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-48 text-center bg-gray-50/50 rounded-[4rem] border border-dashed border-gray-200">
                                <LayoutGrid className="w-20 h-20 text-gray-200 mx-auto mb-8 opacity-50" />
                                <h3 className="text-2xl font-bold text-gray-400 uppercase  ">No Jobs Found</h3>
                                <p className="text-[11px] font-bold text-gray-300 uppercase tracking-wider mt-4 ">Post your first job to begin recruitment.</p>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
                        className="max-w-5xl mx-auto"
                    >
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-20">
                            <div className="lg:col-span-2 space-y-8">
                                {/* Job Heading */}
                                <div className="p-6 bg-gray-900 rounded-2xl text-white shadow-lg relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-yellow/10 blur-[40px] rounded-full transition-all group-hover:scale-110"></div>
                                    <h2 className="text-[10px] font-bold uppercase tracking-wider text-brand-yellow  mb-1 ">Job Details</h2>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider leading-relaxed">{editingId ? 'Edit existing job' : 'Create new job posting'}</p>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[9px] font-bold text-gray-900 uppercase tracking-wider block  px-4">Approved Request Link</label>
                                    <select
                                        value={formData.job_requisition_id}
                                        onChange={(e) => handleRequisitionChange(e.target.value)}
                                        disabled={!!editingId}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-8 py-4 text-[11px] font-bold focus:ring-4 focus:ring-brand-yellow/5 focus:border-brand-yellow outline-none transition-all  shadow-inner appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23000000%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-[right_2rem_center] bg-no-repeat disabled:opacity-50"
                                    >
                                        <option value="">-- Manual Entry --</option>
                                        {requisitions.map(req => (
                                            <option key={req.id} value={req.id}>REQ-{req.id} | {req.title} | {req.user?.name || 'Requester'}</option>
                                        ))}
                                        {requisitions.length === 0 && (
                                            <option disabled>No approved requests found for your company</option>
                                        )}
                                    </select>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[9px] font-bold text-gray-900 uppercase tracking-wider block  px-4">Job Title</label>
                                    <input
                                        type="text" required value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-8 py-4 text-[11px] font-bold focus:ring-4 focus:ring-brand-yellow/5 focus:border-brand-yellow outline-none transition-all "
                                        placeholder="Headline for candidate engagement..."
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[9px] font-bold text-gray-900 uppercase tracking-wider block  px-4">Job Description</label>
                                    <textarea
                                        required rows={10} value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-8 py-5 text-[11px] font-bold focus:ring-4 focus:ring-brand-yellow/5 focus:border-brand-yellow outline-none transition-all  resize-none custom-scrollbar leading-relaxed"
                                        placeholder="Describe the role and requirements..."
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-bold text-gray-900 uppercase tracking-wider block  px-4">Location Vector</label>
                                        <input
                                            type="text" value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-8 py-4 text-[11px] font-bold focus:ring-4 focus:ring-brand-yellow/5 focus:border-brand-yellow outline-none transition-all "
                                            placeholder="Remote / City"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-bold text-gray-900 uppercase tracking-wider block  px-4">Job Type (Modality)</label>
                                        <select
                                            value={formData.employment_type}
                                            onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-8 py-4 text-[11px] font-bold focus:ring-4 focus:ring-brand-yellow/5 focus:border-brand-yellow outline-none transition-all  appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23000000%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-[right_1.5rem_center] bg-no-repeat"
                                        >
                                            <option value="">Select Modality</option>
                                            <option value="Full-Time">Full-Time</option>
                                            <option value="Contract">Contract</option>
                                            <option value="Freelance">Freelance</option>
                                            <option value="Remote">Remote</option>
                                            <option value="Hybrid">Hybrid</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-bold text-gray-900 uppercase tracking-wider block  px-4">Job Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-8 py-4 text-[11px] font-bold focus:ring-4 focus:ring-brand-yellow/5 focus:border-brand-yellow outline-none transition-all  appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23000000%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-[right_1.5rem_center] bg-no-repeat"
                                        >
                                            <option value="">Select Category</option>
                                            <option value="Information Technology (IT)">Information Technology (IT)</option>
                                            <option value="Pharmaceutical & Healthcare">Pharmaceutical & Healthcare</option>
                                            <option value="Pharmacy & Clinical Operations">Pharmacy & Clinical Operations</option>
                                            <option value="Finance & Accounting">Finance & Accounting</option>
                                            <option value="Human Resources (HR)">Human Resources (HR)</option>
                                            <option value="Logistics & Supply Chain">Logistics & Supply Chain</option>
                                            <option value="Sales & Marketing">Sales & Marketing</option>
                                            <option value="Engineering & Maintenance">Engineering & Maintenance</option>
                                            <option value="Quality Assurance & Control">Quality Assurance & Control</option>
                                            <option value="Administrative & Management">Administrative & Management</option>
                                            <option value="Customer Service & Front Office">Customer Service & Front Office</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-bold text-gray-900 uppercase tracking-wider block  px-4">Categorization (Tags)</label>
                                        <input
                                            type="text" value={formData.tags}
                                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-8 py-4 text-[11px] font-bold focus:ring-4 focus:ring-brand-yellow/5 focus:border-brand-yellow outline-none transition-all "
                                            placeholder="Skills / Dept"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <label className="text-[9px] font-bold text-gray-900 uppercase tracking-wider block px-4 flex items-center gap-2">
                                            <GraduationCap className="w-3.5 h-3.5 text-brand-yellow" /> Education Level (Select Multiple)
                                        </label>
                                        <div className="flex flex-wrap gap-2 px-4">
                                            {EDUCATION_LEVELS.map(level => (
                                                <button
                                                    key={level}
                                                    type="button"
                                                    onClick={() => {
                                                        const current = formData.education_level;
                                                        const next = current.includes(level)
                                                            ? current.filter(l => l !== level)
                                                            : [...current, level];
                                                        setFormData({ ...formData, education_level: next });
                                                    }}
                                                    className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${formData.education_level.includes(level)
                                                        ? 'bg-gray-900 text-brand-yellow border-gray-900 shadow-lg scale-105'
                                                        : 'bg-gray-50 text-gray-400 border-gray-100 hover:border-gray-300'
                                                        }`}
                                                >
                                                    {level}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[9px] font-bold text-gray-900 uppercase tracking-wider block px-4 flex items-center gap-2">
                                            <Award className="w-3.5 h-3.5 text-brand-yellow" /> Experience Level (Select Multiple)
                                        </label>
                                        <div className="flex flex-wrap gap-2 px-4">
                                            {EXPERIENCE_LEVELS.map(level => (
                                                <button
                                                    key={level}
                                                    type="button"
                                                    onClick={() => {
                                                        const current = formData.experience_level;
                                                        const next = current.includes(level)
                                                            ? current.filter(l => l !== level)
                                                            : [...current, level];
                                                        setFormData({ ...formData, experience_level: next });
                                                    }}
                                                    className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${formData.experience_level.includes(level)
                                                        ? 'bg-gray-900 text-brand-yellow border-gray-900 shadow-lg scale-105'
                                                        : 'bg-gray-50 text-gray-400 border-gray-100 hover:border-gray-300'
                                                        }`}
                                                >
                                                    {level}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-6 pt-6 border-t border-gray-100">
                                        <label className="text-[9px] font-bold text-gray-900 uppercase tracking-wider block px-4 flex items-center gap-2">
                                            <Send className="w-3.5 h-3.5 text-brand-yellow" /> Executive Impact / Strategic Pillars (4 Items)
                                        </label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
                                            {[0, 1, 2, 3].map(index => (
                                                <div key={index} className="flex flex-col gap-2">
                                                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none">Pillar 0{index + 1}</span>
                                                    <input
                                                        type="text"
                                                        value={formData.core_requirements[index] || ''}
                                                        onChange={(e) => {
                                                            const next = [...formData.core_requirements];
                                                            next[index] = e.target.value;
                                                            setFormData({ ...formData, core_requirements: next });
                                                        }}
                                                        className="bg-gray-50 border border-gray-100 rounded-xl px-5 py-3 text-[10px] font-bold focus:ring-4 focus:ring-brand-yellow/5 focus:border-brand-yellow outline-none transition-all"
                                                        placeholder={`Requirement ${index + 1}...`}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-12">
                                {/* Control Center */}
                                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-xl relative overflow-hidden flex flex-col gap-8">
                                    <div className="flex items-center gap-3 border-b border-gray-50 pb-6">
                                        <Send className="w-4 h-4 text-brand-yellow rotate-45" />
                                        <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-900  ">Settings</h3>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="space-y-5">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block ">Post Status</label>
                                            <select
                                                value={formData.status}
                                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-8 py-5 text-xs font-bold focus:ring-4 focus:ring-brand-yellow/10 outline-none transition-all  uppercase"
                                            >
                                                <option value="created">Draft</option>
                                                <option value="posted">Live</option>
                                                <option value="closed">Closed</option>
                                            </select>
                                        </div>

                                        <div className="space-y-5">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block ">Application Deadline</label>
                                            <input
                                                type="date" value={formData.deadline}
                                                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-8 py-5 text-xs font-bold focus:ring-4 focus:ring-brand-yellow/10 outline-none transition-all  text-gray-900 uppercase"
                                            />
                                        </div>

                                        <div className="space-y-4 pt-4">
                                            <label className="flex items-center justify-between group cursor-pointer p-4 hover:bg-gray-50 rounded-2xl transition-all">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider  group-hover:text-gray-900 transition-colors">Show Internal</span>
                                                <input type="checkbox" checked={formData.is_internal} onChange={(e) => setFormData({ ...formData, is_internal: e.target.checked })} className="w-5 h-5 accent-brand-yellow rounded-lg" />
                                            </label>
                                            <label className="flex items-center justify-between group cursor-pointer p-4 hover:bg-gray-50 rounded-2xl transition-all">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider  group-hover:text-gray-900 transition-colors">Show Publicly</span>
                                                <input type="checkbox" checked={formData.is_external} onChange={(e) => setFormData({ ...formData, is_external: e.target.checked })} className="w-5 h-5 accent-brand-yellow rounded-lg" />
                                            </label>
                                        </div>
                                    </div>

                                    <button
                                        type="submit" disabled={submitting || success}
                                        className="w-full bg-gray-900 text-brand-yellow py-6 rounded-xl font-bold text-[10px] uppercase tracking-wider  hover:bg-brand-yellow hover:text-gray-900 transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.97] shadow-xl shadow-gray-900/10"
                                    >
                                        {submitting ? 'Saving...' : success ? 'Success!' : editingId ? 'Update Job' : 'Create Job'}
                                        {success ? <CheckCircle className="w-4 h-4" /> : <Send className="w-4 h-4 rotate-45" />}
                                    </button>

                                    {error && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
                                            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                                            <p className="text-[9px] font-bold text-red-500 uppercase tracking-wider  leading-relaxed">{error}</p>
                                        </motion.div>
                                    )}
                                </div>

                                <div className="p-12 bg-gray-50/50 rounded-[4rem] border border-gray-100 border-dashed flex flex-col items-center text-center group">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-50 mb-8 transition-transform group-hover:rotate-12">
                                        <Globe className="w-8 h-8 text-brand-yellow" />
                                    </div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider  text-gray-900 mb-4">Job Visibility</h4>
                                    <p className="text-[11px] text-gray-400  leading-relaxed font-medium">Jobs set to <span className="text-gray-900 font-bold">Live</span> are shown to applicants. <span className="text-gray-900 font-bold">Drafts</span> are only visible to the TA team.</p>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default JobConsole;
