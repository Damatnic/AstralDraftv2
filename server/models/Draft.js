/**
 * Draft Model
 * MongoDB schema for fantasy football drafts
 */

const mongoose = require('mongoose');

const draftSchema = new mongoose.Schema({
  leagueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'League',
    required: true
  },
  type: {
    type: String,
    enum: ['snake', 'auction', 'linear'],
    required: true,
    default: 'snake'
  },
  status: {
    type: String,
    enum: ['SCHEDULED', 'IN_PROGRESS', 'PAUSED', 'COMPLETED', 'CANCELLED'],
    default: 'SCHEDULED'
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  startedAt: {
    type: Date,
    default: null
  },
  completedAt: {
    type: Date,
    default: null
  },
  settings: {
    pickTimeLimit: {
      type: Number,
      default: 90, // seconds
      min: 30,
      max: 300
    },
    rounds: {
      type: Number,
      default: 15,
      min: 10,
      max: 20
    },
    autoPickEnabled: {
      type: Boolean,
      default: true
    },
    tradingEnabled: {
      type: Boolean,
      default: false
    },
    pauseOnDisconnect: {
      type: Boolean,
      default: true
    },
    // Auction specific settings
    auctionSettings: {
      budget: { type: Number, default: 200 },
      minBid: { type: Number, default: 1 },
      bidIncrement: { type: Number, default: 1 },
      nominationTime: { type: Number, default: 30 },
      biddingTime: { type: Number, default: 15 }
    }
  },
  draftOrder: [{
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true
    },
    position: {
      type: Number,
      required: true,
      min: 1
    },
    isOnline: {
      type: Boolean,
      default: false
    },
    lastSeen: {
      type: Date,
      default: Date.now
    }
  }],
  currentPick: {
    round: { type: Number, default: 1 },
    pick: { type: Number, default: 1 },
    overallPick: { type: Number, default: 1 },
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    timeRemaining: { type: Number, default: 90 }, // seconds
    pickStartedAt: { type: Date, default: null }
  },
  picks: [{
    round: { type: Number, required: true },
    pick: { type: Number, required: true },
    overallPick: { type: Number, required: true },
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
    pickTime: { type: Number, default: 0 }, // seconds used
    isAutoPick: { type: Boolean, default: false },
    isKeeper: { type: Boolean, default: false },
    keeperCost: { type: Number, default: null },
    timestamp: { type: Date, default: Date.now },
    // Auction specific
    bidAmount: { type: Number, default: null },
    bidHistory: [{
      teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
      amount: { type: Number },
      timestamp: { type: Date, default: Date.now }
    }]
  }],
  // Snake draft specific
  snakeOrder: [{
    round: { type: Number, required: true },
    picks: [{
      position: { type: Number, required: true },
      teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true }
    }]
  }],
  // Auction draft specific
  auctionState: {
    currentNomination: {
      playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
      nominatingTeamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
      currentBid: { type: Number, default: 0 },
      currentBidder: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
      timeRemaining: { type: Number, default: 30 },
      nominationStartedAt: { type: Date }
    },
    nominationQueue: [{
      teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
      playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' }
    }],
    teamBudgets: [{
      teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
      remaining: { type: Number, default: 200 },
      spent: { type: Number, default: 0 }
    }]
  },
  chatMessages: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true, maxlength: 500 },
    timestamp: { type: Date, default: Date.now },
    type: { type: String, enum: ['message', 'pick', 'trade', 'system'], default: 'message' }
  }],
  pauseHistory: [{
    pausedAt: { type: Date, required: true },
    resumedAt: { type: Date },
    reason: { type: String, maxlength: 200 },
    pausedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  stats: {
    totalPickTime: { type: Number, default: 0 },
    averagePickTime: { type: Number, default: 0 },
    autoPickCount: { type: Number, default: 0 },
    tradeCount: { type: Number, default: 0 },
    pauseCount: { type: Number, default: 0 }
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

// Indexes for performance
draftSchema.index({ leagueId: 1 });
draftSchema.index({ status: 1 });
draftSchema.index({ scheduledDate: 1 });
draftSchema.index({ 'currentPick.teamId': 1 });

// Virtual for total picks
draftSchema.virtual('totalPicks').get(function() {
  return this.draftOrder.length * this.settings.rounds;
});

// Virtual for picks remaining
draftSchema.virtual('picksRemaining').get(function() {
  return this.totalPicks - this.picks.length;
});

// Virtual for current round progress
draftSchema.virtual('roundProgress').get(function() {
  const currentRound = this.currentPick.round;
  const picksInRound = this.picks.filter(pick => pick.round === currentRound).length;
  return {
    round: currentRound,
    picksComplete: picksInRound,
    totalPicks: this.draftOrder.length,
    percentage: (picksInRound / this.draftOrder.length) * 100
  };
});

// Pre-save middleware
draftSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Update average pick time
  if (this.picks.length > 0) {
    this.stats.totalPickTime = this.picks.reduce((sum, pick) => sum + pick.pickTime, 0);
    this.stats.averagePickTime = this.stats.totalPickTime / this.picks.length;
    this.stats.autoPickCount = this.picks.filter(pick => pick.isAutoPick).length;
  }
  
  next();
});

// Instance methods
draftSchema.methods.canStart = function() {
  return this.status === 'SCHEDULED' && 
         this.draftOrder.length >= 4 && 
         new Date() >= this.scheduledDate;
};

draftSchema.methods.start = function() {
  if (!this.canStart()) {
    throw new Error('Draft cannot be started');
  }
  
  this.status = 'IN_PROGRESS';
  this.startedAt = new Date();
  this.currentPick.pickStartedAt = new Date();
  this.currentPick.timeRemaining = this.settings.pickTimeLimit;
  
  return this.save();
};

draftSchema.methods.pause = function(reason, pausedBy) {
  if (this.status !== 'IN_PROGRESS') {
    throw new Error('Can only pause an active draft');
  }
  
  this.status = 'PAUSED';
  this.pauseHistory.push({
    pausedAt: new Date(),
    reason: reason,
    pausedBy: pausedBy
  });
  this.stats.pauseCount += 1;
  
  return this.save();
};

draftSchema.methods.resume = function() {
  if (this.status !== 'PAUSED') {
    throw new Error('Can only resume a paused draft');
  }
  
  this.status = 'IN_PROGRESS';
  const lastPause = this.pauseHistory[this.pauseHistory.length - 1];
  if (lastPause) {
    lastPause.resumedAt = new Date();
  }
  
  // Reset pick timer
  this.currentPick.pickStartedAt = new Date();
  
  return this.save();
};

draftSchema.methods.makePick = function(teamId, playerId, pickTime = 0, isAutoPick = false) {
  if (this.status !== 'IN_PROGRESS') {
    throw new Error('Draft is not in progress');
  }
  
  if (this.currentPick.teamId.toString() !== teamId.toString()) {
    throw new Error('Not this team\'s turn to pick');
  }
  
  // Create the pick
  const pick = {
    round: this.currentPick.round,
    pick: this.currentPick.pick,
    overallPick: this.currentPick.overallPick,
    teamId: teamId,
    playerId: playerId,
    pickTime: pickTime,
    isAutoPick: isAutoPick,
    timestamp: new Date()
  };
  
  this.picks.push(pick);
  
  // Advance to next pick
  this.advanceToNextPick();
  
  return this.save();
};

draftSchema.methods.advanceToNextPick = function() {
  const totalTeams = this.draftOrder.length;
  const totalRounds = this.settings.rounds;
  
  // Check if draft is complete
  if (this.currentPick.overallPick >= totalTeams * totalRounds) {
    this.status = 'COMPLETED';
    this.completedAt = new Date();
    return;
  }
  
  // Advance pick
  this.currentPick.overallPick += 1;
  
  if (this.type === 'snake') {
    // Snake draft logic
    const isEvenRound = this.currentPick.round % 2 === 0;
    
    if (isEvenRound) {
      // Reverse order for even rounds
      this.currentPick.pick -= 1;
      if (this.currentPick.pick < 1) {
        this.currentPick.round += 1;
        this.currentPick.pick = totalTeams;
      }
    } else {
      // Normal order for odd rounds
      this.currentPick.pick += 1;
      if (this.currentPick.pick > totalTeams) {
        this.currentPick.round += 1;
        this.currentPick.pick = 1;
      }
    }
  } else {
    // Linear draft logic
    this.currentPick.pick += 1;
    if (this.currentPick.pick > totalTeams) {
      this.currentPick.round += 1;
      this.currentPick.pick = 1;
    }
  }
  
  // Set current team
  const pickPosition = this.currentPick.pick;
  const currentTeam = this.draftOrder.find(team => team.position === pickPosition);
  this.currentPick.teamId = currentTeam.teamId;
  
  // Reset pick timer
  this.currentPick.pickStartedAt = new Date();
  this.currentPick.timeRemaining = this.settings.pickTimeLimit;
};

draftSchema.methods.generateSnakeOrder = function() {
  const totalTeams = this.draftOrder.length;
  const totalRounds = this.settings.rounds;
  
  this.snakeOrder = [];
  
  for (let round = 1; round <= totalRounds; round++) {
    const roundPicks = [];
    
    if (round % 2 === 1) {
      // Odd rounds: normal order (1, 2, 3, ...)
      for (let pick = 1; pick <= totalTeams; pick++) {
        const team = this.draftOrder.find(t => t.position === pick);
        roundPicks.push({
          position: pick,
          teamId: team.teamId
        });
      }
    } else {
      // Even rounds: reverse order (..., 3, 2, 1)
      for (let pick = totalTeams; pick >= 1; pick--) {
        const team = this.draftOrder.find(t => t.position === pick);
        roundPicks.push({
          position: totalTeams - pick + 1,
          teamId: team.teamId
        });
      }
    }
    
    this.snakeOrder.push({
      round: round,
      picks: roundPicks
    });
  }
};

draftSchema.methods.getPickHistory = function(limit = 10) {
  return this.picks
    .sort((a, b) => b.overallPick - a.overallPick)
    .slice(0, limit);
};

draftSchema.methods.getUpcomingPicks = function(limit = 5) {
  const totalTeams = this.draftOrder.length;
  const upcomingPicks = [];
  
  let currentOverall = this.currentPick.overallPick;
  let currentRound = this.currentPick.round;
  let currentPickNum = this.currentPick.pick;
  
  for (let i = 0; i < limit && currentOverall <= totalTeams * this.settings.rounds; i++) {
    const team = this.draftOrder.find(t => t.position === currentPickNum);
    
    upcomingPicks.push({
      round: currentRound,
      pick: currentPickNum,
      overallPick: currentOverall,
      teamId: team.teamId
    });
    
    // Advance to next pick
    currentOverall += 1;
    
    if (this.type === 'snake') {
      const isEvenRound = currentRound % 2 === 0;
      
      if (isEvenRound) {
        currentPickNum -= 1;
        if (currentPickNum < 1) {
          currentRound += 1;
          currentPickNum = totalTeams;
        }
      } else {
        currentPickNum += 1;
        if (currentPickNum > totalTeams) {
          currentRound += 1;
          currentPickNum = 1;
        }
      }
    } else {
      currentPickNum += 1;
      if (currentPickNum > totalTeams) {
        currentRound += 1;
        currentPickNum = 1;
      }
    }
  }
  
  return upcomingPicks;
};

draftSchema.methods.addChatMessage = function(userId, message, type = 'message') {
  this.chatMessages.push({
    userId: userId,
    message: message,
    type: type,
    timestamp: new Date()
  });
  
  // Keep only last 100 messages
  if (this.chatMessages.length > 100) {
    this.chatMessages = this.chatMessages.slice(-100);
  }
  
  return this.save();
};

draftSchema.methods.updateTeamOnlineStatus = function(teamId, isOnline) {
  const team = this.draftOrder.find(t => t.teamId.toString() === teamId.toString());
  if (team) {
    team.isOnline = isOnline;
    team.lastSeen = new Date();
  }
  
  return this.save();
};

// Static methods
draftSchema.statics.createDraft = async function(leagueId, settings = {}) {
  const League = mongoose.model('League');
  const Team = mongoose.model('Team');
  
  const league = await League.findById(leagueId);
  if (!league) {
    throw new Error('League not found');
  }
  
  const teams = await Team.find({ leagueId: leagueId }).sort({ draftPosition: 1 });
  if (teams.length < 4) {
    throw new Error('Need at least 4 teams to create a draft');
  }
  
  // Create draft order
  const draftOrder = teams.map((team, index) => ({
    teamId: team._id,
    position: index + 1,
    isOnline: false,
    lastSeen: new Date()
  }));
  
  const draft = new this({
    leagueId: leagueId,
    type: league.settings.draftType || 'snake',
    scheduledDate: league.settings.draftDate || new Date(),
    settings: {
      pickTimeLimit: settings.pickTimeLimit || 90,
      rounds: settings.rounds || 15,
      autoPickEnabled: settings.autoPickEnabled !== false,
      tradingEnabled: settings.tradingEnabled || false,
      pauseOnDisconnect: settings.pauseOnDisconnect !== false,
      auctionSettings: settings.auctionSettings || {
        budget: 200,
        minBid: 1,
        bidIncrement: 1,
        nominationTime: 30,
        biddingTime: 15
      }
    },
    draftOrder: draftOrder,
    currentPick: {
      round: 1,
      pick: 1,
      overallPick: 1,
      teamId: draftOrder[0].teamId,
      timeRemaining: settings.pickTimeLimit || 90
    }
  });
  
  // Generate snake order if needed
  if (draft.type === 'snake') {
    draft.generateSnakeOrder();
  }
  
  return await draft.save();
};

draftSchema.statics.getActiveDrafts = function() {
  return this.find({ 
    status: { $in: ['IN_PROGRESS', 'PAUSED'] } 
  }).populate('leagueId draftOrder.teamId');
};

draftSchema.statics.getUpcomingDrafts = function() {
  return this.find({ 
    status: 'SCHEDULED',
    scheduledDate: { $gte: new Date() }
  }).populate('leagueId draftOrder.teamId');
};

module.exports = mongoose.model('Draft', draftSchema);