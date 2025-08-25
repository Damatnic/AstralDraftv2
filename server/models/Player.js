/**
 * Player Model
 * MongoDB schema for NFL players
 */

const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  externalId: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    required: true,
    enum: ['QB', 'RB', 'WR', 'TE', 'K', 'DST']
  },
  team: {
    type: String,
    required: true,
    uppercase: true,
    maxlength: 3
  },
  jerseyNumber: {
    type: Number,
    min: 0,
    max: 99,
    default: null
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INJURED', 'SUSPENDED', 'RETIRED', 'PRACTICE_SQUAD', 'INACTIVE'],
    default: 'ACTIVE'
  },
  injuryStatus: {
    designation: {
      type: String,
      enum: ['HEALTHY', 'QUESTIONABLE', 'DOUBTFUL', 'OUT', 'IR', 'PUP', 'SUSPENDED'],
      default: 'HEALTHY'
    },
    description: { type: String, default: '' },
    updatedAt: { type: Date, default: Date.now }
  },
  demographics: {
    age: { type: Number, min: 18, max: 50, default: null },
    height: { type: String, default: null }, // e.g., "6'2\""
    weight: { type: Number, min: 150, max: 400, default: null },
    college: { type: String, default: null },
    experience: { type: Number, min: 0, max: 25, default: 0 },
    birthDate: { type: Date, default: null }
  },
  contract: {
    salary: { type: Number, default: null },
    years: { type: Number, default: null },
    guaranteed: { type: Number, default: null }
  },
  stats: {
    season: { type: Number, required: true },
    games: {
      played: { type: Number, default: 0 },
      started: { type: Number, default: 0 }
    },
    // Passing stats
    passing: {
      attempts: { type: Number, default: 0 },
      completions: { type: Number, default: 0 },
      yards: { type: Number, default: 0 },
      touchdowns: { type: Number, default: 0 },
      interceptions: { type: Number, default: 0 },
      sacks: { type: Number, default: 0 },
      rating: { type: Number, default: 0 },
      qbr: { type: Number, default: 0 }
    },
    // Rushing stats
    rushing: {
      attempts: { type: Number, default: 0 },
      yards: { type: Number, default: 0 },
      touchdowns: { type: Number, default: 0 },
      fumbles: { type: Number, default: 0 },
      longest: { type: Number, default: 0 }
    },
    // Receiving stats
    receiving: {
      targets: { type: Number, default: 0 },
      receptions: { type: Number, default: 0 },
      yards: { type: Number, default: 0 },
      touchdowns: { type: Number, default: 0 },
      fumbles: { type: Number, default: 0 },
      longest: { type: Number, default: 0 }
    },
    // Kicking stats
    kicking: {
      fieldGoalsMade: { type: Number, default: 0 },
      fieldGoalsAttempted: { type: Number, default: 0 },
      extraPointsMade: { type: Number, default: 0 },
      extraPointsAttempted: { type: Number, default: 0 },
      longest: { type: Number, default: 0 }
    },
    // Defense/Special Teams
    defense: {
      tackles: { type: Number, default: 0 },
      sacks: { type: Number, default: 0 },
      interceptions: { type: Number, default: 0 },
      forcedFumbles: { type: Number, default: 0 },
      fumbleRecoveries: { type: Number, default: 0 },
      defensiveTouchdowns: { type: Number, default: 0 },
      safeties: { type: Number, default: 0 },
      pointsAllowed: { type: Number, default: 0 },
      yardsAllowed: { type: Number, default: 0 }
    }
  },
  weeklyStats: [{
    week: { type: Number, required: true, min: 1, max: 18 },
    opponent: { type: String, required: true },
    isHome: { type: Boolean, default: true },
    gameDate: { type: Date, required: true },
    stats: {
      // Same structure as season stats but for individual week
      passing: {
        attempts: { type: Number, default: 0 },
        completions: { type: Number, default: 0 },
        yards: { type: Number, default: 0 },
        touchdowns: { type: Number, default: 0 },
        interceptions: { type: Number, default: 0 }
      },
      rushing: {
        attempts: { type: Number, default: 0 },
        yards: { type: Number, default: 0 },
        touchdowns: { type: Number, default: 0 },
        fumbles: { type: Number, default: 0 }
      },
      receiving: {
        targets: { type: Number, default: 0 },
        receptions: { type: Number, default: 0 },
        yards: { type: Number, default: 0 },
        touchdowns: { type: Number, default: 0 },
        fumbles: { type: Number, default: 0 }
      },
      kicking: {
        fieldGoalsMade: { type: Number, default: 0 },
        fieldGoalsAttempted: { type: Number, default: 0 },
        extraPointsMade: { type: Number, default: 0 },
        extraPointsAttempted: { type: Number, default: 0 }
      },
      defense: {
        tackles: { type: Number, default: 0 },
        sacks: { type: Number, default: 0 },
        interceptions: { type: Number, default: 0 },
        forcedFumbles: { type: Number, default: 0 },
        fumbleRecoveries: { type: Number, default: 0 },
        defensiveTouchdowns: { type: Number, default: 0 },
        pointsAllowed: { type: Number, default: 0 }
      }
    },
    fantasyPoints: {
      standard: { type: Number, default: 0 },
      ppr: { type: Number, default: 0 },
      halfPpr: { type: Number, default: 0 }
    },
    projectedPoints: {
      standard: { type: Number, default: 0 },
      ppr: { type: Number, default: 0 },
      halfPpr: { type: Number, default: 0 }
    }
  }],
  rankings: {
    overall: { type: Number, default: null },
    position: { type: Number, default: null },
    adp: { type: Number, default: null }, // Average Draft Position
    tier: { type: Number, default: null },
    lastUpdated: { type: Date, default: Date.now }
  },
  projections: {
    season: {
      games: { type: Number, default: 0 },
      fantasyPoints: {
        standard: { type: Number, default: 0 },
        ppr: { type: Number, default: 0 },
        halfPpr: { type: Number, default: 0 }
      },
      stats: {
        passing: {
          attempts: { type: Number, default: 0 },
          completions: { type: Number, default: 0 },
          yards: { type: Number, default: 0 },
          touchdowns: { type: Number, default: 0 },
          interceptions: { type: Number, default: 0 }
        },
        rushing: {
          attempts: { type: Number, default: 0 },
          yards: { type: Number, default: 0 },
          touchdowns: { type: Number, default: 0 }
        },
        receiving: {
          targets: { type: Number, default: 0 },
          receptions: { type: Number, default: 0 },
          yards: { type: Number, default: 0 },
          touchdowns: { type: Number, default: 0 }
        }
      }
    },
    weekly: [{
      week: { type: Number, required: true },
      opponent: { type: String, required: true },
      fantasyPoints: {
        standard: { type: Number, default: 0 },
        ppr: { type: Number, default: 0 },
        halfPpr: { type: Number, default: 0 }
      },
      confidence: { type: Number, min: 0, max: 100, default: 50 }
    }]
  },
  news: [{
    headline: { type: String, required: true },
    content: { type: String, required: true },
    source: { type: String, required: true },
    impact: {
      type: String,
      enum: ['HIGH', 'MEDIUM', 'LOW'],
      default: 'LOW'
    },
    publishedAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  byeWeek: {
    type: Number,
    min: 1,
    max: 18,
    default: null
  },
  isRookie: {
    type: Boolean,
    default: false
  },
  photoUrl: {
    type: String,
    default: null
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  createdAt: {
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
playerSchema.index({ externalId: 1 });
playerSchema.index({ position: 1 });
playerSchema.index({ team: 1 });
playerSchema.index({ status: 1 });
playerSchema.index({ 'rankings.overall': 1 });
playerSchema.index({ 'rankings.position': 1 });
playerSchema.index({ name: 'text', firstName: 'text', lastName: 'text' });

// Virtual for full name
playerSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for display name with team
playerSchema.virtual('displayName').get(function() {
  return `${this.name} (${this.team} - ${this.position})`;
});

// Virtual for current season fantasy points
playerSchema.virtual('seasonFantasyPoints').get(function() {
  return this.calculateSeasonFantasyPoints('ppr');
});

// Instance methods
playerSchema.methods.calculateFantasyPoints = function(stats, scoringType = 'ppr') {
  let points = 0;
  
  // Passing points
  if (stats.passing) {
    points += (stats.passing.yards || 0) * 0.04; // 1 point per 25 yards
    points += (stats.passing.touchdowns || 0) * 4;
    points += (stats.passing.interceptions || 0) * -2;
  }
  
  // Rushing points
  if (stats.rushing) {
    points += (stats.rushing.yards || 0) * 0.1; // 1 point per 10 yards
    points += (stats.rushing.touchdowns || 0) * 6;
    points += (stats.rushing.fumbles || 0) * -2;
  }
  
  // Receiving points
  if (stats.receiving) {
    points += (stats.receiving.yards || 0) * 0.1; // 1 point per 10 yards
    points += (stats.receiving.touchdowns || 0) * 6;
    points += (stats.receiving.fumbles || 0) * -2;
    
    // PPR bonus
    if (scoringType === 'ppr') {
      points += (stats.receiving.receptions || 0) * 1;
    } else if (scoringType === 'half-ppr') {
      points += (stats.receiving.receptions || 0) * 0.5;
    }
  }
  
  // Kicking points
  if (stats.kicking) {
    points += (stats.kicking.fieldGoalsMade || 0) * 3;
    points += (stats.kicking.extraPointsMade || 0) * 1;
  }
  
  // Defense points
  if (stats.defense) {
    points += (stats.defense.sacks || 0) * 1;
    points += (stats.defense.interceptions || 0) * 2;
    points += (stats.defense.fumbleRecoveries || 0) * 2;
    points += (stats.defense.defensiveTouchdowns || 0) * 6;
    points += (stats.defense.safeties || 0) * 2;
    
    // Points allowed (DST only)
    const pointsAllowed = stats.defense.pointsAllowed || 0;
    if (pointsAllowed === 0) points += 10;
    else if (pointsAllowed <= 6) points += 7;
    else if (pointsAllowed <= 13) points += 4;
    else if (pointsAllowed <= 20) points += 1;
    else if (pointsAllowed <= 27) points += 0;
    else if (pointsAllowed <= 34) points += -1;
    else points += -4;
  }
  
  return Math.round(points * 100) / 100; // Round to 2 decimal places
};

playerSchema.methods.calculateSeasonFantasyPoints = function(scoringType = 'ppr') {
  return this.calculateFantasyPoints(this.stats, scoringType);
};

playerSchema.methods.getWeeklyFantasyPoints = function(week, scoringType = 'ppr') {
  const weeklyStats = this.weeklyStats.find(w => w.week === week);
  if (!weeklyStats) return 0;
  
  return this.calculateFantasyPoints(weeklyStats.stats, scoringType);
};

playerSchema.methods.updateWeeklyStats = function(week, stats, opponent, isHome = true, gameDate) {
  // Remove existing stats for this week
  this.weeklyStats = this.weeklyStats.filter(w => w.week !== week);
  
  // Calculate fantasy points for different scoring types
  const fantasyPoints = {
    standard: this.calculateFantasyPoints(stats, 'standard'),
    ppr: this.calculateFantasyPoints(stats, 'ppr'),
    halfPpr: this.calculateFantasyPoints(stats, 'half-ppr')
  };
  
  // Add new weekly stats
  this.weeklyStats.push({
    week: week,
    opponent: opponent,
    isHome: isHome,
    gameDate: gameDate,
    stats: stats,
    fantasyPoints: fantasyPoints
  });
  
  // Update season totals
  this.updateSeasonStats();
  
  return this.save();
};

playerSchema.methods.updateSeasonStats = function() {
  // Reset season stats
  const seasonStats = {
    games: { played: 0, started: 0 },
    passing: { attempts: 0, completions: 0, yards: 0, touchdowns: 0, interceptions: 0 },
    rushing: { attempts: 0, yards: 0, touchdowns: 0, fumbles: 0 },
    receiving: { targets: 0, receptions: 0, yards: 0, touchdowns: 0, fumbles: 0 },
    kicking: { fieldGoalsMade: 0, fieldGoalsAttempted: 0, extraPointsMade: 0, extraPointsAttempted: 0 },
    defense: { tackles: 0, sacks: 0, interceptions: 0, forcedFumbles: 0, fumbleRecoveries: 0, defensiveTouchdowns: 0 }
  };
  
  // Sum up weekly stats
  this.weeklyStats.forEach(week => {
    seasonStats.games.played += 1;
    
    Object.keys(week.stats).forEach(category => {
      if (seasonStats[category]) {
        Object.keys(week.stats[category]).forEach(stat => {
          seasonStats[category][stat] += week.stats[category][stat] || 0;
        });
      }
    });
  });
  
  this.stats = { ...this.stats, ...seasonStats };
};

playerSchema.methods.addNews = function(headline, content, source, impact = 'LOW') {
  this.news.unshift({
    headline: headline,
    content: content,
    source: source,
    impact: impact,
    publishedAt: new Date()
  });
  
  // Keep only last 10 news items
  if (this.news.length > 10) {
    this.news = this.news.slice(0, 10);
  }
  
  return this.save();
};

// Static methods
playerSchema.statics.searchPlayers = function(query, position = null, team = null, limit = 50) {
  const searchQuery = { $text: { $search: query } };
  
  if (position) searchQuery.position = position;
  if (team) searchQuery.team = team;
  
  return this.find(searchQuery)
    .limit(limit)
    .sort({ 'rankings.overall': 1 });
};

playerSchema.statics.getTopPlayers = function(position = null, limit = 100) {
  const query = position ? { position: position } : {};
  
  return this.find(query)
    .sort({ 'rankings.overall': 1 })
    .limit(limit);
};

playerSchema.statics.getAvailablePlayers = function(draftedPlayerIds = [], position = null) {
  const query = { 
    _id: { $nin: draftedPlayerIds },
    status: 'ACTIVE'
  };
  
  if (position) query.position = position;
  
  return this.find(query)
    .sort({ 'rankings.overall': 1 });
};

playerSchema.statics.updateRankings = function(rankings) {
  const bulkOps = rankings.map(ranking => ({
    updateOne: {
      filter: { externalId: ranking.externalId },
      update: {
        $set: {
          'rankings.overall': ranking.overall,
          'rankings.position': ranking.position,
          'rankings.adp': ranking.adp,
          'rankings.tier': ranking.tier,
          'rankings.lastUpdated': new Date()
        }
      }
    }
  }));
  
  return this.bulkWrite(bulkOps);
};

module.exports = mongoose.model('Player', playerSchema);