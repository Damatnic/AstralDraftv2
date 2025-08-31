import React from 'react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  error,
  className = '',
  id,
  ...props
}) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
      <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
        <input
          type="checkbox"
          id={checkboxId}
          className={`w-4 h-4 rounded border-2 border-white/30 bg-transparent text-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 ${className}`}
          {...props}
        />
        {label && (
          <label htmlFor={checkboxId} className="text-sm font-medium text-[var(--text-primary)] cursor-pointer sm:px-4 md:px-6 lg:px-8">
            {label}
          </label>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-400 sm:px-4 md:px-6 lg:px-8" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};