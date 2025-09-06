/**
 * GlassCard Component - Glassmorphism effect card
 * Premium glass-like appearance with blur and transparency
 */

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  intensity?: 'light' | 'medium' | 'strong';
  blur?: 'sm' | 'md' | 'lg' | 'xl';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  intensity = 'medium',
  blur = 'md',
  ...motionProps
}) => {
  const intensityClasses = {
    light: 'bg-white/5 border-white/10',
    medium: 'bg-white/10 border-white/20',
    strong: 'bg-white/20 border-white/30'
  };

  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl'
  };

  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-2xl border
        ${intensityClasses[intensity]}
        ${blurClasses[blur]}
        shadow-2xl
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      {...motionProps}
    >
      {/* Content */}
      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        {children}
      </div>
    </motion.div>
  );
};

export default GlassCard;