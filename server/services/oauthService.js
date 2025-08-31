/**
 * OAuth Service
 * Handles OAuth2/OpenID Connect integration with major providers
 * Supports Google, Microsoft, GitHub, and other popular providers
 */

const crypto = require('crypto');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const securityAuditService = require('./securityAuditService');

class OAuthService {
  constructor() {
    this.providers = {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        redirectUri: process.env.GOOGLE_REDIRECT_URI || `${process.env.FRONTEND_URL}/auth/callback/google`,
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenUrl: 'https://oauth2.googleapis.com/token',
        userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
        scope: 'openid email profile'
      },
      microsoft: {
        clientId: process.env.MICROSOFT_CLIENT_ID,
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
        redirectUri: process.env.MICROSOFT_REDIRECT_URI || `${process.env.FRONTEND_URL}/auth/callback/microsoft`,
        authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
        tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
        userInfoUrl: 'https://graph.microsoft.com/v1.0/me',
        scope: 'openid email profile User.Read'
      },
      github: {
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        redirectUri: process.env.GITHUB_REDIRECT_URI || `${process.env.FRONTEND_URL}/auth/callback/github`,
        authUrl: 'https://github.com/login/oauth/authorize',
        tokenUrl: 'https://github.com/login/oauth/access_token',
        userInfoUrl: 'https://api.github.com/user',
        emailUrl: 'https://api.github.com/user/emails',
        scope: 'user:email'
      },
      facebook: {
        clientId: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        redirectUri: process.env.FACEBOOK_REDIRECT_URI || `${process.env.FRONTEND_URL}/auth/callback/facebook`,
        authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
        tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
        userInfoUrl: 'https://graph.facebook.com/v18.0/me',
        scope: 'email public_profile'
      },
      discord: {
        clientId: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        redirectUri: process.env.DISCORD_REDIRECT_URI || `${process.env.FRONTEND_URL}/auth/callback/discord`,
        authUrl: 'https://discord.com/api/oauth2/authorize',
        tokenUrl: 'https://discord.com/api/oauth2/token',
        userInfoUrl: 'https://discord.com/api/users/@me',
        scope: 'identify email'
      },
      twitter: {
        clientId: process.env.TWITTER_CLIENT_ID,
        clientSecret: process.env.TWITTER_CLIENT_SECRET,
        redirectUri: process.env.TWITTER_REDIRECT_URI || `${process.env.FRONTEND_URL}/auth/callback/twitter`,
        authUrl: 'https://twitter.com/i/oauth2/authorize',
        tokenUrl: 'https://api.twitter.com/2/oauth2/token',
        userInfoUrl: 'https://api.twitter.com/2/users/me',
        scope: 'tweet.read users.read'
      }
    };

    this.stateStore = new Map(); // Store OAuth states temporarily
  }

  /**
   * Get OAuth authorization URL
   */
  getAuthorizationUrl(provider, state = null, additionalParams = {}) {
    const config = this.providers[provider];
    if (!config || !config.clientId) {
      throw new Error(`OAuth provider '${provider}' is not configured`);
    }

    // Generate secure state parameter
    const stateParam = state || this.generateState();
    this.storeState(stateParam, provider);

    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: 'code',
      scope: config.scope,
      state: stateParam,
      ...additionalParams
    });

    // Provider-specific parameters
    if (provider === 'google') {
      params.append('access_type', 'offline');
      params.append('prompt', 'consent');
    } else if (provider === 'microsoft') {
      params.append('response_mode', 'query');
    } else if (provider === 'github') {
      params.append('allow_signup', 'true');
    }

    return `${config.authUrl}?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(provider, code, state) {
    const config = this.providers[provider];
    if (!config) {
      throw new Error(`Unsupported OAuth provider: ${provider}`);
    }

    // Verify state parameter
    if (!this.verifyState(state, provider)) {
      throw new Error('Invalid OAuth state parameter');
    }

    try {
      const tokenData = {
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: config.redirectUri
      };

      const response = await axios.post(config.tokenUrl, tokenData, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      return response.data;
    } catch (error) {
      console.error(`OAuth token exchange failed for ${provider}:`, error.response?.data || error.message);
      throw new Error('Failed to exchange authorization code for token');
    }
  }

  /**
   * Get user information from OAuth provider
   */
  async getUserInfo(provider, accessToken) {
    const config = this.providers[provider];
    if (!config) {
      throw new Error(`Unsupported OAuth provider: ${provider}`);
    }

    try {
      let userInfo;
      let email = null;

      // Get basic user info
      const userResponse = await axios.get(config.userInfoUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      });

      userInfo = userResponse.data;

      // Handle provider-specific data formats
      switch (provider) {
        case 'google':
          email = userInfo.email;
          break;
        case 'microsoft':
          email = userInfo.mail || userInfo.userPrincipalName;
          break;
        case 'github':
          // GitHub might require separate email request
          if (!userInfo.email) {
            try {
              const emailResponse = await axios.get(config.emailUrl, {
                headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Accept': 'application/json'
                }
              });
              const primaryEmail = emailResponse.data.find(e => e.primary);
              email = primaryEmail ? primaryEmail.email : emailResponse.data[0]?.email;
            } catch (emailError) {
              console.warn('Failed to fetch GitHub email:', emailError.message);
            }
          } else {
            email = userInfo.email;
          }
          break;
        case 'facebook':
          email = userInfo.email;
          break;
        case 'discord':
          email = userInfo.email;
          break;
        case 'twitter':
          email = userInfo.email;
          break;
        default:
          email = userInfo.email;
      }

      return {
        id: userInfo.id || userInfo.sub,
        email,
        name: userInfo.name || userInfo.display_name || userInfo.login,
        picture: userInfo.picture || userInfo.avatar_url,
        provider,
        raw: userInfo
      };
    } catch (error) {
      console.error(`Failed to get user info from ${provider}:`, error.response?.data || error.message);
      throw new Error('Failed to retrieve user information');
    }
  }

  /**
   * Handle OAuth callback and create/link user account
   */
  async handleCallback(provider, code, state, req = null) {
    try {
      // Exchange code for token
      const tokenData = await this.exchangeCodeForToken(provider, code, state);
      
      // Get user info
      const oauthUser = await this.getUserInfo(provider, tokenData.access_token);

      if (!oauthUser.email) {
        throw new Error('Email address is required but not provided by OAuth provider');
      }

      // Log OAuth attempt
      await securityAuditService.logSecurityEvent('OAUTH_LOGIN_ATTEMPT', {
        provider,
        email: oauthUser.email,
        userId: oauthUser.id
      }, req);

      // Check if user exists by email
      let user = await User.findOne({ email: oauthUser.email });
      
      if (user) {
        // Link OAuth account if not already linked
        const existingOAuth = user.oauthAccounts?.find(account => 
          account.provider === provider && account.providerId === oauthUser.id
        );

        if (!existingOAuth) {
          if (!user.oauthAccounts) user.oauthAccounts = [];
          user.oauthAccounts.push({
            provider,
            providerId: oauthUser.id,
            email: oauthUser.email,
            name: oauthUser.name,
            picture: oauthUser.picture,
            connectedAt: new Date(),
            lastUsed: new Date(),
            accessToken: this.encryptToken(tokenData.access_token),
            refreshToken: tokenData.refresh_token ? this.encryptToken(tokenData.refresh_token) : null
          });
        } else {
          // Update existing OAuth account
          existingOAuth.lastUsed = new Date();
          existingOAuth.name = oauthUser.name;
          existingOAuth.picture = oauthUser.picture;
          existingOAuth.accessToken = this.encryptToken(tokenData.access_token);
          if (tokenData.refresh_token) {
            existingOAuth.refreshToken = this.encryptToken(tokenData.refresh_token);
          }
        }

        user.lastLoginAt = new Date();
        await user.save();

        await securityAuditService.logAuditEvent(user._id, 'OAUTH_LOGIN', 'user_account', {
          provider,
          success: true
        }, req);
      } else {
        // Create new user account
        const username = await this.generateUniqueUsername(oauthUser.name || oauthUser.email);
        
        user = new User({
          username,
          email: oauthUser.email,
          displayName: oauthUser.name || username,
          avatar: oauthUser.picture || '🏈',
          emailVerified: true, // OAuth providers verify emails
          password: crypto.randomBytes(32).toString('hex'), // Generate random password
          status: 'ACTIVE',
          createdAt: new Date(),
          lastLoginAt: new Date(),
          oauthAccounts: [{
            provider,
            providerId: oauthUser.id,
            email: oauthUser.email,
            name: oauthUser.name,
            picture: oauthUser.picture,
            connectedAt: new Date(),
            lastUsed: new Date(),
            accessToken: this.encryptToken(tokenData.access_token),
            refreshToken: tokenData.refresh_token ? this.encryptToken(tokenData.refresh_token) : null
          }]
        });

        await user.save();

        await securityAuditService.logAuditEvent(user._id, 'OAUTH_REGISTER', 'user_account', {
          provider,
          email: oauthUser.email,
          success: true
        }, req);
      }

      // Generate JWT token for the user
      const jwtToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Clean up state
      this.cleanupState(state);

      return {
        success: true,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          displayName: user.displayName,
          avatar: user.avatar,
          emailVerified: user.emailVerified
        },
        token: jwtToken,
        isNewUser: !user.createdAt || (Date.now() - user.createdAt.getTime()) < 60000 // Created within last minute
      };
    } catch (error) {
      console.error(`OAuth callback failed for ${provider}:`, error);
      
      await securityAuditService.logSecurityEvent('OAUTH_LOGIN_FAILED', {
        provider,
        error: error.message
      }, req);

      throw error;
    }
  }

  /**
   * Unlink OAuth account
   */
  async unlinkAccount(userId, provider) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      if (!user.oauthAccounts || user.oauthAccounts.length === 0) {
        throw new Error('No OAuth accounts to unlink');
      }

      // Don't allow unlinking if it's the only authentication method and no password is set
      const hasPassword = user.password && user.password.length > 0;
      const oauthCount = user.oauthAccounts.length;

      if (!hasPassword && oauthCount === 1) {
        throw new Error('Cannot unlink the only authentication method. Please set a password first.');
      }

      // Remove the OAuth account
      user.oauthAccounts = user.oauthAccounts.filter(account => account.provider !== provider);
      await user.save();

      await securityAuditService.logAuditEvent(userId, 'OAUTH_UNLINK', 'user_account', {
        provider,
        success: true
      });

      return { success: true, message: 'OAuth account unlinked successfully' };
    } catch (error) {
      console.error('Failed to unlink OAuth account:', error);
      throw error;
    }
  }

  /**
   * Refresh OAuth access token
   */
  async refreshAccessToken(userId, provider) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const oauthAccount = user.oauthAccounts?.find(account => account.provider === provider);
      if (!oauthAccount || !oauthAccount.refreshToken) {
        throw new Error('Refresh token not available');
      }

      const config = this.providers[provider];
      const refreshToken = this.decryptToken(oauthAccount.refreshToken);

      const response = await axios.post(config.tokenUrl, {
        client_id: config.clientId,
        client_secret: config.clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      // Update stored tokens
      oauthAccount.accessToken = this.encryptToken(response.data.access_token);
      if (response.data.refresh_token) {
        oauthAccount.refreshToken = this.encryptToken(response.data.refresh_token);
      }
      await user.save();

      return response.data;
    } catch (error) {
      console.error(`Failed to refresh token for ${provider}:`, error);
      throw new Error('Failed to refresh access token');
    }
  }

  /**
   * Get linked OAuth accounts for user
   */
  async getLinkedAccounts(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const linkedAccounts = (user.oauthAccounts || []).map(account => ({
        provider: account.provider,
        email: account.email,
        name: account.name,
        picture: account.picture,
        connectedAt: account.connectedAt,
        lastUsed: account.lastUsed
      }));

      return linkedAccounts;
    } catch (error) {
      console.error('Failed to get linked accounts:', error);
      throw error;
    }
  }

  /**
   * Helper methods
   */
  generateState() {
    return crypto.randomBytes(32).toString('hex');
  }

  storeState(state, provider) {
    this.stateStore.set(state, {
      provider,
      timestamp: Date.now(),
      expires: Date.now() + (10 * 60 * 1000) // 10 minutes
    });
  }

  verifyState(state, provider) {
    const storedState = this.stateStore.get(state);
    if (!storedState) return false;
    
    if (storedState.expires < Date.now()) {
      this.stateStore.delete(state);
      return false;
    }

    return storedState.provider === provider;
  }

  cleanupState(state) {
    this.stateStore.delete(state);
  }

  async generateUniqueUsername(baseName) {
    const base = baseName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 20);
    
    let username = base;
    let counter = 1;

    while (await User.findOne({ username })) {
      username = `${base}${counter}`;
      counter++;
    }

    return username;
  }

  encryptToken(token) {
    if (!token) return null;
    
    const key = process.env.ENCRYPTION_KEY || 'default-32-character-key-change';
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher('aes-256-cbc', key);
    
    let encrypted = cipher.update(token, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return {
      encrypted,
      iv: iv.toString('hex')
    };
  }

  decryptToken(encryptedData) {
    if (!encryptedData || typeof encryptedData === 'string') {
      return encryptedData; // Fallback for unencrypted data
    }

    const key = process.env.ENCRYPTION_KEY || 'default-32-character-key-change';
    const decipher = crypto.createDecipher('aes-256-cbc', key);
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  /**
   * Get available OAuth providers
   */
  getAvailableProviders() {
    return Object.keys(this.providers).filter(provider => 
      this.providers[provider].clientId && this.providers[provider].clientSecret
    );
  }

  /**
   * Validate OAuth configuration
   */
  validateConfiguration() {
    const issues = [];
    
    Object.entries(this.providers).forEach(([provider, config]) => {
      if (!config.clientId) {
        issues.push(`${provider.toUpperCase()}_CLIENT_ID is not configured`);
      }
      if (!config.clientSecret) {
        issues.push(`${provider.toUpperCase()}_CLIENT_SECRET is not configured`);
      }
      if (!config.redirectUri) {
        issues.push(`${provider.toUpperCase()}_REDIRECT_URI is not configured`);
      }
    });

    return {
      isValid: issues.length === 0,
      issues,
      configuredProviders: this.getAvailableProviders()
    };
  }

  /**
   * Clean up expired states (run periodically)
   */
  cleanupExpiredStates() {
    const now = Date.now();
    for (const [state, data] of this.stateStore.entries()) {
      if (data.expires < now) {
        this.stateStore.delete(state);
      }
    }
  }
}

module.exports = new OAuthService();