/**
 * League Superlatives & Awards System - Fun recognition and award tracking
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useMemo, useState, useEffect } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { Award, Trophy, Star, Zap, Crown, Heart, Skull, Target, TrendingUp, Clock, Gift } from &apos;lucide-react&apos;;

interface Superlative {
}
  id: string;
  title: string;
  description: string;
  category: &apos;weekly&apos; | &apos;season&apos; | &apos;career&apos; | &apos;silly&apos;;
  icon: string;
  emoji: string;
  winner?: {
}
    userId: string;
    userName: string;
    teamName: string;
    value?: number | string;
    context?: string;
  };
  runners_up?: Array<{
}
    userId: string;
    userName: string;
    teamName: string;
    value?: number | string;
  }>;
  criteria: string;
  rarity: &apos;common&apos; | &apos;rare&apos; | &apos;legendary&apos;;
  week?: number;

interface LeagueSuperlativesSystemProps {
}
  leagueId: string;
  currentWeek: number;
  teams: Array<{
}
    id: string;
    name: string;
    owner: string;
    record: { wins: number; losses: number };
    stats: any;
  }>;

const LeagueSuperlativesSystem: React.FC<LeagueSuperlativesSystemProps> = ({
}
  leagueId,
  currentWeek,
//   teams
}: any) => {
}
  const [selectedCategory, setSelectedCategory] = useState<&apos;all&apos; | &apos;weekly&apos; | &apos;season&apos; | &apos;silly&apos;>(&apos;all&apos;);
  const [expandedAward, setExpandedAward] = useState<string | null>(null);
  const [showVotingModal, setShowVotingModal] = useState<string | null>(null);

  // Comprehensive superlatives for 10-man league
  const superlativeDefinitions: Superlative[] = [
    // Weekly Awards
    {
}
      id: &apos;high_scorer&apos;,
      title: &apos;Weekly High Scorer&apos;,
      description: &apos;Scored the most points this week&apos;,
      category: &apos;weekly&apos;,
      icon: &apos;trophy&apos;,
      emoji: &apos;🏆&apos;,
      criteria: &apos;Highest weekly point total&apos;,
      rarity: &apos;common&apos;,
      week: currentWeek,
      winner: {
}
        userId: &apos;user1&apos;,
        userName: &apos;Mike Johnson&apos;,
        teamName: &apos;Dynasty Destroyers&apos;,
        value: 156.8,
        context: &apos;Dominated with an explosive performance&apos;

    },
    {
}
      id: &apos;heartbreaker&apos;,
      title: &apos;Heartbreaker of the Week&apos;,
      description: &apos;Lost by the smallest margin&apos;,
      category: &apos;weekly&apos;,
      icon: &apos;heart&apos;,
      emoji: &apos;💔&apos;,
      criteria: &apos;Closest losing margin&apos;,
      rarity: &apos;common&apos;,
      week: currentWeek,
      winner: {
}
        userId: &apos;user2&apos;,
        userName: &apos;Sarah Chen&apos;,
        teamName: &apos;Gridiron Gladiators&apos;,
        value: &apos;0.34 points&apos;,
        context: &apos;Lost by a brutal margin that hurts&apos;

    },
    {
}
      id: &apos;lucky_win&apos;,
      title: &apos;Luckiest Win&apos;,
      description: &apos;Won despite being heavily projected to lose&apos;,
      category: &apos;weekly&apos;,
      icon: &apos;star&apos;,
      emoji: &apos;🍀&apos;,
      criteria: &apos;Biggest upset victory&apos;,
      rarity: &apos;rare&apos;,
      week: currentWeek,
      winner: {
}
        userId: &apos;user3&apos;,
        userName: &apos;Alex Rodriguez&apos;,
        teamName: &apos;Fantasy Phenoms&apos;,
        value: &apos;Won by 12 (projected -18)&apos;,
        context: &apos;Miraculous comeback nobody saw coming&apos;

    },

    // Season-Long Awards
    {
}
      id: &apos;consistency_king&apos;,
      title: &apos;Mr. Consistency&apos;,
      description: &apos;Most consistent weekly scoring&apos;,
      category: &apos;season&apos;,
      icon: &apos;target&apos;,
      emoji: &apos;🎯&apos;,
      criteria: &apos;Lowest standard deviation in weekly scores&apos;,
      rarity: &apos;rare&apos;,
      winner: {
}
        userId: &apos;user4&apos;,
        userName: &apos;Jordan Smith&apos;,
        teamName: &apos;Championship Chasers&apos;,
        value: &apos;±8.2 points&apos;,
        context: &apos;Reliable as a Swiss watch&apos;

    },
    {
}
      id: &apos;waiver_wizard&apos;,
      title: &apos;Waiver Wire Wizard&apos;,
      description: &apos;Best at finding diamond-in-the-rough players&apos;,
      category: &apos;season&apos;,
      icon: &apos;zap&apos;,
      emoji: &apos;💎&apos;,
      criteria: &apos;Most points from waiver wire pickups&apos;,
      rarity: &apos;rare&apos;,
      winner: {
}
        userId: &apos;user5&apos;,
        userName: &apos;Taylor Brown&apos;,
        teamName: &apos;Playoff Predators&apos;,
        value: &apos;124.6 points&apos;,
        context: &apos;Master of finding hidden gems&apos;

    },
    {
}
      id: &apos;trade_master&apos;,
      title: &apos;Trade Negotiator&apos;,
      description: &apos;Most successful trades that improved team&apos;,
      category: &apos;season&apos;,
      icon: &apos;crown&apos;,
      emoji: &apos;🤝&apos;,
      criteria: &apos;Best net gain from trades&apos;,
      rarity: &apos;legendary&apos;,
      winner: {
}
        userId: &apos;user6&apos;,
        userName: &apos;Casey Wilson&apos;,
        teamName: &apos;Touchdown Titans&apos;,
        value: &apos;4 successful trades&apos;,
        context: &apos;Art of the deal personified&apos;

    },

    // Silly/Fun Awards
    {
}
      id: &apos;bench_warmer&apos;,
      title: &apos;Bench Warmer Champion&apos;,
      description: &apos;Left the most points on the bench&apos;,
      category: &apos;silly&apos;,
      icon: &apos;skull&apos;,
      emoji: &apos;🪑&apos;,
      criteria: &apos;Highest total points left on bench&apos;,
      rarity: &apos;common&apos;,
      winner: {
}
        userId: &apos;user7&apos;,
        userName: &apos;Morgan Davis&apos;,
        teamName: &apos;Victory Vampires&apos;,
        value: &apos;87.4 points on bench&apos;,
        context: &apos;King of the wrong lineup decisions&apos;

    },
    {
}
      id: &apos;taco_award&apos;,
      title: &apos;Taco of the Week&apos;,
      description: &apos;Most questionable lineup decisions&apos;,
      category: &apos;silly&apos;,
      icon: &apos;skull&apos;,
      emoji: &apos;🌮&apos;,
      criteria: &apos;Community vote for worst decisions&apos;,
      rarity: &apos;common&apos;,
      winner: {
}
        userId: &apos;user8&apos;,
        userName: &apos;Riley Martinez&apos;,
        teamName: &apos;Elite Eagles&apos;,
        value: &apos;Started injured QB&apos;,
        context: &apos;Sometimes fantasy football is hard&apos;

    },
    {
}
      id: &apos;glass_house&apos;,
      title: &apos;Living in a Glass House&apos;,
      description: &apos;Most trash talk despite poor performance&apos;,
      category: &apos;silly&apos;,
      icon: &apos;zap&apos;,
      emoji: &apos;🏠&apos;,
      criteria: &apos;High trash talk volume + low performance&apos;,
      rarity: &apos;rare&apos;,
      winner: {
}
        userId: &apos;user9&apos;,
        userName: &apos;Avery Thompson&apos;,
        teamName: &apos;Comeback Kings&apos;,
        value: &apos;23 trash talk messages&apos;,
        context: &apos;All talk, questionable walk&apos;

    },
    {
}
      id: &apos;loyalty_badge&apos;,
      title: &apos;Ride or Die&apos;,
      description: &apos;Stuck with struggling player longest&apos;,
      category: &apos;silly&apos;,
      icon: &apos;heart&apos;,
      emoji: &apos;🛡️&apos;,
      criteria: &apos;Kept underperforming drafted player longest&apos;,
      rarity: &apos;rare&apos;,
      winner: {
}
        userId: &apos;user10&apos;,
        userName: &apos;Quinn Anderson&apos;,
        teamName: &apos;Draft Day Demons&apos;,
        value: &apos;Kept Russell Wilson 12 weeks&apos;,
        context: &apos;Loyalty beyond reason&apos;


  ];

  const [superlatives] = useState<Superlative[]>(superlativeDefinitions);

  const getRarityColor = (rarity: Superlative[&apos;rarity&apos;]) => {
}
    switch (rarity) {
}
      case &apos;common&apos;: return &apos;text-gray-400 border-gray-500 bg-gray-500/10&apos;;
      case &apos;rare&apos;: return &apos;text-blue-400 border-blue-500 bg-blue-500/10&apos;;
      case &apos;legendary&apos;: return &apos;text-yellow-400 border-yellow-500 bg-yellow-500/10&apos;;

  };

  const getCategoryColor = (category: Superlative[&apos;category&apos;]) => {
}
    switch (category) {
}
      case &apos;weekly&apos;: return &apos;text-green-400 bg-green-500/20&apos;;
      case &apos;season&apos;: return &apos;text-purple-400 bg-purple-500/20&apos;;
      case &apos;silly&apos;: return &apos;text-orange-400 bg-orange-500/20&apos;;
      default: return &apos;text-gray-400 bg-gray-500/20&apos;;

  };

  const getIconComponent = (icon: string) => {
}
    switch (icon) {
}
      case &apos;trophy&apos;: return <Trophy className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />;
      case &apos;award&apos;: return <Award className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />;
      case &apos;star&apos;: return <Star className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />;
      case &apos;zap&apos;: return <Zap className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />;
      case &apos;crown&apos;: return <Crown className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />;
      case &apos;heart&apos;: return <Heart className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />;
      case &apos;skull&apos;: return <Skull className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />;
      case &apos;target&apos;: return <Target className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />;
      default: return <Award className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />;

  };

  const filteredSuperlatives = selectedCategory === &apos;all&apos; 
    ? superlatives 
    : superlatives.filter((s: any) => s.category === selectedCategory);

  if (isLoading) {
}
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
          {([&apos;all&apos;, &apos;weekly&apos;, &apos;season&apos;, &apos;silly&apos;] as const).map((category: any) => (
}
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}`}
            >
              {category === &apos;all&apos; ? &apos;All Awards&apos; : category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Awards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuperlatives.map((superlative: any) => (
}
          <motion.div
            key={superlative.id}
//             layout
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
}
                    <span className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">Week {superlative.week}</span>
                  )}
                </div>
              </div>
            </div>

            <p className="text-gray-300 text-sm mb-4 sm:px-4 md:px-6 lg:px-8">{superlative.description}</p>

            {/* Winner Display */}
            {superlative.winner && (
}
              <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                  <Crown className="w-4 h-4 text-gold-400 sm:px-4 md:px-6 lg:px-8" />
                  <span className="font-semibold text-white sm:px-4 md:px-6 lg:px-8">{superlative.winner.userName}</span>
                </div>
                <div className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">{superlative.winner.teamName}</div>
                {superlative.winner.value && (
}
                  <div className="text-sm font-bold text-primary-400 sm:px-4 md:px-6 lg:px-8">{superlative.winner.value}</div>
                )}
              </div>
            )}

            {!superlative.winner && (
}
              <div className="text-center py-4 sm:px-4 md:px-6 lg:px-8">
                <Clock className="w-8 h-8 text-gray-500 mx-auto mb-2 sm:px-4 md:px-6 lg:px-8" />
                <div className="text-sm text-gray-500 sm:px-4 md:px-6 lg:px-8">Award pending</div>
                {superlative.category === &apos;silly&apos; && (
}
                  <button
                    onClick={(e) = aria-label="Action button"> {
}
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
}
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: &apos;auto&apos;, opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 pt-4 border-t border-gray-600 space-y-3 sm:px-4 md:px-6 lg:px-8"
                >
                  <div>
                    <div className="text-sm text-gray-400 mb-1 sm:px-4 md:px-6 lg:px-8">Criteria:</div>
                    <div className="text-sm text-gray-200 sm:px-4 md:px-6 lg:px-8">{superlative.criteria}</div>
                  </div>
                  
                  {superlative.winner?.context && (
}
                    <div>
                      <div className="text-sm text-gray-400 mb-1 sm:px-4 md:px-6 lg:px-8">Context:</div>
                      <div className="text-sm text-gray-200 italic sm:px-4 md:px-6 lg:px-8">"{superlative.winner.context}"</div>
                    </div>
                  )}

                  {superlative.runners_up && superlative.runners_up.length > 0 && (
}
                    <div>
                      <div className="text-sm text-gray-400 mb-1 sm:px-4 md:px-6 lg:px-8">Runners-up:</div>
                      <div className="space-y-1 sm:px-4 md:px-6 lg:px-8">
                        {superlative.runners_up.slice(0, 2).map((runner, index) => (
}
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
}
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
}
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
//                     Cancel
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