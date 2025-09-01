/**
 * Oracle-Only App Component - Standalone Oracle Interface
 * Focuses on Oracle predictions with simple 10-player + admin login
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useState, memo } from &apos;react&apos;;
import ProductionAuthProvider, { useProductionAuth } from &apos;../contexts/ProductionAuthContext&apos;;
import ProductionLoginInterface from &apos;../components/auth/ProductionLoginInterface&apos;;
import MobileOptimizedOracleInterface from &apos;../components/oracle/MobileOptimizedOracleInterface&apos;;
import NotificationDemo from &apos;../components/oracle/NotificationDemo&apos;;
import UserSettings from &apos;../components/auth/UserSettings&apos;;
import OraclePerformanceDashboard from &apos;../components/oracle/OraclePerformanceDashboard&apos;;
import OracleCacheDashboard from &apos;../components/oracle/OracleCacheDashboard&apos;;
import { motion } from &apos;framer-motion&apos;;
import { LogOutIcon, SettingsIcon, TestTubeIcon, ActivityIcon, DatabaseIcon } from &apos;lucide-react&apos;;

// Memoized AppContent for better performance
const OracleOnlyAppContent: React.FC = memo(function OracleOnlyAppContent() {
}
    const { user, isAuthenticated, logout, isLoading } = useProductionAuth();
    const [showSettings, setShowSettings] = useState(false);
    const [showDemo, setShowDemo] = useState(false);
    const [showPerformance, setShowPerformance] = useState(false);
    const [showCache, setShowCache] = useState(false);

    // Show loading state while authenticating
    if (isLoading) {
}
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center sm:px-4 md:px-6 lg:px-8">
                <div className="text-center sm:px-4 md:px-6 lg:px-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4 sm:px-4 md:px-6 lg:px-8"></div>
                    <p className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Loading...</p>
                </div>
            </div>
        );

    if (!isAuthenticated) {
}
        return <ProductionLoginInterface />;

    if (showSettings) {
}
        return (
            <div className="min-h-screen bg-gray-900 sm:px-4 md:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto p-4 sm:px-4 md:px-6 lg:px-8">
                    {/* Settings Header */}
                    <div className="flex items-center justify-between mb-6 sm:px-4 md:px-6 lg:px-8">
                        <button
                            onClick={() => setShowSettings(false)}
                        >
                            ← Back to Oracle
                        </button>
                        <h1 className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">Settings</h1>
                        <div className="w-20 sm:px-4 md:px-6 lg:px-8"></div> {/* Spacer */}
                    </div>
                    
                    <UserSettings />
                </div>
            </div>
        );

    if (showDemo) {
}
        return (
            <div className="min-h-screen bg-gray-900 sm:px-4 md:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto p-4 sm:px-4 md:px-6 lg:px-8">
                    {/* Demo Header */}
                    <div className="flex items-center justify-between mb-6 sm:px-4 md:px-6 lg:px-8">
                        <button
                            onClick={() => setShowDemo(false)}
                        >
                            ← Back to Oracle
                        </button>
                        <h1 className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">Notification Demo</h1>
                        <div className="w-20 sm:px-4 md:px-6 lg:px-8"></div> {/* Spacer */}
                    </div>
                    
                    <NotificationDemo />
                </div>
            </div>
        );

    if (showPerformance) {
}
        return (
            <div className="min-h-screen bg-gray-900 sm:px-4 md:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto p-4 sm:px-4 md:px-6 lg:px-8">
                    {/* Performance Header */}
                    <div className="flex items-center justify-between mb-6 sm:px-4 md:px-6 lg:px-8">
                        <button
                            onClick={() => setShowPerformance(false)}
                        >
                            ← Back to Oracle
                        </button>
                        <h1 className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">Performance Dashboard</h1>
                        <div className="w-20 sm:px-4 md:px-6 lg:px-8"></div> {/* Spacer */}
                    </div>
                    
                    <OraclePerformanceDashboard />
                </div>
            </div>
        );

    if (showCache) {
}
        return (
            <div className="min-h-screen bg-gray-900 sm:px-4 md:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto p-4 sm:px-4 md:px-6 lg:px-8">
                    {/* Cache Header */}
                    <div className="flex items-center justify-between mb-6 sm:px-4 md:px-6 lg:px-8">
                        <button
                            onClick={() => setShowCache(false)}
                        >
                            ← Back to Oracle
                        </button>
                        <h1 className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">Cache Dashboard</h1>
                        <div className="w-20 sm:px-4 md:px-6 lg:px-8"></div> {/* Spacer */}
                    </div>
                    
                    <OracleCacheDashboard />
                </div>
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-900 sm:px-4 md:px-6 lg:px-8">
            {/* Header with User Info and Controls */}
            <div className="bg-gray-800 border-b border-gray-700 sm:px-4 md:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto px-4 py-3 sm:px-4 md:px-6 lg:px-8">
                    <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                        {/* Left side - Welcome */}
                        <div className="flex items-center space-x-3 sm:px-4 md:px-6 lg:px-8">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center sm:px-4 md:px-6 lg:px-8">
                                <span className="text-white font-semibold text-sm sm:px-4 md:px-6 lg:px-8">
                                    {user?.username?.[0]?.toUpperCase() || &apos;U&apos;}
                                </span>
                            </div>
                            <div>
                                <p className="text-white font-medium sm:px-4 md:px-6 lg:px-8">Welcome, {user?.username || &apos;User&apos;}</p>
                                <p className="text-gray-400 text-sm sm:px-4 md:px-6 lg:px-8">Oracle System Ready</p>
                            </div>
                        </div>

                        {/* Right side - Action buttons */}
                        <div className="flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                            {/* Performance Dashboard Button */}
                            <button
                                onClick={() => setShowPerformance(true)}
                                title="Performance Dashboard"
                            >
                                <ActivityIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
                            </button>

                            {/* Cache Dashboard Button */}
                            <button
                                onClick={() => setShowCache(true)}
                                title="Cache Dashboard"
                            >
                                <DatabaseIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
                            </button>

                            {/* Demo Button */}
                            <button
                                onClick={() => setShowDemo(true)}
                                title="Notification Demo"
                            >
                                <TestTubeIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
                            </button>
                            
                            {/* Settings Button */}
                            <button
                                onClick={() => setShowSettings(true)}
                                title="Settings"
                            >
                                <SettingsIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
                            </button>
                            
                            {/* Logout Button */}
                            <button
                                onClick={logout}
                                className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors sm:px-4 md:px-6 lg:px-8"
                                title="Logout"
                             aria-label="Action button">
                                <LogOutIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto p-4 sm:px-4 md:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <MobileOptimizedOracleInterface />
                </motion.div>
            </div>
        </div>
    );
});

const OracleOnlyApp: React.FC = () => {
}
    return (
        <ProductionAuthProvider>
            <OracleOnlyAppContent />
        </ProductionAuthProvider>
    );
};

const OracleOnlyAppWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <OracleOnlyApp {...props} />
  </ErrorBoundary>
);

export default React.memo(OracleOnlyAppWithErrorBoundary);
