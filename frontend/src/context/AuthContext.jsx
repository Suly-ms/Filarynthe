import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            // Decoding JWT purely on client side for UX, full validation happens backend
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                const decodedToken = JSON.parse(jsonPayload);

                // Check if expired
                if (decodedToken.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    setUser({ id: decodedToken.id, username: decodedToken.username });
                }
            } catch (error) {
                logout();
            }
        }
        setLoading(false);
    }, [token]);

    const loginAction = (userData, jwtToken) => {
        setToken(jwtToken);
        setUser(userData);
        localStorage.setItem('token', jwtToken);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, loginAction, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
