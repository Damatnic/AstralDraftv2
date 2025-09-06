/**
 * Enhanced Trade Analysis View Component - Phase 3
 * Advanced trade evaluation with AI analysis, fairness metrics, and impact predictions
 */

import React, { useState, useMemo } from 'react';

// Mock context for enhanced trade analysis
const useAppState = () => ({
  dispatch: (_action: { type: string; payload?: string }) => {
    // Mock dispatch function
  }
});

// Enhanced interfaces for advanced trade analysis
interface EnhancedTradeAnalysisProps {
  className?: string;
}

interface TradePlayer {
  id: string;
  name: string;
  position: string;
  team: string;
  currentValue: number;
  projectedValue: number;
  restOfSeasonProjection: number;
  playoffProjection: number;
  injuryRisk: number;
  ageScore: number;
  consistencyScore: number;
  strengthOfSchedule: number;
  weeklyProjections: number[];
}

interface TradeProposal {
  id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'countered';
  proposedBy: string;
  proposedTo: string;
  dateProposed: string;
  teamAPlayers: TradePlayer[];
  teamBPlayers: TradePlayer[];
  aiAnalysis: TradeAnalysis;
  messages: TradeMessage[];
}

interface TradeAnalysis {
  fairnessScore: number; // 0-100, 50 is perfectly fair
  winnerSide: 'A' | 'B' | 'even';
  teamAImpact: {
    overall: number;
    shortTerm: number;
    longTerm: number;
    rosterFit: number;
  };
  teamBImpact: {
    overall: number;
    shortTerm: number;
    longTerm: number;
    rosterFit: number;
  };
  riskFactors: string[];
  recommendations: string[];
  confidenceLevel: number;
}

interface TradeMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
  type: 'message' | 'counteroffer' | 'system';
}

/**
 * Enhanced Trade Analysis View - Advanced trade evaluation and management
 */
