/**
 * OAuth Routes
 * Handles OAuth2/OpenID Connect authentication flows
 */

const express = require('express');
const rateLimit = require('express-rate-limit');
const { authenticateToken } = require('../middleware/auth');
const oauthService = require('../services/oauthService');
const securityAuditService = require('../services/securityAuditService');

const router = express.Router();

// Rate limiting for OAuth endpoints
const oauthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 OAuth attempts per window
  message: { error: 'Too many OAuth attempts, please try again later' }
});

/**
 * GET /api/oauth/providers
 * Get list of available OAuth providers
 */
router.get('/providers', async (req, res) => {
  try {
    const providers = oauthService.getAvailableProviders();
    const config = oauthService.validateConfiguration();
    
    res.json({
      success: true,
      providers,
      configuration: config
    });
  } catch (error) {
    console.error('Failed to get OAuth providers:', error);
    res.status(500).json({ error: 'Failed to retrieve OAuth providers' });
  }
});

/**
 * GET /api/oauth/authorize/:provider
 * Get OAuth authorization URL
 */
router.get('/authorize/:provider', oauthLimiter, async (req, res) => {
  try {
    const { provider } = req.params;
    const { state, redirect_uri } = req.query;

    // Validate provider
    const availableProviders = oauthService.getAvailableProviders();
    if (!availableProviders.includes(provider)) {
      return res.status(400).json({ 
        error: 'Unsupported OAuth provider',
        availableProviders 
      });
    }

    // Generate authorization URL
    const authUrl = oauthService.getAuthorizationUrl(provider, state, {
      ...(redirect_uri && { redirect_uri })
    });

    await securityAuditService.logSecurityEvent('OAUTH_AUTHORIZATION_REQUESTED', {
      provider,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    }, req);

    res.json({
      success: true,
      authorizationUrl: authUrl,
      provider
    });
  } catch (error) {
    console.error('OAuth authorization error:', error);
    res.status(400).json({ 
      error: error.message || 'Failed to generate authorization URL' 
    });
  }
});

/**
 * POST /api/oauth/callback/:provider
 * Handle OAuth callback
 */
router.post('/callback/:provider', oauthLimiter, async (req, res) => {
  try {
    const { provider } = req.params;
    const { code, state, error, error_description } = req.body;

    // Check for OAuth errors
    if (error) {
      await securityAuditService.logSecurityEvent('OAUTH_ERROR_CALLBACK', {
        provider,
        error,
        error_description,
        ip: req.ip
      }, req);

      return res.status(400).json({
        error: 'OAuth authentication failed',
        details: error_description || error
      });
    }

    // Validate required parameters
    if (!code || !state) {
      return res.status(400).json({
        error: 'Missing required OAuth parameters',
        required: ['code', 'state']
      });
    }

    // Handle OAuth callback
    const result = await oauthService.handleCallback(provider, code, state, req);

    res.json({
      success: true,
      message: result.isNewUser ? 'Account created successfully' : 'Signed in successfully',
      user: result.user,
      token: result.token,
      isNewUser: result.isNewUser
    });

  } catch (error) {
    console.error('OAuth callback error:', error);
    
    await securityAuditService.logSecurityEvent('OAUTH_CALLBACK_FAILED', {
      provider: req.params.provider,
      error: error.message,
      ip: req.ip
    }, req);

    res.status(400).json({ 
      error: error.message || 'OAuth authentication failed' 
    });
  }
});

/**
 * GET /api/oauth/accounts
 * Get linked OAuth accounts for current user
 */
router.get('/accounts', authenticateToken, async (req, res) => {
  try {
    const linkedAccounts = await oauthService.getLinkedAccounts(req.userId);

    res.json({
      success: true,
      accounts: linkedAccounts
    });
  } catch (error) {
    console.error('Failed to get linked accounts:', error);
    res.status(500).json({ error: 'Failed to retrieve linked accounts' });
  }
});

/**
 * POST /api/oauth/link/:provider
 * Link additional OAuth account to existing user
 */
