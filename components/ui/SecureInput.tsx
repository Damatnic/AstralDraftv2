/**
 * Secure Input Components
 * 
 * Provides secure password and PIN input functionality with:
 * - Password masking with customizable characters
 * - Toggle visibility with show/hide button
 * - Security features (clipboard clearing, autocomplete disabled)
 * - Accessibility features and ARIA labels
 * - Professional UI styling with visual security indicators
 * - Mobile-friendly touch interactions
 */

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EyeIcon, EyeOffIcon, ShieldCheckIcon, KeyIcon, LockIcon, AlertTriangleIcon } from 'lucide-react';

interface SecureInputBaseProps {
  label?: string;
  error?: string;
  success?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  autoFocus?: boolean;

}

interface SecurePasswordInputProps extends SecureInputBaseProps {
  type: 'password';
  value: string;
  onChange: (value: string) => void;
  maskCharacter?: string;
  showToggle?: boolean;
  clearClipboardDelay?: number;
  strengthIndicator?: boolean;
  minLength?: number;
  maxLength?: number;

interface SecurePinInputProps extends SecureInputBaseProps {
  type: 'pin';
  value: string;
  onChange: (value: string) => void;
  length?: number;
  maskCharacter?: string;
  showProgress?: boolean;
  allowPaste?: boolean;
  clearClipboardDelay?: number;

type SecureInputProps = SecurePasswordInputProps | SecurePinInputProps;

// Password strength calculation
const calculatePasswordStrength = (password: string): { score: number; feedback: string; color: string } => {
  let score = 0;
  const feedback: string[] = [];
  
  if (password.length >= 8) score += 1;
  else feedback.push('At least 8 characters');
  
  if (password.length >= 12) score += 1;
  
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Lowercase letter');
  
  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Uppercase letter');
  
  if (/[0-9]/.test(password)) score += 1;
  else feedback.push('Number');
  
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  else feedback.push('Special character');
  
  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a'];
  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  
  return {
    score,
    feedback: feedback.length > 0 ? `Need: ${feedback.join(', ')}` : labels[Math.min(score, 5)],
    color: colors[Math.min(Math.floor(score * 0.8), 4)]
  };
};

// Security indicator component
const SecurityIndicator: React.FC<{ level: 'high' | 'medium' | 'low' }> = ({ level }) => {
  const configs = {
    high: { icon: ShieldCheckIcon, color: 'text-green-400', bg: 'bg-green-500/20', label: 'Secure' },
    medium: { icon: KeyIcon, color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'Protected' },
    low: { icon: AlertTriangleIcon, color: 'text-orange-400', bg: 'bg-orange-500/20', label: 'Basic' }
  };
  
  const config = configs[level];
  const IconComponent = config.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${config.bg} border border-current/30`}
    >
      <IconComponent className={`w-3 h-3 ${config.color}`} />
      <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
    </motion.div>
  );
};

// Progress dots for PIN input
const PinProgress: React.FC<{ current: number; total: number; filled: boolean[] }> = ({ current, total, filled }) => (
  <div className="flex justify-center gap-2 mt-3 sm:px-4 md:px-6 lg:px-8">
    {Array.from({ length: total }, (_, i) => (
      <motion.div
        key={i}
        className={`w-3 h-3 rounded-full transition-all duration-200 ${
          filled[i] ? 'bg-primary-500 shadow-lg shadow-primary-500/50' : 'bg-white/20 border border-white/30'
        }`}
        animate={{
          scale: i === current - 1 ? [1, 1.2, 1] : 1,
          opacity: filled[i] ? 1 : 0.5
        }}
        transition={{ duration: 0.2 }}
      />
    ))}
  </div>
);

export const SecureInput: React.FC<SecureInputProps> = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasBeenFocused, setHasBeenFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const clearTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const inputId = props.id || `secure-input-${Math.random().toString(36).substr(2, 9)}`;
  
  // Clear clipboard after paste operations
  const clearClipboard = useCallback(() => {
    const delay = props.type === 'password' 
      ? (props as SecurePasswordInputProps).clearClipboardDelay || 5000
      : (props as SecurePinInputProps).clearClipboardDelay || 3000;
    
    if (clearTimeoutRef.current) {
      clearTimeout(clearTimeoutRef.current);

    clearTimeoutRef.current = setTimeout(() => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText('').catch(() => {
          // Silently fail if clipboard access is denied
        });

    }, delay);
  }, [props.type]);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    if (props.type === 'pin') {
      const pinProps = props as SecurePinInputProps;
      // Only allow numbers for PIN
      value = value.replace(/\D/g, '').slice(0, pinProps.length || 4);
    } else if (props.type === 'password') {
      const passwordProps = props as SecurePasswordInputProps;
      if (passwordProps.maxLength) {
        value = value.slice(0, passwordProps.maxLength);


    props.onChange(value);
  };
  
  // Handle paste events
  const handlePaste = (e: React.ClipboardEvent) => {
    if (props.type === 'pin' && !(props as SecurePinInputProps).allowPaste) {
      e.preventDefault();
      return;

    clearClipboard();
  };
  
  // Handle focus events
  const handleFocus = () => {
    setIsFocused(true);
    setHasBeenFocused(true);
    props.onFocus?.();
  };
  
  const handleBlur = () => {
    setIsFocused(false);
    props.onBlur?.();
  };
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (clearTimeoutRef.current) {
        clearTimeout(clearTimeoutRef.current);

    };
  }, []);
  
  // Calculate password strength
  const passwordStrength = props.type === 'password' && (props as SecurePasswordInputProps).strengthIndicator
    ? calculatePasswordStrength(props.value)
    : null;
  
  // Determine security level
  const getSecurityLevel = (): 'high' | 'medium' | 'low' => {
    if (props.type === 'pin') {
      return props.value.length >= (props as SecurePinInputProps).length! * 0.75 ? 'high' : 'medium';
    } else {
      const strength = passwordStrength?.score || 0;
      return strength >= 4 ? 'high' : strength >= 2 ? 'medium' : 'low';

  };
  
  // Base input classes
  const getInputClasses = () => {
    const baseClasses = `
      w-full px-4 py-3 rounded-xl
      bg-white/5 backdrop-blur-sm border-2
      text-white placeholder-gray-400
      focus:outline-none focus:ring-0
      transition-all duration-300
      font-mono tracking-wider
      ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}
    `;
    
    let stateClasses = '';
    if (props.error) {
      stateClasses = 'border-red-500/50 focus:border-red-500 bg-red-500/5';
    } else if (props.success) {
      stateClasses = 'border-green-500/50 focus:border-green-500 bg-green-500/5';
    } else if (isFocused) {
      stateClasses = 'border-primary-500/70 focus:border-primary-500 bg-primary-500/5 shadow-lg shadow-primary-500/20';
    } else {
      stateClasses = 'border-white/20 hover:border-white/30';

    return `${baseClasses} ${stateClasses} ${props.className || ''}`;
  };
  
  // PIN-specific rendering
  if (props.type === 'pin') {
    const pinProps = props as SecurePinInputProps;
    const pinLength = pinProps.length || 4;
    const maskChar = pinProps.maskCharacter || '•';
    const filled = Array.from({ length: pinLength }, (_, i) => i < props.value.length);
    
    return (
      <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
        {props.label && (
          <label 
            htmlFor={inputId}
            className="flex items-center gap-2 text-sm font-medium text-white sm:px-4 md:px-6 lg:px-8"
          >
            <LockIcon className="w-4 h-4 text-primary-400 sm:px-4 md:px-6 lg:px-8" />
            {props.label}
            {props.required && <span className="text-red-400 sm:px-4 md:px-6 lg:px-8">*</span>}
          </label>
        )}
        
        <div className="relative sm:px-4 md:px-6 lg:px-8">
          <input
            ref={inputRef}
            id={inputId}
            type={showPassword ? 'text' : 'password'}
            value={showPassword ? props.value : props.value.replace(/./g, maskChar)}
            onChange={handleChange}
            onFocus={handleFocus}
            className={getInputClasses()}
            placeholder={props.placeholder || `Enter ${pinLength}-digit PIN`}
            maxLength={pinLength}
            autoComplete="new-password"
            autoFocus={props.autoFocus}
            disabled={props.disabled}
            inputMode="numeric"
            pattern="[0-9]*"
            aria-invalid={props.error ? 'true' : 'false'}
            aria-describedby={props.error ? `${inputId}-error` : undefined}
            aria-label={`Secure PIN input, ${props.value.length} of ${pinLength} digits entered`}
          />
          
          {/* Security indicator */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 sm:px-4 md:px-6 lg:px-8">
            <SecurityIndicator level={getSecurityLevel()} />
          </div>
        </div>
        
        {/* Progress indicator */}
        {pinProps.showProgress && (
          <PinProgress 
            current={props.value.length} 
            total={pinLength} 
            filled={filled} 
          />
        )}
        
        {/* Error/Success messages */}
        <AnimatePresence mode="wait">
          {props.error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20 sm:px-4 md:px-6 lg:px-8"
            >
              <AlertTriangleIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
              <span>{props.error}</span>
            </motion.div>
          )}
          
          {props.success && !props.error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 text-green-400 text-sm bg-green-500/10 px-3 py-2 rounded-lg border border-green-500/20 sm:px-4 md:px-6 lg:px-8"
            >
              <ShieldCheckIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
              <span>{props.success}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );

  // Password input rendering
  const passwordProps = props as SecurePasswordInputProps;
  const maskChar = passwordProps.maskCharacter || '•';
  const showToggleButton = passwordProps.showToggle !== false;
  
  return (
    <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
      {props.label && (
        <label 
          htmlFor={inputId}
          className="flex items-center gap-2 text-sm font-medium text-white sm:px-4 md:px-6 lg:px-8"
        >
          <KeyIcon className="w-4 h-4 text-primary-400 sm:px-4 md:px-6 lg:px-8" />
          {props.label}
          {props.required && <span className="text-red-400 sm:px-4 md:px-6 lg:px-8">*</span>}
        </label>
      )}
      
      <div className="relative sm:px-4 md:px-6 lg:px-8">
        <input
          ref={inputRef}
          id={inputId}
          type={showPassword ? 'text' : 'password'}
          value={showPassword ? props.value : props.value.replace(/./g, maskChar)}
          onChange={handleChange}
          onFocus={handleFocus}
          className={`${getInputClasses()} ${showToggleButton ? 'pr-20' : 'pr-16'}`}
          placeholder={props.placeholder || 'Enter secure password'}
          minLength={passwordProps.minLength}
          maxLength={passwordProps.maxLength}
          autoComplete="new-password"
          autoFocus={props.autoFocus}
          disabled={props.disabled}
          aria-invalid={props.error ? 'true' : 'false'}
          aria-describedby={props.error ? `${inputId}-error` : undefined}
          aria-label="Secure password input"
        />
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
          {/* Security indicator */}
          <SecurityIndicator level={getSecurityLevel()} />
          
          {/* Toggle visibility button */}
          {showToggleButton && (
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors sm:px-4 md:px-6 lg:px-8"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {showPassword ? (
                <EyeOffIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
              ) : (
                <EyeIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
              )}
            </motion.button>
          )}
        </div>
      </div>
      
      {/* Password strength indicator */}
      {passwordStrength && hasBeenFocused && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-2 sm:px-4 md:px-6 lg:px-8"
        >
          <div className="flex items-center justify-between text-xs sm:px-4 md:px-6 lg:px-8">
            <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Password Strength</span>
            <span style={{ color: passwordStrength.color }}>{passwordStrength.feedback}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 sm:px-4 md:px-6 lg:px-8">
            <motion.div
              className="h-2 rounded-full transition-all duration-300 sm:px-4 md:px-6 lg:px-8"
              style={{ backgroundColor: passwordStrength.color }}
              initial={{ width: 0 }}
              animate={{ width: `${(passwordStrength.score / 6) * 100}%` }}
            />
          </div>
        </motion.div>
      )}
      
      {/* Error/Success messages */}
      <AnimatePresence mode="wait">
        {props.error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20 sm:px-4 md:px-6 lg:px-8"
          >
            <AlertTriangleIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
            <span>{props.error}</span>
          </motion.div>
        )}
        
        {props.success && !props.error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-green-400 text-sm bg-green-500/10 px-3 py-2 rounded-lg border border-green-500/20 sm:px-4 md:px-6 lg:px-8"
          >
            <ShieldCheckIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
            <span>{props.success}</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Security tips */}
      {isFocused && !props.value && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-gray-400 space-y-1 bg-white/5 p-3 rounded-lg border border-white/10 sm:px-4 md:px-6 lg:px-8"
        >
          <div className="font-medium text-gray-300 mb-2 sm:px-4 md:px-6 lg:px-8">Security Tips:</div>
          <div className="grid grid-cols-1 gap-1 sm:px-4 md:px-6 lg:px-8">
            <div>• Use at least 8 characters</div>
            <div>• Include uppercase and lowercase letters</div>
            <div>• Add numbers and special characters</div>
            <div>• Avoid common words or patterns</div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Convenience exports
export const SecurePasswordInput: React.FC<SecurePasswordInputProps> = (props) => (
  <SecureInput {...props} type="password" />
);

export const SecurePinInput: React.FC<SecurePinInputProps> = (props) => (
  <SecureInput {...props} type="pin" />
);

const SecureInputWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <SecureInput {...props} />
  </ErrorBoundary>
);

export default React.memo(SecureInputWithErrorBoundary);