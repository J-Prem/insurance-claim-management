import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { saveToken, getToken, removeToken, decodeToken, isTokenExpired } from '../utils/jwtUtils';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const logout = useCallback(() => {
        removeToken();
        setUser(null);
    }, []);

    // Restore session on mount
    useEffect(() => {
        const token = getToken();
        if (token && !isTokenExpired()) {
            const decoded = decodeToken();
            setUser({
                token,
                role: decoded?.role || decoded?.roles?.[0] || null,
                username: decoded?.sub || decoded?.username || 'User',
            });
        } else if (token) {
            // Token exists but expired
            removeToken();
        }
        setLoading(false);
    }, []);

    // Auto-logout timer
    useEffect(() => {
        if (!user) return;
        const decoded = decodeToken();
        if (!decoded?.exp) return;
        const msUntilExpiry = decoded.exp * 1000 - Date.now();
        if (msUntilExpiry <= 0) {
            logout();
            return;
        }
        const timer = setTimeout(() => {
            logout();
            window.location.href = '/login';
        }, msUntilExpiry);
        return () => clearTimeout(timer);
    }, [user, logout]);

    const login = (token) => {
        saveToken(token);
        const decoded = decodeToken();
        const userData = {
            token,
            role: decoded?.role || decoded?.roles?.[0] || null,
            username: decoded?.sub || decoded?.username || 'User',
        };
        setUser(userData);
        return userData;
    };

    return (
        <AuthContext.Provider
            value={{ user, login, logout, loading, isAuthenticated: !!user }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
}
