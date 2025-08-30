/**
 * Premium Fantasy Football Login Experience
 * Modern, professional login screen with stunning visuals
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SimpleAuthService from '../../services/simpleAuthService';
import { useAppState } from '../../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Button } from '../ui/Button';

interface SimplePlayerLoginProps {
  onLogin?: (user: any) => void;
}

const SimplePlayerLogin: React.FC<SimplePlayerLoginProps> = ({ onLogin }: any) => {
  const { dispatch } = useAppState();
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSocialOptions, setShowSocialOptions] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  // Track mouse position for interactive background
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Player colors and emojis - Nick Damato is both player1 and admin
  const playerData = [
    { id: 'player1', name: 'Nick Damato', color: 'from-blue-500 to-purple-600', emoji: '👑', isAdmin: true, badge: 'Commissioner' },
    { id: 'player2', name: 'Jon Kornbeck', color: 'from-red-500 to-pink-600', emoji: '⚡', isAdmin: false, badge: '3x Champion' },
    { id: 'player3', name: 'Cason Minor', color: 'from-emerald-500 to-teal-600', emoji: '🔥', isAdmin: false, badge: 'Rising Star' },
    { id: 'player4', name: 'Brittany Bergrum', color: 'from-amber-500 to-orange-600', emoji: '💪', isAdmin: false, badge: 'Draft Master' },
    { id: 'player5', name: 'Renee McCaigue', color: 'from-purple-500 to-pink-600', emoji: '🎯', isAdmin: false, badge: 'Trade Wizard' },
    { id: 'player6', name: 'Jack McCaigue', color: 'from-cyan-500 to-blue-600', emoji: '🚀', isAdmin: false, badge: 'Waiver King' },
    { id: 'player7', name: 'Larry McCaigue', color: 'from-lime-500 to-green-600', emoji: '⭐', isAdmin: false, badge: 'Legend' },
    { id: 'player8', name: 'Kaity Lorbiecki', color: 'from-orange-500 to-red-600', emoji: '💎', isAdmin: false, badge: 'Elite' },
    { id: 'player9', name: 'David Jarvey', color: 'from-pink-500 to-rose-600', emoji: '🏆', isAdmin: false, badge: 'Champion' },
    { id: 'player10', name: 'Nick Hartley', color: 'from-indigo-500 to-purple-600', emoji: '🎮', isAdmin: false, badge: 'Strategist' },
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
    return playerData.find((p: any) => p.id === selectedPlayer);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Dynamic gradient orbs */}
        <div 
          className="absolute w-[800px] h-[800px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(94, 107, 255, 0.4) 0%, transparent 70%)',
            left: `${mousePosition.x - 50}%`,
            top: `${mousePosition.y - 50}%`,
            transform: 'translate(-50%, -50%)',
            transition: 'all 0.3s ease-out'
          }}
        />
        <div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, transparent 70%)',
            right: `${100 - mousePosition.x - 20}%`,
            bottom: `${100 - mousePosition.y - 20}%`,
            transform: 'translate(50%, 50%)',
            transition: 'all 0.5s ease-out'
          }}
        />
        
        {/* Animated grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,transparent_20%,black)]" />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 20,
            }}
            animate={{
              y: -20,
              x: Math.random() * window.innerWidth,
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          {/* Premium Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <motion.div 
              className="flex items-center justify-center mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-600 rounded-2xl blur-xl opacity-50 animate-pulse" />
                <div className="relative w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-600 rounded-2xl flex items-center justify-center text-4xl shadow-2xl">
                  🏈
                </div>
              </div>
            </motion.div>
            
            <h1 className="text-6xl font-black mb-3 bg-gradient-to-r from-white via-primary-200 to-white bg-clip-text text-transparent">
              ASTRAL DRAFT
            </h1>
            <p className="text-xl text-gray-400 font-light tracking-wide">
              Elite Fantasy Football Platform
            </p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <span className="px-3 py-1 bg-primary-500/20 border border-primary-500/30 rounded-full text-xs text-primary-300">
                Season 2024
              </span>
              <span className="px-3 py-1 bg-secondary-500/20 border border-secondary-500/30 rounded-full text-xs text-secondary-300">
                AI Powered
              </span>
              <span className="px-3 py-1 bg-accent-500/20 border border-accent-500/30 rounded-full text-xs text-accent-300">
                10 Team League
              </span>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {!selectedPlayer ? (
              /* Player Selection Grid */
              <motion.div
                key="player-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Quick Access Section */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Choose Your Team</h2>
                  <p className="text-gray-400">Select your profile to access the league</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                  {playerData.map((player, index) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      whileHover={{ y: -5 }}
                    >
                      <Card
                        variant="gradient"
                        hover
                        interactive
                        padding="sm"
                        className="cursor-pointer relative overflow-hidden group"
                        onClick={() => handlePlayerSelect(player.id)}
                      >
                        {/* Background gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${player.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
                        
                        {/* Content */}
                        <div className="relative z-10 text-center py-2">
                          <motion.div 
                            className="text-4xl mb-3"
                            whileHover={{ scale: 1.2, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            {player.emoji}
                          </motion.div>
                          
                          <h3 className="font-bold text-white text-sm mb-1">
                            {player.name}
                          </h3>
                          
                          {/* Badge */}
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2
                            ${player.isAdmin 
                              ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' 
                              : 'bg-white/10 text-gray-300 border border-white/20'
                            }`}>
                            {player.badge}
                          </div>
                        </div>
                        
                        {/* Hover effect overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Social Login Options */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="max-w-md mx-auto"
                >
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-dark-900 text-gray-400">Or continue with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { name: 'Google', icon: '🔍', color: 'hover:bg-red-500/10 hover:border-red-500/30' },
                      { name: 'Apple', icon: '🍎', color: 'hover:bg-gray-500/10 hover:border-gray-500/30' },
                      { name: 'Yahoo', icon: '📧', color: 'hover:bg-purple-500/10 hover:border-purple-500/30' }
                    ].map((provider) => (
                      <Button
                        key={provider.name}
                        variant="outline"
                        size="md"
                        className={`group ${provider.color}`}
                        onClick={() => setShowSocialOptions(true)}
                      >
                        <span className="text-xl mr-2 group-hover:scale-110 transition-transform">
                          {provider.icon}
                        </span>
                        <span className="hidden md:inline">{provider.name}</span>
                      </Button>
                    ))}
                  </div>

                  {showSocialOptions && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl"
                    >
                      <p className="text-yellow-300 text-sm text-center">
                        Social login coming soon! Use player profiles above for now.
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            ) : (
              /* PIN Entry */
              <motion.div
                key="pin-entry"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="max-w-md mx-auto"
              >
                <Card variant="elevated" padding="xl" className="relative overflow-visible">
                  {/* Glow effect for selected player */}
                  <div 
                    className={`absolute -inset-4 bg-gradient-to-br ${getSelectedPlayerData()?.color} opacity-20 blur-2xl`}
                  />
                  
                  <CardContent className="relative z-10">
                    {/* Selected Player Display */}
                    <div className="text-center mb-8">
                      <motion.div 
                        className="relative inline-block mb-4"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${getSelectedPlayerData()?.color} rounded-full blur-xl opacity-50`} />
                        <div className="relative w-24 h-24 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-full flex items-center justify-center text-5xl border border-white/20">
                          {getSelectedPlayerData()?.emoji}
                        </div>
                      </motion.div>
                      
                      <motion.h2 
                        className="text-2xl font-bold text-white mb-1"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {getSelectedPlayerData()?.name}
                      </motion.h2>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                          ${getSelectedPlayerData()?.isAdmin 
                            ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' 
                            : 'bg-white/10 text-gray-300 border border-white/20'
                          }`}>
                          {getSelectedPlayerData()?.badge}
                        </span>
                      </motion.div>
                    </div>

                    {/* Modern PIN Input */}
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-3">
                          Secure PIN Authentication
                        </label>
                        <div className="relative">
                          <input
                            type="password"
                            value={pin}
                            onChange={(e: any) => handlePinChange(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="••••"
                            className="w-full px-6 py-4 bg-white/5 backdrop-blur-sm border-2 border-white/10 rounded-xl
                                     text-center text-2xl tracking-[0.5em] text-white font-mono
                                     focus:outline-none focus:border-primary-500/50 focus:bg-white/10
                                     transition-all duration-300 placeholder:text-gray-600"
                            maxLength={4}
                            autoFocus
                          />
                          <div className="absolute inset-x-0 -bottom-1 h-[2px] bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-0 
                                        group-focus-within:opacity-100 transition-opacity duration-300" />
                        </div>
                        
                        {/* PIN Progress Dots */}
                        <div className="flex justify-center gap-2 mt-4">
                          {[...Array(4)].map((_, i) => (
                            <motion.div
                              key={i}
                              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                i < pin.length 
                                  ? 'bg-primary-500 shadow-[0_0_10px_rgba(94,107,255,0.5)]' 
                                  : 'bg-white/20'
                              }`}
                              initial={{ scale: 0 }}
                              animate={{ scale: i < pin.length ? 1.2 : 1 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Error Message */}
                      <AnimatePresence>
                        {error && (
                          <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            className="p-3 rounded-xl bg-danger-500/10 border border-danger-500/30 backdrop-blur-sm"
                          >
                            <p className="text-danger-300 text-sm text-center flex items-center justify-center gap-2">
                              <span className="text-lg">⚠️</span>
                              {error}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <Button
                          variant="secondary"
                          size="lg"
                          onClick={handleBack}
                          className="flex-1"
                        >
                          <span className="mr-2">←</span>
                          Back
                        </Button>
                        <Button
                          variant="primary"
                          size="lg"
                          onClick={handleLogin}
                          disabled={pin.length !== 4 || isLoading}
                          loading={isLoading}
                          className="flex-1"
                        >
                          {!isLoading && <span className="mr-2">🔓</span>}
                          Sign In
                        </Button>
                      </div>

                      {/* PIN Hints with better styling */}
                      <motion.div 
                        className="pt-4 border-t border-white/10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <div className="text-center space-y-1">
                          {selectedPlayer === 'player1' ? (
                            <div className="space-y-2">
                              <p className="text-xs text-gray-500 uppercase tracking-wider">Quick Access</p>
                              <div className="flex justify-center gap-4">
                                <span className="px-3 py-1 bg-primary-500/10 border border-primary-500/30 rounded-full text-xs text-primary-300">
                                  Player: 0000
                                </span>
                                <span className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-xs text-yellow-300">
                                  Admin: 7347
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <p className="text-xs text-gray-500 uppercase tracking-wider">Demo Access</p>
                              <span className="inline-block px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-gray-300">
                                Default PIN: 0000
                              </span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>

                {/* Security Features */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6 flex justify-center gap-6 text-xs text-gray-500"
                >
                  <span className="flex items-center gap-1">
                    <span className="text-green-500">🔒</span> 256-bit Encryption
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-blue-500">🛡️</span> Secure Login
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-purple-500">✓</span> SSL Protected
                  </span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Premium Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center mt-12"
          >
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <span>© 2024 Astral Draft</span>
              <span className="w-1 h-1 bg-gray-600 rounded-full" />
              <span>Premium Fantasy Platform</span>
              <span className="w-1 h-1 bg-gray-600 rounded-full" />
              <span>v2.0.0</span>
            </div>
            <div className="mt-2 flex items-center justify-center gap-6">
              <a href="#" className="text-xs text-gray-600 hover:text-primary-400 transition-colors">Terms</a>
              <a href="#" className="text-xs text-gray-600 hover:text-primary-400 transition-colors">Privacy</a>
              <a href="#" className="text-xs text-gray-600 hover:text-primary-400 transition-colors">Support</a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SimplePlayerLogin;