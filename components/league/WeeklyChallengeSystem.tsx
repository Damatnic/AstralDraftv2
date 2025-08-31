/**
 * Weekly Challenge System - Create engaging weekly competitions and mini-games
 */

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Target, Zap, Star, Gift, Calendar, Clock, Users, Flame, Crown } from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'prediction' | 'performance' | 'lineup' | 'knowledge' | 'social';
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  points: number;
  deadline: Date;
  participants: number;
  maxParticipants?: number;
  status: 'active' | 'completed' | 'upcoming';
  prize?: string;
  criteria: any;
  leaderboard?: ChallengeEntry[];

}

interface ChallengeEntry {

  userId: string;
  userName: string;
  teamName: string;
  entry: any;
  score: number;
  rank: number;
  submittedAt: Date;

    } catch (error) {
        console.error(error);
    }interface WeeklyChallengeSystemProps {
  leagueId: string;
  userId: string;
  userName: string;
  week: number;
  onChallengeComplete?: (challengeId: string, score: number) => void;

}

const WeeklyChallengeSystem: React.FC<WeeklyChallengeSystemProps> = ({
  leagueId,
  userId,
  userName,
  week,
  onChallengeComplete
}) => {
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [userEntries, setUserEntries] = useState<{[key: string]: any}>({});
  const [showLeaderboard, setShowLeaderboard] = useState<string | null>(null);

  // Generate weekly challenges
  const generateWeeklyChallenges = (): Challenge[] => {
    const challenges: Challenge[] = [
      // Performance Challenges
      {
        id: 'highest_scorer',
        title: 'Weekly High Scorer',
        description: 'Score the most points this week to claim victory!',
        type: 'performance',
        difficulty: 'easy',
        points: 50,
        deadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
        participants: Math.floor(Math.random() * 10) + 1,
        maxParticipants: 10,
        status: 'active',
        prize: '🏆 High Scorer Badge + 50 League Points',
        criteria: { metric: 'total_points', target: 'highest' }
      },
      
      // Prediction Challenges
      {
        id: 'prediction_master',
        title: 'Score Prediction Challenge',
        description: 'Predict your exact score within 5 points!',
        type: 'prediction',
        difficulty: 'medium',
        points: 75,
        deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        participants: Math.floor(Math.random() * 8) + 1,
        status: 'active',
        prize: '🔮 Oracle Badge + Waiver Priority',
        criteria: { type: 'exact_score', tolerance: 5 }
      },

      // Lineup Challenges
      {
        id: 'budget_lineup',
        title: 'Budget Lineup Challenge',
        description: 'Create the highest-scoring lineup using only players under $5M salary',
        type: 'lineup',
        difficulty: 'hard',
        points: 100,
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        participants: Math.floor(Math.random() * 6) + 1,
        status: 'active',
        prize: '💰 Budget Master Badge + Trade Priority',
        criteria: { salary_cap: 5000000, positions: ['QB', 'RB', 'RB', 'WR', 'WR', 'TE', 'K', 'DEF'] }
      },

      // Knowledge Challenges
      {
        id: 'trivia_tuesday',
        title: 'Fantasy Football Trivia',
        description: 'Test your NFL knowledge with 10 challenging questions',
        type: 'knowledge',
        difficulty: 'medium',
        points: 60,
        deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        participants: Math.floor(Math.random() * 9) + 1,
        status: 'active',
        prize: '🧠 Trivia Master Badge',
        criteria: { questions: 10, passing_score: 7 }
      },

      // Social Challenges
      {
        id: 'trash_talk_champion',
        title: 'Trash Talk Champion',
        description: 'Send the most creative trash talk messages this week',
        type: 'social',
        difficulty: 'easy',
        points: 25,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        participants: Math.floor(Math.random() * 10) + 1,
        status: 'active',
        prize: '🗣️ Trash Talk Crown',
        criteria: { min_messages: 5, quality_threshold: 3 }
      },

      // Special Weekly Challenges
      {
        id: 'underdog_special',
        title: 'Underdog Victory',
        description: 'Win your matchup despite being projected to lose by 15+ points',
        type: 'performance',
        difficulty: 'legendary',
        points: 200,
        deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        participants: Math.floor(Math.random() * 3) + 1,
        status: 'active',
        prize: '🦸 Underdog Hero Badge + Championship Bonus Points',
        criteria: { projection_deficit: 15, must_win: true }

    ];

    return challenges;
  };

  const [challenges] = useState<Challenge[]>(generateWeeklyChallenges());

  const getDifficultyColor = (difficulty: Challenge['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'hard': return 'text-red-400 bg-red-500/20';
      case 'legendary': return 'text-purple-400 bg-purple-500/20';

  };

  const getTypeIcon = (type: Challenge['type']) => {
    switch (type) {
      case 'performance': return <Zap className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />;
      case 'prediction': return <Target className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />;
      case 'lineup': return <Users className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />;
      case 'knowledge': return <Star className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />;
      case 'social': return <Flame className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />;

  };

  const handleJoinChallenge = (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge && !userEntries[challengeId]) {
      setSelectedChallenge(challenge);
      // In real implementation, this would create an entry
      setUserEntries(prev => ({
        ...prev,
        [challengeId]: { joined: true, entry: null }
      }));

  };

  const handleSubmitEntry = (challengeId: string, entry: any) => {
    setUserEntries(prev => ({
      ...prev,
      [challengeId]: { joined: true, entry, submitted: true }
    }));
    setSelectedChallenge(null);
    
    // Mock scoring
    const score = Math.floor(Math.random() * 100) + 1;
    onChallengeComplete?.(challengeId, score);
  };

  const formatTimeRemaining = (deadline: Date) => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h`;
    return 'Ending soon';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4 sm:px-4 md:px-6 lg:px-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 sm:px-4 md:px-6 lg:px-8"></div>
        <span className="ml-2 sm:px-4 md:px-6 lg:px-8">Loading...</span>
      </div>
    );

  return (
    <div className="bg-dark-800 rounded-xl p-6 border border-gray-700 sm:px-4 md:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
          <Trophy className="w-6 h-6 text-gold-400 sm:px-4 md:px-6 lg:px-8" />
          <div>
            <h2 className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">Weekly Challenges</h2>
            <p className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Week {week} • Earn points and badges</p>
          </div>
        </div>
        
        <div className="text-right sm:px-4 md:px-6 lg:px-8">
          <div className="text-2xl font-bold text-gold-400 sm:px-4 md:px-6 lg:px-8">
            {Object.values(userEntries).reduce((total, entry) => 
              total + (entry.submitted ? Math.floor(Math.random() * 100) : 0), 0
            )}
          </div>
          <div className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">Total Points</div>
        </div>
      </div>

      {/* Active Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {challenges.filter(c => c.status === 'active').map(challenge => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-dark-700 rounded-lg p-5 border border-gray-600 hover:border-primary-500/50 transition-all sm:px-4 md:px-6 lg:px-8"
          >
            <div className="flex items-start justify-between mb-3 sm:px-4 md:px-6 lg:px-8">
              <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                {getTypeIcon(challenge.type)}
                <h3 className="font-bold text-white sm:px-4 md:px-6 lg:px-8">{challenge.title}</h3>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(challenge.difficulty)}`}>
                {challenge.difficulty.toUpperCase()}
              </span>
            </div>

            <p className="text-gray-300 text-sm mb-4 sm:px-4 md:px-6 lg:px-8">{challenge.description}</p>

            <div className="flex items-center justify-between mb-4 sm:px-4 md:px-6 lg:px-8">
              <div className="flex items-center gap-4 text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">
                <div className="flex items-center gap-1 sm:px-4 md:px-6 lg:px-8">
                  <Users className="w-3 h-3 sm:px-4 md:px-6 lg:px-8" />
                  <span>{challenge.participants}/{challenge.maxParticipants || '∞'}</span>
                </div>
                <div className="flex items-center gap-1 sm:px-4 md:px-6 lg:px-8">
                  <Clock className="w-3 h-3 sm:px-4 md:px-6 lg:px-8" />
                  <span>{formatTimeRemaining(challenge.deadline)}</span>
                </div>
              </div>
              <div className="text-gold-400 font-bold sm:px-4 md:px-6 lg:px-8">
                +{challenge.points} pts
              </div>
            </div>

            {challenge.prize && (
              <div className="mb-4 p-2 bg-gold-500/10 border border-gold-500/30 rounded text-xs sm:px-4 md:px-6 lg:px-8">
                <div className="flex items-center gap-1 text-gold-400 sm:px-4 md:px-6 lg:px-8">
                  <Gift className="w-3 h-3 sm:px-4 md:px-6 lg:px-8" />
                  <span className="font-semibold sm:px-4 md:px-6 lg:px-8">Prize:</span>
                </div>
                <div className="text-gray-300 sm:px-4 md:px-6 lg:px-8">{challenge.prize}</div>
              </div>
            )}

            <div className="flex gap-2 sm:px-4 md:px-6 lg:px-8">
              {!userEntries[challenge.id]?.joined ? (
                <button
                  onClick={() => handleJoinChallenge(challenge.id)}
                >
                  Join Challenge
                </button>
              ) : userEntries[challenge.id]?.submitted ? (
                <div className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-semibold text-center sm:px-4 md:px-6 lg:px-8">
                  ✓ Submitted
                </div>
              ) : (
                <button
                  onClick={() => setSelectedChallenge(challenge)}
                >
                  Submit Entry
                </button>
              )}
              
              <button
                onClick={() => setShowLeaderboard(showLeaderboard === challenge.id ? null : challenge.id)}
              >
                📊
              </button>
            </div>

            {/* Leaderboard */}
            <AnimatePresence>
              {showLeaderboard === challenge.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 pt-4 border-t border-gray-600 sm:px-4 md:px-6 lg:px-8"
                >
                  <h4 className="font-semibold text-white text-sm mb-2 sm:px-4 md:px-6 lg:px-8">Current Standings</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto sm:px-4 md:px-6 lg:px-8">
                    {Array.from({ length: Math.min(5, challenge.participants) }, (_, i) => (
                      <div key={i} className="flex items-center justify-between text-xs sm:px-4 md:px-6 lg:px-8">
                        <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                            i === 0 ? 'bg-gold-400 text-black' :
                            i === 1 ? 'bg-gray-400 text-black' :
                            i === 2 ? 'bg-amber-600 text-white' :
                            'bg-dark-600 text-gray-300'
                          }`}>
                            {i + 1}
                          </span>
                          <span className="text-gray-300 sm:px-4 md:px-6 lg:px-8">Team {i + 1}</span>
                        </div>
                        <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">{Math.floor(Math.random() * 100)} pts</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Challenge Submission Modal */}
      <AnimatePresence>
        {selectedChallenge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1100] sm:px-4 md:px-6 lg:px-8"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-dark-800 rounded-2xl p-6 border border-gray-700 shadow-2xl max-w-md w-full mx-4 sm:px-4 md:px-6 lg:px-8"
            >
              <div className="flex items-center justify-between mb-4 sm:px-4 md:px-6 lg:px-8">
                <h3 className="text-xl font-bold text-white sm:px-4 md:px-6 lg:px-8">{selectedChallenge.title}</h3>
                <button
                  onClick={() => setSelectedChallenge(null)}
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                {selectedChallenge.type === 'prediction' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 sm:px-4 md:px-6 lg:px-8">
                      Predict your score this week:
                    </label>
                    <input
                      type="number"
                      placeholder="Enter predicted score"
                      className="w-full bg-dark-700 border border-gray-600 rounded-lg px-3 py-2 text-white sm:px-4 md:px-6 lg:px-8"
                    />
                  </div>
                )}

                {selectedChallenge.type === 'knowledge' && (
                  <div>
                    <p className="text-sm text-gray-300 mb-3 sm:px-4 md:px-6 lg:px-8">Answer the trivia questions:</p>
                    <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                      <div>
                        <p className="text-sm text-white mb-2 sm:px-4 md:px-6 lg:px-8">1. Which team won Super Bowl LVI?</p>
                        <div className="space-y-1 sm:px-4 md:px-6 lg:px-8">
                          {['Los Angeles Rams', 'Cincinnati Bengals', 'Kansas City Chiefs', 'Tampa Bay Buccaneers'].map(option => (
                            <label key={option} className="flex items-center gap-2 text-sm text-gray-300 sm:px-4 md:px-6 lg:px-8">
                              <input type="radio" name="q1" value={option} />
                              {option}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedChallenge.type === 'lineup' && (
                  <div>
                    <p className="text-sm text-gray-300 mb-3 sm:px-4 md:px-6 lg:px-8">Build your budget lineup:</p>
                    <div className="space-y-2 text-sm sm:px-4 md:px-6 lg:px-8">
                      <div className="flex justify-between sm:px-4 md:px-6 lg:px-8">
                        <span>Salary Cap:</span>
                        <span className="text-green-400 sm:px-4 md:px-6 lg:px-8">$5,000,000</span>
                      </div>
                      <div className="space-y-1 sm:px-4 md:px-6 lg:px-8">
                        {['QB', 'RB1', 'RB2', 'WR1', 'WR2', 'TE', 'K', 'DEF'].map(pos => (
                          <div key={pos} className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                            <span className="w-10 text-gray-400 sm:px-4 md:px-6 lg:px-8">{pos}:</span>
                            <input
                              type="text"
                              placeholder="Select player"
                              className="flex-1 bg-dark-700 border border-gray-600 rounded px-2 py-1 text-white text-xs sm:px-4 md:px-6 lg:px-8"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 sm:px-4 md:px-6 lg:px-8">
                  <button
                    onClick={() => setSelectedChallenge(null)}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSubmitEntry(selectedChallenge.id, {}}
                    className="flex-1 bg-primary-600 hover:bg-primary-500 text-white py-2 px-4 rounded-lg transition-colors sm:px-4 md:px-6 lg:px-8"
                  >
                    Submit Entry
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Week Summary */}
      <div className="mt-6 p-4 bg-dark-700 rounded-lg border border-gray-600 sm:px-4 md:px-6 lg:px-8">
        <h3 className="font-semibold text-white mb-2 sm:px-4 md:px-6 lg:px-8">This Week's Champions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center sm:px-4 md:px-6 lg:px-8">
            <div className="text-gold-400 text-lg sm:px-4 md:px-6 lg:px-8">👑</div>
            <div className="font-semibold text-white sm:px-4 md:px-6 lg:px-8">Score Predictor</div>
            <div className="text-gray-400 sm:px-4 md:px-6 lg:px-8">TeamName (+100 pts)</div>
          </div>
          <div className="text-center sm:px-4 md:px-6 lg:px-8">
            <div className="text-silver-400 text-lg sm:px-4 md:px-6 lg:px-8">🥈</div>
            <div className="font-semibold text-white sm:px-4 md:px-6 lg:px-8">Trivia Master</div>
            <div className="text-gray-400 sm:px-4 md:px-6 lg:px-8">TeamName (+75 pts)</div>
          </div>
          <div className="text-center sm:px-4 md:px-6 lg:px-8">
            <div className="text-bronze-400 text-lg sm:px-4 md:px-6 lg:px-8">🥉</div>
            <div className="font-semibold text-white sm:px-4 md:px-6 lg:px-8">Budget Builder</div>
            <div className="text-gray-400 sm:px-4 md:px-6 lg:px-8">TeamName (+60 pts)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const WeeklyChallengeSystemWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <WeeklyChallengeSystem {...props} />
  </ErrorBoundary>
);

export default React.memo(WeeklyChallengeSystemWithErrorBoundary);