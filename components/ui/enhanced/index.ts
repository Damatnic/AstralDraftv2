/**
 * Enhanced UI Component Library - Export Index
 * Professional UI/UX Excellence Edition for Astral Draft
 * All enhanced components with modern design, accessibility, and premium effects
 */

// =========================================
// ANIMATION LIBRARY
// =========================================
export {
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
} from './AnimationLibrary';

export type {
  AnimatedElementProps,
  StaggeredListProps,
  CountUpProps,
  TypewriterProps,
  ParallaxProps,
  MorphingShapeProps,
  GlowEffectProps,
  RippleEffectProps,
  ShimmerEffectProps,
  AnimatedGridProps
} from './AnimationLibrary';

// =========================================
// ENHANCED BUTTONS
// =========================================
export {
  default as EnhancedButton,
  ButtonGroup,
  FloatingActionButton
} from './EnhancedButton';

export type {
  ButtonVariant,
  ButtonSize,
  ButtonShape,
  EnhancedButtonProps,
  ButtonGroupProps,
  FloatingActionButtonProps
} from './EnhancedButton';

// =========================================
// ENHANCED CARDS
// =========================================
export {
  default as EnhancedCard,
  CardHeader,
  CardBody,
  CardFooter,
  StatCard,
  PlayerCard,
  CardGrid
} from './EnhancedCard';

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
  CardGridProps
} from './EnhancedCard';

// =========================================
// RESPONSIVE LAYOUT SYSTEM
// =========================================
export {
  default as ResponsiveLayout,
  Container,
  ResponsiveGrid,
  Show,
  Hide,
  ResponsiveText,
  ResponsiveSpacing,
  AspectRatio,
  ResponsiveImage,
  BreakpointDebugger,
  useMediaQuery,
  useBreakpoint,
  useCurrentBreakpoint,
  useViewportSize,
  useResponsiveValue,
  isMobile,
  isTablet,
  isDesktop,
  breakpoints
} from './ResponsiveLayout';

export type {
  Breakpoint,
  ContainerProps,
  GridProps,
  ShowProps,
  ResponsiveTextProps,
  ResponsiveSpacingProps,
  AspectRatioProps,
  ResponsiveImageProps
} from './ResponsiveLayout';

// =========================================
// MOBILE TOUCH SYSTEM
// =========================================
export {
  default as MobileTouchSystem,
  TouchButton,
  SwipeGesture,
  PullToRefresh,
  TouchSlider,
  TouchCardStack,
  HapticManager,
  haptic,
  useMobileScroll,
  useSafeArea
} from './MobileTouchSystem';

export type {
  TouchFeedbackOptions,
  SwipeHandlers,
  GestureConfig,
  TouchButtonProps,
  SwipeGestureProps,
  PullToRefreshProps,
  TouchSliderProps,
  TouchCardStackProps
} from './MobileTouchSystem';

// =========================================
// ACCESSIBILITY SYSTEM
// =========================================
export {
  default as AccessibilitySystem,
  AccessibilityProvider,
  useAccessibility,
  AccessibleButton,
  AccessibleInput,
  SkipLink,
  FocusTrap,
  AccessibilityPanel,
  LiveRegion
} from './AccessibilitySystem';

export type {
  AccessibilityState,
  AccessibilityActions,
  AccessibilityContextType,
  AccessibleButtonProps,
  AccessibleInputProps,
  SkipLinkProps,
  FocusTrapProps
} from './AccessibilitySystem';

// =========================================
// GLASSMORPHISM & VISUAL EFFECTS
// =========================================
export {
  default as GlassmorphismEffects,
  GlassEffect,
  NeonEffect,
  ParticleSystem,
  HolographicEffect,
  LiquidBackground,
  AuroraBackground,
  GradientText,
  FloatingElements
} from './GlassmorphismEffects';

export type {
  GlassEffectProps,
  NeonEffectProps,
  ParticleSystemProps,
  HolographicEffectProps,
  LiquidBackgroundProps,
  AuroraBackgroundProps,
  GradientTextProps,
  FloatingElementsProps
} from './GlassmorphismEffects';

// =========================================
// DASHBOARD SYSTEM
// =========================================
export {
  default as DashboardSystem,
  DashboardProvider,
  DashboardGrid,
  WidgetLibrary,
  StatWidget,
  ChartWidget,
  FeedWidget,
  useDashboard
} from './DashboardSystem';

