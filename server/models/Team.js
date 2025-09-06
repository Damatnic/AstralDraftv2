/**
 * Team Model
 * MongoDB schema for fantasy football teams
 */

const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  abbreviation: {
    type: String,
    required: true,
    trim: true,
    maxlength: 4,
    uppercase: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  leagueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'League',
    required: true
  },
  logo: {
    type: String,
    default: '🏈'
  },
  motto: {
    type: String,
    maxlength: 100,
    default: ''
  },
  primaryColor: {
    type: String,
    default: '#1f2937'
  },
  secondaryColor: {
    type: String,
    default: '#3b82f6'
  },
  draftPosition: {
    type: Number,
    min: 1,
    max: 20,
    default: null
  },
  record: {
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    ties: { type: Number, default: 0 }
  },
  points: {
    pointsFor: { type: Number, default: 0 },
    pointsAgainst: { type: Number, default: 0 },
    projectedPoints: { type: Number, default: 0 }
  },
  standings: {
    rank: { type: Number, default: null },
    playoffSeed: { type: Number, default: null },
    clinched: { type: Boolean, default: false },
    eliminated: { type: Boolean, default: false }
  },
  waiverPriority: {
    type: Number,
    default: null
  },
  faabBudget: {
    remaining: { type: Number, default: 100 },
    spent: { type: Number, default: 0 }
  },
  roster: [{
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: true
    },
    position: {
      type: String,
      enum: ['QB', 'RB', 'WR', 'TE', 'FLEX', 'DST', 'K', 'BENCH', 'IR'],
      required: true
    },
    isStarter: {
      type: Boolean,
      default: false
    },
    acquisitionType: {
      type: String,
      enum: ['draft', 'waiver', 'free_agent', 'trade'],
      default: 'draft'
    },
    acquisitionDate: {
      type: Date,
      default: Date.now
    },
    acquisitionCost: {
      type: Number,
      default: 0
    }
  }],
  lineupHistory: [{
    week: { type: Number, required: true },
    lineup: [{
      player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
      position: { type: String },
      points: { type: Number, default: 0 },
      projectedPoints: { type: Number, default: 0 }
    }],
    totalPoints: { type: Number, default: 0 },
    projectedTotal: { type: Number, default: 0 },
    submittedAt: { type: Date, default: Date.now }
  }],
  transactions: [{
    type: {
      type: String,
      enum: ['add', 'drop', 'trade', 'draft'],
      required: true
    },
    player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    details: { type: mongoose.Schema.Types.Mixed },
    processedAt: { type: Date, default: Date.now },
    week: { type: Number, required: true }
  }],
  draftPicks: [{
    round: { type: Number, required: true },
    pick: { type: Number, required: true },
    overallPick: { type: Number, required: true },
    player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    timeUsed: { type: Number, default: 0 }, // seconds
    isKeeper: { type: Boolean, default: false },
    keeperCost: { type: Number, default: null }
  }],
  stats: {
    totalTransactions: { type: Number, default: 0 },
    totalTrades: { type: Number, default: 0 },
    bestWeek: {
      week: { type: Number, default: null },
      points: { type: Number, default: 0 }
    },
    worstWeek: {
      week: { type: Number, default: null },
      points: { type: Number, default: 0 }
    },
    averagePoints: { type: Number, default: 0 },
    consistency: { type: Number, default: 0 }, // standard deviation
    strengthOfSchedule: { type: Number, default: 0 }
  },
  settings: {
    autoSetLineup: { type: Boolean, default: false },
    notifications: {
      trades: { type: Boolean, default: true },
      waivers: { type: Boolean, default: true },
      lineup: { type: Boolean, default: true },
      scores: { type: Boolean, default: true }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes
teamSchema.index({ leagueId: 1 });
teamSchema.index({ owner: 1 });
teamSchema.index({ 'record.wins': -1, 'points.pointsFor': -1 });
teamSchema.index({ waiverPriority: 1 });

// Virtual for win percentage
teamSchema.virtual('winPercentage').get(function() {
  const totalGames = this.record.wins + this.record.losses + this.record.ties;
  if (totalGames === 0) return 0;
  return (this.record.wins + (this.record.ties * 0.5)) / totalGames;
});

// Virtual for current roster size
teamSchema.virtual('rosterSize').get(function() {
  return this.roster.length;
});

// Virtual for starting lineup
teamSchema.virtual('startingLineup').get(function() {
  return this.roster.filter(spot => spot.isStarter);
});

// Virtual for bench players
teamSchema.virtual('benchPlayers').get(function() {
  return this.roster.filter(spot => spot.position === 'BENCH');
});

// Pre-save middleware
teamSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Update abbreviation if name changed
  if (this.isModified('name')) {
    this.abbreviation = this.name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 4);
  }
  
  next();
});

