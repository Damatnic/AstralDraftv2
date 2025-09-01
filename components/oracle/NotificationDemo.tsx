/**
 * Notification System Demo Component
 * For testing and demonstrating Oracle notification features
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useMemo, useState } from &apos;react&apos;;
import { motion } from &apos;framer-motion&apos;;
import { Bell, Target, Clock, Trophy, TrendingUp, Users, Zap } from &apos;lucide-react&apos;;
import { NotificationCenter } from &apos;../oracle/NotificationCenter&apos;;
import { NotificationPreferencesComponent } from &apos;../oracle/NotificationPreferences&apos;;
import { useOracleNotifications } from &apos;../../hooks/useOracleNotifications&apos;;
import { Card, CardHeader, CardTitle, CardContent } from &apos;../ui/Card&apos;;

export const NotificationDemo: React.FC = () => {
}
    const {
}
        addNotification,
        notifyPredictionDeadline,
        notifyPredictionResult,
        notifyAccuracyUpdate,
        notifyStreakMilestone,
        notifyRankingChange,
        notifications,
//         unreadCount
    } = useOracleNotifications();

    const [showPreferences, setShowPreferences] = useState(false);

    const demoNotifications = [
        {
}
            title: &apos;Deadline Warning&apos;,
            description: &apos;Show a prediction deadline warning&apos;,
            icon: <Clock className="w-5 h-5 text-yellow-400 sm:px-4 md:px-6 lg:px-8" />,
            action: () => notifyPredictionDeadline(
                &apos;demo-pred-1&apos;,
                &apos;Will the Chiefs win their next game?&apos;,
//                 15
            )
        },
        {
}
            title: &apos;Correct Prediction&apos;,
            description: &apos;Celebrate a correct prediction&apos;,
            icon: <Target className="w-5 h-5 text-green-400 sm:px-4 md:px-6 lg:px-8" />,
            action: () => notifyPredictionResult(
                &apos;demo-pred-2&apos;,
                &apos;Will Patrick Mahomes throw for 300+ yards?&apos;,
                true,
//                 25
            )
        },
        {
}
            title: &apos;Incorrect Prediction&apos;,
            description: &apos;Show an incorrect prediction result&apos;,
            icon: <Target className="w-5 h-5 text-red-400 sm:px-4 md:px-6 lg:px-8" />,
            action: () => notifyPredictionResult(
                &apos;demo-pred-3&apos;,
                &apos;Will it rain tomorrow?&apos;,
                false,
//                 0
            )
        },
        {
}
            title: &apos;Accuracy Improved&apos;,
            description: &apos;Show accuracy improvement notification&apos;,
            icon: <TrendingUp className="w-5 h-5 text-green-400 sm:px-4 md:px-6 lg:px-8" />,
            action: () => notifyAccuracyUpdate(75.5, 68.2)
        },
        {
}
            title: &apos;Accuracy Decreased&apos;,
            description: &apos;Show accuracy decrease notification&apos;,
            icon: <TrendingUp className="w-5 h-5 text-red-400 sm:px-4 md:px-6 lg:px-8" />,
            action: () => notifyAccuracyUpdate(62.1, 68.9)
        },
        {
}
            title: &apos;Streak Milestone&apos;,
            description: &apos;Celebrate a 5-prediction streak&apos;,
            icon: <Zap className="w-5 h-5 text-orange-400 sm:px-4 md:px-6 lg:px-8" />,
            action: () => notifyStreakMilestone(5)
        },
        {
}
            title: &apos;Ranking Improved&apos;,
            description: &apos;Show ranking improvement&apos;,
            icon: <Trophy className="w-5 h-5 text-purple-400 sm:px-4 md:px-6 lg:px-8" />,
            action: () => notifyRankingChange(3, 7)
        },
        {
}
            title: &apos;Ranking Dropped&apos;,
            description: &apos;Show ranking decrease&apos;,
            icon: <Trophy className="w-5 h-5 text-gray-400 sm:px-4 md:px-6 lg:px-8" />,
            action: () => notifyRankingChange(12, 8)
        },
        {
}
            title: &apos;Custom High Priority&apos;,
            description: &apos;Show a high priority custom notification&apos;,
            icon: <Bell className="w-5 h-5 text-red-400 sm:px-4 md:px-6 lg:px-8" />,
            action: () => addNotification({
}
                type: &apos;result_announced&apos;,
                title: &apos;🚨 Critical Update&apos;,
                message: &apos;This is a high priority notification that requires immediate attention!&apos;,
                priority: &apos;high&apos;
            })
        },
        {
}
            title: &apos;Custom Medium Priority&apos;,
            description: &apos;Show a medium priority custom notification&apos;,
            icon: <Bell className="w-5 h-5 text-blue-400 sm:px-4 md:px-6 lg:px-8" />,
            action: () => addNotification({
}
                type: &apos;accuracy_update&apos;,
                title: &apos;📊 Weekly Summary&apos;,
                message: &apos;Your weekly prediction summary is now available. Check your progress!&apos;,
                priority: &apos;medium&apos;,
                actionUrl: &apos;/oracle/analytics&apos;
            })

    ];

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6 sm:px-4 md:px-6 lg:px-8">
            {/* Header */}
            <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 sm:px-4 md:px-6 lg:px-8">
                        Oracle Notification System Demo
                    </h1>
                    <p className="text-gray-400 sm:px-4 md:px-6 lg:px-8">
                        Test and explore the Oracle notification features
                    </p>
                </div>
                
                {/* Notification Center */}
                <div className="flex items-center space-x-4 sm:px-4 md:px-6 lg:px-8">
                    <NotificationCenter />
                    <button
                        onClick={() => setShowPreferences(!showPreferences)}
                    >
