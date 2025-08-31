/**
 * Premium Glassmorphism & Visual Effects System
 * Advanced glass morphism, neon effects, particle systems, and modern visual enhancements
 */

import React, { useRef, useEffect, useState, ReactNode, useMemo } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';

// =========================================
// TYPES & INTERFACES
// =========================================

interface GlassEffectProps {
  children: ReactNode;
  intensity?: 'light' | 'medium' | 'heavy' | 'ultra';
  tint?: string;
  border?: boolean;
  shadow?: boolean;
  className?: string;
  interactive?: boolean;
  glowOnHover?: boolean;
}

interface NeonEffectProps {
  children: ReactNode;
  color?: string;
  intensity?: 'low' | 'medium' | 'high' | 'ultra';
  flicker?: boolean;
  animate?: boolean;
  className?: string;
}

interface ParticleSystemProps {
  particleCount?: number;
  particleColor?: string;
  particleSize?: number;
  animationSpeed?: number;
  className?: string;
  interactive?: boolean;
}

interface HolographicEffectProps {
  children: ReactNode;
  speed?: number;
  intensity?: number;
  className?: string;
}

// =========================================
// PREMIUM GLASS MORPHISM COMPONENT
// =========================================

export const GlassEffect: React.FC<GlassEffectProps> = ({
  children,
  intensity = 'medium',
  tint = 'rgba(255, 255, 255, 0.1)',
  border = true,
  shadow = true,
  className = '',
  interactive = false,
  glowOnHover = false
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const intensitySettings = {
    light: {
      backdrop: 'backdrop-blur-sm',
      opacity: '0.05',
      borderOpacity: '0.1'
    },
    medium: {
      backdrop: 'backdrop-blur-md',
      opacity: '0.08',
      borderOpacity: '0.15'
    },
    heavy: {
      backdrop: 'backdrop-blur-lg',
      opacity: '0.12',
      borderOpacity: '0.2'
    },
    ultra: {
      backdrop: 'backdrop-blur-xl',
      opacity: '0.16',
      borderOpacity: '0.25'
    }
  };

  const settings = intensitySettings[intensity];

  const backgroundStyle = {
    background: `linear-gradient(135deg, 
      rgba(255, 255, 255, ${settings.opacity}) 0%, 
      rgba(255, 255, 255, ${parseFloat(settings.opacity) * 0.6}) 100%
    )`
  };

  const borderStyle = border ? {
    border: `1px solid rgba(255, 255, 255, ${settings.borderOpacity})`
  } : {};

  const shadowStyle = shadow ? {
    boxShadow: `
      0 8px 32px 0 rgba(0, 0, 0, 0.37),
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `
  } : {};

  return (
    <motion.div
      className={`
        relative rounded-2xl ${settings.backdrop} 
        transition-all duration-300 ease-out
        ${interactive ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{
        ...backgroundStyle,
        ...borderStyle,
        ...shadowStyle
      }}
      onHoverStart={() => interactive && setIsHovered(true)}
      onHoverEnd={() => interactive && setIsHovered(false)}
      whileHover={
        interactive ? {
          scale: 1.02,
          y: -2,
          transition: { duration: 0.2 }
        } : {}
      }
      whileTap={
        interactive ? {
          scale: 0.98,
          transition: { duration: 0.1 }
        } : {}
      }
    >
      {/* Enhanced Glass Effect Overlay */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: `linear-gradient(135deg, 
            rgba(255, 255, 255, 0.1) 0%,
            transparent 50%,
            rgba(255, 255, 255, 0.05) 100%
          )`
        }}
      />

      {/* Shimmer Effect on Hover */}
      <AnimatePresence>
        {isHovered && glowOnHover && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
              backgroundSize: '200% 100%'
            }}
          >
            <motion.div
              className="w-full h-full rounded-2xl"
              animate={{
                backgroundPosition: ['200% 0', '-200% 0']
              }}
              transition={{
                duration: 1.5,
                ease: "linear",
                repeat: Infinity
              }}
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                backgroundSize: '200% 100%'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

// =========================================
// NEON GLOW EFFECTS
// =========================================

export const NeonEffect: React.FC<NeonEffectProps> = ({
  children,
  color = '#00ffff',
  intensity = 'medium',
  flicker = false,
  animate = false,
  className = ''
}) => {
  const intensitySettings = {
    low: { blur: 5, spread: 2, opacity: 0.4 },
    medium: { blur: 10, spread: 4, opacity: 0.6 },
    high: { blur: 20, spread: 6, opacity: 0.8 },
    ultra: { blur: 30, spread: 8, opacity: 1 }
  };

  const settings = intensitySettings[intensity];

  const neonShadow = `
    0 0 ${settings.blur}px ${color}${Math.round(settings.opacity * 255).toString(16)},
    0 0 ${settings.blur * 2}px ${color}${Math.round(settings.opacity * 0.6 * 255).toString(16)},
    0 0 ${settings.blur * 3}px ${color}${Math.round(settings.opacity * 0.3 * 255).toString(16)}
  `;

  const flickerKeyframes = flicker ? {
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0.7 },
    '25%, 75%': { opacity: 0.9 }
  } : {};

  return (
    <motion.div
      className={`relative ${className}`}
      style={{
        color,
        textShadow: neonShadow,
        filter: `drop-shadow(${neonShadow})`
      }}
      animate={
        animate ? {
          filter: [
            `drop-shadow(${neonShadow})`,
            `drop-shadow(0 0 ${settings.blur * 1.5}px ${color})`,
            `drop-shadow(${neonShadow})`
          ]
        } : {}
      }
      transition={
        animate ? {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        } : {}
      }
    >
      {flicker && (
        <style>
          {`
            @keyframes neon-flicker {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.7; }
              25%, 75% { opacity: 0.9; }
            }
            .neon-flicker {
              animation: neon-flicker 2s infinite;
            }
          `}
        </style>
      )}
      <div className={flicker ? 'neon-flicker' : ''}>
        {children}
      </div>
    </motion.div>
  );
};

// =========================================
// PARTICLE SYSTEM
// =========================================

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  particleCount = 50,
  particleColor = '#4f46e5',
  particleSize = 2,
  animationSpeed = 1,
  className = '',
  interactive = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  const initializeParticles = (width: number, height: number) => {
    particlesRef.current = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 2 * animationSpeed,
      vy: (Math.random() - 0.5) * 2 * animationSpeed,
      life: Math.random() * 100,
      maxLife: 100 + Math.random() * 100,
      size: particleSize * (0.5 + Math.random() * 0.5)
    }));
  };

  const updateParticles = (width: number, height: number) => {
    particlesRef.current.forEach(particle => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Interactive mouse attraction
      if (interactive) {
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          particle.vx += dx * 0.0001;
          particle.vy += dy * 0.0001;
        }
      }

      // Bounce off walls
      if (particle.x < 0 || particle.x > width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > height) particle.vy *= -1;

      // Keep in bounds
      particle.x = Math.max(0, Math.min(width, particle.x));
      particle.y = Math.max(0, Math.min(height, particle.y));

      // Update life
      particle.life += 1;
      if (particle.life > particle.maxLife) {
        particle.life = 0;
        particle.x = Math.random() * width;
        particle.y = Math.random() * height;
      }
    });
  };

  const drawParticles = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    particlesRef.current.forEach(particle => {
      const opacity = 1 - (particle.life / particle.maxLife);
      
      ctx.fillStyle = particleColor + Math.floor(opacity * 255).toString(16).padStart(2, '0');
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();

      // Add glow effect
      ctx.shadowBlur = particle.size * 2;
      ctx.shadowColor = particleColor;
    });

    // Draw connections between nearby particles
    particlesRef.current.forEach((particle, i) => {
      particlesRef.current.slice(i + 1).forEach(otherParticle => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          const opacity = (1 - distance / 100) * 0.3;
          ctx.strokeStyle = particleColor + Math.floor(opacity * 255).toString(16).padStart(2, '0');
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(otherParticle.x, otherParticle.y);
          ctx.stroke();
        }
      });
    });
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    updateParticles(canvas.width, canvas.height);
    drawParticles(ctx);

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      initializeParticles(canvas.width, canvas.height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    if (interactive) {
      canvas.addEventListener('mousemove', handleMouseMove);
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        canvas.removeEventListener('mousemove', handleMouseMove);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particleCount, particleColor, particleSize, animationSpeed, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: -1 }}
    />
  );
};

// =========================================
// HOLOGRAPHIC EFFECT
// =========================================

export const HolographicEffect: React.FC<HolographicEffectProps> = ({
  children,
  speed = 8,
  intensity = 1,
  className = ''
}) => {
  return (
    <motion.div
      className={`relative ${className}`}
      style={{
        background: `
          linear-gradient(
            45deg,
            hsl(${240 * intensity}, 100%, 60%),
            hsl(${280 * intensity}, 100%, 60%),
            hsl(${320 * intensity}, 100%, 60%),
            hsl(${360 * intensity}, 100%, 60%),
            hsl(${40 * intensity}, 100%, 60%),
            hsl(${80 * intensity}, 100%, 60%),
            hsl(${120 * intensity}, 100%, 60%),
            hsl(${160 * intensity}, 100%, 60%),
            hsl(${200 * intensity}, 100%, 60%)
          )
        `,
        backgroundSize: '300% 300%'
      }}
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
      }}
      transition={{
        duration: speed,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      <div className="relative z-10 mix-blend-difference">
        {children}
      </div>
    </motion.div>
  );
};

// =========================================
// LIQUID MORPHING BACKGROUND
// =========================================

interface LiquidBackgroundProps {
  colors?: string[];
  speed?: number;
  blur?: number;
  className?: string;
}

export const LiquidBackground: React.FC<LiquidBackgroundProps> = ({
  colors = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b'],
  speed = 10,
  blur = 40,
  className = ''
}) => {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {colors.map((color, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full opacity-70"
          style={{
            width: '40%',
            height: '40%',
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            filter: `blur(${blur}px)`
          }}
          animate={{
            x: ['-20%', '120%', '-20%'],
            y: ['-20%', '120%', '-20%'],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: speed + index * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 2
          }}
        />
      ))}
    </div>
  );
};

// =========================================
// AURORA BACKGROUND
// =========================================

interface AuroraBackgroundProps {
  className?: string;
  colors?: string[];
  speed?: number;
}

export const AuroraBackground: React.FC<AuroraBackgroundProps> = ({
  className = '',
  colors = ['#4f46e5', '#06b6d4', '#10b981'],
  speed = 15
}) => {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 80% at 50% -20%, ${colors[0]}40 0%, transparent 80%),
            radial-gradient(ellipse 80% 80% at 80% 120%, ${colors[1]}40 0%, transparent 80%),
            radial-gradient(ellipse 80% 80% at 20% 120%, ${colors[2]}40 0%, transparent 80%)
          `,
          filter: 'blur(20px)'
        }}
        animate={{
          transform: ['translateY(0%) rotate(0deg)', 'translateY(-10%) rotate(5deg)', 'translateY(0%) rotate(0deg)']
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

// =========================================
// GRADIENT TEXT EFFECT
// =========================================

interface GradientTextProps {
  children: ReactNode;
  gradient?: string[];
  animate?: boolean;
  className?: string;
}

export const GradientText: React.FC<GradientTextProps> = ({
  children,
  gradient = ['#4f46e5', '#06b6d4', '#10b981'],
  animate = false,
  className = ''
}) => {
  const gradientString = `linear-gradient(135deg, ${gradient.join(', ')})`;

  return (
    <motion.span
      className={`bg-clip-text text-transparent ${className}`}
      style={{
        background: gradientString,
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        backgroundSize: animate ? '200% 200%' : '100% 100%'
      }}
      animate={animate ? {
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
      } : {}}
      transition={animate ? {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      } : {}}
    >
      {children}
    </motion.span>
  );
};

// =========================================
// FLOATING ELEMENTS
// =========================================

interface FloatingElementsProps {
  children: ReactNode[];
  speed?: number;
  range?: number;
  className?: string;
}

export const FloatingElements: React.FC<FloatingElementsProps> = ({
  children,
  speed = 3,
  range = 20,
  className = ''
}) => {
  return (
    <div className={`relative ${className}`}>
      {children.map((child, index) => (
        <motion.div
          key={index}
          animate={{
            y: [-range/2, range/2, -range/2],
            x: [-range/4, range/4, -range/4]
          }}
          transition={{
            duration: speed + index * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.2
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
};

// =========================================
// EXPORTS
// =========================================

export default {
  GlassEffect,
  NeonEffect,
  ParticleSystem,
  HolographicEffect,
  LiquidBackground,
  AuroraBackground,
  GradientText,
  FloatingElements
};