export type {
  Widget,
  DashboardLayout,
  DashboardContextType,
  WidgetSize,
  WidgetType,
  DashboardGridProps,
  WidgetLibraryProps
} from './DashboardSystem';

// =========================================
// COMBINED EXPORTS FOR CONVENIENCE
// =========================================

// Core Enhanced Components
export const EnhancedComponents = {
  // Buttons
  Button: EnhancedButton,
  ButtonGroup,
  FloatingActionButton,
  
  // Cards
  Card: EnhancedCard,
  CardHeader,
  CardBody,
  CardFooter,
  StatCard,
  PlayerCard,
  CardGrid,
  
  // Layout
  Container,
  ResponsiveGrid,
  Show,
  Hide,
  ResponsiveText,
  AspectRatio,
  
  // Touch & Mobile
  TouchButton,
  SwipeGesture,
  PullToRefresh,
  TouchSlider,
  
  // Accessibility
  AccessibleButton,
  AccessibleInput,
  SkipLink,
  FocusTrap,
  
  // Visual Effects
  GlassEffect,
  NeonEffect,
  ParticleSystem,
  GradientText,
  
  // Animations
  AnimatedElement,
  CountUp,
  Typewriter,
  StaggeredList,
  
  // Dashboard
  DashboardGrid,
  WidgetLibrary
};

// Animation Presets for easy access
export const Animations = {
  presets: animationPresets,
  components: {
    AnimatedElement,
    StaggeredList,
    CountUp,
    Typewriter,
    Parallax,
    MorphingShape
  },
  effects: {
    GlowEffect,
    RippleEffect,
    ShimmerEffect
  },
  loaders: {
    PulseLoader,
    SpinLoader,
    WaveLoader

};

// Visual Effects Collection
export const VisualEffects = {
  glass: {
    GlassEffect,
    HolographicEffect
  },
  neon: {
    NeonEffect,
    GradientText
  },
  particles: {
    ParticleSystem,
    FloatingElements
  },
  backgrounds: {
    LiquidBackground,
    AuroraBackground

};

// Layout System
export const LayoutSystem = {
  components: {
    Container,
    ResponsiveGrid,
    Show,
    Hide,
    ResponsiveText,
    ResponsiveSpacing,
    AspectRatio,
    ResponsiveImage
  },
  hooks: {
    useMediaQuery,
    useBreakpoint,
    useCurrentBreakpoint,
    useViewportSize,
    useResponsiveValue
  },
  utils: {
    isMobile,
    isTablet,
    isDesktop,
    breakpoints

};

// Mobile Touch System
export const MobileSystem = {
  components: {
    TouchButton,
    SwipeGesture,
    PullToRefresh,
    TouchSlider,
    TouchCardStack
  },
  utils: {
    HapticManager,
    haptic
  },
  hooks: {
    useMobileScroll,
    useSafeArea

};

// Accessibility Suite
export const AccessibilitySuite = {
  provider: AccessibilityProvider,
  hook: useAccessibility,
  components: {
    AccessibleButton,
    AccessibleInput,
    SkipLink,
    FocusTrap,
    AccessibilityPanel,
    LiveRegion

};

// Dashboard Suite
export const DashboardSuite = {
  provider: DashboardProvider,
  hook: useDashboard,
  components: {
    DashboardGrid,
    WidgetLibrary,
    StatWidget,
    ChartWidget,
    FeedWidget

};

// =========================================
// VERSION & METADATA
// =========================================
export const ENHANCED_UI_VERSION = '3.0.0';
export const ENHANCED_UI_BUILD = 'ui-excellence-edition';

export const metadata = {
  version: ENHANCED_UI_VERSION,
  build: ENHANCED_UI_BUILD,
  features: [
    'Advanced Animation Library',
    'Premium Glassmorphism Effects',
    'Mobile-First Touch System',
    'WCAG 2.1 AA Accessibility',
    'Responsive Layout System',
    'Customizable Dashboard',
    'Advanced Theme System',
    'Professional Component Library'
  ],
  components: Object.keys(EnhancedComponents).length,
  lastUpdated: new Date().toISOString()
};

// =========================================
// DEFAULT EXPORT
// =========================================
export default {
  ...EnhancedComponents,
  Animations,
  VisualEffects,
  LayoutSystem,
  MobileSystem,
  AccessibilitySuite,
  DashboardSuite,
  metadata
};