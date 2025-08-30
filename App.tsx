/**
 * Main App Component - Fantasy Football League Application
 */

import React, { useEffect } from 'react';
import { AppProvider, useAppState } from './contexts/AppContext';
import { ModalProvider } from './contexts/ModalContext';
import './styles/globals.css';
import SimplePlayerLogin from './components/auth/SimplePlayerLogin';
import LeagueDashboard from './views/LeagueDashboard';
import { AnimatePresence, motion } from 'framer-motion';
import { useMediaQuery } from './hooks/useMediaQuery';
import { enhancedWebSocketService } from './services/enhancedWebSocketService';
import { realtimeNotificationServiceV2 } from './services/realtimeNotificationServiceV2';
import { performanceMonitor } from './services/performanceMonitor';
import { logger as loggingService } from './services/loggingService';
import { mobilePerformanceOptimizer } from './utils/mobilePerformanceOptimizer';
import { touchEnhancer } from './utils/mobileTouchEnhancer';
import { productionOptimizer } from './utils/productionOptimizer';
import type { View, Notification } from './types';

// Import UI components
import SkipLink from './components/ui/SkipLink';
import PWAInstallButton from './components/ui/PWAInstallButton';
import HighContrastMode from './components/ui/HighContrastMode';
import ErrorBoundary from './components/ui/ErrorBoundary';
import ModernNavigation from './components/ui/ModernNavigation';
import MobileLayoutWrapper from './components/mobile/MobileLayoutWrapper';
import ModalManager from './components/ui/ModalManager';

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

// Enhanced loading component with better visuals and performance
const SimpleLoader: React.FC<{ message?: string }> = ({ message = "Loading..." }) => (
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

const AppContent: React.FC = () => {
    const { state, dispatch } = useAppState();
    const isMobile = useMediaQuery('(max-width: 768px)');

    // Initialize performance monitoring and error handling
    useEffect(() => {
        if (process.env.NODE_ENV === 'production') {
            performanceMonitor.recordMetric('app_start', performance.now());
        }
        
        // Suppress browser extension errors
        const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
            const error = event.reason;
            if (typeof error === 'object' && error !== null && 'message' in error) {
                const message = (error as Error).message;
                // Suppress common browser extension errors
                if (message.includes('message port closed') || 
                    message.includes('Extension context invalidated') ||
                    message.includes('chrome-extension://')) {
                    event.preventDefault();
                    return;
                }
            }
        };

        const handleError = (event: ErrorEvent) => {
            const message = event.message;
            // Suppress browser extension console errors
            if (message.includes('Unchecked runtime.lastError') ||
                message.includes('message port closed') ||
                message.includes('chrome-extension://')) {
                event.preventDefault();
                return;
            }
        };

        // Add global error handlers
        window.addEventListener('unhandledrejection', handleUnhandledRejection);
        window.addEventListener('error', handleError);
        
        return () => {
            if (process.env.NODE_ENV === 'production') {
                performanceMonitor.destroy();
            }
            window.removeEventListener('unhandledrejection', handleUnhandledRejection);
            window.removeEventListener('error', handleError);
        };
    }, []);

    // Initialize real-time services (disabled for frontend-only mode)
    useEffect(() => {
        const initializeRealTimeServices = async () => {
            // Skip WebSocket initialization if no backend server or in production without WebSocket config
            if (process.env.NODE_ENV === 'development' && !process.env.VITE_WS_URL) {
                console.log('ℹ️ Real-time services disabled - backend server not configured');
                console.log('  Start backend server on port 3001 to enable WebSocket features');
                return;
            }
            
            try {
                // Initialize WebSocket connection with timeout for development
                const connectionTimeout = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('WebSocket connection timeout')), 3000)
                );
                
                await Promise.race([
                    enhancedWebSocketService.connect(),
                    connectionTimeout
                ]);
                
                // Setup notification system
                await realtimeNotificationServiceV2.initialize(state.user?.id || '');
                
                // Listen for notifications using EventEmitter pattern
                realtimeNotificationServiceV2.on('notification', (notification: Notification) => {
                    // Handle real-time notifications
                    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
                });
                
                console.log('✅ Real-time services connected successfully');
                
            } catch (error) {
                // Failed to initialize real-time services - graceful degradation
                if (process.env.NODE_ENV === 'development') {
                    console.log('ℹ️ WebSocket connection unavailable - continuing without real-time features');
                } else {
                    loggingService.error('Real-time services initialization failed', error, 'app-initialization');
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
                const envInfo = productionOptimizer.getEnvironmentInfo();
                
                
                // Track app initialization performance
                const startTime = performance.now();
                const initComplete = () => {
                    const duration = performance.now() - startTime;
                    performanceMonitor.recordMetric('app_initialization', duration);
                    
                };
                
                requestIdleCallback(initComplete, { timeout: 1000 });
                
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
        </div>
    );
};

const App: React.FC = () => {
  return (
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
  );
};

export default App;