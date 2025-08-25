/**
 * User Model
 * MongoDB schema for user accounts
 */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
    match: /^[a-zA-Z0-9_]+$/
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false // Don't include password in queries by default
  },
  displayName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  avatar: {
    type: String,
    default: '🏈'
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'SUSPENDED', 'BANNED', 'PENDING_VERIFICATION'],
    default: 'PENDING_VERIFICATION'
  },
  role: {
    type: String,
    enum: ['USER', 'ADMIN', 'MODERATOR'],
    default: 'USER'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastLoginAt: {
    type: Date,
    default: null
  },
  settings: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      draft: { type: Boolean, default: true },
      trades: { type: Boolean, default: true },
      waivers: { type: Boolean, default: true },
      scores: { type: Boolean, default: true }
    },
    privacy: {
      profilePublic: { type: Boolean, default: true },
      showRealName: { type: Boolean, default: false },
      showEmail: { type: Boolean, default: false }
    },
    preferences: {
      theme: { type: String, enum: ['light', 'dark', 'auto'], default: 'dark' },
      timezone: { type: String, default: 'America/New_York' },
      favoriteTeams: [{ type: String }],
      defaultScoringType: { type: String, enum: ['standard', 'ppr', 'half-ppr'], default: 'ppr' }
    }
  },
  stats: {
    totalLeagues: { type: Number, default: 0 },
    totalChampionships: { type: Number, default: 0 },
    totalTrades: { type: Number, default: 0 },
    totalDrafts: { type: Number, default: 0 },
    averageFinish: { type: Number, default: null },
    bestFinish: { type: Number, default: null },
    worstFinish: { type: Number, default: null }
  },
  subscription: {
    plan: { type: String, enum: ['free', 'premium', 'pro'], default: 'free' },
    status: { type: String, enum: ['active', 'cancelled', 'expired'], default: 'active' },
    expiresAt: { type: Date, default: null },
    stripeCustomerId: { type: String, default: null },
    stripeSubscriptionId: { type: String, default: null }
  },
  twoFactorAuth: {
    enabled: { type: Boolean, default: false },
    secret: { type: String, default: null, select: false },
    backupCodes: [{ type: String, select: false }]
  },
  loginAttempts: {
    count: { type: Number, default: 0 },
    lastAttempt: { type: Date, default: null },
    lockedUntil: { type: Date, default: null }
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      delete ret.twoFactorAuth;
      delete ret.loginAttempts;
      return ret;
    }
  }
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ status: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return this.displayName;
});

// Pre-save middleware to update timestamps
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Instance methods
userSchema.methods.isAccountLocked = function() {
  return !!(this.loginAttempts.lockedUntil && this.loginAttempts.lockedUntil > Date.now());
};

userSchema.methods.incrementLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.loginAttempts.lockedUntil && this.loginAttempts.lockedUntil < Date.now()) {
    return this.updateOne({
      $unset: { 'loginAttempts.lockedUntil': 1 },
      $set: {
        'loginAttempts.count': 1,
        'loginAttempts.lastAttempt': Date.now()
      }
    });
  }

  const updates = {
    $inc: { 'loginAttempts.count': 1 },
    $set: { 'loginAttempts.lastAttempt': Date.now() }
  };

  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts.count + 1 >= 5 && !this.isAccountLocked()) {
    updates.$set['loginAttempts.lockedUntil'] = Date.now() + 2 * 60 * 60 * 1000; // 2 hours
  }

  return this.updateOne(updates);
};

userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: {
      'loginAttempts.count': 1,
      'loginAttempts.lastAttempt': 1,
      'loginAttempts.lockedUntil': 1
    }
  });
};

// Static methods
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findByUsername = function(username) {
  return this.findOne({ username: username });
};

userSchema.statics.getActiveUsers = function() {
  return this.find({ status: 'ACTIVE' });
};

userSchema.statics.getUserStats = function(userId) {
  return this.findById(userId).select('stats');
};

module.exports = mongoose.model('User', userSchema);