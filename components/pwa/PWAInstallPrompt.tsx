/**
 * PWA Install Prompt Component
 * Helps users install the app as a native mobile app
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkInstallation = () => {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = (window.navigator as any).standalone === true;
      const isInstalled = isStandaloneMode || isIOSStandalone;
      
      setIsStandalone(isStandaloneMode || isIOSStandalone);
      setIsInstalled(isInstalled);
    };

    // Check if device is iOS
    const checkIOS = () => {
      const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
      setIsIOS(isIOSDevice);
    };

    checkInstallation();
    checkIOS();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show install prompt after a delay if not already installed
      if (!isInstalled) {
        setTimeout(() => {
          setShowInstallPrompt(true);
        }, 5000); // Show after 5 seconds
      }
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    } catch (error) {
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    
    // Don't show again for this session
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  const handleIOSInstallInstructions = () => {
    setShowInstallPrompt(true);
  };

  // Don't show if already installed or dismissed this session
  if (isInstalled || sessionStorage.getItem('pwa-install-dismissed')) {
    return null;
  }

  return (
    <>
      {/* Install Button for iOS users */}
      {isIOS && !isStandalone && (
        <button
          onClick={handleIOSInstallInstructions}
          className="fixed bottom-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors"
          title="Install App"
        >
          <span className="text-xl">📱</span>
        </button>
      )}

      {/* Install Prompt Modal */}
      <AnimatePresence>
        {showInstallPrompt && (
          <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.9 }}
              className="card w-full max-w-md"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">🏈</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Install Astral Draft</h3>
                    <p className="text-sm text-slate-400">Get the full app experience</p>
                  </div>
                </div>
                <button
                  onClick={handleDismiss}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <span className="text-xl">×</span>
                </button>
              </div>

              {/* Content */}
              <div className="space-y-4">
                {isIOS ? (
                  /* iOS Installation Instructions */
                  <div>
                    <h4 className="text-white font-semibold mb-3">Install on iOS:</h4>
                    <div className="space-y-3 text-sm text-slate-300">
                      <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                        <span className="text-lg">1️⃣</span>
                        <span>Tap the <strong>Share</strong> button in Safari</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                        <span className="text-lg">2️⃣</span>
                        <span>Scroll down and tap <strong>"Add to Home Screen"</strong></span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                        <span className="text-lg">3️⃣</span>
                        <span>Tap <strong>"Add"</strong> to install the app</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Android/Desktop Installation */
                  <div>
                    <h4 className="text-white font-semibold mb-3">Why install Astral Draft?</h4>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                        <span className="text-lg">⚡</span>
                        <div>
                          <div className="text-white font-medium">Faster Performance</div>
                          <div className="text-xs text-slate-400">Instant loading and smooth animations</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                        <span className="text-lg">📱</span>
                        <div>
                          <div className="text-white font-medium">Native App Experience</div>
                          <div className="text-xs text-slate-400">Works like a real mobile app</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                        <span className="text-lg">🔔</span>
                        <div>
                          <div className="text-white font-medium">Push Notifications</div>
                          <div className="text-xs text-slate-400">Get alerts for trades, waivers, and scores</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                        <span className="text-lg">📶</span>
                        <div>
                          <div className="text-white font-medium">Offline Access</div>
                          <div className="text-xs text-slate-400">View your team even without internet</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleDismiss}
                    className="btn btn-secondary flex-1"
                  >
                    Maybe Later
                  </button>
                  {!isIOS && deferredPrompt && (
                    <button
                      onClick={handleInstallClick}
                      className="btn btn-primary flex-1"
                    >
                      📱 Install App
                    </button>
                  )}
                  {isIOS && (
                    <button
                      onClick={handleDismiss}
                      className="btn btn-primary flex-1"
                    >
                      Got It!
                    </button>
                  )}
                </div>

                {/* App Info */}
                <div className="pt-4 border-t border-slate-600">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Size: ~2MB</span>
                    <span>Works offline</span>
                    <span>Free forever</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Install Button (for supported browsers) */}
      {deferredPrompt && !showInstallPrompt && !isIOS && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2 }}
          onClick={() => setShowInstallPrompt(true)}
          className="fixed bottom-4 right-4 z-40 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white p-4 rounded-full shadow-xl transition-all duration-300 transform hover:scale-110"
          title="Install Astral Draft"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">📱</span>
            <span className="hidden sm:inline text-sm font-semibold">Install</span>
          </div>
        </motion.button>
      )}
    </>
  );
};

export default PWAInstallPrompt;