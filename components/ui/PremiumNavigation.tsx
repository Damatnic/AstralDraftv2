import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import type { View } from '../../types';

interface NavigationProps {
  currentView: View;
  onViewChange: (view: View) => void;
  userName?: string;
  teamName?: string;
  leagueName?: string;
  onLogout?: () => void;

}

interface NavItem {
  id: View;
  label: string;
  icon: string;
  description?: string;
  badge?: number | string;
  color: string;
  bgGradient: string;

export const PremiumNavigation: React.FC<NavigationProps> = ({ currentView,
  onViewChange,
  userName = 'Guest',
  teamName = 'My Team',
  leagueName = 'Fantasy League',
  onLogout
 }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navItems: NavItem[] = [
    {
      id: 'DASHBOARD' as View,
      label: 'Dashboard',
      icon: '🏠',
      description: 'League overview',
      color: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-500/20 to-blue-600/10'
    },
    {
      id: 'TEAM_HUB' as View,
      label: 'My Team',
      icon: '🏈',
      description: 'Manage roster',
      color: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-500/20 to-emerald-600/10',
      badge: 'PRO'
    },
    {
      id: 'PLAYERS' as View,
      label: 'Players',
      icon: '👥',
      description: 'Research hub',
      color: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-500/20 to-purple-600/10'
    },
    {
      id: 'DRAFT_ROOM' as View,
      label: 'Draft',
      icon: '📋',
      description: 'Live draft room',
      color: 'from-orange-500 to-red-600',
      bgGradient: 'from-orange-500/20 to-red-600/10',
      badge: 'LIVE'
    },
    {
      id: 'TRADES' as View,
      label: 'Trades',
      icon: '🤝',
      description: 'Trade center',
      color: 'from-pink-500 to-rose-600',
      bgGradient: 'from-pink-500/20 to-rose-600/10',
      badge: 3
    },
    {
      id: 'MESSAGES' as View,
      label: 'Messages',
      icon: '💬',
      description: 'League chat',
      color: 'from-indigo-500 to-indigo-600',
      bgGradient: 'from-indigo-500/20 to-indigo-600/10',
      badge: 5

  ];

  return (
    <>
      {/* Premium Navigation Bar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`
          fixed top-0 left-0 right-0 z-[1000]
          transition-all duration-500 ease-out
          ${scrolled 
            ? 'glass-panel py-3 shadow-2xl border-b border-white/10' 
            : 'bg-gradient-to-b from-dark-900/95 via-dark-900/80 to-transparent py-4'

        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
            {/* Logo Section */}
            <div className="flex items-center gap-4 sm:px-4 md:px-6 lg:px-8">
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl glass-card hover:bg-white/10 transition-all"
                aria-label="Toggle menu"
              >
                <motion.svg 
                  className="w-6 h-6 text-white sm:px-4 md:px-6 lg:px-8"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
                >
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </motion.svg>
              </button>

              {/* Logo and League Info */}
              <motion.div 
                className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="relative sm:px-4 md:px-6 lg:px-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-primary-500/30 sm:px-4 md:px-6 lg:px-8">
                    <span className="text-2xl sm:px-4 md:px-6 lg:px-8">🏈</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50 sm:px-4 md:px-6 lg:px-8" />
                </div>
                
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent sm:px-4 md:px-6 lg:px-8">
                    {leagueName}
                  </h1>
                  <p className="text-xs text-gray-400 font-medium sm:px-4 md:px-6 lg:px-8">
                    2025 Season • Week 1
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Desktop Navigation Items */}
            <div className="hidden lg:flex items-center gap-2">
              {navItems.map((item) => (
                <NavButton
                  key={item.id}
                  item={item}
                  isActive={currentView === item.id}
                  onClick={() => onViewChange(item.id)}
                />
              ))}
            </div>

            {/* User Section */}
            <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
              {/* Notifications Button */}
              <motion.button 
                className="relative p-2.5 rounded-xl glass-card hover:bg-white/10 transition-all sm:px-4 md:px-6 lg:px-8"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5 text-white sm:px-4 md:px-6 lg:px-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50 sm:px-4 md:px-6 lg:px-8" />
              </motion.button>

              {/* User Profile */}
              <UserMenu userName={userName} teamName={teamName} onLogout={onLogout} />
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
              transition={{ duration: 0.3 }}
              className="lg:hidden mt-4 glass-panel mx-4 rounded-2xl overflow-hidden"
            >
              <div className="p-4 space-y-2 sm:px-4 md:px-6 lg:px-8">
                {navItems.map((item) => (
                  <MobileNavItem
                    key={item.id}
                    item={item}
                    isActive={currentView === item.id}
                    onClick={() => {
                      onViewChange(item.id);
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
      <div className="h-20 lg:h-24" />
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
      className={`
        relative px-4 py-2 rounded-xl font-medium text-sm
        transition-all duration-300
        ${isActive 
          ? 'bg-gradient-to-r ' + item.color + ' text-white shadow-lg' 
          : 'text-gray-300 hover:text-white hover:bg-white/10'

      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
        <span className="text-lg sm:px-4 md:px-6 lg:px-8">{item.icon}</span>
        <span>{item.label}</span>
        {item.badge && (
          <span className={`
            px-2 py-0.5 rounded-full text-xs font-bold
            ${typeof item.badge === 'number' 
              ? 'bg-red-500 text-white' 
              : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'

          `}>
            {item.badge}
          </span>
        )}
      </div>
      
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-white/10 sm:px-4 md:px-6 lg:px-8"
          layoutId="activeNav"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
    </motion.button>
  );
};

// Mobile Navigation Item Component
const MobileNavItem: React.FC<{
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
}> = ({ item, isActive, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      className={`
        w-full p-4 rounded-xl text-left
        transition-all duration-300
        ${isActive 
          ? 'bg-gradient-to-r ' + item.bgGradient + ' border border-white/20' 
          : 'hover:bg-white/5'

      `}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
          <span className="text-2xl sm:px-4 md:px-6 lg:px-8">{item.icon}</span>
          <div>
            <p className={`font-semibold ${isActive ? 'text-white' : 'text-gray-200'}`}>
              {item.label}
            </p>
            <p className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">{item.description}</p>
          </div>
        </div>
        {item.badge && (
          <span className={`
            px-2 py-1 rounded-full text-xs font-bold
            ${typeof item.badge === 'number' 
              ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
              : 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/30'

          `}>
            {item.badge}
          </span>
        )}
      </div>
    </motion.button>
  );
};

// User Menu Component
const UserMenu: React.FC<{
  userName: string;
  teamName: string;
  onLogout?: () => void;
}> = ({ userName, teamName, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="relative sm:px-4 md:px-6 lg:px-8">
      <motion.button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-3 px-3 py-2 rounded-xl glass-card hover:bg-white/10 transition-all sm:px-4 md:px-6 lg:px-8"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg sm:px-4 md:px-6 lg:px-8">
          {userName[0]}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-semibold text-white sm:px-4 md:px-6 lg:px-8">{userName}</p>
          <p className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">{teamName}</p>
        </div>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} 
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-56 glass-panel rounded-xl overflow-hidden shadow-2xl sm:px-4 md:px-6 lg:px-8"
          >
            <div className="p-2 sm:px-4 md:px-6 lg:px-8">
              <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/10 rounded-lg transition-colors sm:px-4 md:px-6 lg:px-8">
                Profile Settings
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/10 rounded-lg transition-colors sm:px-4 md:px-6 lg:px-8">
                Team Settings
              </button>
              <hr className="my-2 border-white/10 sm:px-4 md:px-6 lg:px-8" />
              <button 
                onClick={onLogout}
                className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors sm:px-4 md:px-6 lg:px-8"
              >
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};