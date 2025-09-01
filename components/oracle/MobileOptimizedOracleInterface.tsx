/**
 * Mobile Optimized Oracle Interface
 * Enhanced responsive design and touch interactions for Oracle predictions
 */

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React from 'react';
import { motion } from 'framer-motion';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { 
    Menu, 
    Target, 
    BarChart3, 
    TrendingUp, 
    Settings
} from 'lucide-react';
import OracleRealTimePredictionInterface from './OracleRealTimePredictionInterface';

interface Props {
    week?: number;
    className?: string;

// Mobile Bottom Navigation Component
}

const MobileBottomNav: React.FC<{
    activeView: string;
    onViewChange: (view: string) => void;
    onSettingsOpen: () => void;
}> = ({ activeView, onViewChange, onSettingsOpen }: any) => (
    <motion.div 
        className="fixed bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-sm border-t border-gray-700 z-50 sm:px-4 md:px-6 lg:px-8"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
        <div className="flex items-center justify-around py-2 px-4 sm:px-4 md:px-6 lg:px-8">
            <button
                onClick={() => onViewChange('predictions')}`}
            >
                <Target className="w-6 h-6 mb-1 sm:px-4 md:px-6 lg:px-8" />
                <span className="text-xs font-medium sm:px-4 md:px-6 lg:px-8">Predictions</span>
            </button>
            
            <button
                onClick={() => onViewChange('stats')}`}
            >
                <TrendingUp className="w-6 h-6 mb-1 sm:px-4 md:px-6 lg:px-8" />
                <span className="text-xs font-medium sm:px-4 md:px-6 lg:px-8">Stats</span>
            </button>
            
            <button
                onClick={() => onViewChange('analytics')}`}
            >
                <BarChart3 className="w-6 h-6 mb-1 sm:px-4 md:px-6 lg:px-8" />
                <span className="text-xs font-medium sm:px-4 md:px-6 lg:px-8">Analytics</span>
            </button>
            
            <button
                onClick={onSettingsOpen}
                className="flex flex-col items-center py-2 px-4 rounded-lg text-gray-400 hover:text-white transition-colors sm:px-4 md:px-6 lg:px-8"
             aria-label="Action button">
                <Settings className="w-6 h-6 mb-1 sm:px-4 md:px-6 lg:px-8" />
                <span className="text-xs font-medium sm:px-4 md:px-6 lg:px-8">Settings</span>
            </button>
        </div>
    </motion.div>
);

// Mobile Header Component
const MobileHeader: React.FC<{
    onMenuToggle: () => void;
    accuracy: number;
}> = ({ onMenuToggle, accuracy }: any) => (
    <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 z-40 p-4 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
            <div className="flex items-center space-x-3 sm:px-4 md:px-6 lg:px-8">
                <button
                    onClick={onMenuToggle}
                    className="p-2 text-gray-400 hover:text-white rounded-lg transition-colors sm:px-4 md:px-6 lg:px-8"
                 aria-label="Action button">
                    <Menu className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
                </button>
                <h1 className="text-xl font-bold text-white sm:px-4 md:px-6 lg:px-8">🔮 Oracle</h1>
            </div>
            
            <div className="text-right sm:px-4 md:px-6 lg:px-8">
                <p className="text-sm text-white font-medium sm:px-4 md:px-6 lg:px-8">{accuracy.toFixed(1)}%</p>
                <p className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">Accuracy</p>
            </div>
        </div>
    </div>
);

// Mobile Swipe Indicators
const MobileSwipeIndicators: React.FC<{
    activeView: string;
}> = ({ activeView }: any) => (
    <div className="flex justify-center space-x-2 py-2 sm:px-4 md:px-6 lg:px-8">
        <div className={`w-2 h-2 rounded-full transition-colors ${
            activeView === 'predictions' ? 'bg-blue-400' : 'bg-gray-600'
        }`}></div>
        <div className={`w-2 h-2 rounded-full transition-colors ${
            activeView === 'stats' ? 'bg-green-400' : 'bg-gray-600'
        }`}></div>
        <div className={`w-2 h-2 rounded-full transition-colors ${
            activeView === 'analytics' ? 'bg-purple-400' : 'bg-gray-600'
        }`}></div>
    </div>
);

const MobileOptimizedOracleInterface: React.FC<Props> = ({ 
    week = 1, 
    className = '' 
}: any) => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [activeView, setActiveView] = React.useState('predictions');
    const [showMobileMenu, setShowMobileMenu] = React.useState(false);

    // For demo purposes, using placeholder accuracy
    const accuracy = 85.2;

    // If not mobile, render the regular interface
    if (!isMobile) {
        return (
            <OracleRealTimePredictionInterface 
                week={week} 
                className={className} 
            />
        );

    return (
        <div className={`w-full pb-20 ${className}`}>
            {/* Mobile Header */}
            <MobileHeader 
                onMenuToggle={() => setShowMobileMenu(true)}
                accuracy={accuracy}
            />

            {/* Swipe Indicators */}
            <MobileSwipeIndicators activeView={activeView} />

            {/* Mobile Tips */}
            <div className="p-4 sm:px-4 md:px-6 lg:px-8">
                <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-3 mb-4 sm:px-4 md:px-6 lg:px-8">
                    <p className="text-sm text-blue-200 flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                        <span>💡</span>
                        <span>Swipe between sections • Tap cards to interact • Long press for options</span>
                    </p>
                </div>

                {/* Main Content */}
                <motion.div
                    key={activeView}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <OracleRealTimePredictionInterface 
                        week={week} 
                        className="mobile-optimized sm:px-4 md:px-6 lg:px-8" 
                    />
                </motion.div>
            </div>

            {/* Mobile Bottom Navigation */}
            <MobileBottomNav
                activeView={activeView}
                onViewChange={setActiveView}
                onSettingsOpen={() => {
                    // Future: Open settings modal
                }}
            />

            {/* Mobile Menu Modal */}
            {showMobileMenu && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 z-50 flex items-end sm:px-4 md:px-6 lg:px-8"
                    onClick={() => setShowMobileMenu(false)}
                >
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        className="w-full bg-gray-800 rounded-t-3xl p-6 sm:px-4 md:px-6 lg:px-8"
                        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
                        onClick={(e: any) => e.stopPropagation()}
                    >
                        <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-6 sm:px-4 md:px-6 lg:px-8"></div>
                        
                        <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                            <h3 className="text-lg font-semibold text-white mb-4 sm:px-4 md:px-6 lg:px-8">Quick Actions</h3>
                            
                            <button
                                onClick={() = aria-label="Action button"> {
                                    setActiveView('predictions');
                                    setShowMobileMenu(false);
                                }}
                                className="w-full flex items-center space-x-3 p-4 bg-gray-700 rounded-xl text-left hover:bg-gray-600 transition-colors sm:px-4 md:px-6 lg:px-8"
                            >
                                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center sm:px-4 md:px-6 lg:px-8">
                                    <Target className="w-5 h-5 text-white sm:px-4 md:px-6 lg:px-8" />
                                </div>
                                <div>
                                    <p className="text-white font-medium sm:px-4 md:px-6 lg:px-8">View Predictions</p>
                                    <p className="text-gray-400 text-sm sm:px-4 md:px-6 lg:px-8">Latest Oracle insights</p>
                                </div>
                            </button>
                            
                            <button
                                onClick={() = aria-label="Action button"> {
                                    setActiveView('analytics');
                                    setShowMobileMenu(false);
                                }}
                                className="w-full flex items-center space-x-3 p-4 bg-gray-700 rounded-xl text-left hover:bg-gray-600 transition-colors sm:px-4 md:px-6 lg:px-8"
                            >
                                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center sm:px-4 md:px-6 lg:px-8">
                                    <BarChart3 className="w-5 h-5 text-white sm:px-4 md:px-6 lg:px-8" />
                                </div>
                                <div>
                                    <p className="text-white font-medium sm:px-4 md:px-6 lg:px-8">Analytics Dashboard</p>
                                    <p className="text-gray-400 text-sm sm:px-4 md:px-6 lg:px-8">Performance insights</p>
                                </div>
                            </button>
                        </div>
                        
                        <button
                            onClick={() => setShowMobileMenu(false)}
                        >
                            Close
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};

const MobileOptimizedOracleInterfaceWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <MobileOptimizedOracleInterface {...props} />
  </ErrorBoundary>
);

export default React.memo(MobileOptimizedOracleInterfaceWithErrorBoundary);
