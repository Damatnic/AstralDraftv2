/**
 * Modern Login Screen with ESPN/Yahoo-beating design
 * Features glassmorphism, advanced animations, and premium UX
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation, Variants } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import authService, { AuthUser } from '../../services/enhancedAuthService';
import { HapticFeedback } from '../ui/HapticFeedback';
import { GlassCard } from '../ui/GlassCard';
import { AnimatedBackground } from '../ui/AnimatedBackground';
import { BiometricButton } from '../ui/BiometricButton';
import { PinInput } from '../ui/PinInput';

// Player profiles with enhanced visuals
const PLAYER_PROFILES = [
  { id: 'player1', emoji: '👑', name: 'Nick Damato', gradient: 'from-blue-500 to-purple-600', glow: 'blue' },
  { id: 'player2', emoji: '🎮', name: 'Player 2', gradient: 'from-green-500 to-teal-600', glow: 'green' },
  { id: 'player3', emoji: '🚀', name: 'Player 3', gradient: 'from-red-500 to-pink-600', glow: 'red' },
  { id: 'player4', emoji: '⚡', name: 'Player 4', gradient: 'from-purple-500 to-indigo-600', glow: 'purple' },
  { id: 'player5', emoji: '🏈', name: 'Player 5', gradient: 'from-orange-500 to-yellow-600', glow: 'orange' },
  { id: 'player6', emoji: '🎯', name: 'Player 6', gradient: 'from-teal-500 to-cyan-600', glow: 'teal' },
  { id: 'player7', emoji: '🔥', name: 'Player 7', gradient: 'from-pink-500 to-rose-600', glow: 'pink' },
  { id: 'player8', emoji: '💎', name: 'Player 8', gradient: 'from-indigo-500 to-blue-600', glow: 'indigo' },
  { id: 'player9', emoji: '🌟', name: 'Player 9', gradient: 'from-amber-500 to-orange-600', glow: 'amber' },
  { id: 'admin', emoji: '🛡️', name: 'Admin', gradient: 'from-yellow-500 to-orange-600', glow: 'yellow' }
];

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      damping: 12,
      stiffness: 100
    }
  }
};

const playerCardVariants: Variants = {
  initial: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.05,
    rotate: [0, -1, 1, -1, 0],
    transition: {
      rotate: {
        duration: 0.3,
        repeat: 0
      },
      scale: {
        duration: 0.2
      }
    }
  },
  tap: { scale: 0.95 },
  selected: {
    scale: 1.1,
    rotate: 0,
    transition: {
      type: 'spring',
      damping: 10,
      stiffness: 200
    }
  }
};

interface ModernLoginScreenProps {
  onLogin?: (user: AuthUser) => void;
  onToggleSimple?: () => void; // Allow switching back to simple login
}

export const ModernLoginScreen: React.FC<ModernLoginScreenProps> = ({ onLogin, onToggleSimple }) => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [showPinEntry, setShowPinEntry] = useState(false);
  const [pin, setPin] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotPin, setShowForgotPin] = useState(false);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [resetStep, setResetStep] = useState<'email' | 'code' | 'newPin'>('email');
  const [newPin, setNewPin] = useState('');
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const lockTimeoutRef = useRef<NodeJS.Timeout>();

  // Check for biometric availability
  useEffect(() => {
    if ('credentials' in navigator) {
      setBiometricAvailable(true);
    }
  }, []);

  // Check for existing session
  useEffect(() => {
    const session = authService.getCurrentSession();
    if (session) {
      handleSuccessfulLogin(session.user);
    }
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (lockTimeoutRef.current) {
        clearTimeout(lockTimeoutRef.current);
      }
    };
  }, []);

  const handleSuccessfulLogin = useCallback((user: AuthUser) => {
    // Success animation
    controls.start({
      scale: [1, 1.1, 0.9, 1],
      rotate: [0, 5, -5, 0],
      transition: { duration: 0.5 }
    });

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }

    setTimeout(() => {
      if (onLogin) {
        onLogin(user);
      } else {
        navigate('/dashboard');
      }
    }, 500);
  }, [controls, navigate, onLogin]);

  const handlePlayerSelect = useCallback((playerId: string) => {
    setSelectedPlayer(playerId);
    setError(null);
    
    // Check if biometric is enabled for this user
    const session = authService.getCurrentSession();
    if (session?.user.id === playerId && session.user.security.biometricEnabled && biometricAvailable) {
      handleBiometricLogin(playerId);
    } else {
      setShowPinEntry(true);
    }
  }, [biometricAvailable]);

  const handleBiometricLogin = async (playerId: string) => {
    try {
      setIsLoading(true);
      const session = await authService.authenticateWithBiometrics(playerId);
      handleSuccessfulLogin(session.user);
    } catch (err) {
      console.error('Biometric login failed:', err);
      setError('Biometric authentication failed. Please use PIN.');
      setShowPinEntry(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinSubmit = async () => {
    if (!selectedPlayer || pin.length !== 4) return;

    // Check if locked
    if (isLocked) {
      setError('Too many attempts. Please wait before trying again.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const session = await authService.authenticateWithPin(selectedPlayer, pin, rememberMe);
      handleSuccessfulLogin(session.user);
      
      // Reset attempts on success
      setLoginAttempts(0);
    } catch (err) {
      const attempts = loginAttempts + 1;
      setLoginAttempts(attempts);
      
      if (attempts >= 3) {
        // Lock after 3 failed attempts
        setIsLocked(true);
        setError('Too many failed attempts. Locked for 30 seconds.');
        
        lockTimeoutRef.current = setTimeout(() => {
          setIsLocked(false);
          setLoginAttempts(0);
          setError(null);
        }, 30000);
      } else {
        setError(`Invalid PIN. ${3 - attempts} attempts remaining.`);
        // Shake animation on error
        controls.start({
          x: [-10, 10, -10, 10, 0],
          transition: { duration: 0.4 }
        });
      }
      
      setPin('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPin = async () => {
    if (resetStep === 'email') {
      if (!email) {
        setError('Please enter your email address');
        return;
      }
      
      try {
        setIsLoading(true);
        await authService.requestPinReset(email);
        setResetStep('code');
        setError(null);
      } catch (err) {
        setError('Failed to send reset code');
      } finally {
        setIsLoading(false);
      }
    } else if (resetStep === 'code') {
      if (!verificationCode) {
        setError('Please enter the verification code');
        return;
      }
      
      setResetStep('newPin');
      setError(null);
    } else if (resetStep === 'newPin') {
      if (!newPin || newPin.length !== 4) {
        setError('Please enter a 4-digit PIN');
        return;
      }
      
      try {
        setIsLoading(true);
        await authService.resetPin(email, verificationCode, newPin);
        setShowForgotPin(false);
        setResetStep('email');
        setError(null);
        // Success message
        controls.start({
          scale: [1, 1.1, 1],
          transition: { duration: 0.3 }
        });
      } catch (err) {
        setError('Failed to reset PIN');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (showForgotPin) {
      setShowForgotPin(false);
      setResetStep('email');
    } else if (showPinEntry) {
      setShowPinEntry(false);
      setSelectedPlayer(null);
      setPin('');
      setError(null);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Main Container */}
      <motion.div 
        className="relative z-10 flex min-h-screen items-center justify-center p-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div animate={controls} className="w-full max-w-lg sm:max-w-2xl lg:max-w-4xl">
          <GlassCard className="w-full">
            {/* Header */}
            <motion.div 
              className="mb-6 sm:mb-8 text-center"
              variants={itemVariants}
            >
              <h1 className="mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent">
                Astral Draft
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-gray-300">
                Premium Fantasy Football Experience
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              {/* Player Selection */}
              {!showPinEntry && !showForgotPin && (
                <motion.div
                  key="player-select"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <h2 className="mb-4 sm:mb-6 text-center text-xl sm:text-2xl font-semibold text-white">
                    Select Your Profile
                  </h2>
                  
                  <motion.div 
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4"
                    variants={containerVariants}
                  >
                    {PLAYER_PROFILES.map((player) => (
                      <motion.button
                        key={player.id}
                        variants={playerCardVariants}
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                        animate={selectedPlayer === player.id ? "selected" : "initial"}
                        onClick={() => handlePlayerSelect(player.id)}
                        className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${player.gradient} p-3 sm:p-4 lg:p-6 shadow-xl backdrop-blur-md transition-all duration-300`}
                        disabled={isLoading}
                      >
                        <HapticFeedback>
                          <div className="relative z-10">
                            <div className="mb-1 sm:mb-2 text-2xl sm:text-3xl lg:text-4xl">{player.emoji}</div>
                            <div className="text-xs sm:text-sm font-medium text-white opacity-90 leading-tight">
                              {player.name}
                            </div>
                          </div>
                        </HapticFeedback>
                        
                        {/* Glow effect */}
                        <div className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100`}>
                          <div className={`h-full w-full bg-gradient-radial from-${player.glow}-400/20 to-transparent`} />
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>

                  {/* Demo Mode Button and Classic Login Option */}
                  <motion.div
                    className="mt-6 sm:mt-8 text-center space-y-3"
                    variants={itemVariants}
                  >
                    <button
                      onClick={() => {
                        setSelectedPlayer('player1');
                        setPin('0000');
                        handlePinSubmit();
                      }}
                      className="rounded-full bg-white/10 px-4 sm:px-6 py-2 text-sm text-white backdrop-blur-md transition-all hover:bg-white/20 w-full sm:w-auto"
                      disabled={isLoading}
                    >
                      Quick Demo Access
                    </button>
                    
                    {onToggleSimple && (
                      <div>
                        <button
                          onClick={onToggleSimple}
                          className="text-xs text-white/60 hover:text-white/80 transition-colors block mx-auto"
                        >
                          Use Classic Login
                        </button>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              )}

              {/* PIN Entry */}
              {showPinEntry && !showForgotPin && selectedPlayer && (
                <motion.div
                  key="pin-entry"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  {/* Back Button */}
                  <button
                    onClick={handleBack}
                    className="flex items-center text-white/70 hover:text-white"
                  >
                    <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>

                  {/* Selected Player Display */}
                  <div className="flex justify-center">
                    <div className={`rounded-xl bg-gradient-to-br ${PLAYER_PROFILES.find(p => p.id === selectedPlayer)?.gradient} p-3 sm:p-4`}>
                      <div className="text-3xl sm:text-4xl lg:text-5xl">
                        {PLAYER_PROFILES.find(p => p.id === selectedPlayer)?.emoji}
                      </div>
                    </div>
                  </div>

                  <h2 className="text-center text-xl sm:text-2xl font-semibold text-white">
                    Enter Your PIN
                  </h2>

                  {/* PIN Input */}
                  <PinInput
                    value={pin}
                    onChange={setPin}
                    onComplete={handlePinSubmit}
                    disabled={isLoading || isLocked}
                    error={!!error}
                  />

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-lg bg-red-500/20 p-3 text-center text-red-300"
                    >
                      {error}
                    </motion.div>
                  )}

                  {/* Remember Me & Biometric */}
                  <div className="space-y-4">
                    <label className="flex items-center justify-center space-x-2">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500"
                        disabled={isLoading}
                      />
                      <span className="text-sm text-gray-300">Remember me for 30 days</span>
                    </label>

                    {biometricAvailable && (
                      <BiometricButton
                        onClick={() => handleBiometricLogin(selectedPlayer)}
                        disabled={isLoading}
                      />
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handlePinSubmit}
                    disabled={isLoading || isLocked || pin.length !== 4}
                    className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 py-3 font-semibold text-white shadow-xl transition-all hover:from-purple-700 hover:to-blue-700 disabled:opacity-50"
                  >
                    {isLoading ? 'Logging in...' : 'Login'}
                  </button>

                  {/* Forgot PIN */}
                  <button
                    onClick={() => setShowForgotPin(true)}
                    className="w-full text-center text-sm text-gray-400 hover:text-white"
                    disabled={isLoading}
                  >
                    Forgot your PIN?
                  </button>
                </motion.div>
              )}

              {/* Forgot PIN Flow */}
              {showForgotPin && (
                <motion.div
                  key="forgot-pin"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  {/* Back Button */}
                  <button
                    onClick={handleBack}
                    className="flex items-center text-white/70 hover:text-white"
                  >
                    <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Login
                  </button>

                  <h2 className="text-center text-2xl font-semibold text-white">
                    Reset Your PIN
                  </h2>

                  {/* Reset Steps */}
                  {resetStep === 'email' && (
                    <>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full rounded-lg bg-white/10 px-4 py-3 text-white placeholder-gray-400 backdrop-blur-md focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        disabled={isLoading}
                      />
                      <p className="text-center text-sm text-gray-400">
                        We'll send a verification code to your email
                      </p>
                    </>
                  )}

                  {resetStep === 'code' && (
                    <>
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="Enter verification code"
                        className="w-full rounded-lg bg-white/10 px-4 py-3 text-white placeholder-gray-400 backdrop-blur-md focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        disabled={isLoading}
                      />
                      <p className="text-center text-sm text-gray-400">
                        Check your email for the 6-digit code
                      </p>
                    </>
                  )}

                  {resetStep === 'newPin' && (
                    <>
                      <PinInput
                        value={newPin}
                        onChange={setNewPin}
                        onComplete={() => {}}
                        disabled={isLoading}
                        error={false}
                      />
                      <p className="text-center text-sm text-gray-400">
                        Enter your new 4-digit PIN
                      </p>
                    </>
                  )}

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-lg bg-red-500/20 p-3 text-center text-red-300"
                    >
                      {error}
                    </motion.div>
                  )}

                  {/* Continue Button */}
                  <button
                    onClick={handleForgotPin}
                    disabled={isLoading}
                    className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 py-3 font-semibold text-white shadow-xl transition-all hover:from-purple-700 hover:to-blue-700 disabled:opacity-50"
                  >
                    {isLoading ? 'Processing...' : 
                     resetStep === 'email' ? 'Send Code' :
                     resetStep === 'code' ? 'Verify Code' :
                     'Reset PIN'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ModernLoginScreen;