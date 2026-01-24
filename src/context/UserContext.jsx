import React, { createContext, useContext, useState, useEffect } from 'react';
import { createSession, validateSession } from '../services/api';

const UserContext = createContext();

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }) => {
    const [userName, setUserName] = useState('');
    const [sessionId, setSessionId] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Validate existing session on mount
    useEffect(() => {
        const checkSession = async () => {
            const storedSessionId = localStorage.getItem('inventory_session_id');
            const storedUserName = localStorage.getItem('inventory_user_name');

            if (storedSessionId && storedUserName) {
                try {
                    const sessionData = await validateSession(storedSessionId);
                    if (sessionData.isValid) {
                        setSessionId(storedSessionId);
                        setUserName(storedUserName);
                        setIsAuthenticated(true);
                    } else {
                        // Session invalid, clear storage
                        localStorage.removeItem('inventory_session_id');
                        localStorage.removeItem('inventory_user_name');
                    }
                } catch (error) {
                    console.error('Session validation failed:', error);
                    localStorage.removeItem('inventory_session_id');
                    localStorage.removeItem('inventory_user_name');
                }
            }
            setIsLoading(false);
        };

        checkSession();
    }, []);

    // Login function - creates a new session
    const login = async (name) => {
        try {
            setIsLoading(true);
            const sessionData = await createSession(name);
            
            setSessionId(sessionData.sessionId);
            setUserName(name);
            setIsAuthenticated(true);
            
            // Store in localStorage
            localStorage.setItem('inventory_session_id', sessionData.sessionId);
            localStorage.setItem('inventory_user_name', name);
            
            setIsLoading(false);
            return sessionData;
        } catch (error) {
            setIsLoading(false);
            throw error;
        }
    };

    // Logout function
    const logout = () => {
        setSessionId(null);
        setUserName('');
        setIsAuthenticated(false);
        localStorage.removeItem('inventory_session_id');
        localStorage.removeItem('inventory_user_name');
    };

    // Listen for auth-required events from API interceptors
    useEffect(() => {
        const handleAuthRequired = () => {
            logout();
        };
        window.addEventListener('auth-required', handleAuthRequired);
        return () => window.removeEventListener('auth-required', handleAuthRequired);
    }, []);

    return (
        <UserContext.Provider value={{ 
            userName, 
            sessionId, 
            isAuthenticated, 
            isLoading, 
            login, 
            logout,
            setUserName 
        }}>
            {children}
        </UserContext.Provider>
    );
};
