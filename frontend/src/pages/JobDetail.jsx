import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Briefcase, ChevronLeft, Send, CheckCircle, FileText, Globe, Zap, ArrowRight, ShieldCheck, X, GraduationCap, Award, Home, Target, Calendar } from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const JobDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, loading: authLoading } = useAuth();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [applied, setApplied] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [applyError, setApplyError] = useState('');
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        age: '',
        gender: 'Male',
        phone: '',
        professional_background: '',
        years_of_experience: '',
        institution_name: '',
        cgpa: '',
        current_address: '',
        description: '',
    });
    const [cvFile, setCvFile] = useState(null);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await api.get(`/jobs/${id}`);
                setJob(response.data);
            } catch (error) {
                console.error('Error fetching job details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('apply') === 'true' && !loading && job) {
            // Wait until auth is resolved — avoids flash-redirect on reload
            if (authLoading) return;
            if (!user) {
                navigate(`/login?returnUrl=${encodeURIComponent(`/jobs/${id}?apply=true`)}`);
                return;
            }
            setShowModal(true);
        }
    }, [location.search, user, authLoading, loading, job, id, navigate]);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
            }));

            // Check if already applied
            if (job) {
                const checkStatus = async () => {
                    try {
                        const res = await api.get('/applications?scope=self');
                        const hasApplied = res.data.some(app => app.job_posting_id === job.id);
                        if (hasApplied) setApplied(true);
                    } catch (err) {
                        console.error('Error checking application status:', err);
                    }
                };
                checkStatus();
            }
        }
    }, [user, job]);

    const handleApply = async (e) => {
        e.preventDefault();
        setApplying(true);
        setApplyError('');

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (cvFile) data.append('cv', cvFile);

        try {
            await api.post(`/jobs/${id}/apply`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setApplied(true);
            setShowModal(false);
        } catch (error) {
            const msg = error.response?.data?.message || 'Application failed. Please check your inputs.';
            if (msg.toLowerCase().includes('already applied')) {
                setApplied(true);
                setShowModal(false);
            } else {
                setApplyError(msg);
            }
        } finally {
            setApplying(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-gray-100 border-t-yellow-400 rounded-full animate-spin"></div>
        </div>
    );

    if (!job) return (
        <div className="min-h-screen bg-white flex items-center justify-center p-10">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
                <button onClick={() => navigate('/')} className="px-8 py-3 bg-black text-brand-yellow rounded-xl font-bold text-xs uppercase transition-all">Back to Opportunities</button>
            </div>
        </div>
    );

    const hasPrivilegedAccess = ['admin', 'ta_team', 'manager', 'executive'].includes(user?.role?.name);

    const getRemainingDays = (deadline) => {
        if (!deadline) return null;
        const diff = new Date(deadline) - new Date();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days;
    };

    const remainingDays = getRemainingDays(job.deadline);

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-brand-yellow/30 pb-40">
            {/* Header / Nav - Back to Hub - Available to all */}
            <nav className="p-6 md:p-10 max-w-[1400px] mx-auto flex items-center justify-between mb-0">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate('/')}
                        className="bg-gray-900 border border-gray-800 text-brand-yellow px-5 py-3 rounded-xl hover:bg-black hover:scale-105 transition-all group shadow-xl shadow-black/10 flex items-center gap-2.5"
                    >
                        <Home className="w-4 h-4" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Back to Hub</span>
                    </button>
                    <div className="h-8 w-px bg-gray-100"></div>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-tight">Post Specification</span>
                        <span className="text-xs font-bold text-gray-900 leading-tight">NODE-{String(job.id).padStart(4, '0')}</span>
                    </div>
                </div>
            </nav>

            <main className="max-w-[1400px] mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
                {/* Main Content */}
                <div className="lg:col-span-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-[2rem] border border-gray-100 p-8 md:p-12 shadow-[0_0_100px_rgba(0,0,0,0.02)] relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-yellow/5 rounded-bl-[8rem] -mr-16 -mt-16"></div>

                        <div className="mb-12 relative z-10">
                            <div className="inline-flex items-center gap-2.5 bg-gray-900 text-brand-yellow px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] mb-8 border border-gray-800 shadow-lg">
                                <Zap className="w-3.5 h-3.5 fill-brand-yellow/20" /> Node Modality: {job.employment_type || job.requisition.employment_type || 'Full-Time'}
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8 leading-[1.1] uppercase">
                                {job.title || job.requisition.title}
                            </h1>

                            {(job.category || job.requisition?.category) && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="px-4 py-1.5 bg-brand-yellow text-[9px] font-bold text-black uppercase tracking-wider rounded-lg border border-brand-yellow/30 flex items-center gap-2.5 shadow-sm">
                                        <Target className="w-3.5 h-3.5" /> {job.category || job.requisition?.category}
                                    </span>
                                </div>
                            )}

                            {job.tags && (
                                <div className="flex flex-wrap gap-2 mb-10">
                                    {job.tags.split(',').map((tag, i) => (
                                        <span key={i} className="px-3 py-1 bg-gray-50 text-[9px] font-bold text-gray-400 uppercase tracking-wider rounded-lg border border-gray-100 flex items-center gap-2">
                                            <div className="w-1 h-1 bg-brand-yellow rounded-full"></div>
                                            #{tag.trim()}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="flex flex-wrap gap-8 mb-10">
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Location Vector</span>
                                    <div className="flex items-center gap-2.5 bg-gray-50 px-5 py-3 rounded-xl border border-gray-100 font-bold text-[10px] uppercase tracking-wider text-gray-800">
                                        <MapPin className="w-3.5 h-3.5 text-brand-yellow" /> {job.location || job.requisition.location || 'Remote'}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Protocol Status</span>
                                    <div className="flex items-center gap-2.5 bg-gray-900 text-brand-yellow px-5 py-3 rounded-xl border border-gray-800 font-bold text-[10px] uppercase tracking-wider">
                                        <ShieldCheck className="w-3.5 h-3.5" /> {job.is_internal ? 'INTERNAL LAYER' : 'EXTERNAL NODE'}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {job.education_level && (
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Education Delta</span>
                                        <div className="flex flex-wrap gap-2">
                                            {job.education_level.split(', ').map(level => (
                                                <div key={level} className="flex items-center gap-3 bg-gray-50 px-5 py-3 rounded-xl border border-gray-100 font-bold text-[10px] uppercase tracking-wider text-gray-800">
                                                    <GraduationCap className="w-3.5 h-3.5 text-brand-yellow" /> {level}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {job.experience_level && (
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Exp Coefficient</span>
                                        <div className="flex flex-wrap gap-2">
                                            {job.experience_level.split(', ').map(level => (
                                                <div key={level} className="flex items-center gap-3 bg-gray-50 px-5 py-3 rounded-xl border border-gray-100 font-bold text-[10px] uppercase tracking-wider text-gray-800">
                                                    <Award className="w-3.5 h-3.5 text-brand-yellow" /> {level}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-12 relative z-10">
                            <section>
                                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-4 ">
                                    <div className="w-8 h-px bg-brand-yellow"></div> Mission Objectives
                                </h3>
                                <div className="text-gray-500 text-[12px] font-bold leading-relaxed uppercase tracking-wider space-y-4">
                                    {(job.description || job.requisition.description).split('\n').map((para, i) => (
                                        <p key={i}>{para}</p>
                                    ))}
                                </div>
                            </section>

                            {job.core_requirements && job.core_requirements.split('|').some(req => req.trim() !== '') && (
                                <section>
                                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-4 ">
                                        <div className="w-8 h-px bg-gray-900"></div> Strategic Impact
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {job.core_requirements.split('|').filter(req => req.trim() !== '').map((req, i) => (
                                            <div key={i} className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100 text-[9px] font-bold uppercase tracking-wider group hover:border-brand-yellow/30 transition-all">
                                                <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center text-brand-yellow text-[10px] font-bold shadow-sm group-hover:bg-brand-yellow group-hover:text-black transition-all">0{i + 1}</div>
                                                {req}
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            <section className="pt-8 border-t border-gray-50 flex flex-wrap gap-8">
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Temporal Origin</span>
                                    <div className="flex items-center gap-2.5 bg-gray-50 px-5 py-3 rounded-xl border border-gray-100 font-bold text-[10px] uppercase tracking-wider text-gray-800">
                                        <Clock className="w-3.5 h-3.5 text-brand-yellow" /> Posted on {new Date(job.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Final Cutoff</span>
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex items-center gap-2.5 bg-gray-50 px-5 py-3 rounded-xl border border-gray-100 font-bold text-[10px] uppercase tracking-wider text-gray-800">
                                            <Calendar className="w-3.5 h-3.5 text-brand-yellow" /> Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Continuous Enrollment'}
                                        </div>
                                        {remainingDays !== null && (
                                            <div className={`text-[8px] font-bold uppercase tracking-widest px-4 ${remainingDays < 0 ? 'text-red-500' : remainingDays <= 3 ? 'text-orange-500 animate-pulse' : 'text-gray-900'}`}>
                                                {remainingDays < 0 ? 'Enrollment Closed' : remainingDays === 0 ? 'Closing Today' : `${remainingDays} Day${remainingDays > 1 ? 's' : ''} Remaining`}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>
                        </div>
                    </motion.div>
                </div>

                {/* Sidebar Action */}
                <aside className="lg:col-span-4">
                    <div className="sticky top-20 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-gray-900 text-brand-yellow rounded-[2rem] p-8 shadow-2xl shadow-black/20 border border-gray-800 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-brand-yellow"></div>
                            <h4 className="text-[9px] font-bold uppercase tracking-wider mb-8 flex items-center gap-3 ">
                                <Send className="w-4 h-4 text-brand-yellow group-hover:rotate-12 transition-transform" /> Application Hub
                            </h4>

                            {applied ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-brand-yellow rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-brand-yellow/20 transition-transform hover:scale-105">
                                        <CheckCircle className="w-8 h-8 text-gray-900" />
                                    </div>
                                    <h5 className="text-xl font-bold text-brand-yellow mb-3 tracking-tight">Application Submitted!</h5>
                                    <p className="text-xs text-gray-400 font-medium leading-relaxed mb-6">
                                        Your professional coordinates have been received. Check your <span className="text-brand-yellow cursor-pointer hover:underline" onClick={() => navigate('/profile')}>Profile Activity Signals</span> to track your progress in real-time.
                                    </p>
                                    <button
                                        onClick={() => navigate('/profile?tab=applications')}
                                        className="w-full bg-white/5 border border-white/10 text-brand-yellow py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-white/10 transition-all"
                                    >
                                        Track Progress
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    <p className="text-[10px] font-bold text-gray-400 leading-relaxed uppercase tracking-wider ">
                                        Submit your professional coordinates for high-priority review. Our tactical specialists will synchronize with your profile.
                                    </p>

                                    <button
                                        onClick={() => {
                                            if (!user) {
                                                navigate(`/login?returnUrl=${encodeURIComponent(`/jobs/${id}?apply=true`)}`);
                                                return;
                                            }
                                            setShowModal(true);
                                        }}
                                        className="w-full bg-brand-yellow text-gray-900 py-4 rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-white transition-all flex items-center justify-center gap-3 shadow-xl shadow-brand-yellow/10 hover:scale-105"
                                    >
                                        Initiate Apply <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </motion.div>

                        <div className="p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm relative group overflow-hidden">
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-50 group-hover:bg-brand-yellow transition-colors"></div>
                            <h5 className="text-[10px] font-bold uppercase tracking-wider mb-6 text-gray-400 ">Security Protocol</h5>
                            <p className="text-[11px] font-bold text-gray-800 leading-loose uppercase tracking-wider ">
                                All transmissions are encrypted and managed via the Droga Hub Core Engine.
                            </p>
                        </div>
                    </div>
                </aside>
            </main>

            {/* Application Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-gray-900/80 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="relative w-full max-w-3xl bg-white rounded-[3rem] shadow-[0_0_150px_rgba(0,0,0,0.3)] overflow-hidden border border-gray-100"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-brand-yellow"></div>

                            <div className="p-8 sm:p-12 overflow-y-auto max-h-[90vh]">
                                <div className="flex justify-between items-start mb-10">
                                    <div>
                                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Apply for Position</h2>
                                        <p className="text-sm text-gray-500">Provide your professional details to start the application process.</p>
                                    </div>
                                    <button onClick={() => setShowModal(false)} className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                                        <X className="w-5 h-5 text-gray-400" />
                                    </button>
                                </div>

                                {applyError && (
                                    <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl px-5 py-4">
                                        <span className="text-red-500 font-bold text-sm">{applyError}</span>
                                    </div>
                                )}

                                <form onSubmit={handleApply} className="space-y-8">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-semibold text-gray-700 ml-1">Full Name</label>
                                            <input
                                                required
                                                type="text"
                                                className="bg-gray-50/50 border border-gray-100 rounded-xl px-5 py-4 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-yellow-400/10 focus:border-yellow-400 transition-all"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="Enter your full name"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-semibold text-gray-700 ml-1">Email Address</label>
                                            <input
                                                required
                                                type="email"
                                                className="bg-gray-50/50 border border-gray-100 rounded-xl px-5 py-4 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-yellow-400/10 focus:border-yellow-400 transition-all"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                placeholder="email@example.com"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-semibold text-gray-700 ml-1">Age</label>
                                            <input
                                                required
                                                type="number"
                                                className="bg-gray-50/50 border border-gray-100 rounded-xl px-5 py-4 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-yellow-400/10 focus:border-yellow-400 transition-all"
                                                value={formData.age}
                                                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                                placeholder="e.g. 25"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-semibold text-gray-700 ml-1">Gender</label>
                                            <select
                                                className="bg-gray-50/50 border border-gray-100 rounded-xl px-5 py-4 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-yellow-400/10 focus:border-yellow-400 transition-all appearance-none"
                                                value={formData.gender}
                                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                            >
                                                <option>Male</option>
                                                <option>Female</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-semibold text-gray-700 ml-1">Institution Name</label>
                                            <input
                                                required
                                                type="text"
                                                className="bg-gray-50/50 border border-gray-100 rounded-xl px-5 py-4 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-yellow-400/10 focus:border-yellow-400 transition-all"
                                                value={formData.institution_name}
                                                onChange={(e) => setFormData({ ...formData, institution_name: e.target.value })}
                                                placeholder="University or Institute"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-semibold text-gray-700 ml-1">Academic CGPA</label>
                                            <input
                                                required
                                                type="number" step="0.01"
                                                className="bg-gray-50/50 border border-gray-100 rounded-xl px-5 py-4 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-yellow-400/10 focus:border-yellow-400 transition-all"
                                                value={formData.cgpa}
                                                onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-semibold text-gray-700 ml-1">Years of Experience</label>
                                            <input
                                                required
                                                type="number"
                                                className="bg-gray-50/50 border border-gray-100 rounded-xl px-5 py-4 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-yellow-400/10 focus:border-yellow-400 transition-all"
                                                value={formData.years_of_experience}
                                                onChange={(e) => setFormData({ ...formData, years_of_experience: e.target.value })}
                                                placeholder="0"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-semibold text-gray-700 ml-1">Current Address</label>
                                            <input
                                                required
                                                type="text"
                                                className="bg-gray-50/50 border border-gray-100 rounded-xl px-5 py-4 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-yellow-400/10 focus:border-yellow-400 transition-all"
                                                value={formData.current_address}
                                                onChange={(e) => setFormData({ ...formData, current_address: e.target.value })}
                                                placeholder="City, Country"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-semibold text-gray-700 ml-1">Professional Background</label>
                                            <input
                                                required
                                                type="text"
                                                className="bg-gray-50/50 border border-gray-100 rounded-xl px-5 py-4 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-yellow-400/10 focus:border-yellow-400 transition-all font-bold"
                                                value={formData.professional_background}
                                                onChange={(e) => setFormData({ ...formData, professional_background: e.target.value })}
                                                placeholder="e.g. Software Engineer, Pharmacist"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-semibold text-gray-700 ml-1">Contact Phone</label>
                                            <input
                                                required
                                                type="tel"
                                                className="bg-gray-50/50 border border-gray-100 rounded-xl px-5 py-4 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-yellow-400/10 focus:border-yellow-400 transition-all"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                placeholder="+251..."
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-semibold text-gray-700 ml-1">Why are you suitable for this role?</label>
                                        <textarea
                                            required
                                            rows="4"
                                            className="bg-gray-50/50 border border-gray-100 rounded-xl px-5 py-4 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-yellow-400/10 focus:border-yellow-400 transition-all resize-none leading-relaxed"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Describe your specific experience and achievements that align with this job..."
                                        ></textarea>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <div className="relative group">
                                            <input
                                                required
                                                type="file"
                                                accept=".pdf"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file && !file.name.toLowerCase().endsWith('.pdf')) {
                                                        alert('Critical: Only PDF transmission is supported. Please select a .pdf file.');
                                                        e.target.value = null;
                                                        setCvFile(null);
                                                        return;
                                                    }
                                                    setCvFile(file);
                                                }}
                                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            />
                                            <div className="bg-gray-50/50 border-2 border-dashed border-gray-100 rounded-2xl px-6 py-8 text-center group-hover:border-yellow-400/50 transition-all duration-300">
                                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 text-yellow-400 shadow-sm">
                                                    <FileText className="w-6 h-6" />
                                                </div>
                                                <span className="text-xs font-semibold text-gray-500">
                                                    {cvFile ? cvFile.name : 'Click or drag resume (PDF ONLY)'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-6">
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="flex-1 py-4 px-6 border border-gray-100 rounded-xl font-bold text-xs text-gray-500 hover:bg-gray-50 transition-colors uppercase tracking-wider"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            disabled={applying}
                                            type="submit"
                                            className="flex-[2] py-4 px-6 bg-black text-yellow-400 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-gray-900 transition-all shadow-lg shadow-black/5 active:scale-[0.98] uppercase tracking-wider"
                                        >
                                            {applying ? 'Submitting...' : 'Submit Application'}
                                            {!applying && <CheckCircle className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default JobDetail;
