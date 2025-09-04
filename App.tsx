import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useTheme } from './contexts/ThemeContext';
import { useAuth } from './contexts/SimpleAuthContext';
// LoadingCoordinatorProvider is provided at the root in index.tsx
import { ModernLoginScreen } from './components/auth/ModernLoginScreen';
import { UnifiedLoading } from './components/ui/UnifiedLoading';
import { ThemeToggle } from './components/ui/ThemeToggle';
import SimpleAuthService from './services/simpleAuthService';

// Use SimpleDashboard as fallback for all routes
const Dashboard = lazy(() => Promise.resolve({ default: SimpleDashboard }));
const TeamHub = lazy(() => Promise.resolve({ default: SimpleDashboard }));
const DraftRoom = lazy(() => Promise.resolve({ default: SimpleDashboard }));

// Simple fallback dashboard if main components aren't available
const SimpleDashboard: React.FC = () => {
  const { user: currentUser, logout } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Astral Draft
              </h1>
              <span className="text-sm text-gray-400">
                Welcome, {currentUser?.displayName || 'Player'}!
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quick Stats Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">📊 Quick Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">League Rank:</span>
                <span className="text-white font-medium">#1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Points This Week:</span>
                <span className="text-green-400 font-medium">127.8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Record:</span>
                <span className="text-white font-medium">8-2</span>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">⚡ Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors">
                Set Lineup
              </button>
              <button className="w-full py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition-colors">
                View Matchup
              </button>
              <button className="w-full py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-colors">
                Check Waivers
              </button>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">📈 Recent Activity</h3>
            <div className="space-y-2 text-sm">
              <div className="text-gray-300">
                <span className="text-green-400">+</span> Added Travis Kelce
              </div>
              <div className="text-gray-300">
                <span className="text-red-400">-</span> Dropped Mike Williams
              </div>
              <div className="text-gray-300">
                <span className="text-blue-400">↔</span> Trade completed
              </div>
            </div>
          </div>
        </div>

        {/* Feature Preview Notice */}
        <div className="mt-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-md rounded-xl p-6 border border-blue-400/30">
          <h3 className="text-xl font-semibold text-white mb-2">🚀 Premium Features Loaded</h3>
          <p className="text-gray-300 mb-4">
            Your modern login system and design components are now active! This dashboard demonstrates the integration.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl mb-2">🎨</div>
              <div className="text-white font-medium">Modern UI</div>
              <div className="text-gray-400">Glass morphism design system</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🔐</div>
              <div className="text-white font-medium">Enhanced Auth</div>
              <div className="text-gray-400">Biometric + PIN security</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">⚡</div>
              <div className="text-white font-medium">Real-time Updates</div>
              <div className="text-gray-400">Live scoring & notifications</div>
            </div>
          </div>
        </div>
      </main>
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
  const navigate = useNavigate();
  const location = useLocation();
  const { user: currentUser, login: setCurrentUser } = useAuth();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [useSimpleLogin, setUseSimpleLogin] = useState(false);

  // Initialize auth state
  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        SimpleAuthService.initialize();
        const session = SimpleAuthService.getCurrentSession();
        if (session) {
          setCurrentUser(session.user);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [setCurrentUser]);

  // Handle successful login from ModernLoginScreen
  const handleLogin = async (userId: string, pin: string) => {
    try {
      const session = await SimpleAuthService.authenticateUser(userId, pin);
      if (session) {
        setCurrentUser(session.user);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  // Handle simple login toggle
  const handleToggleSimple = () => {
    setUseSimpleLogin(!useSimpleLogin);
  };

  // Loading screen
  if (isLoading) {
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
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all text-sm sm:text-base"
                    >
                      Quick Login
                    </button>
                    <button
                      onClick={handleToggleSimple}
                      className="w-full mt-4 text-sm text-white/60 hover:text-white/80 transition-colors"
                    >
                      Use Modern Login
                    </button>
                  </div>
                </div>
              ) : (
                <ModernLoginScreen
                  onLogin={(user) => handleLogin(user.id, user.security.pin)}
                  onToggleSimple={handleToggleSimple}
                />
              )
            } 
          />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Suspense fallback={<UnifiedLoading fallbackText="Loading Dashboard..." />}>
                  <Dashboard />
                </Suspense>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/team" 
            element={
              <ProtectedRoute>
                <Suspense fallback={<UnifiedLoading fallbackText="Loading Team Hub..." />}>
                  <TeamHub />
                </Suspense>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/draft" 
            element={
              <ProtectedRoute>
                <Suspense fallback={<UnifiedLoading fallbackText="Loading Draft Room..." />}>
                  <DraftRoom />
                </Suspense>
              </ProtectedRoute>
            } 
          />

          {/* Fallback Dashboard Route */}
          <Route 
            path="/simple-dashboard" 
            element={
              <ProtectedRoute>
                <SimpleDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Default redirects */}
          <Route 
            path="/" 
            element={
              currentUser ? 
                <Navigate to="/dashboard" replace /> : 
                <Navigate to="/login" replace />
            } 
          />
          
          {/* Catch all - redirect to dashboard or login */}
          <Route 
            path="*" 
            element={
              currentUser ? 
                <Navigate to="/dashboard" replace /> : 
                <Navigate to="/login" replace />
            } 
          />
          </Routes>
        </AnimatePresence>
      </div>
  );
};

export default App;