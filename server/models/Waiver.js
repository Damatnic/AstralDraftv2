/**
 * Waiver Model
 * MongoDB schema for waiver wire claims and FAAB bidding
 */

const mongoose = require('mongoose');

const waiverSchema = new mongoose.Schema({
  leagueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'League',
    required: true
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
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
  type: {
    type: String,
    enum: ['ADD', 'DROP', 'ADD_DROP'],
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'SUCCESSFUL', 'FAILED', 'CANCELLED'],
    default: 'PENDING'
  },
  // Player being added
  addPlayer: {
    playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    playerName: { type: String },
    position: { type: String },
    team: { type: String }
  },
  // Player being dropped (for ADD_DROP claims)
  dropPlayer: {
    playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    playerName: { type: String },
    position: { type: String },
    team: { type: String }
  },
  // FAAB bidding information
  bidAmount: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  // Waiver priority (for non-FAAB leagues)
  priority: {
    type: Number,
    min: 1,
    default: null
  },
  // Processing information
  processedAt: {
    type: Date,
    default: null
  },
  processedBy: {
    type: String,
    enum: ['SYSTEM', 'COMMISSIONER'],
    default: 'SYSTEM'
  },
  failureReason: {
    type: String,
    enum: [
      'INSUFFICIENT_FAAB',
      'ROSTER_FULL',
      'PLAYER_UNAVAILABLE',
      'INVALID_DROP',
      'OUTBID',
      'LOWER_PRIORITY',
      'CANCELLED_BY_USER',
      'CANCELLED_BY_COMMISSIONER'
    ],
    default: null
  },
  // Claim details
  claimDetails: {
    submittedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    notes: { type: String, maxlength: 200, default: '' },
    isBlindBid: { type: Boolean, default: true }
  },
  // Processing results
  processingResults: {
    finalBidAmount: { type: Number, default: null },
    winningBid: { type: Boolean, default: false },
    competingClaims: { type: Number, default: 0 },
    highestBid: { type: Number, default: null },
    processingOrder: { type: Number, default: null }
  },
  // Transaction history
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    default: null
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
waiverSchema.index({ leagueId: 1 });
waiverSchema.index({ teamId: 1 });
waiverSchema.index({ status: 1 });
waiverSchema.index({ week: 1, season: 1 });
waiverSchema.index({ 'claimDetails.expiresAt': 1 });
waiverSchema.index({ 'addPlayer.playerId': 1 });

// Virtual for time remaining
waiverSchema.virtual('timeRemaining').get(function() {
  if (this.status !== 'PENDING') return 0;
  const now = new Date();
  const remaining = this.claimDetails.expiresAt.getTime() - now.getTime();
  return Math.max(0, remaining);
});

// Virtual for is expired
waiverSchema.virtual('isExpired').get(function() {
  return this.status === 'PENDING' && new Date() > this.claimDetails.expiresAt;
});

// Virtual for hours until processing
waiverSchema.virtual('hoursUntilProcessing').get(function() {
  if (this.status !== 'PENDING') return 0;
  const hours = this.timeRemaining / (1000 * 60 * 60);
  return Math.max(0, Math.floor(hours));
});

// Pre-save middleware
waiverSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Auto-expire if past expiration date
  if (this.status === 'PENDING' && this.isExpired) {
    this.status = 'FAILED';
    this.failureReason = 'EXPIRED';
    this.processedAt = new Date();
  }
  
  next();
});

// Instance methods
waiverSchema.methods.canCancel = function(userId) {
  if (this.status !== 'PENDING') return false;
  
  // Check if user owns the team
  return this.teamId.owner?.toString() === userId.toString();
};

waiverSchema.methods.cancel = function(userId, reason = 'CANCELLED_BY_USER') {
  if (!this.canCancel(userId)) {
    throw new Error('Cannot cancel this waiver claim');
  }

  this.status = 'CANCELLED';
  this.failureReason = reason;
  this.processedAt = new Date();
  
  return this.save();
};

waiverSchema.methods.process = async function(isSuccessful, reason = null, competingClaims = 0) {
  try {
    this.status = isSuccessful ? 'SUCCESSFUL' : 'FAILED';
    this.processedAt = new Date();
    this.processingResults.competingClaims = competingClaims;
    
    if (!isSuccessful && reason) {
      this.failureReason = reason;
    }

    if (isSuccessful) {
      await this.executeTransaction();
    }

    return this.save();

  } catch (error) {
    console.error('Waiver processing error:', error);
    this.status = 'FAILED';
    this.failureReason = 'PROCESSING_ERROR';
    this.processedAt = new Date();
    return this.save();
  }
};

