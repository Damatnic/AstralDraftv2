/**
 * Season Contest Service
 * Manages season-long prediction contests with cumulative scoring and championship brackets
 */

export interface SeasonContest {
}
  id: string;
  name: string;
  description: string;
  season: number;
  status: &apos;UPCOMING&apos; | &apos;ACTIVE&apos; | &apos;COMPLETED&apos;;
  contestType: &apos;WEEKLY_PREDICTIONS&apos; | &apos;PLAYOFF_BRACKET&apos; | &apos;SEASON_AWARDS&apos; | &apos;MILESTONE_PREDICTIONS&apos;;
  startDate: Date;
  endDate: Date;
  entryFee?: number;
  prizePool: number;
  maxParticipants?: number;
  participants: ContestParticipant[];
  rules: ContestRules;
  scoring: ContestScoring;
  leaderboard: ContestLeaderboard;
  weeks?: WeeklyContest[];
  bracket?: PlayoffBracket;
  awards?: AwardsPredictions;
  milestones?: MilestonePredictions;
}

export interface ContestParticipant {
}
  userId: string;
  userName: string;
  avatar: string;
  joinDate: Date;
  totalScore: number;
  weeklyScores: { [week: number]: number };
  currentRank: number;
  badges: ContestBadge[];
  predictions: { [week: number]: WeeklyPrediction };
  bracketPicks?: BracketPick[];
  awardPicks?: AwardPick[];
  milestonePicks?: MilestonePick[];
}

export interface ContestRules {
}
  scoringSystem: &apos;POINTS&apos; | &apos;ACCURACY&apos; | &apos;CONFIDENCE&apos; | &apos;HYBRID&apos;;
  allowLateEntries: boolean;
  requireAllPredictions: boolean;
  tiebreaker: &apos;TOTAL_POINTS&apos; | &apos;WEEKLY_WINS&apos; | &apos;RECENT_PERFORMANCE&apos; | &apos;HEAD_TO_HEAD&apos;;
  bonusCategories: BonusCategory[];
  penalties: PenaltyRule[];
}

export interface ContestScoring {
}
  correctPrediction: number;
  partialCredit: number;
  confidenceMultiplier: boolean;
  streakBonus: StreakBonus;
  categoryWeights: { [category: string]: number };
  weeklyBonuses: WeeklyBonus[];
  playoffMultiplier: number;
  championshipBonus: number;
}

export interface ContestLeaderboard {
}
  rankings: ContestRanking[];
  weeklyWinners: { [week: number]: string };
  streakLeaders: StreakLeader[];
  categoryLeaders: { [category: string]: string };
  recentMovers: RankingChange[];
  projectedFinish: ProjectedFinish[];
}

export interface WeeklyContest {
}
  week: number;
  theme: string;
  predictions: PredictionCategory[];
  bonusQuestions: BonusQuestion[];
  deadline: Date;
  status: &apos;UPCOMING&apos; | &apos;OPEN&apos; | &apos;LOCKED&apos; | &apos;COMPLETED&apos;;
  results?: WeeklyResults;
}

export interface PredictionCategory {
}
  id: string;
  name: string;
  type: &apos;GAME_OUTCOME&apos; | &apos;PLAYER_PERFORMANCE&apos; | &apos;TEAM_STATS&apos; | &apos;PROP_BET&apos;;
  question: string;
  options: PredictionOption[];
  points: number;
  confidenceEnabled: boolean;
  difficulty: &apos;EASY&apos; | &apos;MEDIUM&apos; | &apos;HARD&apos; | &apos;EXPERT&apos;;
}

export interface PredictionOption {
}
  id: string;
  label: string;
  odds?: number;
  description?: string;
}

export interface WeeklyPrediction {
}
  week: number;
  predictions: { [categoryId: string]: PredictionSubmission };
  submittedAt: Date;
  score?: number;
  bonusPoints?: number;
  weeklyRank?: number;
}

export interface PredictionSubmission {
}
  categoryId: string;
  selectedOptionId: string;
  confidence?: number; // 1-5 scale
  reasoning?: string;
  isCorrect?: boolean;
  pointsEarned?: number;
}

export interface PlayoffBracket {
}
  id: string;
  name: string;
  rounds: BracketRound[];
  seedingComplete: boolean;
  currentRound: number;
  status: &apos;SEEDING&apos; | &apos;ROUND_1&apos; | &apos;DIVISIONAL&apos; | &apos;CONFERENCE&apos; | &apos;SUPER_BOWL&apos; | &apos;COMPLETED&apos;;
  scoringRules: BracketScoring;
}

export interface BracketRound {
}
  round: number;
  name: string;
  games: BracketGame[];
  pointValue: number;
  deadline: Date;
  status: &apos;UPCOMING&apos; | &apos;OPEN&apos; | &apos;LOCKED&apos; | &apos;COMPLETED&apos;;
}

export interface BracketGame {
}
  id: string;
  round: number;
  team1: string;
  team2: string;
  seed1?: number;
  seed2?: number;
  winner?: string;
  predicted?: boolean;
  pointValue: number;
}

