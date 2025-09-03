/**
 * Main App Component - Fantasy Football League Application
 * Clean rewrite focusing on core functionality
 */

import React, { useEffect } from 'react';
import { AppProvider, useAppState } from './contexts/AppContext';
import './styles/globals.css';

// Core authentication component
import SimplePlayerLogin from './components/auth/SimplePlayerLogin';

// Main dashboard
import LeagueDashboard from './views/LeagueDashboard';

// Core view components
import TeamHubView from './views/TeamHubView';
import PlayersView from './views/PlayersView';
import TradesView from './views/TradesView';
import MessagesView from './views/MessagesView';
import ProfileView from './views/ProfileView';
import LeagueStandingsView from './views/LeagueStandingsView';
import MatchupView from './views/MatchupView';

// Mobile optimizations
import { initializeMobileOptimizations } from './utils/mobileOptimizations';

// Production optimizations
import useProductionOptimizations from './hooks/useProductionOptimizations';

// PWA Install Prompt
import PWAInstallPrompt from './components/pwa/PWAInstallPrompt';

// Placeholder component for views that are broken
const PlaceholderView: React.FC<{ viewName: string }> = ({ viewName }) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 flex items-center justify-center">
    <div className="text-center space-y-4 p-8 bg-gray-800 rounded-lg shadow-xl max-w-md">
      <div className="text-6xl">🚧</div>
      <h1 className="text-2xl font-bold text-white">{viewName} Under Construction</h1>
      <p className="text-gray-300">
        This view is being rebuilt. Please check back soon.
      </p>
    </div>
  </div>
);

