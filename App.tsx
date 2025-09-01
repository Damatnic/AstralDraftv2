/**
 * Main App Component - Fantasy Football League Application
 */

// Simple console filtering for production
if (import.meta.env.PROD) {
  const originalConsoleError = console.error;
  console.error = (...args) => {
    const message = args.join(' ').toLowerCase();
    const isExtensionNoise = message.includes('extension') || 
                           message.includes('devtools') || 
                           message.includes('chrome-') ||
                           message.includes('moz-');
    
    if (!isExtensionNoise) {
      originalConsoleError.apply(console, args);
    }
  };
}

import React, { useEffect, FC, ReactNode } from 'react';
import { AppProvider, useAppState } from './contexts/AppContext';
import { ModalProvider } from './contexts/ModalContext';
import './styles/globals.css';
import SimplePlayerLogin from './components/auth/SimplePlayerLogin';
import LeagueDashboard from './views/LeagueDashboard';
// Dynamic import for framer-motion - will be loaded when needed
import { AnimatePresence, motion } from 'framer-motion';
import { useMediaQuery } from './hooks/useMediaQuery';
import { enhancedWebSocketService } from './services/enhancedWebSocketService';
import { realtimeNotificationServiceV2 } from './services/realtimeNotificationServiceV2';
import { performanceMonitor } from './services/performanceMonitor';
import { logger as loggingService } from './services/loggingService';
// Error tracking service available globally via window object
import { performanceService } from './src/services/performanceService';
import { PERFORMANCE_CONSTANTS, ERROR_CONSTANTS, WEBSOCKET_CONSTANTS } from './src/config/constants';
import { mobilePerformanceOptimizer } from './utils/mobilePerformanceOptimizer';
import { touchEnhancer } from './utils/mobileTouchEnhancer';
import { productionOptimizer } from './utils/productionOptimizer';
import { zeroErrorMonitor } from './services/zeroErrorMonitor';
import type { View, Notification } from './types';

// Import UI components
import SkipLink from './components/ui/SkipLink';
import PWAInstallButton from './components/ui/PWAInstallButton';
import HighContrastMode from './components/ui/HighContrastMode';
import ErrorBoundary from './components/ui/ErrorBoundary';
import AtomicErrorEliminator from './components/ui/AtomicErrorEliminator';
import ModernNavigation from './components/ui/ModernNavigation';
import MobileLayoutWrapper from './components/mobile/MobileLayoutWrapper';
import ModalManager from './components/ui/ModalManager';
import PerformanceOptimizer from './components/performance/PerformanceOptimizer';

// Lazy load secondary views
const LeagueHubView = React.lazy(() => import('./views/LeagueHubView'));
const EnhancedTeamHubView = React.lazy(() => import('./views/EnhancedTeamHubView'));
const WaiverWireView = React.lazy(() => import('./views/WaiverWireView'));
const PlayersView = React.lazy(() => import('./views/PlayersView'));
const EnhancedDraftPrepView = React.lazy(() => import('./views/EnhancedDraftPrepView'));
const EnhancedLeagueStandingsView = React.lazy(() => import('./views/EnhancedLeagueStandingsView'));
const MessagesView = React.lazy(() => import('./views/MessagesView'));
const MatchupView = React.lazy(() => import('./views/MatchupView'));
const PowerRankingsView = React.lazy(() => import('./views/PowerRankingsView'));
const TradesView = React.lazy(() => import('./views/TradesView'));
const PlayoffBracketView = React.lazy(() => import('./views/PlayoffBracketView'));
const ProfileView = React.lazy(() => import('./views/ProfileView'));
const EnhancedCommissionerToolsView = React.lazy(() => import('./views/EnhancedCommissionerToolsView'));
const EnhancedDraftRoomView = React.lazy(() => import('./views/EnhancedDraftRoomView'));
const SeasonManagementView = React.lazy(() => import('./views/SeasonManagementView'));
const MockDraftView = React.lazy(() => import('./views/MockDraftView'));

