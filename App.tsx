/**
 * Main App Component - Simplified Fantasy Football Application
 */

import React from 'react';
import { AppProvider, useAppState } from './contexts/AppContext';
import './styles/theme.css';
import SimplePlayerLogin from './components/auth/SimplePlayerLogin';
import { ErrorBoundary } from './components/core/ErrorBoundary';
import { AnimatePresence, motion } from 'framer-motion';
import { View } from './types';

// Import only essential views directly
import ModernDashboardView from './views/ModernDashboardView';

// Lazy load secondary views
const DashboardView = React.lazy(() => import('./views/DashboardView'));
const LeagueHubView = React.lazy(() => import('./views/LeagueHubView'));
const TeamHubView = React.lazy(() => import('./views/TeamHubView'));

// Simple loading component
const SimpleLoader: React.FC<{ message?: string }> = ({ message = "Loading..." }) => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
    <div className="text-center">
      <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-white">{message}</p>
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

    // Show login if no user is logged in
    if (!state.user) {
        return <SimplePlayerLogin />;
    }

    const renderView = () => {
        switch (state.currentView) {
            case 'DASHBOARD':
                return <ModernDashboardView />;
            case 'LEAGUE_HUB':
                return (
                    <React.Suspense fallback={<SimpleLoader message="Loading League Hub..." />}>
                        <LeagueHubView />
                    </React.Suspense>
                );
            case 'TEAM_HUB':
                return (
                    <React.Suspense fallback={<SimpleLoader message="Loading Team Hub..." />}>
                        <TeamHubView />
                    </React.Suspense>
                );
            default:
                return (
                    <React.Suspense fallback={<SimpleLoader message="Loading Dashboard..." />}>
                        <DashboardView />
                    </React.Suspense>
                );
        }
    };
    
    return (
        <div className="relative w-full h-full flex flex-col font-sans bg-transparent">
            <AnimatePresence mode="wait">
                <motion.div
                    key={state.currentView}
                    className="w-full h-full"
                    variants={viewVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >
                    {renderView()}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

const App: React.FC = () => {
  return (
    <AppProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </AppProvider>
  );
};

export default App;