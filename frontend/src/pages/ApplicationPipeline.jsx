import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, MapPin, Shield, Key, Camera, LayoutGrid, Activity, History, ChevronRight, Zap, Target, Lock, Globe, ShieldCheck, Clock, CheckCircle, MessageSquare, Briefcase, LogOut, Bell, Download, X, Send, Search, ArrowRight, MoreVertical, Plus, FileText, Trash2, Edit3, ExternalLink, Filter, Calendar, ChevronDown, ShieldAlert, UserCheck, Archive } from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const ApplicationPipeline = ({ statusFilterOverride, filterOverride, layout = 'board' }) => {
    const { user: currentUser } = useAuth();
    const [applications, setApplications] = useState([]);
    const [allJobs, setAllJobs] = useState([]);
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
    const [showProfile, setShowProfile] = useState(true);
    const [activeDetailView, setActiveDetailView] = useState('operational'); // 'operational' or 'personal'

    // Scroll Sync Refs
    const topScrollRef = useRef(null);
    const mainScrollRef = useRef(null);

    const handleTopScroll = () => {
        if (topScrollRef.current && mainScrollRef.current) {
            mainScrollRef.current.scrollLeft = topScrollRef.current.scrollLeft;
        }
    };

    const handleMainScroll = () => {
        if (topScrollRef.current && mainScrollRef.current) {
            topScrollRef.current.scrollLeft = mainScrollRef.current.scrollLeft;
        }
    };

    // Offer Dialog — TA Side
    const [taDialogMessages, setTaDialogMessages] = useState({});
    const [taDialogInput, setTaDialogInput] = useState({});
    const [taDialogLoading, setTaDialogLoading] = useState({});
    const [taSendingMsg, setTaSendingMsg] = useState({});
    const [openDialogs, setOpenDialogs] = useState({});

    // Inline Notify State (offer-status cards)
    const [notifyOpen, setNotifyOpen] = useState({});
    const [notifyInput, setNotifyInput] = useState({});
    const [notifyLoading, setNotifyLoading] = useState({});

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
        } catch (_) {
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

    const sendOfferNotify = async (appId) => {
        const msg = notifyInput[appId] || '';
        if (!msg.trim()) return;
        setNotifyLoading(prev => ({ ...prev, [appId]: true }));
        try {
            await api.post(`/applications/${appId}/offer-notify`, { message: msg });
            setNotifyInput(prev => ({ ...prev, [appId]: '' }));
            setNotifyOpen(prev => ({ ...prev, [appId]: false }));
            alert('Notification sent to hiring manager and HR approver.');
        } catch (err) {
            alert('Failed to send notification. Please try again.');
        } finally {
            setNotifyLoading(prev => ({ ...prev, [appId]: false }));
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [appsRes, jobsRes] = await Promise.all([
                    api.get('/applications'),
                    api.get('/jobs/all')
                ]);
                setApplications(Array.isArray(appsRes.data) ? appsRes.data : []);
                setAllJobs(Array.isArray(jobsRes.data) ? jobsRes.data : []);
            } catch (err) {
                console.error('Fetch Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Auto-load details when an app is selected
    useEffect(() => {
        if (selectedApp && !selectedApp.interviews) {
            const fetchDetails = async () => {
                try {
                    const res = await api.get(`/applications/${selectedApp.id}`);
                    setApplications(prev => prev.map(a => a.id === selectedApp.id ? { ...a, ...res.data } : a));
                    setSelectedApp(prev => prev?.id === selectedApp.id ? { ...prev, ...res.data } : prev);
                } catch (e) { console.error('Details fetch failed:', e); }
            };
            fetchDetails();
        }
    }, [selectedApp?.id]);

    // Auto-load dialog messages when an offer-status app is opened
    useEffect(() => {
        if (selectedApp && (selectedApp.status === 'offer' || selectedApp.status === 'hired')) {
            loadTaMessages(selectedApp.id);
        }
    }, [selectedApp?.id]);


    const CardLayout = ({ app }) => {
        const cand = app.candidate || {};
        const latestLog = app.histories?.[0] || {};
        const adminName = latestLog.user?.name || 'System';

        return (
            <motion.div
                key={app.id}
                layoutId={`card-${app.id}`}
                onClick={() => { setOpenMenuId(null); setSelectedApp(app); }}
                className="bg-white p-4 rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-brand-yellow/40 transition-all duration-500 cursor-pointer group relative overflow-visible border-l-4 border-l-transparent hover:border-l-brand-yellow"
            >
                {/* Top Row: three-dot menu + job title badge */}
                <div className="flex justify-between items-start mb-3">
                    <div className="relative" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setOpenMenuId(openMenuId === app.id ? null : app.id)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-gray-900 hover:bg-gray-100 transition-all"
                        >
                            <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                        <AnimatePresence>
                            {openMenuId === app.id && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.92, y: -6 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.92, y: -6 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute left-0 top-8 w-52 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden"
                                >
                                    <div className="p-2 space-y-1">
                                        <button
                                            onClick={() => { setOpenMenuId(null); setSelectedApp(app); }}
                                            className="w-full text-left px-4 py-3 flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-gray-700 hover:bg-brand-yellow/10 hover:text-gray-900 rounded-xl transition-all"
                                        >
                                            <User className="w-3.5 h-3.5 text-brand-yellow" />
                                            Preview Profile
                                        </button>
                                        <div className="h-px bg-gray-50 mx-2" />
                                        <button
                                            onClick={() => { setOpenMenuId(null); handleAddToPool(app); }}
                                            disabled={app.status === 'pooled'}
                                            className="w-full text-left px-4 py-3 flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-900 hover:text-brand-yellow text-gray-700"
                                        >
                                            <Archive className="w-3.5 h-3.5 text-gray-400" />
                                            {app.status === 'pooled' ? 'Already Pooled' : 'Add to Resource Pool'}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Job title badge */}
                    <div className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-lg px-2 py-1 max-w-[180px]">
                        <Briefcase className="w-3 h-3 text-brand-yellow flex-shrink-0" />
                        <span className="text-[8px] font-bold text-gray-500 uppercase tracking-wider truncate">{app.job_posting?.title || app.job_posting?.requisition?.title || 'General'}</span>
                    </div>
                </div>

                {/* Candidate Name */}
                <h3 className="text-sm font-bold text-gray-900 tracking-tight mb-1 leading-tight group-hover:text-brand-yellow transition-colors truncate">{cand.name || 'Anonymous'}</h3>

                {cand.professional_background && (
                    <div className="flex items-center gap-1.5 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow flex-shrink-0"></div>
                        <span className="text-[9px] font-bold text-gray-600 uppercase tracking-wider truncate">{cand.professional_background}</span>
                    </div>
                )}

                {/* Audit Log */}
                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 group-hover:bg-brand-yellow/5 group-hover:border-brand-yellow/10 transition-colors">
                    <div className="flex items-center gap-1.5 mb-0.5">
                        <ShieldCheck className="w-3 h-3 text-brand-yellow" />
                        <span className="text-[9px] font-bold text-gray-400">Vetted by: <span className="text-gray-900">{adminName}</span></span>
                    </div>
                    <p className="text-[10px] font-semibold text-gray-500 line-clamp-1">"{latestLog.feedback || 'Status updated.'}"</p>
                </div>

                {/* Skills */}
                {cand.skills && (
                    <div className="mt-2 flex flex-wrap gap-1">
                        {(typeof cand.skills === 'string' ? JSON.parse(cand.skills || '[]') : cand.skills || []).slice(0, 3).map((skill, i) => (
                            <span key={i} className="text-[7px] font-black uppercase tracking-widest bg-gray-100 text-gray-400 px-2 py-0.5 rounded-md group-hover:bg-brand-yellow/10 group-hover:text-brand-yellow transition-colors">
                                {typeof skill === 'object' ? skill.name : skill}
                            </span>
                        ))}
                    </div>
                )}

                {/* Bottom Bar */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-3">
                    <div>
                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Applied</span>
                        <span className="block text-[10px] font-bold text-gray-600 mt-0.5">{new Date(app.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                        {/* Internal Notify Button - Restricted to Offer/Hired stage */}
                        {['offer', 'hired'].includes(app.status?.toLowerCase()) && (
                            <button
                                onClick={() => setNotifyOpen(prev => ({ ...prev, [app.id]: !prev[app.id] }))}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-sm ${notifyOpen[app.id] ? 'bg-brand-yellow text-black' : 'bg-gray-900 text-brand-yellow hover:bg-black'}`}
                                title="Notify Hiring Manager & HR Approver"
                            >
                                <Bell className="w-3 h-3" />
                                Notify
                            </button>
                        )}

                        {/* Candidate Communication Dialog Icon - Restricted to Offer/Hired stage */}
                        {['offer', 'hired'].includes(app.status?.toLowerCase()) && (
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
                                className={`p-1.5 rounded-xl transition-all shadow-sm relative ${openDialogs[app.id] ? 'bg-brand-yellow text-black' : 'bg-gray-50 text-brand-yellow hover:bg-gray-900 group-hover:bg-gray-900'}`}
                                title="Candidate Conversation"
                            >
                                <MessageSquare className="w-4 h-4" />
                                {app.unread_messages_count > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-black text-white shadow-lg border-2 border-white animate-bounce">
                                        {app.unread_messages_count}
                                    </span>
                                )}
                            </button>
                        )}

                        <div className="w-7 h-7 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-brand-yellow group-hover:scale-110 transition-all duration-500 shadow-sm">
                            <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-black transition-all" />
                        </div>
                    </div>
                </div>

                {/* Inline Notify Input */}
                <AnimatePresence>
                    {notifyOpen[app.id] && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="mt-3 pt-3 border-t border-brand-yellow/20">
                                <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-1.5">
                                    <Bell className="w-3 h-3 text-brand-yellow" />
                                    Notify Hiring Manager &amp; HR Approver
                                </p>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={notifyInput[app.id] || ''}
                                        onChange={e => setNotifyInput(prev => ({ ...prev, [app.id]: e.target.value }))}
                                        onKeyDown={e => e.key === 'Enter' && sendOfferNotify(app.id)}
                                        placeholder="Type your message..."
                                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-[11px] font-semibold focus:outline-none focus:ring-2 focus:ring-brand-yellow/20 focus:border-brand-yellow/40 text-gray-900 placeholder:text-gray-300"
                                    />
                                    <button
                                        onClick={() => sendOfferNotify(app.id)}
                                        disabled={notifyLoading[app.id] || !notifyInput[app.id]?.trim()}
                                        className="px-3 py-1.5 bg-gray-900 text-brand-yellow rounded-xl hover:bg-black transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest flex-shrink-0"
                                    >
                                        {notifyLoading[app.id]
                                            ? <div className="w-3 h-3 border-2 border-brand-yellow/30 border-t-brand-yellow rounded-full animate-spin" />
                                            : <Send className="w-3 h-3" />
                                        }
                                        Send
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        );
    };

    const allStatuses = ['submitted', 'written_test', 'interview_1', 'interview_2', 'offer', 'rejected', 'hired', 'pooled'];
    const activeStatuses = ['submitted', 'written_test', 'interview_1', 'interview_2', 'offer', 'hired', 'rejected', 'pooled'];
    const terminalStatuses = ['rejected', 'hired', 'pooled'];

    const statuses = filterStatus !== 'all'
        ? [filterStatus]
        : (filterOverride === 'active' ? activeStatuses : allStatuses);

    const filteredApps = applications.filter(app => {
        const cand = app.candidate || {};
        const jobPost = app.job_posting || {};
        const req = jobPost.requisition || {};

        const candidateName = cand.name?.toLowerCase() || '';
        const jobTitle = (req.title || jobPost.title)?.toLowerCase() || '';
        const search = searchQuery.toLowerCase();

        const matchesSearch = candidateName.includes(search) || jobTitle.includes(search);
        const matchesStatus = filterStatus === 'all' || (app.status?.toLowerCase() || '') === filterStatus;

        const appJobTitle = req.title || jobPost.title;
        const matchesJob = filterJobTitle === 'all' || appJobTitle === filterJobTitle;

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
        allJobs
            .map(j => j.title || j.requisition?.title)
            .concat(applications.map(a => a.job_posting?.title || a.job_posting?.requisition?.title))
            .filter(Boolean)
    )].sort();

    const uniqueCategories = [...new Set(
        allJobs
            .map(j => j.category || j.requisition?.category)
            .concat(applications.map(a => a.job_posting?.category || a.job_posting?.requisition?.category))
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
        } catch (_) {
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
        } catch (_) {
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

            {/* Top Mirror Scrollbar - Only for Board Layout */}
            {layout !== 'grid' && (
                <div
                    ref={topScrollRef}
                    onScroll={handleTopScroll}
                    className="overflow-x-auto pipeline-horizontal-scroll bg-white shrink-0 border-b border-gray-50/50"
                    style={{ height: '8px' }}
                >
                    <div style={{ width: `${statuses.length * 344 + 48}px`, height: '1px' }}></div>
                </div>
            )}

            {/* Pipeline Container - horizontal scroll + column vertical scroll OR Grid Layout */}
            <main
                ref={mainScrollRef}
                onScroll={handleMainScroll}
                className={`flex-1 ${layout === 'grid' ? 'overflow-y-auto' : 'overflow-x-auto pipeline-horizontal-scroll'} bg-gray-50/20 relative`}
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

                {layout === 'grid' ? (
                    /* Grid Layout for Pool */
                    <div className="p-6 lg:p-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredApps.map(app => (
                                <CardLayout key={app.id} app={app} />
                            ))}
                            {filteredApps.length === 0 && (
                                <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border-2 border-dashed border-gray-100">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">No candidates found in this view.</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* Column Board Layout */
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
                                    {filteredApps.filter(a => (a.status?.toLowerCase() || '') === status).map(app => (
                                        <CardLayout key={app.id} app={app} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Application Detail Modal - Quantum Command Center Redesign */}
            <AnimatePresence>
                {selectedApp && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !targetStatus && setSelectedApp(null)}
                            className="absolute inset-0 bg-gray-950/98 backdrop-blur-3xl"
                        />

                        <motion.div
                            layoutId={`modal-${selectedApp.id}`}
                            initial={{ scale: 0.95, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 30 }}
                            className="bg-white w-full h-full md:rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.1)] relative z-10 overflow-hidden flex flex-col border border-gray-100"
                        >
                            {/* Quantum Hero Header: Identity + Phase Pulse */}
                            <div className="bg-white px-10 pt-8 pb-14 shrink-0 border-b border-gray-100 flex flex-col lg:flex-row items-center justify-between gap-10 relative">
                                <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-yellow/10 rounded-full blur-[120px] -translate-y-1/2"></div>

                                <div className="flex items-center gap-8 relative z-10 w-full lg:w-auto">
                                    <div className="w-20 h-20 bg-brand-yellow rounded-[2rem] flex items-center justify-center text-black shadow-[0_20px_40px_rgba(255,240,0,0.3)] rotate-6 border-4 border-white transition-all duration-700 hover:rotate-12 hover:scale-105">
                                        <User size={32} strokeWidth={2.5} />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-4">
                                            <h2 className="text-3xl font-black text-black uppercase tracking-tighter leading-none">{selectedApp.candidate?.name || 'Unknown Node'}</h2>
                                            <div className="bg-black text-brand-yellow px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.3em] shadow-lg">
                                                ID: {selectedApp.candidate?.id}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6 text-gray-400">
                                            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.open(`mailto:${selectedApp.candidate?.email}`)}>
                                                <Mail className="w-3.5 h-3.5 text-black group-hover:scale-110 transition-transform" />
                                                <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-black transition-colors">{selectedApp.candidate?.email}</span>
                                            </div>
                                            <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                                            <div className="flex items-center gap-2 group cursor-pointer">
                                                <Phone className="w-3.5 h-3.5 text-black group-hover:scale-110 transition-transform" />
                                                <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-black transition-colors">{selectedApp.candidate?.phone || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Central Phase Pulse Status Board */}
                                <div className="flex-1 max-w-4xl relative z-10">
                                    <div className="flex items-center justify-between gap-1">
                                        {['submitted', 'written_test', 'interview_1', 'interview_2', 'offer', 'hired'].map((s, i, arr) => {
                                            const currentStatus = selectedApp.status?.toLowerCase();
                                            const statusIdx = arr.indexOf(currentStatus);

                                            // Handling terminal states that aren't in the linear path
                                            const isRejected = currentStatus === 'rejected';
                                            const isPooled = currentStatus === 'pooled';

                                            const isActive = i <= (statusIdx === -1 && (isRejected || isPooled) ? 0 : statusIdx);
                                            const isCurrent = i === statusIdx;

                                            return (
                                                <React.Fragment key={s}>
                                                    <div className="flex flex-col items-center gap-3 group/step relative flex-1">
                                                        <div className={`w-8 h-8 rounded-2xl transition-all duration-700 border-2 flex items-center justify-center ${isCurrent
                                                            ? 'bg-black border-brand-yellow scale-125 shadow-xl'
                                                            : (isRejected && i === 0) ? 'bg-rose-500 border-white shadow-lg scale-110'
                                                                : (isPooled && i === 0) ? 'bg-amber-500 border-white shadow-lg scale-110'
                                                                    : isActive
                                                                        ? 'bg-black/20 border-black/10'
                                                                        : 'bg-gray-100 border-gray-200 opacity-30 group-hover/step:opacity-60'}`}>
                                                            {isRejected && i === 0 ? <X className="w-4 h-4 text-white" />
                                                                : isPooled && i === 0 ? <Archive className="w-4 h-4 text-white" />
                                                                    : isActive ? <CheckCircle className={`w-4 h-4 ${isCurrent ? 'text-brand-yellow' : 'text-black'}`} />
                                                                        : <div className="w-1.5 h-1.5 rounded-full bg-black/10" />}
                                                        </div>
                                                        <span className={`text-[8px] font-black uppercase tracking-widest absolute -bottom-6 whitespace-nowrap transition-all ${isActive ? 'text-black' : 'text-gray-300'}`}>
                                                            {s.replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                    {i < arr.length - 1 && (
                                                        <div className="h-[2px] w-full max-w-[80px] bg-gray-100 relative overflow-hidden self-center translate-y-[-10px]">
                                                            <div className={`absolute inset-0 transition-all duration-1000 ${i < statusIdx ? 'bg-black' : 'bg-transparent'}`}></div>
                                                        </div>
                                                    )}
                                                </React.Fragment>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 relative z-10">
                                    <button
                                        onClick={() => setActiveDetailView(activeDetailView === 'operational' ? 'personal' : 'operational')}
                                        className={`px-8 py-4 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 border-2 ${activeDetailView === 'personal'
                                            ? 'bg-black text-brand-yellow border-black shadow-xl scale-105'
                                            : 'bg-white text-black border-black hover:bg-black hover:text-white'
                                            }`}
                                    >
                                        <Shield className="w-4 h-4" />
                                        {activeDetailView === 'personal' ? 'Operational Path' : 'Candidate Intelligence'}
                                    </button>
                                    <button
                                        onClick={() => setSelectedApp(null)}
                                        className="p-5 bg-gray-50 rounded-3xl text-gray-400 hover:bg-rose-50 hover:text-rose-500 transition-all active:scale-90 group border border-gray-100"
                                    >
                                        <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
                                    </button>
                                </div>
                            </div>

                            {/* Strategic Data Grid - Non-scrolling Workspace */}
                            <div className="flex-1 min-h-0 overflow-hidden bg-white p-5 lg:p-7">
                                <div className="h-full min-h-0">
                                    {activeDetailView === 'operational' ? (
                                        <div className="h-full min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-7">
                                            {/* OPERATIONAL VIEW: Status & Apply Info */}
                                            <div className="lg:col-span-12 h-full min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-7">
                                                {/* LEFT: Feedback & Audit (7/12) */}
                                                <div className="lg:col-span-7 h-full overflow-y-auto custom-scrollbar space-y-6 pr-4">
                                                    <div className="bg-gray-50/50 p-7 rounded-[2rem] border border-gray-100">
                                                        <h3 className="text-[11px] font-black text-black uppercase tracking-[0.4em] mb-7 flex items-center gap-4">
                                                            <History className="w-4 h-4" /> Execution Protocol & Feedback
                                                        </h3>
                                                        <div className="space-y-6 relative border-l-4 border-gray-100 ml-5 pl-8">
                                                            {selectedApp.histories?.length > 0 ? (
                                                                selectedApp.histories.map((h, i) => (
                                                                    <div key={i} className="relative group/log">
                                                                        <div className="absolute -left-[46px] top-1 w-6 h-6 bg-white border-4 border-black rounded-xl group-hover/log:scale-125 transition-all shadow-lg"></div>
                                                                        <div className="flex flex-col gap-4">
                                                                            <div className="flex items-center justify-between">
                                                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{new Date(h.created_at).toLocaleString()}</span>
                                                                                <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 px-3 py-1.5 rounded-lg text-black">Operator: {h.user?.name || 'System Core'}</span>
                                                                            </div>
                                                                            <div className="flex flex-col gap-2">
                                                                                <span className="text-[11px] font-black text-black uppercase tracking-[0.2em]">{h.status?.replace('_', ' ')} Command</span>
                                                                                <p className="text-[14px] font-bold text-gray-600 leading-relaxed italic pr-6">"{h.feedback || 'Access protocol synchronized.'}"</p>
                                                                                {h.document_path && (
                                                                                    <a
                                                                                        href={`${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:8003'}/storage/${h.document_path}`}
                                                                                        target="_blank" rel="noopener noreferrer"
                                                                                        className="mt-4 w-fit flex items-center gap-4 bg-black text-brand-yellow px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-brand-yellow hover:text-black transition-all transform hover:-translate-y-1"
                                                                                    >
                                                                                        <Download className="w-4 h-4" /> Download Attachment
                                                                                    </a>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className="text-center py-20 opacity-30"><span className="text-[12px] font-black uppercase tracking-[0.5em]">No temporal logs detected.</span></div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* RIGHT: Apply Info & Console (5/12) */}
                                                <div className="lg:col-span-5 h-full overflow-y-auto custom-scrollbar space-y-7 pl-4">
                                                    {/* Apply Form Submission Details */}
                                                    <div className="bg-brand-yellow p-7 rounded-[2rem] border-2 border-black/5 shadow-xl relative overflow-hidden">
                                                        <div className="absolute top-0 right-0 p-6 opacity-10"><FileText size={36} /></div>
                                                        <h2 className="text-[10px] font-black text-black uppercase tracking-[0.5em] mb-6 flex items-center gap-3">
                                                            <Plus className="w-4 h-4" /> Submission Metadata
                                                        </h2>
                                                        <div className="space-y-6">
                                                            <div>
                                                                <span className="text-[9px] font-black text-black/40 uppercase tracking-widest block mb-2">Narrative Profile</span>
                                                                <p className="text-lg font-bold text-black leading-tight italic">
                                                                    "{selectedApp.candidate?.professional_background || "Narrative synchronization pending."}"
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <span className="text-[9px] font-black text-black/40 uppercase tracking-widest block mb-2">Suitability Statement</span>
                                                                <p className="text-[13px] font-bold text-black leading-relaxed italic bg-white/20 p-4 rounded-xl border border-black/5">
                                                                    "{selectedApp.description || "No suitability statement provided."}"
                                                                </p>
                                                            </div>
                                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                                                <div className="bg-white/40 p-5 rounded-2xl border border-black/5">
                                                                    <span className="text-[9px] font-black text-black/40 uppercase block mb-1">Age</span>
                                                                    <span className="text-lg font-black text-black">{selectedApp.candidate?.age || 'N/A'}</span>
                                                                </div>
                                                                <div className="bg-white/40 p-5 rounded-2xl border border-black/5">
                                                                    <span className="text-[9px] font-black text-black/40 uppercase block mb-1">Gender</span>
                                                                    <span className="text-lg font-black text-black">{selectedApp.candidate?.gender || 'N/A'}</span>
                                                                </div>
                                                                <div className="bg-white/40 p-5 rounded-2xl border border-black/5">
                                                                    <span className="text-[9px] font-black text-black/40 uppercase block mb-1">C-GPA Index</span>
                                                                    <span className="text-lg font-black text-black">{selectedApp.candidate?.cgpa || '0.00'}</span>
                                                                </div>
                                                                <div className="bg-white/40 p-5 rounded-2xl border border-black/5">
                                                                    <span className="text-[9px] font-black text-black/40 uppercase block mb-1">Total Exp</span>
                                                                    <span className="text-lg font-black text-black">{selectedApp.candidate?.years_of_experience || 0} Yrs</span>
                                                                </div>
                                                            </div>
                                                            <div className="bg-white/40 p-5 rounded-2xl border border-black/5">
                                                                <span className="text-[9px] font-black text-black/40 uppercase block mb-1">Institution Name</span>
                                                                <span className="text-[12px] font-black text-black uppercase">{selectedApp.candidate?.institution_name || 'N/A'}</span>
                                                            </div>

                                                            {/* Candidate CV Access */}
                                                            {selectedApp.candidate?.cv_path && (
                                                                <div className="mt-4 bg-black/5 p-5 rounded-[1.5rem] border border-black/5 group/cv hover:bg-black/10 transition-all">
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex items-center gap-4">
                                                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-black/5 shadow-sm group-hover/cv:scale-110 transition-transform">
                                                                                <FileText className="w-5 h-5 text-black" />
                                                                            </div>
                                                                            <div className="flex flex-col">
                                                                                <span className="text-[10px] font-black uppercase tracking-widest text-black/40">Credential Dossier</span>
                                                                                <span className="text-[12px] font-black text-black uppercase">Candidate_CV.pdf</span>
                                                                            </div>
                                                                        </div>
                                                                        <a
                                                                            href={`${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:8003'}/storage/${selectedApp.candidate.cv_path}`}
                                                                            target="_blank" rel="noopener noreferrer"
                                                                            className="p-3 bg-black text-brand-yellow rounded-xl hover:bg-white hover:text-black transition-all shadow-lg active:scale-95"
                                                                            title="View Candidate CV"
                                                                        >
                                                                            <Download className="w-4 h-4" />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Phase Specific Details - Interview Info */}
                                                            {(selectedApp.status === 'interview_1' || selectedApp.status === 'interview_2') && selectedApp.interviews?.length > 0 && (
                                                                <div className="mt-6 p-5 bg-black text-brand-yellow rounded-[1.5rem] border-4 border-white shadow-2xl">
                                                                    <h4 className="text-[9px] font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                                                                        <Activity className="w-4 h-4 animate-pulse" /> Phase Intelligence
                                                                    </h4>
                                                                    <div className="space-y-3">
                                                                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                                                            <span className="text-[10px] font-black opacity-40 uppercase">Sync Schedule</span>
                                                                            <span className="text-[12px] font-black">{new Date(selectedApp.interviews[0].scheduled_at).toLocaleDateString()} @ {new Date(selectedApp.interviews[0].scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                                        </div>
                                                                        <div className="flex items-center justify-between pt-1">
                                                                            <span className="text-[10px] font-black opacity-40 uppercase">Nav URI</span>
                                                                            {selectedApp.interviews[0].location?.startsWith('http') ? (
                                                                                <a href={selectedApp.interviews[0].location} target="_blank" rel="noopener noreferrer" className="bg-brand-yellow text-black px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all">
                                                                                    Join Pulse <ExternalLink className="inline w-3 h-3 ml-1" />
                                                                                </a>
                                                                            ) : (
                                                                                <span className="text-[12px] font-black">{selectedApp.interviews[0].location || 'Classified'}</span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Offer Phase Intelligence */}
                                                            {(selectedApp.status === 'offer' || selectedApp.status === 'hired') && (
                                                                <div className="mt-6 p-5 bg-brand-yellow text-black rounded-[1.5rem] border-4 border-black shadow-2xl relative overflow-hidden">
                                                                    <div className="absolute top-0 right-0 p-3 opacity-5 rotate-12"><MessageSquare size={32} /></div>
                                                                    <h4 className="text-[9px] font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                                                                        <Zap className="w-4 h-4 animate-pulse" /> Offer Protocol
                                                                    </h4>
                                                                    <div className="space-y-4">
                                                                        <div className="flex items-center justify-between">
                                                                            <span className="text-[10px] font-black opacity-60 uppercase">Draft Status</span>
                                                                            <span className="text-[12px] font-black uppercase">Active Negotiation</span>
                                                                        </div>
                                                                        <button
                                                                            onClick={() => toggleDialog(selectedApp.id)}
                                                                            className="w-full flex items-center justify-center gap-3 bg-black text-brand-yellow py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl"
                                                                        >
                                                                            <MessageSquare className="w-3.5 h-3.5" /> Open Discussion Console
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Deployment Console (Phase Modulation) - Always available in operational view */}
                                                    <div className="bg-black p-7 rounded-[2rem] shadow-2xl border-4 border-brand-yellow/20 relative overflow-hidden group">
                                                        <div className="absolute top-0 left-0 w-full h-[3px] bg-brand-yellow transition-all"></div>
                                                        <h3 className="text-[11px] font-black flex items-center gap-4 text-brand-yellow uppercase tracking-[0.5em] mb-8">
                                                            <Activity className="w-5 h-5 animate-pulse" /> Command Console
                                                        </h3>

                                                        {targetStatus ? (
                                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                                                                {targetStatus.startsWith('interview') && (
                                                                    <div className="grid grid-cols-2 gap-4 bg-white/5 p-5 rounded-2xl border border-white/5">
                                                                        <div className="flex flex-col gap-3">
                                                                            <label className="text-[9px] font-black text-brand-yellow uppercase tracking-[0.3em]">Sync Date</label>
                                                                            <input
                                                                                type="date"
                                                                                value={interviewDate}
                                                                                onChange={(e) => setInterviewDate(e.target.value)}
                                                                                className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-[13px] font-bold text-white focus:outline-none focus:border-brand-yellow"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {targetStatus === 'offer' && (
                                                                    <div className="flex flex-col gap-3 bg-white/5 p-6 rounded-[1.5rem] border-2 border-dashed border-white/20 group hover:border-brand-yellow transition-all">
                                                                        <label className="text-[9px] font-black text-brand-yellow uppercase tracking-[0.4em] mb-1">Offer Document (PDF)</label>
                                                                        <input
                                                                            type="file"
                                                                            accept=".pdf"
                                                                            onChange={(e) => setOfferDocument(e.target.files[0])}
                                                                            className="hidden"
                                                                            id="offer-upload"
                                                                        />
                                                                        <label
                                                                            htmlFor="offer-upload"
                                                                            className="flex items-center justify-center gap-3 cursor-pointer bg-white/5 p-4 rounded-xl text-[9px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all border border-white/10"
                                                                        >
                                                                            {offerDocument ? (
                                                                                <>
                                                                                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                                                                    {offerDocument.name}
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <Download className="w-4 h-4 text-brand-yellow" />
                                                                                    Authorize & Attach Document
                                                                                </>
                                                                            )}
                                                                        </label>
                                                                    </div>
                                                                )}
                                                                <div className="flex flex-col gap-3">
                                                                    <label className="text-[9px] font-black text-brand-yellow uppercase tracking-[0.4em] px-2">Operational Feedback Log</label>
                                                                    <textarea
                                                                        value={statusFeedback}
                                                                        onChange={(e) => setStatusFeedback(e.target.value)}
                                                                        placeholder={`Provide protocol justification for ${targetStatus.replace('_', ' ')}...`}
                                                                        className="w-full bg-black border-2 border-white/10 rounded-[1.5rem] p-5 text-[14px] font-bold text-white focus:outline-none focus:border-brand-yellow transition-all h-32 resize-none shadow-inner"
                                                                    />
                                                                </div>
                                                                <div className="flex gap-4">
                                                                    <button onClick={() => setTargetStatus(null)} className="flex-1 py-3 border-2 border-white/10 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-xl hover:bg-white/5 transition-all">
                                                                        Abort
                                                                    </button>
                                                                    <button
                                                                        disabled={updatingStatus === selectedApp.id}
                                                                        onClick={() => handleUpdateStatus(selectedApp.id, targetStatus)}
                                                                        className="flex-[2] py-3 bg-brand-yellow text-black font-black text-[10px] uppercase tracking-[0.3em] rounded-xl hover:bg-white shadow-[0_15px_40px_rgba(255,240,0,0.2)] transition-all transform active:scale-95"
                                                                    >
                                                                        {updatingStatus === selectedApp.id ? 'SYCING...' : 'Authorize Execution'}
                                                                    </button>
                                                                </div>
                                                            </motion.div>
                                                        ) : (
                                                            <div className="grid grid-cols-1 gap-3">
                                                                {[
                                                                    { s: 'written_test', l: 'Written Test', i: Target },
                                                                    { s: 'interview_1', l: 'Interview 1', i: Search },
                                                                    { s: 'interview_2', l: 'Interview 2', i: Search },
                                                                    { s: 'offer', l: 'Send Offer', i: Zap, primary: true },
                                                                    { s: 'hired', l: 'Mark Hired', i: ShieldCheck, success: true },
                                                                    { s: 'pooled', l: 'Move to Pool', i: History },
                                                                    { s: 'rejected', l: 'Reject', i: X, danger: true },
                                                                ].map((act) => {
                                                                    const currentStatus = selectedApp.status?.toLowerCase();
                                                                    const s = act.s;
                                                                    const linearPhases = ['submitted', 'written_test', 'interview_1', 'interview_2', 'offer', 'hired'];
                                                                    const currLinearIdx = linearPhases.indexOf(currentStatus);
                                                                    const targetLinearIdx = linearPhases.indexOf(s);

                                                                    let isAllowed = false;
                                                                    if (currentStatus === 'hired' || currentStatus === 'rejected') isAllowed = false;
                                                                    else if (currentStatus === 'pooled') isAllowed = linearPhases.includes(s) || s === 'rejected';
                                                                    else {
                                                                        if (s === 'rejected' || s === 'pooled') isAllowed = true;
                                                                        else if (targetLinearIdx === currLinearIdx + 1) isAllowed = true;
                                                                    }

                                                                    return (
                                                                        <button
                                                                            key={act.s}
                                                                            disabled={!isAllowed || updatingStatus === selectedApp.id}
                                                                            onClick={() => setTargetStatus(act.s)}
                                                                            className={`w-full flex items-center justify-between px-5 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-[0.15em] transition-all border-2 ${!isAllowed
                                                                                ? 'bg-white/[0.06] border-white/10 text-white/30 cursor-not-allowed'
                                                                                : act.danger
                                                                                    ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white hover:border-rose-500'
                                                                                    : act.success
                                                                                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white hover:border-emerald-500'
                                                                                        : act.primary
                                                                                            ? 'bg-brand-yellow border-brand-yellow text-black hover:bg-white hover:border-white'
                                                                                            : 'bg-white/10 border-white/20 text-white hover:bg-brand-yellow hover:text-black hover:border-brand-yellow'
                                                                                } active:scale-[0.98] group`}
                                                                        >
                                                                            <span className="flex items-center gap-3">
                                                                                <act.i className="w-4 h-4 transition-transform group-hover:scale-110" /> {act.l}
                                                                            </span>
                                                                            {isAllowed && <ChevronRight className="w-4 h-4 opacity-40 group-hover:translate-x-1 transition-transform" />}
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-full min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-7">
                                            {/* PERSONAL VIEW: Full Personnel Dossier */}
                                            {/* PANEL 1: Identity & Skills (3/12) */}
                                            <div className="lg:col-span-3 h-full overflow-y-auto custom-scrollbar space-y-6 pr-2">
                                                {/* Candidate Identity & CV */}
                                                <div className="bg-black p-6 rounded-[1.5rem] shadow-xl border-4 border-brand-yellow/10 mb-6 relative overflow-hidden group">
                                                    <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12"><User size={48} className="text-brand-yellow" /></div>
                                                    <h2 className="text-[14px] font-black text-white uppercase tracking-tight mb-1">{selectedApp.candidate?.name}</h2>
                                                    <p className="text-[9px] font-black text-brand-yellow uppercase tracking-[0.3em] mb-4">Tactical Asset Profile</p>

                                                    {selectedApp.candidate?.cv_path && (
                                                        <a
                                                            href={`${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:8003'}/storage/${selectedApp.candidate.cv_path}`}
                                                            target="_blank" rel="noopener noreferrer"
                                                            className="flex items-center justify-between w-full bg-white/5 border border-white/10 p-3 rounded-xl hover:bg-brand-yellow hover:text-black transition-all group/btn"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <FileText className="w-4 h-4 text-brand-yellow group-hover/btn:text-black" />
                                                                <span className="text-[9px] font-black uppercase tracking-widest">Access full CV</span>
                                                            </div>
                                                            <ExternalLink className="w-3 h-3 opacity-40 group-hover/btn:opacity-100" />
                                                        </a>
                                                    )}
                                                </div>

                                                {/* Skill Matrix */}
                                                <div className="bg-white p-6 rounded-[1.5rem] border-2 border-gray-100 group hover:border-black transition-all">
                                                    <h3 className="text-[9px] font-black text-black uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
                                                        <Zap className="w-4 h-4" /> Skills
                                                    </h3>
                                                    <div className="space-y-6">
                                                        {(typeof selectedApp.candidate?.skills === 'string' ? JSON.parse(selectedApp.candidate.skills || '[]') : selectedApp.candidate?.skills || []).length > 0 ? (
                                                            (typeof selectedApp.candidate?.skills === 'string' ? JSON.parse(selectedApp.candidate.skills || '[]') : selectedApp.candidate?.skills || []).map((skill, i) => {
                                                                const sName = typeof skill === 'object' ? skill.name : skill;
                                                                const sLevel = typeof skill === 'object' ? skill.level : 'Mapped';
                                                                return (
                                                                    <div key={i} className="group/skill">
                                                                        <div className="flex items-center justify-between mb-2">
                                                                            <span className="text-[11px] font-black text-black uppercase tracking-widest">{sName}</span>
                                                                            <span className="text-[8px] font-black text-gray-400 uppercase">{sLevel}</span>
                                                                        </div>
                                                                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-100 p-[1px]">
                                                                            <motion.div
                                                                                initial={{ width: 0 }}
                                                                                animate={{ width: sLevel === 'Expert' ? '100%' : sLevel === 'Advanced' ? '75%' : sLevel === 'Intermediate' ? '50%' : '25%' }}
                                                                                className="h-full bg-black rounded-full shadow-lg"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })
                                                        ) : (
                                                            <EmptyWidget text="No Skills Documented" />
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Linguistic Protocols */}
                                                <div className="bg-white p-6 rounded-[1.5rem] border-2 border-gray-100">
                                                    <h3 className="text-[9px] font-black text-black uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
                                                        <Globe className="w-4 h-4" /> Language Skill
                                                    </h3>
                                                    <div className="grid grid-cols-1 gap-2">
                                                        {(typeof selectedApp.candidate?.languages === 'string' ? JSON.parse(selectedApp.candidate.languages || '[]') : selectedApp.candidate?.languages || []).length > 0 ? (
                                                            (typeof selectedApp.candidate?.languages === 'string' ? JSON.parse(selectedApp.candidate.languages || '[]') : selectedApp.candidate?.languages || []).map((lang, i) => {
                                                                const lName = typeof lang === 'object' ? lang.language : lang;
                                                                const lFluency = typeof lang === 'object' ? lang.fluency : 'Fluent';
                                                                return (
                                                                    <div key={i} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between group hover:bg-black hover:text-white transition-all duration-300">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow"></div>
                                                                            <span className="text-[10px] font-black uppercase tracking-widest">{lName}</span>
                                                                        </div>
                                                                        <span className="text-[8px] font-black opacity-40 uppercase tracking-widest">{lFluency}</span>
                                                                    </div>
                                                                );
                                                            })
                                                        ) : (
                                                            <EmptyWidget text="No Languages Logged" />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* PANEL 2: Authorized Deployments (5/12) */}
                                            <div className="lg:col-span-5 h-full overflow-y-auto custom-scrollbar space-y-7 px-4">
                                                {/* Deployment History Sequence */}
                                                <div className="space-y-4">
                                                    <h4 className="text-[9px] font-black text-gray-300 uppercase tracking-[0.5em] px-4 flex items-center justify-between">
                                                        <span>Work Experience</span>
                                                        <div className="h-[2px] flex-1 ml-4 bg-gray-100"></div>
                                                    </h4>
                                                    <div className="space-y-6 relative before:absolute before:left-8 before:top-4 before:bottom-4 before:w-[2px] before:bg-gray-100">
                                                        {(Array.isArray(selectedApp.candidate?.work_experience) ? selectedApp.candidate.work_experience : []).length > 0 ? (
                                                            (Array.isArray(selectedApp.candidate?.work_experience) ? selectedApp.candidate.work_experience : []).map((exp, i) => (
                                                                <div key={i} className="relative pl-16 group">
                                                                    <div className="absolute left-[29px] top-5 w-2 h-2 bg-black rounded-full border-2 border-white z-10 shadow-xl group-hover:scale-150 transition-all"></div>
                                                                    <div className="bg-white p-5 rounded-[1.5rem] border-2 border-gray-100 hover:border-black hover:bg-gray-50 transition-all">
                                                                        <div className="flex justify-between items-start mb-1">
                                                                            <h5 className="text-[15px] font-black text-black uppercase tracking-tight">{exp.title}</h5>
                                                                            <span className="bg-black text-brand-yellow px-2 py-0.5 rounded-full text-[7px] font-black uppercase">{exp.duration}</span>
                                                                        </div>
                                                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">{exp.company}</p>
                                                                        <p className="text-[12px] font-bold text-gray-500 leading-relaxed italic">"{exp.description}"</p>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="pl-12"><EmptyWidget text="No Deployment History Found" /></div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Authorization Records Timeline */}
                                                <div className="space-y-4">
                                                    <h4 className="text-[9px] font-black text-gray-300 uppercase tracking-[0.5em] px-4 flex items-center justify-between">
                                                        <span>Qualification Detail</span>
                                                        <div className="h-[2px] flex-1 ml-4 bg-gray-100"></div>
                                                    </h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {(Array.isArray(selectedApp.candidate?.qualifications) ? selectedApp.candidate.qualifications : []).length > 0 ? (
                                                            (Array.isArray(selectedApp.candidate?.qualifications) ? selectedApp.candidate.qualifications : []).map((qual, i) => (
                                                                <div key={i} className="bg-white p-5 rounded-[1.5rem] border-2 border-gray-100 hover:border-black transition-all group overflow-hidden relative">
                                                                    <div className="absolute -top-8 -right-8 w-24 h-24 bg-brand-yellow rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-all"></div>
                                                                    <div className="bg-black text-brand-yellow px-2 py-0.5 rounded-md text-[7px] font-black uppercase mb-3 w-fit">{qual.graduation_date || 'Classified'}</div>
                                                                    <h5 className="text-[14px] font-black text-black uppercase tracking-tight mb-1">{qual.degree}</h5>
                                                                    <p className="text-gray-400 text-[8px] font-black uppercase tracking-widest mb-1">{qual.subject}</p>
                                                                    <div className="text-gray-300 text-[8px] font-black uppercase tracking-[0.2em]">{qual.institution}</div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="col-span-2"><EmptyWidget text="No Authorization Records" /></div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* PANEL 3: Command & Verification (4/12) */}
                                            <div className="lg:col-span-4 h-full overflow-y-auto custom-scrollbar space-y-6 pl-2">
                                                {/* Verification Nodes */}
                                                <div className="bg-white p-6 rounded-[1.5rem] border-2 border-gray-100 group hover:border-black transition-all">
                                                    <h3 className="text-[9px] font-black text-black uppercase tracking-[0.4em] mb-4 flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Certification Detail
                                                        </div>
                                                        <span className="bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded text-[7px]">
                                                            {Array.isArray(selectedApp.candidate?.certifications) ? selectedApp.candidate.certifications.length : 0} Nodes Verified
                                                        </span>
                                                    </h3>
                                                    <div className="space-y-3">
                                                        {Array.isArray(selectedApp.candidate?.certifications) && selectedApp.candidate.certifications.length > 0 ? (
                                                            selectedApp.candidate.certifications.map(c => ({ ...c, type: 'CERT' })).map((node, i) => (
                                                                <div key={i} className="flex items-center justify-between bg-gray-50 p-4 rounded-[1.2rem] border-2 border-transparent hover:border-black transition-all relative overflow-hidden group/node">
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center border border-gray-100 group-hover/node:bg-black group-hover/node:text-brand-yellow transition-all">
                                                                            <Shield className="w-4 h-4" />
                                                                        </div>
                                                                        <div className="flex flex-col min-w-0">
                                                                            <div className="flex items-center gap-2 mb-0.5">
                                                                                <span className="text-[10px] font-black text-black uppercase tracking-widest truncate">{node.name}</span>
                                                                                <span className={`text-[6px] font-black px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 uppercase tracking-tighter`}>{node.type}</span>
                                                                            </div>
                                                                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest truncate">{node.issuer || node.company || 'Authenticated'}</span>
                                                                        </div>
                                                                    </div>
                                                                    {(node.file_path || (node.id && (node.id.startsWith('http') || node.id.includes('.')))) && (
                                                                        <a
                                                                            href={node.file_path ? `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '')}/storage/${node.file_path}` : node.id}
                                                                            target="_blank" rel="noopener noreferrer"
                                                                            className="p-2.5 bg-white rounded-xl text-black border border-gray-100 hover:bg-black hover:text-brand-yellow transition-all shadow-xl"
                                                                        >
                                                                            {node.file_path ? <Download className="w-3.5 h-3.5" /> : <ExternalLink className="w-3.5 h-3.5" />}
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <EmptyWidget text="No verification nodes found." />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
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
        </div >
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
                className="relative bg-white w-full h-full max-h-[85vh] max-w-xl rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col"
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

// UI Components for the Modal
const CompactStat = ({ icon, label, value }) => (
    <div className="flex-1 flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5 group hover:border-brand-yellow/30 transition-all duration-500 hover:bg-white/10 shadow-inner">
        <div className="w-10 h-10 bg-black/40 rounded-xl flex items-center justify-center text-white/30 group-hover:text-brand-yellow group-hover:bg-black transition-all shadow-xl shrink-0 border border-white/5 group-hover:border-brand-yellow/20">
            {React.cloneElement(icon, { size: 18 })}
        </div>
        <div className="min-w-0">
            <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] block mb-1 group-hover:text-brand-yellow/60 transition-colors truncate">{label}</span>
            <span className="text-[13px] font-black text-white uppercase tracking-tight group-hover:text-brand-yellow transition-colors block truncate">{value}</span>
        </div>
    </div>
);

const EmptyWidget = ({ text }) => (
    <div className="w-full py-8 flex flex-col items-center justify-center border-2 border-white/5 border-dashed rounded-[2.5rem] bg-white/5 group hover:border-brand-yellow/20 transition-all">
        <Target size={24} className="text-white/10 mb-3 group-hover:text-brand-yellow/30 transition-colors" />
        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 group-hover:text-white/40 transition-colors">{text}</span>
    </div>
);
