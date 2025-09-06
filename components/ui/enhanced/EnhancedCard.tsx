/**
 * Enhanced Card Component - Premium Glassmorphism with Advanced Visual Effects
 * Modern card designs with animations, hover effects, and interactive features
 */

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useCallback, useMemo, forwardRef, ReactNode, HTMLAttributes, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedElement, GlowEffect, ShimmerEffect } from './AnimationLibrary';

// =========================================
// TYPES & INTERFACES
// =========================================

type CardVariant = 
  | 'default'
  | 'elevated' 
  | 'bordered'
  | 'gradient'
  | 'glass'
  | 'neon'
  | 'champion'
  | 'legend'
  | 'danger'
  | 'success'
  | 'warning';

type CardSize = 'sm' | 'md' | 'lg' | 'xl';

type CardPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

interface EnhancedCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  size?: CardSize;
  padding?: CardPadding;
  interactive?: boolean;
  hover?: boolean;
  glow?: boolean;
  shimmer?: boolean;
  rounded?: boolean;
  shadow?: boolean;
  blur?: boolean;
  loading?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  animationDelay?: number;

// =========================================
// CARD COMPONENT
// =========================================

export const EnhancedCard = forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({
    variant = 'default',
    size = 'md',
    padding = 'md',
    interactive = false,
    hover = true,
    glow = false,
    shimmer = false,
    rounded = true,
    shadow = true,
    blur = true,
    loading = false,
    selected = false,
    onSelect,
    header,
    footer,
    children,
    className = '',
    animationDelay = 0,
    onClick,
    ...props
  }, ref) => {

    const [isHovered, setIsHovered] = useState(false);

    // =========================================
    // VARIANT STYLES
    // =========================================

    const variantStyles: Record<CardVariant, string> = {
      default: `
        bg-glass-light border-glass-border
        ${hover ? 'hover:bg-glass-medium hover:border-glass-border-strong' : ''}
      `,
      
      elevated: `
        bg-glass-medium border-glass-border
        ${shadow ? 'shadow-glass-strong' : ''}
        ${hover ? 'hover:bg-glass-heavy hover:shadow-2xl hover:-translate-y-1' : ''}
      `,
      
      bordered: `
        bg-transparent border-2 border-glass-border-strong
        ${hover ? 'hover:border-primary-500 hover:bg-glass-light' : ''}
      `,
      
      gradient: `
        bg-gradient-to-br from-glass-medium to-glass-light 
        border-glass-border-strong
        ${hover ? 'hover:from-glass-heavy hover:to-glass-medium' : ''}
      `,
      
      glass: `
        bg-glass-heavy border-glass-border-strong
        ${blur ? 'backdrop-blur-2xl' : ''}
        ${hover ? 'hover:bg-opacity-80 hover:border-white hover:border-opacity-30' : ''}
      `,
      
      neon: `
        bg-dark-900 border-2 border-brand-neon 
        shadow-[0_0_20px_rgba(0,255,255,0.3)]
        ${hover ? 'hover:shadow-[0_0_30px_rgba(0,255,255,0.5)]' : ''}
      `,
      
      champion: `
        bg-gradient-to-br from-yellow-400 to-yellow-600 
        border-2 border-yellow-500 text-dark-900
        shadow-[0_0_30px_rgba(255,215,0,0.4)]
        ${hover ? 'hover:shadow-[0_0_40px_rgba(255,215,0,0.6)] hover:scale-105' : ''}
      `,
      
      legend: `
        bg-gradient-to-br from-purple-600 to-purple-800 
        border-2 border-purple-500 text-white
        shadow-[0_0_30px_rgba(159,122,234,0.4)]
        ${hover ? 'hover:shadow-[0_0_40px_rgba(159,122,234,0.6)] hover:scale-105' : ''}
      `,
      
      danger: `
        bg-gradient-to-br from-red-600 to-red-800 
        border-2 border-red-500 text-white
        shadow-[0_0_20px_rgba(239,68,68,0.3)]
        ${hover ? 'hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]' : ''}
      `,
      
      success: `
        bg-gradient-to-br from-green-600 to-green-800 
        border-2 border-green-500 text-white
        shadow-[0_0_20px_rgba(34,197,94,0.3)]
        ${hover ? 'hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]' : ''}
      `,
      
      warning: `
        bg-gradient-to-br from-yellow-500 to-orange-600 
        border-2 border-yellow-500 text-dark-900
        shadow-[0_0_20px_rgba(245,158,11,0.3)]
        ${hover ? 'hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]' : ''}
      `
    };

    // =========================================
    // SIZE & PADDING STYLES
    // =========================================

    const sizeStyles: Record<CardSize, string> = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl'
    };

    const paddingStyles: Record<CardPadding, string> = {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-10'
    };

    // =========================================
    // LOADING SKELETON
    // =========================================

    const LoadingSkeleton = () => (
      <div className="animate-pulse sm:px-4 md:px-6 lg:px-8">
        <div className="h-4 bg-glass-border rounded w-3/4 mb-4 sm:px-4 md:px-6 lg:px-8"></div>
        <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
          <div className="h-3 bg-glass-border rounded sm:px-4 md:px-6 lg:px-8"></div>
          <div className="h-3 bg-glass-border rounded w-5/6 sm:px-4 md:px-6 lg:px-8"></div>
          <div className="h-3 bg-glass-border rounded w-4/6 sm:px-4 md:px-6 lg:px-8"></div>
        </div>
      </div>
    );

    // =========================================
    // COMBINED CLASSES
    // =========================================

    const baseClasses = `
      relative overflow-hidden
      border border-solid
      transition-all duration-300 ease-out
      ${rounded ? 'rounded-2xl' : ''}
      ${interactive ? 'cursor-pointer' : ''}
      ${selected ? 'ring-2 ring-primary-500 ring-opacity-50' : ''}
    `;

    const classes = [
      baseClasses,
      variantStyles[variant],
      sizeStyles[size],
      paddingStyles[padding],
//       className
    ].filter(Boolean).join(' ');

    // =========================================
    // ENHANCED INTERACTIONS
    // =========================================

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (onSelect) {
        onSelect();

      if (onClick) {
        onClick(e);

    };

    const motionProps = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: {
        duration: 0.4, 
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: animationDelay 
      },
      whileHover: hover ? { 
        y: -4,
        transition: { duration: 0.2, ease: "easeOut" }
      } : {},
      whileTap: interactive ? { 
        scale: 0.98,
        transition: { duration: 0.1 }
      } : {},
      onHoverStart: () => setIsHovered(true),
      onHoverEnd: () => setIsHovered(false)
    };

    // =========================================
    // CARD CONTENT
    // =========================================

    const cardContent = (
      <>
        {/* Background Pattern (optional) */}
        {variant === 'glass' && (
          <div className="absolute inset-0 opacity-5 sm:px-4 md:px-6 lg:px-8">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-purple-600 sm:px-4 md:px-6 lg:px-8"></div>
            <div className="absolute inset-0 sm:px-4 md:px-6 lg:px-8" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: '20px 20px'
            }}></div>
          </div>
        )}

        {/* Shimmer Effect */}
        {shimmer && (
          <div className="absolute inset-0 pointer-events-none sm:px-4 md:px-6 lg:px-8">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10 sm:px-4 md:px-6 lg:px-8"
              style={{ backgroundSize: '200% 100%' }}
              animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </div>
        )}

        {/* Header */}
        {header && (
          <motion.div 
            className="mb-4 pb-4 border-b border-glass-border sm:px-4 md:px-6 lg:px-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: animationDelay + 0.1 }}
          >
            {header}
          </motion.div>
        )}

        {/* Main Content */}
        <motion.div
          className="relative z-10 sm:px-4 md:px-6 lg:px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: animationDelay + 0.2 }}
        >
          {loading ? <LoadingSkeleton /> : children}
        </motion.div>

        {/* Footer */}
        {footer && (
          <motion.div 
            className="mt-4 pt-4 border-t border-glass-border sm:px-4 md:px-6 lg:px-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: animationDelay + 0.3 }}
          >
            {footer}
          </motion.div>
        )}

        {/* Hover Glow Effect */}
        <AnimatePresence>
          {isHovered && glow && (
            <motion.div
              className="absolute inset-0 pointer-events-none sm:px-4 md:px-6 lg:px-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-purple-500/20 rounded-2xl blur-xl sm:px-4 md:px-6 lg:px-8"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );

    // =========================================
    // RENDER COMPONENT
    // =========================================

    if (glow && !loading) {
      return (
        <GlowEffect className={classes}>
          <motion.div
            ref={ref}
            {...motionProps}
            onClick={handleClick}
          >
            {cardContent}
          </motion.div>
        </GlowEffect>
      );

    return (
      <motion.div
        ref={ref}
        className={classes}
        onClick={handleClick}
        {...props}
      >
        {cardContent}
      </motion.div>
    );

);

EnhancedCard.displayName = 'EnhancedCard';

// =========================================
// CARD COMPONENTS
// =========================================

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = '',
  title,
  subtitle,
//   action
}: any) => {
  if (title || subtitle) {
    return (
      <div className={`flex items-start justify-between ${className}`}>
        <div>
          {title && (
            <h3 className="text-lg font-semibold text-white mb-1 sm:px-4 md:px-6 lg:px-8">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-neutral-400 sm:px-4 md:px-6 lg:px-8">{subtitle}</p>
          )}
        </div>
        {action && (
          <div className="flex-shrink-0 ml-4 sm:px-4 md:px-6 lg:px-8">
            {action}
          </div>
        )}
      </div>
    );

  return (
    <div className={className}>
      {children}
    </div>
  );
};

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({
  children,
  className = ''
}: any) => {
  return (
    <div className={`flex-1 ${className}`}>
      {children}
    </div>
  );
};

interface CardFooterProps {
  children: ReactNode;
  className?: string;
  justify?: 'start' | 'center' | 'end' | 'between';
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = '',
  justify = 'between'
}: any) => {
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between'
  };

  return (
    <div className={`flex items-center ${justifyClasses[justify]} ${className}`}>
      {children}
    </div>
  );
};

