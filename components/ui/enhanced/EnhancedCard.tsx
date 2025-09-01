/**
 * Enhanced Card Component - Premium Glassmorphism with Advanced Visual Effects
 * Modern card designs with animations, hover effects, and interactive features
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback, useMemo, forwardRef, ReactNode, HTMLAttributes, useState } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { AnimatedElement, GlowEffect, ShimmerEffect } from &apos;./AnimationLibrary&apos;;

// =========================================
// TYPES & INTERFACES
// =========================================

type CardVariant = 
  | &apos;default&apos;
  | &apos;elevated&apos; 
  | &apos;bordered&apos;
  | &apos;gradient&apos;
  | &apos;glass&apos;
  | &apos;neon&apos;
  | &apos;champion&apos;
  | &apos;legend&apos;
  | &apos;danger&apos;
  | &apos;success&apos;
  | &apos;warning&apos;;

type CardSize = &apos;sm&apos; | &apos;md&apos; | &apos;lg&apos; | &apos;xl&apos;;

type CardPadding = &apos;none&apos; | &apos;sm&apos; | &apos;md&apos; | &apos;lg&apos; | &apos;xl&apos;;

interface EnhancedCardProps extends HTMLAttributes<HTMLDivElement> {
}
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
}
    variant = &apos;default&apos;,
    size = &apos;md&apos;,
    padding = &apos;md&apos;,
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
    className = &apos;&apos;,
    animationDelay = 0,
    onClick,
    ...props
  }, ref) => {
}

    const [isHovered, setIsHovered] = useState(false);

    // =========================================
    // VARIANT STYLES
    // =========================================

    const variantStyles: Record<CardVariant, string> = {
}
      default: `
        bg-glass-light border-glass-border
        ${hover ? &apos;hover:bg-glass-medium hover:border-glass-border-strong&apos; : &apos;&apos;}
      `,
      
      elevated: `
        bg-glass-medium border-glass-border
        ${shadow ? &apos;shadow-glass-strong&apos; : &apos;&apos;}
        ${hover ? &apos;hover:bg-glass-heavy hover:shadow-2xl hover:-translate-y-1&apos; : &apos;&apos;}
      `,
      
      bordered: `
        bg-transparent border-2 border-glass-border-strong
        ${hover ? &apos;hover:border-primary-500 hover:bg-glass-light&apos; : &apos;&apos;}
      `,
      
      gradient: `
        bg-gradient-to-br from-glass-medium to-glass-light 
        border-glass-border-strong
        ${hover ? &apos;hover:from-glass-heavy hover:to-glass-medium&apos; : &apos;&apos;}
      `,
      
      glass: `
        bg-glass-heavy border-glass-border-strong
        ${blur ? &apos;backdrop-blur-2xl&apos; : &apos;&apos;}
        ${hover ? &apos;hover:bg-opacity-80 hover:border-white hover:border-opacity-30&apos; : &apos;&apos;}
      `,
      
      neon: `
        bg-dark-900 border-2 border-brand-neon 
        shadow-[0_0_20px_rgba(0,255,255,0.3)]
        ${hover ? &apos;hover:shadow-[0_0_30px_rgba(0,255,255,0.5)]&apos; : &apos;&apos;}
      `,
      
      champion: `
        bg-gradient-to-br from-yellow-400 to-yellow-600 
        border-2 border-yellow-500 text-dark-900
        shadow-[0_0_30px_rgba(255,215,0,0.4)]
        ${hover ? &apos;hover:shadow-[0_0_40px_rgba(255,215,0,0.6)] hover:scale-105&apos; : &apos;&apos;}
      `,
      
      legend: `
        bg-gradient-to-br from-purple-600 to-purple-800 
        border-2 border-purple-500 text-white
        shadow-[0_0_30px_rgba(159,122,234,0.4)]
        ${hover ? &apos;hover:shadow-[0_0_40px_rgba(159,122,234,0.6)] hover:scale-105&apos; : &apos;&apos;}
      `,
      
      danger: `
        bg-gradient-to-br from-red-600 to-red-800 
        border-2 border-red-500 text-white
        shadow-[0_0_20px_rgba(239,68,68,0.3)]
        ${hover ? &apos;hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]&apos; : &apos;&apos;}
      `,
      
      success: `
        bg-gradient-to-br from-green-600 to-green-800 
        border-2 border-green-500 text-white
        shadow-[0_0_20px_rgba(34,197,94,0.3)]
        ${hover ? &apos;hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]&apos; : &apos;&apos;}
      `,
      
      warning: `
        bg-gradient-to-br from-yellow-500 to-orange-600 
        border-2 border-yellow-500 text-dark-900
        shadow-[0_0_20px_rgba(245,158,11,0.3)]
        ${hover ? &apos;hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]&apos; : &apos;&apos;}
      `
    };

    // =========================================
    // SIZE & PADDING STYLES
    // =========================================

    const sizeStyles: Record<CardSize, string> = {
}
      sm: &apos;max-w-sm&apos;,
      md: &apos;max-w-md&apos;,
      lg: &apos;max-w-lg&apos;,
      xl: &apos;max-w-xl&apos;
    };

    const paddingStyles: Record<CardPadding, string> = {
}
      none: &apos;p-0&apos;,
      sm: &apos;p-4&apos;,
      md: &apos;p-6&apos;,
      lg: &apos;p-8&apos;,
      xl: &apos;p-10&apos;
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
      ${rounded ? &apos;rounded-2xl&apos; : &apos;&apos;}
      ${interactive ? &apos;cursor-pointer&apos; : &apos;&apos;}
      ${selected ? &apos;ring-2 ring-primary-500 ring-opacity-50&apos; : &apos;&apos;}
    `;

    const classes = [
      baseClasses,
      variantStyles[variant],
      sizeStyles[size],
      paddingStyles[padding],
//       className
    ].filter(Boolean).join(&apos; &apos;);

    // =========================================
    // ENHANCED INTERACTIONS
    // =========================================

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
}
      if (onSelect) {
}
        onSelect();

      if (onClick) {
}
        onClick(e);

    };

    const motionProps = {
}
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: {
}
        duration: 0.4, 
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: animationDelay 
      },
      whileHover: hover ? { 
}
        y: -4,
        transition: { duration: 0.2, ease: "easeOut" }
      } : {},
      whileTap: interactive ? { 
}
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
        {variant === &apos;glass&apos; && (
}
          <div className="absolute inset-0 opacity-5 sm:px-4 md:px-6 lg:px-8">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-purple-600 sm:px-4 md:px-6 lg:px-8"></div>
            <div className="absolute inset-0 sm:px-4 md:px-6 lg:px-8" style={{
}
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: &apos;20px 20px&apos;
            }}></div>
          </div>
        )}

        {/* Shimmer Effect */}
        {shimmer && (
}
          <div className="absolute inset-0 pointer-events-none sm:px-4 md:px-6 lg:px-8">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10 sm:px-4 md:px-6 lg:px-8"
              style={{ backgroundSize: &apos;200% 100%&apos; }}
              animate={{ backgroundPosition: [&apos;200% 0&apos;, &apos;-200% 0&apos;] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </div>
        )}

        {/* Header */}
        {header && (
}
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
}
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
}
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
}
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

