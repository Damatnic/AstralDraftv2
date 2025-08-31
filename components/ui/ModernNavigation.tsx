import { ErrorBoundary } from './ErrorBoundary';
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { View, User } from '../../types';
import { useModal } from '../../contexts/ModalContext';

interface NavigationProps {
  user?: User;
  userName?: string;
  teamName?: string;
  leagueName?: string;
  currentView?: View;
  onViewChange?: (view: View) => void;
  onLogout?: () => void;

}

interface NavItem {
  id: string;
  label: string;
  icon: string;
  badge?: number;
  accent?: string;
}

export const ModernNavigation: React.FC<NavigationProps> = ({
  user,
  userName = 'Guest',
  teamName = 'My Team',
  leagueName = 'Fantasy League',
  currentView = 'DASHBOARD' as View,
  onViewChange,
  onLogout
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openModal } = useModal();

  // Track scroll position for nav background effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Main navigation items
  const navItems: NavItem[] = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: '🏠' },
    { id: 'TEAM_HUB', label: 'My Team', icon: '🏈', accent: 'primary' },
    { id: 'PLAYERS', label: 'Players', icon: '👥' },
    { id: 'LEAGUE_HUB', label: 'League', icon: '🏆', badge: 3 },
    { id: 'TRADES', label: 'Trades', icon: '🤝' },
    { id: 'DRAFT_ROOM', label: 'Draft', icon: '📋' },
    { id: 'MESSAGES', label: 'Messages', icon: '💬', badge: 5 }
  ];

  return (
    <>
      {/* Main Navigation Bar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className={'fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ease-out ' + (
          scrolled 
            ? 'bg-dark-900/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl' 
            : 'bg-gradient-to-b from-dark-900/80 to-transparent backdrop-blur-xl'
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo & League Info */}
            <div className="flex items-center gap-4 sm:px-4 md:px-6 lg:px-8">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation-menu"
              >
                <svg className="w-6 h-6 sm:px-4 md:px-6 lg:px-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>

              {/* Logo */}
              <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                <div className="relative sm:px-4 md:px-6 lg:px-8">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                    <span className="text-xl lg:text-2xl">🏈</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-secondary-500 rounded-full animate-pulse shadow-lg shadow-secondary-500/50 sm:px-4 md:px-6 lg:px-8" />
                </div>
                
                <div className="hidden sm:block">
                  <h1 className="text-lg lg:text-xl font-bold text-white tracking-tight">
                    {leagueName}
                  </h1>
                  <p className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">
                    2025 Season
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1" role="menubar" aria-label="Navigation menu">
              {navItems.map((item) => (
                <NavButton
                  key={item.id}
                  item={item}
                  isActive={currentView === item.id}
                  onClick={() => onViewChange?.(item.id as View)}
                />
              ))}
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
              {/* Notifications */}
              <button 
                className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 sm:px-4 md:px-6 lg:px-8"
                aria-label="Notifications (1 new)"
                aria-describedby="notification-indicator"
              >
                <svg className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span 
                  className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full animate-pulse sm:px-4 md:px-6 lg:px-8" 
                  id="notification-indicator"
                  aria-label="New notification available"
                />
              </button>

              {/* User Profile Dropdown */}
              <UserMenu
                userName={userName}
                teamName={teamName}
                onLogout={onLogout}
              />
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t border-white/10 bg-dark-900/95 backdrop-blur-xl"
              id="mobile-navigation-menu"
              role="menu"
              aria-label="Mobile navigation menu"
            >
              <div className="px-4 py-4 space-y-1 sm:px-4 md:px-6 lg:px-8">
                {navItems.map((item) => (
                  <MobileNavButton
                    key={item.id}
                    item={item}
                    isActive={currentView === item.id}
                    onClick={() => {
                      onViewChange?.(item.id as View);
                      setMobileMenuOpen(false);
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer for fixed navigation */}
      <div className="h-16 lg:h-20" />
    </>
  );
};

// Desktop Navigation Button Component
const NavButton: React.FC<{
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
}> = ({ item, isActive, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      className={'relative px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 ' + (isActive ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/10')}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      role="menuitem"
      aria-current={isActive ? 'page' : undefined}
      aria-label={'Navigate to ' + item.label + (item.badge ? ' (' + item.badge + ' notifications)' : '')}
    >
      {/* Active indicator */}
      {isActive && (
        <motion.div
          layoutId="navIndicator"
          className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-primary-600/20 rounded-xl border border-primary-500/30 sm:px-4 md:px-6 lg:px-8"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}

      <span className="relative flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
        <span className="text-lg sm:px-4 md:px-6 lg:px-8">{item.icon}</span>
        <span>{item.label}</span>
        {item.badge && item.badge > 0 && (
          <span className="absolute -top-1 -right-2 min-w-[18px] h-[18px] bg-danger-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1 sm:px-4 md:px-6 lg:px-8">
            {item.badge}
          </span>
        )}
      </span>
    </motion.button>
  );
};

// Mobile Navigation Button Component
const MobileNavButton: React.FC<{
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
}> = ({ item, isActive, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      className={'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 ' + (
        isActive 
          ? 'bg-gradient-to-r from-primary-500/20 to-primary-600/20 text-white border border-primary-500/30' 
          : 'text-gray-400 hover:text-white hover:bg-white/10'
      )}
      whileTap={{ scale: 0.98 }}
      role="menuitem"
      aria-current={isActive ? 'page' : undefined}
      aria-label={'Navigate to ' + item.label + (item.badge ? ' (' + item.badge + ' notifications)' : '')}
    >
      <span className="text-xl sm:px-4 md:px-6 lg:px-8">{item.icon}</span>
      <span className="font-medium sm:px-4 md:px-6 lg:px-8">{item.label}</span>
      {item.badge && item.badge > 0 && (
        <span className="ml-auto min-w-[24px] h-[24px] bg-danger-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1 sm:px-4 md:px-6 lg:px-8">
          {item.badge}
        </span>
      )}
    </motion.button>
  );
};

// User Menu Component
const UserMenu: React.FC<{
  userName: string;
  teamName: string;
  onLogout?: () => void;
}> = ({ userName, teamName, onLogout }) => {
  const [open, setOpen] = useState(false);
  const { openModal } = useModal();

  return (
    <div className="relative sm:px-4 md:px-6 lg:px-8">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 sm:px-4 md:px-6 lg:px-8"
        aria-label={'User menu for ' + userName + ' - ' + teamName}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls="user-dropdown-menu"
      >
        <div className="hidden sm:block text-right">
          <p className="text-sm font-semibold text-white group-hover:text-primary-400 transition-colors sm:px-4 md:px-6 lg:px-8">
            {userName}
          </p>
          <p className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">
            {teamName}
          </p>
        </div>
        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/20 sm:px-4 md:px-6 lg:px-8">
          {userName.charAt(0).toUpperCase()}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40 sm:px-4 md:px-6 lg:px-8" 
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-64 origin-top-right z-50 sm:px-4 md:px-6 lg:px-8"
              id="user-dropdown-menu"
              role="menu"
              aria-label="User account menu"
            >
              <div className="bg-dark-800/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl overflow-hidden sm:px-4 md:px-6 lg:px-8">
                {/* User Info Header */}
                <div className="p-4 border-b border-white/10 bg-gradient-to-r from-primary-500/10 to-primary-600/10 sm:px-4 md:px-6 lg:px-8">
                  <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white font-bold text-lg sm:px-4 md:px-6 lg:px-8">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-white sm:px-4 md:px-6 lg:px-8">{userName}</p>
                      <p className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">{teamName}</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-2 sm:px-4 md:px-6 lg:px-8">
                  <MenuButton icon="⚙️" label="Settings" onClick={() => { setOpen(false); openModal('settings'); }} />
                  <MenuButton icon="👤" label="Profile" onClick={() => { setOpen(false); openModal('profile'); }} />
                  <MenuButton icon="📊" label="Analytics" onClick={() => { setOpen(false); openModal('analytics'); }} />
                  <MenuButton icon="❓" label="Help & Support" onClick={() => { setOpen(false); openModal('help'); }} />
                  
                  <div className="my-2 border-t border-white/10 sm:px-4 md:px-6 lg:px-8" />
                  
                  <MenuButton 
                    icon="🚪" 
                    label="Sign Out" 
                    onClick={() => {
                      setOpen(false);
                      onLogout?.();
                    }}
                    variant="danger"
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// Menu Button Component
const MenuButton: React.FC<{
  icon: string;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
}> = ({ icon, label, onClick, variant = 'default' }) => {
  const variantClasses = {
    default: 'hover:bg-white/10 text-gray-300 hover:text-white',
    danger: 'hover:bg-danger-500/20 text-gray-300 hover:text-danger-400'
  };

  return (
    <button
      onClick={onClick}
      className={'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 ' + variantClasses[variant]}
      role="menuitem"
      aria-label={label}
    >
      <span className="text-lg sm:px-4 md:px-6 lg:px-8">{icon}</span>
      <span className="text-sm font-medium sm:px-4 md:px-6 lg:px-8">{label}</span>
    </button>
  );
};

const ModernNavigationWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <ModernNavigation {...props} />
  </ErrorBoundary>
);

export default React.memo(ModernNavigationWithErrorBoundary);