export interface BracketPick {
}
  gameId: string;
  predictedWinner: string;
  confidence?: number;
  reasoning?: string;
  isCorrect?: boolean;
  pointsEarned?: number;
}

export interface AwardsPredictions {
}
  categories: AwardCategory[];
  deadline: Date;
  status: &apos;OPEN&apos; | &apos;LOCKED&apos; | &apos;COMPLETED&apos;;
  results?: { [categoryId: string]: string };
}

export interface AwardCategory {
}
  id: string;
  name: string;
  description: string;
  nominees: AwardNominee[];
  pointValue: number;
}

export interface AwardNominee {
}
  id: string;
  name: string;
  team: string;
  stats?: { [key: string]: number };
  odds?: number;
}

export interface AwardPick {
}
  categoryId: string;
  nomineeId: string;
  confidence?: number;
  reasoning?: string;
  isCorrect?: boolean;
  pointsEarned?: number;
}

export interface MilestonePredictions {
}
  categories: MilestoneCategory[];
  status: &apos;OPEN&apos; | &apos;LOCKED&apos; | &apos;COMPLETED&apos;;
}

export interface MilestoneCategory {
}
  id: string;
  name: string;
  description: string;
  type: &apos;OVER_UNDER&apos; | &apos;EXACT_NUMBER&apos; | &apos;FIRST_TO_ACHIEVE&apos; | &apos;BINARY&apos;;
  target: number | string;
  pointValue: number;
  deadline: Date;
}

export interface MilestonePick {
}
  categoryId: string;
  prediction: number | string | boolean;
  confidence?: number;
  reasoning?: string;
  isCorrect?: boolean;
  pointsEarned?: number;
}

export interface BonusQuestion {
}
  id: string;
  question: string;
  type: &apos;MULTIPLE_CHOICE&apos; | &apos;NUMERIC&apos; | &apos;TRUE_FALSE&apos;;
  options?: string[];
  correctAnswer?: string | number | boolean;
  pointValue: number;
  difficulty: &apos;EASY&apos; | &apos;MEDIUM&apos; | &apos;HARD&apos;;
}

export interface BonusCategory {
}
  id: string;
  name: string;
  description: string;
  multiplier: number;
  condition: string;
}

export interface PenaltyRule {
}
  id: string;
  name: string;
  description: string;
  penalty: number;
  condition: string;
}

export interface StreakBonus {
}
  minStreak: number;
  bonusPerCorrect: number;
  maxBonus: number;
  resetOnIncorrect: boolean;
}

export interface WeeklyBonus {
}
  week: number;
  name: string;
  description: string;
  bonus: number;
  condition: string;
}

export interface ContestRanking {
}
  rank: number;
  userId: string;
  userName: string;
  totalScore: number;
  weeklyAverage: number;
  accuracy: number;
  streak: number;
  trend: &apos;UP&apos; | &apos;DOWN&apos; | &apos;STABLE&apos;;
  rankChange: number;
  badges: ContestBadge[];
}

export interface StreakLeader {
}
  userId: string;
  userName: string;
  currentStreak: number;
  longestStreak: number;
  streakType: &apos;CORRECT_PREDICTIONS&apos; | &apos;WEEKLY_WINS&apos; | &apos;TOP_10_FINISHES&apos;;
}

export interface RankingChange {
}
  userId: string;
  userName: string;
  previousRank: number;
  currentRank: number;
  change: number;
  reason: string;
}

export interface ProjectedFinish {
}
  userId: string;
  userName: string;
  currentRank: number;
  projectedRank: number;
  probability: number;
  trend: &apos;IMPROVING&apos; | &apos;DECLINING&apos; | &apos;STABLE&apos;;
}

export interface ContestBadge {
}
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: &apos;COMMON&apos; | &apos;RARE&apos; | &apos;EPIC&apos; | &apos;LEGENDARY&apos;;
  earnedDate: Date;
  criteria: string;
}

export interface WeeklyResults {
}
  week: number;
  correctAnswers: { [categoryId: string]: string };
  topPerformers: string[];
  averageScore: number;
  difficultyActual: { [categoryId: string]: number };
  surprises: string[];
  analysis: string;
}

export interface BracketScoring {
}
  wildCardRound: number;
  divisionalRound: number;
  conferenceChampionship: number;
  superBowl: number;
  perfectBracketBonus: number;
  upsetBonus: number;
}

