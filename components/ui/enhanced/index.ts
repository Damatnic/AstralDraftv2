/**
 * Enhanced UI Component Library - Export Index
 * Professional UI/UX Excellence Edition for Astral Draft
 * All enhanced components with modern design, accessibility, and premium effects
 */

// =========================================
// ANIMATION LIBRARY
// =========================================
export {
}
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
//   animationPresets
} from &apos;./AnimationLibrary&apos;;

export type {
}
  AnimatedElementProps,
  StaggeredListProps,
  CountUpProps,
  TypewriterProps,
  ParallaxProps,
  MorphingShapeProps,
  GlowEffectProps,
  RippleEffectProps,
  ShimmerEffectProps,
//   AnimatedGridProps
} from &apos;./AnimationLibrary&apos;;

// =========================================
// ENHANCED BUTTONS
// =========================================
export {
}
  default as EnhancedButton,
  ButtonGroup,
//   FloatingActionButton
} from &apos;./EnhancedButton&apos;;

export type {
}
  ButtonVariant,
  ButtonSize,
  ButtonShape,
  EnhancedButtonProps,
  ButtonGroupProps,
//   FloatingActionButtonProps
} from &apos;./EnhancedButton&apos;;

// =========================================
// ENHANCED CARDS
// =========================================
export {
}
  default as EnhancedCard,
  CardHeader,
  CardBody,
  CardFooter,
  StatCard,
  PlayerCard,
//   CardGrid
} from &apos;./EnhancedCard&apos;;

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
} from &apos;./EnhancedCard&apos;;

// =========================================
// RESPONSIVE LAYOUT SYSTEM
// =========================================
export {
}
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
//   breakpoints
} from &apos;./ResponsiveLayout&apos;;

export type {
}
  Breakpoint,
  ContainerProps,
  GridProps,
  ShowProps,
  ResponsiveTextProps,
  ResponsiveSpacingProps,
  AspectRatioProps,
//   ResponsiveImageProps
} from &apos;./ResponsiveLayout&apos;;

// =========================================
// MOBILE TOUCH SYSTEM
// =========================================
export {
}
  default as MobileTouchSystem,
  TouchButton,
  SwipeGesture,
  PullToRefresh,
  TouchSlider,
  TouchCardStack,
  HapticManager,
  haptic,
  useMobileScroll,
//   useSafeArea
} from &apos;./MobileTouchSystem&apos;;

export type {
}
  TouchFeedbackOptions,
  SwipeHandlers,
  GestureConfig,
  TouchButtonProps,
  SwipeGestureProps,
  PullToRefreshProps,
  TouchSliderProps,
//   TouchCardStackProps
} from &apos;./MobileTouchSystem&apos;;

// =========================================
// ACCESSIBILITY SYSTEM
// =========================================
export {
}
  default as AccessibilitySystem,
  AccessibilityProvider,
  useAccessibility,
  AccessibleButton,
  AccessibleInput,
  SkipLink,
  FocusTrap,
  AccessibilityPanel,
//   LiveRegion
} from &apos;./AccessibilitySystem&apos;;

export type {
}
  AccessibilityState,
  AccessibilityActions,
  AccessibilityContextType,
  AccessibleButtonProps,
  AccessibleInputProps,
  SkipLinkProps,
//   FocusTrapProps
} from &apos;./AccessibilitySystem&apos;;

// =========================================
// GLASSMORPHISM & VISUAL EFFECTS
// =========================================
export {
}
  default as GlassmorphismEffects,
  GlassEffect,
  NeonEffect,
  ParticleSystem,
  HolographicEffect,
  LiquidBackground,
  AuroraBackground,
  GradientText,
//   FloatingElements
} from &apos;./GlassmorphismEffects&apos;;

export type {
}
  GlassEffectProps,
  NeonEffectProps,
  ParticleSystemProps,
  HolographicEffectProps,
  LiquidBackgroundProps,
  AuroraBackgroundProps,
  GradientTextProps,
//   FloatingElementsProps
} from &apos;./GlassmorphismEffects&apos;;

