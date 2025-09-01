/**
 * Mobile Responsive Navigation
 * Beautiful navigation for all screen sizes
 */

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon,
  UsersIcon,
  TrophyIcon,
  ChartBarIcon,
  CalendarIcon,
  MessageCircleIcon,
  UserIcon,
  SettingsIcon,
  BellIcon,
  SearchIcon,
  MenuIcon,
  XIcon,
  ZapIcon,
  ShieldIcon,
  StarIcon,
  PlayIcon,
  TrendingUpIcon,
  ClipboardListIcon,
  NewspaperIcon,
  GiftIcon,
//   LogOutIcon
} from 'lucide-react';
import { useAppState } from '../../contexts/AppContext';
import { netlifyAuth } from '../../services/netlifyAuthService';
import { View } from '../../types';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  view: View;
  badge?: number;
  color?: string;


interface MobileResponsiveNavProps {
  currentView: View;
  onViewChange: (view: View) => void;}

const MobileResponsiveNav: React.FC<MobileResponsiveNavProps> = ({ currentView, onViewChange }: any) => {
  const { state, dispatch } = useAppState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const primaryNavItems: NavItem[] = [
    { label: 'Dashboard', icon: <HomeIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />, view: 'DASHBOARD', color: 'text-blue-500' },
    { label: 'My Team', icon: <ShieldIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />, view: 'TEAM_HUB', color: 'text-green-500' },
    { label: 'Matchup', icon: <PlayIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />, view: 'MATCHUP', badge: 1, color: 'text-red-500' },
    { label: 'Leagues', icon: <UsersIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />, view: 'LEAGUE_HUB', color: 'text-purple-500' },
  ];

  const secondaryNavItems: NavItem[] = [
    { label: 'Analytics', icon: <ChartBarIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />, view: 'ANALYTICS_HUB' },
    { label: 'Standings', icon: <TrophyIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />, view: 'LEAGUE_STANDINGS' },
    { label: 'Waiver Wire', icon: <ClipboardListIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />, view: 'WAIVER_WIRE' },
    { label: 'Draft Room', icon: <ZapIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />, view: 'DRAFT_ROOM' },
    { label: 'Power Rankings', icon: <TrendingUpIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />, view: 'POWER_RANKINGS' },
    { label: 'News', icon: <NewspaperIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />, view: 'WEEKLY_REPORT' },
  ];

  const handleLogout = async () => {
    try {

    await netlifyAuth.logout();
    dispatch({ type: 'LOGOUT' 
    } catch (error) {
      console.error('Error in handleLogout:', error);

    } catch (error) {
        console.error(error);
    });
  };

  // Close menu when view changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentView]);

  // Bottom Navigation for Mobile
  const BottomNav: React.FC = () => (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
      <div className="glass border-t border-[var(--border-primary)] sm:px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-4 h-16 sm:px-4 md:px-6 lg:px-8">
          {primaryNavItems.map((item: any) => (
            <button
              key={item.view}
              onClick={() => onViewChange(item.view)}`}
            >
              {item.icon}
              <span className="text-xs sm:px-4 md:px-6 lg:px-8">{item.label}</span>
              {item.badge && (
                <span className="absolute top-2 right-1/3 w-2 h-2 bg-red-500 rounded-full sm:px-4 md:px-6 lg:px-8" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Side Menu for Mobile
  const SideMenu: React.FC = () => (
    <AnimatePresence>
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
          
          {/* Menu Panel */}
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed top-0 left-0 bottom-0 w-72 bg-[var(--bg-primary)] border-r border-[var(--border-primary)] z-50 lg:hidden overflow-y-auto"
          >
            {/* Header */}
            <div className="p-4 border-b border-[var(--border-primary)] sm:px-4 md:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-4 sm:px-4 md:px-6 lg:px-8">
                <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center sm:px-4 md:px-6 lg:px-8">
                    <StarIcon className="w-5 h-5 text-white sm:px-4 md:px-6 lg:px-8" />
                  </div>
                  <span className="font-bold text-lg gradient-text sm:px-4 md:px-6 lg:px-8">Astral Draft</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <XIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
                </button>
              </div>
              
              {/* User Info */}
              <div className="flex items-center gap-3 p-3 bg-[var(--surface-secondary)] rounded-lg sm:px-4 md:px-6 lg:px-8">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white font-bold sm:px-4 md:px-6 lg:px-8">
                  {state.user?.name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                  <p className="font-medium sm:px-4 md:px-6 lg:px-8">{state.user?.name || 'User'}</p>
                  <p className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">{state.user?.email || 'No email'}</p>
                </div>
              </div>
            </div>
            
            {/* Navigation Items */}
            <div className="p-4 sm:px-4 md:px-6 lg:px-8">
              <div className="space-y-1 mb-6 sm:px-4 md:px-6 lg:px-8">
                <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2 sm:px-4 md:px-6 lg:px-8">
                  Main Menu
                </p>
                {[...primaryNavItems, ...secondaryNavItems].map((item: any) => (
                  <button
                    key={item.view}
                    onClick={() => onViewChange(item.view)}`}
                  >
                    {item.icon}
                    <span className="flex-1 text-left sm:px-4 md:px-6 lg:px-8">{item.label}</span>
                    {item.badge && (
                      <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full sm:px-4 md:px-6 lg:px-8">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              
              {/* Settings Section */}
              <div className="space-y-1 pt-4 border-t border-[var(--border-primary)] sm:px-4 md:px-6 lg:px-8">
                <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2 sm:px-4 md:px-6 lg:px-8">
//                   Settings
                </p>
                <button
                  onClick={() => onViewChange('PROFILE')}
                >
                  <UserIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
                  <span>Profile</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--surface-hover)] sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                  <SettingsIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
                  <span>Settings</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-500 sm:px-4 md:px-6 lg:px-8"
                 aria-label="Action button">
                  <LogOutIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // Desktop Sidebar
  const DesktopSidebar: React.FC = () => (
    <div className="hidden lg:flex fixed left-0 top-16 bottom-0 w-64 bg-[var(--bg-secondary)] border-r border-[var(--border-primary)] flex-col">
      <div className="flex-1 overflow-y-auto p-4 sm:px-4 md:px-6 lg:px-8">
        {/* Primary Navigation */}
        <div className="space-y-1 mb-6 sm:px-4 md:px-6 lg:px-8">
          <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2 sm:px-4 md:px-6 lg:px-8">
//             Main
          </p>
          {primaryNavItems.map((item: any) => (
            <button
              key={item.view}
              onClick={() => onViewChange(item.view)}`}
            >
              <div className={currentView === item.view ? item.color : ''}>
                {item.icon}
              </div>
              <span className="flex-1 text-left sm:px-4 md:px-6 lg:px-8">{item.label}</span>
              {item.badge && (
                <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full animate-pulse sm:px-4 md:px-6 lg:px-8">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Secondary Navigation */}
        <div className="space-y-1 sm:px-4 md:px-6 lg:px-8">
          <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2 sm:px-4 md:px-6 lg:px-8">
//             League
          </p>
          {secondaryNavItems.map((item: any) => (
            <button
              key={item.view}
              onClick={() => onViewChange(item.view)}`}
            >
              {item.icon}
              <span className="flex-1 text-left sm:px-4 md:px-6 lg:px-8">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-[var(--border-primary)] sm:px-4 md:px-6 lg:px-8">
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-semibold rounded-lg hover:shadow-lg transition-all sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
          <GiftIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
          <span>Upgrade to Pro</span>
        </button>
      </div>
    </div>
  );

  // Top Bar for Mobile
  const MobileTopBar: React.FC = () => (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-30 glass border-b border-[var(--border-primary)]">
      <div className="flex items-center justify-between h-14 px-4 sm:px-4 md:px-6 lg:px-8">
        <button
          onClick={() => setMobileMenuOpen(true)}
        >
          <MenuIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
        </button>
        
        <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center sm:px-4 md:px-6 lg:px-8">
            <StarIcon className="w-4 h-4 text-white sm:px-4 md:px-6 lg:px-8" />
          </div>
          <span className="font-bold gradient-text sm:px-4 md:px-6 lg:px-8">Astral Draft</span>
        </div>
        
        <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <SearchIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
          </button>
          <button className="p-2 hover:bg-[var(--surface-hover)] rounded-lg relative sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
            <BellIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full sm:px-4 md:px-6 lg:px-8" />
          </button>
        </div>
      </div>
      
      {/* Search Bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-[var(--border-primary)] overflow-hidden sm:px-4 md:px-6 lg:px-8"
          >
            <div className="p-3 sm:px-4 md:px-6 lg:px-8">
              <input
                type="text"
                value={searchQuery}
                onChange={(e: any) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-lg focus:border-[var(--primary)] focus:outline-none sm:px-4 md:px-6 lg:px-8"
//                 autoFocus
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4 sm:px-4 md:px-6 lg:px-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 sm:px-4 md:px-6 lg:px-8"></div>
        <span className="ml-2 sm:px-4 md:px-6 lg:px-8">Loading...</span>
      </div>
    );

  return (
    <>
      <MobileTopBar />
      <SideMenu />
      <DesktopSidebar />
      <BottomNav />
    </>
  );
};

const MobileResponsiveNavWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <MobileResponsiveNav {...props} />
  </ErrorBoundary>
);

export default React.memo(MobileResponsiveNavWithErrorBoundary);