class SeasonContestService {
}
  private readonly contests: Map<string, SeasonContest> = new Map();
  private readonly userParticipation: Map<string, string[]> = new Map(); // userId -> contestIds

  /**
   * Create a new season contest
   */
  createContest(contestData: Omit<SeasonContest, &apos;id&apos; | &apos;participants&apos; | &apos;leaderboard&apos;>): SeasonContest {
}
    const contest: SeasonContest = {
}
      id: this.generateContestId(),
      participants: [],
      leaderboard: {
}
        rankings: [],
        weeklyWinners: {},
        streakLeaders: [],
        categoryLeaders: {},
        recentMovers: [],
        projectedFinish: []
      },
      ...contestData
    };

    this.contests.set(contest.id, contest);
    return contest;
  }

  /**
   * Join a contest
   */
  joinContest(contestId: string, userId: string, userName: string, avatar: string): boolean {
}
    const contest = this.contests.get(contestId);
    if (!contest) return false;

    // Check if contest is full
    if (contest.maxParticipants && contest.participants.length >= contest.maxParticipants) {
}
      return false;
    }

    // Check if user already joined
    if (contest.participants.some((p: any) => p.userId === userId)) {
}
      return false;
    }

    // Add participant
    const participant: ContestParticipant = {
}
      userId,
      userName,
      avatar,
      joinDate: new Date(),
      totalScore: 0,
      weeklyScores: {},
      currentRank: contest.participants.length + 1,
      badges: [],
      predictions: {}
    };

    contest.participants.push(participant);

    // Update user participation tracking
    const userContests = this.userParticipation.get(userId) || [];
    userContests.push(contestId);
    this.userParticipation.set(userId, userContests);

    this.updateLeaderboard(contestId);
    return true;
  }

  /**
   * Submit weekly predictions
   */
  submitWeeklyPredictions(
    contestId: string, 
    userId: string, 
    week: number, 
    predictions: { [categoryId: string]: PredictionSubmission }
  ): boolean {
}
    const contest = this.contests.get(contestId);
    if (!contest) return false;

    const participant = contest.participants.find((p: any) => p.userId === userId);
    if (!participant) return false;

    const weeklyContest = contest.weeks?.find((w: any) => w.week === week);
    if (!weeklyContest || weeklyContest.status !== &apos;OPEN&apos;) return false;

    // Validate predictions
    for (const prediction of Object.values(predictions)) {
}
      const category = weeklyContest.predictions.find((p: any) => p.id === prediction.categoryId);
      if (!category) return false;
      
      const option = category.options.find((o: any) => o.id === prediction.selectedOptionId);
      if (!option) return false;
    }

    // Store predictions
    participant.predictions[week] = {
}
      week,
      predictions,
      submittedAt: new Date()
    };

    return true;
  }

  /**
   * Submit bracket predictions
   */
  submitBracketPredictions(contestId: string, userId: string, picks: BracketPick[]): boolean {
}
    const contest = this.contests.get(contestId);
    if (!contest?.bracket) return false;

    const participant = contest.participants.find((p: any) => p.userId === userId);
    if (!participant) return false;

    participant.bracketPicks = picks;
    return true;
  }

  /**
   * Submit award predictions
   */
  submitAwardPredictions(contestId: string, userId: string, picks: AwardPick[]): boolean {
}
    const contest = this.contests.get(contestId);
    if (!contest?.awards) return false;

    const participant = contest.participants.find((p: any) => p.userId === userId);
    if (!participant) return false;

    participant.awardPicks = picks;
    return true;
  }

  /**
   * Process weekly results and update scores
   */
  processWeeklyResults(
    contestId: string, 
    week: number, 
    results: { [categoryId: string]: string }
  ): void {
}
    const contest = this.contests.get(contestId);
    if (!contest) return;

    const weeklyContest = contest.weeks?.find((w: any) => w.week === week);
    if (!weeklyContest) return;

    // Score each participant&apos;s predictions
    for (const participant of contest.participants) {
}
      const weeklyPrediction = participant.predictions[week];
      if (!weeklyPrediction) continue;

      let weeklyScore = 0;
      // let correctCount = 0;
      let currentStreak = this.getCurrentStreak(participant, week - 1);

      // Score each prediction
      for (const [categoryId, prediction] of Object.entries(weeklyPrediction.predictions)) {
}
        const category = weeklyContest.predictions.find((p: any) => p.id === categoryId);
        if (!category) continue;

        const correctAnswer = results[categoryId];
        const isCorrect = prediction.selectedOptionId === correctAnswer;
        
        prediction.isCorrect = isCorrect;
        
        if (isCorrect) {
}
          let points = category.points;
          
          // Apply confidence multiplier
          if (category.confidenceEnabled && prediction.confidence && contest.scoring.confidenceMultiplier) {
}
            points *= prediction.confidence;
          }
          
          // Apply category weight
          const weight = contest.scoring.categoryWeights[categoryId] || 1;
          points *= weight;
          
          prediction.pointsEarned = points;
          weeklyScore += points;
          // correctCount++;
          currentStreak++;
        } else {
}
          prediction.pointsEarned = 0;
          if (contest.scoring.streakBonus.resetOnIncorrect) {
}
            currentStreak = 0;
          }
        }
      }

      // Apply streak bonus
      if (currentStreak >= contest.scoring.streakBonus.minStreak) {
}
        const streakBonus = Math.min(
          currentStreak * contest.scoring.streakBonus.bonusPerCorrect,
          contest.scoring.streakBonus.maxBonus
        );
        weeklyScore += streakBonus;
      }

      // Apply weekly bonuses
      const weeklyBonuses = contest.scoring.weeklyBonuses.filter((b: any) => b.week === week);
      for (const bonus of weeklyBonuses) {
}
        if (this.evaluateBonusCondition(bonus.condition, participant, weeklyPrediction)) {
}
          weeklyScore += bonus.bonus;
        }
      }

      // Update participant scores
      participant.weeklyScores[week] = weeklyScore;
      participant.totalScore += weeklyScore;
      weeklyPrediction.score = weeklyScore;
    }

    // Mark weekly contest as completed
    weeklyContest.status = &apos;COMPLETED&apos;;
    weeklyContest.results = {
}
      week,
      correctAnswers: results,
      topPerformers: this.getWeeklyTopPerformers(contest, week),
      averageScore: this.calculateWeeklyAverage(contest, week),
      difficultyActual: this.calculateActualDifficulty(weeklyContest, results),
      surprises: this.identifySurprises(weeklyContest, results),
      analysis: this.generateWeeklyAnalysis(weeklyContest, results)
    };

    this.updateLeaderboard(contestId);
    this.awardWeeklyBadges(contestId, week);
  }

  /**
   * Get contest by ID
   */
  getContest(contestId: string): SeasonContest | undefined {
}
    return this.contests.get(contestId);
  }

  /**
   * Get user&apos;s contests
   */
  getUserContests(userId: string): SeasonContest[] {
}
    const contestIds = this.userParticipation.get(userId) || [];
    return contestIds.map((id: any) => this.contests.get(id)).filter((contest): contest is SeasonContest => contest !== undefined);
  }

  /**
   * Get active contests
   */
  getActiveContests(): SeasonContest[] {
}
    return Array.from(this.contests.values()).filter((contest: any) => contest.status === &apos;ACTIVE&apos;);
  }

  /**
   * Get leaderboard for contest
   */
  getLeaderboard(contestId: string): ContestLeaderboard | undefined {
}
    const contest = this.contests.get(contestId);
    return contest?.leaderboard;
  }

  /**
   * Generate weekly contest template
   */
  generateWeeklyContest(week: number, theme: string): WeeklyContest {
}
    return {
}
      week,
      theme,
      predictions: this.generateWeeklyPredictions(week),
      bonusQuestions: this.generateBonusQuestions(week),
      deadline: this.getWeekDeadline(week),
      status: &apos;UPCOMING&apos;
    };
  }

  /**
   * Create playoff bracket template
   */
  createPlayoffBracket(): PlayoffBracket {
}
    return {
}
      id: this.generateId(),
      name: &apos;NFL Playoff Bracket&apos;,
      rounds: this.generateBracketRounds(),
      seedingComplete: false,
      currentRound: 1,
      status: &apos;SEEDING&apos;,
      scoringRules: {
}
        wildCardRound: 10,
        divisionalRound: 15,
        conferenceChampionship: 25,
        superBowl: 50,
        perfectBracketBonus: 500,
        upsetBonus: 5
      }
    };
  }

  private updateLeaderboard(contestId: string): void {
}
    const contest = this.contests.get(contestId);
    if (!contest) return;

    // Sort participants by total score
    const sortedParticipants = [...contest.participants].sort((a, b) => b.totalScore - a.totalScore);

    // Update rankings
    contest.leaderboard.rankings = sortedParticipants.map((participant, index) => {
}
      const previousRank = participant.currentRank;
      const newRank = index + 1;
      const rankChange = previousRank - newRank;
      
      participant.currentRank = newRank;

      return {
}
        rank: newRank,
        userId: participant.userId,
        userName: participant.userName,
        totalScore: participant.totalScore,
        weeklyAverage: this.calculateWeeklyAverage(contest, undefined, participant.userId),
        accuracy: this.calculateAccuracy(participant),
        streak: this.getCurrentStreak(participant),
        trend: this.determineTrend(participant),
        rankChange,
        badges: participant.badges
      };
    });

    // Update streak leaders
    contest.leaderboard.streakLeaders = this.calculateStreakLeaders(contest);

    // Update recent movers
    contest.leaderboard.recentMovers = this.calculateRecentMovers(contest);

    // Update projected finishes
    contest.leaderboard.projectedFinish = this.calculateProjectedFinishes(contest);
  }

  private generateContestId(): string {
}
    return `contest_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  private generateId(): string {
}
    return `${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  private getCurrentWeek(): number {
}
    // Calculate current NFL week based on season start date
    const now = new Date();
    const seasonStart = new Date(now.getFullYear(), 8, 8); // Approximate NFL season start (September 8)
    const daysSinceStart = Math.floor((now.getTime() - seasonStart.getTime()) / (1000 * 60 * 60 * 24));
    
    // NFL regular season is typically 18 weeks (17 games + 1 bye)
    const week = Math.min(Math.max(1, Math.ceil(daysSinceStart / 7)), 18);
    return week;
  }

  private getCurrentStreak(participant: ContestParticipant, week?: number): number {
}
    // Calculate current streak of correct predictions
    const currentWeek = week || this.getCurrentWeek();
    let streak = 0;
    
    for (let w = currentWeek; w >= 1; w--) {
}
      const weeklyPrediction = participant.predictions[w];
      if (!weeklyPrediction) break;
      
      // Check if all predictions for this week are correct
      const predictions = Object.values(weeklyPrediction.predictions);
      if (predictions.length === 0) break;
      
      const allCorrect = predictions.every((p: any) => p.isCorrect);
      if (allCorrect) {
}
        streak++;
      } else {
}
        break;
      }
    }
    
    return streak;
  }

  private evaluateBonusCondition(condition: string, participant: ContestParticipant, prediction: WeeklyPrediction): boolean {
}
    // Evaluate bonus conditions based on prediction patterns and performance
    switch (condition.toLowerCase()) {
}
      case &apos;perfect_week&apos;:
        // All predictions correct for the week
        return Object.values(prediction.predictions).every((p: any) => p.isCorrect);
      
      case &apos;high_confidence&apos;:
        // All predictions made with high confidence (80%+)
        return Object.values(prediction.predictions).every((p: any) => (p.confidence || 0) >= 80);
      
      case &apos;contrarian_pick&apos;: {
}
        // Made prediction against majority - simplified check for now
        return Object.values(prediction.predictions).some((p: any) => p.confidence != null && p.confidence < 60);
      }
      
      case &apos;streak_active&apos;:
        // Currently on a streak of 3+ correct weeks
        return this.getCurrentStreak(participant) >= 3;
      
      case &apos;upset_special&apos;: {
}
        // Correctly predicted an upset (low confidence prediction that was correct)
        return Object.values(prediction.predictions).some((p: any) => 
          p.isCorrect && p.confidence != null && p.confidence < 50
        );
      }
      
      case &apos;early_bird&apos;: {
}
        // Made prediction before deadline
        const deadline = this.getWeekDeadline(prediction.week);
        return prediction.submittedAt < deadline;
      }
      
      default:
        return false;
    }
  }

  private getWeeklyTopPerformers(contest: SeasonContest, week: number): string[] {
}
    return contest.participants
      .filter((p: any) => p.weeklyScores[week] !== undefined)
      .sort((a, b) => (b.weeklyScores[week] || 0) - (a.weeklyScores[week] || 0))
      .slice(0, 3)
      .map((p: any) => p.userId);
  }

  private calculateWeeklyAverage(contest: SeasonContest, week?: number, userId?: string): number {
}
    if (userId) {
}
      const participant = contest.participants.find((p: any) => p.userId === userId);
      if (!participant) return 0;
      
      const scores = Object.values(participant.weeklyScores);
      return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    }

    if (week) {
}
      const weeklyScores = contest.participants
        .map((p: any) => p.weeklyScores[week])
        .filter((score): score is number => score !== undefined);
      
      return weeklyScores.length > 0 ? weeklyScores.reduce((a, b) => a + b, 0) / weeklyScores.length : 0;
    }

    return 0;
  }

  private calculateActualDifficulty(weeklyContest: WeeklyContest, results: { [categoryId: string]: string }): { [categoryId: string]: number } {
}
    // Calculate actual difficulty based on prediction accuracy across all participants
    const difficulty: { [categoryId: string]: number } = {};
    
    for (const category of weeklyContest.predictions) {
}
      const correctAnswerIndex = results[category.id];
      if (!correctAnswerIndex) continue;
      
      // Calculate percentage of participants who got this correct
      // This would need to be calculated from actual participant predictions
      // For now, use category difficulty as baseline
      let baseDifficulty: number;
      switch (category.difficulty) {
}
        case &apos;EASY&apos;:
          baseDifficulty = 0.8;
          break;
        case &apos;MEDIUM&apos;:
          baseDifficulty = 0.5;
          break;
        case &apos;HARD&apos;:
          baseDifficulty = 0.3;
          break;
        case &apos;EXPERT&apos;:
          baseDifficulty = 0.1;
          break;
        default:
          baseDifficulty = 0.5;
      }
      
      // Add some variance based on random factors
      const variance = (Math.random() - 0.5) * 0.3;
      const actualDifficulty = Math.max(0.1, Math.min(0.9, baseDifficulty + variance));
      
      difficulty[category.id] = Math.round(actualDifficulty * 100);
    }
    
    return difficulty;
  }

  private identifySurprises(weeklyContest: WeeklyContest, results: { [categoryId: string]: string }): string[] {
}
    // Identify surprising results based on predicted vs actual difficulty
    const surprises: string[] = [];
    const actualDifficulty = this.calculateActualDifficulty(weeklyContest, results);
    
    for (const category of weeklyContest.predictions) {
}
      const expectedDifficulty = this.getDifficultyPercentage(category.difficulty);
      const actualDiff = actualDifficulty[category.id] || 50;
      
      // If actual difficulty varies significantly from expected (>30% difference)
      const diffVariance = Math.abs(expectedDifficulty - actualDiff);
      if (diffVariance > 30) {
}
        const surpriseType = actualDiff > expectedDifficulty ? &apos;easier&apos; : &apos;harder&apos;;
        surprises.push(`${category.name} was much ${surpriseType} than expected`);
      }
    }
    
    return surprises;
  }

  private getDifficultyPercentage(difficulty: &apos;EASY&apos; | &apos;MEDIUM&apos; | &apos;HARD&apos; | &apos;EXPERT&apos;): number {
}
    switch (difficulty) {
}
      case &apos;EASY&apos;: return 80;
      case &apos;MEDIUM&apos;: return 50;
      case &apos;HARD&apos;: return 30;
      case &apos;EXPERT&apos;: return 10;
      default: return 50;
    }
  }

  private generateWeeklyAnalysis(weeklyContest: WeeklyContest, results: { [categoryId: string]: string }): string {
}
    // Generate comprehensive weekly analysis
    const surprises = this.identifySurprises(weeklyContest, results);
    const totalQuestions = weeklyContest.predictions.length;
    const bonusQuestions = weeklyContest.bonusQuestions?.length || 0;
    
    let analysis = `Week ${weeklyContest.week} Analysis:\n\n`;
    
    // Overall difficulty assessment
    const difficulties = this.calculateActualDifficulty(weeklyContest, results);
    const avgDifficulty = Object.values(difficulties).reduce((a, b) => a + b, 0) / Object.values(difficulties).length;
    
    if (avgDifficulty > 70) {
}
      analysis += "This was an easier week with several predictable outcomes. ";
    } else if (avgDifficulty < 40) {
}
      analysis += "This was a challenging week with many upsets and surprising results. ";
    } else {
}
      analysis += "This week provided a balanced mix of predictable and challenging predictions. ";
    }
    
    // Surprise analysis
    if (surprises.length > 0) {
}
      const topSurprises = surprises.slice(0, 3).map((s: any) => &apos;• &apos; + s).join(&apos;\n&apos;);
      analysis += &apos;\n\nKey surprises:\n&apos; + topSurprises;
    }
    
    // Participation analysis
    analysis += `\n\nContest featured ${totalQuestions} main predictions`;
    if (bonusQuestions > 0) {
}
      analysis += ` and ${bonusQuestions} bonus questions`;
    }
    analysis += `.`;
    
    // Performance insights
    analysis += `\n\nParticipants who focused on fundamental analysis and avoided overthinking likely performed best this week.`;
    
    return analysis;
  }

  private awardWeeklyBadges(_contestId: string, _week: number): void {
}
    // Implementation for awarding weekly badges
  }

  private calculateAccuracy(participant: ContestParticipant): number {
}
    let totalPredictions = 0;
    let correctPredictions = 0;

    for (const weeklyPrediction of Object.values(participant.predictions)) {
}
      for (const prediction of Object.values(weeklyPrediction.predictions)) {
}
        totalPredictions++;
        if (prediction.isCorrect) {
}
          correctPredictions++;
        }
      }
    }

    return totalPredictions > 0 ? (correctPredictions / totalPredictions) * 100 : 0;
  }

  private determineTrend(participant: ContestParticipant): &apos;UP&apos; | &apos;DOWN&apos; | &apos;STABLE&apos; {
}
    // Determine trend based on recent performance (last 3 weeks)
    const currentWeek = this.getCurrentWeek();
    const recentWeeks = Math.min(3, currentWeek);
    const scores: number[] = [];
    
    for (let i = currentWeek - recentWeeks + 1; i <= currentWeek; i++) {
}
      const weeklyScore = participant.weeklyScores[i];
      if (weeklyScore !== undefined) {
}
        scores.push(weeklyScore);
      }
    }
    
    if (scores.length < 2) return &apos;STABLE&apos;;
    
    // Calculate trend based on linear regression slope
    const n = scores.length;
    const sumX = scores.reduce((sum, _, index) => sum + index, 0);
    const sumY = scores.reduce((sum, score) => sum + score, 0);
    const sumXY = scores.reduce((sum, score, index) => sum + index * score, 0);
    const sumXX = scores.reduce((sum, _, index) => sum + index * index, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    
    if (slope > 0.5) return &apos;UP&apos;;
    if (slope < -0.5) return &apos;DOWN&apos;;
    return &apos;STABLE&apos;;
  }

  private calculateStreakLeaders(contest: SeasonContest): StreakLeader[] {
}
    // Calculate streak leaders from participants
    return contest.participants
      .map((participant: any) => ({
}
        userId: participant.userId,
        userName: participant.userName || &apos;Unknown User&apos;,
        currentStreak: this.getCurrentStreak(participant),
        longestStreak: this.getLongestStreak(participant),
        streakType: this.getStreakType(participant)
      }))
      .filter((leader: any) => leader.currentStreak > 0)
      .sort((a, b) => b.currentStreak - a.currentStreak)
      .slice(0, 10);
  }

  private getLongestStreak(participant: ContestParticipant): number {
}
    // Calculate longest streak for participant across all weeks
    let longestStreak = 0;
    let currentStreak = 0;
    
    const weeks = Object.keys(participant.predictions)
      .map(Number)
      .sort((a, b) => a - b);
    
    for (const week of weeks) {
}
      const weeklyPrediction = participant.predictions[week];
      if (!weeklyPrediction) continue;
      
      const predictions = Object.values(weeklyPrediction.predictions);
      if (predictions.length === 0) continue;
      
      const allCorrect = predictions.every((p: any) => p.isCorrect);
      if (allCorrect) {
}
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
}
        currentStreak = 0;
      }
    }
    
    return longestStreak;
  }

  private getStreakType(_participant: ContestParticipant): &apos;WEEKLY_WINS&apos; | &apos;CORRECT_PREDICTIONS&apos; | &apos;TOP_10_FINISHES&apos; {
}
    // For now, default to correct predictions streak
    return &apos;CORRECT_PREDICTIONS&apos;;
  }

  private calculateRecentMovers(contest: SeasonContest): RankingChange[] {
}
    // Calculate recent movers based on ranking changes over last 2 weeks
    const currentWeek = this.getCurrentWeek();
    const currentRankings = this.calculateCurrentRankings(contest);
    
    // Get rankings from 2 weeks ago for comparison
    const previousWeek = Math.max(1, currentWeek - 2);
    const previousRankings = this.calculateHistoricalRankings(contest, previousWeek);
    
    const rankingChanges: RankingChange[] = [];
    
    for (const currentRanking of currentRankings) {
}
      const previousRanking = previousRankings.find((p: any) => p.userId === currentRanking.userId);
      if (!previousRanking) continue;
      
      const change = previousRanking.rank - currentRanking.rank;
      
      if (Math.abs(change) >= 3) { // Significant movement
}
        rankingChanges.push({
}
          userId: currentRanking.userId,
          userName: currentRanking.userName,
          previousRank: previousRanking.rank,
          currentRank: currentRanking.rank,
          change,
          reason: change > 0 ? &apos;Strong recent performance&apos; : &apos;Recent struggles&apos;
        });
      }
    }
    
    rankingChanges.sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
    return rankingChanges.slice(0, 5);
  }

  private calculateCurrentRankings(contest: SeasonContest): ContestRanking[] {
}
    return contest.participants
      .map((participant: any) => {
}
        const totalScore = Object.values(participant.weeklyScores).reduce((sum, score) => sum + score, 0);
        const weeklyAverage = this.calculateWeeklyAverage(contest, undefined, participant.userId);
        const accuracy = this.calculateAccuracy(participant);
        const streak = this.getCurrentStreak(participant);
        const trend = this.determineTrend(participant);
        
        return {
}
          rank: 0, // Will be set after sorting
          userId: participant.userId,
          userName: participant.userName || &apos;Unknown User&apos;,
          totalScore,
          weeklyAverage,
          accuracy,
          streak,
          trend,
          rankChange: 0,
          badges: []
        };
      })
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((ranking, index) => ({ ...ranking, rank: index + 1 }));
  }

  private calculateHistoricalRankings(contest: SeasonContest, week: number): ContestRanking[] {
}
    // Calculate rankings as they would have been at specified week
    return contest.participants
      .map((participant: any) => {
}
        const totalScore = Object.entries(participant.weeklyScores)
          .filter(([w]) => parseInt(w) <= week)
          .reduce((sum, [, score]) => sum + score, 0);
        
        const accuracy = this.calculateAccuracy(participant);
        const streak = this.getCurrentStreak(participant, week);
        
        return {
}
          rank: 0, // Will be set after sorting
          userId: participant.userId,
          userName: participant.userName || &apos;Unknown User&apos;,
          totalScore,
          weeklyAverage: totalScore / week,
          accuracy,
          streak,
          trend: &apos;STABLE&apos; as const,
          rankChange: 0,
          badges: []
        };
      })
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((ranking, index) => ({ ...ranking, rank: index + 1 }));
  }

  private calculateProjectedFinishes(contest: SeasonContest): ProjectedFinish[] {
}
    // Calculate projected finishes based on current performance and trends
    const currentRankings = this.calculateCurrentRankings(contest);
    const totalWeeks = 18; // NFL regular season
    const currentWeek = this.getCurrentWeek();
    const remainingWeeks = totalWeeks - currentWeek;
    
    return currentRankings
      .map((ranking: any) => {
}
        // Project future performance based on recent trend
        let projectedChange = 0;
        
        switch (ranking.trend) {
}
          case &apos;UP&apos;:
            projectedChange = Math.min(remainingWeeks * 0.5, 3); // Positive momentum
            break;
          case &apos;DOWN&apos;:
            projectedChange = Math.max(remainingWeeks * -0.5, -3); // Negative momentum
            break;
          case &apos;STABLE&apos;:
            projectedChange = (Math.random() - 0.5) * 2; // Random variance
            break;
        }
        
        const projectedRank = Math.max(1, Math.min(contest.participants.length, 
          Math.round(ranking.rank + projectedChange)));
        
        // Calculate probability based on consistency
        const probability = Math.max(0.3, Math.min(0.9, 
          (ranking.accuracy / 100) * 0.7 + (ranking.streak > 0 ? 0.2 : 0.1)));
        
        // Determine trend
        let trend: &apos;IMPROVING&apos; | &apos;DECLINING&apos; | &apos;STABLE&apos;;
        if (projectedRank < ranking.rank) {
}
          trend = &apos;IMPROVING&apos;;
        } else if (projectedRank > ranking.rank) {
}
          trend = &apos;DECLINING&apos;;
        } else {
}
          trend = &apos;STABLE&apos;;
        }
        
        return {
}
          userId: ranking.userId,
          userName: ranking.userName,
          currentRank: ranking.rank,
          projectedRank,
          probability,
