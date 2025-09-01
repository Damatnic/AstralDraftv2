/**
 * User and Authentication Types
 * Comprehensive user management, profiles, preferences, and authentication
 */

// ==================== USER ENUMS ====================

export type UserRole = &apos;USER&apos; | &apos;COMMISSIONER&apos; | &apos;ADMIN&apos; | &apos;MODERATOR&apos;;

export type UserStatus = &apos;ACTIVE&apos; | &apos;INACTIVE&apos; | &apos;SUSPENDED&apos; | &apos;BANNED&apos;;

export type SubscriptionTier = &apos;FREE&apos; | &apos;PREMIUM&apos; | &apos;PRO&apos; | &apos;ENTERPRISE&apos;;

export type NotificationPreference = &apos;ALL&apos; | &apos;IMPORTANT&apos; | &apos;NONE&apos;;

export type Theme = &apos;LIGHT&apos; | &apos;DARK&apos; | &apos;SYSTEM&apos;;

export type Language = &apos;EN&apos; | &apos;ES&apos; | &apos;FR&apos; | &apos;DE&apos; | &apos;IT&apos; | &apos;PT&apos;;

// ==================== USER PREFERENCES ====================

export interface NotificationSettings {
}
  email: {
}
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
}
    draftReminders: boolean;
    tradeProposals: boolean;
    gameUpdates: boolean;
    playerNews: boolean;
    immediateAlerts: boolean;
  };
  inApp: {
}
    sounds: boolean;
    animations: boolean;
    popups: boolean;
    badges: boolean;
  };
  frequency: &apos;REAL_TIME&apos; | &apos;HOURLY&apos; | &apos;DAILY&apos; | &apos;WEEKLY&apos;;
}

export interface PrivacySettings {
}
  profileVisibility: &apos;PUBLIC&apos; | &apos;FRIENDS&apos; | &apos;LEAGUES_ONLY&apos; | &apos;PRIVATE&apos;;
  showRealName: boolean;
  showEmail: boolean;
  showLocation: boolean;
  showStats: boolean;
  allowDirectMessages: boolean;
  allowLeagueInvites: boolean;
  dataCollection: boolean;
  analytics: boolean;
  thirdPartySharing: boolean;
}

export interface DisplaySettings {
}
  theme: Theme;
  language: Language;
  timezone: string;
  dateFormat: &apos;MM/DD/YYYY&apos; | &apos;DD/MM/YYYY&apos; | &apos;YYYY-MM-DD&apos;;
  timeFormat: &apos;12H&apos; | &apos;24H&apos;;
  numberFormat: &apos;US&apos; | &apos;EU&apos;;
  currency: string;
  compactMode: boolean;
  
  // Accessibility
  fontSize: &apos;SMALL&apos; | &apos;MEDIUM&apos; | &apos;LARGE&apos; | &apos;EXTRA_LARGE&apos;;
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
}

export interface GameplaySettings {
}
  defaultDraftStrategy: &apos;CONSERVATIVE&apos; | &apos;AGGRESSIVE&apos; | &apos;BALANCED&apos;;
  autoLineupOptimization: boolean;
  riskTolerance: &apos;LOW&apos; | &apos;MEDIUM&apos; | &apos;HIGH&apos;;
  tradingStyle: &apos;CONSERVATIVE&apos; | &apos;ACTIVE&apos; | &apos;AGGRESSIVE&apos;;
  favoritePositions: string[];
  favoriteTeams: string[];
  playerWatchlist: string[]; // Player IDs
  customRankings: boolean;
  
  // Draft preferences
  draftPreferences: {
}
    autoQueue: boolean;
    audioDraftRoom: boolean;
    showProjections: boolean;
    showAdvancedStats: boolean;
    highlightSleepers: boolean;
    positionScarcityAlerts: boolean;
  };
}

export interface UserPreferences {
}
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  display: DisplaySettings;
  gameplay: GameplaySettings;
  
  // Quick settings
  quickActions: string[];
  favoriteViews: string[];
  dashboardLayout: string[];
  
  updatedAt: Date;
}

// ==================== USER PROFILE ====================

export interface UserProfile {
}
  // Basic Info
  firstName: string;
  lastName: string;
  displayName: string;
  bio?: string;
  
  // Contact Info
  email: string;
  phoneNumber?: string;
  location?: {
}
    city: string;
    state: string;
    country: string;
    timezone: string;
  };
  
  // Social Media
  socialLinks?: {
}
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
}
    primary: string;
    secondary: string;
  };
  
  // Personal Details
  birthDate?: Date;
  favoriteNFLTeam?: string;
  fantasyExperience: &apos;BEGINNER&apos; | &apos;INTERMEDIATE&apos; | &apos;ADVANCED&apos; | &apos;EXPERT&apos;;
  yearsPlaying: number;
  
  // Verification
  isVerified: boolean;
  verifiedAt?: Date;
  
  updatedAt: Date;
}

// ==================== USER STATS AND ACHIEVEMENTS ====================

export interface UserStats {
}
  // Career Stats
  totalLeagues: number;
  activeLeagues: number;
  leaguesWon: number;
  leaguesPlayoffAppearances: number;
  overallWinPercentage: number;
  
  // Seasonal Stats
  currentSeasonRecord: {
}
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
}
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
}
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
}

export interface Achievement {
}
  id: string;
  category: &apos;DRAFT&apos; | &apos;SEASON&apos; | &apos;PLAYOFFS&apos; | &apos;TRADING&apos; | &apos;WAIVER&apos; | &apos;ENGAGEMENT&apos; | &apos;SPECIAL&apos;;
  name: string;
  description: string;
  icon: string;
  rarity: &apos;COMMON&apos; | &apos;UNCOMMON&apos; | &apos;RARE&apos; | &apos;EPIC&apos; | &apos;LEGENDARY&apos;;
  points: number;
  unlockedAt?: Date;
  progress?: {
}
    current: number;
    target: number;
  };
}

export interface Badge {
}
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedAt: Date;
  season?: number;
  leagueId?: string;
}

// ==================== SUBSCRIPTION AND BILLING ====================

export interface Subscription {
}
  tier: SubscriptionTier;
  status: &apos;ACTIVE&apos; | &apos;EXPIRED&apos; | &apos;CANCELLED&apos; | &apos;PENDING&apos;;
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  
  features: {
}
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
}
    amount: number;
    currency: string;
    interval: &apos;MONTHLY&apos; | &apos;YEARLY&apos;;
    paymentMethod: string;
    lastBilledAt: Date;
    nextBillingAt: Date;
  };
}

// ==================== MAIN USER INTERFACE ====================

export interface User {
}
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
}

// ==================== AUTHENTICATION ====================

export interface AuthCredentials {
}
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
}
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  agreeToTerms: boolean;
  subscribeToNewsletter?: boolean;
}

export interface AuthSession {
}
  user: User;
  token: string;
  refreshToken: string;
  expiresAt: Date;
  permissions: string[];
}

export interface AuthState {
}
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  session: AuthSession | null;
  error: string | null;
  
  // OAuth providers
  providers: {
}
    google: boolean;
    facebook: boolean;
    twitter: boolean;
    apple: boolean;
  };
}

// ==================== PASSWORD AND SECURITY ====================

export interface PasswordResetRequest {
}
  email: string;
  token?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface TwoFactorAuth {
}
  enabled: boolean;
  secret?: string;
  backupCodes: string[];
  lastUsedAt?: Date;
}

export interface SecurityLog {
}
  id: string;
  userId: string;
  action: &apos;LOGIN&apos; | &apos;LOGOUT&apos; | &apos;PASSWORD_CHANGE&apos; | &apos;EMAIL_CHANGE&apos; | &apos;2FA_ENABLE&apos; | &apos;2FA_DISABLE&apos;;
  ipAddress: string;
  userAgent: string;
  location?: {
}
    city: string;
    region: string;
    country: string;
  };
  timestamp: Date;
  success: boolean;
}

// ==================== USER RELATIONSHIPS ====================

export interface UserConnection {
}
  id: string;
  userId: string;
  connectedUserId: string;
  type: &apos;FRIEND&apos; | &apos;LEAGUE_MATE&apos; | &apos;BLOCKED&apos;;
  status: &apos;PENDING&apos; | &apos;ACCEPTED&apos; | &apos;DECLINED&apos;;
  initiatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserInvite {
}
  id: string;
  fromUserId: string;
  toEmail: string;
  leagueId?: string;
  type: &apos;LEAGUE&apos; | &apos;FRIENDSHIP&apos; | &apos;APP&apos;;
  message?: string;
  token: string;
  expiresAt: Date;
  acceptedAt?: Date;
  createdAt: Date;
}

// ==================== EXPORT ALL ====================

export type {
}
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