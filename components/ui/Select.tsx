import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  className = '',
  id,
  ...props
}: any) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-[var(--text-primary)]">
          {label}
        </label>
      )}
      
      <select
        id={selectId}
        className={`glass-input w-full ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      >
        {options.map((option: any) => (
          <option key={option.value} value={option.value} className="bg-[var(--color-bg-primary)] text-white">
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};