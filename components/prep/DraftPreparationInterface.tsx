/**
 * Draft Preparation Interface
 * Comprehensive UI for draft preparation with cheat sheets, rankings, strategy planning, and mock drafts
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useMemo, useState, useEffect, useCallback } from &apos;react&apos;;
import { 
}
    List, 
    Download, 
    Settings, 
    Play, 
    Target,
    Star,
    AlertTriangle,
    Move,
    Clock,
    Trophy,
    FileText,
    Edit3,
    Copy,
//     Share2
} from &apos;lucide-react&apos;;
import { 
}
    draftPreparationService,
    DraftPlayer,
    CheatSheet,
    DraftStrategy,
    MockDraftResult,
    CheatSheetTemplate,
    CheatSheetCustomization,
    CheatSheetSettings,
//     MockDraftSettings
} from &apos;../../services/draftPreparationService&apos;;

interface DraftPreparationInterfaceProps {
}
    userId: string;
    leagueSettings?: {
}
        scoringFormat: string;
        leagueSize: number;
        rosterPositions: Record<string, number>;
    };
    onClose?: () => void;

export const DraftPreparationInterface: React.FC<DraftPreparationInterfaceProps> = ({
}
    userId,
    leagueSettings,
//     onClose
}: any) => {
}
    // State Management
    const [activeTab, setActiveTab] = useState<&apos;cheatsheets&apos; | &apos;rankings&apos; | &apos;strategy&apos; | &apos;mockdraft&apos;>(&apos;cheatsheets&apos;);
    const [loading, setLoading] = useState(false);
    
    // Data State
    const [players, setPlayers] = useState<DraftPlayer[]>([]);
    const [strategies, setStrategies] = useState<DraftStrategy[]>([]);
    
    // Current Selection State
    const [selectedStrategy, setSelectedStrategy] = useState<string>(&apos;&apos;);
    const [selectedCheatSheet, setSelectedCheatSheet] = useState<CheatSheet | null>(null);
    const [currentMockDraft, setCurrentMockDraft] = useState<MockDraftResult | null>(null);
    
    // UI State
    const [showFilters, setShowFilters] = useState(false);
    const [editingRankings, setEditingRankings] = useState(false);
    const [cheatSheetSettings, setCheatSheetSettings] = useState<CheatSheetSettings>({
}
        autoUpdate: true,
        includeInjuredPlayers: false,
        maxPlayersPerTier: 8,
        showADP: true,
        showProjections: true,
        customWeights: {}
    });

    // Load initial data
    useEffect(() => {
}
        loadInitialData();
    }, []);

    const loadInitialData = useCallback(async () => {
}
        setLoading(true);
        try {
}

            const [playersData, strategiesData] = await Promise.all([
                draftPreparationService.getDraftPlayers(),
                draftPreparationService.getDraftStrategies()
            ]);
            
            setPlayers(playersData);
            setStrategies(strategiesData);
        
    } catch (error) {
}
        } finally {
}
            setLoading(false);

    }, []);

    // Filter players (simplified for demo)
    const filteredPlayers = players;

    // Generate cheat sheet
    const handleGenerateCheatSheet = async () => {
}
        setLoading(true);
        try {
}
            const template: CheatSheetTemplate = {
}
                id: &apos;default&apos;,
                name: &apos;Standard Cheat Sheet&apos;,
                layout: &apos;tiers&apos;,
                sections: [
                    { id: &apos;1&apos;, title: &apos;QB Rankings&apos;, type: &apos;player_rankings&apos;, position: &apos;QB&apos;, visible: true, order: 1, config: {} },
                    { id: &apos;2&apos;, title: &apos;RB Rankings&apos;, type: &apos;player_rankings&apos;, position: &apos;RB&apos;, visible: true, order: 2, config: {} },
                    { id: &apos;3&apos;, title: &apos;WR Rankings&apos;, type: &apos;player_rankings&apos;, position: &apos;WR&apos;, visible: true, order: 3, config: {} },
                    { id: &apos;4&apos;, title: &apos;TE Rankings&apos;, type: &apos;player_rankings&apos;, position: &apos;TE&apos;, visible: true, order: 4, config: {} },
                    { id: &apos;5&apos;, title: &apos;Sleepers&apos;, type: &apos;sleepers&apos;, visible: true, order: 5, config: {} },
                    { id: &apos;6&apos;, title: &apos;Strategy Notes&apos;, type: &apos;strategy_notes&apos;, visible: true, order: 6, config: {} }
                ],
                colorScheme: &apos;default&apos;,
                density: &apos;normal&apos;
            };

            const customizations: CheatSheetCustomization = {
}
                highlightTargets: true,
                showTiers: true,
                showByeWeeks: true,
                showRiskLevels: true,
                colorCodePositions: true,
                includeNotes: true,
                fontSize: &apos;medium&apos;,
                columnsPerPage: 3
            };

            const newCheatSheet = await draftPreparationService.generateCheatSheet(
                userId,
                template,
                customizations,
//                 cheatSheetSettings
            );

            setSelectedCheatSheet(newCheatSheet);
            // In production, would save to cheat sheets list
    } catch (error) {
}
        } finally {
}
            setLoading(false);

    };

    // Run mock draft
    const handleRunMockDraft = async () => {
}
        if (!selectedStrategy) return;
        
        setLoading(true);
        try {
}

            const mockDraftSettings: MockDraftSettings = {
}
                leagueSize: leagueSettings?.leagueSize || 12,
                scoringFormat: leagueSettings?.scoringFormat || &apos;ppr&apos;,
                draftType: &apos;snake&apos;,
                timePerPick: 90,
                autopickEnabled: true,
                strategy: selectedStrategy,
                difficulty: &apos;medium&apos;
            };

            const mockDraftResult = await draftPreparationService.runMockDraft(
                mockDraftSettings,
//                 selectedStrategy
            );

            setCurrentMockDraft(mockDraftResult);
            // In production, would save to mock drafts list
    
    } catch (error) {
}
        } finally {
}
            setLoading(false);

    };

    // Render cheat sheets tab
    const renderCheatSheetsTab = () => (
        <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
            {/* Header with actions */}
            <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 sm:px-4 md:px-6 lg:px-8">Cheat Sheets</h2>
                    <p className="text-gray-600 sm:px-4 md:px-6 lg:px-8">Generate and customize draft cheat sheets</p>
                </div>
                <div className="flex gap-3 sm:px-4 md:px-6 lg:px-8">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Settings className="h-4 w-4 sm:px-4 md:px-6 lg:px-8" />