// =========================================
// SPECIALIZED CARD VARIANTS
// =========================================

interface StatCardProps extends Omit<EnhancedCardProps, 'children'> {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: ReactNode;
  subtitle?: string;

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  subtitle,
  variant = 'glass',
  ...props
}: any) => {
  const changeColors = {
    positive: 'text-success-400',
    negative: 'text-danger-400',
    neutral: 'text-neutral-400'
  };

  const changeIcons = {
    positive: '↗',
    negative: '↘',
    neutral: '→'
  };

  return (
    <EnhancedCard variant={variant} hover glow {...props}>
      <div className="flex items-start justify-between sm:px-4 md:px-6 lg:px-8">
        <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
          <p className="text-sm font-medium text-neutral-400 mb-1 sm:px-4 md:px-6 lg:px-8">{title}</p>
          <p className="text-3xl font-bold text-white mb-1 sm:px-4 md:px-6 lg:px-8">{value}</p>
          {subtitle && (
            <p className="text-xs text-neutral-500 sm:px-4 md:px-6 lg:px-8">{subtitle}</p>
          )}
          {change !== undefined && (
            <div className={`flex items-center gap-1 text-sm mt-2 ${changeColors[changeType]}`}>
              <span>{changeIcons[changeType]}</span>
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="text-2xl opacity-60 sm:px-4 md:px-6 lg:px-8">
            {icon}
          </div>
        )}
      </div>
    </EnhancedCard>
  );
};

