import React, { useCallback, useRef, useEffect } from &apos;react&apos;;
import { motion, HTMLMotionProps } from &apos;framer-motion&apos;;

// Card Component Props
interface CardProps extends Omit<HTMLMotionProps<"div">, &apos;children&apos;> {
}
  children: React.ReactNode;
  variant?: &apos;default&apos; | &apos;elevated&apos; | &apos;bordered&apos; | &apos;gradient&apos; | &apos;solid&apos;;
  hover?: boolean;
  padding?: &apos;xs&apos; | &apos;sm&apos; | &apos;md&apos; | &apos;lg&apos; | &apos;xl&apos; | &apos;none&apos;;
  glow?: boolean;
  glowColor?: &apos;primary&apos; | &apos;secondary&apos; | &apos;accent&apos; | &apos;danger&apos; | &apos;warning&apos;;
  interactive?: boolean;
}

// Card Header Props
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
}
  children: React.ReactNode;
  separated?: boolean;
}

// Card Title Props
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
}
  children: React.ReactNode;
  size?: &apos;sm&apos; | &apos;md&apos; | &apos;lg&apos; | &apos;xl&apos;;
}

// Card Content Props
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
}
  children: React.ReactNode;
}

// Card Footer Props
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
}
  children: React.ReactNode;
  separated?: boolean;
}

