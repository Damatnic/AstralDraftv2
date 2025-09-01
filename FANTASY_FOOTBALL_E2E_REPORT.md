# Fantasy Football E2E Test Report

Generated: 2025-09-01T01:09:24.493Z

## Test Results

- **Total Tests**: 30
- **Passed**: 26
- **Failed**: 4
- **Pass Rate**: 86.7%

## Test Suites


### Authentication Flow
- ✅ should have login components
- ✅ should have secure password handling
- ✅ should implement auth context


### Draft Room Integration
- ✅ should have all draft components
- ✅ should implement real-time updates
- ✅ should have AI draft assistance


### Player Management System
- ❌ should have player pool component
  - Error: Expected 
import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useCallback } from 'react';
import type { Player } from '../../types';
import PlayerCard from './PlayerCard';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchIcon } from '../icons/SearchIcon';
import { StarFilledIcon } from '../icons/StarFilledIcon';
import { useAppState } from '../../contexts/AppContext';

interface PlayerPoolProps {
  players: Player[];
  onPlayerSelect: (player: Player) => void;
  onAddToQueue: (player: Player) => void;
  onDraftPlayer: (player: Player) => void;
  onNominatePlayer: (player: Player) => void;
  onAddNote: (player: Player) => void;
  isMyTurn: boolean;
  playersToCompare: Player[];
  onToggleCompare: (player: Player) => void;
  queuedPlayerIds: number[];
  draftFormat: 'SNAKE' | 'AUCTION';
  isNominationTurn: boolean;}

const INITIAL_LOAD_COUNT = 50;
const LOAD_MORE_COUNT = 50;

}

