/**
 * Validation Types and Schemas
 * Comprehensive validation type definitions and schema interfaces
 */

import { Player } from '../models/player';
import { User } from '../models/user';
import { League } from '../models/league';

// ==================== BASE VALIDATION TYPES ====================

export type ValidationResult = 
  | { isValid: true; errors: [] }
  | { isValid: false; errors: ValidationError[] };

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
  params?: Record<string, any>;
}

export interface ValidationRule<T = any> {
  name: string;
  validator: (value: T, context?: any) => boolean | string | ValidationError;
  message?: string;
  params?: Record<string, any>;
  async?: boolean;
}

export interface FieldValidation<T = any> {
  rules: ValidationRule<T>[];
  required?: boolean;
  optional?: boolean;
  nullable?: boolean;
  transform?: (value: any) => T;
}

export interface ValidationSchema<T = any> {
  fields: {
    [K in keyof T]?: FieldValidation<T[K]>;
  };
  customValidators?: Array<(data: T) => ValidationResult>;
}

// ==================== PRIMITIVE VALIDATION TYPES ====================

export interface StringValidation extends FieldValidation<string> {
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  format?: 'email' | 'url' | 'phone' | 'uuid' | 'slug' | 'hex' | 'base64';
  enum?: readonly string[];
  trim?: boolean;
  lowercase?: boolean;
  uppercase?: boolean;
}

export interface NumberValidation extends FieldValidation<number> {
  min?: number;
  max?: number;
  integer?: boolean;
  positive?: boolean;
  negative?: boolean;
  multipleOf?: number;
}

export interface DateValidation extends FieldValidation<Date> {
  min?: Date;
  max?: Date;
  format?: string;
  timezone?: string;
}

export interface BooleanValidation extends FieldValidation<boolean> {
  strict?: boolean; // Only accept true boolean values, not truthy/falsy
}

export interface ArrayValidation<T = any> extends FieldValidation<T[]> {
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;
  itemValidation?: FieldValidation<T>;
}

export interface ObjectValidation<T = any> extends FieldValidation<T> {
  schema?: ValidationSchema<T>;
  allowAdditionalProperties?: boolean;
  requiredProperties?: (keyof T)[];
}

// ==================== COMMON VALIDATION RULES ====================

export interface EmailValidationRule extends StringValidation {
  format: 'email';
  checkMXRecord?: boolean;
  allowedDomains?: string[];
  blockedDomains?: string[];
}

export interface PasswordValidationRule extends StringValidation {
  minLength: 8;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumbers?: boolean;
  requireSpecialChars?: boolean;
  noCommonPasswords?: boolean;
  noUserInfo?: boolean;
}

export interface UsernameValidationRule extends StringValidation {
  minLength: 3;
  maxLength: 30;
  pattern: RegExp; // alphanumeric, underscores, hyphens
  reservedNames?: string[];
  caseSensitive?: boolean;
}

export interface URLValidationRule extends StringValidation {
  format: 'url';
  protocols?: string[];
  allowedDomains?: string[];
  blockedDomains?: string[];
  requireHTTPS?: boolean;
}

// ==================== DOMAIN-SPECIFIC VALIDATION ====================

// User Validation
export interface UserValidationSchema {
  username: UsernameValidationRule;
  email: EmailValidationRule;
  password: PasswordValidationRule;
  firstName: StringValidation;
  lastName: StringValidation;
  bio?: StringValidation & { maxLength: 500 };
  avatar?: URLValidationRule;
  birthDate?: DateValidation & { max: Date };
  phoneNumber?: StringValidation & { format: 'phone' };
}

// League Validation
export interface LeagueValidationSchema {
  name: StringValidation & { minLength: 3; maxLength: 50 };
  description?: StringValidation & { maxLength: 1000 };
  teamCount: NumberValidation & { min: 4; max: 16; integer: true };
  draftDate?: DateValidation & { min: Date };
  settings: ObjectValidation<any>;
}

// Team Validation
export interface TeamValidationSchema {
  name: StringValidation & { minLength: 3; maxLength: 30 };
  abbreviation?: StringValidation & { minLength: 2; maxLength: 5; uppercase: true };
  logo?: URLValidationRule;
  primaryColor?: StringValidation & { format: 'hex' };
  secondaryColor?: StringValidation & { format: 'hex' };
}

