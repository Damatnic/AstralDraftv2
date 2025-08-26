/**
 * Simple Player Login Component
 * 10 player buttons with 4-digit PIN authentication
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SimpleAuthService from '../../services/simpleAuthService';
import { useAppState } from '../../contexts/AppContext';

interface SimplePlayerLoginProps {
  onLogin?: (user: any) => void;
}

const SimplePlayerLogin: React.FC<SimplePlayerLoginProps> = ({ onLogin }) => {
  const { dispatch } = useAppState();
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Player colors and emojis
  const playerData = [
    { id: 'player1', name: 'Player 1', color: '#3b82f6', emoji: '🏈' },
    { id: 'player2', name: 'Player 2', color: '#ef4444', emoji: '⚡' },
    { id: 'player3', name: 'Player 3', color: '#10b981', emoji: '🔥' },
    { id: 'player4', name: 'Player 4', color: '#f59e0b', emoji: '💪' },
    { id: 'player5', name: 'Player 5', color: '#8b5cf6', emoji: '🎯' },
    { id: 'player6', name: 'Player 6', color: '#06b6d4', emoji: '🚀' },
    { id: 'player7', name: 'Player 7', color: '#84cc16', emoji: '⭐' },
    { id: 'player8', name: 'Player 8', color: '#f97316', emoji: '💎' },
    { id: 'player9', name: 'Player 9', color: '#ec4899', emoji: '🏆' },
    { id: 'player10', name: 'Player 10', color: '#6366f1', emoji: '🎮' },
  ];

  const adminData = {
    id: 'admin',
    name: 'League Admin',
    color: '#1f2937',
    emoji: '👑'
  };

  const handlePlayerSelect = (playerId: string) => {
    setSelectedPlayer(playerId);
    setPin('');
    setError('');
  };

  const handlePinChange = (value: string) => {
    // Only allow digits and max 4 characters
    if (/^\d{0,4}$/.test(value)) {
      setPin(value);
      setError('');
    }
  };

  const handleLogin = async () => {
    if (!selectedPlayer || pin.length !== 4) {
      setError('Please enter a 4-digit PIN');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Initialize auth service
      SimpleAuthService.initialize();
      
      // Attempt authentication
      const session = await SimpleAuthService.authenticateUser(selectedPlayer, pin);
      
      if (session) {
        // Success - update app state
        dispatch({
          type: 'LOGIN',
          payload: {
            id: session.user.id,
            name: session.user.displayName,
            email: session.user.email || '',
            avatar: session.user.customization.emoji
          }
        });

        if (onLogin) {
          onLogin(session.user);
        }
      } else {
        setError('Invalid PIN. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && pin.length === 4) {
      handleLogin();
    }
  };

  const handleBack = () => {
    setSelectedPlayer(null);
    setPin('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <img src="/favicon.svg" alt="Astral Draft" className="h-16 w-16 mr-4" />
            <h1 className="text-4xl font-bold text-white">ASTRAL DRAFT</h1>
          </div>
          <p className="text-xl text-blue-200">Your AI-Powered Fantasy Commissioner</p>
          <p className="text-lg text-slate-300 mt-2">Select your player to continue</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!selectedPlayer ? (
            /* Player Selection Grid */
            <motion.div
              key="player-grid"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8"
            >
              {playerData.map((player, index) => (
                <motion.button
                  key={player.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handlePlayerSelect(player.id)}
                  className="group relative p-6 rounded-xl border-2 border-slate-600 hover:border-blue-400 bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-300 transform hover:scale-105"
                  style={{ 
                    background: `linear-gradient(135deg, ${player.color}20, ${player.color}10)`,
                    borderColor: `${player.color}40`
                  }}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">{player.emoji}</div>
                    <div className="text-white font-semibold">{player.name}</div>
                    <div className="text-sm text-slate-300 mt-1">Click to login</div>
                  </div>
                  <div 
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                    style={{ backgroundColor: player.color }}
                  />
                </motion.button>
              ))}

              {/* Admin Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                onClick={() => handlePlayerSelect(adminData.id)}
                className="group relative p-6 rounded-xl border-2 border-yellow-600 hover:border-yellow-400 bg-gradient-to-br from-yellow-900/30 to-orange-900/30 hover:from-yellow-800/40 hover:to-orange-800/40 transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">{adminData.emoji}</div>
                  <div className="text-yellow-200 font-semibold">{adminData.name}</div>
                  <div className="text-sm text-yellow-300 mt-1">Admin Access</div>
                </div>
                <div className="absolute inset-0 rounded-xl bg-yellow-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              </motion.button>
            </motion.div>
          ) : (
            /* PIN Entry */
            <motion.div
              key="pin-entry"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-md mx-auto"
            >
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-600">
                {/* Selected Player Display */}
                <div className="text-center mb-6">
                  <div className="text-5xl mb-3">
                    {selectedPlayer === 'admin' ? adminData.emoji : 
                     playerData.find(p => p.id === selectedPlayer)?.emoji}
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {selectedPlayer === 'admin' ? adminData.name : 
                     playerData.find(p => p.id === selectedPlayer)?.name}
                  </h2>
                  <p className="text-slate-300">Enter your 4-digit PIN</p>
                </div>

                {/* PIN Input */}
                <div className="mb-6">
                  <div className="flex justify-center space-x-3 mb-4">
                    {[0, 1, 2, 3].map((index) => (
                      <div
                        key={index}
                        className="w-12 h-12 rounded-lg border-2 border-slate-600 bg-slate-700 flex items-center justify-center text-xl font-bold text-white"
                      >
                        {pin[index] ? '●' : ''}
                      </div>
                    ))}
                  </div>
                  
                  <input
                    type="password"
                    value={pin}
                    onChange={(e) => handlePinChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter PIN"
                    className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white text-center text-lg tracking-widest focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                    maxLength={4}
                    autoFocus
                  />
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-200 text-center"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={handleBack}
                    className="flex-1 py-3 px-4 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors duration-200"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleLogin}
                    disabled={pin.length !== 4 || isLoading}
                    className="flex-1 py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold transition-colors duration-200 flex items-center justify-center"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      'Login'
                    )}
                  </button>
                </div>

                {/* PIN Hints */}
                <div className="mt-6 text-center text-sm text-slate-400">
                  <p>Default PIN for players: <span className="font-mono">0000</span></p>
                  <p>Admin PIN: <span className="font-mono">7347</span></p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center mt-8 text-slate-400"
        >
          <p>Fantasy Football Evolved • Season 2024</p>
        </motion.div>
      </div>
    </div>
  );
};

export default SimplePlayerLogin;