import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Users, Briefcase, PieChart,
    ChevronRight, LogOut, Zap, ShieldCheck, Menu, ChevronLeft, X, Globe, Settings, EyeOff, Eye, ShieldAlert,
    FilePlus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, toggle, isMobileOpen, closeMobile }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        navigate('/');
        await logout();
    };

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const menuItems = [
        { icon: <Zap className="w-4 h-4" />, label: 'Hiring Request', path: '/manager/request', roles: ['hiring_manager', 'admin', 'hr_approver', 'ceo_approver'] },
        { icon: <ShieldCheck className="w-4 h-4" />, label: 'HR Approvals', path: '/hr/approvals', roles: ['hr_approver', 'admin', 'ceo_approver'] },
        { icon: <LayoutDashboard className="w-4 h-4" />, label: 'CEO Dashboard', path: '/ceo/approvals', roles: ['ceo_approver', 'admin'] },
        { icon: <Briefcase className="w-4 h-4" />, label: 'TA Control', path: '/ta/dashboard', roles: ['ta_team', 'admin', 'hr_approver', 'ceo_approver'] },
        { icon: <FilePlus className="w-4 h-4" />, label: 'Initialize Job', path: '/ta/jobs/create', roles: ['ta_team', 'admin'] },
        { icon: <Globe className="w-4 h-4" />, label: 'Opportunity Hub', path: '/jobs', roles: ['candidate', 'admin', 'hiring_manager', 'ta_team', 'hr_approver', 'ceo_approver'] },
        {
            icon: <Settings className="w-4 h-4" />,
            label: 'Settings',
            path: '#',
            roles: ['admin'],
            isDropdown: true,
            subItems: [
                { label: 'Manage Users', path: '/admin/users' },
                { label: 'Manage Companies', path: '/admin/companies' },
                { label: 'Manage Departments', path: '/admin/departments' },
            ]
        }
    ];

    const filteredItems = menuItems.filter(item => item.roles.includes(user?.role?.name));

    const sidebarVariants = {
        open: { width: '20rem' },
        closed: { width: '5.5rem' }
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full overflow-hidden bg-white bg-gradient-to-b from-white via-white to-gray-50/20 relative font-['Outfit']">
            {/* Vertical Line */}
            <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-gray-100/60 shadow-[1px_0_10px_rgba(0,0,0,0.01)]"></div>

            {/* Header Section (Logo + Toggle) */}
            <div className={`p-6 mb-6 transition-all duration-500 ${isOpen || isMobileOpen ? 'px-6' : 'px-4'}`}>
                <div className="flex items-center justify-between">
                    <div
                        className="flex items-center gap-4 cursor-pointer group"
                        onClick={() => { navigate('/'); closeMobile(); }}
                    >
                        <AnimatePresence mode="wait">
                            {(isOpen || isMobileOpen) && (
                                <motion.div
                                    key="logo-group"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="flex items-center gap-4"
                                >
                                    <div className="min-w-[2.25rem] h-9 bg-gray-900 rounded-xl flex items-center justify-center text-brand-yellow font-black shadow-lg transition-transform group-hover:scale-105">
                                        <Zap className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-black text-[13px] tracking-tight uppercase text-gray-900 leading-none">Droga Hub</span>
                                        <span className="text-[8px] font-black text-brand-yellow uppercase tracking-[0.4em] mt-1.5 italic">Ecosystem OS</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Integrated Desktop Toggle */}
                    {!isMobileOpen && (
                        <button
                            onClick={toggle}
                            className={`p-2 bg-gray-900 rounded-lg text-brand-yellow hover:scale-105 active:scale-95 transition-all shadow-lg border border-gray-800 ${!isOpen ? 'absolute top-6 left-1/2 -translate-x-1/2' : ''
                                }`}
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={isOpen ? 'close' : 'open'}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                                </motion.div>
                            </AnimatePresence>
                        </button>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-2 overflow-y-auto custom-scrollbar">
                {filteredItems.map((item, i) => {
                    const isActive = location.pathname === item.path;
                    const isSubItemActive = item.subItems?.some(si => location.pathname === si.path);

                    if (item.isDropdown) {
                        return (
                            <div key={i} className="space-y-1">
                                <button
                                    onClick={() => (isOpen || isMobileOpen) && setIsSettingsOpen(!isSettingsOpen)}
                                    className={`w-full flex items-center group relative overflow-hidden transition-all duration-300 ${isSubItemActive && !isSettingsOpen
                                        ? 'bg-gray-900 text-brand-yellow rounded-xl shadow-md'
                                        : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl'
                                        } ${isOpen || isMobileOpen ? 'px-5 py-4' : 'justify-center py-4 px-0 mx-auto w-10'}`}
                                >
                                    <div className="flex items-center gap-5">
                                        <div className={`${isSubItemActive ? 'text-brand-yellow' : 'group-hover:text-brand-yellow'} transition-all`}>
                                            {item.icon}
                                        </div>
                                        <AnimatePresence>
                                            {(isOpen || isMobileOpen) && (
                                                <motion.span
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -10 }}
                                                    className="uppercase tracking-[0.2em] text-[9px] font-black whitespace-nowrap italic"
                                                >
                                                    {item.label}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    {(isOpen || isMobileOpen) && (
                                        <motion.div
                                            animate={{ rotate: isSettingsOpen ? 90 : 0 }}
                                            className="absolute right-5"
                                        >
                                            <ChevronRight className="w-3 h-3" />
                                        </motion.div>
                                    )}
                                </button>

                                <AnimatePresence>
                                    {isSettingsOpen && (isOpen || isMobileOpen) && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden bg-gray-50/50 rounded-xl mx-2"
                                        >
                                            <div className="py-2 space-y-1">
                                                {item.subItems.map((sub, si) => {
                                                    const subActive = location.pathname === sub.path;
                                                    return (
                                                        <Link
                                                            to={sub.path}
                                                            key={si}
                                                            onClick={closeMobile}
                                                            className={`flex items-center gap-3 px-10 py-3 text-[9px] font-black uppercase tracking-widest transition-all ${subActive
                                                                ? 'text-brand-yellow bg-gray-900 rounded-lg mx-2'
                                                                : 'text-gray-500 hover:text-gray-900'
                                                                }`}
                                                        >
                                                            <div className={`w-1 h-1 rounded-full ${subActive ? 'bg-brand-yellow' : 'bg-gray-300'}`}></div>
                                                            {sub.label}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    }

                    return (
                        <Link
                            to={item.path}
                            key={i}
                            onClick={closeMobile}
                            className={`flex items-center group relative overflow-hidden transition-all duration-300 ${isActive
                                ? 'bg-gray-900 text-brand-yellow rounded-xl shadow-md'
                                : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl'
                                } ${isOpen || isMobileOpen ? 'px-5 py-4' : 'justify-center py-4 px-0 mx-auto w-10'}`}
                        >
                            <div className="flex items-center gap-5">
                                <div className={`${isActive ? 'scale-105' : 'group-hover:scale-105 group-hover:text-brand-yellow'} transition-all`}>
                                    {item.icon}
                                </div>
                                <AnimatePresence>
                                    {(isOpen || isMobileOpen) && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            className="uppercase tracking-[0.2em] text-[9px] font-black whitespace-nowrap italic"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </div>

                            {(isOpen || isMobileOpen) && isActive && (
                                <motion.div layoutId="activeInd" className="absolute right-5">
                                    <div className="w-1 h-1 bg-brand-yellow rounded-full shadow-[0_0_8px_#FFF200]" />
                                </motion.div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile / Logout */}
            <div className="p-4 mt-auto">
                <div className={`bg-gray-50 rounded-2xl border border-gray-100 transition-all duration-500 overflow-hidden relative group/profile ${isOpen || isMobileOpen ? 'p-5' : 'p-2.5 flex flex-col items-center'
                    }`}>
                    <div className="absolute top-0 left-0 w-full h-[1.5px] bg-brand-yellow/20 group-hover/profile:bg-brand-yellow/50 transition-colors"></div>

                    <AnimatePresence mode="wait">
                        {(isOpen || isMobileOpen) ? (
                            <motion.div
                                key="full"
                                initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                                className="space-y-5"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-brand-yellow font-black text-sm shadow-md border border-gray-800">
                                        {user?.name?.charAt(0)}
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                        <p className="font-black text-[10px] uppercase truncate text-gray-900 leading-none mb-1">{user?.name}</p>
                                        <p className="text-[8px] font-black text-brand-yellow uppercase tracking-[0.2em] truncate italic">{user?.role?.name}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-3 py-3 bg-white border border-gray-200 rounded-xl text-[9px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all shadow-sm group"
                                >
                                    <LogOut className="w-3.5 h-3.5 group-hover:scale-105" /> Sign Out
                                </button>
                            </motion.div>
                        ) : (
                            <motion.button
                                key="mini"
                                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                                onClick={handleLogout}
                                className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-xl text-red-500 hover:bg-red-50 transition-all shadow-sm"
                            >
                                <LogOut className="w-4 h-4" />
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <motion.aside
                initial={false}
                animate={isOpen ? 'open' : 'closed'}
                variants={sidebarVariants}
                transition={{ type: 'spring', damping: 30, stiffness: 250 }}
                className="hidden lg:flex flex-col bg-white fixed inset-y-0 z-50 overflow-visible shadow-[0_0_40px_rgba(0,0,0,0.02)]"
            >
                <SidebarContent />
            </motion.aside>

            <AnimatePresence>
                {isMobileOpen && (
                    <motion.aside
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 250 }}
                        className="lg:hidden flex flex-col bg-white fixed inset-y-0 left-0 w-72 shadow-[0_0_80px_rgba(0,0,0,0.15)] z-[100]"
                    >
                        <SidebarContent />
                    </motion.aside>
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;
