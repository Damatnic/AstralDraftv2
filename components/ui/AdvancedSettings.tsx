/**
 * Advanced Settings Panel
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

interface AdvancedSettingsProps {
  onClose: () => void;
}

export const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({ onClose }) => {
  const { theme, toggleTheme } = useTheme();
  const [settings, setSettings] = useState({
    notifications: true,
    autoRefresh: true,
    animations: true,
    analytics: true,
    aiInsights: true,
    darkMode: theme === 'dark',
  });

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    if (key === 'darkMode' && value !== (theme === 'dark')) {
      toggleTheme();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-gray-900/95 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Elite Settings</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <span className="text-lg">✕</span>
            </button>
          </div>
          <p className="text-gray-400 text-sm mt-1">Customize your premium experience</p>
        </div>

        {/* Settings */}
        <div className="p-6 space-y-4">
          {[
            { key: 'notifications', label: 'Push Notifications', desc: 'Get alerts for trades, pickups, and insights' },
            { key: 'autoRefresh', label: 'Auto Refresh', desc: 'Automatically update data in real-time' },
            { key: 'animations', label: 'Smooth Animations', desc: 'Enhanced visual transitions and effects' },
            { key: 'analytics', label: 'Advanced Analytics', desc: 'Deep statistical analysis and trends' },
            { key: 'aiInsights', label: 'AI Insights', desc: 'Machine learning powered recommendations' },
            { key: 'darkMode', label: 'Dark Mode', desc: 'Reduce eye strain with dark theme' },
          ].map((setting) => (
            <div key={setting.key} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-white font-medium">{setting.label}</div>
                <div className="text-gray-400 text-sm">{setting.desc}</div>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSettingChange(setting.key, !settings[setting.key as keyof typeof settings])}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings[setting.key as keyof typeof settings] ? 'bg-blue-500' : 'bg-gray-600'
                }`}
              >
                <motion.div
                  animate={{
                    x: settings[setting.key as keyof typeof settings] ? 24 : 2,
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full"
                />
              </motion.button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            Save Settings
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};