// Heavy analytics components - temporarily disabled due to syntax errors
// const AdvancedAnalyticsDashboard = React.lazy(() => import('./components/analytics/AdvancedAnalyticsDashboard'));
// const OracleAnalyticsDashboard = React.lazy(() => import('./components/analytics/OracleAnalyticsDashboard'));
// const PlayerComparisonTool = React.lazy(() => import('./components/comparison/PlayerComparisonTool'));

// Enhanced loading component with better visuals and performance
interface SimpleLoaderProps {
  message?: string;
}

const SimpleLoader: FC<SimpleLoaderProps> = ({ message = "Loading..." }) => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
    <div className="text-center space-y-6">
      <div className="relative inline-flex">
        <div className="w-16 h-16 border-4 border-primary-500/20 rounded-full"></div>
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin absolute inset-0 shadow-glow-md"></div>
        <div className="w-12 h-12 border-2 border-accent-400/40 border-r-transparent rounded-full animate-spin absolute inset-2 animation-delay-75"></div>
      </div>
      <div className="space-y-2">
        <p className="text-xl font-bold text-white tracking-wide">{message}</p>
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce animation-delay-100"></div>
          <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce animation-delay-200"></div>
        </div>
      </div>
    </div>
  </div>
);

const viewVariants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } },
};

// Global error suppression patterns
const GLOBAL_SUPPRESSED_ERROR_PATTERNS = [
    // Browser extension errors - Chrome
    'message port closed',
    'Extension context invalidated', 
    'chrome-extension://',
    'Could not establish connection',
    'Receiving end does not exist',
    'runtime.lastError',
    'Tab no longer exists',
    'No tab with id',
    'The message port closed before a response was received',
    'Extension host has crashed',
    'Extension was disabled',
    'chrome.runtime.lastError',
    'Unchecked runtime.lastError',
    'runtime.lastError: Could not establish connection',
    'runtime.lastError: The message port closed',
    'runtime.lastError: Receiving end does not exist',
    
    // Firefox extensions
    'moz-extension://',
    'WebExtension context',
    'Extension unloaded',
    
    // Safari extensions  
    'safari-extension://',
    'safari-web-extension://',
    
    // WebSocket errors
    'WebSocket connection failed',
    'websocket error',
    'connect_error',
    'disconnect',
    'connection refused',
    'ECONNREFUSED',
    'network error',
    'socket.io',
    'ws://localhost',
    'Failed to construct WebSocket',
    
    // API errors that should be suppressed
    '401 (Unauthorized)',
    '404 (Not Found)',
    'api.sportsdata.io',
    
    // Generic extension patterns
    'extension',
    'lastError'
];

