/**
 * Notification Demo Component
 * Demonstrates the comprehensive notification system capabilities
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useMemo, useState } from &apos;react&apos;;
import { motion } from &apos;framer-motion&apos;;
import { useNotifications } from &apos;../../contexts/NotificationContext&apos;;
import { Widget } from &apos;../ui/Widget&apos;;
import { PlayIcon, SettingsIcon } from &apos;lucide-react&apos;;

const NotificationDemo: React.FC = () => {
}
    const { sendNotification, preferences, updatePreferences } = useNotifications();
    const [demoInProgress, setDemoInProgress] = useState(false);

    const runDemoSequence = async () => {
}
    try {
}
        setDemoInProgress(true);

        // Draft Pick Reminder
        await sendNotification(
            &apos;DRAFT_PICK&apos;,
            &apos;Your Turn to Pick! 🏈&apos;,
            "It&apos;s your turn to pick in the Draft League. Time remaining: 45s",
            {
}
                priority: &apos;urgent&apos;,
                actionUrl: &apos;/draft/demo&apos;,
                actionText: &apos;Make Pick&apos;,
                data: { pickNumber: 15, timeRemaining: 45 
}
    
    } catch (error) {
}
      console.error(&apos;Error in runDemoSequence:&apos;, error);



        );

        await new Promise(resolve => setTimeout(resolve, 2000));

        // Oracle Prediction Update
        await sendNotification(
            &apos;ORACLE_PREDICTION&apos;,
            &apos;Oracle Prediction Updated&apos;,
            &apos;Oracle updated prediction for Josh Allen Week 10 - Confidence: 85%&apos;,
            {
}
                priority: &apos;medium&apos;,
                actionUrl: &apos;/oracle/predictions/demo&apos;,
                actionText: &apos;View Prediction&apos;,
                data: { confidence: 85, reasoning: &apos;Weather conditions favorable&apos; }

        );

        await new Promise(resolve => setTimeout(resolve, 2000));

        // Trade Proposal
        await sendNotification(
            &apos;TRADE&apos;,
            &apos;New Trade Proposal&apos;,
            &apos;Team Alpha sent you a trade proposal&apos;,
            {
}
                priority: &apos;medium&apos;,
                actionUrl: &apos;/trades/demo&apos;,
                actionText: &apos;Review Trade&apos;,
                data: { fromTeam: &apos;Team Alpha&apos; }

        );

        await new Promise(resolve => setTimeout(resolve, 2000));

        // Achievement Unlocked
        await sendNotification(
            &apos;ACHIEVEMENT&apos;,
            &apos;Achievement Unlocked! 🏆&apos;,
            &apos;You unlocked "Oracle Master": Correctly predicted 10 Oracle challenges&apos;,
            {
}
                priority: &apos;low&apos;,
                actionUrl: &apos;/achievements/demo&apos;,
                actionText: &apos;View Achievement&apos;,
                data: { achievementName: &apos;Oracle Master&apos; }

        );

        await new Promise(resolve => setTimeout(resolve, 2000));

        // League Announcement
        await sendNotification(
            &apos;LEAGUE_UPDATE&apos;,
            &apos;League Announcement&apos;,
            &apos;Commissioner updated playoff format - Check the new rules&apos;,
            {
}
                priority: &apos;medium&apos;,
                actionUrl: &apos;/league/announcements/demo&apos;,
                actionText: &apos;View Details&apos;,
                data: { commissionerName: &apos;League Admin&apos; }

        );

        setDemoInProgress(false);
    };

    const testNotificationTypes = [
        {
}
            type: &apos;DRAFT_START&apos;,
            title: &apos;Draft Starting Soon! 🚀&apos;,
            message: &apos;Your draft is starting in 15 minutes. Get ready!&apos;,
            priority: &apos;high&apos;
        },
        {
}
            type: &apos;ORACLE_RESULT&apos;,
            title: &apos;Oracle Challenge Won! 🎉&apos;,
            message: &apos;Congratulations! You earned 150 points.&apos;,
            priority: &apos;medium&apos;
        },
        {
}
            type: &apos;SYSTEM&apos;,
            title: &apos;Maintenance Alert&apos;,
            message: &apos;Scheduled maintenance will begin at 2:00 AM EST&apos;,
            priority: &apos;low&apos;

    ];

    const quickTestNotification = async () => {
}
    try {
}
        await sendNotification(
            testNotif.type,
            testNotif.title,
            testNotif.message,
            {
}
                priority: testNotif.priority,
                data: { test: true 
}
    
    } catch (error) {
}
      console.error(&apos;Error in quickTestNotification:&apos;, error);



        );
    };

    return (
        <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
            <Widget title="🔔 Notification System Demo" className="bg-gray-900/50 sm:px-4 md:px-6 lg:px-8">
                <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
                    {/* Demo Sequence */}
                    <div className="bg-blue-900/20 rounded-lg p-4 sm:px-4 md:px-6 lg:px-8">
                        <h3 className="text-lg font-semibold text-white mb-2 sm:px-4 md:px-6 lg:px-8">
                            Full Demo Sequence
                        </h3>
                        <p className="text-gray-300 text-sm mb-4 sm:px-4 md:px-6 lg:px-8">
                            Experience a complete notification journey with draft alerts, Oracle predictions, 
                            trade proposals, achievements, and league updates.
                        </p>
                        <button
                            onClick={runDemoSequence}
                            disabled={demoInProgress}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
}
//                                 demoInProgress 
                                    ? &apos;bg-gray-600 text-gray-400 cursor-not-allowed&apos; 
                                    : &apos;bg-blue-600 hover:bg-blue-700 text-white&apos;
                            }`}
                         aria-label="Action button">
                            <PlayIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                            <span>{demoInProgress ? &apos;Demo Running...&apos; : &apos;Start Demo Sequence&apos;}</span>
                        </button>
                    </div>

                    {/* Quick Tests */}
                    <div className="bg-gray-800/30 rounded-lg p-4 sm:px-4 md:px-6 lg:px-8">
                        <h3 className="text-lg font-semibold text-white mb-4 sm:px-4 md:px-6 lg:px-8">
                            Quick Notification Tests
                        </h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {testNotificationTypes.map((testNotif: any) => {
}
                                let priorityClasses = &apos;bg-gray-500/20 text-gray-400&apos;;
                                if (testNotif.priority === &apos;high&apos;) {
}
                                    priorityClasses = &apos;bg-orange-500/20 text-orange-400&apos;;
                                } else if (testNotif.priority === &apos;medium&apos;) {
}
                                    priorityClasses = &apos;bg-blue-500/20 text-blue-400&apos;;

                                return (
                                    <motion.button
                                        key={`${testNotif.type}-${testNotif.title}`}
                                        onClick={() => quickTestNotification(testNotif)}
                                        className="p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-left transition-colors sm:px-4 md:px-6 lg:px-8"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="text-sm font-medium text-white mb-1 sm:px-4 md:px-6 lg:px-8">
                                            {testNotif.title}
                                        </div>
                                        <div className="text-xs text-gray-400 mb-2 sm:px-4 md:px-6 lg:px-8">
                                            {testNotif.message}
                                        </div>
                                        <div className={`text-xs px-2 py-1 rounded-full inline-block ${priorityClasses}`}>
                                            {testNotif.priority} priority
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Settings Preview */}
                    <div className="bg-gray-800/30 rounded-lg p-4 sm:px-4 md:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-4 sm:px-4 md:px-6 lg:px-8">
                            <h3 className="text-lg font-semibold text-white sm:px-4 md:px-6 lg:px-8">
                                Notification Preferences
                            </h3>
                            <SettingsIcon className="w-5 h-5 text-gray-400 sm:px-4 md:px-6 lg:px-8" />
                        </div>
                        
                        {preferences ? (
}
                            <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                                <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                                    <span className="text-sm text-gray-300 sm:px-4 md:px-6 lg:px-8">Push Notifications</span>
                                    <input
                                        type="checkbox"
                                        checked={preferences.enablePushNotifications || false}
                                        onChange={(e: any) => updatePreferences({
}
                                            enablePushNotifications: e.target.checked
                                        }}
                                        className="accent-blue-500 sm:px-4 md:px-6 lg:px-8"
                                    />
                                </div>
                                <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                                    <span className="text-sm text-gray-300 sm:px-4 md:px-6 lg:px-8">Sound Notifications</span>
                                    <input
                                        type="checkbox"
                                        checked={preferences.enableSoundNotifications || false}
                                        onChange={(e: any) => updatePreferences({
}
                                            enableSoundNotifications: e.target.checked
                                        }}
                                        className="accent-blue-500 sm:px-4 md:px-6 lg:px-8"
                                    />
                                </div>
                                <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                                    <span className="text-sm text-gray-300 sm:px-4 md:px-6 lg:px-8">Draft Alerts</span>
                                    <input
                                        type="checkbox"
                                        checked={preferences.categories?.draft?.enabled || false}
                                        onChange={(e: any) => updatePreferences({
}
                                            categories: {
}
                                                ...preferences.categories,
                                                draft: {
}
                                                    ...preferences.categories?.draft,
                                                    enabled: e.target.checked
                                                }}
                                        })}
                                        className="accent-blue-500 sm:px-4 md:px-6 lg:px-8"
                                    />
                                </div>
                                <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                                    <span className="text-sm text-gray-300 sm:px-4 md:px-6 lg:px-8">Oracle Predictions</span>
                                    <input
                                        type="checkbox"
                                        checked={preferences.categories?.oracle?.enabled || false}
                                        onChange={(e: any) => updatePreferences({
}
                                            categories: {
}
                                                ...preferences.categories,
                                                oracle: {
}
                                                    ...preferences.categories?.oracle,
                                                    enabled: e.target.checked
                                                }}
                                        })}
                                        className="accent-blue-500 sm:px-4 md:px-6 lg:px-8"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="text-gray-400 text-sm sm:px-4 md:px-6 lg:px-8">
                                Loading preferences...
                            </div>
                        )}
                    </div>

                    {/* Features List */}
                    <div className="bg-green-900/20 rounded-lg p-4 sm:px-4 md:px-6 lg:px-8">
                        <h3 className="text-lg font-semibold text-white mb-4 sm:px-4 md:px-6 lg:px-8">
                            ✅ Notification System Features
                        </h3>
                        <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-300">
                            <div>• Real-time push notifications</div>
                            <div>• In-app notification center</div>
                            <div>• Toast notification overlays</div>
                            <div>• Notification bell with badge</div>
                            <div>• Draft pick reminders</div>
                            <div>• Oracle prediction updates</div>
                            <div>• Trade proposal alerts</div>
                            <div>• League announcements</div>
                            <div>• Achievement notifications</div>
                            <div>• Customizable preferences</div>
                            <div>• Priority-based filtering</div>
                            <div>• Offline notification queuing</div>
                            <div>• Mark as read/archive/delete</div>
                            <div>• Sound & vibration support</div>
                            <div>• Quiet hours scheduling</div>
                            <div>• Category-based filters</div>
                        </div>
                    </div>
                </div>
            </Widget>
        </div>
    );
};

const NotificationDemoWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <NotificationDemo {...props} />
  </ErrorBoundary>
);

export default React.memo(NotificationDemoWithErrorBoundary);
