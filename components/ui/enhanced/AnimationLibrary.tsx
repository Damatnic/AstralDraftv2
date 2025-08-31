/**
 * Enhanced Animation Library for Astral Draft
 * Premium micro-interactions, visual effects, and motion design
 */

import React, { ReactNode, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation, useInView, Variants } from 'framer-motion';

// =========================================
// ANIMATION PRESETS
// =========================================

export const animationPresets = {
  // Entrance Animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3, ease: "easeOut" }
  },

  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  },

  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  },

  slideLeft: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  },

  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  },

  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }
  },

  bounceIn: {
    initial: { opacity: 0, scale: 0.3 },
    animate: { 
      opacity: 1, 
      scale: [0.3, 1.1, 0.9, 1.03, 1] 
    },
    exit: { opacity: 0, scale: 0.3 },
    transition: { 
      duration: 0.6, 
      ease: [0.68, -0.55, 0.265, 1.55],
      scale: {
        times: [0, 0.4, 0.6, 0.8, 1],
        ease: "easeOut"
      }
    }
  },

  flipIn: {
    initial: { opacity: 0, rotateY: -90 },
    animate: { opacity: 1, rotateY: 0 },
    exit: { opacity: 0, rotateY: 90 },
    transition: { duration: 0.6, ease: "easeOut" }
  },

  // Hover Animations
  lift: {
    whileHover: { 
      y: -8, 
      transition: { duration: 0.2, ease: "easeOut" } 
    },
    whileTap: { 
      y: -4, 
      transition: { duration: 0.1 } 
    }
  },

  scale: {
    whileHover: { 
      scale: 1.05, 
      transition: { duration: 0.2, ease: "easeOut" } 
    },
    whileTap: { 
      scale: 0.98, 
      transition: { duration: 0.1 } 
    }
  },

  glow: {
    whileHover: {
      boxShadow: "0 0 20px rgba(79, 70, 229, 0.6), 0 0 40px rgba(79, 70, 229, 0.3)",
      transition: { duration: 0.3 }
    }
  },

  rotate: {
    whileHover: { 
      rotate: [0, -5, 5, -5, 0], 
      transition: { duration: 0.5 } 
    }
  },

  // Continuous Animations
  pulse: {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },

  float: {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },

  shimmer: {
    animate: {
      backgroundPosition: ["200% 0", "-200% 0"],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }
    }
  }
};

// =========================================
// ENHANCED ANIMATION COMPONENTS
// =========================================

interface AnimatedElementProps {
  children: ReactNode;
  animation?: keyof typeof animationPresets;
  delay?: number;
  duration?: number;
  className?: string;
  triggerOnView?: boolean;
  viewThreshold?: number;
  repeatOnView?: boolean;
}

export const AnimatedElement: React.FC<AnimatedElementProps> = ({
  children,
  animation = 'fadeIn',
  delay = 0,
  duration,
  className = '',
  triggerOnView = false,
  viewThreshold = 0.1,
  repeatOnView = false
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    threshold: viewThreshold,
    once: !repeatOnView 
  });
  const controls = useAnimation();

  const preset = animationPresets[animation];

  useEffect(() => {
    if (triggerOnView) {
      if (isInView) {
        controls.start("animate");
      } else if (repeatOnView) {
        controls.start("initial");
      }
    }
  }, [isInView, triggerOnView, repeatOnView, controls]);

  const animationProps = triggerOnView 
    ? {
        ref,
        initial: preset.initial,
        animate: controls,
        variants: {
          initial: preset.initial,
          animate: preset.animate
        }
      }
    : preset;

  return (
    <motion.div
      className={className}
      {...animationProps}
      transition={{
        ...preset.transition,
        delay,
        ...(duration && { duration })
      }}
    >
      {children}
    </motion.div>
  );
};

// =========================================
// SPECIALIZED ANIMATION COMPONENTS
// =========================================

interface StaggeredListProps {
  children: ReactNode[];
  staggerDelay?: number;
  animation?: keyof typeof animationPresets;
  className?: string;
}

