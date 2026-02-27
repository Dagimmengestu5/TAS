import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Briefcase, ChevronLeft, Send, CheckCircle, FileText, Globe, Zap, ArrowRight, ShieldCheck, X } from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const JobDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [applied, setApplied] = useState(false);
    const [showModal, setShowModal] = useState(false);
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
            if (!user) {
                navigate(`/login?returnUrl=${encodeURIComponent(`/jobs/${id}?apply=true`)}`);
                return;
            }
            setShowModal(true);
        }
    }, [location.search, user, loading, job, id, navigate]);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
            }));
        }
    }, [user]);

    const handleApply = async (e) => {
        e.preventDefault();
        setApplying(true);

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
            console.error('Application error:', error.response?.data);
            alert(error.response?.data?.message || 'Application failed. Please check your inputs and try again.');
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
                <button onClick={() => navigate('/')} className="px-8 py-3 bg-black text-white rounded-xl font-bold text-xs uppercase transition-all">Back to Opportunities</button>
            </div>
        </div>
    );

    const hasPrivilegedAccess = ['admin', 'ta_team', 'manager', 'executive'].includes(user?.role?.name);

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-brand-yellow/30 pb-40">
            {/* Header / Nav - Hidden for Admins */}
            {!hasPrivilegedAccess && (
                <nav className="p-10 max-w-[1600px] mx-auto flex items-center justify-between mb-2">
                    <div className="flex items-center gap-10">
                        <button
                            onClick={() => navigate(-1)}
                            className="bg-gray-50 p-4 rounded-2xl hover:bg-brand-yellow hover:text-black transition-all group border border-gray-100 shadow-sm"
                        >
                            <ChevronLeft className="w-6 h-6 text-gray-400 group-hover:text-black" />
                        </button>
                        <div className="h-10 w-px bg-gray-100"></div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] leading-tight">Job Spec ID</span>
                            <span className="text-sm font-black text-gray-900 leading-tight">NODE-{String(job.id).padStart(4, '0')}</span>
                        </div>
                    </div>
                </nav>
            )}

            <main className="max-w-[1600px] mx-auto px-10 grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Main Content */}
                <div className="lg:col-span-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-[3rem] border border-gray-100 p-12 md:p-20 shadow-[0_0_100px_rgba(0,0,0,0.02)] relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-yellow/5 rounded-bl-[10rem] -mr-20 -mt-20"></div>

                        <div className="mb-20 relative z-10">
                            <div className="inline-flex items-center gap-2.5 bg-brand-yellow/10 text-brand-yellow px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-10 border border-brand-yellow/20">
                                <Zap className="w-4 h-4" /> Node Modality: {job.employment_type || job.requisition.employment_type || 'Full-Time'}
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-10 tracking-tighter leading-[0.9] uppercase">
                                {job.title || job.requisition.title}
                            </h1>

                            {job.tags && (
                                <div className="flex flex-wrap gap-3 mb-10">
                                    {job.tags.split(',').map((tag, i) => (
                                        <span key={i} className="px-3 py-1 bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest italic rounded-lg border border-gray-100 flex items-center gap-2">
                                            <div className="w-1 h-1 bg-brand-yellow rounded-full"></div>
                                            #{tag.trim()}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="flex flex-wrap gap-10">
                                <div className="flex flex-col gap-2">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Ecosystem Vector</span>
                                    <div className="flex items-center gap-3 bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100 font-black text-xs uppercase tracking-widest text-gray-800">
                                        <MapPin className="w-4 h-4 text-brand-yellow" /> {job.location || job.requisition.location || job.requisition.department}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Protocol Status</span>
                                    <div className="flex items-center gap-3 bg-gray-900 text-brand-yellow px-6 py-4 rounded-2xl border border-gray-800 font-black text-xs uppercase tracking-widest">
                                        <ShieldCheck className="w-4 h-4" /> {job.is_internal ? 'INTERNAL LAYER' : 'EXTERNAL NODE'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-20 relative z-10">
                            <section>
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.4em] mb-8 flex items-center gap-4 italic">
                                    <div className="w-10 h-px bg-brand-yellow"></div> Mission Objectives
                                </h3>
                                <div className="text-gray-500 text-[13px] font-bold leading-loose uppercase tracking-widest italic space-y-6">
                                    {(job.description || job.requisition.description).split('\n').map((para, i) => (
                                        <p key={i}>{para}</p>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.4em] mb-8 flex items-center gap-4 italic">
                                    <div className="w-10 h-px bg-gray-900"></div> Core Requirements
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {['Strategic Execution', 'Node Optimization', 'Cross-Unit Synergy', 'Core Evolution'].map((req, i) => (
                                        <div key={req} className="flex items-center gap-5 bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100 text-[10px] font-black uppercase tracking-[0.2em] group hover:border-brand-yellow/30 transition-all">
                                            <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-brand-yellow text-[12px] font-black shadow-sm group-hover:bg-brand-yellow group-hover:text-black transition-all">0{i + 1}</div>
                                            {req}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </motion.div>
                </div>

                {/* Sidebar Action */}
                <aside className="lg:col-span-4">
                    <div className="sticky top-32 space-y-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-gray-900 text-brand-yellow rounded-[3rem] p-12 shadow-2xl shadow-black/20 border border-gray-800 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-brand-yellow"></div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-10 flex items-center gap-4 italic">
                                <Send className="w-5 h-5 text-brand-yellow group-hover:rotate-12 transition-transform" /> Application Hub
                            </h4>

                            {applied ? (
                                <div className="text-center py-10">
                                    <div className="w-20 h-20 bg-brand-yellow rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-brand-yellow/30">
                                        <CheckCircle className="w-10 h-10 text-gray-900" />
                                    </div>
                                    <h5 className="text-2xl font-black text-white mb-3 uppercase tracking-tighter">SUBMITTED.</h5>
                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] leading-loose italic">Internal node record synchronized successfully.</p>
                                </div>
                            ) : (
                                <div className="space-y-10">
                                    <p className="text-[11px] font-black text-gray-400 leading-loose uppercase tracking-[0.2em] italic">
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
                                        className="w-full bg-brand-yellow text-gray-900 py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-white transition-all flex items-center justify-center gap-4 shadow-xl shadow-brand-yellow/10 hover:scale-105"
                                    >
                                        Initiate Apply <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </motion.div>

                        <div className="p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm relative group overflow-hidden">
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-50 group-hover:bg-brand-yellow transition-colors"></div>
                            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 text-gray-400 italic">Security Protocol</h5>
                            <p className="text-[11px] font-bold text-gray-800 leading-loose uppercase tracking-[0.2em] italic">
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

                            <div className="p-10 sm:p-16 overflow-y-auto max-h-[90vh]">
                                <div className="flex justify-between items-start mb-16">
                                    <div>
                                        <h2 className="text-4xl font-black mb-3 tracking-tighter uppercase leading-none">Talent Synchronization</h2>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] italic">Transmit professional coordinates to the ecosystem</p>
                                    </div>
                                    <button onClick={() => setShowModal(false)} className="p-4 bg-gray-50 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <form onSubmit={handleApply} className="space-y-12">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                        <div className="flex flex-col gap-3">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Full Name</label>
                                            <input
                                                required
                                                type="text"
                                                className="bg-gray-50 border-none rounded-2xl px-6 py-5 text-[11px] font-black uppercase tracking-widest focus:ring-2 focus:ring-brand-yellow"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Email Address</label>
                                            <input
                                                required
                                                type="email"
                                                className="bg-gray-50 border-none rounded-2xl px-6 py-5 text-[11px] font-black uppercase tracking-widest focus:ring-2 focus:ring-brand-yellow"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Age Factor</label>
                                            <input
                                                required
                                                type="number"
                                                className="bg-gray-50 border-none rounded-2xl px-6 py-5 text-[11px] font-black uppercase tracking-widest focus:ring-2 focus:ring-brand-yellow"
                                                value={formData.age}
                                                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Gender Node</label>
                                            <select
                                                className="bg-gray-50 border-none rounded-2xl px-6 py-5 text-[11px] font-black uppercase tracking-widest focus:ring-2 focus:ring-brand-yellow"
                                                value={formData.gender}
                                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                            >
                                                <option>Male</option>
                                                <option>Female</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                        <div className="flex flex-col gap-3">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Institution Nucleus</label>
                                            <input
                                                required
                                                type="text"
                                                className="bg-gray-50 border-none rounded-2xl px-6 py-5 text-[11px] font-black uppercase tracking-widest focus:ring-2 focus:ring-brand-yellow"
                                                value={formData.institution_name}
                                                onChange={(e) => setFormData({ ...formData, institution_name: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Academic CGPA</label>
                                            <input
                                                required
                                                type="number" step="0.01"
                                                className="bg-gray-50 border-none rounded-2xl px-6 py-5 text-[11px] font-black uppercase tracking-widest focus:ring-2 focus:ring-brand-yellow"
                                                value={formData.cgpa}
                                                onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                        <div className="flex flex-col gap-3">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Experience Years</label>
                                            <input
                                                required
                                                type="number"
                                                className="bg-gray-50 border-none rounded-2xl px-6 py-5 text-[11px] font-black uppercase tracking-widest focus:ring-2 focus:ring-brand-yellow"
                                                value={formData.years_of_experience}
                                                onChange={(e) => setFormData({ ...formData, years_of_experience: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Current Coordinates</label>
                                            <input
                                                required
                                                type="text"
                                                className="bg-gray-50 border-none rounded-2xl px-6 py-5 text-[11px] font-black uppercase tracking-widest focus:ring-2 focus:ring-brand-yellow"
                                                value={formData.current_address}
                                                onChange={(e) => setFormData({ ...formData, current_address: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Professional Background Specs</label>
                                        <textarea
                                            required
                                            rows="4"
                                            className="bg-gray-50 border-none rounded-[2rem] px-8 py-6 text-[11px] font-black uppercase tracking-widest focus:ring-2 focus:ring-brand-yellow italic"
                                            value={formData.professional_background}
                                            onChange={(e) => setFormData({ ...formData, professional_background: e.target.value })}
                                            placeholder="DESCRIBE YOUR CAREER VECTOR..."
                                        ></textarea>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Asset Transmission (PDF ONLY)</label>
                                        <div className="relative group">
                                            <input
                                                required
                                                type="file"
                                                accept=".pdf"
                                                onChange={(e) => setCvFile(e.target.files[0])}
                                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            />
                                            <div className="bg-gray-50 border-4 border-dashed border-gray-100 rounded-3xl px-10 py-12 text-center group-hover:border-brand-yellow/50 transition-all duration-500">
                                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-yellow shadow-sm">
                                                    <FileText className="w-8 h-8" />
                                                </div>
                                                <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] italic">
                                                    {cvFile ? cvFile.name : 'CLICK OR DRAG ASSET TO UPLOAD'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-6 pt-10">
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="flex-1 py-6 px-10 border border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-gray-50 transition-colors"
                                        >
                                            Abort
                                        </button>
                                        <button
                                            disabled={applying}
                                            type="submit"
                                            className="flex-[2] py-6 px-10 bg-gray-900 text-brand-yellow rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-black hover:scale-105 transition-all shadow-2xl shadow-black/20 flex items-center justify-center gap-4"
                                        >
                                            {applying ? 'SYNCHRONIZING...' : 'TRANSMIT PROFILE'}
                                            <CheckCircle className="w-5 h-5" />
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