// Main Card Component
export const Card: React.FC<CardProps> = ({ 
}
  children, 
  className = &apos;&apos;, 
  variant = &apos;default&apos;,
  hover = true,
  padding = &apos;lg&apos;,
  glow = false,
  glowColor = &apos;primary&apos;,
  interactive = false,
  ...props
}: any) => {
}
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for interactive glow effect
  useEffect(() => {
}
    if (!interactive || !cardRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
}
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      cardRef.current.style.setProperty(&apos;--mouse-x&apos;, `${x}%`);
      cardRef.current.style.setProperty(&apos;--mouse-y&apos;, `${y}%`);
    };

    const card = cardRef.current;
    card.addEventListener(&apos;mousemove&apos;, handleMouseMove);
    
    return () => {
}
      card.removeEventListener(&apos;mousemove&apos;, handleMouseMove);
    };
  }, [interactive]);

  // Padding classes
  const paddingClasses = {
}
    none: &apos;&apos;,
    xs: &apos;p-3&apos;,
    sm: &apos;p-4&apos;,
    md: &apos;p-6&apos;,
    lg: &apos;p-8&apos;,
    xl: &apos;p-10&apos;
  };

  // Base styles for all cards
  const baseStyles = `
    relative overflow-hidden rounded-2xl
    transition-all duration-300 ease-out
    ${paddingClasses[padding]}
  `;

  // Variant-specific styles
  const variantStyles = {
}
    default: `
      bg-white/[0.08] backdrop-blur-xl
      border border-white/[0.15]
      shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]
      ${hover ? &apos;hover:bg-white/[0.12] hover:border-white/[0.25] hover:shadow-[0_12px_48px_0_rgba(0,0,0,0.45)]&apos; : &apos;&apos;}
    `,
    elevated: `
      bg-gradient-to-br from-white/[0.12] to-white/[0.06]
      backdrop-blur-xl border border-white/[0.18]
      shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)]
      ${hover ? &apos;hover:shadow-[0_24px_70px_-10px_rgba(0,0,0,0.6)] hover:from-white/[0.15] hover:to-white/[0.08]&apos; : &apos;&apos;}
    `,
    bordered: `
      bg-transparent
      border-2 border-white/[0.2]
      ${hover ? &apos;hover:bg-white/[0.05] hover:border-white/[0.35]&apos; : &apos;&apos;}
    `,
    gradient: `
      bg-gradient-to-br from-primary-500/[0.15] via-accent-500/[0.1] to-secondary-500/[0.15]
      backdrop-blur-xl border border-white/[0.2]
      shadow-[0_10px_40px_0_rgba(94,107,255,0.15)]
      ${hover ? &apos;hover:from-primary-500/[0.2] hover:via-accent-500/[0.15] hover:to-secondary-500/[0.2]&apos; : &apos;&apos;}
    `,
    solid: `
      bg-dark-800/90 backdrop-blur-sm
      border border-dark-700
      shadow-[0_4px_20px_0_rgba(0,0,0,0.4)]
      ${hover ? &apos;hover:bg-dark-800/95 hover:border-dark-600&apos; : &apos;&apos;}
    `
  };

  // Glow effect styles
  const glowStyles = {
}
    primary: &apos;shadow-[0_0_30px_rgba(94,107,255,0.4)]&apos;,
    secondary: &apos;shadow-[0_0_30px_rgba(16,185,129,0.4)]&apos;,
    accent: &apos;shadow-[0_0_30px_rgba(6,182,212,0.4)]&apos;,
    danger: &apos;shadow-[0_0_30px_rgba(239,68,68,0.4)]&apos;,
    warning: &apos;shadow-[0_0_30px_rgba(245,158,11,0.4)]&apos;
  };

  // Interactive glow overlay
  const InteractiveGlow = () => (
    interactive ? (
      <>
        <div 
          className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none
                     group-hover:opacity-100 sm:px-4 md:px-6 lg:px-8"
          style={{
}
            background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), 
                        rgba(94, 107, 255, 0.15) 0%, transparent 50%)`
          }}
        />
        <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-transparent via-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 sm:px-4 md:px-6 lg:px-8" />
      </>
    ) : null
  );

  // Animated border gradient
  const AnimatedBorder = () => (
    variant === &apos;gradient&apos; ? (
      <div className="absolute inset-0 rounded-2xl overflow-hidden sm:px-4 md:px-6 lg:px-8">
        <div className="absolute inset-[-2px] bg-gradient-to-r from-primary-500 via-accent-500 to-secondary-500 
                        opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-500 animate-gradient sm:px-4 md:px-6 lg:px-8" />
      </div>
    ) : null
  );

  return (
    <motion.div
      ref={cardRef}
      className={`
}
//         group
        ${baseStyles}
        ${variantStyles[variant]}
        ${glow ? glowStyles[glowColor] : &apos;&apos;}
        ${hover ? &apos;hover:-translate-y-1&apos; : &apos;&apos;}
        ${className}
      `}
      whileHover={hover ? { scale: 1.01 } : undefined}
      transition={{ duration: 0.2, ease: &apos;easeOut&apos; }}
      {...props}
    >
      <AnimatedBorder />
      <InteractiveGlow />
      <div className="relative z-10 sm:px-4 md:px-6 lg:px-8">
        {children}
      </div>
    </motion.div>
  );
};

// Card Header Component
export const CardHeader: React.FC<CardHeaderProps> = ({ 
}
  children, 
  className = &apos;&apos;, 
  separated = false,
  ...props 
}: any) => {
}
  return (
    <div 
      className={`
}
        flex flex-col space-y-1.5
        ${separated ? &apos;pb-6 mb-6 border-b border-white/10&apos; : &apos;mb-4&apos;}
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
}
  children, 
  className = &apos;&apos;,
  size = &apos;lg&apos;,
  ...props 
}: any) => {
}
  const sizeClasses = {
}
    sm: &apos;text-base&apos;,
    md: &apos;text-lg&apos;,
    lg: &apos;text-xl&apos;,
    xl: &apos;text-2xl&apos;
  };

  return (
    <h3 
      className={`
}
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
}
  children, 
  className = &apos;&apos;,
  ...props 
}: any) => {
}
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
}
  children, 
  className = &apos;&apos;, 
  ...props 
}: any) => {
}
  return (
    <div className={`${className}`} {...props}>
      {children}
    </div>
  );
};

// Card Footer Component
export const CardFooter: React.FC<CardFooterProps> = ({ 
}
  children, 
  className = &apos;&apos;,
  separated = false,
  ...props 
}: any) => {
}
  return (
    <div 
      className={`
}
        flex items-center
        ${separated ? &apos;pt-6 mt-6 border-t border-white/10&apos; : &apos;mt-6&apos;}
        ${className}
      `} 
      {...props}
    >
      {children}
    </div>
  );
};