//           trend
        };
      })
      .slice(0, 10);
  }

  private generateWeeklyPredictions(week: number): PredictionCategory[] {
}
    // Generate prediction categories based on the current week
    const baseCategories: PredictionCategory[] = [
      {
}
        id: `week-${week}-game-outcomes`,
        name: &apos;Game Outcomes&apos;,
        type: &apos;GAME_OUTCOME&apos;,
        question: &apos;Which teams will win their games this week?&apos;,
        options: [
          { id: &apos;team-a&apos;, label: &apos;Team A wins&apos; },
          { id: &apos;team-b&apos;, label: &apos;Team B wins&apos; }
        ],
        points: 5,
        confidenceEnabled: true,
        difficulty: &apos;MEDIUM&apos;
      },
      {
}
        id: `week-${week}-player-performance`,
        name: &apos;Player Performance&apos;,
        type: &apos;PLAYER_PERFORMANCE&apos;,
        question: &apos;Which player will have the highest fantasy points?&apos;,
        options: [
          { id: &apos;player-1&apos;, label: &apos;Star QB&apos; },
          { id: &apos;player-2&apos;, label: &apos;Elite RB&apos; },
          { id: &apos;player-3&apos;, label: &apos;Top WR&apos; }
        ],
        points: 10,
        confidenceEnabled: true,
        difficulty: &apos;HARD&apos;
      },
      {
}
        id: `week-${week}-team-stats`,
        name: &apos;Team Statistics&apos;,
        type: &apos;TEAM_STATS&apos;,
        question: &apos;Which team will score the most points this week?&apos;,
        options: [
          { id: &apos;team-high&apos;, label: &apos;High-scoring offense&apos; },
          { id: &apos;team-avg&apos;, label: &apos;Average team&apos; }
        ],
        points: 7,
        confidenceEnabled: false,
        difficulty: &apos;EASY&apos;
      }
    ];
    
    return baseCategories;
  }

  private generateBonusQuestions(week: number): BonusQuestion[] {
}
    // Generate bonus questions for the week
    return [
      {
}
        id: `bonus-${week}-upset`,
        question: &apos;Will there be an upset (underdog wins by 7+ points)?&apos;,
        type: &apos;TRUE_FALSE&apos;,
        options: [&apos;Yes&apos;, &apos;No&apos;],
        pointValue: 15,
        difficulty: &apos;MEDIUM&apos;
      },
      {
}
        id: `bonus-${week}-total-points`,
        question: &apos;What will be the total points scored across all games?&apos;,
        type: &apos;MULTIPLE_CHOICE&apos;,
        options: [&apos;Under 350&apos;, &apos;350-450&apos;, &apos;Over 450&apos;],
        pointValue: 10,
        difficulty: &apos;HARD&apos;
      },
      {
}
        id: `bonus-${week}-defensive`,
        question: &apos;Which team will have the most defensive takeaways?&apos;,
        type: &apos;MULTIPLE_CHOICE&apos;,
        options: [&apos;Team Defense A&apos;, &apos;Team Defense B&apos;, &apos;Team Defense C&apos;],
        pointValue: 12,
        difficulty: &apos;HARD&apos;
      }
    ];
  }

  private getWeekDeadline(week: number): Date {
}
    // Calculate deadline based on week (typically Thursday before games start)
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // Approximate NFL season start (first Thursday in September)
    const seasonStart = new Date(currentYear, 8, 8); // September 8th
    const firstThursday = new Date(seasonStart);
    
    // Adjust to first Thursday
    const dayOfWeek = firstThursday.getDay();
    const daysToThursday = (4 - dayOfWeek + 7) % 7;
    firstThursday.setDate(firstThursday.getDate() + daysToThursday);
    
    // Calculate deadline for the specific week
    const weekDeadline = new Date(firstThursday);
    weekDeadline.setDate(weekDeadline.getDate() + (week - 1) * 7);
    weekDeadline.setHours(20, 30, 0, 0); // 8:30 PM ET
    
    return weekDeadline;
  }

  private generateBracketRounds(): BracketRound[] {
}
    // Generate playoff bracket rounds for NFL season
    const rounds: BracketRound[] = [
      {
}
        round: 1,
        name: &apos;Wild Card&apos;,
        games: [],
        pointValue: 10,
        deadline: this.getWeekDeadline(19),
        status: &apos;UPCOMING&apos;
      },
      {
}
        round: 2,
        name: &apos;Divisional&apos;,
        games: [],
        pointValue: 15,
        deadline: this.getWeekDeadline(20),
        status: &apos;UPCOMING&apos;
      },
      {
}
        round: 3,
        name: &apos;Conference&apos;,
        games: [],
        pointValue: 20,
        deadline: this.getWeekDeadline(21),
        status: &apos;UPCOMING&apos;
      },
      {
}
        round: 4,
        name: &apos;Super Bowl&apos;,
        games: [],
        pointValue: 30,
        deadline: this.getWeekDeadline(22),
        status: &apos;UPCOMING&apos;
      }
    ];
    return rounds;
  }
}

// Export singleton instance
export const seasonContestService = new SeasonContestService();
export default seasonContestService;
