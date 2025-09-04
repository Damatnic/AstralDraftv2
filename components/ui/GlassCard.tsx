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
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 p-8">
        {children}
      </div>

      {/* Animated shimmer effect */}
      <motion.div
        className="absolute -inset-full top-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none"
        animate={{
          x: ['0%', '200%']
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 5,
          ease: 'linear'
        }}
      />
    </motion.div>
  );
};

export default GlassCard;