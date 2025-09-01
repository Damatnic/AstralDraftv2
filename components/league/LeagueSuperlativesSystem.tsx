/**
 * League Superlatives & Awards System - Fun recognition and award tracking
 */

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useMemo, useState, useEffect } from 'react';
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

const LeagueSuperlativesSystem: React.FC<LeagueSuperlativesSystemProps> = ({
  leagueId,
  currentWeek,
  teams
}: any) => {
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


  ];

  const [superlatives] = useState<Superlative[]>(superlativeDefinitions);

  const getRarityColor = (rarity: Superlative['rarity']) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-500 bg-gray-500/10';
      case 'rare': return 'text-blue-400 border-blue-500 bg-blue-500/10';
      case 'legendary': return 'text-yellow-400 border-yellow-500 bg-yellow-500/10';

  };

  const getCategoryColor = (category: Superlative['category']) => {
    switch (category) {
      case 'weekly': return 'text-green-400 bg-green-500/20';
      case 'season': return 'text-purple-400 bg-purple-500/20';
      case 'silly': return 'text-orange-400 bg-orange-500/20';
      default: return 'text-gray-400 bg-gray-500/20';

  };

  const getIconComponent = (icon: string) => {
    switch (icon) {
      case 'trophy': return <Trophy className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />;
      case 'award': return <Award className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />;
      case 'star': return <Star className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />;
      case 'zap': return <Zap className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />;
      case 'crown': return <Crown className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />;
      case 'heart': return <Heart className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />;
      case 'skull': return <Skull className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />;
      case 'target': return <Target className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />;
      default: return <Award className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />;

  };

  const filteredSuperlatives = selectedCategory === 'all' 
    ? superlatives 
    : superlatives.filter((s: any) => s.category === selectedCategory);

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
          <Award className="w-6 h-6 text-gold-400 sm:px-4 md:px-6 lg:px-8" />
          <div>
            <h2 className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">League Superlatives</h2>
            <p className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Awards, recognition, and fun callouts</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
          {(['all', 'weekly', 'season', 'silly'] as const).map((category: any) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}`}
            >
              {category === 'all' ? 'All Awards' : category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Awards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuperlatives.map((superlative: any) => (
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
            <div className="flex items-center gap-3 mb-3 sm:px-4 md:px-6 lg:px-8">
              <div className="text-3xl sm:px-4 md:px-6 lg:px-8">{superlative.emoji}</div>
              <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                <h3 className="font-bold text-white text-lg sm:px-4 md:px-6 lg:px-8">{superlative.title}</h3>
                <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${getCategoryColor(superlative.category)}`}>
                    {superlative.category.toUpperCase()}
                  </span>
                  {superlative.week && (
                    <span className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">Week {superlative.week}</span>
                  )}
                </div>
              </div>
            </div>

            <p className="text-gray-300 text-sm mb-4 sm:px-4 md:px-6 lg:px-8">{superlative.description}</p>

            {/* Winner Display */}
            {superlative.winner && (
              <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                  <Crown className="w-4 h-4 text-gold-400 sm:px-4 md:px-6 lg:px-8" />
                  <span className="font-semibold text-white sm:px-4 md:px-6 lg:px-8">{superlative.winner.userName}</span>
                </div>
                <div className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">{superlative.winner.teamName}</div>
                {superlative.winner.value && (
                  <div className="text-sm font-bold text-primary-400 sm:px-4 md:px-6 lg:px-8">{superlative.winner.value}</div>
                )}
              </div>
            )}

            {!superlative.winner && (
              <div className="text-center py-4 sm:px-4 md:px-6 lg:px-8">
                <Clock className="w-8 h-8 text-gray-500 mx-auto mb-2 sm:px-4 md:px-6 lg:px-8" />
                <div className="text-sm text-gray-500 sm:px-4 md:px-6 lg:px-8">Award pending</div>
                {superlative.category === 'silly' && (
                  <button
                    onClick={(e) = aria-label="Action button"> {
                      e.stopPropagation();
                      setShowVotingModal(superlative.id);
                    }}
                    className="mt-2 px-3 py-1 bg-primary-600 hover:bg-primary-500 text-white text-xs rounded transition-colors sm:px-4 md:px-6 lg:px-8"
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
                  className="mt-4 pt-4 border-t border-gray-600 space-y-3 sm:px-4 md:px-6 lg:px-8"
                >
                  <div>
                    <div className="text-sm text-gray-400 mb-1 sm:px-4 md:px-6 lg:px-8">Criteria:</div>
                    <div className="text-sm text-gray-200 sm:px-4 md:px-6 lg:px-8">{superlative.criteria}</div>
                  </div>
                  
                  {superlative.winner?.context && (
                    <div>
                      <div className="text-sm text-gray-400 mb-1 sm:px-4 md:px-6 lg:px-8">Context:</div>
                      <div className="text-sm text-gray-200 italic sm:px-4 md:px-6 lg:px-8">"{superlative.winner.context}"</div>
                    </div>
                  )}

                  {superlative.runners_up && superlative.runners_up.length > 0 && (
                    <div>
                      <div className="text-sm text-gray-400 mb-1 sm:px-4 md:px-6 lg:px-8">Runners-up:</div>
                      <div className="space-y-1 sm:px-4 md:px-6 lg:px-8">
                        {superlative.runners_up.slice(0, 2).map((runner, index) => (
                          <div key={runner.userId} className="flex justify-between text-sm sm:px-4 md:px-6 lg:px-8">
                            <span className="text-gray-300 sm:px-4 md:px-6 lg:px-8">{index + 2}. {runner.userName}</span>
                            <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">{runner.value}</span>
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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1100] sm:px-4 md:px-6 lg:px-8"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-dark-800 rounded-2xl p-6 border border-gray-700 shadow-2xl max-w-md w-full mx-4 sm:px-4 md:px-6 lg:px-8"
            >
              <div className="flex items-center justify-between mb-4 sm:px-4 md:px-6 lg:px-8">
                <h3 className="text-xl font-bold text-white sm:px-4 md:px-6 lg:px-8">Vote for Award</h3>
                <button
                  onClick={() => setShowVotingModal(null)}
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                <div className="text-sm text-gray-300 sm:px-4 md:px-6 lg:px-8">
                  Who deserves the "{superlatives.find((s: any) => s.id === showVotingModal)?.title}" award?
                </div>

                <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                  {teams.slice(0, 5).map((team: any) => (
                    <button
                      key={team.id}
                      className="w-full p-3 bg-dark-700 hover:bg-dark-600 border border-gray-600 rounded-lg text-left transition-colors sm:px-4 md:px-6 lg:px-8"
                     aria-label="Action button">
                      <div className="font-semibold text-white sm:px-4 md:px-6 lg:px-8">{team.name}</div>
                      <div className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">{team.owner}</div>
                    </button>
                  ))}
                </div>

                <div className="flex gap-3 sm:px-4 md:px-6 lg:px-8">
                  <button
                    onClick={() => setShowVotingModal(null)}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowVotingModal(null)}
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
      <div className="mt-6 p-4 bg-gradient-to-r from-gold-500/10 to-yellow-500/10 border border-gold-500/30 rounded-lg sm:px-4 md:px-6 lg:px-8">
        <h3 className="font-bold text-gold-400 mb-3 flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
          <Trophy className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
          Hall of Fame Moments
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center sm:px-4 md:px-6 lg:px-8">
            <div className="text-2xl mb-1 sm:px-4 md:px-6 lg:px-8">🏆</div>
            <div className="font-semibold text-white sm:px-4 md:px-6 lg:px-8">Season High Score</div>
            <div className="text-gold-400 sm:px-4 md:px-6 lg:px-8">186.4 points</div>
            <div className="text-gray-400 text-xs sm:px-4 md:px-6 lg:px-8">Mike Johnson • Week 8</div>
          </div>
          <div className="text-center sm:px-4 md:px-6 lg:px-8">
            <div className="text-2xl mb-1 sm:px-4 md:px-6 lg:px-8">💔</div>
            <div className="font-semibold text-white sm:px-4 md:px-6 lg:px-8">Closest Loss</div>
            <div className="text-red-400 sm:px-4 md:px-6 lg:px-8">0.08 points</div>
            <div className="text-gray-400 text-xs sm:px-4 md:px-6 lg:px-8">Sarah Chen • Week 3</div>
          </div>
          <div className="text-center sm:px-4 md:px-6 lg:px-8">
            <div className="text-2xl mb-1 sm:px-4 md:px-6 lg:px-8">🔥</div>
            <div className="font-semibold text-white sm:px-4 md:px-6 lg:px-8">Win Streak</div>
            <div className="text-orange-400 sm:px-4 md:px-6 lg:px-8">7 weeks</div>
            <div className="text-gray-400 text-xs sm:px-4 md:px-6 lg:px-8">Alex Rodriguez • Weeks 5-11</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LeagueSuperlativesSystemWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <LeagueSuperlativesSystem {...props} />
  </ErrorBoundary>
);

export default React.memo(LeagueSuperlativesSystemWithErrorBoundary);