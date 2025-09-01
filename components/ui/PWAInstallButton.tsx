import { ErrorBoundary } from './ErrorBoundary';
import React, { useCallback, useState, useEffect } from 'react';
import { Button } from './Button';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;

export const PWAInstallButton: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    try {

      if (!deferredPrompt) return;

      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowInstall(false);
      }
    } catch (error) {
      console.error('Error in handleInstall:', error);
    }
  };

  if (!showInstall) return null;

  return (
    <Button>
      variant="primary"
      size="sm"
      onClick={handleInstall}
      className="fixed bottom-20 right-4 z-40 md:hidden"
    >
      📱 Install App
    </Button>
  );
};

const PWAInstallButtonWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <PWAInstallButton {...props} />
  </ErrorBoundary>
);

export default React.memo(PWAInstallButtonWithErrorBoundary);