/**
 * Password Management Widget for Admin Dashboard
 * Allows administrators to generate secure random passwords for all league users
 */

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import SimpleAuthService from '../../services/simpleAuthService';
import { PasswordUpdateUtility } from '../../utils/passwordUpdateUtility';

interface PasswordStatus {
  id: string;
  displayName: string;
  passwordSet: boolean;
  isSecurePattern: boolean;
  isMainUser: boolean;
  lastUpdated?: string;
}

interface SecurityReport {
  totalUsers: number;
  securePasswords: number;
  weakPasswords: number;
  mainUsersProtected: boolean;
  recommendations: string[];
}

const PasswordManagementWidget: React.FC = () => {
  const [passwordStatus, setPasswordStatus] = useState<PasswordStatus[]>([]);
  const [securityReport, setSecurityReport] = useState<SecurityReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [updateResult, setUpdateResult] = useState<{ success: boolean; message: string } | null>(null);

  // Load initial data
  useEffect(() => {
    loadPasswordData();
  }, []);

  const loadPasswordData = () => {
    try {
      const status = SimpleAuthService.getUserPasswordStatus();
      const report = SimpleAuthService.generatePasswordSecurityReport();
      
      setPasswordStatus(status);
      setSecurityReport(report);
    } catch (error) {
      console.error('Failed to load password data:', error);
    }
  };

  const handleGeneratePasswords = async () => {
    setIsLoading(true);
    setUpdateResult(null);
    
    try {
      const result = await PasswordUpdateUtility.executePasswordUpdate();
      
      if (result.success) {
        setUpdateResult({ success: true, message: result.message });
        setLastUpdate(new Date().toISOString());
        loadPasswordData(); // Refresh the data
      } else {
        setUpdateResult({ 
          success: false, 
          message: result.errors?.join(', ') || 'Failed to update passwords' 
        });
      }
    } catch (error) {
      setUpdateResult({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error occurred' 
      });
    } finally {
      setIsLoading(false);
      setShowConfirmation(false);
    }
  };

  const getSecurityStatusIcon = (isSecure: boolean) => {
    return isSecure ? '🔒' : '⚠️';
  };

  const getSecurityStatusColor = (isSecure: boolean) => {
    return isSecure ? 'text-green-600' : 'text-yellow-600';
  };

  const getSecurityScore = () => {
    if (!securityReport) return 0;
    return Math.round((securityReport.securePasswords / securityReport.totalUsers) * 100);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔐 Password Security Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Security Overview */}
        {securityReport && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {securityReport.totalUsers}
                </div>
                <div className="text-sm text-gray-600">Total Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {securityReport.securePasswords}
                </div>
                <div className="text-sm text-gray-600">Secure Passwords</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {securityReport.weakPasswords}
                </div>
                <div className="text-sm text-gray-600">Weak Passwords</div>
              </div>
            </div>
            
            {/* Security Score */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Security Score</span>
                <span>{getSecurityScore()}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    getSecurityScore() >= 80 ? 'bg-green-500' :
                    getSecurityScore() >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${getSecurityScore()}%` }}
                ></div>
              </div>
            </div>

            {/* Main Users Protection Status */}
            <div className="flex items-center gap-2 text-sm">
              <span className={securityReport.mainUsersProtected ? '✅' : '❌'}>
                {securityReport.mainUsersProtected ? '✅' : '❌'}
              </span>
              <span>Main user passwords protected</span>
            </div>
          </div>
        )}

        {/* User Password Status */}
        <div>
          <h4 className="font-medium mb-3">User Password Status</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {passwordStatus.map((user) => (
              <div 
                key={user.id} 
                className="flex items-center justify-between p-3 bg-white border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">
                    {user.isMainUser ? '👑' : '👤'}
                  </span>
                  <div>
                    <div className="font-medium text-sm">{user.displayName}</div>
                    <div className="text-xs text-gray-500">{user.id}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${getSecurityStatusColor(user.isSecurePattern)}`}>
                    {getSecurityStatusIcon(user.isSecurePattern)}
                    {user.isSecurePattern ? 'Secure' : 'Weak'}
                  </span>
                  {user.isMainUser && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      Protected
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          {/* Generate Passwords Button */}
          <div className="flex flex-col gap-2">
            {!showConfirmation ? (
              <Button
                onClick={() => setShowConfirmation(true)}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                🔐 Generate Secure Passwords for All Users
              </Button>
            ) : (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="text-sm font-medium text-yellow-800 mb-2">
                  ⚠️ Confirm Password Generation
                </div>
                <div className="text-sm text-yellow-700 mb-3">
                  This will generate new secure 4-digit passwords for all non-main users. 
                  Main user passwords (admin and player1) will be preserved.
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleGeneratePasswords}
                    disabled={isLoading}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isLoading ? '⏳ Generating...' : '✅ Confirm'}
                  </Button>
                  <Button
                    onClick={() => setShowConfirmation(false)}
                    disabled={isLoading}
                    size="sm"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Update Result */}
          {updateResult && (
            <div className={`p-3 rounded-lg ${
              updateResult.success 
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              <div className="flex items-center gap-2">
                <span>{updateResult.success ? '✅' : '❌'}</span>
                <span className="text-sm font-medium">
                  {updateResult.success ? 'Success!' : 'Error'}
                </span>
              </div>
              <div className="text-sm mt-1">{updateResult.message}</div>
            </div>
          )}

          {/* Last Update Info */}
          {lastUpdate && (
            <div className="text-xs text-gray-500 text-center">
              Last password generation: {new Date(lastUpdate).toLocaleString()}
            </div>
          )}

          {/* Recommendations */}
          {securityReport && securityReport.recommendations.length > 0 && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm font-medium text-blue-800 mb-2">
                💡 Security Recommendations
              </div>
              <ul className="text-sm text-blue-700 space-y-1">
                {securityReport.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span>•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Refresh Button */}
          <Button
            onClick={loadPasswordData}
            variant="outline"
            size="sm"
            className="w-full"
          >
            🔄 Refresh Status
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PasswordManagementWidget;