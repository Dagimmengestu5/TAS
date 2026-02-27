import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Layout, Plus, Search, Edit2, Trash2, X, AlertCircle, Zap, ChevronRight, Building
} from 'lucide-react';
import api from '../api/api';

const ManageDepartments = () => {
    const [departments, setDepartments] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [form, setForm] = useState({ name: '', company_id: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [depsRes, compsRes] = await Promise.all([
                api.get('/departments'),
                api.get('/companies')
            ]);
            setDepartments(depsRes.data);
            setCompanies(compsRes.data);
        } catch (err) {
            setError('Failed to fetch departmental data.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (dept = null) => {
        if (dept) {
            setEditingDepartment(dept);
            setForm({ name: dept.name, company_id: dept.company_id });
        } else {
            setEditingDepartment(null);
            setForm({ name: '', company_id: companies.length > 0 ? companies[0].id : '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingDepartment(null);
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            if (editingDepartment) {
                const response = await api.put(`/departments/${editingDepartment.id}`, form);
                setDepartments(departments.map(d => d.id === editingDepartment.id ? response.data : d));
                setSuccess('Departmental node updated.');
            } else {
                const response = await api.post('/departments', form);
                setDepartments([...departments, response.data]);
                setSuccess('New department initialized.');
            }
            setTimeout(() => setSuccess(null), 3000);
            handleCloseModal();
        } catch (err) {
            setError(err.response?.data?.message || 'Operation failure.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('De-authorize department? This will affect requisitions linked to this node.')) return;
        try {
            await api.delete(`/departments/${id}`);
            setDepartments(departments.filter(d => d.id !== id));
            setSuccess('Department node removed.');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Deletion blocked by integrity guards.');
            setTimeout(() => setError(null), 3000);
        }
    };

    const filteredDepartments = departments.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.company?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-white min-h-screen w-full px-6 py-6 lg:px-10 font-['Outfit']">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic flex items-center gap-4">
                        <div className="w-2.5 h-8 bg-brand-yellow rounded-full"></div> Departmental Maps
                    </h1>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-yellow italic">{departments.length} Strategic Units</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Find departments..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-gray-50 border border-gray-100 rounded-xl py-3 pl-12 pr-6 text-[11px] font-bold uppercase tracking-widest text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-yellow/20 focus:border-brand-yellow transition-all w-full md:w-64"
                        />
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-gray-900 text-brand-yellow p-3 px-6 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-lg border border-gray-800 italic"
                    >
                        Initialize Unit <Plus className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {success && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6 p-4 bg-gray-900 border-l-4 border-brand-yellow rounded-xl shadow-xl flex items-center gap-4">
                        <Zap className="w-4 h-4 text-brand-yellow" />
                        <span className="text-[11px] font-black text-brand-yellow uppercase tracking-widest italic">{success}</span>
                    </motion.div>
                )}
                {error && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6 p-4 bg-red-500 rounded-xl shadow-xl flex items-center gap-4">
                        <AlertCircle className="w-5 h-5 text-white" />
                        <span className="text-[11px] font-black text-white uppercase tracking-widest italic">{error}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">Unit Name</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">Parent Entity</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            Array(5).fill(0).map((_, i) => <tr key={i} className="animate-pulse px-8 py-6"><td colSpan="3" className="h-12 bg-gray-50"></td></tr>)
                        ) : filteredDepartments.map((dept) => (
                            <tr key={dept.id} className="group hover:bg-gray-50/50 transition-all">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-brand-yellow font-black">
                                            <Layout className="w-5 h-5" />
                                        </div>
                                        <span className="text-[13px] font-black text-gray-900 uppercase italic">{dept.name}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 uppercase italic">
                                        <Building className="w-3.5 h-3.5" /> {dept.company?.name || 'Unlinked'}
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => handleOpenModal(dept)} className="p-2.5 bg-gray-50 hover:bg-gray-900 text-gray-400 hover:text-brand-yellow rounded-xl transition-all"><Edit2 className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(dept.id)} className="p-2.5 bg-gray-50 hover:bg-red-500 text-gray-400 hover:text-white rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleCloseModal} className="absolute inset-0 bg-gray-900/40 backdrop-blur-md"></motion.div>
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                            <div className="bg-gray-950 p-8 flex items-center justify-between">
                                <h2 className="text-xl font-black text-brand-yellow uppercase tracking-tight italic">{editingDepartment ? 'Modulate Unit' : 'New Strategic Unit'}</h2>
                                <button onClick={handleCloseModal} className="p-2 text-gray-500 hover:text-brand-yellow transition-colors"><X className="w-6 h-6" /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-10 space-y-8">
                                <div className="space-y-6">
                                    <div className="group">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] italic mb-2.5 block ml-1">Department Name</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Enter unit name..."
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-[13px] font-bold text-gray-900 uppercase italic focus:outline-none focus:ring-2 focus:ring-brand-yellow/10 focus:border-brand-yellow transition-all"
                                        />
                                    </div>
                                    <div className="group">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] italic mb-2.5 block ml-1">Parent Entity</label>
                                        <select
                                            required
                                            value={form.company_id}
                                            onChange={(e) => setForm({ ...form, company_id: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-[13px] font-black text-gray-900 uppercase italic appearance-none focus:outline-none focus:ring-2 focus:ring-brand-yellow/10 focus:border-brand-yellow transition-all"
                                        >
                                            {companies.map(comp => (
                                                <option key={comp.id} value={comp.id}>{comp.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button type="button" onClick={handleCloseModal} className="flex-1 py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest italic">Abort</button>
                                    <button type="submit" className="flex-[2] py-4 bg-gray-900 text-brand-yellow rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 italic">Deploy <ChevronRight className="w-4 h-4" /></button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageDepartments;
