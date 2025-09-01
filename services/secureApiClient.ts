/**
 * Secure API Client Service
 * Routes all external API calls through backend proxy
 * No API keys stored in frontend code
 */

import axios, { AxiosInstance } from &apos;axios&apos;;

// Determine backend URL based on environment
const getBackendUrl = () => {
}
  if (typeof window !== &apos;undefined&apos;) {
}
    // In browser
    const { hostname, protocol } = window.location;
    if (hostname === &apos;localhost&apos; || hostname === &apos;127.0.0.1&apos;) {
}
      return &apos;http://localhost:3001&apos;;
    }
    // Production - use same domain with /api prefix
    return `${protocol}//${hostname}`;
  }
  // Server-side or tests
  return process.env.BACKEND_URL || &apos;http://localhost:3001&apos;;
};

const BACKEND_URL = getBackendUrl();

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
}
  baseURL: `${BACKEND_URL}/api/proxy`,
  timeout: 30000,
  headers: {
}
    &apos;Content-Type&apos;: &apos;application/json&apos;,
  },
  withCredentials: true, // Include cookies for authentication
});

// Request interceptor for auth token
apiClient.interceptors.request.use(
  (config: any) => {
}
    // Add auth token if available
    const token = localStorage.getItem(&apos;authToken&apos;);
    if (token) {
}
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
}
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
}
    if (error.response) {
}
      // Handle specific error cases
      switch (error.response.status) {
}
        case 401:
          // Unauthorized - redirect to login
          localStorage.removeItem(&apos;authToken&apos;);
          window.location.href = &apos;/login&apos;;
          break;
        case 429:
          // Rate limit exceeded
          console.warn(&apos;Rate limit exceeded. Please try again later.&apos;);
          break;
        case 503:
          // Service unavailable
          console.error(&apos;Service temporarily unavailable&apos;);
          break;
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Gemini AI Service - Secure proxy
 */
export const geminiService = {
}
  /**
   * Generate content using Gemini AI
   */
  async generateContent(prompt: string, model: string = &apos;gemini-pro&apos;, config?: any) {
}
    try {
}
      const response = await apiClient.post(&apos;/gemini/generate&apos;, {
}
        prompt,
        model,// 
        config
      });
      return response.data;
    } catch (error) {
}
      console.error(&apos;Gemini generate error:&apos;, error);
      throw error;
    }
  },

  /**
   * Stream content using Gemini AI (SSE)
   */
  async streamContent(
    prompt: string, 
    history: any[] = [], 
    onChunk: (text: string) => void,
    model: string = &apos;gemini-pro&apos;
  ) {
}
    try {
}
      const eventSource = new EventSource(
        `${BACKEND_URL}/api/proxy/gemini/stream?` + 
        new URLSearchParams({
}
          prompt,
          model,
          history: JSON.stringify(history)
        })
      );

      eventSource.onmessage = (event: any) => {
}
        if (event.data === &apos;[DONE]&apos;) {
}
          eventSource.close();
          return;
        }
        
        try {
}
          const data = JSON.parse(event.data);
          if (data.text) {
}
            onChunk(data.text);
          }
        } catch (e) {
}
          console.error(&apos;Stream parse error:&apos;, e);
        }
      };

      eventSource.onerror = (error: any) => {
}
        console.error(&apos;Stream error:&apos;, error);
        eventSource.close();
      };

      return eventSource;
    } catch (error) {
}
      console.error(&apos;Gemini stream error:&apos;, error);
      throw error;
    }
  },

  /**
   * Check if Gemini service is available
   */
  async checkStatus() {
}
    try {
}
      const response = await apiClient.get(&apos;/health&apos;);
      return response.data.apis?.gemini || false;
    } catch (error) {
}
      return false;
    }
  }
};

/**
 * Sports Data Service - Secure proxy
 */
export const sportsDataService = {
}
  /**
   * Get NFL games for a specific week
   */
  async getNFLGames(week?: number, season?: number) {
}
    try {
}
      const response = await apiClient.get(&apos;/sports/nfl/games&apos;, {
}
        params: { week, season }
      });
      return response.data;
    } catch (error) {
}
      console.error(&apos;NFL games fetch error:&apos;, error);
      throw error;
    }
  },

  /**
   * Get player details
   */
  async getPlayerDetails(playerId: string) {
}
    try {
}
      const response = await apiClient.get(`/sports/nfl/players/${playerId}`);
      return response.data;
    } catch (error) {
}
      console.error(&apos;Player details fetch error:&apos;, error);
      throw error;
    }
  },

  /**
   * Get betting odds
   */
  async getOdds() {
}
    try {
}
      const response = await apiClient.get(&apos;/sports/odds&apos;);
      return response.data;
    } catch (error) {
}
      console.error(&apos;Odds fetch error:&apos;, error);
      throw error;
    }
  },

  /**
   * Sports.io API proxy (if configured)
   */
  async sportsIoRequest(endpoint: string, params?: any) {
}
    try {
}
      const response = await apiClient.post(&apos;/sports/sportsio&apos;, {
}
        endpoint,// 
        params
      });
      return response.data;
    } catch (error) {
}
      console.error(&apos;Sports.io request error:&apos;, error);
      throw error;
    }
  },

  /**
   * Check sports data service status
   */
  async checkStatus() {
}
    try {
}
      const response = await apiClient.get(&apos;/health&apos;);
      return response.data.apis || {};
    } catch (error) {
}
      return {};
    }
  }
};

/**
 * Oracle Service - Uses secure backend
 */
export const oracleService = {
}
  /**
   * Get Oracle prediction with secure processing
   */
  async getPrediction(data: any) {
}
    try {
}
      // This should already be using backend endpoints
      const response = await axios.post(`${BACKEND_URL}/api/oracle/predictions`, data);
      return response.data;
    } catch (error) {
}
      console.error(&apos;Oracle prediction error:&apos;, error);
      throw error;
    }
  },

  /**
   * Stream Oracle response
   */
  async streamResponse(prompt: string, context: any, onChunk: (text: string) => void) {
}
    try {
}
      // Use the secure Gemini proxy for Oracle streaming
      return geminiService.streamContent(
        `Oracle Context: ${JSON.stringify(context)}\n\nUser Question: ${prompt}`,
        [],
        onChunk,
        &apos;gemini-pro&apos;
      );
    } catch (error) {
}
      console.error(&apos;Oracle stream error:&apos;, error);
      throw error;
    }
  }
};

/**
 * Check overall API health
 */
export const checkApiHealth = async () => {
}
  try {
}
    const response = await apiClient.get(&apos;/health&apos;);
    return response.data;
  } catch (error) {
}
    console.error(&apos;API health check failed:&apos;, error);
    return {
}
      status: &apos;error&apos;,
      message: &apos;Unable to connect to backend services&apos;
    };
  }
};

export default {
}
  geminiService,
  sportsDataService,
  oracleService,// 
  checkApiHealth
};