/**
 * BiometricButton Component - Modern biometric authentication button
 * Supports Face ID, Touch ID, and other WebAuthn methods
 */

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HapticFeedback from './HapticFeedback';

interface BiometricButtonProps {
  onAuthenticate: () => Promise<void>;
  onError?: (error: string) => void;
  disabled?: boolean;
  className?: string;
}

type BiometricType = 'face' | 'fingerprint' | 'none';

export const BiometricButton: React.FC<BiometricButtonProps> = ({
  onAuthenticate,
  onError,
  disabled = false,
  className = ''
}) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [biometricType, setBiometricType] = useState<BiometricType>('none');
  const [isSupported, setIsSupported] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Check WebAuthn support and determine biometric type
    const checkBiometricSupport = async () => {
      if (window.PublicKeyCredential) {
        setIsSupported(true);
        
        // Try to detect biometric type based on platform
        const platform = navigator.platform?.toLowerCase() || '';
        const userAgent = navigator.userAgent?.toLowerCase() || '';
        
        if (platform.includes('mac') || userAgent.includes('iphone') || userAgent.includes('ipad')) {
          // Apple devices - likely Face ID or Touch ID
          if (userAgent.includes('iphone x') || userAgent.includes('iphone 11') || 
              userAgent.includes('iphone 12') || userAgent.includes('iphone 13') ||
              userAgent.includes('iphone 14') || userAgent.includes('iphone 15') ||
              userAgent.includes('ipad pro')) {
            setBiometricType('face');
          } else {
            setBiometricType('fingerprint');
          }
        } else if (userAgent.includes('android')) {
          // Android devices - typically fingerprint
          setBiometricType('fingerprint');
        } else if (platform.includes('win')) {
          // Windows Hello
          setBiometricType('face');
        } else {
          // Default to fingerprint for other platforms
          setBiometricType('fingerprint');
        }
      }
    };

    checkBiometricSupport();
  }, []);

  const handleAuthentication = useCallback(async () => {
    if (!isSupported || isAuthenticating || disabled) return;

    setIsAuthenticating(true);
    setShowSuccess(false);

    try {
      await onAuthenticate();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      if (onError) {
        onError(error instanceof Error ? error.message : 'Authentication failed');
      }
    } finally {
      setIsAuthenticating(false);
    }
  }, [isSupported, isAuthenticating, disabled, onAuthenticate, onError]);

  if (!isSupported) {
    return null;
  }

  const BiometricIcon = () => {
    if (biometricType === 'face') {
      return (
        <svg 
          className="w-8 h-8" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9 9h.01M15 9h.01" strokeLinecap="round" />
          <path d="M8 13c1.5 2 3.5 2 5 2s3.5 0 5-2" strokeLinecap="round" />
        </svg>
      );
    }
    
    return (
      <svg 
        className="w-8 h-8" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5"
      >
        <path d="M12 3C7.03 3 3 7.03 3 12s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9z" />
        <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z" />
        <circle cx="12" cy="12" r="2" />
        <path d="M12 3v4M12 17v4M3 12h4M17 12h4" strokeLinecap="round" />
      </svg>
    );
  };

  const SuccessIcon = () => (
    <svg 
      className="w-8 h-8 text-green-500" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
    >
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <HapticFeedback intensity="medium" className={className}>
      <motion.button
        onClick={handleAuthentication}
        disabled={disabled || isAuthenticating}
        className={`
          relative p-4 rounded-2xl
          bg-gradient-to-br from-blue-500/20 to-purple-500/20
          backdrop-blur-xl border border-white/20
          text-white shadow-xl
          disabled:opacity-50 disabled:cursor-not-allowed
          ${!disabled && !isAuthenticating ? 'hover:border-white/30 active:scale-95' : ''}
          transition-all duration-200
        `}
        whileHover={!disabled && !isAuthenticating ? { scale: 1.05 } : {}}
        whileTap={!disabled && !isAuthenticating ? { scale: 0.95 } : {}}
      >
        <div className="flex flex-col items-center space-y-2">
          <div className="relative">
            <AnimatePresence mode="wait">
              {showSuccess ? (
                <motion.div
                  key="success"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ type: 'spring', damping: 15 }}
                >
                  <SuccessIcon />
                </motion.div>
              ) : isAuthenticating ? (
                <motion.div
                  key="authenticating"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                <motion.div
                  key="icon"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15 }}
                >
                  <BiometricIcon />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <motion.span 
            className="text-xs font-medium text-white/80"
            animate={{ opacity: isAuthenticating ? 0.5 : 1 }}
          >
            {showSuccess ? 'Authenticated!' : 
             isAuthenticating ? 'Authenticating...' : 
             biometricType === 'face' ? 'Use Face ID' : 'Use Touch ID'}
          </motion.span>
        </div>

        {/* Pulse animation when idle */}
        {!disabled && !isAuthenticating && !showSuccess && (
          <motion.div
            className="absolute inset-0 rounded-2xl bg-white/10"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0, 0.3]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        )}

        {/* Scanning line animation when authenticating */}
        {isAuthenticating && (
          <motion.div
            className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent"
            initial={{ top: 0 }}
            animate={{ top: '100%' }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        )}
      </motion.button>
    </HapticFeedback>
  );
};

export default BiometricButton;