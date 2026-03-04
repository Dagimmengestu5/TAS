import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MoreVertical, ChevronRight, X, User, Mail, Phone, Calendar, Briefcase, MapPin, Download, CheckCircle, Zap, Activity, Clock, Target, ArrowRight, ChevronDown, ShieldAlert, MessageSquare, ShieldCheck, UserCheck, Archive, Send } from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const ApplicationPipeline = ({ statusFilterOverride }) => {
    const { user: currentUser } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState(statusFilterOverride || 'all');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [filterJobTitle, setFilterJobTitle] = useState('all');
    const [showJobFilterDropdown, setShowJobFilterDropdown] = useState(false);
    const [filterCategory, setFilterCategory] = useState('all');
    const [showCategoryFilterDropdown, setShowCategoryFilterDropdown] = useState(false);
    const [filterExperience, setFilterExperience] = useState('all');
    const [showExpFilterDropdown, setShowExpFilterDropdown] = useState(false);

    // Status Update State
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [statusFeedback, setStatusFeedback] = useState('');
    const [targetStatus, setTargetStatus] = useState(null);
    const [offerDocument, setOfferDocument] = useState(null);
    const [interviewDate, setInterviewDate] = useState('');
    const [interviewTime, setInterviewTime] = useState('');
    const [interviewLocation, setInterviewLocation] = useState('');
    const [openMenuId, setOpenMenuId] = useState(null);

    // Offer Dialog — TA Side
    const [taDialogMessages, setTaDialogMessages] = useState({});
    const [taDialogInput, setTaDialogInput] = useState({});
    const [taDialogLoading, setTaDialogLoading] = useState({});
    const [taSendingMsg, setTaSendingMsg] = useState({});
    const [openDialogs, setOpenDialogs] = useState({});

    const loadTaMessages = async (appId) => {
        setTaDialogLoading(prev => ({ ...prev, [appId]: true }));
        try {
            const res = await api.get(`/applications/${appId}/messages`);
            setTaDialogMessages(prev => ({ ...prev, [appId]: res.data }));
        } catch (e) { console.error(e); }
        finally { setTaDialogLoading(prev => ({ ...prev, [appId]: false })); }
    };

    const sendTaMessage = async (appId) => {
        const msgText = taDialogInput[appId] || '';
        if (!msgText.trim()) return;

        // Optimistic UI Update
        const tempId = Date.now();
        const tempMsg = {
            id: tempId,
            user_id: currentUser?.id,
            message: msgText,
            created_at: new Date().toISOString(),
            user: { id: currentUser?.id, name: currentUser?.name },
            isOptimistic: true
        };

        setTaDialogMessages(prev => ({
            ...prev,
            [appId]: [...(prev[appId] || []), tempMsg]
        }));
        setTaDialogInput(prev => ({ ...prev, [appId]: '' }));
        setTaSendingMsg(prev => ({ ...prev, [appId]: true }));

        try {
            const res = await api.post(`/applications/${appId}/messages`, { message: msgText });
            setTaDialogMessages(prev => ({
                ...prev,
                [appId]: (prev[appId] || []).map(m => m.id === tempId ? res.data : m)
            }));
        } catch (e) {
            setTaDialogMessages(prev => ({
                ...prev,
                [appId]: (prev[appId] || []).filter(m => m.id !== tempId)
            }));
            setTaDialogInput(prev => ({ ...prev, [appId]: msgText }));
            alert('Failed to send. Try again.');
        }
        finally { setTaSendingMsg(prev => ({ ...prev, [appId]: false })); }
    };

    const toggleDialog = (appId) => {
        setOpenDialogs(prev => ({ ...prev, [appId]: !prev[appId] }));
        if (!openDialogs[appId]) {
            loadTaMessages(appId);
        }
    };

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const response = await api.get('/applications');
                setApplications(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                console.error('Fetch Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchApps();
    }, []);

    // Auto-load dialog messages when an offer-status app is opened
    useEffect(() => {
        if (selectedApp && selectedApp.status === 'offer') {
            loadTaMessages(selectedApp.id);
        }
    }, [selectedApp?.id]);

    const statuses = ['submitted', 'written_test', 'interview_1', 'interview_2', 'offer', 'rejected', 'hired', 'pooled'];

    const filteredApps = applications.filter(app => {
        const cand = app.candidate || {};
        const jobPost = app.job_posting || {};
        const req = jobPost.requisition || {};

        const candidateName = cand.name?.toLowerCase() || '';
        const jobTitle = req.title?.toLowerCase() || '';
        const search = searchQuery.toLowerCase();

        const matchesSearch = candidateName.includes(search) || jobTitle.includes(search);
        const matchesStatus = filterStatus === 'all' || (app.status?.toLowerCase() || '') === filterStatus;
        const matchesJob = filterJobTitle === 'all' || req.title === filterJobTitle;

        const jobCategory = jobPost.category || req.category || '';
        const matchesCategory = filterCategory === 'all' || jobCategory === filterCategory;
        const yoe = parseInt(cand.years_of_experience) || 0;
        const matchesExperience = filterExperience === 'all'
            || (filterExperience === '0-2' && yoe <= 2)
            || (filterExperience === '3-5' && yoe >= 3 && yoe <= 5)
            || (filterExperience === '6-10' && yoe >= 6 && yoe <= 10)
            || (filterExperience === '10+' && yoe > 10);

        return matchesSearch && matchesStatus && matchesJob && matchesCategory && matchesExperience;
    });

    // Unique job titles for filter
    const uniqueJobTitles = [...new Set(
        applications
            .map(a => a.job_posting?.requisition?.title)
            .filter(Boolean)
    )].sort();

    const uniqueCategories = [...new Set(
        applications
            .map(a => a.job_posting?.category || a.job_posting?.requisition?.category)
            .filter(Boolean)
    )].sort();

    const handleUpdateStatus = async (id, newStatus) => {
        if (!statusFeedback && newStatus !== 'rejected' && newStatus !== 'pooled') {
            setTargetStatus(newStatus);
            return;
        }

        setUpdatingStatus(true);
        try {
            let response;
            if (newStatus.startsWith('interview')) {
                const scheduledAt = `${interviewDate} ${interviewTime}`;
                response = await api.post('/interviews', {
                    application_id: id,
                    type: newStatus,
                    scheduled_at: scheduledAt,
                    location: interviewLocation,
                    notes: statusFeedback
                });
            } else {
                let data;
                const headers = {};

                if (newStatus === 'offer' && offerDocument) {
                    data = new FormData();
                    data.append('_method', 'PATCH');
                    data.append('status', newStatus);
                    data.append('feedback', statusFeedback || `Transitioned to ${newStatus.replace('_', ' ')}`);
                    data.append('offer_document', offerDocument);
                    headers['Content-Type'] = 'multipart/form-data';
                } else {
                    data = {
                        status: newStatus,
                        feedback: statusFeedback || `Transitioned to ${newStatus.replace('_', ' ')}`
                    };
                }

                response = await api({
                    method: (newStatus === 'offer' && offerDocument) ? 'post' : 'patch',
                    url: `/applications/${id}/status`,
                    data: data,
                    headers: headers
                });
            }

            setApplications(apps => apps.map(app => app.id === id ? { ...app, ...response.data } : app));
            if (selectedApp?.id === id) setSelectedApp({ ...selectedApp, ...response.data });

            // Reset states
            setTargetStatus(null);
            setStatusFeedback('');
            setOfferDocument(null);
            setInterviewDate('');
            setInterviewTime('');
            setInterviewLocation('');
        } catch (err) {
            alert('Status update failed.');
        } finally {
            setUpdatingStatus(false);
        }
    };

    // Quick pool: move directly without feedback prompt
    const handleAddToPool = async (app) => {
        setOpenMenuId(null);
        if (app.status === 'pooled') return;
        try {
            const response = await api.patch(`/applications/${app.id}/status`, {
                status: 'pooled',
                feedback: 'Added to resource pool by TA team.'
            });
            setApplications(prev => prev.map(a => a.id === app.id ? { ...a, ...response.data } : a));
        } catch (err) {
            alert('Failed to add to resource pool.');
        }
    };

    if (loading) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 ">Accessing application pipeline...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white h-full w-full max-h-full flex flex-col selection:bg-brand-yellow/30  overflow-hidden">
            {/* Search & Filter - Sticky at Top */}
            <div className="px-6 py-4 lg:px-10 border-b border-gray-100 bg-white shrink-0 z-20">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-brand-yellow transition-colors w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search candidate or job requisition..."
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-11 pr-4 py-3 text-[11px] font-bold tracking-tight focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-yellow/5 focus:border-brand-yellow transition-all shadow-inner "
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <button
                            onClick={() => { setShowFilterDropdown(!showFilterDropdown); setShowJobFilterDropdown(false); }}
                            className="flex items-center gap-3 bg-gray-900 text-brand-yellow px-5 py-3 text-[10px] font-bold uppercase tracking-wider hover:bg-black transition-all shadow-lg  border border-gray-800 rounded-xl group"
                        >
                            <Filter className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                            {filterStatus === 'all' ? 'Status' : filterStatus.replace('_', ' ')}
                            <ChevronDown className={`w-3 h-3 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {showFilterDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute right-0 mt-3 w-52 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden"
                                >
                                    <div className="p-2.5 space-y-1">
                                        <button
                                            onClick={() => { setFilterStatus('all'); setShowFilterDropdown(false); }}
                                            className={`w-full text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-colors  ${filterStatus === 'all' ? 'bg-brand-yellow text-black' : 'hover:bg-gray-50 text-gray-500'}`}
                                        >
                                            All Statuses
                                        </button>
                                        <div className="h-px bg-gray-50 my-1 mx-2"></div>
                                        {statuses.map(s => (
                                            <button
                                                key={s}
                                                onClick={() => { setFilterStatus(s); setShowFilterDropdown(false); }}
                                                className={`w-full text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-colors  rounded-xl ${filterStatus === s ? 'bg-brand-yellow text-black shadow-md' : 'hover:bg-gray-50 text-gray-500'}`}
                                            >
                                                {s.replace('_', ' ')}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Job Title Filter */}
                    <div className="relative">
                        <button
                            onClick={() => { setShowJobFilterDropdown(!showJobFilterDropdown); setShowFilterDropdown(false); setShowCategoryFilterDropdown(false); }}
                            className="flex items-center gap-3 bg-white border border-gray-200 text-gray-700 px-5 py-3 text-[10px] font-bold uppercase tracking-wider hover:border-brand-yellow hover:text-gray-900 transition-all  rounded-xl group"
                        >
                            <Briefcase className="w-4 h-4 text-gray-400 group-hover:text-brand-yellow transition-colors" />
                            {filterJobTitle === 'all' ? 'All Jobs' : filterJobTitle.length > 16 ? filterJobTitle.slice(0, 16) + '...' : filterJobTitle}
                            <ChevronDown className={`w-3 h-3 transition-transform ${showJobFilterDropdown ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {showJobFilterDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute right-0 mt-3 w-64 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden"
                                >
                                    <div className="p-2.5 space-y-1 max-h-64 overflow-y-auto">
                                        <button
                                            onClick={() => { setFilterJobTitle('all'); setShowJobFilterDropdown(false); }}
                                            className={`w-full text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-colors  ${filterJobTitle === 'all' ? 'bg-brand-yellow text-black' : 'hover:bg-gray-50 text-gray-500'}`}
                                        >
                                            All Jobs
                                        </button>
                                        <div className="h-px bg-gray-50 my-1 mx-2"></div>
                                        {uniqueJobTitles.length === 0 ? (
                                            <p className="text-[9px] text-gray-300  px-4 py-2">No jobs found</p>
                                        ) : uniqueJobTitles.map(title => (
                                            <button
                                                key={title}
                                                onClick={() => { setFilterJobTitle(title); setShowJobFilterDropdown(false); }}
                                                className={`w-full text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-colors  rounded-xl ${filterJobTitle === title ? 'bg-brand-yellow text-black shadow-md' : 'hover:bg-gray-50 text-gray-600'}`}
                                            >
                                                {title}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Category Filter */}
                    <div className="relative">
                        <button
                            onClick={() => { setShowCategoryFilterDropdown(!showCategoryFilterDropdown); setShowFilterDropdown(false); setShowJobFilterDropdown(false); }}
                            className="flex items-center gap-3 bg-white border border-gray-200 text-gray-700 px-5 py-3 text-[10px] font-bold uppercase tracking-wider hover:border-brand-yellow hover:text-gray-900 transition-all  rounded-xl group"
                        >
                            <Target className="w-4 h-4 text-gray-400 group-hover:text-brand-yellow transition-colors" />
                            {filterCategory === 'all' ? 'Category' : filterCategory}
                            <ChevronDown className={`w-3 h-3 transition-transform ${showCategoryFilterDropdown ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {showCategoryFilterDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute right-0 mt-3 w-64 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden"
                                >
                                    <div className="p-2.5 space-y-1 max-h-64 overflow-y-auto">
                                        <button
                                            onClick={() => { setFilterCategory('all'); setShowCategoryFilterDropdown(false); }}
                                            className={`w-full text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-colors  ${filterCategory === 'all' ? 'bg-brand-yellow text-black' : 'hover:bg-gray-50 text-gray-500'}`}
                                        >
                                            All Categories
                                        </button>
                                        <div className="h-px bg-gray-50 my-1 mx-2"></div>
                                        {uniqueCategories.length === 0 ? (
                                            <p className="text-[9px] text-gray-300  px-4 py-2">No categories found</p>
                                        ) : uniqueCategories.map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => { setFilterCategory(cat); setShowCategoryFilterDropdown(false); }}
                                                className={`w-full text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-colors  rounded-xl ${filterCategory === cat ? 'bg-brand-yellow text-black shadow-md' : 'hover:bg-gray-50 text-gray-600'}`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Experience Filter Dropdown */}
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => { setShowExpFilterDropdown(!showExpFilterDropdown); setShowFilterDropdown(false); setShowJobFilterDropdown(false); }}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all ${filterExperience !== 'all' ? 'bg-brand-yellow text-black border-brand-yellow' : 'bg-white border-gray-200 text-gray-500 hover:border-brand-yellow hover:text-gray-900'
                                }`}
                        >
                            <Clock className="w-3.5 h-3.5" />
                            {filterExperience === 'all' ? 'Experience' : `${filterExperience} yrs`}
                            <ChevronDown className="w-3 h-3" />
                        </button>
                        <AnimatePresence>
                            {showExpFilterDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    className="absolute top-full mt-2 left-0 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-50 min-w-[140px]"
                                >
                                    {[['all', 'All Experience'], ['0-2', '0–2 Years'], ['3-5', '3–5 Years'], ['6-10', '6–10 Years'], ['10+', '10+ Years']].map(([val, label]) => (
                                        <button
                                            key={val}
                                            onClick={() => { setFilterExperience(val); setShowExpFilterDropdown(false); }}
                                            className={`w-full text-left px-4 py-3 text-[9px] font-bold uppercase tracking-wider transition-colors ${filterExperience === val ? 'bg-brand-yellow text-black' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                                }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Pipeline Container - horizontal scroll + column vertical scroll */}
            <main
                className="flex-1 overflow-x-auto pipeline-horizontal-scroll bg-gray-50/20 relative"
                style={{ height: 'calc(100vh - 160px)' }}
                onClick={() => { setShowFilterDropdown(false); setShowJobFilterDropdown(false); setOpenMenuId(null); }}
            >
                <style>
                    {`
                        .pipeline-horizontal-scroll::-webkit-scrollbar { height: 10px; }
                        .pipeline-horizontal-scroll::-webkit-scrollbar-track { background: #F9FAFB; margin: 0 20px; }
                        .pipeline-horizontal-scroll::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 6px; border: 2px solid #F9FAFB; }
                        .pipeline-horizontal-scroll::-webkit-scrollbar-thumb:hover { background: #FFF200; }
                        .col-scroll::-webkit-scrollbar { width: 4px; }
                        .col-scroll::-webkit-scrollbar-track { background: transparent; }
                        .col-scroll::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 99px; }
                        .col-scroll::-webkit-scrollbar-thumb:hover { background: #FFF200; }
                    `}
                </style>
                <div className="flex gap-6 p-6 lg:p-8 h-full min-w-max items-stretch">
                    {statuses.filter(s => filterStatus === 'all' || s === filterStatus).map(status => (
                        <div key={status} className="w-[320px] flex flex-col bg-white/40 rounded-[2rem] p-3 border border-gray-100/50 shadow-inner" style={{ height: '100%', minHeight: 0 }}>
                            <div className="flex items-center justify-between px-5 py-4 bg-gray-900 border border-gray-800 rounded-2xl shadow-xl  mb-4 shrink-0 group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-full bg-brand-yellow/5 skew-x-[-20deg] translate-x-12 group-hover:translate-x-2 transition-transform duration-1000"></div>
                                <div className="flex items-center gap-3 relative z-10">
                                    <div className="w-2 h-2 bg-brand-yellow rounded-full animate-pulse shadow-[0_0_10px_#FFF200]"></div>
                                    <h2 className="text-[12px] font-bold uppercase tracking-wider text-brand-yellow ">{status.replace('_', ' ')}</h2>
                                </div>
                                <span className="text-[11px] font-bold text-white/30 uppercase tracking-wider relative z-10 px-2 py-1 bg-white/5 rounded-md">
                                    {filteredApps.filter(a => (a.status?.toLowerCase() || '') === status).length}
                                </span>
                            </div>

                            <div className="flex-1 overflow-y-auto col-scroll space-y-4 px-1 pb-3" style={{ minHeight: 0 }}>
                                {filteredApps.filter(a => (a.status?.toLowerCase() || '') === status).map(app => {
                                    const cand = app.candidate || {};
                                    const latestLog = app.histories?.[0] || {};
                                    const adminName = latestLog.user?.name || 'System';

                                    return (
                                        <motion.div
                                            key={app.id}
                                            layoutId={`card-${app.id}`}
                                            onClick={() => { setOpenMenuId(null); setSelectedApp(app); }}
                                            className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-brand-yellow/40 transition-all duration-500 cursor-pointer group relative overflow-visible border-l-4 border-l-transparent hover:border-l-brand-yellow"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="w-11 h-11 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center text-gray-300 group-hover:text-brand-yellow group-hover:bg-gray-900 transition-all duration-500 group-hover:border-gray-800 shadow-inner">
                                                    <User className="w-5 h-5 flex-shrink-0" />
                                                </div>

                                                {/* Three-dot Menu */}
                                                <div className="relative" onClick={e => e.stopPropagation()}>
                                                    <button
                                                        onClick={() => setOpenMenuId(openMenuId === app.id ? null : app.id)}
                                                        className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-300 hover:text-gray-900 hover:bg-gray-100 transition-all"
                                                        title="Options"
                                                    >
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>

                                                    <AnimatePresence>
                                                        {openMenuId === app.id && (
                                                            <motion.div
                                                                initial={{ opacity: 0, scale: 0.92, y: -6 }}
                                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                exit={{ opacity: 0, scale: 0.92, y: -6 }}
                                                                transition={{ duration: 0.15 }}
                                                                className="absolute right-0 top-10 w-52 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden"
                                                            >
                                                                <div className="p-2 space-y-1">
                                                                    {/* Preview option */}
                                                                    <button
                                                                        onClick={() => { setOpenMenuId(null); setSelectedApp(app); }}
                                                                        className="w-full text-left px-4 py-3 flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-gray-700 hover:bg-brand-yellow/10 hover:text-gray-900 rounded-xl transition-all "
                                                                    >
                                                                        <User className="w-3.5 h-3.5 text-brand-yellow" />
                                                                        Preview Profile
                                                                    </button>

                                                                    {/* Divider */}
                                                                    <div className="h-px bg-gray-50 mx-2" />

                                                                    {/* Add to Resource Pool */}
                                                                    <button
                                                                        onClick={() => handleAddToPool(app)}
                                                                        disabled={app.status === 'pooled'}
                                                                        className="w-full text-left px-4 py-3 flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all  disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-900 hover:text-brand-yellow text-gray-700 group/pool"
                                                                    >
                                                                        <Archive className="w-3.5 h-3.5 group-hover/pool:text-brand-yellow text-gray-400" />
                                                                        {app.status === 'pooled' ? 'Already Pooled' : 'Add to Resource Pool'}
                                                                    </button>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </div>

                                            <h3 className="text-base font-bold text-gray-900 tracking-tight mb-1 font-sans leading-tight group-hover:text-brand-yellow transition-colors truncate">{cand.name || 'Anonymous Unit'}</h3>

                                            {/* Professional Background Badge */}
                                            {cand.professional_background && (
                                                <div className="flex items-center gap-1.5 mb-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow flex-shrink-0"></div>
                                                    <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wider truncate">{cand.professional_background}</span>
                                                </div>
                                            )}

                                            {/* Job Title */}
                                            <div className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1 mb-2 max-w-full">
                                                <Briefcase className="w-3 h-3 text-brand-yellow flex-shrink-0" />
                                                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider truncate">{app.job_posting?.title || app.job_posting?.requisition?.title || 'General Application'}</span>
                                            </div>

                                            {/* Final Step Audit Log */}
                                            <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100 group-hover:bg-brand-yellow/5 group-hover:border-brand-yellow/10 transition-colors">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <ShieldCheck className="w-3 h-3 text-brand-yellow" />
                                                    <span className="text-xs font-bold text-gray-400 font-sans">Vetted by: <span className="text-gray-900">{adminName}</span></span>
                                                </div>
                                                <p className="text-xs font-semibold text-gray-500 font-sans line-clamp-1">"{latestLog.feedback || 'Status updated.'}"</p>
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-4">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-sans">Applied</span>
                                                    <span className="text-xs font-bold text-gray-600 font-sans mt-1">{new Date(app.created_at).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {(app.status?.toLowerCase() === 'offer') && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedApp(app);
                                                                if (!openDialogs[app.id]) {
                                                                    toggleDialog(app.id);
                                                                    // Locally reset count so UI updates immediately
                                                                    app.unread_messages_count = 0;
                                                                }
                                                            }}
                                                            className={`p-2 rounded-xl transition-all shadow-sm relative ${openDialogs[app.id] ? 'bg-brand-yellow text-black' : 'bg-gray-50 text-brand-yellow hover:bg-gray-900 group-hover:bg-gray-900'}`}
                                                            title="Offer Conversation"
                                                        >
                                                            <MessageSquare className="w-4 h-4" />
                                                            {app.unread_messages_count > 0 && (
                                                                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white shadow-lg border-2 border-white animate-bounce">
                                                                    {app.unread_messages_count}
                                                                </span>
                                                            )}
                                                        </button>
                                                    )}
                                                    <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-brand-yellow group-hover:scale-110 transition-all duration-500 shadow-sm">
                                                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-black transition-all" />
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Application Detail Modal - Full Candidate Data View */}
            <AnimatePresence>
                {selectedApp && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => {
                                if (!targetStatus) {
                                    setSelectedApp(null);
                                }
                            }}
                            className="absolute inset-0 bg-gray-900/70 backdrop-blur-xl"
                        />
                        <motion.div
                            layoutId={`modal-${selectedApp.id}`}
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white w-full max-w-[950px] h-[90vh] rounded-[2.5rem] shadow-[0_40px_120px_rgba(0,0,0,0.3)] relative z-10 overflow-hidden flex flex-col md:flex-row border border-gray-100 border-t-brand-yellow border-t-[6px]"
                        >
                            <button
                                onClick={() => setSelectedApp(null)}
                                className="absolute top-6 right-6 w-10 h-10 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-300 hover:text-red-500 hover:rotate-90 transition-all z-20 shadow-xl border-dashed active:scale-95"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            {/* LEFT PANEL — Candidate Identity */}
                            <div className="md:w-[38%] p-8 overflow-y-auto bg-gray-50/50 border-r border-gray-100 flex flex-col gap-6">
                                {/* Avatar + Name */}
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-20 h-20 bg-gray-900 rounded-[2rem] flex items-center justify-center text-brand-yellow text-3xl font-bold shadow-2xl border border-gray-800 relative mb-4">
                                        <div className="absolute inset-0 bg-brand-yellow/10 rounded-[2rem] blur-xl"></div>
                                        {selectedApp.candidate?.name?.charAt(0) || '?'}
                                    </div>
                                    <span className="text-xs font-bold text-brand-yellow bg-gray-900 px-3 py-1 rounded-lg uppercase tracking-wide mb-2 font-sans">Candidate Profile</span>
                                    <div className="flex items-center gap-4 mt-2">
                                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight font-sans">{selectedApp.candidate?.name || 'Anonymous'}</h2>
                                        {(selectedApp.status?.toLowerCase() === 'offer') && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (!openDialogs[selectedApp.id]) {
                                                        toggleDialog(selectedApp.id);
                                                        // Locally reset count so UI updates immediately
                                                        selectedApp.unread_messages_count = 0;
                                                    }
                                                }}
                                                className={`p-2 rounded-xl transition-all shadow-md relative ${openDialogs[selectedApp.id] ? 'bg-brand-yellow text-black' : 'bg-gray-900 text-brand-yellow hover:bg-black active:scale-95'}`}
                                                title="Offer Conversation"
                                            >
                                                <MessageSquare className="w-4 h-4" />
                                                {selectedApp.unread_messages_count > 0 && (
                                                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white shadow-lg border-2 border-white animate-bounce">
                                                        {selectedApp.unread_messages_count}
                                                    </span>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-sm font-medium text-gray-500 mt-1">{selectedApp.candidate?.email}</p>
                                </div>

                                {/* Personal Info Grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { icon: Phone, label: 'Phone', val: selectedApp.candidate?.phone },
                                        { icon: User, label: 'Gender', val: selectedApp.candidate?.gender },
                                        { icon: Calendar, label: 'Age', val: selectedApp.candidate?.age ? `${selectedApp.candidate.age} yrs` : null },
                                        { icon: MapPin, label: 'Location', val: selectedApp.candidate?.current_address },
                                    ].map((item, i) => (
                                        <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-2">
                                            <div className="flex items-center gap-2 mb-1">
                                                <item.icon className="w-3.5 h-3.5 text-brand-yellow" />
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider font-sans">{item.label}</span>
                                            </div>
                                            <span className="text-sm font-bold text-gray-900 leading-tight font-sans">{item.val || '—'}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Education */}
                                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Briefcase className="w-4 h-4 text-brand-yellow" />
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider font-sans">Education</span>
                                    </div>
                                    <p className="text-base font-bold text-gray-900 tracking-tight font-sans">{selectedApp.candidate?.institution_name || '—'}</p>
                                    {selectedApp.candidate?.cgpa && (
                                        <p className="text-xs font-medium text-gray-400 mt-2 font-sans">CGPA: <span className="text-gray-900 font-bold">{selectedApp.candidate.cgpa}</span></p>
                                    )}
                                </div>

                                {/* Experience */}
                                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Activity className="w-4 h-4 text-brand-yellow" />
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider font-sans">Experience</span>
                                    </div>
                                    <p className="text-sm font-bold text-gray-900 font-sans">{selectedApp.candidate?.years_of_experience != null ? `${selectedApp.candidate.years_of_experience} years` : '—'}</p>
                                </div>

                                {/* CV Download */}
                                {selectedApp.candidate?.cv_path ? (
                                    <a
                                        href={`${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:8003'}/storage/${selectedApp.candidate.cv_path}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-3 w-full py-4 bg-gray-900 text-brand-yellow rounded-2xl font-bold text-xs uppercase tracking-wide hover:bg-black transition-all shadow-xl border border-gray-800 active:scale-95 font-sans"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download CV / Resume
                                    </a>
                                ) : (
                                    <div className="flex items-center justify-center gap-3 w-full py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold text-gray-400 uppercase tracking-wide font-sans">
                                        <Download className="w-4 h-4" />
                                        No CV Uploaded
                                    </div>
                                )}
                            </div>

                            {/* RIGHT PANEL — Application Details + Status */}
                            <div className="md:w-[62%] p-8 overflow-y-auto flex flex-col gap-6 bg-white">

                                {/* Applied Position */}
                                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2 font-sans">Applied Position</span>
                                    <h3 className="text-xl font-bold text-gray-900 tracking-tight leading-tight font-sans">
                                        {selectedApp.job_posting?.requisition?.title || '—'}
                                    </h3>
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border font-sans ${selectedApp.status === 'hired' ? 'bg-green-50 text-green-600 border-green-100' :
                                                selectedApp.status === 'rejected' ? 'bg-red-50 text-red-500 border-red-100' :
                                                    'bg-amber-50 text-amber-500 border-amber-100'
                                                }`}>
                                                {selectedApp.status?.replace('_', ' ')}
                                            </div>
                                            <span className="text-xs text-gray-500 font-medium font-sans">Applied {new Date(selectedApp.created_at).toLocaleDateString()}</span>
                                        </div>

                                        {selectedApp.status?.toLowerCase() === 'offer' && (
                                            <button
                                                onClick={() => toggleDialog(selectedApp.id)}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all shadow-lg ${openDialogs[selectedApp.id] ? 'bg-brand-yellow text-black' : 'bg-gray-900 text-brand-yellow hover:bg-black active:scale-95'}`}
                                            >
                                                <MessageSquare className="w-4 h-4" />
                                                {openDialogs[selectedApp.id] ? 'Hide Conversation' : 'Offer Conversation'}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Professional Background */}
                                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                                    <div className="flex items-center gap-3 mb-3">
                                        <MessageSquare className="w-4 h-4 text-brand-yellow" />
                                        <span className="text-xs font-bold text-brand-yellow uppercase tracking-wide font-sans">Professional Background / Cover Letter</span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-400 leading-relaxed font-sans">
                                        {selectedApp.candidate?.professional_background || 'No background information provided.'}
                                    </p>
                                </div>

                                {/* Audit Timeline */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-5">
                                        <Clock className="w-5 h-5 text-brand-yellow" />
                                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider font-sans">Status History</h3>
                                    </div>
                                    {selectedApp.histories?.length > 0 ? (
                                        <div className="space-y-5 border-l-2 border-brand-yellow/30 pl-6 ml-2">
                                            {selectedApp.histories.map((h, i) => (
                                                <div key={i} className="relative">
                                                    <div className="absolute -left-[32px] top-1.5 w-3.5 h-3.5 bg-white border-[3px] border-brand-yellow rounded-full shadow-sm"></div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-sans">{new Date(h.created_at).toLocaleString()}</span>
                                                        <div className="flex items-center gap-2">
                                                            <UserCheck className="w-3.5 h-3.5 text-brand-yellow" />
                                                            <span className="text-[10px] font-bold text-gray-600 font-sans">{h.user?.name || 'System'}</span>
                                                        </div>
                                                    </div>
                                                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                                        <span className="text-[10px] font-bold text-brand-yellow bg-gray-900 px-2.5 py-1 rounded-md uppercase tracking-wide font-sans">{h.status?.replace('_', ' ')}</span>
                                                        <p className="text-sm font-medium text-gray-600 mt-3 leading-relaxed font-sans">"{h.feedback || 'Status updated.'}"</p>
                                                        {h.document_path && (
                                                            <a
                                                                href={`${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:8003'}/storage/${h.document_path}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="mt-4 inline-flex w-fit items-center gap-2 text-xs font-bold text-white bg-gray-800 hover:bg-black px-4 py-2 rounded-lg border border-gray-700 transition-colors font-sans shadow-sm"
                                                            >
                                                                <Download className="w-4 h-4 text-brand-yellow" /> Offer Document
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-[10px] text-gray-300  font-bold uppercase">No history recorded.</p>
                                    )}
                                </div>

                                {/* Offer Conversation logic moved to standalone modal */}

                                {/* Phase Modulation */}
                                <div className="pt-6 border-t border-gray-100 shrink-0">
                                    <div className="flex items-center gap-3 mb-5">
                                        <Target className="w-5 h-5 text-brand-yellow" />
                                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider font-sans">Move to Phase</h3>
                                    </div>
                                    {targetStatus ? (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                            <textarea
                                                value={statusFeedback}
                                                onChange={(e) => setStatusFeedback(e.target.value)}
                                                placeholder={`Enter notes for ${targetStatus.replace('_', ' ')} phase...`}
                                                className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-sm font-medium text-gray-800 focus:ring-4 focus:ring-brand-yellow/20 focus:border-brand-yellow focus:outline-none transition-all h-24 resize-none shadow-sm font-sans"
                                            />
                                            {targetStatus.startsWith('interview') && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                                    <div className="flex flex-col gap-2">
                                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Interview Date</label>
                                                        <input
                                                            type="date"
                                                            required
                                                            value={interviewDate}
                                                            onChange={(e) => setInterviewDate(e.target.value)}
                                                            className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-brand-yellow/10 focus:border-brand-yellow outline-none transition-all"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Interview Time</label>
                                                        <input
                                                            type="time"
                                                            required
                                                            value={interviewTime}
                                                            onChange={(e) => setInterviewTime(e.target.value)}
                                                            className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-brand-yellow/10 focus:border-brand-yellow outline-none transition-all"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-2 md:col-span-2">
                                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Location / Link</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Office address or Video Link"
                                                            value={interviewLocation}
                                                            onChange={(e) => setInterviewLocation(e.target.value)}
                                                            className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-brand-yellow/10 focus:border-brand-yellow outline-none transition-all"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            {targetStatus === 'offer' && (
                                                <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5">
                                                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-3 font-sans">
                                                        Attach Offer Document (Optional)
                                                    </label>
                                                    <input
                                                        type="file"
                                                        accept=".pdf,.doc,.docx"
                                                        onChange={(e) => setOfferDocument(e.target.files[0])}
                                                        className="w-full text-xs text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-colors font-sans"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex gap-3">
                                                <button onClick={() => setTargetStatus(null)} className="flex-1 py-3.5 border border-gray-200 text-gray-500 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-gray-50 transition-colors font-sans shadow-sm">
                                                    Cancel
                                                </button>
                                                <button disabled={updatingStatus} onClick={() => handleUpdateStatus(selectedApp.id, targetStatus)} className="flex-[2] py-3.5 bg-gray-900 text-brand-yellow font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-black shadow-xl disabled:opacity-50 transition-all font-sans">
                                                    {updatingStatus ? 'Updating...' : 'Authorize Phase Change'}
                                                </button>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-2">
                                            {statuses.map((s) => {
                                                const currentStatus = selectedApp.status?.toLowerCase();
                                                const isActive = currentStatus === s;
                                                const isRejected = s === 'rejected';
                                                const isPooled = s === 'pooled';

                                                const linearPhases = ['submitted', 'written_test', 'interview_1', 'interview_2', 'offer', 'hired'];
                                                const currLinearIdx = linearPhases.indexOf(currentStatus);
                                                const targetLinearIdx = linearPhases.indexOf(s);

                                                let isAllowed = false;
                                                if (currentStatus === 'hired' || currentStatus === 'rejected') {
                                                    isAllowed = false;
                                                } else if (currentStatus === 'pooled') {
                                                    isAllowed = linearPhases.includes(s) || isRejected;
                                                } else {
                                                    if (isRejected || isPooled) {
                                                        isAllowed = true;
                                                    } else if (targetLinearIdx === currLinearIdx + 1) {
                                                        isAllowed = true;
                                                    }
                                                }

                                                return (
                                                    <button
                                                        key={s}
                                                        disabled={!isAllowed}
                                                        onClick={() => setTargetStatus(s)}
                                                        className={`py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border font-sans flex items-center justify-center gap-2 ${isActive ? 'bg-brand-yellow border-brand-yellow text-black shadow-md' :
                                                            isAllowed ? 'bg-white text-gray-700 border-gray-200 hover:border-brand-yellow hover:translate-y-[-1px] shadow-sm' :
                                                                'bg-gray-50 text-gray-400 border-gray-100 opacity-60 cursor-not-allowed'
                                                            }`}
                                                    >
                                                        {isActive && <CheckCircle className="w-3 h-3" />}
                                                        {s.replace('_', ' ')}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* TA Offer Conversation Modal */}
            <AnimatePresence>
                {Object.entries(openDialogs).map(([appId, isOpen]) => (
                    <TaOfferConversationModal
                        key={appId}
                        isOpen={isOpen}
                        onClose={() => toggleDialog(appId)}
                        appId={appId}
                        currentUser={currentUser}
                        applications={applications}
                        taDialogLoading={taDialogLoading}
                        taDialogMessages={taDialogMessages}
                        taDialogInput={taDialogInput}
                        setTaDialogInput={setTaDialogInput}
                        sendTaMessage={sendTaMessage}
                        taSendingMsg={taSendingMsg}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

const TaOfferConversationModal = ({ isOpen, onClose, appId, currentUser, applications, taDialogLoading, taDialogMessages, taDialogInput, setTaDialogInput, sendTaMessage, taSendingMsg }) => {
    if (!isOpen) return null;
    const app = applications.find(a => a.id.toString() === appId.toString());
    if (!app || app.status?.toLowerCase() !== 'offer') return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-6">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />

            {/* Modal Content */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                className="relative bg-white w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col max-h-[85vh]"
            >
                {/* Header */}
                <div className="bg-gray-900 px-10 py-8 flex items-center justify-between border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-brand-yellow/10 rounded-2xl flex items-center justify-center border border-brand-yellow/20">
                            <MessageSquare className="w-6 h-6 text-brand-yellow" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-brand-yellow uppercase tracking-[0.3em] mb-1">Talent Acquisition Terminal</span>
                            <span className="text-lg font-black text-white uppercase tracking-tight">Offer Conversation</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all group active:scale-90 border border-white/5"
                    >
                        <X className="w-6 h-6 text-gray-500 group-hover:text-white" />
                    </button>
                </div>

                {/* Message Thread */}
                <div className="flex-1 overflow-y-auto px-10 py-10 flex flex-col gap-8 bg-gray-50/30">
                    <div className="flex items-center justify-center gap-4 py-2 border-b border-gray-100 mb-2">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Connected with {app.candidate?.name || 'Candidate'}</span>
                    </div>

                    {taDialogLoading[appId] ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-6">
                            <div className="w-10 h-10 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(255,242,0,0.2)]" />
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] animate-pulse">Establishing Connection...</span>
                        </div>
                    ) : (taDialogMessages[appId] || []).length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 opacity-20">
                            <MessageSquare className="w-16 h-16 text-gray-400 mb-6" />
                            <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] text-center">No transmissions yet.</p>
                        </div>
                    ) : (taDialogMessages[appId] || []).map((msg, i) => {
                        const isMe = msg.user_id === currentUser?.id;
                        return (
                            <div key={i} className={`flex flex-col gap-3 ${isMe ? 'items-end' : 'items-start'}`}>
                                <div className="flex items-center gap-3 px-2">
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${isMe ? 'text-brand-yellow' : 'text-gray-400'}`}>
                                        {isMe ? 'TA Terminal (You)' : (msg.user?.name || 'Candidate Node')}
                                    </span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
                                    <span className="text-[9px] font-bold text-gray-300 uppercase">
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div className={`max-w-[85%] px-8 py-5 rounded-[2rem] text-[15px] font-semibold tracking-tight leading-relaxed shadow-sm transition-all duration-300 ${isMe ? 'bg-gray-900 text-brand-yellow rounded-tr-none hover:shadow-brand-yellow/10' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none hover:shadow-xl hover:shadow-black/5'}`}>
                                    {msg.message}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Input Area */}
                <div className="p-10 bg-white border-t border-gray-100">
                    <div className="relative group">
                        <textarea
                            rows={3}
                            placeholder="Type your transmission to the candidate..."
                            value={taDialogInput[appId] || ''}
                            onChange={(e) => setTaDialogInput(prev => ({ ...prev, [appId]: e.target.value }))}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendTaMessage(appId); } }}
                            className="w-full bg-gray-50/80 border-2 border-gray-100 rounded-[1.5rem] px-8 py-6 text-base font-bold focus:outline-none focus:ring-8 focus:ring-brand-yellow/5 focus:border-brand-yellow/20 transition-all resize-none placeholder:text-gray-300 placeholder:italic"
                        />
                        <button
                            onClick={() => sendTaMessage(appId)}
                            disabled={taSendingMsg[appId] || !taDialogInput[appId]?.trim()}
                            className="absolute bottom-5 right-5 flex items-center gap-3 bg-gray-900 text-brand-yellow px-8 py-4 rounded-[1.25rem] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 shadow-2xl shadow-black/20"
                        >
                            {taSendingMsg[appId] ? (
                                <div className="w-4 h-4 border-2 border-brand-yellow border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    Reply
                                    <Send className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ApplicationPipeline;
