import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = '',
  size = 'md',
  showLabel = false 
}) => {
  const { theme, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: 'w-10 h-6',
    md: 'w-12 h-7',
    lg: 'w-14 h-8'
  };

  const thumbSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const translateClasses = {
    sm: theme === 'dark' ? 'translate-x-4' : 'translate-x-0.5',
    md: theme === 'dark' ? 'translate-x-5' : 'translate-x-1',
    lg: theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showLabel && (
        <span className="text-sm font-medium text-secondary">
          {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
        </span>
      )}
      
      <button
        onClick={toggleTheme}
        className={`
          relative inline-flex ${sizeClasses[size]} rounded-full p-0.5 
          transition-all duration-300 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-offset-2 
          focus:ring-blue-500 focus:ring-offset-transparent
          hover:scale-105 active:scale-95
        `}
        style={{
          backgroundColor: theme === 'dark' ? '#1075ff' : '#d1d5db',
          boxShadow: theme === 'dark' 
            ? '0 0 20px rgba(16, 117, 255, 0.3)' 
            : '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        <motion.div
          className={`
            ${thumbSizeClasses[size]} rounded-full shadow-lg transform transition-transform 
            duration-300 ease-in-out flex items-center justify-center text-xs
            ${translateClasses[size]}
          `}
          style={{
            backgroundColor: '#ffffff',
            color: theme === 'dark' ? '#1075ff' : '#f59e0b'
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          layout
        >
          {theme === 'dark' ? '🌙' : '☀️'}
        </motion.div>
      </button>
    </div>
  );
};

// Floating Theme Toggle for corners
export const FloatingThemeToggle: React.FC<{
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}> = ({ position = 'top-right' }) => {
  const { theme, toggleTheme } = useTheme();

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className={`
        fixed ${positionClasses[position]} z-50 
        w-12 h-12 rounded-full glass shadow-lg
        flex items-center justify-center text-xl
        hover:scale-110 active:scale-95
        transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-blue-500
      `}
      style={{
        backgroundColor: 'var(--glass-bg)',
        borderColor: 'var(--glass-border)',
        backdropFilter: 'var(--glass-blur)',
        boxShadow: theme === 'dark' 
          ? '0 0 25px rgba(16, 117, 255, 0.2)' 
          : '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}
      whileHover={{
        boxShadow: theme === 'dark' 
          ? '0 0 30px rgba(16, 117, 255, 0.4)' 
          : '0 6px 20px rgba(0, 0, 0, 0.15)'
      }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <motion.span
        key={theme}
        initial={{ rotate: -180, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {theme === 'dark' ? '🌙' : '☀️'}
      </motion.span>
    </motion.button>
  );
};
