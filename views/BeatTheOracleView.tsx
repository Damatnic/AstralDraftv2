import { useAppState } from &apos;../contexts/AppContext&apos;;
import { Widget } from &apos;../components/ui/Widget&apos;;
import { motion } from &apos;framer-motion&apos;;
import { ZapIcon } from &apos;../components/icons/ZapIcon&apos;;
import { Avatar } from &apos;../components/ui/Avatar&apos;;
import { oraclePredictionService, type OraclePrediction } from &apos;../services/oraclePredictionService&apos;;
import { realTimeDataService } from &apos;../services/realTimeDataService&apos;;
import { OracleAnalyticsDashboard } from &apos;../components/oracle/OracleAnalyticsDashboard&apos;;
import AdvancedOracleAnalyticsDashboard from &apos;../components/analytics/AdvancedOracleAnalyticsDashboard&apos;;
import { OracleRewardsDashboard } from &apos;../components/oracle/OracleRewardsDashboard&apos;;
import { oracleRewardsService, type RewardCalculation } from &apos;../services/oracleRewardsService&apos;;
import SocialTab from &apos;../components/social/SocialTab&apos;;
import MLAnalyticsDashboard from &apos;../components/analytics/MLAnalyticsDashboard&apos;;
import EnsembleMLWidget from &apos;../components/oracle/EnsembleMLWidget&apos;;
import TrainingDataManager from &apos;../components/oracle/TrainingDataManager&apos;;
import OracleRealTimePredictionInterface from &apos;../components/oracle/OracleRealTimePredictionInterface&apos;;
import OracleLeaderboard from &apos;../components/oracle/OracleLeaderboard&apos;;
import { useResponsiveBreakpoint, useMobileFixedPosition, useMobileModalClasses } from &apos;../utils/mobileOptimizationUtils&apos;;

interface OracleChallenge {
}
    id: string;
    week: number;
    type: &apos;PLAYER_PERFORMANCE&apos; | &apos;GAME_OUTCOME&apos; | &apos;WEEKLY_SCORING&apos;;
    question: string;
    options: string[];
    userPrediction?: number;
    oraclePrediction: number;
    oracleConfidence: number;
    result?: number;
    points?: number;

}

interface UserStats {
}
    totalChallenges: number;
    wins: number;
    losses: number;
    winRate: number;
    totalPoints: number;
    currentStreak: number;
    longestStreak: number;

// Helper function for generating challenges using AI prediction service
const generateChallenges = async (week: number): Promise<OracleChallenge[]> => {
}
    try {
}

        // Get AI-powered predictions from the Oracle service
        const predictions = await oraclePredictionService.generateWeeklyPredictions(week);
        
        // Convert OraclePrediction to OracleChallenge format
        return predictions.map((prediction: OraclePrediction) => ({
}
            id: prediction.id,
            week: prediction.week,
            type: prediction.type as &apos;PLAYER_PERFORMANCE&apos; | &apos;GAME_OUTCOME&apos; | &apos;WEEKLY_SCORING&apos;,
            question: prediction.question,
            options: prediction.options.map((opt: any) => opt.text),
            oraclePrediction: prediction.oracleChoice,
            oracleConfidence: prediction.confidence
        )};

    } catch (error) {
}
        // Fallback to mock data if service fails
        return generateMockChallenges(week);

};

// Fallback mock challenge generation
const generateMockChallenges = (week: number): OracleChallenge[] => {
}
    const challengeTypes = [
        {
}
            type: &apos;PLAYER_PERFORMANCE&apos; as const,
            questions: [
                &apos;Who will score the most fantasy points this week?&apos;,
                &apos;Which RB will have the most rushing yards?&apos;,
                &apos;Which WR will have the most receiving TDs?&apos;,
                &apos;Who will throw the most passing yards?&apos;

        },
        {
}
            type: &apos;GAME_OUTCOME&apos; as const,
            questions: [
                &apos;Which game will have the highest total score?&apos;,
                &apos;Which team will win by the largest margin?&apos;,
                &apos;Will there be any shutouts this week?&apos;,
                &apos;Which game will go to overtime?&apos;

        },
        {
}
            type: &apos;WEEKLY_SCORING&apos; as const,
            questions: [
                &apos;What will be the highest individual score?&apos;,
                &apos;How many teams will score over 100 points?&apos;,
                &apos;Which position will score the most total points?&apos;,
                &apos;Will any defense score a touchdown?&apos;

    ];

    return challengeTypes.map((categoryData, index) => {
}
        const randomQuestion = categoryData.questions[Math.floor(Math.random() * categoryData.questions.length)];
        const options = [&apos;Option A&apos;, &apos;Option B&apos;, &apos;Option C&apos;, &apos;Option D&apos;];
        const oraclePrediction = Math.floor(Math.random() * 4);
        
        return {
}
            id: `challenge-${week}-${index}`,
            week,
            type: categoryData.type,
            question: randomQuestion,
            options,
            oraclePrediction,
            oracleConfidence: Math.floor(Math.random() * 40) + 60 // 60-100%
        };
    });
};

