/**
 * Auto-Draft View
 * Main view for the auto-draft functionality
 */

import React, { useState } from 'react';
import AutoDraftInterface from '../components/draft/AutoDraftInterface';
import { TeamDraftResult } from '../services/autoDraftService';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Trophy, Users, BarChart3, Zap, 
  ChevronRight, Info, Target, Brain 
} from 'lucide-react';

const AutoDraftView: React.FC = () => {
  const navigate = useNavigate();
  const [draftResults, setDraftResults] = useState<TeamDraftResult[] | null>(null);
  const [showIntro, setShowIntro] = useState(true);

  const handleDraftComplete = (results: TeamDraftResult[]) => {
    setDraftResults(results);
    setShowIntro(false);
    
    // Could navigate to team view or show results
    console.log('Draft completed with', results.length, 'teams');
  };

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Strategy',
      description: 'Advanced algorithms analyze player value, scarcity, and team needs',
      color: 'text-blue-500'
    },
    {
      icon: Target,
      title: 'Optimal Team Building',
      description: 'Generates the best possible team based on your strategy preferences',
      color: 'text-green-500'
    },
    {
      icon: Users,
      title: 'Full League Simulation',
      description: 'Simulates all 10 teams with diverse strategies and personalities',
      color: 'text-purple-500'
    },
    {
      icon: BarChart3,
      title: 'Deep Analytics',
      description: 'Comprehensive analysis of strengths, weaknesses, and value picks',
      color: 'text-orange-500'

  ];

  const strategies = [
    { name: 'Balanced', description: 'Mix of RB/WR with value picks', emoji: '⚖️' },
    { name: 'RB Heavy', description: 'Prioritize elite running backs', emoji: '🏃' },
    { name: 'WR Heavy', description: 'Load up on wide receivers', emoji: '🎯' },
    { name: 'Zero RB', description: 'Skip RBs early for WR/TE', emoji: '🚫' },
    { name: 'Hero RB', description: 'One elite RB, then receivers', emoji: '🦸' },
    { name: 'Best Available', description: 'Pure value-based drafting', emoji: '📊' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Zap className="w-6 h-6 text-yellow-500" />
                  Auto-Draft System
                </h1>
                <p className="text-sm text-gray-400">
                  Intelligent drafting powered by advanced analytics
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowIntro(!showIntro)}
                           transition-colors flex items-center gap-2"
              >
                <Info className="w-4 h-4" />
                {showIntro ? 'Hide Intro' : 'Show Intro'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Intro Section */}
      {showIntro && !draftResults && (
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">
                Welcome to the Future of Fantasy Drafting
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Our AI-powered auto-draft system uses advanced algorithms to build 
                optimal teams based on player projections, positional scarcity, 
                and strategic preferences.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {features.map((feature, idx) => (
                <div 
                  key={idx}
                  className="bg-gray-900/50 rounded-lg p-6 border border-gray-700
                             hover:border-gray-600 transition-all"
                >
                  <feature.icon className={`w-8 h-8 ${feature.color} mb-3`} />
                  <h3 className="font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Strategies */}
            <div className="bg-gray-900/50 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Available Draft Strategies
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {strategies.map((strategy, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg
                               hover:bg-gray-700 transition-colors"
                  >
                    <span className="text-2xl">{strategy.emoji}</span>
                    <div>
                      <div className="font-medium">{strategy.name}</div>
                      <div className="text-xs text-gray-400">{strategy.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="text-center mt-8">
              <button
                onClick={() => setShowIntro(false)}
                           hover:from-blue-700 hover:to-purple-700 rounded-lg
                           font-bold text-lg transition-all flex items-center
                           gap-2 mx-auto"
              >
                Get Started
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Interface */}
      <div className={showIntro ? 'hidden' : ''}>
        <AutoDraftInterface>
          onDraftComplete={handleDraftComplete}
          userId={1}
        />
      </div>

      {/* Results Summary */}
      {draftResults && (
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Draft Complete!
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-900/50 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-green-400">
                  {draftResults.length}
                </div>
                <div className="text-gray-400">Teams Drafted</div>
              </div>
              
              <div className="bg-gray-900/50 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-blue-400">
                  {draftResults.reduce((sum, r) => sum + r.roster.length, 0)}
                </div>
                <div className="text-gray-400">Players Selected</div>
              </div>
              
              <div className="bg-gray-900/50 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-purple-400">
                  {Math.round(
                    draftResults.reduce((sum, r) => sum + r.analytics.projectedPoints, 0) / 
                    draftResults.length
                  )}
                </div>
                <div className="text-gray-400">Avg Projected Points</div>
              </div>
            </div>

            <div className="mt-6 flex gap-4 justify-center">
              <button
                onClick={() => navigate('/teams')}
                           font-medium transition-colors"
              >
                View Teams
              </button>
              <button
                onClick={() => window.location.reload()}
                           font-medium transition-colors"
              >
                Run Another Draft
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutoDraftView;