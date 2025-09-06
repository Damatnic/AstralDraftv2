/**
 * Trade Model
 * MongoDB schema for fantasy football trades
 */

const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  leagueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'League',
    required: true
  },
  proposedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  proposedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'EXPIRED', 'VETOED'],
    default: 'PENDING'
  },
  tradeItems: {
    // What the proposing team is offering
    offering: {
      players: [{
        playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
        playerName: { type: String, required: true },
        position: { type: String, required: true },
        team: { type: String, required: true }
      }],
      draftPicks: [{
        year: { type: Number, required: true },
        round: { type: Number, required: true },
        originalTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' }
      }],
      faabMoney: { type: Number, default: 0 }
    },
    // What the proposing team wants in return
    requesting: {
      players: [{
        playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
        playerName: { type: String, required: true },
        position: { type: String, required: true },
        team: { type: String, required: true }
      }],
      draftPicks: [{
        year: { type: Number, required: true },
        round: { type: Number, required: true },
        originalTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' }
      }],
      faabMoney: { type: Number, default: 0 }
    }
  },
  message: {
    type: String,
    maxlength: 500,
    default: ''
  },
  proposedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: function() {
      // Default expiration: 48 hours from proposal
      return new Date(Date.now() + 48 * 60 * 60 * 1000);
    }
  },
  respondedAt: {
    type: Date,
    default: null
  },
  processedAt: {
    type: Date,
    default: null
  },
  // League review settings
  reviewPeriod: {
    enabled: { type: Boolean, default: false },
    startedAt: { type: Date, default: null },
    endsAt: { type: Date, default: null },
    votes: [{
      teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
      vote: { type: String, enum: ['APPROVE', 'VETO'] },
      reason: { type: String, maxlength: 200 },
      votedAt: { type: Date, default: Date.now }
    }],
    requiredVotes: { type: Number, default: 0 },
    vetoThreshold: { type: Number, default: 0 }
  },
  // Trade analysis
  analysis: {
    fairnessScore: { type: Number, min: 0, max: 100, default: null },
    projectedImpact: {
      proposingTeam: {
        weeklyPointsChange: { type: Number, default: 0 },
        seasonProjectionChange: { type: Number, default: 0 },
        strengthChange: { type: String, enum: ['STRONGER', 'WEAKER', 'NEUTRAL'], default: 'NEUTRAL' }
      },
      receivingTeam: {
        weeklyPointsChange: { type: Number, default: 0 },
        seasonProjectionChange: { type: Number, default: 0 },
        strengthChange: { type: String, enum: ['STRONGER', 'WEAKER', 'NEUTRAL'], default: 'NEUTRAL' }
      }
    },
    riskFactors: [{
      type: { type: String, enum: ['INJURY', 'PERFORMANCE', 'SCHEDULE', 'AGE'] },
      severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'] },
      description: { type: String }
    }],
    analyzedAt: { type: Date, default: null }
  },
  // Trade history and notes
  history: [{
    action: {
      type: String,
      enum: ['PROPOSED', 'MODIFIED', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'EXPIRED', 'VETOED', 'PROCESSED'],
      required: true
    },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reason: { type: String, maxlength: 200 },
    timestamp: { type: Date, default: Date.now },
    details: { type: mongoose.Schema.Types.Mixed }
  }],
  // Commissioner notes
  commissionerNotes: {
    type: String,
    maxlength: 1000,
    default: ''
  },
  // Metadata
  week: {
    type: Number,
    required: true,
    min: 1,
    max: 18
  },
  season: {
    type: Number,
    required: true
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
tradeSchema.index({ leagueId: 1 });
tradeSchema.index({ proposedBy: 1 });
tradeSchema.index({ proposedTo: 1 });
tradeSchema.index({ status: 1 });
tradeSchema.index({ proposedAt: -1 });
tradeSchema.index({ expiresAt: 1 });

// Virtual for total players involved
tradeSchema.virtual('totalPlayers').get(function() {
  return this.tradeItems.offering.players.length + this.tradeItems.requesting.players.length;
});

// Virtual for trade value (simplified)
tradeSchema.virtual('tradeValue').get(function() {
  // This would calculate based on player values, draft pick values, etc.
  return {
    offering: this.tradeItems.offering.players.length * 10 + this.tradeItems.offering.draftPicks.length * 5,
    requesting: this.tradeItems.requesting.players.length * 10 + this.tradeItems.requesting.draftPicks.length * 5
  };
});

// Virtual for time remaining
tradeSchema.virtual('timeRemaining').get(function() {
  if (this.status !== 'PENDING') return 0;
  const now = new Date();
  const remaining = this.expiresAt.getTime() - now.getTime();
  return Math.max(0, remaining);
});

// Virtual for is expired
tradeSchema.virtual('isExpired').get(function() {
  return this.status === 'PENDING' && new Date() > this.expiresAt;
});

// Pre-save middleware
tradeSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Auto-expire if past expiration date
  if (this.status === 'PENDING' && this.isExpired) {
    this.status = 'EXPIRED';
    this.history.push({
      action: 'EXPIRED',
      reason: 'Trade proposal expired',
      timestamp: new Date()
    });
  }
  
  next();
});

// Instance methods
tradeSchema.methods.canAccept = function() {
  return this.status === 'PENDING' && !this.isExpired;
};

tradeSchema.methods.canReject = function() {
  return this.status === 'PENDING' && !this.isExpired;
};

tradeSchema.methods.canCancel = function(userId) {
  // Only the proposing team can cancel
  return this.status === 'PENDING' && this.proposedBy.owner?.toString() === userId.toString();
};

tradeSchema.methods.accept = async function(userId) {
  if (!this.canAccept()) {
    throw new Error('Trade cannot be accepted');
  }

  this.status = 'ACCEPTED';
  this.respondedAt = new Date();
  
  this.history.push({
    action: 'ACCEPTED',
    performedBy: userId,
    timestamp: new Date()
  });

  // Check if league requires review period
  const League = mongoose.model('League');
  const league = await League.findById(this.leagueId);
  
  if (league.settings.tradeSettings.requireApproval) {
    this.reviewPeriod.enabled = true;
    this.reviewPeriod.startedAt = new Date();
    this.reviewPeriod.endsAt = new Date(Date.now() + (league.settings.tradeSettings.reviewPeriod || 2) * 24 * 60 * 60 * 1000);
    
    // Calculate required votes for veto
    const Team = mongoose.model('Team');
    const totalTeams = await Team.countDocuments({ leagueId: this.leagueId });
    this.reviewPeriod.requiredVotes = Math.ceil(totalTeams * 0.5); // 50% of teams
    this.reviewPeriod.vetoThreshold = Math.ceil(totalTeams * 0.3); // 30% to veto
  } else {
    // Process immediately
    await this.process();
  }

  return this.save();
};

tradeSchema.methods.reject = function(userId, reason = '') {
  if (!this.canReject()) {
    throw new Error('Trade cannot be rejected');
  }

  this.status = 'REJECTED';
  this.respondedAt = new Date();
  
  this.history.push({
    action: 'REJECTED',
    performedBy: userId,
    reason: reason,
    timestamp: new Date()
  });

  return this.save();
};

tradeSchema.methods.cancel = function(userId, reason = '') {
  if (!this.canCancel(userId)) {
    throw new Error('Trade cannot be cancelled');
  }

  this.status = 'CANCELLED';
  
  this.history.push({
    action: 'CANCELLED',
    performedBy: userId,
    reason: reason,
    timestamp: new Date()
  });

  return this.save();
};

tradeSchema.methods.veto = function(reason = '') {
  this.status = 'VETOED';
  this.processedAt = new Date();
  
  this.history.push({
    action: 'VETOED',
    reason: reason,
    timestamp: new Date()
  });

  return this.save();
};

