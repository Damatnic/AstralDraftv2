/**
 * Seasonal Trends Visualization Component
 * Displays comprehensive seasonal performance analysis with charts and insights
 */

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useMemo, useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Tabs } from '../ui/Tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  BarChart3, 
  Target,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import {
  SeasonalTrendData,
  SeasonalPattern,
  seasonalTrendsAnalysisService
} from '../../services/seasonalTrendsAnalysisService';

interface SeasonalTrendsChartProps {
  playerId: string;
  playerName: string;
  className?: string;

}

interface ChartDataPoint {
  period: string;
  averagePoints: number;
  consistency: number;
  ceiling: number;
  floor: number;
  gamesPlayed: number;
  color: string;

// Custom tooltip component moved outside
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    const data = payload[0].payload as ChartDataPoint;
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg sm:px-4 md:px-6 lg:px-8">
        <p className="font-medium sm:px-4 md:px-6 lg:px-8">{label}</p>
        <p className="text-lg font-bold text-blue-600 sm:px-4 md:px-6 lg:px-8">{data.averagePoints.toFixed(1)} avg pts</p>
        <p className="text-sm sm:px-4 md:px-6 lg:px-8">Consistency: {data.consistency.toFixed(1)}%</p>
        <p className="text-sm sm:px-4 md:px-6 lg:px-8">Ceiling: {data.ceiling.toFixed(1)}</p>
        <p className="text-sm sm:px-4 md:px-6 lg:px-8">Floor: {data.floor.toFixed(1)}</p>
        <p className="text-sm sm:px-4 md:px-6 lg:px-8">Games: {data.gamesPlayed}</p>
      </div>
    );

  return null;
};

