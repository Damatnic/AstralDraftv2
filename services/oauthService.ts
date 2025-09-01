/**
 * Enhanced OAuth Authentication Service
 * Supports Google, Discord, and GitHub OAuth providers with secure token management
 */

import { authService } from &apos;./authService&apos;;

export interface OAuthProvider {
}
  id: &apos;google&apos; | &apos;discord&apos; | &apos;github&apos;;
  name: string;
  clientId: string;
  redirectUri: string;
  scope: string;
  authUrl: string;
}

export interface OAuthUser {
}
  provider: string;
  providerId: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
}

export interface OAuthResponse {
}
  success: boolean;
  user?: OAuthUser;
  sessionToken?: string;
  error?: string;
}

class OAuthService {
}
  private readonly providers: Record<string, OAuthProvider>;
  private readonly baseUrl: string;

  constructor() {
}
    this.baseUrl = (import.meta as any).env?.VITE_API_BASE_URL || &apos;http://localhost:3001&apos;;
    
    this.providers = {
}
      google: {
}
        id: &apos;google&apos;,
        name: &apos;Google&apos;,
        clientId: (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || &apos;&apos;,
        redirectUri: `${window.location.origin}/auth/callback/google`,
        scope: &apos;openid email profile&apos;,
        authUrl: &apos;https://accounts.google.com/o/oauth2/v2/auth&apos;
      },
      discord: {
}
        id: &apos;discord&apos;,
        name: &apos;Discord&apos;,
        clientId: (import.meta as any).env?.VITE_DISCORD_CLIENT_ID || &apos;&apos;,
        redirectUri: `${window.location.origin}/auth/callback/discord`,
        scope: &apos;identify email&apos;,
        authUrl: &apos;https://discord.com/api/oauth2/authorize&apos;
      },
      github: {
}
        id: &apos;github&apos;,
        name: &apos;GitHub&apos;,
        clientId: (import.meta as any).env?.VITE_GITHUB_CLIENT_ID || &apos;&apos;,
        redirectUri: `${window.location.origin}/auth/callback/github`,
        scope: &apos;user:email&apos;,
        authUrl: &apos;https://github.com/login/oauth/authorize&apos;
      }
    };
  }

  /**
   * Get OAuth provider configuration
   */
  getProvider(providerId: string): OAuthProvider | null {
}
    return this.providers[providerId] || null;
  }

  /**
   * Get all available OAuth providers
   */
  getAvailableProviders(): OAuthProvider[] {
}
    return Object.values(this.providers).filter((provider: any) => provider.clientId);
  }

  /**
   * Generate OAuth authorization URL with PKCE support
   */
  async generateAuthUrl(providerId: string, state?: string): Promise<string | null> {
}
    const provider = this.getProvider(providerId);
    if (!provider) {
}
      console.error(`OAuth provider &apos;${providerId}&apos; not found`);
      return null;
    }

    // Generate PKCE challenge for enhanced security
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);
    
    // Store code verifier for later verification
    sessionStorage.setItem(`oauth_verifier_${providerId}`, codeVerifier);
    
    const params = new URLSearchParams({
}
      client_id: provider.clientId,
      redirect_uri: provider.redirectUri,
      scope: provider.scope,
      response_type: &apos;code&apos;,
      state: state || this.generateState(),
      code_challenge: codeChallenge,
      code_challenge_method: &apos;S256&apos;
    });

    // Provider-specific parameters
    if (providerId === &apos;google&apos;) {
}
      params.append(&apos;access_type&apos;, &apos;offline&apos;);
      params.append(&apos;prompt&apos;, &apos;consent&apos;);
    }

    return `${provider.authUrl}?${params.toString()}`;
  }

  /**
   * Handle OAuth callback and exchange code for tokens
   */
  async handleCallback(providerId: string, code: string, state: string): Promise<OAuthResponse> {
}
    try {
}
      const codeVerifier = sessionStorage.getItem(`oauth_verifier_${providerId}`);
      if (!codeVerifier) {
}
        throw new Error(&apos;OAuth code verifier not found&apos;);
      }

      const response = await fetch(`${this.baseUrl}/api/auth/oauth/callback`, {
}
        method: &apos;POST&apos;,
        headers: {
}
          &apos;Content-Type&apos;: &apos;application/json&apos;
        },
        body: JSON.stringify({
}
          provider: providerId,
          code,
          codeVerifier,
//           state
        })
      });

      const data = await response.json();

      if (data.success && data.user && data.sessionToken) {
}
        // Clean up stored verifier
        sessionStorage.removeItem(`oauth_verifier_${providerId}`);
        
        // Store auth data using existing auth service
        await authService.setSession(data.user, data.sessionToken);
        
        return {
}
          success: true,
          user: data.user,
          sessionToken: data.sessionToken
        };
      }

      return {
}
        success: false,
        error: data.error || &apos;OAuth authentication failed&apos;
      };
    } catch (error) {
}
      console.error(&apos;OAuth callback error:&apos;, error);
      return {
}
        success: false,
        error: &apos;OAuth authentication failed&apos;
      };
    }
  }

  /**
   * Link OAuth account to existing user
   */
  async linkAccount(providerId: string, code: string): Promise<OAuthResponse> {
}
    try {
}
      const codeVerifier = sessionStorage.getItem(`oauth_verifier_${providerId}`);
      const sessionToken = authService.getSessionToken();

      if (!codeVerifier || !sessionToken) {
}
        throw new Error(&apos;Missing required authentication data&apos;);
      }

      const response = await fetch(`${this.baseUrl}/api/auth/oauth/link`, {
}
        method: &apos;POST&apos;,
        headers: {
}
          &apos;Content-Type&apos;: &apos;application/json&apos;,
          &apos;Authorization&apos;: `Bearer ${sessionToken}`
        },
        body: JSON.stringify({
}
          provider: providerId,
          code,
//           codeVerifier
        })
      });

      const data = await response.json();
      
      // Clean up stored verifier
      sessionStorage.removeItem(`oauth_verifier_${providerId}`);
      
      return data;
    } catch (error) {
}
      console.error(&apos;OAuth account linking error:&apos;, error);
      return {
}
        success: false,
        error: &apos;Failed to link OAuth account&apos;
      };
    }
  }

  /**
   * Unlink OAuth account
   */
  async unlinkAccount(providerId: string): Promise<{ success: boolean; error?: string }> {
}
    try {
}
      const sessionToken = authService.getSessionToken();
      if (!sessionToken) {
}
        throw new Error(&apos;No active session&apos;);
      }

      const response = await fetch(`${this.baseUrl}/api/auth/oauth/unlink`, {
}
        method: &apos;POST&apos;,
        headers: {
}
          &apos;Content-Type&apos;: &apos;application/json&apos;,
          &apos;Authorization&apos;: `Bearer ${sessionToken}`
        },
        body: JSON.stringify({ provider: providerId })
      });

      return await response.json();
    } catch (error) {
}
      console.error(&apos;OAuth account unlinking error:&apos;, error);
      return {
}
        success: false,
        error: &apos;Failed to unlink OAuth account&apos;
      };
    }
  }

  /**
   * Get user&apos;s linked OAuth accounts
   */
  async getLinkedAccounts(): Promise<{ success: boolean; accounts?: any[]; error?: string }> {
}
    try {
}
      const sessionToken = authService.getSessionToken();
      if (!sessionToken) {
}
        throw new Error(&apos;No active session&apos;);
      }

      const response = await fetch(`${this.baseUrl}/api/auth/oauth/accounts`, {
}
        headers: {
}
          &apos;Authorization&apos;: `Bearer ${sessionToken}`
        }
      });

      return await response.json();
    } catch (error) {
}
      console.error(&apos;Error fetching linked accounts:&apos;, error);
      return {
}
        success: false,
        error: &apos;Failed to fetch linked accounts&apos;
      };
    }
  }

  /**
   * Initiate OAuth login flow
   */
  async initiateLogin(providerId: string): Promise<void> {
}
    const authUrl = await this.generateAuthUrl(providerId);
    if (authUrl) {
}
      // Store the current page for redirect after auth
      sessionStorage.setItem(&apos;oauth_redirect_after_auth&apos;, window.location.pathname);
      window.location.href = authUrl;
    } else {
}
      throw new Error(`Failed to generate OAuth URL for ${providerId}`);
    }
  }

  /**
   * Generate cryptographically secure random string for PKCE
   */
  private generateCodeVerifier(): string {
}
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return this.base64URLEncode(array);
  }

  /**
   * Generate code challenge from verifier using SHA256
   */
  private async generateCodeChallenge(verifier: string): Promise<string> {
}
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest(&apos;SHA-256&apos;, data);
    return this.base64URLEncode(new Uint8Array(digest));
  }

  /**
   * Generate state parameter for CSRF protection
   */
  private generateState(): string {
}
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return this.base64URLEncode(array);
  }

  /**
   * Base64 URL encode (RFC 7636)
   */
  private base64URLEncode(array: Uint8Array): string {
}
    return btoa(String.fromCharCode(...array))
      .replace(/\+/g, &apos;-&apos;)
      .replace(/\//g, &apos;_&apos;)
      .replace(/=/g, &apos;&apos;);
  }
}

export const oauthService = new OAuthService();
export default oauthService;
