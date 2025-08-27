/**
 * Main App Component - Fantasy Football League Application
 */

import React from 'react';
import { AppProvider, useAppState } from './contexts/AppContext';
import './styles/theme.css';
import SimplePlayerLogin from './components/auth/SimplePlayerLogin';
import LeagueDashboard from './views/LeagueDashboard';
import { AnimatePresence, motion } from 'framer-motion';
import { SkipLink } from './components/ui/SkipLink';
import { MobileBottomNav } from './components/ui/MobileBottomNav';
import { PWAInstallButton } from './components/ui/PWAInstallButton';
import { HighContrastMode } from './components/ui/HighContrastMode';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { useMediaQuery } from './hooks/useMediaQuery';
import { View } from './types';

// Lazy load secondary views
const ModernDashboardView = React.lazy(() => import('./views/ModernDashboardView'));
const DashboardView = React.lazy(() => import('./views/DashboardView'));
const LeagueHubView = React.lazy(() => import('./views/LeagueHubView'));
const TeamHubView = React.lazy(() => import('./views/TeamHubView'));
const EnhancedTeamHubView = React.lazy(() => import('./views/EnhancedTeamHubView'));
const WaiverWireView = React.lazy(() => import('./views/WaiverWireView'));
const PlayersView = React.lazy(() => import('./views/PlayersView'));
const DraftPrepCenterView = React.lazy(() => import('./views/DraftPrepCenterView'));
const EnhancedDraftPrepView = React.lazy(() => import('./views/EnhancedDraftPrepView'));
const LeagueStandingsView = React.lazy(() => import('./views/LeagueStandingsView'));
const EnhancedLeagueStandingsView = React.lazy(() => import('./views/EnhancedLeagueStandingsView'));
const MessagesView = React.lazy(() => import('./views/MessagesView'));
const MatchupView = React.lazy(() => import('./views/MatchupView'));
const PowerRankingsView = React.lazy(() => import('./views/PowerRankingsView'));
const TradesView = React.lazy(() => import('./views/TradesView'));
const PlayoffBracketView = React.lazy(() => import('./views/PlayoffBracketView'));
const ProfileView = React.lazy(() => import('./views/ProfileView'));
const CommissionerToolsView = React.lazy(() => import('./views/CommissionerToolsView'));
const EnhancedCommissionerToolsView = React.lazy(() => import('./views/EnhancedCommissionerToolsView'));
const DraftRoomView = React.lazy(() => import('./views/DraftRoomView'));
const EnhancedDraftRoomView = React.lazy(() => import('./views/EnhancedDraftRoomView'));
const SeasonManagementView = React.lazy(() => import('./views/SeasonManagementView'));
const MockDraftView = React.lazy(() => import('./views/MockDraftView'));

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
    const isMobile = useMediaQuery('(max-width: 768px)');

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
        <div className="relative w-full h-full flex flex-col font-sans gradient-background">
            <SkipLink />
            <AnimatePresence mode="wait">
                <motion.div
                    key={state.currentView}
                    id="main-content"
                    className="w-full h-full"
                    variants={viewVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >
                    {renderView()}
                </motion.div>
            </AnimatePresence>
            
            {isMobile && (
                <>
                    <MobileBottomNav
                        activeView={state.currentView}
                        onViewChange={(view) => dispatch({ type: 'SET_VIEW', payload: view as any })}
                        notificationCount={0}
                    />
                    <PWAInstallButton />
                </>
            )}
            
            <div className="fixed top-4 right-4 z-50">
                <HighContrastMode />
            </div>
        </div>
    );
}
}

const App: React.FC = () => {
  return (
    <AppProvider>
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </div>
    </AppProvider>
  );
};

export default App;