// Main app content component
const AppContent: React.FC = () => {
  console.log('🎯 APP: AppContent component mounting');
  
  const { state, dispatch } = useAppState();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [emergencyFallback, setEmergencyFallback] = React.useState(false);
  
  console.log('📊 APP: Current app state:', JSON.stringify({
    hasUser: !!state.user,
    isLoading: state.isLoading,
    currentView: state.currentView,
    emergencyFallback
  }, null, 2));

  // Initialize production optimizations - safely
  try {
    useProductionOptimizations();
  } catch (error) {
    console.error('Production optimizations error:', error);
  }

  // Initialize app
  useEffect(() => {
    console.log('🚀 App initialization started...');
    console.log('📊 Current state:', JSON.stringify(state, null, 2));
    
    // FORCE APP TO SHOW - bypass all loading logic
    console.log('⚡ FORCE BYPASSING ALL LOADING LOGIC');
    dispatch({ type: 'SET_LOADING', payload: false });
    console.log('✅ Loading forcibly set to false');
    
    // CRITICAL: Force remove loading screen when App component mounts
    const loadingEl = document.getElementById('loading-fallback');
    if (loadingEl) {
      console.log('🧹 APP: Found loading screen, removing immediately');
      loadingEl.style.opacity = '0';
      loadingEl.style.transition = 'opacity 0.2s ease-out';
      
      setTimeout(() => {
        if (loadingEl.parentNode) {
          loadingEl.parentNode.removeChild(loadingEl);
          console.log('✅ APP: Loading screen removed by App component');
        }
      }, 200);
      
      // Update debug info from App component
      const debugEl = document.getElementById('debug-info');
      if (debugEl) {
        const appDiv = document.createElement('div');
        appDiv.textContent = '🎯 App component mounted!';
        appDiv.style.color = '#3b82f6';
        appDiv.style.fontWeight = 'bold';
        debugEl.appendChild(appDiv);
      }
    }
    
    // Initialize mobile optimizations only in browser environment
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      try {
        initializeMobileOptimizations();
        console.log('✅ Mobile optimizations initialized');
      } catch (error) {
        console.error('❌ Mobile optimization error:', error);
      }
    } else {
      console.warn('⚠️ Not in browser environment');
    }
    
    // Very short emergency failsafe - 2 seconds
    const failsafeTimeout = setTimeout(() => {
      console.warn('🚨 EMERGENCY FAILSAFE - showing app now');
      setEmergencyFallback(true);
      dispatch({ type: 'SET_LOADING', payload: false });
    }, 2000);
    
    return () => clearTimeout(failsafeTimeout);
  }, []);

  // If user is not authenticated, show login (with emergency fallback)
  if (!state.user) {
    if (emergencyFallback) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 flex items-center justify-center">
          <div className="text-center space-y-4 p-8 bg-gray-800 rounded-lg shadow-xl max-w-md">
            <div className="text-6xl">⚡</div>
            <h1 className="text-2xl font-bold text-white">Emergency Fallback Mode</h1>
            <p className="text-gray-300">
              The normal login process failed to load. This could be due to network issues or server problems.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
            >
              Retry
            </button>
            <p className="text-xs text-gray-500">
              If this problem persists, please check your internet connection or try again later.
            </p>
          </div>
        </div>
      );
    }
    return <SimplePlayerLogin />;
  }

  // View renderer
  const renderView = () => {
    switch (state.currentView) {
      case 'DASHBOARD':
        return <LeagueDashboard />;
      
      case 'LEAGUE_HUB':
        return <PlaceholderView viewName="League Hub" />;
      
      case 'TEAM_HUB':
        return <TeamHubView />;
      
      case 'PLAYERS':
        return <PlayersView />;
      
      case 'DRAFT_PREP_CENTER':
        return <PlaceholderView viewName="Draft Prep Center" />;
      
      case 'MESSAGES':
        return <MessagesView />;
      
      case 'TRADES':
        return <TradesView />;
      
      case 'LEAGUE_STANDINGS':
        return <LeagueStandingsView />;
      
      case 'MATCHUP':
        return <MatchupView />;
      
      case 'PROFILE':
        return <ProfileView />;
      
      default:
        return <LeagueDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
      {/* Mobile-responsive navigation */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-white text-xl font-bold">Fantasy League</h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <button
                  onClick={() => dispatch({ type: 'SET_VIEW', payload: 'DASHBOARD' })}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    state.currentView === 'DASHBOARD'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Dashboard
                </button>
                
                <button
                  onClick={() => dispatch({ type: 'SET_VIEW', payload: 'TEAM_HUB' })}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    state.currentView === 'TEAM_HUB'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  My Team
                </button>
                
                <button
                  onClick={() => dispatch({ type: 'SET_VIEW', payload: 'PLAYERS' })}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    state.currentView === 'PLAYERS'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Players
                </button>
                
                <button
                  onClick={() => dispatch({ type: 'SET_VIEW', payload: 'TRADES' })}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    state.currentView === 'TRADES'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Trades
                </button>
                
                <button
                  onClick={() => dispatch({ type: 'SET_VIEW', payload: 'LEAGUE_STANDINGS' })}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    state.currentView === 'LEAGUE_STANDINGS'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Standings
                </button>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {/* Hamburger icon */}
                <svg
                  className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                {/* Close icon */}
                <svg
                  className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            
            {/* Desktop user info and logout */}
            <div className="hidden md:flex items-center">
              <span className="text-gray-300 mr-4 text-sm">Welcome, {state.user.name}</span>
              <button
                onClick={() => dispatch({ type: 'LOGOUT' })}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800 border-t border-gray-700">
            <button
              onClick={() => {
                dispatch({ type: 'SET_VIEW', payload: 'DASHBOARD' });
                setIsMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                state.currentView === 'DASHBOARD'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              📊 Dashboard
            </button>
            
            <button
              onClick={() => {
                dispatch({ type: 'SET_VIEW', payload: 'TEAM_HUB' });
                setIsMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                state.currentView === 'TEAM_HUB'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              👥 My Team
            </button>
            
            <button
              onClick={() => {
                dispatch({ type: 'SET_VIEW', payload: 'PLAYERS' });
                setIsMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                state.currentView === 'PLAYERS'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              🏈 Players
            </button>
            
            <button
              onClick={() => {
                dispatch({ type: 'SET_VIEW', payload: 'TRADES' });
                setIsMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                state.currentView === 'TRADES'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              🔄 Trades
            </button>
            
            <button
              onClick={() => {
                dispatch({ type: 'SET_VIEW', payload: 'LEAGUE_STANDINGS' });
                setIsMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                state.currentView === 'LEAGUE_STANDINGS'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              🏆 Standings
            </button>
            
            <button
              onClick={() => {
                dispatch({ type: 'SET_VIEW', payload: 'MESSAGES' });
                setIsMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                state.currentView === 'MESSAGES'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              💬 Messages
            </button>
            
            <button
              onClick={() => {
                dispatch({ type: 'SET_VIEW', payload: 'PROFILE' });
                setIsMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                state.currentView === 'PROFILE'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              👤 Profile
            </button>
            
            {/* Mobile user info and logout */}
            <div className="border-t border-gray-700 pt-4 pb-3">
              <div className="flex items-center px-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {state.user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-white">{state.user.name}</div>
                  <div className="text-sm font-medium text-gray-400">Team Manager</div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <button
                  onClick={() => dispatch({ type: 'LOGOUT' })}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1">
        {renderView()}
      </main>
      
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  );
};

// Simple error boundary
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error:', error, errorInfo);
    
    // Send error details to console for debugging in production
    console.error('Error Stack:', error.stack);
    console.error('Component Stack:', errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 flex items-center justify-center">
          <div className="text-center space-y-4 p-8 bg-gray-800 rounded-lg shadow-xl max-w-md">
            <div className="text-6xl">⚠️</div>
            <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
            <p className="text-gray-300">
              The application encountered an error. Please refresh the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Main App component
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
};

export default App;
