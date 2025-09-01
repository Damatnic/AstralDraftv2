import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useMemo, useState, useEffect } from &apos;react&apos;;
import { Shield, Smartphone, Key, Copy, CheckCircle, AlertCircle, Download } from &apos;lucide-react&apos;;

interface MFASetupProps {
}
  onComplete?: () => void;
  onCancel?: () => void;

}

interface MFAStatus {
}
  enabled: boolean;
  backupCodesCount: number;
  enabledAt?: string;
  lastBackupCodeUsed?: string;

interface SetupData {
}
  qrCode: string;
  manualEntryKey: string;
  instructions: string;

}

const MFASetup: React.FC<MFASetupProps> = ({ onComplete, onCancel  }: any) => {
}
  const [isLoading, setIsLoading] = React.useState(false);
  const [step, setStep] = useState<&apos;status&apos; | &apos;setup&apos; | &apos;verify&apos; | &apos;complete&apos;>(&apos;status&apos;);
  const [mfaStatus, setMfaStatus] = useState<MFAStatus | null>(null);
  const [setupData, setSetupData] = useState<SetupData | null>(null);
  const [verificationCode, setVerificationCode] = useState(&apos;&apos;);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [manualEntry, setManualEntry] = useState(false);

  useEffect(() => {
}
    loadMFAStatus();
  }, []);

  const loadMFAStatus = async () => {
}
    try {
}
      setLoading(true);
      const response = await fetch(&apos;/api/mfa/status&apos;, {
}
        headers: {
}
          &apos;Authorization&apos;: `Bearer ${localStorage.getItem(&apos;token&apos;)}`

      });
      
      if (response.ok) {
}
        const data = await response.json();
        setMfaStatus(data.mfa);
  } finally {
}
      setLoading(false);

  };

  const startSetup = async () => {
}
    try {
}
      setLoading(true);
      setError(null);
      
      const response = await fetch(&apos;/api/mfa/setup&apos;, {
}
        method: &apos;POST&apos;,
        headers: {
}
          &apos;Authorization&apos;: `Bearer ${localStorage.getItem(&apos;token&apos;)}`,
          &apos;Content-Type&apos;: &apos;application/json&apos;

      });
      
      if (response.ok) {
}
        const data = await response.json();
        setSetupData(data.setup);
        setStep(&apos;setup&apos;);
      } else {
}
        const error = await response.json();
        setError(error.error || &apos;Failed to start MFA setup&apos;);

    } catch (error) {
}
      console.error(&apos;MFA setup error:&apos;, error);
      setError(&apos;Failed to start MFA setup&apos;);
    } finally {
}
      setLoading(false);

  };

  const verifyAndEnable = async () => {
}
    try {
}
    if (verificationCode.length !== 6) {
}
      setError(&apos;Please enter a 6-digit verification code&apos;);
      return;
    
    `Bearer ${localStorage.getItem(&apos;token&apos;)}`,
          &apos;Content-Type&apos;: &apos;application/json&apos;
        },
        body: JSON.stringify({ token: verificationCode })
      });
      
      if (response.ok) {
}
        const data = await response.json();
        setBackupCodes(data.backupCodes);
        setStep(&apos;complete&apos;);
        await loadMFAStatus();
      } else {
}
        const error = await response.json();
        setError(error.error || &apos;Verification failed&apos;);
  } finally {
}
      setLoading(false);

  };

  const disableMFA = async (password: string, mfaToken: string) => {
}
    try {
}
      setLoading(true);
      setError(null);
      
      const response = await fetch(&apos;/api/mfa/disable&apos;, {
}
        method: &apos;POST&apos;,
        headers: {
}
          &apos;Authorization&apos;: `Bearer ${localStorage.getItem(&apos;token&apos;)}`,
          &apos;Content-Type&apos;: &apos;application/json&apos;
        },
        body: JSON.stringify({ password, mfaToken })
      });
      
      if (response.ok) {
}
        await loadMFAStatus();
        setStep(&apos;status&apos;);
      } else {
}
        const error = await response.json();
        setError(error.error || &apos;Failed to disable MFA&apos;);

    } catch (error) {
}
      console.error(&apos;MFA disable error:&apos;, error);
      setError(&apos;Failed to disable MFA&apos;);
    } finally {
}
      setLoading(false);

  };

  const copyToClipboard = async (text: string) => {
}
    try {
}

      await navigator.clipboard.writeText(text);
      setCopiedCode(text);
      setTimeout(() => setCopiedCode(null), 2000);

    } catch (error) {
}
      console.error(&apos;Failed to copy:&apos;, error);

  };

  const downloadBackupCodes = () => {
}
    const content = backupCodes.join(&apos;\n&apos;);
    const blob = new Blob([content], { type: &apos;text/plain&apos; });
    const url = URL.createObjectURL(blob);
    const a = document.createElement(&apos;a&apos;);
    a.href = url;
    a.download = &apos;astral-draft-backup-codes.txt&apos;;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading && !mfaStatus) {
}
    return (
      <div className="flex items-center justify-center p-8 sm:px-4 md:px-6 lg:px-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 sm:px-4 md:px-6 lg:px-8"></div>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg sm:px-4 md:px-6 lg:px-8">
      <div className="flex items-center gap-3 mb-6 sm:px-4 md:px-6 lg:px-8">
        <Shield className="w-6 h-6 text-blue-600 sm:px-4 md:px-6 lg:px-8" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:px-4 md:px-6 lg:px-8">
          Two-Factor Authentication
        </h2>
      </div>

      {error && (
}
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-6 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center sm:px-4 md:px-6 lg:px-8">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2 sm:px-4 md:px-6 lg:px-8" />
            <span className="text-red-800 dark:text-red-200 sm:px-4 md:px-6 lg:px-8">{error}</span>
          </div>
        </div>
      )}

      {step === &apos;status&apos; && mfaStatus && (
}
        <div>
          {mfaStatus.enabled ? (
}
            <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4 sm:px-4 md:px-6 lg:px-8">
                <div className="flex items-center sm:px-4 md:px-6 lg:px-8">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2 sm:px-4 md:px-6 lg:px-8" />
                  <span className="text-green-800 dark:text-green-200 sm:px-4 md:px-6 lg:px-8">
                    Two-factor authentication is enabled
                  </span>
                </div>
                {mfaStatus.enabledAt && (
}
                  <p className="text-sm text-green-600 dark:text-green-300 mt-2 sm:px-4 md:px-6 lg:px-8">
                    Enabled on {new Date(mfaStatus.enabledAt).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4 sm:px-4 md:px-6 lg:px-8">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 sm:px-4 md:px-6 lg:px-8">
                  Backup Codes Status
                </h3>
                <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                  <Key className="w-4 h-4 text-gray-500 sm:px-4 md:px-6 lg:px-8" />
                  <span className="text-gray-700 dark:text-gray-300 sm:px-4 md:px-6 lg:px-8">
                    {mfaStatus.backupCodesCount} backup codes remaining
                  </span>
                </div>
                {mfaStatus.backupCodesCount <= 2 && (
}
                  <p className="text-amber-600 dark:text-amber-400 text-sm mt-2 sm:px-4 md:px-6 lg:px-8">
                    You&apos;re running low on backup codes. Consider regenerating them.
                  </p>
                )}
              </div>

              <div className="flex gap-3 sm:px-4 md:px-6 lg:px-8">
                <button
                  onClick={() => {/* TODO: Implement regenerate backup codes */}}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-4 md:px-6 lg:px-8"
                >
                  Regenerate Backup Codes
                </button>
                <button
                  onClick={() => {/* TODO: Implement disable MFA modal */}}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 sm:px-4 md:px-6 lg:px-8"
                >
                  Disable MFA
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md p-4 sm:px-4 md:px-6 lg:px-8">
                <div className="flex items-center sm:px-4 md:px-6 lg:px-8">
                  <AlertCircle className="w-5 h-5 text-amber-400 mr-2 sm:px-4 md:px-6 lg:px-8" />
                  <span className="text-amber-800 dark:text-amber-200 sm:px-4 md:px-6 lg:px-8">
                    Two-factor authentication is not enabled
                  </span>
                </div>
              </div>

              <div className="prose dark:prose-invert sm:px-4 md:px-6 lg:px-8">
                <p>
                  Two-factor authentication adds an extra layer of security to your account.
                  When enabled, you&apos;ll need to provide a verification code from your
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
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 sm:px-4 md:px-6 lg:px-8"
               aria-label="Action button">
                {loading ? &apos;Starting Setup...&apos; : &apos;Enable Two-Factor Authentication&apos;}
              </button>
            </div>
          )}
        </div>
      )}

      {step === &apos;setup&apos; && setupData && (
}
        <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center sm:px-4 md:px-6 lg:px-8">
            <h3 className="text-xl font-semibold mb-4 sm:px-4 md:px-6 lg:px-8">Setup Your Authenticator App</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 sm:px-4 md:px-6 lg:px-8">
              Scan the QR code below with your authenticator app or enter the code manually.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center sm:px-4 md:px-6 lg:px-8">
            {!manualEntry ? (
}
              <div>
                <div className="bg-white p-4 rounded-lg inline-block mb-4 sm:px-4 md:px-6 lg:px-8">
                  <img 
                    src={setupData.qrCode} 
                    alt="QR Code" 
                    className="w-48 h-48 mx-auto sm:px-4 md:px-6 lg:px-8"
                  />
                </div>
                <button
                  onClick={() => setManualEntry(true)}
                >
                  Can&apos;t scan? Enter code manually
                </button>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 sm:px-4 md:px-6 lg:px-8">
                  Enter this code in your authenticator app:
                </p>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border sm:px-4 md:px-6 lg:px-8">
                  <code className="font-mono text-lg tracking-wider sm:px-4 md:px-6 lg:px-8">
                    {setupData.manualEntryKey}
                  </code>
                  <button
                    onClick={() => copyToClipboard(setupData.manualEntryKey)}
                  >
                    <Copy className="w-4 h-4 inline sm:px-4 md:px-6 lg:px-8" />
                  </button>
                  {copiedCode === setupData.manualEntryKey && (
}
                    <span className="ml-2 text-green-600 text-sm sm:px-4 md:px-6 lg:px-8">Copied!</span>
                  )}
                </div>
                <button
                  onClick={() => setManualEntry(false)}
                >
                  Show QR code instead
                </button>
              </div>
            )}
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4 sm:px-4 md:px-6 lg:px-8">
            <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 sm:px-4 md:px-6 lg:px-8">
              Recommended Authenticator Apps:
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1 sm:px-4 md:px-6 lg:px-8">
              <li>• Google Authenticator (iOS/Android)</li>
              <li>• Microsoft Authenticator (iOS/Android)</li>
              <li>• Authy (iOS/Android/Desktop)</li>
              <li>• 1Password (Premium feature)</li>
            </ul>
          </div>

          <button
            onClick={() => setStep(&apos;verify&apos;)}
          >
            Continue to Verification
          </button>
        </div>
      )}

      {step === &apos;verify&apos; && (
}
        <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center sm:px-4 md:px-6 lg:px-8">
            <Smartphone className="w-16 h-16 text-blue-600 mx-auto mb-4 sm:px-4 md:px-6 lg:px-8" />
            <h3 className="text-xl font-semibold mb-2 sm:px-4 md:px-6 lg:px-8">Verify Your Setup</h3>
            <p className="text-gray-600 dark:text-gray-400 sm:px-4 md:px-6 lg:px-8">
              Enter the 6-digit code from your authenticator app to complete setup.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:px-4 md:px-6 lg:px-8">
              Verification Code
            </label>
            <input
              type="text"
              maxLength={6}
              value={verificationCode}
              onChange={(e: any) => setVerificationCode(e.target.value.replace(/\D/g, &apos;&apos;))}
              placeholder="000000"
              autoComplete="one-time-code"
            />
          </div>

          <div className="flex gap-3 sm:px-4 md:px-6 lg:px-8">
            <button
              onClick={() => setStep(&apos;setup&apos;)}
            >
//               Back
            </button>
            <button
              onClick={verifyAndEnable}
              disabled={loading || verificationCode.length !== 6}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 sm:px-4 md:px-6 lg:px-8"
             aria-label="Action button">
              {loading ? &apos;Verifying...&apos; : &apos;Enable MFA&apos;}
            </button>
          </div>
        </div>
      )}

      {step === &apos;complete&apos; && (
}
        <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center sm:px-4 md:px-6 lg:px-8">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4 sm:px-4 md:px-6 lg:px-8" />
            <h3 className="text-xl font-semibold mb-2 text-green-900 dark:text-green-200 sm:px-4 md:px-6 lg:px-8">
              MFA Successfully Enabled!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 sm:px-4 md:px-6 lg:px-8">
              Your account is now protected with two-factor authentication.
            </p>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md p-4 sm:px-4 md:px-6 lg:px-8">
            <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-2 sm:px-4 md:px-6 lg:px-8">
              Important: Save Your Backup Codes
            </h4>
            <p className="text-amber-800 dark:text-amber-300 text-sm mb-3 sm:px-4 md:px-6 lg:px-8">
              These backup codes can be used to access your account if you lose your authenticator device.
              Save them in a secure location and never share them with anyone.
            </p>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded border font-mono text-sm sm:px-4 md:px-6 lg:px-8">
              {backupCodes.map((code, index) => (
}
                <div key={index} className="flex justify-between items-center py-1 sm:px-4 md:px-6 lg:px-8">
                  <span>{code}</span>
                  <button
                    onClick={() => copyToClipboard(code)}
                  >
                    {copiedCode === code ? <CheckCircle className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" /> : <Copy className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />}
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={downloadBackupCodes}
              className="mt-3 flex items-center gap-2 text-blue-600 hover:text-blue-700 sm:px-4 md:px-6 lg:px-8"
             aria-label="Action button">
              <Download className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
              Download backup codes
            </button>
          </div>

          <button
            onClick={() = aria-label="Action button"> {
}
              onComplete?.();
              setStep(&apos;status&apos;);
            }}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 sm:px-4 md:px-6 lg:px-8"
          >
            Complete Setup
          </button>
        </div>
      )}

      {onCancel && step !== &apos;status&apos; && (
}
        <div className="mt-6 text-center sm:px-4 md:px-6 lg:px-8">
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 sm:px-4 md:px-6 lg:px-8"
           aria-label="Action button">
//             Cancel
          </button>
        </div>
      )}
    </div>
  );
};

const MFASetupWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <MFASetup {...props} />
  </ErrorBoundary>
);

export default React.memo(MFASetupWithErrorBoundary);