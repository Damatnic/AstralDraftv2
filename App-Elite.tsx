/**
 * Elite Astral Draft Application
 * Advanced fantasy football platform with premium features
 */

import React, { useState, useEffect, Suspense, lazy, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from './contexts/ThemeContext';
import { useAuth } from './contexts/SimpleAuthContext';
import { UnifiedLoading } from './components/ui/UnifiedLoading';
import { ThemeToggle } from './components/ui/ThemeToggle';
import SimplePlayerLogin from './components/auth/SimplePlayerLogin';

// Elite features
import { usePerformanceMonitor } from './hooks/usePerformanceMonitor';
import { useAnalytics } from './hooks/useAnalytics';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { CommandPalette } from './components/ui/CommandPalette';
import { NotificationCenter } from './components/ui/NotificationCenter';
import { AdvancedSettings } from './components/ui/AdvancedSettings';

// Lazy load components for optimal performance
const EliteDashboard = lazy(() => import('./views/EliteDashboard'));
const AdvancedDraftRoom = lazy(() => import('./views/AdvancedDraftRoom'));
const TeamAnalytics = lazy(() => import('./views/TeamAnalytics'));
const PlayerInsights = lazy(() => import('./views/PlayerInsights'));
const LeagueStats = lazy(() => import('./views/LeagueStats'));

// Elite loading component with advanced animations
const EliteLoading: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-center"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full mx-auto mb-6"
      />
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
      >
        Initializing Elite Experience
      </motion.h2>
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-gray-400 mt-2"
      >
        Preparing advanced analytics and AI insights...
      </motion.p>
    </motion.div>
  </div>
);

// Elite navigation component
const EliteNavigation: React.FC = () => {
  const { user: currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [showSettings, setShowSettings] = useState(false);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dashboard' },
    { id: 'draft', label: 'Draft Room', icon: '🎯', path: '/draft' },
    { id: 'analytics', label: 'Analytics', icon: '📈', path: '/analytics' },
    { id: 'insights', label: 'Insights', icon: '🧠', path: '/insights' },
    { id: 'league', label: 'League', icon: '🏆', path: '/league' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate('/dashboard')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-xl">🔮</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Astral Draft Elite
              </h1>
              <p className="text-xs text-gray-400">AI-Powered Fantasy</p>
            </div>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(item.path)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm font-medium text-white">{item.label}</span>
              </motion.button>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <NotificationCenter />
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3 px-3 py-2 bg-white/10 rounded-lg cursor-pointer"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-sm">
                {currentUser?.avatar || '👤'}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-white">{currentUser?.displayName}</p>
                <p className="text-xs text-gray-400">Elite Member</p>
              </div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSettings(true)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <span className="text-lg">⚙️</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors text-sm"
            >
              Logout
            </motion.button>
          </div>
        </div>
      </div>

      {/* Advanced Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <AdvancedSettings onClose={() => setShowSettings(false)} />
        )}
      </AnimatePresence>
    </motion.header>
  );
};

// Elite dashboard placeholder with advanced features
const EliteDashboardFallback: React.FC = () => {
  const { user: currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <EliteNavigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Welcome Section */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-white mb-2"
            >
              Welcome back, {currentUser?.displayName}! 🚀
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-300"
            >
              Your elite fantasy football command center awaits.
            </motion.p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'AI Player Insights', icon: '🧠', desc: 'Advanced ML predictions' },
              { title: 'Real-time Analytics', icon: '📊', desc: 'Live performance tracking' },
              { title: 'Smart Draft Assistant', icon: '🎯', desc: 'Optimal draft strategies' },
              { title: 'League Intelligence', icon: '🏆', desc: 'Competitive analysis' },
              { title: 'Injury Predictor', icon: '🏥', desc: 'Risk assessment AI' },
              { title: 'Trade Optimizer', icon: '🔄', desc: 'Fair value calculator' },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 cursor-pointer"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4">⚡ Quick Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Win Rate', value: '73%', color: 'text-green-400' },
                { label: 'League Rank', value: '#2', color: 'text-blue-400' },
                { label: 'Points For', value: '1,247', color: 'text-purple-400' },
                { label: 'Trades Made', value: '8', color: 'text-orange-400' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

// Main Elite App Component
const EliteApp: React.FC = () => {
  const { user: currentUser, isLoading: authLoading } = useAuth();
  const location = useLocation();
  const { theme } = useTheme();
  
  // Elite hooks for advanced functionality
  usePerformanceMonitor();
  useAnalytics();
  useKeyboardShortcuts();

  // Loading state
  if (authLoading) {
    return <EliteLoading />;
  }

  // Login state
  if (!currentUser) {
    return (
      <div className={`app ${theme}`} data-theme={theme}>
        <SimplePlayerLogin />
        <CommandPalette />
      </div>
    );
  }

  // Main application
  return (
    <div className={`app ${theme}`} data-theme={theme}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<Navigate to="/dashboard" replace />} />
          
          <Route 
            path="/dashboard" 
            element={
              <Suspense fallback={<EliteLoading />}>
                <EliteDashboardFallback />
              </Suspense>
            } 
          />
          
          <Route 
            path="/draft" 
            element={
              <Suspense fallback={<EliteLoading />}>
                <EliteDashboardFallback />
              </Suspense>
            } 
          />
          
          <Route 
            path="/analytics" 
            element={
              <Suspense fallback={<EliteLoading />}>
                <EliteDashboardFallback />
              </Suspense>
            } 
          />
          
          <Route 
            path="/insights" 
            element={
              <Suspense fallback={<EliteLoading />}>
                <EliteDashboardFallback />
              </Suspense>
            } 
          />
          
          <Route 
            path="/league" 
            element={
              <Suspense fallback={<EliteLoading />}>
                <EliteDashboardFallback />
              </Suspense>
            } 
          />
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AnimatePresence>
      
      <CommandPalette />
    </div>
  );
};

export default EliteApp;
