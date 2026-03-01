import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('satyam_user');
        if (stored) {
            setUser(JSON.parse(stored));
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        localStorage.setItem('satyam_user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('satyam_user');
        setUser(null);
    };

    const updateUser = (userData) => {
        const stored = localStorage.getItem('satyam_user');
        if (stored) {
            const current = JSON.parse(stored);
            const updated = { ...current, ...userData };
            localStorage.setItem('satyam_user', JSON.stringify(updated));
            setUser(updated);
        } else {
            setUser(userData);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
