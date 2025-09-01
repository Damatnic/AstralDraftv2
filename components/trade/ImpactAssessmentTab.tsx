/**
 * Impact Assessment Tab
 * Long-term team impact analysis with projections and trends
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import { motion } from &apos;framer-motion&apos;;
import { Widget } from &apos;../ui/Widget&apos;;
import { League, Team } from &apos;../../types&apos;;
import { TradeProposal, TradeAnalysis, TeamImpactAnalysis } from &apos;./TradeAnalyzerView&apos;;
import { TrendingUpIcon } from &apos;../icons/TrendingUpIcon&apos;;
import { TrendingDownIcon } from &apos;../icons/TrendingDownIcon&apos;;
import { BarChartIcon } from &apos;../icons/BarChartIcon&apos;;
import { CalendarIcon } from &apos;../icons/CalendarIcon&apos;;

interface ImpactAssessmentTabProps {
}
    proposal: TradeProposal | null;
    analysis: TradeAnalysis | null;
    league: League;
    currentTeam: Team;
    dispatch: React.Dispatch<any>;

}

interface ImpactMetric {
}
    name: string;
    value: number;
    unit: string;
    description: string;
    isPositive: boolean;}

const ImpactAssessmentTab: React.FC<ImpactAssessmentTabProps> = ({
}
    proposal,
    analysis,
    league,
    currentTeam,
//     dispatch
}: any) => {
}
    const impactMetrics: ImpactMetric[] = React.useMemo(() => {
}
        if (!analysis) return [];
        
        const impact = analysis.fromTeamImpact;
        return [
            {
}
                name: &apos;Starting Lineup&apos;,
                value: impact.startingLineupChange,
                unit: &apos;pts/week&apos;,
                description: &apos;Expected change in weekly scoring&apos;,
                isPositive: impact.startingLineupChange > 0
            },
            {
}
                name: &apos;Bench Depth&apos;,
                value: impact.benchDepthChange,
                unit: &apos;depth score&apos;,
                description: &apos;Quality of backup players&apos;,
                isPositive: impact.benchDepthChange > 0
            },
            {
}
                name: &apos;Playoff Odds&apos;,
                value: impact.playoffOddsChange,
                unit: &apos;%&apos;,
                description: &apos;Change in playoff probability&apos;,
                isPositive: impact.playoffOddsChange > 0
            },
            {
}
                name: &apos;Championship Odds&apos;,
                value: impact.championshipOddsChange,
                unit: &apos;%&apos;,
                description: &apos;Change in championship probability&apos;,
                isPositive: impact.championshipOddsChange > 0

        ];
    }, [analysis]);

    const scheduleMetrics = React.useMemo(() => {
}
        if (!analysis) return [];
        
        const schedule = analysis.scheduleAnalysis;
        return [
            {
}
                name: &apos;Bye Week Conflicts&apos;,
                value: schedule.byeWeekConflicts,
                description: &apos;Additional bye week complications&apos;
            },
            {
}
                name: &apos;Next 4 Weeks Impact&apos;,
                value: schedule.nextFourWeeksImpact,
                description: &apos;Short-term scoring change&apos;
            },
            {
}
                name: &apos;Playoff Schedule&apos;,
                value: schedule.playoffScheduleDiff,
                description: &apos;Strength of playoff matchups&apos;

        ];
    }, [analysis]);

    const getImpactColor = (value: number, isPositive: boolean) => {
}
        if (Math.abs(value) < 0.5) return &apos;text-gray-400&apos;;
        return isPositive ? &apos;text-green-400&apos; : &apos;text-red-400&apos;;
    };

    const getImpactIcon = (value: number, isPositive: boolean) => {
}
        if (Math.abs(value) < 0.5) return null;
        return isPositive ? 
            <TrendingUpIcon className="w-5 h-5 text-green-400 sm:px-4 md:px-6 lg:px-8" /> : 
            <TrendingDownIcon className="w-5 h-5 text-red-400 sm:px-4 md:px-6 lg:px-8" />;
    };

    if (!proposal || !analysis) {
}
        return (
            <div className="text-center py-12 text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                <BarChartIcon className="w-16 h-16 mx-auto mb-4 opacity-50 sm:px-4 md:px-6 lg:px-8" />
                <h3 className="text-lg font-medium mb-2 sm:px-4 md:px-6 lg:px-8">No Trade to Analyze</h3>
                <p>Build a trade proposal to see detailed impact assessment</p>
            </div>
        );

    return (
        <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
            {/* Impact Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Widget title="Your Team Impact" className="bg-[var(--panel-bg)] sm:px-4 md:px-6 lg:px-8">
                    <div className="p-4 sm:px-4 md:px-6 lg:px-8">
                        <div className="text-center mb-4 sm:px-4 md:px-6 lg:px-8">
                            <div className={`text-3xl font-bold mb-2 ${
}
                                analysis.fromTeamImpact.overallChange > 0 ? &apos;text-green-400&apos; : 
                                analysis.fromTeamImpact.overallChange < 0 ? &apos;text-red-400&apos; : 
                                &apos;text-gray-400&apos;
                            }`}>
                                {analysis.fromTeamImpact.overallChange > 0 ? &apos;+&apos; : &apos;&apos;}
                                {analysis.fromTeamImpact.overallChange.toFixed(1)}
                            </div>
                            <div className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Overall Team Change</div>
                        </div>
                        
                        <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                            {impactMetrics.map((metric, index) => (
}
                                <motion.div
                                    key={metric.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg sm:px-4 md:px-6 lg:px-8"
                                >
                                    <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                                        {getImpactIcon(metric.value, metric.isPositive)}
                                        <div>
                                            <div className="font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                                {metric.name}
                                            </div>
                                            <div className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                                {metric.description}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`text-lg font-bold ${getImpactColor(metric.value, metric.isPositive)}`}>
                                        {metric.value > 0 ? &apos;+&apos; : &apos;&apos;}{metric.value.toFixed(1)}{metric.unit}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </Widget>

                <Widget title="Trade Partner Impact" className="bg-[var(--panel-bg)] sm:px-4 md:px-6 lg:px-8">
                    <div className="p-4 sm:px-4 md:px-6 lg:px-8">
                        <div className="text-center mb-4 sm:px-4 md:px-6 lg:px-8">
                            <div className={`text-3xl font-bold mb-2 ${
}
                                analysis.toTeamImpact.overallChange > 0 ? &apos;text-green-400&apos; : 
                                analysis.toTeamImpact.overallChange < 0 ? &apos;text-red-400&apos; : 
                                &apos;text-gray-400&apos;
                            }`}>
                                {analysis.toTeamImpact.overallChange > 0 ? &apos;+&apos; : &apos;&apos;}
                                {analysis.toTeamImpact.overallChange.toFixed(1)}
                            </div>
                            <div className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Their Team Change</div>
                        </div>
                        
                        <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg sm:px-4 md:px-6 lg:px-8">
                                <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                                    {analysis.toTeamImpact.startingLineupChange > 0 ? 
}
                                        <TrendingUpIcon className="w-5 h-5 text-green-400 sm:px-4 md:px-6 lg:px-8" /> : 
                                        <TrendingDownIcon className="w-5 h-5 text-red-400 sm:px-4 md:px-6 lg:px-8" />

                                    <div>
                                        <div className="font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">Starting Lineup</div>
                                        <div className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Weekly scoring change</div>
                                    </div>
                                </div>
                                <div className={`text-lg font-bold ${
}
                                    analysis.toTeamImpact.startingLineupChange > 0 ? &apos;text-green-400&apos; : &apos;text-red-400&apos;
                                }`}>
                                    {analysis.toTeamImpact.startingLineupChange > 0 ? &apos;+&apos; : &apos;&apos;}
                                    {analysis.toTeamImpact.startingLineupChange.toFixed(1)}pts
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg sm:px-4 md:px-6 lg:px-8">
                                <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                                    {analysis.toTeamImpact.playoffOddsChange > 0 ? 
}
                                        <TrendingUpIcon className="w-5 h-5 text-green-400 sm:px-4 md:px-6 lg:px-8" /> : 
                                        <TrendingDownIcon className="w-5 h-5 text-red-400 sm:px-4 md:px-6 lg:px-8" />

                                    <div>
                                        <div className="font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">Playoff Odds</div>
                                        <div className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Playoff probability change</div>
                                    </div>
                                </div>
                                <div className={`text-lg font-bold ${
}
                                    analysis.toTeamImpact.playoffOddsChange > 0 ? &apos;text-green-400&apos; : &apos;text-red-400&apos;
                                }`}>
                                    {analysis.toTeamImpact.playoffOddsChange > 0 ? &apos;+&apos; : &apos;&apos;}
                                    {analysis.toTeamImpact.playoffOddsChange.toFixed(1)}%
                                </div>
                            </div>
                        </div>
                    </div>
                </Widget>
            </div>

            {/* Schedule Analysis */}
            <Widget title="Schedule Impact" icon={<CalendarIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />} className="bg-[var(--panel-bg)] sm:px-4 md:px-6 lg:px-8">
                <div className="p-4 sm:px-4 md:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {scheduleMetrics.map((metric, index) => (
}
                            <motion.div
                                key={metric.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center p-4 bg-white/5 rounded-lg sm:px-4 md:px-6 lg:px-8"
                            >
                                <div className="text-xl font-bold text-[var(--text-primary)] mb-1 sm:px-4 md:px-6 lg:px-8">
                                    {metric.value > 0 ? &apos;+&apos; : &apos;&apos;}{metric.value}
                                </div>
                                <div className="font-medium text-[var(--text-primary)] text-sm mb-1 sm:px-4 md:px-6 lg:px-8">
                                    {metric.name}
                                </div>
                                <div className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                    {metric.description}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-4 sm:px-4 md:px-6 lg:px-8">
                        <h4 className="font-medium text-[var(--text-primary)] mb-2 sm:px-4 md:px-6 lg:px-8">Rest of Season Outlook</h4>
                        <p className="text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">{analysis.scheduleAnalysis.restOfSeasonOutlook}</p>
                    </div>
                </div>
            </Widget>

            {/* Risk Assessment */}
            <Widget title="Risk Analysis" className="bg-[var(--panel-bg)] sm:px-4 md:px-6 lg:px-8">
                <div className="p-4 sm:px-4 md:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-medium text-[var(--text-primary)] mb-4 sm:px-4 md:px-6 lg:px-8">Risk Breakdown</h4>
                            <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg sm:px-4 md:px-6 lg:px-8">
                                    <span className="text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">Injury Risk</span>
                                    <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                                        <div className="w-20 h-2 bg-gray-600/20 rounded-full overflow-hidden sm:px-4 md:px-6 lg:px-8">
                                            <div 
                                                className="h-full bg-red-400 transition-all duration-1000 sm:px-4 md:px-6 lg:px-8"
                                                style={{ width: `${analysis.riskAssessment?.injuryRisk}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                            {analysis.riskAssessment?.injuryRisk}%
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg sm:px-4 md:px-6 lg:px-8">
                                    <span className="text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">Performance Risk</span>
                                    <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                                        <div className="w-20 h-2 bg-gray-600/20 rounded-full overflow-hidden sm:px-4 md:px-6 lg:px-8">
                                            <div 
                                                className="h-full bg-yellow-400 transition-all duration-1000 sm:px-4 md:px-6 lg:px-8"
                                                style={{ width: `${analysis.riskAssessment.performanceVolatility}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                            {analysis.riskAssessment.performanceVolatility}%
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg sm:px-4 md:px-6 lg:px-8">
                                    <span className="text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">Age Risk</span>
                                    <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                                        <div className="w-20 h-2 bg-gray-600/20 rounded-full overflow-hidden sm:px-4 md:px-6 lg:px-8">
                                            <div 
                                                className="h-full bg-orange-400 transition-all duration-1000 sm:px-4 md:px-6 lg:px-8"
                                                style={{ width: `${analysis.riskAssessment?.ageRisk}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                            {analysis.riskAssessment?.ageRisk}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <h4 className="font-medium text-[var(--text-primary)] mb-4 sm:px-4 md:px-6 lg:px-8">Risk Factors</h4>
                            <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                                {analysis.riskAssessment.riskFactors.map((factor, index) => (
}
                                    <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg sm:px-4 md:px-6 lg:px-8">
                                        <div className={`w-2 h-2 rounded-full ${
}
                                            analysis.riskAssessment.overallRisk === &apos;high&apos; ? &apos;bg-red-400&apos; :
                                            analysis.riskAssessment.overallRisk === &apos;medium&apos; ? &apos;bg-yellow-400&apos; :
                                            &apos;bg-green-400&apos;
                                        }`} />
                                        <span className="text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">{factor}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="mt-4 p-3 bg-white/5 rounded-lg sm:px-4 md:px-6 lg:px-8">
                                <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                                    <span className="font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">Overall Risk</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
}
                                        analysis.riskAssessment.overallRisk === &apos;low&apos; ? &apos;bg-green-500/20 text-green-400&apos; :
                                        analysis.riskAssessment.overallRisk === &apos;medium&apos; ? &apos;bg-yellow-500/20 text-yellow-400&apos; :
                                        &apos;bg-red-500/20 text-red-400&apos;
                                    }`}>
                                        {analysis.riskAssessment.overallRisk.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Widget>

            {/* Long-term Projections */}
            <Widget title="Long-term Projections" className="bg-[var(--panel-bg)] sm:px-4 md:px-6 lg:px-8">
                <div className="p-4 sm:px-4 md:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-white/5 rounded-lg sm:px-4 md:px-6 lg:px-8">
                            <div className="text-2xl font-bold text-[var(--text-primary)] mb-2 sm:px-4 md:px-6 lg:px-8">
                                Week {league.currentWeek + 4}
                            </div>
                            <div className="text-sm text-[var(--text-secondary)] mb-2 sm:px-4 md:px-6 lg:px-8">Next Month</div>
                            <div className={`text-lg font-medium ${
}
                                analysis.scheduleAnalysis.nextFourWeeksImpact > 0 ? &apos;text-green-400&apos; : &apos;text-red-400&apos;
                            }`}>
                                {analysis.scheduleAnalysis.nextFourWeeksImpact > 0 ? &apos;+&apos; : &apos;&apos;}
                                {analysis.scheduleAnalysis.nextFourWeeksImpact.toFixed(1)} pts/week
                            </div>
                        </div>
                        
                        <div className="text-center p-4 bg-white/5 rounded-lg sm:px-4 md:px-6 lg:px-8">
                            <div className="text-2xl font-bold text-[var(--text-primary)] mb-2 sm:px-4 md:px-6 lg:px-8">
//                                 Playoffs
                            </div>
                            <div className="text-sm text-[var(--text-secondary)] mb-2 sm:px-4 md:px-6 lg:px-8">Weeks 15-17</div>
                            <div className={`text-lg font-medium ${
}
                                analysis.scheduleAnalysis.playoffScheduleDiff > 0 ? &apos;text-green-400&apos; : &apos;text-red-400&apos;
                            }`}>
                                {analysis.scheduleAnalysis.playoffScheduleDiff > 0 ? &apos;+&apos; : &apos;&apos;}
                                {analysis.scheduleAnalysis.playoffScheduleDiff.toFixed(1)} matchup rating
                            </div>
                        </div>
                        
                        <div className="text-center p-4 bg-white/5 rounded-lg sm:px-4 md:px-6 lg:px-8">
                            <div className="text-2xl font-bold text-[var(--text-primary)] mb-2 sm:px-4 md:px-6 lg:px-8">
//                                 2025
                            </div>
                            <div className="text-sm text-[var(--text-secondary)] mb-2 sm:px-4 md:px-6 lg:px-8">Next Season</div>
                            <div className={`text-lg font-medium ${
}
                                analysis.seasonEndValueDiff > 0 ? &apos;text-green-400&apos; : &apos;text-red-400&apos;
                            }`}>
                                {analysis.seasonEndValueDiff > 0 ? &apos;+&apos; : &apos;&apos;}
                                ${Math.abs(analysis.seasonEndValueDiff)} value
                            </div>
                        </div>
                    </div>
                </div>
            </Widget>
        </div>
    );
};

const ImpactAssessmentTabWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <ImpactAssessmentTab {...props} />
  </ErrorBoundary>
);

export default React.memo(ImpactAssessmentTabWithErrorBoundary);
