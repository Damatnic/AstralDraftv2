/**
 * User and Authentication Types
 * Comprehensive user management, profiles, preferences, and authentication
 */

// ==================== USER ENUMS ====================

export type UserRole = 'USER' | 'COMMISSIONER' | 'ADMIN' | 'MODERATOR';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'BANNED';

export type SubscriptionTier = 'FREE' | 'PREMIUM' | 'PRO' | 'ENTERPRISE';

export type NotificationPreference = 'ALL' | 'IMPORTANT' | 'NONE';

export type Theme = 'LIGHT' | 'DARK' | 'SYSTEM';

export type Language = 'EN' | 'ES' | 'FR' | 'DE' | 'IT' | 'PT';

// ==================== USER PREFERENCES ====================

export interface NotificationSettings {
  email: {
    draftReminders: boolean;
    tradeProposals: boolean;
    waiverResults: boolean;
    lineupReminders: boolean;
    weeklyRecap: boolean;
    leagueActivity: boolean;
    news: boolean;
    promotions: boolean;
  };
  push: {
    draftReminders: boolean;
    tradeProposals: boolean;
    gameUpdates: boolean;
    playerNews: boolean;
    immediateAlerts: boolean;
  };
  inApp: {
    sounds: boolean;
    animations: boolean;
    popups: boolean;
    badges: boolean;
  };
  frequency: 'REAL_TIME' | 'HOURLY' | 'DAILY' | 'WEEKLY';

export interface PrivacySettings {
  profileVisibility: 'PUBLIC' | 'FRIENDS' | 'LEAGUES_ONLY' | 'PRIVATE';
  showRealName: boolean;
  showEmail: boolean;
  showLocation: boolean;
  showStats: boolean;
  allowDirectMessages: boolean;
  allowLeagueInvites: boolean;
  dataCollection: boolean;
  analytics: boolean;
  thirdPartySharing: boolean;

export interface DisplaySettings {
  theme: Theme;
  language: Language;
  timezone: string;
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  timeFormat: '12H' | '24H';
  numberFormat: 'US' | 'EU';
  currency: string;
  compactMode: boolean;
  
  // Accessibility
  fontSize: 'SMALL' | 'MEDIUM' | 'LARGE' | 'EXTRA_LARGE';
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;

export interface GameplaySettings {
  defaultDraftStrategy: 'CONSERVATIVE' | 'AGGRESSIVE' | 'BALANCED';
  autoLineupOptimization: boolean;
  riskTolerance: 'LOW' | 'MEDIUM' | 'HIGH';
  tradingStyle: 'CONSERVATIVE' | 'ACTIVE' | 'AGGRESSIVE';
  favoritePositions: string[];
  favoriteTeams: string[];
  playerWatchlist: string[]; // Player IDs
  customRankings: boolean;
  
  // Draft preferences
  draftPreferences: {
    autoQueue: boolean;
    audioDraftRoom: boolean;
    showProjections: boolean;
    showAdvancedStats: boolean;
    highlightSleepers: boolean;
    positionScarcityAlerts: boolean;
  };

export interface UserPreferences {
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  display: DisplaySettings;
  gameplay: GameplaySettings;
  
  // Quick settings
  quickActions: string[];
  favoriteViews: string[];
  dashboardLayout: string[];
  
  updatedAt: Date;

// ==================== USER PROFILE ====================

export interface UserProfile {
  // Basic Info
  firstName: string;
  lastName: string;
  displayName: string;
  bio?: string;
  
  // Contact Info
  email: string;
  phoneNumber?: string;
  location?: {
    city: string;
    state: string;
    country: string;
    timezone: string;
  };
  
  // Social Media
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    website?: string;
  };
  
  // Avatar and Branding
  avatar: string;
  banner?: string;
  teamColors?: {
    primary: string;
    secondary: string;
  };
  
  // Personal Details
  birthDate?: Date;
  favoriteNFLTeam?: string;
  fantasyExperience: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  yearsPlaying: number;
  
  // Verification
  isVerified: boolean;
  verifiedAt?: Date;
  
  updatedAt: Date;

// ==================== USER STATS AND ACHIEVEMENTS ====================

export interface UserStats {
  // Career Stats
  totalLeagues: number;
  activeLeagues: number;
  leaguesWon: number;
  leaguesPlayoffAppearances: number;
  overallWinPercentage: number;
  
  // Seasonal Stats
  currentSeasonRecord: {
    wins: number;
    losses: number;
    ties: number;
  };
  pointsForAverage: number;
  pointsAgainstAverage: number;
  
  // Draft Performance
  draftsCompleted: number;
  averageDraftGrade: string;
  averageDraftTime: number; // seconds per pick
  bestDraftPick: {
    player: string;
    round: number;
    season: number;
  };
  
  // Trading Activity
  tradesCompleted: number;
  tradeWinPercentage: number;
  favoriteTradePartner: string;
  
