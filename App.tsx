/**
 * Main App Component - BULLETPROOF SIMPLE VERSION
 * No complex logic, no race conditions, just works
 */

import React from 'react';
import { AppProvider, useAppState } from './contexts/AppContext';
import { SimpleAuthProvider } from './contexts/SimpleAuthContext';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { LEAGUE_MEMBERS } from './data/leagueData';
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
import LeagueStandingsView from './views/LeagueStandingsView';
import MatchupView from './views/MatchupView';
import ProfileView from './views/ProfileView';

// Placeholder component for unfinished views
const PlaceholderView: React.FC<{ viewName: string }> = ({ viewName }) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white p-8">
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-4">{viewName}</h1>
      <p className="text-xl text-gray-400">Coming Soon</p>
    </div>
  </div>
);

// Main App Component
const App: React.FC = () => {
  const { state, dispatch } = useAppState();

  // Auto-login from HTML interface - SIMPLE and RELIABLE
  React.useEffect(() => {
    const fastLogin = sessionStorage.getItem('fastLogin');
    const selectedPlayer = localStorage.getItem('selectedPlayer');
    
    if (fastLogin && selectedPlayer && !state.user) {
      sessionStorage.removeItem('fastLogin');
      
      const leagueMember = LEAGUE_MEMBERS.find((member: any) => member.id === selectedPlayer);
      if (leagueMember) {
        dispatch({ type: 'LOGIN', payload: leagueMember });
        
        // Hide HTML login interface
        setTimeout(() => {
          const loginInterface = document.getElementById('login-interface');
          if (loginInterface && loginInterface.parentNode) {
            loginInterface.style.transition = 'opacity 0.5s ease-out';
            loginInterface.style.opacity = '0';
            setTimeout(() => {
              if (loginInterface.parentNode) {
                loginInterface.parentNode.removeChild(loginInterface);
              }
            }, 500);
          }
        }, 100);
      }
    }
  }, []); // ONLY RUN ONCE

  // If no user, show login
  if (!state.user) {
    return <SimplePlayerLogin />;
  }

  // View renderer with error boundaries for each view
  const renderView = () => {
    switch (state.currentView) {
      case 'DASHBOARD':
        return (
          <ErrorBoundary>
            <LeagueDashboard />
          </ErrorBoundary>
        );
      
      case 'LEAGUE_HUB':
        return (
          <ErrorBoundary>
            <PlaceholderView viewName="League Hub" />
          </ErrorBoundary>
        );
      
      case 'TEAM_HUB':
        return (
          <ErrorBoundary>
            <TeamHubView />
          </ErrorBoundary>
        );
      
      case 'PLAYERS':
        return (
          <ErrorBoundary>
            <PlayersView />
          </ErrorBoundary>
        );
      
      case 'DRAFT_PREP_CENTER':
        return (
          <ErrorBoundary>
            <PlaceholderView viewName="Draft Prep Center" />
          </ErrorBoundary>
        );
      
      case 'MESSAGES':
        return (
          <ErrorBoundary>
            <MessagesView />
          </ErrorBoundary>
        );
      
      case 'TRADES':
        return (
          <ErrorBoundary>
            <TradesView />
          </ErrorBoundary>
        );
      
      case 'LEAGUE_STANDINGS':
        return (
          <ErrorBoundary>
            <LeagueStandingsView />
          </ErrorBoundary>
        );
      
      case 'MATCHUP':
        return (
          <ErrorBoundary>
            <MatchupView />
          </ErrorBoundary>
        );
      
      case 'PROFILE':
        return (
          <ErrorBoundary>
            <ProfileView />
          </ErrorBoundary>
        );
      
      default:
        return (
          <ErrorBoundary>
            <LeagueDashboard />
          </ErrorBoundary>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
      {/* Navigation with Error Boundary */}
      <ErrorBoundary>
        <nav className="bg-gray-800 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-white text-xl font-bold">Astral Draft</h1>
                <span className="ml-4 text-gray-400">Welcome, {state.user?.name || 'User'}!</span>
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
                    Team
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

              {/* User menu */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => dispatch({ type: 'LOGOUT' })}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>
      </ErrorBoundary>

      {/* Main Content with Error Boundary */}
      <ErrorBoundary>
        <main>
          {renderView()}
        </main>
      </ErrorBoundary>
    </div>
  );
};

// App with Context Provider and Top-Level Error Boundary
const AppWithProvider: React.FC = () => (
  <ErrorBoundary>
    <SimpleAuthProvider>
      <ErrorBoundary>
        <AppProvider>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </AppProvider>
      </ErrorBoundary>
    </SimpleAuthProvider>
  </ErrorBoundary>
);

export default AppWithProvider;