// Helper function for updating stats
const updateUserStats = (
    prevStats: UserStats, 
    challengeResult: { isWin: boolean; points: number }
): UserStats => {
}
    const newStats = {
}
        ...prevStats,
        totalChallenges: prevStats.totalChallenges + 1,
        totalPoints: prevStats.totalPoints + challengeResult.points
    };

    if (challengeResult.isWin) {
}
        newStats.wins = prevStats.wins + 1;
        newStats.currentStreak = prevStats.currentStreak + 1;
        newStats.longestStreak = Math.max(prevStats.longestStreak, newStats.currentStreak);
    } else {
}
        newStats.losses = prevStats.losses + 1;
        newStats.currentStreak = 0;

    newStats.winRate = newStats.wins / newStats.totalChallenges;
    return newStats;
};

// Component for rendering challenge options
const ChallengeOptions: React.FC<{
}
    challenge: OracleChallenge;
    onSelectOption: (challengeId: string, optionIndex: number) => void;
}> = ({ challenge, onSelectOption }: any) => {
}
    const getOptionStyle = (optionIndex: number): string => {
}
        if (challenge.userPrediction === optionIndex) {
}
            return &apos;bg-green-500/20 border border-green-500/40&apos;;

        if (challenge.oraclePrediction === optionIndex) {
}
            return &apos;bg-blue-500/20 border border-blue-500/40&apos;;

        return &apos;bg-gray-500/10 border border-gray-500/20 hover:bg-gray-500/20&apos;;
    };

    return (
        <>
            {challenge.options.map((option, optionIndex) => (
}
                <button
                    key={`${challenge.id}-option-${optionIndex}`}
                    onClick={() => onSelectOption(challenge.id, optionIndex)}
                    className={`p-3 rounded-lg text-left transition-all ${getOptionStyle(optionIndex)}`}
                >
                    <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {challenge.userPrediction === optionIndex && (
}
                            <span className="text-green-400 text-sm">Your pick</span>
                        )}
                        {challenge.oraclePrediction === optionIndex && (
}
                            <span className="text-blue-400 text-sm">Oracle pick</span>
                        )}
                    </div>
                </button>
            ))}
        </>
    );
};

// Component for leaderboard entries
const LeaderboardEntry: React.FC<{
}
    rank: number;
    name: string;
    score: number;
    isCurrentUser?: boolean;
}> = ({ rank, name, score, isCurrentUser = false }: any) => (
    <div className={`flex items-center justify-between p-3 rounded-lg ${
}
        isCurrentUser ? &apos;bg-blue-500/20&apos; : &apos;bg-gray-500/10&apos;
    }`}>
        <div className="flex items-center space-x-3">
            <span className="text-lg font-bold">{rank}</span>
            <Avatar avatar="👤" className="w-6 h-6" />
            <span>{name}</span>
        </div>
        <span className="font-bold">{score} pts</span>
    </div>
);

