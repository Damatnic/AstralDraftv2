/**
 * Database Configuration
 * MongoDB connection setup with connection pooling and error handling
 */

const mongoose = require('mongoose');
const redis = require('redis');

class DatabaseManager {
  constructor() {
    this.mongoConnection = null;
    this.redisClient = null;
    this.isConnected = false;
  }

  /**
   * Initialize MongoDB connection
   */
  async connectMongoDB() {
    try {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/astral_draft';
      
      const options = {
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        bufferMaxEntries: 0, // Disable mongoose buffering
        bufferCommands: false, // Disable mongoose buffering
        maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
        family: 4 // Use IPv4, skip trying IPv6
      };

      this.mongoConnection = await mongoose.connect(mongoUri, options);
      
      console.log('✅ MongoDB connected successfully');
      console.log(`📊 Database: ${this.mongoConnection.connection.name}`);
      console.log(`🌐 Host: ${this.mongoConnection.connection.host}:${this.mongoConnection.connection.port}`);
      
      // Handle connection events
      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️ MongoDB disconnected');
        this.isConnected = false;
      });

      mongoose.connection.on('reconnected', () => {
        console.log('🔄 MongoDB reconnected');
        this.isConnected = true;
      });

      this.isConnected = true;
      return this.mongoConnection;
      
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error);
      throw error;
    }
  }

  /**
   * Initialize Redis connection
   */
  async connectRedis() {
    try {
      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
      
      this.redisClient = redis.createClient({
        url: redisUrl,
        retry_strategy: (options) => {
          if (options.error && options.error.code === 'ECONNREFUSED') {
            console.error('❌ Redis server refused connection');
            return new Error('Redis server refused connection');
          }
          if (options.total_retry_time > 1000 * 60 * 60) {
            console.error('❌ Redis retry time exhausted');
            return new Error('Retry time exhausted');
          }
          if (options.attempt > 10) {
            console.error('❌ Redis max retry attempts reached');
            return undefined;
          }
          // Reconnect after
          return Math.min(options.attempt * 100, 3000);
        }
      });

      this.redisClient.on('error', (err) => {
        console.error('❌ Redis connection error:', err);
      });

      this.redisClient.on('connect', () => {
        console.log('✅ Redis connected successfully');
      });

      this.redisClient.on('reconnecting', () => {
        console.log('🔄 Redis reconnecting...');
      });

      this.redisClient.on('end', () => {
        console.warn('⚠️ Redis connection ended');
      });

      await this.redisClient.connect();
      
      // Test the connection
      await this.redisClient.ping();
      console.log('🏓 Redis ping successful');
      
      return this.redisClient;
      
    } catch (error) {
      console.warn('⚠️ Redis connection failed (continuing without cache):', error.message);
      // Don't throw error - app can work without Redis
      return null;
    }
  }

  /**
   * Initialize all database connections
   */
  async connect() {
    try {
      console.log('🔌 Initializing database connections...');
      
      // Connect to MongoDB (required)
      await this.connectMongoDB();
      
      // Connect to Redis (optional)
      await this.connectRedis();
      
      console.log('✅ All database connections established');
      return true;
      
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw error;
    }
  }

  /**
   * Close all database connections
   */
  async disconnect() {
    try {
      console.log('🔌 Closing database connections...');
      
      if (this.mongoConnection) {
        await mongoose.connection.close();
        console.log('✅ MongoDB connection closed');
      }
      
      if (this.redisClient) {
        await this.redisClient.quit();
        console.log('✅ Redis connection closed');
      }
      
      this.isConnected = false;
      console.log('✅ All database connections closed');
      
    } catch (error) {
      console.error('❌ Error closing database connections:', error);
      throw error;
    }
  }

  /**
   * Get MongoDB connection status
   */
  getMongoStatus() {
    return {
      connected: mongoose.connection.readyState === 1,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name
    };
  }

  /**
   * Get Redis connection status
   */
  getRedisStatus() {
    if (!this.redisClient) {
      return { connected: false, status: 'not_initialized' };
    }
    
    return {
      connected: this.redisClient.isOpen,
      status: this.redisClient.status
    };
  }

  /**
   * Health check for all connections
   */
  async healthCheck() {
    const health = {
      mongodb: { status: 'unknown', error: null },
      redis: { status: 'unknown', error: null },
      overall: 'unknown'
    };

    try {
      // Check MongoDB
      if (mongoose.connection.readyState === 1) {
        await mongoose.connection.db.admin().ping();
        health.mongodb.status = 'healthy';
      } else {
        health.mongodb.status = 'disconnected';
      }
    } catch (error) {
      health.mongodb.status = 'error';
      health.mongodb.error = error.message;
    }

    try {
      // Check Redis
      if (this.redisClient && this.redisClient.isOpen) {
        await this.redisClient.ping();
        health.redis.status = 'healthy';
      } else {
        health.redis.status = 'disconnected';
      }
    } catch (error) {
      health.redis.status = 'error';
      health.redis.error = error.message;
    }

    // Determine overall health
    if (health.mongodb.status === 'healthy') {
      health.overall = 'healthy'; // Redis is optional
    } else {
      health.overall = 'unhealthy';
    }

    return health;
  }

  /**
   * Cache helper methods
   */
  async cacheGet(key) {
    if (!this.redisClient || !this.redisClient.isOpen) {
      return null;
    }
    
    try {
      const value = await this.redisClient.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async cacheSet(key, value, ttlSeconds = 3600) {
    if (!this.redisClient || !this.redisClient.isOpen) {
      return false;
    }
    
    try {
      await this.redisClient.setEx(key, ttlSeconds, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  async cacheDel(key) {
    if (!this.redisClient || !this.redisClient.isOpen) {
      return false;
    }
    
    try {
      await this.redisClient.del(key);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  async cacheFlush() {
    if (!this.redisClient || !this.redisClient.isOpen) {
      return false;
    }
    
    try {
      await this.redisClient.flushAll();
      return true;
    } catch (error) {
      console.error('Cache flush error:', error);
      return false;
    }
  }
}

// Create singleton instance
const dbManager = new DatabaseManager();

// Graceful shutdown handling
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT, closing database connections...');
  await dbManager.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM, closing database connections...');
  await dbManager.disconnect();
  process.exit(0);
});

module.exports = dbManager;