router.post('/link/:provider', authenticateToken, oauthLimiter, async (req, res) => {
  try {
    const { provider } = req.params;
    const { code, state } = req.body;

    if (!code || !state) {
      return res.status(400).json({
        error: 'Missing required OAuth parameters',
        required: ['code', 'state']
      });
    }

    // Exchange code for token and get user info
    const tokenData = await oauthService.exchangeCodeForToken(provider, code, state);
    const oauthUser = await oauthService.getUserInfo(provider, tokenData.access_token);

    // Add OAuth account to current user
    const User = require('../models/User');
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if OAuth account is already linked to another user
    const existingUser = await User.findOne({
      'oauthAccounts.provider': provider,
      'oauthAccounts.providerId': oauthUser.id,
      '_id': { $ne: req.userId }
    });

    if (existingUser) {
      return res.status(409).json({
        error: 'OAuth account is already linked to another user'
      });
    }

    // Check if already linked to current user
    const existingLink = user.oauthAccounts?.find(account => 
      account.provider === provider && account.providerId === oauthUser.id
    );

    if (existingLink) {
      return res.status(409).json({
        error: 'OAuth account is already linked to your account'
      });
    }

    // Add OAuth account
    if (!user.oauthAccounts) user.oauthAccounts = [];
    user.oauthAccounts.push({
      provider,
      providerId: oauthUser.id,
      email: oauthUser.email,
      name: oauthUser.name,
      picture: oauthUser.picture,
      connectedAt: new Date(),
      lastUsed: new Date(),
      accessToken: oauthService.encryptToken(tokenData.access_token),
      refreshToken: tokenData.refresh_token ? oauthService.encryptToken(tokenData.refresh_token) : null
    });

    await user.save();

    await securityAuditService.logAuditEvent(req.userId, 'OAUTH_LINK', 'user_account', {
      provider,
      email: oauthUser.email,
      success: true
    }, req);

    res.json({
      success: true,
      message: 'OAuth account linked successfully',
      account: {
        provider,
        email: oauthUser.email,
        name: oauthUser.name,
        picture: oauthUser.picture,
        connectedAt: new Date()
      }
    });

  } catch (error) {
    console.error('OAuth link error:', error);
    
    await securityAuditService.logAuditEvent(req.userId, 'OAUTH_LINK_FAILED', 'user_account', {
      provider: req.params.provider,
      error: error.message
    }, req);

    res.status(400).json({ 
      error: error.message || 'Failed to link OAuth account' 
    });
  }
});

/**
 * DELETE /api/oauth/unlink/:provider
 * Unlink OAuth account from current user
 */
router.delete('/unlink/:provider', authenticateToken, async (req, res) => {
  try {
    const { provider } = req.params;
    const { password } = req.body; // Optional password confirmation

    // If password is provided, verify it
    if (password) {
      const bcrypt = require('bcryptjs');
      const User = require('../models/User');
      const user = await User.findById(req.userId).select('+password');
      
      if (user.password) {
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          return res.status(401).json({ error: 'Invalid password' });
        }
      }
    }

    const result = await oauthService.unlinkAccount(req.userId, provider);

    await securityAuditService.logAuditEvent(req.userId, 'OAUTH_UNLINK', 'user_account', {
      provider,
      success: true
    }, req);

    res.json(result);
  } catch (error) {
    console.error('OAuth unlink error:', error);
    
    await securityAuditService.logAuditEvent(req.userId, 'OAUTH_UNLINK_FAILED', 'user_account', {
      provider: req.params.provider,
      error: error.message
    }, req);

    res.status(400).json({ 
      error: error.message || 'Failed to unlink OAuth account' 
    });
  }
});

/**
 * POST /api/oauth/refresh/:provider
 * Refresh OAuth access token
 */
