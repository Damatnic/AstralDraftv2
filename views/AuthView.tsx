
import React from 'react';
import { motion } from 'framer-motion';
import { useAppState } from '../contexts/AppContext';
import { generateTeamBranding } from '../services/geminiService';
import { LazyImage } from '../components/ui/LazyImage';
import { authService } from '../services/authService';
import type { AuthResponse } from '../services/authService';
import { SparklesIcon } from '../components/icons/SparklesIcon';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';

type AuthMode = 'login' | 'register';

interface AuthViewProps {
  // No props currently needed, but interface ready for future expansion

}

const AuthView: React.FC<AuthViewProps> = () => {
    const { dispatch } = useAppState();
    const [mode, setMode] = React.useState<AuthMode>('login');
    const [formData, setFormData] = React.useState({
        username: '',
        email: '',
        password: '',
        displayName: '',
        confirmPassword: ''
    });
    const [avatar, setAvatar] = React.useState('🏈');
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value )};
        if (error) setError(null); // Clear error when user starts typing
    };

    const validateForm = (): string | null => {
        if (mode === 'register') {
            if (!formData.username.trim()) return 'Username is required';
            if (!formData.email.trim()) return 'Email is required';
            if (!formData.password) return 'Password is required';
            if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
            if (formData.password.length < 8) return 'Password must be at least 8 characters';
            if (!/\S+@\S+\.\S+/.test(formData.email)) return 'Please enter a valid email';
        } else {
            if (!formData.username.trim()) return 'Username is required';
            if (!formData.password) return 'Password is required';

        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;

        setIsSubmitting(true);
        setError(null);

        try {
            let response: AuthResponse;
            
            if (mode === 'register') {
                response = await authService.register(
                    formData.username,
                    formData.email,
                    formData.password,
                    formData.displayName || formData.username
                );
                
                if (response.success) {
                    // Auto-login after successful registration
                    response = await authService.login(formData.username, formData.password);

            } else {
                response = await authService.login(formData.username, formData.password);

            if (response.success && response.data) {
                // Update app state with authenticated user
                dispatch({
                    type: 'LOGIN',
                    payload: {
                        id: response.data.user.id.toString(),
                        name: response.data.user.display_name || response.data.user.username,
                        avatar,
                        isCommissioner: true, // You might want to get this from the user data
                        memberSince: new Date(response.data.user.created_at).getTime(),

                });

                dispatch({
                    type: 'ADD_NOTIFICATION',
                    payload: {
                        message: `Welcome ${response.data.user.display_name || response.data.user.username}!`,
                        type: 'SYSTEM'

                });
            } else {
                setError(response.error || 'Authentication failed');

        } catch (error) {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);

    };
    
    const handleGenerate = async () => {
        const nameToUse = formData.displayName || formData.username;
        if (!nameToUse.trim()) {
            setError("Please enter a name first.");
            return;

        setIsGenerating(true);
        try {

            const branding = await generateTeamBranding(nameToUse);
            if (branding) {
                setAvatar(branding.avatar);

    } catch (error) {
        console.error(error);
    `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                mode === 'login' ? 'bg-cyan-500 text-white shadow-lg' : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                            }`}
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('register')}`}
                        >
                            Register
                        </button>
                    </div>
                </div>

                <h2 className="text-xl font-bold text-center mb-4 text-white">
                    {mode === 'login' ? 'Welcome Back' : 'Create Your Manager Profile'}
                </h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 rounded-md text-red-200 text-sm">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-200 mb-1">
                            Username
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={handleInputChange}
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    {mode === 'register' && (
                        <>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="displayName" className="block text-sm font-medium text-gray-200 mb-1">
                                    Display Name (Optional)
                                </label>
                                <input
                                    id="displayName"
                                    name="displayName"
                                    type="text"
                                    value={formData.displayName}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Alex Johnson"
                                />
                            </div>
                        </>
                    )}

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    {mode === 'register' && (
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 mb-1">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="Confirm your password"
                                required
                            />
                        </div>
                    )}

                    {mode === 'register' && (
                        <div>
                            <label htmlFor="avatar" className="block text-sm font-medium text-gray-200 mb-1">
                                Avatar (Emoji)
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    id="avatar"
                                    type="text"
                                    value={avatar}
                                    onChange={(e: any) => setAvatar(e.target.value)}
                                    maxLength={2}
                                    placeholder="🏈"
                                />
                                <button 
                                    type="button" 
                                    onClick={handleGenerate}
                                    className="p-3 bg-purple-500/20 text-purple-300 rounded-md hover:bg-purple-500/30 disabled:opacity-50"
                                >
                                    {isGenerating ? (
                                        <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                                    ) : (
                                        <SparklesIcon />
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="glass-button-primary w-full mt-6 py-3 font-bold"
                >
                    {isSubmitting ? (
                        <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                            {mode === 'login' ? 'Signing In...' : 'Creating Account...'}
                        </div>
                    ) : (
                        mode === 'login' ? 'Sign In' : 'Start My Dynasty'
                    )}
                </button>

                <div className="mt-4 text-center text-sm text-gray-300">
                    {mode === 'login' ? (
                        <span>
                            Don't have an account?{' '}
                            <button
                                type="button"
                                onClick={switchMode}
                            >
                                Sign up
                            </button>
                        </span>
                    ) : (
                        <span>
                            Already have an account?{' '}
                            <button
                                type="button"
                                onClick={switchMode}
                            >
                                Sign in
                            </button>
                        </span>
                    )}
                </div>
            </motion.form>
        </div>
    );
};

const AuthViewWithErrorBoundary: React.FC<AuthViewProps> = (props: any) => (
    <ErrorBoundary>
        <AuthView {...props} />
    </ErrorBoundary>
);

export default AuthViewWithErrorBoundary;
