/**
 * Live Scoring System
 * Real-time scoring updates and player performance tracking
 */

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '../../contexts/AppContext';

interface PlayerScore {
  playerId: string;
  playerName: string;
  position: string;
  team: string;
  points: number;
  projectedPoints: number;
  isPlaying: boolean;
  gameStatus: 'not_started' | 'in_progress' | 'final';
  stats: {
    passingYards?: number;
    passingTDs?: number;
    rushingYards?: number;
    rushingTDs?: number;
    receivingYards?: number;
    receivingTDs?: number;
    receptions?: number;
    fieldGoals?: number;
    extraPoints?: number;
    defensiveTDs?: number;
    interceptions?: number;
    fumbleRecoveries?: number;
    sacks?: number;
    safeties?: number;
    pointsAllowed?: number;
  };
}

interface TeamScore {
  teamId: string;
  teamName: string;
  totalPoints: number;
  projectedPoints: number;
  playerScores: PlayerScore[];

}

interface LiveScoringProps {
  matchupId?: string;
  teamId?: string;
  showProjections?: boolean;
}

const LiveScoring: React.FC<LiveScoringProps> = ({ 
  matchupId, 
  teamId, 
  showProjections = true 
}) => {
  const { state } = useAppState();
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [selectedView, setSelectedView] = useState<'summary' | 'detailed'>('summary');

  const league = state.leagues[0];

  // Simulate live scoring data
  const liveScores = useMemo((): TeamScore[] => {
    if (!league?.teams) return [];

    return league.teams.map((team: any) => {
      // Get starting lineup (simulate 9 starters)
      const startingLineup = [
        { position: 'QB', name: 'Josh Allen', team: 'BUF' },
        { position: 'RB', name: 'Christian McCaffrey', team: 'SF' },
        { position: 'RB', name: 'Austin Ekeler', team: 'LAC' },
        { position: 'WR', name: 'Cooper Kupp', team: 'LAR' },
        { position: 'WR', name: 'Davante Adams', team: 'LV' },
        { position: 'TE', name: 'Travis Kelce', team: 'KC' },
        { position: 'FLEX', name: 'Tyreek Hill', team: 'MIA' },
        { position: 'K', name: 'Justin Tucker', team: 'BAL' },
        { position: 'DEF', name: 'San Francisco', team: 'SF' }
      ];

      const playerScores: PlayerScore[] = startingLineup.map((player, index) => {
        const basePoints = Math.random() * 25; // 0-25 base points
        const projectedPoints = Math.random() * 20 + 10; // 10-30 projected
        const isPlaying = Math.random() > 0.1; // 90% chance playing
        
        // Generate realistic stats based on position
        let stats: any = {};
        let actualPoints = 0;

        switch (player.position) {
          case 'QB':
            stats = {
              passingYards: Math.floor(Math.random() * 200) + 150,
              passingTouchdowns: Math.floor(Math.random() * 3) + 1,
              rushingYards: Math.floor(Math.random() * 50),
              rushingTouchdowns: Math.random() > 0.7 ? 1 : 0
            };
            actualPoints = (stats.passingYards * 0.04) + (stats.passingTDs * 4) + 
                          (stats.rushingYards * 0.1) + (stats.rushingTDs * 6);
            break;
            
          case 'RB':
            stats = {
              rushingYards: Math.floor(Math.random() * 100) + 30,
              rushingTouchdowns: Math.random() > 0.6 ? 1 : 0,
              receivingYards: Math.floor(Math.random() * 50),
              receptions: Math.floor(Math.random() * 5) + 1,
              receivingTouchdowns: Math.random() > 0.8 ? 1 : 0
            };
            actualPoints = (stats.rushingYards * 0.1) + (stats.rushingTDs * 6) +
                          (stats.receivingYards * 0.1) + (stats.receptions * 1) + (stats.receivingTDs * 6);
            break;
            
          case 'WR':
          case 'FLEX':
            stats = {
              receivingYards: Math.floor(Math.random() * 80) + 20,
              receptions: Math.floor(Math.random() * 8) + 2,
              receivingTouchdowns: Math.random() > 0.7 ? 1 : 0,
              rushingYards: Math.random() > 0.9 ? Math.floor(Math.random() * 20) : 0
            };
            actualPoints = (stats.receivingYards * 0.1) + (stats.receptions * 1) + 
                          (stats.receivingTDs * 6) + (stats.rushingYards * 0.1);
            break;
            
          case 'TE':
            stats = {
              receivingYards: Math.floor(Math.random() * 60) + 15,
              receptions: Math.floor(Math.random() * 6) + 1,
              receivingTouchdowns: Math.random() > 0.8 ? 1 : 0
            };
            actualPoints = (stats.receivingYards * 0.1) + (stats.receptions * 1) + (stats.receivingTDs * 6);
            break;
            
          case 'K':
            stats = {
              fieldGoals: Math.floor(Math.random() * 3) + 1,
              extraPoints: Math.floor(Math.random() * 4) + 1
            };
            actualPoints = (stats.fieldGoals * 3) + (stats.extraPoints * 1);
            break;
            
          case 'DEF':
            stats = {
              defensiveTDs: Math.random() > 0.9 ? 1 : 0,
              interceptions: Math.floor(Math.random() * 2),
              fumbleRecoveries: Math.floor(Math.random() * 2),
              sacks: Math.floor(Math.random() * 4) + 1,
              safeties: Math.random() > 0.95 ? 1 : 0,
              pointsAllowed: Math.floor(Math.random() * 21) + 7
            };
            actualPoints = (stats.defensiveTDs * 6) + (stats.interceptions * 2) + 
                          (stats.fumbleRecoveries * 2) + (stats.sacks * 1) + (stats.safeties * 2) +
                          (stats.pointsAllowed <= 6 ? 10 : stats.pointsAllowed <= 13 ? 7 : 
                           stats.pointsAllowed <= 20 ? 4 : stats.pointsAllowed <= 27 ? 1 : 0);
            break;
        }

        return {
          playerId: `player-${team.id}-${index}`,
          playerName: player.name,
          position: player.position,
          team: player.team,
          points: Math.round(actualPoints * 10) / 10,
          projectedPoints: Math.round(projectedPoints * 10) / 10,
          isPlaying,
          gameStatus: Math.random() > 0.3 ? 'in_progress' : 'final',
          stats
        };
      });

      return {
        teamId: team.id,
        teamName: team.name,
        totalPoints: Math.round(playerScores.reduce((sum, p) => sum + p.points, 0) * 10) / 10,
        projectedPoints: Math.round(playerScores.reduce((sum, p) => sum + p.projectedPoints, 0) * 10) / 10,
        playerScores
      };
    });
  }, [league?.teams]);

  // Simulate live updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setLastUpdate(new Date());
      // In a real app, this would fetch new data from the API
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'QB': return 'text-red-400';
      case 'RB': return 'text-green-400';
      case 'WR': return 'text-blue-400';
      case 'TE': return 'text-yellow-400';
      case 'FLEX': return 'text-purple-400';
      case 'K': return 'text-orange-400';
      case 'DEF': return 'text-gray-400';
      default: return 'text-white';
    }
  };

  const getGameStatusIcon = (status: string) => {
    switch (status) {
      case 'in_progress': return '🔴';
      case 'final': return '✅';
      case 'not_started': return '⏰';
      default: return '⏰';
    }
  };

  const formatStats = (player: PlayerScore) => {
    const stats = player.stats;
    const statLines: string[] = [];

    if (stats.passingYards) statLines.push(`${stats.passingYards} pass yds`);
    if (stats.passingTDs) statLines.push(`${stats.passingTDs} pass TD`);
    if (stats.rushingYards) statLines.push(`${stats.rushingYards} rush yds`);
    if (stats.rushingTDs) statLines.push(`${stats.rushingTDs} rush TD`);
    if (stats.receivingYards) statLines.push(`${stats.receivingYards} rec yds`);
    if (stats.receptions) statLines.push(`${stats.receptions} rec`);
    if (stats.receivingTDs) statLines.push(`${stats.receivingTDs} rec TD`);
    if (stats.fieldGoals) statLines.push(`${stats.fieldGoals} FG`);
    if (stats.extraPoints) statLines.push(`${stats.extraPoints} XP`);
    if (stats.sacks) statLines.push(`${stats.sacks} sacks`);
    if (stats.interceptions) statLines.push(`${stats.interceptions} INT`);

    return statLines.slice(0, 3).join(', ');
  };

  const selectedTeamScore = teamId ? liveScores.find((score: any) => score.teamId === teamId) : liveScores[0];

  if (!selectedTeamScore) {
    return (
      <div className="text-center py-8 sm:px-4 md:px-6 lg:px-8">
        <p className="text-slate-400 sm:px-4 md:px-6 lg:px-8">No scoring data available</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4 sm:px-4 md:px-6 lg:px-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 sm:px-4 md:px-6 lg:px-8"></div>
        <span className="ml-2 sm:px-4 md:px-6 lg:px-8">Loading...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
      {/* Live Scoring Header */}
      <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-4 sm:px-4 md:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">Live Scoring</h2>
          {isLive && (
            <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse sm:px-4 md:px-6 lg:px-8"></div>
              <span className="text-green-400 text-sm font-medium sm:px-4 md:px-6 lg:px-8">LIVE</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4 sm:px-4 md:px-6 lg:px-8">
          <div className="text-right sm:px-4 md:px-6 lg:px-8">
            <div className="text-sm text-slate-400 sm:px-4 md:px-6 lg:px-8">Last Update</div>
            <div className="text-white font-medium sm:px-4 md:px-6 lg:px-8">
              {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
          
          <div className="flex gap-2 sm:px-4 md:px-6 lg:px-8">
            <button
              onClick={() => setSelectedView('summary')}
              className={`px-3 py-1 rounded-md text-sm font-semibold transition-colors ${selectedView === 'summary' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              Summary
            </button>
            <button
              onClick={() => setSelectedView('detailed')}
              className={`px-3 py-1 rounded-md text-sm font-semibold transition-colors ${selectedView === 'detailed' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              Detailed
            </button>
          </div>
        </div>
      </div>

      {/* Team Score Summary */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
            <span className="text-3xl sm:px-4 md:px-6 lg:px-8">{selectedTeamScore.teamName.charAt(0)}</span>
            <div>
              <h3 className="text-xl font-bold text-white sm:px-4 md:px-6 lg:px-8">{selectedTeamScore.teamName}</h3>
              <p className="text-slate-400 sm:px-4 md:px-6 lg:px-8">Starting Lineup</p>
            </div>
          </div>
          
          <div className="text-right sm:px-4 md:px-6 lg:px-8">
            <div className="text-3xl font-bold text-white sm:px-4 md:px-6 lg:px-8">
              {selectedTeamScore.totalPoints}
            </div>
            {showProjections && (
              <div className="text-sm text-slate-400 sm:px-4 md:px-6 lg:px-8">
                Proj: {selectedTeamScore.projectedPoints}
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {showProjections && (
          <div className="w-full bg-slate-700 rounded-full h-2 mb-4 sm:px-4 md:px-6 lg:px-8">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-500 sm:px-4 md:px-6 lg:px-8"
              style={{
                width: `${Math.min(100, (selectedTeamScore.totalPoints / selectedTeamScore.projectedPoints) * 100)}%`
              }}
            ></div>
          </div>
        )}
      </div>

      {/* Player Scores */}
      <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
        <AnimatePresence>
          {selectedTeamScore.playerScores.map((player, index) => (
            <motion.div
              key={player.playerId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors sm:px-4 md:px-6 lg:px-8"
            >
              <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                <div className="flex items-center gap-4 sm:px-4 md:px-6 lg:px-8">
                  <div className="text-center sm:px-4 md:px-6 lg:px-8">
                    <div className={`text-sm font-bold ${getPositionColor(player.position)}`}>
                      {player.position}
                    </div>
                    <div className="text-xs text-slate-500 sm:px-4 md:px-6 lg:px-8">{player.team}</div>
                  </div>
                  
                  <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                    <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                      <h4 className="text-white font-semibold sm:px-4 md:px-6 lg:px-8">{player.playerName}</h4>
                      <span className="text-sm sm:px-4 md:px-6 lg:px-8">
                        {getGameStatusIcon(player.gameStatus)}
                      </span>
                      {!player.isPlaying && (
                        <span className="px-2 py-1 bg-red-900/50 text-red-400 text-xs rounded sm:px-4 md:px-6 lg:px-8">
                          OUT
                        </span>
                      )}
                    </div>
                    
                    {selectedView === 'detailed' && (
                      <div className="text-sm text-slate-400 mt-1 sm:px-4 md:px-6 lg:px-8">
                        {formatStats(player)}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-right sm:px-4 md:px-6 lg:px-8">
                  <div className={`text-xl font-bold ${
                    player.points > player.projectedPoints ? 'text-green-400' : 'text-white'
                  }`}>
                    {player.points}
                  </div>
                  {showProjections && (
                    <div className="text-sm text-slate-400 sm:px-4 md:px-6 lg:px-8">
                      {player.projectedPoints}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Scoring Notes */}
      <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-blue-400 mb-2 sm:px-4 md:px-6 lg:px-8">
          <span>ℹ️</span>
          <span className="font-semibold sm:px-4 md:px-6 lg:px-8">Scoring System</span>
        </div>
        <div className="text-sm text-blue-300 space-y-1 sm:px-4 md:px-6 lg:px-8">
          <p>• Full PPR (1 point per reception)</p>
          <p>• 6 points for all TDs, 4 points for passing TDs</p>
          <p>• 1 point per 10 rushing/receiving yards, 1 point per 25 passing yards</p>
          <p>• Updates every 5 minutes during live games</p>
        </div>
      </div>
    </div>
  );
};

const LiveScoringWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <LiveScoring {...props} />
  </ErrorBoundary>
);

export default React.memo(LiveScoringWithErrorBoundary);