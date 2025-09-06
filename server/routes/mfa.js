/**
 * Multi-Factor Authentication Routes
 * Handles MFA setup, verification, and management
 */

const express = require('express');
const rateLimit = require('express-rate-limit');
const { authenticateToken } = require('../middleware/auth');
const mfaService = require('../services/mfaService');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Rate limiting for MFA endpoints
const mfaLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per window
  message: { error: 'Too many MFA attempts, please try again later' }
});

const strictMfaLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // 3 attempts per window
  message: { error: 'Too many verification attempts, please try again later' }
});

/**
 * GET /api/mfa/status
 * Get MFA status for current user
 */
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const status = await mfaService.getMFAStatus(req.userId);
    res.json({
      success: true,
      mfa: status
    });
  } catch (error) {
    console.error('Get MFA status error:', error);
    res.status(500).json({ error: 'Failed to get MFA status' });
  }
});

/**
 * POST /api/mfa/setup
 * Start MFA setup process
 */
router.post('/setup', authenticateToken, mfaLimiter, async (req, res) => {
  try {
    const mfaData = await mfaService.generateTOTPSecret(req.userId);
    const qrCode = await mfaService.generateQRCode(mfaData.qrCodeUrl);

    res.json({
      success: true,
      setup: {
        qrCode,
        manualEntryKey: mfaData.manualEntryKey,
        instructions: 'Scan the QR code with your authenticator app or manually enter the key'
      }
    });
  } catch (error) {
    console.error('MFA setup error:', error);
    res.status(500).json({ error: error.message || 'Failed to setup MFA' });
  }
});

/**
 * POST /api/mfa/enable
 * Complete MFA setup and enable
 */
router.post('/enable', 
  authenticateToken,
  strictMfaLimiter,
  [
    body('token')
      .isLength({ min: 6, max: 6 })
      .isNumeric()
      .withMessage('Token must be a 6-digit number')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          error: 'Invalid token format',
          details: errors.array()[0].msg
        });
      }

      const { token } = req.body;
      const result = await mfaService.enableMFA(req.userId, token);

      res.json({
        success: true,
        message: 'MFA enabled successfully',
        backupCodes: result.backupCodes,
        warning: 'Save these backup codes in a secure location. You will not see them again.'
      });
    } catch (error) {
      console.error('MFA enable error:', error);
      res.status(400).json({ error: error.message || 'Failed to enable MFA' });
    }
  }
);

/**
 * POST /api/mfa/verify
 * Verify MFA token during login
 */
router.post('/verify',
  strictMfaLimiter,
  [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('token').notEmpty().withMessage('Token is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          error: 'Validation failed',
          details: errors.array()[0].msg
        });
      }

      const { userId, token } = req.body;

      // Try TOTP first, then backup code
      let verified = false;
      let usedBackupCode = false;

      if (token.length === 6 && /^\d+$/.test(token)) {
        // TOTP token
        verified = await mfaService.verifyTOTP(userId, token);
      } else if (token.length === 8 && /^[A-Fa-f0-9]+$/.test(token.toUpperCase())) {
        // Backup code
        verified = await mfaService.verifyBackupCode(userId, token.toUpperCase());
        usedBackupCode = verified;
      }

      if (!verified) {
        return res.status(401).json({ 
          error: 'Invalid verification code',
          hint: 'Enter 6-digit code from authenticator app or 8-character backup code'
        });
      }

      res.json({
        success: true,
        message: 'MFA verification successful',
        ...(usedBackupCode && { warning: 'Backup code used. Consider regenerating backup codes.' })
      });
    } catch (error) {
      console.error('MFA verify error:', error);
      res.status(500).json({ error: 'Failed to verify MFA' });
    }
  }
);

/**
 * POST /api/mfa/backup-codes/regenerate
 * Regenerate backup codes
 */
router.post('/backup-codes/regenerate',
  authenticateToken,
  mfaLimiter,
  [
    body('password').notEmpty().withMessage('Current password is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          error: 'Validation failed',
          details: errors.array()[0].msg
        });
      }

      const { password } = req.body;
      const backupCodes = await mfaService.regenerateBackupCodes(req.userId, password);

      res.json({
        success: true,
        message: 'Backup codes regenerated successfully',
        backupCodes,
        warning: 'Old backup codes are no longer valid. Save these new codes securely.'
      });
    } catch (error) {
      console.error('Backup codes regeneration error:', error);
      res.status(400).json({ error: error.message || 'Failed to regenerate backup codes' });
    }
  }
);

/**
 * POST /api/mfa/disable
 * Disable MFA
 */
router.post('/disable',
  authenticateToken,
  strictMfaLimiter,
  [
    body('password').notEmpty().withMessage('Current password is required'),
    body('mfaToken').notEmpty().withMessage('MFA token is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          error: 'Validation failed',
          details: errors.array()[0].msg
        });
      }

      const { password, mfaToken } = req.body;
      await mfaService.disableMFA(req.userId, password, mfaToken);

      res.json({
        success: true,
        message: 'MFA disabled successfully',
        warning: 'Your account is now less secure. Consider re-enabling MFA for better security.'
      });
    } catch (error) {
      console.error('MFA disable error:', error);
      res.status(400).json({ error: error.message || 'Failed to disable MFA' });
    }
  }
);

/**
 * GET /api/mfa/recovery
 * Get MFA recovery options (for admin/support)
 */
router.get('/recovery/:userId', 
  authenticateToken,
  async (req, res) => {
    try {
      // Only allow admins to access recovery options
      if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const { userId } = req.params;
      const status = await mfaService.getMFAStatus(userId);

      res.json({
        success: true,
        recovery: {
          mfaEnabled: status.enabled,
          backupCodesRemaining: status.backupCodesCount,
          canDisableWithPassword: true,
          adminCanReset: true
        }
      });
    } catch (error) {
      console.error('MFA recovery info error:', error);
      res.status(500).json({ error: 'Failed to get recovery information' });
    }
  }
);

module.exports = router;