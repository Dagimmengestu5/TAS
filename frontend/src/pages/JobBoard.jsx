import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Clock, Filter, Briefcase, ChevronRight, ArrowRight } from 'lucide-react';
import api from '../api/api';
import { Link, useNavigate } from 'react-router-dom';

const JobBoard = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await api.get('/jobs', {
                    params: { type: filter !== 'all' ? filter : undefined }
                });
                setJobs(response.data);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, [filter]);

    const filteredJobs = jobs.filter(job =>
        (job.requisition.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.requisition.department || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50/30 py-16 px-6 font-sans text-gray-900 selection:bg-yellow-100">
            <div className="max-w-7xl mx-auto">
                <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 inline-block"
                        >
                            Active Opportunities
                        </motion.div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">Market Intelligence</h1>
                        <p className="text-gray-400 font-bold uppercase text-[9px] tracking-[0.3em] mt-2">Available Nodes for Acquisition</p>
                    </div>
                </header>

                <div className="flex flex-col lg:flex-row gap-6 mb-12">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 group-focus-within:text-yellow-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by role or unit..."
                            className="w-full pl-14 pr-6 py-4 rounded-xl bg-white border border-gray-100 shadow-sm focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all text-sm font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 p-1.5 bg-white rounded-xl border border-gray-100 shadow-sm">
                        {['all', 'internal', 'external'].map((t) => (
                            <button
                                key={t}
                                onClick={() => setFilter(t)}
                                className={`px-6 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${filter === t
                                    ? 'bg-black text-white shadow-md'
                                    : 'text-gray-400 hover:text-black hover:bg-gray-50'
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-40">
                        <div className="w-10 h-10 border-4 border-gray-100 border-t-yellow-400 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredJobs.length > 0 ? filteredJobs.map((job) => (
                            <motion.div
                                key={job.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all flex flex-col group relative"
                            >
                                <div className="flex justify-between items-start mb-8">
                                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-yellow-400 group-hover:text-black transition-all border border-gray-50">
                                        <Briefcase className="w-6 h-6" />
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${job.is_internal ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-50 text-blue-700'
                                        }`}>
                                        {job.is_internal ? 'Internal' : 'External'}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight group-hover:text-black transition-colors">{job.requisition.title}</h3>
                                <p className="text-gray-400 text-[10px] mb-8 flex items-center gap-2 font-bold uppercase tracking-widest">
                                    <MapPin className="w-3.5 h-3.5 text-yellow-500" /> {job.requisition.department}
                                </p>
                                <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-300 text-[10px] font-bold uppercase tracking-widest italic">
                                        <Clock className="w-3.5 h-3.5" />
                                        {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Real-time'}
                                    </div>
                                    <Link
                                        to={`/jobs/${job.id}`}
                                        className="bg-gray-50 text-black px-5 py-2.5 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-all flex items-center gap-2 group-hover:bg-yellow-400 group-hover:text-black"
                                    >
                                        Inspect <ChevronRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </motion.div>
                        )) : (
                            <div className="col-span-full py-40 text-center bg-white rounded-3xl border border-dashed border-gray-100">
                                <p className="text-gray-300 font-bold text-lg uppercase tracking-widest">No matching roles detected.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobBoard;
