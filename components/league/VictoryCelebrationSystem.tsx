/**
 * Victory Celebration & Achievement System - Make wins legendary and memorable
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useMemo, useState, useEffect } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { Trophy, Crown, Star, Zap, Target, Award, Medal, Sparkles, Flame, TrendingUp } from &apos;lucide-react&apos;;

interface Achievement {
}
  id: string;
  name: string;
  description: string;
  icon: string;
  category: &apos;weekly&apos; | &apos;season&apos; | &apos;career&apos; | &apos;special&apos;;
  rarity: &apos;common&apos; | &apos;rare&apos; | &apos;epic&apos; | &apos;legendary&apos;;
  points: number;
  unlockedAt?: Date;
  progress?: {
}
    current: number;
    required: number;
  };

interface VictoryType {
}
  type: &apos;weekly_win&apos; | &apos;blowout&apos; | &apos;comeback&apos; | &apos;perfect_lineup&apos; | &apos;highest_score&apos; | &apos;playoff_berth&apos; | &apos;championship&apos;;
  intensity: 1 | 2 | 3 | 4 | 5;
  duration: number; // seconds

}

interface VictoryCelebrationProps {
}
  userId: string;
  userName: string;
  teamName: string;
  leagueId: string;
  onCelebrationComplete?: () => void;}

const VictoryCelebrationSystem: React.FC<VictoryCelebrationProps> = ({
}
  userId,
  userName,
  teamName,
  leagueId,
//   onCelebrationComplete
}: any) => {
}
  const [activeAchievements, setActiveAchievements] = useState<Achievement[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationType, setCelebrationType] = useState<VictoryType | null>(null);
  const [confettiActive, setConfettiActive] = useState(false);

  // Comprehensive achievement definitions for 10-man league
  const achievementDefinitions: Achievement[] = [
    // Weekly Achievements
    {
}
      id: &apos;first_win&apos;,
      name: &apos;Welcome to Victory Lane&apos;,
      description: &apos;Win your first game of the season&apos;,
      icon: &apos;🏆&apos;,
      category: &apos;weekly&apos;,
      rarity: &apos;common&apos;,
      points: 10
    },
    {
}
      id: &apos;blowout_victory&apos;,
      name: &apos;Absolute Domination&apos;,
      description: &apos;Win by 50+ points&apos;,
      icon: &apos;💥&apos;,
      category: &apos;weekly&apos;,
      rarity: &apos;rare&apos;,
      points: 25
    },
    {
}
      id: &apos;comeback_king&apos;,
      name: &apos;Monday Night Miracle&apos;,
      description: &apos;Win after being down 20+ points going into Monday&apos;,
      icon: &apos;🌙&apos;,
      category: &apos;weekly&apos;,
      rarity: &apos;epic&apos;,
      points: 50
    },
    {
}
      id: &apos;perfect_lineup&apos;,
      name: &apos;Crystal Ball Manager&apos;,
      description: &apos;Start the optimal lineup (all players score season-high)&apos;,
      icon: &apos;🔮&apos;,
      category: &apos;weekly&apos;,
      rarity: &apos;legendary&apos;,
      points: 100
    },
    
    // Season-Long Achievements
    {
}
      id: &apos;undefeated_streak&apos;,
      name: &apos;Unstoppable Force&apos;,
      description: &apos;Win 5 games in a row&apos;,
      icon: &apos;🔥&apos;,
      category: &apos;season&apos;,
      rarity: &apos;epic&apos;,
      points: 75
    },
    {
}
      id: &apos;waiver_wire_wizard&apos;,
      name: &apos;Diamond in the Rough&apos;,
      description: &apos;Pick up and start a waiver player who scores 25+ points&apos;,
      icon: &apos;💎&apos;,
      category: &apos;season&apos;,
      rarity: &apos;rare&apos;,
      points: 30
    },
    {
}
      id: &apos;trade_master&apos;,
      name: &apos;Art of the Deal&apos;,
      description: &apos;Complete 3 successful trades that improve your team&apos;,
      icon: &apos;🤝&apos;,
      category: &apos;season&apos;,
      rarity: &apos;rare&apos;,
      points: 40
    },
    {
}
      id: &apos;playoff_berth&apos;,
      name: &apos;Dance Card Secured&apos;,
      description: &apos;Clinch a playoff spot&apos;,
      icon: &apos;🎟️&apos;,
      category: &apos;season&apos;,
      rarity: &apos;common&apos;,
      points: 20
    },
    
    // Special/Fun Achievements
    {
}
      id: &apos;trash_talk_legend&apos;,
      name: &apos;Master of Banter&apos;,
      description: &apos;Send 50 trash talk messages&apos;,
      icon: &apos;🗣️&apos;,
      category: &apos;special&apos;,
      rarity: &apos;rare&apos;,
      points: 15
    },
    {
}
      id: &apos;loyalty_badge&apos;,
      name: &apos;Ride or Die&apos;,
      description: &apos;Keep the same QB all season (min 10 starts)&apos;,
      icon: &apos;🛡️&apos;,
      category: &apos;special&apos;,
      rarity: &apos;rare&apos;,
      points: 25
    },
    {
}
      id: &apos;glass_house&apos;,
      name: &apos;Living Dangerously&apos;,
      description: &apos;Start 5 rookies in one week&apos;,
      icon: &apos;🏠&apos;,
      category: &apos;special&apos;,
      rarity: &apos;epic&apos;,
      points: 60

  ];

  // Victory celebration animations and effects
  const celebrationEffects = {
}
    weekly_win: {
}
      confetti: true,
      duration: 3000,
      message: &apos;Victory is Yours!&apos;,
      animation: &apos;bounce&apos;,
      color: &apos;text-green-400&apos;
    },
    blowout: {
}
      confetti: true,
      duration: 4000,
      message: &apos;TOTAL DOMINATION!&apos;,
      animation: &apos;explode&apos;,
      color: &apos;text-red-400&apos;
    },
    comeback: {
}
      confetti: true,
      duration: 5000,
      message: &apos;MIRACLE COMEBACK!&apos;,
      animation: &apos;dramatic&apos;,
      color: &apos;text-purple-400&apos;
    },
    perfect_lineup: {
}
      confetti: true,
      duration: 6000,
      message: &apos;PERFECT LINEUP!&apos;,
      animation: &apos;legendary&apos;,
      color: &apos;text-yellow-400&apos;
    },
    highest_score: {
}
      confetti: true,
      duration: 4000,
      message: &apos;WEEKLY HIGH SCORE!&apos;,
      animation: &apos;fire&apos;,
      color: &apos;text-orange-400&apos;
    },
    playoff_berth: {
}
      confetti: true,
      duration: 5000,
      message: &apos;PLAYOFFS BABY!&apos;,
      animation: &apos;championship&apos;,
      color: &apos;text-blue-400&apos;
    },
    championship: {
}
      confetti: true,
      duration: 10000,
      message: &apos;LEAGUE CHAMPION!&apos;,
      animation: &apos;ultimate&apos;,
      color: &apos;text-gold-400&apos;

  };

  // Trigger celebration based on game results
  const triggerCelebration = (type: VictoryType[&apos;type&apos;], gameData?: any) => {
}
    const celebration = celebrationEffects[type];
    setCelebrationType({
}
      type,
      intensity: Math.min(5, Math.max(1, Math.floor(Math.random() * 5) + 1)) as VictoryType[&apos;intensity&apos;],
      duration: celebration.duration
    });
    setShowCelebration(true);
    setConfettiActive(true);

    // Check for new achievements
    checkForNewAchievements(type, gameData);

    // Auto-hide after duration
    setTimeout(() => {
}
      setShowCelebration(false);
      setConfettiActive(false);
      onCelebrationComplete?.();
    }, celebration.duration);
  };

  const checkForNewAchievements = (victoryType: string, gameData?: any) => {
}
    const newAchievements: Achievement[] = [];
    
    // Mock achievement checking logic
    achievementDefinitions.forEach((achievement: any) => {
}
      // In real implementation, check actual game data and user stats
      if (Math.random() > 0.8) { // Mock 20% chance of unlocking
}
        newAchievements.push({
}
          ...achievement,
          unlockedAt: new Date()
        });

    });

    setActiveAchievements(newAchievements);
  };

  const getRarityColor = (rarity: Achievement[&apos;rarity&apos;]) => {
}
    switch (rarity) {
}
      case &apos;common&apos;: return &apos;text-gray-400 border-gray-500&apos;;
      case &apos;rare&apos;: return &apos;text-blue-400 border-blue-500&apos;;
      case &apos;epic&apos;: return &apos;text-purple-400 border-purple-500&apos;;
      case &apos;legendary&apos;: return &apos;text-yellow-400 border-yellow-500&apos;;

  };

  const getRarityGlow = (rarity: Achievement[&apos;rarity&apos;]) => {
}
    switch (rarity) {
}
      case &apos;common&apos;: return &apos;shadow-lg&apos;;
      case &apos;rare&apos;: return &apos;shadow-blue-500/50 shadow-lg&apos;;
      case &apos;epic&apos;: return &apos;shadow-purple-500/50 shadow-xl&apos;;
      case &apos;legendary&apos;: return &apos;shadow-yellow-500/50 shadow-2xl&apos;;

  };

  if (isLoading) {
}
    return (
      <div className="flex justify-center items-center p-4 sm:px-4 md:px-6 lg:px-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 sm:px-4 md:px-6 lg:px-8"></div>
        <span className="ml-2 sm:px-4 md:px-6 lg:px-8">Loading...</span>
      </div>
    );

  return (
    <>
      {/* Confetti Effect */}
      {confettiActive && (
}
        <div className="fixed inset-0 pointer-events-none z-[1090] sm:px-4 md:px-6 lg:px-8">
          {[...Array(50)].map((_, i) => (
}
            <motion.div
              key={i}
              className={`absolute w-3 h-3 ${
}
                [&apos;bg-red-400&apos;, &apos;bg-blue-400&apos;, &apos;bg-green-400&apos;, &apos;bg-yellow-400&apos;, &apos;bg-purple-400&apos;][i % 5]
              }`}
              style={{
}
                left: `${Math.random() * 100}%`,
                top: &apos;-5%&apos;
              }}
              animate={{
}
                y: [0, window.innerHeight + 50],
                rotate: [0, 360, 720],
                opacity: [1, 1, 0]
              }}
              transition={{
}
                duration: Math.random() * 3 + 2,
                ease: "easeOut",
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
      )}

      {/* Victory Celebration Modal */}
      <AnimatePresence>
        {showCelebration && celebrationType && (
}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1100] sm:px-4 md:px-6 lg:px-8"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ 
}
                scale: [0.5, 1.1, 1], 
                opacity: 1,
                rotate: [0, 5, -5, 0]
              }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ 
}
                type: "spring", 
                stiffness: 200, 
                damping: 20,
                times: [0, 0.6, 0.8, 1]
              }}
              className="bg-dark-800 rounded-2xl p-8 border-2 border-gold-500 shadow-2xl shadow-gold-500/30 text-center max-w-md w-full mx-4 sm:px-4 md:px-6 lg:px-8"
            >
              {/* Victory Icon */}
              <motion.div
                animate={{ 
}
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
}
                  repeat: Infinity,
                  duration: 2
                }}
                className="flex justify-center mb-4 sm:px-4 md:px-6 lg:px-8"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-gold-400 to-yellow-500 rounded-full flex items-center justify-center sm:px-4 md:px-6 lg:px-8">
                  <Crown className="w-10 h-10 text-white sm:px-4 md:px-6 lg:px-8" />
                </div>
              </motion.div>

              {/* Victory Message */}
              <motion.h2
                animate={{ 
}
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
}
                  repeat: Infinity,
                  duration: 1.5
                }}
                className={`text-3xl font-bold mb-2 ${celebrationEffects[celebrationType.type].color}`}
              >
                {celebrationEffects[celebrationType.type].message}
              </motion.h2>

              <p className="text-xl text-white mb-4 sm:px-4 md:px-6 lg:px-8">{userName}</p>
              <p className="text-lg text-gray-300 mb-6 sm:px-4 md:px-6 lg:px-8">{teamName}</p>

              {/* Sparkle Effects */}
              <div className="relative sm:px-4 md:px-6 lg:px-8">
                {[...Array(8)].map((_, i) => (
}
                  <motion.div
                    key={i}
                    className="absolute sm:px-4 md:px-6 lg:px-8"
                    style={{
}
                      left: `${20 + (i * 10)}%`,
                      top: `${20 + (i % 2 * 40)}%`
                    }}
                    animate={{
}
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
}
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  >
                    <Sparkles className="w-4 h-4 text-yellow-400 sm:px-4 md:px-6 lg:px-8" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement Unlocked Notifications */}
      <AnimatePresence>
        {activeAchievements.map((achievement, index) => (
}
          <motion.div
            key={achievement.id}
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ delay: index * 0.5 }}
            className="fixed top-20 right-4 z-[1050] max-w-sm sm:px-4 md:px-6 lg:px-8"
            style={{ top: `${5 + index * 7}rem` }}
          >
            <div className={`bg-dark-800 rounded-lg border-2 ${getRarityColor(achievement.rarity)} p-4 ${getRarityGlow(achievement.rarity)}`}>
              <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="text-3xl sm:px-4 md:px-6 lg:px-8"
                >
                  {achievement.icon}
                </motion.div>
                <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                  <h3 className="font-bold text-white text-sm sm:px-4 md:px-6 lg:px-8">Achievement Unlocked!</h3>
                  <p className="text-white font-semibold sm:px-4 md:px-6 lg:px-8">{achievement.name}</p>
                  <p className="text-gray-300 text-xs sm:px-4 md:px-6 lg:px-8">{achievement.description}</p>
                  <div className="flex items-center gap-2 mt-1 sm:px-4 md:px-6 lg:px-8">
                    <span className="text-xs text-yellow-400 sm:px-4 md:px-6 lg:px-8">+{achievement.points} XP</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getRarityColor(achievement.rarity)}`}>
                      {achievement.rarity.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Test Celebration Buttons (for development/testing) */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 sm:px-4 md:px-6 lg:px-8">
        <button
          onClick={() => triggerCelebration(&apos;weekly_win&apos;)}
        >
          🏆 Victory
        </button>
        <button
          onClick={() => triggerCelebration(&apos;blowout&apos;)}
        >
          💥 Blowout
        </button>
        <button
          onClick={() => triggerCelebration(&apos;championship&apos;)}
        >
          👑 Championship
        </button>
      </div>
    </>
  );
};

const VictoryCelebrationSystemWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <VictoryCelebrationSystem {...props} />
  </ErrorBoundary>
);

export default React.memo(VictoryCelebrationSystemWithErrorBoundary);