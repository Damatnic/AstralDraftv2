/**
 * Lineup Optimizer
 * AI-powered lineup suggestions and optimization tools
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useMemo } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { Widget } from &apos;../ui/Widget&apos;;
import { Avatar } from &apos;../ui/Avatar&apos;;
import { Player, Team, League, PlayerPosition } from &apos;../../types&apos;;
import { TrendingUpIcon } from &apos;../icons/TrendingUpIcon&apos;;
import { RefreshIcon } from &apos;../icons/RefreshIcon&apos;;
import { CheckIcon } from &apos;../icons/CheckIcon&apos;;
import { XIcon } from &apos;../icons/XIcon&apos;;
import { StarIcon } from &apos;../icons/StarIcon&apos;;
import { BrainCircuitIcon } from &apos;../icons/BrainCircuitIcon&apos;;

interface LineupOptimizerProps {
}
    team: Team;
    league: League;
    dispatch: React.Dispatch<any>;
    canEdit: boolean;

}

interface LineupSuggestion {
}
    id: string;
    name: string;
    starters: Player[];
    projectedScore: number;
    confidence: number;
    reasoning: string;
    improvements: string[];
    riskLevel: &apos;Low&apos; | &apos;Medium&apos; | &apos;High&apos;;
}

interface OptimizerSettings {
}
    optimizeFor: &apos;ceiling&apos; | &apos;floor&apos; | &apos;projection&apos;;
    riskTolerance: &apos;conservative&apos; | &apos;balanced&apos; | &apos;aggressive&apos;;
    considerMatchups: boolean;
    considerWeather: boolean;
    considerInjuries: boolean;

}

const LineupOptimizer: React.FC<LineupOptimizerProps> = ({ team, league, dispatch, canEdit }: any) => {
}
    const [isOptimizing, setIsOptimizing] = React.useState(false);
    const [suggestions, setSuggestions] = React.useState<LineupSuggestion[]>([]);
    const [selectedSuggestion, setSelectedSuggestion] = React.useState<LineupSuggestion | null>(null);
    const [settings, setSettings] = React.useState<OptimizerSettings>({
}
        optimizeFor: &apos;projection&apos;,
        riskTolerance: &apos;balanced&apos;,
        considerMatchups: true,
        considerWeather: true,
        considerInjuries: true
    });

    // Current lineup
    const currentLineup = team.roster.slice(0, 9); // First 9 are starters
    const currentProjection = currentLineup.reduce((sum, player) => sum + player.stats.projection, 0);

    const positionSlots = [
        { position: &apos;QB&apos;, count: 1 },
        { position: &apos;RB&apos;, count: 2 },
        { position: &apos;WR&apos;, count: 2 },
        { position: &apos;TE&apos;, count: 1 },
        { position: &apos;FLEX&apos;, count: 1 }, // RB/WR/TE
        { position: &apos;DST&apos;, count: 1 },
        { position: &apos;K&apos;, count: 1 }
    ];

    const generateOptimizations = async () => {
}
    try {
}

        setIsOptimizing(true);
        
        // Simulate AI optimization process
        await new Promise(resolve => setTimeout(resolve, 2000));

        const mockSuggestions: LineupSuggestion[] = [
            {
}
                id: &apos;1&apos;,
                name: &apos;Maximum Points&apos;,
                starters: team.roster.slice(0, 9), // Mock optimized lineup
                projectedScore: currentProjection + 8.5,
                confidence: 87,
                reasoning: &apos;This lineup maximizes projected points by starting your highest-scoring players at each position.&apos;,
                improvements: [
                    &apos;Move Josh Jacobs to RB2 for better matchup vs weak run defense&apos;,
                    &apos;Start Mike Evans over Jerry Jeudy due to target share increase&apos;,
                    &apos;Consider streaming defense with better matchup&apos;
                ],
                riskLevel: &apos;Medium&apos;
            },
            {
}
                id: &apos;2&apos;,
                name: &apos;Safe Floor&apos;,
                starters: team.roster.slice(0, 9),
                projectedScore: currentProjection + 2.3,
                confidence: 94,
                reasoning: &apos;Conservative lineup focused on consistent performers with high floors.&apos;,
                improvements: [
                    &apos;Start reliable pass-catching RBs for higher floor&apos;,
                    &apos;Avoid boom-or-bust WR3 options&apos;,
                    &apos;Play proven veterans over rookies in key spots&apos;
                ],
                riskLevel: &apos;Low&apos;
            },
            {
}
                id: &apos;3&apos;,
                name: &apos;High Ceiling&apos;,
                starters: team.roster.slice(0, 9),
                projectedScore: currentProjection + 12.7,
                confidence: 73,
                reasoning: &apos;Aggressive lineup targeting maximum upside with boom potential.&apos;,
                improvements: [
                    &apos;Start high-upside WRs in plus matchups&apos;,
                    &apos;Play RBs with goal-line opportunity&apos;,
                    &apos;Target quarterbacks in projected shootouts&apos;
                ],
                riskLevel: &apos;High&apos;
            }
        ];

        setSuggestions(mockSuggestions);
        setSelectedSuggestion(mockSuggestions[0]);
        setIsOptimizing(false);
    } catch (error) {
}
        console.error(&apos;Error in generateOptimizations:&apos;, error);
        setIsOptimizing(false);
    }
    };

    const applyLineup = (suggestion: LineupSuggestion) => {
}
        if (!canEdit) return;

        dispatch({
}
            type: &apos;SET_LINEUP&apos;,
            payload: {
}
                leagueId: league.id,
                teamId: team.id,
                playerIds: suggestion.starters.map((p: any) => p.id)
            }
        });

        dispatch({
}
            type: &apos;ADD_NOTIFICATION&apos;,
            payload: {
}
                message: `Applied "${suggestion.name}" lineup optimization`,
                type: &apos;SYSTEM&apos;
            }
        });
    };

    const renderLineupCard = (suggestion: LineupSuggestion) => (
        <div
            key={suggestion.id}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
}
                selectedSuggestion?.id === suggestion.id
                    ? &apos;border-blue-500 bg-blue-500/10&apos;
                    : &apos;border-[var(--panel-border)] hover:border-gray-500&apos;
            }`}
            onClick={() => setSelectedSuggestion(suggestion)}
            role="button"
            tabIndex={0}
        >
            <div className="flex items-center justify-between mb-3 sm:px-4 md:px-6 lg:px-8">
                <h4 className="font-semibold text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">{suggestion.name}</h4>
                <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
}
                        suggestion.riskLevel === &apos;Low&apos; ? &apos;bg-green-500/20 text-green-400&apos; :
                        suggestion.riskLevel === &apos;Medium&apos; ? &apos;bg-yellow-500/20 text-yellow-400&apos; :
                        &apos;bg-red-500/20 text-red-400&apos;
                    }`}>
                        {suggestion.riskLevel} Risk
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-3 text-sm sm:px-4 md:px-6 lg:px-8">
                <div className="text-center sm:px-4 md:px-6 lg:px-8">
                    <div className="text-lg font-bold text-green-400 sm:px-4 md:px-6 lg:px-8">
                        {suggestion.projectedScore.toFixed(1)}
                    </div>
                    <div className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Projected</div>
                </div>
                <div className="text-center sm:px-4 md:px-6 lg:px-8">
                    <div className="text-lg font-bold text-blue-400 sm:px-4 md:px-6 lg:px-8">
                        +{(suggestion.projectedScore - currentProjection).toFixed(1)}
                    </div>
                    <div className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Improvement</div>
                </div>
                <div className="text-center sm:px-4 md:px-6 lg:px-8">
                    <div className="text-lg font-bold text-purple-400 sm:px-4 md:px-6 lg:px-8">
                        {suggestion.confidence}%
                    </div>
                    <div className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Confidence</div>
                </div>
            </div>

            <p className="text-sm text-[var(--text-secondary)] mb-3 sm:px-4 md:px-6 lg:px-8">{suggestion.reasoning}</p>

            {canEdit && (
}
                <button
                    onClick={(e: any) => {
}
                        e.stopPropagation();
                        applyLineup(suggestion);
                    }}
                    aria-label="Action button"
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium sm:px-4 md:px-6 lg:px-8"
                >
                    Apply This Lineup
                </button>
            )}
        </div>
    );

    return (
        <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
            {/* Optimizer Settings */}
            <Widget title="Optimization Settings">
                <div className="p-4 space-y-4 sm:px-4 md:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 sm:px-4 md:px-6 lg:px-8">
                                Optimize For
                            </label>
                            <select
                                value={settings.optimizeFor}
                                onChange={(e: any) => setSettings(prev => ({ ...prev, optimizeFor: e.target.value as any }))}
                                className="w-full px-3 py-2 bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-lg text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8"
                            >
                                <option value="projection">Projected Points</option>
                                <option value="ceiling">Ceiling (Maximum Upside)</option>
                                <option value="floor">Floor (Consistent Points)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 sm:px-4 md:px-6 lg:px-8">
                                Risk Tolerance
                            </label>
                            <select
                                value={settings.riskTolerance}
                                onChange={(e: any) => setSettings(prev => ({ ...prev, riskTolerance: e.target.value as any }))}
                                className="w-full px-3 py-2 bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-lg text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8"
                            >
                                <option value="conservative">Conservative</option>
                                <option value="balanced">Balanced</option>
                                <option value="aggressive">Aggressive</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 sm:px-4 md:px-6 lg:px-8">
                                Advanced Options
                            </label>
                            <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                                <label className="flex items-center gap-2 text-sm sm:px-4 md:px-6 lg:px-8">
                                    <input
                                        type="checkbox"
                                        checked={settings.considerMatchups}
                                        onChange={(e: any) => setSettings(prev => ({ ...prev, considerMatchups: e.target.checked }))}
                                        className="rounded sm:px-4 md:px-6 lg:px-8"
                                    />
                                    Consider Matchups
                                </label>
                                <label className="flex items-center gap-2 text-sm sm:px-4 md:px-6 lg:px-8">
                                    <input
                                        type="checkbox"
                                        checked={settings.considerWeather}
                                        onChange={(e: any) => setSettings(prev => ({ ...prev, considerWeather: e.target.checked }))}
                                        className="rounded sm:px-4 md:px-6 lg:px-8"
                                    />
                                    Consider Weather
                                </label>
                                <label className="flex items-center gap-2 text-sm sm:px-4 md:px-6 lg:px-8">
                                    <input
                                        type="checkbox"
                                        checked={settings.considerInjuries}
                                        onChange={(e: any) => setSettings(prev => ({ ...prev, considerInjuries: e.target.checked }))}
                                        className="rounded sm:px-4 md:px-6 lg:px-8"
                                    />
                                    Consider Injuries
                                </label>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={generateOptimizations}
                        disabled={isOptimizing || !canEdit}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 sm:px-4 md:px-6 lg:px-8"
                     aria-label="Action button">
                        {isOptimizing ? (
}
                            <>
                                <RefreshIcon className="w-4 h-4 animate-spin sm:px-4 md:px-6 lg:px-8" />
                                Optimizing...
                            </>
                        ) : (
                            <>
                                <BrainCircuitIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                                Generate Optimizations
                            </>
                        )}
                    </button>
                </div>
            </Widget>

            {/* Current Lineup */}
            <Widget title="Current Lineup">
                <div className="p-4 sm:px-4 md:px-6 lg:px-8">
                    <div className="mb-4 text-center sm:px-4 md:px-6 lg:px-8">
                        <div className="text-2xl font-bold text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                            {currentProjection.toFixed(1)} pts
                        </div>
                        <div className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Projected Score</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {currentLineup.map((player, index) => (
}
                            <div key={player.id} className="flex items-center gap-3 p-3 bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-lg sm:px-4 md:px-6 lg:px-8">
                                <Avatar>
                                    avatar={player.astralIntelligence?.spiritAnimal?.[0] || &apos;🏈&apos;}
                                    className="w-10 h-10 text-xl rounded-md sm:px-4 md:px-6 lg:px-8"
                                />
                                <div className="flex-1 min-w-0 sm:px-4 md:px-6 lg:px-8">
                                    <div className="flex items-center gap-1 sm:px-4 md:px-6 lg:px-8">
                                        <p className="font-medium text-[var(--text-primary)] truncate sm:px-4 md:px-6 lg:px-8">{player.name}</p>
                                        <StarIcon className="w-3 h-3 text-yellow-500 sm:px-4 md:px-6 lg:px-8" />
                                    </div>
                                    <p className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">{player.position} - {player.team}</p>
                                </div>
                                <div className="text-right sm:px-4 md:px-6 lg:px-8">
                                    <div className="font-medium text-green-400 sm:px-4 md:px-6 lg:px-8">{player.stats.projection.toFixed(1)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Widget>

            {/* Optimization Suggestions */}
            {suggestions.length > 0 && (
}
                <Widget title="Lineup Suggestions">
                    <div className="p-4 sm:px-4 md:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
                            {suggestions.map(renderLineupCard)}
                        </div>

                        {/* Detailed View */}
                        {selectedSuggestion && (
}
                            <div className="border-t border-[var(--panel-border)] pt-4 sm:px-4 md:px-6 lg:px-8">
                                <h4 className="font-semibold text-[var(--text-primary)] mb-3 sm:px-4 md:px-6 lg:px-8">
                                    Detailed Analysis: {selectedSuggestion.name}
                                </h4>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                        <h5 className="font-medium text-[var(--text-primary)] mb-2 sm:px-4 md:px-6 lg:px-8">Recommended Starters</h5>
                                        <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                                            {selectedSuggestion.starters.map((player, index) => (
}
                                                <div key={player.id} className="flex items-center justify-between p-2 bg-[var(--panel-bg)] rounded sm:px-4 md:px-6 lg:px-8">
                                                    <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                                                        <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded sm:px-4 md:px-6 lg:px-8">
                                                            {positionSlots[index]?.position || &apos;FLEX&apos;}
                                                        </span>
                                                        <span className="font-medium sm:px-4 md:px-6 lg:px-8">{player.name}</span>
                                                        <span className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">({player.position})</span>
                                                    </div>
                                                    <span className="text-green-400 font-medium sm:px-4 md:px-6 lg:px-8">{player.stats.projection.toFixed(1)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h5 className="font-medium text-[var(--text-primary)] mb-2 sm:px-4 md:px-6 lg:px-8">Key Improvements</h5>
                                        <ul className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                                            {selectedSuggestion.improvements.map((improvement, index) => (
}
                                                <li key={index} className="flex items-start gap-2 text-sm sm:px-4 md:px-6 lg:px-8">
                                                    <TrendingUpIcon className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0 sm:px-4 md:px-6 lg:px-8" />
                                                    <span className="text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">{improvement}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </Widget>
            )}

            {/* Empty State */}
            {suggestions.length === 0 && !isOptimizing && (
}
                <Widget title="Lineup Optimization">
                    <div className="p-8 text-center sm:px-4 md:px-6 lg:px-8">
                        <BrainCircuitIcon className="w-16 h-16 text-gray-400 mx-auto mb-4 sm:px-4 md:px-6 lg:px-8" />
                        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2 sm:px-4 md:px-6 lg:px-8">
                            Ready to Optimize Your Lineup?
                        </h3>
                        <p className="text-[var(--text-secondary)] mb-4 sm:px-4 md:px-6 lg:px-8">
                            Get AI-powered lineup suggestions based on projections, matchups, and your preferences.
                        </p>
                        {canEdit ? (
}
                            <button
                                onClick={generateOptimizations}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium sm:px-4 md:px-6 lg:px-8"
                             aria-label="Action button">
                                Generate Lineup Suggestions
                            </button>
                        ) : (
                            <p className="text-yellow-400 sm:px-4 md:px-6 lg:px-8">View-only mode - optimization not available</p>
                        )}
                    </div>
                </Widget>
            )}
        </div>
    );
};

const LineupOptimizerWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <LineupOptimizer {...props} />
  </ErrorBoundary>
);

export default React.memo(LineupOptimizerWithErrorBoundary);
