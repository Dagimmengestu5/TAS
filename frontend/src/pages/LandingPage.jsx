import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Clock, Filter, Briefcase, ChevronRight, CheckCircle, Users, Mail, ArrowRight, Zap, Globe, Shield, Building2, X, Star, Cpu, Activity, LogOut, Linkedin, Twitter, Facebook, Phone, GraduationCap, Award, LayoutGrid } from 'lucide-react';
import api from '../api/api';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1
        }
    }
};

const LandingPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [tagFilter, setTagFilter] = useState('all');
    const [locationFilter, setLocationFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [educationFilter, setEducationFilter] = useState('all');
    const [experienceFilter, setExperienceFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const JOBS_PER_PAGE = 6;
    /* Removed JOB_CATEGORIES */

    const JOB_TYPES = ['all', 'Full-time', 'Part-time', 'Hybrid', 'Remote', 'Contract'];
    const DATE_OPTIONS = ['all', 'Today', 'Yesterday', 'Last Week', 'Last Month'];
    const EDUCATION_LEVELS = ['all', 'Tvet', 'Secondary School', 'Certificate', 'Diploma', 'Bachelors Degree', 'Phd', 'Masters Degree', 'Not Required'];
    const EXPERIENCE_LEVELS = ['all', 'Entry level', 'Junior', 'Intermediate', 'Senior', 'Expert'];

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

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, typeFilter, tagFilter, locationFilter, dateFilter, educationFilter, experienceFilter]);

    const filteredJobs = jobs.filter(job => {
        const req = job?.requisition || {};
        const createdAt = new Date(job?.created_at || new Date());
        const now = new Date();

        const matchesSearch = (req.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (req.department?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (req.category || '').toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = typeFilter === 'all' ||
            (job?.employment_type === typeFilter) ||
            (!job?.employment_type && typeFilter === 'Full-time' && !job?.is_internal);

        /* matchesCategory removed */

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

        const matchesEducation = educationFilter === 'all' || (job?.education_level && job.education_level.includes(educationFilter));
        const matchesExperience = experienceFilter === 'all' || (job?.experience_level && job.experience_level.includes(experienceFilter));

        return matchesSearch && matchesType && matchesLocation && matchesDate && matchesTag && matchesEducation && matchesExperience;
    }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
    const currentJobs = filteredJobs.slice((currentPage - 1) * JOBS_PER_PAGE, currentPage * JOBS_PER_PAGE);

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
                { name: "Droga Pharma", href: "https://drogapharma.com/" },
                { name: "Droga Pharmacy", href: "https://drogapharmacy.com/" },
                { name: "Droga Consulting", href: "https://drogaconsulting.com/" },
                { name: "Ema Ethiopia", href: "https://www.emaethiopia.com/" },
                { name: "Trust", href: "https://www.trustethiopharma.com/" },
                { name: "Droga Physiotherapy", href: "https://www.drogaphysiotherapy.com/" }
            ]
        }
    ];

    const contactInfo = [
        { icon: Mail, text: "info@drogapharma.com" },
        { icon: Phone, text: "+251 11 661 0733" },
        { icon: MapPin, text: "HQ Node, Addis Ababa, Ethiopia" }
    ];

    const currentYear = new Date().getFullYear();

    return (
        <div className="min-h-screen bg-white  text-gray-900 selection:bg-brand-yellow/30">
            {/* Navigation - Hidden for Admins to avoid redundancy with Sidebar */}
            {!hasPrivilegedAccess && (
                <motion.nav
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-50 px-8"
                >
                    <div className="max-w-[1600px] mx-auto h-24 flex items-center justify-between">
                        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                            <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-brand-yellow font-bold text-xl group-hover:scale-105 transition-transform">D</div>
                            <div className="flex flex-col">
                                <span className="text-lg font-bold tracking-tight text-gray-900 leading-none uppercase ">Droga Group Hub</span>
                                <span className="text-[8px] font-bold text-brand-yellow uppercase tracking-wider leading-tight mt-1">Talent Ecosystem</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            {user ? (
                                <Link to="/profile" className="flex items-center gap-4 bg-gray-50 px-6 py-2.5 rounded-2xl border border-gray-100 hover:border-brand-yellow transition-all shadow-sm group">
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-900">{(user?.name || 'User').split(' ')[0]}</span>
                                        <span className="text-[8px] font-bold text-gray-400 capitalize ">Access Granted</span>
                                    </div>
                                    <div className="w-10 h-10 bg-gray-900 text-brand-yellow rounded-xl flex items-center justify-center font-bold text-sm uppercase shadow-lg group-hover:scale-110 transition-transform">
                                        {(user?.name || 'U').charAt(0)}
                                    </div>
                                </Link>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <Link to="/login" className="text-[9px] font-bold text-gray-400 hover:text-gray-900 tracking-wider uppercase transition-colors px-4">Sign In</Link>
                                    <Link to="/register" className="bg-gray-900 text-brand-yellow px-8 py-3.5 rounded-xl font-bold text-[9px] uppercase tracking-wider hover:bg-black hover:scale-105 transition-all shadow-xl shadow-black/10">Join Now</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.nav>
            )}

            {/* Premium Hero Section */}
            <header className="relative pt-20 pb-16 px-6 overflow-hidden min-h-[70vh] flex items-center">
                {/* Background Image with Overlay */}
                <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="absolute inset-0 z-0"
                >
                    <img
                        src="file:///C:/Users/D/.gemini/antigravity/brain/312f6030-f033-456a-8423-10aeeb536397/landing_hero_modern_1772264981067.png"
                        alt="Hero background"
                        className="w-full h-full object-cover opacity-10"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/40 to-white"></div>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="max-w-7xl mx-auto relative z-10 w-full mt-12"
                >
                    <div className="flex flex-col items-center text-center">
                        <motion.div
                            variants={fadeInUp}
                            className="mb-6 flex items-center gap-2 bg-yellow-400/10 text-yellow-700 px-4 py-2 rounded-full border border-yellow-200"
                        >
                            <Zap className="w-3.5 h-3.5" />
                            <span className="text-[9px] font-bold uppercase tracking-wider">Build the Future With Us</span>
                        </motion.div>

                        <motion.h1
                            variants={fadeInUp}
                            className="text-5xl md:text-8xl font-bold  mb-8 leading-[0.9] text-gray-900 max-w-5xl uppercase "
                        >
                            Find Your Next <br />
                            <span className="relative inline-block text-brand-yellow ">
                                Chapter
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: '100%' }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.8, duration: 1 }}
                                    className="absolute bottom-4 left-0 h-4 bg-brand-yellow/10 -z-10"
                                />
                            </span> In Our Team.
                        </motion.h1>

                        <motion.p
                            variants={fadeInUp}
                            className="max-w-xl text-[10px] font-bold text-gray-400 mb-12 uppercase tracking-wider leading-relaxed "
                        >
                            Join a synchronized ecosystem of industrial excellence. <br /> Discover roles designed for high-impact innovation.
                        </motion.p>

                        <motion.div
                            variants={fadeInUp}
                            className="w-full max-w-4xl mb-24 relative group"
                        >
                            <div className="absolute inset-0 bg-brand-yellow/10 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10"></div>
                            <div className="bg-white border border-gray-100 p-2 rounded-2xl shadow-xl flex flex-col sm:flex-row gap-2 items-center hover:border-brand-yellow/30 transition-all duration-500">
                                <div className="flex-1 w-full relative">
                                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="SEARCH BY ROLE, DEPARTMENT OR SKILL..."
                                        className="w-full pl-16 pr-6 py-5 bg-transparent border-none focus:ring-0 text-xs font-bold text-gray-900 tracking-wider placeholder:text-gray-200 uppercase"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <button className="w-full sm:w-auto bg-gray-900 text-brand-yellow px-10 py-5 rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-black transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95 duration-200">
                                    EXPLORE <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>

                        {/* Professional Top-Bar Filters */}
                        <motion.div
                            variants={fadeInUp}
                            className="w-full max-w-6xl bg-white rounded-2xl border border-gray-50 shadow-sm p-8 flex flex-wrap items-center justify-center gap-8 md:gap-12"
                        >
                            <div className="flex flex-col items-start gap-2 min-w-[120px]">
                                <label className="flex items-center gap-2 text-[9px] font-bold text-gray-400 uppercase tracking-wider ">
                                    <Briefcase className="w-3.5 h-3.5 text-gray-400" /> Job Type
                                </label>
                                <select
                                    className="bg-transparent border-none p-0 text-[11px] font-bold text-gray-900 focus:ring-0 cursor-pointer transition-colors uppercase tracking-wider"
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                >
                                    <option value="all">Any Type</option>
                                    {JOB_TYPES.slice(1).map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                                </select>
                            </div>

                            <div className="w-px h-10 bg-gray-100 hidden md:block"></div>

                            <div className="flex flex-col items-start gap-2 min-w-[120px]">
                                <label className="flex items-center gap-2 text-[9px] font-bold text-gray-400 uppercase tracking-wider ">
                                    <Zap className="w-3.5 h-3.5 text-gray-400" /> Expertise
                                </label>
                                <select
                                    className="bg-transparent border-none p-0 text-[11px] font-bold text-gray-900 focus:ring-0 cursor-pointer transition-colors uppercase tracking-wider"
                                    value={tagFilter}
                                    onChange={(e) => setTagFilter(e.target.value)}
                                >
                                    {uniqueTags.map(t => <option key={t} value={t}>{t === 'all' ? 'All Skills' : t.toUpperCase()}</option>)}
                                </select>
                            </div>

                            <div className="w-px h-10 bg-gray-100 hidden md:block"></div>

                            <div className="flex flex-col items-start gap-2 min-w-[120px]">
                                <label className="flex items-center gap-2 text-[9px] font-bold text-gray-400 uppercase tracking-wider ">
                                    <GraduationCap className="w-3.5 h-3.5 text-gray-400" /> Education
                                </label>
                                <select
                                    className="bg-transparent border-none p-0 text-[11px] font-bold text-gray-900 focus:ring-0 cursor-pointer transition-colors uppercase tracking-wider"
                                    value={educationFilter}
                                    onChange={(e) => setEducationFilter(e.target.value)}
                                >
                                    {EDUCATION_LEVELS.map(l => <option key={l} value={l}>{l === 'all' ? 'Any level' : l.toUpperCase()}</option>)}
                                </select>
                            </div>

                            <div className="w-px h-10 bg-gray-100 hidden md:block"></div>

                            <div className="flex flex-col items-start gap-2 min-w-[120px]">
                                <label className="flex items-center gap-2 text-[9px] font-bold text-gray-400 uppercase tracking-wider ">
                                    <Award className="w-3.5 h-3.5 text-gray-400" /> Experience
                                </label>
                                <select
                                    className="bg-transparent border-none p-0 text-[11px] font-bold text-gray-900 focus:ring-0 cursor-pointer transition-colors uppercase tracking-wider"
                                    value={experienceFilter}
                                    onChange={(e) => setExperienceFilter(e.target.value)}
                                >
                                    {EXPERIENCE_LEVELS.map(l => <option key={l} value={l}>{l === 'all' ? 'Any level' : l.toUpperCase()}</option>)}
                                </select>
                            </div>

                            <div className="w-px h-10 bg-gray-100 hidden md:block"></div>

                            <div className="flex flex-col items-start gap-2 min-w-[120px]">
                                <label className="flex items-center gap-2 text-[9px] font-bold text-gray-400 uppercase tracking-wider ">
                                    <MapPin className="w-3.5 h-3.5 text-gray-400" /> Location
                                </label>
                                <select
                                    className="bg-transparent border-none p-0 text-[11px] font-bold text-gray-900 focus:ring-0 cursor-pointer transition-colors uppercase tracking-wider"
                                    value={locationFilter}
                                    onChange={(e) => setLocationFilter(e.target.value)}
                                >
                                    {uniqueLocations.map(l => <option key={l} value={l}>{l === 'all' ? 'Anywhere' : l.toUpperCase()}</option>)}
                                </select>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6"
                >
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-1.5 h-8 bg-brand-yellow"></div>
                            <h2 className="text-2xl font-bold tracking-tight uppercase  text-gray-900 ">Open Positions</h2>
                        </div>
                        <p className="text-gray-400 text-[9px] font-bold uppercase tracking-wider ml-4 ">Opportunities in our Ecosystem</p>
                    </div>
                    <div className="flex items-center gap-6 pb-2">
                        <div className="flex items-center justify-between mb-16">
                            <div className="flex items-center gap-3">
                                <span className="text-6xl font-bold text-gray-900 leading-none">{filteredJobs.length}</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block leading-tight ">Matched<br />Nodes</span>
                            </div>
                            {(searchTerm || tagFilter !== 'all' || locationFilter !== 'all' || typeFilter !== 'all' || dateFilter !== 'all' || educationFilter !== 'all' || experienceFilter !== 'all') && (
                                <button
                                    onClick={() => {
                                        setSearchTerm(''); setLocationFilter('all'); setTypeFilter('all'); setDateFilter('all'); setEducationFilter('all'); setExperienceFilter('all'); setTagFilter('all');
                                    }}
                                    className="group flex items-center gap-2 text-[10px] font-bold text-red-500 uppercase tracking-wider hover:text-black transition-colors bg-red-50 px-6 py-2.5 rounded-xl border border-red-100"
                                >
                                    <LogOut className="w-4 h-4" /> Reset Filters
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[1, 2, 3, 4, 5, 6].map(n => (
                            <div key={n} className="h-[400px] bg-gray-50/50 rounded-[2.5rem] animate-pulse border border-gray-100"></div>
                        ))}
                    </div>
                ) : (
                    <>
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={staggerContainer}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
                        >
                            {currentJobs.length > 0 ? currentJobs.map((job) => (
                                <motion.div
                                    key={job.id}
                                    layout
                                    variants={fadeInUp}
                                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                    className="group bg-white rounded-2xl border border-gray-100 p-8 flex flex-col shadow-sm hover:shadow-md hover:border-brand-yellow/30 transition-all duration-500 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-yellow/5 rounded-bl-[3rem] -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-700"></div>

                                    <div className="flex justify-between items-start mb-6 relative z-10">
                                        <div className="bg-gray-50 p-3 rounded-xl group-hover:bg-brand-yellow/10 transition-colors duration-500">
                                            <Briefcase className="w-6 h-6 text-gray-400 group-hover:text-brand-yellow" />
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-wider  ${job.is_internal ? 'bg-brand-yellow/10 text-brand-yellow' : 'bg-gray-900 text-brand-yellow'}`}>
                                            {job.is_internal ? 'Internal' : 'External'}
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-brand-yellow transition-colors leading-tight uppercase tracking-tight  "> {job?.title || job?.requisition?.title}</h3>

                                    {job?.tags && (
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {job.tags.split(',').map((tag, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-gray-50 text-[7px] font-bold text-gray-400 uppercase tracking-wider  rounded-md border border-gray-100 group-hover:border-brand-yellow/30 transition-colors">
                                                    #{tag.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <p className="text-[9.5px] text-gray-400 font-medium mb-8 line-clamp-3 uppercase tracking-wider leading-relaxed  flex-grow">
                                        {job?.requisition?.description || 'Build the future of organizational excellence in our growing ecosystem.'}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-4 text-gray-400 text-[8.5px] font-bold uppercase tracking-wider mb-4 pb-4 border-b border-gray-50 ">
                                        <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-brand-yellow" /> {job?.location || job?.requisition?.location || job?.requisition?.department?.name}</div>
                                        <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-brand-yellow" /> {job?.employment_type || (job.is_internal ? 'Internal' : 'Full-time')}</div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 text-gray-400 text-[8.5px] font-bold uppercase tracking-wider mb-8">
                                        {job?.education_level && <div className="flex items-center gap-2"><GraduationCap className="w-3.5 h-3.5 text-brand-yellow" /> {job.education_level}</div>}
                                        {job?.experience_level && <div className="flex items-center gap-2"><Award className="w-3.5 h-3.5 text-brand-yellow" /> {job.experience_level}</div>}
                                    </div>

                                    <div className="flex gap-3 mt-auto">
                                        <Link
                                            to={`/jobs/${job.id}`}
                                            className="flex-1 flex justify-center items-center py-3.5 px-6 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 transition-all font-bold text-[8px] uppercase tracking-wider border border-gray-100 "
                                        >
                                            Details
                                        </Link>
                                        <Link
                                            to={`/jobs/${job.id}?apply=true`}
                                            className="flex-[2] flex justify-between items-center py-3.5 px-6 bg-gray-900 text-brand-yellow rounded-xl group-hover:bg-black hover:scale-[1.02] transition-all font-bold text-[8.5px] uppercase tracking-wider shadow-lg shadow-black/10 "
                                        >
                                            Join Now <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </motion.div>
                            ))
                                : (
                                    <motion.div variants={fadeInUp} className="col-span-full py-48 border border-dashed border-gray-200 rounded-[3rem] bg-gray-50/30 flex flex-col items-center">
                                        <Search className="w-16 h-16 text-gray-200 mb-8" />
                                        <span className="text-sm font-bold text-gray-300 uppercase tracking-wider  text-center">No nodes detected <br /> across the active grid.</span>
                                    </motion.div>
                                )}
                        </motion.div>

                        {/* Premium Pagination */}
                        {totalPages > 1 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="mt-20 flex flex-col items-center gap-6"
                            >
                                <div className="flex items-center justify-center gap-4">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-900 hover:border-brand-yellow disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm group"
                                    >
                                        <ChevronRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                                    </button>

                                    <div className="flex items-center gap-2">
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i + 1}
                                                onClick={() => setCurrentPage(i + 1)}
                                                className={`w-12 h-12 rounded-2xl font-bold text-[10px] transition-all border ${currentPage === i + 1
                                                    ? 'bg-gray-900 text-brand-yellow border-gray-900 shadow-lg scale-110'
                                                    : 'bg-white text-gray-400 border-gray-100 hover:border-brand-yellow hover:text-gray-900 shadow-sm'
                                                    }`}
                                            >
                                                {String(i + 1).padStart(2, '0')}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-900 hover:border-brand-yellow disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm group"
                                    >
                                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                                <div className="flex items-center gap-3 bg-gray-50 px-6 py-2 rounded-full border border-gray-100 shadow-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow animate-pulse"></div>
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                        Page {currentPage} of {totalPages} • Grid view synchronized
                                    </span>
                                </div>
                            </motion.div>
                        )}
                    </>
                )}
            </main>

            {/* Premium Re-engineered Footer */}
            {user?.role?.name !== 'admin' && (
                <motion.footer
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="relative bg-[#0a0a0b] py-12 overflow-hidden border-t border-white/5"
                >
                    {/* Background Visual Engineering */}
                    <div className="absolute top-0 left-0 right-0 h-1 px-8 lg:px-24">
                        <div className="h-full bg-gradient-to-r from-transparent via-brand-yellow/40 to-transparent blur-[1px]"></div>
                    </div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-yellow/5 rounded-full blur-[120px] pointer-events-none"></div>

                    <div className="max-w-[1600px] mx-auto px-8 lg:px-24">
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">

                            {/* Brand Matrix */}
                            <motion.div variants={fadeInUp} className="xl:col-span-4 space-y-6">
                                <div className="flex items-center gap-5 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                                    <div className="w-12 h-12 bg-brand-yellow rounded-xl flex items-center justify-center text-black font-black text-xl shadow-[0_0_20px_rgba(255,242,0,0.15)] group-hover:scale-110 transition-transform duration-500">D</div>
                                    <div className="flex flex-col">
                                        <span className="text-xl font-black text-white uppercase tracking-tighter leading-none">Droga Group Hub</span>
                                        <span className="text-[9px] font-black text-brand-yellow uppercase tracking-[0.4em] leading-tight mt-1.5 opacity-80">Industrial Synergy</span>
                                    </div>
                                </div>

                                <p className="text-gray-500 text-[13px] font-medium leading-relaxed max-w-sm tracking-wide">
                                    Pioneering the next generation of industrial excellence through a synchronized global ecosystem.
                                </p>

                                <div className="flex items-center gap-3 pt-2">
                                    {[Linkedin, Twitter, Facebook].map((Icon, i) => (
                                        <motion.a
                                            key={i}
                                            href="#"
                                            whileHover={{ y: -3, borderColor: '#fff000' }}
                                            className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-500 hover:text-brand-yellow transition-all border border-white/5 backdrop-blur-sm group"
                                        >
                                            <Icon className="w-4 h-4 group-hover:drop-shadow-[0_0_8px_rgba(255,242,0,0.5)]" />
                                        </motion.a>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Navigation Clusters */}
                            <div className="xl:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <motion.div variants={fadeInUp} className="space-y-6">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-1 h-3.5 bg-brand-yellow"></div>
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">About Droga Group Hub</h4>
                                    </div>
                                    <p className="text-gray-400 text-[12px] font-medium leading-relaxed tracking-wide">
                                        We provide integrated, quality and innovative healthcare products and services that enhance health and well-being of every community we serve
                                    </p>

                                </motion.div>

                                {sections.map((section, idx) => (
                                    <motion.div key={idx} variants={fadeInUp} className="space-y-6">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-1 h-3.5 bg-brand-yellow"></div>
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">{section.title}</h4>
                                        </div>
                                        <ul className="space-y-3">
                                            {section.links.map((link, lIdx) => (
                                                <li key={lIdx}>
                                                    <a
                                                        href={link.href.startsWith('http') ? link.href : '#'}
                                                        target={link.href.startsWith('http') ? "_blank" : "_self"}
                                                        rel="noopener noreferrer"
                                                        className="text-gray-400 hover:text-brand-yellow text-[12px] font-semibold transition-all duration-300 flex items-center gap-2.5 group"
                                                    >
                                                        <span className="w-1 h-1 rounded-full bg-white/10 group-hover:bg-brand-yellow group-hover:scale-150 transition-all"></span>
                                                        {link.name}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Direct Access Hub */}
                            <motion.div variants={fadeInUp} className="xl:col-span-4 space-y-6">
                                <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5 backdrop-blur-xl relative group">
                                    <div className="absolute inset-0 bg-brand-yellow/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]"></div>
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-yellow mb-6 pb-3 border-b border-white/10">Access Points</h4>

                                    <div className="space-y-4">
                                        {contactInfo.map((info, i) => (
                                            <div key={i} className="flex items-center gap-4 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] hover:border-brand-yellow/20 transition-all group/info cursor-default shadow-sm">
                                                <div className="w-8 h-8 rounded-lg bg-brand-yellow/10 flex items-center justify-center group-hover/info:scale-110 transition-transform">
                                                    <info.icon className="w-4 h-4 text-brand-yellow group-hover/info:drop-shadow-[0_0_8px_rgba(255,242,0,0.5)]" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[11px] font-bold text-gray-300 group-hover/info:text-white transition-colors">{info.text}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <button className="w-full mt-6 py-4 bg-brand-yellow text-black rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-white hover:scale-[1.02] transition-all shadow-[0_10px_20px_rgba(255,242,0,0.1)] active:scale-95">
                                        System Portal <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        </div>

                        {/* Terminal Utility Bar */}
                        <motion.div variants={fadeInUp} className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex flex-col md:flex-row items-center gap-6 text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/5">
                                    <div className="w-1 h-1 rounded-full bg-brand-yellow animate-pulse"></div>
                                    <span>Core v3.2.0 • Online</span>
                                </div>
                                <p>© {currentYear} Droga Group Hub • All Assets Synchronized</p>
                            </div>

                            <div className="flex items-center gap-8">
                                <a href="#" className="text-gray-500 hover:text-white text-[9px] font-black uppercase tracking-widest transition-colors pb-1 border-b border-transparent hover:border-brand-yellow">Security</a>
                                <a href="#" className="text-gray-500 hover:text-white text-[9px] font-black uppercase tracking-widest transition-colors pb-1 border-b border-transparent hover:border-brand-yellow">Privacy</a>
                            </div>
                        </motion.div>
                    </div>
                </motion.footer>
            )}

        </div>
    );
};

export default LandingPage;
