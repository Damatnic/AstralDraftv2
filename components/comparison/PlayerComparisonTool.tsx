/**
 * Player Comparison Tool Component
 * Advanced UI for comparing multiple NFL players with projections and analysis
 */

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Tabs } from '../ui/Tabs';
import { Loader2, TrendingUp, TrendingDown, Activity, Target, Shield, AlertTriangle } from 'lucide-react';
import { 
  playerComparisonService, 
//   PlayerComparison
} from '../../services/playerComparisonService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PlayerComparisonToolProps {
  className?: string;
  initialPlayers?: string[];
  week?: number;
  season?: number;
}

interface PlayerSearchResult {
  id: string;
  name: string;
  team: string;
  position: string;}

export const PlayerComparisonTool: React.FC<PlayerComparisonToolProps> = ({
  className = '',
  initialPlayers = [],
  week = 1,
  season = 2024
}: any) => {
  // State management
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>(initialPlayers);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PlayerSearchResult[]>([]);
  const [comparison, setComparison] = useState<PlayerComparison | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentWeek, setCurrentWeek] = useState(week);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock search for players - would integrate with real search
  useEffect(() => {
    const searchPlayers = async () => {
    try {

      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      
    } catch (error) {
      console.error('Error in searchPlayers:', error);

    } catch (error) {
        console.error(error);
    }try {

        // Mock search results - would use real API
        const mockResults = [
          { id: 'player1', name: 'Josh Allen', team: 'BUF', position: 'QB' },
          { id: 'player2', name: 'Christian McCaffrey', team: 'SF', position: 'RB' },
          { id: 'player3', name: 'Cooper Kupp', team: 'LAR', position: 'WR' },
          { id: 'player4', name: 'Travis Kelce', team: 'KC', position: 'TE' },
        ].filter((p: any) => 
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.team.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        setSearchResults(mockResults);

    } catch (error) {
        setSearchResults([]);

    };

    const debounceTimer = setTimeout(searchPlayers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Load comparison when players change
  useEffect(() => {
    if (selectedPlayers.length >= 2) {
      loadComparison();
    } else {
      setComparison(null);

  }, [selectedPlayers, currentWeek]);

  const loadComparison = async () => {
    if (selectedPlayers.length < 2) return;

    setLoading(true);
    setError(null);

    try {

      const comparisonResult = await playerComparisonService.comparePlayersFull(
        selectedPlayers,
        currentWeek,
//         season
      );
      setComparison(comparisonResult);
    
    } catch (error) {
      setError('Failed to load player comparison. Please try again.');
    } finally {
      setLoading(false);

  };

  // Player selection handlers
  const addPlayer = (playerId: string) => {
    if (!selectedPlayers.includes(playerId) && selectedPlayers.length < 4) {
      setSelectedPlayers([...selectedPlayers, playerId]);
      setSearchQuery('');
      setSearchResults([]);

  };

  const removePlayer = (playerId: string) => {
    setSelectedPlayers(selectedPlayers.filter((id: any) => id !== playerId));
  };

  // Memoized data transformations
  const chartData = useMemo(() => {
    if (!comparison) return null;

    const projectionData = comparison.players.map((player: any) => ({
      name: player.name.split(' ').pop(), // Last name only for chart
      fantasyPoints: player.projectedStats.fantasyPoints,
      confidence: player.projectedStats.confidence,
      ceiling: player.recentPerformance.ceiling,
      floor: player.recentPerformance.floor
    }));

    return { projectionData };
  }, [comparison]);

  // Utility functions
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';

  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-600 sm:px-4 md:px-6 lg:px-8" />;
      case 'declining': return <TrendingDown className="h-4 w-4 text-red-600 sm:px-4 md:px-6 lg:px-8" />;
      default: return <Activity className="h-4 w-4 text-blue-600 sm:px-4 md:px-6 lg:px-8" />;

  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'start': return <Target className="h-4 w-4 text-green-600 sm:px-4 md:px-6 lg:px-8" />;
      case 'sit': return <Shield className="h-4 w-4 text-red-600 sm:px-4 md:px-6 lg:px-8" />;
      case 'flex': return <Activity className="h-4 w-4 text-blue-600 sm:px-4 md:px-6 lg:px-8" />;
      default: return <AlertTriangle className="h-4 w-4 text-yellow-600 sm:px-4 md:px-6 lg:px-8" />;

  };

  const tabItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'projections', label: 'Projections' },
    { id: 'matchups', label: 'Matchups' },
    { id: 'analytics', label: 'Analytics' }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4 sm:px-4 md:px-6 lg:px-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 sm:px-4 md:px-6 lg:px-8"></div>
        <span className="ml-2 sm:px-4 md:px-6 lg:px-8">Loading...</span>
      </div>
    );

  return (
    <div className={`player-comparison-tool ${className}`}>
      {/* Header */}
      <Card className="mb-6 sm:px-4 md:px-6 lg:px-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
            <Target className="h-5 w-5 sm:px-4 md:px-6 lg:px-8" />
            Player Comparison Tool
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Player Search */}
            <div className="relative sm:px-4 md:px-6 lg:px-8">
              <input
                type="text"
                placeholder="Search for players..."
                value={searchQuery}
                onChange={(e: any) => setSearchQuery(e.target.value)}
              />
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-10 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto sm:px-4 md:px-6 lg:px-8">
                  {searchResults.map((player: any) => (
                    <div
                      key={player.id}
                      className="p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 sm:px-4 md:px-6 lg:px-8"
                      onClick={() = role="button" tabIndex={0}> addPlayer(player.id)}
                    >
                      <div>
                        <div className="font-medium sm:px-4 md:px-6 lg:px-8">{player.name}</div>
                        <div className="text-sm text-gray-500 sm:px-4 md:px-6 lg:px-8">{player.position} - {player.team}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Week Selector */}
            <select 
              value={currentWeek.toString()} 
              onChange={(e: any) => setCurrentWeek(parseInt(e.target.value))}
            >
              {Array.from({ length: 18 }, (_, i) => (
                <option key={i + 1} value={(i + 1).toString()}>
                  Week {i + 1}
                </option>
              ))}
            </select>

            {/* Compare Button */}
            <button 
              onClick={loadComparison}
              disabled={selectedPlayers.length < 2 || loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:px-4 md:px-6 lg:px-8"
             aria-label="Action button">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin sm:px-4 md:px-6 lg:px-8" />
                  Analyzing...
                </>
              ) : (
                'Compare Players'
              )}
            </button>
          </div>

          {/* Selected Players */}
          {selectedPlayers.length > 0 && (
            <div className="mt-4 sm:px-4 md:px-6 lg:px-8">
              <div className="text-sm font-medium mb-2 sm:px-4 md:px-6 lg:px-8">Selected Players ({selectedPlayers.length}/4):</div>
              <div className="flex flex-wrap gap-2 sm:px-4 md:px-6 lg:px-8">
                {comparison?.players.map((player: any) => (
                  <Badge
                    key={player.id} 
                    variant="default"
                    className="flex items-center gap-2 py-1 px-3 sm:px-4 md:px-6 lg:px-8"
                  >
                    {player.name} ({player.position})
                    <button
                      onClick={() => removePlayer(player.id)}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
            <AlertTriangle className="h-4 w-4 text-red-600 sm:px-4 md:px-6 lg:px-8" />
            <span className="text-red-800 sm:px-4 md:px-6 lg:px-8">{error}</span>
          </div>
        </div>
      )}

      {/* Comparison Results */}
      {comparison && (
        <div className="w-full sm:px-4 md:px-6 lg:px-8">
          <div className="mb-6 sm:px-4 md:px-6 lg:px-8">
            <Tabs
              items={tabItems}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
              {/* Winner Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Comparison Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 sm:px-4 md:px-6 lg:px-8">Recommended Start</h4>
                      {(() => {
                        const winner = comparison.players.find((p: any) => p.id === comparison.analysis.winner);
                        return winner ? (
                          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg sm:px-4 md:px-6 lg:px-8">
                            <div>
                              <div className="font-medium sm:px-4 md:px-6 lg:px-8">{winner.name}</div>
                              <div className="text-sm text-gray-600 sm:px-4 md:px-6 lg:px-8">{winner.position} - {winner.team}</div>
                              <div className="text-sm font-medium text-green-600 sm:px-4 md:px-6 lg:px-8">
                                {winner.projectedStats.fantasyPoints} projected points
                              </div>
                            </div>
                            <Badge className="ml-auto bg-green-100 text-green-800 sm:px-4 md:px-6 lg:px-8">
                              {comparison.analysis.confidence}% confidence
                            </Badge>
                          </div>
                        ) : null;
                      })()}
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 sm:px-4 md:px-6 lg:px-8">Key Reasoning</h4>
                      <ul className="space-y-1 sm:px-4 md:px-6 lg:px-8">
                        {comparison.analysis.reasoning.map((reason, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2 sm:px-4 md:px-6 lg:px-8">
                            <span className="text-blue-500 mt-1 sm:px-4 md:px-6 lg:px-8">•</span>
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Risk Assessment */}
                  <div className="mt-6 pt-6 border-t sm:px-4 md:px-6 lg:px-8">
                    <h4 className="font-semibold mb-3 sm:px-4 md:px-6 lg:px-8">Risk Assessment</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(comparison.analysis.riskAssessment).map(([type, playerId]) => {
                        const player = comparison.players.find((p: any) => p.id === playerId);
                        return player ? (
                          <div key={type} className="text-center p-3 bg-gray-50 rounded-lg sm:px-4 md:px-6 lg:px-8">
                            <div className="text-xs uppercase tracking-wide text-gray-500 mb-1 sm:px-4 md:px-6 lg:px-8">
                              {type.replace(/([A-Z])/g, ' $1').trim()}
                            </div>
                            <div className="font-medium sm:px-4 md:px-6 lg:px-8">{player.name.split(' ').pop()}</div>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                    {comparison.recommendations.map((rec, index) => {
                      const player = comparison.players.find((p: any) => p.id === rec.player);
                      return player ? (
                        <div key={index} className="flex items-center gap-3 p-3 border rounded-lg sm:px-4 md:px-6 lg:px-8">
                          {getRecommendationIcon(rec.type)}
                          <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                            <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                              <span className="font-medium sm:px-4 md:px-6 lg:px-8">{player.name}</span>
                              <Badge variant={rec.type === 'start' ? 'default' : 'secondary'}>
                                {rec.type.toUpperCase()}
                              </Badge>
                              <Badge variant="outline" className={
                                rec.riskLevel === 'low' ? 'border-green-200 text-green-700' :
                                rec.riskLevel === 'medium' ? 'border-yellow-200 text-yellow-700' :
                                'border-red-200 text-red-700'
                              }>
                                {rec.riskLevel} risk
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600 mt-1 sm:px-4 md:px-6 lg:px-8">{rec.reasoning}</div>
                          </div>
                          <div className="text-sm font-medium text-blue-600 sm:px-4 md:px-6 lg:px-8">
                            {rec.confidence}% confidence
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Projections Tab */}
          {activeTab === 'projections' && (
            <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
              {/* Fantasy Points Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Fantasy Point Projections</CardTitle>
                </CardHeader>
                <CardContent>
                  {chartData?.projectionData && (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData.projectionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="fantasyPoints" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              {/* Detailed Projections Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Projections</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto sm:px-4 md:px-6 lg:px-8">
                    <table className="w-full text-sm sm:px-4 md:px-6 lg:px-8">
                      <thead>
                        <tr className="border-b sm:px-4 md:px-6 lg:px-8">
                          <th className="text-left p-2 sm:px-4 md:px-6 lg:px-8">Player</th>
                          <th className="text-center p-2 sm:px-4 md:px-6 lg:px-8">Fantasy Pts</th>
                          <th className="text-center p-2 sm:px-4 md:px-6 lg:px-8">Confidence</th>
                          <th className="text-center p-2 sm:px-4 md:px-6 lg:px-8">Ceiling</th>
                          <th className="text-center p-2 sm:px-4 md:px-6 lg:px-8">Floor</th>
                          <th className="text-center p-2 sm:px-4 md:px-6 lg:px-8">Method</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparison.players.map((player: any) => (
                          <tr key={player.id} className="border-b hover:bg-gray-50 sm:px-4 md:px-6 lg:px-8">
                            <td className="p-2 sm:px-4 md:px-6 lg:px-8">
                              <span className="font-medium sm:px-4 md:px-6 lg:px-8">{player.name}</span>
                            </td>
                            <td className="text-center p-2 font-medium text-blue-600 sm:px-4 md:px-6 lg:px-8">
                              {player.projectedStats.fantasyPoints}
                            </td>
                            <td className="text-center p-2 sm:px-4 md:px-6 lg:px-8">
                              <Badge variant="outline">{player.projectedStats.confidence}%</Badge>
                            </td>
                            <td className="text-center p-2 text-green-600 sm:px-4 md:px-6 lg:px-8">
                              {player.recentPerformance.ceiling.toFixed(1)}
                            </td>
                            <td className="text-center p-2 text-red-600 sm:px-4 md:px-6 lg:px-8">
                              {player.recentPerformance.floor.toFixed(1)}
                            </td>
                            <td className="text-center p-2 sm:px-4 md:px-6 lg:px-8">
                              <Badge variant="default" className="text-xs sm:px-4 md:px-6 lg:px-8">
                                {player.projectedStats.projectionMethod}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Matchups Tab */}
          {activeTab === 'matchups' && (
            <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {comparison.players.map((player: any) => (
                  <Card key={player.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                        {player.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                      {/* Opponent & Difficulty */}
                      <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                        <span className="text-sm text-gray-600 sm:px-4 md:px-6 lg:px-8">vs {player.matchupAnalysis.opponent}</span>
                        <Badge className={getDifficultyColor(player.matchupAnalysis.difficulty)}>
                          {player.matchupAnalysis.difficulty} matchup
                        </Badge>
                      </div>

                      {/* Key Stats */}
                      <div className="grid grid-cols-2 gap-4 text-sm sm:px-4 md:px-6 lg:px-8">
                        <div>
                          <div className="text-gray-600 sm:px-4 md:px-6 lg:px-8">Defensive Rank</div>
                          <div className="font-medium sm:px-4 md:px-6 lg:px-8">#{player.matchupAnalysis.defensiveRank}</div>
                        </div>
                        <div>
                          <div className="text-gray-600 sm:px-4 md:px-6 lg:px-8">Injury Risk</div>
                          <div className="font-medium sm:px-4 md:px-6 lg:px-8">{player.matchupAnalysis?.injuryRisk}%</div>
                        </div>
                        <div>
                          <div className="text-gray-600 sm:px-4 md:px-6 lg:px-8">Weather Impact</div>
                          <div className="font-medium sm:px-4 md:px-6 lg:px-8">{player.matchupAnalysis.weatherImpact.expectedImpact}</div>
                        </div>
                        <div>
                          <div className="text-gray-600 sm:px-4 md:px-6 lg:px-8">Home/Away</div>
                          <div className="font-medium sm:px-4 md:px-6 lg:px-8">
                            {player.matchupAnalysis.homeFieldAdvantage ? 'Home' : 'Away'}
                          </div>
                        </div>
                      </div>

                      {/* Recent Form */}
                      <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                        {getTrendIcon(player.recentPerformance.trend)}
                        <span className="text-sm sm:px-4 md:px-6 lg:px-8">
                          Recent form: {player.recentPerformance.trend}
                        </span>
                        <Badge variant="outline" className="ml-auto sm:px-4 md:px-6 lg:px-8">
                          {player.recentPerformance.consistency}% consistent
                        </Badge>
                      </div>

                      {/* Key Factors */}
                      {player.matchupAnalysis.keyFactors.length > 0 && (
                        <div>
                          <div className="text-sm font-medium mb-2 sm:px-4 md:px-6 lg:px-8">Key Factors:</div>
                          <ul className="space-y-1 sm:px-4 md:px-6 lg:px-8">
                            {player.matchupAnalysis.keyFactors.map((factor: string, index: number) => (
                              <li key={index} className="text-xs text-gray-600 flex items-start gap-1 sm:px-4 md:px-6 lg:px-8">
                                <span className="text-blue-500 mt-0.5 sm:px-4 md:px-6 lg:px-8">•</span>
                                {factor}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
              {/* Fantasy Relevance */}
              <Card>
                <CardHeader>
                  <CardTitle>Fantasy Relevance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto sm:px-4 md:px-6 lg:px-8">
                    <table className="w-full text-sm sm:px-4 md:px-6 lg:px-8">
                      <thead>
                        <tr className="border-b sm:px-4 md:px-6 lg:px-8">
                          <th className="text-left p-2 sm:px-4 md:px-6 lg:px-8">Player</th>
                          <th className="text-center p-2 sm:px-4 md:px-6 lg:px-8">Position Rank</th>
                          <th className="text-center p-2 sm:px-4 md:px-6 lg:px-8">Tier</th>
                          <th className="text-center p-2 sm:px-4 md:px-6 lg:px-8">Rostered %</th>
                          <th className="text-center p-2 sm:px-4 md:px-6 lg:px-8">Snap %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparison.players.map((player: any) => (
                          <tr key={player.id} className="border-b hover:bg-gray-50 sm:px-4 md:px-6 lg:px-8">
                            <td className="p-2 font-medium sm:px-4 md:px-6 lg:px-8">{player.name}</td>
                            <td className="text-center p-2 sm:px-4 md:px-6 lg:px-8">#{player.fantasyRelevance.positionRank}</td>
                            <td className="text-center p-2 sm:px-4 md:px-6 lg:px-8">
                              <Badge variant="outline">Tier {player.fantasyRelevance?.tier}</Badge>
                            </td>
                            <td className="text-center p-2 sm:px-4 md:px-6 lg:px-8">{player.fantasyRelevance.rosteredPercentage}%</td>
                            <td className="text-center p-2 sm:px-4 md:px-6 lg:px-8">
                              {player.fantasyRelevance.snapPercentage ? 
                                `${Math.round(player.fantasyRelevance.snapPercentage * 100)}%` : 
                                '-'

                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Oracle Accuracy */}
              {comparison.players.some((p: any) => p.oracleAccuracy) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Oracle Prediction Accuracy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {comparison.players.filter((p: any) => p.oracleAccuracy).map((player: any) => (
                        <div key={player.id} className="p-4 border rounded-lg sm:px-4 md:px-6 lg:px-8">
                          <div className="font-medium mb-2 sm:px-4 md:px-6 lg:px-8">{player.name.split(' ').pop()}</div>
                          <div className="space-y-2 text-sm sm:px-4 md:px-6 lg:px-8">
                            <div className="flex justify-between sm:px-4 md:px-6 lg:px-8">
                              <span>Accuracy:</span>
                              <span className="font-medium sm:px-4 md:px-6 lg:px-8">
                                {player.oracleAccuracy?.accuracy.toFixed(1)}%
                              </span>
                            </div>
                            <div className="flex justify-between sm:px-4 md:px-6 lg:px-8">
                              <span>Predictions:</span>
                              <span>{player.oracleAccuracy?.totalPredictions}</span>
                            </div>
                            <div className="flex justify-between sm:px-4 md:px-6 lg:px-8">
                              <span>Avg Confidence:</span>
                              <span>{player.oracleAccuracy?.averageConfidence.toFixed(1)}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!comparison && !loading && selectedPlayers.length < 2 && (
        <Card>
          <CardContent className="text-center py-12 sm:px-4 md:px-6 lg:px-8">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4 sm:px-4 md:px-6 lg:px-8" />
            <h3 className="text-lg font-medium text-gray-900 mb-2 sm:px-4 md:px-6 lg:px-8">
              Start Comparing Players
            </h3>
            <p className="text-gray-500 mb-4 sm:px-4 md:px-6 lg:px-8">
              Search and select at least 2 players to see detailed comparisons, projections, and recommendations.
            </p>
            <p className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">
              You can compare up to 4 players at once for comprehensive analysis.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const PlayerComparisonToolWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <PlayerComparisonTool {...props} />
  </ErrorBoundary>
);

export default React.memo(PlayerComparisonToolWithErrorBoundary);