router.post('/refresh/:provider', authenticateToken, async (req, res) => {
  try {
    const { provider } = req.params;
    
    const tokenData = await oauthService.refreshAccessToken(req.userId, provider);

    await securityAuditService.logAuditEvent(req.userId, 'OAUTH_TOKEN_REFRESH', 'user_account', {
      provider,
      success: true
    }, req);

    res.json({
      success: true,
      message: 'Access token refreshed successfully',
      expiresIn: tokenData.expires_in
    });
  } catch (error) {
    console.error('OAuth token refresh error:', error);
    res.status(400).json({ 
      error: error.message || 'Failed to refresh access token' 
    });
  }
});

/**
 * GET /api/oauth/profile/:provider
 * Get current user profile from OAuth provider
 */
router.get('/profile/:provider', authenticateToken, async (req, res) => {
  try {
    const { provider } = req.params;
    
    const User = require('../models/User');
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const oauthAccount = user.oauthAccounts?.find(account => account.provider === provider);
    if (!oauthAccount) {
      return res.status(404).json({ error: 'OAuth account not linked' });
    }

    // Try to get fresh profile data
    try {
      const accessToken = oauthService.decryptToken(oauthAccount.accessToken);
      const profileData = await oauthService.getUserInfo(provider, accessToken);
      
      res.json({
        success: true,
        profile: profileData,
        cached: false
      });
    } catch (tokenError) {
      // Token might be expired, return cached data
      res.json({
        success: true,
        profile: {
          id: oauthAccount.providerId,
          email: oauthAccount.email,
          name: oauthAccount.name,
          picture: oauthAccount.picture,
          provider
        },
        cached: true,
        message: 'Returned cached profile data. Access token may need refreshing.'
      });
    }
  } catch (error) {
    console.error('OAuth profile fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve OAuth profile' 
    });
  }
});

/**
 * POST /api/oauth/sync/:provider
 * Sync user data from OAuth provider
 */
router.post('/sync/:provider', authenticateToken, async (req, res) => {
  try {
    const { provider } = req.params;
    const { fields } = req.body; // Array of fields to sync: ['name', 'picture', 'email']
    
    const User = require('../models/User');
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const oauthAccount = user.oauthAccounts?.find(account => account.provider === provider);
    if (!oauthAccount) {
      return res.status(404).json({ error: 'OAuth account not linked' });
    }

    // Get fresh profile data
    const accessToken = oauthService.decryptToken(oauthAccount.accessToken);
    const profileData = await oauthService.getUserInfo(provider, accessToken);
    
    // Update specified fields
    const updatedFields = [];
    
    if (!fields || fields.includes('name')) {
      if (profileData.name && profileData.name !== user.displayName) {
        user.displayName = profileData.name;
        updatedFields.push('displayName');
      }
    }
    
    if (!fields || fields.includes('picture')) {
      if (profileData.picture && profileData.picture !== user.avatar) {
        user.avatar = profileData.picture;
        updatedFields.push('avatar');
      }
    }
    
    if (!fields || fields.includes('email')) {
      if (profileData.email && profileData.email !== user.email) {
        // Check if email is already taken
        const existingUser = await User.findOne({ 
          email: profileData.email,
          _id: { $ne: req.userId }
        });
        
        if (!existingUser) {
          user.email = profileData.email;
          updatedFields.push('email');
        }
      }
    }

    // Update OAuth account data
    oauthAccount.name = profileData.name;
    oauthAccount.picture = profileData.picture;
    oauthAccount.email = profileData.email;
    oauthAccount.lastUsed = new Date();

    if (updatedFields.length > 0) {
      await user.save();
    }

    await securityAuditService.logAuditEvent(req.userId, 'OAUTH_SYNC', 'user_profile', {
      provider,
      updatedFields,
      success: true
    }, req);

    res.json({
      success: true,
      message: updatedFields.length > 0 ? 'Profile synced successfully' : 'Profile is already up to date',
      updatedFields,
      profile: {
        displayName: user.displayName,
        avatar: user.avatar,
        email: user.email
      }
    });

  } catch (error) {
    console.error('OAuth sync error:', error);
    res.status(400).json({ 
      error: error.message || 'Failed to sync OAuth profile' 
    });
  }
});

module.exports = router;