//                         Settings
                    </button>
                    <button
                        onClick={handleGenerateCheatSheet}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 sm:px-4 md:px-6 lg:px-8"
                     aria-label="Action button">
                        <FileText className="h-4 w-4 sm:px-4 md:px-6 lg:px-8" />
                        Generate Cheat Sheet
                    </button>
                </div>
            </div>

            {/* Cheat sheet settings */}
            {showFilters && (
}
                <div className="bg-gray-50 p-4 rounded-lg space-y-4 sm:px-4 md:px-6 lg:px-8">
                    <h3 className="font-semibold text-gray-900 sm:px-4 md:px-6 lg:px-8">Cheat Sheet Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 sm:px-4 md:px-6 lg:px-8">
//                                 Format
                            </label>
                            <select className="w-full p-2 border border-gray-300 rounded-lg sm:px-4 md:px-6 lg:px-8">
                                <option value="tiers">Tiers View</option>
                                <option value="list">List View</option>
                                <option value="grid">Grid View</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 sm:px-4 md:px-6 lg:px-8">
//                                 Density
                            </label>
                            <select className="w-full p-2 border border-gray-300 rounded-lg sm:px-4 md:px-6 lg:px-8">
                                <option value="compact">Compact</option>
                                <option value="normal">Normal</option>
                                <option value="spacious">Spacious</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 sm:px-4 md:px-6 lg:px-8">
                                Color Scheme
                            </label>
                            <select className="w-full p-2 border border-gray-300 rounded-lg sm:px-4 md:px-6 lg:px-8">
                                <option value="default">Default</option>
                                <option value="colorblind">Colorblind Friendly</option>
                                <option value="dark">Dark Mode</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 sm:px-4 md:px-6 lg:px-8">
                        <label className="flex items-center sm:px-4 md:px-6 lg:px-8">
                            <input 
                                type="checkbox" 
                                className="mr-2 sm:px-4 md:px-6 lg:px-8" 
                                checked={cheatSheetSettings.showADP}
                                onChange={(e: any) => setCheatSheetSettings(prev => ({
}
                                    ...prev,
                                    showADP: e.target.checked
                                }}
                            />
                            Show ADP
                        </label>
                        <label className="flex items-center sm:px-4 md:px-6 lg:px-8">
                            <input 
                                type="checkbox" 
                                className="mr-2 sm:px-4 md:px-6 lg:px-8"
                                checked={cheatSheetSettings.showProjections}
                                onChange={(e: any) => setCheatSheetSettings(prev => ({
}
                                    ...prev,
                                    showProjections: e.target.checked
                                }}
                            />
                            Show Projections
                        </label>
                        <label className="flex items-center sm:px-4 md:px-6 lg:px-8">
                            <input 
                                type="checkbox" 
                                className="mr-2 sm:px-4 md:px-6 lg:px-8"
                                checked={cheatSheetSettings.includeInjuredPlayers}
                                onChange={(e: any) => setCheatSheetSettings(prev => ({
}
                                    ...prev,
                                    includeInjuredPlayers: e.target.checked
                                }}
                            />
                            Include Injured Players
                        </label>
                    </div>
                </div>
            )}

            {/* Generated cheat sheet display */}
            {selectedCheatSheet && (
}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden sm:px-4 md:px-6 lg:px-8">
                    <div className="p-4 border-b border-gray-200 bg-gray-50 sm:px-4 md:px-6 lg:px-8">
                        <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                            <h3 className="font-semibold text-gray-900 sm:px-4 md:px-6 lg:px-8">{selectedCheatSheet.name}</h3>
                            <div className="flex gap-2 sm:px-4 md:px-6 lg:px-8">
                                <button className="flex items-center gap-2 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                                    <Copy className="h-3 w-3 sm:px-4 md:px-6 lg:px-8" />
//                                     Copy
                                </button>
                                <button className="flex items-center gap-2 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                                    <Download className="h-3 w-3 sm:px-4 md:px-6 lg:px-8" />
//                                     Export
                                </button>
                                <button className="flex items-center gap-2 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                                    <Share2 className="h-3 w-3 sm:px-4 md:px-6 lg:px-8" />
//                                     Share
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-4 sm:px-4 md:px-6 lg:px-8">
                        {/* Player tiers display */}
                        <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
                            {[&apos;QB&apos;, &apos;RB&apos;, &apos;WR&apos;, &apos;TE&apos;].map((position: any) => {
}
                                const positionPlayers = filteredPlayers.filter((p: any) => p.position === position).slice(0, 20);
                                return (
                                    <div key={position} className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                                        <h4 className="font-semibold text-lg text-gray-900 sm:px-4 md:px-6 lg:px-8">{position} Rankings</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {positionPlayers.map((player, index) => (
}
                                                <div 
                                                    key={player.id}
                                                    className={`p-3 rounded-lg border ${
}
                                                        player?.tier === 1 ? &apos;border-green-200 bg-green-50&apos; :
                                                        player?.tier === 2 ? &apos;border-blue-200 bg-blue-50&apos; :
                                                        &apos;border-gray-200 bg-gray-50&apos;
                                                    }`}
                                                >
                                                    <div className="flex justify-between items-start sm:px-4 md:px-6 lg:px-8">
                                                        <div>
                                                            <div className="font-medium text-gray-900 sm:px-4 md:px-6 lg:px-8">{player.name}</div>
                                                            <div className="text-sm text-gray-600 sm:px-4 md:px-6 lg:px-8">{player.team}</div>
                                                            {cheatSheetSettings.showADP && (
}
                                                                <div className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">ADP: {player?.adp}</div>
                                                            )}
                                                        </div>
                                                        <div className="text-right sm:px-4 md:px-6 lg:px-8">
                                                            <div className="text-sm font-medium sm:px-4 md:px-6 lg:px-8">#{index + 1}</div>
                                                            {player.sleeper && <Star className="h-3 w-3 text-yellow-500 sm:px-4 md:px-6 lg:px-8" />}
                                                            {player.riskLevel === &apos;high&apos; && <AlertTriangle className="h-3 w-3 text-red-500 sm:px-4 md:px-6 lg:px-8" />}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    // Render rankings tab
    const renderRankingsTab = () => (
        <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
            <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 sm:px-4 md:px-6 lg:px-8">Custom Rankings</h2>
                    <p className="text-gray-600 sm:px-4 md:px-6 lg:px-8">Create and customize your player rankings</p>
                </div>
                <button
                    onClick={() => setEditingRankings(true)}
                >
                    <Edit3 className="h-4 w-4 sm:px-4 md:px-6 lg:px-8" />
                    Create Rankings
                </button>
            </div>

            {/* Rankings editor */}
            {editingRankings && (
}
                <div className="bg-white rounded-lg border border-gray-200 p-6 sm:px-4 md:px-6 lg:px-8">
                    <h3 className="font-semibold text-gray-900 mb-4 sm:px-4 md:px-6 lg:px-8">Customize Player Rankings</h3>
                    
                    {/* Drag and drop rankings interface */}
                    <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                        {[&apos;QB&apos;, &apos;RB&apos;, &apos;WR&apos;, &apos;TE&apos;].map((position: any) => (
}
                            <div key={position} className="border border-gray-200 rounded-lg p-4 sm:px-4 md:px-6 lg:px-8">
                                <h4 className="font-medium text-gray-900 mb-3 sm:px-4 md:px-6 lg:px-8">{position} Rankings</h4>
                                <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                                    {filteredPlayers
}
                                        .filter((p: any) => p.position === position)
                                        .slice(0, 10)
                                        .map((player, index) => (
                                            <div
                                                key={player.id}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-move sm:px-4 md:px-6 lg:px-8"
                                            >
                                                <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                                                    <Move className="h-4 w-4 text-gray-400 sm:px-4 md:px-6 lg:px-8" />
                                                    <span className="font-medium sm:px-4 md:px-6 lg:px-8">#{index + 1}</span>
                                                    <span>{player.name}</span>
                                                    <span className="text-sm text-gray-600 sm:px-4 md:px-6 lg:px-8">({player.team})</span>
                                                </div>
                                                <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                                                    <span className="text-xs bg-gray-200 px-2 py-1 rounded sm:px-4 md:px-6 lg:px-8">
                                                        Tier {player?.tier}
                                                    </span>
                                                    <button className="text-gray-400 hover:text-gray-600 sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                                                        <Edit3 className="h-3 w-3 sm:px-4 md:px-6 lg:px-8" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end gap-3 mt-6 sm:px-4 md:px-6 lg:px-8">
                        <button
                            onClick={() => setEditingRankings(false)}
                        >
//                             Cancel
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                            Save Rankings
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    // Render strategy tab
    const renderStrategyTab = () => (
        <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 sm:px-4 md:px-6 lg:px-8">Draft Strategy</h2>
                <p className="text-gray-600 sm:px-4 md:px-6 lg:px-8">Plan your draft approach and strategy</p>
            </div>

            {/* Strategy selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {strategies.map((strategy: any) => (
}
                    <div
                        key={strategy.id}
                        className={`p-6 rounded-lg border-2 cursor-pointer transition-colors ${
}
                            selectedStrategy === strategy.id
                                ? &apos;border-blue-500 bg-blue-50&apos;
                                : &apos;border-gray-200 hover:border-gray-300&apos;
                        }`}
                        onClick={() = role="button" tabIndex={0}> setSelectedStrategy(strategy.id)}
                    >
                        <div className="flex justify-between items-start mb-3 sm:px-4 md:px-6 lg:px-8">
                            <h3 className="font-semibold text-gray-900 sm:px-4 md:px-6 lg:px-8">{strategy.name}</h3>
                            <span className={`text-xs px-2 py-1 rounded ${
}
                                strategy.difficulty === &apos;beginner&apos; ? &apos;bg-green-100 text-green-800&apos; :
                                strategy.difficulty === &apos;intermediate&apos; ? &apos;bg-yellow-100 text-yellow-800&apos; :
                                &apos;bg-red-100 text-red-800&apos;
                            }`}>
                                {strategy.difficulty}
                            </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 sm:px-4 md:px-6 lg:px-8">{strategy.description}</p>
                        
                        {/* Strategy stats */}
                        <div className="flex justify-between items-center text-sm sm:px-4 md:px-6 lg:px-8">
                            <span className="text-gray-500 sm:px-4 md:px-6 lg:px-8">Success Rate</span>
                            <span className="font-medium sm:px-4 md:px-6 lg:px-8">{strategy.success_rate}%</span>
                        </div>
                        
                        {/* Strategy details */}
                        <div className="mt-4 pt-4 border-t border-gray-200 sm:px-4 md:px-6 lg:px-8">
                            <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                                <div>
                                    <span className="text-xs font-medium text-green-600 sm:px-4 md:px-6 lg:px-8">Pros:</span>
                                    <ul className="text-xs text-gray-600 mt-1 sm:px-4 md:px-6 lg:px-8">
                                        {strategy.pros.slice(0, 2).map((pro: string, index: number) => (
}
                                            <li key={index}>• {pro}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <span className="text-xs font-medium text-red-600 sm:px-4 md:px-6 lg:px-8">Cons:</span>
                                    <ul className="text-xs text-gray-600 mt-1 sm:px-4 md:px-6 lg:px-8">
                                        {strategy.cons.slice(0, 2).map((con: string, index: number) => (
}
                                            <li key={index}>• {con}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Selected strategy details */}
            {selectedStrategy && (
}
                <div className="bg-white rounded-lg border border-gray-200 p-6 sm:px-4 md:px-6 lg:px-8">
                    {(() => {
}
                        const strategy = strategies.find((s: any) => s.id === selectedStrategy);
                        if (!strategy) return null;
                        
                        return (
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-4 sm:px-4 md:px-6 lg:px-8">
                                    {strategy.name} - Round by Round Guide
                                </h3>
                                <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                                    {strategy.rounds.map((round: any) => (
}
                                        <div key={round.round} className="border border-gray-200 rounded-lg p-4 sm:px-4 md:px-6 lg:px-8">
                                            <div className="flex justify-between items-center mb-3 sm:px-4 md:px-6 lg:px-8">
                                                <h4 className="font-medium sm:px-4 md:px-6 lg:px-8">Round {round.round}</h4>
                                                <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded sm:px-4 md:px-6 lg:px-8">
                                                        Flexibility: {Math.round(round.flexibility * 100)}%
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                <div>
                                                    <span className="font-medium text-gray-700 sm:px-4 md:px-6 lg:px-8">Target Positions:</span>
                                                    <div className="text-gray-600 mt-1 sm:px-4 md:px-6 lg:px-8">
                                                        {round.positions.join(&apos;, &apos;)}
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-green-700 sm:px-4 md:px-6 lg:px-8">Targets:</span>
                                                    <div className="text-gray-600 mt-1 sm:px-4 md:px-6 lg:px-8">
                                                        {round.targets.join(&apos;, &apos;)}
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-red-700 sm:px-4 md:px-6 lg:px-8">Avoid:</span>
                                                    <div className="text-gray-600 mt-1 sm:px-4 md:px-6 lg:px-8">
                                                        {round.avoid.join(&apos;, &apos;)}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {round.notes && (
}
                                                <div className="mt-3 p-3 bg-gray-50 rounded text-sm text-gray-600 sm:px-4 md:px-6 lg:px-8">
                                                    {round.notes}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })()}
                </div>
            )}
        </div>
    );

    // Render mock draft tab
    const renderMockDraftTab = () => (
        <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
            <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 sm:px-4 md:px-6 lg:px-8">Mock Draft</h2>
                    <p className="text-gray-600 sm:px-4 md:px-6 lg:px-8">Practice your draft strategy</p>
                </div>
                <button
                    onClick={handleRunMockDraft}
                    disabled={!selectedStrategy || loading}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 sm:px-4 md:px-6 lg:px-8"
                 aria-label="Action button">
                    <Play className="h-4 w-4 sm:px-4 md:px-6 lg:px-8" />
                    {loading ? &apos;Running...&apos; : &apos;Start Mock Draft&apos;}
                </button>
            </div>

            {/* Mock draft settings */}
            <div className="bg-gray-50 p-4 rounded-lg sm:px-4 md:px-6 lg:px-8">
                <h3 className="font-semibold text-gray-900 mb-3 sm:px-4 md:px-6 lg:px-8">Mock Draft Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 sm:px-4 md:px-6 lg:px-8">
                            League Size
                        </label>
                        <select className="w-full p-2 border border-gray-300 rounded-lg sm:px-4 md:px-6 lg:px-8">
                            <option value="8">8 Teams</option>
                            <option value="10">10 Teams</option>
                            <option value="12">12 Teams</option>
                            <option value="14">14 Teams</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 sm:px-4 md:px-6 lg:px-8">
                            Draft Type
                        </label>
                        <select className="w-full p-2 border border-gray-300 rounded-lg sm:px-4 md:px-6 lg:px-8">
                            <option value="snake">Snake Draft</option>
                            <option value="linear">Linear Draft</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 sm:px-4 md:px-6 lg:px-8">
                            Time per Pick
                        </label>
                        <select className="w-full p-2 border border-gray-300 rounded-lg sm:px-4 md:px-6 lg:px-8">
                            <option value="60">60 seconds</option>
                            <option value="90">90 seconds</option>
                            <option value="120">2 minutes</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 sm:px-4 md:px-6 lg:px-8">
//                             Strategy
                        </label>
                        <select 
                            className="w-full p-2 border border-gray-300 rounded-lg sm:px-4 md:px-6 lg:px-8"
                            value={selectedStrategy}
                            onChange={(e: any) => setSelectedStrategy(e.target.value)}
                            <option value="">Select Strategy</option>
                            {strategies.map((strategy: any) => (
}
                                <option key={strategy.id} value={strategy.id}>
                                    {strategy.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Mock draft results */}
            {currentMockDraft && (
}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden sm:px-4 md:px-6 lg:px-8">
                    <div className="p-4 border-b border-gray-200 bg-gray-50 sm:px-4 md:px-6 lg:px-8">
                        <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                            <h3 className="font-semibold text-gray-900 sm:px-4 md:px-6 lg:px-8">Mock Draft Results</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 sm:px-4 md:px-6 lg:px-8">
                                <span className="flex items-center gap-1 sm:px-4 md:px-6 lg:px-8">
                                    <Clock className="h-4 w-4 sm:px-4 md:px-6 lg:px-8" />
                                    {Math.floor(currentMockDraft.duration / 60)}m {currentMockDraft.duration % 60}s
                                </span>
                                <span className="flex items-center gap-1 sm:px-4 md:px-6 lg:px-8">
                                    <Trophy className="h-4 w-4 sm:px-4 md:px-6 lg:px-8" />
                                    Grade: {currentMockDraft.analysis.teamGrade}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 sm:px-4 md:px-6 lg:px-8">
                        {/* Team analysis */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-3 sm:px-4 md:px-6 lg:px-8">Your Draft Picks</h4>
                                <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                                    {currentMockDraft.userTeam.map((player: any) => (
}
                                        <div
                                            key={player.id}
                                            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg sm:px-4 md:px-6 lg:px-8"
                                        >
                                            <div>
                                                <span className="font-medium sm:px-4 md:px-6 lg:px-8">{player.name}</span>
                                                <span className="text-sm text-gray-600 ml-2 sm:px-4 md:px-6 lg:px-8">
                                                    ({player.position} - {player.team})
                                                </span>
                                            </div>
                                            <div className="text-right text-sm sm:px-4 md:px-6 lg:px-8">
                                                <div>Round {player.round}.{player.pick}</div>
                                                <div className={`${
}
                                                    player.valueAtPick > 10 ? &apos;text-green-600&apos; :
                                                    player.valueAtPick < -5 ? &apos;text-red-600&apos; :
                                                    &apos;text-gray-600&apos;
                                                }`}>
                                                    Value: {player.valueAtPick > 0 ? &apos;+&apos; : &apos;&apos;}{player.valueAtPick.toFixed(1)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 mb-3 sm:px-4 md:px-6 lg:px-8">Analysis</h4>
                                <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                                    <div>
                                        <h5 className="font-medium text-gray-700 mb-2 sm:px-4 md:px-6 lg:px-8">Strengths</h5>
                                        <div className="flex flex-wrap gap-2 sm:px-4 md:px-6 lg:px-8">
                                            {currentMockDraft.analysis.strengthPositions.map((pos: any) => (
}
                                                <span 
                                                    key={pos} 
                                                    className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded sm:px-4 md:px-6 lg:px-8"
                                                >
                                                    {pos}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h5 className="font-medium text-gray-700 mb-2 sm:px-4 md:px-6 lg:px-8">Weaknesses</h5>
                                        <div className="flex flex-wrap gap-2 sm:px-4 md:px-6 lg:px-8">
                                            {currentMockDraft.analysis.weakPositions.map((pos: any) => (
}
                                                <span 
                                                    key={pos} 
                                                    className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded sm:px-4 md:px-6 lg:px-8"
                                                >
                                                    {pos}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h5 className="font-medium text-gray-700 mb-2 sm:px-4 md:px-6 lg:px-8">Recommendations</h5>
                                        <ul className="text-sm text-gray-600 space-y-1 sm:px-4 md:px-6 lg:px-8">
                                            {currentMockDraft.analysis.recommendations.map((rec, index) => (
}
                                                <li key={index}>• {rec}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="pt-4 border-t border-gray-200 sm:px-4 md:px-6 lg:px-8">
                                        <div className="grid grid-cols-2 gap-4 text-sm sm:px-4 md:px-6 lg:px-8">
                                            <div>
                                                <span className="text-gray-600 sm:px-4 md:px-6 lg:px-8">Projected Finish:</span>
                                                <span className="ml-2 font-medium sm:px-4 md:px-6 lg:px-8">
                                                    {currentMockDraft.analysis.projectedFinish}
                                                    {currentMockDraft.analysis.projectedFinish === 1 ? &apos;st&apos; :
}
                                                     currentMockDraft.analysis.projectedFinish === 2 ? &apos;nd&apos; :
                                                     currentMockDraft.analysis.projectedFinish === 3 ? &apos;rd&apos; : &apos;th&apos;}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600 sm:px-4 md:px-6 lg:px-8">Total Points:</span>
                                                <span className="ml-2 font-medium sm:px-4 md:px-6 lg:px-8">
                                                    {currentMockDraft.analysis.totalProjectedPoints.toFixed(1)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    if (loading && players.length === 0) {
}
        return (
            <div className="flex items-center justify-center h-96 sm:px-4 md:px-6 lg:px-8">
                <div className="text-center sm:px-4 md:px-6 lg:px-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto sm:px-4 md:px-6 lg:px-8"></div>
                    <p className="mt-4 text-gray-600 sm:px-4 md:px-6 lg:px-8">Loading draft preparation tools...</p>
                </div>
            </div>
        );

    return (
        <div className="max-w-7xl mx-auto p-6 sm:px-4 md:px-6 lg:px-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 sm:px-4 md:px-6 lg:px-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 sm:px-4 md:px-6 lg:px-8">Draft Preparation</h1>
                    <p className="text-gray-600 mt-1 sm:px-4 md:px-6 lg:px-8">
                        Complete toolkit for draft preparation and strategy planning
                    </p>
                </div>
                {onClose && (
}
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 sm:px-4 md:px-6 lg:px-8"
                     aria-label="Action button">
//                         Close
                    </button>
                )}
            </div>

            {/* Navigation tabs */}
            <div className="border-b border-gray-200 mb-8 sm:px-4 md:px-6 lg:px-8">
                <nav className="flex space-x-8 sm:px-4 md:px-6 lg:px-8">
                    {[
}
                        { id: &apos;cheatsheets&apos;, label: &apos;Cheat Sheets&apos;, icon: FileText },
                        { id: &apos;rankings&apos;, label: &apos;Rankings&apos;, icon: List },
                        { id: &apos;strategy&apos;, label: &apos;Strategy&apos;, icon: Target },
                        { id: &apos;mockdraft&apos;, label: &apos;Mock Draft&apos;, icon: Play }
                    ].map((tab: any) => {
}
                        const Icon = tab.icon;
                        
  if (isLoading) {
}
    return (
      <div className="flex justify-center items-center p-4 sm:px-4 md:px-6 lg:px-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 sm:px-4 md:px-6 lg:px-8"></div>
        <span className="ml-2 sm:px-4 md:px-6 lg:px-8">Loading...</span>
      </div>
    );

  return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}`}
                            >
                                <Icon className="h-4 w-4 sm:px-4 md:px-6 lg:px-8" />
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Tab content */}
            <div className="min-h-[600px] sm:px-4 md:px-6 lg:px-8">
                {activeTab === &apos;cheatsheets&apos; && renderCheatSheetsTab()}
                {activeTab === &apos;rankings&apos; && renderRankingsTab()}
                {activeTab === &apos;strategy&apos; && renderStrategyTab()}
                {activeTab === &apos;mockdraft&apos; && renderMockDraftTab()}
            </div>
        </div>
    );
};

const DraftPreparationInterfaceWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <DraftPreparationInterface {...props} />
  </ErrorBoundary>
);

export default React.memo(DraftPreparationInterfaceWithErrorBoundary);
