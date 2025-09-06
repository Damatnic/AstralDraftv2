/**
 * AI Insights Dashboard - Elite Feature
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AIInsight } from '../../types/elite';

export const AIInsightsDashboard: React.FC = () => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate AI insights generation
    const generateInsights = () => {
      const mockInsights: AIInsight[] = [
        {
          id: '1',
          type: 'player_recommendation',
          title: 'Start Josh Jacobs This Week',
          description: 'ML model predicts 85% chance of 15+ fantasy points based on matchup analysis and recent performance trends.',
          confidence: 85,
          impact: 'high',
          playerIds: ['josh-jacobs'],
          timestamp: Date.now() - 1800000, // 30 minutes ago
        },
        {
          id: '2',
          type: 'trade_suggestion',
          title: 'Consider Trading CMC',
          description: 'Market analysis suggests CMC value is at peak. Trade window optimal for next 3 days.',
          confidence: 72,
          impact: 'medium',
          playerIds: ['christian-mccaffrey'],
          timestamp: Date.now() - 3600000, // 1 hour ago
        },
        {
          id: '3',
          type: 'waiver_pickup',
          title: 'High-Value Waiver Targets',
          description: 'AI identifies 3 players with 60%+ chance of breakout performance in next 2 weeks.',
          confidence: 68,
          impact: 'medium',
          timestamp: Date.now() - 7200000, // 2 hours ago
        },
        {
          id: '4',
          type: 'lineup_optimization',
          title: 'Lineup Optimization Available',
          description: 'Current lineup projected for 127.3 points. Optimized lineup could reach 134.7 (+7.4).',
          confidence: 91,
          impact: 'high',
          timestamp: Date.now() - 10800000, // 3 hours ago
        },
      ];

      setInsights(mockInsights);
      setLoading(false);
    };

    const timer = setTimeout(generateInsights, 1500);
    return () => clearTimeout(timer);
  }, []);

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'player_recommendation': return '🎯';
      case 'trade_suggestion': return '🔄';
      case 'waiver_pickup': return '📋';
      case 'lineup_optimization': return '⚡';
      default: return '🧠';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-400';
    if (confidence >= 60) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getImpactColor = (impact: AIInsight['impact']) => {
    switch (impact) {
      case 'high': return 'bg-red-500/20 border-red-500/30 text-red-300';
      case 'medium': return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300';
      case 'low': return 'bg-green-500/20 border-green-500/30 text-green-300';
    }
  };

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    
    if (hours > 0) return `${hours}h ${minutes}m ago`;
    return `${minutes}m ago`;
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <div className="flex items-center space-x-3 mb-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full"
          />
          <h2 className="text-xl font-semibold text-white">AI Insights Loading...</h2>
        </div>
        <p className="text-gray-400">Analyzing player data and market trends...</p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">🧠</div>
          <div>
            <h2 className="text-xl font-semibold text-white">AI Insights</h2>
            <p className="text-gray-400 text-sm">Powered by machine learning</p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 rounded-lg text-sm transition-colors"
        >
          Refresh
        </motion.button>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {insights.map((insight, index) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{getInsightIcon(insight.type)}</div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-medium">{insight.title}</h3>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full border ${getImpactColor(insight.impact)}`}>
                        {insight.impact.toUpperCase()}
                      </span>
                      <span className={`text-sm font-medium ${getConfidenceColor(insight.confidence)}`}>
                        {insight.confidence}%
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-2">{insight.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{formatTime(insight.timestamp)}</span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      View Details →
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-6 pt-4 border-t border-white/10 text-center">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          View All AI Insights →
        </motion.button>
      </div>
    </div>
  );
};