tradeSchema.methods.process = async function() {
  if (this.status !== 'ACCEPTED') {
    throw new Error('Only accepted trades can be processed');
  }

  try {
    const Team = mongoose.model('Team');
    
    // Get both teams
    const proposingTeam = await Team.findById(this.proposedBy);
    const receivingTeam = await Team.findById(this.proposedTo);

    if (!proposingTeam || !receivingTeam) {
      throw new Error('Teams not found');
    }

    // Process player transfers
    await this.transferPlayers(proposingTeam, receivingTeam);
    
    // Process draft pick transfers
    await this.transferDraftPicks(proposingTeam, receivingTeam);
    
    // Process FAAB money transfers
    await this.transferFaabMoney(proposingTeam, receivingTeam);

    // Update trade status
    this.status = 'PROCESSED';
    this.processedAt = new Date();
    
    this.history.push({
      action: 'PROCESSED',
      reason: 'Trade successfully processed',
      timestamp: new Date()
    });

    // Update team trade counts
    proposingTeam.stats.totalTrades += 1;
    receivingTeam.stats.totalTrades += 1;
    
    await proposingTeam.save();
    await receivingTeam.save();
    await this.save();

    return true;

  } catch (error) {
    console.error('Trade processing error:', error);
    throw error;
  }
};

tradeSchema.methods.transferPlayers = async function(proposingTeam, receivingTeam) {
  // Transfer players from proposing team to receiving team
  for (const playerInfo of this.tradeItems.offering.players) {
    // Remove from proposing team
    proposingTeam.roster = proposingTeam.roster.filter(spot => 
      spot.player.toString() !== playerInfo.playerId.toString()
    );
    
    // Add to receiving team
    receivingTeam.roster.push({
      player: playerInfo.playerId,
      position: 'BENCH',
      isStarter: false,
      acquisitionType: 'trade',
      acquisitionDate: new Date()
    });
  }

  // Transfer players from receiving team to proposing team
  for (const playerInfo of this.tradeItems.requesting.players) {
    // Remove from receiving team
    receivingTeam.roster = receivingTeam.roster.filter(spot => 
      spot.player.toString() !== playerInfo.playerId.toString()
    );
    
    // Add to proposing team
    proposingTeam.roster.push({
      player: playerInfo.playerId,
      position: 'BENCH',
      isStarter: false,
      acquisitionType: 'trade',
      acquisitionDate: new Date()
    });
  }
};

tradeSchema.methods.transferDraftPicks = async function(proposingTeam, receivingTeam) {
  // This would handle draft pick transfers
  // For now, just log the transfer
  console.log('Draft pick transfers not yet implemented');
};

tradeSchema.methods.transferFaabMoney = async function(proposingTeam, receivingTeam) {
  // Transfer FAAB money
  if (this.tradeItems.offering.faabMoney > 0) {
    proposingTeam.faabBudget.remaining -= this.tradeItems.offering.faabMoney;
    receivingTeam.faabBudget.remaining += this.tradeItems.offering.faabMoney;
  }
  
  if (this.tradeItems.requesting.faabMoney > 0) {
    receivingTeam.faabBudget.remaining -= this.tradeItems.requesting.faabMoney;
    proposingTeam.faabBudget.remaining += this.tradeItems.requesting.faabMoney;
  }
};

tradeSchema.methods.addVote = function(teamId, vote, reason = '') {
  // Remove existing vote from this team
  this.reviewPeriod.votes = this.reviewPeriod.votes.filter(v => 
    v.teamId.toString() !== teamId.toString()
  );
  
  // Add new vote
  this.reviewPeriod.votes.push({
    teamId: teamId,
    vote: vote,
    reason: reason,
    votedAt: new Date()
  });

  // Check if enough votes to make decision
  const vetoVotes = this.reviewPeriod.votes.filter(v => v.vote === 'VETO').length;
  
  if (vetoVotes >= this.reviewPeriod.vetoThreshold) {
    this.veto('Trade vetoed by league vote');
  } else if (this.reviewPeriod.votes.length >= this.reviewPeriod.requiredVotes) {
    // Enough votes and not vetoed, process the trade
    this.process();
  }

  return this.save();
};

