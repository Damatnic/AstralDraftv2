import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: () => void;
  visible: boolean;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 4000,
  onClose,
//   visible
}: any) => {
  useEffect(() => {
    if (visible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  const typeStyles = {
    success: 'border-green-500 bg-green-500/20',
    error: 'border-red-500 bg-red-500/20',
    warning: 'border-yellow-500 bg-yellow-500/20',
    info: 'border-blue-500 bg-blue-500/20'
  };

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4 sm:px-4 md:px-6 lg:px-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 sm:px-4 md:px-6 lg:px-8"></div>
        <span className="ml-2 sm:px-4 md:px-6 lg:px-8">Loading...</span>
      </div>
    );

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          className={`fixed top-4 right-4 z-50 glass-pane p-4 border-l-4 ${typeStyles[type]} max-w-sm`}
        >
          <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
            <span className="text-xl sm:px-4 md:px-6 lg:px-8">{icons[type]}</span>
            <p className="text-[var(--text-primary)] font-medium sm:px-4 md:px-6 lg:px-8">{message}</p>
            <button
              onClick={onClose}
              className="ml-auto text-[var(--text-secondary)] hover:text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8"
             aria-label="Action button">
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};