EnhancedCard.displayName = &apos;EnhancedCard&apos;;

// =========================================
// CARD COMPONENTS
// =========================================

interface CardHeaderProps {
}
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: ReactNode;

}

export const CardHeader: React.FC<CardHeaderProps> = ({
}
  children,
  className = &apos;&apos;,
  title,
  subtitle,
//   action
}: any) => {
}
  if (title || subtitle) {
}
    return (
      <div className={`flex items-start justify-between ${className}`}>
        <div>
          {title && (
}
            <h3 className="text-lg font-semibold text-white mb-1 sm:px-4 md:px-6 lg:px-8">{title}</h3>
          )}
          {subtitle && (
}
            <p className="text-sm text-neutral-400 sm:px-4 md:px-6 lg:px-8">{subtitle}</p>
          )}
        </div>
        {action && (
}
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
}
  children: ReactNode;
  className?: string;

}

export const CardBody: React.FC<CardBodyProps> = ({
}
  children,
  className = &apos;&apos;
}: any) => {
}
  return (
    <div className={`flex-1 ${className}`}>
      {children}
    </div>
  );
};

interface CardFooterProps {
}
  children: ReactNode;
  className?: string;
  justify?: &apos;start&apos; | &apos;center&apos; | &apos;end&apos; | &apos;between&apos;;

}

export const CardFooter: React.FC<CardFooterProps> = ({
}
  children,
  className = &apos;&apos;,
  justify = &apos;between&apos;
}: any) => {
}
  const justifyClasses = {
}
    start: &apos;justify-start&apos;,
    center: &apos;justify-center&apos;,
    end: &apos;justify-end&apos;,
    between: &apos;justify-between&apos;
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

