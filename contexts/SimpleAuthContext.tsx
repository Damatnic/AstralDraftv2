/* eslint-disable react-refresh/only-export-components */
/**
 * Simple Authentication Context for Astral Draft
 * Works with SimpleAuthService for 10-player + admin system
 */
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from &apos;react&apos;;
import SimpleAuthService, { SimpleUser } from &apos;../services/simpleAuthService&apos;;

interface SimpleAuthContextType {
}
    user: SimpleUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (user: SimpleUser) => void;
    logout: () => void;
    updateUserPin: (newPin: string) => Promise<boolean>;
    updateUserEmail: (email: string) => Promise<boolean>;
    updateUserCustomization: (customization: Partial<SimpleUser[&apos;customization&apos;]>) => Promise<boolean>;
    updateUserDisplayName: (displayName: string) => Promise<boolean>;
    clearError: () => void;}

const SimpleAuthContext = createContext<SimpleAuthContextType | undefined>(undefined);

}

interface Props {
}
    children: ReactNode;

export const SimpleAuthProvider: React.FC<Props> = ({ children }: any) => {
}
    const [user, setUser] = useState<SimpleUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Initialize and check for existing session
    useEffect(() => {
}
        const initializeAuth = () => {
}
            try {
}

                SimpleAuthService.initialize();
                const session = SimpleAuthService.getCurrentSession();
                
                if (session) {
}
                    setUser(session.user);

    } catch (error) {
}
                setError(&apos;Failed to initialize authentication&apos;);
            } finally {
}
                setIsLoading(false);

        };

        initializeAuth();
    }, []);

    const login = useCallback((loggedInUser: SimpleUser) => {
}
        setUser(loggedInUser);
        setError(null);
    }, []);

    const logout = useCallback(() => {
}
        SimpleAuthService.logout();
        setUser(null);
        setError(null);
    }, []);

    const updateUserPin = useCallback(async (newPin: string): Promise<boolean> => {
}
        if (!user) return false;

        try {
}
            const success = SimpleAuthService.updateUserPin(user.id, newPin);
            if (success) {
}
                setUser({ ...user, pin: newPin });

            return success;
        
    } catch (err) {
}
            setError(&apos;Failed to update PIN&apos;);
            return false;

    }, [user]);

    const updateUserEmail = useCallback(async (email: string): Promise<boolean> => {
}
        if (!user) return false;

        try {
}
            const success = SimpleAuthService.updateUserEmail(user.id, email);
            if (success) {
}
                setUser({ ...user, email });

            return success;
        
    } catch (err) {
}
            setError(&apos;Failed to update email&apos;);
            return false;

    }, [user]);

    const updateUserCustomization = useCallback(async (customization: Partial<SimpleUser[&apos;customization&apos;]>): Promise<boolean> => {
}
        if (!user) return false;

        try {
}
            const success = SimpleAuthService.updateUserCustomization(user.id, customization);
            if (success) {
}
                setUser({
}
                    ...user,
                    customization: { ...user.customization, ...customization }
                });

            return success;
        
    } catch (err) {
}
            setError(&apos;Failed to update customization&apos;);
            return false;

    }, [user]);

    const updateUserDisplayName = useCallback(async (displayName: string): Promise<boolean> => {
}
        if (!user) return false;

        try {
}
            const success = SimpleAuthService.updateUserDisplayName(user.id, displayName);
            if (success) {
}
                setUser({ ...user, displayName });

            return success;
        
    } catch (err) {
}
            setError(&apos;Failed to update display name&apos;);
            return false;

    }, [user]);

    const clearError = useCallback(() => {
}
        setError(null);
    }, []);

    const value: SimpleAuthContextType = useMemo(() => ({
}
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
//         clearError
    }), [user, isLoading, error, login, logout, updateUserPin, updateUserEmail, updateUserCustomization, updateUserDisplayName, clearError]);

    return (
        <SimpleAuthContext.Provider value={value}>
            {children}
        </SimpleAuthContext.Provider>
    );
};

export const useAuth = (): SimpleAuthContextType => {
}
    const context = useContext(SimpleAuthContext);
    if (context === undefined) {
}
        throw new Error(&apos;useAuth must be used within a SimpleAuthProvider&apos;);

    return context;
};

export default SimpleAuthProvider;
