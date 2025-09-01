import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useMemo, useState } from 'react';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BarChart3, TrendingUp, Target, Award, Calendar, Users, Zap } from 'lucide-react';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;


export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({ isOpen, onClose }: any) => {
  // Handle Escape key to close modal
  useEscapeKey(isOpen, onClose);

  const [activeTab, setActiveTab] = useState('performance');
  const [timeRange, setTimeRange] = useState('season');

  const tabs = [
    { id: 'performance', label: 'Performance', icon: <TrendingUp className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" /> },
    { id: 'team', label: 'Team Analysis', icon: <Users className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" /> },
    { id: 'trends', label: 'Trends', icon: <BarChart3 className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" /> },
    { id: 'predictions', label: 'Predictions', icon: <Target className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" /> }
  ];

  const performanceMetrics = [
    {
      label: 'Points Per Game',
      value: 112.4,
      change: +5.2,
      rank: 2,
      color: 'text-green-400',
      bgColor: 'bg-green-400/20'
    },
    {
      label: 'Win Rate',
      value: 72.7,
      change: +8.3,
      rank: 3,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/20'
    },
    {
      label: 'Trade Efficiency',
      value: 8.9,
      change: +1.4,
      rank: 1,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/20'
    },
    {
      label: 'Waiver Success',
      value: 68.5,
      change: -2.1,
      rank: 4,
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/20'
    }
  ];

  const teamComposition = [
    { position: 'QB', players: ['Josh Allen', 'Tua Tagovailoa'], strength: 95, color: 'text-red-400' },
    { position: 'RB', players: ['Christian McCaffrey', 'Josh Jacobs', 'Dameon Pierce'], strength: 88, color: 'text-green-400' },
    { position: 'WR', players: ['Tyreek Hill', 'Stefon Diggs', 'Mike Evans'], strength: 92, color: 'text-blue-400' },
    { position: 'TE', players: ['Travis Kelce'], strength: 98, color: 'text-yellow-400' },
    { position: 'K', players: ['Harrison Butker'], strength: 85, color: 'text-purple-400' },
    { position: 'DST', players: ['Buffalo Bills'], strength: 78, color: 'text-indigo-400' }
  ];

  const trendData = [
    { week: 1, points: 98.5, projection: 95.2, opponent: 108.3 },
    { week: 2, points: 124.8, projection: 102.1, opponent: 89.7 },
    { week: 3, points: 89.2, projection: 98.5, opponent: 125.6 },
    { week: 4, points: 156.4, projection: 105.3, opponent: 94.2 },
    { week: 5, points: 108.7, projection: 112.8, opponent: 116.5 },
    { week: 6, points: 142.3, projection: 118.4, opponent: 102.1 },
    { week: 7, points: 95.8, projection: 108.6, opponent: 134.7 },
    { week: 8, points: 118.9, projection: 115.2, opponent: 87.4 },
    { week: 9, points: 133.6, projection: 122.4, opponent: 98.8 },
    { week: 10, points: 101.4, projection: 109.7, opponent: 121.3 },
    { week: 11, points: 127.5, projection: 114.8, opponent: 105.9 }
  ];

  const predictions = [
    {
      type: 'Playoff Chances',
      value: 85,
      description: 'Strong chance to make playoffs',
      confidence: 92,
      color: 'text-green-400'
    },
    {
      type: 'Championship Odds',
      value: 18,
      description: 'Above average championship potential',
      confidence: 76,
      color: 'text-yellow-400'
    },
    {
      type: 'Next Week Win Prob',
      value: 68,
      description: 'Favorable matchup ahead',
      confidence: 84,
      color: 'text-blue-400'
    },
    {
      type: 'Trade Value Trend',
      value: 95,
      description: 'Team value increasing',
      confidence: 88,
      color: 'text-purple-400'
    }
  ];

  const insights = [
    {
      type: 'strength',
      title: 'Elite TE Position',
      description: 'Travis Kelce gives you a significant advantage at TE',
      impact: 'High',
      color: 'text-green-400'
    },
    {
      type: 'opportunity',
      title: 'RB Depth Concern',
      description: 'Consider adding RB depth for playoff run',
      impact: 'Medium',
      color: 'text-yellow-400'
    },
    {
      type: 'warning',
      title: 'Tough Schedule Ahead',
      description: 'Next 3 weeks feature strong opponents',
      impact: 'Medium',
      color: 'text-orange-400'
    },
    {
      type: 'tip',
      title: 'Waiver Opportunity',
      description: 'Consider picking up emerging WR handcuffs',
      impact: 'Low',
      color: 'text-blue-400'
    }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:px-4 md:px-6 lg:px-8">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm sm:px-4 md:px-6 lg:px-8"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-6xl max-h-[90vh] bg-dark-800/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden sm:px-4 md:px-6 lg:px-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-primary-500/10 to-primary-600/10 sm:px-4 md:px-6 lg:px-8">
            <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
              <div className="w-10 h-10 bg-primary-500/20 rounded-xl flex items-center justify-center sm:px-4 md:px-6 lg:px-8">
                <BarChart3 className="w-5 h-5 text-primary-400 sm:px-4 md:px-6 lg:px-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white sm:px-4 md:px-6 lg:px-8">Analytics Dashboard</h2>
                <p className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">Deep insights into your team performance</p>
              </div>
            </div>
            <div className="flex items-center gap-4 sm:px-4 md:px-6 lg:px-8">
              <select
                value={timeRange}
                onChange={(e: any) => setTimeRange(e.target.value)}
              >
                <option value="season">Full Season</option>
                <option value="recent">Last 4 Weeks</option>
                <option value="month">Last Month</option>
              </select>
              <button
                onClick={onClose}
                className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors sm:px-4 md:px-6 lg:px-8"
               aria-label="Action button">
                <X className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-white/10 bg-dark-900/50 sm:px-4 md:px-6 lg:px-8">
            <div className="flex px-6 gap-1 sm:px-4 md:px-6 lg:px-8">
              {tabs.map((tab: any) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-160px)] custom-scrollbar sm:px-4 md:px-6 lg:px-8">
            <div className="p-6 sm:px-4 md:px-6 lg:px-8">
              {activeTab === 'performance' && (
                <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {performanceMetrics.map((metric, index) => (
                      <motion.div
                        key={metric.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`${metric.bgColor} rounded-xl p-4 border border-white/10`}
                      >
                        <div className="flex items-center justify-between mb-2 sm:px-4 md:px-6 lg:px-8">
                          <h3 className="text-sm font-medium text-gray-300 sm:px-4 md:px-6 lg:px-8">{metric.label}</h3>
                          <div className="text-xs bg-white/10 px-2 py-1 rounded-full text-white sm:px-4 md:px-6 lg:px-8">
                            #{metric.rank}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                          <div className={`text-2xl font-bold ${metric.color}`}>
                            {metric.value}{metric.label.includes('Rate') || metric.label.includes('Success') ? '%' : ''}
                          </div>
                          <div className={`text-sm ${metric.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {metric.change > 0 ? '+' : ''}{metric.change}%
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Insights */}
                  <div className="bg-dark-700/50 rounded-xl p-6 sm:px-4 md:px-6 lg:px-8">
                    <h3 className="text-lg font-semibold text-white mb-4 sm:px-4 md:px-6 lg:px-8">Key Insights</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {insights.map((insight, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 bg-dark-600/50 rounded-lg sm:px-4 md:px-6 lg:px-8">
                          <div className={`w-2 h-2 rounded-full ${insight.color.replace('text-', 'bg-')} mt-2`}></div>
                          <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                            <div className="flex items-center justify-between mb-1 sm:px-4 md:px-6 lg:px-8">
                              <h4 className="font-medium text-white sm:px-4 md:px-6 lg:px-8">{insight.title}</h4>
                              <span className={`text-xs px-2 py-1 rounded-full ${insight.color} bg-current bg-opacity-20`}>
                                {insight.impact}
                              </span>
                            </div>
                            <p className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">{insight.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'team' && (
                <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
                  <div className="bg-dark-700/50 rounded-xl p-6 sm:px-4 md:px-6 lg:px-8">
                    <h3 className="text-lg font-semibold text-white mb-4 sm:px-4 md:px-6 lg:px-8">Positional Strength Analysis</h3>
                    <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                      {teamComposition.map((position, index) => (
                        <div key={position.position} className="flex items-center gap-4 p-4 bg-dark-600/50 rounded-lg sm:px-4 md:px-6 lg:px-8">
                          <div className="w-12 text-center sm:px-4 md:px-6 lg:px-8">
                            <div className={`text-sm font-bold ${position.color}`}>{position.position}</div>
                          </div>
                          <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                            <div className="flex items-center justify-between mb-2 sm:px-4 md:px-6 lg:px-8">
                              <div className="text-white font-medium sm:px-4 md:px-6 lg:px-8">
                                {position.players.join(', ')}
                              </div>
                              <div className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">
                                Strength: <span className={position.color}>{position.strength}</span>
                              </div>
                            </div>
                            <div className="w-full bg-gray-600 rounded-full h-2 sm:px-4 md:px-6 lg:px-8">
                              <div
                                className={`h-2 rounded-full ${position.color.replace('text-', 'bg-')}`}
                                style={{ width: `${position.strength}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'trends' && (
                <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
                  <div className="bg-dark-700/50 rounded-xl p-6 sm:px-4 md:px-6 lg:px-8">
                    <h3 className="text-lg font-semibold text-white mb-4 sm:px-4 md:px-6 lg:px-8">Scoring Trends</h3>
                    <div className="h-64 flex items-end justify-between gap-1 px-4 sm:px-4 md:px-6 lg:px-8">
                      {trendData.map((week, index) => (
                        <div key={week.week} className="flex-1 flex flex-col items-center sm:px-4 md:px-6 lg:px-8">
                          <div className="w-full max-w-8 space-y-1 sm:px-4 md:px-6 lg:px-8">
                            <div
                              className="bg-primary-500 rounded-t sm:px-4 md:px-6 lg:px-8"
                              style={{ height: `${(week.points / 180) * 200}px` }}
                              title={`Week ${week.week}: ${week.points} pts`}
                            ></div>
                            <div
                              className="bg-gray-500 opacity-60 sm:px-4 md:px-6 lg:px-8"
                              style={{ height: `${(week.projection / 180) * 200}px` }}
                              title={`Projection: ${week.projection} pts`}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-400 mt-2 sm:px-4 md:px-6 lg:px-8">W{week.week}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-center gap-6 mt-4 sm:px-4 md:px-6 lg:px-8">
                      <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                        <div className="w-3 h-3 bg-primary-500 rounded sm:px-4 md:px-6 lg:px-8"></div>
                        <span className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">Actual Points</span>
                      </div>
                      <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                        <div className="w-3 h-3 bg-gray-500 rounded sm:px-4 md:px-6 lg:px-8"></div>
                        <span className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">Projected Points</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'predictions' && (
                <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    {predictions.map((prediction, index) => (
                      <motion.div
                        key={prediction.type}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-dark-700/50 rounded-xl p-6 sm:px-4 md:px-6 lg:px-8"
                      >
                        <div className="flex items-center justify-between mb-4 sm:px-4 md:px-6 lg:px-8">
                          <h3 className="text-lg font-semibold text-white sm:px-4 md:px-6 lg:px-8">{prediction.type}</h3>
                          <div className={`text-2xl font-bold ${prediction.color}`}>
                            {prediction.value}%
                          </div>
                        </div>
                        <p className="text-gray-400 mb-4 sm:px-4 md:px-6 lg:px-8">{prediction.description}</p>
                        <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                          <div className="flex items-center justify-between text-sm sm:px-4 md:px-6 lg:px-8">
                            <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Confidence Level</span>
                            <span className="text-white sm:px-4 md:px-6 lg:px-8">{prediction.confidence}%</span>
                          </div>
                          <div className="w-full bg-gray-600 rounded-full h-2 sm:px-4 md:px-6 lg:px-8">
                            <div
                              className="bg-primary-500 h-2 rounded-full sm:px-4 md:px-6 lg:px-8"
                              style={{ width: `${prediction.confidence}%` }}
                            ></div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* AI Recommendations */}
                  <div className="bg-gradient-to-r from-primary-500/10 to-purple-500/10 rounded-xl p-6 border border-primary-500/20 sm:px-4 md:px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-4 sm:px-4 md:px-6 lg:px-8">
                      <Zap className="w-5 h-5 text-primary-400 sm:px-4 md:px-6 lg:px-8" />
                      <h3 className="text-lg font-semibold text-white sm:px-4 md:px-6 lg:px-8">AI Recommendations</h3>
                    </div>
                    <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                      <div className="flex items-start gap-3 sm:px-4 md:px-6 lg:px-8">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 sm:px-4 md:px-6 lg:px-8"></div>
                        <div>
                          <p className="text-white font-medium sm:px-4 md:px-6 lg:px-8">Start Christian McCaffrey with confidence</p>
                          <p className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">85% chance of 15+ points based on matchup analysis</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 sm:px-4 md:px-6 lg:px-8">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 sm:px-4 md:px-6 lg:px-8"></div>
                        <div>
                          <p className="text-white font-medium sm:px-4 md:px-6 lg:px-8">Consider benching WR3 for emerging waiver pickup</p>
                          <p className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">Better matchup and trending upward in targets</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 sm:px-4 md:px-6 lg:px-8">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 sm:px-4 md:px-6 lg:px-8"></div>
                        <div>
                          <p className="text-white font-medium sm:px-4 md:px-6 lg:px-8">Trade deadline opportunity approaching</p>
                          <p className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">Your QB depth could fetch valuable RB help</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const AnalyticsModalWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <AnalyticsModal {...props} />
  </ErrorBoundary>
);

export default React.memo(AnalyticsModalWithErrorBoundary);