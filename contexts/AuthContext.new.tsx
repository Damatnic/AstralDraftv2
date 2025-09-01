/**
 * Authentication Context for Astral Draft
 * Integrates with secure backend authentication system
 */
import React, { createContext, useContext, useReducer, useEffect, ReactNode, useMemo, FC } from &apos;react&apos;;
import { authService } from &apos;../services/authService&apos;;

// Types for authentication state (matching backend User interface)
interface User {
}
    id: number;
    username: string;
    email: string;
    display_name: string;
    avatar_url?: string;
    created_at: string;

}

interface AuthState {
}
    user: User | null;
    sessionToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    isInitialized: boolean;

// Auth actions
type AuthAction =
    | { type: &apos;AUTH_START&apos; }
    | { type: &apos;AUTH_SUCCESS&apos;; payload: { user: User; sessionToken: string } }
    | { type: &apos;AUTH_FAILURE&apos;; payload: string }
    | { type: &apos;AUTH_LOGOUT&apos; }
    | { type: &apos;AUTH_CLEAR_ERROR&apos; }
    | { type: &apos;AUTH_INITIALIZED&apos; }
    | { type: &apos;USER_UPDATE&apos;; payload: Partial<User> };

// Initial auth state
const initialAuthState: AuthState = {
}
    user: null,
    sessionToken: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    isInitialized: false,
};

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
}
    switch (action.type) {
}
        case &apos;AUTH_START&apos;:
            return {
}
                ...state,
                isLoading: true,
                error: null,
            };

        case &apos;AUTH_SUCCESS&apos;:
            // Store session token in localStorage for persistence
            localStorage.setItem(&apos;sessionToken&apos;, action.payload.sessionToken);
            localStorage.setItem(&apos;user&apos;, JSON.stringify(action.payload.user));
            
            return {
}
                ...state,
                user: action.payload.user,
                sessionToken: action.payload.sessionToken,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            };

        case &apos;AUTH_FAILURE&apos;:
            // Clear any stored auth data on failure
            localStorage.removeItem(&apos;sessionToken&apos;);
            localStorage.removeItem(&apos;user&apos;);
            
            return {
}
                ...state,
                user: null,
                sessionToken: null,
                isAuthenticated: false,
                isLoading: false,
                error: action.payload,
            };

        case &apos;AUTH_LOGOUT&apos;:
            // Clear all stored auth data
            localStorage.removeItem(&apos;sessionToken&apos;);
            localStorage.removeItem(&apos;user&apos;);
            
            return {
}
                ...state,
                user: null,
                sessionToken: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            };

        case &apos;AUTH_CLEAR_ERROR&apos;:
            return {
}
                ...state,
                error: null,
            };

        case &apos;AUTH_INITIALIZED&apos;:
            return {
}
                ...state,
                isInitialized: true,
                isLoading: false,
            };

        case &apos;USER_UPDATE&apos;:
            const updatedUser = state.user ? { ...state.user, ...action.payload } : null;
            if (updatedUser) {
}
                localStorage.setItem(&apos;user&apos;, JSON.stringify(updatedUser));

            return {
}
                ...state,
                user: updatedUser,
            };

        default:
            return state;

};

// Context interface
interface AuthContextType {
}
    // State
    user: User | null;
    sessionToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    isInitialized: boolean;

    // Actions
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string, displayName?: string) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (updates: Partial<User>) => Promise<void>;
    clearError: () => void;
    checkAuth: () => Promise<void>;

// Create context
const AuthContext = createContext<AuthContextType | null>(null);

// Provider component
}