// Player Validation
export interface PlayerValidationSchema {
  name: StringValidation & { minLength: 2; maxLength: 50 };
  position: StringValidation & { enum: ['QB', 'RB', 'WR', 'TE', 'K', 'DEF'] };
  jerseyNumber: NumberValidation & { min: 0; max: 99; integer: true };
  age?: NumberValidation & { min: 18; max: 50; integer: true };
  height?: StringValidation & { pattern: /^\d+'\d+"$/ };
  weight?: NumberValidation & { min: 150; max: 400; integer: true };
}

// Draft Validation
export interface DraftValidationSchema {
  timePerPick: NumberValidation & { min: 30; max: 600; integer: true };
  rounds: NumberValidation & { min: 10; max: 20; integer: true };
  auctionBudget?: NumberValidation & { min: 100; max: 1000; integer: true };
}

// Trade Validation
export interface TradeValidationSchema {
  playersOffered: ArrayValidation<string> & { minItems: 1; maxItems: 10 };
  playersRequested: ArrayValidation<string> & { minItems: 1; maxItems: 10 };
  message?: StringValidation & { maxLength: 500 };
  expiresIn?: NumberValidation & { min: 1; max: 168; integer: true }; // hours
}

// Waiver Validation
export interface WaiverValidationSchema {
  playerId: StringValidation & { format: 'uuid' };
  bid: NumberValidation & { min: 0; max: 1000; integer: true };
  dropPlayerId?: StringValidation & { format: 'uuid' };
}

// ==================== FORM VALIDATION SCHEMAS ====================

export interface LoginFormValidation {
  email: EmailValidationRule;
  password: StringValidation & { minLength: 1 };
  rememberMe?: BooleanValidation;
}

export interface RegisterFormValidation extends UserValidationSchema {
  confirmPassword: StringValidation;
  agreeToTerms: BooleanValidation & { required: true };
}

export interface CreateLeagueFormValidation extends LeagueValidationSchema {
  inviteEmails?: ArrayValidation<string> & { 
    maxItems: 15;
    itemValidation: EmailValidationRule;
  };
}

export interface UpdateProfileFormValidation {
  firstName?: StringValidation & { minLength: 1; maxLength: 50 };
  lastName?: StringValidation & { minLength: 1; maxLength: 50 };
  bio?: StringValidation & { maxLength: 500 };
  location?: ObjectValidation<{
    city: string;
    state: string;
    country: string;
  }>;
  socialLinks?: ObjectValidation<{
    twitter?: string;
    instagram?: string;
    facebook?: string;
    website?: string;
  }>;
}

// ==================== VALIDATION CONTEXT ====================

export interface ValidationContext {
  user?: User;
  league?: League;
  team?: any;
  operation?: 'create' | 'update' | 'delete';
  path?: string[];
  root?: any;
  fieldHistory?: Record<string, any[]>;
}

// ==================== ASYNC VALIDATION ====================

export interface AsyncValidationRule<T = any> extends Omit<ValidationRule<T>, 'validator' | 'async'> {
  validator: (value: T, context?: ValidationContext) => Promise<boolean | string | ValidationError>;
  async: true;
  timeout?: number; // milliseconds
  debounce?: number; // milliseconds
}

export interface AsyncValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  isPending?: boolean;
  isStale?: boolean;
}

// ==================== CONDITIONAL VALIDATION ====================

export interface ConditionalValidation<T = any> {
  condition: (data: any, context?: ValidationContext) => boolean;
  validation: FieldValidation<T>;
}

export interface DependentValidation<T = any> {
  dependsOn: string | string[];
  validation: FieldValidation<T> | ((dependentValues: any) => FieldValidation<T>);
}

// ==================== CUSTOM VALIDATORS ====================

export interface CustomValidator<T = any> {
  name: string;
  validator: (value: T, params?: any, context?: ValidationContext) => ValidationResult;
  defaultMessage?: string;
  async?: boolean;
}

// Fantasy Football specific validators
export interface FantasyValidators {
  // Roster validation
  validRosterSize: CustomValidator<Player[]>;
  validStartingLineup: CustomValidator<Record<string, Player>>;
  noDuplicatePlayers: CustomValidator<Player[]>;
  respectPositionLimits: CustomValidator<Record<string, Player[]>>;
  
