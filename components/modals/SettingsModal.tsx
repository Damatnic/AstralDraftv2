import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useCallback, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, Monitor, Volume2, Bell, Shield, Moon, Sun } from 'lucide-react';
import { useEscapeKey } from '../../hooks/useEscapeKey';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;

}

interface SettingItem {
  id: string;
  label: string;
  description: string;
  type: 'toggle' | 'select' | 'slider';
  value: boolean | string | number;
  options?: string[];

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  // Handle Escape key to close modal
  useEscapeKey(isOpen, onClose);

  const [settings, setSettings] = useState<Record<string, any>>({
    // Display Settings
    darkMode: true,
    highContrast: false,
    reducedMotion: false,
    compactMode: false,
    
    // Notification Settings
    pushNotifications: true,
    emailNotifications: true,
    tradeNotifications: true,
    waiverNotifications: true,
    draftReminders: true,
    
    // Audio Settings
    soundEffects: true,
    notificationSounds: true,
    volume: 70,
    
    // Performance Settings
    autoRefresh: true,
    refreshInterval: 30,
    backgroundSync: true,
    
    // Privacy Settings
    profileVisibility: 'league',
    statsVisibility: 'public',
    tradeHistory: true
  });

  const settingSections = [
    {
      title: 'Display',
      icon: <Monitor className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />,
      items: [
        {
          id: 'darkMode',
          label: 'Dark Mode',
          description: 'Use dark theme throughout the app',
          type: 'toggle'
        },
        {
          id: 'highContrast',
          label: 'High Contrast',
          description: 'Increase contrast for better accessibility',
          type: 'toggle'
        },
        {
          id: 'reducedMotion',
          label: 'Reduced Motion',
          description: 'Minimize animations and transitions',
          type: 'toggle'
        },
        {
          id: 'compactMode',
          label: 'Compact Mode',
          description: 'Show more information in less space',
          type: 'toggle'

    },
    {
      title: 'Notifications',
      icon: <Bell className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />,
      items: [
        {
          id: 'pushNotifications',
          label: 'Push Notifications',
          description: 'Receive real-time notifications',
          type: 'toggle'
        },
        {
          id: 'emailNotifications',
          label: 'Email Notifications',
          description: 'Get updates via email',
          type: 'toggle'
        },
        {
          id: 'tradeNotifications',
          label: 'Trade Alerts',
          description: 'Notify when trades are proposed or completed',
          type: 'toggle'
        },
        {
          id: 'waiverNotifications',
          label: 'Waiver Alerts',
          description: 'Notify about waiver wire activity',
          type: 'toggle'
        },
        {
          id: 'draftReminders',
          label: 'Draft Reminders',
          description: 'Remind about upcoming drafts',
          type: 'toggle'

    },
    {
      title: 'Audio',
      icon: <Volume2 className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />,
      items: [
        {
          id: 'soundEffects',
          label: 'Sound Effects',
          description: 'Play sounds for interactions',
          type: 'toggle'
        },
        {
          id: 'notificationSounds',
          label: 'Notification Sounds',
          description: 'Play sounds for notifications',
          type: 'toggle'
        },
        {
          id: 'volume',
          label: 'Volume',
          description: 'Adjust sound volume',
          type: 'slider'

    },
    {
      title: 'Performance',
      icon: <Settings className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />,
      items: [
        {
          id: 'autoRefresh',
          label: 'Auto Refresh',
          description: 'Automatically refresh live data',
          type: 'toggle'
        },
        {
          id: 'refreshInterval',
          label: 'Refresh Interval',
          description: 'How often to refresh data (seconds)',
          type: 'select',
          options: ['15', '30', '60', '120']
        },
        {
          id: 'backgroundSync',
          label: 'Background Sync',
          description: 'Keep data updated in background',
          type: 'toggle'

    },
    {
      title: 'Privacy',
      icon: <Shield className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />,
      items: [
        {
          id: 'profileVisibility',
          label: 'Profile Visibility',
          description: 'Who can see your profile',
          type: 'select',
          options: ['public', 'league', 'private']
        },
        {
          id: 'statsVisibility',
          label: 'Stats Visibility',
          description: 'Who can see your statistics',
          type: 'select',
          options: ['public', 'league', 'private']
        },
        {
          id: 'tradeHistory',
          label: 'Trade History',
          description: 'Show your trade history to others',
          type: 'toggle'

  ];

  const handleSettingChange = (id: string, value: any) => {
    setSettings(prev => ({ ...prev, [id]: value }));
    
    // Apply settings immediately
    applySettingChange(id, value);
  };

  const applySettingChange = (id: string, value: any) => {
    switch (id) {
      case 'darkMode':
        document.documentElement.classList.toggle('light', !value);
        break;
      case 'highContrast':
        document.documentElement.classList.toggle('high-contrast', value);
        break;
      case 'reducedMotion':
        document.documentElement.classList.toggle('reduce-animations', value);
        break;
      case 'compactMode':
        document.documentElement.classList.toggle('compact-mode', value);
        break;
      default:
        // Store in localStorage for persistence
        localStorage.setItem(`setting_${id}`, JSON.stringify(value));

  };

  const renderSettingControl = (item: any) => {
    const value = settings[item.id];

    switch (item.type) {
      case 'toggle':
        return (
          <button
            onClick={() => handleSettingChange(item.id, !value)}`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                value ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleSettingChange(item.id, e.target.value)}
          >
            {item.options?.map((option: string) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        );

      case 'slider':
        return (
          <div className="flex items-center gap-3 min-w-32 sm:px-4 md:px-6 lg:px-8">
            <input
              type="range"
              min="0"
              max="100"
              value={value}
              onChange={(e) => handleSettingChange(item.id, parseInt(e.target.value))}
            />
            <span className="text-sm text-gray-400 w-8 sm:px-4 md:px-6 lg:px-8">{value}%</span>
          </div>
        );

      default:
        return null;

  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:px-4 md:px-6 lg:px-8">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm sm:px-4 md:px-6 lg:px-8"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-dark-800/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden sm:px-4 md:px-6 lg:px-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-primary-500/10 to-primary-600/10 sm:px-4 md:px-6 lg:px-8">
            <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
              <div className="w-10 h-10 bg-primary-500/20 rounded-xl flex items-center justify-center sm:px-4 md:px-6 lg:px-8">
                <Settings className="w-5 h-5 text-primary-400 sm:px-4 md:px-6 lg:px-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white sm:px-4 md:px-6 lg:px-8">Settings</h2>
                <p className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">Customize your experience</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors sm:px-4 md:px-6 lg:px-8"
             aria-label="Action button">
              <X className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)] custom-scrollbar sm:px-4 md:px-6 lg:px-8">
            <div className="p-6 space-y-8 sm:px-4 md:px-6 lg:px-8">
              {settingSections.map((section, sectionIndex) => (
                <div key={section.title}>
                  <div className="flex items-center gap-2 mb-4 sm:px-4 md:px-6 lg:px-8">
                    <div className="text-primary-400 sm:px-4 md:px-6 lg:px-8">{section.icon}</div>
                    <h3 className="text-lg font-semibold text-white sm:px-4 md:px-6 lg:px-8">{section.title}</h3>
                  </div>
                  
                  <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                    {section.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-dark-700/50 rounded-xl border border-white/5 sm:px-4 md:px-6 lg:px-8">
                        <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                          <h4 className="font-medium text-white mb-1 sm:px-4 md:px-6 lg:px-8">{item.label}</h4>
                          <p className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">{item.description}</p>
                        </div>
                        <div className="ml-4 sm:px-4 md:px-6 lg:px-8">
                          {renderSettingControl(item)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 bg-dark-900/50 sm:px-4 md:px-6 lg:px-8">
            <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
              <p className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">
                Settings are automatically saved
              </p>
              <div className="flex gap-3 sm:px-4 md:px-6 lg:px-8">
                <button
                  onClick={() => {
                    // Reset to defaults
                    setSettings({
                      darkMode: true,
                      highContrast: false,
                      reducedMotion: false,
                      compactMode: false,
                      pushNotifications: true,
                      emailNotifications: true,
                      tradeNotifications: true,
                      waiverNotifications: true,
                      draftReminders: true,
                      soundEffects: true,
                      notificationSounds: true,
                      volume: 70,
                      autoRefresh: true,
                      refreshInterval: '30',
                      backgroundSync: true,
                      profileVisibility: 'league',
                      statsVisibility: 'public',
                      tradeHistory: true

                  }}
                  className="px-4 py-2 bg-dark-600 hover:bg-dark-500 text-white rounded-lg transition-colors sm:px-4 md:px-6 lg:px-8"
                >
                  Reset Defaults
                </button>
                <button
                  onClick={onClose}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const SettingsModalWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <SettingsModal {...props} />
  </ErrorBoundary>
);

export default React.memo(SettingsModalWithErrorBoundary);