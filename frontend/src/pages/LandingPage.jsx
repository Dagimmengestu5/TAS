import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Clock, Filter, Briefcase, ChevronRight, CheckCircle, Users, Mail, ArrowRight, Zap, Globe, Shield, Building2, X, Star, Cpu, Activity, LogOut } from 'lucide-react';
import api from '../api/api';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [locationFilter, setLocationFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');

    const JOB_CATEGORIES = [
        'all', 'Health', 'Accounting', 'Pharmacy', 'IT',
        'Engineering', 'Finance', 'Marketing', 'HR', 'Legal'
    ];

    const JOB_TYPES = ['all', 'Full-time', 'Freelance', 'Half-time'];
    const DATE_OPTIONS = ['all', 'Today', 'Yesterday', 'Last Week', 'Last Month'];

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await api.get('/jobs');
                setJobs(response.data);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const filteredJobs = jobs.filter(job => {
        const req = job?.requisition || {};
        const createdAt = new Date(job?.created_at || new Date());
        const now = new Date();

        const matchesSearch = (req.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (req.department || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (req.category || '').toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = typeFilter === 'all' ||
            (typeFilter === 'Full-time' && !job?.is_internal) ||
            (typeFilter === 'Freelance' && job?.is_external) ||
            (typeFilter === 'Half-time' && job?.is_internal);

        const matchesCategory = categoryFilter === 'all' || req.category === categoryFilter;
        const matchesLocation = locationFilter === 'all' || req.location === locationFilter;

        let matchesDate = true;
        if (dateFilter !== 'all') {
            const diffTime = Math.abs(now - createdAt);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (dateFilter === 'Today') matchesDate = diffDays <= 1;
            else if (dateFilter === 'Yesterday') matchesDate = diffDays <= 2;
            else if (dateFilter === 'Last Week') matchesDate = diffDays <= 7;
            else if (dateFilter === 'Last Month') matchesDate = diffDays <= 30;
        }

        return matchesSearch && matchesType && matchesCategory && matchesLocation && matchesDate;
    });

    const uniqueLocations = ['all', ...new Set(jobs.map(j => j?.requisition?.location).filter(Boolean))];

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-yellow-100">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-yellow-400 font-bold text-xl shadow-sm">D</div>
                        <div className="flex flex-col">
                            <span className="text-lg font-bold tracking-tight text-black leading-none uppercase">DROGA GROUP</span>
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-tight">Talent Acquisition</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <Link to="/profile" className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full border border-gray-100 hover:border-yellow-400 transition-all">
                                <span className="text-xs font-bold uppercase">{user.name?.split(' ')[0]}</span>
                                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-xs uppercase shadow-sm">
                                    {user.name?.charAt(0)}
                                </div>
                            </Link>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login" className="text-xs font-bold text-gray-500 hover:text-black transition-colors px-4 py-2">Sign In</Link>
                                <Link to="/register" className="bg-yellow-400 text-black px-6 py-2.5 rounded-full font-bold text-xs hover:bg-black hover:text-white transition-all shadow-sm">Join Now</Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Premium Hero Section */}
            <header className="relative pt-24 pb-20 px-6 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col items-center text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8 flex items-center gap-2 bg-yellow-400/10 text-yellow-700 px-4 py-2 rounded-full border border-yellow-200"
                        >
                            <Zap className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Next-Gen Talent Acquisition</span>
                        </motion.div>

                        <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-[0.9] text-black max-w-5xl">
                            Unlock your <br />
                            <span className="relative inline-block">
                                <span className="relative z-10 text-yellow-500 italic">potential</span>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    transition={{ delay: 0.5, duration: 0.8 }}
                                    className="absolute bottom-4 left-0 h-4 bg-yellow-400/20 -z-10"
                                />
                            </span> with us.
                        </h1>

                        <p className="max-w-xl text-lg text-gray-400 mb-16 font-medium leading-relaxed uppercase tracking-widest text-[10px]">
                            We don't just hire. We build the future of industry leaders. <br /> Discover high-impact roles designed for excellence.
                        </p>

                        <div className="w-full max-w-4xl mb-24">
                            <div className="bg-white border border-gray-100 p-3 rounded-[2.5rem] shadow-2xl shadow-black/5 flex flex-col sm:flex-row gap-2 items-center hover:border-yellow-200 transition-all duration-500">
                                <div className="flex-1 w-full relative">
                                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 w-6 h-6" />
                                    <select
                                        value={typeFilter}
                                        onChange={(e) => setTypeFilter(e.target.value)}
                                        className="w-full pl-16 pr-4 py-6 bg-transparent border-none focus:ring-0 text-base font-bold text-black placeholder:text-gray-300"
                                    >
                                        <option value="all">Job Type</option>
                                        <option value="Full-time">Full-time</option>
                                        <option value="Freelance">Freelance</option>
                                        <option value="Half-time">Half-time</option>
                                        <option value="Internship">Internship</option>
                                    </select>
                                </div>
                                <button className="w-full sm:w-auto bg-black text-white px-12 py-6 rounded-[2rem] font-bold text-xs uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition-all flex items-center justify-center gap-3 shadow-xl shadow-black/10 active:scale-95 duration-200">
                                    Initiate Search <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Professional Top-Bar Filters */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full max-w-5xl bg-white rounded-3xl border border-gray-100 shadow-xl shadow-black/[0.02] p-6 flex flex-wrap items-center justify-center gap-8 md:gap-12"
                        >
                            <div className="flex flex-col items-start gap-2">
                                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    <Cpu className="w-3.5 h-3.5 text-yellow-500" /> Specialization
                                </label>
                                <select
                                    className="bg-transparent border-none p-0 text-sm font-bold text-black focus:ring-0 cursor-pointer hover:text-yellow-600 transition-colors uppercase tracking-tight"
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                >
                                    {JOB_CATEGORIES.map(c => <option key={c} value={c}>{c === 'all' ? 'All Sectors' : c}</option>)}
                                </select>
                            </div>

                            <div className="w-px h-10 bg-gray-100 hidden md:block"></div>

                            <div className="flex flex-col items-start gap-2">
                                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    <MapPin className="w-3.5 h-3.5 text-yellow-500" /> Location
                                </label>
                                <select
                                    className="bg-transparent border-none p-0 text-sm font-bold text-black focus:ring-0 cursor-pointer hover:text-yellow-600 transition-colors uppercase tracking-tight"
                                    value={locationFilter}
                                    onChange={(e) => setLocationFilter(e.target.value)}
                                >
                                    {uniqueLocations.map(l => <option key={l} value={l}>{l === 'all' ? 'Global Reach' : l}</option>)}
                                </select>
                            </div>

                            <div className="w-px h-10 bg-gray-100 hidden md:block"></div>

                            <div className="flex flex-col items-start gap-2">
                                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    <Activity className="w-3.5 h-3.5 text-yellow-500" /> Contract Type
                                </label>
                                <select
                                    className="bg-transparent border-none p-0 text-sm font-bold text-black focus:ring-0 cursor-pointer hover:text-yellow-600 transition-colors uppercase tracking-tight"
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                >
                                    {JOB_TYPES.map(t => <option key={t} value={t}>{t === 'all' ? 'Any Modality' : t}</option>)}
                                </select>
                            </div>

                            <div className="w-px h-10 bg-gray-100 hidden md:block"></div>

                            <div className="flex flex-col items-start gap-2">
                                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    <Clock className="w-3.5 h-3.5 text-yellow-500" /> Posting Window
                                </label>
                                <select
                                    className="bg-transparent border-none p-0 text-sm font-bold text-black focus:ring-0 cursor-pointer hover:text-yellow-600 transition-colors uppercase tracking-tight"
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value)}
                                >
                                    {DATE_OPTIONS.map(d => <option key={d} value={d}>{d === 'all' ? 'Any Timeframe' : d}</option>)}
                                </select>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Aesthetic Background Elements */}
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
                    <svg viewBox="0 0 100 100" className="w-full h-full fill-yellow-400">
                        <circle cx="90" cy="10" r="40" />
                    </svg>
                </div>
            </header>

            {/* Content Section */}
            <main className="max-w-7xl mx-auto px-6 py-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-2 h-10 bg-yellow-400"></div>
                            <h2 className="text-4xl font-bold tracking-tight uppercase">Strategic Openings</h2>
                        </div>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em] ml-5">Active Opportunities in the Ecosystem</p>
                    </div>
                    <div className="flex items-center gap-6 pb-2">
                        <div className="flex items-center gap-2">
                            <span className="text-4xl font-black text-black leading-none">{filteredJobs.length}</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block leading-tight">Matched<br />Nodes</span>
                        </div>
                        {(searchTerm || categoryFilter !== 'all' || locationFilter !== 'all' || typeFilter !== 'all' || dateFilter !== 'all') && (
                            <button
                                onClick={() => {
                                    setSearchTerm(''); setCategoryFilter('all'); setLocationFilter('all'); setTypeFilter('all'); setDateFilter('all');
                                }}
                                className="group flex items-center gap-2 text-[10px] font-bold text-red-500 uppercase tracking-widest hover:text-black transition-colors"
                            >
                                <LogOut className="w-4 h-4" /> Reset Filters
                            </button>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(n => (
                            <div key={n} className="h-64 bg-gray-50 rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredJobs.length > 0 ? filteredJobs.map((job) => (
                            <motion.div
                                key={job.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="group bg-white rounded-2xl border border-gray-100 p-8 flex flex-col shadow-sm hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="bg-gray-50 p-3 rounded-xl group-hover:bg-yellow-100 transition-colors">
                                        <Briefcase className="w-6 h-6 text-gray-400 group-hover:text-yellow-600" />
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${job.is_internal ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-50 text-blue-700'}`}>
                                        {job.is_internal ? 'Internal' : 'External'}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-black transition-colors"> {job?.requisition?.title}</h3>

                                <p className="text-[10px] text-gray-400 font-medium mb-6 line-clamp-2 uppercase tracking-wider leading-relaxed">
                                    {job?.requisition?.description || 'Strategic role focused on organizational excellence and high-impact delivery.'}
                                </p>

                                <div className="flex items-center gap-4 text-gray-500 text-[11px] font-bold uppercase tracking-wider mb-8">
                                    <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {job?.requisition?.department}</div>
                                    <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {new Date(job?.created_at).toLocaleDateString()}</div>
                                </div>

                                <div className="flex items-center justify-between mt-auto">
                                    <Link
                                        to={`/jobs/${job.id}`}
                                        className="w-full flex justify-between items-center py-3.5 px-6 bg-gray-50 rounded-xl group-hover:bg-black group-hover:text-white transition-all font-bold text-xs uppercase tracking-widest text-black"
                                    >
                                        View Details <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </motion.div>
                        )) : (
                            <div className="col-span-full py-40 border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center">
                                <Search className="w-12 h-12 text-gray-200 mb-6" />
                                <span className="text-lg font-bold text-gray-300 uppercase italic">No roles detected matching criteria.</span>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-white py-20 px-6 border-t border-gray-50">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-yellow-400 font-bold text-lg">D</div>
                            <h2 className="text-xl font-bold tracking-tight">DROGA GROUP</h2>
                        </div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">© 2026 Droga Operation System. All rights reserved.</p>
                    </div>

                    <div className="flex gap-8">
                        {['Privacy', 'Security', 'Contact', 'Portal'].map(l => (
                            <Link key={l} to="#" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">{l}</Link>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
};


export default LandingPage;