const BeatTheOracleView: React.FC = () => {
}
    const { state } = useAppState();
    const { isMobile } = useResponsiveBreakpoint();
    const modalClasses = useMobileModalClasses();
    const notificationPosition = useMobileFixedPosition(&apos;corner&apos;);
    
    const [userStats, setUserStats] = React.useState<UserStats>({
}
        totalChallenges: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        totalPoints: 0,
        currentStreak: 0,
        longestStreak: 0
    });
    const [activeChallenges, setActiveChallenges] = React.useState<OracleChallenge[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [realTimeActive, setRealTimeActive] = React.useState(false);
    const [liveUpdates, setLiveUpdates] = React.useState<Array<{id: string, message: string, timestamp: string}>>([]);
    const [activeTab, setActiveTab] = React.useState<&apos;challenges&apos; | &apos;analytics&apos; | &apos;rewards&apos; | &apos;social&apos; | &apos;ml-analytics&apos; | &apos;training&apos; | &apos;realtime&apos; | &apos;leaderboard&apos;>(&apos;challenges&apos;);
    const [analyticsSubTab, setAnalyticsSubTab] = React.useState<&apos;basic&apos; | &apos;advanced&apos;>(&apos;basic&apos;);
    const [rewardNotification, setRewardNotification] = React.useState<RewardCalculation | null>(null);

    React.useEffect(() => {
}
        // Load user stats from localStorage
        const savedStats = localStorage.getItem(&apos;oracleUserStats&apos;);
        if (savedStats) {
}
            setUserStats(JSON.parse(savedStats));

        // Generate new challenges for current week
        const loadChallenges = async () => {
}
            setLoading(true);
            try {
}

                const currentWeek = 1; // Default week
                const challenges = await generateChallenges(currentWeek);
                setActiveChallenges(challenges);
                
                // Start real-time monitoring
                await startRealTimeMonitoring();
            
    } catch (error) {
}
        console.error(error);
    `🏈 Game Update: ${update.homeTeam} ${update.homeScore} - ${update.awayScore} ${update.awayTeam}`);
            });

            realTimeDataService.onPlayerUpdate((update: any) => {
}
                addLiveUpdate(`📊 ${update.name} (${update.team}): ${update.fantasyPoints} pts`);
            });

            realTimeDataService.onInjuryAlert((alert: any) => {
}
                addLiveUpdate(`🚨 Injury Alert: ${alert.playerName} (${alert.team}) - ${alert.injuryType}`);
            });

            realTimeDataService.onPredictionUpdate((update: any) => {
}
                addLiveUpdate(`🔮 Oracle Update: Confidence adjusted to ${update.newConfidence}%`);
                // Update the relevant challenge
                updateChallengeConfidence(update.predictionId, update.newConfidence);
            });

            await realTimeDataService.startRealTimeUpdates();
            setRealTimeActive(true);
            addLiveUpdate(&apos;🚀 Real-time monitoring activated!&apos;);
        
    `update-${Date.now()}-${Math.random()}`,
            message,
            timestamp: new Date().toISOString()
        };
        setLiveUpdates(prev => {
}
            const newUpdates = [update, ...prev].slice(0, 10); // Keep last 10 updates
            return newUpdates;
        });
    };

    const updateChallengeConfidence = (predictionId: string, newConfidence: number) => {
}
        setActiveChallenges(prev => 
            prev.map((challenge: any) => 
                challenge.id === predictionId 
                    ? { ...challenge, oracleConfidence: newConfidence }
                    : challenge
            )
        );
    };

    const handleSelectOption = async (challengeId: string, optionIndex: number) => {
}
        setLoading(true);
        
        const challenge = activeChallenges.find((c: any) => c.id === challengeId);
        if (!challenge) return;

        const updatedChallenge: OracleChallenge = {
}
            ...challenge,
            userPrediction: optionIndex,
            result: Math.floor(Math.random() * 4), // Simulate result
            points: Math.floor(Math.random() * 50) + 10 // 10-60 points
        };

        const isWin = updatedChallenge.userPrediction === updatedChallenge.result;
        const beatOracle = isWin && updatedChallenge.oraclePrediction !== updatedChallenge.result;
        
        // Calculate rewards using the rewards service
        try {
}
            const rewardCalc = await oracleRewardsService.calculateChallengeReward(
                isWin,
                updatedChallenge.oracleConfidence,
                userStats.currentStreak,
                updatedChallenge.type,
//                 beatOracle
            );

            // Apply the calculated rewards
            await oracleRewardsService.applyRewards(rewardCalc);
            
            // Update challenge points with calculated total
            updatedChallenge.points = rewardCalc.totalPoints;

            // Show reward notification
            setRewardNotification(rewardCalc);
            
            // Add live update for rewards
            if (rewardCalc.totalPoints > 0) {
}
                addLiveUpdate(`💰 Earned ${rewardCalc.totalPoints} points! ${rewardCalc.levelUp ? &apos;⬆️ Level up!&apos; : &apos;&apos;}`);

            if (rewardCalc.newAchievements.length > 0) {
}
                rewardCalc.newAchievements.forEach((achievement: any) => {
}
                    addLiveUpdate(`🏆 Achievement unlocked: ${achievement.title}!`);
                });

        `px-3 py-2 rounded-md text-sm font-medium transition-all mobile-touch-target whitespace-nowrap ${
}
                                activeTab === &apos;challenges&apos;
                                    ? &apos;bg-blue-500 text-white&apos;
                                    : &apos;text-gray-400 hover:text-white hover:bg-gray-700/50&apos;
                            }`}
                        >
                            Oracle Challenges
                        </button>
                        <button
                            onClick={() => setActiveTab(&apos;analytics&apos;)}`}
                        >
//                             Analytics
                        </button>
                        <button
                            onClick={() => setActiveTab(&apos;rewards&apos;)}`}
                        >
