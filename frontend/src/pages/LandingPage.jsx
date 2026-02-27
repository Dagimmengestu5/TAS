import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Clock, Filter, Briefcase, ChevronRight, CheckCircle, Users, Mail, ArrowRight, Zap, Globe, Shield, Building2, X, Star, Cpu, Activity, LogOut, Linkedin, Twitter, Facebook, Phone } from 'lucide-react';
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
    const [tagFilter, setTagFilter] = useState('all');
    const [locationFilter, setLocationFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');

    const JOB_CATEGORIES = [
        'all', 'Health', 'Accounting', 'Pharmacy', 'IT',
        'Engineering', 'Finance', 'Marketing', 'HR', 'Legal'
    ];

    const JOB_TYPES = ['all', 'Full-time', 'Part-time', 'Hybrid', 'Remote', 'Contract'];
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
            (job?.employment_type === typeFilter) ||
            (!job?.employment_type && typeFilter === 'Full-time' && !job?.is_internal);

        const matchesCategory = categoryFilter === 'all' || req.category === categoryFilter;

        const jobLocation = job?.location || req.location;
        const matchesLocation = locationFilter === 'all' || jobLocation === locationFilter;

        const matchesTag = tagFilter === 'all' ||
            (job?.tags && job.tags.toLowerCase().includes(tagFilter.toLowerCase())) ||
            (req.category && req.category.toLowerCase().includes(tagFilter.toLowerCase()));

        let matchesDate = true;
        if (dateFilter !== 'all') {
            const diffTime = Math.abs(now - createdAt);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (dateFilter === 'Today') matchesDate = diffDays <= 1;
            else if (dateFilter === 'Yesterday') matchesDate = diffDays <= 2;
            else if (dateFilter === 'Last Week') matchesDate = diffDays <= 7;
            else if (dateFilter === 'Last Month') matchesDate = diffDays <= 30;
        }

        return matchesSearch && matchesType && matchesCategory && matchesLocation && matchesDate && matchesTag;
    });

    const uniqueLocations = ['all', ...new Set(jobs.map(j => j?.location || j?.requisition?.location).filter(Boolean))];

    const allTags = jobs.reduce((acc, j) => {
        if (j.tags) {
            j.tags.split(',').forEach(t => acc.add(t.trim()));
        }
        if (j.requisition?.category) {
            acc.add(j.requisition.category);
        }
        return acc;
    }, new Set());
    const uniqueTags = ['all', ...Array.from(allTags)];

    const privilegedRoles = ['admin', 'ta_team', 'hiring_manager', 'hr_approver', 'ceo_approver'];
    const hasPrivilegedAccess = privilegedRoles.includes(user?.role?.name);

    const sections = [
        {
            title: "Group Ecosystem",
            links: [
                { name: "Droga Pharma", href: "#" },
                { name: "Droga Tech Unit", href: "#" },
                { name: "Real Estate Node", href: "#" },
                { name: "Droga FMCG", href: "#" },
                { name: "Industrial Evolution", href: "#" }
            ]
        },
        {
            title: "Navigation",
            links: [
                { name: "Landing Hub", href: "/" },
                { name: "Node Matrix", href: "/jobs" },
                { name: "Identity Cluster", href: "/profile" },
                { name: "System Support", href: "#" },
                { name: "Ethics & Ops", href: "#" }
            ]
        }
    ];

    const contactInfo = [
        { icon: Mail, text: "ecosystem@drogagroup.com" },
        { icon: Phone, text: "+251 11 661 0733" },
        { icon: MapPin, text: "HQ Node, Addis Ababa, Ethiopia" }
    ];

    const currentYear = new Date().getFullYear();

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-brand-yellow/30">
            {/* Navigation - Hidden for Admins to avoid redundancy with Sidebar */}
            {!hasPrivilegedAccess && (
                <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-50 px-8">
                    <div className="max-w-[1600px] mx-auto h-24 flex items-center justify-between">
                        <div className="flex items-center gap-4 cursor-pointer group" onClick={() => navigate('/')}>
                            <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center text-brand-yellow font-black text-2xl group-hover:scale-110 transition-transform">D</div>
                            <div className="flex flex-col">
                                <span className="text-xl font-black tracking-tight text-gray-900 leading-none uppercase">Droga Hub</span>
                                <span className="text-[9px] font-black text-brand-yellow uppercase tracking-[0.3em] leading-tight">Talent Ecosystem</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            {user ? (
                                <Link to="/profile" className="flex items-center gap-4 bg-gray-50 px-6 py-2.5 rounded-2xl border border-gray-100 hover:border-brand-yellow transition-all shadow-sm group">
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900">{(user?.name || 'User').split(' ')[0]}</span>
                                        <span className="text-[8px] font-bold text-gray-400 capitalize italic">Access Granted</span>
                                    </div>
                                    <div className="w-10 h-10 bg-gray-900 text-brand-yellow rounded-xl flex items-center justify-center font-black text-sm uppercase shadow-lg group-hover:scale-110 transition-transform">
                                        {(user?.name || 'U').charAt(0)}
                                    </div>
                                </Link>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <Link to="/login" className="text-[10px] font-black text-gray-400 hover:text-gray-900 tracking-[0.2em] uppercase transition-colors px-4">Sign In</Link>
                                    <Link to="/register" className="bg-gray-900 text-brand-yellow px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black hover:scale-105 transition-all shadow-xl shadow-black/10">Initial Sync</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>
            )}

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

                        <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-10 leading-[0.85] text-gray-900 max-w-6xl uppercase">
                            Redefining <br />
                            <span className="relative inline-block text-brand-yellow italic">
                                Potential
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    transition={{ delay: 0.5, duration: 1 }}
                                    className="absolute bottom-6 left-0 h-4 bg-brand-yellow/10 -z-10"
                                />
                            </span> & Scale.
                        </h1>

                        <p className="max-w-2xl text-[11px] font-black text-gray-400 mb-20 uppercase tracking-[0.4em] leading-loose italic">
                            We don't just hire. We architect the future of industrial excellence. <br /> Discover strategic nodes designed for high-impact evolution.
                        </p>

                        <div className="w-full max-w-5xl mb-32 relative group">
                            <div className="absolute inset-0 bg-brand-yellow/20 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10"></div>
                            <div className="bg-white border border-gray-100 p-4 rounded-[3.5rem] shadow-[0_0_100px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row gap-4 items-center hover:border-brand-yellow transition-all duration-700">
                                <div className="flex-1 w-full relative">
                                    <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-300 w-7 h-7" />
                                    <input
                                        type="text"
                                        placeholder="SYNC BY NODE, UNIT OR CORE SPECS..."
                                        className="w-full pl-20 pr-8 py-8 bg-transparent border-none focus:ring-0 text-sm font-black text-gray-900 tracking-widest placeholder:text-gray-200 uppercase"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <button className="w-full sm:w-auto bg-gray-900 text-brand-yellow px-14 py-8 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.3em] hover:bg-black transition-all flex items-center justify-center gap-4 shadow-2xl shadow-black/20 active:scale-95 duration-200">
                                    INITIATE TRACE <ArrowRight className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Professional Top-Bar Filters */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full max-w-[1400px] bg-white rounded-[3rem] border border-gray-50 shadow-[0_0_80px_rgba(0,0,0,0.02)] p-10 flex flex-wrap items-center justify-center gap-10 md:gap-16 border-b-4 border-b-gray-50"
                        >
                            <div className="flex flex-col items-start gap-3 min-w-[140px]">
                                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">
                                    <Briefcase className="w-4 h-4 text-brand-yellow" /> Node Status
                                </label>
                                <select
                                    className="bg-transparent border-none p-0 text-xs font-black text-gray-900 focus:ring-0 cursor-pointer hover:text-brand-yellow transition-colors uppercase tracking-widest"
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                >
                                    <option value="all">Any Modality</option>
                                    {JOB_TYPES.slice(1).map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                                </select>
                            </div>

                            <div className="w-px h-12 bg-gray-100 hidden md:block"></div>

                            <div className="flex flex-col items-start gap-3 min-w-[140px]">
                                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">
                                    <Zap className="w-4 h-4 text-brand-yellow" /> Tags
                                </label>
                                <select
                                    className="bg-transparent border-none p-0 text-xs font-black text-gray-900 focus:ring-0 cursor-pointer hover:text-brand-yellow transition-colors uppercase tracking-widest"
                                    value={tagFilter}
                                    onChange={(e) => setTagFilter(e.target.value)}
                                >
                                    {uniqueTags.map(t => <option key={t} value={t}>{t === 'all' ? 'All Tags' : t.toUpperCase()}</option>)}
                                </select>
                            </div>

                            <div className="w-px h-12 bg-gray-100 hidden md:block"></div>

                            <div className="flex flex-col items-start gap-3 min-w-[140px]">
                                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">
                                    <Cpu className="w-4 h-4 text-brand-yellow" /> Unit Cluster
                                </label>
                                <select
                                    className="bg-transparent border-none p-0 text-xs font-black text-gray-900 focus:ring-0 cursor-pointer hover:text-brand-yellow transition-colors uppercase tracking-widest"
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                >
                                    {JOB_CATEGORIES.map(c => <option key={c} value={c}>{c === 'all' ? 'All Clusters' : c.toUpperCase()}</option>)}
                                </select>
                            </div>

                            <div className="w-px h-12 bg-gray-100 hidden md:block"></div>

                            <div className="flex flex-col items-start gap-3 min-w-[140px]">
                                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">
                                    <MapPin className="w-4 h-4 text-brand-yellow" /> Core Vector
                                </label>
                                <select
                                    className="bg-transparent border-none p-0 text-xs font-black text-gray-900 focus:ring-0 cursor-pointer hover:text-brand-yellow transition-colors uppercase tracking-widest"
                                    value={locationFilter}
                                    onChange={(e) => setLocationFilter(e.target.value)}
                                >
                                    {uniqueLocations.map(l => <option key={l} value={l}>{l === 'all' ? 'Global Core' : l.toUpperCase()}</option>)}
                                </select>
                            </div>

                            <div className="w-px h-12 bg-gray-100 hidden md:block"></div>

                            <div className="flex flex-col items-start gap-3 min-w-[140px]">
                                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">
                                    <Clock className="w-4 h-4 text-brand-yellow" /> Sync Window
                                </label>
                                <select
                                    className="bg-transparent border-none p-0 text-xs font-black text-gray-900 focus:ring-0 cursor-pointer hover:text-brand-yellow transition-colors uppercase tracking-widest"
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value)}
                                >
                                    {DATE_OPTIONS.map(d => <option key={d} value={d}>{d === 'all' ? 'Any Window' : d.toUpperCase()}</option>)}
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
                        <div className="flex items-center justify-between mb-16">
                            <div className="flex items-center gap-3">
                                <span className="text-6xl font-black text-gray-900 leading-none">{filteredJobs.length}</span>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] block leading-tight italic">Matched<br />Nodes</span>
                            </div>
                            {(searchTerm || categoryFilter !== 'all' || locationFilter !== 'all' || typeFilter !== 'all' || dateFilter !== 'all') && (
                                <button
                                    onClick={() => {
                                        setSearchTerm(''); setCategoryFilter('all'); setLocationFilter('all'); setTypeFilter('all'); setDateFilter('all');
                                    }}
                                    className="group flex items-center gap-2 text-[10px] font-black text-red-500 uppercase tracking-[0.2em] hover:text-black transition-colors bg-red-50 px-6 py-2.5 rounded-xl border border-red-100"
                                >
                                    <LogOut className="w-4 h-4" /> Reset Filters
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[1, 2, 3, 4, 5, 6].map(n => (
                            <div key={n} className="h-[400px] bg-gray-50/50 rounded-[2.5rem] animate-pulse border border-gray-100"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filteredJobs.length > 0 ? filteredJobs.map((job) => (
                            <motion.div
                                key={job.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="group bg-white rounded-[2.5rem] border border-gray-100 p-10 flex flex-col shadow-[0_0_80px_rgba(0,0,0,0.01)] hover:shadow-[0_0_100px_rgba(0,0,0,0.06)] hover:border-brand-yellow/30 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-yellow/5 rounded-bl-[5rem] -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>

                                <div className="flex justify-between items-start mb-10 relative z-10">
                                    <div className="bg-gray-50 p-4 rounded-2xl group-hover:bg-brand-yellow/10 transition-colors duration-500">
                                        <Briefcase className="w-8 h-8 text-gray-400 group-hover:text-brand-yellow" />
                                    </div>
                                    <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] ${job.is_internal ? 'bg-brand-yellow/10 text-brand-yellow' : 'bg-gray-900 text-brand-yellow'}`}>
                                        {job.is_internal ? 'Internal' : 'External'}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-brand-yellow transition-colors leading-tight uppercase tracking-tight"> {job?.title || job?.requisition?.title}</h3>

                                {job?.tags && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {job.tags.split(',').map((tag, i) => (
                                            <span key={i} className="px-2 py-0.5 bg-gray-50 text-[8px] font-black text-gray-400 uppercase tracking-widest italic rounded-md border border-gray-100 group-hover:border-brand-yellow/30 transition-colors">
                                                #{tag.trim()}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <p className="text-[11px] text-gray-400 font-bold mb-10 line-clamp-3 uppercase tracking-[0.2em] leading-loose italic flex-grow">
                                    {job?.requisition?.description || 'Strategic role focused on organizational excellence and high-impact delivery within the Droga ecosystem.'}
                                </p>

                                <div className="flex flex-wrap items-center gap-6 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-10 pb-8 border-b border-gray-50">
                                    <div className="flex items-center gap-2.5"><MapPin className="w-4 h-4 text-brand-yellow" /> {job?.location || job?.requisition?.location || job?.requisition?.department}</div>
                                    <div className="flex items-center gap-2.5"><Clock className="w-4 h-4 text-brand-yellow" /> {job?.employment_type || (job.is_internal ? 'Internal' : 'Full-time')}</div>
                                </div>

                                <div className="flex gap-4 mt-auto">
                                    <Link
                                        to={`/jobs/${job.id}`}
                                        className="flex-1 flex justify-center items-center py-5 px-6 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 transition-all font-black text-[9px] uppercase tracking-[0.2em] border border-gray-100"
                                    >
                                        Inspect
                                    </Link>
                                    <Link
                                        to={`/jobs/${job.id}?apply=true`}
                                        className="flex-[2] flex justify-between items-center py-5 px-8 bg-gray-900 text-brand-yellow rounded-2xl group-hover:bg-black hover:scale-[1.02] transition-all font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-black/10"
                                    >
                                        Apply Now <ArrowRight className="w-5 h-5" />
                                    </Link>
                                </div>
                            </motion.div>
                        )) : (
                            <div className="col-span-full py-48 border border-dashed border-gray-200 rounded-[3rem] bg-gray-50/30 flex flex-col items-center">
                                <Search className="w-16 h-16 text-gray-200 mb-8" />
                                <span className="text-sm font-black text-gray-300 uppercase tracking-[0.4em] italic text-center">No nodes detected <br /> across the active grid.</span>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Premium Footer - Hidden for Admin */}
            {user?.role?.name !== 'admin' && (
                <footer className="bg-gray-900 text-white pt-20 pb-10 border-t border-gray-800 relative z-10 w-full font-['Outfit']">
                    {/* Top Gloss Effect */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-yellow/50 to-transparent"></div>

                    <div className="max-w-7xl mx-auto px-6 lg:px-12">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
                            {/* Brand Section */}
                            <div className="lg:col-span-4 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-900 font-black text-2xl shadow-[0_0_20px_rgba(255,255,255,0.1)]">D</div>
                                    <div className="flex flex-col">
                                        <span className="text-xl font-black tracking-tight uppercase leading-none">Droga Group</span>
                                        <span className="text-[9px] font-black text-brand-yellow uppercase tracking-[0.3em] leading-tight">Industrial Evolution</span>
                                    </div>
                                </div>
                                <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                                    Advancing the future of industry and pharmaceuticals through a synchronized ecosystem of innovation and excellence.
                                </p>
                                <div className="flex items-center gap-4 pt-2">
                                    {[Linkedin, Twitter, Facebook].map((Icon, i) => (
                                        <a key={i} href="#" className="w-10 h-10 bg-gray-800/50 rounded-xl flex items-center justify-center text-gray-400 hover:text-brand-yellow hover:bg-gray-800 transition-all border border-gray-700/50 group">
                                            <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Links Grid */}
                            <div className="lg:col-span-4 grid grid-cols-2 gap-8">
                                {sections.map((section, idx) => (
                                    <div key={idx} className="space-y-6">
                                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-brand-yellow">{section.title}</h4>
                                        <ul className="space-y-3">
                                            {section.links.map((link, lIdx) => (
                                                <li key={lIdx}>
                                                    <Link to={link.href} className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2 group">
                                                        <span className="w-1 h-1 bg-brand-yellow/30 rounded-full group-hover:w-2 transition-all"></span>
                                                        {link.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>

                            {/* Contact & Support */}
                            <div className="lg:col-span-4 space-y-6 bg-gray-800/30 p-8 rounded-3xl border border-gray-700/30 backdrop-blur-sm">
                                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-brand-yellow">Access Points</h4>
                                <div className="space-y-4">
                                    {contactInfo.map((info, i) => (
                                        <div key={i} className="flex items-start gap-4 text-gray-400">
                                            <info.icon className="w-5 h-5 text-brand-yellow shrink-0" />
                                            <span className="text-sm">{info.text}</span>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full py-4 bg-brand-yellow text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white transition-all active:scale-95 shadow-lg shadow-brand-yellow/10">
                                    System Authorization <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Bottom Bar */}
                        <div className="pt-8 border-t border-gray-800/50 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-2 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                                <Zap className="w-3 h-3 text-brand-yellow animate-pulse" />
                                <span>Core v2.4.0 • Node Cluster: active</span>
                            </div>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                                © {currentYear} Droga Group IT Node • All Rights Synchronized
                            </p>
                            <div className="flex items-center gap-6">
                                <a href="#" className="text-gray-500 hover:text-white text-[10px] font-bold uppercase transition-colors tracking-widest leading-none">Privacy_Layer</a>
                                <a href="#" className="text-gray-500 hover:text-white text-[10px] font-bold uppercase transition-colors tracking-widest leading-none">Security_Audit</a>
                            </div>
                        </div>
                    </div>
                </footer>
            )}

        </div>
    );
};

export default LandingPage;
