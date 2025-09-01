/**
 * PWA Installation and Management Utilities
 * Handles app installation prompts, offline detection, and PWA features
 */

import { useAnnouncer } from &apos;./accessibility&apos;;

interface BeforeInstallPromptEvent extends Event {
}
  readonly platforms: string[];
  readonly userChoice: Promise<{
}
    outcome: &apos;accepted&apos; | &apos;dismissed&apos;;
    platform: string;
  }>;
  prompt(): Promise<void>;
}

/**
 * Hook for managing PWA installation
 */
export const usePWAInstall = () => {
}
  const [installPrompt, setInstallPrompt] = React.useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = React.useState(false);
  const [isInstalled, setIsInstalled] = React.useState(false);
  const { announce } = useAnnouncer();

  React.useEffect(() => {
}
    // Check if app is already installed
    if (window.matchMedia && window.matchMedia(&apos;(display-mode: standalone)&apos;).matches) {
}
      setIsInstalled(true);
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
}
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      announce(&apos;App can be installed for better experience&apos;, &apos;polite&apos;);
    };

    // Listen for app installed
    const handleAppInstalled = () => {
}
      setIsInstalled(true);
      setInstallPrompt(null);
      setIsInstallable(false);
      announce(&apos;App successfully installed&apos;, &apos;assertive&apos;);
    };

    window.addEventListener(&apos;beforeinstallprompt&apos;, handleBeforeInstallPrompt);
    window.addEventListener(&apos;appinstalled&apos;, handleAppInstalled);

    return () => {
}
      window.removeEventListener(&apos;beforeinstallprompt&apos;, handleBeforeInstallPrompt);
      window.removeEventListener(&apos;appinstalled&apos;, handleAppInstalled);
    };
  }, [announce]);

  const promptInstall = React.useCallback(async () => {
}
    if (!installPrompt) return false;

    try {
}

      await installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;
      
      if (choiceResult.outcome === &apos;accepted&apos;) {
}
        announce(&apos;Installing app...&apos;, &apos;assertive&apos;);
        return true;
      } else {
}
        announce(&apos;Installation cancelled&apos;, &apos;polite&apos;);
        return false;
      }
    
    } catch (error) {
}
        console.error(error);
    } catch (error) {
}
      console.error(&apos;Error during installation:&apos;, error);
      announce(&apos;Installation failed&apos;, &apos;assertive&apos;);
      return false;
    } finally {
}
      setInstallPrompt(null);
      setIsInstallable(false);
    }
  }, [installPrompt, announce]);

  return {
}
    isInstallable,
    isInstalled,
//     promptInstall
  };
};

/**
 * Hook for offline detection and management
 */
export const useOfflineStatus = () => {
}
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const [wasOffline, setWasOffline] = React.useState(false);
  const { announce } = useAnnouncer();

  React.useEffect(() => {
}
    const handleOnline = () => {
}
      setIsOnline(true);
      if (wasOffline) {
}
        announce(&apos;Connection restored&apos;, &apos;assertive&apos;);
        setWasOffline(false);
      }
    };

    const handleOffline = () => {
}
      setIsOnline(false);
      setWasOffline(true);
      announce(&apos;You are now offline. Some features may be limited.&apos;, &apos;assertive&apos;);
    };

    window.addEventListener(&apos;online&apos;, handleOnline);
    window.addEventListener(&apos;offline&apos;, handleOffline);

    return () => {
}
      window.removeEventListener(&apos;online&apos;, handleOnline);
      window.removeEventListener(&apos;offline&apos;, handleOffline);
    };
  }, [wasOffline, announce]);

  return {
}
    isOnline,
    isOffline: !isOnline,
//     wasOffline
  };
};

/**
 * Hook for managing push notifications
 */
