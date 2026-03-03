import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar, Search, Filter, Briefcase, User, Clock,
    Download, ChevronLeft, ChevronRight, Activity,
    Target, CheckCircle, ShieldCheck, Zap
} from 'lucide-react';
import api from '../api/api';
import * as XLSX from 'xlsx';

const TAReport = () => {
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [jobTitles, setJobTitles] = useState([]);
    const [filters, setFilters] = useState({
        job_title: 'all',
        start_date: '',
        end_date: ''
    });

    const fetchReport = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams();
            if (filters.job_title !== 'all') queryParams.append('job_title', filters.job_title);
            if (filters.start_date) queryParams.append('start_date', filters.start_date);
            if (filters.end_date) queryParams.append('end_date', filters.end_date);

            const response = await api.get(`/reports/ta-report?${queryParams.toString()}`);
            setReportData(response.data);

            // Extract unique job titles for filter if not already set
            if (jobTitles.length === 0) {
                const titles = [...new Set(response.data.map(item => item.job_title))].filter(Boolean);
                setJobTitles(titles);
            }
        } catch (err) {
            console.error('Failed to fetch report:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, []);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };



    const formatDate = (dateString) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const exportToExcel = () => {
        const exportData = reportData.map(item => ({
            'Job Title': item.job_title,
            'Hiring Manager': item.hiring_manager,
            'Total Submitted': item.total_submitted,
            'Final Hired': item.final_hired || 'None',
            'CEO Auth Date': formatDate(item.ceo_approval_date),
            'Posted Date': formatDate(item.posted_date),
            'Avg Time to Hire (Days)': item.avg_tth !== null ? item.avg_tth : 'N/A',
            'Status': item.status?.replace('_', ' ').toUpperCase()
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        // Add auto-filter
        if (!ws['!autofilter'] && exportData.length > 0) {
            ws['!autofilter'] = { ref: XLSX.utils.encode_range(XLSX.utils.decode_range(ws['!ref'])) };
        }

        // Auto-sizing columns roughly based on content
        const wscols = Object.keys(exportData[0] || {}).map(key => ({ wch: Math.max(key.length, 15) }));
        ws['!cols'] = wscols;

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Recruitment Report');
        XLSX.writeFile(wb, `TA_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    return (
        <div className="bg-white min-h-screen w-full max-w-full px-6 py-8 lg:px-10  flex flex-col selection:bg-brand-yellow/30">
            {/* Header */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-8 bg-brand-yellow rounded-full shadow-[0_0_15px_#FFF200]"></div>
                    <h1 className="text-3xl font-bold uppercase   text-gray-900">Recruitment Analytics</h1>
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ">Comprehensive Lifecycle Tracking Report</p>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10 bg-gray-50 p-6 rounded-[2.5rem] border border-gray-100 shadow-inner">
                <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400 ml-4 ">Filter by Position</label>
                    <div className="relative group">
                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-hover:text-brand-yellow transition-colors" />
                        <select
                            name="job_title"
                            value={filters.job_title}
                            onChange={handleFilterChange}
                            className="w-full bg-white border border-gray-100 rounded-2xl pl-12 pr-4 py-3.5 text-[11px] font-bold uppercase tracking-tight focus:outline-none focus:ring-4 focus:ring-brand-yellow/5 focus:border-brand-yellow transition-all appearance-none "
                        >
                            <option value="all">Global (All Positions)</option>
                            {jobTitles.map(title => (
                                <option key={title} value={title}>{title}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400 ml-4 ">Submission Start</label>
                    <div className="relative group">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-hover:text-brand-yellow transition-colors" />
                        <input
                            type="date"
                            name="start_date"
                            value={filters.start_date}
                            onChange={handleFilterChange}
                            className="w-full bg-white border border-gray-100 rounded-2xl pl-12 pr-4 py-3.5 text-[11px] font-bold uppercase tracking-tight focus:outline-none focus:ring-4 focus:ring-brand-yellow/5 focus:border-brand-yellow transition-all "
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400 ml-4 ">Submission End</label>
                    <div className="relative group">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-hover:text-brand-yellow transition-colors" />
                        <input
                            type="date"
                            name="end_date"
                            value={filters.end_date}
                            onChange={handleFilterChange}
                            className="w-full bg-white border border-gray-100 rounded-2xl pl-12 pr-4 py-3.5 text-[11px] font-bold uppercase tracking-tight focus:outline-none focus:ring-4 focus:ring-brand-yellow/5 focus:border-brand-yellow transition-all "
                        />
                    </div>
                </div>

                <div className="flex items-end">
                    <button
                        onClick={fetchReport}
                        className="w-full bg-gray-900 text-brand-yellow py-4 rounded-2xl font-bold text-[10px] uppercase tracking-wider  hover:bg-black transition-all shadow-[0_15px_30px_-10px_rgba(0,0,0,0.3)] flex items-center justify-center gap-3 active:scale-95"
                    >
                        <Search className="w-4 h-4" /> Run Analytics
                    </button>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 min-h-0 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col mb-10">
                <div className="overflow-x-auto h-full pipeline-horizontal-scroll">
                    <style>
                        {`
                            .pipeline-horizontal-scroll::-webkit-scrollbar { height: 10px; }
                            .pipeline-horizontal-scroll::-webkit-scrollbar-track { background: #F9FAFB; margin: 0 20px; }
                            .pipeline-horizontal-scroll::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 6px; border: 2px solid #F9FAFB; }
                            .pipeline-horizontal-scroll::-webkit-scrollbar-thumb:hover { background: #FFF200; }
                        `}
                    </style>
                    <table className="w-full text-left border-collapse min-w-[1200px]">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-wider text-gray-400  border-b border-gray-100">Job Title</th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-wider text-gray-400  border-b border-gray-100">Hiring Manager</th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-wider text-gray-400  border-b border-gray-100">Total Submitted</th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-wider text-gray-400  border-b border-gray-100">Final Hired</th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-wider text-gray-400  border-b border-gray-100">CEO Auth</th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-wider text-gray-400  border-b border-gray-100">Posted Phase</th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-wider text-gray-400  border-b border-gray-100 text-center">Avg TTH</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-8 py-32 text-center text-[10px] font-bold text-gray-300 uppercase tracking-wider ">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-10 h-10 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin"></div>
                                            Accessing Data Node...
                                        </div>
                                    </td>
                                </tr>
                            ) : reportData.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-8 py-32 text-center text-[10px] font-bold text-gray-300 uppercase tracking-wider ">
                                        No recruitment data matching current criteria.
                                    </td>
                                </tr>
                            ) : reportData.map((item, idx) => (
                                <motion.tr
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={item.id}
                                    className="hover:bg-gray-50/50 transition-colors group border-b border-gray-50 last:border-0"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-[13px] font-bold text-gray-900 uppercase  tracking-tight mb-1">{item.job_title}</span>
                                            <span className={`text-[8px] font-bold uppercase tracking-wider  px-2 py-0.5 rounded w-fit ${['approved', 'posted', 'closed'].includes(item.status) ? 'bg-brand-yellow/10 text-brand-yellow' : 'bg-gray-100 text-gray-500'}`}>
                                                {item.status?.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-[12px] font-bold text-gray-700 uppercase  tracking-tight">
                                        {item.hiring_manager}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-900 font-bold text-[12px] shadow-inner border border-gray-200">
                                            {item.total_submitted}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        {item.final_hired ? (
                                            <div className="flex items-center gap-2">
                                                <Target className="w-3.5 h-3.5 text-purple-500" />
                                                <span className="text-[11px] font-bold text-gray-900 uppercase ">{item.final_hired}</span>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] font-bold text-gray-300  uppercase">None</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 group/date">
                                            <ShieldCheck className="w-3.5 h-3.5 text-green-500 opacity-20 group-hover/date:opacity-100 transition-opacity" />
                                            <span className="text-[11px] font-bold text-gray-900 ">{formatDate(item.ceo_approval_date)}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 group/date">
                                            <Zap className="w-3.5 h-3.5 text-brand-yellow opacity-20 group-hover/date:opacity-100 transition-opacity" />
                                            <span className="text-[11px] font-bold text-gray-900 ">{formatDate(item.posted_date)}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className={`inline-block px-4 py-2 rounded-xl text-[10px] font-bold uppercase  tracking-wider ${item.avg_tth !== null ? 'bg-gray-900 text-brand-yellow shadow-lg' : 'bg-gray-50 text-gray-300 border border-gray-100'}`}>
                                            {item.avg_tth !== null ? `${item.avg_tth} Days` : '—'}
                                        </span>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer Metrics */}
                {!loading && reportData.length > 0 && (
                    <div className="bg-gray-900 p-8 flex flex-wrap gap-10 items-center justify-between">
                        <div className="flex gap-10">
                            <div>
                                <p className="text-[8px] font-bold text-white/30 uppercase tracking-wider  mb-2">Total Positions</p>
                                <p className="text-3xl font-bold text-brand-yellow  leading-none">{reportData.length}</p>
                            </div>
                            <div>
                                <p className="text-[8px] font-bold text-white/30 uppercase tracking-wider  mb-2">Total Submittals</p>
                                <p className="text-3xl font-bold text-brand-yellow  leading-none">
                                    {reportData.reduce((acc, curr) => acc + (curr.total_submitted || 0), 0)}
                                </p>
                            </div>
                            <div>
                                <p className="text-[8px] font-bold text-white/30 uppercase tracking-wider  mb-2">Avg. Days to Hire</p>
                                <p className="text-3xl font-bold text-brand-yellow  leading-none">
                                    {(() => {
                                        const hired = reportData.filter(i => i.avg_tth !== null);
                                        if (hired.length === 0) return '—';
                                        const sum = hired.reduce((acc, i) => acc + i.avg_tth, 0);
                                        return Math.ceil(sum / hired.length);
                                    })()}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={exportToExcel}
                            className="bg-brand-yellow text-black px-8 py-3 rounded-xl font-bold text-[10px] uppercase tracking-wider  hover:scale-105 transition-all shadow-xl flex items-center gap-2"
                        >
                            <Download className="w-3.5 h-3.5" /> Export to System Log (.xlsx)
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TAReport;
