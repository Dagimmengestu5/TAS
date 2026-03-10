import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import api from '../api/api';

const OAuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleAuth = async () => {
            const token = searchParams.get('token');
            console.log("OAuth Callback: Received token", token ? "YES (Length: " + token.length + ")" : "NO");
            console.log("OAuth Callback: API Base URL is", import.meta.env.VITE_API_URL);

            if (!token) {
                console.warn("OAuth Callback: No token found, redirecting to login");
                navigate('/login');
                return;
            }

            try {
                // 1. Store the token
                localStorage.setItem('token', token);
                console.log("OAuth Callback: Token saved to localStorage");

                // 2. Fetch User Profile
                console.log("OAuth Callback: Fetching user profile...");
                const response = await api.get('/me');
                const user = response.data;
                console.log("OAuth Callback: User profile fetched", user);

                // 3. Simple Role-Based Redirect
                const role = user.role?.name;
                console.log("OAuth Callback: User role is", role);

                let targetPath = '/profile';
                if (role === 'admin') {
                    targetPath = '/admin/users';
                } else if (['hr_approver', 'admin'].includes(role)) {
                    targetPath = '/hr/approvals';
                } else if (role === 'ceo_approver') {
                    targetPath = '/ceo/approvals';
                } else if (['ta_team', 'admin'].includes(role)) {
                    targetPath = '/ta/dashboard';
                } else if (role === 'hiring_manager') {
                    targetPath = '/manager/request';
                }

                console.log("OAuth Callback: Redirecting to", targetPath);
                window.location.href = targetPath;
            } catch (err) {
                console.error("Auth Callback Critical Error:", err);
                setError(err.response?.data?.message || err.message || "Failed to verify session.");
                localStorage.removeItem('token');
            }
        };

        handleAuth();
    }, [searchParams, navigate]);

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-4">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Sign-in Failed</h2>
                    <p className="text-gray-500 text-sm leading-relaxed">{error}</p>
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={() => window.location.href = '/'}
                            className="w-full bg-yellow-500 text-black py-3 rounded-xl font-bold text-sm hover:bg-yellow-400 transition-all font-sans"
                        >
                            Force go to Home
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full bg-gray-100 text-gray-900 py-3 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all"
                        >
                            Try manual login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="flex flex-col items-center gap-6">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-yellow-100 border-t-yellow-500 rounded-full animate-spin" />
                    <Loader2 className="w-8 h-8 text-yellow-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <div className="text-center space-y-1">
                    <h3 className="text-lg font-bold text-gray-900">Synchronizing Session</h3>
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-[0.2em]">Please wait a moment...</p>
                </div>
            </div>
        </div>
    );
};

export default OAuthCallback;
