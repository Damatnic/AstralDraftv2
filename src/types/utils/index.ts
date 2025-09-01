/**
 * Utils Types Barrel Export
 * Central export for all utility types
 */

// Common utilities
export * from './common';

// Validation utilities
export * from './validation';

// Formatting utilities
export * from './formatting';

// Re-export commonly used utility types
export type {
  // Common utilities
  Nullable,
  Optional,
  Maybe,
  DeepPartial,
  DeepRequired,
  Partial,
  Required,
  LoadingState,
  SortDirection,
  Result,
  AsyncResult,
  
  // Branded types
  Brand,
  UserId,
  LeagueId,
  PlayerId,
  TeamId,
  DraftId,
  TradeId,
  MatchupId,
  Email,
  URL,
  
  // Pagination
  PaginationParams,
  PaginationInfo,
  PaginatedData,
  
  // Sort and filter
  SortConfig,
  FilterConfig,
  SearchConfig,
  
  // Error handling
  ErrorInfo,
  ValidationError as UtilValidationError,
  
  // Collections
  Dictionary,
  LookupTable,
//   KeyValuePair
} from './common';

export type {
  // Validation core types
  ValidationResult,
  ValidationError,
  ValidationRule,
  FieldValidation,
  ValidationSchema,
  ValidationContext,
  
  // Primitive validations
  StringValidation,
  NumberValidation,
  DateValidation,
  BooleanValidation,
  ArrayValidation,
  ObjectValidation,
  
  // Common validation rules
  EmailValidationRule,
  PasswordValidationRule,
  UsernameValidationRule,
  URLValidationRule,
  
  // Domain-specific schemas
  UserValidationSchema,
  LeagueValidationSchema,
  TeamValidationSchema,
  PlayerValidationSchema,
  DraftValidationSchema,
  TradeValidationSchema,
  WaiverValidationSchema,
  
  // Form validations
  LoginFormValidation,
  RegisterFormValidation,
  CreateLeagueFormValidation,
  UpdateProfileFormValidation,
  
  // Advanced validation
  AsyncValidationRule,
  AsyncValidationResult,
  ConditionalValidation,
  DependentValidation,
  CustomValidator,
  FantasyValidators,
  
  // Validation state
  ValidationState,
  ValidationActions,
//   ValidationConfig
} from './validation';

export type {
  // Base formatting
  FormatOptions,
  DisplayConfig,
  FormattedValue,
  FormatFunction,
  FormatRegistry,
  
  // Number formatting
  NumberFormatOptions,
  CurrencyFormatOptions,
  PercentageFormatOptions,
  ScoreFormatOptions,
  RankFormatOptions,
  
  // Date formatting
  DateFormatOptions,
  RelativeDateFormatOptions,
  TimeAgoFormatOptions,
  GameTimeFormatOptions,
  
  // Text formatting
  TextFormatOptions,
  PlayerNameFormatOptions,
  TeamNameFormatOptions,
  
  // Fantasy-specific formatting
  StatFormatOptions,
  ProjectionFormatOptions,
  FantasyPointsFormatOptions,
  DraftPickFormatOptions,
  TradeFormatOptions,
  WaiverFormatOptions,
  MatchupFormatOptions,
  
  // Display configurations
  PlayerDisplayConfig,
  TeamDisplayConfig,
  LeagueDisplayConfig,
  DashboardDisplayConfig,
  
  // Advanced formatting
  ResponsiveFormatOptions,
  AccessibilityFormatOptions,
  ThemeAwareFormatOptions,
//   LocalizationFormatOptions
} from './formatting';