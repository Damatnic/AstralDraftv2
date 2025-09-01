/**
 * Team Analytics Dashboard
 * Comprehensive performance metrics and analytics for team management
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useMemo } from &apos;react&apos;;
import { motion } from &apos;framer-motion&apos;;
import { Widget } from &apos;../ui/Widget&apos;;
import { Avatar } from &apos;../ui/Avatar&apos;;
import { Team, League, Player } from &apos;../../types&apos;;
import { BarChartIcon } from &apos;../icons/BarChartIcon&apos;;
import { TrendingDownIcon } from &apos;../icons/TrendingDownIcon&apos;;
import { TrendingUpIcon } from &apos;../icons/TrendingUpIcon&apos;;
import { TargetIcon } from &apos;../icons/TargetIcon&apos;;

interface TeamAnalyticsDashboardProps {
}
    team: Team;
    league: League;
    dispatch: React.Dispatch<any>;

}

interface WeeklyPerformance {
}
    week: number;
    points: number;
    projectedPoints: number;
    opponent: string;
    result: &apos;W&apos; | &apos;L&apos; | &apos;T&apos;;

interface PositionAnalysis {
}
    position: string;
    averagePoints: number;
    consistency: number;
    trend: &apos;up&apos; | &apos;down&apos; | &apos;stable&apos;;
    topPlayer: Player;
    depth: number;

}

interface MatchupPreview {
}
    opponent: Team;
    winProbability: number;
    projectedScore: number;
    opponentProjected: number;
    keyMatchups: {
}
        myPlayer: Player;
        theirPlayer: Player;
        advantage: &apos;favor&apos; | &apos;against&apos; | &apos;neutral&apos;;
    }[];

const TeamAnalyticsDashboard: React.FC<TeamAnalyticsDashboardProps> = ({ team, league, dispatch }: any) => {
}
    const [selectedTab, setSelectedTab] = React.useState<&apos;overview&apos; | &apos;trends&apos; | &apos;projections&apos; | &apos;matchup&apos;>(&apos;overview&apos;);

    // Mock data - in real app this would come from analytics service
    const weeklyPerformance: WeeklyPerformance[] = [
        { week: 1, points: 142.5, projectedPoints: 138.2, opponent: &apos;Thunder Bolts&apos;, result: &apos;W&apos; },
        { week: 2, points: 118.3, projectedPoints: 125.8, opponent: &apos;Fire Dragons&apos;, result: &apos;L&apos; },
        { week: 3, points: 156.7, projectedPoints: 141.3, opponent: &apos;Ice Wolves&apos;, result: &apos;W&apos; },
        { week: 4, points: 134.2, projectedPoints: 139.7, opponent: &apos;Storm Eagles&apos;, result: &apos;W&apos; }
    ];

    const positionAnalysis: PositionAnalysis[] = [
        {
}
            position: &apos;QB&apos;,
            averagePoints: 22.8,
            consistency: 8.5,
            trend: &apos;up&apos;,
            topPlayer: { id: 1, name: &apos;Josh Allen&apos;, position: &apos;QB&apos;, team: &apos;BUF&apos; } as Player,
            depth: 2
        },
        {
}
            position: &apos;RB&apos;,
            averagePoints: 18.4,
            consistency: 6.2,
            trend: &apos;stable&apos;,
            topPlayer: { id: 2, name: &apos;Christian McCaffrey&apos;, position: &apos;RB&apos;, team: &apos;SF&apos; } as Player,
            depth: 4
        },
        {
}
            position: &apos;WR&apos;,
            averagePoints: 15.7,
            consistency: 7.1,
            trend: &apos;down&apos;,
            topPlayer: { id: 3, name: &apos;Tyreek Hill&apos;, position: &apos;WR&apos;, team: &apos;MIA&apos; } as Player,
            depth: 5
        },
        {
}
            position: &apos;TE&apos;,
            averagePoints: 12.3,
            consistency: 5.8,
            trend: &apos;up&apos;,
            topPlayer: { id: 4, name: &apos;Travis Kelce&apos;, position: &apos;TE&apos;, team: &apos;KC&apos; } as Player,
            depth: 2

    ];

    const nextMatchup: MatchupPreview = {
}
        opponent: {
}
            id: 5, 
            name: &apos;Desert Hawks&apos;, 
            owner: { id: &apos;5&apos;, name: &apos;Mike Wilson&apos;, avatar: &apos;🦅&apos; },
            avatar: &apos;🏜️&apos;
        } as Team,
        winProbability: 67,
        projectedScore: 128.5,
        opponentProjected: 118.2,
        keyMatchups: [
            {
}
                myPlayer: { id: 1, name: &apos;Josh Allen&apos;, position: &apos;QB&apos; } as Player,
                theirPlayer: { id: 6, name: &apos;Lamar Jackson&apos;, position: &apos;QB&apos; } as Player,
                advantage: &apos;neutral&apos;
            },
            {
}
                myPlayer: { id: 2, name: &apos;Christian McCaffrey&apos;, position: &apos;RB&apos; } as Player,
                theirPlayer: { id: 7, name: &apos;Derrick Henry&apos;, position: &apos;RB&apos; } as Player,
                advantage: &apos;favor&apos;

    };

    const getTrendIcon = (trend: &apos;up&apos; | &apos;down&apos; | &apos;stable&apos;) => {
}
        switch (trend) {
}
            case &apos;up&apos;:
                return <TrendingUpIcon className="w-4 h-4 text-green-400 sm:px-4 md:px-6 lg:px-8" />;
            case &apos;down&apos;:
                return <TrendingDownIcon className="w-4 h-4 text-red-400 sm:px-4 md:px-6 lg:px-8" />;
            default:
                return <BarChartIcon className="w-4 h-4 text-gray-400 sm:px-4 md:px-6 lg:px-8" />;

    };

    const getAdvantageColor = (advantage: &apos;favor&apos; | &apos;against&apos; | &apos;neutral&apos;) => {
}
        switch (advantage) {
}
            case &apos;favor&apos;:
                return &apos;text-green-400&apos;;
            case &apos;against&apos;:
                return &apos;text-red-400&apos;;
            default:
                return &apos;text-gray-400&apos;;

    };

    return (
        <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
            {/* Tab Navigation */}
            <div className="flex space-x-4 border-b border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8">
                {[
}
                    { id: &apos;overview&apos;, label: &apos;Overview&apos; },
                    { id: &apos;trends&apos;, label: &apos;Trends&apos; },
                    { id: &apos;projections&apos;, label: &apos;Projections&apos; },
                    { id: &apos;matchup&apos;, label: &apos;Next Matchup&apos; }
                ].map((tab: any) => (
                    <button
                        key={tab.id}
                        onClick={() => setSelectedTab(tab.id as any)}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Overview Tab */}
            {selectedTab === &apos;overview&apos; && (
}
                <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
                    {/* Performance Summary */}
                    <Widget title="Season Performance">
                        <div className="p-4 sm:px-4 md:px-6 lg:px-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-3 bg-blue-500/20 rounded-lg sm:px-4 md:px-6 lg:px-8">
                                    <div className="text-2xl font-bold text-blue-400 sm:px-4 md:px-6 lg:px-8">
                                        {(weeklyPerformance.reduce((sum, w) => sum + w.points, 0) / weeklyPerformance.length).toFixed(1)}
                                    </div>
                                    <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">Avg Points/Week</div>
                                </div>
                                <div className="text-center p-3 bg-green-500/20 rounded-lg sm:px-4 md:px-6 lg:px-8">
                                    <div className="text-2xl font-bold text-green-400 sm:px-4 md:px-6 lg:px-8">
                                        {weeklyPerformance.filter((w: any) => w.result === &apos;W&apos;).length}-{weeklyPerformance.filter((w: any) => w.result === &apos;L&apos;).length}
                                    </div>
                                    <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">Record</div>
                                </div>
                                <div className="text-center p-3 bg-purple-500/20 rounded-lg sm:px-4 md:px-6 lg:px-8">
                                    <div className="text-2xl font-bold text-purple-400 sm:px-4 md:px-6 lg:px-8">
                                        {Math.max(...weeklyPerformance.map((w: any) => w.points)).toFixed(1)}
                                    </div>
                                    <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">Season High</div>
                                </div>
                                <div className="text-center p-3 bg-yellow-500/20 rounded-lg sm:px-4 md:px-6 lg:px-8">
                                    <div className="text-2xl font-bold text-yellow-400 sm:px-4 md:px-6 lg:px-8">3rd</div>
                                    <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">League Rank</div>
                                </div>
                            </div>
                        </div>
                    </Widget>

                    {/* Position Analysis */}
                    <Widget title="Position Breakdown">
                        <div className="p-4 sm:px-4 md:px-6 lg:px-8">
                            <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                                {positionAnalysis.map((pos: any) => (
}
                                    <div key={pos.position} className="flex items-center justify-between p-3 bg-white/5 rounded-lg sm:px-4 md:px-6 lg:px-8">
                                        <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                                            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center sm:px-4 md:px-6 lg:px-8">
                                                <span className="font-bold text-blue-400 sm:px-4 md:px-6 lg:px-8">{pos.position}</span>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">{pos.topPlayer.name}</h4>
                                                <p className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                                    {pos.averagePoints.toFixed(1)} avg pts • Depth: {pos.depth}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-4 sm:px-4 md:px-6 lg:px-8">
                                            <div className="text-right sm:px-4 md:px-6 lg:px-8">
                                                <div className="text-sm font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                                    Consistency: {pos.consistency}/10
                                                </div>
                                                <div className="flex items-center gap-1 sm:px-4 md:px-6 lg:px-8">
                                                    {getTrendIcon(pos.trend)}
                                                    <span className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                                        {pos.trend === &apos;up&apos; ? &apos;Trending Up&apos; : 
}
                                                         pos.trend === &apos;down&apos; ? &apos;Trending Down&apos; : &apos;Stable&apos;}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Widget>
                </div>
            )}

            {/* Trends Tab */}
            {selectedTab === &apos;trends&apos; && (
}
                <Widget title="Performance Trends">
                    <div className="p-4 sm:px-4 md:px-6 lg:px-8">
                        <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                            <div className="mb-6 sm:px-4 md:px-6 lg:px-8">
                                <h4 className="font-medium text-[var(--text-primary)] mb-4 sm:px-4 md:px-6 lg:px-8">Weekly Performance</h4>
                                <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                                    {weeklyPerformance.map((week: any) => (
}
                                        <div key={week.week} className="flex items-center justify-between p-3 bg-white/5 rounded-lg sm:px-4 md:px-6 lg:px-8">
                                            <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
}
                                                    week.result === &apos;W&apos; ? &apos;bg-green-500/20 text-green-400&apos; : &apos;bg-red-500/20 text-red-400&apos;
                                                }`}>
                                                    {week.result}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">Week {week.week}</div>
                                                    <div className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">vs {week.opponent}</div>
                                                </div>
                                            </div>
                                            
                                            <div className="text-right sm:px-4 md:px-6 lg:px-8">
                                                <div className="font-bold text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">{week.points}</div>
                                                <div className={`text-sm ${
}
                                                    week.points > week.projectedPoints ? &apos;text-green-400&apos; : &apos;text-red-400&apos;
                                                }`}>
                                                    {week.points > week.projectedPoints ? &apos;+&apos; : &apos;&apos;}{(week.points - week.projectedPoints).toFixed(1)} vs proj
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </Widget>
            )}

            {/* Projections Tab */}
            {selectedTab === &apos;projections&apos; && (
}
                <Widget title="Rest of Season Projections">
                    <div className="p-4 sm:px-4 md:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-4 bg-blue-500/10 rounded-lg sm:px-4 md:px-6 lg:px-8">
                                <h4 className="font-medium text-[var(--text-primary)] mb-3 sm:px-4 md:px-6 lg:px-8">Playoff Chances</h4>
                                <div className="text-3xl font-bold text-blue-400 mb-2 sm:px-4 md:px-6 lg:px-8">78%</div>
                                <p className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                    Based on current roster and schedule strength
                                </p>
                            </div>
                            
                            <div className="p-4 bg-purple-500/10 rounded-lg sm:px-4 md:px-6 lg:px-8">
                                <h4 className="font-medium text-[var(--text-primary)] mb-3 sm:px-4 md:px-6 lg:px-8">Championship Odds</h4>
                                <div className="text-3xl font-bold text-purple-400 mb-2 sm:px-4 md:px-6 lg:px-8">12%</div>
                                <p className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                    3rd highest in league
                                </p>
                            </div>
                            
                            <div className="p-4 bg-green-500/10 rounded-lg sm:px-4 md:px-6 lg:px-8">
                                <h4 className="font-medium text-[var(--text-primary)] mb-3 sm:px-4 md:px-6 lg:px-8">Projected Final Record</h4>
                                <div className="text-3xl font-bold text-green-400 mb-2 sm:px-4 md:px-6 lg:px-8">10-4</div>
                                <p className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                    Should secure playoff spot
                                </p>
                            </div>
                            
                            <div className="p-4 bg-yellow-500/10 rounded-lg sm:px-4 md:px-6 lg:px-8">
                                <h4 className="font-medium text-[var(--text-primary)] mb-3 sm:px-4 md:px-6 lg:px-8">Strength of Schedule</h4>
                                <div className="text-3xl font-bold text-yellow-400 mb-2 sm:px-4 md:px-6 lg:px-8">0.52</div>
                                <p className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                    Slightly above average difficulty
                                </p>
                            </div>
                        </div>
                    </div>
                </Widget>
            )}

            {/* Next Matchup Tab */}
            {selectedTab === &apos;matchup&apos; && (
}
                <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
                    <Widget title="Week 5 Matchup Preview">
                        <div className="p-4 sm:px-4 md:px-6 lg:px-8">
                            <div className="flex items-center justify-between mb-6 sm:px-4 md:px-6 lg:px-8">
                                <div className="text-center flex-1 sm:px-4 md:px-6 lg:px-8">
                                    <Avatar avatar={team.avatar} className="w-16 h-16 text-2xl mx-auto mb-2 rounded-lg sm:px-4 md:px-6 lg:px-8" />
                                    <h3 className="font-bold text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">{team.name}</h3>
                                    <p className="text-lg font-bold text-blue-400 sm:px-4 md:px-6 lg:px-8">{nextMatchup.projectedScore}</p>
                                </div>
                                
                                <div className="text-center px-6 sm:px-4 md:px-6 lg:px-8">
                                    <div className="text-xs text-[var(--text-secondary)] mb-1 sm:px-4 md:px-6 lg:px-8">WIN PROBABILITY</div>
                                    <div className="text-2xl font-bold text-green-400 mb-1 sm:px-4 md:px-6 lg:px-8">{nextMatchup.winProbability}%</div>
                                    <div className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">VS</div>
                                </div>
                                
                                <div className="text-center flex-1 sm:px-4 md:px-6 lg:px-8">
                                    <Avatar avatar={nextMatchup.opponent.avatar} className="w-16 h-16 text-2xl mx-auto mb-2 rounded-lg sm:px-4 md:px-6 lg:px-8" />
                                    <h3 className="font-bold text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">{nextMatchup.opponent.name}</h3>
                                    <p className="text-lg font-bold text-red-400 sm:px-4 md:px-6 lg:px-8">{nextMatchup.opponentProjected}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium text-[var(--text-primary)] mb-4 sm:px-4 md:px-6 lg:px-8">Key Matchups</h4>
                                <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                                    {nextMatchup.keyMatchups.map((matchup, index) => (
}
                                        <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg sm:px-4 md:px-6 lg:px-8">
                                            <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                                                <TargetIcon className="w-5 h-5 text-blue-400 sm:px-4 md:px-6 lg:px-8" />
                                                <div>
                                                    <div className="font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                                        {matchup.myPlayer.name} vs {matchup.theirPlayer.name}
                                                    </div>
                                                    <div className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                                        {matchup.myPlayer.position} Matchup
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className={`px-3 py-1 rounded text-sm font-medium ${getAdvantageColor(matchup.advantage)}`}>
                                                {matchup.advantage === &apos;favor&apos; ? &apos;Advantage&apos; : 
}
                                                 matchup.advantage === &apos;against&apos; ? &apos;Disadvantage&apos; : &apos;Even&apos;}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Widget>
                </div>
            )}
        </div>
    );
};

const TeamAnalyticsDashboardWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <TeamAnalyticsDashboard {...props} />
  </ErrorBoundary>
);

export default React.memo(TeamAnalyticsDashboardWithErrorBoundary);