// =========================================
// DASHBOARD SYSTEM
// =========================================
export {
}
  default as DashboardSystem,
  DashboardProvider,
  DashboardGrid,
  WidgetLibrary,
  StatWidget,
  ChartWidget,
  FeedWidget,
//   useDashboard
} from &apos;./DashboardSystem&apos;;

export type {
}
  Widget,
  DashboardLayout,
  DashboardContextType,
  WidgetSize,
  WidgetType,
  DashboardGridProps,
//   WidgetLibraryProps
} from &apos;./DashboardSystem&apos;;

// =========================================
// COMBINED EXPORTS FOR CONVENIENCE
// =========================================

// Core Enhanced Components
export const EnhancedComponents = {
}
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
//   WidgetLibrary
};

// Animation Presets for easy access
export const Animations = {
}
  presets: animationPresets,
  components: {
}
    AnimatedElement,
    StaggeredList,
    CountUp,
    Typewriter,
    Parallax,
//     MorphingShape
  },
  effects: {
}
    GlowEffect,
    RippleEffect,
//     ShimmerEffect
  },
  loaders: {
}
    PulseLoader,
    SpinLoader,
//     WaveLoader

};

// Visual Effects Collection
export const VisualEffects = {
}
  glass: {
}
    GlassEffect,
//     HolographicEffect
  },
  neon: {
}
    NeonEffect,
//     GradientText
  },
  particles: {
}
    ParticleSystem,
//     FloatingElements
  },
  backgrounds: {
}
    LiquidBackground,
//     AuroraBackground

};

// Layout System
export const LayoutSystem = {
}
  components: {
}
    Container,
    ResponsiveGrid,
    Show,
    Hide,
    ResponsiveText,
    ResponsiveSpacing,
    AspectRatio,
//     ResponsiveImage
  },
  hooks: {
}
    useMediaQuery,
    useBreakpoint,
    useCurrentBreakpoint,
    useViewportSize,
//     useResponsiveValue
  },
  utils: {
}
    isMobile,
    isTablet,
    isDesktop,
//     breakpoints

};

// Mobile Touch System
export const MobileSystem = {
}
  components: {
}
    TouchButton,
    SwipeGesture,
    PullToRefresh,
    TouchSlider,
//     TouchCardStack
  },
  utils: {
}
    HapticManager,
//     haptic
  },
  hooks: {
}
    useMobileScroll,
//     useSafeArea

};

// Accessibility Suite
export const AccessibilitySuite = {
}
  provider: AccessibilityProvider,
  hook: useAccessibility,
  components: {
}
    AccessibleButton,
    AccessibleInput,
    SkipLink,
    FocusTrap,
    AccessibilityPanel,
//     LiveRegion

};

// Dashboard Suite
export const DashboardSuite = {
}
  provider: DashboardProvider,
  hook: useDashboard,
  components: {
}
    DashboardGrid,
    WidgetLibrary,
    StatWidget,
    ChartWidget,
//     FeedWidget

};

// =========================================
// VERSION & METADATA
// =========================================
export const ENHANCED_UI_VERSION = &apos;3.0.0&apos;;
export const ENHANCED_UI_BUILD = &apos;ui-excellence-edition&apos;;

export const metadata = {
}
  version: ENHANCED_UI_VERSION,
  build: ENHANCED_UI_BUILD,
  features: [
    &apos;Advanced Animation Library&apos;,
    &apos;Premium Glassmorphism Effects&apos;,
    &apos;Mobile-First Touch System&apos;,
    &apos;WCAG 2.1 AA Accessibility&apos;,
    &apos;Responsive Layout System&apos;,
    &apos;Customizable Dashboard&apos;,
    &apos;Advanced Theme System&apos;,
    &apos;Professional Component Library&apos;
  ],
  components: Object.keys(EnhancedComponents).length,
  lastUpdated: new Date().toISOString()
};

// =========================================
// DEFAULT EXPORT
// =========================================
export default {
}
  ...EnhancedComponents,
  Animations,
  VisualEffects,
  LayoutSystem,
  MobileSystem,
  AccessibilitySuite,
  DashboardSuite,
//   metadata
};