/**
 * Injury Alert Notification Component
 * Real-time injury alert notifications with configurable preferences
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback, useMemo, useState, useEffect } from &apos;react&apos;;
import { Card, CardContent } from &apos;../ui/Card&apos;;
import { Badge } from &apos;../ui/Badge&apos;;
import {
}
  AlertTriangle,
  X,
  Settings,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
//   ExternalLink
} from &apos;lucide-react&apos;;
import {
}
  injuryTrackingService,
//   InjuryAlert
} from &apos;../../services/injuryTrackingService&apos;;

interface InjuryAlertNotificationProps {
}
  className?: string;
  maxAlerts?: number;
  showSettings?: boolean;
  onDismiss?: (alertId: string) => void;

}

interface NotificationSettings {
}
  position: &apos;top-right&apos; | &apos;top-left&apos; | &apos;bottom-right&apos; | &apos;bottom-left&apos;;
  autoHide: boolean;
  autoHideDuration: number; // seconds
  showRecommendations: boolean;
  groupSimilar: boolean;
  soundEnabled: boolean;}

const InjuryAlertNotification: React.FC<InjuryAlertNotificationProps> = ({ className = &apos;&apos;,
}
  maxAlerts = 5,
  showSettings = true,
//   onDismiss
 }: any) => {
}
  const [isLoading, setIsLoading] = React.useState(false);
  const [alerts, setAlerts] = useState<InjuryAlert[]>([]);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
}
    position: &apos;top-right&apos;,
    autoHide: true,
    autoHideDuration: 10,
    showRecommendations: true,
    groupSimilar: false,
    soundEnabled: true
  });

  useEffect(() => {
}
    loadSettings();
    setupAlertSubscription();
  }, []);

  useEffect(() => {
}
    if (settings.autoHide) {
}
      const timer = setTimeout(() => {
}
        setAlerts(prev => prev.slice(0, -1));
    }
  }, settings.autoHideDuration * 1000);

      return () => clearTimeout(timer);

  }, [alerts, settings.autoHide, settings.autoHideDuration]);

  const loadSettings = () => {
}
    try {
}
      const saved = localStorage.getItem(&apos;injury_notification_settings&apos;);
      if (saved) {
}
        setSettings({ ...settings, ...JSON.parse(saved) });

    } catch (error) {
}

  };

  const saveSettings = (newSettings: NotificationSettings) => {
}
    try {
}

      localStorage.setItem(&apos;injury_notification_settings&apos;, JSON.stringify(newSettings));
      setSettings(newSettings);

    } catch (error) {
}

  };

  const getNotificationFrequency = (severity: string): number => {
}
    switch (severity) {
}
      case &apos;CRITICAL&apos;: return 800;
      case &apos;HIGH&apos;: return 600;
      default: return 400;

  };

  const addAlert = (alert: InjuryAlert) => {
}
    if (dismissedAlerts.has(alert.id)) return;

    setAlerts(prev => {
}
      const filtered = settings.groupSimilar 
        ? prev.filter((a: any) => a.playerId !== alert.playerId)
        : prev;
      return [alert, ...filtered].slice(0, maxAlerts);
    });

    if (settings.soundEnabled) {
}
      playNotificationSound(alert.severity);

  };

  const setupAlertSubscription = () => {
}
    injuryTrackingService.onInjuryAlert(addAlert);
  };

  const playNotificationSound = (severity: string) => {
}
    try {
}

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Different frequencies for different severities
      const frequency = getNotificationFrequency(severity);
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = &apos;sine&apos;;

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);

    } catch (error) {
}

  };

  const handleDismissAlert = (alertId: string) => {
}
    setAlerts(prev => prev.filter((alert: any) => alert.id !== alertId));
    setDismissedAlerts(prev => new Set([...prev, alertId]));
    onDismiss?.(alertId);
  };

  const handleDismissAll = () => {
}
    alerts.forEach((alert: any) => {
}
      setDismissedAlerts(prev => new Set([...prev, alert.id]));
      onDismiss?.(alert.id);
    });
    setAlerts([]);
  };

  const getSeverityIcon = (severity: string) => {
}
    switch (severity) {
}
      case &apos;CRITICAL&apos;: return <AlertTriangle className="h-4 w-4 text-red-600 sm:px-4 md:px-6 lg:px-8" />;
      case &apos;HIGH&apos;: return <TrendingDown className="h-4 w-4 text-orange-600 sm:px-4 md:px-6 lg:px-8" />;
      case &apos;MEDIUM&apos;: return <Activity className="h-4 w-4 text-yellow-600 sm:px-4 md:px-6 lg:px-8" />;
      default: return <TrendingUp className="h-4 w-4 text-green-600 sm:px-4 md:px-6 lg:px-8" />;

  };

  const getSeverityColor = (severity: string) => {
}
    switch (severity) {
}
      case &apos;CRITICAL&apos;: return &apos;border-red-500 bg-red-50&apos;;
      case &apos;HIGH&apos;: return &apos;border-orange-500 bg-orange-50&apos;;
      case &apos;MEDIUM&apos;: return &apos;border-yellow-500 bg-yellow-50&apos;;
      default: return &apos;border-green-500 bg-green-50&apos;;

  };

  const getPositionClasses = (position: string) => {
}
    switch (position) {
}
      case &apos;top-left&apos;: return &apos;top-4 left-4&apos;;
      case &apos;bottom-right&apos;: return &apos;bottom-4 right-4&apos;;
      case &apos;bottom-left&apos;: return &apos;bottom-4 left-4&apos;;
      default: return &apos;top-4 right-4&apos;;

  };

  const formatTimeAgo = (timestamp: string) => {
}
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return &apos;Just now&apos;;
  };

  if (alerts.length === 0 && !showSettingsPanel) {
}
    return null;

  return (
    <>
      {/* Main notification container */}
      <div className={`fixed ${getPositionClasses(settings.position)} z-50 w-96 space-y-3 ${className}`}>
        {/* Settings button */}
        {showSettings && (
}
          <div className="flex justify-end sm:px-4 md:px-6 lg:px-8">
            <button
              onClick={() => setShowSettingsPanel(!showSettingsPanel)}
            >
              <Settings className="h-4 w-4 text-gray-600 sm:px-4 md:px-6 lg:px-8" />
            </button>
          </div>
        )}

        {/* Settings panel */}
        {showSettingsPanel && (
}
          <Card className="border-blue-200 bg-blue-50 sm:px-4 md:px-6 lg:px-8">
            <CardContent className="pt-4 sm:px-4 md:px-6 lg:px-8">
              <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                  <h4 className="font-medium sm:px-4 md:px-6 lg:px-8">Notification Settings</h4>
                  <button
                    onClick={() => setShowSettingsPanel(false)}
                  >
                    <X className="h-4 w-4 sm:px-4 md:px-6 lg:px-8" />
                  </button>
                </div>

                <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                  <div>
                    <label htmlFor="position-select" className="block text-sm font-medium mb-1 sm:px-4 md:px-6 lg:px-8">Position</label>
                    <select
                      id="position-select"
                      value={settings.position}
                      onChange={(e: any) => saveSettings({ ...settings, position: e.target.value as any }}
                      className="w-full px-3 py-1 border border-gray-300 rounded text-sm sm:px-4 md:px-6 lg:px-8"
                    >
                      <option value="top-right">Top Right</option>
                      <option value="top-left">Top Left</option>
                      <option value="bottom-right">Bottom Right</option>
                      <option value="bottom-left">Bottom Left</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                    <label htmlFor="auto-hide-checkbox" className="text-sm font-medium sm:px-4 md:px-6 lg:px-8">Auto Hide</label>
                    <input
                      id="auto-hide-checkbox"
                      type="checkbox"
                      checked={settings.autoHide}
                      onChange={(e: any) => saveSettings({ ...settings, autoHide: e.target.checked }}
                      className="rounded sm:px-4 md:px-6 lg:px-8"
                    />
                  </div>

                  {settings.autoHide && (
}
                    <div>
                      <label htmlFor="duration-slider" className="block text-sm font-medium mb-1 sm:px-4 md:px-6 lg:px-8">
                        Auto Hide Duration: {settings.autoHideDuration}s
                      </label>
                      <input
                        id="duration-slider"
                        type="range"
                        min="3"
                        max="30"
                        value={settings.autoHideDuration}
                        onChange={(e: any) => saveSettings({ ...settings, autoHideDuration: parseInt(e.target.value) }}
                        className="w-full sm:px-4 md:px-6 lg:px-8"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                    <label htmlFor="recommendations-checkbox" className="text-sm font-medium sm:px-4 md:px-6 lg:px-8">Show Recommendations</label>
                    <input
                      id="recommendations-checkbox"
                      type="checkbox"
                      checked={settings.showRecommendations}
                      onChange={(e: any) => saveSettings({ ...settings, showRecommendations: e.target.checked }}
                      className="rounded sm:px-4 md:px-6 lg:px-8"
                    />
                  </div>

                  <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                    <label htmlFor="sound-checkbox" className="text-sm font-medium sm:px-4 md:px-6 lg:px-8">Sound Enabled</label>
                    <input
                      id="sound-checkbox"
                      type="checkbox"
                      checked={settings.soundEnabled}
                      onChange={(e: any) => saveSettings({ ...settings, soundEnabled: e.target.checked }}
                      className="rounded sm:px-4 md:px-6 lg:px-8"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Alert notifications */}
        {alerts.length > 0 && (
}
          <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
            {/* Dismiss all button */}
            {alerts.length > 1 && (
}
              <div className="flex justify-end sm:px-4 md:px-6 lg:px-8">
                <button
                  onClick={handleDismissAll}
                  className="text-xs px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 sm:px-4 md:px-6 lg:px-8"
                 aria-label="Action button">
                  Dismiss All ({alerts.length})
                </button>
              </div>
            )}

            {/* Individual alerts */}
            {alerts.map((alert: any) => (
}
              <Card>
                key={alert.id}
                className={`border-l-4 shadow-lg animate-slide-in ${getSeverityColor(alert.severity)}`}
              >
                <CardContent className="pt-4 sm:px-4 md:px-6 lg:px-8">
                  <div className="flex items-start justify-between sm:px-4 md:px-6 lg:px-8">
                    <div className="flex items-start gap-3 flex-1 sm:px-4 md:px-6 lg:px-8">
                      {getSeverityIcon(alert.severity)}
                      <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                        <div className="flex items-center gap-2 mb-1 sm:px-4 md:px-6 lg:px-8">
                          <span className="font-medium text-sm sm:px-4 md:px-6 lg:px-8">
                            {alert.alertType.replace(&apos;_&apos;, &apos; &apos;)}
                          </span>
                          <Badge variant="outline" className="text-xs sm:px-4 md:px-6 lg:px-8">
                            {alert.severity}
                          </Badge>
                        </div>
                        
                        <p className="text-sm font-medium mb-1 sm:px-4 md:px-6 lg:px-8">{alert.message}</p>
                        <p className="text-xs text-gray-600 mb-2 sm:px-4 md:px-6 lg:px-8">
                          {alert.team} • {formatTimeAgo(alert.timestamp)}
                        </p>

                        {settings.showRecommendations && alert.fantasyActions.length > 0 && (
}
                          <div className="mt-2 sm:px-4 md:px-6 lg:px-8">
                            <p className="text-xs font-medium text-gray-700 mb-1 sm:px-4 md:px-6 lg:px-8">Quick Actions:</p>
                            <ul className="text-xs text-gray-600 space-y-1 sm:px-4 md:px-6 lg:px-8">
                              {alert.fantasyActions.slice(0, 2).map((action: any) => (
}
                                <li key={action} className="flex items-start gap-1 sm:px-4 md:px-6 lg:px-8">
                                  <span className="text-blue-600 sm:px-4 md:px-6 lg:px-8">•</span>
                                  {action}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {alert.actionRequired && (
}
                          <div className="mt-2 flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                            <ExternalLink className="h-3 w-3 text-blue-600 sm:px-4 md:px-6 lg:px-8" />
                            <span className="text-xs text-blue-600 font-medium sm:px-4 md:px-6 lg:px-8">Action Required</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 sm:px-4 md:px-6 lg:px-8">
                      {settings.autoHide && (
}
                        <div className="flex items-center gap-1 text-gray-400 sm:px-4 md:px-6 lg:px-8">
                          <Clock className="h-3 w-3 sm:px-4 md:px-6 lg:px-8" />
                          <span className="text-xs sm:px-4 md:px-6 lg:px-8">{settings.autoHideDuration}s</span>
                        </div>
                      )}
                      <button
                        onClick={() => handleDismissAlert(alert.id)}
                      >
                        <X className="h-4 w-4 sm:px-4 md:px-6 lg:px-8" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Custom styles for animations */}
      <style>
        {`
}
          @keyframes slide-in {
}
            from {
}
              transform: translateX(100%);
              opacity: 0;

            to {
}
              transform: translateX(0);
              opacity: 1;


          .animate-slide-in {
}
            animation: slide-in 0.3s ease-out;

        `}
      </style>
    </>
  );
};

const InjuryAlertNotificationWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <InjuryAlertNotification {...props} />
  </ErrorBoundary>
);

export default React.memo(InjuryAlertNotificationWithErrorBoundary);
