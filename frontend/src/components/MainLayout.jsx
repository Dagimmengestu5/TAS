import React, { useState } from 'react';
import Sidebar from './Sidebar';
import NotificationDropdown from './NotificationDropdown';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, ChevronRight } from 'lucide-react';

const MainLayout = ({ children }) => {
    const { user } = useAuth();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Check if user has privileged access. 
    const privilegedRoles = ['admin', 'ta_team', 'hiring_manager', 'hr_approver', 'ceo_approver'];
    const hasPrivilegedAccess = privilegedRoles.includes(user?.role?.name);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <div className="flex h-screen bg-white transition-all duration-500 overflow-hidden text-gray-900 selection:bg-brand-yellow/30 font-['Outfit']">
            {/* Mobile Header - Hidden on Landing Page/Jobs for privileged users */}
            {hasPrivilegedAccess && !(location.pathname === '/' || location.pathname === '/jobs') && (
                <header className="lg:hidden fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-xl z-40 px-6 flex items-center justify-between border-b border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-brand-yellow font-black shadow-lg">D</div>
                        <div className="flex flex-col">
                            <span className="font-black text-xs uppercase tracking-tight text-gray-900">Droga Hub</span>
                            <span className="text-[8px] font-black text-brand-yellow uppercase tracking-[0.3em] leading-none mt-1">Management OS</span>
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

            {/* Sidebar with props - Only for privileged */}
            {hasPrivilegedAccess && (
                <Sidebar
                    isOpen={isSidebarOpen}
                    toggle={toggleSidebar}
                    isMobileOpen={isMobileMenuOpen}
                    closeMobile={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Backdrop for Mobile */}
            {hasPrivilegedAccess && isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[90] transition-all duration-500"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            <div className={`flex-1 flex flex-col min-w-0 max-w-full transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] relative ${hasPrivilegedAccess ? (isSidebarOpen ? 'lg:pl-[20rem]' : 'lg:pl-[5.5rem]') : ''
                } bg-white h-screen overflow-hidden`}>

                {/* Persistent Admin Header - Fixed at Top - Hidden on Landing/Jobs for administrators */}
                {hasPrivilegedAccess && !(location.pathname === '/' || location.pathname === '/jobs') && (
                    <div className="hidden lg:flex items-center justify-between px-10 h-20 border-b border-gray-100 bg-white z-30 shadow-[0_2px_15px_rgba(0,0,0,0.01)] shrink-0 w-full">
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col">
                                <h1 className="text-lg font-black text-gray-900 tracking-tight uppercase">
                                    {location.pathname === '/admin' ? 'Command Center' :
                                        location.pathname.includes('/pipeline') ? 'Talent Pipeline' :
                                            location.pathname.includes('/jobs') ? 'Node Matrix' :
                                                location.pathname.includes('/reports') ? 'Analytics Core' :
                                                    location.pathname.includes('/manager') ? 'Manager Hub' :
                                                        location.pathname.includes('/executive') ? 'Executive Layer' :
                                                            location.pathname.includes('/profile') ? 'System Identity' : 'Management OS'}
                                </h1>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <div className="w-1.5 h-1.5 bg-brand-yellow rounded-full animate-pulse shadow-[0_0_8px_#FFF200]"></div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Node Status: Active</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <NotificationDropdown />
                            <Link to="/profile" className="flex items-center gap-4 hover:bg-gray-50 p-2 px-3 rounded-2xl transition-all duration-300 group">
                                <div className="flex flex-col items-end">
                                    <span className="text-[12px] font-black text-gray-900 leading-none mb-1">
                                        {user?.name}
                                    </span>
                                    <span className="text-[9px] font-black text-brand-yellow uppercase tracking-widest italic">{user?.role?.name}</span>
                                </div>
                                <div className="w-10 h-10 bg-gray-900 text-brand-yellow rounded-xl flex items-center justify-center font-black text-xs uppercase shadow-lg border border-gray-800 relative transition-transform group-hover:scale-105">
                                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-brand-yellow rounded-full border-2 border-white shadow-sm"></div>
                                    {user?.name?.charAt(0)}
                                </div>
                            </Link>
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
