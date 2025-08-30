import React, { useRef, useEffect } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

// Card Component Props
interface CardProps extends Omit<HTMLMotionProps<"div">, 'children'> {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'bordered' | 'gradient' | 'solid';
  hover?: boolean;
  padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none';
  glow?: boolean;
  glowColor?: 'primary' | 'secondary' | 'accent' | 'danger' | 'warning';
  interactive?: boolean;
}

// Card Header Props
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  separated?: boolean;
}

// Card Title Props
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Card Content Props
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

// Card Footer Props
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  separated?: boolean;
}

// Main Card Component
export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  variant = 'default',
  hover = true,
  padding = 'lg',
  glow = false,
  glowColor = 'primary',
  interactive = false,
  ...props
}: any) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for interactive glow effect
  useEffect(() => {
    if (!interactive || !cardRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      cardRef.current.style.setProperty('--mouse-x', `${x}%`);
      cardRef.current.style.setProperty('--mouse-y', `${y}%`);
    };

    const card = cardRef.current;
    card.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
    };
  }, [interactive]);

  // Padding classes
  const paddingClasses = {
    none: '',
    xs: 'p-3',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  // Base styles for all cards
  const baseStyles = `
    relative overflow-hidden rounded-2xl
    transition-all duration-300 ease-out
    ${paddingClasses[padding]}
  `;

  // Variant-specific styles
  const variantStyles = {
    default: `
      bg-white/[0.08] backdrop-blur-xl
      border border-white/[0.15]
      shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]
      ${hover ? 'hover:bg-white/[0.12] hover:border-white/[0.25] hover:shadow-[0_12px_48px_0_rgba(0,0,0,0.45)]' : ''}
    `,
    elevated: `
      bg-gradient-to-br from-white/[0.12] to-white/[0.06]
      backdrop-blur-xl border border-white/[0.18]
      shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)]
      ${hover ? 'hover:shadow-[0_24px_70px_-10px_rgba(0,0,0,0.6)] hover:from-white/[0.15] hover:to-white/[0.08]' : ''}
    `,
    bordered: `
      bg-transparent
      border-2 border-white/[0.2]
      ${hover ? 'hover:bg-white/[0.05] hover:border-white/[0.35]' : ''}
    `,
    gradient: `
      bg-gradient-to-br from-primary-500/[0.15] via-accent-500/[0.1] to-secondary-500/[0.15]
      backdrop-blur-xl border border-white/[0.2]
      shadow-[0_10px_40px_0_rgba(94,107,255,0.15)]
      ${hover ? 'hover:from-primary-500/[0.2] hover:via-accent-500/[0.15] hover:to-secondary-500/[0.2]' : ''}
    `,
    solid: `
      bg-dark-800/90 backdrop-blur-sm
      border border-dark-700
      shadow-[0_4px_20px_0_rgba(0,0,0,0.4)]
      ${hover ? 'hover:bg-dark-800/95 hover:border-dark-600' : ''}
    `
  };

  // Glow effect styles
  const glowStyles = {
    primary: 'shadow-[0_0_30px_rgba(94,107,255,0.4)]',
    secondary: 'shadow-[0_0_30px_rgba(16,185,129,0.4)]',
    accent: 'shadow-[0_0_30px_rgba(6,182,212,0.4)]',
    danger: 'shadow-[0_0_30px_rgba(239,68,68,0.4)]',
    warning: 'shadow-[0_0_30px_rgba(245,158,11,0.4)]'
  };

  // Interactive glow overlay
  const InteractiveGlow = () => (
    interactive ? (
      <>
        <div 
          className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none
                     group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), 
                        rgba(94, 107, 255, 0.15) 0%, transparent 50%)`
          }}
        />
        <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-transparent via-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </>
    ) : null
  );

  // Animated border gradient
  const AnimatedBorder = () => (
    variant === 'gradient' ? (
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <div className="absolute inset-[-2px] bg-gradient-to-r from-primary-500 via-accent-500 to-secondary-500 
                        opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-500 animate-gradient" />
      </div>
    ) : null
  );

  return (
    <motion.div
      ref={cardRef}
      className={`
        group
        ${baseStyles}
        ${variantStyles[variant]}
        ${glow ? glowStyles[glowColor] : ''}
        ${hover ? 'hover:-translate-y-1' : ''}
        ${className}
      `}
      whileHover={hover ? { scale: 1.01 } : undefined}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      {...props}
    >
      <AnimatedBorder />
      <InteractiveGlow />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

// Card Header Component
export const CardHeader: React.FC<CardHeaderProps> = ({ 
  children, 
  className = '', 
  separated = false,
  ...props 
}: any) => {
  return (
    <div 
      className={`
        flex flex-col space-y-1.5
        ${separated ? 'pb-6 mb-6 border-b border-white/10' : 'mb-4'}
        ${className}
      `} 
      {...props}
    >
      {children}
    </div>
  );
};

// Card Title Component
export const CardTitle: React.FC<CardTitleProps> = ({ 
  children, 
  className = '',
  size = 'lg',
  ...props 
}: any) => {
  const sizeClasses = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl'
  };

  return (
    <h3 
      className={`
        font-bold tracking-tight text-white
        ${sizeClasses[size]}
        ${className}
      `} 
      {...props}
    >
      {children}
    </h3>
  );
};

// Card Description Component
export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ 
  children, 
  className = '',
  ...props 
}: any) => {
  return (
    <p 
      className={`text-sm text-gray-400 ${className}`} 
      {...props}
    >
      {children}
    </p>
  );
};

// Card Content Component
export const CardContent: React.FC<CardContentProps> = ({ 
  children, 
  className = '', 
  ...props 
}: any) => {
  return (
    <div className={`${className}`} {...props}>
      {children}
    </div>
  );
};

// Card Footer Component
export const CardFooter: React.FC<CardFooterProps> = ({ 
  children, 
  className = '',
  separated = false,
  ...props 
}: any) => {
  return (
    <div 
      className={`
        flex items-center
        ${separated ? 'pt-6 mt-6 border-t border-white/10' : 'mt-6'}
        ${className}
      `} 
      {...props}
    >
      {children}
    </div>
  );
};