// Instance methods
teamSchema.methods.addPlayer = function(playerId, position = 'BENCH', acquisitionType = 'free_agent') {
  this.roster.push({
    player: playerId,
    position: position,
    isStarter: position !== 'BENCH' && position !== 'IR',
    acquisitionType: acquisitionType,
    acquisitionDate: new Date()
  });
  
  this.stats.totalTransactions += 1;
  return this.save();
};

teamSchema.methods.dropPlayer = function(playerId) {
  this.roster = this.roster.filter(spot => 
    spot.player.toString() !== playerId.toString()
  );
  
  this.stats.totalTransactions += 1;
  return this.save();
};

teamSchema.methods.setLineup = function(lineupChanges) {
  // Reset all to bench first
  this.roster.forEach(spot => {
    if (spot.position !== 'IR') {
      spot.position = 'BENCH';
      spot.isStarter = false;
    }
  });
  
  // Apply new lineup
  lineupChanges.forEach(change => {
    const rosterSpot = this.roster.find(spot => 
      spot.player.toString() === change.playerId.toString()
    );
    
    if (rosterSpot) {
      rosterSpot.position = change.position;
      rosterSpot.isStarter = change.position !== 'BENCH' && change.position !== 'IR';
    }
  });
  
  return this.save();
};

teamSchema.methods.getWeeklyLineup = function(week) {
  return this.lineupHistory.find(entry => entry.week === week);
};

teamSchema.methods.submitLineup = function(week, lineup) {
  // Remove existing lineup for this week
  this.lineupHistory = this.lineupHistory.filter(entry => entry.week !== week);
  
  // Add new lineup
  const totalPoints = lineup.reduce((sum, player) => sum + (player.points || 0), 0);
  const projectedTotal = lineup.reduce((sum, player) => sum + (player.projectedPoints || 0), 0);
  
  this.lineupHistory.push({
    week: week,
    lineup: lineup,
    totalPoints: totalPoints,
    projectedTotal: projectedTotal,
    submittedAt: new Date()
  });
  
  return this.save();
};

teamSchema.methods.calculateStats = async function() {
  const weeklyScores = this.lineupHistory.map(entry => entry.totalPoints);
  
  if (weeklyScores.length > 0) {
    this.stats.averagePoints = weeklyScores.reduce((a, b) => a + b, 0) / weeklyScores.length;
    
    // Find best and worst weeks
    const maxPoints = Math.max(...weeklyScores);
    const minPoints = Math.min(...weeklyScores);
    
    const bestWeekEntry = this.lineupHistory.find(entry => entry.totalPoints === maxPoints);
    const worstWeekEntry = this.lineupHistory.find(entry => entry.totalPoints === minPoints);
    
    if (bestWeekEntry) {
      this.stats.bestWeek = {
        week: bestWeekEntry.week,
        points: bestWeekEntry.totalPoints
      };
    }
    
    if (worstWeekEntry) {
      this.stats.worstWeek = {
        week: worstWeekEntry.week,
        points: worstWeekEntry.totalPoints
      };
    }
    
    // Calculate consistency (standard deviation)
    const variance = weeklyScores.reduce((sum, score) => {
      return sum + Math.pow(score - this.stats.averagePoints, 2);
    }, 0) / weeklyScores.length;
    
    this.stats.consistency = Math.sqrt(variance);
  }
  
  return this.save();
};

// Static methods
teamSchema.statics.getLeagueStandings = function(leagueId) {
  return this.find({ leagueId })
    .sort({ 'record.wins': -1, 'points.pointsFor': -1 })
    .populate('owner', 'username displayName avatar');
};

teamSchema.statics.getPlayoffTeams = function(leagueId, playoffSpots = 4) {
  return this.find({ leagueId })
    .sort({ 'record.wins': -1, 'points.pointsFor': -1 })
    .limit(playoffSpots)
    .populate('owner', 'username displayName avatar');
};

module.exports = mongoose.model('Team', teamSchema);