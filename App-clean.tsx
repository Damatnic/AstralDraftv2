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
  const { state, dispatch } = useAppState();

  // Initialize app
  useEffect(() => {
    // Basic initialization
    if (!state.user) {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch, state.user]);

  // If user is not authenticated, show login
  if (!state.user) {
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
        return <PlaceholderView viewName="Team Hub" />;
      
      case 'PLAYERS':
        return <PlaceholderView viewName="Players" />;
      
      case 'DRAFT_PREP_CENTER':
        return <PlaceholderView viewName="Draft Prep" />;
      
      case 'MESSAGES':
        return <PlaceholderView viewName="Messages" />;
      
      case 'TRADES':
        return <PlaceholderView viewName="Trades" />;
      
      case 'PROFILE':
        return <PlaceholderView viewName="Profile" />;
      
      default:
        return <LeagueDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
      {/* Simple navigation */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-white text-xl font-bold">Fantasy League</h1>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <button
                  onClick={() => dispatch({ type: 'SET_VIEW', payload: 'DASHBOARD' })}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    state.currentView === 'DASHBOARD'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Dashboard
                </button>
                
                <button
                  onClick={() => dispatch({ type: 'SET_VIEW', payload: 'TEAM_HUB' })}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    state.currentView === 'TEAM_HUB'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  My Team
                </button>
                
                <button
                  onClick={() => dispatch({ type: 'SET_VIEW', payload: 'PLAYERS' })}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    state.currentView === 'PLAYERS'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Players
                </button>
                
                <button
                  onClick={() => dispatch({ type: 'SET_VIEW', payload: 'TRADES' })}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    state.currentView === 'TRADES'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Trades
                </button>
              </div>
            </div>
            
            <div className="flex items-center">
              <span className="text-gray-300 mr-4">Welcome, {state.user.name}</span>
              <button
                onClick={() => dispatch({ type: 'LOGOUT' })}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1">
        {renderView()}
      </main>
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
