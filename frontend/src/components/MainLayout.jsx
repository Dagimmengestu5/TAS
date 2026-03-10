import React, { useState } from 'react';
import Sidebar from './Sidebar';
import NotificationDropdown from './NotificationDropdown';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, ChevronRight, User, Activity, Key, LogOut } from 'lucide-react';

const MainLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Check if user has privileged access. 
    const privilegedRoles = ['admin', 'ta_team', 'hiring_manager', 'hr_approver', 'ceo_approver'];
    const hasPrivilegedAccess = privilegedRoles.includes(user?.role?.name);

    const isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email', '/enter-otp', '/auth/callback'].includes(location.pathname);
    const isLandingPage = location.pathname === '/' || location.pathname === '/jobs';

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const navigate = useNavigate();

    return (
        <div className="flex h-screen bg-white transition-all duration-500 overflow-hidden text-gray-900 selection:bg-brand-yellow/30 font-sans">
            <style>
                {`
                    @keyframes menu-blink {
                        0%, 100% { background-color: #FFF200; color: #111827; }
                        50% { background-color: #111827; color: #FFF200; }
                    }
                    .animate-menu-blink {
                        animation: menu-blink 2s ease-in-out infinite;
                    }
                `}
            </style>
            {/* Mobile Header - Visible on landing if logged in, always on dashboard, hidden on auth pages */}
            {!isAuthPage && (hasPrivilegedAccess && (!isLandingPage || user)) && (
                <header className="lg:hidden fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-xl z-40 px-6 flex items-center justify-between border-b border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">D</div>
                        <div className="flex flex-col">
                            <span className="font-bold text-xs uppercase tracking-tight text-gray-900">Droga Group Hub</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mt-1">Management OS</span>
                        </div>
                    </div>
                    <button
                        onClick={toggleMobileMenu}
                        className="p-3 bg-gray-50 hover:bg-white rounded-xl transition-all text-gray-400 hover:text-gray-900 border border-gray-100 shadow-sm active:scale-95"
                    >
                        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </header>
            )}

            {/* Sidebar with props - Show if privileged (excluding auth pages on mobile) */}
            {!isAuthPage && hasPrivilegedAccess && (
                <Sidebar
                    isOpen={isSidebarOpen}
                    toggle={toggleSidebar}
                    isMobileOpen={isMobileMenuOpen}
                    closeMobile={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Backdrop for Mobile */}
            {!isAuthPage && hasPrivilegedAccess && isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[90] transition-all duration-500"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            <div className={`flex-1 flex flex-col min-w-0 max-w-full transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] relative ${hasPrivilegedAccess ? (isSidebarOpen ? 'lg:pl-[20rem]' : 'lg:pl-[5.5rem]') : ''
                } bg-white h-screen overflow-hidden`}>

                {/* Persistent Admin Header - Fixed at Top - Hidden on Landing/Jobs for administrators */}
                {hasPrivilegedAccess && !isLandingPage && (
                    <div className="hidden lg:flex items-center justify-between px-10 h-20 border-b border-gray-100 bg-white z-30 shadow-[0_2px_15px_rgba(0,0,0,0.01)] shrink-0 w-full">
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col">
                                <h1 className="text-xl font-bold text-gray-900 tracking-tight uppercase">
                                    {location.pathname === '/admin' ? 'Command Center' :
                                        location.pathname.includes('/pipeline') ? 'Talent Pipeline' :
                                            location.pathname.includes('/jobs') ? 'Node Matrix' :
                                                location.pathname.includes('/reports') ? 'Analytics Core' :
                                                    location.pathname.includes('/manager') ? 'Manager Hub' :
                                                        location.pathname.includes('/executive') ? 'Executive Layer' :
                                                            location.pathname.includes('/profile') ? 'System Identity' : 'Droga Group Hub'}
                                </h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-1.5 h-1.5 bg-brand-yellow rounded-full animate-pulse shadow-[0_0_8px_#FFF200]"></div>
                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Node Status: Active</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <NotificationDropdown />

                            {/* Global User Menu */}
                            <div className="relative group/globalmenu h-full flex items-center">
                                <Link to="/profile" className="flex items-center gap-4 hover:bg-gray-50 p-2 px-3 rounded-2xl transition-all duration-300">
                                    <div className="flex flex-col items-end">
                                        <span className="text-sm font-bold text-gray-900 leading-none mb-1">
                                            {user?.name}
                                        </span>
                                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{user?.role?.name}</span>
                                    </div>
                                    <div className="w-10 h-10 bg-gray-900 text-brand-yellow rounded-xl flex items-center justify-center font-bold text-sm uppercase shadow-lg border border-gray-800 relative transition-transform group-hover/globalmenu:scale-105">
                                        {user?.name?.charAt(0)}
                                    </div>
                                </Link>

                                {/* Dropdown Content */}
                                <div className="absolute top-[85%] right-0 w-64 bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-100 opacity-0 invisible translate-y-2 group-hover/globalmenu:opacity-100 group-hover/globalmenu:visible group-hover/globalmenu:translate-y-0 transition-all duration-300 overflow-hidden z-[100]">
                                    <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Authenticated Identity</p>
                                        <h4 className="text-sm font-black text-gray-900 uppercase truncate">{user?.name}</h4>
                                        <p className="text-[9px] font-bold text-gray-400 truncate">{user?.email}</p>
                                    </div>

                                    <div className="p-2">
                                        <Link
                                            to="/profile?tab=profile"
                                            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-black hover:text-white transition-all group/item"
                                        >
                                            <User className="w-4 h-4 group-hover/item:text-white transition-colors" />
                                            User Information
                                        </Link>

                                        <Link
                                            to="/profile?tab=applications"
                                            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest animate-menu-blink hover:shadow-xl transition-all group/item"
                                        >
                                            <Activity className="w-4 h-4 transition-colors" />
                                            Application
                                        </Link>

                                        <Link
                                            to="/profile?action=reset_password"
                                            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-black hover:text-white transition-all group/item"
                                        >
                                            <Key className="w-4 h-4 group-hover/item:text-white transition-colors" />
                                            Reset Password
                                        </Link>

                                        <div className="h-[1px] bg-gray-100 my-2 mx-4"></div>

                                        <button
                                            onClick={() => { navigate('/'); setTimeout(() => logout(), 0); }}
                                            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-red-500 hover:text-white transition-all"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Candidate Header - fixed nav bar for non-privileged users, hidden on landing page */}
                {!isAuthPage && !hasPrivilegedAccess && !isLandingPage && user && (
                    <div className="hidden lg:flex items-center justify-between px-10 h-16 border-b border-gray-100 bg-white z-30 shadow-[0_2px_15px_rgba(0,0,0,0.02)] shrink-0 w-full">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-900 rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-brand-yellow font-black text-sm">D</span>
                            </div>
                            <span className="font-black text-xs text-gray-900 uppercase tracking-tight">Droga Group Hub</span>
                        </Link>

                        <div className="relative group/candidatemenu flex items-center h-full">
                            <button className="flex items-center bg-gray-50 p-1.5 rounded-2xl border border-gray-100 hover:border-brand-yellow/60 transition-all shadow-sm group">
                                <div className="w-9 h-9 bg-gray-900 text-white rounded-xl flex items-center justify-center font-bold text-sm uppercase shadow-lg border border-gray-800 transition-transform group-hover/candidatemenu:scale-105">
                                    {user?.name?.charAt(0)}
                                </div>
                            </button>

                            {/* Candidate Dropdown */}
                            <div className="absolute top-[90%] right-0 w-60 bg-white rounded-[1.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-gray-100 opacity-0 invisible translate-y-2 group-hover/candidatemenu:opacity-100 group-hover/candidatemenu:visible group-hover/candidatemenu:translate-y-0 transition-all duration-300 overflow-hidden z-[100]">
                                <div className="p-5 bg-gray-50/50 border-b border-gray-100">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Signed in as</p>
                                    <h4 className="text-sm font-black text-gray-900 truncate">{user?.name}</h4>
                                    <p className="text-[9px] font-bold text-gray-400 truncate">{user?.email}</p>
                                </div>
                                <div className="p-2">
                                    <Link
                                        to="/profile?tab=profile"
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-bold text-gray-500 hover:bg-gray-900 hover:text-white transition-all group/item"
                                    >
                                        <User className="w-4 h-4" /> My Profile
                                    </Link>
                                    <Link
                                        to="/profile?tab=applications"
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-bold text-gray-500 hover:bg-gray-900 hover:text-white transition-all group/item"
                                    >
                                        <Activity className="w-4 h-4" /> My Applications
                                    </Link>
                                    <Link
                                        to="/profile?action=reset_password"
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-bold text-gray-500 hover:bg-gray-900 hover:text-white transition-all group/item"
                                    >
                                        <Key className="w-4 h-4" /> Reset Password
                                    </Link>
                                    <div className="h-px bg-gray-100 my-1 mx-3"></div>
                                    <button
                                        onClick={() => { navigate('/'); setTimeout(() => logout(), 0); }}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-bold text-red-400 hover:bg-red-500 hover:text-white transition-all"
                                    >
                                        <LogOut className="w-4 h-4" /> Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Sub-Header Area - Content Page Managed Scroll */}
                <div className={`flex-1 min-h-0 ${hasPrivilegedAccess ? 'pt-20 lg:pt-0' : ''} overflow-y-auto overflow-x-hidden custom-scrollbar flex flex-col`}>
                    <div className="flex-1">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
