/**
 * Multi-Factor Authentication Service
 * Provides TOTP (Time-based One-Time Password) authentication and backup codes
 */

const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const crypto = require('crypto');
const User = require('../models/User');

class MFAService {
  constructor() {
    this.appName = process.env.APP_NAME || 'Astral Draft';
    this.issuer = process.env.MFA_ISSUER || 'astraldraft.com';
  }

  /**
   * Generate TOTP secret for user
   */
  async generateTOTPSecret(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Generate secret
      const secret = speakeasy.generateSecret({
        length: 32,
        name: `${this.appName} (${user.email})`,
        issuer: this.issuer
      });

      // Store encrypted secret temporarily (user hasn't confirmed setup yet)
      const encryptedSecret = this.encryptSecret(secret.base32);
      user.twoFactorAuth.tempSecret = encryptedSecret;
      user.twoFactorAuth.tempSecretCreatedAt = new Date();
      await user.save();

      return {
        secret: secret.base32,
        qrCodeUrl: secret.otpauth_url,
        manualEntryKey: secret.base32
      };
    } catch (error) {
      console.error('MFA secret generation error:', error);
      throw new Error('Failed to generate MFA secret');
    }
  }

  /**
   * Generate QR code for TOTP setup
   */
  async generateQRCode(otpauthUrl) {
    try {
      return await QRCode.toDataURL(otpauthUrl);
    } catch (error) {
      console.error('QR code generation error:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  /**
   * Verify TOTP token and enable MFA
   */
  async enableMFA(userId, token) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.twoFactorAuth.tempSecret) {
        throw new Error('No MFA setup in progress');
      }

      // Check if temp secret has expired (15 minutes)
      const secretAge = Date.now() - user.twoFactorAuth.tempSecretCreatedAt.getTime();
      if (secretAge > 15 * 60 * 1000) {
        throw new Error('MFA setup has expired, please start over');
      }

      const decryptedSecret = this.decryptSecret(user.twoFactorAuth.tempSecret);
      
      // Verify the token
      const verified = speakeasy.totp.verify({
        secret: decryptedSecret,
        encoding: 'base32',
        token,
        window: 2 // Allow 2 time steps before/after current time
      });

      if (!verified) {
        throw new Error('Invalid verification code');
      }

      // Generate backup codes
      const backupCodes = this.generateBackupCodes();
      const encryptedBackupCodes = backupCodes.map(code => this.encryptSecret(code));

      // Enable MFA
      user.twoFactorAuth.enabled = true;
      user.twoFactorAuth.secret = this.encryptSecret(decryptedSecret);
      user.twoFactorAuth.backupCodes = encryptedBackupCodes;
      user.twoFactorAuth.tempSecret = undefined;
      user.twoFactorAuth.tempSecretCreatedAt = undefined;
      user.twoFactorAuth.enabledAt = new Date();
      
      await user.save();

      return {
        success: true,
        backupCodes // Return unencrypted codes to user once
      };
    } catch (error) {
      console.error('MFA enable error:', error);
      throw error;
    }
  }

  /**
   * Verify TOTP token for authentication
   */
  async verifyTOTP(userId, token) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.twoFactorAuth.enabled) {
        throw new Error('MFA not enabled for user');
      }

      const decryptedSecret = this.decryptSecret(user.twoFactorAuth.secret);
      
      const verified = speakeasy.totp.verify({
        secret: decryptedSecret,
        encoding: 'base32',
        token,
        window: 2
      });

      return verified;
    } catch (error) {
      console.error('TOTP verification error:', error);
      return false;
    }
  }

  /**
   * Verify backup code
   */
  async verifyBackupCode(userId, code) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.twoFactorAuth.enabled) {
        throw new Error('MFA not enabled for user');
      }

      // Check if code matches any unused backup codes
      const codeIndex = user.twoFactorAuth.backupCodes.findIndex(encryptedCode => {
        const decryptedCode = this.decryptSecret(encryptedCode);
        return decryptedCode === code;
      });

      if (codeIndex === -1) {
        return false;
      }

      // Remove used backup code
      user.twoFactorAuth.backupCodes.splice(codeIndex, 1);
      user.twoFactorAuth.lastBackupCodeUsed = new Date();
      await user.save();

      // Alert user if running low on backup codes
      if (user.twoFactorAuth.backupCodes.length <= 2) {
        // TODO: Send email notification about low backup codes
        console.warn(`User ${userId} has ${user.twoFactorAuth.backupCodes.length} backup codes remaining`);
      }

      return true;
    } catch (error) {
      console.error('Backup code verification error:', error);
      return false;
    }
  }

  /**
   * Generate new backup codes
   */
  async regenerateBackupCodes(userId, currentPassword) {
    try {
      const user = await User.findById(userId).select('+password');
      if (!user) {
        throw new Error('User not found');
      }

      const bcrypt = require('bcryptjs');
      const validPassword = await bcrypt.compare(currentPassword, user.password);
      if (!validPassword) {
        throw new Error('Invalid password');
      }

      const backupCodes = this.generateBackupCodes();
      const encryptedBackupCodes = backupCodes.map(code => this.encryptSecret(code));

      user.twoFactorAuth.backupCodes = encryptedBackupCodes;
      user.twoFactorAuth.backupCodesGeneratedAt = new Date();
      await user.save();

      return backupCodes;
    } catch (error) {
      console.error('Backup codes regeneration error:', error);
      throw error;
    }
  }

  /**
   * Disable MFA
   */
  async disableMFA(userId, currentPassword, mfaToken) {
    try {
      const user = await User.findById(userId).select('+password');
      if (!user) {
        throw new Error('User not found');
      }

      // Verify password
      const bcrypt = require('bcryptjs');
      const validPassword = await bcrypt.compare(currentPassword, user.password);
      if (!validPassword) {
        throw new Error('Invalid password');
      }

      // Verify MFA token
      const mfaValid = await this.verifyTOTP(userId, mfaToken) || 
                      await this.verifyBackupCode(userId, mfaToken);
      
      if (!mfaValid) {
        throw new Error('Invalid MFA code');
      }

      // Disable MFA
      user.twoFactorAuth = {
        enabled: false,
        secret: null,
        backupCodes: [],
        disabledAt: new Date()
      };

      await user.save();

      return { success: true };
    } catch (error) {
      console.error('MFA disable error:', error);
      throw error;
    }
  }

  /**
   * Generate backup codes
   */
  generateBackupCodes(count = 10) {
    const codes = [];
    for (let i = 0; i < count; i++) {
      // Generate 8-digit backup code
      const code = crypto.randomBytes(4).toString('hex').toUpperCase();
      codes.push(code);
    }
    return codes;
  }

  /**
   * Encrypt sensitive data
   */
  encryptSecret(text) {
    try {
      const algorithm = 'aes-256-gcm';
      const key = Buffer.from(process.env.ENCRYPTION_KEY || 'default-32-character-key-change', 'utf8');
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipher(algorithm, key);
      
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      const authTag = cipher.getAuthTag();
      
      return {
        encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex')
      };
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Decrypt sensitive data
   */
  decryptSecret(encryptedData) {
    try {
      if (typeof encryptedData === 'string') {
        return encryptedData; // Fallback for legacy data
      }

      const algorithm = 'aes-256-gcm';
      const key = Buffer.from(process.env.ENCRYPTION_KEY || 'default-32-character-key-change', 'utf8');
      const decipher = crypto.createDecipher(algorithm, key);
      
      decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
      
      let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  /**
   * Get MFA status for user
   */
  async getMFAStatus(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      return {
        enabled: user.twoFactorAuth.enabled,
        backupCodesCount: user.twoFactorAuth.backupCodes?.length || 0,
        enabledAt: user.twoFactorAuth.enabledAt,
        lastBackupCodeUsed: user.twoFactorAuth.lastBackupCodeUsed
      };
    } catch (error) {
      console.error('MFA status error:', error);
      throw error;
    }
  }
}

module.exports = new MFAService();