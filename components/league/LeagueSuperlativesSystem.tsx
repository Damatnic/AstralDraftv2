/**
 * League Superlatives & Awards System - Fun recognition and award tracking
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Trophy, Star, Zap, Crown, Heart, Skull, Target, TrendingUp, Clock, Gift } from 'lucide-react';

interface Superlative {
  id: string;
  title: string;
  description: string;
  category: 'weekly' | 'season' | 'career' | 'silly';
  icon: string;
  emoji: string;
  winner?: {
    userId: string;
    userName: string;
    teamName: string;
    value?: number | string;
    context?: string;
  };
  runners_up?: Array<{
    userId: string;
    userName: string;
    teamName: string;
    value?: number | string;
  }>;
  criteria: string;
  rarity: 'common' | 'rare' | 'legendary';
  week?: number;
}

interface LeagueSuperlativesSystemProps {
  leagueId: string;
  currentWeek: number;
  teams: Array<{
    id: string;
    name: string;
    owner: string;
    record: { wins: number; losses: number };
    stats: any;
  }>;
}

const LeagueSuperlativesSystem: React.FC<LeagueSuperlativesSystemProps> = ({
  leagueId,
  currentWeek,
  teams
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'weekly' | 'season' | 'silly'>('all');
  const [expandedAward, setExpandedAward] = useState<string | null>(null);
  const [showVotingModal, setShowVotingModal] = useState<string | null>(null);

  // Comprehensive superlatives for 10-man league
  const superlativeDefinitions: Superlative[] = [
    // Weekly Awards
    {
      id: 'high_scorer',
      title: 'Weekly High Scorer',
      description: 'Scored the most points this week',
      category: 'weekly',
      icon: 'trophy',
      emoji: '🏆',
      criteria: 'Highest weekly point total',
      rarity: 'common',
      week: currentWeek,
      winner: {
        userId: 'user1',
        userName: 'Mike Johnson',
        teamName: 'Dynasty Destroyers',
        value: 156.8,
        context: 'Dominated with an explosive performance'
      }
    },
    {
      id: 'heartbreaker',
      title: 'Heartbreaker of the Week',
      description: 'Lost by the smallest margin',
      category: 'weekly',
      icon: 'heart',
      emoji: '💔',
      criteria: 'Closest losing margin',
      rarity: 'common',
      week: currentWeek,
      winner: {
        userId: 'user2',
        userName: 'Sarah Chen',
        teamName: 'Gridiron Gladiators',
        value: '0.34 points',
        context: 'Lost by a brutal margin that hurts'
      }
    },
    {
      id: 'lucky_win',
      title: 'Luckiest Win',
      description: 'Won despite being heavily projected to lose',
      category: 'weekly',
      icon: 'star',
      emoji: '🍀',
      criteria: 'Biggest upset victory',
      rarity: 'rare',
      week: currentWeek,
      winner: {
        userId: 'user3',
        userName: 'Alex Rodriguez',
        teamName: 'Fantasy Phenoms',
        value: 'Won by 12 (projected -18)',
        context: 'Miraculous comeback nobody saw coming'
      }
    },

    // Season-Long Awards
    {
      id: 'consistency_king',
      title: 'Mr. Consistency',
      description: 'Most consistent weekly scoring',
      category: 'season',
      icon: 'target',
      emoji: '🎯',
      criteria: 'Lowest standard deviation in weekly scores',
      rarity: 'rare',
      winner: {
        userId: 'user4',
        userName: 'Jordan Smith',
        teamName: 'Championship Chasers',
        value: '±8.2 points',
        context: 'Reliable as a Swiss watch'
      }
    },
    {
      id: 'waiver_wizard',
      title: 'Waiver Wire Wizard',
      description: 'Best at finding diamond-in-the-rough players',
      category: 'season',
      icon: 'zap',
      emoji: '💎',
      criteria: 'Most points from waiver wire pickups',
      rarity: 'rare',
      winner: {
        userId: 'user5',
        userName: 'Taylor Brown',
        teamName: 'Playoff Predators',
        value: '124.6 points',
        context: 'Master of finding hidden gems'
      }
    },
    {
      id: 'trade_master',
      title: 'Trade Negotiator',
      description: 'Most successful trades that improved team',
      category: 'season',
      icon: 'crown',
      emoji: '🤝',
      criteria: 'Best net gain from trades',
      rarity: 'legendary',
      winner: {
        userId: 'user6',
        userName: 'Casey Wilson',
        teamName: 'Touchdown Titans',
        value: '4 successful trades',
        context: 'Art of the deal personified'
      }
    },

    // Silly/Fun Awards
    {
      id: 'bench_warmer',
      title: 'Bench Warmer Champion',
      description: 'Left the most points on the bench',
      category: 'silly',
      icon: 'skull',
      emoji: '🪑',
      criteria: 'Highest total points left on bench',
      rarity: 'common',
      winner: {
        userId: 'user7',
        userName: 'Morgan Davis',
        teamName: 'Victory Vampires',
        value: '87.4 points on bench',
        context: 'King of the wrong lineup decisions'
      }
    },
    {
      id: 'taco_award',
      title: 'Taco of the Week',
      description: 'Most questionable lineup decisions',
      category: 'silly',
      icon: 'skull',
      emoji: '🌮',
      criteria: 'Community vote for worst decisions',
      rarity: 'common',
      winner: {
        userId: 'user8',
        userName: 'Riley Martinez',
        teamName: 'Elite Eagles',
        value: 'Started injured QB',
        context: 'Sometimes fantasy football is hard'
      }
    },
    {
      id: 'glass_house',
      title: 'Living in a Glass House',
      description: 'Most trash talk despite poor performance',
      category: 'silly',
      icon: 'zap',
      emoji: '🏠',
      criteria: 'High trash talk volume + low performance',
      rarity: 'rare',
      winner: {
        userId: 'user9',
        userName: 'Avery Thompson',
        teamName: 'Comeback Kings',
        value: '23 trash talk messages',
        context: 'All talk, questionable walk'
      }
    },
    {
      id: 'loyalty_badge',
      title: 'Ride or Die',
      description: 'Stuck with struggling player longest',
      category: 'silly',
      icon: 'heart',
      emoji: '🛡️',
      criteria: 'Kept underperforming drafted player longest',
      rarity: 'rare',
      winner: {
        userId: 'user10',
        userName: 'Quinn Anderson',
        teamName: 'Draft Day Demons',
        value: 'Kept Russell Wilson 12 weeks',
        context: 'Loyalty beyond reason'
      }
    }
  ];

  const [superlatives] = useState<Superlative[]>(superlativeDefinitions);

  const getRarityColor = (rarity: Superlative['rarity']) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-500 bg-gray-500/10';
      case 'rare': return 'text-blue-400 border-blue-500 bg-blue-500/10';
      case 'legendary': return 'text-yellow-400 border-yellow-500 bg-yellow-500/10';
    }
  };

  const getCategoryColor = (category: Superlative['category']) => {
    switch (category) {
      case 'weekly': return 'text-green-400 bg-green-500/20';
      case 'season': return 'text-purple-400 bg-purple-500/20';
      case 'silly': return 'text-orange-400 bg-orange-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getIconComponent = (icon: string) => {
    switch (icon) {
      case 'trophy': return <Trophy className="w-5 h-5" />;
      case 'award': return <Award className="w-5 h-5" />;
      case 'star': return <Star className="w-5 h-5" />;
      case 'zap': return <Zap className="w-5 h-5" />;
      case 'crown': return <Crown className="w-5 h-5" />;
      case 'heart': return <Heart className="w-5 h-5" />;
      case 'skull': return <Skull className="w-5 h-5" />;
      case 'target': return <Target className="w-5 h-5" />;
      default: return <Award className="w-5 h-5" />;
    }
  };

  const filteredSuperlatives = selectedCategory === 'all' 
    ? superlatives 
    : superlatives.filter(s => s.category === selectedCategory);

  return (
    <div className="bg-dark-800 rounded-xl p-6 border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Award className="w-6 h-6 text-gold-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">League Superlatives</h2>
            <p className="text-gray-400">Awards, recognition, and fun callouts</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {(['all', 'weekly', 'season', 'silly'] as const).map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-700 text-gray-400 hover:text-white hover:bg-dark-600'
              }`}
            >
              {category === 'all' ? 'All Awards' : category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Awards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuperlatives.map(superlative => (
          <motion.div
            key={superlative.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`relative p-5 rounded-lg border-2 ${getRarityColor(superlative.rarity)} transition-all hover:scale-105 cursor-pointer`}
            onClick={() => setExpandedAward(expandedAward === superlative.id ? null : superlative.id)}
          >
            {/* Rarity Badge */}
            <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold ${getRarityColor(superlative.rarity)}`}>
              {superlative.rarity.toUpperCase()}
            </div>

            {/* Award Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">{superlative.emoji}</div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-lg">{superlative.title}</h3>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${getCategoryColor(superlative.category)}`}>
                    {superlative.category.toUpperCase()}
                  </span>
                  {superlative.week && (
                    <span className="text-xs text-gray-400">Week {superlative.week}</span>
                  )}
                </div>
              </div>
            </div>

            <p className="text-gray-300 text-sm mb-4">{superlative.description}</p>

            {/* Winner Display */}
            {superlative.winner && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-gold-400" />
                  <span className="font-semibold text-white">{superlative.winner.userName}</span>
                </div>
                <div className="text-sm text-gray-400">{superlative.winner.teamName}</div>
                {superlative.winner.value && (
                  <div className="text-sm font-bold text-primary-400">{superlative.winner.value}</div>
                )}
              </div>
            )}

            {!superlative.winner && (
              <div className="text-center py-4">
                <Clock className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <div className="text-sm text-gray-500">Award pending</div>
                {superlative.category === 'silly' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowVotingModal(superlative.id);
                    }}
                    className="mt-2 px-3 py-1 bg-primary-600 hover:bg-primary-500 text-white text-xs rounded transition-colors"
                  >
                    Vote Now
                  </button>
                )}
              </div>
            )}

            {/* Expanded Details */}
            <AnimatePresence>
              {expandedAward === superlative.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 pt-4 border-t border-gray-600 space-y-3"
                >
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Criteria:</div>
                    <div className="text-sm text-gray-200">{superlative.criteria}</div>
                  </div>
                  
                  {superlative.winner?.context && (
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Context:</div>
                      <div className="text-sm text-gray-200 italic">"{superlative.winner.context}"</div>
                    </div>
                  )}

                  {superlative.runners_up && superlative.runners_up.length > 0 && (
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Runners-up:</div>
                      <div className="space-y-1">
                        {superlative.runners_up.slice(0, 2).map((runner, index) => (
                          <div key={runner.userId} className="flex justify-between text-sm">
                            <span className="text-gray-300">{index + 2}. {runner.userName}</span>
                            <span className="text-gray-400">{runner.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Voting Modal */}
      <AnimatePresence>
        {showVotingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1100]"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-dark-800 rounded-2xl p-6 border border-gray-700 shadow-2xl max-w-md w-full mx-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Vote for Award</h3>
                <button
                  onClick={() => setShowVotingModal(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="text-sm text-gray-300">
                  Who deserves the "{superlatives.find(s => s.id === showVotingModal)?.title}" award?
                </div>

                <div className="space-y-2">
                  {teams.slice(0, 5).map(team => (
                    <button
                      key={team.id}
                      className="w-full p-3 bg-dark-700 hover:bg-dark-600 border border-gray-600 rounded-lg text-left transition-colors"
                    >
                      <div className="font-semibold text-white">{team.name}</div>
                      <div className="text-sm text-gray-400">{team.owner}</div>
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowVotingModal(null)}
                    className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowVotingModal(null)}
                    className="flex-1 bg-primary-600 hover:bg-primary-500 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Submit Vote
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hall of Fame Preview */}
      <div className="mt-6 p-4 bg-gradient-to-r from-gold-500/10 to-yellow-500/10 border border-gold-500/30 rounded-lg">
        <h3 className="font-bold text-gold-400 mb-3 flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Hall of Fame Moments
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl mb-1">🏆</div>
            <div className="font-semibold text-white">Season High Score</div>
            <div className="text-gold-400">186.4 points</div>
            <div className="text-gray-400 text-xs">Mike Johnson • Week 8</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">💔</div>
            <div className="font-semibold text-white">Closest Loss</div>
            <div className="text-red-400">0.08 points</div>
            <div className="text-gray-400 text-xs">Sarah Chen • Week 3</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">🔥</div>
            <div className="font-semibold text-white">Win Streak</div>
            <div className="text-orange-400">7 weeks</div>
            <div className="text-gray-400 text-xs">Alex Rodriguez • Weeks 5-11</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeagueSuperlativesSystem;