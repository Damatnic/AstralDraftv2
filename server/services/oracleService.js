/**
 * Oracle AI Service
 * Integrates with Gemini AI and OpenAI for fantasy football predictions and analysis
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const OpenAI = require('openai');
const Player = require('../models/Player');
const Team = require('../models/Team');
const League = require('../models/League');
const dbManager = require('../config/database');

class OracleService {
  constructor() {
    // Initialize Gemini AI
    if (process.env.GEMINI_API_KEY) {
      this.gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      this.geminiModel = this.gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });
      console.log('✅ Gemini AI initialized');
    } else {
      console.warn('⚠️ Gemini API key not found. AI features will be limited.');
    }

    // Initialize OpenAI
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
      console.log('✅ OpenAI initialized');
    } else {
      console.warn('⚠️ OpenAI API key not found. Advanced AI features will be disabled.');
    }

    // Rate limiting
    this.lastRequest = 0;
    this.minInterval = 1000; // 1 second between requests
    this.requestCount = 0;
    this.dailyLimit = 1000; // Daily request limit
    this.lastResetDate = new Date().toDateString();
  }

  /**
   * Rate limiting helper
   */
  async rateLimit() {
    const now = Date.now();
    const today = new Date().toDateString();
    
    // Reset daily counter
    if (today !== this.lastResetDate) {
      this.requestCount = 0;
      this.lastResetDate = today;
    }
    
    // Check daily limit
    if (this.requestCount >= this.dailyLimit) {
      throw new Error('Daily AI request limit exceeded');
    }
    
    // Check rate limit
    const timeSinceLastRequest = now - this.lastRequest;
    if (timeSinceLastRequest < this.minInterval) {
      const waitTime = this.minInterval - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequest = Date.now();
    this.requestCount++;
  }

  /**
   * Generate player analysis using AI
   */
  async analyzePlayer(playerId, analysisType = 'performance') {
    try {
      await this.rateLimit();

      const cacheKey = `oracle:player:${playerId}:${analysisType}`;
      
      // Try cache first (cache for 1 hour)
      const cached = await dbManager.cacheGet(cacheKey);
      if (cached) {
        return { ...cached, cached: true };
      }

      // Get player data
      const player = await Player.findById(playerId);
      if (!player) {
        throw new Error('Player not found');
      }

      let analysis;
      
      switch (analysisType) {
        case 'performance':
          analysis = await this.generatePerformanceAnalysis(player);
          break;
        case 'injury':
          analysis = await this.generateInjuryAnalysis(player);
          break;
        case 'matchup':
          analysis = await this.generateMatchupAnalysis(player);
          break;
        case 'season':
          analysis = await this.generateSeasonOutlook(player);
          break;
        default:
          analysis = await this.generateGeneralAnalysis(player);
      }

      // Cache result
      await dbManager.cacheSet(cacheKey, analysis, 3600);

      return analysis;

    } catch (error) {
      console.error('Player analysis error:', error);
      return {
        success: false,
        error: error.message,
        fallback: this.generateFallbackAnalysis(analysisType)
      };
    }
  }

  /**
   * Generate performance analysis
   */
  async generatePerformanceAnalysis(player) {
    const prompt = `
Analyze the fantasy football performance of ${player.name}, a ${player.position} for the ${player.team}.

Player Stats:
- Position: ${player.position}
- Team: ${player.team}
- Games Played: ${player.stats.games.played}
- Season Fantasy Points (PPR): ${player.calculateSeasonFantasyPoints('ppr')}
- Injury Status: ${player.injuryStatus.designation}
- Rankings: Overall #${player.rankings.overall}, Position #${player.rankings.position}

Recent Performance:
${this.formatWeeklyStats(player.weeklyStats.slice(-5))}

Provide a detailed analysis covering:
1. Current performance trends
2. Strengths and weaknesses
3. Fantasy outlook for next 3 weeks
4. Key factors affecting performance
5. Confidence level (1-10) for continued production

Keep the analysis under 300 words and focus on actionable fantasy insights.
    `;

    if (this.geminiModel) {
      const result = await this.geminiModel.generateContent(prompt);
      const response = await result.response;
      
      return {
        success: true,
        type: 'performance',
        analysis: response.text(),
        confidence: this.extractConfidence(response.text()),
        generatedAt: new Date(),
        source: 'Gemini AI'
      };
    }

    return this.generateFallbackAnalysis('performance', player);
  }

  /**
   * Generate injury analysis
   */
  async generateInjuryAnalysis(player) {
    const prompt = `
Analyze the injury situation and health outlook for ${player.name} (${player.position} - ${player.team}).

Current Status:
- Injury Designation: ${player.injuryStatus.designation}
- Description: ${player.injuryStatus.description || 'No specific injury reported'}
- Age: ${player.demographics.age || 'Unknown'}
- Games Played This Season: ${player.stats.games.played}

Provide analysis on:
1. Injury severity and expected recovery time
2. Historical injury patterns for this position
3. Impact on fantasy value
4. Risk assessment for upcoming games
5. Recommended fantasy action (start/sit/trade)

Focus on practical fantasy implications in under 250 words.
    `;

    if (this.geminiModel) {
      const result = await this.geminiModel.generateContent(prompt);
      const response = await result.response;
      
      return {
        success: true,
        type: 'injury',
        analysis: response.text(),
        riskLevel: this.extractRiskLevel(response.text()),
        generatedAt: new Date(),
        source: 'Gemini AI'
      };
    }

    return this.generateFallbackAnalysis('injury', player);
  }

  /**
   * Generate matchup analysis
   */
  async generateMatchupAnalysis(player, opponent = null) {
    const upcomingGame = player.weeklyStats.find(w => w.week === this.getCurrentWeek() + 1);
    const opponentTeam = opponent || upcomingGame?.opponent || 'Unknown';

    const prompt = `
Analyze the upcoming matchup for ${player.name} (${player.position} - ${player.team}) against ${opponentTeam}.

Player Context:
- Position: ${player.position}
- Recent Performance: ${player.calculateSeasonFantasyPoints('ppr')} fantasy points this season
- Injury Status: ${player.injuryStatus.designation}

Matchup Analysis Needed:
1. Opponent defensive strength against ${player.position}
2. Historical performance in similar matchups
3. Game script predictions (pace, scoring environment)
4. Weather/venue factors if relevant
5. Projected fantasy points range

Provide actionable start/sit recommendation with confidence level.
Keep analysis under 200 words.
    `;

    if (this.geminiModel) {
      const result = await this.geminiModel.generateContent(prompt);
      const response = await result.response;
      
      return {
        success: true,
        type: 'matchup',
        analysis: response.text(),
        opponent: opponentTeam,
        recommendation: this.extractRecommendation(response.text()),
        projectedPoints: this.extractProjectedPoints(response.text()),
        generatedAt: new Date(),
        source: 'Gemini AI'
      };
    }

    return this.generateFallbackAnalysis('matchup', player);
  }

  /**
   * Generate season outlook
   */
  async generateSeasonOutlook(player) {
    const prompt = `
Provide a rest-of-season outlook for ${player.name} (${player.position} - ${player.team}).

Season Context:
- Current Week: ${this.getCurrentWeek()}
- Season Stats: ${JSON.stringify(player.stats, null, 2)}
- Team Record: Check team performance
- Remaining Schedule: Consider strength of schedule

Analysis Points:
1. Rest of season projection
2. Playoff schedule strength
3. Key factors for success/failure
4. Trade value assessment
5. Dynasty/keeper league considerations

Provide both optimistic and pessimistic scenarios.
Limit to 350 words with clear actionable insights.
    `;

    if (this.geminiModel) {
      const result = await this.geminiModel.generateContent(prompt);
      const response = await result.response;
      
      return {
        success: true,
        type: 'season',
        analysis: response.text(),
        outlook: this.extractOutlook(response.text()),
        tradeValue: this.extractTradeValue(response.text()),
        generatedAt: new Date(),
        source: 'Gemini AI'
      };
    }

    return this.generateFallbackAnalysis('season', player);
  }

  /**
   * Analyze trade proposal
   */
  async analyzeTrade(tradeId) {
    try {
      await this.rateLimit();

      const cacheKey = `oracle:trade:${tradeId}`;
      
      // Try cache first
      const cached = await dbManager.cacheGet(cacheKey);
      if (cached) {
        return { ...cached, cached: true };
      }

      const Trade = require('../models/Trade');
      const trade = await Trade.findById(tradeId)
        .populate('tradeItems.offering.players.playerId')
        .populate('tradeItems.requesting.players.playerId');

      if (!trade) {
        throw new Error('Trade not found');
      }

      const prompt = `
Analyze this fantasy football trade proposal:

TEAM A RECEIVES:
${this.formatTradeItems(trade.tradeItems.requesting)}

TEAM B RECEIVES:
${this.formatTradeItems(trade.tradeItems.offering)}

Provide analysis on:
1. Fair value assessment (1-10 scale for each side)
2. Winner of the trade and why
3. Position needs addressed
4. Risk factors for each side
5. Overall trade grade (A+ to F)

Consider current performance, injury status, schedule, and rest-of-season outlook.
Keep analysis under 400 words with clear verdict.
      `;

      if (this.geminiModel) {
        const result = await this.geminiModel.generateContent(prompt);
        const response = await result.response;
        
        const analysis = {
          success: true,
          type: 'trade',
          analysis: response.text(),
          fairnessScore: this.extractFairnessScore(response.text()),
          winner: this.extractTradeWinner(response.text()),
          grade: this.extractTradeGrade(response.text()),
          generatedAt: new Date(),
          source: 'Gemini AI'
        };

        // Cache for 30 minutes
        await dbManager.cacheSet(cacheKey, analysis, 1800);
        return analysis;
      }

      return this.generateFallbackTradeAnalysis(trade);

    } catch (error) {
      console.error('Trade analysis error:', error);
      return {
        success: false,
        error: error.message,
        fallback: 'Unable to analyze trade at this time'
      };
    }
  }

  /**
   * Generate lineup optimization
   */
  async optimizeLineup(teamId, week = null) {
    try {
      await this.rateLimit();

      const currentWeek = week || this.getCurrentWeek();
      const cacheKey = `oracle:lineup:${teamId}:${currentWeek}`;
      
      // Try cache first
      const cached = await dbManager.cacheGet(cacheKey);
      if (cached) {
        return { ...cached, cached: true };
      }

      const team = await Team.findById(teamId)
        .populate('roster.player')
        .populate('leagueId');

      if (!team) {
        throw new Error('Team not found');
      }

      const availablePlayers = team.roster.filter(spot => 
        spot.player.status === 'ACTIVE' && 
        spot.player.injuryStatus.designation !== 'OUT'
      );

      const prompt = `
Optimize the starting lineup for week ${currentWeek} in a ${team.leagueId.settings.scoringType} league.

Available Players:
${this.formatRosterForOptimization(availablePlayers)}

League Settings:
- Scoring: ${team.leagueId.settings.scoringType}
- Roster: ${JSON.stringify(team.leagueId.settings.rosterSettings)}

Provide:
1. Optimal starting lineup with reasoning
2. Key start/sit decisions
3. Projected total points
4. Confidence level for each starter
5. Sleeper/bust alerts

Focus on maximizing points while considering matchups and injury risk.
      `;

      if (this.geminiModel) {
        const result = await this.geminiModel.generateContent(prompt);
        const response = await result.response;
        
        const optimization = {
          success: true,
          type: 'lineup',
          analysis: response.text(),
          projectedPoints: this.extractProjectedPoints(response.text()),
          confidence: this.extractConfidence(response.text()),
          week: currentWeek,
          generatedAt: new Date(),
          source: 'Gemini AI'
        };

        // Cache for 2 hours
        await dbManager.cacheSet(cacheKey, optimization, 7200);
        return optimization;
      }

      return this.generateFallbackLineupOptimization(team, currentWeek);

    } catch (error) {
      console.error('Lineup optimization error:', error);
      return {
        success: false,
        error: error.message,
        fallback: 'Unable to optimize lineup at this time'
      };
    }
  }

  /**
   * Generate waiver wire recommendations
   */
  async generateWaiverRecommendations(leagueId, limit = 10) {
    try {
      await this.rateLimit();

      const cacheKey = `oracle:waivers:${leagueId}:${limit}`;
      
      // Try cache first
      const cached = await dbManager.cacheGet(cacheKey);
      if (cached) {
        return { ...cached, cached: true };
      }

      // Get available players
      const teams = await Team.find({ leagueId: leagueId }).select('roster.player');
      const draftedPlayerIds = teams.reduce((acc, team) => {
        team.roster.forEach(spot => acc.push(spot.player));
        return acc;
      }, []);

      const availablePlayers = await Player.find({
        _id: { $nin: draftedPlayerIds },
        status: 'ACTIVE'
      })
        .sort({ 'rankings.overall': 1 })
        .limit(50);

      const prompt = `
Identify the top waiver wire pickups for week ${this.getCurrentWeek()}.

Available Players (top 50 by ranking):
${this.formatPlayersForWaivers(availablePlayers.slice(0, 20))}

Provide:
1. Top ${limit} waiver targets with priority ranking
2. Reasoning for each pickup
3. Percentage of FAAB budget to spend
4. Short-term vs long-term value
5. Position-specific needs

Focus on players with immediate impact potential and favorable upcoming schedules.
      `;

      if (this.geminiModel) {
        const result = await this.geminiModel.generateContent(prompt);
        const response = await result.response;
        
        const recommendations = {
          success: true,
          type: 'waivers',
          analysis: response.text(),
          week: this.getCurrentWeek(),
          topTargets: this.extractWaiverTargets(response.text()),
          generatedAt: new Date(),
          source: 'Gemini AI'
        };

        // Cache for 4 hours
        await dbManager.cacheSet(cacheKey, recommendations, 14400);
        return recommendations;
      }

      return this.generateFallbackWaiverRecommendations(availablePlayers, limit);

    } catch (error) {
      console.error('Waiver recommendations error:', error);
      return {
        success: false,
        error: error.message,
        fallback: 'Unable to generate waiver recommendations at this time'
      };
    }
  }

  // Helper methods for formatting data
  formatWeeklyStats(weeklyStats) {
    return weeklyStats.map(week => 
      `Week ${week.week} vs ${week.opponent}: ${week.fantasyPoints?.ppr || 0} pts`
    ).join('\n');
  }

  formatTradeItems(items) {
    const players = items.players.map(p => 
      `${p.playerName} (${p.position} - ${p.team})`
    ).join(', ');
    
    const picks = items.draftPicks.map(p => 
      `${p.year} Round ${p.round} pick`
    ).join(', ');
    
    const faab = items.faabMoney > 0 ? `$${items.faabMoney} FAAB` : '';
    
    return [players, picks, faab].filter(Boolean).join(', ') || 'Nothing';
  }

  formatRosterForOptimization(roster) {
    return roster.map(spot => {
      const player = spot.player;
      return `${player.name} (${player.position} - ${player.team}) - ${player.injuryStatus.designation}`;
    }).join('\n');
  }

  formatPlayersForWaivers(players) {
    return players.map(player => 
      `${player.name} (${player.position} - ${player.team}) - Rank: ${player.rankings.overall || 'Unranked'}`
    ).join('\n');
  }

  // Helper methods for extracting data from AI responses
  extractConfidence(text) {
    const match = text.match(/confidence[:\s]+(\d+)/i);
    return match ? parseInt(match[1]) : 5;
  }

  extractRiskLevel(text) {
    if (text.toLowerCase().includes('high risk')) return 'HIGH';
    if (text.toLowerCase().includes('medium risk')) return 'MEDIUM';
    if (text.toLowerCase().includes('low risk')) return 'LOW';
    return 'MEDIUM';
  }

  extractRecommendation(text) {
    if (text.toLowerCase().includes('start')) return 'START';
    if (text.toLowerCase().includes('sit')) return 'SIT';
    return 'FLEX';
  }

  extractProjectedPoints(text) {
    const match = text.match(/(\d+\.?\d*)\s*points?/i);
    return match ? parseFloat(match[1]) : null;
  }

  extractOutlook(text) {
    if (text.toLowerCase().includes('positive') || text.toLowerCase().includes('optimistic')) return 'POSITIVE';
    if (text.toLowerCase().includes('negative') || text.toLowerCase().includes('pessimistic')) return 'NEGATIVE';
    return 'NEUTRAL';
  }

  extractTradeValue(text) {
    if (text.toLowerCase().includes('buy')) return 'BUY';
    if (text.toLowerCase().includes('sell')) return 'SELL';
    return 'HOLD';
  }

  extractFairnessScore(text) {
    const match = text.match(/(\d+)\/10|(\d+)\s*out\s*of\s*10/i);
    return match ? parseInt(match[1] || match[2]) : 5;
  }

  extractTradeWinner(text) {
    if (text.toLowerCase().includes('team a')) return 'TEAM_A';
    if (text.toLowerCase().includes('team b')) return 'TEAM_B';
    return 'EVEN';
  }

  extractTradeGrade(text) {
    const match = text.match(/grade[:\s]+([A-F][+-]?)/i);
    return match ? match[1] : 'C';
  }

  extractWaiverTargets(text) {
    // This would parse the AI response to extract structured waiver targets
    // For now, return empty array
    return [];
  }

  // Fallback methods when AI is unavailable
  generateFallbackAnalysis(type, player = null) {
    const fallbacks = {
      performance: `${player?.name || 'This player'} has shown consistent production this season. Monitor injury status and upcoming matchups for optimal fantasy value.`,
      injury: `Current injury status should be monitored closely. Consider handcuff options and check practice reports throughout the week.`,
      matchup: `Matchup analysis suggests moderate fantasy potential. Consider game script and weather conditions when making start/sit decisions.`,
      season: `Rest of season outlook remains positive with some volatility expected. Monitor target share and red zone opportunities.`
    };

    return {
      success: true,
      type: type,
      analysis: fallbacks[type] || 'Analysis unavailable at this time.',
      confidence: 5,
      generatedAt: new Date(),
      source: 'Fallback Analysis'
    };
  }

  generateFallbackTradeAnalysis(trade) {
    return {
      success: true,
      type: 'trade',
      analysis: 'Trade appears relatively balanced based on player rankings. Consider team needs and injury risks when evaluating.',
      fairnessScore: 5,
      winner: 'EVEN',
      grade: 'C',
      generatedAt: new Date(),
      source: 'Fallback Analysis'
    };
  }

  generateFallbackLineupOptimization(team, week) {
    return {
      success: true,
      type: 'lineup',
      analysis: 'Start your highest-ranked healthy players. Check injury reports and weather conditions before finalizing lineup.',
      projectedPoints: 100,
      confidence: 5,
      week: week,
      generatedAt: new Date(),
      source: 'Fallback Analysis'
    };
  }

  generateFallbackWaiverRecommendations(players, limit) {
    const topPlayers = players.slice(0, limit);
    return {
      success: true,
      type: 'waivers',
      analysis: `Consider targeting ${topPlayers.map(p => p.name).join(', ')} based on current rankings and availability.`,
      week: this.getCurrentWeek(),
      topTargets: topPlayers.map(p => ({ name: p.name, priority: 'MEDIUM' })),
      generatedAt: new Date(),
      source: 'Fallback Analysis'
    };
  }

  getCurrentWeek() {
    // This would get the current NFL week
    const now = new Date();
    const seasonStart = new Date(now.getFullYear(), 8, 1); // September 1st
    const weeksSinceStart = Math.floor((now - seasonStart) / (7 * 24 * 60 * 60 * 1000));
    return Math.min(Math.max(weeksSinceStart + 1, 1), 18);
  }

  // Health check
  async healthCheck() {
    const status = {
      gemini: this.geminiModel ? 'available' : 'disabled',
      openai: this.openai ? 'available' : 'disabled',
      requestCount: this.requestCount,
      dailyLimit: this.dailyLimit,
      lastRequest: new Date(this.lastRequest).toISOString()
    };

    try {
      if (this.geminiModel) {
        // Test Gemini connection
        await this.geminiModel.generateContent('Test connection');
        status.gemini = 'healthy';
      }
    } catch (error) {
      status.gemini = 'error';
      status.geminiError = error.message;
    }

    return status;
  }
}

// Create singleton instance
const oracleService = new OracleService();

module.exports = oracleService;
