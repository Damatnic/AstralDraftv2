/**
 * Comprehensive Oracle User Dashboard
 * Displays prediction history, accuracy metrics, and personalized insights
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useState, useEffect, useMemo } from &apos;react&apos;;
import { Widget } from &apos;../ui/Widget&apos;;
import { 
}
    TrophyIcon, 
    Target, 
    TrendingUp, 
    BarChart3, 
    Activity,
    Award,
    Flame,
    Star,
    Eye,
//     Brain
} from &apos;lucide-react&apos;;

interface UserStats {
}
    totalPredictions: number;
    correctPredictions: number;
    accuracy: number;
    totalPoints: number;
    rank: number;
    weeklyAccuracy: { week: number; accuracy: number; predictions: number }[];
    categoryAccuracy: { category: string; accuracy: number; total: number }[];
    streaks: {
}
        current: number;
        longest: number;
        type: &apos;correct&apos; | &apos;incorrect&apos; | &apos;none&apos;;
    };
    confidence: {
}
        average: number;
        calibration: number;
        overconfidence: number;
    };

interface PredictionHistory {
}
    id: string;
    week: number;
    question: string;
    userChoice: number;
    oracleChoice: number;
    confidence: number;
    actualResult?: number;
    isResolved: boolean;
    isCorrect?: boolean;
    points: number;
    submittedAt: string;
    category: string;

}

interface PersonalizedInsight {
}
    type: &apos;strength&apos; | &apos;improvement&apos; | &apos;trend&apos; | &apos;recommendation&apos;;
    title: string;
    description: string;
    actionable?: string;
    priority: &apos;high&apos; | &apos;medium&apos; | &apos;low&apos;;
    metric?: number;}

const OracleUserDashboard: React.FC = () => {
}
    const [userStats, setUserStats] = useState<UserStats | null>(null);
    const [predictionHistory, setPredictionHistory] = useState<PredictionHistory[]>([]);
    const [insights, setInsights] = useState<PersonalizedInsight[]>([]);
    const [timeframe, setTimeframe] = useState<&apos;week&apos; | &apos;month&apos; | &apos;season&apos; | &apos;all&apos;>(&apos;season&apos;);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>(&apos;all&apos;);

    // Mock data generation for demonstration
    useEffect(() => {
}
        const generateMockData = () => {
}
            // Generate user stats
            const mockStats: UserStats = {
}
                totalPredictions: 47,
                correctPredictions: 32,
                accuracy: 68.1,
                totalPoints: 320,
                rank: 15,
                weeklyAccuracy: [
                    { week: 1, accuracy: 75, predictions: 8 },
                    { week: 2, accuracy: 62.5, predictions: 8 },
                    { week: 3, accuracy: 70, predictions: 10 },
                    { week: 4, accuracy: 66.7, predictions: 9 },
                    { week: 5, accuracy: 72.7, predictions: 11 },
                    { week: 6, accuracy: 63.6, predictions: 11 }
                ],
                categoryAccuracy: [
                    { category: &apos;Player Performance&apos;, accuracy: 71.4, total: 14 },
                    { category: &apos;Game Outcomes&apos;, accuracy: 66.7, total: 18 },
                    { category: &apos;Statistical Milestones&apos;, accuracy: 70.0, total: 10 },
                    { category: &apos;Team Performance&apos;, accuracy: 60.0, total: 5 }
                ],
                streaks: {
}
                    current: 3,
                    longest: 7,
                    type: &apos;correct&apos;
                },
                confidence: {
}
                    average: 72.5,
                    calibration: 0.85,
                    overconfidence: 4.5

            };

            // Generate prediction history
            const mockHistory: PredictionHistory[] = Array.from({ length: 20 }, (_, i) => {
}
                const randomResult = Math.random();
                let actualResult: number | undefined;
                
                if (randomResult > 0.3) {
}
                    actualResult = Math.random() > 0.5 ? 1 : 0;
                } else {
}
                    actualResult = undefined;

                return {
}
                    id: `pred_${i + 1}`,
                    week: Math.floor(i / 3) + 1,
                    question: [
                        &apos;Will Josh Allen throw for 300+ yards?&apos;,
                        &apos;Will the Chiefs win by 7+ points?&apos;,
                        &apos;Will Davante Adams score 2+ TDs?&apos;,
                        &apos;Will the game total exceed 47.5 points?&apos;,
                        &apos;Will Christian McCaffrey rush for 100+ yards?&apos;,
                        &apos;Will Mahomes throw an interception?&apos;,
                        &apos;Will the Eagles cover the spread?&apos;
                    ][i % 7],
                    userChoice: Math.random() > 0.5 ? 1 : 0,
                    oracleChoice: Math.random() > 0.5 ? 1 : 0,
                    confidence: Math.floor(Math.random() * 40) + 60,
                    actualResult,
                    isResolved: Math.random() > 0.2,
                    isCorrect: Math.random() > 0.32,
                    points: Math.random() > 0.32 ? 10 : 0,
                    submittedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
                    category: [&apos;Player Performance&apos;, &apos;Game Outcomes&apos;, &apos;Statistical Milestones&apos;, &apos;Team Performance&apos;][i % 4]
                };
            });

            // Generate personalized insights
            const mockInsights: PersonalizedInsight[] = [
                {
}
                    type: &apos;strength&apos;,
                    title: &apos;Player Performance Expert&apos;,
                    description: &apos;You excel at predicting individual player performances with 71.4% accuracy&apos;,
                    priority: &apos;high&apos;,
                    metric: 71.4
                },
                {
}
                    type: &apos;trend&apos;,
                    title: &apos;Improving Accuracy&apos;,
                    description: &apos;Your accuracy has improved 8.2% over the last 3 weeks&apos;,
                    priority: &apos;medium&apos;,
                    metric: 8.2
                },
                {
}
                    type: &apos;improvement&apos;,
                    title: &apos;Confidence Calibration&apos;,
                    description: &apos;Consider lowering confidence on game outcome predictions&apos;,
                    actionable: &apos;Your average confidence is 4.5% higher than your accuracy in this category&apos;,
                    priority: &apos;medium&apos;,
                    metric: 4.5
                },
                {
}
                    type: &apos;recommendation&apos;,
                    title: &apos;Focus on Statistical Milestones&apos;,
                    description: &apos;You show strong potential in milestone predictions but have limited attempts&apos;,
                    actionable: &apos;Try making more predictions in this category to boost your overall accuracy&apos;,
                    priority: &apos;low&apos;

            ];

            setUserStats(mockStats);
            setPredictionHistory(mockHistory);
            setInsights(mockInsights);
            setIsLoading(false);
        };

        generateMockData();
    }, []);

    // Filter predictions based on timeframe and category
    const filteredHistory = useMemo(() => {
}
        if (!predictionHistory) return [];

        let filtered = predictionHistory;

        // Filter by category
        if (selectedCategory !== &apos;all&apos;) {
}
            filtered = filtered.filter((p: any) => p.category === selectedCategory);

        // Filter by timeframe
        const now = new Date();
        const cutoffDate = new Date();
        
        switch (timeframe) {
}
            case &apos;week&apos;:
                cutoffDate.setDate(now.getDate() - 7);
                break;
            case &apos;month&apos;:
                cutoffDate.setMonth(now.getMonth() - 1);
                break;
            case &apos;season&apos;:
                cutoffDate.setMonth(now.getMonth() - 4); // Approximate season start
                break;
            default:
                cutoffDate.setFullYear(2020); // All time

        return filtered.filter((p: any) => new Date(p.submittedAt) >= cutoffDate);
    }, [predictionHistory, timeframe, selectedCategory]);

    if (isLoading || !userStats) {
}
        return (
            <Widget title="Oracle Dashboard">
                <div className="p-6 text-center sm:px-4 md:px-6 lg:px-8">
                    <div className="animate-pulse space-y-4 sm:px-4 md:px-6 lg:px-8">
                        <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto sm:px-4 md:px-6 lg:px-8"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto sm:px-4 md:px-6 lg:px-8"></div>
                        <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto sm:px-4 md:px-6 lg:px-8"></div>
                    </div>
                </div>
            </Widget>
        );

    const getAccuracyColor = (accuracy: number) => {
}
        if (accuracy >= 70) return &apos;text-green-500&apos;;
        if (accuracy >= 60) return &apos;text-yellow-500&apos;;
        return &apos;text-red-500&apos;;
    };

    const getInsightIcon = (type: string) => {
}
        switch (type) {
}
            case &apos;strength&apos;: return <Star className="w-4 h-4 text-yellow-500 sm:px-4 md:px-6 lg:px-8" />;
            case &apos;trend&apos;: return <TrendingUp className="w-4 h-4 text-blue-500 sm:px-4 md:px-6 lg:px-8" />;
            case &apos;improvement&apos;: return <Target className="w-4 h-4 text-orange-500 sm:px-4 md:px-6 lg:px-8" />;
            case &apos;recommendation&apos;: return <Brain className="w-4 h-4 text-purple-500 sm:px-4 md:px-6 lg:px-8" />;
            default: return <Eye className="w-4 h-4 text-gray-500 sm:px-4 md:px-6 lg:px-8" />;

    };

    return (
        <div className="oracle-user-dashboard space-y-6 sm:px-4 md:px-6 lg:px-8">
            {/* Dashboard Header */}
            <div className="dashboard-header sm:px-4 md:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-4 sm:px-4 md:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                        <Brain className="w-6 h-6 text-purple-500 sm:px-4 md:px-6 lg:px-8" />
                        Oracle Dashboard
                    </h2>
                    
                    <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                        <select 
                            value={timeframe} 
                            onChange={(e: any) => setTimeframe(e.target.value as any)}
                        >
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                            <option value="season">This Season</option>
                            <option value="all">All Time</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Key Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Widget title="Overall Accuracy">
                    <div className="p-4 text-center sm:px-4 md:px-6 lg:px-8">
                        <div className={`text-3xl font-bold ${getAccuracyColor(userStats.accuracy)}`}>
                            {userStats.accuracy}%
                        </div>
                        <div className="text-sm text-gray-400 mt-1 sm:px-4 md:px-6 lg:px-8">
                            {userStats.correctPredictions}/{userStats.totalPredictions} correct
                        </div>
                        <div className="flex items-center justify-center gap-1 mt-2 text-xs sm:px-4 md:px-6 lg:px-8">
                            <TrophyIcon className="w-3 h-3 sm:px-4 md:px-6 lg:px-8" />
                            Rank #{userStats.rank}
                        </div>
                    </div>
                </Widget>

                <Widget title="Current Streak">
                    <div className="p-4 text-center sm:px-4 md:px-6 lg:px-8">
                        <div className="flex items-center justify-center gap-2 sm:px-4 md:px-6 lg:px-8">
                            <Flame className={`w-6 h-6 ${userStats.streaks.current >= 3 ? &apos;text-orange-500&apos; : &apos;text-gray-400&apos;}`} />
                            <span className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">
                                {userStats.streaks.current}
                            </span>
                        </div>
                        <div className="text-sm text-gray-400 mt-1 sm:px-4 md:px-6 lg:px-8">
                            {userStats.streaks.type === &apos;correct&apos; ? &apos;Correct&apos; : &apos;Incorrect&apos;} predictions
                        </div>
                        <div className="text-xs text-gray-500 mt-1 sm:px-4 md:px-6 lg:px-8">
                            Best: {userStats.streaks.longest}
                        </div>
                    </div>
                </Widget>

                <Widget title="Total Points">
                    <div className="p-4 text-center sm:px-4 md:px-6 lg:px-8">
                        <div className="text-3xl font-bold text-blue-500 sm:px-4 md:px-6 lg:px-8">
                            {userStats.totalPoints}
                        </div>
                        <div className="text-sm text-gray-400 mt-1 sm:px-4 md:px-6 lg:px-8">
                            +{Math.round(userStats.totalPoints / userStats.totalPredictions)} avg per prediction
                        </div>
                        <div className="flex items-center justify-center gap-1 mt-2 text-xs sm:px-4 md:px-6 lg:px-8">
                            <Award className="w-3 h-3 sm:px-4 md:px-6 lg:px-8" />
                            Oracle Points
                        </div>
                    </div>
                </Widget>

                <Widget title="Confidence">
                    <div className="p-4 text-center sm:px-4 md:px-6 lg:px-8">
                        <div className="text-3xl font-bold text-purple-500 sm:px-4 md:px-6 lg:px-8">
                            {userStats.confidence.average}%
                        </div>
                        <div className="text-sm text-gray-400 mt-1 sm:px-4 md:px-6 lg:px-8">
                            Average confidence
                        </div>
                        <div className="text-xs text-gray-500 mt-1 sm:px-4 md:px-6 lg:px-8">
                            Calibration: {Math.round(userStats.confidence.calibration * 100)}%
                        </div>
                    </div>
                </Widget>
            </div>

            {/* Category Performance */}
            <Widget title="Performance by Category">
                <div className="p-4 sm:px-4 md:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userStats.categoryAccuracy.map((category: any) => {
}
                            const isSelected = selectedCategory === category.category;
                            const borderClass = isSelected 
                                ? &apos;border-blue-500 bg-blue-500/10&apos; 
                                : &apos;border-gray-600 hover:border-gray-500&apos;;
                            
                            return (
                                <button
                                    key={category.category}
                                    className={`p-3 rounded-lg border transition-colors ${borderClass}`}
                                    onClick={() = aria-label="Action button"> setSelectedCategory(
}
                                        isSelected ? &apos;all&apos; : category.category
                                    )}
                                    type="button"
                                >
                                    <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                                        <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                                            <BarChart3 className="w-4 h-4 text-gray-400 sm:px-4 md:px-6 lg:px-8" />
                                            <span className="font-medium text-white sm:px-4 md:px-6 lg:px-8">{category.category}</span>
                                        </div>
                                        <div className={`font-bold ${getAccuracyColor(category.accuracy)}`}>
                                            {category.accuracy}%
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1 sm:px-4 md:px-6 lg:px-8">
                                        {Math.round(category.accuracy * category.total / 100)} correct out of {category.total}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </Widget>

            {/* Weekly Accuracy Trend */}
            <Widget title="Weekly Accuracy Trend">
                <div className="p-4 sm:px-4 md:px-6 lg:px-8">
                    <div className="flex items-end gap-2 h-32 sm:px-4 md:px-6 lg:px-8">
                        {userStats.weeklyAccuracy.map((week: any) => {
}
                            let bgColorClass = &apos;bg-red-500&apos;;
                            if (week.accuracy >= 70) {
}
                                bgColorClass = &apos;bg-green-500&apos;;
                            } else if (week.accuracy >= 60) {
}
                                bgColorClass = &apos;bg-yellow-500&apos;;

                            return (
                                <div key={week.week} className="flex-1 flex flex-col items-center sm:px-4 md:px-6 lg:px-8">
                                    <div 
                                        className={`w-full rounded-t transition-all ${bgColorClass}`}
                                        style={{ height: `${week.accuracy}%` }}
                                    />
                                    <div className="text-xs text-gray-400 mt-1 sm:px-4 md:px-6 lg:px-8">W{week.week}</div>
                                    <div className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">{week.accuracy}%</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Widget>

            {/* Personalized Insights */}
            <Widget title="Personalized Insights">
                <div className="p-4 space-y-3 sm:px-4 md:px-6 lg:px-8">
                    {insights.map((insight: any) => {
}
                        let borderClass = &apos;border-blue-500 bg-blue-500/10&apos;;
                        if (insight.priority === &apos;high&apos;) {
}
                            borderClass = &apos;border-red-500 bg-red-500/10&apos;;
                        } else if (insight.priority === &apos;medium&apos;) {
}
                            borderClass = &apos;border-yellow-500 bg-yellow-500/10&apos;;

                        return (
                            <div 
                                key={insight.title}
                                className={`p-3 rounded-lg border-l-4 ${borderClass}`}
                            >
                                <div className="flex items-start gap-3 sm:px-4 md:px-6 lg:px-8">
                                    {getInsightIcon(insight.type)}
                                    <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                                        <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                                            <h4 className="font-medium text-white sm:px-4 md:px-6 lg:px-8">{insight.title}</h4>
                                            {Boolean(insight.metric) && (
}
                                                <span className="text-sm font-bold text-white sm:px-4 md:px-6 lg:px-8">
                                                    {insight.metric}%
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-300 mt-1 sm:px-4 md:px-6 lg:px-8">{insight.description}</p>
                                        {insight.actionable && (
}
                                            <p className="text-xs text-gray-400 mt-2 italic sm:px-4 md:px-6 lg:px-8">
                                                💡 {insight.actionable}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Widget>

            {/* Recent Prediction History */}
            <Widget title={selectedCategory !== &apos;all&apos; ? `Recent Predictions (${selectedCategory})` : &apos;Recent Predictions&apos;}>
                <div className="p-4 sm:px-4 md:px-6 lg:px-8">
                    <div className="space-y-3 max-h-96 overflow-y-auto sm:px-4 md:px-6 lg:px-8">
                        {filteredHistory.slice(0, 10).map((prediction: any) => (
}
                            <div 
                                key={prediction.id}
                                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg sm:px-4 md:px-6 lg:px-8"
                            >
                                <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                                    <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                                        <span className="text-sm font-medium text-white sm:px-4 md:px-6 lg:px-8">
                                            {prediction.question}
                                        </span>
                                        {prediction.isResolved && (
}
                                            <span className={`px-2 py-1 text-xs rounded ${
}
                                                prediction.isCorrect 
                                                    ? &apos;bg-green-500/20 text-green-400&apos; 
                                                    : &apos;bg-red-500/20 text-red-400&apos;
                                            }`}>
                                                {prediction.isCorrect ? &apos;Correct&apos; : &apos;Incorrect&apos;}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">
                                        <span>Week {prediction.week}</span>
                                        <span>Confidence: {prediction.confidence}%</span>
                                        <span>Category: {prediction.category}</span>
                                        {prediction.isResolved && (
}
                                            <span className="text-blue-400 sm:px-4 md:px-6 lg:px-8">+{prediction.points} pts</span>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right sm:px-4 md:px-6 lg:px-8">
                                    <div className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">
                                        {new Date(prediction.submittedAt).toLocaleDateString()}
                                    </div>
                                    {!prediction.isResolved && (
}
                                        <div className="text-xs text-yellow-500 sm:px-4 md:px-6 lg:px-8">Pending</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {filteredHistory.length === 0 && (
}
                        <div className="text-center py-8 text-gray-400 sm:px-4 md:px-6 lg:px-8">
                            <Activity className="w-12 h-12 mx-auto mb-2 opacity-50 sm:px-4 md:px-6 lg:px-8" />
                            <p>No predictions found for the selected filters</p>
                        </div>
                    )}
                </div>
            </Widget>
        </div>
    );
};

const OracleUserDashboardWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <OracleUserDashboard {...props} />
  </ErrorBoundary>
);

export default React.memo(OracleUserDashboardWithErrorBoundary);