waiverSchema.methods.executeTransaction = async function() {
  const Team = mongoose.model('Team');
  const team = await Team.findById(this.teamId);
  
  if (!team) {
    throw new Error('Team not found');
  }

  // Check FAAB budget
  if (this.bidAmount > team.faabBudget.remaining) {
    throw new Error('Insufficient FAAB budget');
  }

  // Execute the transaction based on type
  switch (this.type) {
    case 'ADD':
      await this.executeAdd(team);
      break;
    case 'DROP':
      await this.executeDrop(team);
      break;
    case 'ADD_DROP':
      await this.executeAddDrop(team);
      break;
    default:
      throw new Error('Invalid waiver type');
  }

  // Deduct FAAB budget
  team.faabBudget.remaining -= this.bidAmount;
  team.faabBudget.spent += this.bidAmount;
  
  // Update team stats
  team.stats.totalTransactions += 1;
  
  await team.save();
};

waiverSchema.methods.executeAdd = async function(team) {
  if (!this.addPlayer.playerId) {
    throw new Error('No player to add');
  }

  // Check roster space
  if (team.roster.length >= this.getMaxRosterSize(team)) {
    throw new Error('Roster is full');
  }

  // Add player to roster
  await team.addPlayer(this.addPlayer.playerId, 'BENCH', 'waiver');
};

waiverSchema.methods.executeDrop = async function(team) {
  if (!this.dropPlayer.playerId) {
    throw new Error('No player to drop');
  }

  // Drop player from roster
  await team.dropPlayer(this.dropPlayer.playerId);
};

waiverSchema.methods.executeAddDrop = async function(team) {
  if (!this.addPlayer.playerId || !this.dropPlayer.playerId) {
    throw new Error('Both add and drop players required');
  }

  // Verify drop player is on roster
  const hasDropPlayer = team.roster.some(spot => 
    spot.player.toString() === this.dropPlayer.playerId.toString()
  );

  if (!hasDropPlayer) {
    throw new Error('Drop player not found on roster');
  }

  // Execute drop first, then add
  await team.dropPlayer(this.dropPlayer.playerId);
  await team.addPlayer(this.addPlayer.playerId, 'BENCH', 'waiver');
};

waiverSchema.methods.getMaxRosterSize = function(team) {
  const settings = team.leagueId?.settings?.rosterSettings;
  if (!settings) return 16; // Default roster size
  
  return (settings.qb || 0) + (settings.rb || 0) + (settings.wr || 0) + 
         (settings.te || 0) + (settings.flex || 0) + (settings.dst || 0) + 
         (settings.k || 0) + (settings.bench || 0) + (settings.ir || 0);
};

// Static methods
waiverSchema.statics.createClaim = async function(teamId, claimData) {
  const Team = mongoose.model('Team');
  const Player = mongoose.model('Player');
  
  // Get team and league info
  const team = await Team.findById(teamId).populate('leagueId');
  if (!team) {
    throw new Error('Team not found');
  }

  const league = team.leagueId;
  
  // Validate claim data
  await this.validateClaim(team, claimData);

  // Get player details
  let addPlayerDetails = null;
  let dropPlayerDetails = null;

  if (claimData.addPlayerId) {
    const addPlayer = await Player.findById(claimData.addPlayerId);
    if (!addPlayer) {
      throw new Error('Add player not found');
    }
    addPlayerDetails = {
      playerId: addPlayer._id,
      playerName: addPlayer.name,
      position: addPlayer.position,
      team: addPlayer.team
    };
  }

  if (claimData.dropPlayerId) {
    const dropPlayer = await Player.findById(claimData.dropPlayerId);
    if (!dropPlayer) {
      throw new Error('Drop player not found');
    }
    dropPlayerDetails = {
      playerId: dropPlayer._id,
      playerName: dropPlayer.name,
      position: dropPlayer.position,
      team: dropPlayer.team
    };
  }

  // Calculate expiration time (next waiver processing day)
  const expiresAt = this.getNextProcessingTime(league);

  // Create waiver claim
  const waiver = new this({
    leagueId: league._id,
    teamId: teamId,
    week: league.currentWeek || 1,
    season: league.season || new Date().getFullYear(),
    type: claimData.type,
    addPlayer: addPlayerDetails,
    dropPlayer: dropPlayerDetails,
    bidAmount: claimData.bidAmount || 0,
    priority: team.waiverPriority,
    claimDetails: {
      submittedAt: new Date(),
      expiresAt: expiresAt,
      notes: claimData.notes || '',
      isBlindBid: league.settings.waiverSettings.type === 'faab'
    }
  });

  return waiver.save();
};

