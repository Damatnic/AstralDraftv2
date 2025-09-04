/**
 * Real-time Fantasy Ticker - Elite Feature
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TickerItem {
  id: string;
  type: 'trade' | 'pickup' | 'injury' | 'news' | 'score';
  message: string;
  timestamp: number;
  urgency: 'low' | 'medium' | 'high';
}

export const RealTimeTicker: React.FC = () => {
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Simulate real-time updates
    const generateTickerUpdate = () => {
      const updates: TickerItem[] = [
        {
          id: '1',
          type: 'trade',
          message: '🔄 TeamMate traded CMC for Davante Adams + 1st round pick',
          timestamp: Date.now(),
          urgency: 'high',
        },
        {
          id: '2',
          type: 'pickup',
          message: '📋 FantasyPro picked up Gus Edwards from waivers',
          timestamp: Date.now() - 120000,
          urgency: 'medium',
        },
        {
          id: '3',
          type: 'injury',
          message: '🏥 Josh Jacobs listed as questionable for Sunday',
          timestamp: Date.now() - 300000,
          urgency: 'high',
        },
        {
          id: '4',
          type: 'news',
          message: '📰 Tua Tagovailoa cleared for return to practice',
          timestamp: Date.now() - 600000,
          urgency: 'medium',
        },
        {
          id: '5',
          type: 'score',
          message: '⚡ Live: Chiefs 14 - Bills 7 (2nd Quarter)',
          timestamp: Date.now() - 900000,
          urgency: 'low',
        },
      ];

      setTickerItems(updates);
    };

    generateTickerUpdate();
    
    // Update ticker every 10 seconds
    const interval = setInterval(generateTickerUpdate, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (tickerItems.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tickerItems.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [tickerItems.length]);

  const getTypeIcon = (type: TickerItem['type']) => {
    switch (type) {
      case 'trade': return '🔄';
      case 'pickup': return '📋';
      case 'injury': return '🏥';
      case 'news': return '📰';
      case 'score': return '⚡';
      default: return '📈';
    }
  };

  const getUrgencyColor = (urgency: TickerItem['urgency']) => {
    switch (urgency) {
      case 'high': return 'from-red-500 to-orange-500';
      case 'medium': return 'from-yellow-500 to-orange-500';
      case 'low': return 'from-blue-500 to-purple-500';
    }
  };

  if (tickerItems.length === 0) {
    return null;
  }

  const currentItem = tickerItems[currentIndex];

  return (
    <div className="bg-black/20 backdrop-blur-md border border-white/20 rounded-lg overflow-hidden">
      <div className="flex items-center">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-3 py-2 text-white font-medium text-sm">
          LIVE
        </div>
        
        <div className="flex-1 relative h-10 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentItem.id}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center px-4"
            >
              <span className="text-lg mr-2">{getTypeIcon(currentItem.type)}</span>
              <span className="text-white text-sm truncate">{currentItem.message}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="px-3 py-2">
          <div className="flex space-x-1">
            {tickerItems.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-blue-400' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
