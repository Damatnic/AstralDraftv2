/**
 * Secure Input Component
 * Provides built-in input sanitization and security features
 */

import React, { useState, useCallback, useMemo, forwardRef, useImperativeHandle, useRef } from 'react';
import { sanitizeInput, SecurityValidators } from '../../utils/security';

interface SecureInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onBlur'> {
  /** Input validation type */
  validationType?: 'email' | 'password' | 'username' | 'teamName' | 'text' | 'number' | 'url';
  
  /** Custom validation function */
  customValidator?: (value: string) => boolean | string;
  
  /** Enable real-time sanitization */
  sanitizeOnChange?: boolean;
  
  /** Show validation errors */
  showErrors?: boolean;
  
  /** Custom error message */
  errorMessage?: string;
  
  /** Callback for sanitized value changes */
  onSecureChange?: (sanitizedValue: string, isValid: boolean) => void;
  
  /** Callback for blur events with validation */
  onSecureBlur?: (sanitizedValue: string, isValid: boolean) => void;
  
  /** Maximum character length */
  maxLength?: number;
  
  /** Enable rate limiting for input changes */
  enableRateLimit?: boolean;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Security level: 'standard' | 'high' */
  securityLevel?: 'standard' | 'high';
}

export interface SecureInputRef {
  getValue: () => string;
  getSanitizedValue: () => string;
  isValid: () => boolean;
  validate: () => boolean;
  focus: () => void;
  clear: () => void;
}