interface AuthProviderProps {
}
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }: any) => {
}
    const [state, dispatch] = useReducer(authReducer, initialAuthState);

    // Initialize auth state on mount
    useEffect(() => {
}
        const initializeAuth = async () => {
}
            try {
}
                dispatch({ type: &apos;AUTH_START&apos; });
                
                // Check for stored session data
                const storedToken = localStorage.getItem(&apos;sessionToken&apos;);
                const storedUser = localStorage.getItem(&apos;user&apos;);
                
                if (storedToken && storedUser) {
}
                    try {
}
                        // Verify stored session is still valid
                        const currentUser = authService.getCurrentUser();
                        
                        if (currentUser) {
}
                            dispatch({
}
                                type: &apos;AUTH_SUCCESS&apos;,
                                payload: {
}
                                    user: currentUser,
                                    sessionToken: storedToken,
                                },
                            });
                        } else {
}
                            // Invalid session, clear storage
                            localStorage.removeItem(&apos;sessionToken&apos;);
                            localStorage.removeItem(&apos;user&apos;);
                            dispatch({ type: &apos;AUTH_INITIALIZED&apos; });

                    } catch (error) {
}
                        // Session validation failed, clear storage
                        localStorage.removeItem(&apos;sessionToken&apos;);
                        localStorage.removeItem(&apos;user&apos;);
                        dispatch({ type: &apos;AUTH_INITIALIZED&apos; });

                } else {
}
                    dispatch({ type: &apos;AUTH_INITIALIZED&apos; });

            } catch (error) {
}
                dispatch({ type: &apos;AUTH_INITIALIZED&apos; });

        };

        initializeAuth();
    }, []);

    // Login function
    const login = async (email: string, password: string): Promise<void> => {
}
        try {
}
            dispatch({ type: &apos;AUTH_START&apos; });
            
            const result = await authService.login(email, password);
            
            if (result.success && result.data) {
}
                dispatch({
}
                    type: &apos;AUTH_SUCCESS&apos;,
                    payload: {
}
                        user: result.data.user,
                        sessionToken: result.data.session_token,
                    },
                });
            } else {
}
                dispatch({
}
                    type: &apos;AUTH_FAILURE&apos;,
                    payload: result.error || &apos;Login failed&apos;,
                });

        } catch (error) {
}
            dispatch({
}
                type: &apos;AUTH_FAILURE&apos;,
                payload: error instanceof Error ? error.message : &apos;Login failed&apos;,
            });

    };

    // Register function
    const register = async (
        username: string,
        email: string,
        password: string,
        displayName?: string
    ): Promise<void> => {
}
        try {
}
            dispatch({ type: &apos;AUTH_START&apos; });
            
            const result = await authService.register(username, email, password, displayName);
            
            if (result.success && result.data) {
}
                dispatch({
}
                    type: &apos;AUTH_SUCCESS&apos;,
                    payload: {
}
                        user: result.data.user,
                        sessionToken: result.data.session_token,
                    },
                });
            } else {
}
                dispatch({
}
                    type: &apos;AUTH_FAILURE&apos;,
                    payload: result.error || &apos;Registration failed&apos;,
                });

        } catch (error) {
}
            dispatch({
}
                type: &apos;AUTH_FAILURE&apos;,
                payload: error instanceof Error ? error.message : &apos;Registration failed&apos;,
            });

    };

    // Logout function
    const logout = async (): Promise<void> => {
}
        try {
}

            await authService.logout();
        
    } catch (error) {
}
        } finally {
}
            dispatch({ type: &apos;AUTH_LOGOUT&apos; });

    };

    // Update profile function
    const updateProfile = async (updates: Partial<User>): Promise<void> => {
}
        if (!state.user) {
}
            throw new Error(&apos;User not authenticated&apos;);

        try {
}
            dispatch({ type: &apos;AUTH_START&apos; });
            
            const result = await authService.updateProfile(updates);
            
            if (result) {
}
                const updatedUser = authService.getCurrentUser();
                if (updatedUser) {
}
                    dispatch({
}
                        type: &apos;USER_UPDATE&apos;,
                        payload: updatedUser,
                    });

            } else {
}
                dispatch({
}
                    type: &apos;AUTH_FAILURE&apos;,
                    payload: &apos;Profile update failed&apos;,
                });

        } catch (error) {
}
            dispatch({
}
                type: &apos;AUTH_FAILURE&apos;,
                payload: error instanceof Error ? error.message : &apos;Profile update failed&apos;,
            });

    };

    // Clear error function
    const clearError = (): void => {
}
        dispatch({ type: &apos;AUTH_CLEAR_ERROR&apos; });
    };

    // Check auth function for manual validation
    const checkAuth = async (): Promise<void> => {
}
        try {
}
            const currentUser = authService.getCurrentUser();
            
            if (currentUser) {
}
                // Auth is valid, update user data
                dispatch({
}
                    type: &apos;USER_UPDATE&apos;,
                    payload: currentUser,
                });
            } else {
}
                // Auth is invalid, logout
                dispatch({ type: &apos;AUTH_LOGOUT&apos; });

        } catch (error) {
}
            dispatch({ type: &apos;AUTH_LOGOUT&apos; });

    };

    // Memoized context value
    const contextValue = useMemo<AuthContextType>(
        () => ({
}
            // State
            user: state.user,
            sessionToken: state.sessionToken,
            isAuthenticated: state.isAuthenticated,
            isLoading: state.isLoading,
            error: state.error,
            isInitialized: state.isInitialized,

            // Actions
            login,
            register,
            logout,
            updateProfile,
            clearError,
            checkAuth,
        }),
        [state]
    );

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for using auth context
export const useAuth = (): AuthContextType => {
}
    const context = useContext(AuthContext);
    if (!context) {
}
        throw new Error(&apos;useAuth must be used within an AuthProvider&apos;);

    return context;
};

// Permission-based hook for role/permission checking
export const usePermission = (permission?: string) => {
}
    const { user, isAuthenticated } = useAuth();
    
    return useMemo(() => {
}
        if (!isAuthenticated || !user) return false;
        
        // For MVP, all authenticated users have basic permissions
        // This can be extended with role-based permissions later
        if (!permission) return true;
        
        // Add specific permission logic here when roles are implemented
        return true;
    }, [user, isAuthenticated, permission]);
};

// Loading component for auth initialization
export const AuthInitializer: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({
}
    children,
    fallback = <div>Loading...</div>,
}: any) => {
}
    const { isInitialized } = useAuth();
    
    if (!isInitialized) {
}
        return <>{fallback}</>;

    return <>{children}</>;
};

export default AuthProvider;