const SeasonalTrendsChart: React.FC<SeasonalTrendsChartProps> = ({
  playerId,
  playerName,
  className = ''
}: any) => {
  const [seasonalData, setSeasonalData] = useState<SeasonalTrendData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadSeasonalData();
  }, [playerId]);

  const loadSeasonalData = async () => {
    try {

      setLoading(true);
      setError(null);

      const data = await seasonalTrendsAnalysisService.generateSeasonalTrends(playerId, [2023, 2024]);
      setSeasonalData(data);
    
    } catch (error) {
      setError('Failed to load seasonal trends data');
    } finally {
      setLoading(false);

  };

  const prepareOverviewData = (): ChartDataPoint[] => {
    if (!seasonalData) return [];

    const periods = [
      { key: 'earlySeason', label: 'Early Season', data: seasonalData.trends.earlySeason, color: '#3b82f6' },
      { key: 'midSeason', label: 'Mid Season', data: seasonalData.trends.midSeason, color: '#f59e0b' },
      { key: 'lateSeason', label: 'Late Season', data: seasonalData.trends.lateSeason, color: '#10b981' },
      { key: 'playoffs', label: 'Playoffs', data: seasonalData.trends.playoffs, color: '#8b5cf6' }
    ];

    return periods
      .filter((period: any) => period.data.gamesPlayed > 0)
      .map((period: any) => ({
        period: period.label,
        averagePoints: period.data.averageFantasyPoints,
        consistency: period.data.consistencyScore,
        ceiling: period.data.ceiling,
        floor: period.data.floor,
        gamesPlayed: period.data.gamesPlayed,
        color: period.color
      }));
  };

  const getPatternIcon = (type: SeasonalPattern['type']) => {
    switch (type) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-600 sm:px-4 md:px-6 lg:px-8" />;
      case 'declining': return <TrendingDown className="h-4 w-4 text-red-600 sm:px-4 md:px-6 lg:px-8" />;
      case 'consistent': return <CheckCircle className="h-4 w-4 text-blue-600 sm:px-4 md:px-6 lg:px-8" />;
      case 'volatile': return <AlertTriangle className="h-4 w-4 text-yellow-600 sm:px-4 md:px-6 lg:px-8" />;
      case 'injury_prone': return <AlertTriangle className="h-4 w-4 text-red-600 sm:px-4 md:px-6 lg:px-8" />;
      default: return <Activity className="h-4 w-4 sm:px-4 md:px-6 lg:px-8" />;

  };

  const getPatternSeverityColor = (severity: SeasonalPattern['severity']) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'moderate': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';

  };

  const getAnalysisBadgeVariant = (trend: string) => {
    switch (trend) {
      case 'positive': return 'default';
      case 'negative': return 'destructive';
      default: return 'secondary';

  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
            <Clock className="h-5 w-5 animate-pulse sm:px-4 md:px-6 lg:px-8" />
            Loading Seasonal Trends...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center sm:px-4 md:px-6 lg:px-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 sm:px-4 md:px-6 lg:px-8"></div>
          </div>
        </CardContent>
      </Card>
    );

  if (error || !seasonalData) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-red-600 sm:px-4 md:px-6 lg:px-8">Error Loading Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 sm:px-4 md:px-6 lg:px-8">{error || 'No seasonal data available'}</p>
        </CardContent>
      </Card>
    );

  const overviewData = prepareOverviewData();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4 sm:px-4 md:px-6 lg:px-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 sm:px-4 md:px-6 lg:px-8"></div>
        <span className="ml-2 sm:px-4 md:px-6 lg:px-8">Loading...</span>
      </div>
    );

  return (
    <div className={`seasonal-trends-chart ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
            <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
              <Calendar className="h-5 w-5 sm:px-4 md:px-6 lg:px-8" />
              Seasonal Performance Analysis - {playerName}
            </div>
            <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
              {seasonalData.analysis.overallTrend === 'positive' && <TrendingUp className="h-5 w-5 text-green-600 sm:px-4 md:px-6 lg:px-8" />}
              {seasonalData.analysis.overallTrend === 'negative' && <TrendingDown className="h-5 w-5 text-red-600 sm:px-4 md:px-6 lg:px-8" />}
              {seasonalData.analysis.overallTrend === 'stable' && <Activity className="h-5 w-5 text-blue-600 sm:px-4 md:px-6 lg:px-8" />}
              <Badge variant={getAnalysisBadgeVariant(seasonalData.analysis.overallTrend)}>
                {seasonalData.analysis.overallTrend} trend
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            items={[
              { id: 'overview', label: 'Overview' },
              { id: 'patterns', label: 'Patterns' },
              { id: 'analysis', label: 'Analysis' }
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div className="mt-6 sm:px-4 md:px-6 lg:px-8">
            {activeTab === 'overview' && (
              <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
                <div className="h-96 sm:px-4 md:px-6 lg:px-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={overviewData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="averagePoints" name="Average Fantasy Points">
                        {overviewData.map((entry: any) => (
                          <Cell key={`cell-${entry.period}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { period: 'Early Season', data: seasonalData.trends.earlySeason, weeks: '1-6' },
                    { period: 'Mid Season', data: seasonalData.trends.midSeason, weeks: '7-12' },
                    { period: 'Late Season', data: seasonalData.trends.lateSeason, weeks: '13-18' },
                    { period: 'Playoffs', data: seasonalData.trends.playoffs, weeks: '19-22' }
                  ].map(({ period, data, weeks }: any) => (
                    <Card key={period}>
                      <CardHeader className="pb-2 sm:px-4 md:px-6 lg:px-8">
                        <CardTitle className="text-sm sm:px-4 md:px-6 lg:px-8">{period}</CardTitle>
                        <p className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">Weeks {weeks}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm sm:px-4 md:px-6 lg:px-8">
                          <div className="flex justify-between sm:px-4 md:px-6 lg:px-8">
                            <span>Avg Points:</span>
                            <span className="font-medium sm:px-4 md:px-6 lg:px-8">{data.averageFantasyPoints.toFixed(1)}</span>
                          </div>
                          <div className="flex justify-between sm:px-4 md:px-6 lg:px-8">
                            <span>Games:</span>
                            <span className="font-medium sm:px-4 md:px-6 lg:px-8">{data.gamesPlayed}</span>
                          </div>
                          <div className="flex justify-between sm:px-4 md:px-6 lg:px-8">
                            <span>Consistency:</span>
                            <span className="font-medium sm:px-4 md:px-6 lg:px-8">{data.consistencyScore.toFixed(0)}%</span>
                          </div>
                          <div className="flex justify-between sm:px-4 md:px-6 lg:px-8">
                            <span>Range:</span>
                            <span className="font-medium text-xs sm:px-4 md:px-6 lg:px-8">{data.floor.toFixed(1)} - {data.ceiling.toFixed(1)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'patterns' && (
              <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
                <div className="h-80 sm:px-4 md:px-6 lg:px-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={overviewData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="averagePoints" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        name="Average Points"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="consistency" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Consistency %"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                  <h3 className="text-lg font-semibold sm:px-4 md:px-6 lg:px-8">Detected Patterns</h3>
                  {seasonalData.patterns.length === 0 ? (
                    <p className="text-gray-500 sm:px-4 md:px-6 lg:px-8">No significant patterns detected</p>
                  ) : (
                    <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                      {seasonalData.patterns.map((pattern: any) => (
                        <Card key={`${pattern.type}-${pattern.confidence}`}>
                          <CardContent className="pt-4 sm:px-4 md:px-6 lg:px-8">
                            <div className="flex items-start gap-3 sm:px-4 md:px-6 lg:px-8">
                              {getPatternIcon(pattern.type)}
                              <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                                <div className="flex items-center justify-between mb-2 sm:px-4 md:px-6 lg:px-8">
                                  <h4 className="font-medium capitalize sm:px-4 md:px-6 lg:px-8">{pattern.type.replace('_', ' ')}</h4>
                                  <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                                    <Badge variant={getPatternSeverityColor(pattern.severity)}>
                                      {pattern.severity}
                                    </Badge>
                                    <span className="text-sm text-gray-500 sm:px-4 md:px-6 lg:px-8">
                                      {(pattern.confidence * 100).toFixed(0)}% confidence
                                    </span>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-700 mb-2 sm:px-4 md:px-6 lg:px-8">{pattern.description}</p>
                                <p className="text-xs text-blue-600 font-medium sm:px-4 md:px-6 lg:px-8">{pattern.fantasyImpact}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'analysis' && (
              <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                        <Target className="h-5 w-5 sm:px-4 md:px-6 lg:px-8" />
                        Performance Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                      <div className="flex justify-between sm:px-4 md:px-6 lg:px-8">
                        <span>Best Period:</span>
                        <span className="font-medium capitalize sm:px-4 md:px-6 lg:px-8">{seasonalData.analysis.bestPeriod.replace(/([A-Z])/g, ' $1').trim()}</span>
                      </div>
                      <div className="flex justify-between sm:px-4 md:px-6 lg:px-8">
                        <span>Worst Period:</span>
                        <span className="font-medium capitalize sm:px-4 md:px-6 lg:px-8">{seasonalData.analysis.worstPeriod.replace(/([A-Z])/g, ' $1').trim()}</span>
                      </div>
                      <div className="flex justify-between sm:px-4 md:px-6 lg:px-8">
                        <span>Volatility:</span>
                        <span className="font-medium sm:px-4 md:px-6 lg:px-8">{(seasonalData.analysis.volatility * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between sm:px-4 md:px-6 lg:px-8">
                        <span>Overall Trend:</span>
                        <Badge variant={getAnalysisBadgeVariant(seasonalData.analysis.overallTrend)}>
                          {seasonalData.analysis.overallTrend}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                        <BarChart3 className="h-5 w-5 sm:px-4 md:px-6 lg:px-8" />
                        Volatility Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-40 sm:px-4 md:px-6 lg:px-8">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={overviewData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="period" />
                            <YAxis />
                            <Tooltip />
                            <Area 
                              type="monotone" 
                              dataKey="ceiling" 
                              stackId="1"
                              stroke="#10b981" 
                              fill="#10b981" 
                              fillOpacity={0.3}
                              name="Ceiling"
                            />
                            <Area 
                              type="monotone" 
                              dataKey="floor" 
                              stackId="2"
                              stroke="#dc2626" 
                              fill="#dc2626" 
                              fillOpacity={0.3}
                              name="Floor"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                      {seasonalData.analysis.recommendations.map((rec: any) => (
                        <li key={rec} className="flex items-start gap-2 sm:px-4 md:px-6 lg:px-8">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0 sm:px-4 md:px-6 lg:px-8" />
                          <span className="text-sm sm:px-4 md:px-6 lg:px-8">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const SeasonalTrendsChartWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <SeasonalTrendsChart {...props} />
  </ErrorBoundary>
);

export default React.memo(SeasonalTrendsChartWithErrorBoundary);
