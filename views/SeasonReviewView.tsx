/**
 * Season Review View Component
 * Clean rewrite focusing on season summary functionality
 */

import React, { useState, useEffect } from 'react';
import { useAppState } from '../contexts/AppContext';

// Simple interfaces for this view
interface SeasonReviewViewProps {
  className?: string;
}

interface SeasonStats {
  totalGames: number;
  totalPoints: number;
  avgPointsPerGame: number;
  highestScore: number;
  lowestScore: number;
  winPercentage: number;
}

interface SeasonSummary {
  champion: string;
  runnerUp: string;
  regularSeasonChamp: string;
  highestScoringTeam: string;
  mostConsistent: string;
  totalTransactions: number;
}

/**
 * Season Review View - Displays comprehensive season statistics and summary
 */
const SeasonReviewView: React.FC<SeasonReviewViewProps> = ({ className = '' }) => {
  const { dispatch } = useAppState();
  const [isLoading, setIsLoading] = useState(true);
  const [seasonStats, setSeasonStats] = useState<SeasonStats | null>(null);
  const [seasonSummary, setSeasonSummary] = useState<SeasonSummary | null>(null);

  useEffect(() => {
    // Simulate loading season data
    const loadSeasonData = async () => {
      setIsLoading(true);
      
      // Mock data - would normally come from API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSeasonStats({
        totalGames: 156,
        totalPoints: 18425.75,
        avgPointsPerGame: 118.11,
        highestScore: 189.45,
        lowestScore: 67.23,
        winPercentage: 0.583
      });

      setSeasonSummary({
        champion: 'The Dynasty Kings',
        runnerUp: 'Playoff Warriors',
        regularSeasonChamp: 'Consistent Crushers',
        highestScoringTeam: 'Offensive Juggernauts',
        mostConsistent: 'Steady Eddies',
        totalTransactions: 247
      });

      setIsLoading(false);
    };

    loadSeasonData();
  }, []);

  const handleNavigateBack = () => {
    dispatch({ type: 'SET_VIEW', payload: 'DASHBOARD' });
  };

  const handleViewHistory = () => {
    dispatch({ type: 'SET_VIEW', payload: 'LEAGUE_HISTORY' });
  };

  if (isLoading) {
    return (
      <div className={`season-review-view p-6 ${className}`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3">Loading season review...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`season-review-view p-6 ${className}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Season Review</h1>
              <p className="text-gray-600">Complete summary of the 2024 fantasy football season</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleViewHistory}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                View History
              </button>
              <button
                onClick={handleNavigateBack}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Season Champions */}
        {seasonSummary && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Season Champions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg border border-yellow-200">
                <div className="text-center">
                  <div className="text-3xl mb-2">🏆</div>
                  <h3 className="font-semibold text-gray-900">League Champion</h3>
                  <p className="text-lg font-bold text-yellow-700">{seasonSummary.champion}</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-silver-50 to-gray-100 p-6 rounded-lg border border-gray-200">
                <div className="text-center">
                  <div className="text-3xl mb-2">🥈</div>
                  <h3 className="font-semibold text-gray-900">Runner-Up</h3>
                  <p className="text-lg font-bold text-gray-700">{seasonSummary.runnerUp}</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                <div className="text-center">
                  <div className="text-3xl mb-2">👑</div>
                  <h3 className="font-semibold text-gray-900">Regular Season Champ</h3>
                  <p className="text-lg font-bold text-blue-700">{seasonSummary.regularSeasonChamp}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Season Statistics */}
        {seasonStats && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Season Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow border">
                <h3 className="font-semibold text-gray-900 mb-2">Total Games Played</h3>
                <p className="text-3xl font-bold text-blue-600">{seasonStats.totalGames}</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow border">
                <h3 className="font-semibold text-gray-900 mb-2">Total Points Scored</h3>
                <p className="text-3xl font-bold text-green-600">{seasonStats.totalPoints.toFixed(2)}</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow border">
                <h3 className="font-semibold text-gray-900 mb-2">Average Per Game</h3>
                <p className="text-3xl font-bold text-purple-600">{seasonStats.avgPointsPerGame.toFixed(2)}</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow border">
                <h3 className="font-semibold text-gray-900 mb-2">Highest Score</h3>
                <p className="text-3xl font-bold text-red-600">{seasonStats.highestScore}</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow border">
                <h3 className="font-semibold text-gray-900 mb-2">Lowest Score</h3>
                <p className="text-3xl font-bold text-gray-600">{seasonStats.lowestScore}</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow border">
                <h3 className="font-semibold text-gray-900 mb-2">Win Percentage</h3>
                <p className="text-3xl font-bold text-orange-600">{(seasonStats.winPercentage * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Season Awards */}
        {seasonSummary && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Season Awards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow border">
                <h3 className="font-semibold text-gray-900 mb-4">Special Recognition</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Highest Scoring Team:</span>
                    <span className="font-medium">{seasonSummary.highestScoringTeam}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Most Consistent:</span>
                    <span className="font-medium">{seasonSummary.mostConsistent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Transactions:</span>
                    <span className="font-medium">{seasonSummary.totalTransactions}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                <h3 className="font-semibold text-gray-900 mb-4">Season Highlights</h3>
                <div className="space-y-2 text-sm">
                  <p>🎯 Most competitive season in league history</p>
                  <p>📈 Record-breaking scoring performances</p>
                  <p>🔄 Active trade deadline with 47 trades</p>
                  <p>⚡ Closest championship game: 2.3 point margin</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeasonReviewView;
