/**
 * PinInput Component - Modern PIN entry with haptic feedback
 * Secure, accessible PIN input with visual feedback
 */

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface PinInputProps {
  value: string;
  onChange: (value: string) => void;
  onComplete?: () => void;
  length?: number;
  disabled?: boolean;
  error?: boolean;
  autoFocus?: boolean;
  masked?: boolean;
}

export const PinInput: React.FC<PinInputProps> = ({
  value,
  onChange,
  onComplete,
  length = 4,
  disabled = false,
  error = false,
  autoFocus = true,
  masked = true
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    if (value.length === length && onComplete) {
      onComplete();
    }
  }, [value, length, onComplete]);

  const handleChange = (index: number, inputValue: string) => {
    if (disabled) return;

    // Only allow digits
    const digit = inputValue.replace(/[^0-9]/g, '').slice(-1);
    
    // Update the PIN value
    const newValue = value.split('');
    newValue[index] = digit;
    const updatedValue = newValue.join('').slice(0, length);
    onChange(updatedValue);

    // Haptic feedback on input
    if (navigator.vibrate && digit) {
      navigator.vibrate(10);
    }

    // Auto-focus next input
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    // Handle backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      
      if (value[index]) {
        // Clear current digit
        const newValue = value.split('');
        newValue[index] = '';
        onChange(newValue.join(''));
      } else if (index > 0) {
        // Move to previous input and clear it
        const newValue = value.split('');
        newValue[index - 1] = '';
        onChange(newValue.join(''));
        inputRefs.current[index - 1]?.focus();
      }

      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
    }

    // Handle arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then(text => {
        const digits = text.replace(/[^0-9]/g, '').slice(0, length);
        onChange(digits);
        // Focus last input or complete input
        if (digits.length === length) {
          inputRefs.current[length - 1]?.blur();
        } else {
          inputRefs.current[digits.length]?.focus();
        }
      });
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
    // Select all text when focused
    inputRefs.current[index]?.select();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain');
    const digits = pastedData.replace(/[^0-9]/g, '').slice(0, length);
    onChange(digits);
    
    // Focus appropriate input after paste
    if (digits.length === length) {
      inputRefs.current[length - 1]?.blur();
    } else {
      inputRefs.current[digits.length]?.focus();
    }
  };

  return (
    <div className="flex justify-center space-x-2 sm:space-x-3">
      {Array.from({ length }, (_, index) => {
        const hasValue = Boolean(value[index]);
        const isFocused = focusedIndex === index;
        
        return (
          <motion.div
            key={index}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <motion.div
              animate={{
                scale: isFocused ? 1.05 : 1,
                borderColor: error ? '#ef4444' : isFocused ? '#9333ea' : '#6b7280'
              }}
              transition={{ duration: 0.2 }}
              className={`
                relative h-12 w-12 sm:h-16 sm:w-16 rounded-xl border-2 
                ${error ? 'border-red-500 bg-red-500/10' : 'border-gray-600 bg-white/10'}
                backdrop-blur-md transition-all duration-200
                ${isFocused && !error ? 'border-purple-600 shadow-lg shadow-purple-500/20' : ''}
                ${hasValue ? 'bg-white/20' : ''}
              `}
            >
              <input
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type={masked ? 'password' : 'text'}
                inputMode="numeric"
                pattern="[0-9]"
                maxLength={1}
                value={value[index] || ''}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onFocus={() => handleFocus(index)}
                onBlur={() => setFocusedIndex(null)}
                onPaste={handlePaste}
                disabled={disabled}
                className={`
                  absolute inset-0 h-full w-full bg-transparent text-center text-lg sm:text-2xl font-bold
                  text-white outline-none
                  ${masked && hasValue ? 'text-xl sm:text-3xl' : ''}
                  ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-text'}
                `}
                style={{
                  ...(masked && hasValue ? { WebkitTextSecurity: 'disc' } as any : {}),
                  caretColor: 'transparent'
                }}
                aria-label={`PIN digit ${index + 1}`}
              />
              
              {/* Visual indicator for filled state */}
              {hasValue && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15 }}
                  className="pointer-events-none absolute inset-0 flex items-center justify-center"
                >
                  {masked ? (
                    <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-white" />
                  ) : (
                    <span className="text-lg sm:text-2xl font-bold text-white">{value[index]}</span>
                  )}
                </motion.div>
              )}

              {/* Focus ring animation */}
              {isFocused && !error && (
                <motion.div
                  className="pointer-events-none absolute -inset-1 rounded-xl border-2 border-purple-400"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 0.5, scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default PinInput;