const SecureInput = forwardRef<SecureInputRef, SecureInputProps>(({
  validationType = 'text',
  customValidator,
  sanitizeOnChange = true,
  showErrors = true,
  errorMessage,
  onSecureChange,
  onSecureBlur,
  maxLength = 1000,
  enableRateLimit = false,
  className = '',
  securityLevel = 'standard',
  value: controlledValue,
  defaultValue,
  ...props
}, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [internalValue, setInternalValue] = useState<string>(
    (controlledValue as string) || (defaultValue as string) || ''
  );
  const [error, setError] = useState<string>('');
  const [isValidState, setIsValidState] = useState<boolean>(true);
  const [lastChangeTime, setLastChangeTime] = useState<number>(0);

  // Determine if component is controlled
  const isControlled = controlledValue !== undefined;
  const displayValue = isControlled ? (controlledValue as string) : internalValue;

  // Rate limiting configuration
  const RATE_LIMIT_MS = 100; // Minimum time between validations

  // Validation function
  const validateInput = useCallback((value: string): { isValid: boolean; error: string } => {
    if (!value && props.required) {
      return { isValid: false, error: errorMessage || 'This field is required' };
    }

    // Length validation
    if (value.length > maxLength) {
      return { isValid: false, error: `Maximum ${maxLength} characters allowed` };
    }

    // Type-specific validation
    switch (validationType) {
      case 'email':
        if (value && !SecurityValidators.isValidEmail(value)) {
          return { isValid: false, error: errorMessage || 'Please enter a valid email address' };
        }
        break;
      
      case 'password':
        if (value && !SecurityValidators.isValidPassword(value)) {
          return { isValid: false, error: errorMessage || 'Password must be at least 8 characters with uppercase, lowercase, number, and special character' };
        }
        break;
      
      case 'username':
        if (value && !SecurityValidators.isValidUsername(value)) {
          return { isValid: false, error: errorMessage || 'Username must be 3-20 characters, letters, numbers, and underscores only' };
        }
        break;
      
      case 'teamName':
        if (value && !SecurityValidators.isValidTeamName(value)) {
          return { isValid: false, error: errorMessage || 'Team name must be 1-30 characters, letters, numbers, spaces, hyphens, and apostrophes only' };
        }
        break;
      
      case 'url':
        if (value) {
          try {
            new URL(value);
          } catch {
            return { isValid: false, error: errorMessage || 'Please enter a valid URL' };
          }
        }
        break;
      
      case 'number':
        if (value && isNaN(Number(value))) {
          return { isValid: false, error: errorMessage || 'Please enter a valid number' };
        }
        break;
    }

    // Custom validation
    if (customValidator && value) {
      const customResult = customValidator(value);
      if (typeof customResult === 'string') {
        return { isValid: false, error: customResult };
      }
      if (!customResult) {
        return { isValid: false, error: errorMessage || 'Invalid input' };
      }
    }

    return { isValid: true, error: '' };
  }, [validationType, customValidator, maxLength, errorMessage, props.required]);

  // Sanitize input value
  const sanitizeValue = useCallback((value: string): string => {
    if (securityLevel === 'high') {
      return sanitizeInput(value);
    }
    
    // Standard sanitization - just trim and basic length check
    return value.trim().substring(0, maxLength);
  }, [securityLevel, maxLength]);

  // Handle input change
  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;
    const currentTime = Date.now();
    
    // Rate limiting
    if (enableRateLimit && (currentTime - lastChangeTime) < RATE_LIMIT_MS) {
      return;
    }

    // Sanitize value if enabled
    const sanitizedValue = sanitizeOnChange ? sanitizeValue(rawValue) : rawValue;
    
    // Update internal state for uncontrolled component
    if (!isControlled) {
      setInternalValue(sanitizedValue);
    }

    // Validate
    const validation = validateInput(sanitizedValue);
    setIsValidState(validation.isValid);
    setError(validation.error);
    setLastChangeTime(currentTime);

    // Call secure change callback
    if (onSecureChange) {
      onSecureChange(sanitizedValue, validation.isValid);
    }
  }, [
    sanitizeOnChange,
    sanitizeValue,
    validateInput,
    onSecureChange,
    isControlled,
    enableRateLimit,
//     lastChangeTime
  ]);

  // Handle blur event
  const handleBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;
    const sanitizedValue = sanitizeValue(rawValue);
    
    // Validate on blur
    const validation = validateInput(sanitizedValue);
    setIsValidState(validation.isValid);
    setError(validation.error);

    // Update value if sanitization changed it and not controlled
    if (!isControlled && sanitizedValue !== rawValue) {
      setInternalValue(sanitizedValue);
    }

    // Call secure blur callback
    if (onSecureBlur) {
      onSecureBlur(sanitizedValue, validation.isValid);
    }

    // Call original onBlur if provided
    if (props.onBlur) {
      props.onBlur(event);
    }
  }, [sanitizeValue, validateInput, onSecureBlur, isControlled, props.onBlur]);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    getValue: () => displayValue,
    getSanitizedValue: () => sanitizeValue(displayValue),
    isValid: () => isValidState,
    validate: () => {
      const validation = validateInput(displayValue);
      setIsValidState(validation.isValid);
      setError(validation.error);
      return validation.isValid;
    },
    focus: () => inputRef.current?.focus(),
    clear: () => {
      if (!isControlled) {
        setInternalValue('');
      }
      setError('');
      setIsValidState(true);
      if (onSecureChange) {
        onSecureChange('', true);
      }
    }
  }), [displayValue, sanitizeValue, validateInput, isValidState, onSecureChange, isControlled]);

  // Compute CSS classes
  const inputClasses = useMemo(() => {
    const baseClasses = 'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors';
    const stateClasses = error && showErrors
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500';
    
    return `${baseClasses} ${stateClasses} ${className}`;
  }, [error, showErrors, className]);

  return (
    <div className="w-full">
      <input
        {...props}
        ref={inputRef}
        type={validationType === 'password' ? 'password' : props.type || 'text'}
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        maxLength={maxLength}
        className={inputClasses}
        autoComplete={
          validationType === 'password' ? 'current-password' :
          validationType === 'email' ? 'email' :
          validationType === 'username' ? 'username' :
          props.autoComplete
        }
        spellCheck={validationType === 'password' ? false : props.spellCheck}
      />
      
      {error && showErrors && (
        <div className="mt-1 text-sm text-red-600" role="alert" aria-live="polite">
          {error}
        </div>
      )}
      
      {/* Character count for longer inputs */}
      {maxLength > 100 && displayValue.length > maxLength * 0.8 && (
        <div className="mt-1 text-sm text-gray-500">
          {displayValue.length}/{maxLength} characters
        </div>
      )}
    </div>
  );
});

SecureInput.displayName = 'SecureInput';

export default SecureInput;