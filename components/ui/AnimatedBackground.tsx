/**
 * AnimatedBackground Component - Dynamic animated background
 * Creates a premium, engaging visual experience
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
  variant?: 'particles' | 'gradient' | 'mesh' | 'aurora';
  className?: string;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  variant = 'aurora',
  className = ''
}) => {
  // Generate random floating particles
  const particles = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 20 + 10
    }));
  }, []);

  if (variant === 'particles') {
    return (
      <div className={`absolute inset-0 overflow-hidden ${className}`}>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-white/10"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size
            }}
            animate={{
              y: [0, -window.innerHeight],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: 'linear',
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'gradient') {
    return (
      <div className={`absolute inset-0 ${className}`}>
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-pink-600/20"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-purple-600/20 to-teal-600/20"
          animate={{
            rotate: [360, 0],
            scale: [1.2, 1, 1.2]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      </div>
    );
  }

  if (variant === 'mesh') {
    return (
      <svg
        className={`absolute inset-0 h-full w-full ${className}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="mesh-pattern"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <motion.circle
              cx="20"
              cy="20"
              r="1"
              fill="rgba(147, 51, 234, 0.3)"
              animate={{
                r: [1, 2, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
            <motion.path
              d="M0 20 L40 20 M20 0 L20 40"
              stroke="rgba(147, 51, 234, 0.1)"
              strokeWidth="0.5"
              animate={{
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mesh-pattern)" />
      </svg>
    );
  }

  // Aurora variant (default)
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900" />
      
      {/* Animated aurora bands */}
      <motion.div
        className="absolute -inset-[100%] opacity-50"
        animate={{
          rotate: [0, 360]
        }}
        transition={{
          duration: 100,
          repeat: Infinity,
          ease: 'linear'
        }}
      >
        <motion.div
          className="h-full w-full bg-gradient-conic from-transparent via-purple-500/20 to-transparent"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </motion.div>

      <motion.div
        className="absolute -inset-[100%] opacity-30"
        animate={{
          rotate: [360, 0]
        }}
        transition={{
          duration: 120,
          repeat: Infinity,
          ease: 'linear'
        }}
      >
        <motion.div
          className="h-full w-full bg-gradient-conic from-transparent via-blue-500/20 to-transparent"
          animate={{
            scale: [1.5, 1, 1.5],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2
          }}
        />
      </motion.div>

      <motion.div
        className="absolute -inset-[100%] opacity-40"
        animate={{
          rotate: [180, 540]
        }}
        transition={{
          duration: 80,
          repeat: Infinity,
          ease: 'linear'
        }}
      >
        <motion.div
          className="h-full w-full bg-gradient-conic from-transparent via-teal-500/20 to-transparent"
          animate={{
            scale: [1.2, 1.8, 1.2],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 4
          }}
        />
      </motion.div>

      {/* Overlay gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/80" />
      
      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};

export default AnimatedBackground;