waiverSchema.statics.validateClaim = async function(team, claimData) {
  const league = team.leagueId;
  
  // Check if waivers are enabled
  if (!league.settings.waiverSettings) {
    throw new Error('Waivers not configured for this league');
  }

  // Check FAAB budget
  if (league.settings.waiverSettings.type === 'faab') {
    if (claimData.bidAmount > team.faabBudget.remaining) {
      throw new Error('Insufficient FAAB budget');
    }
    
    if (claimData.bidAmount < league.settings.waiverSettings.minBid) {
      throw new Error(`Minimum bid is $${league.settings.waiverSettings.minBid}`);
    }
  }

  // Validate claim type
  if (!['ADD', 'DROP', 'ADD_DROP'].includes(claimData.type)) {
    throw new Error('Invalid claim type');
  }

  // Type-specific validations
  if (claimData.type === 'ADD' || claimData.type === 'ADD_DROP') {
    if (!claimData.addPlayerId) {
      throw new Error('Add player required');
    }
    
    // Check if player is available
    const isAvailable = await this.isPlayerAvailable(claimData.addPlayerId, league._id);
    if (!isAvailable) {
      throw new Error('Player is not available');
    }
  }

  if (claimData.type === 'DROP' || claimData.type === 'ADD_DROP') {
    if (!claimData.dropPlayerId) {
      throw new Error('Drop player required');
    }
    
    // Check if player is on roster
    const hasPlayer = team.roster.some(spot => 
      spot.player.toString() === claimData.dropPlayerId.toString()
    );
    
    if (!hasPlayer) {
      throw new Error('Drop player not found on roster');
    }
  }

  // Check for duplicate claims
  const existingClaim = await this.findOne({
    teamId: team._id,
    'addPlayer.playerId': claimData.addPlayerId,
    status: 'PENDING'
  });

  if (existingClaim) {
    throw new Error('You already have a pending claim for this player');
  }
};

waiverSchema.statics.isPlayerAvailable = async function(playerId, leagueId) {
  const Team = mongoose.model('Team');
  
  // Check if player is on any roster in the league
  const teams = await Team.find({ leagueId: leagueId });
  
  for (const team of teams) {
    const hasPlayer = team.roster.some(spot => 
      spot.player.toString() === playerId.toString()
    );
    if (hasPlayer) return false;
  }
  
  return true;
};

waiverSchema.statics.getNextProcessingTime = function(league) {
  const settings = league.settings.waiverSettings;
  const processDay = settings.processDay || 'wednesday';
  const now = new Date();
  
  // Map day names to numbers (0 = Sunday)
  const dayMap = {
    'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
    'thursday': 4, 'friday': 5, 'saturday': 6
  };
  
  const targetDay = dayMap[processDay.toLowerCase()];
  const currentDay = now.getDay();
  
  // Calculate days until next processing day
  let daysUntil = targetDay - currentDay;
  if (daysUntil <= 0) {
    daysUntil += 7; // Next week
  }
  
  // Set to 3 AM on processing day
  const processingTime = new Date(now);
  processingTime.setDate(now.getDate() + daysUntil);
  processingTime.setHours(3, 0, 0, 0);
  
  return processingTime;
};

waiverSchema.statics.getPendingClaims = function(leagueId) {
  return this.find({
    leagueId: leagueId,
    status: 'PENDING'
  })
    .populate('teamId', 'name owner abbreviation')
    .populate('addPlayer.playerId', 'name position team rankings')
    .populate('dropPlayer.playerId', 'name position team rankings')
    .sort({ bidAmount: -1, 'claimDetails.submittedAt': 1 });
};

waiverSchema.statics.getTeamClaims = function(teamId, status = null) {
  const query = { teamId: teamId };
  if (status) query.status = status;
  
  return this.find(query)
    .populate('addPlayer.playerId', 'name position team rankings photoUrl')
    .populate('dropPlayer.playerId', 'name position team rankings photoUrl')
    .sort({ 'claimDetails.submittedAt': -1 });
};

