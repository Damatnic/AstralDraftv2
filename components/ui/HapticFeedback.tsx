/**
 * HapticFeedback Component - Wrapper for haptic feedback interactions
 * Provides tactile feedback for enhanced user experience
 */

import React, { useCallback } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface HapticFeedbackProps extends Omit<HTMLMotionProps<"div">, 'onTap' | 'onHoverStart'> {
  children: React.ReactNode;
  intensity?: 'light' | 'medium' | 'strong';
  duration?: number | number[];
  pattern?: number[];
  enableTapHaptic?: boolean;
  enableHoverHaptic?: boolean;
  className?: string;
}

export const HapticFeedback: React.FC<HapticFeedbackProps> = ({
  children,
  intensity = 'light',
  duration,
  pattern,
  enableTapHaptic = true,
  enableHoverHaptic = false,
  className = '',
  ...motionProps
}) => {
  const getVibrationPattern = useCallback(() => {
    if (pattern) return pattern;
    
    switch (intensity) {
      case 'light':
        return duration || 10;
      case 'medium':
        return duration || [20, 10, 20];
      case 'strong':
        return duration || [40, 20, 40];
      default:
        return 10;
    }
  }, [intensity, duration, pattern]);

  const triggerHaptic = useCallback(() => {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(getVibrationPattern());
      } catch (error) {
        console.warn('Haptic feedback not supported:', error);
      }
    }
  }, [getVibrationPattern]);

  const handleTap = useCallback(() => {
    if (enableTapHaptic) triggerHaptic();
  }, [enableTapHaptic, triggerHaptic]);

  const handleHoverStart = useCallback(() => {
    if (enableHoverHaptic) triggerHaptic();
  }, [enableHoverHaptic, triggerHaptic]);

  return (
    <motion.div
      className={`inline-block ${className}`}
      onTap={handleTap}
      onHoverStart={handleHoverStart}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

export default HapticFeedback;