/**
 * Matchup Model
 * MongoDB schema for head-to-head fantasy football matchups
 */

const mongoose = require('mongoose');

const matchupSchema = new mongoose.Schema({
  leagueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'League',
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
  matchupType: {
    type: String,
    enum: ['REGULAR_SEASON', 'PLAYOFF', 'CHAMPIONSHIP', 'CONSOLATION'],
    default: 'REGULAR_SEASON'
  },
  // Teams in the matchup
  homeTeam: {
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    score: { type: Number, default: 0 },
    projectedScore: { type: Number, default: 0 },
    lineup: [{
      player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
      position: { type: String, required: true },
      points: { type: Number, default: 0 },
      projectedPoints: { type: Number, default: 0 },
      isStarter: { type: Boolean, default: true }
    }],
    benchPoints: { type: Number, default: 0 }
  },
  awayTeam: {
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    score: { type: Number, default: 0 },
    projectedScore: { type: Number, default: 0 },
    lineup: [{
      player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
      position: { type: String, required: true },
      points: { type: Number, default: 0 },
      projectedPoints: { type: Number, default: 0 },
      isStarter: { type: Boolean, default: true }
    }],
    benchPoints: { type: Number, default: 0 }
  },
  // Matchup status
  status: {
    type: String,
    enum: ['SCHEDULED', 'IN_PROGRESS', 'FINAL', 'POSTPONED'],
    default: 'SCHEDULED'
  },
  // Winner information
  winner: {
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
    margin: { type: Number, default: 0 },
    isTie: { type: Boolean, default: false }
  },
  // Game timing
  gameStart: {
    type: Date,
    required: true
  },
  gameEnd: {
    type: Date,
    default: null
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  // Playoff information
  playoffInfo: {
    round: { type: Number, default: null }, // 1 = Wild Card, 2 = Divisional, 3 = Championship
    seed: {
      home: { type: Number, default: null },
      away: { type: Number, default: null }
    },
    isElimination: { type: Boolean, default: false }
  },
  // Statistics
  stats: {
    totalPoints: { type: Number, default: 0 },
    highestScoringPlayer: {
      playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
      points: { type: Number, default: 0 },
      team: { type: String, enum: ['HOME', 'AWAY'] }
    },
    lowestScoringPlayer: {
      playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
      points: { type: Number, default: 0 },
      team: { type: String, enum: ['HOME', 'AWAY'] }
    },
    benchHighScore: { type: Number, default: 0 },
    projectionAccuracy: { type: Number, default: 0 } // Percentage
  },
  // Tiebreaker information
  tiebreaker: {
    method: { type: String, enum: ['BENCH_POINTS', 'QB_POINTS', 'SEASON_RECORD'], default: null },
    winner: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
    details: { type: String, default: '' }
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
matchupSchema.index({ leagueId: 1 });
matchupSchema.index({ week: 1, season: 1 });
matchupSchema.index({ status: 1 });
matchupSchema.index({ gameStart: 1 });
matchupSchema.index({ 'homeTeam.teamId': 1 });
matchupSchema.index({ 'awayTeam.teamId': 1 });

// Virtual for total combined score
matchupSchema.virtual('totalScore').get(function() {
  return this.homeTeam.score + this.awayTeam.score;
});

// Virtual for score differential
matchupSchema.virtual('scoreDifferential').get(function() {
  return Math.abs(this.homeTeam.score - this.awayTeam.score);
});

// Virtual for is close game
matchupSchema.virtual('isCloseGame').get(function() {
  return this.scoreDifferential <= 5; // Within 5 points
});

// Virtual for game progress
matchupSchema.virtual('gameProgress').get(function() {
  if (this.status === 'FINAL') return 100;
  if (this.status === 'SCHEDULED') return 0;
  
  const now = new Date();
  const start = this.gameStart;
  const estimatedEnd = new Date(start.getTime() + (4 * 60 * 60 * 1000)); // 4 hours
  
  if (now < start) return 0;
  if (now > estimatedEnd) return 100;
  
  const elapsed = now - start;
  const total = estimatedEnd - start;
  return Math.min(100, Math.max(0, (elapsed / total) * 100));
});

// Pre-save middleware
matchupSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Calculate total points
  this.stats.totalPoints = this.homeTeam.score + this.awayTeam.score;
  
  // Determine winner
  if (this.status === 'FINAL') {
    this.determineWinner();
  }
  
  next();
});

// Instance methods
matchupSchema.methods.determineWinner = function() {
  const homeScore = this.homeTeam.score;
  const awayScore = this.awayTeam.score;
  
  if (homeScore === awayScore) {
    // Handle tie
    this.winner.isTie = true;
    this.winner.margin = 0;
    
    // Apply tiebreaker if configured
    this.applyTiebreaker();
  } else if (homeScore > awayScore) {
    this.winner.teamId = this.homeTeam.teamId;
    this.winner.margin = homeScore - awayScore;
    this.winner.isTie = false;
  } else {
    this.winner.teamId = this.awayTeam.teamId;
    this.winner.margin = awayScore - homeScore;
    this.winner.isTie = false;
  }
};

matchupSchema.methods.applyTiebreaker = function() {
  // Default tiebreaker: bench points
  const homeBench = this.homeTeam.benchPoints;
  const awayBench = this.awayTeam.benchPoints;
  
  if (homeBench !== awayBench) {
    this.tiebreaker.method = 'BENCH_POINTS';
    this.tiebreaker.winner = homeBench > awayBench ? this.homeTeam.teamId : this.awayTeam.teamId;
    this.tiebreaker.details = `Bench points: ${homeBench} vs ${awayBench}`;
    this.winner.teamId = this.tiebreaker.winner;
    this.winner.isTie = false;
  }
};

matchupSchema.methods.updateScore = async function(teamId, newScore, lineup = null) {
  const isHomeTeam = this.homeTeam.teamId.toString() === teamId.toString();
  
  if (isHomeTeam) {
    this.homeTeam.score = newScore;
    if (lineup) this.homeTeam.lineup = lineup;
  } else {
    this.awayTeam.score = newScore;
    if (lineup) this.awayTeam.lineup = lineup;
  }
  
  this.lastUpdated = new Date();
  
  // Update game status
  if (this.status === 'SCHEDULED' && (this.homeTeam.score > 0 || this.awayTeam.score > 0)) {
    this.status = 'IN_PROGRESS';
  }
  
  return this.save();
};

matchupSchema.methods.finalizeMatchup = async function() {
  this.status = 'FINAL';
  this.gameEnd = new Date();
  
  // Calculate final statistics
  await this.calculateFinalStats();
  
  // Update team records
  await this.updateTeamRecords();
  
  return this.save();
};

matchupSchema.methods.calculateFinalStats = async function() {
  // Find highest and lowest scoring players
  const allPlayers = [
    ...this.homeTeam.lineup.map(p => ({ ...p, team: 'HOME' })),
    ...this.awayTeam.lineup.map(p => ({ ...p, team: 'AWAY' }))
  ].filter(p => p.isStarter);
  
  if (allPlayers.length > 0) {
    const highest = allPlayers.reduce((max, player) => 
      player.points > max.points ? player : max
    );
    
    const lowest = allPlayers.reduce((min, player) => 
      player.points < min.points ? player : min
    );
    
    this.stats.highestScoringPlayer = {
      playerId: highest.player,
      points: highest.points,
      team: highest.team
    };
    
    this.stats.lowestScoringPlayer = {
      playerId: lowest.player,
      points: lowest.points,
      team: lowest.team
    };
  }
  
  // Calculate bench high score
  this.stats.benchHighScore = Math.max(this.homeTeam.benchPoints, this.awayTeam.benchPoints);
  
  // Calculate projection accuracy
  const homeAccuracy = this.homeTeam.projectedScore > 0 ? 
    (this.homeTeam.score / this.homeTeam.projectedScore) * 100 : 0;
  const awayAccuracy = this.awayTeam.projectedScore > 0 ? 
    (this.awayTeam.score / this.awayTeam.projectedScore) * 100 : 0;
  
  this.stats.projectionAccuracy = (homeAccuracy + awayAccuracy) / 2;
};

matchupSchema.methods.updateTeamRecords = async function() {
  const Team = mongoose.model('Team');
  
  if (this.winner.isTie) {
    // Both teams get a tie
    await Team.findByIdAndUpdate(this.homeTeam.teamId, {
      $inc: { 'record.ties': 1 }
    });
    await Team.findByIdAndUpdate(this.awayTeam.teamId, {
      $inc: { 'record.ties': 1 }
    });
  } else {
    // Winner gets a win, loser gets a loss
    const winnerId = this.winner.teamId;
    const loserId = winnerId.toString() === this.homeTeam.teamId.toString() ? 
      this.awayTeam.teamId : this.homeTeam.teamId;
    
    await Team.findByIdAndUpdate(winnerId, {
      $inc: { 'record.wins': 1 }
    });
    await Team.findByIdAndUpdate(loserId, {
      $inc: { 'record.losses': 1 }
    });
  }
  
  // Update points for/against
  await Team.findByIdAndUpdate(this.homeTeam.teamId, {
    $inc: { 
      'points.pointsFor': this.homeTeam.score,
      'points.pointsAgainst': this.awayTeam.score
    }
  });
  await Team.findByIdAndUpdate(this.awayTeam.teamId, {
    $inc: { 
      'points.pointsFor': this.awayTeam.score,
      'points.pointsAgainst': this.homeTeam.score
    }
  });
};

// Static methods
matchupSchema.statics.createWeeklyMatchups = async function(leagueId, week) {
  const Team = mongoose.model('Team');
  const League = mongoose.model('League');
  
  const league = await League.findById(leagueId);
  if (!league) {
    throw new Error('League not found');
  }
  
  const teams = await Team.find({ leagueId: leagueId }).sort({ draftPosition: 1 });
  if (teams.length % 2 !== 0) {
    throw new Error('Odd number of teams - cannot create matchups');
  }
  
  // Generate matchups using round-robin scheduling
  const matchups = this.generateRoundRobinMatchups(teams, week, league);
  
  // Save all matchups
  const savedMatchups = [];
  for (const matchupData of matchups) {
    const matchup = new this(matchupData);
    await matchup.save();
    savedMatchups.push(matchup);
  }
  
  return savedMatchups;
};

matchupSchema.statics.generateRoundRobinMatchups = function(teams, week, league) {
  const numTeams = teams.length;
  const matchups = [];
  
  // Simple pairing for now - in production, use proper round-robin algorithm
  for (let i = 0; i < numTeams; i += 2) {
    if (i + 1 < numTeams) {
      const gameStart = this.getWeekStartDate(week, league.season);
      
      matchups.push({
        leagueId: league._id,
        week: week,
        season: league.season,
        homeTeam: {
          teamId: teams[i]._id,
          score: 0,
          projectedScore: 0,
          lineup: [],
          benchPoints: 0
        },
        awayTeam: {
          teamId: teams[i + 1]._id,
          score: 0,
          projectedScore: 0,
          lineup: [],
          benchPoints: 0
        },
        gameStart: gameStart,
        status: 'SCHEDULED'
      });
    }
  }
  
  return matchups;
};

matchupSchema.statics.getWeekStartDate = function(week, season) {
  // NFL season typically starts first Thursday in September
  const seasonStart = new Date(season, 8, 1); // September 1st
  const firstThursday = new Date(seasonStart);
  
  // Find first Thursday
  while (firstThursday.getDay() !== 4) {
    firstThursday.setDate(firstThursday.getDate() + 1);
  }
  
  // Add weeks
  const weekStart = new Date(firstThursday);
  weekStart.setDate(firstThursday.getDate() + ((week - 1) * 7));
  weekStart.setHours(20, 0, 0, 0); // 8 PM Thursday
  
  return weekStart;
};

matchupSchema.statics.getWeeklyMatchups = function(leagueId, week) {
  return this.find({ leagueId: leagueId, week: week })
    .populate('homeTeam.teamId', 'name owner abbreviation')
    .populate('awayTeam.teamId', 'name owner abbreviation')
    .populate('homeTeam.lineup.player', 'name position team')
    .populate('awayTeam.lineup.player', 'name position team')
    .sort({ gameStart: 1 });
};

matchupSchema.statics.getCurrentMatchups = function(leagueId) {
  const League = mongoose.model('League');
  
  return League.findById(leagueId)
    .then(league => {
      if (!league) throw new Error('League not found');
      return this.getWeeklyMatchups(leagueId, league.currentWeek);
    });
};

matchupSchema.statics.getTeamMatchups = function(teamId, season = null) {
  const query = {
    $or: [
      { 'homeTeam.teamId': teamId },
      { 'awayTeam.teamId': teamId }
    ]
  };
  
  if (season) query.season = season;
  
  return this.find(query)
    .populate('homeTeam.teamId', 'name abbreviation')
    .populate('awayTeam.teamId', 'name abbreviation')
    .sort({ week: 1 });
};

matchupSchema.statics.getPlayoffMatchups = function(leagueId, round = null) {
  const query = { 
    leagueId: leagueId, 
    matchupType: { $in: ['PLAYOFF', 'CHAMPIONSHIP', 'CONSOLATION'] }
  };
  
  if (round) query['playoffInfo.round'] = round;
  
  return this.find(query)
    .populate('homeTeam.teamId', 'name owner abbreviation')
    .populate('awayTeam.teamId', 'name owner abbreviation')
    .sort({ 'playoffInfo.round': 1, week: 1 });
};

matchupSchema.statics.updateLiveScores = async function(leagueId, week) {
  const matchups = await this.find({ 
    leagueId: leagueId, 
    week: week,
    status: { $in: ['SCHEDULED', 'IN_PROGRESS'] }
  });
  
  for (const matchup of matchups) {
    try {
      // This would integrate with live scoring service
      await this.updateMatchupScores(matchup);
    } catch (error) {
      console.error(`Error updating matchup ${matchup._id}:`, error);
    }
  }
};

matchupSchema.statics.updateMatchupScores = async function(matchup) {
  // This would calculate real-time scores based on player performances
  // For now, just mark as updated
  matchup.lastUpdated = new Date();
  await matchup.save();
};

module.exports = mongoose.model('Matchup', matchupSchema);