//                         Settings
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-6 text-center sm:px-4 md:px-6 lg:px-8">
                        <Bell className="w-8 h-8 mx-auto text-blue-400 mb-2 sm:px-4 md:px-6 lg:px-8" />
                        <p className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">{notifications.length}</p>
                        <p className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">Total Notifications</p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-6 text-center sm:px-4 md:px-6 lg:px-8">
                        <Target className="w-8 h-8 mx-auto text-green-400 mb-2 sm:px-4 md:px-6 lg:px-8" />
                        <p className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">{unreadCount}</p>
                        <p className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">Unread Notifications</p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-6 text-center sm:px-4 md:px-6 lg:px-8">
                        <Users className="w-8 h-8 mx-auto text-purple-400 mb-2 sm:px-4 md:px-6 lg:px-8" />
                        <p className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">
                            {(&apos;Notification&apos; in window && Notification.permission === &apos;granted&apos;) ? &apos;Enabled&apos; : &apos;Disabled&apos;}
                        </p>
                        <p className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">Browser Notifications</p>
                    </CardContent>
                </Card>
            </div>

            {/* Notification Preferences */}
            {showPreferences && (
}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <NotificationPreferencesComponent>
                        onClose={() => setShowPreferences(false)}
                    />
                </motion.div>
            )}

            {/* Demo Buttons */}
            <Card>
                <CardHeader>
                    <CardTitle>Test Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {demoNotifications.map((demo, index) => (
}
                            <motion.button
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={demo.action}
                                className="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors text-left group sm:px-4 md:px-6 lg:px-8"
                            >
                                <div className="flex items-center space-x-3 mb-2 sm:px-4 md:px-6 lg:px-8">
                                    {demo.icon}
                                    <h3 className="font-medium text-white group-hover:text-blue-300 sm:px-4 md:px-6 lg:px-8">
                                        {demo.title}
                                    </h3>
                                </div>
                                <p className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">{demo.description}</p>
                            </motion.button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Usage Instructions */}
            <Card>
                <CardHeader>
                    <CardTitle>How to Use</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                        <div className="flex items-start space-x-3 sm:px-4 md:px-6 lg:px-8">
                            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold sm:px-4 md:px-6 lg:px-8">1</div>
                            <div>
                                <h4 className="font-medium text-white sm:px-4 md:px-6 lg:px-8">Enable Browser Notifications</h4>
                                <p className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">Click "Settings" and enable browser notifications for the full experience.</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start space-x-3 sm:px-4 md:px-6 lg:px-8">
                            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold sm:px-4 md:px-6 lg:px-8">2</div>
                            <div>
                                <h4 className="font-medium text-white sm:px-4 md:px-6 lg:px-8">Test Notifications</h4>
                                <p className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">Click any of the demo buttons above to trigger different types of notifications.</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start space-x-3 sm:px-4 md:px-6 lg:px-8">
                            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold sm:px-4 md:px-6 lg:px-8">3</div>
                            <div>
                                <h4 className="font-medium text-white sm:px-4 md:px-6 lg:px-8">View Notifications</h4>
                                <p className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">Click the bell icon to see your notification history and manage them.</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start space-x-3 sm:px-4 md:px-6 lg:px-8">
                            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold sm:px-4 md:px-6 lg:px-8">4</div>
                            <div>
                                <h4 className="font-medium text-white sm:px-4 md:px-6 lg:px-8">Customize Settings</h4>
                                <p className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">Use the settings panel to control which notifications you receive and when.</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

const NotificationDemoWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <NotificationDemo {...props} />
  </ErrorBoundary>
);

export default React.memo(NotificationDemoWithErrorBoundary);
