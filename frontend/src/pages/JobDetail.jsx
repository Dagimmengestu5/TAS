import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Briefcase, ChevronLeft, Send, CheckCircle, FileText, Globe, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const JobDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
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

    return (
        <div className="min-h-screen bg-gray-50/30 font-sans text-gray-900 selection:bg-yellow-100 pb-40">
            {/* Header / Nav */}
            <nav className="p-6 max-w-7xl mx-auto flex items-center gap-6 mb-10">
                <button
                    onClick={() => navigate(-1)}
                    className="p-3 bg-white border border-gray-100 rounded-xl hover:border-yellow-400 hover:bg-yellow-50 transition-all group"
                >
                    <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-yellow-600" />
                </button>
                <div className="h-4 w-px bg-gray-200"></div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Job Spec ID: {String(job.id).padStart(4, '0')}</span>
            </nav>

            <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-8">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl border border-gray-100 p-8 md:p-12 shadow-sm"
                    >
                        <div className="mb-10">
                            <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-6">
                                <Zap className="w-3.5 h-3.5" /> Full-Time Opportunity
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
                                {job.requisition.title}
                            </h1>

                            <div className="flex flex-wrap gap-6 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg"><MapPin className="w-4 h-4 text-yellow-500" /> {job.requisition.location || job.requisition.department}</div>
                                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg"><ShieldCheck className="w-4 h-4 text-yellow-500" /> {job.is_internal ? 'Internal' : 'External'}</div>
                            </div>
                        </div>

                        <div className="space-y-12">
                            <section>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                    <div className="w-5 h-1 bg-yellow-400 rounded-full"></div> Role Overview
                                </h3>
                                <div className="prose prose-sm max-w-none text-gray-600 font-medium leading-relaxed">
                                    {job.requisition.description.split('\n').map((para, i) => (
                                        <p key={i} className="mb-4">{para}</p>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                    <div className="w-5 h-1 bg-black rounded-full"></div> Key Competencies
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {['Excellence in Execution', 'Innovation Mindset', 'Team Collaboration', 'Strategic Thinking'].map((req, i) => (
                                        <div key={req} className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100 text-xs font-bold uppercase tracking-wider">
                                            <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center text-yellow-600 text-[10px] shadow-sm">{i + 1}</div>
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
                    <div className="sticky top-32 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-black text-white rounded-3xl p-8 shadow-xl shadow-black/10"
                        >
                            <h4 className="text-lg font-bold mb-6 flex items-center gap-3">
                                <Send className="w-5 h-5 text-yellow-400" /> Application Hub
                            </h4>

                            {applied ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-yellow-400/20">
                                        <CheckCircle className="w-8 h-8 text-black" />
                                    </div>
                                    <h5 className="text-xl font-bold mb-2">Submitted.</h5>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-loose">Internal record synchronized.</p>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    <p className="text-xs font-medium text-gray-400 leading-relaxed uppercase tracking-wide">
                                        Submit your profile for review. Our talent specialists will synchronize with you shortly.
                                    </p>

                                    <button
                                        onClick={() => {
                                            if (!user) {
                                                navigate(`/login?returnUrl=/jobs/${id}`);
                                                return;
                                            }
                                            setShowModal(true);
                                        }}
                                        className="w-full bg-yellow-400 text-black py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-3 shadow-lg shadow-yellow-400/10"
                                    >
                                        Apply Now <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </motion.div>

                        <div className="p-6 bg-white rounded-2xl border border-gray-100">
                            <h5 className="text-[9px] font-bold uppercase tracking-widest mb-4 text-gray-400">Security Note</h5>
                            <p className="text-[10px] font-bold text-gray-800 leading-relaxed uppercase tracking-wide">
                                Droga processes all applications through a secure encrypted talent engine.
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
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 50, scale: 0.9 }}
                            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 sm:p-12 overflow-y-auto max-h-[85vh]">
                                <h2 className="text-3xl font-bold mb-2 tracking-tight">Talent Synchronization</h2>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-10">Complete your professional profile for review</p>

                                <form onSubmit={handleApply} className="space-y-8">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                            <input
                                                required
                                                type="text"
                                                className="bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-yellow-400"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                            <input
                                                required
                                                type="email"
                                                className="bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-yellow-400"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Age</label>
                                            <input
                                                required
                                                type="number"
                                                className="bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-yellow-400"
                                                value={formData.age}
                                                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Gender</label>
                                            <select
                                                className="bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-yellow-400"
                                                value={formData.gender}
                                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                            >
                                                <option>Male</option>
                                                <option>Female</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Institution Name</label>
                                            <input
                                                required
                                                type="text"
                                                className="bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-yellow-400"
                                                value={formData.institution_name}
                                                onChange={(e) => setFormData({ ...formData, institution_name: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">CGPA</label>
                                            <input
                                                required
                                                type="number" step="0.01"
                                                className="bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-yellow-400"
                                                value={formData.cgpa}
                                                onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Years of Exp.</label>
                                            <input
                                                required
                                                type="number"
                                                className="bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-yellow-400"
                                                value={formData.years_of_experience}
                                                onChange={(e) => setFormData({ ...formData, years_of_experience: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Current Address</label>
                                            <input
                                                required
                                                type="text"
                                                className="bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-yellow-400"
                                                value={formData.current_address}
                                                onChange={(e) => setFormData({ ...formData, current_address: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Professional Background</label>
                                        <textarea
                                            required
                                            rows="3"
                                            className="bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-yellow-400"
                                            value={formData.professional_background}
                                            onChange={(e) => setFormData({ ...formData, professional_background: e.target.value })}
                                        ></textarea>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">CV Attachment (PDF Only)</label>
                                        <div className="relative group">
                                            <input
                                                required
                                                type="file"
                                                accept=".pdf"
                                                onChange={(e) => setCvFile(e.target.files[0])}
                                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            />
                                            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl px-5 py-8 text-center group-hover:border-yellow-400 transition-colors">
                                                <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                                    {cvFile ? cvFile.name : 'Click or Drag to Upload PDF'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-6">
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="flex-1 py-4 px-8 border border-gray-100 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            disabled={applying}
                                            type="submit"
                                            className="flex-[2] py-4 px-8 bg-black text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-yellow-400 hover:text-black transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3"
                                        >
                                            {applying ? 'Synchronizing...' : 'Submit Application'}
                                            <CheckCircle className="w-4 h-4" />
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