//                             Rewards
                        </button>
                        <button
                            onClick={() => setActiveTab(&apos;social&apos;)}`}
                        >
//                             Social
                        </button>
                        <button
                            onClick={() => setActiveTab(&apos;ml-analytics&apos;)}`}
                        >
                            🤖 ML
                        </button>
                        <button
                            onClick={() => setActiveTab(&apos;training&apos;)}`}
                        >
                            🎯 Training
                        </button>
                        <button
                            onClick={() => setActiveTab(&apos;realtime&apos;)}`}
                        >
                            ⚡ Real-Time
                        </button>
                        <button
                            onClick={() => setActiveTab(&apos;leaderboard&apos;)}`}
                        >
                            🏆 Leaderboard
                        </button>
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            {activeTab === &apos;challenges&apos; ? (
}
                <>
                    {/* User Stats Dashboard */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                        <Widget title="Win Rate" className="bg-green-500/10">
                            <div className="text-2xl font-bold text-green-400">
                                {(userStats.winRate * 100).toFixed(1)}%
                            </div>
                            <div className="text-sm text-gray-400">
                                {userStats.wins}W - {userStats.losses}L
                            </div>
                        </Widget>

                        <Widget title="Total Points" className="bg-blue-500/10">
                            <div className="text-2xl font-bold text-blue-400">
                                {userStats.totalPoints}
                            </div>
                            <div className="text-sm text-gray-400">
                                {userStats.totalChallenges} challenges
                            </div>
                        </Widget>

                        <Widget title="Current Streak" className="bg-purple-500/10">
                            <div className="text-2xl font-bold text-purple-400">
                                {userStats.currentStreak}
                            </div>
                            <div className="text-sm text-gray-400">
                                Best: {userStats.longestStreak}
                            </div>
                        </Widget>

                        <Widget title="Oracle Status" className="bg-yellow-500/10">
                            <div className="text-2xl font-bold text-yellow-400">
//                                 Active
                            </div>
                            <div className="text-sm text-gray-400">
                                Week 1
                            </div>
                        </Widget>
                    </div>

                    {/* Main Content Area with Challenges and ML Widget */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                        {/* Left Side - Active Challenges */}
                        <div className="lg:col-span-2">
                            <Widget title="Weekly Challenges" className="bg-gray-900/50">
                                <div className="space-y-4">
                                    {activeChallenges.map((challenge: any) => (
}
                                <motion.div
                                    key={challenge.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-gray-800/50 rounded-lg p-4"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-semibold text-white">{challenge.question}</h3>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-400">
                                                Oracle: {challenge.oracleConfidence}% confident
                                            </span>
                                            <ZapIcon className="w-4 h-4 text-blue-400" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                        <ChallengeOptions>
                                            challenge={challenge}
                                            onSelectOption={handleSelectOption}
                                        />
                                    </div>

                                    {challenge.result !== undefined && (
}
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-4 p-3 rounded-lg bg-gray-700/50"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>
                                                    {challenge.userPrediction === challenge.result 
}
                                                        ? &apos;🎉 You won!&apos; 
                                                        : &apos;😔 Oracle wins this round&apos;

                                                </span>
                                                <span className="font-bold text-yellow-400">
                                                    +{challenge.points} pts
                                                </span>
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </Widget>

                    {/* Leaderboard */}
                    <Widget title="Oracle Leaderboard" className="bg-gray-900/50">
                        <OracleLeaderboard>
                            currentUserId={state.user?.id}
                            showAchievements={false}
                            compact={true}
                        />
                    </Widget>

                    {/* Real-Time Updates Feed */}
                    <Widget title="Live Updates" className="bg-gray-900/50">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm text-gray-400">Real-time monitoring</span>
                                <div className="flex items-center space-x-2">
                                    <div className={`w-2 h-2 rounded-full ${realTimeActive ? &apos;bg-green-500 animate-pulse&apos; : &apos;bg-red-500&apos;}`}></div>
                                    <span className="text-xs text-gray-500">
                                        {realTimeActive ? &apos;Active&apos; : &apos;Inactive&apos;}
                                    </span>
                                </div>
                            </div>
                            <div className="max-h-40 overflow-y-auto space-y-1">
                                {liveUpdates.length === 0 ? (
}
                                    <div className="text-sm text-gray-500 italic">No live updates yet...</div>
                                ) : (
                                    liveUpdates.map((update: any) => (
                                        <motion.div
                                            key={update.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="text-xs text-gray-300 bg-gray-800/50 rounded p-2"
                                        >
                                            {update.message}
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </div>
                    </Widget>
                        {/* Right Side - AI Ensemble ML Widget */}
                        <div className="lg:col-span-1">
                            <EnsembleMLWidget compact={true} />
                        </div>
                    </div>
                </div> {/* This div needs to be closed */}
                </>
            ) : null}

            {activeTab === &apos;analytics&apos; && (
}
                <div className="space-y-6">
                    <div className="border-b border-[var(--panel-border)]">
                        <nav className="flex space-x-6">
                            <button
                                onClick={() => setAnalyticsSubTab(&apos;basic&apos;)}`}
                            >
                                Basic Analytics
                            </button>
                            <button
                                onClick={() => setAnalyticsSubTab(&apos;advanced&apos;)}`}
                            >
                                Advanced Analytics
                            </button>
                        </nav>
                    </div>
                    
                    {analyticsSubTab === &apos;basic&apos; && <OracleAnalyticsDashboard />}
                    {analyticsSubTab === &apos;advanced&apos; && <AdvancedOracleAnalyticsDashboard />}
                </div>
            )}
            {activeTab === &apos;rewards&apos; && <OracleRewardsDashboard />}
            {activeTab === &apos;social&apos; && <SocialTab isActive={activeTab === &apos;social&apos;} />}
            {activeTab === &apos;ml-analytics&apos; && <MLAnalyticsDashboard isActive={activeTab === &apos;ml-analytics&apos;} />}
            {activeTab === &apos;training&apos; && <TrainingDataManager />}
            {activeTab === &apos;realtime&apos; && <OracleRealTimePredictionInterface />}
            {activeTab === &apos;leaderboard&apos; && (
}
                <div className="space-y-6">
                    <OracleLeaderboard>
                        currentUserId={state.user?.id}
                        showAchievements={true}
                        compact={false}
                    />
                </div>
            )}

            {/* Reward Notification */}
            {rewardNotification && (
}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className={`${notificationPosition} bg-gray-800 border border-gray-600 rounded-lg p-4 ${isMobile ? &apos;w-full mx-4&apos; : &apos;max-w-sm&apos;}`}
                >
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-white">Rewards Earned!</h4>
                        <button
                            onClick={() => setRewardNotification(null)}
                        >
                            ✕
                        </button>
                    </div>
                    
                    <div className="space-y-2">
                        {rewardNotification.totalPoints > 0 && (
}
                            <div className="flex items-center space-x-2">
                                <span className="text-yellow-400">💰</span>
                                <span className="text-sm text-white">+{rewardNotification.totalPoints} points</span>
                            </div>
                        )}
                        
                        {rewardNotification.streakBonus > 0 && (
}
                            <div className="flex items-center space-x-2">
                                <span className="text-orange-400">🔥</span>
                                <span className="text-sm text-white">+{rewardNotification.streakBonus} streak bonus</span>
                            </div>
                        )}
                        
                        {rewardNotification.accuracyBonus > 0 && (
}
                            <div className="flex items-center space-x-2">
                                <span className="text-blue-400">🎯</span>
                                <span className="text-sm text-white">+{rewardNotification.accuracyBonus} Oracle beaten bonus</span>
                            </div>
                        )}
                        
                        {rewardNotification.levelUp && (
}
                            <div className="flex items-center space-x-2">
                                <span className="text-purple-400">⬆️</span>
                                <span className="text-sm text-white">Level up!</span>
                            </div>
                        )}
                        
                        {rewardNotification.newAchievements.map((achievement: any) => (
}
                            <div key={achievement.id} className="flex items-center space-x-2">
                                <span className="text-2xl">{achievement.icon}</span>
                                <span className="text-sm text-white">Achievement: {achievement.title}</span>
                            </div>
                        ))}
                        
                        {rewardNotification.newBadges.map((badge: any) => (
}
                            <div key={badge.id} className="flex items-center space-x-2">
                                <span className="text-lg">{badge.icon}</span>
                                <span className="text-sm text-white">Badge: {badge.name}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {loading && (
}
                <div className={modalClasses.overlay}>
                    <div className={`${modalClasses.content} p-6 flex items-center space-x-3`}>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                        <span className="text-white">Processing prediction...</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BeatTheOracleView;
