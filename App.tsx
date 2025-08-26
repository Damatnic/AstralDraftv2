/**
 * Main App Component - Fantasy Football League Application
 */

import React from 'react';
import { AppProvider, useAppState } from './contexts/AppContext';
import './styles/theme.css';
import SimplePlayerLogin from './components/auth/SimplePlayerLogin';
import LeagueDashboard from './views/LeagueDashboard';
import { ErrorBoundary } from './components/core/ErrorBoundary';
import { AnimatePresence, motion } from 'framer-motion';
import { View } from './types';

// Lazy load secondary views
const ModernDashboardView = React.lazy(() => import('./views/ModernDashboardView'));
const DashboardView = React.lazy(() => import('./views/DashboardView'));
const LeagueHubView = React.lazy(() => import('./views/LeagueHubView'));
const TeamHubView = React.lazy(() => import('./views/TeamHubView'));
const WaiverWireView = React.lazy(() => import('./views/WaiverWireView'));
const DraftPrepCenterView = React.lazy(() => import('./views/DraftPrepCenterView'));
const LeagueStandingsView = React.lazy(() => import('./views/LeagueStandingsView'));
const MessagesView = React.lazy(() => import('./views/MessagesView'));
const MatchupView = React.lazy(() => import('./views/MatchupView'));
const PowerRankingsView = React.lazy(() => import('./views/PowerRankingsView'));
const TradesView = React.lazy(() => import('./views/TradesView'));
const PlayoffBracketView = React.lazy(() => import('./views/PlayoffBracketView'));
const ProfileView = React.lazy(() => import('./views/ProfileView'));
const CommissionerToolsView = React.lazy(() => import('./views/CommissionerToolsView'));
const DraftRoomView = React.lazy(() => import('./views/DraftRoomView'));

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
                        <TeamHubView />
                    </React.Suspense>
                );
                
            case 'WAIVER_WIRE':
                return (
                    <React.Suspense fallback={<SimpleLoader message="Loading Players..." />}>
                        <WaiverWireView />
                    </React.Suspense>
                );
                
            case 'DRAFT_PREP_CENTER':
                return (
                    <React.Suspense fallback={<SimpleLoader message="Loading Draft Prep..." />}>
                        <DraftPrepCenterView />
                    </React.Suspense>
                );
                
            case 'LEAGUE_STANDINGS':
                return (
                    <React.Suspense fallback={<SimpleLoader message="Loading Standings..." />}>
                        <LeagueStandingsView />
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
                        <CommissionerToolsView />
                    </React.Suspense>
                );
                
            case 'DRAFT_ROOM':
                return (
                    <React.Suspense fallback={<SimpleLoader message="Loading Draft Room..." />}>
                        <DraftRoomView />
                    </React.Suspense>
                );
                
            default:
                return <LeagueDashboard />;
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