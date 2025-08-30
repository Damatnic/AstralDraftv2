/**
 * Netlify Function - ESPN API Proxy
 * Handles CORS-blocked ESPN API requests
 */

const axios = require('axios');

// Simple in-memory cache for the serverless function
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Rate limiting
const rateLimits = new Map();
const RATE_LIMIT = 50; // requests per minute per IP
const RATE_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(clientId) {
  const now = Date.now();
  const windowStart = now - RATE_WINDOW;
  
  if (!rateLimits.has(clientId)) {
    rateLimits.set(clientId, []);
  }
  
  const requests = rateLimits.get(clientId);
  const recentRequests = requests.filter(time => time > windowStart);
  
  if (recentRequests.length >= RATE_LIMIT) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimits.set(clientId, recentRequests);
  return true;
}

exports.handler = async (event, context) => {
  // CORS headers for all responses
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-App-Name, X-App-Version',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed. Use GET.' }),
    };
  }

  try {
    // Get client IP for rate limiting
    const clientId = event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown';
    
    // Check rate limits
    if (!checkRateLimit(clientId)) {
      return {
        statusCode: 429,
        headers,
        body: JSON.stringify({ 
          error: 'Rate limit exceeded. Please try again later.',
          retryAfter: 60 
        }),
      };
    }

    // Parse the ESPN API path from query parameters
    const { path: espnPath } = event.queryStringParameters || {};
    
    if (!espnPath) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Missing required parameter: path',
          example: '?path=scoreboard'
        }),
      };
    }

    // Build the ESPN API URL
    const baseUrl = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl';
    const cleanPath = espnPath.startsWith('/') ? espnPath : `/${espnPath}`;
    const espnUrl = `${baseUrl}${cleanPath}`;
    
    // Create cache key
    const cacheKey = `espn:${cleanPath}`;
    const now = Date.now();
    
    // Check cache first
    const cached = cache.get(cacheKey);
    if (cached && cached.expires > now) {
      return {
        statusCode: 200,
        headers: {
          ...headers,
          'X-Cache': 'HIT',
          'Cache-Control': 'public, max-age=300',
        },
        body: JSON.stringify({
          data: cached.data,
          cached: true,
          timestamp: cached.timestamp
        }),
      };
    }

    // Fetch from ESPN API
    console.log(`Fetching ESPN API: ${espnUrl}`);
    
    const response = await axios.get(espnUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'AstralDraft/1.0 (Fantasy Football App)',
      },
      timeout: 10000, // 10 second timeout
    });

    // Cache the response
    const timestamp = new Date().toISOString();
    cache.set(cacheKey, {
      data: response.data,
      expires: now + CACHE_TTL,
      timestamp
    });

    // Clean up old cache entries periodically
    if (cache.size > 100) {
      for (const [key, value] of cache.entries()) {
        if (value.expires <= now) {
          cache.delete(key);
        }
      }
    }

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'X-Cache': 'MISS',
        'Cache-Control': 'public, max-age=300',
      },
      body: JSON.stringify({
        data: response.data,
        cached: false,
        timestamp
      }),
    };

  } catch (error) {
    console.error('ESPN Proxy Error:', error.message);
    
    // Handle different types of errors
    if (error.code === 'ENOTFOUND') {
      return {
        statusCode: 503,
        headers,
        body: JSON.stringify({ 
          error: 'ESPN API service unavailable',
          code: 'SERVICE_UNAVAILABLE'
        }),
      };
    }
    
    if (error.code === 'ETIMEDOUT') {
      return {
        statusCode: 504,
        headers,
        body: JSON.stringify({ 
          error: 'ESPN API request timeout',
          code: 'TIMEOUT'
        }),
      };
    }
    
    if (error.response) {
      // ESPN API returned an error
      return {
        statusCode: error.response.status,
        headers,
        body: JSON.stringify({ 
          error: 'ESPN API error',
          status: error.response.status,
          message: error.response.statusText
        }),
      };
    }

    // Generic error
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      }),
    };
  }
};