  // Draft validation
  validDraftPick: CustomValidator<{ playerId: string; teamId: string; round: number }>;
  respectDraftOrder: CustomValidator<any>;
  playerNotAlreadyDrafted: CustomValidator<string>;
  withinDraftTime: CustomValidator<Date>;
  
  // Trade validation
  balancedTrade: CustomValidator<{ offered: Player[]; requested: Player[] }>;
  withinTradeDeadline: CustomValidator<Date>;
  respectTradeLimits: CustomValidator<any>;
  noColludingTrades: CustomValidator<any>;
  
  // Waiver validation
  respectFAABBudget: CustomValidator<{ bid: number; currentBudget: number }>;
  playerEligibleForWaivers: CustomValidator<string>;
  respectWaiverOrder: CustomValidator<any>;
  validWaiverWindow: CustomValidator<Date>;
}

// ==================== VALIDATION HELPERS ====================

export interface ValidationHelper {
  // Field validation
  validateField<T>(value: T, validation: FieldValidation<T>, context?: ValidationContext): ValidationResult;
  
  // Object validation
  validateObject<T>(data: T, schema: ValidationSchema<T>, context?: ValidationContext): ValidationResult;
  
  // Array validation
  validateArray<T>(array: T[], validation: ArrayValidation<T>, context?: ValidationContext): ValidationResult;
  
  // Async validation
  validateAsync<T>(value: T, rules: AsyncValidationRule<T>[], context?: ValidationContext): Promise<AsyncValidationResult>;
  
  // Conditional validation
  validateConditional<T>(data: any, validation: ConditionalValidation<T>, context?: ValidationContext): ValidationResult;
  
  // Dependent validation
  validateDependent<T>(data: any, validation: DependentValidation<T>, context?: ValidationContext): ValidationResult;
}

// ==================== VALIDATION METADATA ====================

export interface ValidationMetadata {
  schemaVersion: string;
  lastUpdated: Date;
  supportedFormats: string[];
  customValidators: string[];
  dependencies: string[];
}

// ==================== VALIDATION CONFIGURATION ====================

export interface ValidationConfig {
  stopOnFirstError?: boolean;
  collectAllErrors?: boolean;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  validateOnSubmit?: boolean;
  debounceMs?: number;
  asyncTimeoutMs?: number;
  cacheValidationResults?: boolean;
  customValidators?: Record<string, CustomValidator>;
  globalContext?: ValidationContext;
}

// ==================== VALIDATION STATE MANAGEMENT ====================

export interface ValidationState {
  isValid: boolean;
  isValidating: boolean;
  hasValidated: boolean;
  errors: Record<string, ValidationError[]>;
  warnings: Record<string, ValidationError[]>;
  touched: Record<string, boolean>;
  dirty: Record<string, boolean>;
  pendingFields: string[];
}

export interface ValidationActions {
  validate: (field?: string) => Promise<void>;
  validateAll: () => Promise<void>;
  setError: (field: string, error: ValidationError) => void;
  clearError: (field: string) => void;
  clearAllErrors: () => void;
  setTouched: (field: string, touched?: boolean) => void;
  setDirty: (field: string, dirty?: boolean) => void;
  reset: () => void;
}

// ==================== EXPORT ALL ====================

export type {
  ValidationResult,
  ValidationError,
  ValidationRule,
  FieldValidation,
  ValidationSchema,
  StringValidation,
  NumberValidation,
  DateValidation,
  BooleanValidation,
  ArrayValidation,
  ObjectValidation,
  EmailValidationRule,
  PasswordValidationRule,
  UsernameValidationRule,
  URLValidationRule,
  UserValidationSchema,
  LeagueValidationSchema,
  TeamValidationSchema,
  PlayerValidationSchema,
  DraftValidationSchema,
  TradeValidationSchema,
  WaiverValidationSchema,
  LoginFormValidation,
  RegisterFormValidation,
  CreateLeagueFormValidation,
  UpdateProfileFormValidation,
  ValidationContext,
  AsyncValidationRule,
  AsyncValidationResult,
  ConditionalValidation,
  DependentValidation,
  CustomValidator,
  FantasyValidators,
  ValidationHelper,
  ValidationMetadata,
  ValidationConfig,
  ValidationState,
  ValidationActions,
};