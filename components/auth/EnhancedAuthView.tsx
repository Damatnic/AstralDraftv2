import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useCallback, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { OAuthLoginComponent } from '../auth/oauth/OAuthLoginComponent';
import { UserRoleBadge, PermissionList } from '../auth/ProtectedRoute';
import { UserRole } from '../../services/rbacService';
import { 
  EyeIcon, 
  EyeOffIcon, 
  UserIcon, 
  MailIcon, 
  LockIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ShieldCheckIcon
} from 'lucide-react';

type AuthMode = 'login' | 'register' | 'profile';

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;

}

const EnhancedAuthView: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { user, isAuthenticated, login, register, updateProfile, error, clearError } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [authError, setAuthError] = useState<string | null>(null);

  // Clear errors when switching modes
  useEffect(() => {
    clearError();
    setAuthError(null);
    setValidationErrors({});
  }, [mode, clearError]);

  // Populate form with user data in profile mode
  useEffect(() => {
    if (mode === 'profile' && user) {
      setFormData(prev => ({
        ...prev,
        username: user.username,
        email: user.email,
        displayName: user.display_name
      }));

  }, [mode, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific field error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });

    if (authError) setAuthError(null);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (mode === 'register' || mode === 'profile') {
      if (!formData.username.trim()) {
        errors.username = 'Username is required';
      } else if (formData.username.length < 3) {
        errors.username = 'Username must be at least 3 characters';
      } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
        errors.username = 'Username can only contain letters, numbers, and underscores';

      if (!formData.email.trim()) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Please enter a valid email address';

      if (!formData.displayName.trim()) {
        errors.displayName = 'Display name is required';


    if (mode === 'register') {
      if (!formData.password) {
        errors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';

      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';

    } else if (mode === 'login') {
      if (!formData.username.trim()) {
        errors.username = 'Username or email is required';

      if (!formData.password) {
        errors.password = 'Password is required';


    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setAuthError(null);

    try {
      if (mode === 'login') {
        await login(formData.username, formData.password);
      } else if (mode === 'register') {
        await register(formData.username, formData.email, formData.password, formData.displayName);
        setMode('login');
      } else if (mode === 'profile') {
        await updateProfile({
          display_name: formData.displayName,
          email: formData.email
        });

    } catch (error) {
      setAuthError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);

  };

  const handleOAuthSuccess = (oauthUser: any) => {
    // OAuth success is handled by the auth context
  };

  const handleOAuthError = (errorMessage: string) => {
    setAuthError(errorMessage);
  };

  // If authenticated and not in profile mode, show user dashboard
  if (isAuthenticated && mode !== 'profile') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 sm:px-4 md:px-6 lg:px-8"
          >
            <div className="text-center mb-8 sm:px-4 md:px-6 lg:px-8">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:px-4 md:px-6 lg:px-8">
                <CheckCircleIcon className="w-10 h-10 text-green-600 dark:text-green-400 sm:px-4 md:px-6 lg:px-8" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:px-4 md:px-6 lg:px-8">
                Welcome back, {user?.display_name || user?.username}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 sm:px-4 md:px-6 lg:px-8">
                You're successfully authenticated and ready to use Astral Draft.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 sm:px-4 md:px-6 lg:px-8">
                  Account Information
                </h2>
                <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400 sm:px-4 md:px-6 lg:px-8">Username</label>
                    <p className="text-gray-900 dark:text-gray-100 sm:px-4 md:px-6 lg:px-8">{user?.username}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400 sm:px-4 md:px-6 lg:px-8">Email</label>
                    <p className="text-gray-900 dark:text-gray-100 sm:px-4 md:px-6 lg:px-8">{user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400 sm:px-4 md:px-6 lg:px-8">Display Name</label>
                    <p className="text-gray-900 dark:text-gray-100 sm:px-4 md:px-6 lg:px-8">{user?.display_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400 sm:px-4 md:px-6 lg:px-8">Role</label>
                    <div className="mt-1 sm:px-4 md:px-6 lg:px-8">
                      <UserRoleBadge />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3 sm:px-4 md:px-6 lg:px-8">
                  <button
                    onClick={() => setMode('profile')}
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => window.location.href = '/dashboard'}
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>

              <div>
                <PermissionList showCategories={true} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 sm:px-4 md:px-6 lg:px-8">
      <div className="container mx-auto px-4 py-8 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-md mx-auto sm:px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 sm:px-4 md:px-6 lg:px-8"
          >
            {/* Header */}
            <div className="text-center mb-8 sm:px-4 md:px-6 lg:px-8">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:px-4 md:px-6 lg:px-8">
                <ShieldCheckIcon className="w-8 h-8 text-blue-600 dark:text-blue-400 sm:px-4 md:px-6 lg:px-8" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:px-4 md:px-6 lg:px-8">
                {mode === 'login' && 'Welcome Back'}
                {mode === 'register' && 'Create Account'}
                {mode === 'profile' && 'Edit Profile'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 sm:px-4 md:px-6 lg:px-8">
                {mode === 'login' && 'Sign in to your Astral Draft account'}
                {mode === 'register' && 'Join the Astral Draft community'}
                {mode === 'profile' && 'Update your account information'}
              </p>
            </div>

            {/* Error Display */}
            <AnimatePresence>
              {(authError || error) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg sm:px-4 md:px-6 lg:px-8"
                >
                  <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                    <AlertCircleIcon className="w-4 h-4 text-red-500 sm:px-4 md:px-6 lg:px-8" />
                    <span className="text-sm text-red-700 dark:text-red-300 sm:px-4 md:px-6 lg:px-8">
                      {authError || error}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* OAuth Login (only show for login mode) */}
            {mode === 'login' && (
              <OAuthLoginComponent
                onSuccess={handleOAuthSuccess}
                onError={handleOAuthError}
                className="mb-6 sm:px-4 md:px-6 lg:px-8"
              />
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}
                  </label>
                  <div className="relative sm:px-4 md:px-6 lg:px-8">
                    <UserIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400 sm:px-4 md:px-6 lg:px-8" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      `}
                      placeholder={mode === 'login' ? 'Username or email' : 'Choose a username'}
                    />
                  </div>
                  {validationErrors.username && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 sm:px-4 md:px-6 lg:px-8">
                      {validationErrors.username}
                    </p>
                  )}
                </div>
              )}

              {/* Email Field */}
              {(mode === 'register' || mode === 'profile') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:px-4 md:px-6 lg:px-8">
                    Email
                  </label>
                  <div className="relative sm:px-4 md:px-6 lg:px-8">
                    <MailIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400 sm:px-4 md:px-6 lg:px-8" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      `}
                      placeholder="your@email.com"
                    />
                  </div>
                  {validationErrors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 sm:px-4 md:px-6 lg:px-8">
                      {validationErrors.email}
                    </p>
                  )}
                </div>
              )}

              {/* Display Name Field */}
              {(mode === 'register' || mode === 'profile') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:px-4 md:px-6 lg:px-8">
                    Display Name
                  </label>
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    `}
                    placeholder="How should we display your name?"
                  />
                  {validationErrors.displayName && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 sm:px-4 md:px-6 lg:px-8">
                      {validationErrors.displayName}
                    </p>
                  )}
                </div>
              )}

              {/* Password Field */}
              {mode !== 'profile' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:px-4 md:px-6 lg:px-8">
                    Password
                  </label>
                  <div className="relative sm:px-4 md:px-6 lg:px-8">
                    <LockIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400 sm:px-4 md:px-6 lg:px-8" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      `}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOffIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" /> : <EyeIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />}
                    </button>
                  </div>
                  {validationErrors.password && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 sm:px-4 md:px-6 lg:px-8">
                      {validationErrors.password}
                    </p>
                  )}
                </div>
              )}

              {/* Confirm Password Field */}
              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:px-4 md:px-6 lg:px-8">
                    Confirm Password
                  </label>
                  <div className="relative sm:px-4 md:px-6 lg:px-8">
                    <LockIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400 sm:px-4 md:px-6 lg:px-8" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      `}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOffIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" /> : <EyeIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />}
                    </button>
                  </div>
                  {validationErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 sm:px-4 md:px-6 lg:px-8">
                      {validationErrors.confirmPassword}
                    </p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors sm:px-4 md:px-6 lg:px-8"
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2 sm:px-4 md:px-6 lg:px-8">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white sm:px-4 md:px-6 lg:px-8" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <>
                    {mode === 'login' && 'Sign In'}
                    {mode === 'register' && 'Create Account'}
                    {mode === 'profile' && 'Update Profile'}
                  </>
                )}
              </motion.button>
            </form>

            {/* Mode Toggle */}
            {mode !== 'profile' && (
              <div className="mt-6 text-center sm:px-4 md:px-6 lg:px-8">
                <button
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                >
                  {mode === 'login' 
                    ? "Don&apos;t have an account? Sign up" 
                    : "Already have an account? Sign in"

                </button>
              </div>
            )}

            {/* Back to Dashboard (profile mode) */}
            {mode === 'profile' && (
              <div className="mt-6 text-center sm:px-4 md:px-6 lg:px-8">
                <button
                  onClick={() => window.location.href = '/dashboard'}
                >
                  Back to Dashboard
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const EnhancedAuthViewWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <EnhancedAuthView {...props} />
  </ErrorBoundary>
);

export default React.memo(EnhancedAuthViewWithErrorBoundary);
