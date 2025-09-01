import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  success,
  required,
  className = '',
  id,
  ...props
}: any) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const getInputClasses = () => {
    let classes = 'glass-input w-full';
    
    if (error) {
      classes += ' border-red-500 focus:border-red-500 focus:ring-red-500/20';
    } else if (success) {
      classes += ' border-green-500 focus:border-green-500 focus:ring-green-500/20';
    }
    
    return `${classes} ${className}`;
  };

  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-[var(--text-primary)]"
        >
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      <input
        id={inputId}
        className={getInputClasses()}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : success ? `${inputId}-success` : undefined}
        {...props}
      />
      
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
      
      {success && !error && (
        <p id={`${inputId}-success`} className="text-sm text-green-400">
          {success}
        </p>
      )}
    </div>
  );
};