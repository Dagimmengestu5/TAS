import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Briefcase, User, Clock, ChevronRight, Zap, ShieldCheck, Activity, Target, ShieldAlert, Archive, CheckCircle, X, ArrowRight, TrendingUp } from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import ApplicationPipeline from './ApplicationPipeline';

const TADashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        total_postings: 0,
        pending_requisitions: 0,
        active_applications: 0,
        hired_count: 0
    });
    const [view, setView] = useState('pipeline'); // pipeline, requisitions, pool, jobs
    const [loading, setLoading] = useState(false);
    const [jobPostings, setJobPostings] = useState([]);

    const fetchStats = async () => {
        try {
            const [jobs, reqs, apps] = await Promise.all([
                api.get('/jobs/all'), // Get all for TA
                api.get('/requisitions'),
                api.get('/applications')
            ]);

            setJobPostings(jobs.data);
            setStats({
                total_postings: jobs.data.filter(j => j.status === 'posted').length,
                pending_requisitions: reqs.data.filter(r => r.status === 'approved' || r.status === 'approved_hr' || r.status === 'pending_ceo').length,
                active_applications: apps.data.filter(a => a.status !== 'hired' && a.status !== 'rejected' && a.status !== 'pooled').length,
                hired_count: apps.data.filter(a => a.status === 'hired').length
            });
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleAction = async (id, action) => {
        try {
            await api.patch(`/jobs/${id}/${action}`);
            fetchStats();
        } catch (err) {
            alert('Action failed');
        }
    };

    return (
        <div className="bg-white min-h-screen w-full max-w-full px-6 py-6 lg:px-10  flex flex-col">
            {/* Custom Scrollbar Styling - Matching Pipeline Style */}
            <style>
                {`
                    .dashboard-scroll::-webkit-scrollbar { height: 10px; }
                    .dashboard-scroll::-webkit-scrollbar-track { background: #F9FAFB; margin: 0 20px; }
                    .dashboard-scroll::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 6px; border: 2px solid #F9FAFB; }
                    .dashboard-scroll::-webkit-scrollbar-thumb:hover { background: #FFF200; }
                `}
            </style>

            {/* Stats Header - Horizontal Scroll */}
            <div className="flex gap-4 mb-8 overflow-x-auto pb-4 dashboard-scroll">
                {[
                    { label: 'Active Jobs', val: stats.total_postings, icon: Briefcase, color: 'text-brand-yellow' },
                    { label: 'Approved Requests', val: stats.pending_requisitions, icon: ShieldCheck, color: 'text-green-500' },
                    { label: 'Total Applications', val: stats.active_applications, icon: Activity, color: 'text-blue-500' },
                    { label: 'Employees Hired', val: stats.hired_count, icon: Target, color: 'text-purple-500' }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all min-w-[280px] flex-shrink-0"
                    >
                        <div>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider  mb-2">{stat.label}</p>
                            <h3 className="text-3xl font-bold text-gray-900  leading-none">{stat.val}</h3>
                        </div>
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-gray-900 transition-all duration-500">
                            <stat.icon className={`w-5 h-5 ${stat.color} group-hover:scale-110 transition-transform`} />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Navigation Tabs - Horizontal Scroll */}
            <div className="flex flex-nowrap gap-4 mb-8 bg-gray-50 p-2 pb-4 rounded-2xl w-full max-w-full overflow-x-auto dashboard-scroll border border-gray-100 shadow-inner md:w-fit">
                {[
                    { id: 'pipeline', label: 'Hiring Process', icon: Activity },
                    { id: 'jobs', label: 'Job List', icon: Briefcase },
                    { id: 'pool', label: 'Candidate Pool', icon: Archive }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setView(tab.id)}
                        className={`flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider  flex-shrink-0 ${view === tab.id ? 'bg-gray-900 text-brand-yellow shadow-xl translate-y-[-2px]' : 'text-gray-400 hover:text-gray-900'}`}
                    >
                        <tab.icon className="w-4 h-4" /> {tab.label}
                    </button>
                ))}
            </div>

            {/* View Content */}
            <div className="flex-1 min-h-0 border border-gray-100 rounded-[2.5rem] shadow-sm bg-white overflow-hidden mb-6">
                <AnimatePresence mode="wait">
                    {view === 'pipeline' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                            <ApplicationPipeline filterOverride="active" />
                        </motion.div>
                    )}
                    {view === 'pool' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                            <ApplicationPipeline statusFilterOverride="pooled" layout="grid" />
                        </motion.div>
                    )}
                    {view === 'jobs' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full p-8 overflow-y-auto">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold uppercase  tracking-tight">Active Jobs</h2>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ">Manage your open positions</p>
                                </div>
                                {(user?.role?.name === 'ta_team' || user?.role?.name === 'admin') && (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => navigate('/ta/jobs')}
                                            className="bg-gray-900 text-brand-yellow px-8 py-3 rounded-xl font-bold text-[10px] uppercase tracking-wider  hover:bg-black hover:text-brand-yellow transition-all flex items-center gap-3 shadow-lg"
                                        >
                                            Go to Job Console <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {jobPostings.map(job => (
                                    <div key={job.id} className="bg-gray-50/50 rounded-3xl p-6 border border-gray-100 hover:border-brand-yellow/30 transition-all group">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                                <Briefcase className="w-5 h-5 text-brand-yellow" />
                                            </div>
                                            <span className={`px-2 py-1 rounded text-[8px] font-bold uppercase tracking-wider border  ${job.status === 'posted' ? 'text-brand-yellow bg-gray-900 border-gray-800 shadow-lg' :
                                                job.status === 'created' ? 'text-gray-400 bg-gray-50 border-gray-100' :
                                                    'text-red-500 bg-red-50 border-red-100'
                                                }`}>
                                                {job.status}
                                            </span>
                                        </div>
                                        <h3 className="text-sm font-bold uppercase tracking-tight mb-2 group-hover:text-brand-yellow transition-colors ">{job.title || job.requisition?.title}</h3>
                                        <div className="flex flex-col gap-1 text-[8px] font-bold text-gray-400 uppercase tracking-wider  mb-6">
                                            <span>Job ID: {String(job.id).padStart(4, '0')}</span>
                                            <span>Date: {new Date(job.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => navigate(`/jobs/${job.id}`)}
                                                className="flex-1 bg-white border border-gray-100 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-wider  hover:bg-gray-900 hover:text-white transition-all"
                                            >
                                                View Spec
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {jobPostings.length === 0 && (
                                    <div className="col-span-full py-20 text-center bg-gray-50/30 rounded-[2rem] border-2 border-dashed border-gray-100">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ">No jobs found.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default TADashboard;
