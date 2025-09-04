/* eslint-disable react-refresh/only-export-components */
/**
 * Simple Authentication Context for Astral Draft
 * Works with SimpleAuthService for 10-player + admin system
 */
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import SimpleAuthService, { SimpleUser } from '../services/simpleAuthService';

interface SimpleAuthContextType {
    user: SimpleUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (user: SimpleUser) => void;
    logout: () => void;
    updateUserPin: (newPin: string) => Promise<boolean>;
    updateUserEmail: (email: string) => Promise<boolean>;
    updateUserCustomization: (customization: Partial<SimpleUser['customization']>) => Promise<boolean>;
    updateUserDisplayName: (displayName: string) => Promise<boolean>;
    clearError: () => void;
}

const SimpleAuthContext = createContext<SimpleAuthContextType | undefined>(undefined);

interface Props {
    children: ReactNode;
}

export const SimpleAuthProvider: React.FC<Props> = ({ children }: any) => {
    const [user, setUser] = useState<SimpleUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Initialize and check for existing session
    useEffect(() => {
        const initializeAuth = () => {
            try {
                SimpleAuthService.initialize();
                const session = SimpleAuthService.getCurrentSession();
                
                if (session) {
                    setUser(session.user);
                }
            } catch (error: any) {
                setError('Failed to initialize authentication');
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = useCallback((loggedInUser: SimpleUser) => {
        setUser(loggedInUser);
        setError(null);
    }, []);

    const logout = useCallback(() => {
        SimpleAuthService.logout();
        setUser(null);
        setError(null);
    }, []);

    const updateUserPin = useCallback(async (newPin: string): Promise<boolean> => {
        if (!user) return false;

        try {
            const success = SimpleAuthService.updateUserPin(user.id, newPin);
            if (success) {
                setUser({ ...user, pin: newPin });
            }
            return success;
        } catch (err: any) {
            setError('Failed to update PIN');
            return false;
        }
    }, [user]);

    const updateUserEmail = useCallback(async (email: string): Promise<boolean> => {
        if (!user) return false;
        // Simplified - just update local state for now
        setUser({ ...user, email });
        return true;
    }, [user]);

    const updateUserCustomization = useCallback(async (customization: Partial<SimpleUser['customization']>): Promise<boolean> => {
        if (!user) return false;
        // Simplified - just update local state for now
        setUser({
            ...user,
            customization: { ...user.customization, ...customization }
        });
        return true;
    }, [user]);

    const updateUserDisplayName = useCallback(async (displayName: string): Promise<boolean> => {
        if (!user) return false;
        // Simplified - just update local state for now
        setUser({ ...user, displayName });
        return true;
    }, [user]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const value: SimpleAuthContextType = useMemo(() => ({
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        logout,
        updateUserPin,
        updateUserEmail,
        updateUserCustomization,
        updateUserDisplayName,
        clearError
    }), [user, isLoading, error, login, logout, updateUserPin, updateUserEmail, updateUserCustomization, updateUserDisplayName, clearError]);

    return (
        <SimpleAuthContext.Provider value={value}>
            {children}
        </SimpleAuthContext.Provider>
    );
};

export const useAuth = (): SimpleAuthContextType => {
    const context = useContext(SimpleAuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within a SimpleAuthProvider');
    }
    return context;
};

export default SimpleAuthProvider;
