/**
 * Database Seeding Script
 * Seeds the database with initial NFL player data and test users
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Player = require('../models/Player');
const League = require('../models/League');
const Team = require('../models/Team');

// Import services
const dbManager = require('../config/database');
const sportsDataService = require('../services/sportsDataService');

// Import existing player data
const { nflPlayers2025 } = require('../../data/nfl-players-2025-fixed');

class DatabaseSeeder {
  constructor() {
    this.stats = {
      users: { created: 0, updated: 0 },
      players: { created: 0, updated: 0 },
      leagues: { created: 0, updated: 0 },
      teams: { created: 0, updated: 0 }
    };
  }

  async run() {
    try {
      console.log('🌱 Starting database seeding...');
      
      // Connect to database
      await dbManager.connect();
      
      // Clear existing data in development
      if (process.env.NODE_ENV === 'development') {
        await this.clearDatabase();
      }
      
      // Seed data
      await this.seedUsers();
      await this.seedPlayers();
      await this.seedTestLeague();
      
      // Print summary
      this.printSummary();
      
      console.log('✅ Database seeding completed successfully!');
      
    } catch (error) {
      console.error('❌ Database seeding failed:', error);
      throw error;
    } finally {
      await dbManager.disconnect();
    }
  }

  async clearDatabase() {
    console.log('🧹 Clearing existing data...');
    
    await Team.deleteMany({});
    await League.deleteMany({});
    await Player.deleteMany({});
    await User.deleteMany({});
    
    console.log('✅ Database cleared');
  }

  async seedUsers() {
    console.log('👥 Seeding test users...');
    
    const testUsers = [
      {
        username: 'player1',
        email: 'player1@astral.com',
        password: 'test1234',
        displayName: 'Alex Rodriguez',
        avatar: '🏈',
        emailVerified: true,
        status: 'ACTIVE'
      },
      {
        username: 'player2',
        email: 'player2@astral.com',
        password: 'test1234',
        displayName: 'Sarah Johnson',
        avatar: '⚡',
        emailVerified: true,
        status: 'ACTIVE'
      },
      {
        username: 'player3',
        email: 'player3@astral.com',
        password: 'test1234',
        displayName: 'Mike Chen',
        avatar: '🔥',
        emailVerified: true,
        status: 'ACTIVE'
      },
      {
        username: 'player4',
        email: 'player4@astral.com',
        password: 'test1234',
        displayName: 'Emily Davis',
        avatar: '💎',
        emailVerified: true,
        status: 'ACTIVE'
      },
      {
        username: 'player5',
        email: 'player5@astral.com',
        password: 'test1234',
        displayName: 'James Wilson',
        avatar: '🎯',
        emailVerified: true,
        status: 'ACTIVE'
      },
      {
        username: 'player6',
        email: 'player6@astral.com',
        password: 'test1234',
        displayName: 'Lisa Thompson',
        avatar: '🛡️',
        emailVerified: true,
        status: 'ACTIVE'
      },
      {
        username: 'player7',
        email: 'player7@astral.com',
        password: 'test1234',
        displayName: 'David Brown',
        avatar: '👑',
        emailVerified: true,
        status: 'ACTIVE'
      },
      {
        username: 'player8',
        email: 'player8@astral.com',
        password: 'test1234',
        displayName: 'Jessica Garcia',
        avatar: '🧠',
        emailVerified: true,
        status: 'ACTIVE'
      },
      {
        username: 'player9',
        email: 'player9@astral.com',
        password: 'test1234',
        displayName: 'Ryan Martinez',
        avatar: '💰',
        emailVerified: true,
        status: 'ACTIVE'
      },
      {
        username: 'player10',
        email: 'player10@astral.com',
        password: 'test1234',
        displayName: 'Amanda Lee',
        avatar: '🌟',
        emailVerified: true,
        status: 'ACTIVE'
      },
      {
        username: 'admin',
        email: 'admin@astral.com',
        password: process.env.ADMIN_DEFAULT_PASSWORD || 'changeme-admin-password',
        displayName: 'Admin User',
        avatar: '⚙️',
        emailVerified: true,
        status: 'ACTIVE',
        role: 'ADMIN'
      }
    ];

    const bcrypt = require('bcryptjs');
    const bulkOps = [];

    for (const userData of testUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      bulkOps.push({
        updateOne: {
          filter: { email: userData.email },
          update: {
            $set: {
              ...userData,
              password: hashedPassword,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          },
          upsert: true
        }
      });
    }

    const result = await User.bulkWrite(bulkOps);
    this.stats.users.created = result.upsertedCount;
    this.stats.users.updated = result.modifiedCount;

    console.log(`✅ Created ${this.stats.users.created} users, updated ${this.stats.users.updated}`);
  }

  async seedPlayers() {
    console.log('🏈 Seeding NFL players...');
    
    // Try to sync from API first
    try {
      if (process.env.SPORTSDATA_API_KEY) {
        console.log('📡 Syncing players from SportsData API...');
        const result = await sportsDataService.syncPlayers();
        this.stats.players.created = result.created;
        this.stats.players.updated = result.updated;
        console.log(`✅ API sync completed: ${result.created} created, ${result.updated} updated`);
        return;
      }
    } catch (error) {
      console.warn('⚠️ API sync failed, falling back to local data:', error.message);
    }

    // Fallback to local player data
    console.log('📁 Using local player data...');
    
    const bulkOps = [];
    const season = new Date().getFullYear();

    for (const player of nflPlayers2025) {
      const playerData = {
        externalId: player.id || `local_${player.name.replace(/\s+/g, '_')}`,
        name: player.name,
        firstName: player.name.split(' ')[0] || '',
        lastName: player.name.split(' ').slice(1).join(' ') || '',
        position: player.position,
        team: player.team,
        jerseyNumber: player.jerseyNumber || null,
        status: 'ACTIVE',
        injuryStatus: {
          designation: 'HEALTHY',
          description: '',
          updatedAt: new Date()
        },
        demographics: {
          age: player.age || null,
          height: player.height || null,
          weight: player.weight || null,
          college: player.college || null,
          experience: player.experience || 0
        },
        stats: {
          season: season,
          games: { played: 0, started: 0 },
          passing: { attempts: 0, completions: 0, yards: 0, touchdowns: 0, interceptions: 0 },
          rushing: { attempts: 0, yards: 0, touchdowns: 0, fumbles: 0 },
          receiving: { targets: 0, receptions: 0, yards: 0, touchdowns: 0, fumbles: 0 },
          kicking: { fieldGoalsMade: 0, fieldGoalsAttempted: 0, extraPointsMade: 0, extraPointsAttempted: 0 },
          defense: { tackles: 0, sacks: 0, interceptions: 0, forcedFumbles: 0, fumbleRecoveries: 0, defensiveTouchdowns: 0 }
        },
        rankings: {
          overall: player.adp || null,
          position: null,
          adp: player.adp || null,
          tier: player.tier || null,
          lastUpdated: new Date()
        },
        projections: {
          season: {
            games: 17,
            fantasyPoints: {
              standard: player.projectedPoints?.standard || 0,
              ppr: player.projectedPoints?.ppr || 0,
              halfPpr: player.projectedPoints?.halfPpr || 0
            }
          }
        },
        byeWeek: player.byeWeek || null,
        isRookie: (player.experience || 0) === 0,
        lastUpdated: new Date()
      };

      bulkOps.push({
        updateOne: {
          filter: { externalId: playerData.externalId },
          update: { $set: playerData },
          upsert: true
        }
      });

      // Process in batches
      if (bulkOps.length >= 100) {
        const result = await Player.bulkWrite(bulkOps);
        this.stats.players.created += result.upsertedCount;
        this.stats.players.updated += result.modifiedCount;
        bulkOps.length = 0;
        
        console.log(`📈 Processed ${this.stats.players.created + this.stats.players.updated} players...`);
      }
    }

    // Process remaining players
    if (bulkOps.length > 0) {
      const result = await Player.bulkWrite(bulkOps);
      this.stats.players.created += result.upsertedCount;
      this.stats.players.updated += result.modifiedCount;
    }

    // Update rankings
    await this.updatePlayerRankings();

    console.log(`✅ Seeded ${this.stats.players.created} players, updated ${this.stats.players.updated}`);
  }

  async updatePlayerRankings() {
    console.log('📊 Updating player rankings...');
    
    const positions = ['QB', 'RB', 'WR', 'TE', 'K', 'DST'];
    
    for (const position of positions) {
      const players = await Player.find({ position: position, status: 'ACTIVE' })
        .sort({ 'rankings.adp': 1, 'projections.season.fantasyPoints.ppr': -1 });
      
      const bulkOps = [];
      
      players.forEach((player, index) => {
        bulkOps.push({
          updateOne: {
            filter: { _id: player._id },
            update: {
              $set: {
                'rankings.position': index + 1,
                'rankings.lastUpdated': new Date()
              }
            }
          }
        });
      });
      
      if (bulkOps.length > 0) {
        await Player.bulkWrite(bulkOps);
      }
    }
    
    console.log('✅ Player rankings updated');
  }

  async seedTestLeague() {
    console.log('🏆 Creating test league...');
    
    // Get test users
    const users = await User.find({ email: { $regex: /player\d+@astral\.com/ } }).limit(10);
    
    if (users.length < 4) {
      console.warn('⚠️ Not enough test users found, skipping test league creation');
      return;
    }

    // Create test league
    const inviteCode = await League.generateInviteCode();
    
    const league = new League({
      name: 'Astral Test League 2025',
      description: 'Test league for development and demo purposes',
      commissionerId: users[0]._id,
      inviteCode: inviteCode,
      status: 'DRAFT',
      season: new Date().getFullYear(),
      isPublic: true,
      settings: {
        maxTeams: 10,
        scoringType: 'ppr',
        draftType: 'snake',
        playoffTeams: 4,
        regularSeasonWeeks: 14,
        rosterSettings: {
          qb: 1, rb: 2, wr: 2, te: 1, flex: 1, dst: 1, k: 1, bench: 6, ir: 1
        },
        waiverSettings: {
          type: 'rolling',
          budget: 100,
          minBid: 1,
          waiverPeriod: 2,
          processDay: 'wednesday'
        },
        scoringSettings: {
          passingYards: 0.04,
          passingTouchdowns: 4,
          passingInterceptions: -2,
          rushingYards: 0.1,
          rushingTouchdowns: 6,
          receivingYards: 0.1,
          receivingTouchdowns: 6,
          receptions: 1,
          fumbles: -2,
          twoPointConversions: 2
        }
      }
    });

    await league.save();
    this.stats.leagues.created = 1;

    // Create teams for users
    const teamNames = [
      'The Commissioners', 'Lightning Bolts', 'Fire Dragons', 'Diamond Dynasty',
      'Target Acquired', 'Shield Wall', 'Royal Flush', 'Brain Trust',
      'Money Makers', 'Shooting Stars'
    ];

    for (let i = 0; i < users.length; i++) {
      const team = new Team({
        name: teamNames[i] || `${users[i].displayName}'s Team`,
        abbreviation: teamNames[i] ? teamNames[i].substring(0, 4).toUpperCase() : users[i].displayName.substring(0, 4).toUpperCase(),
        owner: users[i]._id,
        leagueId: league._id,
        draftPosition: i + 1,
        waiverPriority: i + 1
      });

      await team.save();
      this.stats.teams.created++;
    }

    console.log(`✅ Created test league "${league.name}" with ${this.stats.teams.created} teams`);
    console.log(`🔗 Invite code: ${inviteCode}`);
  }

  printSummary() {
    console.log('\n📊 Seeding Summary:');
    console.log('==================');
    console.log(`👥 Users: ${this.stats.users.created} created, ${this.stats.users.updated} updated`);
    console.log(`🏈 Players: ${this.stats.players.created} created, ${this.stats.players.updated} updated`);
    console.log(`🏆 Leagues: ${this.stats.leagues.created} created, ${this.stats.leagues.updated} updated`);
    console.log(`⚡ Teams: ${this.stats.teams.created} created, ${this.stats.teams.updated} updated`);
    console.log('==================\n');
  }
}

// Run seeding if called directly
if (require.main === module) {
  const seeder = new DatabaseSeeder();
  seeder.run()
    .then(() => {
      console.log('🎉 Seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = DatabaseSeeder;