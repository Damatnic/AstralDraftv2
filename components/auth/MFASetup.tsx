import React, { useState, useEffect } from 'react';
import { Shield, Smartphone, Key, Copy, CheckCircle, AlertCircle, Download } from 'lucide-react';

interface MFASetupProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

interface MFAStatus {
  enabled: boolean;
  backupCodesCount: number;
  enabledAt?: string;
  lastBackupCodeUsed?: string;
}

interface SetupData {
  qrCode: string;
  manualEntryKey: string;
  instructions: string;
}

const MFASetup: React.FC<MFASetupProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState<'status' | 'setup' | 'verify' | 'complete'>('status');
  const [mfaStatus, setMfaStatus] = useState<MFAStatus | null>(null);
  const [setupData, setSetupData] = useState<SetupData | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [manualEntry, setManualEntry] = useState(false);

  useEffect(() => {
    loadMFAStatus();
  }, []);

  const loadMFAStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/mfa/status', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMfaStatus(data.mfa);
      }
    } catch (error) {
      console.error('Failed to load MFA status:', error);
      setError('Failed to load MFA status');
    } finally {
      setLoading(false);
    }
  };

  const startSetup = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/mfa/setup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSetupData(data.setup);
        setStep('setup');
      } else {
        const error = await response.json();
        setError(error.error || 'Failed to start MFA setup');
      }
    } catch (error) {
      console.error('MFA setup error:', error);
      setError('Failed to start MFA setup');
    } finally {
      setLoading(false);
    }
  };

  const verifyAndEnable = async () => {
    if (verificationCode.length !== 6) {
      setError('Please enter a 6-digit verification code');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/mfa/enable', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: verificationCode })
      });
      
      if (response.ok) {
        const data = await response.json();
        setBackupCodes(data.backupCodes);
        setStep('complete');
        await loadMFAStatus();
      } else {
        const error = await response.json();
        setError(error.error || 'Verification failed');
      }
    } catch (error) {
      console.error('MFA verification error:', error);
      setError('Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const disableMFA = async (password: string, mfaToken: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/mfa/disable', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password, mfaToken })
      });
      
      if (response.ok) {
        await loadMFAStatus();
        setStep('status');
      } else {
        const error = await response.json();
        setError(error.error || 'Failed to disable MFA');
      }
    } catch (error) {
      console.error('MFA disable error:', error);
      setError('Failed to disable MFA');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(text);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const downloadBackupCodes = () => {
    const content = backupCodes.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'astral-draft-backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading && !mfaStatus) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Two-Factor Authentication
        </h2>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
            <span className="text-red-800 dark:text-red-200">{error}</span>
          </div>
        </div>
      )}

      {step === 'status' && mfaStatus && (
        <div>
          {mfaStatus.enabled ? (
            <div className="space-y-6">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  <span className="text-green-800 dark:text-green-200">
                    Two-factor authentication is enabled
                  </span>
                </div>
                {mfaStatus.enabledAt && (
                  <p className="text-sm text-green-600 dark:text-green-300 mt-2">
                    Enabled on {new Date(mfaStatus.enabledAt).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Backup Codes Status
                </h3>
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {mfaStatus.backupCodesCount} backup codes remaining
                  </span>
                </div>
                {mfaStatus.backupCodesCount <= 2 && (
                  <p className="text-amber-600 dark:text-amber-400 text-sm mt-2">
                    You're running low on backup codes. Consider regenerating them.
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {/* TODO: Implement regenerate backup codes */}}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Regenerate Backup Codes
                </button>
                <button
                  onClick={() => {/* TODO: Implement disable MFA modal */}}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Disable MFA
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md p-4">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-amber-400 mr-2" />
                  <span className="text-amber-800 dark:text-amber-200">
                    Two-factor authentication is not enabled
                  </span>
                </div>
              </div>

              <div className="prose dark:prose-invert">
                <p>
                  Two-factor authentication adds an extra layer of security to your account.
                  When enabled, you'll need to provide a verification code from your
                  authenticator app in addition to your password.
                </p>
                <h4>Benefits:</h4>
                <ul>
                  <li>Protection against password theft</li>
                  <li>Secure access even if your password is compromised</li>
                  <li>Industry-standard security practice</li>
                </ul>
              </div>

              <button
                onClick={startSetup}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Starting Setup...' : 'Enable Two-Factor Authentication'}
              </button>
            </div>
          )}
        </div>
      )}

      {step === 'setup' && setupData && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Setup Your Authenticator App</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Scan the QR code below with your authenticator app or enter the code manually.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center">
            {!manualEntry ? (
              <div>
                <div className="bg-white p-4 rounded-lg inline-block mb-4">
                  <img 
                    src={setupData.qrCode} 
                    alt="QR Code" 
                    className="w-48 h-48 mx-auto"
                  />
                </div>
                <button
                  onClick={() => setManualEntry(true)}
                  className="text-blue-600 hover:text-blue-700 text-sm underline"
                >
                  Can't scan? Enter code manually
                </button>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Enter this code in your authenticator app:
                </p>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                  <code className="font-mono text-lg tracking-wider">
                    {setupData.manualEntryKey}
                  </code>
                  <button
                    onClick={() => copyToClipboard(setupData.manualEntryKey)}
                    className="ml-3 text-blue-600 hover:text-blue-700"
                  >
                    <Copy className="w-4 h-4 inline" />
                  </button>
                  {copiedCode === setupData.manualEntryKey && (
                    <span className="ml-2 text-green-600 text-sm">Copied!</span>
                  )}
                </div>
                <button
                  onClick={() => setManualEntry(false)}
                  className="text-blue-600 hover:text-blue-700 text-sm underline mt-4"
                >
                  Show QR code instead
                </button>
              </div>
            )}
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
            <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
              Recommended Authenticator Apps:
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
              <li>• Google Authenticator (iOS/Android)</li>
              <li>• Microsoft Authenticator (iOS/Android)</li>
              <li>• Authy (iOS/Android/Desktop)</li>
              <li>• 1Password (Premium feature)</li>
            </ul>
          </div>

          <button
            onClick={() => setStep('verify')}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Continue to Verification
          </button>
        </div>
      )}

      {step === 'verify' && (
        <div className="space-y-6">
          <div className="text-center">
            <Smartphone className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Verify Your Setup</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Enter the 6-digit code from your authenticator app to complete setup.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Verification Code
            </label>
            <input
              type="text"
              maxLength={6}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
              className="w-full text-center text-2xl tracking-widest px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="000000"
              autoComplete="one-time-code"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep('setup')}
              className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
            >
              Back
            </button>
            <button
              onClick={verifyAndEnable}
              disabled={loading || verificationCode.length !== 6}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Enable MFA'}
            </button>
          </div>
        </div>
      )}

      {step === 'complete' && (
        <div className="space-y-6">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-green-900 dark:text-green-200">
              MFA Successfully Enabled!
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your account is now protected with two-factor authentication.
            </p>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md p-4">
            <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-2">
              Important: Save Your Backup Codes
            </h4>
            <p className="text-amber-800 dark:text-amber-300 text-sm mb-3">
              These backup codes can be used to access your account if you lose your authenticator device.
              Save them in a secure location and never share them with anyone.
            </p>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded border font-mono text-sm">
              {backupCodes.map((code, index) => (
                <div key={index} className="flex justify-between items-center py-1">
                  <span>{code}</span>
                  <button
                    onClick={() => copyToClipboard(code)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {copiedCode === code ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={downloadBackupCodes}
              className="mt-3 flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <Download className="w-4 h-4" />
              Download backup codes
            </button>
          </div>

          <button
            onClick={() => {
              onComplete?.();
              setStep('status');
            }}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Complete Setup
          </button>
        </div>
      )}

      {onCancel && step !== 'status' && (
        <div className="mt-6 text-center">
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default MFASetup;