interface StatCardProps extends Omit<EnhancedCardProps, &apos;children&apos;> {
}
  title: string;
  value: string | number;
  change?: number;
  changeType?: &apos;positive&apos; | &apos;negative&apos; | &apos;neutral&apos;;
  icon?: ReactNode;
  subtitle?: string;

export const StatCard: React.FC<StatCardProps> = ({
}
  title,
  value,
  change,
  changeType = &apos;neutral&apos;,
  icon,
  subtitle,
  variant = &apos;glass&apos;,
  ...props
}: any) => {
}
  const changeColors = {
}
    positive: &apos;text-success-400&apos;,
    negative: &apos;text-danger-400&apos;,
    neutral: &apos;text-neutral-400&apos;
  };

  const changeIcons = {
}
    positive: &apos;↗&apos;,
    negative: &apos;↘&apos;,
    neutral: &apos;→&apos;
  };

  return (
    <EnhancedCard variant={variant} hover glow {...props}>
      <div className="flex items-start justify-between sm:px-4 md:px-6 lg:px-8">
        <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
          <p className="text-sm font-medium text-neutral-400 mb-1 sm:px-4 md:px-6 lg:px-8">{title}</p>
          <p className="text-3xl font-bold text-white mb-1 sm:px-4 md:px-6 lg:px-8">{value}</p>
          {subtitle && (
}
            <p className="text-xs text-neutral-500 sm:px-4 md:px-6 lg:px-8">{subtitle}</p>
          )}
          {change !== undefined && (
}
            <div className={`flex items-center gap-1 text-sm mt-2 ${changeColors[changeType]}`}>
              <span>{changeIcons[changeType]}</span>
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        {icon && (
}
          <div className="text-2xl opacity-60 sm:px-4 md:px-6 lg:px-8">
            {icon}
          </div>
        )}
      </div>
    </EnhancedCard>
  );
};

interface PlayerCardProps extends Omit<EnhancedCardProps, &apos;children&apos;> {
}
  player: {
}
    name: string;
    position: string;
    team: string;
    points?: number;
    status?: &apos;active&apos; | &apos;bye&apos; | &apos;injured&apos;;
    avatar?: string;
  };
  showPoints?: boolean;
  actions?: ReactNode;

export const PlayerCard: React.FC<PlayerCardProps> = ({
}
  player,
  showPoints = true,
  actions,
  variant = &apos;glass&apos;,
  ...props
}: any) => {
}
  const statusColors = {
}
    active: &apos;bg-success-500&apos;,
    bye: &apos;bg-warning-500&apos;,
    injured: &apos;bg-danger-500&apos;
  };

  return (
    <EnhancedCard variant={variant} interactive hover {...props}>
      <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
          {player.avatar ? (
}
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
}
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
}
            <div className="text-right sm:px-4 md:px-6 lg:px-8">
              <div className="text-xl font-bold text-white sm:px-4 md:px-6 lg:px-8">{player.points}</div>
              <div className="text-xs text-neutral-400 sm:px-4 md:px-6 lg:px-8">PTS</div>
            </div>
          )}
          {actions && (
}
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
}
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4 | 6;
  gap?: &apos;sm&apos; | &apos;md&apos; | &apos;lg&apos; | &apos;xl&apos;;
  className?: string;
  staggerDelay?: number;

}

export const CardGrid: React.FC<CardGridProps> = ({
}
  children,
  columns = 3,
  gap = &apos;md&apos;,
  className = &apos;&apos;,
  staggerDelay = 0.1
}: any) => {
}
  const columnClasses = {
}
    1: &apos;grid-cols-1&apos;,
    2: &apos;grid-cols-1 md:grid-cols-2&apos;,
    3: &apos;grid-cols-1 md:grid-cols-2 lg:grid-cols-3&apos;,
    4: &apos;grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4&apos;,
    6: &apos;grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6&apos;
  };

  const gapClasses = {
}
    sm: &apos;gap-3&apos;,
    md: &apos;gap-4&apos;,
    lg: &apos;gap-6&apos;,
    xl: &apos;gap-8&apos;
  };

  return (
    <div className={`grid ${columnClasses[columns]} ${gapClasses[gap]} ${className}`}>
      {React.Children.map(children, (child, index) => (
}
        <AnimatedElement>
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
}
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