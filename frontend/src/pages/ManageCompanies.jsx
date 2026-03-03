import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Building2, Plus, Search, Edit2, Trash2, X, AlertCircle, Zap, ChevronRight
} from 'lucide-react';
import api from '../api/api';

const ManageCompanies = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCompany, setEditingCompany] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [form, setForm] = useState({ name: '' });

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            setLoading(true);
            const response = await api.get('/companies');
            setCompanies(response.data);
        } catch (err) {
            setError('Failed to fetch company ledger.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (company = null) => {
        if (company) {
            setEditingCompany(company);
            setForm({ name: company.name });
        } else {
            setEditingCompany(null);
            setForm({ name: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCompany(null);
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            if (editingCompany) {
                const response = await api.put(`/companies/${editingCompany.id}`, form);
                setCompanies(companies.map(c => c.id === editingCompany.id ? response.data : c));
                setSuccess('Company identity updated.');
            } else {
                const response = await api.post('/companies', form);
                setCompanies([...companies, response.data]);
                setSuccess('New company initialized.');
            }
            setTimeout(() => setSuccess(null), 3000);
            handleCloseModal();
        } catch (err) {
            setError(err.response?.data?.message || 'Operation failed.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Terminate company entry? This will affect all associated departments.')) return;
        try {
            await api.delete(`/companies/${id}`);
            setCompanies(companies.filter(c => c.id !== id));
            setSuccess('Company entry removed.');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Deletion blocked.');
            setTimeout(() => setError(null), 3000);
        }
    };

    const filteredCompanies = companies.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-white min-h-screen w-full px-6 py-6 lg:px-10 ">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold text-gray-900  uppercase  flex items-center gap-4">
                        <div className="w-2.5 h-8 bg-brand-yellow rounded-full"></div> Company Ledger
                    </h1>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-yellow ">{companies.length} Registered Entities</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Scan entities..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-gray-50 border border-gray-100 rounded-xl py-3 pl-12 pr-6 text-[11px] font-bold uppercase tracking-wider text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-yellow/20 focus:border-brand-yellow transition-all w-full md:w-64"
                        />
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-gray-900 text-brand-yellow p-3 px-6 rounded-xl font-bold text-[11px] uppercase tracking-wider flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-lg border border-gray-800 "
                    >
                        New Entity <Plus className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {success && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6 p-4 bg-gray-900 border-l-4 border-brand-yellow rounded-xl shadow-xl flex items-center gap-4">
                        <Zap className="w-4 h-4 text-brand-yellow" />
                        <span className="text-[11px] font-bold text-brand-yellow uppercase tracking-wider ">{success}</span>
                    </motion.div>
                )}
                {error && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6 p-4 bg-red-500 rounded-xl shadow-xl flex items-center gap-4">
                        <AlertCircle className="w-5 h-5 text-white" />
                        <span className="text-[11px] font-bold text-white uppercase tracking-wider ">{error}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    Array(3).fill(0).map((_, i) => <div key={i} className="h-40 bg-gray-50 animate-pulse rounded-3xl" />)
                ) : filteredCompanies.map((company) => (
                    <motion.div
                        key={company.id}
                        layout
                        className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-full bg-gray-50/50 skew-x-[30deg] translate-x-16 group-hover:translate-x-12 transition-transform"></div>
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-6">
                                <div className="p-4 bg-gray-900 rounded-2xl text-brand-yellow shadow-lg group-hover:scale-110 transition-transform">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleOpenModal(company)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-900"><Edit2 className="w-4 h-4" /></button>
                                    <button onClick={() => handleDelete(company.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 uppercase  tracking-tight mb-2">{company.name}</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ">ID: {company.id} • Registered</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleCloseModal} className="absolute inset-0 bg-gray-900/40 backdrop-blur-md"></motion.div>
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative overflow-hidden border border-gray-100">
                            <div className="bg-gray-950 p-8 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-brand-yellow uppercase tracking-tight ">{editingCompany ? 'Modify Entity' : 'New Entity'}</h2>
                                <button onClick={handleCloseModal} className="p-2 text-gray-500 hover:text-brand-yellow transition-colors"><X className="w-6 h-6" /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-10 space-y-8">
                                <div className="group">
                                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider  mb-2.5 block ml-1">Company Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Enter entity name..."
                                        value={form.name}
                                        onChange={(e) => setForm({ name: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-[13px] font-bold text-gray-900 uppercase  focus:outline-none focus:ring-2 focus:ring-brand-yellow/10 focus:border-brand-yellow transition-all"
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <button type="button" onClick={handleCloseModal} className="flex-1 py-4 bg-gray-50 text-gray-400 rounded-2xl font-bold text-[10px] uppercase tracking-wider ">Abort</button>
                                    <button type="submit" className="flex-[2] py-4 bg-gray-900 text-brand-yellow rounded-2xl font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-3 ">Execute <ChevronRight className="w-4 h-4" /></button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageCompanies;