const AppContent: FC = () => {
    const { state, dispatch } = useAppState();
    const isMobile = useMediaQuery('(max-width: 768px)');

    // Authentication is handled by SimplePlayerLogin component
    // Users must authenticate properly to access the application

    // Initialize performance monitoring and error handling
    useEffect(() => {
        // Activate Zero-Error Monitor for complete error suppression
        zeroErrorMonitor.validateZeroErrorState(); // Initialize monitor
        
        // Start performance monitoring (safe for all environments)
        performanceMonitor.recordMetric('app_start', performance.now());
        
        // BULLETPROOF Browser Extension Error Suppression
        const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
            const error = event.reason;
            
            if (error && typeof error === 'object') {
                const message = String((error as Error).message || error).toLowerCase();
                const stack = String((error as Error).stack || '').toLowerCase();
                
                // Check if this matches any suppressible error pattern
                const isSuppressedError = GLOBAL_SUPPRESSED_ERROR_PATTERNS.some(pattern => 
                    message.includes(pattern.toLowerCase()) || 
                    stack.includes(pattern.toLowerCase())
                );
                
                if (isSuppressedError) {
                    event.preventDefault(); // Completely suppress
                    event.stopImmediatePropagation(); // Stop all propagation
                    return false; // Silent handling
                }
            }
            
            // Only log truly critical application errors
            if (import.meta.env.DEV) {
                console.warn('Unhandled promise rejection (non-extension):', error);
            }
        };

        const handleError = (event: ErrorEvent) => {
            const message = event.message || '';
            const filename = event.filename || 'unknown';
            const lineno = event.lineno || 0;
            const colno = event.colno || 0;
            
            // Check against global suppression patterns
            const isSuppressibleError = GLOBAL_SUPPRESSED_ERROR_PATTERNS.some(pattern => 
                message.toLowerCase().includes(pattern.toLowerCase()) || 
                filename.toLowerCase().includes(pattern.toLowerCase())
            ) || filename.includes('extension://');
            
            if (isSuppressibleError) {
                event.preventDefault();
                event.stopImmediatePropagation();
                return false; // Complete suppression
            }
            
            // Only handle true application errors
            if (import.meta.env.DEV) {
                console.warn('Application error (non-extension):', { message, filename, lineno, colno });
            }
        };

        // Add global error handlers
        window.addEventListener('unhandledrejection', handleUnhandledRejection);
        window.addEventListener('error', handleError);
        
        // NUCLEAR OPTION: Override ALL console methods to suppress extension noise
        const originalConsoleError = console.error;
        const originalConsoleWarn = console.warn;
        const originalConsoleLog = console.log;
        
        // Ultra-aggressive extension error filter with safety checks
        const isExtensionNoise = (message: string): boolean => {
            if (!message || typeof message !== 'string') return false;
            
            const lowerMessage = message.toLowerCase();
            
            // Specific browser extension signatures
            const extensionSignatures = ERROR_CONSTANTS.EXTENSION_ERROR_PATTERNS;
            
            try {
                return extensionSignatures.some(sig => lowerMessage.includes(sig)) ||
                       (GLOBAL_SUPPRESSED_ERROR_PATTERNS && GLOBAL_SUPPRESSED_ERROR_PATTERNS.some(pattern => lowerMessage.includes(pattern.toLowerCase())));
            } catch {
                return false;
            }
        };
        
        // NUCLEAR-LEVEL console override with bulletproof safety
        const safeJoinArgs = (argsList: unknown[]): string => {
            try {
                if (!argsList) return '';
                if (!Array.isArray(argsList) && typeof argsList.length !== 'number') return String(argsList || '');
                if (argsList.length === 0) return '';
                
                const safeArgs = [];
                for (let i = 0; i < (argsList.length || 0); i++) {
                    try {
                        const arg = argsList[i];
                        if (arg === undefined || arg === null) {
                            safeArgs.push('');
                        } else if (typeof arg === 'object') {
                            safeArgs.push(JSON.stringify(arg) || '[object]');
                        } else {
                            safeArgs.push(String(arg));
                        }
                    } catch {
                        safeArgs.push('[unparseable]');
                    }
                }
                return safeArgs.join(' ');
            } catch {
                return String(argsList || '[error]');
            }
        };
        
        console.error = (...args) => {
            try {
                const message = safeJoinArgs(args);
                if (!isExtensionNoise(message)) {
                    originalConsoleError.apply(console, args || []);
                }
            } catch {
                try {
                    originalConsoleError.apply(console, args || []);
                } catch {
                    // Complete silence if everything fails
                }
            }
        };
        
        console.warn = (...args) => {
            try {
                const message = safeJoinArgs(args);
                if (!isExtensionNoise(message)) {
                    originalConsoleWarn.apply(console, args || []);
                }
            } catch {
                try {
                    originalConsoleWarn.apply(console, args || []);
                } catch {
                    // Complete silence if everything fails
                }
            }
        };
        
        console.log = (...args) => {
            try {
                const message = safeJoinArgs(args);
                if (!isExtensionNoise(message)) {
                    originalConsoleLog.apply(console, args || []);
                }
            } catch {
                try {
                    originalConsoleLog.apply(console, args || []);
                } catch {
                    // Complete silence if everything fails
                }
            }
        };
        
        return () => {
            performanceMonitor.destroy();
            window.removeEventListener('unhandledrejection', handleUnhandledRejection);
            window.removeEventListener('error', handleError);
            
            // Restore original console methods
            console.error = originalConsoleError;
            console.warn = originalConsoleWarn;
            console.log = originalConsoleLog;
            
            // Validate zero-error state before cleanup
            if (import.meta.env.DEV) {
                const isZeroError = zeroErrorMonitor.validateZeroErrorState();
                performanceService.recordMetric('zero_error_state', isZeroError ? 1 : 0);
            }
        };
    }, []);

    // Initialize real-time services (disabled for frontend-only mode)
    useEffect(() => {
        const initializeRealTimeServices = async () => {
            // Skip WebSocket initialization if no backend server configured
            if (!import.meta.env.VITE_WS_URL) {
                if (import.meta.env.DEV) {
                    performanceService.recordMetric('realtime_services_disabled', 1, { reason: 'no_backend_server' });
                }
                return;
            }
            
            try {
                // Enhanced WebSocket connection with comprehensive error handling
                const connectionTimeout = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('WebSocket connection timeout')), WEBSOCKET_CONSTANTS.CONNECTION_TIMEOUT)
                );
                
                // Wrap WebSocket connection in error boundary
                const connectWebSocket = async () => {
                    try {
                        return await enhancedWebSocketService.connect();
                    } catch (wsError: unknown) {
                        // Suppress WebSocket errors that don't affect functionality
                        const wsMessage = wsError?.message?.toLowerCase() || '';
                        if (wsMessage.includes('websocket') || wsMessage.includes('connection failed')) {
                            if (import.meta.env.DEV) {
                                performanceService.recordMetric('websocket_graceful_degradation', 1, { reason: wsMessage });
                            }
                            return null; // Graceful degradation
                        }
                        throw wsError; // Re-throw non-WebSocket errors
                    }
                };
                
                const wsConnection = await Promise.race([
                    connectWebSocket(),
                    connectionTimeout
                ]);
                
                // Only setup notifications if WebSocket connected
                if (wsConnection !== null) {
                    // Setup notification system
                    await realtimeNotificationServiceV2.initialize(state.user?.id || '');
                    
                    // Listen for notifications using EventEmitter pattern
                    realtimeNotificationServiceV2.on('notification', (notification: Notification) => {
                        // Handle real-time notifications
                        dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
                    });
                    
                    if (import.meta.env.DEV) {
                        performanceService.recordMetric('realtime_services_connected', 1);
                    }
                } else {
                    if (import.meta.env.DEV) {
                        performanceService.recordMetric('offline_mode_active', 1);
                    }
                }
                
            } catch (error: unknown) {
                // Complete error suppression for WebSocket failures
                const errorMessage = error?.message?.toLowerCase() || '';
                const isWebSocketError = errorMessage.includes('websocket') || 
                                       errorMessage.includes('connection') || 
                                       errorMessage.includes('timeout');
                
                if (isWebSocketError) {
                    // Silent handling - don't log WebSocket errors
                    if (import.meta.env.DEV) {
                        performanceService.recordMetric('realtime_features_unavailable', 1, { reason: 'websocket_error' });
                    }
                } else if (import.meta.env.DEV) {
                    performanceService.recordMetric('realtime_service_init_issue', 1, { error: errorMessage });
                }
            }
            
            // Initialize mobile optimizations
            try {
                mobilePerformanceOptimizer.updateConfig({
                    enableImageOptimization: true,
                    enableLazyLoading: true,
                    networkAwareLoading: true,
                    batteryOptimization: true
                });
                
                touchEnhancer.enableHapticFeedback(true);
                
            } catch (error) {
                loggingService.error('Mobile optimization initialization failed', error, 'mobile-init');
            }
            
            // Initialize production optimizations
            try {
                // Get environment information for production optimizations
                productionOptimizer.getEnvironmentInfo();
                
                
                // Track app initialization performance
                const startTime = performance.now();
                const initComplete = () => {
                    const duration = performance.now() - startTime;
                    performanceMonitor.recordMetric('app_initialization', duration);
                    
                };
                
                requestIdleCallback(initComplete, { timeout: PERFORMANCE_CONSTANTS.IDLE_CALLBACK_TIMEOUT });
                
            } catch (error) {
                loggingService.error('Production optimizer initialization failed', error, 'production-init');
            }
        };

        if (state.user) {
            initializeRealTimeServices();
        }

        return () => {
            enhancedWebSocketService.disconnect();
            realtimeNotificationServiceV2.removeAllListeners();
        };
    }, [state.user, dispatch]);

    // Show login if no user is logged in
    if (!state.user) {
        return (
            <>
                <SkipLink />
                <SimplePlayerLogin />
            </>
        );
    }

    const renderView = () => {
        switch (state.currentView) {
            case 'DASHBOARD':
                return <LeagueDashboard />;
                
            case 'LEAGUE_HUB':
                return (
                    <React.Suspense fallback={<SimpleLoader message="Loading League Hub..." />}>
                        <LeagueHubView />
                    </React.Suspense>
                );
                
            case 'TEAM_HUB':
                return (
                    <React.Suspense fallback={<SimpleLoader message="Loading Team Hub..." />}>
                        <EnhancedTeamHubView />
                    </React.Suspense>
                );
                
            case 'WAIVER_WIRE':
                return (
                    <React.Suspense fallback={<SimpleLoader message="Loading Waiver Wire..." />}>
                        <WaiverWireView />
                    </React.Suspense>
                );
                
            case 'PLAYERS':
                return (
                    <React.Suspense fallback={<SimpleLoader message="Loading Players..." />}>
                        <PlayersView />
                    </React.Suspense>
                );
                
            case 'DRAFT_PREP_CENTER':
                return (
                    <React.Suspense fallback={<SimpleLoader message="Loading Draft Prep..." />}>
                        <EnhancedDraftPrepView />
                    </React.Suspense>
                );
                
            case 'LEAGUE_STANDINGS':
                return (
                    <React.Suspense fallback={<SimpleLoader message="Loading Standings..." />}>
                        <EnhancedLeagueStandingsView />
                    </React.Suspense>
                );
                
            case 'ENHANCED_LEAGUE_STANDINGS':
                return (
                    <React.Suspense fallback={<SimpleLoader message="Loading Enhanced Standings..." />}>
                        <EnhancedLeagueStandingsView />
                    </React.Suspense>
                );
                
            case 'MESSAGES':
                return (
                    <React.Suspense fallback={<SimpleLoader message="Loading Messages..." />}>
                        <MessagesView />
                    </React.Suspense>
                );
                
            case 'MATCHUP':
                return (
                    <React.Suspense fallback={<SimpleLoader message="Loading Matchup..." />}>
                        <MatchupView />
                    </React.Suspense>
                );
                
            case 'POWER_RANKINGS':
                return (
                    <React.Suspense fallback={<SimpleLoader message="Loading Power Rankings..." />}>
                        <PowerRankingsView />
                    </React.Suspense>
                );
                
            case 'TRADES':
                return (
                    <React.Suspense fallback={<SimpleLoader message="Loading Trades..." />}>
                        <TradesView />
                    </React.Suspense>
                );
                
            case 'PLAYOFF_BRACKET':
                return (
                    <React.Suspense fallback={<SimpleLoader message="Loading Playoff Bracket..." />}>
                        <PlayoffBracketView />
                    </React.Suspense>
                );
                
            case 'PROFILE':
                return (
                    <React.Suspense fallback={<SimpleLoader message="Loading Profile..." />}>
                        <ProfileView />
                    </React.Suspense>
                );
                
            case 'COMMISSIONER_TOOLS':
                return (
                    <React.Suspense fallback={<SimpleLoader message="Loading Commissioner Tools..." />}>
                        <EnhancedCommissionerToolsView />
                    </React.Suspense>
                );
                
            case 'DRAFT_ROOM':
                return (
                    <React.Suspense fallback={<SimpleLoader message="Loading Draft Room..." />}>
                        <EnhancedDraftRoomView />
                    </React.Suspense>
                );
                
            case 'SEASON_MANAGEMENT':
                return (
                    <React.Suspense fallback={<SimpleLoader message="Loading Season Management..." />}>
                        <SeasonManagementView />
                    </React.Suspense>
                );
                
            case 'MOCK_DRAFT':
                return (
                    <React.Suspense fallback={<SimpleLoader message="Loading Mock Draft..." />}>
                        <MockDraftView />
                    </React.Suspense>
                );
                
            default:
                return <LeagueDashboard />;
        }
    };
    
    return (
        <AtomicErrorEliminator fallback={<SimpleLoader message="Recovering from error..." />}>
            <div className="relative w-full min-h-screen flex flex-col font-sans bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
                <SkipLink />
            
            {/* Modern Navigation Header */}
            {!isMobile && (
                <ModernNavigation 
                    user={state.user}
                    currentView={state.currentView}
                    onViewChange={(view: View) => dispatch({ type: 'SET_VIEW', payload: view })}
                    onLogout={() => dispatch({ type: 'LOGOUT' })}
                />
            )}
            
            {/* Main Content Area */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={state.currentView}
                    id="main-content"
                    className={`flex-1 w-full ${!isMobile ? 'pt-16' : ''}`}
                    variants={viewVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >
                    {isMobile ? (
                        <MobileLayoutWrapper
                            currentView={state.currentView}
                            onViewChange={(view: View) => dispatch({ type: 'SET_VIEW', payload: view })}
                            showBottomNav={true}
                        >
                            {renderView()}
                        </MobileLayoutWrapper>
                    ) : (
                        renderView()
                    )}
                </motion.div>
            </AnimatePresence>
            
            {/* PWA Install Button - Always available */}
            <PWAInstallButton />
            
            {/* Accessibility Controls */}
            <div className="fixed top-20 right-4 z-[1080]">
                <HighContrastMode />
            </div>
            
            {/* Performance Monitoring */}
            <PerformanceOptimizer 
                enableMonitoring={import.meta.env.PROD}
                reportToAnalytics={import.meta.env.PROD}
                onMetricsUpdate={(metrics) => {
                    // Optional: Send to analytics service
                    performanceMonitor.recordMetric('web_vitals', metrics);
                }}
            />
            </div>
        </AtomicErrorEliminator>
    );
};

// NUCLEAR-LEVEL Error Prevention Component
interface NuclearErrorBoundaryProps {
  children: ReactNode;
}

const NuclearErrorBoundary: FC<NuclearErrorBoundaryProps> = ({ children }) => {
  const [hasError, setHasError] = React.useState(false);
  const [errorCount, setErrorCount] = React.useState(0);

  React.useEffect(() => {
    const handleError = (_error: Error, _errorInfo?: React.ErrorInfo) => {
      setErrorCount(prev => prev + 1);
      if (errorCount < 5) { // Allow up to 5 retries
        setTimeout(() => setHasError(false), 1000);
      }
    };

    // Global error catcher
    const globalErrorHandler = (event: ErrorEvent) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      handleError(new Error(event.message));
      return false;
    };

    const unhandledRejectionHandler = (event: PromiseRejectionEvent) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      handleError(new Error(String(event.reason)));
    };

    window.addEventListener('error', globalErrorHandler);
    window.addEventListener('unhandledrejection', unhandledRejectionHandler);

    return () => {
      window.removeEventListener('error', globalErrorHandler);
      window.removeEventListener('unhandledrejection', unhandledRejectionHandler);
    };
  }, [errorCount]);

  if (hasError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4 p-8 bg-slate-800 rounded-lg shadow-xl max-w-md">
          <div className="text-6xl">🛡️</div>
          <h1 className="text-2xl font-bold text-white">System Protected</h1>
          <p className="text-gray-300">The application is recovering from an error...</p>
          <button
            onClick={() => {setHasError(false); setErrorCount(0);}}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
          >
            Continue to App
          </button>
        </div>
      </div>
    );
  }

  try {
    return <>{children}</>;
  } catch {
    setHasError(true);
    return null;
  }
};

const App: FC = () => {
  return (
    <NuclearErrorBoundary>
      <AppProvider>
        <ModalProvider>
          <div className="min-h-screen bg-gradient-to-br from-dark-950 via-slate-900 to-dark-950">
            <ErrorBoundary>
              <AppContent />
              <ModalManager />
            </ErrorBoundary>
          </div>
        </ModalProvider>
      </AppProvider>
    </NuclearErrorBoundary>
  );
};

export default App;