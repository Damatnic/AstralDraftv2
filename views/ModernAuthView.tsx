/**
 * Modern Authentication View - Astral Draft
 * Beautiful login/register interface with animations
 */

import React, { useState } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import {
}
  MailIcon,
  LockIcon,
  UserIcon,
  EyeIcon,
  EyeOffIcon,
  StarIcon,
  TrophyIcon,
  ZapIcon,
  ShieldIcon,
  ArrowRightIcon,
  CheckCircleIcon,
//   AlertCircleIcon
} from &apos;lucide-react&apos;;
import { netlifyAuth } from &apos;../services/netlifyAuthService&apos;;
import { useAppState } from &apos;../contexts/AppContext&apos;;

interface FormData {
}
  email: string;
  username: string;
  password: string;
  confirmPassword: string;

}

interface FormErrors {
}
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;}

const ModernAuthView: React.FC = () => {
}
  const { dispatch } = useAppState();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
}
    email: &apos;&apos;,
    username: &apos;&apos;,
    password: &apos;&apos;,
    confirmPassword: &apos;&apos;
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState(&apos;&apos;);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
}
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value )};
    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
}
      setErrors(prev => ({ ...prev, [name]: undefined )};

  };

  const validateForm = (): boolean => {
}
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email) {
}
      newErrors.email = &apos;Email is required&apos;;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
}
      newErrors.email = &apos;Please enter a valid email&apos;;

    // Password validation
    if (!formData.password) {
}
      newErrors.password = &apos;Password is required&apos;;
    } else if (formData.password.length < 8) {
}
      newErrors.password = &apos;Password must be at least 8 characters&apos;;

    // Register-specific validation
    if (!isLogin) {
}
      if (!formData.username) {
}
        newErrors.username = &apos;Username is required&apos;;
      } else if (formData.username.length < 3) {
}
        newErrors.username = &apos;Username must be at least 3 characters&apos;;

      if (formData.password !== formData.confirmPassword) {
}
        newErrors.confirmPassword = &apos;Passwords do not match&apos;;


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
}
    e.preventDefault();
    
    if (!validateForm()) {
}
      return;

    setIsLoading(true);
    setErrors({});
    setSuccessMessage(&apos;&apos;);

    try {
}
      if (isLogin) {
}
        const result = await netlifyAuth.login(formData.email, formData.password);
        
        if (result.success) {
}
          setSuccessMessage(&apos;Login successful! Redirecting...&apos;);
          // Update app state with authenticated user
          setTimeout(() => {
}
            const authState = netlifyAuth.getState();
            if (authState.user) {
}
              dispatch({
}
                type: &apos;LOGIN&apos;,
                payload: {
}
                  id: authState.user.id.toString(),
                  name: authState.user.username,
                  email: authState.user.email,
                  avatar: authState.user.avatarUrl || &apos;/default-avatar.png&apos;

              });

          }, 1000);
        } else {
}
          setErrors({ general: result.error || &apos;Login failed&apos; });

      } else {
}
        const result = await netlifyAuth.register(
          formData.email,
          formData.username,
          formData.password
        );
        
        if (result.success) {
}
          setSuccessMessage(&apos;Registration successful! Redirecting...&apos;);
          // Update app state with authenticated user
          setTimeout(() => {
}
            const authState = netlifyAuth.getState();
            if (authState.user) {
}
              dispatch({
}
                type: &apos;LOGIN&apos;,
                payload: {
}
                  id: authState.user.id.toString(),
                  name: authState.user.username,
                  email: authState.user.email,
                  avatar: authState.user.avatarUrl || &apos;/default-avatar.png&apos;

              });

          }, 1000);
        } else {
}
          setErrors({ general: result.error || &apos;Registration failed&apos; });


    } catch (error) {
}
      setErrors({ general: &apos;An unexpected error occurred. Please try again.&apos; });
    } finally {
}
      setIsLoading(false);

  };

  const features = [
    { icon: <TrophyIcon className="w-5 h-5" />, text: &apos;Win championships&apos; },
    { icon: <ZapIcon className="w-5 h-5" />, text: &apos;AI-powered insights&apos; },
    { icon: <ShieldIcon className="w-5 h-5" />, text: &apos;Secure & reliable&apos; },
    { icon: <StarIcon className="w-5 h-5" />, text: &apos;Premium experience&apos; }
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[var(--color-primary)]/5 via-transparent to-[var(--color-secondary)]/5">
      {/* Left Panel - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center">
                <StarIcon className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">Astral Draft</span>
            </div>
            <p className="text-[var(--text-secondary)]">
              {isLogin ? &apos;Welcome back, champion!&apos; : &apos;Join the elite fantasy league&apos;}
            </p>
          </div>

          {/* Success Message */}
          <AnimatePresence>
            {successMessage && (
}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2"
              >
                <CheckCircleIcon className="w-5 h-5 text-green-500" />
                <span className="text-green-500">{successMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          <AnimatePresence>
            {errors.general && (
}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2"
              >
                <AlertCircleIcon className="w-5 h-5 text-red-500" />
                <span className="text-red-500">{errors.general}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Auth Form */}
          <form onSubmit={handleSubmit}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
}
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Username Field (Register only) */}
            <AnimatePresence>
              {!isLogin && (
}
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: &apos;auto&apos; }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-sm font-medium mb-2">Username</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange} focus:border-[var(--primary)] focus:outline-none transition-colors`}
                      placeholder="Choose a username"
                    />
                  </div>
                  {errors.username && (
}
                    <p className="mt-1 text-sm text-red-500">{errors.username}</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
                <input
                  type={showPassword ? &apos;text&apos; : &apos;password&apos;}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange} focus:border-[var(--primary)] focus:outline-none transition-colors`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
}
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field (Register only) */}
            <AnimatePresence>
              {!isLogin && (
}
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: &apos;auto&apos; }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-sm font-medium mb-2">Confirm Password</label>
                  <div className="relative">
                    <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
                    <input
                      type={showPassword ? &apos;text&apos; : &apos;password&apos;}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange} focus:border-[var(--primary)] focus:outline-none transition-colors`}
                      placeholder="Confirm your password"
                    />
                  </div>
                  {errors.confirmPassword && (
}
                    <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass-button-primary w-full py-3 px-4 font-semibold flex items-center justify-center gap-2"
            >
              {isLoading ? (
}
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isLogin ? &apos;Sign In&apos; : &apos;Create Account&apos;}</span>
                  <ArrowRightIcon className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Toggle Auth Mode */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[var(--text-secondary)]">
              {isLogin ? "Don&apos;t have an account?" : &apos;Already have an account?&apos;}
              <button
                onClick={() => {
}
                  setIsLogin(!isLogin);
                  setErrors({}
                  setFormData({ email: &apos;&apos;, username: &apos;&apos;, password: &apos;&apos;, confirmPassword: &apos;&apos; });
                }}
                className="ml-1 text-[var(--primary)] hover:underline font-medium"
              >
                {isLogin ? &apos;Sign up&apos; : &apos;Sign in&apos;}
              </button>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right Panel - Features */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-8 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]">
        <div className="max-w-md text-white">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold mb-6"
          >
            Dominate Your League
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg mb-8 text-white/90"
          >
            Join thousands of fantasy football enthusiasts using AI-powered insights to build championship teams.
          </motion.p>

          <div className="space-y-4">
            {features.map((feature, index) => (
}
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="p-2 rounded-lg bg-white/20 backdrop-blur">
                  {feature.icon}
                </div>
                <span className="text-lg">{feature.text}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 p-6 rounded-xl bg-white/10 backdrop-blur border border-white/20"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i: any) => (
}
                  <div key={i} className="w-8 h-8 rounded-full bg-white/30 border-2 border-white" />
                ))}
              </div>
              <span className="text-sm">+2,847 managers</span>
            </div>
            <p className="text-sm text-white/80">
              Join the community of winning fantasy managers today!
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ModernAuthView;