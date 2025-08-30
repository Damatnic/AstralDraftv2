/**
 * Enhanced League Experience Hub - The ultimate 10-man league experience center
 * Integrates all specialized agent systems for maximum engagement and fun
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown, Trophy, Users, Star, Flame, Target, Camera, 
  MessageSquare, BarChart3, Calendar, Zap, Heart,
  ChevronRight, TrendingUp, Award, Palette
} from 'lucide-react';

// Import all our specialized components
import TrashTalkSystem from '../components/league/TrashTalkSystem';
import VictoryCelebrationSystem from '../components/league/VictoryCelebrationSystem';
import WeeklyPowerRankings from '../components/league/WeeklyPowerRankings';
import WeeklyChallengeSystem from '../components/league/WeeklyChallengeSystem';
import LeagueSuperlativesSystem from '../components/league/LeagueSuperlativesSystem';
import RivalryTracker from '../components/league/RivalryTracker';
import TeamIdentityCustomizer from '../components/league/TeamIdentityCustomizer';
import LeagueMemorySystem from '../components/league/LeagueMemorySystem';

interface EnhancedLeagueExperienceHubProps {
  leagueId: string;
  userId: string;
  userName: string;
  teamName: string;
  currentWeek: number;
}

interface LeagueStats {
  totalMessages: number;
  totalMemories: number;
  completedChallenges: number;
  achievementPoints: number;
  rivalries: number;
  activeStreaks: number;
}

const EnhancedLeagueExperienceHub: React.FC<EnhancedLeagueExperienceHubProps> = ({
  leagueId,
  userId,
  userName,
  teamName,
  currentWeek
}) => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [leagueStats, setLeagueStats] = useState<LeagueStats>({
    totalMessages: 247,
    totalMemories: 43,
    completedChallenges: 12,
    achievementPoints: 1250,
    rivalries: 5,
    activeStreaks: 3
  });

  // Mock team data for demonstrations
  const mockTeams = [
    { id: 'team1', name: 'Dynasty Destroyers', owner: 'Mike Johnson', record: { wins: 8, losses: 3 }, stats: {} },
    { id: 'team2', name: 'Gridiron Gladiators', owner: 'Sarah Chen', record: { wins: 7, losses: 4 }, stats: {} },
    { id: 'team3', name: 'Fantasy Phenoms', owner: 'Alex Rodriguez', record: { wins: 9, losses: 2 }, stats: {} },
    { id: 'team4', name: 'Championship Chasers', owner: 'Jordan Smith', record: { wins: 6, losses: 5 }, stats: {} },
    { id: 'team5', name: 'Playoff Predators', owner: 'Taylor Brown', record: { wins: 8, losses: 3 }, stats: {} },
    { id: 'team6', name: 'Touchdown Titans', owner: 'Casey Wilson', record: { wins: 5, losses: 6 }, stats: {} },
    { id: 'team7', name: 'Victory Vampires', owner: 'Morgan Davis', record: { wins: 4, losses: 7 }, stats: {} },
    { id: 'team8', name: 'Elite Eagles', owner: 'Riley Martinez', record: { wins: 7, losses: 4 }, stats: {} },
    { id: 'team9', name: 'Comeback Kings', owner: 'Avery Thompson', record: { wins: 3, losses: 8 }, stats: {} },
    { id: 'team10', name: 'Draft Day Demons', owner: 'Quinn Anderson', record: { wins: 6, losses: 5 }, stats: {} }
  ];

  const mockLeagueMembers = mockTeams.map(team => ({
    id: team.id,
    name: team.name,
    teamName: team.name,
    avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${team.owner}`
  }));

  const sections = [
    { 
      id: 'overview', 
      title: 'League Overview', 
      icon: Crown, 
      color: 'text-gold-400',
      description: 'Complete league experience dashboard'
    },
    { 
      id: 'trash-talk', 
      title: 'Trash Talk Central', 
      icon: MessageSquare, 
      color: 'text-red-400',
      description: 'Elite banter and GIF battles'
    },
    { 
      id: 'power-rankings', 
      title: 'AI Power Rankings', 
      icon: BarChart3, 
      color: 'text-purple-400',
      description: 'Weekly intelligent analysis'
    },
    { 
      id: 'challenges', 
      title: 'Weekly Challenges', 
      icon: Target, 
      color: 'text-green-400',
      description: 'Earn points and badges'
    },
    { 
      id: 'superlatives', 
      title: 'League Awards', 
      icon: Award, 
      color: 'text-yellow-400',
      description: 'Recognition and fun callouts'
    },
    { 
      id: 'rivalries', 
      title: 'Rivalry Tracker', 
      icon: Flame, 
      color: 'text-orange-400',
      description: 'Epic head-to-head battles'
    },
    { 
      id: 'team-identity', 
      title: 'Team Identity', 
      icon: Palette, 
      color: 'text-blue-400',
      description: 'Customize your team style'
    },
    { 
      id: 'memories', 
      title: 'League Memories', 
      icon: Camera, 
      color: 'text-pink-400',
      description: 'Photo sharing and moments'
    }
  ];

  const handleVictoryCelebration = () => {
    // This would be triggered by actual game events
    console.log('Victory celebration triggered!');
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome to the Ultimate League Experience! 🏆</h1>
            <p className="text-lg opacity-90">
              Your 10-man league has been enhanced with legendary features. Week {currentWeek} is ready for domination!
            </p>
          </div>
          <div className="text-6xl animate-bounce">⚡</div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Trash Talk Messages', value: leagueStats.totalMessages, icon: MessageSquare, color: 'text-red-400' },
          { label: 'League Memories', value: leagueStats.totalMemories, icon: Camera, color: 'text-pink-400' },
          { label: 'Challenges Completed', value: leagueStats.completedChallenges, icon: Target, color: 'text-green-400' },
          { label: 'Achievement Points', value: leagueStats.achievementPoints, icon: Star, color: 'text-yellow-400' },
          { label: 'Active Rivalries', value: leagueStats.rivalries, icon: Flame, color: 'text-orange-400' },
          { label: 'Win Streaks', value: leagueStats.activeStreaks, icon: TrendingUp, color: 'text-blue-400' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-dark-700 rounded-lg p-4 border border-gray-600 text-center"
          >
            <div className={`${stat.color} mb-2`}>
              <stat.icon className="w-6 h-6 mx-auto" />
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-xs text-gray-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* This Week's Highlights */}
        <div className="bg-dark-700 rounded-xl p-6 border border-gray-600">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            This Week's Highlights
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-dark-600 rounded-lg">
              <div className="text-2xl">🏆</div>
              <div>
                <div className="font-semibold text-white">Weekly High Scorer</div>
                <div className="text-sm text-gray-400">Mike Johnson • 156.8 points</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-dark-600 rounded-lg">
              <div className="text-2xl">💔</div>
              <div>
                <div className="font-semibold text-white">Heartbreaker Loss</div>
                <div className="text-sm text-gray-400">Sarah Chen • Lost by 0.34 points</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-dark-600 rounded-lg">
              <div className="text-2xl">🎯</div>
              <div>
                <div className="font-semibold text-white">Challenge Champion</div>
                <div className="text-sm text-gray-400">Alex Rodriguez • Score Predictor</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-dark-700 rounded-xl p-6 border border-gray-600">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-green-400" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Send Trash Talk', section: 'trash-talk', icon: MessageSquare, color: 'bg-red-600' },
              { label: 'Join Challenge', section: 'challenges', icon: Target, color: 'bg-green-600' },
              { label: 'Upload Memory', section: 'memories', icon: Camera, color: 'bg-pink-600' },
              { label: 'Check Rivalries', section: 'rivalries', icon: Flame, color: 'bg-orange-600' }
            ].map(action => (
              <button
                key={action.label}
                onClick={() => setActiveSection(action.section)}
                className={`${action.color} hover:opacity-80 text-white p-3 rounded-lg transition-opacity flex items-center gap-2 text-sm font-semibold`}
              >
                <action.icon className="w-4 h-4" />
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-dark-700 rounded-xl p-6 border border-gray-600">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-400" />
          Recent League Activity
        </h3>
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {[
            { type: 'trash_talk', user: 'Mike Johnson', action: 'roasted Taylor Brown about their lineup decisions', time: '2 minutes ago', icon: '🔥' },
            { type: 'memory', user: 'Sarah Chen', action: 'uploaded a photo from draft day', time: '15 minutes ago', icon: '📸' },
            { type: 'challenge', user: 'Alex Rodriguez', action: 'won the Score Predictor challenge', time: '1 hour ago', icon: '🎯' },
            { type: 'rivalry', user: 'Jordan Smith', action: 'extended their win streak vs Casey Wilson', time: '2 hours ago', icon: '⚔️' },
            { type: 'achievement', user: 'Taylor Brown', action: 'unlocked the "Comeback King" badge', time: '3 hours ago', icon: '👑' },
            { type: 'celebration', user: 'Casey Wilson', action: 'celebrated their victory with confetti', time: '4 hours ago', icon: '🎉' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-dark-600 rounded-lg hover:bg-dark-500 transition-colors">
              <div className="text-xl">{activity.icon}</div>
              <div className="flex-1">
                <div className="text-white text-sm">
                  <span className="font-semibold">{activity.user}</span> {activity.action}
                </div>
                <div className="text-xs text-gray-500">{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'trash-talk':
        return (
          <TrashTalkSystem
            leagueId={leagueId}
            currentUserId={userId}
            currentUserName={userName}
            leagueMembers={mockLeagueMembers}
          />
        );
      case 'power-rankings':
        return (
          <WeeklyPowerRankings
            leagueId={leagueId}
            week={currentWeek}
            teams={[]}
          />
        );
      case 'challenges':
        return (
          <WeeklyChallengeSystem
            leagueId={leagueId}
            userId={userId}
            userName={userName}
            week={currentWeek}
          />
        );
      case 'superlatives':
        return (
          <LeagueSuperlativesSystem
            leagueId={leagueId}
            currentWeek={currentWeek}
            teams={mockTeams}
          />
        );
      case 'rivalries':
        return (
          <RivalryTracker
            leagueId={leagueId}
            userId={userId}
            currentWeek={currentWeek}
            teams={mockTeams}
          />
        );
      case 'team-identity':
        return (
          <TeamIdentityCustomizer
            teamId={userId}
            onSave={(identity) => console.log('Saving identity:', identity)}
            onPreview={(identity) => console.log('Previewing identity:', identity)}
          />
        );
      case 'memories':
        return (
          <LeagueMemorySystem
            leagueId={leagueId}
            userId={userId}
            userName={userName}
          />
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-slate-900 to-dark-950 text-white">
      {/* Victory Celebration System - Always Active */}
      <VictoryCelebrationSystem
        userId={userId}
        userName={userName}
        teamName={teamName}
        leagueId={leagueId}
        onCelebrationComplete={handleVictoryCelebration}
      />

      <div className="flex h-screen">
        {/* Sidebar Navigation */}
        <motion.div 
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className="w-80 bg-dark-800 border-r border-gray-700 flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <Crown className="w-8 h-8 text-gold-400" />
              <div>
                <h1 className="text-xl font-bold">League Experience Hub</h1>
                <p className="text-sm text-gray-400">Elite 10-Man Fantasy</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-primary-600/20 border border-primary-600/30 rounded-lg">
              <div className="font-semibold text-primary-400">{teamName}</div>
              <div className="text-sm text-gray-300">{userName}</div>
              <div className="text-xs text-gray-500">Week {currentWeek} • Season 2024</div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left p-3 rounded-lg transition-all group ${
                  activeSection === section.id
                    ? 'bg-primary-600 text-white'
                    : 'hover:bg-dark-700 text-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <section.icon className={`w-5 h-5 ${
                      activeSection === section.id ? 'text-white' : section.color
                    }`} />
                    <div>
                      <div className="font-semibold">{section.title}</div>
                      <div className="text-xs opacity-70">{section.description}</div>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${
                    activeSection === section.id ? 'rotate-90' : 'group-hover:translate-x-1'
                  }`} />
                </div>
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700">
            <div className="text-center text-xs text-gray-500">
              🚀 Powered by Fantasy Football AI
              <div className="mt-1">Making leagues legendary since 2024</div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderActiveSection()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedLeagueExperienceHub;