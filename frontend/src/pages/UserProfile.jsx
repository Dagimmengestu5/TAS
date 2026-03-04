import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Shield, Key, Camera, LayoutGrid, Activity, History, ChevronRight, Zap, Target, Lock, Globe, ShieldCheck, Clock, CheckCircle, MessageSquare, Briefcase, LogOut, Bell, Download, X, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

const UserProfile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [applications, setApplications] = useState([]);
    const [loadingApps, setLoadingApps] = useState(false);

    // Detailed Profile State
    const [profileData, setProfileData] = useState({
        work_experience: [],
        qualifications: [],
        certifications: [],
        languages: [],
        skills: []
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
                        skills: profileRes.data.skills || []
                    });
                }
            } catch (err) {
                console.error('Error fetching profile data:', err);
            } finally {
                setLoadingProfile(false);
            }
        };
        fetchData();
    }, []);

    const handleSaveProfile = async () => {
        setSavingProfile(true);
        try {
            await api.post('/profile', profileData);
            alert('Profile updated successfully!');
        } catch (err) {
            alert('Failed to update profile.');
        } finally {
            setSavingProfile(false);
        }
    };

    const addListEntry = (key, template) => {
        setProfileData(prev => ({
            ...prev,
            [key]: [...prev[key], template]
        }));
    };

    const removeListEntry = (key, index) => {
        setProfileData(prev => ({
            ...prev,
            [key]: prev[key].filter((_, i) => i !== index)
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

    return (
        <div className="bg-gray-50 min-h-screen w-full selection:bg-brand-yellow/30 px-6 py-6 lg:px-8 ">
            <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-8">
                {/* Sidebar Identity Block */}
                <div className="lg:w-[320px] shrink-0 flex flex-col gap-6">
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-xl shadow-black/5 relative overflow-hidden group/header">
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="relative mb-6">
                                <div className="w-28 h-28 bg-gray-900 rounded-[2.25rem] flex items-center justify-center text-brand-yellow text-4xl font-black shadow-2xl border-4 border-white rotate-3 group-hover/header:rotate-6 transition-transform duration-500 overflow-hidden">
                                    {user?.name?.charAt(0)}
                                </div>
                                <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-yellow rounded-2xl flex items-center justify-center shadow-2xl border-4 border-white hover:scale-110 transition-all active:scale-95 group-hover/header:translate-y-[-4px]">
                                    <Camera className="w-5 h-5 text-black" />
                                </button>
                            </div>

                            <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-2 leading-none">{user?.name}</h1>
                            <div className="flex bg-gray-900 text-brand-yellow px-3 py-1.5 rounded-xl gap-2 items-center mb-8">
                                <ShieldCheck className="w-3 h-3 text-brand-yellow" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{user?.role?.name}</span>
                            </div>

                            {/* Nav Options */}
                            <div className="w-full flex flex-col gap-2">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all ${activeTab === 'profile' ? 'bg-gray-900 text-brand-yellow shadow-2xl shadow-black/20' : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-900'}`}
                                >
                                    <User className="w-4 h-4" />
                                    Candidate Profile
                                </button>
                                <button
                                    onClick={handleActiveSignalsClick}
                                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all relative ${activeTab === 'applications' ? 'bg-gray-900 text-brand-yellow shadow-2xl shadow-black/20' : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-900'}`}
                                >
                                    <Activity className="w-4 h-4" />
                                    Active Signals
                                    {unreadCount > 0 && (
                                        <span className="absolute top-4 right-6 flex h-4 w-4">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-yellow opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-yellow text-black text-[8px] font-black items-center justify-center border-2 border-white">{unreadCount}</span>
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={() => {
                                        navigate('/');
                                        setTimeout(() => logout(), 0);
                                    }}
                                    className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-wider bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all transition-all"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Terminate Session
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900 text-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-800 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-44 h-44 bg-brand-yellow/5 rounded-full blur-[80px] -mr-20 -mt-20"></div>
                        <h3 className="text-sm font-black flex items-center gap-3 text-brand-yellow uppercase tracking-[0.2em] mb-8 relative z-10">
                            <Shield className="w-4 h-4" /> System Core
                        </h3>
                        <div className="space-y-8 relative z-10">
                            {[
                                { label: 'Auth Gateway', value: 'SHA3-Secure', icon: Lock },
                                { label: 'Network Node', value: 'LMS-Central', icon: Globe },
                            ].map((stat, i) => (
                                <div key={i} className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between opacity-40">
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">{stat.label}</span>
                                        <stat.icon className="w-3 h-3" />
                                    </div>
                                    <p className="text-[12px] font-black uppercase tracking-widest text-brand-yellow/80">{stat.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1">
                    <AnimatePresence mode="wait">
                        {activeTab === 'profile' ? (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, scale: 0.98, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98, y: -30 }}
                                className="space-y-8"
                            >
                                {/* Header Card */}
                                <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-xl shadow-black/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div>
                                        <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase leading-none mb-2">Detailed Protocol</h2>
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Update your professional matrix for system evaluation.</p>
                                    </div>
                                    <button
                                        onClick={handleSaveProfile}
                                        disabled={savingProfile}
                                        className="bg-brand-yellow text-black px-10 py-5 rounded-[1.5rem] text-[12px] font-black uppercase tracking-[0.2em] hover:bg-gray-900 hover:text-brand-yellow transition-all shadow-2xl shadow-brand-yellow/20 active:scale-95 flex items-center gap-3 disabled:opacity-50"
                                    >
                                        {savingProfile ? (
                                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <><ShieldCheck className="w-4 h-4" /> Deploy Updates</>
                                        )}
                                    </button>
                                </div>

                                {/* Form Sections Grid */}
                                <div className="grid grid-cols-1 gap-8 pb-12">

                                    {/* 1. Work Experience */}
                                    <SectionCard
                                        title="Work Experience"
                                        icon={<Briefcase />}
                                        description="Document your tactical deployments."
                                        onAdd={() => addListEntry('work_experience', { title: '', company: '', duration: '', description: '' })}
                                    >
                                        <div className="space-y-6">
                                            {profileData.work_experience.map((exp, idx) => (
                                                <div key={idx} className="bg-gray-50/50 p-8 rounded-[1.5rem] border border-gray-100 relative group/entry hover:bg-white hover:shadow-xl transition-all duration-300">
                                                    <button onClick={() => removeListEntry('work_experience', idx)} className="absolute top-6 right-6 p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover/entry:opacity-100"><X className="w-5 h-5" /></button>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                        <ProfileInput label="Position Title" value={exp.title} onChange={(v) => updateListEntry('work_experience', idx, 'title', v)} placeholder="e.g. Lead Developer" />
                                                        <ProfileInput label="Corporate Node" value={exp.company} onChange={(v) => updateListEntry('work_experience', idx, 'company', v)} placeholder="e.g. Acme Hub" />
                                                        <ProfileInput label="Deployment Duration" value={exp.duration} onChange={(v) => updateListEntry('work_experience', idx, 'duration', v)} placeholder="e.g. 2020 - 2024" />
                                                    </div>
                                                    <div className="mt-6">
                                                        <ProfileTextarea label="Operational Scope" value={exp.description} onChange={(v) => updateListEntry('work_experience', idx, 'description', v)} placeholder="Describe your key responsibilities and achievements..." />
                                                    </div>
                                                </div>
                                            ))}
                                            {profileData.work_experience.length === 0 && <EmptyState text="No experience nodes added." />}
                                        </div>
                                    </SectionCard>

                                    {/* 2. Qualification Detail */}
                                    <SectionCard
                                        title="Qualification Detail"
                                        icon={<History />}
                                        description="Scholastic authorization records."
                                        onAdd={() => addListEntry('qualifications', { degree: '', institution: '', year: '' })}
                                    >
                                        <div className="space-y-6">
                                            {profileData.qualifications.map((qual, idx) => (
                                                <div key={idx} className="bg-gray-50/50 p-8 rounded-[1.5rem] border border-gray-100 relative group/entry hover:bg-white hover:shadow-xl transition-all duration-300">
                                                    <button onClick={() => removeListEntry('qualifications', idx)} className="absolute top-6 right-6 p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover/entry:opacity-100"><X className="w-5 h-5" /></button>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                        <ProfileInput label="Certification Grade" value={qual.degree} onChange={(v) => updateListEntry('qualifications', idx, 'degree', v)} placeholder="e.g. B.Sc. CompSci" />
                                                        <ProfileInput label="Education Hub" value={qual.institution} onChange={(v) => updateListEntry('qualifications', idx, 'institution', v)} placeholder="e.g. Tech University" />
                                                        <ProfileInput label="Authorization Year" value={qual.year} onChange={(v) => updateListEntry('qualifications', idx, 'year', v)} placeholder="e.g. 2019" />
                                                    </div>
                                                </div>
                                            ))}
                                            {profileData.qualifications.length === 0 && <EmptyState text="No qualification nodes added." />}
                                        </div>
                                    </SectionCard>

                                    {/* 3. Certification Detail */}
                                    <SectionCard
                                        title="Certification Detail"
                                        icon={<ShieldCheck />}
                                        description="Specialized authorization keys."
                                        onAdd={() => addListEntry('certifications', { name: '', issuer: '', id: '' })}
                                    >
                                        <div className="space-y-6">
                                            {profileData.certifications.map((cert, idx) => (
                                                <div key={idx} className="bg-gray-50/50 p-8 rounded-[1.5rem] border border-gray-100 relative group/entry hover:bg-white hover:shadow-xl transition-all duration-300">
                                                    <button onClick={() => removeListEntry('certifications', idx)} className="absolute top-6 right-6 p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover/entry:opacity-100"><X className="w-5 h-5" /></button>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                        <ProfileInput label="Credential Name" value={cert.name} onChange={(v) => updateListEntry('certifications', idx, 'name', v)} placeholder="e.g. AWS Solutions Architect" />
                                                        <ProfileInput label="Issuing Authority" value={cert.issuer} onChange={(v) => updateListEntry('certifications', idx, 'issuer', v)} placeholder="e.g. Amazon" />
                                                        <ProfileInput label="Key Identifier" value={cert.id} onChange={(v) => updateListEntry('certifications', idx, 'id', v)} placeholder="e.g. CERT-909" />
                                                    </div>
                                                </div>
                                            ))}
                                            {profileData.certifications.length === 0 && <EmptyState text="No certification nodes added." />}
                                        </div>
                                    </SectionCard>

                                    {/* 4. Skills & Languages */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <SectionCard
                                            title="Skill Matrix"
                                            icon={<Zap />}
                                            description="Technical capability strings."
                                            onAdd={() => addListEntry('skills', { name: '', level: 'Intermediate' })}
                                        >
                                            <div className="space-y-4">
                                                {profileData.skills.map((skill, idx) => (
                                                    <div key={idx} className="flex items-center gap-4 bg-gray-50/80 p-4 rounded-2xl border border-gray-100 group/entry">
                                                        <input
                                                            className="flex-1 bg-transparent border-none text-[13px] font-black uppercase tracking-wider text-gray-900 focus:ring-0 placeholder:text-gray-300"
                                                            value={skill.name}
                                                            onChange={(e) => updateListEntry('skills', idx, 'name', e.target.value)}
                                                            placeholder="e.g. React.js"
                                                        />
                                                        <select
                                                            className="bg-white border-none text-[10px] font-black uppercase tracking-widest text-brand-yellow px-4 rounded-xl focus:ring-4 focus:ring-brand-yellow/10"
                                                            value={skill.level}
                                                            onChange={(e) => updateListEntry('skills', idx, 'level', e.target.value)}
                                                        >
                                                            <option>Beginner</option>
                                                            <option>Intermediate</option>
                                                            <option>Advanced</option>
                                                            <option>Expert</option>
                                                        </select>
                                                        <button onClick={() => removeListEntry('skills', idx)} className="p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover/entry:opacity-100"><X className="w-4 h-4" /></button>
                                                    </div>
                                                ))}
                                                {profileData.skills.length === 0 && <EmptyState text="No skill nodes mapped." />}
                                            </div>
                                        </SectionCard>

                                        <SectionCard
                                            title="Linguistic Uplink"
                                            icon={<MessageSquare />}
                                            description="Communication protocols."
                                            onAdd={() => addListEntry('languages', { language: '', fluency: 'Fluent' })}
                                        >
                                            <div className="space-y-4">
                                                {profileData.languages.map((lang, idx) => (
                                                    <div key={idx} className="flex items-center gap-4 bg-gray-50/80 p-4 rounded-2xl border border-gray-100 group/entry">
                                                        <input
                                                            className="flex-1 bg-transparent border-none text-[13px] font-black uppercase tracking-wider text-gray-900 focus:ring-0 placeholder:text-gray-300"
                                                            value={lang.language}
                                                            onChange={(e) => updateListEntry('languages', idx, 'language', e.target.value)}
                                                            placeholder="e.g. English"
                                                        />
                                                        <select
                                                            className="bg-white border-none text-[10px] font-black uppercase tracking-widest text-brand-yellow px-4 rounded-xl focus:ring-4 focus:ring-brand-yellow/10"
                                                            value={lang.fluency}
                                                            onChange={(e) => updateListEntry('languages', idx, 'fluency', e.target.value)}
                                                        >
                                                            <option>Basic</option>
                                                            <option>Fluent</option>
                                                            <option>Native</option>
                                                        </select>
                                                        <button onClick={() => removeListEntry('languages', idx)} className="p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover/entry:opacity-100"><X className="w-4 h-4" /></button>
                                                    </div>
                                                ))}
                                                {profileData.languages.length === 0 && <EmptyState text="No linguistic nodes added." />}
                                            </div>
                                        </SectionCard>
                                    </div>
                                </div>
                            </motion.div>
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
                                        <Activity className="w-8 h-8 text-brand-yellow" />
                                        <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase leading-none">Transmission Pipeline</h2>
                                    </div>

                                    {loadingApps ? (
                                        <div className="py-32 flex flex-col items-center gap-6">
                                            <div className="w-12 h-12 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin shadow-2xl shadow-brand-yellow/20"></div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-yellow animate-pulse">Decrypting Cluster...</span>
                                        </div>
                                    ) : applications.length === 0 ? (
                                        <div className="py-32 border-4 border-gray-50 border-dashed rounded-[3rem] flex flex-col items-center justify-center opacity-30 select-none bg-gray-50/50">
                                            <Zap className="w-16 h-16 text-gray-300 mb-6" />
                                            <span className="text-[12px] font-black text-gray-400 uppercase tracking-[0.5em] ">No signals detected</span>
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
            </div>

            {/* Offer Conversation Modal */}
            <AnimatePresence>
                {Object.entries(openDialogs).map(([appId, isOpen]) => (
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
                ))}
            </AnimatePresence>
        </div>
    );
};

// UI Sub-components
const SectionCard = ({ title, icon, description, children, onAdd }) => (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-black/5 overflow-hidden">
        <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
            <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center text-brand-yellow shadow-2xl border border-gray-800">
                    {React.cloneElement(icon, { size: 24 })}
                </div>
                <div>
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight leading-none mb-1">{title}</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{description}</p>
                </div>
            </div>
            <button
                onClick={onAdd}
                className="flex items-center gap-3 bg-white text-gray-900 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-wider hover:bg-gray-900 hover:text-brand-yellow transition-all shadow-md border border-gray-100 active:scale-95"
            >
                <Zap size={14} className="text-brand-yellow" /> Add Node
            </button>
        </div>
        <div className="p-10">{children}</div>
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

const ApplicationBlock = ({ app, toggleDialog, openDialogs }) => (
    <div className="bg-gray-50/50 rounded-[2.5rem] border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 border-l-[12px] border-l-brand-yellow group">
        <div className="p-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
                <div className="flex items-center gap-8">
                    <div className="w-20 h-20 bg-gray-900 rounded-[2rem] flex items-center justify-center text-brand-yellow font-bold shadow-2xl border border-gray-800 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                        <Briefcase className="w-8 h-8" />
                    </div>
                    <div>
                        <div className="flex bg-gray-900 text-brand-yellow px-4 py-2 rounded-xl items-center gap-2 mb-3 w-fit shadow-xl shadow-black/10">
                            <Zap className="w-3 h-3" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Active Transmission Node</span>
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight leading-none group-hover:text-brand-yellow transition-colors">{app.job_posting?.requisition?.title || 'Unknown Protocol'}</h3>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {app.status?.toLowerCase() === 'offer' && (
                        <button
                            onClick={() => toggleDialog(app.id)}
                            className={`p-4 rounded-2xl transition-all shadow-xl relative ${openDialogs[app.id] ? 'bg-brand-yellow text-black' : 'bg-gray-900 text-brand-yellow hover:scale-110 active:scale-95'}`}
                        >
                            <MessageSquare className="w-6 h-6" />
                            {app.unread_messages_count > 0 && (
                                <span className="absolute -top-3 -right-3 h-7 w-7 flex items-center justify-center rounded-full bg-red-500 text-[11px] font-black text-white border-4 border-white animate-bounce shadow-2xl">{app.unread_messages_count}</span>
                            )}
                        </button>
                    )}
                    <div className="bg-brand-yellow text-black px-10 py-5 rounded-[1.5rem] text-[12px] font-black uppercase tracking-[0.25em] shadow-xl shadow-brand-yellow/10 border-2 border-white">
                        {app.status.replace('_', ' ')}
                    </div>
                </div>
            </div>

            {/* History Logs */}
            <div className="bg-white rounded-[2rem] p-10 border border-gray-100 shadow-sm">
                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-300 mb-10 flex items-center gap-4">
                    <History className="w-5 h-5 text-brand-yellow" /> Temporal Audit Trail
                </h4>
                <div className="space-y-12 border-l-4 border-brand-yellow/20 ml-4 pl-12">
                    {app.histories?.map((h, i) => (
                        <div key={i} className="relative group/log">
                            <div className="absolute -left-[54px] top-1.5 w-6 h-6 bg-white border-4 border-brand-yellow rounded-xl shadow-xl group-hover/log:scale-125 group-hover/log:rotate-12 transition-all"></div>
                            <div className="flex items-center justify-between mb-3 opacity-40">
                                <span className="text-[10px] font-black uppercase tracking-widest">{new Date(h.created_at).toLocaleString()}</span>
                                <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-lg">Vetted by: {h.user?.name || 'System Core'}</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-[12px] font-black text-brand-yellow uppercase tracking-widest">{h.status?.replace('_', ' ')} Transition</span>
                                <p className="text-[16px] font-bold text-gray-800 tracking-tight leading-relaxed italic">"{h.feedback || 'Access Protocol Synchronized.'}"</p>
                                {h.document_path && (
                                    <a
                                        href={`${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:8003'}/storage/${h.document_path}`}
                                        target="_blank" rel="noopener noreferrer"
                                        className="mt-4 w-fit flex items-center gap-3 bg-gray-900 text-brand-yellow px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-black transition-all"
                                    >
                                        <Download className="w-4 h-4" /> Download Offer Key
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

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
                        <div className="w-12 h-12 bg-brand-yellow/10 rounded-[1.25rem] flex items-center justify-center border border-brand-yellow/20">
                            <MessageSquare className="w-6 h-6 text-brand-yellow" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-brand-yellow uppercase tracking-[0.3em] mb-1">Encrypted Line</span>
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
                            <div className="w-10 h-10 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(255,242,0,0.2)]" />
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] animate-pulse">Syncing Protocols...</span>
                        </div>
                    ) : (dialogMessages[appId] || []).length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 opacity-20">
                            <MessageSquare className="w-16 h-16 text-gray-400 mb-6" />
                            <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] text-center">Awaiting initial transmission.</p>
                        </div>
                    ) : (dialogMessages[appId] || []).map((msg, i) => {
                        const isMe = msg.user_id === user?.id;
                        return (
                            <div key={i} className={`flex flex-col gap-3 ${isMe ? 'items-end' : 'items-start'}`}>
                                <div className="flex items-center gap-3 px-2">
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${isMe ? 'text-brand-yellow' : 'text-gray-400'}`}>
                                        {isMe ? 'User Origin' : (msg.user?.name || 'TA Node')}
                                    </span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
                                    <span className="text-[9px] font-bold text-gray-300 uppercase">
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div className={`max-w-[85%] px-8 py-5 rounded-[2.5rem] text-[15px] font-semibold tracking-tight leading-relaxed shadow-sm transition-all duration-300 ${isMe ? 'bg-gray-900 text-brand-yellow rounded-tr-none hover:shadow-brand-yellow/10' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none hover:shadow-xl hover:shadow-black/5'}`}>
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
                            className="w-full bg-gray-50/80 border-2 border-gray-100 rounded-[2rem] px-8 py-6 text-base font-bold focus:outline-none focus:ring-8 focus:ring-brand-yellow/5 focus:border-brand-yellow/20 transition-all resize-none placeholder:text-gray-300 placeholder:italic"
                        />
                        <button
                            onClick={() => sendMessage(appId)}
                            disabled={sendingMsg[appId] || !dialogInput[appId]?.trim()}
                            className="absolute bottom-5 right-5 flex items-center gap-3 bg-gray-900 text-brand-yellow px-8 py-4 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 shadow-2xl shadow-black/20"
                        >
                            {sendingMsg[appId] ? (
                                <div className="w-4 h-4 border-2 border-brand-yellow border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    Transmit
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
