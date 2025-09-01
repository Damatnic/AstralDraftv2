/**
 * Secure Input Component
 * Provides built-in input sanitization and security features
 */

import React, { useState, useCallback, useMemo, forwardRef, useImperativeHandle, useRef } from &apos;react&apos;;
import { sanitizeInput, SecurityValidators } from &apos;../../utils/security&apos;;

interface SecureInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, &apos;onChange&apos; | &apos;onBlur&apos;> {
}
  /** Input validation type */
  validationType?: &apos;email&apos; | &apos;password&apos; | &apos;username&apos; | &apos;teamName&apos; | &apos;text&apos; | &apos;number&apos; | &apos;url&apos;;
  
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
  
  /** Security level: &apos;standard&apos; | &apos;high&apos; */
  securityLevel?: &apos;standard&apos; | &apos;high&apos;;
}

export interface SecureInputRef {
}
  getValue: () => string;
  getSanitizedValue: () => string;
  isValid: () => boolean;
  validate: () => boolean;
  focus: () => void;
  clear: () => void;
}

const SecureInput = forwardRef<SecureInputRef, SecureInputProps>(({
}
  validationType = &apos;text&apos;,
  customValidator,
  sanitizeOnChange = true,
  showErrors = true,
  errorMessage,
  onSecureChange,
  onSecureBlur,
  maxLength = 1000,
  enableRateLimit = false,
  className = &apos;&apos;,
  securityLevel = &apos;standard&apos;,
  value: controlledValue,
  defaultValue,
  ...props
}, ref) => {
}
  const inputRef = useRef<HTMLInputElement>(null);
  const [internalValue, setInternalValue] = useState<string>(
    (controlledValue as string) || (defaultValue as string) || &apos;&apos;
  );
  const [error, setError] = useState<string>(&apos;&apos;);
  const [isValidState, setIsValidState] = useState<boolean>(true);
  const [lastChangeTime, setLastChangeTime] = useState<number>(0);

  // Determine if component is controlled
  const isControlled = controlledValue !== undefined;
  const displayValue = isControlled ? (controlledValue as string) : internalValue;

  // Rate limiting configuration
  const RATE_LIMIT_MS = 100; // Minimum time between validations

  // Validation function
  const validateInput = useCallback((value: string): { isValid: boolean; error: string } => {
}
    if (!value && props.required) {
}
      return { isValid: false, error: errorMessage || &apos;This field is required&apos; };
    }

    // Length validation
    if (value.length > maxLength) {
}
      return { isValid: false, error: `Maximum ${maxLength} characters allowed` };
    }

    // Type-specific validation
    switch (validationType) {
}
      case &apos;email&apos;:
        if (value && !SecurityValidators.isValidEmail(value)) {
}
          return { isValid: false, error: errorMessage || &apos;Please enter a valid email address&apos; };
        }
        break;
      
      case &apos;password&apos;:
        if (value && !SecurityValidators.isValidPassword(value)) {
}
          return { isValid: false, error: errorMessage || &apos;Password must be at least 8 characters with uppercase, lowercase, number, and special character&apos; };
        }
        break;
      
      case &apos;username&apos;:
        if (value && !SecurityValidators.isValidUsername(value)) {
}
          return { isValid: false, error: errorMessage || &apos;Username must be 3-20 characters, letters, numbers, and underscores only&apos; };
        }
        break;
      
      case &apos;teamName&apos;:
        if (value && !SecurityValidators.isValidTeamName(value)) {
}
          return { isValid: false, error: errorMessage || &apos;Team name must be 1-30 characters, letters, numbers, spaces, hyphens, and apostrophes only&apos; };
        }
        break;
      
      case &apos;url&apos;:
        if (value) {
}
          try {
}
            new URL(value);
          } catch {
}
            return { isValid: false, error: errorMessage || &apos;Please enter a valid URL&apos; };
          }
        }
        break;
      
      case &apos;number&apos;:
        if (value && isNaN(Number(value))) {
}
          return { isValid: false, error: errorMessage || &apos;Please enter a valid number&apos; };
        }
        break;
    }

    // Custom validation
    if (customValidator && value) {
}
      const customResult = customValidator(value);
      if (typeof customResult === &apos;string&apos;) {
}
        return { isValid: false, error: customResult };
      }
      if (!customResult) {
}
        return { isValid: false, error: errorMessage || &apos;Invalid input&apos; };
      }
    }

    return { isValid: true, error: &apos;&apos; };
  }, [validationType, customValidator, maxLength, errorMessage, props.required]);

  // Sanitize input value
  const sanitizeValue = useCallback((value: string): string => {
}
    if (securityLevel === &apos;high&apos;) {
}
      return sanitizeInput(value);
    }
    
    // Standard sanitization - just trim and basic length check
    return value.trim().substring(0, maxLength);
  }, [securityLevel, maxLength]);

  // Handle input change
  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
}
    const rawValue = event.target.value;
    const currentTime = Date.now();
    
    // Rate limiting
    if (enableRateLimit && (currentTime - lastChangeTime) < RATE_LIMIT_MS) {
}
      return;
    }

    // Sanitize value if enabled
    const sanitizedValue = sanitizeOnChange ? sanitizeValue(rawValue) : rawValue;
    
    // Update internal state for uncontrolled component
    if (!isControlled) {
}
      setInternalValue(sanitizedValue);
    }

    // Validate
    const validation = validateInput(sanitizedValue);
    setIsValidState(validation.isValid);
    setError(validation.error);
    setLastChangeTime(currentTime);

    // Call secure change callback
    if (onSecureChange) {
}
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
}
    const rawValue = event.target.value;
    const sanitizedValue = sanitizeValue(rawValue);
    
    // Validate on blur
    const validation = validateInput(sanitizedValue);
    setIsValidState(validation.isValid);
    setError(validation.error);

    // Update value if sanitization changed it and not controlled
    if (!isControlled && sanitizedValue !== rawValue) {
}
      setInternalValue(sanitizedValue);
    }

    // Call secure blur callback
    if (onSecureBlur) {
}
      onSecureBlur(sanitizedValue, validation.isValid);
    }

    // Call original onBlur if provided
    if (props.onBlur) {
}
      props.onBlur(event);
    }
  }, [sanitizeValue, validateInput, onSecureBlur, isControlled, props.onBlur]);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
}
    getValue: () => displayValue,
    getSanitizedValue: () => sanitizeValue(displayValue),
    isValid: () => isValidState,
    validate: () => {
}
      const validation = validateInput(displayValue);
      setIsValidState(validation.isValid);
      setError(validation.error);
      return validation.isValid;
    },
    focus: () => inputRef.current?.focus(),
    clear: () => {
}
      if (!isControlled) {
}
        setInternalValue(&apos;&apos;);
      }
      setError(&apos;&apos;);
      setIsValidState(true);
      if (onSecureChange) {
}
        onSecureChange(&apos;&apos;, true);
      }
    }
  }), [displayValue, sanitizeValue, validateInput, isValidState, onSecureChange, isControlled]);

  // Compute CSS classes
  const inputClasses = useMemo(() => {
}
    const baseClasses = &apos;w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors&apos;;
    const stateClasses = error && showErrors
      ? &apos;border-red-500 focus:ring-red-500 focus:border-red-500&apos;
      : &apos;border-gray-300 focus:ring-blue-500 focus:border-blue-500&apos;;
    
    return `${baseClasses} ${stateClasses} ${className}`;
  }, [error, showErrors, className]);

  return (
    <div className="w-full">
      <input
        {...props}
        ref={inputRef}
        type={validationType === &apos;password&apos; ? &apos;password&apos; : props.type || &apos;text&apos;}
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        maxLength={maxLength}
        className={inputClasses}
        autoComplete={
}
          validationType === &apos;password&apos; ? &apos;current-password&apos; :
          validationType === &apos;email&apos; ? &apos;email&apos; :
          validationType === &apos;username&apos; ? &apos;username&apos; :
          props.autoComplete
        }
        spellCheck={validationType === &apos;password&apos; ? false : props.spellCheck}
      />
      
      {error && showErrors && (
}
        <div className="mt-1 text-sm text-red-600" role="alert" aria-live="polite">
          {error}
        </div>
      )}
      
      {/* Character count for longer inputs */}
      {maxLength > 100 && displayValue.length > maxLength * 0.8 && (
}
        <div className="mt-1 text-sm text-gray-500">
          {displayValue.length}/{maxLength} characters
        </div>
      )}
    </div>
  );
});

SecureInput.displayName = &apos;SecureInput&apos;;

export default SecureInput;