interface PlayerCardProps extends Omit<EnhancedCardProps, 'children'> {
  player: {
    name: string;
    position: string;
    team: string;
    points?: number;
    status?: 'active' | 'bye' | 'injured';
    avatar?: string;
  };
  showPoints?: boolean;
  actions?: ReactNode;

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  showPoints = true,
  actions,
  variant = 'glass',
  ...props
}: any) => {
  const statusColors = {
    active: 'bg-success-500',
    bye: 'bg-warning-500',
    injured: 'bg-danger-500'
  };

  return (
    <EnhancedCard variant={variant} interactive hover {...props}>
      <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
          {player.avatar ? (
            <img
              src={player.avatar}
              alt={player.name}
              className="w-12 h-12 rounded-full object-cover sm:px-4 md:px-6 lg:px-8"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold sm:px-4 md:px-6 lg:px-8">
              {player.name.charAt(0)}
            </div>
          )}
          
          <div>
            <h4 className="text-white font-semibold sm:px-4 md:px-6 lg:px-8">{player.name}</h4>
            <div className="flex items-center gap-2 text-sm sm:px-4 md:px-6 lg:px-8">
              <span className="text-neutral-400 sm:px-4 md:px-6 lg:px-8">{player.position}</span>
              <span className="text-neutral-500 sm:px-4 md:px-6 lg:px-8">•</span>
              <span className="text-neutral-400 sm:px-4 md:px-6 lg:px-8">{player.team}</span>
              {player.status && (
                <>
                  <span className="text-neutral-500 sm:px-4 md:px-6 lg:px-8">•</span>
                  <div className="flex items-center gap-1 sm:px-4 md:px-6 lg:px-8">
                    <div className={`w-2 h-2 rounded-full ${statusColors[player.status]}`}></div>
                    <span className="text-xs capitalize text-neutral-400 sm:px-4 md:px-6 lg:px-8">{player.status}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
          {showPoints && player.points !== undefined && (
            <div className="text-right sm:px-4 md:px-6 lg:px-8">
              <div className="text-xl font-bold text-white sm:px-4 md:px-6 lg:px-8">{player.points}</div>
              <div className="text-xs text-neutral-400 sm:px-4 md:px-6 lg:px-8">PTS</div>
            </div>
          )}
          {actions && (
            <div className="flex-shrink-0 sm:px-4 md:px-6 lg:px-8">
              {actions}
            </div>
          )}
        </div>
      </div>
    </EnhancedCard>
  );
};

// =========================================
// CARD GRID COMPONENT
// =========================================

interface CardGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4 | 6;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  staggerDelay?: number;
}

export const CardGrid: React.FC<CardGridProps> = ({
  children,
  columns = 3,
  gap = 'md',
  className = '',
  staggerDelay = 0.1
}: any) => {
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'
  };

  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  };

  return (
    <div className={`grid ${columnClasses[columns]} ${gapClasses[gap]} ${className}`}>
      {React.Children.map(children, (child, index) => (
        <AnimatedElement
          key={index}
          animation="slideUp"
          delay={index * staggerDelay}
//           triggerOnView
        >
          {child}
        </AnimatedElement>
      ))}
    </div>
  );
};

// =========================================
// EXPORTS
// =========================================

const EnhancedCardWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <EnhancedCard {...props} />
  </ErrorBoundary>
);

export default React.memo(EnhancedCardWithErrorBoundary);

export type {
  CardVariant,
  CardSize,
  CardPadding,
  EnhancedCardProps,
  CardHeaderProps,
  CardBodyProps,
  CardFooterProps,
  StatCardProps,
  PlayerCardProps,
//   CardGridProps
};