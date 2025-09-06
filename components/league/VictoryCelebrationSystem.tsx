/**
 * Victory Celebration & Achievement System - Make wins legendary and memorable
 */

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Crown, Star, Zap, Target, Award, Medal, Sparkles, Flame, TrendingUp } from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'weekly' | 'season' | 'career' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  unlockedAt?: Date;
  progress?: {
    current: number;
    required: number;
  };

interface VictoryType {
  type: 'weekly_win' | 'blowout' | 'comeback' | 'perfect_lineup' | 'highest_score' | 'playoff_berth' | 'championship';
  intensity: 1 | 2 | 3 | 4 | 5;
  duration: number; // seconds
}

interface VictoryCelebrationProps {
  userId: string;
  userName: string;
  teamName: string;
  leagueId: string;
  onCelebrationComplete?: () => void;}

const VictoryCelebrationSystem: React.FC<VictoryCelebrationProps> = ({
  userId,
  userName,
  teamName,
  leagueId,
//   onCelebrationComplete
}: any) => {
  const [activeAchievements, setActiveAchievements] = useState<Achievement[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationType, setCelebrationType] = useState<VictoryType | null>(null);
  const [confettiActive, setConfettiActive] = useState(false);

  // Comprehensive achievement definitions for 10-man league
  const achievementDefinitions: Achievement[] = [
    // Weekly Achievements
    {
      id: 'first_win',
      name: 'Welcome to Victory Lane',
      description: 'Win your first game of the season',
      icon: '🏆',
      category: 'weekly',
      rarity: 'common',
      points: 10
    },
    {
      id: 'blowout_victory',
      name: 'Absolute Domination',
      description: 'Win by 50+ points',
      icon: '💥',
      category: 'weekly',
      rarity: 'rare',
      points: 25
    },
    {
      id: 'comeback_king',
      name: 'Monday Night Miracle',
      description: 'Win after being down 20+ points going into Monday',
      icon: '🌙',
      category: 'weekly',
      rarity: 'epic',
      points: 50
    },
    {
      id: 'perfect_lineup',
      name: 'Crystal Ball Manager',
      description: 'Start the optimal lineup (all players score season-high)',
      icon: '🔮',
      category: 'weekly',
      rarity: 'legendary',
      points: 100
    },
    
    // Season-Long Achievements
    {
      id: 'undefeated_streak',
      name: 'Unstoppable Force',
      description: 'Win 5 games in a row',
      icon: '🔥',
      category: 'season',
      rarity: 'epic',
      points: 75
    },
    {
      id: 'waiver_wire_wizard',
      name: 'Diamond in the Rough',
      description: 'Pick up and start a waiver player who scores 25+ points',
      icon: '💎',
      category: 'season',
      rarity: 'rare',
      points: 30
    },
    {
      id: 'trade_master',
      name: 'Art of the Deal',
      description: 'Complete 3 successful trades that improve your team',
      icon: '🤝',
      category: 'season',
      rarity: 'rare',
      points: 40
    },
    {
      id: 'playoff_berth',
      name: 'Dance Card Secured',
      description: 'Clinch a playoff spot',
      icon: '🎟️',
      category: 'season',
      rarity: 'common',
      points: 20
    },
    
    // Special/Fun Achievements
    {
      id: 'trash_talk_legend',
      name: 'Master of Banter',
      description: 'Send 50 trash talk messages',
      icon: '🗣️',
      category: 'special',
      rarity: 'rare',
      points: 15
    },
    {
      id: 'loyalty_badge',
      name: 'Ride or Die',
      description: 'Keep the same QB all season (min 10 starts)',
      icon: '🛡️',
      category: 'special',
      rarity: 'rare',
      points: 25
    },
    {
      id: 'glass_house',
      name: 'Living Dangerously',
      description: 'Start 5 rookies in one week',
      icon: '🏠',
      category: 'special',
      rarity: 'epic',
      points: 60

  ];

  // Victory celebration animations and effects
  const celebrationEffects = {
    weekly_win: {
      confetti: true,
      duration: 3000,
      message: 'Victory is Yours!',
      animation: 'bounce',
      color: 'text-green-400'
    },
    blowout: {
      confetti: true,
      duration: 4000,
      message: 'TOTAL DOMINATION!',
      animation: 'explode',
      color: 'text-red-400'
    },
    comeback: {
      confetti: true,
      duration: 5000,
      message: 'MIRACLE COMEBACK!',
      animation: 'dramatic',
      color: 'text-purple-400'
    },
    perfect_lineup: {
      confetti: true,
      duration: 6000,
      message: 'PERFECT LINEUP!',
      animation: 'legendary',
      color: 'text-yellow-400'
    },
    highest_score: {
      confetti: true,
      duration: 4000,
      message: 'WEEKLY HIGH SCORE!',
      animation: 'fire',
      color: 'text-orange-400'
    },
    playoff_berth: {
      confetti: true,
      duration: 5000,
      message: 'PLAYOFFS BABY!',
      animation: 'championship',
      color: 'text-blue-400'
    },
    championship: {
      confetti: true,
      duration: 10000,
      message: 'LEAGUE CHAMPION!',
      animation: 'ultimate',
      color: 'text-gold-400'

  };

  // Trigger celebration based on game results
  const triggerCelebration = (type: VictoryType['type'], gameData?: any) => {
    const celebration = celebrationEffects[type];
    setCelebrationType({
      type,
      intensity: Math.min(5, Math.max(1, Math.floor(Math.random() * 5) + 1)) as VictoryType['intensity'],
      duration: celebration.duration
    });
    setShowCelebration(true);
    setConfettiActive(true);

    // Check for new achievements
    checkForNewAchievements(type, gameData);

    // Auto-hide after duration
    setTimeout(() => {
      setShowCelebration(false);
      setConfettiActive(false);
      onCelebrationComplete?.();
    }, celebration.duration);
  };

  const checkForNewAchievements = (victoryType: string, gameData?: any) => {
    const newAchievements: Achievement[] = [];
    
    // Mock achievement checking logic
    achievementDefinitions.forEach((achievement: any) => {
      // In real implementation, check actual game data and user stats
      if (Math.random() > 0.8) { // Mock 20% chance of unlocking
        newAchievements.push({
          ...achievement,
          unlockedAt: new Date()
        });

    });

    setActiveAchievements(newAchievements);
  };

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-500';
      case 'rare': return 'text-blue-400 border-blue-500';
      case 'epic': return 'text-purple-400 border-purple-500';
      case 'legendary': return 'text-yellow-400 border-yellow-500';

  };

  const getRarityGlow = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'shadow-lg';
      case 'rare': return 'shadow-blue-500/50 shadow-lg';
      case 'epic': return 'shadow-purple-500/50 shadow-xl';
      case 'legendary': return 'shadow-yellow-500/50 shadow-2xl';

  };

  if (isLoading) {
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
        <div className="fixed inset-0 pointer-events-none z-[1090] sm:px-4 md:px-6 lg:px-8">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-3 h-3 ${
                ['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400'][i % 5]
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: '-5%'
              }}
              animate={{
                y: [0, window.innerHeight + 50],
                rotate: [0, 360, 720],
                opacity: [1, 1, 0]
              }}
              transition={{
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1100] sm:px-4 md:px-6 lg:px-8"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ 
                scale: [0.5, 1.1, 1], 
                opacity: 1,
                rotate: [0, 5, -5, 0]
              }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ 
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
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
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
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
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
                  <motion.div
                    key={i}
                    className="absolute sm:px-4 md:px-6 lg:px-8"
                    style={{
                      left: `${20 + (i * 10)}%`,
                      top: `${20 + (i % 2 * 40)}%`
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
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
          onClick={() => triggerCelebration('weekly_win')}
        >
          🏆 Victory
        </button>
        <button
          onClick={() => triggerCelebration('blowout')}
        >
          💥 Blowout
        </button>
        <button
          onClick={() => triggerCelebration('championship')}
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