import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, FileText, Building2, Send, ChevronLeft, ArrowRight, Zap, Target, Activity, ShieldCheck, History, LayoutGrid, Clock, CheckCircle, XCircle, Users, MessageSquare, Pencil, Trash2, Lock, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const ManagerPortal = () => {
    const navigate = useNavigate();
    const [view, setView] = useState('HUB'); // 'HUB', 'FORM', 'EDIT'
    const [requisitions, setRequisitions] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        company_id: '',
        department_id: '',
        category: 'Information Technology',
        location: 'Addis Ababa',
        employment_type: 'Full-time',
        jd: null
    });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [editingReq, setEditingReq] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null); // req to delete

    useEffect(() => {
        fetchRequisitions();
        fetchCompanies();
    }, []);

    const fetchRequisitions = async () => {
        try {
            setLoading(true);
            const response = await api.get('/requisitions');
            setRequisitions(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error('Fetch Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCompanies = async () => {
        try {
            const response = await api.get('/companies');
            setCompanies(response.data);
        } catch (err) {
            console.error('Fetch Companies Error:', err);
        }
    };

    const handleCompanyChange = async (companyId, currentForm, setForm) => {
        setForm({ ...currentForm, company_id: companyId, department_id: '' });
        if (!companyId) { setDepartments([]); return; }
        try {
            const response = await api.get(`/companies/${companyId}/departments`);
            setDepartments(response.data);
        } catch (err) {
            console.error('Fetch Departments Error:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key]) data.append(key, formData[key]);
            });
            await api.post('/requisitions', data, { headers: { 'Content-Type': 'multipart/form-data' } });
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                setView('HUB');
                fetchRequisitions();
                setFormData({ title: '', description: '', company_id: '', department_id: '', category: 'Information Technology', location: 'Addis Ababa', employment_type: 'Full-time', jd: null });
            }, 2500);
        } catch (err) {
            alert('Request submission failed. Check authorization or file size.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (req) => {
        setEditingReq({
            id: req.id,
            title: req.title,
            description: req.description,
            company_id: req.company_id || '',
            department_id: req.department_id || '',
            category: req.category || 'Information Technology',
            location: req.location || 'Addis Ababa',
            employment_type: req.employment_type || 'Full-time',
            jd: null,
            existing_jd: req.jd_path,
        });
        // Pre-load departments for the company
        if (req.company_id) {
            api.get(`/companies/${req.company_id}/departments`).then(r => setDepartments(r.data)).catch(() => { });
        }
        setView('EDIT');
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const data = new FormData();
            ['title', 'description', 'company_id', 'department_id', 'category', 'location', 'employment_type'].forEach(key => {
                if (editingReq[key]) data.append(key, editingReq[key]);
            });
            if (editingReq.jd) data.append('jd', editingReq.jd);

            await api.post(`/requisitions/${editingReq.id}/update`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                setView('HUB');
                setEditingReq(null);
                fetchRequisitions();
            }, 2000);
        } catch (err) {
            const msg = err.response?.data?.message || 'Update failed.';
            alert(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (req) => {
        try {
            await api.delete(`/requisitions/${req.id}`);
            setDeleteConfirm(null);
            setRequisitions(prev => prev.filter(r => r.id !== req.id));
        } catch (err) {
            const msg = err.response?.data?.message || 'Delete failed.';
            alert(msg);
            setDeleteConfirm(null);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'text-green-500 bg-green-50 border-green-100';
            case 'rejected': return 'text-red-500 bg-red-50 border-red-100';
            case 'pending_hr':
            case 'pending_ceo': return 'text-amber-500 bg-amber-50 border-amber-100';
            default: return 'text-gray-500 bg-gray-50 border-gray-100';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'approved': return 'AUTHORIZED';
            case 'rejected': return 'REJECTED';
            case 'pending_hr': return 'PENDING HR';
            case 'pending_ceo': return 'PENDING CEO';
            default: return status?.toUpperCase() || 'UNKNOWN';
        }
    };

    // Shared form fields used by both Create and Edit
    const RequisitionFormFields = ({ data, setData, isEdit = false }) => (
        <div className="space-y-10">
            <div className="space-y-4">
                <label className="text-[9px] font-black text-gray-900 uppercase tracking-widest px-4 flex items-center gap-3 italic">
                    <FileText className="w-5 h-5 text-brand-yellow" /> Requisition Designation
                </label>
                <input
                    type="text" required
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-black text-lg uppercase tracking-tight transition-all focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-yellow/5 focus:border-brand-yellow text-gray-900 placeholder:text-gray-200 shadow-inner italic"
                    placeholder="POSITION TITLE"
                    value={data.title}
                    onChange={e => setData({ ...data, title: e.target.value })}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <label className="text-[9px] font-black text-gray-900 uppercase tracking-widest px-4 flex items-center gap-3 italic">
                        <Building2 className="w-5 h-5 text-brand-yellow" /> Enterprise Unit
                    </label>
                    <div className="relative">
                        <select
                            required
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-black text-[11px] uppercase tracking-widest transition-all focus:bg-white focus:border-brand-yellow focus:ring-4 focus:ring-brand-yellow/5 focus:outline-none text-gray-900 appearance-none cursor-pointer shadow-inner italic"
                            value={data.company_id}
                            onChange={e => handleCompanyChange(e.target.value, data, setData)}
                        >
                            <option value="">SELECT COMPANY</option>
                            {companies.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
                        </select>
                        <ArrowRight className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none rotate-90" />
                    </div>
                </div>
                <div className="space-y-4">
                    <label className="text-[9px] font-black text-gray-900 uppercase tracking-widest px-4 flex items-center gap-3 italic">
                        <Target className="w-5 h-5 text-brand-yellow" /> Active Department
                    </label>
                    <div className="relative">
                        <select
                            required
                            disabled={!data.company_id}
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-black text-[11px] uppercase tracking-widest transition-all focus:bg-white focus:border-brand-yellow focus:ring-4 focus:ring-brand-yellow/5 focus:outline-none text-gray-900 appearance-none cursor-pointer shadow-inner italic disabled:opacity-50"
                            value={data.department_id}
                            onChange={e => setData({ ...data, department_id: e.target.value })}
                        >
                            <option value="">{data.company_id ? 'SELECT DEPARTMENT' : 'AWAITING SELECTION'}</option>
                            {departments.map(d => (<option key={d.id} value={d.id}>{d.name}</option>))}
                        </select>
                        <ArrowRight className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none rotate-90" />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <label className="text-[9px] font-black text-gray-900 uppercase tracking-widest px-4 flex items-center gap-3 italic">
                    <ShieldCheck className="w-5 h-5 text-brand-yellow" /> Job Description Matrix (PDF/DOC)
                    {isEdit && data.existing_jd && <span className="text-[8px] text-green-500 normal-case font-bold ml-1">• Current file exists</span>}
                </label>
                <div className="relative group">
                    <input
                        type="file"
                        onChange={e => setData({ ...data, jd: e.target.files[0] })}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    />
                    <div className="bg-gray-50 border-2 border-dashed border-gray-100 rounded-[2rem] p-10 flex flex-col items-center justify-center transition-all group-hover:border-brand-yellow group-hover:bg-white shadow-inner group-hover:shadow-2xl group-hover:shadow-brand-yellow/10">
                        <PlusCircle className="w-10 h-10 text-gray-200 group-hover:text-brand-yellow mb-3 transition-all group-hover:scale-110" />
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] group-hover:text-gray-900 transition-colors italic">
                            {data.jd ? data.jd.name : isEdit ? 'Replace JD file (optional)' : 'Synchronize JD File'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <label className="text-[9px] font-black text-gray-900 uppercase tracking-widest px-4 flex items-center gap-3 italic">
                    <Activity className="w-5 h-5 text-brand-yellow" /> Strategic Narrative
                </label>
                <textarea
                    rows="5" required
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-6 font-bold text-xs leading-relaxed uppercase tracking-widest transition-all focus:bg-white focus:border-brand-yellow focus:ring-4 focus:ring-brand-yellow/5 focus:outline-none text-gray-900 shadow-inner italic"
                    placeholder="STRATEGIC INTENT..."
                    value={data.description}
                    onChange={e => setData({ ...data, description: e.target.value })}
                />
            </div>
        </div>
    );

    return (
        <div className="bg-white min-h-screen w-full px-8 py-8 md:px-12 font-['Outfit'] selection:bg-brand-yellow/30">
            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setDeleteConfirm(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl border border-gray-100"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-6 mx-auto border border-red-100">
                                <AlertTriangle className="w-7 h-7 text-red-500" />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tight text-center mb-2">Delete Requisition?</h3>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold text-center italic mb-8 leading-relaxed">
                                "{deleteConfirm.title}" will be permanently removed from the system.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="flex-1 py-4 bg-gray-50 text-gray-400 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-gray-100 transition-all italic border border-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(deleteConfirm)}
                                    className="flex-1 py-4 bg-red-500 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-red-600 transition-all italic shadow-lg shadow-red-500/20"
                                >
                                    Confirm Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 max-w-[1200px] mx-auto">
                <div className="flex flex-col">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase italic leading-none flex items-center gap-4">
                        <Building2 className="w-8 h-8 text-brand-yellow" />
                        Manager Hub
                    </h1>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="w-1.5 h-1.5 bg-brand-yellow rounded-full animate-pulse shadow-[0_0_8px_#FFF200]"></div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Strategic Requisition Layer</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => { setView(view === 'HUB' ? 'FORM' : 'HUB'); setEditingReq(null); setSuccess(false); }}
                        className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all italic border shadow-sm active:scale-95 ${view === 'HUB'
                            ? 'bg-gray-900 text-brand-yellow border-gray-800 hover:bg-black'
                            : 'bg-white text-gray-900 border-gray-100 hover:bg-gray-50'
                            }`}
                    >
                        {view === 'HUB' ? (
                            <><PlusCircle className="w-4 h-4" /> Initialize Request</>
                        ) : (
                            <><History className="w-4 h-4" /> Request History</>
                        )}
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {/* HUB VIEW */}
                {view === 'HUB' && (
                    <motion.div
                        key="hub-view"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="max-w-[1200px] mx-auto"
                    >
                        {/* Statistics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            <div className="bg-gray-50 border border-gray-100 rounded-[2rem] p-8 flex flex-col group hover:bg-white hover:border-brand-yellow hover:shadow-xl hover:shadow-brand-yellow/5 transition-all">
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4 group-hover:text-brand-yellow transition-colors italic">Active Requisitions</span>
                                <div className="flex items-end justify-between">
                                    <span className="text-4xl font-black text-gray-900 italic">{requisitions.filter(r => r.status !== 'rejected').length}</span>
                                    <Zap className="w-6 h-6 text-gray-200 group-hover:text-brand-yellow transition-colors" />
                                </div>
                            </div>
                            <div className="bg-gray-50 border border-gray-100 rounded-[2rem] p-8 flex flex-col group hover:bg-white hover:border-brand-yellow hover:shadow-xl hover:shadow-brand-yellow/5 transition-all">
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4 group-hover:text-brand-yellow transition-colors italic">Candidate Uplink</span>
                                <div className="flex items-end justify-between">
                                    <span className="text-4xl font-black text-gray-900 italic">{requisitions.reduce((acc, r) => acc + (r.total_applications || 0), 0)}</span>
                                    <Users className="w-6 h-6 text-gray-200 group-hover:text-brand-yellow transition-colors" />
                                </div>
                            </div>
                            <div className="bg-gray-50 border border-gray-100 rounded-[2rem] p-8 flex flex-col group hover:bg-white hover:border-brand-yellow hover:shadow-xl hover:shadow-brand-yellow/5 transition-all">
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4 group-hover:text-brand-yellow transition-colors italic">Interview Status</span>
                                <div className="flex items-end justify-between">
                                    <span className="text-4xl font-black text-gray-900 italic">{requisitions.reduce((acc, r) => acc + (r.interview_count || 0), 0)}</span>
                                    <MessageSquare className="w-6 h-6 text-gray-200 group-hover:text-brand-yellow transition-colors" />
                                </div>
                            </div>
                        </div>

                        {/* Recent History Table */}
                        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                                <div className="flex items-center gap-4">
                                    <History className="w-5 h-5 text-brand-yellow" />
                                    <h2 className="font-black text-[13px] uppercase tracking-widest text-gray-900 italic">Requisition Log</h2>
                                </div>
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">{requisitions.length} ENTRIES</span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50/50">
                                        <tr>
                                            <th className="px-10 py-5 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Designation</th>
                                            <th className="px-10 py-5 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Timeline</th>
                                            <th className="px-10 py-5 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Auth Status</th>
                                            <th className="px-10 py-5 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] italic text-center">Applicants</th>
                                            <th className="px-10 py-5 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] italic text-center">Interviews</th>
                                            <th className="px-10 py-5 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] italic text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {loading ? (
                                            <tr>
                                                <td colSpan="6" className="px-10 py-20 text-center">
                                                    <div className="flex flex-col items-center gap-4">
                                                        <div className="w-8 h-8 border-2 border-brand-yellow border-t-transparent rounded-full animate-spin"></div>
                                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">Synchronizing Logs...</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : requisitions.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="px-10 py-20 text-center">
                                                    <div className="flex flex-col items-center gap-4">
                                                        <XCircle className="w-10 h-10 text-gray-100" />
                                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">No requisition nodes detected.</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            <AnimatePresence>
                                                {requisitions.map((req) => {
                                                    const canEdit = req.status === 'pending_hr';
                                                    return (
                                                        <motion.tr
                                                            key={req.id}
                                                            layout
                                                            exit={{ opacity: 0, x: -20 }}
                                                            className="group hover:bg-gray-50/50 transition-colors"
                                                        >
                                                            <td className="px-10 py-6">
                                                                <div className="flex flex-col">
                                                                    <span className="font-black text-[13px] text-gray-900 uppercase italic tracking-tight mb-1 group-hover:text-brand-yellow transition-colors">{req.title}</span>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest italic">{req.company?.name || 'N/A'}</span>
                                                                        <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                                                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest italic">{req.department?.name || 'N/A'}</span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-10 py-6">
                                                                <div className="flex items-center gap-2 text-gray-400">
                                                                    <Clock className="w-3 h-3" />
                                                                    <span className="text-[10px] font-black uppercase tracking-tight italic">{new Date(req.created_at).toLocaleDateString()}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-10 py-6">
                                                                <div className={`inline-flex px-3 py-1.5 rounded-lg border text-[8px] font-black uppercase tracking-widest italic ${getStatusColor(req.status)}`}>
                                                                    {getStatusLabel(req.status)}
                                                                </div>
                                                            </td>
                                                            <td className="px-10 py-6 text-center">
                                                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gray-50 text-gray-900 text-[11px] font-black italic border border-gray-100">
                                                                    {req.total_applications || 0}
                                                                </span>
                                                            </td>
                                                            <td className="px-10 py-6 text-center text-brand-yellow">
                                                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gray-900 border border-gray-800 text-[11px] font-black shadow-lg italic">
                                                                    {req.interview_count || 0}
                                                                </span>
                                                            </td>
                                                            <td className="px-10 py-6">
                                                                <div className="flex items-center justify-center gap-2">
                                                                    {canEdit ? (
                                                                        <>
                                                                            <button
                                                                                onClick={() => handleEdit(req)}
                                                                                title="Edit (only while pending HR review)"
                                                                                className="w-8 h-8 rounded-lg bg-brand-yellow/10 border border-brand-yellow/20 flex items-center justify-center text-brand-yellow hover:bg-brand-yellow hover:text-black transition-all"
                                                                            >
                                                                                <Pencil className="w-3.5 h-3.5" />
                                                                            </button>
                                                                            <button
                                                                                onClick={() => setDeleteConfirm(req)}
                                                                                title="Delete (only while pending HR review)"
                                                                                className="w-8 h-8 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-all"
                                                                            >
                                                                                <Trash2 className="w-3.5 h-3.5" />
                                                                            </button>
                                                                        </>
                                                                    ) : (
                                                                        <div title="Locked — HR has acted on this requisition" className="flex items-center gap-1.5 text-gray-200">
                                                                            <Lock className="w-3 h-3" />
                                                                            <span className="text-[7px] font-black uppercase tracking-widest italic">Locked</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </motion.tr>
                                                    );
                                                })}
                                            </AnimatePresence>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* CREATE FORM VIEW */}
                {view === 'FORM' && (
                    <motion.div
                        key="form-view"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="bg-white rounded-[2.5rem] border border-gray-100 p-10 md:p-12 shadow-sm relative overflow-hidden mx-auto max-w-[800px]"
                    >
                        {success ? (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
                                <div className="w-20 h-20 bg-gray-900 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl border border-gray-800 animate-bounce">
                                    <Send className="w-8 h-8 text-brand-yellow" />
                                </div>
                                <h2 className="text-3xl font-black mb-4 uppercase tracking-tight text-gray-900 italic leading-none">Transmission Complete</h2>
                                <p className="text-gray-400 font-bold uppercase text-[9px] tracking-widest max-w-sm mx-auto leading-relaxed italic bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-inner">
                                    Resource packet synchronized with executive authorization pipeline.
                                </p>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-10 relative z-10 font-['Outfit']">
                                <RequisitionFormFields data={formData} setData={setFormData} />
                                <div className="flex gap-4 pt-6">
                                    <button
                                        type="button" onClick={() => setView('HUB')}
                                        className="flex-1 py-5 bg-gray-50 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all italic border border-gray-100"
                                    >Abort</button>
                                    <button
                                        type="submit" disabled={submitting}
                                        className="flex-[2] bg-gray-900 text-brand-yellow py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl border border-gray-800 italic group/btn active:scale-95"
                                    >
                                        {submitting ? 'SYNCHRONIZING...' : 'EXECUTE INITIALIZATION'} <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </form>
                        )}
                    </motion.div>
                )}

                {/* EDIT FORM VIEW */}
                {view === 'EDIT' && editingReq && (
                    <motion.div
                        key="edit-view"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="bg-white rounded-[2.5rem] border border-gray-100 p-10 md:p-12 shadow-sm relative overflow-hidden mx-auto max-w-[800px]"
                    >
                        <div className="flex items-center gap-3 mb-10 pb-6 border-b border-gray-100">
                            <div className="w-10 h-10 bg-brand-yellow/10 rounded-xl border border-brand-yellow/20 flex items-center justify-center">
                                <Pencil className="w-5 h-5 text-brand-yellow" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-gray-900 uppercase italic tracking-tight">Modify Requisition</h2>
                                <p className="text-[8px] font-black text-amber-500 uppercase tracking-widest italic">Editable only while Pending HR Review</p>
                            </div>
                        </div>

                        {success ? (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
                                <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl border border-green-100">
                                    <CheckCircle className="w-8 h-8 text-green-500" />
                                </div>
                                <h2 className="text-2xl font-black mb-4 uppercase tracking-tight text-gray-900 italic">Update Confirmed</h2>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleEditSubmit} className="space-y-10 relative z-10 font-['Outfit']">
                                <RequisitionFormFields data={editingReq} setData={setEditingReq} isEdit={true} />
                                <div className="flex gap-4 pt-6">
                                    <button
                                        type="button" onClick={() => { setView('HUB'); setEditingReq(null); }}
                                        className="flex-1 py-5 bg-gray-50 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all italic border border-gray-100"
                                    >Cancel</button>
                                    <button
                                        type="submit" disabled={submitting}
                                        className="flex-[2] bg-brand-yellow text-black py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black hover:text-brand-yellow transition-all flex items-center justify-center gap-3 shadow-xl border border-brand-yellow italic group/btn active:scale-95"
                                    >
                                        {submitting ? 'UPDATING...' : 'SAVE MODIFICATIONS'} <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </form>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManagerPortal;
