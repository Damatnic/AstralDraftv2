import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  success?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  success,
  className = '',
  id,
  ...props
}: any) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-[var(--text-primary)]">
          {label}
        </label>
      )}
      
      <textarea
        id={textareaId}
        className={`glass-input w-full resize-vertical ${
          error ? 'border-red-500' : success ? 'border-green-500' : ''
        } ${className}`}
        rows={4}
        {...props}
      />
      
      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
      
      {success && !error && (
        <p className="text-sm text-green-400">
          {success}
        </p>
      )}
    </div>
  );
};