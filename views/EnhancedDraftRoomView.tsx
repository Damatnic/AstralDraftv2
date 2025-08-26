/**
 * Enhanced Draft Room View
 * Complete live draft experience for August 31, 2025
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '../contexts/AppContext';
import { getDaysUntilDraft, SEASON_DATES_2025 } from '../data/leagueData';
import LiveDraftRoom from '../components/draft/LiveDraftRoom';

const EnhancedDraftRoomView: React.FC = () => {
  const { state, dispatch } = useAppState();
  const [isDraftDay, setIsDraftDay] = useState(false);
  const [showPreDraftLobby, setShowPreDraftLobby] = useState(true);
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);

  const league = state.leagues[0];
  const daysUntilDraft = getDaysUntilDraft();
  const draftDate = SEASON_DATES_2025.draftDate;
  const now = new Date();

  // Check if it's draft day (within 2 hours of draft time)
  useEffect(() => {
    const timeDiff = draftDate.getTime() - now.getTime();
    const hoursUntilDraft = timeDiff / (1000 * 60 * 60);
    setIsDraftDay(hoursUntilDraft <= 2 && hoursUntilDraft >= -1);
  }, [draftDate, now]);

  // Simulate connected users (in real app, this would come from WebSocket)
  useEffect(() => {
    const users = league?.members.map(member => member.name) || [];
    setConnectedUsers(users.slice(0, Math.floor(Math.random() * users.length) + 3));
  }, [league?.members]);

  const handleEnterDraftRoom = () => {
    setShowPreDraftLobby(false);
  };

  const handleDraftComplete = () => {
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        message: 'Draft completed successfully! Rosters have been finalized.',
        type: 'SUCCESS'
      }
    });
    
    // Redirect to team hub after draft
    setTimeout(() => {
      dispatch({ type: 'SET_VIEW', payload: 'TEAM_HUB' });
    }, 3000);
  };

  if (!isDraftDay && daysUntilDraft > 0) {
    // Pre-draft day view
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => dispatch({ type: 'SET_VIEW', payload: 'DASHBOARD' })}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                ← Back to Dashboard
              </button>
              
              <div className="text-center">
                <h1 className="text-2xl font-bold text-white">Draft Room</h1>
                <p className="text-slate-400">Not yet available</p>
              </div>
              
              <div className="text-right">
                <div className="text-white font-semibold">{daysUntilDraft} days</div>
                <div className="text-sm text-orange-400">Until Draft</div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="text-8xl mb-8">🏈</div>
            <h2 className="text-4xl font-bold text-white mb-4">Draft Room Opens Soon</h2>
            <p className="text-xl text-slate-300 mb-8">
              The live draft room will be available on draft day
            </p>
            
            <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700 mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">Draft Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div>
                  <h4 className="font-semibold text-white mb-2">📅 Date & Time</h4>
                  <p className="text-slate-300">
                    {draftDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p className="text-slate-300">7:00 PM EST</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-2">⚙️ Format</h4>
                  <p className="text-slate-300">Snake Draft</p>
                  <p className="text-slate-300">16 Rounds, 90 seconds per pick</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-2">👥 Participants</h4>
                  <p className="text-slate-300">10 Team League</p>
                  <p className="text-slate-300">160 Total Picks</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-2">🎯 Preparation</h4>
                  <p className="text-slate-300">Draft order will be randomized</p>
                  <p className="text-slate-300">Auto-draft available</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => dispatch({ type: 'SET_VIEW', payload: 'DRAFT_PREP_CENTER' })}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-lg"
              >
                📋 Prepare for Draft
              </button>
              
              <p className="text-slate-400">
                Use the Draft Prep Center to research players and plan your strategy
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => dispatch({ type: 'SET_VIEW', payload: 'DASHBOARD' })}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              ← Back to Dashboard
            </button>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-2xl">🏈</span>
                Live Draft Room
              </h1>
              <p className="text-slate-400">{league?.name} • Draft Day</p>
            </div>
            
            <div className="text-right">
              <div className="text-white font-semibold">LIVE</div>
              <div className="text-sm text-green-400">Draft Active</div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {showPreDraftLobby ? (
            /* Pre-Draft Lobby */
            <motion.div
              key="lobby"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Draft Day Banner */}
              <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white text-center">
                <h2 className="text-3xl font-bold mb-2">🎉 It's Draft Day! 🎉</h2>
                <p className="text-lg">
                  Welcome to the {league?.name} live draft room
                </p>
              </div>

              {/* Connected Users */}
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-4">
                  Connected Managers ({connectedUsers.length}/10)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {league?.members.map((member) => {
                    const isConnected = connectedUsers.includes(member.name);
                    return (
                      <div
                        key={member.id}
                        className={`p-3 rounded-lg border-2 transition-colors ${
                          isConnected
                            ? 'border-green-500 bg-green-900/20'
                            : 'border-slate-600 bg-slate-700/50'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-1">{member.avatar}</div>
                          <div className="text-white font-medium text-sm">{member.name}</div>
                          <div className={`text-xs mt-1 ${
                            isConnected ? 'text-green-400' : 'text-slate-500'
                          }`}>
                            {isConnected ? '🟢 Online' : '⚫ Offline'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Draft Instructions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-xl font-bold text-white mb-4">📋 Draft Rules</h3>
                  <ul className="space-y-2 text-slate-300">
                    <li>• 90 seconds per pick</li>
                    <li>• Snake draft format (16 rounds)</li>
                    <li>• Auto-draft available if you miss your turn</li>
                    <li>• Draft order will be randomized before start</li>
                    <li>• Chat will be available during draft</li>
                  </ul>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-xl font-bold text-white mb-4">🎯 Quick Tips</h3>
                  <ul className="space-y-2 text-slate-300">
                    <li>• Have your player rankings ready</li>
                    <li>• Consider bye weeks in later rounds</li>
                    <li>• Don't panic if you miss a player</li>
                    <li>• Stay flexible with your strategy</li>
                    <li>• Have fun and good luck!</li>
                  </ul>
                </div>
              </div>

              {/* Enter Draft Room Button */}
              <div className="text-center">
                <button
                  onClick={handleEnterDraftRoom}
                  disabled={connectedUsers.length < 3} // Require at least 3 users for demo
                  className={`px-8 py-4 font-semibold rounded-lg text-lg transition-colors ${
                    connectedUsers.length >= 3
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  {connectedUsers.length >= 3 
                    ? '🚀 Enter Draft Room' 
                    : `Waiting for managers (${connectedUsers.length}/10)`
                  }
                </button>
                <p className="text-slate-400 mt-2">
                  {connectedUsers.length >= 3 
                    ? 'Ready to start the draft!'
                    : 'Waiting for more managers to connect...'
                  }
                </p>
              </div>
            </motion.div>
          ) : (
            /* Live Draft Room */
            <motion.div
              key="draft"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <LiveDraftRoom 
                isActive={true}
                onDraftComplete={handleDraftComplete}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EnhancedDraftRoomView;