waiverSchema.statics.processLeagueWaivers = async function(leagueId) {
  console.log(`Processing waivers for league ${leagueId}`);
  
  const pendingClaims = await this.getPendingClaims(leagueId);
  if (pendingClaims.length === 0) {
    console.log('No pending claims to process');
    return { processed: 0, successful: 0, failed: 0 };
  }

  const League = mongoose.model('League');
  const league = await League.findById(leagueId);
  
  let processed = 0;
  let successful = 0;
  let failed = 0;

  if (league.settings.waiverSettings.type === 'faab') {
    // Process FAAB claims
    const results = await this.processFAABClaims(pendingClaims);
    processed = results.processed;
    successful = results.successful;
    failed = results.failed;
  } else {
    // Process priority-based claims
    const results = await this.processPriorityClaims(pendingClaims);
    processed = results.processed;
    successful = results.successful;
    failed = results.failed;
  }

  // Update waiver priorities for next week
  await this.updateWaiverPriorities(leagueId);

  console.log(`Waiver processing complete: ${successful} successful, ${failed} failed`);
  
  return { processed, successful, failed };
};

waiverSchema.statics.processFAABClaims = async function(claims) {
  // Group claims by player
  const claimsByPlayer = new Map();
  
  claims.forEach(claim => {
    if (claim.addPlayer?.playerId) {
      const playerId = claim.addPlayer.playerId.toString();
      if (!claimsByPlayer.has(playerId)) {
        claimsByPlayer.set(playerId, []);
      }
      claimsByPlayer.get(playerId).push(claim);
    }
  });

  let processed = 0;
  let successful = 0;
  let failed = 0;

  // Process each player's claims
  for (const [playerId, playerClaims] of claimsByPlayer) {
    // Sort by bid amount (highest first), then by submission time
    playerClaims.sort((a, b) => {
      if (b.bidAmount !== a.bidAmount) {
        return b.bidAmount - a.bidAmount;
      }
      return new Date(a.claimDetails.submittedAt) - new Date(b.claimDetails.submittedAt);
    });

    const winningClaim = playerClaims[0];
    const competingClaims = playerClaims.length;

    // Process winning claim
    try {
      await winningClaim.process(true, null, competingClaims);
      successful++;
    } catch (error) {
      console.error(`Failed to process winning claim: ${error.message}`);
      await winningClaim.process(false, 'PROCESSING_ERROR', competingClaims);
      failed++;
    }
    processed++;

    // Fail all other claims
    for (let i = 1; i < playerClaims.length; i++) {
      await playerClaims[i].process(false, 'OUTBID', competingClaims);
      processed++;
      failed++;
    }
  }

  return { processed, successful, failed };
};

waiverSchema.statics.processPriorityClaims = async function(claims) {
  // Sort by waiver priority (lower number = higher priority)
  claims.sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    return new Date(a.claimDetails.submittedAt) - new Date(b.claimDetails.submittedAt);
  });

  let processed = 0;
  let successful = 0;
  let failed = 0;

  const processedPlayers = new Set();

  for (const claim of claims) {
    const playerId = claim.addPlayer?.playerId?.toString();
    
    // Skip if player already claimed
    if (playerId && processedPlayers.has(playerId)) {
      await claim.process(false, 'PLAYER_UNAVAILABLE', 1);
      processed++;
      failed++;
      continue;
    }

    // Try to process claim
    try {
      await claim.process(true, null, 1);
      successful++;
      
      if (playerId) {
        processedPlayers.add(playerId);
      }
    } catch (error) {
      console.error(`Failed to process priority claim: ${error.message}`);
      await claim.process(false, 'PROCESSING_ERROR', 1);
      failed++;
    }
    processed++;
  }

  return { processed, successful, failed };
};

waiverSchema.statics.updateWaiverPriorities = async function(leagueId) {
  const Team = mongoose.model('Team');
  
  // Get teams sorted by record (worst record gets highest priority)
  const teams = await Team.find({ leagueId: leagueId })
    .sort({ 
      'record.wins': 1, 
      'points.pointsFor': 1 
    });

  // Update waiver priorities
  for (let i = 0; i < teams.length; i++) {
    teams[i].waiverPriority = i + 1;
    await teams[i].save();
  }

  console.log(`Updated waiver priorities for ${teams.length} teams`);
};

waiverSchema.statics.expireOldClaims = async function() {
  const expiredClaims = await this.find({
    status: 'PENDING',
    'claimDetails.expiresAt': { $lt: new Date() }
  });

  for (const claim of expiredClaims) {
    claim.status = 'FAILED';
    claim.failureReason = 'EXPIRED';
    claim.processedAt = new Date();
    await claim.save();
  }

  return expiredClaims.length;
};

module.exports = mongoose.model('Waiver', waiverSchema);