tradeSchema.methods.analyzeTradeValue = async function() {
  try {
    // This would integrate with player valuation system
    // For now, provide basic analysis
    
    const Player = mongoose.model('Player');
    
    let offeringValue = 0;
    let requestingValue = 0;
    
    // Calculate offering value
    for (const playerInfo of this.tradeItems.offering.players) {
      const player = await Player.findById(playerInfo.playerId);
      if (player) {
        offeringValue += player.rankings.overall || 100;
      }
    }
    
    // Calculate requesting value
    for (const playerInfo of this.tradeItems.requesting.players) {
      const player = await Player.findById(playerInfo.playerId);
      if (player) {
        requestingValue += player.rankings.overall || 100;
      }
    }
    
    // Lower ranking number = higher value, so invert for fairness calculation
    const offeringScore = Math.max(0, 200 - offeringValue / this.tradeItems.offering.players.length);
    const requestingScore = Math.max(0, 200 - requestingValue / this.tradeItems.requesting.players.length);
    
    // Calculate fairness (0-100, where 100 is perfectly fair)
    const fairnessScore = Math.max(0, 100 - Math.abs(offeringScore - requestingScore));
    
    this.analysis.fairnessScore = fairnessScore;
    this.analysis.analyzedAt = new Date();
    
    return this.save();
    
  } catch (error) {
    console.error('Trade analysis error:', error);
    return this;
  }
};

// Static methods
tradeSchema.statics.createTrade = async function(proposingTeamId, receivingTeamId, tradeItems, message = '') {
  const Team = mongoose.model('Team');
  
  // Get teams and league info
  const proposingTeam = await Team.findById(proposingTeamId).populate('leagueId');
  const receivingTeam = await Team.findById(receivingTeamId);
  
  if (!proposingTeam || !receivingTeam) {
    throw new Error('Teams not found');
  }
  
  if (proposingTeam.leagueId._id.toString() !== receivingTeam.leagueId.toString()) {
    throw new Error('Teams must be in the same league');
  }

  // Get current week and season
  const currentWeek = proposingTeam.leagueId.currentWeek || 1;
  const currentSeason = proposingTeam.leagueId.season || new Date().getFullYear();

  // Create trade
  const trade = new this({
    leagueId: proposingTeam.leagueId._id,
    proposedBy: proposingTeamId,
    proposedTo: receivingTeamId,
    tradeItems: tradeItems,
    message: message,
    week: currentWeek,
    season: currentSeason,
    history: [{
      action: 'PROPOSED',
      performedBy: proposingTeam.owner,
      timestamp: new Date()
    }]
  });

  await trade.save();
  
  // Analyze trade value
  await trade.analyzeTradeValue();
  
  return trade;
};

tradeSchema.statics.getActiveTradesForTeam = function(teamId) {
  return this.find({
    $or: [
      { proposedBy: teamId },
      { proposedTo: teamId }
    ],
    status: { $in: ['PENDING', 'ACCEPTED'] }
  }).populate([
    { path: 'proposedBy', select: 'name owner abbreviation', populate: { path: 'owner', select: 'displayName' } },
    { path: 'proposedTo', select: 'name owner abbreviation', populate: { path: 'owner', select: 'displayName' } },
    { path: 'tradeItems.offering.players.playerId', select: 'name position team rankings' },
    { path: 'tradeItems.requesting.players.playerId', select: 'name position team rankings' }
  ]);
};

tradeSchema.statics.getLeagueTrades = function(leagueId, limit = 50) {
  return this.find({ leagueId: leagueId })
    .sort({ proposedAt: -1 })
    .limit(limit)
    .populate([
      { path: 'proposedBy', select: 'name owner abbreviation', populate: { path: 'owner', select: 'displayName' } },
      { path: 'proposedTo', select: 'name owner abbreviation', populate: { path: 'owner', select: 'displayName' } },
      { path: 'tradeItems.offering.players.playerId', select: 'name position team rankings' },
      { path: 'tradeItems.requesting.players.playerId', select: 'name position team rankings' }
    ]);
};

tradeSchema.statics.expireOldTrades = async function() {
  const expiredTrades = await this.find({
    status: 'PENDING',
    expiresAt: { $lt: new Date() }
  });

  for (const trade of expiredTrades) {
    trade.status = 'EXPIRED';
    trade.history.push({
      action: 'EXPIRED',
      reason: 'Trade proposal expired',
      timestamp: new Date()
    });
    await trade.save();
  }

  return expiredTrades.length;
};

module.exports = mongoose.model('Trade', tradeSchema);