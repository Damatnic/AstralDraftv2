/**
 * Notification Preferences Component
 * Settings for managing Oracle notification preferences
 */

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useCallback, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Bell, BellOff, Clock, Trophy, TrendingUp, Target, Users, Mail } from 'lucide-react';
import { notificationService, NotificationPreferences } from '../../services/notificationService';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

interface NotificationPreferencesProps {
    className?: string;
    onClose?: () => void;

}

export const NotificationPreferencesComponent: React.FC<NotificationPreferencesProps> = ({
    className = '',
    onClose
}) => {
    const [preferences, setPreferences] = useState<NotificationPreferences>(
        notificationService.getPreferences()
    );
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        // Check current notification permission
        if ('Notification' in window) {
            setHasPermission(Notification.permission === 'granted');

    }, []);

    const handlePreferenceChange = (key: keyof NotificationPreferences, value: boolean | number) => {
        const newPreferences = { ...preferences, [key]: value };
        setPreferences(newPreferences);
        notificationService.updatePreferences(newPreferences);
    };

    const requestNotificationPermission = async () => {
    try {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            setHasPermission(permission === 'granted');
            
            if (permission === 'granted') {
                handlePreferenceChange('browserNotifications', true);

    } catch (error) {
      console.error('Error in requestNotificationPermission:', error);



    };

    const ToggleSwitch: React.FC<{
        enabled: boolean;
        onChange: (enabled: boolean) => void;
        disabled?: boolean;
    }> = ({ enabled, onChange, disabled = false }) => (
        <button
            onClick={() => !disabled && onChange(!enabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                enabled ? 'bg-blue-600' : 'bg-gray-600'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
        </button>
    );

    const PreferenceRow: React.FC<{
        icon: React.ReactNode;
        title: string;
        description: string;
        enabled: boolean;
        onChange: (enabled: boolean) => void;
        disabled?: boolean;
    }> = ({ icon, title, description, enabled, onChange, disabled = false }) => (
        <div className="flex items-center justify-between p-4 border-b border-gray-700 last:border-b-0 sm:px-4 md:px-6 lg:px-8">
            <div className="flex items-start space-x-3 flex-1 sm:px-4 md:px-6 lg:px-8">
                <div className="flex-shrink-0 mt-1 sm:px-4 md:px-6 lg:px-8">
                    {icon}
                </div>
                <div className="min-w-0 flex-1 sm:px-4 md:px-6 lg:px-8">
                    <p className="text-sm font-medium text-white sm:px-4 md:px-6 lg:px-8">{title}</p>
                    <p className="text-xs text-gray-400 mt-1 sm:px-4 md:px-6 lg:px-8">{description}</p>
                </div>
            </div>
            <div className="ml-4 sm:px-4 md:px-6 lg:px-8">
                <ToggleSwitch enabled={enabled} onChange={onChange} />
            </div>
        </div>
    );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4 sm:px-4 md:px-6 lg:px-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 sm:px-4 md:px-6 lg:px-8"></div>
        <span className="ml-2 sm:px-4 md:px-6 lg:px-8">Loading...</span>
      </div>
    );

  return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={className}
        >
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                        <CardTitle className="flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                            <Settings className="w-5 h-5 text-blue-400 sm:px-4 md:px-6 lg:px-8" />
                            <span>Notification Preferences</span>
                        </CardTitle>
                        {onClose && (
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-white transition-colors sm:px-4 md:px-6 lg:px-8"
                             aria-label="Action button">
                                ×
                            </button>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="p-0 sm:px-4 md:px-6 lg:px-8">
                    {/* Browser Notifications Section */}
                    <div className="p-4 border-b border-gray-700 sm:px-4 md:px-6 lg:px-8">
                        <h4 className="text-sm font-semibold text-white mb-3 flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                            <Bell className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                            <span>Browser Notifications</span>
                        </h4>
                        
                        {!hasPermission ? (
                            <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3 mb-3 sm:px-4 md:px-6 lg:px-8">
                                <div className="flex items-start space-x-2 sm:px-4 md:px-6 lg:px-8">
                                    <BellOff className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0 sm:px-4 md:px-6 lg:px-8" />
                                    <div>
                                        <p className="text-sm text-yellow-200 font-medium sm:px-4 md:px-6 lg:px-8">Permission Required</p>
                                        <p className="text-xs text-yellow-300 mt-1 sm:px-4 md:px-6 lg:px-8">
                                            Enable browser notifications to receive alerts about prediction deadlines and results.
                                        </p>
                                        <button
                                            onClick={requestNotificationPermission}
                                            className="mt-2 text-xs bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded transition-colors sm:px-4 md:px-6 lg:px-8"
                                         aria-label="Action button">
                                            Enable Notifications
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <PreferenceRow
                                icon={<Bell className="w-4 h-4 text-blue-400 sm:px-4 md:px-6 lg:px-8" />}
                                title="Browser Notifications"
                                description="Show desktop notifications for Oracle updates"
                                enabled={preferences.browserNotifications}
                                onChange={(enabled: any) => handlePreferenceChange('browserNotifications', enabled)}
                        )}
                    </div>

                    {/* Notification Types */}
                    <div className="p-4 border-b border-gray-700 sm:px-4 md:px-6 lg:px-8">
                        <h4 className="text-sm font-semibold text-white mb-3 flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                            <Target className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                            <span>Notification Types</span>
                        </h4>

                        <div className="space-y-0 sm:px-4 md:px-6 lg:px-8">
                            <PreferenceRow
                                icon={<Clock className="w-4 h-4 text-yellow-400 sm:px-4 md:px-6 lg:px-8" />}
                                title="Deadline Warnings"
                                description="Get notified when prediction deadlines are approaching"
                                enabled={preferences.deadlineWarnings}
                                onChange={(enabled: any) => handlePreferenceChange('deadlineWarnings', enabled)}

                            <PreferenceRow
                                icon={<Target className="w-4 h-4 text-blue-400 sm:px-4 md:px-6 lg:px-8" />}
                                title="Result Announcements"
                                description="Receive notifications when prediction results are available"
                                enabled={preferences.resultAnnouncements}
                                onChange={(enabled: any) => handlePreferenceChange('resultAnnouncements', enabled)}

                            <PreferenceRow
                                icon={<TrendingUp className="w-4 h-4 text-green-400 sm:px-4 md:px-6 lg:px-8" />}
                                title="Accuracy Updates"
                                description="Get notified about significant changes in your accuracy"
                                enabled={preferences.accuracyUpdates}
                                onChange={(enabled: any) => handlePreferenceChange('accuracyUpdates', enabled)}

                            <PreferenceRow
                                icon={<Trophy className="w-4 h-4 text-orange-400 sm:px-4 md:px-6 lg:px-8" />}
                                title="Streak Milestones"
                                description="Celebrate when you reach prediction streak milestones"
                                enabled={preferences.streakMilestones}
                                onChange={(enabled: any) => handlePreferenceChange('streakMilestones', enabled)}

                            <PreferenceRow
                                icon={<Users className="w-4 h-4 text-purple-400 sm:px-4 md:px-6 lg:px-8" />}
                                title="Ranking Changes"
                                description="Stay informed about changes in your leaderboard position"
                                enabled={preferences.rankingChanges}
                                onChange={(enabled: any) => handlePreferenceChange('rankingChanges', enabled)}
                        </div>
                    </div>

                    {/* Timing Settings */}
                    <div className="p-4 border-b border-gray-700 sm:px-4 md:px-6 lg:px-8">
                        <h4 className="text-sm font-semibold text-white mb-3 flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                            <Clock className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                            <span>Timing Settings</span>
                        </h4>

                        <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                            <div>
                                <p className="text-sm font-medium text-white sm:px-4 md:px-6 lg:px-8">Deadline Warning Time</p>
                                <p className="text-xs text-gray-400 mt-1 sm:px-4 md:px-6 lg:px-8">
                                    How many minutes before deadline to send first warning
                                </p>
                            </div>
                            <select
                                value={preferences.timeBeforeDeadline}
                                onChange={(e: any) => handlePreferenceChange('timeBeforeDeadline', parseInt(e.target.value))}
                            >
                                <option value={5}>5 minutes</option>
                                <option value={10}>10 minutes</option>
                                <option value={15}>15 minutes</option>
                                <option value={30}>30 minutes</option>
                                <option value={60}>1 hour</option>
                                <option value={120}>2 hours</option>
                            </select>
                        </div>
                    </div>

                    {/* Other Preferences */}
                    <div className="p-4 sm:px-4 md:px-6 lg:px-8">
                        <h4 className="text-sm font-semibold text-white mb-3 flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                            <Settings className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                            <span>Other Preferences</span>
                        </h4>

                        <div className="space-y-0 sm:px-4 md:px-6 lg:px-8">
                            <PreferenceRow
                                icon={<Bell className="w-4 h-4 text-green-400 sm:px-4 md:px-6 lg:px-8" />}
                                title="In-App Notifications"
                                description="Show notification toasts within the application"
                                enabled={preferences.inAppNotifications}
                                onChange={(enabled: any) => handlePreferenceChange('inAppNotifications', enabled)}

                            <PreferenceRow
                                icon={<Mail className="w-4 h-4 text-blue-400 sm:px-4 md:px-6 lg:px-8" />}
                                title="Email Notifications"
                                description="Receive email notifications for important updates (coming soon)"
                                enabled={preferences.emailNotifications}
                                onChange={(enabled: any) => handlePreferenceChange('emailNotifications', enabled)}
                            />
                        </div>
                    </div>

                    {/* Test Notification */}
                    <div className="p-4 border-t border-gray-700 sm:px-4 md:px-6 lg:px-8">
                        <button
                            onClick={() = aria-label="Action button"> {
                                notificationService.addNotification({
                                    type: 'result_announced',
                                    title: 'Test Notification',
                                    message: 'This is a test notification to verify your settings are working correctly.',
                                    priority: 'medium'
                                });
                            }}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium sm:px-4 md:px-6 lg:px-8"
                        >
                            Send Test Notification
                        </button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

const NotificationPreferencesComponentWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <NotificationPreferencesComponent {...props} />
  </ErrorBoundary>
);

export default React.memo(NotificationPreferencesComponentWithErrorBoundary);
