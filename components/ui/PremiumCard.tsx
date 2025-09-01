import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface PremiumCardProps extends Omit<HTMLMotionProps<"div">, 'children'> {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'stat' | 'player' | 'team';
  glowColor?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'none';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  pulse?: boolean;
  className?: string;

export const PremiumCard: React.FC<PremiumCardProps> = ({
  children,
  variant = 'default',
  glowColor = 'none',
  padding = 'md',
  hover = true,
  pulse = false,
  className = '',
  ...props
}: any) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
    xl: 'p-8 sm:p-10'
  };

  const glowColors = {
    primary: 'hover:shadow-[0_0_40px_rgba(79,110,247,0.3)]',
    secondary: 'hover:shadow-[0_0_40px_rgba(16,185,129,0.3)]',
    success: 'hover:shadow-[0_0_40px_rgba(16,185,129,0.4)]',
    danger: 'hover:shadow-[0_0_40px_rgba(239,68,68,0.3)]',
    warning: 'hover:shadow-[0_0_40px_rgba(245,158,11,0.3)]',
    none: ''
  };

  const variantClasses = {
    default: `
      glass-card
      ${hover ? 'hover:scale-[1.02] hover:-translate-y-1' : ''}
    `,
    elevated: `
      glass-panel-premium
      ${hover ? 'hover:scale-[1.01] hover:-translate-y-2' : ''}
    `,
    stat: `
      stat-card
      ${hover ? 'hover:scale-[1.02]' : ''}
    `,
    player: `
      relative overflow-hidden rounded-2xl
      bg-gradient-to-br from-dark-800/90 via-dark-900/80 to-dark-950/90
      backdrop-filter blur-xl
      border border-white/10
      ${hover ? 'hover:border-primary-500/30 hover:scale-[1.02]' : ''}
    `,
    team: `
      relative overflow-hidden rounded-2xl
      bg-gradient-to-br from-primary-900/20 via-dark-900/90 to-dark-950/95
      backdrop-filter blur-2xl
      border border-primary-500/20
      ${hover ? 'hover:border-primary-400/40 hover:scale-[1.01]' : ''}
    `
  };

  return (
    <motion.div
      className={`
        ${variantClasses[variant]}
        ${paddingClasses[padding]}
        ${glowColors[glowColor]}
        ${pulse ? 'animate-pulse-glow' : ''}
        transition-all duration-300 ease-out
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -4 } : undefined}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }}
      {...props}
    >
      {/* Premium gradient overlay */}
      {variant === 'elevated' && (
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none sm:px-4 md:px-6 lg:px-8">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 sm:px-4 md:px-6 lg:px-8" />
          <div className="absolute top-0 left-0 w-40 h-40 bg-primary-500/10 rounded-full filter blur-3xl sm:px-4 md:px-6 lg:px-8" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-secondary-500/10 rounded-full filter blur-3xl sm:px-4 md:px-6 lg:px-8" />
        </div>
      )}

      {/* Animated border gradient for player and team cards */}
      {(variant === 'player' || variant === 'team') && (
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none sm:px-4 md:px-6 lg:px-8">
          <div className="absolute inset-[-2px] rounded-2xl bg-gradient-to-r from-primary-500/20 via-secondary-500/20 to-primary-500/20 animate-gradient sm:px-4 md:px-6 lg:px-8" />
          <div className="absolute inset-0 rounded-2xl bg-dark-900 sm:px-4 md:px-6 lg:px-8" />
        </div>
      )}

      {/* Content wrapper */}
      <div className="relative z-10 sm:px-4 md:px-6 lg:px-8">
        {children}
      </div>

      {/* Noise texture overlay for premium feel */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-[0.015] sm:px-4 md:px-6 lg:px-8">
        <svg width="100%" height="100%">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>
    </motion.div>
  );
};

// Card subcomponents for better composition
export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}: any) => (
  <div className={`pb-4 mb-4 border-b border-white/10 ${className}`}>
    {children}
  </div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}: any) => (
  <h3 className={`text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent ${className}`}>
    {children}
  </h3>
);

export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}: any) => (
  <p className={`text-sm text-gray-400 mt-1 ${className}`}>
    {children}
  </p>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}: any) => (
  <div className={`${className}`}>
    {children}
  </div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}: any) => (
  <div className={`pt-4 mt-4 border-t border-white/10 ${className}`}>
    {children}
  </div>
);

// Premium stat card variant
export const StatCard: React.FC<{
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}> = ({ title, value, change, icon, trend = 'neutral' }: any) => {
  const trendColors = {
    up: 'text-emerald-400',
    down: 'text-red-400',
    neutral: 'text-gray-400'
  };

  const trendIcons = {
    up: '↑',
    down: '↓',
    neutral: '→'
  };

  return (
    <PremiumCard variant="stat" padding="md" hover glowColor={trend === 'up' ? 'success' : trend === 'down' ? 'danger' : 'none'}>
      <div className="flex items-start justify-between sm:px-4 md:px-6 lg:px-8">
        <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
          <p className="text-xs sm:text-sm text-gray-400 font-medium uppercase tracking-wider">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-bold mt-2 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            {value}
          </p>
          {change !== undefined && (
            <div className={`flex items-center gap-1 mt-2 ${trendColors[trend]}`}>
              <span className="text-lg sm:px-4 md:px-6 lg:px-8">{trendIcons[trend]}</span>
              <span className="text-sm font-semibold sm:px-4 md:px-6 lg:px-8">{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="text-3xl sm:text-4xl opacity-50">
            {icon}
          </div>
        )}
      </div>
    </PremiumCard>
  );
};