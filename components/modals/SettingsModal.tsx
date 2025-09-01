import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback, useMemo, useState } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { X, Settings, Monitor, Volume2, Bell, Shield, Moon, Sun } from &apos;lucide-react&apos;;
import { useEscapeKey } from &apos;../../hooks/useEscapeKey&apos;;

interface SettingsModalProps {
}
  isOpen: boolean;
  onClose: () => void;

}

interface SettingItem {
}
  id: string;
  label: string;
  description: string;
  type: &apos;toggle&apos; | &apos;select&apos; | &apos;slider&apos;;
  value: boolean | string | number;
  options?: string[];
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }: any) => {
}
  // Handle Escape key to close modal
  useEscapeKey(isOpen, onClose);

  const [settings, setSettings] = useState<Record<string, any>>({
}
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
    profileVisibility: &apos;league&apos;,
    statsVisibility: &apos;public&apos;,
    tradeHistory: true
  });

  const settingSections = [
    {
}
      title: &apos;Display&apos;,
      icon: <Monitor className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />,
      items: [
        {
}
          id: &apos;darkMode&apos;,
          label: &apos;Dark Mode&apos;,
          description: &apos;Use dark theme throughout the app&apos;,
          type: &apos;toggle&apos;
        },
        {
}
          id: &apos;highContrast&apos;,
          label: &apos;High Contrast&apos;,
          description: &apos;Increase contrast for better accessibility&apos;,
          type: &apos;toggle&apos;
        },
        {
}
          id: &apos;reducedMotion&apos;,
          label: &apos;Reduced Motion&apos;,
          description: &apos;Minimize animations and transitions&apos;,
          type: &apos;toggle&apos;
        },
        {
}
          id: &apos;compactMode&apos;,
          label: &apos;Compact Mode&apos;,
          description: &apos;Show more information in less space&apos;,
          type: &apos;toggle&apos;
        }
      ]
    },
    {
}
      title: &apos;Notifications&apos;,
      icon: <Bell className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />,
      items: [
        {
}
          id: &apos;pushNotifications&apos;,
          label: &apos;Push Notifications&apos;,
          description: &apos;Receive real-time notifications&apos;,
          type: &apos;toggle&apos;
        },
        {
}
          id: &apos;emailNotifications&apos;,
          label: &apos;Email Notifications&apos;,
          description: &apos;Get updates via email&apos;,
          type: &apos;toggle&apos;
        },
        {
}
          id: &apos;tradeNotifications&apos;,
          label: &apos;Trade Alerts&apos;,
          description: &apos;Notify when trades are proposed or completed&apos;,
          type: &apos;toggle&apos;
        },
        {
}
          id: &apos;waiverNotifications&apos;,
          label: &apos;Waiver Alerts&apos;,
          description: &apos;Notify about waiver wire activity&apos;,
          type: &apos;toggle&apos;
        },
        {
}
          id: &apos;draftReminders&apos;,
          label: &apos;Draft Reminders&apos;,
          description: &apos;Remind about upcoming drafts&apos;,
          type: &apos;toggle&apos;
        }
      ]
    },
    {
}
      title: &apos;Audio&apos;,
      icon: <Volume2 className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />,
      items: [
        {
}
          id: &apos;soundEffects&apos;,
          label: &apos;Sound Effects&apos;,
          description: &apos;Play sounds for interactions&apos;,
          type: &apos;toggle&apos;
        },
        {
}
          id: &apos;notificationSounds&apos;,
          label: &apos;Notification Sounds&apos;,
          description: &apos;Play sounds for notifications&apos;,
          type: &apos;toggle&apos;
        },
        {
}
          id: &apos;volume&apos;,
          label: &apos;Volume&apos;,
          description: &apos;Adjust sound volume&apos;,
          type: &apos;slider&apos;
        }
      ]
    },
    {
}
      title: &apos;Performance&apos;,
      icon: <Settings className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />,
      items: [
        {
}
          id: &apos;autoRefresh&apos;,
          label: &apos;Auto Refresh&apos;,
          description: &apos;Automatically refresh live data&apos;,
          type: &apos;toggle&apos;
        },
        {
}
          id: &apos;refreshInterval&apos;,
          label: &apos;Refresh Interval&apos;,
          description: &apos;How often to refresh data (seconds)&apos;,
          type: &apos;select&apos;,
          options: [&apos;15&apos;, &apos;30&apos;, &apos;60&apos;, &apos;120&apos;]
        },
        {
}
          id: &apos;backgroundSync&apos;,
          label: &apos;Background Sync&apos;,
          description: &apos;Keep data updated in background&apos;,
          type: &apos;toggle&apos;
        }
      ]
    },
    {
}
      title: &apos;Privacy&apos;,
      icon: <Shield className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />,
      items: [
        {
}
          id: &apos;profileVisibility&apos;,
          label: &apos;Profile Visibility&apos;,
          description: &apos;Who can see your profile&apos;,
          type: &apos;select&apos;,
          options: [&apos;public&apos;, &apos;league&apos;, &apos;private&apos;]
        },
        {
}
          id: &apos;statsVisibility&apos;,
          label: &apos;Stats Visibility&apos;,
          description: &apos;Who can see your statistics&apos;,
          type: &apos;select&apos;,
          options: [&apos;public&apos;, &apos;league&apos;, &apos;private&apos;]
        },
        {
}
          id: &apos;tradeHistory&apos;,
          label: &apos;Trade History&apos;,
          description: &apos;Show your trade history to others&apos;,
          type: &apos;toggle&apos;
        }
      ]
    }
  ];

  const handleSettingChange = (id: string, value: any) => {
}
    setSettings(prev => ({ ...prev, [id]: value }));
    
    // Apply settings immediately
    applySettingChange(id, value);
  };

  const applySettingChange = (id: string, value: any) => {
}
    switch (id) {
}
      case &apos;darkMode&apos;:
        document.documentElement.classList.toggle(&apos;light&apos;, !value);
        break;
      case &apos;highContrast&apos;:
        document.documentElement.classList.toggle(&apos;high-contrast&apos;, value);
        break;
      case &apos;reducedMotion&apos;:
        document.documentElement.classList.toggle(&apos;reduce-animations&apos;, value);
        break;
      case &apos;compactMode&apos;:
        document.documentElement.classList.toggle(&apos;compact-mode&apos;, value);
        break;
      default:
        // Store in localStorage for persistence
        localStorage.setItem(`setting_${id}`, JSON.stringify(value));
        break;
    }
  };

  const renderSettingControl = (item: any) => {
}
    const value = settings[item.id];

    switch (item.type) {
}
      case &apos;toggle&apos;:
        return (
          <button
            onClick={() => handleSettingChange(item.id, !value)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
}
              value ? &apos;bg-primary-500&apos; : &apos;bg-gray-600&apos;
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
}
                value ? &apos;translate-x-7&apos; : &apos;translate-x-1&apos;
              }`}
            />
          </button>
        );

      case &apos;select&apos;:
        return (
          <select
            value={value}
            onChange={(e: any) => handleSettingChange(item.id, e.target.value)}
          >
            {item.options?.map((option: string) => (
}
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        );

      case &apos;slider&apos;:
        return (
          <div className="flex items-center gap-3 min-w-32 sm:px-4 md:px-6 lg:px-8">
            <input
              type="range"
              min="0"
              max="100"
              value={value}
              onChange={(e: any) => handleSettingChange(item.id, parseInt(e.target.value))}
            />
            <span className="text-sm text-gray-400 w-8 sm:px-4 md:px-6 lg:px-8">{value}%</span>
          </div>
        );

      default:
        return null;
    }
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
}
                <div key={section.title}>
                  <div className="flex items-center gap-2 mb-4 sm:px-4 md:px-6 lg:px-8">
                    <div className="text-primary-400 sm:px-4 md:px-6 lg:px-8">{section.icon}</div>
                    <h3 className="text-lg font-semibold text-white sm:px-4 md:px-6 lg:px-8">{section.title}</h3>
                  </div>
                  
                  <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                    {section.items.map((item: any) => (
}
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
}
                    // Reset to defaults
                    setSettings({
}
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
                      refreshInterval: &apos;30&apos;,
                      backgroundSync: true,
                      profileVisibility: &apos;league&apos;,
                      statsVisibility: &apos;public&apos;,
                      tradeHistory: true
                    });
                  }}
                  className="px-4 py-2 bg-dark-600 hover:bg-dark-500 text-white rounded-lg transition-colors sm:px-4 md:px-6 lg:px-8"
                >
                  Reset Defaults
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors sm:px-4 md:px-6 lg:px-8"
                >
//                   Done
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const SettingsModalWithErrorBoundary: React.FC<SettingsModalProps> = (props: any) => (
  <ErrorBoundary>
    <SettingsModal {...props} />
  </ErrorBoundary>
);

export default React.memo(SettingsModalWithErrorBoundary);