import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Clock, Filter, Briefcase, ChevronRight, CheckCircle, Users, Mail, ArrowRight, Zap, Globe, Shield, Building2, X, Star } from 'lucide-react';
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

    const JOB_CATEGORIES = [
        'all', 'Health', 'Accounting', 'Pharmacy', 'IT',
        'Engineering', 'Finance', 'Marketing', 'HR', 'Legal'
    ];

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
        const req = job.requisition;
        const matchesSearch = (req.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (req.department || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (req.category || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'all' || (typeFilter === 'internal' ? job.is_internal : job.is_external);
        const matchesCategory = categoryFilter === 'all' || req.category === categoryFilter;

        return matchesSearch && matchesType && matchesCategory;
    });

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

            {/* Hero Section */}
            <header className="relative py-24 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 bg-yellow-100 text-yellow-800 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
                    >
                        Strategic Career Hub
                    </motion.div>

                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-8 leading-tight max-w-3xl">
                        Design your <span className="text-yellow-500">legacy</span> with Droga.
                    </h1>

                    <p className="max-w-xl text-lg text-gray-500 mb-12 font-medium">
                        Join an ecosystem of excellence where innovation meeting opportunity. Discover roles that define the future.
                    </p>

                    <div className="w-full max-w-2xl">
                        <div className="bg-white border border-gray-200 p-2 rounded-2xl shadow-xl shadow-black/5 flex flex-col sm:flex-row gap-2 items-center">
                            <div className="flex-1 w-full relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search by role or department..."
                                    className="w-full pl-12 pr-4 py-4 bg-transparent border-none focus:ring-0 text-sm font-medium"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button className="w-full sm:w-auto bg-black text-white px-10 py-4 rounded-xl font-bold text-sm hover:bg-yellow-400 hover:text-black transition-all flex items-center justify-center gap-2">
                                Find Job <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Subtle Background Elements */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-yellow-400/5 -skew-x-12 translate-x-20 -z-10"></div>
            </header>

            {/* Content Section */}
            <main className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Filters */}
                <aside className="lg:col-span-3 space-y-10">
                    <div className="sticky top-32">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Filters</h3>
                            <Filter className="w-4 h-4 text-gray-300" />
                        </div>

                        <div className="space-y-8">
                            <div>
                                <label className="text-[10px] font-bold text-gray-800 uppercase tracking-wider mb-4 block">Eligibility</label>
                                <div className="flex flex-col gap-2">
                                    {['all', 'internal', 'external'].map(t => (
                                        <button key={t} onClick={() => setTypeFilter(t)}
                                            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${typeFilter === t ? 'bg-black text-white shadow-md shadow-black/10' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-gray-800 uppercase tracking-wider mb-4 block">Specialization</label>
                                <div className="flex flex-wrap gap-2">
                                    {JOB_CATEGORIES.map(c => (
                                        <button key={c} onClick={() => setCategoryFilter(c)}
                                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all border ${categoryFilter === c ? 'bg-yellow-400 border-yellow-400 text-black shadow-sm' : 'bg-white border-gray-100 text-gray-400 hover:border-yellow-400 hover:text-black'}`}>
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 p-6 bg-gray-900 rounded-2xl text-white relative overflow-hidden group">
                            <Zap className="w-8 h-8 text-yellow-400 mb-4 fill-yellow-400" />
                            <h4 className="text-lg font-bold mb-2">Internal Uplink</h4>
                            <p className="text-[10px] text-gray-400 leading-relaxed font-medium mb-6 uppercase tracking-wide">Employees can fast-track applications via internal credentials.</p>
                            <button className="w-full py-3 bg-white text-black rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-yellow-400 transition-all">Sign In</button>
                        </div>
                    </div>
                </aside>

                {/* Job Grid */}
                <div className="lg:col-span-9">
                    <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-50">
                        <h2 className="text-2xl font-bold tracking-tight">Open Opportunities</h2>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{filteredJobs.length} Results</span>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[1, 2, 3, 4].map(n => (
                                <div key={n} className="h-64 bg-gray-50 rounded-2xl animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {filteredJobs.length > 0 ? filteredJobs.map((job) => (
                                <motion.div
                                    key={job.id}
                                    layout
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

                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-black transition-colors"> {job.requisition.title}</h3>

                                    <div className="flex items-center gap-4 text-gray-500 text-[11px] font-bold uppercase tracking-wider mb-8">
                                        <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {job.requisition.department}</div>
                                        <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Posted 2d ago</div>
                                    </div>

                                    <div className="flex items-center justify-between mt-auto">
                                        <Link
                                            to={`/jobs/${job.id}`}
                                            className="w-full flex justify-between items-center py-3.5 px-6 bg-gray-50 rounded-xl group-hover:bg-black group-hover:text-white transition-all font-bold text-xs uppercase tracking-widest text-black"
                                        >
                                            View Profile <ChevronRight className="w-4 h-4" />
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
                </div>
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
