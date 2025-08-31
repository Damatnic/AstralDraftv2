/**
 * PWA Install Prompt Component
 * Provides a user-friendly interface for app installation
 */

import { ErrorBoundary } from './ErrorBoundary';
import React, { useCallback } from 'react';
import { usePWAInstall, useOfflineStatus, pwaUtils } from '../../utils/pwa';
import { AccessibleButton } from './AccessibleButton';
import './InstallPrompt.css';

interface InstallPromptProps {
  className?: string;
  onInstall?: () => void;
  onDismiss?: () => void;
  showOfflineStatus?: boolean;

}

export const InstallPrompt: React.FC<InstallPromptProps> = ({ className = '',
  onInstall,
  onDismiss,
  showOfflineStatus = true
 }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { isInstallable, isInstalled, promptInstall } = usePWAInstall();
  const { isOffline } = useOfflineStatus();
  const [dismissed, setDismissed] = React.useState(false);
  const [installing, setInstalling] = React.useState(false);

  // Don't show if already installed, dismissed, or not installable
  if (isInstalled || dismissed || !isInstallable) {
    return null;

  const platform = pwaUtils.getPlatform();

  const handleInstall = async () => {
    setInstalling(true);
    try {

      const success = await promptInstall();
      if (success) {
        onInstall?.();

    } catch (error) {
        console.error(error);
    } finally {
      setInstalling(false);

  };

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  const getInstallText = () => {
    switch (platform) {
      case 'ios':
        return 'Add to Home Screen';
      case 'android':
        return 'Install App';
      default:
        return 'Install Astral Draft';

  };

  const getDescription = () => {
    switch (platform) {
      case 'ios':
        return pwaUtils.showIOSInstallInstructions();
      case 'android':
        return pwaUtils.showAndroidInstallInstructions();
      default:
        return 'Install Astral Draft for a better experience with offline access and faster loading.';

  };

  return (
    <aside 
      className={`install-prompt ${className}`}
      aria-labelledby="install-title"
      aria-describedby="install-description"
    >
      <div className="install-prompt__content sm:px-4 md:px-6 lg:px-8">
        <div className="install-prompt__icon sm:px-4 md:px-6 lg:px-8">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7,10 12,15 17,10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </div>
        
        <div className="install-prompt__text sm:px-4 md:px-6 lg:px-8">
          <h3 id="install-title" className="install-prompt__title sm:px-4 md:px-6 lg:px-8">
            {getInstallText()}
          </h3>
          <p id="install-description" className="install-prompt__description sm:px-4 md:px-6 lg:px-8">
            {getDescription()}
          </p>
          
          {showOfflineStatus && isOffline && (
            <div className="install-prompt__offline-notice sm:px-4 md:px-6 lg:px-8">
              <span className="install-prompt__offline-icon sm:px-4 md:px-6 lg:px-8" aria-hidden="true">📱</span>
              {' '}Install for offline access
            </div>
          )}
        </div>
        
        <div className="install-prompt__actions sm:px-4 md:px-6 lg:px-8">
          {(platform === 'desktop' || platform === 'android') && (
            <AccessibleButton
              onClick={handleInstall}
              disabled={installing}
              variant="primary"
              size="sm"
              aria-describedby="install-description"
            >
              {installing ? 'Installing...' : 'Install'}
            </AccessibleButton>
          )}
          
          <AccessibleButton
            onClick={handleDismiss}
            variant="ghost"
            size="sm"
            aria-label="Dismiss install prompt"
          >
            Maybe Later
          </AccessibleButton>
        </div>
      </div>
    </aside>
  );
};

/**
 * PWA Status Banner Component
 * Shows connection status and update notifications
 */
interface PWAStatusBannerProps {
  className?: string;

}

export const PWAStatusBanner: React.FC<PWAStatusBannerProps> = ({
  className = ''
}) => {
  const { isOffline } = useOfflineStatus();
  const [showBanner, setShowBanner] = React.useState(false);

  React.useEffect(() => {
    if (isOffline) {
      setShowBanner(true);
    } else {
      // Hide banner after a delay when coming back online
      const timer = setTimeout(() => setShowBanner(false), 3000);
      return () => clearTimeout(timer);

  }, [isOffline]);

  if (!showBanner) return null;

  return (
    <output 
      className={`pwa-status-banner ${isOffline ? 'pwa-status-banner--offline' : 'pwa-status-banner--online'} ${className}`}
      aria-live="polite"
    >
      <div className="pwa-status-banner__content sm:px-4 md:px-6 lg:px-8">
        {isOffline ? (
          <>
            <span className="pwa-status-banner__icon sm:px-4 md:px-6 lg:px-8" aria-hidden="true">📱</span>
            <span>You're offline. Some features may be limited.</span>
          </>
        ) : (
          <>
            <span className="pwa-status-banner__icon sm:px-4 md:px-6 lg:px-8" aria-hidden="true">✅</span>
            <span>Connection restored</span>
          </>
        )}
      </div>
      
      <AccessibleButton
        onClick={() => setShowBanner(false)}
        variant="ghost"
        size="sm"
        aria-label="Dismiss status message"
      >
        ×
      </AccessibleButton>
    </output>
  );
};

const InstallPromptWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <InstallPrompt {...props} />
  </ErrorBoundary>
);

export default React.memo(InstallPromptWithErrorBoundary);