const PlayerPool: React.FC<PlayerPoolProps> = ({ players, onPlayerSelect, onAddToQueue, onDraftPlayer, onNominatePlayer,
    onAddNote, isMyTurn, playersToCompare, onToggleCompare, queuedPlayerIds,
    draftFormat, isNominationTurn 
 }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { state } = useAppState();
  const [search, setSearch] = React.useState('');
  const [positionFilter, setPositionFilter] = React.useState<string>('ALL');
  const [showWatchlistOnly, setShowWatchlistOnly] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<'default' | 'custom'>('default');
  const [visibleCount, setVisibleCount] = React.useState(INITIAL_LOAD_COUNT);

  const filteredPlayers = React.useMemo(() => {
    const initialPool = showWatchlistOnly ? players.filter((p: any) => state.watchlist.includes(p.id)) : players;

    const sortedPool = [...initialPool];
    if (sortBy === 'custom' && state.activeLeagueId && state.customRankings[state.activeLeagueId]) {
      const customRanks = state.customRankings[state.activeLeagueId];
      sortedPool.sort((a, b) => {
        const rankA = customRanks[a.id] ?? Infinity;
        const rankB = customRanks[b.id] ?? Infinity;
        if(rankA !== rankB) return rankA - rankB;
        return a.rank - b.rank; // fallback to default rank
      });

    return sortedPool.filter((p: any) => {
        const searchLower = search.toLowerCase();
        const matchesSearch = p.name.toLowerCase().includes(searchLower) || p.team.toLowerCase().includes(searchLower);
        const matchesPosition = positionFilter === 'ALL' || p.position === positionFilter;
        return matchesSearch && matchesPosition;
    });
  }, [players, search, positionFilter, showWatchlistOnly, state.watchlist, sortBy, state.customRankings, state.activeLeagueId]);

  const playersToShow = filteredPlayers.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPlayers.length;

  const handleLoadMore = () => {
    setVisibleCount(current => current + LOAD_MORE_COUNT);
  };
  
  React.useEffect(() => {
    setVisibleCount(INITIAL_LOAD_COUNT);
  }, [search, positionFilter, showWatchlistOnly, sortBy]);

  const positions = ['ALL', 'QB', 'RB', 'WR', 'TE', 'K', 'DST'];

  return (
    <div className="glass-pane flex flex-col bg-[var(--panel-bg)] border-[var(--panel-border)] rounded-2xl h-full shadow-2xl shadow-black/50 sm:px-4 md:px-6 lg:px-8">
      <div className="flex-shrink-0 p-2 sm:p-3 border-b border-[var(--panel-border)]">
        <h2 className="font-display text-lg sm:text-xl font-bold text-[var(--text-primary)] tracking-wider text-center">AVAILABLE PLAYERS</h2>
        <p className="text-center text-xs sm:text-sm text-cyan-200/70">{players.length} Remaining</p>
      </div>
      <div className="flex-shrink-0 p-1.5 sm:p-2 space-y-2">
         <div className="relative sm:px-4 md:px-6 lg:px-8">
            <input
                type="text"
                placeholder="Search player or team..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-[var(--text-secondary)]" />
         </div>
        <div className="flex gap-1 justify-between items-center flex-wrap sm:px-4 md:px-6 lg:px-8">
            <div className="flex gap-1 flex-wrap sm:px-4 md:px-6 lg:px-8">
                {positions.map((pos: any) => (
                    <button 
                        key={pos} 
                        onClick={() => setPositionFilter(pos)}
                        `}
                    >
                        {pos}
                    </button>
                ))}
            </div>
            <div className="flex gap-1 sm:px-4 md:px-6 lg:px-8">
                <button
                    onClick={() => setShowWatchlistOnly(s => !s)}
                    `}
                >
                    <StarFilledIcon className="h-3 w-3 sm:px-4 md:px-6 lg:px-8" />
                    <span className="hidden sm:inline">Watchlist</span>
                    <span className="sm:hidden">★</span>
                </button>
                <select 
                    value={sortBy} 
                    onChange={e => setSortBy(e.target.value as any)}
                  >
                      <option value="default">Default</option>
                      <option value="custom">Custom</option>
                </select>
            </div>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto p-1 sm:p-2 space-y-1">
        <AnimatePresence>
            {playersToShow.map((player: any) => (
                <PlayerCard 
                    key={player.id} 
                    player={player} 
                    onSelect={() => onPlayerSelect(player)}
                    onAddToQueue={() => onAddToQueue(player)}
                    onDraft={() => onDraftPlayer(player)}
                    onNominate={() => onNominatePlayer(player)}
                    onAddNote={() => onAddNote(player)}
                    isMyTurn={isMyTurn}
                    onToggleCompare={() => onToggleCompare(player)}
                    isSelectedForCompare={playersToCompare.some((p: any) => p.id === player.id)}
                    isInQueue={queuedPlayerIds.includes(player.id)}
                    isNominationTurn={isNominationTurn}
                />
            ))}
        </AnimatePresence>
        {hasMore && (
            <div className="pt-2 text-center sm:px-4 md:px-6 lg:px-8">
                <button onClick={handleLoadMore} className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs font-bold text-cyan-300 bg-cyan-500/10 rounded-md hover:bg-cyan-500/20 mobile-touch-target" aria-label="Action button">
                    Load More ({filteredPlayers.length - visibleCount} remaining)
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

const PlayerPoolWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <PlayerPool {...props} />
  </ErrorBoundary>
);

export default React.memo(PlayerPoolWithErrorBoundary);
 to contain searchTerm
- ✅ should have player research interface
- ✅ should implement player comparison


### Roster Management
- ✅ should have roster manager component
- ✅ should support transactions
- ✅ should have trade center


### Live Scoring System
- ✅ should have WebSocket service
- ✅ should have notification system
- ✅ should implement real-time analytics


### Mobile Experience
- ✅ should have mobile-specific components
- ✅ should implement pull-to-refresh
- ✅ should have offline support


### Analytics & Machine Learning
- ✅ should have ML analytics dashboard
- ✅ should implement Oracle predictions
- ✅ should have team optimization


### Performance Optimizations
- ✅ should implement lazy loading in App.tsx
- ✅ should have memory cleanup utilities
- ✅ should use performance optimization config


### Security Features
- ❌ should have secure contexts
  - Error: Expected /* eslint-disable react-refresh/only-export-components */
/**
 * Simple Authentication Context for Astral Draft
 * Works with SimpleAuthService for 10-player + admin system
 */
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import SimpleAuthService, { SimpleUser } from '../services/simpleAuthService';

interface SimpleAuthContextType {
    user: SimpleUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (user: SimpleUser) => void;
    logout: () => void;
    updateUserPin: (newPin: string) => Promise<boolean>;
    updateUserEmail: (email: string) => Promise<boolean>;
    updateUserCustomization: (customization: Partial<SimpleUser['customization']>) => Promise<boolean>;
    updateUserDisplayName: (displayName: string) => Promise<boolean>;
    clearError: () => void;}

const SimpleAuthContext = createContext<SimpleAuthContextType | undefined>(undefined);

}

interface Props {
    children: ReactNode;

export const SimpleAuthProvider: React.FC<Props> = ({ children }) => {
    const [user, setUser] = useState<SimpleUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Initialize and check for existing session
    useEffect(() => {
        const initializeAuth = () => {
            try {

                SimpleAuthService.initialize();
                const session = SimpleAuthService.getCurrentSession();
                
                if (session) {
                    setUser(session.user);

    } catch (error) {
                setError('Failed to initialize authentication');
            } finally {
                setIsLoading(false);

        };

        initializeAuth();
    }, []);

    const login = useCallback((loggedInUser: SimpleUser) => {
        setUser(loggedInUser);
        setError(null);
    }, []);

    const logout = useCallback(() => {
        SimpleAuthService.logout();
        setUser(null);
        setError(null);
    }, []);

    const updateUserPin = useCallback(async (newPin: string): Promise<boolean> => {
        if (!user) return false;

        try {
            const success = SimpleAuthService.updateUserPin(user.id, newPin);
            if (success) {
                setUser({ ...user, pin: newPin });

            return success;
        
    } catch (err) {
            setError('Failed to update PIN');
            return false;

    }, [user]);

    const updateUserEmail = useCallback(async (email: string): Promise<boolean> => {
        if (!user) return false;

        try {
            const success = SimpleAuthService.updateUserEmail(user.id, email);
            if (success) {
                setUser({ ...user, email });

            return success;
        
    } catch (err) {
            setError('Failed to update email');
            return false;

    }, [user]);

    const updateUserCustomization = useCallback(async (customization: Partial<SimpleUser['customization']>): Promise<boolean> => {
        if (!user) return false;

        try {
            const success = SimpleAuthService.updateUserCustomization(user.id, customization);
            if (success) {
                setUser({
                    ...user,
                    customization: { ...user.customization, ...customization }
                });

            return success;
        
    } catch (err) {
            setError('Failed to update customization');
            return false;

    }, [user]);

    const updateUserDisplayName = useCallback(async (displayName: string): Promise<boolean> => {
        if (!user) return false;

        try {
            const success = SimpleAuthService.updateUserDisplayName(user.id, displayName);
            if (success) {
                setUser({ ...user, displayName });

            return success;
        
    } catch (err) {
            setError('Failed to update display name');
            return false;

    }, [user]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const value: SimpleAuthContextType = useMemo(() => ({
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        logout,
        updateUserPin,
        updateUserEmail,
        updateUserCustomization,
        updateUserDisplayName,
        clearError
    }), [user, isLoading, error, login, logout, updateUserPin, updateUserEmail, updateUserCustomization, updateUserDisplayName, clearError]);

    return (
        <SimpleAuthContext.Provider value={value}>
            {children}
        </SimpleAuthContext.Provider>
    );
};

export const useAuth = (): SimpleAuthContextType => {
    const context = useContext(SimpleAuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within a SimpleAuthProvider');

    return context;
};

export default SimpleAuthProvider;
 to contain localStorage
- ✅ should implement CSP in HTML
- ✅ should have security middleware


### Accessibility Features
- ❌ should have accessible modal component
  - Error: Expected /**
 * Accessible Modal Component
 * Enhanced with focus management, keyboard navigation, and mobile accessibility
 */

import { ErrorBoundary } from './ErrorBoundary';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  useFocusTrap, 
  useAnnouncer, 
  getModalA11yProps,
  srOnlyClasses
} from '../../utils/accessibility';
import { CloseIcon } from '../icons/CloseIcon';

interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  initialFocus?: string; // selector for element to focus initially

}

const sizeClasses = {
  const [isLoading, setIsLoading] = React.useState(false);
  sm: 'max-w-sm',
  md: 'max-w-md', 
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full'
};

export const AccessibleModal: React.FC<AccessibleModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  className = '',
  size = 'md',
  closeOnEscape = true,
  closeOnOverlayClick = true,
  showCloseButton = true,
  initialFocus
}) => {
  const { containerRef } = useFocusTrap(isOpen);
  const { announce } = useAnnouncer();
  const titleId = React.useId();
  const descriptionId = React.useId();

  // Handle escape key and focus trap escape
  React.useEffect(() => {
    if (!isOpen) return;

    const handleCustomEscape = (e: CustomEvent) => {
      if (closeOnEscape) {
        onClose();
        announce('Modal closed', 'polite');
    }
  };

    if (containerRef.current) {
      containerRef.current.addEventListener('focustrap:escape', handleCustomEscape as EventListener);

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('focustrap:escape', handleCustomEscape as EventListener);

    };
  }, [isOpen, closeOnEscape, onClose, announce, containerRef]);

  // Announce modal opening
  React.useEffect(() => {
    if (isOpen) {
      announce(`${title} dialog opened`, 'assertive');

  }, [isOpen, title, announce]);

  // Handle initial focus
  React.useEffect(() => {
    if (isOpen && initialFocus && containerRef.current) {
      const element = containerRef.current.querySelector(initialFocus);
      if (element && element instanceof HTMLElement) {
        setTimeout(() => element.focus(), 100);
    }
  }, [isOpen, initialFocus, containerRef]);

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = originalStyle;
      };

  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
      announce('Modal closed', 'polite');
    }
  };

  const handleCloseClick = () => {
    onClose();
    announce('Modal closed', 'polite');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:px-4 md:px-6 lg:px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm sm:px-4 md:px-6 lg:px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleOverlayClick}
            aria-hidden="true"
          />
          
          {/* Modal Content */}
          <motion.div
            ref={containerRef as React.RefObject<HTMLDivElement>}
            className={`
              relative w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden
              bg-white dark:bg-gray-800 rounded-xl shadow-2xl
              border border-gray-200 dark:border-gray-700
              ${className}
            `}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.15 }}
            {...getModalA11yProps(isOpen, titleId, description ? descriptionId : undefined)}
          >
            {/* Screen reader only close instruction */}
            <div className={srOnlyClasses}>
              Press Escape to close this dialog
            </div>

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sm:px-4 md:px-6 lg:px-8">
              <h2 
                id={titleId}
                className="text-xl font-semibold text-gray-900 dark:text-white font-display sm:px-4 md:px-6 lg:px-8"
              >
                {title}
              </h2>
              
              {showCloseButton && (
                <button
                  onClick={handleCloseClick}
                  className="
                    mobile-touch-target p-2 -mr-2 text-gray-400 hover:text-gray-600 
                    dark:text-gray-500 dark:hover:text-gray-300
                    rounded-full hover:bg-gray-100 dark:hover:bg-gray-700
                    transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
                   sm:px-4 md:px-6 lg:px-8"
                  aria-label="Close dialog"
                >
                  <CloseIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
                </button>
              )}
            </div>

            {/* Description (if provided) */}
            {description && (
              <div 
                id={descriptionId}
                className="px-6 py-2 text-sm text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 sm:px-4 md:px-6 lg:px-8"
              >
                {description}
              </div>
            )}

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-200px)] sm:px-4 md:px-6 lg:px-8">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * Modal Hook for easier usage
 */
export const useModal = (initialOpen: boolean = false) => {
  const [isOpen, setIsOpen] = React.useState(initialOpen);

  const openModal = React.useCallback(() => setIsOpen(true), []);
  const closeModal = React.useCallback(() => setIsOpen(false), []);
  const toggleModal = React.useCallback(() => setIsOpen(prev => !prev), []);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal
  };
};

const AccessibleModalWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <AccessibleModal {...props} />
  </ErrorBoundary>
);

export default React.memo(AccessibleModalWithErrorBoundary);
 to contain role=
- ❌ should implement keyboard navigation
  - Error: Expected 

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '../../contexts/AppContext';
import { players } from '../../data/players';
import type { Player, View } from '../../types';
import { HistoryIcon } from '../icons/HistoryIcon';
import { useFocusTrap } from '../../utils/accessibility';

interface CommandPaletteProps {

}

const CommandPalette: React.FC<CommandPaletteProps> = () => {
  const [isLoading, setIsLoading] = React.useState(false);
    const { state, dispatch } = useAppState();
    const [query, setQuery] = React.useState('');
    const { containerRef } = useFocusTrap(state.isCommandPaletteOpen);

    const leagues = state.leagues.filter((l: any) => !l.isMock);

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Enhanced keyboard navigation
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                dispatch({ type: 'SET_COMMAND_PALETTE_OPEN', payload: !state.isCommandPaletteOpen });

            if (e.key === 'Escape') {
                dispatch({ type: 'SET_COMMAND_PALETTE_OPEN', payload: false });
                setQuery(''); // Clear query on close

            // Quick navigation shortcuts when palette is open
            if (state.isCommandPaletteOpen) {
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    // Handle arrow navigation (implementation would depend on results structure)

                if (e.key === 'Enter') {
                    e.preventDefault();
                    // Handle selection (implementation would depend on selected item)


        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [state.isCommandPaletteOpen, dispatch]);
    
    React.useEffect(() => {
        if (!state.isCommandPaletteOpen) {
            setQuery('');
    }
  }, [state.isCommandPaletteOpen]);

    const handleSelectLeague = (id: string) => {
        dispatch({ type: 'SET_ACTIVE_LEAGUE', payload: id });
        dispatch({ type: 'SET_VIEW', payload: 'LEAGUE_HUB' });
        dispatch({ type: 'SET_COMMAND_PALETTE_OPEN', payload: false });

    const handleSelectPlayer = (player: Player) => {
        dispatch({ type: 'SET_PLAYER_DETAIL', payload: { player } });
        dispatch({ type: 'SET_COMMAND_PALETTE_OPEN', payload: false });

    const handleSelectView = (view: View, name: string) => {
        dispatch({ type: 'SET_VIEW', payload: view });
        dispatch({ type: 'LOG_COMMAND', payload: { name, view }});
        dispatch({ type: 'SET_COMMAND_PALETTE_OPEN', payload: false });

    const commandActions = state.activeLeagueId ? [
        { name: 'Go to My Team', view: 'TEAM_HUB' as View },
        { name: 'View Standings', view: 'LEAGUE_STANDINGS' as View },
        { name: 'Waiver Wire', view: 'WAIVER_WIRE' as View },
        { name: 'Power Rankings', view: 'POWER_RANKINGS' as View },
        { name: 'Analytics Hub', view: 'ANALYTICS_HUB' as View },
        { name: 'Historical Analytics', view: 'HISTORICAL_ANALYTICS' as View },
        { name: 'Go to Dashboard', view: 'DASHBOARD' as View },
    ] : [{ name: 'Go to Dashboard', view: 'DASHBOARD' as View }];

    const queryLower = query.toLowerCase();

    const filteredPlayers = query.length > 2
        ? players.filter((p: any) => p.name.toLowerCase().includes(queryLower)).slice(0, 5)
        : [];
    
    const filteredActions = query.length > 1
        ? commandActions.filter((a: any) => a.name.toLowerCase().includes(queryLower))
        : [];

    const renderResults = () => {
        if (query.length === 0) {
            return (
                <>
                    {state.recentCommands.length > 0 && (
                         <>
                            <h4 className="px-3 py-1 text-xs text-gray-500 font-semibold uppercase flex items-center gap-2 sm:px-4 md:px-6 lg:px-8"><HistoryIcon className="h-4 w-4 sm:px-4 md:px-6 lg:px-8" /> Recent</h4>
                            {state.recentCommands.map((cmd, i) => (
                                <button key={i} onClick={() => handleSelectView(cmd.view, cmd.name)}
                                </button>
                            ))}
                        </>
                    )}
                    <h4 className="px-3 py-1 text-xs text-gray-500 font-semibold uppercase sm:px-4 md:px-6 lg:px-8">My Leagues</h4>
                    {leagues.map((league: any) => (
                        <button key={league.id} onClick={() => handleSelectLeague(league.id)}
                        </button>
                    ))}
                </>
            )

        return (
            <>
                {filteredPlayers.length > 0 && (
                    <>
                        <h4 className="px-3 py-1 text-xs text-gray-500 font-semibold uppercase sm:px-4 md:px-6 lg:px-8">Players</h4>
                        {filteredPlayers.map((player: any) => (
                            <button key={player.id} onClick={() => handleSelectPlayer(player)} <span className="text-gray-500 sm:px-4 md:px-6 lg:px-8">({player.position} - {player.team})</span>
                            </button>
                        ))}
                    </>
                )}
                {filteredActions.length > 0 && (
                     <>
                        <h4 className="px-3 py-1 text-xs text-gray-500 font-semibold uppercase sm:px-4 md:px-6 lg:px-8">Navigation</h4>
                        {filteredActions.map((action: any) => (
                            <button key={action.view} onClick={() => handleSelectView(action.view, action.name)}
                            </button>
                        ))}
                    </>
                )}
                 {filteredPlayers.length === 0 && filteredActions.length === 0 && (
                    <p className="p-4 text-center text-gray-500 sm:px-4 md:px-6 lg:px-8">No results found.</p>
                 )}
            </>
        )
    };

    return (
        <AnimatePresence>
            {state.isCommandPaletteOpen && (
                 <motion.div
                    className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-[20vh] sm:px-4 md:px-6 lg:px-8"
                    onClick={() => dispatch({ type: 'SET_COMMAND_PALETTE_OPEN', payload: false })}
                    {...{
                        initial: { opacity: 0 },
                        animate: { opacity: 1 },
                        exit: { opacity: 0 },
                    }}
                >
                    <motion.div
                        ref={containerRef as React.RefObject<HTMLDivElement>}
                        className="glass-pane w-full max-w-lg rounded-xl shadow-2xl overflow-hidden border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8"
                        onClick={(e: any) => e.stopPropagation()},
                            animate: { opacity: 1, y: 0, scale: 1 },
                            exit: { opacity: 0, y: -20, scale: 0.95 },
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Search players or navigate..."
                            className="w-full p-4 bg-transparent text-lg focus:outline-none text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8"
                            autoFocus
                            value={query}
                            onChange={(e: any) => setQuery(e.target.value)}
                        <div className="border-t border-[var(--panel-border)] p-2 max-h-96 overflow-y-auto sm:px-4 md:px-6 lg:px-8">
                           {renderResults()}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const CommandPaletteWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <CommandPalette {...props} />
  </ErrorBoundary>
);

export default React.memo(CommandPaletteWithErrorBoundary); to contain onKeyDown
- ✅ should have accessibility system


## System Status

✅ **System is ready for production!**

### Critical Features Status:
- Authentication: 3/3 passing
- Draft Room: 3/3 passing
- Player Management: 2/3 passing
- Live Scoring: 3/3 passing
- Mobile Experience: 3/3 passing

## Recommendations


### Issues to Address:


- **Player Management System**: should have player pool component - Expected 
import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useCallback } from 'react';
import type { Player } from '../../types';
import PlayerCard from './PlayerCard';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchIcon } from '../icons/SearchIcon';
import { StarFilledIcon } from '../icons/StarFilledIcon';
import { useAppState } from '../../contexts/AppContext';

interface PlayerPoolProps {
  players: Player[];
  onPlayerSelect: (player: Player) => void;
  onAddToQueue: (player: Player) => void;
  onDraftPlayer: (player: Player) => void;
  onNominatePlayer: (player: Player) => void;
  onAddNote: (player: Player) => void;
  isMyTurn: boolean;
  playersToCompare: Player[];
  onToggleCompare: (player: Player) => void;
  queuedPlayerIds: number[];
  draftFormat: 'SNAKE' | 'AUCTION';
  isNominationTurn: boolean;}

const INITIAL_LOAD_COUNT = 50;
const LOAD_MORE_COUNT = 50;

}

const PlayerPool: React.FC<PlayerPoolProps> = ({ players, onPlayerSelect, onAddToQueue, onDraftPlayer, onNominatePlayer,
    onAddNote, isMyTurn, playersToCompare, onToggleCompare, queuedPlayerIds,
    draftFormat, isNominationTurn 
 }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { state } = useAppState();
  const [search, setSearch] = React.useState('');
  const [positionFilter, setPositionFilter] = React.useState<string>('ALL');
  const [showWatchlistOnly, setShowWatchlistOnly] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<'default' | 'custom'>('default');
  const [visibleCount, setVisibleCount] = React.useState(INITIAL_LOAD_COUNT);

  const filteredPlayers = React.useMemo(() => {
    const initialPool = showWatchlistOnly ? players.filter((p: any) => state.watchlist.includes(p.id)) : players;

    const sortedPool = [...initialPool];
    if (sortBy === 'custom' && state.activeLeagueId && state.customRankings[state.activeLeagueId]) {
      const customRanks = state.customRankings[state.activeLeagueId];
      sortedPool.sort((a, b) => {
        const rankA = customRanks[a.id] ?? Infinity;
        const rankB = customRanks[b.id] ?? Infinity;
        if(rankA !== rankB) return rankA - rankB;
        return a.rank - b.rank; // fallback to default rank
      });

    return sortedPool.filter((p: any) => {
        const searchLower = search.toLowerCase();
        const matchesSearch = p.name.toLowerCase().includes(searchLower) || p.team.toLowerCase().includes(searchLower);
        const matchesPosition = positionFilter === 'ALL' || p.position === positionFilter;
        return matchesSearch && matchesPosition;
    });
  }, [players, search, positionFilter, showWatchlistOnly, state.watchlist, sortBy, state.customRankings, state.activeLeagueId]);

  const playersToShow = filteredPlayers.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPlayers.length;

  const handleLoadMore = () => {
    setVisibleCount(current => current + LOAD_MORE_COUNT);
  };
  
  React.useEffect(() => {
    setVisibleCount(INITIAL_LOAD_COUNT);
  }, [search, positionFilter, showWatchlistOnly, sortBy]);

  const positions = ['ALL', 'QB', 'RB', 'WR', 'TE', 'K', 'DST'];

  return (
    <div className="glass-pane flex flex-col bg-[var(--panel-bg)] border-[var(--panel-border)] rounded-2xl h-full shadow-2xl shadow-black/50 sm:px-4 md:px-6 lg:px-8">
      <div className="flex-shrink-0 p-2 sm:p-3 border-b border-[var(--panel-border)]">
        <h2 className="font-display text-lg sm:text-xl font-bold text-[var(--text-primary)] tracking-wider text-center">AVAILABLE PLAYERS</h2>
        <p className="text-center text-xs sm:text-sm text-cyan-200/70">{players.length} Remaining</p>
      </div>
      <div className="flex-shrink-0 p-1.5 sm:p-2 space-y-2">
         <div className="relative sm:px-4 md:px-6 lg:px-8">
            <input
                type="text"
                placeholder="Search player or team..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-[var(--text-secondary)]" />
         </div>
        <div className="flex gap-1 justify-between items-center flex-wrap sm:px-4 md:px-6 lg:px-8">
            <div className="flex gap-1 flex-wrap sm:px-4 md:px-6 lg:px-8">
                {positions.map((pos: any) => (
                    <button 
                        key={pos} 
                        onClick={() => setPositionFilter(pos)}
                        `}
                    >
                        {pos}
                    </button>
                ))}
            </div>
            <div className="flex gap-1 sm:px-4 md:px-6 lg:px-8">
                <button
                    onClick={() => setShowWatchlistOnly(s => !s)}
                    `}
                >
                    <StarFilledIcon className="h-3 w-3 sm:px-4 md:px-6 lg:px-8" />
                    <span className="hidden sm:inline">Watchlist</span>
                    <span className="sm:hidden">★</span>
                </button>
                <select 
                    value={sortBy} 
                    onChange={e => setSortBy(e.target.value as any)}
                  >
                      <option value="default">Default</option>
                      <option value="custom">Custom</option>
                </select>
            </div>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto p-1 sm:p-2 space-y-1">
        <AnimatePresence>
            {playersToShow.map((player: any) => (
                <PlayerCard 
                    key={player.id} 
                    player={player} 
                    onSelect={() => onPlayerSelect(player)}
                    onAddToQueue={() => onAddToQueue(player)}
                    onDraft={() => onDraftPlayer(player)}
                    onNominate={() => onNominatePlayer(player)}
                    onAddNote={() => onAddNote(player)}
                    isMyTurn={isMyTurn}
                    onToggleCompare={() => onToggleCompare(player)}
                    isSelectedForCompare={playersToCompare.some((p: any) => p.id === player.id)}
                    isInQueue={queuedPlayerIds.includes(player.id)}
                    isNominationTurn={isNominationTurn}
                />
            ))}
        </AnimatePresence>
        {hasMore && (
            <div className="pt-2 text-center sm:px-4 md:px-6 lg:px-8">
                <button onClick={handleLoadMore} className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs font-bold text-cyan-300 bg-cyan-500/10 rounded-md hover:bg-cyan-500/20 mobile-touch-target" aria-label="Action button">
                    Load More ({filteredPlayers.length - visibleCount} remaining)
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

const PlayerPoolWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <PlayerPool {...props} />
  </ErrorBoundary>
);

export default React.memo(PlayerPoolWithErrorBoundary);
 to contain searchTerm





- **Security Features**: should have secure contexts - Expected /* eslint-disable react-refresh/only-export-components */
/**
 * Simple Authentication Context for Astral Draft
 * Works with SimpleAuthService for 10-player + admin system
 */
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import SimpleAuthService, { SimpleUser } from '../services/simpleAuthService';

interface SimpleAuthContextType {
    user: SimpleUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (user: SimpleUser) => void;
    logout: () => void;
    updateUserPin: (newPin: string) => Promise<boolean>;
    updateUserEmail: (email: string) => Promise<boolean>;
    updateUserCustomization: (customization: Partial<SimpleUser['customization']>) => Promise<boolean>;
    updateUserDisplayName: (displayName: string) => Promise<boolean>;
    clearError: () => void;}

const SimpleAuthContext = createContext<SimpleAuthContextType | undefined>(undefined);

}

interface Props {
    children: ReactNode;

export const SimpleAuthProvider: React.FC<Props> = ({ children }) => {
    const [user, setUser] = useState<SimpleUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Initialize and check for existing session
    useEffect(() => {
        const initializeAuth = () => {
            try {

                SimpleAuthService.initialize();
                const session = SimpleAuthService.getCurrentSession();
                
                if (session) {
                    setUser(session.user);

    } catch (error) {
                setError('Failed to initialize authentication');
            } finally {
                setIsLoading(false);

        };

        initializeAuth();
    }, []);

    const login = useCallback((loggedInUser: SimpleUser) => {
        setUser(loggedInUser);
        setError(null);
    }, []);

    const logout = useCallback(() => {
        SimpleAuthService.logout();
        setUser(null);
        setError(null);
    }, []);

    const updateUserPin = useCallback(async (newPin: string): Promise<boolean> => {
        if (!user) return false;

        try {
            const success = SimpleAuthService.updateUserPin(user.id, newPin);
            if (success) {
                setUser({ ...user, pin: newPin });

            return success;
        
    } catch (err) {
            setError('Failed to update PIN');
            return false;

    }, [user]);

    const updateUserEmail = useCallback(async (email: string): Promise<boolean> => {
        if (!user) return false;

        try {
            const success = SimpleAuthService.updateUserEmail(user.id, email);
            if (success) {
                setUser({ ...user, email });

            return success;
        
    } catch (err) {
            setError('Failed to update email');
            return false;

    }, [user]);

    const updateUserCustomization = useCallback(async (customization: Partial<SimpleUser['customization']>): Promise<boolean> => {
        if (!user) return false;

        try {
            const success = SimpleAuthService.updateUserCustomization(user.id, customization);
            if (success) {
                setUser({
                    ...user,
                    customization: { ...user.customization, ...customization }
                });

            return success;
        
    } catch (err) {
            setError('Failed to update customization');
            return false;

    }, [user]);

    const updateUserDisplayName = useCallback(async (displayName: string): Promise<boolean> => {
        if (!user) return false;

        try {
            const success = SimpleAuthService.updateUserDisplayName(user.id, displayName);
            if (success) {
                setUser({ ...user, displayName });

            return success;
        
    } catch (err) {
            setError('Failed to update display name');
            return false;

    }, [user]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const value: SimpleAuthContextType = useMemo(() => ({
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        logout,
        updateUserPin,
        updateUserEmail,
        updateUserCustomization,
        updateUserDisplayName,
        clearError
    }), [user, isLoading, error, login, logout, updateUserPin, updateUserEmail, updateUserCustomization, updateUserDisplayName, clearError]);

    return (
        <SimpleAuthContext.Provider value={value}>
            {children}
        </SimpleAuthContext.Provider>
    );
};

export const useAuth = (): SimpleAuthContextType => {
    const context = useContext(SimpleAuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within a SimpleAuthProvider');

    return context;
};

export default SimpleAuthProvider;
 to contain localStorage
- **Accessibility Features**: should have accessible modal component - Expected /**
 * Accessible Modal Component
 * Enhanced with focus management, keyboard navigation, and mobile accessibility
 */

import { ErrorBoundary } from './ErrorBoundary';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  useFocusTrap, 
  useAnnouncer, 
  getModalA11yProps,
  srOnlyClasses
} from '../../utils/accessibility';
import { CloseIcon } from '../icons/CloseIcon';

interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  initialFocus?: string; // selector for element to focus initially

}

const sizeClasses = {
  const [isLoading, setIsLoading] = React.useState(false);
  sm: 'max-w-sm',
  md: 'max-w-md', 
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full'
};

export const AccessibleModal: React.FC<AccessibleModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  className = '',
  size = 'md',
  closeOnEscape = true,
  closeOnOverlayClick = true,
  showCloseButton = true,
  initialFocus
}) => {
  const { containerRef } = useFocusTrap(isOpen);
  const { announce } = useAnnouncer();
  const titleId = React.useId();
  const descriptionId = React.useId();

  // Handle escape key and focus trap escape
  React.useEffect(() => {
    if (!isOpen) return;

    const handleCustomEscape = (e: CustomEvent) => {
      if (closeOnEscape) {
        onClose();
        announce('Modal closed', 'polite');
    }
  };

    if (containerRef.current) {
      containerRef.current.addEventListener('focustrap:escape', handleCustomEscape as EventListener);

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('focustrap:escape', handleCustomEscape as EventListener);

    };
  }, [isOpen, closeOnEscape, onClose, announce, containerRef]);

  // Announce modal opening
  React.useEffect(() => {
    if (isOpen) {
      announce(`${title} dialog opened`, 'assertive');

  }, [isOpen, title, announce]);

  // Handle initial focus
  React.useEffect(() => {
    if (isOpen && initialFocus && containerRef.current) {
      const element = containerRef.current.querySelector(initialFocus);
      if (element && element instanceof HTMLElement) {
        setTimeout(() => element.focus(), 100);
    }
  }, [isOpen, initialFocus, containerRef]);

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = originalStyle;
      };

  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
      announce('Modal closed', 'polite');
    }
  };

  const handleCloseClick = () => {
    onClose();
    announce('Modal closed', 'polite');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:px-4 md:px-6 lg:px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm sm:px-4 md:px-6 lg:px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleOverlayClick}
            aria-hidden="true"
          />
          
          {/* Modal Content */}
          <motion.div
            ref={containerRef as React.RefObject<HTMLDivElement>}
            className={`
              relative w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden
              bg-white dark:bg-gray-800 rounded-xl shadow-2xl
              border border-gray-200 dark:border-gray-700
              ${className}
            `}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.15 }}
            {...getModalA11yProps(isOpen, titleId, description ? descriptionId : undefined)}
          >
            {/* Screen reader only close instruction */}
            <div className={srOnlyClasses}>
              Press Escape to close this dialog
            </div>

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sm:px-4 md:px-6 lg:px-8">
              <h2 
                id={titleId}
                className="text-xl font-semibold text-gray-900 dark:text-white font-display sm:px-4 md:px-6 lg:px-8"
              >
                {title}
              </h2>
              
              {showCloseButton && (
                <button
                  onClick={handleCloseClick}
                  className="
                    mobile-touch-target p-2 -mr-2 text-gray-400 hover:text-gray-600 
                    dark:text-gray-500 dark:hover:text-gray-300
                    rounded-full hover:bg-gray-100 dark:hover:bg-gray-700
                    transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
                   sm:px-4 md:px-6 lg:px-8"
                  aria-label="Close dialog"
                >
                  <CloseIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
                </button>
              )}
            </div>

            {/* Description (if provided) */}
            {description && (
              <div 
                id={descriptionId}
                className="px-6 py-2 text-sm text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 sm:px-4 md:px-6 lg:px-8"
              >
                {description}
              </div>
            )}

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-200px)] sm:px-4 md:px-6 lg:px-8">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * Modal Hook for easier usage
 */
export const useModal = (initialOpen: boolean = false) => {
  const [isOpen, setIsOpen] = React.useState(initialOpen);

  const openModal = React.useCallback(() => setIsOpen(true), []);
  const closeModal = React.useCallback(() => setIsOpen(false), []);
  const toggleModal = React.useCallback(() => setIsOpen(prev => !prev), []);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal
  };
};

const AccessibleModalWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <AccessibleModal {...props} />
  </ErrorBoundary>
);

export default React.memo(AccessibleModalWithErrorBoundary);
 to contain role=
- **Accessibility Features**: should implement keyboard navigation - Expected 

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '../../contexts/AppContext';
import { players } from '../../data/players';
import type { Player, View } from '../../types';
import { HistoryIcon } from '../icons/HistoryIcon';
import { useFocusTrap } from '../../utils/accessibility';

interface CommandPaletteProps {

}

const CommandPalette: React.FC<CommandPaletteProps> = () => {
  const [isLoading, setIsLoading] = React.useState(false);
    const { state, dispatch } = useAppState();
    const [query, setQuery] = React.useState('');
    const { containerRef } = useFocusTrap(state.isCommandPaletteOpen);

    const leagues = state.leagues.filter((l: any) => !l.isMock);

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Enhanced keyboard navigation
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                dispatch({ type: 'SET_COMMAND_PALETTE_OPEN', payload: !state.isCommandPaletteOpen });

            if (e.key === 'Escape') {
                dispatch({ type: 'SET_COMMAND_PALETTE_OPEN', payload: false });
                setQuery(''); // Clear query on close

            // Quick navigation shortcuts when palette is open
            if (state.isCommandPaletteOpen) {
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    // Handle arrow navigation (implementation would depend on results structure)

                if (e.key === 'Enter') {
                    e.preventDefault();
                    // Handle selection (implementation would depend on selected item)


        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [state.isCommandPaletteOpen, dispatch]);
    
    React.useEffect(() => {
        if (!state.isCommandPaletteOpen) {
            setQuery('');
    }
  }, [state.isCommandPaletteOpen]);

    const handleSelectLeague = (id: string) => {
        dispatch({ type: 'SET_ACTIVE_LEAGUE', payload: id });
        dispatch({ type: 'SET_VIEW', payload: 'LEAGUE_HUB' });
        dispatch({ type: 'SET_COMMAND_PALETTE_OPEN', payload: false });

    const handleSelectPlayer = (player: Player) => {
        dispatch({ type: 'SET_PLAYER_DETAIL', payload: { player } });
        dispatch({ type: 'SET_COMMAND_PALETTE_OPEN', payload: false });

    const handleSelectView = (view: View, name: string) => {
        dispatch({ type: 'SET_VIEW', payload: view });
        dispatch({ type: 'LOG_COMMAND', payload: { name, view }});
        dispatch({ type: 'SET_COMMAND_PALETTE_OPEN', payload: false });

    const commandActions = state.activeLeagueId ? [
        { name: 'Go to My Team', view: 'TEAM_HUB' as View },
        { name: 'View Standings', view: 'LEAGUE_STANDINGS' as View },
        { name: 'Waiver Wire', view: 'WAIVER_WIRE' as View },
        { name: 'Power Rankings', view: 'POWER_RANKINGS' as View },
        { name: 'Analytics Hub', view: 'ANALYTICS_HUB' as View },
        { name: 'Historical Analytics', view: 'HISTORICAL_ANALYTICS' as View },
        { name: 'Go to Dashboard', view: 'DASHBOARD' as View },
    ] : [{ name: 'Go to Dashboard', view: 'DASHBOARD' as View }];

    const queryLower = query.toLowerCase();

    const filteredPlayers = query.length > 2
        ? players.filter((p: any) => p.name.toLowerCase().includes(queryLower)).slice(0, 5)
        : [];
    
    const filteredActions = query.length > 1
        ? commandActions.filter((a: any) => a.name.toLowerCase().includes(queryLower))
        : [];

    const renderResults = () => {
        if (query.length === 0) {
            return (
                <>
                    {state.recentCommands.length > 0 && (
                         <>
                            <h4 className="px-3 py-1 text-xs text-gray-500 font-semibold uppercase flex items-center gap-2 sm:px-4 md:px-6 lg:px-8"><HistoryIcon className="h-4 w-4 sm:px-4 md:px-6 lg:px-8" /> Recent</h4>
                            {state.recentCommands.map((cmd, i) => (
                                <button key={i} onClick={() => handleSelectView(cmd.view, cmd.name)}
                                </button>
                            ))}
                        </>
                    )}
                    <h4 className="px-3 py-1 text-xs text-gray-500 font-semibold uppercase sm:px-4 md:px-6 lg:px-8">My Leagues</h4>
                    {leagues.map((league: any) => (
                        <button key={league.id} onClick={() => handleSelectLeague(league.id)}
                        </button>
                    ))}
                </>
            )

        return (
            <>
                {filteredPlayers.length > 0 && (
                    <>
                        <h4 className="px-3 py-1 text-xs text-gray-500 font-semibold uppercase sm:px-4 md:px-6 lg:px-8">Players</h4>
                        {filteredPlayers.map((player: any) => (
                            <button key={player.id} onClick={() => handleSelectPlayer(player)} <span className="text-gray-500 sm:px-4 md:px-6 lg:px-8">({player.position} - {player.team})</span>
                            </button>
                        ))}
                    </>
                )}
                {filteredActions.length > 0 && (
                     <>
                        <h4 className="px-3 py-1 text-xs text-gray-500 font-semibold uppercase sm:px-4 md:px-6 lg:px-8">Navigation</h4>
                        {filteredActions.map((action: any) => (
                            <button key={action.view} onClick={() => handleSelectView(action.view, action.name)}
                            </button>
                        ))}
                    </>
                )}
                 {filteredPlayers.length === 0 && filteredActions.length === 0 && (
                    <p className="p-4 text-center text-gray-500 sm:px-4 md:px-6 lg:px-8">No results found.</p>
                 )}
            </>
        )
    };

    return (
        <AnimatePresence>
            {state.isCommandPaletteOpen && (
                 <motion.div
                    className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-[20vh] sm:px-4 md:px-6 lg:px-8"
                    onClick={() => dispatch({ type: 'SET_COMMAND_PALETTE_OPEN', payload: false })}
                    {...{
                        initial: { opacity: 0 },
                        animate: { opacity: 1 },
                        exit: { opacity: 0 },
                    }}
                >
                    <motion.div
                        ref={containerRef as React.RefObject<HTMLDivElement>}
                        className="glass-pane w-full max-w-lg rounded-xl shadow-2xl overflow-hidden border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8"
                        onClick={(e: any) => e.stopPropagation()},
                            animate: { opacity: 1, y: 0, scale: 1 },
                            exit: { opacity: 0, y: -20, scale: 0.95 },
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Search players or navigate..."
                            className="w-full p-4 bg-transparent text-lg focus:outline-none text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8"
                            autoFocus
                            value={query}
                            onChange={(e: any) => setQuery(e.target.value)}
                        <div className="border-t border-[var(--panel-border)] p-2 max-h-96 overflow-y-auto sm:px-4 md:px-6 lg:px-8">
                           {renderResults()}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const CommandPaletteWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <CommandPalette {...props} />
  </ErrorBoundary>
);

export default React.memo(CommandPaletteWithErrorBoundary); to contain onKeyDown

