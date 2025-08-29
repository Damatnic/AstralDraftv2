/**
 * Simple Player Login Component
 * 10 player buttons with 4-digit PIN authentication
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SimpleAuthService, { SimpleUser } from '../../services/simpleAuthService';
import { useAppState } from '../../contexts/AppContext';

interface SimplePlayerLoginProps {
  onLogin?: (user: SimpleUser) => void;
}

const SimplePlayerLogin: React.FC<SimplePlayerLoginProps> = ({ onLogin }) => {
  const { dispatch } = useAppState();
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Player colors and emojis - Nick Damato is both player1 and admin
  const playerData = [
    { id: 'player1', name: 'Nick Damato', color: '#3b82f6', emoji: '👑', isAdmin: true }, // Admin + Player
    { id: 'player2', name: 'Jon Kornbeck', color: '#ef4444', emoji: '⚡', isAdmin: false },
    { id: 'player3', name: 'Cason Minor', color: '#10b981', emoji: '🔥', isAdmin: false },
    { id: 'player4', name: 'Brittany Bergrum', color: '#f59e0b', emoji: '💪', isAdmin: false },
    { id: 'player5', name: 'Renee McCaigue', color: '#8b5cf6', emoji: '🎯', isAdmin: false },
    { id: 'player6', name: 'Jack McCaigue', color: '#06b6d4', emoji: '🚀', isAdmin: false },
    { id: 'player7', name: 'Larry McCaigue', color: '#84cc16', emoji: '⭐', isAdmin: false },
    { id: 'player8', name: 'Kaity Lorbiecki', color: '#f97316', emoji: '💎', isAdmin: false },
    { id: 'player9', name: 'David Jarvey', color: '#ec4899', emoji: '🏆', isAdmin: false },
    { id: 'player10', name: 'Nick Hartley', color: '#6366f1', emoji: '🎮', isAdmin: false },
  ];

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
      
      // For Nick Damato (player1), check if using admin PIN (7347) or player PIN (0000)
      let authId = selectedPlayer;
      if (selectedPlayer === 'player1' && pin === '7347') {
        authId = 'admin'; // Use admin account for Nick Damato with admin PIN
      }
      
      // Attempt authentication
      const session = await SimpleAuthService.authenticateUser(authId, pin);
      
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

  const getSelectedPlayerData = () => {
    return playerData.find(p => p.id === selectedPlayer);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-3xl mr-4">
              🏈
            </div>
            <h1>ASTRAL DRAFT</h1>
          </div>
          <p className="page-subtitle">Your AI-Powered Fantasy Commissioner</p>
          <p className="text-lg text-secondary mt-2">Select your player to continue</p>
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
                  className="card group relative p-4 text-center transition-all duration-300 transform hover:scale-105"
                >
                  <div className="text-3xl mb-2">{player.emoji}</div>
                  <div className={`font-semibold text-sm ${player.isAdmin ? 'text-yellow-200' : 'text-white'}`}>
                    {player.name}
                  </div>
                  {player.isAdmin && (
                    <div className="text-xs text-yellow-300 mt-1">League Admin</div>
                  )}
                  <div className="text-xs text-secondary mt-1">Click to login</div>
                </motion.button>
              ))}
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
              <div className="login-card">
                {/* Selected Player Display */}
                <div className="text-center mb-6">
                  <div className="user-avatar">
                    {getSelectedPlayerData()?.emoji}
                  </div>
                  <h2 className={`user-name ${getSelectedPlayerData()?.isAdmin ? 'text-yellow-200' : ''}`}>
                    {getSelectedPlayerData()?.name}
                  </h2>
                  {getSelectedPlayerData()?.isAdmin && (
                    <p className="user-role">League Admin</p>
                  )}
                  <p className="text-secondary">Enter your 4-digit PIN</p>
                </div>

                {/* PIN Input */}
                <div className="mb-6">
                  <input
                    type="password"
                    value={pin}
                    onChange={(e) => handlePinChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter your 4-digit PIN"
                    className="pin-input"
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
                <div className="login-buttons">
                  <button
                    onClick={handleBack}
                    className="btn btn-secondary"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleLogin}
                    disabled={pin.length !== 4 || isLoading}
                    className="btn"
                  >
                    {isLoading ? (
                      <div className="spinner" />
                    ) : (
                      'Login'
                    )}
                  </button>
                </div>

                {/* PIN Hints */}
                <div className="pin-info">
                  {selectedPlayer === 'player1' ? (
                    <>
                      <div className="pin-info">Nick Damato PINs:</div>
                      <div className="pin-info">Player: 0000 | Admin: 7347</div>
                    </>
                  ) : (
                    <div className="pin-info">Default PIN: 0000</div>
                  )}
                </div>
                
                <div className="app-info">Fantasy Football Evolved • Season 2024</div>
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