  // Waiver Wire
  waiverClaimsWon: number;
  faabUsed: number;
  bestWaiverPickup: {
    player: string;
    cost: number;
    season: number;
  };
  
  // Engagement
  loginStreak: number;
  messagesPosted: number;
  predictionsAccuracy: number;
  
  // Records
  highestSingleGameScore: number;
  lowestSingleGameScore: number;
  longestWinStreak: number;
  longestLossStreak: number;
  
  updatedAt: Date;

export interface Achievement {
  id: string;
  category: 'DRAFT' | 'SEASON' | 'PLAYOFFS' | 'TRADING' | 'WAIVER' | 'ENGAGEMENT' | 'SPECIAL';
  name: string;
  description: string;
  icon: string;
  rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  points: number;
  unlockedAt?: Date;
  progress?: {
    current: number;
    target: number;
  };

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedAt: Date;
  season?: number;
  leagueId?: string;

// ==================== SUBSCRIPTION AND BILLING ====================

export interface Subscription {
  tier: SubscriptionTier;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'PENDING';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  
  features: {
    maxLeagues: number;
    advancedAnalytics: boolean;
    customScoring: boolean;
    tradeAnalyzer: boolean;
    injuryAlerts: boolean;
    expertRankings: boolean;
    mobileApp: boolean;
    apiAccess: boolean;
    prioritySupport: boolean;
  };
  
  billing: {
    amount: number;
    currency: string;
    interval: 'MONTHLY' | 'YEARLY';
    paymentMethod: string;
    lastBilledAt: Date;
    nextBillingAt: Date;
  };

// ==================== MAIN USER INTERFACE ====================

export interface User {
  // Core Identity
  id: string;
  username: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  
  // Profile Information
  profile: UserProfile;
  preferences: UserPreferences;
  
  // Game Data
  stats: UserStats;
  achievements: Achievement[];
  badges: Badge[];
  
  // Subscription
  subscription: Subscription;
  
  // Security
  lastLoginAt: Date;
  lastActiveAt: Date;
  loginAttempts: number;
  lockedUntil?: Date;
  twoFactorEnabled: boolean;
  
  // System Data
  createdAt: Date;
  updatedAt: Date;
  emailVerifiedAt?: Date;
  onboardingCompletedAt?: Date;
  
  // Temporary session data (not persisted)
  isOnline?: boolean;
  currentLeagueId?: string;
  sessionToken?: string;

// ==================== AUTHENTICATION ====================

export interface AuthCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  agreeToTerms: boolean;
  subscribeToNewsletter?: boolean;

export interface AuthSession {
  user: User;
  token: string;
  refreshToken: string;
  expiresAt: Date;
  permissions: string[];

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  session: AuthSession | null;
  error: string | null;
  
  // OAuth providers
  providers: {
    google: boolean;
    facebook: boolean;
    twitter: boolean;
    apple: boolean;
  };

// ==================== PASSWORD AND SECURITY ====================

export interface PasswordResetRequest {
  email: string;
  token?: string;
  newPassword?: string;
  confirmPassword?: string;

export interface TwoFactorAuth {
  enabled: boolean;
  secret?: string;
  backupCodes: string[];
  lastUsedAt?: Date;

export interface SecurityLog {
  id: string;
  userId: string;
  action: 'LOGIN' | 'LOGOUT' | 'PASSWORD_CHANGE' | 'EMAIL_CHANGE' | '2FA_ENABLE' | '2FA_DISABLE';
  ipAddress: string;
  userAgent: string;
  location?: {
    city: string;
    region: string;
    country: string;
  };
  timestamp: Date;
  success: boolean;

// ==================== USER RELATIONSHIPS ====================

export interface UserConnection {
  id: string;
  userId: string;
  connectedUserId: string;
  type: 'FRIEND' | 'LEAGUE_MATE' | 'BLOCKED';
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  initiatedBy: string;
  createdAt: Date;
  updatedAt: Date;

export interface UserInvite {
  id: string;
  fromUserId: string;
  toEmail: string;
  leagueId?: string;
  type: 'LEAGUE' | 'FRIENDSHIP' | 'APP';
  message?: string;
  token: string;
  expiresAt: Date;
  acceptedAt?: Date;
  createdAt: Date;

// ==================== EXPORT ALL ====================

export type {
  UserRole,
  UserStatus,
  SubscriptionTier,
  NotificationPreference,
  Theme,
  Language,
  NotificationSettings,
  PrivacySettings,
  DisplaySettings,
  GameplaySettings,
  UserPreferences,
  UserProfile,
  UserStats,
  Achievement,
  Badge,
  Subscription,
  User,
  AuthCredentials,
  RegisterCredentials,
  AuthSession,
  AuthState,
  PasswordResetRequest,
  TwoFactorAuth,
  SecurityLog,
  UserConnection,
  UserInvite,
};