import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from './contexts/ThemeContext';
import { useAuth } from './contexts/SimpleAuthContext';
// LoadingCoordinatorProvider is provided at the root in index.tsx
import { ModernLoginScreen } from './components/auth/ModernLoginScreen';
import { UnifiedLoading } from './components/ui/UnifiedLoading';
import { ThemeToggle } from './components/ui/ThemeToggle';
import SimpleAuthService from './services/simpleAuthService';
import SimplePlayerLogin from './components/auth/SimplePlayerLogin';

// Elite features  
import { CommandPalette } from './components/ui/CommandPalette';
import { NotificationCenter } from './components/ui/NotificationCenter';
import { AdvancedSettings } from './components/ui/AdvancedSettings';

// Use SimpleDashboard as fallback for all routes
const Dashboard = lazy(() => Promise.resolve({ default: SimpleDashboard }));
const TeamHub = lazy(() => Promise.resolve({ default: SimpleDashboard }));
const DraftRoom = lazy(() => Promise.resolve({ default: SimpleDashboard }));

// Elite dashboard with advanced features
const SimpleDashboard: React.FC = () => {
  const { user: currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Elite Header */}
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

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <NotificationCenter />
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-3 px-3 py-2 bg-white/10 rounded-lg cursor-pointer"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-sm">
                  {currentUser?.displayName?.[0] || '👤'}
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
      </motion.header>

      {/* Main Content */}
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
              { title: 'AI Player Insights', icon: '🧠', desc: 'Advanced ML predictions', action: () => navigate('/insights') },
              { title: 'Real-time Analytics', icon: '📊', desc: 'Live performance tracking', action: () => navigate('/analytics') },
              { title: 'Smart Draft Assistant', icon: '🎯', desc: 'Optimal draft strategies', action: () => navigate('/draft') },
              { title: 'League Intelligence', icon: '🏆', desc: 'Competitive analysis', action: () => navigate('/league') },
              { title: 'Injury Predictor', icon: '🏥', desc: 'Risk assessment AI', action: () => {} },
              { title: 'Trade Optimizer', icon: '🔄', desc: 'Fair value calculator', action: () => {} },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02, y: -2 }}
                onClick={feature.action}
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

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 cursor-pointer"
              onClick={() => navigate('/draft')}
            >
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-white font-medium">Start Draft</div>
              <div className="text-blue-100">Begin your championship run</div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-6 cursor-pointer"
              onClick={() => navigate('/analytics')}
            >
              <div className="text-2xl mb-2">📈</div>
              <div className="text-white font-medium">View Analytics</div>
              <div className="text-green-100">Deep dive into data</div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-6 cursor-pointer"
            >
              <div className="text-2xl mb-2">⚡</div>
              <div className="text-white font-medium">Real-time Updates</div>
              <div className="text-orange-100">Live scoring & notifications</div>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Advanced Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <AdvancedSettings onClose={() => setShowSettings(false)} />
        )}
      </AnimatePresence>
      
      {/* Command Palette */}
      <CommandPalette />
    </div>
  );
};

// Protected Route wrapper
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user: currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Main App Component
const App: React.FC = () => {
  const { user: currentUser, isLoading: authLoading } = useAuth();
  const location = useLocation();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [useSimpleLogin] = useState(false);

  // Initialize auth on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        await SimpleAuthService.validateToken();
      } catch (error) {
        console.error('Auth initialization error:', error);
      }
    };
    
    initAuth();
  }, []);

  // Simple login handler for quick access
  const handleLogin = async (playerId: string, pin: string) => {
    try {
      const user = await SimpleAuthService.loginWithPin(playerId, pin);
      navigate('/dashboard');
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Show loading during auth check
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <UnifiedLoading fallbackText="Loading Astral Draft..." />
      </div>
    );
  }

  return (
      <div className={`app ${theme}`} data-theme={theme}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
          {/* Login Route */}
          <Route 
            path="/login" 
            element={
              currentUser ? (
                <Navigate to="/dashboard" replace />
              ) : useSimpleLogin ? (
                <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 sm:p-8 max-w-md w-full mx-4">
                    <h1 className="text-xl sm:text-2xl font-bold text-white text-center mb-6">Simple Login</h1>
                    <button
                      onClick={() => handleLogin('player1', '0000')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                    >
                      Login as Player 1
                    </button>
                  </div>
                </div>
              ) : (
                <SimplePlayerLogin />
              )
            } 
          />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Suspense fallback={<UnifiedLoading />}>
                  <Dashboard />
                </Suspense>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/team" 
            element={
              <ProtectedRoute>
                <Suspense fallback={<UnifiedLoading />}>
                  <TeamHub />
                </Suspense>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/draft" 
            element={
              <ProtectedRoute>
                <Suspense fallback={<UnifiedLoading />}>
                  <DraftRoom />
                </Suspense>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/analytics" 
            element={
              <ProtectedRoute>
                <Suspense fallback={<UnifiedLoading />}>
                  <SimpleDashboard />
                </Suspense>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/insights" 
            element={
              <ProtectedRoute>
                <Suspense fallback={<UnifiedLoading />}>
                  <SimpleDashboard />
                </Suspense>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/league" 
            element={
              <ProtectedRoute>
                <Suspense fallback={<UnifiedLoading />}>
                  <SimpleDashboard />
                </Suspense>
              </ProtectedRoute>
            } 
          />

          {/* Default Routes */}
          <Route 
            path="/" 
            element={
              currentUser ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

export default App;
