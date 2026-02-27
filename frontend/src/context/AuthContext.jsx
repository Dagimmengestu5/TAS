import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const response = await api.get('/me');
                setUser(response.data);
            } catch (error) {
                localStorage.removeItem('token');
                setUser(null);
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (credentials) => {
        const response = await api.post('/login', credentials);
        localStorage.setItem('token', response.data.access_token);
        setUser(response.data.user);
        return response.data;
    };

    const register = async (data) => {
        const response = await api.post('/register', data);
        localStorage.setItem('token', response.data.access_token);
        setUser(response.data.user);
        return response.data;
    };

    const logout = async () => {
        // Clear state immediately for responsiveness
        setUser(null);
        localStorage.removeItem('token');

        try {
            await api.post('/logout');
        } catch (error) {
            console.warn('Backend logout synchronization failed, but local session cleared.');
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