export const StaggeredList: React.FC<StaggeredListProps> = ({
  children,
  staggerDelay = 0.1,
  animation = 'slideUp',
  className = ''
}) => {
  const containerVariants: Variants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: staggerDelay
      }
    }
  };

  const preset = animationPresets[animation];

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {children.map((child, index) => (
        <motion.div key={index} variants={preset}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

interface CountUpProps {
  end: number;
  start?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const CountUp: React.FC<CountUpProps> = ({
  end,
  start = 0,
  duration = 2,
  prefix = '',
  suffix = '',
  className = ''
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.3 });
  const [count, setCount] = React.useState(start);

  useEffect(() => {
    if (!isInView) return;

    const startTime = Date.now();
    const startValue = start;
    const endValue = end;
    const totalDuration = duration * 1000;

    const updateCount = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / totalDuration, 1);
      
      // Easing function
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.round(startValue + (endValue - startValue) * easedProgress);
      
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    requestAnimationFrame(updateCount);
  }, [isInView, start, end, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

interface TypewriterProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  cursor?: boolean;
  onComplete?: () => void;
}

export const Typewriter: React.FC<TypewriterProps> = ({
  text,
  speed = 50,
  delay = 0,
  className = '',
  cursor = true,
  onComplete
}) => {
  const [displayText, setDisplayText] = React.useState('');
  const [showCursor, setShowCursor] = React.useState(true);
  const [isComplete, setIsComplete] = React.useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      let index = 0;
      const interval = setInterval(() => {
        setDisplayText(text.slice(0, index + 1));
        index++;
        
        if (index >= text.length) {
          clearInterval(interval);
          setIsComplete(true);
          onComplete?.();
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [text, speed, delay, onComplete]);

  useEffect(() => {
    if (!cursor || !isComplete) return;

    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, [cursor, isComplete]);

  return (
    <span className={className}>
      {displayText}
      {cursor && (
        <span 
          className={`inline-block w-0.5 h-em bg-current ml-0.5 transition-opacity duration-100 ${
            showCursor ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </span>
  );
};

interface ParallaxProps {
  children: ReactNode;
  offset?: number;
  className?: string;
}

export const Parallax: React.FC<ParallaxProps> = ({
  children,
  offset = 50,
  className = ''
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = React.useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        setScrollY(scrollPercent * offset);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [offset]);

  return (
    <div ref={ref} className={className}>
      <motion.div
        style={{
          transform: `translateY(${scrollY}px)`
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

interface MorphingShapeProps {
  shapes: string[];
  duration?: number;
  className?: string;
}

export const MorphingShape: React.FC<MorphingShapeProps> = ({
  shapes,
  duration = 2,
  className = ''
}) => {
  const [currentShape, setCurrentShape] = React.useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentShape(prev => (prev + 1) % shapes.length);
    }, duration * 1000);

    return () => clearInterval(interval);
  }, [shapes.length, duration]);

  return (
    <motion.div
      className={className}
      animate={{
        scale: [1, 1.1, 1],
        rotate: [0, 180, 360]
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <motion.div
        key={currentShape}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.2 }}
        transition={{ duration: 0.5 }}
      >
        {shapes[currentShape]}
      </motion.div>
    </motion.div>
  );
};

// =========================================
// VISUAL EFFECTS COMPONENTS
// =========================================

interface GlowEffectProps {
  children: ReactNode;
  color?: string;
  intensity?: number;
  className?: string;
}

export const GlowEffect: React.FC<GlowEffectProps> = ({
  children,
  color = 'rgba(79, 70, 229, 0.6)',
  intensity = 20,
  className = ''
}) => {
  return (
    <motion.div
      className={className}
      whileHover={{
        boxShadow: `0 0 ${intensity}px ${color}, 0 0 ${intensity * 2}px ${color.replace('0.6', '0.3')}`
      }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

interface RippleEffectProps {
  children: ReactNode;
  color?: string;
  className?: string;
}

export const RippleEffect: React.FC<RippleEffectProps> = ({
  children,
  color = 'rgba(255, 255, 255, 0.3)',
  className = ''
}) => {
  const [ripples, setRipples] = React.useState<Array<{ x: number; y: number; id: number }>>([]);

  const createRipple = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const id = Date.now();

    setRipples(prev => [...prev, { x, y, id }]);

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id));
    }, 600);
  };

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseDown={createRipple}
    >
      {children}
      {ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            background: color
          }}
          initial={{ width: 0, height: 0, opacity: 0.7 }}
          animate={{ 
            width: 300, 
            height: 300, 
            opacity: 0,
            x: -150,
            y: -150
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
    </div>
  );
};

interface ShimmerEffectProps {
  children: ReactNode;
  className?: string;
}

export const ShimmerEffect: React.FC<ShimmerEffectProps> = ({
  children,
  className = ''
}) => {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
        backgroundSize: '200% 100%'
      }}
    >
      <motion.div
        animate={{
          backgroundPosition: ['200% 0', '-200% 0']
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
          backgroundSize: '200% 100%',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

// =========================================
// LAYOUT ANIMATION COMPONENTS
// =========================================

interface AnimatedGridProps {
  children: ReactNode[];
  columns?: number;
  gap?: number;
  staggerDelay?: number;
  className?: string;
}

export const AnimatedGrid: React.FC<AnimatedGridProps> = ({
  children,
  columns = 3,
  gap = 16,
  staggerDelay = 0.1,
  className = ''
}) => {
  const containerVariants: Variants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: staggerDelay
      }
    }
  };

  const itemVariants: Variants = {
    initial: { opacity: 0, scale: 0.8, y: 20 },
    animate: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <motion.div
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}px`
      }}
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {children.map((child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// =========================================
// LOADING ANIMATIONS
// =========================================

export const PulseLoader: React.FC<{ size?: number; color?: string }> = ({
  size = 40,
  color = '#4f46e5'
}) => {
  return (
    <div className="flex justify-center items-center space-x-2">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          style={{
            width: size / 4,
            height: size / 4,
            backgroundColor: color,
            borderRadius: '50%'
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.5, 1]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.2
          }}
        />
      ))}
    </div>
  );
};

export const SpinLoader: React.FC<{ size?: number; color?: string; thickness?: number }> = ({
  size = 40,
  color = '#4f46e5',
  thickness = 3
}) => {
  return (
    <motion.div
      style={{
        width: size,
        height: size,
        border: `${thickness}px solid rgba(79, 70, 229, 0.2)`,
        borderTop: `${thickness}px solid ${color}`,
        borderRadius: '50%'
      }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );
};

export const WaveLoader: React.FC<{ size?: number; color?: string }> = ({
  size = 40,
  color = '#4f46e5'
}) => {
  return (
    <div className="flex justify-center items-end space-x-1" style={{ height: size }}>
      {[0, 1, 2, 3, 4].map((index) => (
        <motion.div
          key={index}
          style={{
            width: size / 8,
            backgroundColor: color,
            borderRadius: '2px'
          }}
          animate={{
            height: [size / 4, size, size / 4]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.1,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

// Export all components and utilities
export {
  AnimatePresence,
  motion,
  useAnimation,
  useInView
};

export default {
  AnimatedElement,
  StaggeredList,
  CountUp,
  Typewriter,
  Parallax,
  MorphingShape,
  GlowEffect,
  RippleEffect,
  ShimmerEffect,
  AnimatedGrid,
  PulseLoader,
  SpinLoader,
  WaveLoader,
  animationPresets
};