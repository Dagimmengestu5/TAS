import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

const OAuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { logout } = useAuth(); // We'll just rely on a page reload effect

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            localStorage.setItem('token', token);
            // Verify backend recognizes token and reload state
            window.location.href = '/';
        } else {
            navigate('/login');
        }
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-gray-500">
                <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
                <p className="text-xs font-bold uppercase tracking-wider">Bridging Connection...</p>
            </div>
        </div>
    );
};

export default OAuthCallback;