export const usePushNotifications = () => {
}
  const [permission, setPermission] = React.useState<NotificationPermission>(&apos;default&apos;);
  const [isSupported, setIsSupported] = React.useState(false);
  const { announce } = useAnnouncer();

  React.useEffect(() => {
}
    // Check if notifications are supported
    if (&apos;Notification&apos; in window && &apos;serviceWorker&apos; in navigator) {
}
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = React.useCallback(async () => {
}
    if (!isSupported) {
}
      announce(&apos;Notifications not supported on this device&apos;, &apos;polite&apos;);
      return false;
    }

    try {
}

      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === &apos;granted&apos;) {
}
        announce(&apos;Notifications enabled&apos;, &apos;assertive&apos;);
        return true;
      } else {
}
        announce(&apos;Notifications denied&apos;, &apos;polite&apos;);
        return false;
      }

    } catch (error) {
}
        console.error(error);
    } catch (error) {
}
      console.error(&apos;Error requesting notification permission:&apos;, error);
      announce(&apos;Failed to enable notifications&apos;, &apos;assertive&apos;);
      return false;
    }
  }, [isSupported, announce]);

  const showNotification = React.useCallback(async (
    title: string,
    options?: NotificationOptions
  ) => {
}
    if (permission !== &apos;granted&apos;) {
}
      return false;
    }

    try {
}
      // Use service worker to show notification
      if (&apos;serviceWorker&apos; in navigator) {
}
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(title, {
}
          icon: &apos;/favicon.svg&apos;,
          badge: &apos;/favicon.svg&apos;,
          tag: &apos;astral-draft&apos;,
          requireInteraction: false,
          ...options
        });
        return true;
      } else {
}
        // Fallback to regular notification
        new Notification(title, {
}
          icon: &apos;/favicon.svg&apos;,
          ...options
        });
        return true;
      }
    
    } catch (error) {
}
      console.error(&apos;Error showing notification:&apos;, error);
      return false;
    }
  }, [permission]);

  return {
}
    isSupported,
    permission,
    requestPermission,
    showNotification,
    isEnabled: permission === &apos;granted&apos;
  };
};

/**
 * PWA utility functions
 */
export const pwaUtils = {
}
  /**
   * Check if running as PWA
   */
  isPWA: (): boolean => {
}
    return window.matchMedia(&apos;(display-mode: standalone)&apos;).matches ||
           (window.navigator as any).standalone === true ||
           document.referrer.includes(&apos;android-app://&apos;);
  },

  /**
   * Get PWA platform
   */
  getPlatform: (): &apos;ios&apos; | &apos;android&apos; | &apos;desktop&apos; | &apos;web&apos; => {
}
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (/iphone|ipad|ipod/.test(userAgent)) {
}
      return &apos;ios&apos;;
    } else if (/android/.test(userAgent)) {
}
      return &apos;android&apos;;
    } else if (pwaUtils.isPWA()) {
}
      return &apos;desktop&apos;;
    } else {
}
      return &apos;web&apos;;
    }
  },

  /**
   * Show iOS install instructions
   */
  showIOSInstallInstructions: (): string => {
}
    return &apos;To install this app on your iOS device, tap the share button and select "Add to Home Screen".&apos;;
  },

  /**
   * Show Android install instructions  
   */
  showAndroidInstallInstructions: (): string => {
}
    return &apos;To install this app on your Android device, tap the menu button and select "Add to Home Screen" or "Install App".&apos;;
  },

  /**
   * Register for updates
   */
  registerUpdateListener: (callback: () => void) => {
}
    if (&apos;serviceWorker&apos; in navigator) {
}
      navigator.serviceWorker.addEventListener(&apos;controllerchange&apos;, callback);
      return () => {
}
        navigator.serviceWorker.removeEventListener(&apos;controllerchange&apos;, callback);
      };
    }
    return () => {};
  },

  /**
   * Force update service worker
   */
  updateServiceWorker: async (): Promise<boolean> => {
}
    if (&apos;serviceWorker&apos; in navigator) {
}
      try {
}

        const registration = await navigator.serviceWorker.ready;
        await registration.update();
        return true;

    } catch (error) {
}
        console.error(error);
    } catch (error) {
}
        console.error(&apos;Error updating service worker:&apos;, error);
        return false;
      }
    }
    return false;
  }
};

/**
 * Hook for managing PWA updates
 */
export const usePWAUpdates = () => {
}
  const [updateAvailable, setUpdateAvailable] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const { announce } = useAnnouncer();

  React.useEffect(() => {
}
    const handleUpdate = () => {
}
      setUpdateAvailable(true);
      announce(&apos;App update available&apos;, &apos;polite&apos;);
    };

    const cleanup = pwaUtils.registerUpdateListener(handleUpdate);
    return cleanup;
  }, [announce]);

  const applyUpdate = React.useCallback(async () => {
}
    setIsUpdating(true);
    announce(&apos;Updating app...&apos;, &apos;assertive&apos;);
    
    try {
}

      const success = await pwaUtils.updateServiceWorker();
      if (success) {
}
        announce(&apos;App updated successfully. Refreshing...&apos;, &apos;assertive&apos;);
        setTimeout(() => window.location.reload(), 1000);
      } else {
}
        announce(&apos;Update failed&apos;, &apos;assertive&apos;);
        setIsUpdating(false);
      }

    } catch (error) {
}
        console.error(error);
    } catch (error) {
}
      console.error(&apos;Error applying update:&apos;, error);
      announce(&apos;Update failed&apos;, &apos;assertive&apos;);
      setIsUpdating(false);
    }
  }, [announce]);

  return {
}
    updateAvailable,
    isUpdating,
//     applyUpdate
  };
};

export default usePWAInstall;