const EnhancedTradeAnalysisView: React.FC<EnhancedTradeAnalysisProps> = ({ className = '' }) => {
  const { dispatch } = useAppState();
  const [activeTab, setActiveTab] = useState<'active' | 'create' | 'history' | 'analyzer'>('active');
  const [selectedTrade, setSelectedTrade] = useState<TradeProposal | null>(null);
  const [createTradeStep, setCreateTradeStep] = useState(1);
  const [analyzerPlayers, setAnalyzerPlayers] = useState<{teamA: TradePlayer[], teamB: TradePlayer[]}>({
    teamA: [],
    teamB: []
  });

  // Enhanced trade proposals data
  const tradeProposals: TradeProposal[] = useMemo(() => [
    {
      id: 'trade1',
      status: 'pending',
      proposedBy: 'Dynasty Builders',
      proposedTo: 'Thunder Bolts',
      dateProposed: '2024-12-14',
      teamAPlayers: [
        {
          id: 'kelce1',
          name: 'Travis Kelce',
          position: 'TE',
          team: 'KC',
          currentValue: 85,
          projectedValue: 78,
          restOfSeasonProjection: 52.4,
          playoffProjection: 41.2,
          injuryRisk: 15,
          ageScore: 45,
          consistencyScore: 72,
          strengthOfSchedule: 18,
          weeklyProjections: [13.8, 12.1, 14.6, 11.9]
        }
      ],
      teamBPlayers: [
        {
          id: 'hock1',
          name: 'T.J. Hockenson',
          position: 'TE',
          team: 'MIN',
          currentValue: 68,
          projectedValue: 74,
          restOfSeasonProjection: 48.2,
          playoffProjection: 38.6,
          injuryRisk: 25,
          ageScore: 78,
          consistencyScore: 64,
          strengthOfSchedule: 22,
          weeklyProjections: [12.1, 13.4, 11.8, 12.7]
        },
        {
          id: 'pick1',
          name: '2025 2nd Round Pick',
          position: 'PICK',
          team: 'TB',
          currentValue: 22,
          projectedValue: 25,
          restOfSeasonProjection: 0,
          playoffProjection: 0,
          injuryRisk: 0,
          ageScore: 100,
          consistencyScore: 0,
          strengthOfSchedule: 0,
          weeklyProjections: [0, 0, 0, 0]
        }
      ],
      aiAnalysis: {
        fairnessScore: 58,
        winnerSide: 'B',
        teamAImpact: {
          overall: -12,
          shortTerm: -8,
          longTerm: 15,
          rosterFit: 78
        },
        teamBImpact: {
          overall: 8,
          shortTerm: 12,
          longTerm: -5,
          rosterFit: 82
        },
        riskFactors: [
          'Kelce age concerns for dynasty',
          'Hockenson injury history',
          'Pick value uncertainty'
        ],
        recommendations: [
          'Good dynasty move for Team A',
          'Team B gets win-now upgrade',
          'Consider adding small piece for balance'
        ],
        confidenceLevel: 76
      },
      messages: [
        {
          id: 'msg1',
          sender: 'Thunder Bolts',
          message: 'Interested but think you need to add a little more',
          timestamp: '2024-12-14T10:30:00Z',
          type: 'message'
        }
      ]
    },
    {
      id: 'trade2',
      status: 'pending',
      proposedBy: 'Thunder Bolts',
      proposedTo: 'Dynasty Builders',
      dateProposed: '2024-12-13',
      teamAPlayers: [
        {
          id: 'adams1',
          name: 'Davante Adams',
          position: 'WR',
          team: 'LV',
          currentValue: 82,
          projectedValue: 75,
          restOfSeasonProjection: 55.2,
          playoffProjection: 44.8,
          injuryRisk: 22,
          ageScore: 52,
          consistencyScore: 81,
          strengthOfSchedule: 16,
          weeklyProjections: [18.4, 16.2, 19.1, 17.3]
        }
      ],
      teamBPlayers: [
        {
          id: 'smith1',
          name: 'DeVonta Smith',
          position: 'WR',
          team: 'PHI',
          currentValue: 78,
          projectedValue: 85,
          restOfSeasonProjection: 52.6,
          playoffProjection: 42.4,
          injuryRisk: 18,
          ageScore: 88,
          consistencyScore: 74,
          strengthOfSchedule: 12,
          weeklyProjections: [16.8, 18.2, 15.9, 17.6]
        }
      ],
      aiAnalysis: {
        fairnessScore: 48,
        winnerSide: 'A',
        teamAImpact: {
          overall: 15,
          shortTerm: 8,
          longTerm: 28,
          rosterFit: 85
        },
        teamBImpact: {
          overall: -6,
          shortTerm: 2,
          longTerm: -18,
          rosterFit: 79
        },
        riskFactors: [
          'Adams age and target concerns',
          'Smith injury proneness',
          'Raiders offensive instability'
        ],
        recommendations: [
          'Great dynasty value for Team A',
          'Team B should ask for additional compensation',
          'Monitor Adams health status'
        ],
        confidenceLevel: 82
      },
      messages: []
    }
  ], []);

  // Available players for trade creation
  const availablePlayers: TradePlayer[] = useMemo(() => [
    {
      id: 'allen1',
      name: 'Josh Allen',
      position: 'QB',
      team: 'BUF',
      currentValue: 95,
      projectedValue: 92,
      restOfSeasonProjection: 78.6,
      playoffProjection: 81.2,
      injuryRisk: 12,
      ageScore: 75,
      consistencyScore: 88,
      strengthOfSchedule: 8,
      weeklyProjections: [26.2, 24.8, 27.1, 25.9]
    },
    {
      id: 'mccaffrey1',
      name: 'Christian McCaffrey',
      position: 'RB',
      team: 'SF',
      currentValue: 92,
      projectedValue: 88,
      restOfSeasonProjection: 72.3,
      playoffProjection: 70.8,
      injuryRisk: 35,
      ageScore: 65,
      consistencyScore: 78,
      strengthOfSchedule: 14,
      weeklyProjections: [24.1, 22.8, 25.3, 23.6]
    }
  ], []);

  const handleTradeSelect = (trade: TradeProposal) => {
    setSelectedTrade(trade);
  };

  const getImpactColor = (impact: number) => {
    if (impact > 10) return 'text-green-400';
    if (impact > 0) return 'text-green-300';
    if (impact > -10) return 'text-yellow-400';
    if (impact > -20) return 'text-orange-400';
    return 'text-red-400';
  };

  const getFairnessColor = (score: number) => {
    const distance = Math.abs(score - 50);
    if (distance <= 5) return 'text-green-400';
    if (distance <= 10) return 'text-yellow-400';
    if (distance <= 20) return 'text-orange-400';
    return 'text-red-400';
  };

  const generateTradeAnalysis = (teamA: TradePlayer[], teamB: TradePlayer[]) => {
    const teamAValue = teamA.reduce((sum, p) => sum + p.currentValue, 0);
    const teamBValue = teamB.reduce((sum, p) => sum + p.currentValue, 0);
    const valueDiff = teamAValue - teamBValue;
    const fairnessScore = Math.max(0, Math.min(100, 50 - (valueDiff / Math.max(teamAValue, teamBValue)) * 100));
    
    return {
      fairnessScore: Math.round(fairnessScore),
      teamAValue,
      teamBValue,
      valueDiff,
      winner: valueDiff > 10 ? 'A' : valueDiff < -10 ? 'B' : 'even'
    };
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
            Trade Command Center
          </h1>
          <p className="text-gray-400 mt-2">
            AI-powered trade analysis with fairness metrics and impact predictions
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'DASHBOARD' })}
            className="bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 hover:bg-gray-600/50 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Enhanced Navigation Tabs */}
      <div className="flex gap-1 bg-gray-800/50 p-1 rounded-lg overflow-x-auto">
        {[
          { key: 'active', label: 'Active Trades', icon: '🔄', count: tradeProposals.filter(t => t.status === 'pending').length },
          { key: 'create', label: 'Create Trade', icon: '➕' },
          { key: 'analyzer', label: 'Trade Analyzer', icon: '🤖' },
          { key: 'history', label: 'Trade History', icon: '📚' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as 'active' | 'create' | 'history' | 'analyzer')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
            {tab.count && tab.count > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'active' && (
        <div className="space-y-4">
          {tradeProposals.filter(t => t.status === 'pending').length === 0 ? (
            <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-8 text-center">
              <h3 className="text-xl font-semibold mb-2">No Active Trades</h3>
              <p className="text-gray-400 mb-4">You don&apos;t have any pending trade proposals.</p>
              <button
                onClick={() => setActiveTab('create')}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Create New Trade
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {tradeProposals.filter(t => t.status === 'pending').map(trade => (
                <TradeProposalCard
                  key={trade.id}
                  trade={trade}
                  onSelect={() => handleTradeSelect(trade)}
                  getFairnessColor={getFairnessColor}
                  getImpactColor={getImpactColor}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'create' && (
        <TradeCreatorView
          step={createTradeStep}
          setStep={setCreateTradeStep}
          availablePlayers={availablePlayers}
          generateAnalysis={generateTradeAnalysis}
        />
      )}

      {activeTab === 'analyzer' && (
        <TradeAnalyzerView
          players={analyzerPlayers}
          setPlayers={setAnalyzerPlayers}
          availablePlayers={availablePlayers}
          generateAnalysis={generateTradeAnalysis}
          getImpactColor={getImpactColor}
          getFairnessColor={getFairnessColor}
        />
      )}

      {activeTab === 'history' && (
        <TradeHistoryView />
      )}

      {/* Trade Detail Modal */}
      {selectedTrade && (
        <TradeDetailModal 
          trade={selectedTrade} 
          onClose={() => setSelectedTrade(null)}
          getFairnessColor={getFairnessColor}
          getImpactColor={getImpactColor}
        />
      )}
    </div>
  );
};

// Trade Proposal Card Component
interface TradeProposalCardProps {
  trade: TradeProposal;
  onSelect: () => void;
  getFairnessColor: (score: number) => string;
  getImpactColor: (impact: number) => string;
}

const TradeProposalCard: React.FC<TradeProposalCardProps> = ({ 
  trade, 
  onSelect, 
  getFairnessColor, 
  getImpactColor 
}) => {
  const isProposed = trade.proposedBy === 'Dynasty Builders';
  
  return (
    <div 
      className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:border-orange-500/30 transition-all cursor-pointer"
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold">
              {isProposed ? `To: ${trade.proposedTo}` : `From: ${trade.proposedBy}`}
            </h3>
            <span className={`text-xs px-2 py-1 rounded ${
              isProposed ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
            }`}>
              {isProposed ? 'SENT' : 'RECEIVED'}
            </span>
          </div>
          <div className="text-sm text-gray-400">
            Proposed {new Date(trade.dateProposed).toLocaleDateString()}
          </div>
        </div>
        
        <div className="text-right">
          <div className={`text-xl font-bold ${getFairnessColor(trade.aiAnalysis.fairnessScore)}`}>
            {trade.aiAnalysis.fairnessScore}%
          </div>
          <div className="text-xs text-gray-400">Fairness</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div>
          <div className="text-sm font-medium text-gray-400 mb-2">
            {isProposed ? 'You Give' : 'You Get'}
          </div>
          <div className="space-y-1">
            {(isProposed ? trade.teamAPlayers : trade.teamBPlayers).map(player => (
              <div key={player.id} className="flex items-center justify-between text-sm">
                <span>{player.name}</span>
                <span className="text-gray-400">{player.position}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <div className="text-sm font-medium text-gray-400 mb-2">
            {isProposed ? 'You Get' : 'You Give'}
          </div>
          <div className="space-y-1">
            {(isProposed ? trade.teamBPlayers : trade.teamAPlayers).map(player => (
              <div key={player.id} className="flex items-center justify-between text-sm">
                <span>{player.name}</span>
                <span className="text-gray-400">{player.position}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm">
          <div>
            <span className="text-gray-400">Your Impact: </span>
            <span className={getImpactColor(isProposed ? trade.aiAnalysis.teamAImpact.overall : trade.aiAnalysis.teamBImpact.overall)}>
              {isProposed ? trade.aiAnalysis.teamAImpact.overall : trade.aiAnalysis.teamBImpact.overall > 0 ? '+' : ''}
              {isProposed ? trade.aiAnalysis.teamAImpact.overall : trade.aiAnalysis.teamBImpact.overall}%
            </span>
          </div>
          <div>
            <span className="text-gray-400">AI Confidence: </span>
            <span className="text-blue-400">{trade.aiAnalysis.confidenceLevel}%</span>
          </div>
        </div>
        
        {trade.messages.length > 0 && (
          <div className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded">
            {trade.messages.length} message{trade.messages.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
};

// Additional View Components
const TradeCreatorView: React.FC<{
  step: number;
  setStep: (step: number) => void;
  availablePlayers: TradePlayer[];
  generateAnalysis: (teamA: TradePlayer[], teamB: TradePlayer[]) => { fairnessScore: number; teamAValue: number; teamBValue: number; valueDiff: number; winner: string };
}> = ({ step }) => (
  <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center">
    <h3 className="text-xl font-semibold mb-4">Trade Creator</h3>
    <p className="text-gray-400 mb-6">
      Step-by-step trade creation with live AI analysis coming soon!
    </p>
    <div className="text-sm text-gray-500">
      Current Step: {step} of 4
    </div>
  </div>
);

const TradeAnalyzerView: React.FC<{
  players: {teamA: TradePlayer[], teamB: TradePlayer[]};
  setPlayers: (players: {teamA: TradePlayer[], teamB: TradePlayer[]}) => void;
  availablePlayers: TradePlayer[];
  generateAnalysis: (teamA: TradePlayer[], teamB: TradePlayer[]) => { fairnessScore: number; teamAValue: number; teamBValue: number; valueDiff: number; winner: string };
  getImpactColor: (impact: number) => string;
  getFairnessColor: (score: number) => string;
}> = () => (
  <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center">
    <h3 className="text-xl font-semibold mb-4">Trade Analyzer</h3>
    <p className="text-gray-400 mb-6">
      Compare any players to get instant AI-powered trade analysis and fairness metrics.
    </p>
    <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors">
      Start Analysis
    </button>
  </div>
);

const TradeHistoryView: React.FC = () => (
  <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center">
    <h3 className="text-xl font-semibold mb-4">Trade History</h3>
    <p className="text-gray-400 mb-6">
      View your complete trade history with performance tracking and results analysis.
    </p>
    <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors">
      View History
    </button>
  </div>
);

// Trade Detail Modal Component
interface TradeDetailModalProps {
  trade: TradeProposal;
  onClose: () => void;
  getFairnessColor: (score: number) => string;
  getImpactColor: (impact: number) => string;
}

const TradeDetailModal: React.FC<TradeDetailModalProps> = ({ 
  trade, 
  onClose, 
  getFairnessColor, 
  getImpactColor 
}) => {
  const isProposed = trade.proposedBy === 'Dynasty Builders';
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-white/20 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-bold">
              Trade with {isProposed ? trade.proposedTo : trade.proposedBy}
            </h2>
            <div className="text-gray-400">
              Proposed {new Date(trade.dateProposed).toLocaleDateString()}
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* AI Analysis Summary */}
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">AI Analysis Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className={`text-2xl font-bold ${getFairnessColor(trade.aiAnalysis.fairnessScore)}`}>
                  {trade.aiAnalysis.fairnessScore}%
                </div>
                <div className="text-sm text-gray-400">Fairness</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {trade.aiAnalysis.confidenceLevel}%
                </div>
                <div className="text-sm text-gray-400">Confidence</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getImpactColor(
                  isProposed ? trade.aiAnalysis.teamAImpact.overall : trade.aiAnalysis.teamBImpact.overall
                )}`}>
                  {isProposed ? trade.aiAnalysis.teamAImpact.overall : trade.aiAnalysis.teamBImpact.overall > 0 ? '+' : ''}
                  {isProposed ? trade.aiAnalysis.teamAImpact.overall : trade.aiAnalysis.teamBImpact.overall}%
                </div>
                <div className="text-sm text-gray-400">Your Impact</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${
                  trade.aiAnalysis.winnerSide === 'even' ? 'text-gray-400' :
                  (isProposed && trade.aiAnalysis.winnerSide === 'A') || (!isProposed && trade.aiAnalysis.winnerSide === 'B') ? 'text-green-400' :
                  'text-red-400'
                }`}>
                  {trade.aiAnalysis.winnerSide === 'even' ? 'EVEN' :
                   (isProposed && trade.aiAnalysis.winnerSide === 'A') || (!isProposed && trade.aiAnalysis.winnerSide === 'B') ? 'WIN' : 'LOSE'}
                </div>
                <div className="text-sm text-gray-400">Prediction</div>
              </div>
            </div>
          </div>

          {/* Trade Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">
                {isProposed ? 'You Give' : 'You Get'}
              </h4>
              <div className="space-y-3">
                {(isProposed ? trade.teamAPlayers : trade.teamBPlayers).map(player => (
                  <div key={player.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{player.name}</div>
                      <div className="text-sm text-gray-400">{player.position} - {player.team}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{player.currentValue}</div>
                      <div className="text-xs text-gray-400">Value</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">
                {isProposed ? 'You Get' : 'You Give'}
              </h4>
              <div className="space-y-3">
                {(isProposed ? trade.teamBPlayers : trade.teamAPlayers).map(player => (
                  <div key={player.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{player.name}</div>
                      <div className="text-sm text-gray-400">{player.position} - {player.team}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{player.currentValue}</div>
                      <div className="text-xs text-gray-400">Value</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">AI Recommendations</h4>
            <div className="space-y-2">
              {trade.aiAnalysis.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-blue-400 text-sm">💡</span>
                  <span className="text-sm text-gray-300">{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors">
              Accept Trade
            </button>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg transition-colors">
              Counter Offer
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors">
              Reject Trade
            </button>
            <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors">
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedTradeAnalysisView;
