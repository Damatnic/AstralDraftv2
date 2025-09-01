/**
 * Production Login Interface
 * Comprehensive authentication UI with email/password login,
 * registration, password reset, and email verification
 */

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useCallback, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MailIcon, 
  LockIcon, 
  UserIcon, 
  EyeIcon, 
  EyeOffIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  LoaderIcon,
  ArrowLeftIcon
} from 'lucide-react';
import { useProductionAuth, LoginCredentials, RegisterData } from '../../contexts/ProductionAuthContext';
import { SecurePasswordInput } from '../ui/SecureInput';

type ViewType = 'login' | 'register' | 'forgot-password' | 'verify-email';

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  username?: string;
  displayName?: string;
  general?: string;

}

const ProductionLoginInterface: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState('');
  
  // Form data states
  const [loginData, setLoginData] = useState<LoginCredentials>({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [registerData, setRegisterData] = useState<RegisterData>({
    email: '',
    username: '',
    displayName: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  
  const [forgotEmail, setForgotEmail] = useState('');
  const [verificationToken, setVerificationToken] = useState('');

  const { login, register, resetPassword, verifyEmail, resendVerification } = useProductionAuth();

  // Clear messages when view changes
  useEffect(() => {
    setErrors({});
    setSuccessMessage('');
  }, [currentView]);

  // Validation functions
  const validateEmail = (email: string): string | undefined => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)) {
      return 'Password must contain uppercase, lowercase, number, and special character';

    return undefined;
  };

  const validateUsername = (username: string): string | undefined => {
    if (!username) return 'Username is required';
    if (username.length < 3 || username.length > 20) return 'Username must be 3-20 characters';
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) return 'Username can only contain letters, numbers, underscore, or dash';
    return undefined;
  };

  const validateDisplayName = (displayName: string): string | undefined => {
    if (!displayName) return 'Display name is required';
    if (displayName.trim().length < 2 || displayName.trim().length > 30) return 'Display name must be 2-30 characters';
    return undefined;
  };

  // Handle login
  const handleLogin = async () => {
    try {

    e.preventDefault();
    setIsLoading(true);
    setErrors({
    } catch (error) {
      console.error('Error in handleLogin:', error);

    } catch (error) {
        console.error(error);
    });

    // Validate form
    const emailError = validateEmail(loginData.email);
    if (emailError) {
      setErrors({ email: emailError });
      setIsLoading(false);
      return;

    if (!loginData.password) {
      setErrors({ password: 'Password is required' });
      setIsLoading(false);
      return;

    try {
      const result = await login(loginData);
      if (!result.success) {
        setErrors({ general: result.error || 'Login failed' });

    } catch (error) {
      setErrors({ general: 'An unexpected error occurred' });

    setIsLoading(false);
  };

  // Handle registration
  const handleRegister = async () => {
    try {

    e.preventDefault();
    setIsLoading(true);
    setErrors({
    } catch (error) {
      console.error('Error in handleRegister:', error);

    } catch (error) {
        console.error(error);
    });

    // Validate form
    const validationErrors: FormErrors = {};
    
    const emailError = validateEmail(registerData.email);
    if (emailError) validationErrors.email = emailError;
    
    const usernameError = validateUsername(registerData.username);
    if (usernameError) validationErrors.username = usernameError;
    
    const displayNameError = validateDisplayName(registerData.displayName);
    if (displayNameError) validationErrors.displayName = displayNameError;
    
    const passwordError = validatePassword(registerData.password);
    if (passwordError) validationErrors.password = passwordError;
    
    if (registerData.password !== registerData.confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match';

    if (!registerData.acceptTerms) {
      validationErrors.general = 'You must accept the terms and conditions';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;

    try {
      const result = await register(registerData);
      if (result.success) {
        setSuccessMessage('Registration successful! Please check your email to verify your account.');
        setCurrentView('verify-email');
      } else {
        setErrors({ general: result.error || 'Registration failed' });

    } catch (error) {
      setErrors({ general: 'An unexpected error occurred' });

    setIsLoading(false);
  };

  // Handle forgot password
  const handleForgotPassword = async () => {
    try {

    e.preventDefault();
    setIsLoading(true);
    setErrors({
    } catch (error) {
      console.error('Error in handleForgotPassword:', error);

    } catch (error) {
        console.error(error);
    });

    const emailError = validateEmail(forgotEmail);
    if (emailError) {
      setErrors({ email: emailError });
      setIsLoading(false);
      return;

    try {
      const result = await resetPassword({ email: forgotEmail });
      if (result.success) {
        setSuccessMessage('Password reset link sent to your email');
      } else {
        setErrors({ general: result.error || 'Failed to send reset email' });

    } catch (error) {
      setErrors({ general: 'An unexpected error occurred' });

    setIsLoading(false);
  };

  // Handle email verification
  const handleVerifyEmail = async () => {
    try {

    e.preventDefault();
    setIsLoading(true);
    setErrors({
    } catch (error) {
      console.error('Error in handleVerifyEmail:', error);

    } catch (error) {
        console.error(error);
    });

    if (!verificationToken) {
      setErrors({ general: 'Verification token is required' });
      setIsLoading(false);
      return;

    try {
      const result = await verifyEmail(verificationToken);
      if (result.success) {
        setSuccessMessage('Email verified successfully! You can now log in.');
        setCurrentView('login');
      } else {
        setErrors({ general: result.error || 'Verification failed' });

    } catch (error) {
      setErrors({ general: 'An unexpected error occurred' });

    setIsLoading(false);
  };

  // Handle resend verification
  const handleResendVerification = async () => {
    try {

    setIsLoading(true);
    setErrors({
    } catch (error) {
      console.error('Error in handleResendVerification:', error);

    } catch (error) {
        console.error(error);
    });

    try {
      const result = await resendVerification();
      if (result.success) {
        setSuccessMessage('Verification email sent! Please check your inbox.');
      } else {
        setErrors({ general: result.error || 'Failed to resend verification' });

    } catch (error) {
      setErrors({ general: 'An unexpected error occurred' });

    setIsLoading(false);
  };

  // Input component with error handling
  const InputField: React.FC<{
    type: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    icon: React.ReactNode;
    showPasswordToggle?: boolean;
    onTogglePassword?: () => void;
    showPassword?: boolean;
  }> = ({ type, placeholder, value, onChange, error, icon, showPasswordToggle, onTogglePassword, showPassword }) => (
    <div className="space-y-1 sm:px-4 md:px-6 lg:px-8">
      <div className="relative sm:px-4 md:px-6 lg:px-8">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none sm:px-4 md:px-6 lg:px-8">
          <div className="text-gray-400 sm:px-4 md:px-6 lg:px-8" aria-hidden="true">{icon}</div>
        </div>
        <input
          type={showPasswordToggle ? (showPassword ? 'text' : 'password') : type}
          placeholder={placeholder}
          value={value}
          onChange={(e: any) => onChange(e.target.value)}
          aria-label={placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? `${placeholder.toLowerCase().replace(/\s+/g, '-')}-error` : undefined}
          className={`w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 pl-10 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${showPasswordToggle ? 'pr-12' : 'pr-4'}`}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute inset-y-0 right-0 pr-3 flex items-center sm:px-4 md:px-6 lg:px-8"
            aria-label={showPassword ? 'Hide password' : 'Show password'}>
            {showPassword ? (
              <EyeOffIcon className="w-5 h-5 text-gray-400 hover:text-white sm:px-4 md:px-6 lg:px-8" aria-hidden="true" />
            ) : (
              <EyeIcon className="w-5 h-5 text-gray-400 hover:text-white sm:px-4 md:px-6 lg:px-8" aria-hidden="true" />
            )}
          </button>
        )}
      </div>
      {error && (
        <div 
          id={`${placeholder.toLowerCase().replace(/\s+/g, '-')}-error`}
          role="alert"
          aria-live="polite"
          className="flex items-center space-x-1 text-red-400 text-sm sm:px-4 md:px-6 lg:px-8"
        >
          <AlertCircleIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );

  // Login view
  const LoginView = () => (
    <form onSubmit={handleLogin} aria-label="Login form"
      <div className="text-center mb-8 sm:px-4 md:px-6 lg:px-8">
        <h1 id="login-title" className="text-3xl font-bold text-white mb-2 sm:px-4 md:px-6 lg:px-8">Welcome Back</h1>
        <p id="login-description" className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Sign in to your Astral Draft account</p>
      </div>

      <InputField
        type="email"
        placeholder="Email address"
        value={loginData.email}
        onChange={(value: any) => setLoginData({ ...loginData, email: value }}
        error={errors.email}
        icon={<MailIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />}
      />

      <SecurePasswordInput
        type="password"
        placeholder="Password"
        value={loginData.password}
        onChange={(value: string) => setLoginData({ ...loginData, password: value }}
        error={errors.password}
        label="Password"
        showToggle={true}
        clearClipboardDelay={5000}
        className="pl-10 sm:px-4 md:px-6 lg:px-8"
      />

      <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
        <label className="flex items-center sm:px-4 md:px-6 lg:px-8 cursor-pointer">
          <input
            type="checkbox"
            id="remember-me"
            checked={loginData.rememberMe}
            onChange={(e: any) => setLoginData({ ...loginData, rememberMe: e.target.checked }}
            aria-label="Remember me"
            className="rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-gray-800 sm:px-4 md:px-6 lg:px-8"
          />
          <span className="ml-2 text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">Remember me</span>
        </label>
        <button
          type="button"
          onClick={() => setCurrentView('forgot-password')}
        >
          Forgot password?
        </button>
      </div>

      {errors.general && (
        <div 
          role="alert"
          aria-live="assertive"
          className="flex items-center space-x-2 text-red-400 text-sm bg-red-900/20 p-3 rounded-lg sm:px-4 md:px-6 lg:px-8"
        >
          <AlertCircleIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" aria-hidden="true" />
          <span>{errors.general}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 sm:px-4 md:px-6 lg:px-8"
       aria-label="Submit">
        {isLoading ? (
          <>
            <LoaderIcon className="w-5 h-5 animate-spin sm:px-4 md:px-6 lg:px-8" aria-hidden="true" />
            <span>Signing in...</span>
          </>
        ) : (
          <span>Sign In</span>
        )}
      </button>

      <div className="text-center sm:px-4 md:px-6 lg:px-8">
        <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Don&apos;t have an account? </span>
        <button
          type="button"
          onClick={() => setCurrentView('register')}
        >
          Sign up
        </button>
      </div>
    </form>
  );

  // Register view
  const RegisterView = () => (
    <form onSubmit={handleRegister}
      <div className="text-center mb-8 sm:px-4 md:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => setCurrentView('login')}
        >
          <ArrowLeftIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
          <span>Back to login</span>
        </button>
        <h1 className="text-3xl font-bold text-white mb-2 sm:px-4 md:px-6 lg:px-8">Create Account</h1>
        <p className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Join Astral Draft and start predicting</p>
      </div>

      <InputField
        type="email"
        placeholder="Email address"
        value={registerData.email}
        onChange={(value: any) => setRegisterData({ ...registerData, email: value }}
        error={errors.email}
        icon={<MailIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />}
      />

      <InputField
        type="text"
        placeholder="Username"
        value={registerData.username}
        onChange={(value: any) => setRegisterData({ ...registerData, username: value }}
        error={errors.username}
        icon={<UserIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />}
      />

      <InputField
        type="text"
        placeholder="Display name"
        value={registerData.displayName}
        onChange={(value: any) => setRegisterData({ ...registerData, displayName: value }}
        error={errors.displayName}
        icon={<UserIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />}
      />

      <SecurePasswordInput
        type="password"
        placeholder="Password"
        value={registerData.password}
        onChange={(value: string) => setRegisterData({ ...registerData, password: value }}
        error={errors.password}
        label="Password"
        showToggle={true}
        strengthIndicator={true}
        minLength={8}
        maxLength={128}
        clearClipboardDelay={5000}
        className="pl-10 sm:px-4 md:px-6 lg:px-8"
      />

      <SecurePasswordInput
        type="password"
        placeholder="Confirm password"
        value={registerData.confirmPassword}
        onChange={(value: string) => setRegisterData({ ...registerData, confirmPassword: value }}
        error={errors.confirmPassword}
        label="Confirm Password"
        showToggle={true}
        clearClipboardDelay={5000}
        className="pl-10 sm:px-4 md:px-6 lg:px-8"
      />

      <label className="flex items-start space-x-3 sm:px-4 md:px-6 lg:px-8">
        <input
          type="checkbox"
          checked={registerData.acceptTerms}
          onChange={(e: any) => setRegisterData({ ...registerData, acceptTerms: e.target.checked }}
          className="rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-gray-800 mt-1 sm:px-4 md:px-6 lg:px-8"
        />
        <span className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">
          I accept the{' '}
          <a href="/terms" className="text-blue-400 hover:text-blue-300 sm:px-4 md:px-6 lg:px-8">Terms of Service</a>
          {' '}and{' '}
          <a href="/privacy" className="text-blue-400 hover:text-blue-300 sm:px-4 md:px-6 lg:px-8">Privacy Policy</a>
        </span>
      </label>

      {errors.general && (
        <div 
          role="alert"
          aria-live="assertive"
          className="flex items-center space-x-2 text-red-400 text-sm bg-red-900/20 p-3 rounded-lg sm:px-4 md:px-6 lg:px-8"
        >
          <AlertCircleIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" aria-hidden="true" />
          <span>{errors.general}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 sm:px-4 md:px-6 lg:px-8"
       aria-label="Submit">
        {isLoading ? (
          <>
            <LoaderIcon className="w-5 h-5 animate-spin sm:px-4 md:px-6 lg:px-8" aria-hidden="true" />
            <span>Creating account...</span>
          </>
        ) : (
          <span>Create Account</span>
        )}
      </button>
    </form>
  );

  // Forgot password view
  const ForgotPasswordView = () => (
    <form onSubmit={handleForgotPassword}
      <div className="text-center mb-8 sm:px-4 md:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => setCurrentView('login')}
        >
          <ArrowLeftIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
          <span>Back to login</span>
        </button>
        <h1 className="text-3xl font-bold text-white mb-2 sm:px-4 md:px-6 lg:px-8">Reset Password</h1>
        <p className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Enter your email to receive a reset link</p>
      </div>

      <InputField
        type="email"
        placeholder="Email address"
        value={forgotEmail}
        onChange={setForgotEmail}
        icon={<MailIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />}
      />

      {errors.general && (
        <div 
          role="alert"
          aria-live="assertive"
          className="flex items-center space-x-2 text-red-400 text-sm bg-red-900/20 p-3 rounded-lg sm:px-4 md:px-6 lg:px-8"
        >
          <AlertCircleIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" aria-hidden="true" />
          <span>{errors.general}</span>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center space-x-2 text-green-400 text-sm bg-green-900/20 p-3 rounded-lg sm:px-4 md:px-6 lg:px-8">
          <CheckCircleIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
          <span>{successMessage}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 sm:px-4 md:px-6 lg:px-8"
       aria-label="Submit">
        {isLoading ? (
          <>
            <LoaderIcon className="w-5 h-5 animate-spin sm:px-4 md:px-6 lg:px-8" aria-hidden="true" />
            <span>Sending reset link...</span>
          </>
        ) : (
          <span>Send Reset Link</span>
        )}
      </button>
    </form>
  );

  // Email verification view
  const VerifyEmailView = () => (
    <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
      <div className="text-center mb-8 sm:px-4 md:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-2 sm:px-4 md:px-6 lg:px-8">Verify Email</h1>
        <p className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Enter the verification token from your email</p>
      </div>

      <form onSubmit={handleVerifyEmail}
        <InputField
          type="text"
          placeholder="Verification token"
          value={verificationToken}
          onChange={setVerificationToken}
          icon={<MailIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />}
        />

        {successMessage && (
          <div className="flex items-center space-x-2 text-green-400 text-sm bg-green-900/20 p-3 rounded-lg sm:px-4 md:px-6 lg:px-8">
            <CheckCircleIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
            <span>{successMessage}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 sm:px-4 md:px-6 lg:px-8"
         aria-label="Submit">
          {isLoading ? (
            <>
              <LoaderIcon className="w-5 h-5 animate-spin sm:px-4 md:px-6 lg:px-8" aria-hidden="true" />
              <span>Verifying...</span>
            </>
          ) : (
            <span>Verify Email</span>
          )}
        </button>
      </form>

      <div className="text-center sm:px-4 md:px-6 lg:px-8">
        <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Didn't receive the email? </span>
        <button
          type="button"
          onClick={handleResendVerification}
          disabled={isLoading}
          className="text-blue-400 hover:text-blue-300 font-medium disabled:opacity-50 sm:px-4 md:px-6 lg:px-8"
         aria-label="Submit">
          Resend verification
        </button>
      </div>

      <div className="text-center sm:px-4 md:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => setCurrentView('login')}
        >
          Back to login
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 sm:px-4 md:px-6 lg:px-8">
      <div className="w-full max-w-md sm:px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-xl shadow-2xl p-8 sm:px-4 md:px-6 lg:px-8"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {currentView === 'login' && <LoginView />}
              {currentView === 'register' && <RegisterView />}
              {currentView === 'forgot-password' && <ForgotPasswordView />}
              {currentView === 'verify-email' && <VerifyEmailView />}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

const ProductionLoginInterfaceWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <ProductionLoginInterface {...props} />
  </ErrorBoundary>
);

export default React.memo(ProductionLoginInterfaceWithErrorBoundary);
