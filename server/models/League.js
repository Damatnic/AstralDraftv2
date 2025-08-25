/**
 * League Model
 * MongoDB schema for fantasy football leagues
 */

const mongoose = require('mongoose');

const leagueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500,
    default: ''
  },
  commissionerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  inviteCode: {
    type: String,
    unique: true,
    required: true,
    uppercase: true,
    length: 8
  },
  status: {
    type: String,
    enum: ['DRAFT', 'ACTIVE', 'COMPLETED', 'ARCHIVED'],
    default: 'DRAFT'
  },
  season: {
    type: Number,
    required: true,
    default: () => new Date().getFullYear()
  },
  settings: {
    maxTeams: {
      type: Number,
      required: true,
      min: 4,
      max: 20,
      default: 10
    },
    scoringType: {
      type: String,
      enum: ['standard', 'ppr', 'half-ppr', 'superflex'],
      default: 'ppr'
    },
    draftType: {
      type: String,
      enum: ['snake', 'auction', 'linear'],
      default: 'snake'
    },
    draftDate: {
      type: Date,
      default: null
    },
    draftOrderType: {
      type: String,
      enum: ['random', 'manual', 'reverse_standings'],
      default: 'random'
    },
    playoffTeams: {
      type: Number,
      min: 2,
      max: 8,
      default: 4
    },
    playoffWeeks: {
      type: Number,
      min: 1,
      max: 4,
      default: 3
    },
    regularSeasonWeeks: {
      type: Number,
      min: 10,
      max: 17,
      default: 14
    },
    rosterSettings: {
      qb: { type: Number, default: 1 },
      rb: { type: Number, default: 2 },
      wr: { type: Number, default: 2 },
      te: { type: Number, default: 1 },
      flex: { type: Number, default: 1 },
      dst: { type: Number, default: 1 },
      k: { type: Number, default: 1 },
      bench: { type: Number, default: 6 },
      ir: { type: Number, default: 1 }
    },
    waiverSettings: {
      type: {
        type: String,
        enum: ['rolling', 'faab', 'reverse_standings'],
        default: 'rolling'
      },
      budget: { type: Number, default: 100 },
      minBid: { type: Number, default: 1 },
      waiverPeriod: { type: Number, default: 2 }, // days
      processDay: {
        type: String,
        enum: ['tuesday', 'wednesday', 'thursday'],
        default: 'wednesday'
      }
    },
    tradeSettings: {
      deadline: { type: Date, default: null },
      reviewPeriod: { type: Number, default: 2 }, // days
      allowFuturePicks: { type: Boolean, default: true },
      requireApproval: { type: Boolean, default: false }
    },
    scoringSettings: {
      passingYards: { type: Number, default: 0.04 },
      passingTouchdowns: { type: Number, default: 4 },
      passingInterceptions: { type: Number, default: -2 },
      rushingYards: { type: Number, default: 0.1 },
      rushingTouchdowns: { type: Number, default: 6 },
      receivingYards: { type: Number, default: 0.1 },
      receivingTouchdowns: { type: Number, default: 6 },
      receptions: { type: Number, default: 1 }, // PPR
      fumbles: { type: Number, default: -2 },
      twoPointConversions: { type: Number, default: 2 }
    }
  },
  currentWeek: {
    type: Number,
    default: 1,
    min: 1,
    max: 18
  },
  draftSettings: {
    isComplete: { type: Boolean, default: false },
    currentPick: { type: Number, default: 1 },
    currentRound: { type: Number, default: 1 },
    pickTimeLimit: { type: Number, default: 90 }, // seconds
    draftOrder: [{
      teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
      pickNumber: { type: Number }
    }],
    auctionSettings: {
      budget: { type: Number, default: 200 },
      minBid: { type: Number, default: 1 },
      bidIncrement: { type: Number, default: 1 },
      nominationTime: { type: Number, default: 30 },
      biddingTime: { type: Number, default: 15 }
    }
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    default: null
  },
  logo: {
    type: String,
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

// Indexes
leagueSchema.index({ inviteCode: 1 });
leagueSchema.index({ commissionerId: 1 });
leagueSchema.index({ status: 1 });
leagueSchema.index({ season: 1 });
leagueSchema.index({ isPublic: 1 });

// Virtual for team count
leagueSchema.virtual('teamCount', {
  ref: 'Team',
  localField: '_id',
  foreignField: 'leagueId',
  count: true
});

// Pre-save middleware
leagueSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Generate unique invite code
leagueSchema.statics.generateInviteCode = async function() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code;
  let exists = true;
  
  while (exists) {
    code = '';
    for (let i = 0; i < 8; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    const existing = await this.findOne({ inviteCode: code });
    exists = !!existing;
  }
  
  return code;
};

// Instance methods
leagueSchema.methods.isCommissioner = function(userId) {
  return this.commissionerId.toString() === userId.toString();
};

leagueSchema.methods.canJoin = function() {
  return this.status === 'DRAFT' && this.teamCount < this.settings.maxTeams;
};

leagueSchema.methods.isDraftEligible = function() {
  return this.status === 'DRAFT' && this.teamCount >= 4;
};

leagueSchema.methods.getCurrentWeekMatchups = async function() {
  const Matchup = mongoose.model('Matchup');
  return await Matchup.find({
    leagueId: this._id,
    week: this.currentWeek
  }).populate('homeTeam awayTeam');
};

leagueSchema.methods.getStandings = async function() {
  const Team = mongoose.model('Team');
  return await Team.find({ leagueId: this._id })
    .sort({ wins: -1, pointsFor: -1 })
    .populate('owner', 'username displayName avatar');
};

module.exports = mongoose.model('League', leagueSchema);