import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Shield, Key, Camera, LayoutGrid, Activity, History, ChevronRight, Zap, Target, Lock, Globe, ShieldCheck, Clock, CheckCircle, MessageSquare, Briefcase, LogOut, Bell, Download, X, Send, FileText, Trash2, Edit3, Plus, ExternalLink, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

const UserProfile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && (tab === 'profile' || tab === 'applications')) {
            setActiveTab(tab);
        }
    }, [searchParams]);
    const [applications, setApplications] = useState([]);
    const [loadingApps, setLoadingApps] = useState(false);

    // Detailed Profile State
    const [profileData, setProfileData] = useState({
        work_experience: [],
        qualifications: [],
        certifications: [],
        languages: [],
        skills: [],
        experience_certificates: []
    });
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);

    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [openDialogs, setOpenDialogs] = useState({});
    const [dialogMessages, setDialogMessages] = useState({});
    const [dialogInput, setDialogInput] = useState({});
    const [dialogLoading, setDialogLoading] = useState({});
    const [sendingMsg, setSendingMsg] = useState({});

    // Change Password State
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        current_password: '',
        password: '',
        password_confirmation: ''
    });
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    const [editingNodes, setEditingNodes] = useState({
        work_experience: {},
        qualifications: {},
        certifications: {},
        languages: {},
        skills: {},
        experience_certificates: {}
    });

    const toggleEditNode = (key, index) => {
        if (key === 'certifications' && editingNodes[key]?.[index]) {
            const cert = profileData[key][index];
            if (cert.id && (cert.id.startsWith('http') || cert.id.includes('.'))) {
                if (!cert.id.startsWith('https://')) {
                    alert('Certification link must start with https://');
                    return;
                }
            }
        }
        setEditingNodes(prev => ({
            ...prev,
            [key]: { ...prev[key], [index]: !prev[key][index] }
        }));
    };

    // Fetch profile and notifications
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [notifRes, profileRes] = await Promise.all([
                    api.get('/notifications'),
                    api.get('/profile')
                ]);

                const notifs = notifRes.data?.notifications || [];
                setNotifications(notifs);
                setUnreadCount(notifs.length);

                if (profileRes.data) {
                    setProfileData({
                        work_experience: profileRes.data.work_experience || [],
                        qualifications: profileRes.data.qualifications || [],
                        certifications: profileRes.data.certifications || [],
                        languages: profileRes.data.languages || [],
                        skills: profileRes.data.skills || [],
                        experience_certificates: profileRes.data.experience_certificates || []
                    });
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoadingProfile(false);
            }
        };
        fetchData();
    }, []);

    // Handle intent-based actions (e.g., reset password)
    useEffect(() => {
        if (searchParams.get('action') === 'reset_password') {
            setIsPasswordModalOpen(true);
            const newParams = new URLSearchParams(searchParams);
            newParams.delete('action');
            setSearchParams(newParams, { replace: true });
        }
    }, [searchParams, setSearchParams]);

    const handleSaveProfile = async () => {
        for (const cert of profileData.certifications) {
            if (cert.id && (cert.id.startsWith('http') || cert.id.includes('.'))) {
                if (!cert.id.startsWith('https://')) {
                    alert(`Certification link for "${cert.name || 'Untitled'}" must start with https://`);
                    return;
                }
            }
        }

        setSavingProfile(true);
        try {
            const formData = new FormData();

            // Append basic fields if needed, but here we focus on the profileData
            Object.keys(profileData).forEach(key => {
                if (key === 'experience_certificates' || key === 'certifications') {
                    // Filter out actual File objects to handle them separately
                    const itemsWithoutFiles = profileData[key].map(c => ({
                        ...c,
                        file: undefined // Ensure file object is not stringified
                    }));
                    formData.append(key, JSON.stringify(itemsWithoutFiles));

                    // Append files
                    profileData[key].forEach((item, index) => {
                        if (item.file instanceof File) {
                            formData.append(`${key}_files[${index}]`, item.file);
                        }
                    });
                } else {
                    formData.append(key, JSON.stringify(profileData[key]));
                }
            });

            await api.post('/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Profile updated successfully!');
            // Refresh profile to get updated file paths
            const res = await api.get('/profile');
            if (res.data) {
                setProfileData({
                    work_experience: res.data.work_experience || [],
                    qualifications: res.data.qualifications || [],
                    certifications: res.data.certifications || [],
                    languages: res.data.languages || [],
                    skills: res.data.skills || [],
                    experience_certificates: res.data.experience_certificates || []
                });
            }
        } catch (err) {
            console.error('Update failed:', err);
            alert('Failed to update profile.');
        } finally {
            setSavingProfile(false);
        }
    };

    const addListEntry = (key, template) => {
        setProfileData(prev => {
            const newList = [...prev[key], template];
            const newIndex = newList.length - 1;
            setEditingNodes(editingPrev => ({
                ...editingPrev,
                [key]: { ...editingPrev[key], [newIndex]: true }
            }));
            return { ...prev, [key]: newList };
        });
    };

    const removeListEntry = (key, index) => {
        if (!confirm('Are you sure you want to remove this node?')) return;
        setProfileData(prev => ({
            ...prev,
            [key]: prev[key].filter((_, i) => i !== index)
        }));
        // Reset editing state for this category on removal to avoid index mismatch
        setEditingNodes(prev => ({
            ...prev,
            [key]: {}
        }));
    };

    const updateListEntry = (key, index, field, value) => {
        setProfileData(prev => ({
            ...prev,
            [key]: prev[key].map((item, i) => i === index ? { ...item, [field]: value } : item)
        }));
    };

    const handleActiveSignalsClick = async () => {
        setActiveTab('applications');
        if (unreadCount > 0) {
            try {
                await api.post('/notifications/mark-all-read');
                setUnreadCount(0);
            } catch (e) { /* silent */ }
        }
    };

    useEffect(() => {
        if (activeTab === 'applications') {
            const fetchUserApps = async () => {
                setLoadingApps(true);
                try {
                    const response = await api.get('/applications?scope=self');
                    const apps = Array.isArray(response.data) ? response.data : [];
                    setApplications(apps);
                    apps.filter(a => a.status?.toLowerCase() === 'offer').forEach(a => loadMessages(a.id));
                } catch (err) {
                    console.error('Error fetching user apps:', err);
                } finally {
                    setLoadingApps(false);
                }
            };
            fetchUserApps();
        }
    }, [activeTab]);

    const loadMessages = async (appId) => {
        setDialogLoading(prev => ({ ...prev, [appId]: true }));
        try {
            const res = await api.get(`/applications/${appId}/messages`);
            setDialogMessages(prev => ({ ...prev, [appId]: res.data }));
        } catch (e) { console.error(e); }
        finally { setDialogLoading(prev => ({ ...prev, [appId]: false })); }
    };

    const sendMessage = async (appId) => {
        const msgText = dialogInput[appId] || '';
        if (!msgText.trim()) return;

        const tempId = Date.now();
        const tempMsg = {
            id: tempId,
            user_id: user?.id,
            message: msgText,
            created_at: new Date().toISOString(),
            user: { id: user?.id, name: user?.name },
            isOptimistic: true
        };

        setDialogMessages(prev => ({
            ...prev,
            [appId]: [...(prev[appId] || []), tempMsg]
        }));
        setDialogInput(prev => ({ ...prev, [appId]: '' }));
        setSendingMsg(prev => ({ ...prev, [appId]: true }));

        try {
            const res = await api.post(`/applications/${appId}/messages`, { message: msgText });
            setDialogMessages(prev => ({
                ...prev,
                [appId]: (prev[appId] || []).map(m => m.id === tempId ? res.data : m)
            }));
        } catch (e) {
            setDialogMessages(prev => ({
                ...prev,
                [appId]: (prev[appId] || []).filter(m => m.id !== tempId)
            }));
            setDialogInput(prev => ({ ...prev, [appId]: msgText }));
            alert('Failed to send. Try again.');
        }
        finally { setSendingMsg(prev => ({ ...prev, [appId]: false })); }
    };

    const toggleDialog = (appId) => {
        setOpenDialogs(prev => ({ ...prev, [appId]: !prev[appId] }));
        if (!openDialogs[appId]) {
            loadMessages(appId);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');
        setPasswordLoading(true);
        try {
            await api.post('/change-password', passwordForm);
            setPasswordSuccess('Password updated successfully.');
            setTimeout(() => {
                setIsPasswordModalOpen(false);
                setPasswordSuccess('');
                setPasswordForm({ current_password: '', password: '', password_confirmation: '' });
            }, 2000);
        } catch (err) {
            setPasswordError(err.response?.data?.message || 'Protocol breach: Update failed.');
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen w-full selection:bg-brand-yellow/30 overflow-x-hidden relative">
            <div className="w-full px-6 py-12 lg:px-12">
                {/* Back to Home button */}
                <div className="mb-6">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider hover:text-gray-900 transition-colors group"
                    >
                        <ChevronRight className="w-3.5 h-3.5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>
                </div>
                <AnimatePresence mode="wait">
                    {activeTab === 'profile' ? (
                        <motion.div
                            key="profile"
                            initial={{ opacity: 0, scale: 0.98, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: -30 }}
                            className="space-y-8"
                        >
                            {/* Hero Profile Header */}
                            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-black"></div>
                                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-yellow/10 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none"></div>
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-yellow/5 rounded-full blur-[60px] pointer-events-none"></div>
                                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-yellow/50 to-transparent"></div>

                                <div className="relative z-10 p-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                    <div className="flex items-center gap-7">
                                        <div className="relative shrink-0">
                                            <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-brand-yellow to-yellow-400 rounded-[1.75rem] flex items-center justify-center text-black text-4xl font-black shadow-[0_8px_32px_rgba(255,242,0,0.3)] border-4 border-brand-yellow/30">
                                                {user?.name?.charAt(0)?.toUpperCase()}
                                            </div>
                                            <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-emerald-400 rounded-full border-4 border-gray-900 shadow-lg"></div>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-[9px] font-black text-white uppercase tracking-[0.4em] bg-white/10 px-3 py-1 rounded-full border border-white/20">My Profile</span>
                                                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.3em] bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">Active</span>
                                            </div>
                                            <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight uppercase leading-none mb-3">{user?.name}</h2>
                                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                                {user?.email && (
                                                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                                        <Mail className="w-3 h-3 text-gray-500" /> {user.email}
                                                    </span>
                                                )}
                                                {user?.role?.name && (
                                                    <span className="flex items-center gap-1.5 text-[9px] font-black text-brand-yellow uppercase tracking-widest bg-black/50 px-3 py-1.5 rounded-xl border border-white/20 ml-2">
                                                        <ShieldCheck className="w-3 h-3" /> {user.role.name}
                                                    </span>
                                                )}
                                                {user?.department?.name && (
                                                    <span className="flex items-center gap-1.5 text-[9px] font-black text-gray-300 uppercase tracking-widest bg-black/50 px-3 py-1.5 rounded-xl border border-white/5">
                                                        <Briefcase className="w-3 h-3 text-gray-400" /> {user.department.name}
                                                    </span>
                                                )}
                                                {user?.company?.name && (
                                                    <span className="flex items-center gap-1.5 text-[9px] font-black text-gray-300 uppercase tracking-widest bg-black/50 px-3 py-1.5 rounded-xl border border-white/5">
                                                        <Globe className="w-3 h-3 text-gray-400" /> {user.company.name}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={savingProfile}
                                            className="shrink-0 bg-brand-yellow text-black px-10 py-5 rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] hover:bg-white hover:scale-105 transition-all shadow-[0_10px_30px_rgba(255,242,0,0.3)] active:scale-95 flex items-center justify-center gap-4 disabled:opacity-50 group border-4 border-transparent hover:border-white w-full md:w-auto"
                                        >
                                            {savingProfile ? (
                                                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <><ShieldCheck className="w-5 h-5 group-hover:scale-125 transition-transform" /> Save Changes</>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {/* Form Sections Grid */}
                            <div className="grid grid-cols-1 gap-8 pb-12">

                                {/* 1. Work Experience */}
                                <SectionCard
                                    title="Work Experience"
                                    icon={<Briefcase />}
                                    description="Add your work experience."
                                    onAdd={() => addListEntry('work_experience', { title: '', company: '', duration: '', description: '' })}
                                >
                                    <div className="space-y-6">
                                        {profileData.work_experience.map((exp, idx) => (
                                            <div key={idx} className="bg-gray-50/50 p-8 rounded-[1.5rem] border border-gray-100 relative group/entry hover:bg-white hover:shadow-xl transition-all duration-300">
                                                <div className="absolute top-6 right-6 flex items-center gap-2 opacity-0 group-hover/entry:opacity-100 transition-opacity">
                                                    <button onClick={() => toggleEditNode('work_experience', idx)} className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                                                        {editingNodes.work_experience[idx] ? <CheckCircle className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
                                                    </button>
                                                    <button onClick={() => removeListEntry('work_experience', idx)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                                                </div>

                                                {editingNodes.work_experience[idx] ? (
                                                    <div className="space-y-6 pt-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <ProfileInput label="Job Title" value={exp.title} onChange={(v) => updateListEntry('work_experience', idx, 'title', v)} placeholder="e.g. Senior Software Engineer" />
                                                            <ProfileInput label="Company" value={exp.company} onChange={(v) => updateListEntry('work_experience', idx, 'company', v)} placeholder="e.g. Acme Corp" />
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <ProfileInput label="Duration" value={exp.duration} onChange={(v) => updateListEntry('work_experience', idx, 'duration', v)} placeholder="e.g. 2021 - Present" />
                                                        </div>
                                                        <ProfileTextarea label="Description" value={exp.description} onChange={(v) => updateListEntry('work_experience', idx, 'description', v)} placeholder="Describe your responsibilities and achievements..." />
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col gap-2 pr-20">
                                                        <div className="flex bg-gray-900 text-brand-yellow px-3 py-1 rounded-lg w-fit text-[8px] font-black uppercase mb-1">{exp.duration || 'Duration Unknown'}</div>
                                                        <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight">{exp.title || 'Untitled Experience'}</h4>
                                                        <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none">{exp.company || 'Unknown Company'}</span>
                                                        <p className="text-[13px] font-medium text-gray-600 mt-4 leading-relaxed line-clamp-2">{exp.description || 'No description provided.'}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </SectionCard>

                                {/* 2. Qualification Detail */}
                                <SectionCard
                                    title="Educational Background"
                                    icon={<History />}
                                    description="Educational background and degrees."
                                    onAdd={() => addListEntry('qualifications', { degree: '', institution: '', year: '' })}
                                >
                                    <div className="space-y-6">
                                        {profileData.qualifications.map((qual, idx) => (
                                            <div key={idx} className="bg-gray-50/50 p-8 rounded-[1.5rem] border border-gray-100 relative group/entry hover:bg-white hover:shadow-xl transition-all duration-300">
                                                <div className="absolute top-6 right-6 flex items-center gap-2 opacity-0 group-hover/entry:opacity-100 transition-opacity">
                                                    <button onClick={() => toggleEditNode('qualifications', idx)} className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                                                        {editingNodes.qualifications[idx] ? <CheckCircle className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
                                                    </button>
                                                    <button onClick={() => removeListEntry('qualifications', idx)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                                                </div>

                                                {editingNodes.qualifications[idx] ? (
                                                    <div className="space-y-6 pt-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <ProfileInput label="Degree Type" value={qual.degree} onChange={(v) => updateListEntry('qualifications', idx, 'degree', v)} placeholder="e.g. Bachelor of Science" />
                                                            <ProfileInput label="Subject of Study" value={qual.subject} onChange={(v) => updateListEntry('qualifications', idx, 'subject', v)} placeholder="e.g. Computer Science" />
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                            <ProfileInput label="University/Institution" value={qual.institution} onChange={(v) => updateListEntry('qualifications', idx, 'institution', v)} placeholder="e.g. MIT" />
                                                            <ProfileInput label="Cumulative GPA" value={qual.gpa} onChange={(v) => updateListEntry('qualifications', idx, 'gpa', v)} placeholder="e.g. 3.8/4.0" />
                                                            <ProfileInput label="Graduation Date" type="date" value={qual.graduation_date} onChange={(v) => updateListEntry('qualifications', idx, 'graduation_date', v)} placeholder="YYYY-MM-DD" />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex bg-gray-900 text-brand-yellow px-3 py-1 rounded-lg w-fit text-[8px] font-black uppercase mb-1">{qual.graduation_date || 'Date Unknown'}</div>
                                                        <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight line-clamp-1">{qual.degree || 'Untitled Degree'} - {qual.subject || 'No Subject'}</h4>
                                                        <div className="flex items-center gap-4 mt-1">
                                                            <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none">{qual.institution || 'Unknown Institution'}</span>
                                                            {qual.gpa && (
                                                                <>
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
                                                                    <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">GPA: {qual.gpa}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </SectionCard>

                                {/* 3. Certification Detail */}
                                <SectionCard
                                    title="Certifications"
                                    icon={<ShieldCheck />}
                                    description="Professional certificates and licenses."
                                    onAdd={() => addListEntry('certifications', { name: '', issuer: '', id: '' })}
                                >
                                    <div className="space-y-6">
                                        {profileData.certifications.map((cert, idx) => (
                                            <div key={idx} className="bg-gray-50/50 p-8 rounded-[1.5rem] border border-gray-100 relative group/entry hover:bg-white hover:shadow-xl transition-all duration-300">
                                                <div className="absolute top-6 right-6 flex items-center gap-2 opacity-0 group-hover/entry:opacity-100 transition-opacity">
                                                    <button onClick={() => toggleEditNode('certifications', idx)} className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                                                        {editingNodes.certifications[idx] ? <CheckCircle className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
                                                    </button>
                                                    <button onClick={() => removeListEntry('certifications', idx)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                                                </div>

                                                {editingNodes.certifications[idx] ? (
                                                    <div className="space-y-6 pt-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <ProfileInput label="Certificate Name" value={cert.name} onChange={(v) => updateListEntry('certifications', idx, 'name', v)} placeholder="e.g. AWS Solutions Architect" />
                                                            <ProfileInput label="Issuing Authority" value={cert.issuer} onChange={(v) => updateListEntry('certifications', idx, 'issuer', v)} placeholder="e.g. Amazon" />
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <ProfileInput label="Credential ID / URL" value={cert.id} onChange={(v) => updateListEntry('certifications', idx, 'id', v)} placeholder="e.g. CERT-909 or URL" />
                                                            <div className="flex flex-col gap-3">
                                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Certificate Document</label>
                                                                <div className="relative group/upload">
                                                                    <input
                                                                        type="file"
                                                                        accept=".pdf,.jpg,.jpeg,.png"
                                                                        onChange={(e) => updateListEntry('certifications', idx, 'file', e.target.files[0])}
                                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                                    />
                                                                    <div className="flex items-center gap-4 bg-gray-100 p-4 rounded-2xl border-2 border-dashed border-gray-200 group-hover/upload:border-brand-yellow/30 group-hover/upload:bg-gray-50 transition-all">
                                                                        <Upload className="w-5 h-5 text-gray-400" />
                                                                        <span className="text-[11px] font-black text-gray-900 uppercase tracking-widest">{cert.file ? cert.file.name : (cert.file_path ? 'Replace Current File' : 'Choose File')}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-between pr-20">
                                                        <div className="flex flex-col gap-2">
                                                            {cert.id && <div className="flex bg-brand-yellow text-black px-3 py-1 rounded-lg w-fit text-[8px] font-black uppercase mb-1">{cert.id}</div>}
                                                            <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight">{cert.name || 'Untitled Credential'}</h4>
                                                            <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none">{cert.issuer || 'Unknown Authority'}</span>
                                                        </div>
                                                        {(cert.file_path || (cert.id && (cert.id.startsWith('http') || cert.id.includes('.')))) && (
                                                            <a
                                                                href={cert.file_path ? `${(import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '').replace('/api', '')}/storage/${cert.file_path}` : cert.id}
                                                                target="_blank" rel="noopener noreferrer"
                                                                className="p-4 bg-gray-900 text-brand-yellow rounded-2xl hover:bg-black transition-all shadow-xl"
                                                            >
                                                                <ExternalLink className="w-5 h-5" />
                                                            </a>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </SectionCard>

                                {/* 4. Skills & Languages */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <SectionCard
                                        title="Skills"
                                        icon={<Zap />}
                                        description="Professional skills and proficiencies."
                                        onAdd={() => addListEntry('skills', { name: '', level: 'Intermediate' })}
                                    >
                                        <div className="space-y-4">
                                            {profileData.skills.map((skill, idx) => (
                                                <div key={idx} className="flex items-center gap-4 bg-gray-50/80 p-4 rounded-2xl border border-gray-100 group/entry relative">
                                                    <div className="absolute -top-2 -right-2 flex items-center gap-1 opacity-0 group-hover/entry:opacity-100 transition-opacity z-10">
                                                        <button onClick={() => toggleEditNode('skills', idx)} className="p-1.5 bg-white shadow-lg rounded-lg text-gray-400 hover:text-gray-900 transition-colors border border-gray-100">
                                                            {editingNodes.skills[idx] ? <CheckCircle className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                                                        </button>
                                                        <button onClick={() => removeListEntry('skills', idx)} className="p-1.5 bg-white shadow-lg rounded-lg text-gray-400 hover:text-red-500 transition-colors border border-gray-100"><Trash2 className="w-4 h-4" /></button>
                                                    </div>

                                                    {editingNodes.skills[idx] ? (
                                                        <>
                                                            <input
                                                                className="flex-1 bg-transparent border-none text-[13px] font-black uppercase tracking-wider text-gray-900 focus:ring-0 placeholder:text-gray-300"
                                                                value={skill.name}
                                                                onChange={(e) => updateListEntry('skills', idx, 'name', e.target.value)}
                                                                placeholder="e.g. React.js"
                                                            />
                                                            <select
                                                                className="bg-white border-none text-[10px] font-black uppercase tracking-widest text-gray-900 px-4 rounded-xl focus:ring-4 focus:ring-gray-100"
                                                                value={skill.level}
                                                                onChange={(e) => updateListEntry('skills', idx, 'level', e.target.value)}
                                                            >
                                                                <option>Beginner</option>
                                                                <option>Intermediate</option>
                                                                <option>Advanced</option>
                                                                <option>Expert</option>
                                                            </select>
                                                        </>
                                                    ) : (
                                                        <div className="flex items-center justify-between w-full">
                                                            <span className="text-[12px] font-black text-gray-900 uppercase tracking-widest">{skill.name || 'Untitled Skill'}</span>
                                                            <span className="bg-brand-yellow text-black px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-sm">{skill.level}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </SectionCard>

                                    <SectionCard
                                        title="Languages"
                                        icon={<MessageSquare />}
                                        description="Languages you are proficient in."
                                        onAdd={() => addListEntry('languages', { language: '', fluency: 'Fluent' })}
                                    >
                                        <div className="space-y-4">
                                            {profileData.languages.map((lang, idx) => (
                                                <div key={idx} className="bg-gray-50/50 p-6 rounded-[1.5rem] border border-gray-100 relative group/entry hover:bg-white transition-all">
                                                    <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover/entry:opacity-100 transition-opacity">
                                                        <button onClick={() => toggleEditNode('languages', idx)} className="p-1.5 text-gray-400 hover:text-gray-900 transition-colors">
                                                            {editingNodes.languages[idx] ? <CheckCircle className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                                                        </button>
                                                        <button onClick={() => removeListEntry('languages', idx)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                                    </div>

                                                    {editingNodes.languages[idx] ? (
                                                        <div className="space-y-4 pt-4">
                                                            <ProfileInput label="Language" value={lang.language} onChange={(v) => updateListEntry('languages', idx, 'language', v)} placeholder="e.g. English" />
                                                            <ProfileInput label="Fluency" value={lang.fluency} onChange={(v) => updateListEntry('languages', idx, 'fluency', v)} placeholder="e.g. Native" />
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-[12px] font-black text-gray-900 uppercase tracking-widest">{lang.language || 'Language Unknown'}</span>
                                                            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest">{lang.fluency || 'Unknown'}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </SectionCard>
                                </div>


                            </div >
                        </motion.div >
                    ) : (
                        <motion.div
                            key="applications"
                            initial={{ opacity: 0, scale: 0.98, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: -30 }}
                            className="space-y-8"
                        >
                            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-xl shadow-black/5">
                                <div className="flex items-center gap-4 mb-10">
                                    <Activity className="w-8 h-8 text-gray-900" />
                                    <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase leading-none">Application Pipeline</h2>
                                </div>

                                {loadingApps ? (
                                    <div className="py-32 flex flex-col items-center gap-6">
                                        <div className="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin shadow-2xl"></div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 animate-pulse">Loading Applications...</span>
                                    </div>
                                ) : applications.length === 0 ? (
                                    <div className="py-32 border-4 border-gray-50 border-dashed rounded-[3rem] flex flex-col items-center justify-center opacity-30 select-none bg-gray-50/50">
                                        <Zap className="w-16 h-16 text-gray-300 mb-6" />
                                        <span className="text-[12px] font-black text-gray-400 uppercase tracking-[0.5em] ">No applications found</span>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-8">
                                        {applications.map((app) => (
                                            <ApplicationBlock
                                                key={app.id}
                                                app={app}
                                                toggleDialog={toggleDialog}
                                                openDialogs={openDialogs}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Offer Conversation Modal */}
            <AnimatePresence>
                {Object.entries(openDialogs).map(([appId, isOpen]) => (
                    isOpen && (
                        <OfferConversationModal
                            key={appId}
                            isOpen={isOpen}
                            onClose={() => toggleDialog(appId)}
                            appId={appId}
                            user={user}
                            applications={applications}
                            dialogLoading={dialogLoading}
                            dialogMessages={dialogMessages}
                            dialogInput={dialogInput}
                            setDialogInput={setDialogInput}
                            sendMessage={sendMessage}
                            sendingMsg={sendingMsg}
                        />
                    )
                ))}
            </AnimatePresence>

            {/* Change Password Modal */}
            <AnimatePresence>
                {isPasswordModalOpen && (
                    <ChangePasswordModal
                        isOpen={isPasswordModalOpen}
                        onClose={() => {
                            setIsPasswordModalOpen(false);
                            setPasswordError('');
                            setPasswordSuccess('');
                            setPasswordForm({ current_password: '', password: '', password_confirmation: '' });
                        }}
                        onSubmit={handleChangePassword}
                        form={passwordForm}
                        setForm={setPasswordForm}
                        loading={passwordLoading}
                        error={passwordError}
                        success={passwordSuccess}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

// UI Sub-components
const SectionCard = ({ title, icon, description, onAdd, children }) => (
    <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-xl shadow-black/5">
        <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-brand-yellow shadow-lg">
                    {React.cloneElement(icon, { size: 24 })}
                </div>
                <div>
                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight leading-none mb-1">{title}</h3>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{description}</p>
                </div>
            </div>
            <button
                onClick={onAdd}
                className="flex items-center gap-3 bg-white text-gray-900 px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-wider hover:bg-gray-900 hover:text-brand-yellow transition-all shadow-md border border-gray-100 active:scale-95"
            >
                <Zap size={14} className="text-brand-yellow" /> Add Item
            </button>
        </div>
        <div className="p-8">{children}</div>
    </div>
);

const ProfileInput = ({ label, value, onChange, placeholder, type = "text" }) => (
    <div className="flex flex-col gap-3">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">{label}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-white border-2 border-gray-100 rounded-2xl px-6 py-4 text-[14px] font-bold text-gray-900 focus:outline-none focus:ring-8 focus:ring-brand-yellow/5 focus:border-brand-yellow/20 placeholder:text-gray-200 transition-all font-sans"
        />
    </div>
);

const ProfileTextarea = ({ label, value, onChange, placeholder }) => (
    <div className="flex flex-col gap-3">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">{label}</label>
        <textarea
            rows={4}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-white border-2 border-gray-100 rounded-[2rem] px-8 py-6 text-[14px] font-bold text-gray-900 focus:outline-none focus:ring-8 focus:ring-brand-yellow/5 focus:border-brand-yellow/20 placeholder:text-gray-200 transition-all font-sans resize-none"
        />
    </div>
);

const EmptyState = ({ text }) => (
    <div className="py-12 flex flex-col items-center justify-center border-4 border-gray-50 border-dashed rounded-[2.5rem] opacity-30 select-none">
        <Target className="w-10 h-10 text-gray-300 mb-4" />
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">{text}</span>
    </div>
);

const ApplicationBlock = ({ app, toggleDialog, openDialogs }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-gray-50/50 rounded-[2.5rem] border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 border-l-[12px] border-l-brand-yellow group">
            <div className="p-10">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
                    <div className="flex items-center gap-8">
                        <div className="w-20 h-20 bg-gray-900 rounded-[2rem] flex items-center justify-center text-brand-yellow font-bold shadow-2xl border border-gray-800 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                            <Briefcase className="w-8 h-8" />
                        </div>
                        <div>
                            <div className="flex bg-gray-900 text-brand-yellow px-4 py-2 rounded-xl items-center gap-2 mb-3 w-fit shadow-xl shadow-black/10">
                                <Zap className="w-3 h-3 text-brand-yellow" />
                                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Active Application</span>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight leading-none group-hover:text-gray-600 transition-colors">{app.job_posting?.requisition?.title || 'Unknown Job Title'}</h3>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {app.status?.toLowerCase() === 'offer' && (
                            <button
                                onClick={() => toggleDialog(app.id)}
                                className={`p-4 rounded-2xl transition-all shadow-xl relative ${openDialogs[app.id] ? 'bg-white border border-gray-100 text-gray-900' : 'bg-gray-900 text-brand-yellow hover:scale-110 active:scale-95'}`}
                            >
                                <MessageSquare className="w-6 h-6" />
                                {app.unread_messages_count > 0 && (
                                    <span className="absolute -top-3 -right-3 h-7 w-7 flex items-center justify-center rounded-full bg-red-500 text-[11px] font-black text-white border-4 border-white animate-bounce shadow-2xl">{app.unread_messages_count}</span>
                                )}
                            </button>
                        )}
                        <div className="bg-brand-yellow text-black px-6 py-3 rounded-xl border-4 border-white shadow-xl flex flex-col items-center min-w-[140px]">
                            <span className="text-[8px] font-black uppercase tracking-widest opacity-50 mb-1">Current Status</span>
                            <span className="text-[12px] font-black uppercase tracking-widest">{app.status?.replace('_', ' ')}</span>
                        </div>
                    </div>
                </div>

                {/* Signal Section: Active Status Flow Dashboard */}
                <div className="mb-8 bg-white rounded-2xl p-5 mt-4 shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-gray-200 via-gray-400 to-gray-200"></div>
                    <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-400 mb-6 flex items-center justify-between">
                        <span className="flex items-center gap-2"><Activity className="w-3 h-3 text-gray-900" /> Application Progress Flow</span>
                        {app.status === 'rejected' && <span className="text-red-500 bg-red-50 px-2 py-0.5 rounded text-[8px]">REJECTED</span>}
                    </h4>

                    <div className="flex w-full items-center justify-between relative px-1">
                        {/* Background track line */}
                        <div className="absolute left-[4%] right-[4%] top-[18px] h-[2px] bg-gray-100 z-0"></div>

                        {(() => {
                            const phases = [
                                { key: 'submitted', label: 'Applied', icon: Activity },
                                { key: 'written_test', label: 'Evaluation', icon: FileText },
                                { key: 'interview_1', label: 'Interview 1', icon: Target },
                                { key: 'interview_2', label: 'Interview 2', icon: Target },
                                { key: 'offer', label: 'Offer Stage', icon: MessageSquare },
                                { key: 'hired', label: 'Hired', icon: CheckCircle }
                            ];

                            const linearKeys = phases.map(p => p.key);
                            let currentIndex = linearKeys.indexOf(app.status?.toLowerCase());
                            if (currentIndex === -1 && app.status !== 'rejected') currentIndex = 0;

                            return phases.map((phase, idx) => {
                                let state = 'upcoming';
                                if (app.status === 'rejected') {
                                    state = idx < currentIndex ? 'completed' : (idx === currentIndex ? 'rejected' : 'upcoming');
                                } else {
                                    if (idx < currentIndex) state = 'completed';
                                    else if (idx === currentIndex) state = 'current';
                                }

                                const Icon = phase.icon;

                                return (
                                    <div key={phase.key} className="flex flex-col items-center gap-2 relative z-10 w-12 group/phase">
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-500 shadow-md border-2 ${state === 'completed' ? 'bg-black text-brand-yellow border-black scale-100'
                                            : state === 'current' ? 'bg-gray-900 text-brand-yellow border-white scale-125 shadow-xl'
                                                : state === 'rejected' ? 'bg-red-500 text-white border-white scale-110'
                                                    : 'bg-white text-gray-300 border-gray-100 scale-100'
                                            }`}>
                                            {state === 'completed' ? <CheckCircle className="w-3.5 h-3.5" /> :
                                                state === 'rejected' ? <X className="w-3.5 h-3.5" /> :
                                                    <Icon className={`w-3.5 h-3.5 ${state === 'current' ? 'animate-pulse' : ''}`} />}
                                        </div>
                                        <span className={`text-[7px] font-black uppercase tracking-widest text-center transition-colors leading-tight ${state === 'current' ? 'text-gray-900'
                                            : state === 'completed' ? 'text-gray-900'
                                                : state === 'rejected' ? 'text-red-500'
                                                    : 'text-gray-300'
                                            }`}>
                                            {phase.label}
                                        </span>
                                    </div>
                                );
                            });
                        })()}
                    </div>
                </div>

                {/* View Feedback Toggle Button */}
                <div className="flex justify-center mb-4">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center gap-3 bg-gray-900/5 hover:bg-gray-900/10 text-gray-900 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all group active:scale-95 border border-gray-100"
                    >
                        <History className={`w-4 h-4 text-brand-yellow transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`} />
                        {isExpanded ? 'Hide Feedback History' : 'View Feedback History'}
                        <ChevronRight className={`w-3 h-3 transition-transform duration-500 ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>
                </div>

                {/* History Logs */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-white rounded-[2rem] p-10 border border-gray-100 shadow-sm overflow-hidden"
                        >
                            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-300 mb-10 flex items-center gap-4">
                                <History className="w-5 h-5 text-gray-900" /> Application History
                            </h4>
                            <div className="space-y-12 border-l-4 border-brand-yellow/20 ml-4 pl-12">
                                {app.histories?.map((h, i) => (
                                    <div key={i} className="relative group/log">
                                        <div className="absolute -left-[54px] top-1.5 w-6 h-6 bg-white border-4 border-brand-yellow rounded-xl shadow-xl group-hover/log:scale-125 group-hover/log:rotate-12 transition-all"></div>
                                        <div className="flex items-center justify-between mb-3 opacity-40">
                                            <span className="text-[10px] font-black uppercase tracking-widest">{new Date(h.created_at).toLocaleString()}</span>
                                            <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-lg">Reviewed by: {h.user?.name || 'System'}</span>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <span className="text-[12px] font-black text-gray-400 uppercase tracking-widest">{h.status?.replace('_', ' ')} Update</span>
                                            <p className="text-[16px] font-bold text-gray-800 tracking-tight leading-relaxed italic">"{h.feedback || 'Application Status Updated.'}"</p>
                                            {h.document_path && (
                                                <a
                                                    href={`${(import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '').replace('/api', '')}/storage/${h.document_path}`}
                                                    target="_blank" rel="noopener noreferrer"
                                                    className="mt-4 w-fit flex items-center gap-3 bg-gray-900 text-brand-yellow px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-black transition-all"
                                                >
                                                    <Download className="w-4 h-4" /> Download Offer Letter
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const ChangePasswordModal = ({ isOpen, onClose, onSubmit, form, setForm, loading, error, success }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100"
            >
                <div className="bg-gray-900 p-8 flex items-center justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-full bg-white/5 skew-x-[30deg] translate-x-16"></div>
                    <div className="flex flex-col relative z-10">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Security Settings</span>
                        <h2 className="text-xl font-black text-brand-yellow uppercase tracking-tight">Change Password</h2>
                    </div>
                    <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 relative z-10 group active:scale-95">
                        <X className="w-5 h-5 text-gray-400 group-hover:text-white" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="p-8 space-y-6">
                    <AnimatePresence>
                        {error && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-[11px] font-black uppercase tracking-widest flex items-center gap-3">
                                <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                            </motion.div>
                        )}
                        {success && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 text-[11px] font-black uppercase tracking-widest flex items-center gap-3 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-full bg-emerald-500/10 skew-x-[30deg] translate-x-8"></div>
                                <Zap className="w-4 h-4 shrink-0" /> {success}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-4">
                        <div className="flex flex-col gap-2 relative">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-2">Current Password</label>
                            <input
                                type="password" required value={form.current_password}
                                onChange={(e) => setForm({ ...form, current_password: e.target.value })}
                                placeholder="Enter current password..."
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-[13px] font-bold text-gray-900 focus:ring-2 focus:ring-brand-yellow/20 focus:border-brand-yellow transition-all"
                            />
                            <Lock className="absolute right-6 top-[38px] w-4 h-4 text-gray-300 pointer-events-none" />
                        </div>
                        <div className="flex flex-col gap-2 relative">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-2">New Password</label>
                            <input
                                type="password" required minLength="8" value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                placeholder="Min 8 characters..."
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-[13px] font-bold text-gray-900 focus:ring-2 focus:ring-brand-yellow/20 focus:border-brand-yellow transition-all"
                            />
                            <Key className="absolute right-6 top-[38px] w-4 h-4 text-gray-300 pointer-events-none" />
                        </div>
                        <div className="flex flex-col gap-2 relative">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-2">Confirm New Password</label>
                            <input
                                type="password" required minLength="8" value={form.password_confirmation}
                                onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                                placeholder="Verify new password..."
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-[13px] font-bold text-gray-900 focus:ring-2 focus:ring-brand-yellow/20 focus:border-brand-yellow transition-all"
                            />
                        </div>
                    </div>

                    <button
                        type="submit" disabled={loading}
                        className="w-full py-4 bg-gray-900 text-brand-yellow rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-black transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 group border border-gray-800 hover:border-white/30"
                    >
                        {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><ShieldCheck className="w-4 h-4 group-hover:scale-110 transition-transform" /> Update Password</>}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default UserProfile;

const OfferConversationModal = ({ isOpen, onClose, appId, user, applications, dialogLoading, dialogMessages, dialogInput, setDialogInput, sendMessage, sendingMsg }) => {
    if (!isOpen) return null;
    const app = applications.find(a => a.id.toString() === appId.toString());
    if (!app || app.status?.toLowerCase() !== 'offer') return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Modal Content */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                className="relative bg-white w-full max-w-xl rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-white/20 flex flex-col max-h-[85vh]"
            >
                {/* Header */}
                <div className="bg-gray-900 px-10 py-8 flex items-center justify-between border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded-[1.25rem] flex items-center justify-center border border-white/10">
                            <MessageSquare className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Secure Messaging</span>
                            <span className="text-lg font-black text-white uppercase tracking-tight">Offer Conversation</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-4 bg-white/5 hover:bg-white/10 rounded-[1.25rem] transition-all group active:scale-90 border border-white/5"
                    >
                        <X className="w-6 h-6 text-gray-500 group-hover:text-white" />
                    </button>
                </div>

                {/* Message Thread */}
                <div className="flex-1 overflow-y-auto px-10 py-10 flex flex-col gap-8 bg-gray-50/50">
                    {dialogLoading[appId] ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-6">
                            <div className="w-10 h-10 border-4 border-gray-900 border-t-transparent rounded-full animate-spin shadow-xl" />
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] animate-pulse">Loading Messages...</span>
                        </div>
                    ) : (dialogMessages[appId] || []).length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 opacity-20">
                            <MessageSquare className="w-16 h-16 text-gray-400 mb-6" />
                            <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] text-center">No messages yet. Start the conversation.</p>
                        </div>
                    ) : (dialogMessages[appId] || []).map((msg, i) => {
                        const isMe = msg.user_id === user?.id;
                        return (
                            <div key={i} className={`flex flex-col gap-3 ${isMe ? 'items-end' : 'items-start'}`}>
                                <div className="flex items-center gap-3 px-2">
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${isMe ? 'text-gray-900' : 'text-gray-400'}`}>
                                        {isMe ? 'You' : (msg.user?.name || 'Status / HR')}
                                    </span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
                                    <span className="text-[9px] font-bold text-gray-300 uppercase">
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div className={`max-w-[85%] px-8 py-5 rounded-[2.5rem] text-[15px] font-semibold tracking-tight leading-relaxed shadow-sm transition-all duration-300 ${isMe ? 'bg-gray-900 text-brand-yellow rounded-tr-none hover:shadow-black/10' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none hover:shadow-xl hover:shadow-black/5'}`}>
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
                            placeholder="Type your response to the TA team..."
                            value={dialogInput[appId] || ''}
                            onChange={(e) => setDialogInput(prev => ({ ...prev, [appId]: e.target.value }))}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(appId); } }}
                            className="w-full bg-gray-50/80 border-2 border-gray-100 rounded-[2rem] px-8 py-6 text-base font-bold focus:outline-none focus:ring-8 focus:ring-gray-100 focus:border-gray-200 transition-all resize-none placeholder:text-gray-300 placeholder:italic"
                        />
                        <button
                            onClick={() => sendMessage(appId)}
                            disabled={sendingMsg[appId] || !dialogInput[appId]?.trim()}
                            className="absolute bottom-5 right-5 flex items-center gap-3 bg-gray-900 text-brand-yellow px-8 py-4 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 shadow-2xl shadow-black/20"
                        >
                            {sendingMsg[appId] ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    Send Message
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
