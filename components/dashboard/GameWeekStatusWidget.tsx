/**
 * Game Week Status Widget
 * Shows current NFL week, game times, and scoring period status
 */

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Widget } from '../ui/Widget';
import { CalendarIcon } from '../icons/CalendarIcon';
import { 
  getCurrentNFLWeek, 
//   SEASON_DATES_2025 
} from '../../data/leagueData';
import {
  getTimeUntilNextGameSlate,
  areGamesLive,
//   getScoringPeriodStatus
} from '../../services/seasonSyncService';

const GameWeekStatusWidget: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextGameInfo, setNextGameInfo] = useState(getTimeUntilNextGameSlate());
  const [gamesLive, setGamesLive] = useState(areGamesLive());
  
  const currentWeek = getCurrentNFLWeek();
  const scoringStatus = getScoringPeriodStatus(currentWeek);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setNextGameInfo(getTimeUntilNextGameSlate());
      setGamesLive(areGamesLive());
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);
  
  const getWeekDateRange = (week: number): string => {
    const seasonStart = SEASON_DATES_2025.seasonStart;
    const weekStart = new Date(seasonStart);
    weekStart.setDate(seasonStart.getDate() + (week - 1) * 7);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };
    
    return `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;
  };
  
  const getGameSlateSchedule = () => {
    const schedule = [
      { day: 'THU', time: '8:20 PM ET', active: nextGameInfo.slateType === 'Thursday' },
      { day: 'SUN', time: '1:00 PM ET', active: nextGameInfo.slateType === 'Sunday Early' },
      { day: 'SUN', time: '4:25 PM ET', active: nextGameInfo.slateType === 'Sunday Late' },
      { day: 'SUN', time: '8:20 PM ET', active: nextGameInfo.slateType === 'Sunday Night' },
      { day: 'MON', time: '8:15 PM ET', active: nextGameInfo.slateType === 'Monday' }
    ];
    
    return schedule;
  };
  
  return (
    <Widget>
      title="NFL Week Status" 
      icon={<CalendarIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />}
      className="col-span-1 sm:px-4 md:px-6 lg:px-8"
    >
      <div className="p-4 space-y-4 sm:px-4 md:px-6 lg:px-8">
        {/* Current Week Header */}
        <div className="text-center sm:px-4 md:px-6 lg:px-8">
          <div className="text-3xl font-bold text-cyan-400 sm:px-4 md:px-6 lg:px-8">
            Week {currentWeek}
          </div>
          <div className="text-sm text-gray-400 mt-1 sm:px-4 md:px-6 lg:px-8">
            {getWeekDateRange(currentWeek)}
          </div>
        </div>
        
        {/* Live Indicator */}
        {gamesLive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-center sm:px-4 md:px-6 lg:px-8"
          >
            <div className="flex items-center justify-center gap-2 sm:px-4 md:px-6 lg:px-8">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse sm:px-4 md:px-6 lg:px-8" />
              <span className="text-red-400 font-medium sm:px-4 md:px-6 lg:px-8">GAMES LIVE</span>
            </div>
          </motion.div>
        )}
        
        {/* Scoring Period Progress */}
        <div>
          <div className="flex justify-between text-xs text-gray-400 mb-2 sm:px-4 md:px-6 lg:px-8">
            <span>Scoring Period</span>
            <span>{scoringStatus.percentComplete}% Complete</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 sm:px-4 md:px-6 lg:px-8">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${scoringStatus.percentComplete}%` }}
              transition={{ duration: 0.5 }}
              className={`h-2 rounded-full ${
                scoringStatus.isComplete 
                  ? 'bg-green-500' 
                  : scoringStatus.isActive 
                  ? 'bg-yellow-500' 
                  : 'bg-blue-500'
              }`}
            />
          </div>
        </div>
        
        {/* Next Game Countdown */}
        {!gamesLive && (
          <div className="bg-gray-800/50 rounded-lg p-3 sm:px-4 md:px-6 lg:px-8">
            <div className="text-xs text-gray-400 mb-2 sm:px-4 md:px-6 lg:px-8">Next Games</div>
            <div className="text-center sm:px-4 md:px-6 lg:px-8">
              <div className="text-lg font-bold text-white sm:px-4 md:px-6 lg:px-8">
                {nextGameInfo.slateType}
              </div>
              <div className="flex items-center justify-center gap-3 mt-2 sm:px-4 md:px-6 lg:px-8">
                <div className="text-center sm:px-4 md:px-6 lg:px-8">
                  <div className="text-2xl font-mono font-bold text-cyan-400 sm:px-4 md:px-6 lg:px-8">
                    {nextGameInfo.days}
                  </div>
                  <div className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">days</div>
                </div>
                <div className="text-gray-500 sm:px-4 md:px-6 lg:px-8">:</div>
                <div className="text-center sm:px-4 md:px-6 lg:px-8">
                  <div className="text-2xl font-mono font-bold text-cyan-400 sm:px-4 md:px-6 lg:px-8">
                    {nextGameInfo.hours.toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">hours</div>
                </div>
                <div className="text-gray-500 sm:px-4 md:px-6 lg:px-8">:</div>
                <div className="text-center sm:px-4 md:px-6 lg:px-8">
                  <div className="text-2xl font-mono font-bold text-cyan-400 sm:px-4 md:px-6 lg:px-8">
                    {nextGameInfo.minutes.toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">mins</div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Game Schedule */}
        <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
          <div className="text-xs text-gray-400 font-medium sm:px-4 md:px-6 lg:px-8">WEEK SCHEDULE</div>
          {getGameSlateSchedule().map((slate, index) => (
            <div
              key={index}
              className={`flex items-center justify-between px-3 py-2 rounded ${
                slate.active 
                  ? 'bg-blue-500/20 border border-blue-500/30' 
                  : 'bg-gray-800/30'
              }`}
            >
              <span className={`text-sm font-medium ${
                slate.active ? 'text-blue-400' : 'text-gray-400'
              }`}>
                {slate.day}
              </span>
              <span className={`text-xs ${
                slate.active ? 'text-blue-300' : 'text-gray-500'
              }`}>
                {slate.time}
              </span>
            </div>
          ))}
        </div>
        
        {/* Season Progress */}
        <div className="pt-3 border-t border-gray-700/50 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
            <span className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">Season Progress</span>
            <span className="text-xs text-cyan-400 font-medium sm:px-4 md:px-6 lg:px-8">
              {currentWeek} of 18 weeks
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1 mt-2 sm:px-4 md:px-6 lg:px-8">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1 rounded-full sm:px-4 md:px-6 lg:px-8"
              style={{ width: `${(currentWeek / 18) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </Widget>
  );
};

const GameWeekStatusWidgetWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <GameWeekStatusWidget {...props} />
  </ErrorBoundary>
);

export default React.memo(GameWeekStatusWidgetWithErrorBoundary);