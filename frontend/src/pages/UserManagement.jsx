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

    const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);
    const [resettingUser, setResettingUser] = useState(null);
    const [resetPasswordForm, setResetPasswordForm] = useState({ password: '' });
    const [resetLoading, setResetLoading] = useState(false);
    const [resetError, setResetError] = useState(null);
    const [resetSuccess, setResetSuccess] = useState(null);

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

    const handleOpenResetPassword = (user) => {
        setResettingUser(user);
        setResetPasswordForm({ password: '' });
        setResetError(null);
        setResetSuccess(null);
        setIsPasswordResetOpen(true);
    };

    const handleResetPasswordSubmit = async (e) => {
        e.preventDefault();
        setResetError(null);
        setResetSuccess(null);
        setResetLoading(true);

        try {
            await api.put(`/users/${resettingUser.id}`, {
                name: resettingUser.name,
                email: resettingUser.email,
                role_id: resettingUser.role_id,
                company_id: resettingUser.company_id,
                department_id: resettingUser.department_id,
                password: resetPasswordForm.password
            });
            setResetSuccess('Node access key forcibly rotated successfully.');
            setTimeout(() => {
                setIsPasswordResetOpen(false);
                setResettingUser(null);
                setResetSuccess(null);
            }, 2000);
        } catch (err) {
            setResetError(err.response?.data?.message || 'Protocol failure: Key rotation aborted.');
        } finally {
            setResetLoading(false);
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
        <div className="bg-white min-h-screen w-full px-6 py-6 lg:px-10  selection:bg-brand-yellow/30">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-gray-900  uppercase  flex items-center gap-3">
                        <div className="w-2 h-6 bg-brand-yellow rounded-full"></div> User Management
                    </h1>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-brand-yellow" />
                            <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 ">Administration</span>
                        </div>
                        <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-brand-yellow ">{users.length} Active Users</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-brand-yellow transition-colors" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-[10px] font-bold uppercase tracking-wider text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-yellow/10 focus:border-brand-yellow transition-all w-full md:w-56"
                        />
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-gray-900 text-brand-yellow py-2.5 px-5 rounded-xl font-bold text-[10px] uppercase tracking-wider flex items-center gap-2.5 hover:scale-105 active:scale-95 transition-all shadow-md border border-gray-800  group"
                    >
                        Add User <UserPlus className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
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
                        <span className="text-[11px] font-bold text-brand-yellow uppercase tracking-wider ">{success}</span>
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
                        <span className="text-[11px] font-bold text-white uppercase tracking-wider ">{error}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Users Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-[9px] font-bold text-gray-400 uppercase tracking-wider ">User</th>
                                <th className="px-6 py-4 text-[9px] font-bold text-gray-400 uppercase tracking-wider ">Department</th>
                                <th className="px-6 py-4 text-[9px] font-bold text-gray-400 uppercase tracking-wider ">Role</th>
                                <th className="px-6 py-4 text-[9px] font-bold text-gray-400 uppercase tracking-wider ">Joined</th>
                                <th className="px-6 py-4 text-right text-[9px] font-bold text-gray-400 uppercase tracking-wider ">Actions</th>
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
                                        <Users className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ">No users found.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="group hover:bg-gray-50/30 transition-all duration-300">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-brand-yellow font-bold text-sm shadow-md border border-gray-800 transition-transform group-hover:scale-105 relative overflow-hidden">
                                                    <div className="absolute top-0 left-0 w-full h-[1px] bg-brand-yellow group-hover:animate-shimmer"></div>
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[12px] font-bold text-gray-900 uppercase tracking-tight  leading-tight mb-1 group-hover:text-brand-yellow transition-colors">{user.name}</span>
                                                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 ">
                                                        <Mail className="w-2.5 h-2.5" /> {user.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.role?.name === 'candidate' ? (
                                                <span className="text-[8px] font-bold text-gray-300 uppercase tracking-wider ">EXTERNAL</span>
                                            ) : (
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-bold text-gray-900 uppercase  mb-0.5">{user.company?.name || 'GENERIC'}</span>
                                                    <span className="text-[7.5px] font-bold text-brand-yellow uppercase tracking-wider ">{user.department?.name || 'UNASSIGNED'}</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-900 border border-gray-800 rounded-lg shadow-sm">
                                                <div className="w-1 h-1 bg-brand-yellow rounded-full animate-pulse shadow-[0_0_5px_#FFF200]"></div>
                                                <span className="text-[8.5px] font-bold text-brand-yellow uppercase tracking-wider ">{user.role?.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tight  flex items-center gap-1.5">
                                                    <Clock className="w-3 h-3" /> Joined
                                                </span>
                                                <span className="text-[8px] font-bold text-gray-900 uppercase tracking-wider mt-0.5 ">{new Date(user.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end items-center gap-1.5">
                                                <button
                                                    onClick={() => handleOpenResetPassword(user)}
                                                    className="p-2 bg-gray-50 hover:bg-gray-900 text-gray-400 hover:text-brand-yellow rounded-lg transition-all border border-gray-100 hover:border-gray-800 active:scale-90"
                                                    title="Reset Password"
                                                >
                                                    <Key className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => handleOpenModal(user)}
                                                    className="p-2 bg-gray-50 hover:bg-gray-900 text-gray-400 hover:text-brand-yellow rounded-lg transition-all border border-gray-100 hover:border-gray-800 active:scale-90"
                                                    title="Edit User"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="p-2 bg-gray-50 hover:bg-red-500 text-gray-400 hover:text-white rounded-lg transition-all border border-gray-100 hover:border-red-400 active:scale-90"
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
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
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider ">Secure Connection Active</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-[1px] w-24 bg-gray-100"></div>
                    <span className="text-[9px] font-bold text-brand-yellow uppercase tracking-wider  animate-pulse">Connected</span>
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
                            <div className="bg-gray-950 p-6 flex items-center justify-between relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-full bg-brand-yellow/5 skew-x-[30deg] translate-x-16"></div>
                                <div className="flex flex-col gap-1 relative z-10">
                                    <h2 className="text-lg font-bold text-brand-yellow uppercase tracking-tight  leading-none">
                                        {editingUser ? 'Edit User' : 'Add User'}
                                    </h2>
                                    <span className="text-[8px] font-bold text-gray-500 uppercase tracking-wider ">User ID: {editingUser?.id || 'NEW'}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="p-2.5 bg-white/5 hover:bg-white/10 text-gray-500 hover:text-brand-yellow rounded-xl transition-all active:scale-95 border border-white/5 relative z-10"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div className="space-y-5">
                                    <div className="group">
                                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider  mb-1.5 block ml-1 group-focus-within:text-brand-yellow transition-colors">Full Name</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                required
                                                placeholder="Full name..."
                                                value={form.name}
                                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-3 text-[11px] font-bold text-gray-900 uppercase  placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-yellow/10 focus:border-brand-yellow transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="group">
                                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider  mb-1.5 block ml-1 group-focus-within:text-brand-yellow transition-colors">Email Address</label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                required
                                                placeholder="Email address..."
                                                value={form.email}
                                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-3 text-[11px] font-bold text-gray-900 uppercase  placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-yellow/10 focus:border-brand-yellow transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="group">
                                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider  mb-1.5 block ml-1 group-focus-within:text-brand-yellow transition-colors">Password {editingUser && '(Keep empty to maintain current)'}</label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                required={!editingUser}
                                                placeholder="Password..."
                                                value={form.password}
                                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-3.5 text-[12px] font-bold text-gray-900 uppercase  placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-yellow/10 focus:border-brand-yellow transition-all"
                                            />
                                            <Lock className="absolute right-6 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-200 group-focus-within:text-brand-yellow transition-colors" />
                                        </div>
                                    </div>

                                    <div className="group">
                                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider  mb-1.5 block ml-1 group-focus-within:text-brand-yellow transition-colors">Role</label>
                                        <div className="relative">
                                            <select
                                                required
                                                value={form.role_id}
                                                onChange={(e) => setForm({ ...form, role_id: e.target.value })}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-3 text-[11px] font-bold text-gray-900 uppercase  appearance-none focus:outline-none focus:ring-2 focus:ring-brand-yellow/10 focus:border-brand-yellow transition-all cursor-pointer"
                                            >
                                                {roles.map(role => (
                                                    <option key={role.id} value={role.id}>{role.name}</option>
                                                ))}
                                            </select>
                                            <Key className="absolute right-6 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-200 pointer-events-none" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="group">
                                            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider  mb-1.5 block ml-1 group-focus-within:text-brand-yellow transition-colors">Company</label>
                                            <select
                                                value={form.company_id}
                                                onChange={(e) => setForm({ ...form, company_id: e.target.value, department_id: '' })}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[10px] font-bold text-gray-900 uppercase  focus:ring-2 focus:ring-brand-yellow/10 transition-all cursor-pointer"
                                            >
                                                <option value="">N/A</option>
                                                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="group">
                                            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider  mb-1.5 block ml-1 group-focus-within:text-brand-yellow transition-colors">Department</label>
                                            <select
                                                value={form.department_id}
                                                disabled={!form.company_id}
                                                onChange={(e) => setForm({ ...form, department_id: e.target.value })}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[10px] font-bold text-gray-900 uppercase  focus:ring-2 focus:ring-brand-yellow/10 transition-all cursor-pointer disabled:opacity-50"
                                            >
                                                <option value="">N/A</option>
                                                {departments
                                                    .filter(d => d.company_id == form.company_id)
                                                    .map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-2">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="flex-1 py-3.5 bg-gray-50 text-gray-400 rounded-2xl font-bold text-[9px] uppercase tracking-wider hover:bg-gray-100 transition-all  border border-gray-100"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] py-3.5 bg-gray-900 text-brand-yellow rounded-2xl font-bold text-[9px] uppercase tracking-wider hover:bg-black transition-all shadow-lg border border-gray-800 flex items-center justify-center gap-2.5  group/btn"
                                    >
                                        Save User <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Reset Password Modal */}
            <AnimatePresence>
                {isPasswordResetOpen && resettingUser && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 sm:p-0">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsPasswordResetOpen(false)}
                            className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
                        ></motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl relative overflow-hidden border border-gray-100"
                        >
                            <div className="bg-gray-950 p-6 flex flex-col relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-full bg-brand-yellow/5 skew-x-[30deg] translate-x-16"></div>
                                <div className="flex items-center justify-between relative z-10 mb-4">
                                    <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-brand-yellow font-bold text-sm shadow-md border border-gray-800">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                    <button onClick={() => setIsPasswordResetOpen(false)} className="p-2 bg-white/5 hover:bg-white/10 text-gray-500 hover:text-brand-yellow rounded-xl transition-all active:scale-95 border border-white/5">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="relative z-10">
                                    <h2 className="text-lg font-bold text-white uppercase tracking-tight leading-none mb-1">Reset Password</h2>
                                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">{resettingUser.email}</span>
                                </div>
                            </div>

                            <form onSubmit={handleResetPasswordSubmit} className="p-6 space-y-5">
                                <AnimatePresence>
                                    {resetError && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 mb-2">
                                            <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                                            <span className="text-[9px] font-bold text-red-600 uppercase tracking-wider">{resetError}</span>
                                        </motion.div>
                                    )}
                                    {resetSuccess && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2 mb-2">
                                            <Zap className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                            <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">{resetSuccess}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="group">
                                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block ml-1 group-focus-within:text-brand-yellow transition-colors">New Password</label>
                                    <div className="relative">
                                        <input
                                            type="password" required minLength="8" value={resetPasswordForm.password}
                                            onChange={(e) => setResetPasswordForm({ password: e.target.value })}
                                            placeholder="Enter new password..."
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 text-[11px] font-bold text-gray-900 uppercase placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-yellow/10 focus:border-brand-yellow transition-all"
                                        />
                                        <Key className="absolute right-5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300 group-focus-within:text-brand-yellow transition-colors" />
                                    </div>
                                </div>

                                <button
                                    type="submit" disabled={resetLoading}
                                    className="w-full py-4 bg-gray-900 text-brand-yellow rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-lg border border-gray-800 disabled:opacity-50 flex items-center justify-center gap-2 group"
                                >
                                    {resetLoading ? <div className="w-3.5 h-3.5 border-2 border-brand-yellow border-t-transparent rounded-full animate-spin" /> : <><ShieldAlert className="w-3.5 h-3.5 group-hover:scale-110 transition-transform text-red-500" /> Reset Password</>}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserManagement;
