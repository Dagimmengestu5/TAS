import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, UserPlus, Search, Filter, MoreVertical,
    Edit2, Trash2, Mail, Shield, ShieldCheck,
    X, Check, AlertCircle, Clock, Zap, ChevronRight,
    Lock, Key, ShieldAlert
} from 'lucide-react';
import api from '../api/api';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        role_id: '',
        company_id: '',
        department_id: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [usersRes, rolesRes, compsRes, depsRes] = await Promise.all([
                api.get('/users'),
                api.get('/roles'),
                api.get('/companies'),
                api.get('/departments')
            ]);
            setUsers(usersRes.data);
            setRoles(rolesRes.data);
            setCompanies(compsRes.data);
            setDepartments(depsRes.data);
        } catch (err) {
            setError('Telemetry disruption: Failed to synchronize user grid.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setForm({
                name: user.name,
                email: user.email,
                password: '',
                role_id: user.role_id,
                company_id: user.company_id || '',
                department_id: user.department_id || ''
            });
        } else {
            setEditingUser(null);
            setForm({
                name: '',
                email: '',
                password: '',
                role_id: (roles && roles.length > 0) ? roles[0].id : '',
                company_id: '',
                department_id: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            if (editingUser) {
                const payload = { ...form };
                if (!payload.password) delete payload.password;
                const response = await api.put(`/users/${editingUser.id}`, payload);
                setUsers(users.map(u => u.id === editingUser.id ? response.data : u));
                setSuccess('Node modulation complete: Identity matrix updated.');
            } else {
                const response = await api.post('/users', form);
                setUsers([...users, response.data]);
                setSuccess('New node initialized: Identity registered to cluster.');
            }
            setTimeout(() => setSuccess(null), 3000);
            handleCloseModal();
        } catch (err) {
            setError(err.response?.data?.message || 'Protocol failure: Operation aborted.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('WARNING: Permanent de-authorization. Proceed with node termination?')) return;
        try {
            await api.delete(`/users/${id}`);
            setUsers(users.filter(u => u.id !== id));
            setSuccess('Node terminated: Local grid entry removed.');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Shield breach: Node termination blocked.');
            setTimeout(() => setError(null), 3000);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.company?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.department?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-white min-h-screen w-full px-6 py-6 lg:px-10 font-['Outfit'] selection:bg-brand-yellow/30">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic flex items-center gap-4">
                        <div className="w-2.5 h-8 bg-brand-yellow rounded-full"></div> Identity Matrix
                    </h1>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-brand-yellow" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic">Central Node Control</span>
                        </div>
                        <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-yellow italic">{users.length} Active Nodes</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-yellow transition-colors" />
                        <input
                            type="text"
                            placeholder="Scan identities..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-gray-50 border border-gray-100 rounded-xl py-3 pl-12 pr-6 text-[11px] font-bold uppercase tracking-widest text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-yellow/20 focus:border-brand-yellow transition-all w-full md:w-64"
                        />
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-gray-900 text-brand-yellow p-3 px-6 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-lg border border-gray-800 italic group"
                    >
                        Initialize Node <UserPlus className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Alert Notifications */}
            <AnimatePresence>
                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="mb-8 p-4 bg-gray-900 border-l-4 border-brand-yellow rounded-xl shadow-xl flex items-center gap-4 overflow-hidden relative"
                    >
                        <div className="absolute top-0 right-0 w-32 h-full bg-brand-yellow/5 skew-x-[30deg] translate-x-16"></div>
                        <div className="w-8 h-8 rounded-lg bg-brand-yellow/10 flex items-center justify-center">
                            <Zap className="w-4 h-4 text-brand-yellow" />
                        </div>
                        <span className="text-[11px] font-black text-brand-yellow uppercase tracking-widest italic">{success}</span>
                    </motion.div>
                )}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="mb-8 p-4 bg-red-500 rounded-xl shadow-xl flex items-center gap-4 border border-red-400"
                    >
                        <AlertCircle className="w-5 h-5 text-white" />
                        <span className="text-[11px] font-black text-white uppercase tracking-widest italic">{error}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Users Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">Node Entity</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">Structural Unit</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">Access Vector</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">Registration</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">Protocols</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-8 py-6"><div className="h-4 bg-gray-100 rounded w-48"></div></td>
                                        <td className="px-8 py-6"><div className="h-4 bg-gray-100 rounded w-24"></div></td>
                                        <td className="px-8 py-6"><div className="h-4 bg-gray-100 rounded w-32"></div></td>
                                        <td className="px-8 py-6 flex justify-end"><div className="h-8 bg-gray-100 rounded w-20"></div></td>
                                    </tr>
                                ))
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center">
                                        <EyeOff className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">No matching identities detected in cluster buffer.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="group hover:bg-gray-50/50 transition-all duration-300">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-brand-yellow font-black text-md shadow-lg border border-gray-800 transition-transform group-hover:scale-110 relative overflow-hidden">
                                                    <div className="absolute top-0 left-0 w-full h-[1.5px] bg-brand-yellow group-hover:animate-shimmer"></div>
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[13px] font-black text-gray-900 uppercase tracking-tight italic leading-none mb-1.5 group-hover:text-brand-yellow transition-colors">{user.name}</span>
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 italic">
                                                        <Mail className="w-3 h-3" /> {user.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-gray-900 uppercase italic mb-1">{user.company?.name || 'GENERIC'}</span>
                                                <span className="text-[8px] font-black text-brand-yellow uppercase tracking-widest italic">{user.department?.name || 'UNASSIGNED'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-900 border border-gray-800 rounded-lg shadow-sm">
                                                <div className="w-1.5 h-1.5 bg-brand-yellow rounded-full animate-pulse"></div>
                                                <span className="text-[9px] font-black text-brand-yellow uppercase tracking-[0.2em] italic">{user.role?.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight italic flex items-center gap-2">
                                                    <Clock className="w-3.5 h-3.5" /> Synchronized
                                                </span>
                                                <span className="text-[9px] font-black text-gray-900 uppercase tracking-widest mt-1 italic">{new Date(user.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end items-center gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(user)}
                                                    className="p-2.5 bg-gray-50 hover:bg-gray-900 text-gray-400 hover:text-brand-yellow rounded-xl transition-all border border-gray-100 hover:border-gray-800 active:scale-90"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="p-2.5 bg-gray-50 hover:bg-red-500 text-gray-400 hover:text-white rounded-xl transition-all border border-gray-100 hover:border-red-400 active:scale-90"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Technical Footer Area */}
            <div className="mt-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-50 rounded-lg">
                        <Shield className="w-4 h-4 text-gray-400" />
                    </div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] italic">Ecosystem Encryption Layer Active</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-[1px] w-24 bg-gray-100"></div>
                    <span className="text-[9px] font-black text-brand-yellow uppercase tracking-widest italic animate-pulse">Live Uplink</span>
                </div>
            </div>

            {/* Add/Edit User Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 sm:p-0">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleCloseModal}
                            className="absolute inset-0 bg-gray-900/40 backdrop-blur-md"
                        ></motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative overflow-hidden border border-gray-100"
                        >
                            {/* Modal Header */}
                            <div className="bg-gray-950 p-8 flex items-center justify-between relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-48 h-full bg-brand-yellow/5 skew-x-[30deg] translate-x-24"></div>
                                <div className="flex flex-col gap-1.5 relative z-10">
                                    <h2 className="text-xl font-black text-brand-yellow uppercase tracking-tight italic leading-none">
                                        {editingUser ? 'Modulate Node' : 'Initialize Node'}
                                    </h2>
                                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] italic">Protocol ID: {editingUser?.id || 'NEW_ENTRY'}</span>
                                </div>
                                <button
                                    onClick={handleCloseModal}
                                    className="p-3 bg-white/5 hover:bg-white/10 text-gray-500 hover:text-brand-yellow rounded-2xl transition-all active:scale-95 border border-white/5"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <form onSubmit={handleSubmit} className="p-10 space-y-8">
                                <div className="space-y-6">
                                    <div className="group">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] italic mb-2.5 block ml-1 group-focus-within:text-brand-yellow transition-colors">Nominal Identifier</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                required
                                                placeholder="User handle..."
                                                value={form.name}
                                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-[13px] font-bold text-gray-900 uppercase italic placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-yellow/10 focus:border-brand-yellow transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="group">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] italic mb-2.5 block ml-1 group-focus-within:text-brand-yellow transition-colors">Transmission Uplink</label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                required
                                                placeholder="Email gateway..."
                                                value={form.email}
                                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-[13px] font-bold text-gray-900 uppercase italic placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-yellow/10 focus:border-brand-yellow transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="group">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] italic mb-2.5 block ml-1 group-focus-within:text-brand-yellow transition-colors">Access Key {editingUser && '(Keep empty to maintain current)'}</label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                required={!editingUser}
                                                placeholder="Encrypted string..."
                                                value={form.password}
                                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-[13px] font-bold text-gray-900 uppercase italic placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-yellow/10 focus:border-brand-yellow transition-all"
                                            />
                                            <Lock className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-200 group-focus-within:text-brand-yellow transition-colors" />
                                        </div>
                                    </div>

                                    <div className="group">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] italic mb-2.5 block ml-1 group-focus-within:text-brand-yellow transition-colors">Authorization Vector</label>
                                        <div className="relative">
                                            <select
                                                required
                                                value={form.role_id}
                                                onChange={(e) => setForm({ ...form, role_id: e.target.value })}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-[13px] font-black text-gray-900 uppercase italic appearance-none focus:outline-none focus:ring-2 focus:ring-brand-yellow/10 focus:border-brand-yellow transition-all cursor-pointer"
                                            >
                                                {roles.map(role => (
                                                    <option key={role.id} value={role.id}>{role.name}</option>
                                                ))}
                                            </select>
                                            <Key className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-200 pointer-events-none" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="group">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] italic mb-2.5 block ml-1 group-focus-within:text-brand-yellow transition-colors">Company Node</label>
                                            <select
                                                value={form.company_id}
                                                onChange={(e) => setForm({ ...form, company_id: e.target.value, department_id: '' })}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-[11px] font-black text-gray-900 uppercase italic focus:ring-2 focus:ring-brand-yellow/10 transition-all cursor-pointer"
                                            >
                                                <option value="">N/A</option>
                                                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="group">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] italic mb-2.5 block ml-1 group-focus-within:text-brand-yellow transition-colors">Unit Node</label>
                                            <select
                                                value={form.department_id}
                                                disabled={!form.company_id}
                                                onChange={(e) => setForm({ ...form, department_id: e.target.value })}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-[11px] font-black text-gray-900 uppercase italic focus:ring-2 focus:ring-brand-yellow/10 transition-all cursor-pointer disabled:opacity-50"
                                            >
                                                <option value="">N/A</option>
                                                {departments
                                                    .filter(d => d.company_id == form.company_id)
                                                    .map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="flex-1 py-4.5 bg-gray-50 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all italic border border-gray-100"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] py-4.5 bg-gray-900 text-brand-yellow rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-brand-yellow/5 border border-gray-800 flex items-center justify-center gap-3 italic group/btn"
                                    >
                                        Execute Command <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserManagement;
