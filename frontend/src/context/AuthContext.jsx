import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Ideally verify token with backend, for now assume valid or decode
            // Let's decode or simply fetch user profile if endpoint existed?
            // We implemented 'get_current_user' but not a direct 'me' endpoint yet exposed easily.
            // Let's assume we decode or just persist existence.
            // For simplicity:
            setUser({ token });
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);

        // Auth logic uses OAuth2 password flow form data
        const response = await api.post('/auth/login', formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const { access_token } = response.data;
        localStorage.setItem('token', access_token);
        setUser({ token: access_token });
    };

    const register = async (email, password, fullName) => {
        await api.post('/auth/register', { email, password, full_name: fullName });
        // Auto login after register? or redirect.
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
