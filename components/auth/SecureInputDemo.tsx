/**
 * Secure Input Demo Component
 * 
 * Demonstrates all features of the secure input system:
 * - Password input with strength indicator
 * - PIN input with progress dots
 * - Security features and visual indicators
 * - Different configurations and use cases
 */

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SecurePasswordInput, SecurePinInput } from '../ui/SecureInput';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';

export const SecureInputDemo: React.FC = () => {
  // Demo state
  const [loginPassword, setLoginPassword] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userPin, setUserPin] = useState('');
  const [adminPin, setAdminPin] = useState('');
  const [customPin, setCustomPin] = useState('');
  
  // Error states for demo
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Demo validation
  const validateDemo = () => {
    const newErrors: Record<string, string> = {};
    
    if (loginPassword.length < 8) {
      newErrors.loginPassword = 'Password must be at least 8 characters';

    if (registerPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';

    if (userPin.length !== 4) {
      newErrors.userPin = 'PIN must be exactly 4 digits';

    if (adminPin.length !== 6) {
      newErrors.adminPin = 'Admin PIN must be 6 digits';

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      alert('All inputs are valid! 🎉');

  };
  
  const clearDemo = () => {
    setLoginPassword('');
    setRegisterPassword('');
    setConfirmPassword('');
    setUserPin('');
    setAdminPin('');
    setCustomPin('');
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 sm:px-4 md:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto sm:px-4 md:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:px-4 md:px-6 lg:px-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2 sm:px-4 md:px-6 lg:px-8">
            🔐 Secure Input System Demo
          </h1>
          <p className="text-gray-400 text-lg sm:px-4 md:px-6 lg:px-8">
            Professional password and PIN input components with advanced security features
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Password Inputs Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card variant="elevated" padding="lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                  🔑 Password Inputs
                  <span className="text-sm text-gray-400 font-normal sm:px-4 md:px-6 lg:px-8">
                    Advanced security features
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 sm:px-4 md:px-6 lg:px-8">
                {/* Login Password */}
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-3 sm:px-4 md:px-6 lg:px-8">Login Password</h3>
                  <SecurePasswordInput
                    type="password"
                    value={loginPassword}
                    onChange={setLoginPassword}
                    placeholder="Your secure password"
                    showToggle={true}
                    error={errors.loginPassword}
                    minLength={8}
                    maxLength={50}
                    clearClipboardDelay={5000}
                  />
                </div>

                {/* Registration Password with Strength */}
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-3 sm:px-4 md:px-6 lg:px-8">Registration Password</h3>
                  <SecurePasswordInput
                    type="password"
                    value={registerPassword}
                    onChange={setRegisterPassword}
                    placeholder="Create a strong password"
                    showToggle={true}
                    strengthIndicator={true}
                    minLength={8}
                    maxLength={128}
                    clearClipboardDelay={5000}
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-3 sm:px-4 md:px-6 lg:px-8">Confirm Password</h3>
                  <SecurePasswordInput
                    type="password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    placeholder="Re-enter your password"
                    showToggle={true}
                    error={errors.confirmPassword}
                    clearClipboardDelay={5000}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* PIN Inputs Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card variant="elevated" padding="lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                  🔢 PIN Inputs
                  <span className="text-sm text-gray-400 font-normal sm:px-4 md:px-6 lg:px-8">
                    Visual progress indicators
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 sm:px-4 md:px-6 lg:px-8">
                {/* User PIN (4 digits) */}
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-3 sm:px-4 md:px-6 lg:px-8">User PIN (4 digits)</h3>
                  <SecurePinInput
                    type="pin"
                    value={userPin}
                    onChange={setUserPin}
                    label="User PIN"
                    placeholder="Enter 4-digit PIN"
                    showProgress={true}
                    allowPaste={false}
                    error={errors.userPin}
                    clearClipboardDelay={3000}
                  />
                </div>

                {/* Admin PIN (6 digits) */}
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-3 sm:px-4 md:px-6 lg:px-8">Admin PIN (6 digits)</h3>
                  <SecurePinInput
                    type="pin"
                    value={adminPin}
                    onChange={setAdminPin}
                    label="Admin PIN"
                    placeholder="Enter 6-digit admin PIN"
                    showProgress={true}
                    allowPaste={true}
                    error={errors.adminPin}
                    clearClipboardDelay={2000}
                  />
                </div>

                {/* Custom PIN with different mask */}
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-3 sm:px-4 md:px-6 lg:px-8">Custom PIN (8 digits)</h3>
                  <SecurePinInput
                    type="pin"
                    value={customPin}
                    onChange={setCustomPin}
                    maskCharacter="*"
                    label="Custom PIN"
                    placeholder="Enter 8-digit custom PIN"
                    showProgress={true}
                    allowPaste={true}
                    clearClipboardDelay={1000}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Security Features Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 sm:px-4 md:px-6 lg:px-8"
        >
          <Card variant="elevated" padding="lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                🛡️ Security Features
                <span className="text-sm text-gray-400 font-normal sm:px-4 md:px-6 lg:px-8">
                  Built-in protection mechanisms
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-green-500/10 border border-green-500/30 rounded-xl sm:px-4 md:px-6 lg:px-8">
                  <div className="text-2xl mb-2 sm:px-4 md:px-6 lg:px-8">🔒</div>
                  <h3 className="font-semibold text-green-300 mb-1 sm:px-4 md:px-6 lg:px-8">Input Masking</h3>
                  <p className="text-xs text-green-200/80 sm:px-4 md:px-6 lg:px-8">
                    Characters hidden with customizable mask symbols
                  </p>
                </div>
                
                <div className="text-center p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl sm:px-4 md:px-6 lg:px-8">
                  <div className="text-2xl mb-2 sm:px-4 md:px-6 lg:px-8">👁️</div>
                  <h3 className="font-semibold text-blue-300 mb-1 sm:px-4 md:px-6 lg:px-8">Toggle Visibility</h3>
                  <p className="text-xs text-blue-200/80 sm:px-4 md:px-6 lg:px-8">
                    Optional show/hide button for verification
                  </p>
                </div>
                
                <div className="text-center p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl sm:px-4 md:px-6 lg:px-8">
                  <div className="text-2xl mb-2 sm:px-4 md:px-6 lg:px-8">📋</div>
                  <h3 className="font-semibold text-purple-300 mb-1 sm:px-4 md:px-6 lg:px-8">Clipboard Clear</h3>
                  <p className="text-xs text-purple-200/80 sm:px-4 md:px-6 lg:px-8">
                    Automatic clipboard clearing after paste
                  </p>
                </div>
                
                <div className="text-center p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl sm:px-4 md:px-6 lg:px-8">
                  <div className="text-2xl mb-2 sm:px-4 md:px-6 lg:px-8">📱</div>
                  <h3 className="font-semibold text-orange-300 mb-1 sm:px-4 md:px-6 lg:px-8">Mobile Ready</h3>
                  <p className="text-xs text-orange-200/80 sm:px-4 md:px-6 lg:px-8">
                    Touch-friendly interactions and keyboards
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex justify-center gap-4 sm:px-4 md:px-6 lg:px-8"
        >
          <Button
            variant="primary"
            size="lg"
            onClick={validateDemo}
            className="px-8 sm:px-4 md:px-6 lg:px-8"
          >
            ✅ Validate All Inputs
          </Button>
          <Button
            variant="default"
            size="lg"
            onClick={clearDemo}
            className="px-8 sm:px-4 md:px-6 lg:px-8"
          >
            🗑️ Clear Demo
          </Button>
        </motion.div>

        {/* Implementation Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center sm:px-4 md:px-6 lg:px-8"
        >
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 sm:px-4 md:px-6 lg:px-8">
            <h3 className="text-lg font-semibold text-white mb-3 sm:px-4 md:px-6 lg:px-8">
              Implementation Highlights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
              <div>
                <strong className="text-green-400 sm:px-4 md:px-6 lg:px-8">Accessibility:</strong> Full ARIA support, keyboard navigation, screen reader compatible
              </div>
              <div>
                <strong className="text-blue-400 sm:px-4 md:px-6 lg:px-8">Security:</strong> Autocomplete disabled, clipboard clearing, input validation
              </div>
              <div>
                <strong className="text-purple-400 sm:px-4 md:px-6 lg:px-8">UX:</strong> Visual feedback, progress indicators, mobile-optimized
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const SecureInputDemoWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <SecureInputDemo {...props} />
  </ErrorBoundary>
);

export default React.memo(SecureInputDemoWithErrorBoundary);