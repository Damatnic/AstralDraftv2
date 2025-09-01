/**
 * Common Utility Types
 * Generic utility types used throughout the application
 */

// ==================== BASIC UTILITY TYPES ====================

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

export type NonNullable<T> = T extends null | undefined ? never : T;
export type NonEmptyArray<T> = [T, ...T[]];

// Make all properties optional
export type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Make all properties required
export type Required<T> = {
  [P in keyof T]-?: T[P];
};

// Make specific properties optional
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Make specific properties required
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;

// ==================== OBJECT MANIPULATION TYPES ====================

// Extract keys that have values of a certain type
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

// Extract keys that have optional values
export type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

// Extract keys that have required values
export type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

// Deep partial
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Deep required
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

// Deep readonly
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// Mutable (opposite of readonly)
export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

// Deep mutable
export type DeepMutable<T> = {
  -readonly [P in keyof T]: T[P] extends object ? DeepMutable<T[P]> : T[P];
};

// ==================== FUNCTION UTILITY TYPES ====================

// Extract parameters from function type
export type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;

// Extract return type from function type
export type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;

// Function with specific return type
export type FunctionReturning<T> = (...args: any[]) => T;

// Async function type
export type AsyncFunction<T = void> = (...args: any[]) => Promise<T>;

// Event handler function
export type EventHandler<T = Event> = (event: T) => void;

// Callback function with error handling
export type Callback<T = void, E = Error> = (error: E | null, result?: T) => void;

// ==================== PROMISE AND ASYNC TYPES ====================

// Unwrap promise type
export type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;

// Promise or value
export type PromiseOr<T> = T | Promise<T>;

// Async result with loading state
export type AsyncResult<T, E = Error> = {
  data: T | null;
  error: E | null;
  loading: boolean;
};

// ==================== ARRAY AND TUPLE TYPES ====================

// Get first element of array
export type Head<T extends readonly any[]> = T extends readonly [any, ...any[]] ? T[0] : never;

// Get all but first element of array
export type Tail<T extends readonly any[]> = T extends readonly [any, ...infer U] ? U : never;

// Get last element of array
export type Last<T extends readonly any[]> = T extends readonly [...any[], infer U] ? U : never;

// Tuple to union
export type TupleToUnion<T extends readonly any[]> = T[number];

// Union to tuple (limited utility, requires specific implementation)
export type UnionToTuple<T> = T extends any ? [T] : never;

// Array element type
export type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;

// ==================== STRING MANIPULATION TYPES ====================

// Capitalize string literal
export type Capitalize<S extends string> = S extends `${infer F}${infer R}` 
  ? `${Uppercase<F>}${R}` 
  : S;

// Uncapitalize string literal
export type Uncapitalize<S extends string> = S extends `${infer F}${infer R}` 
  ? `${Lowercase<F>}${R}` 
  : S;

// Convert string to camelCase
export type CamelCase<S extends string> = S extends `${infer P}_${infer Q}` 
  ? `${Lowercase<P>}${Capitalize<CamelCase<Q>>}` 
  : Lowercase<S>;

// Convert string to kebab-case
export type KebabCase<S extends string> = S extends `${infer P}${infer Q}` 
  ? Q extends Uncapitalize<Q> 
    ? `${Lowercase<P>}${KebabCase<Q>}` 
    : `${Lowercase<P>}-${KebabCase<Uncapitalize<Q>>}` 
  : S;

// ==================== CONDITIONAL TYPES ====================

// If-else type
export type If<C extends boolean, T, F> = C extends true ? T : F;

// Not type
export type Not<T extends boolean> = T extends true ? false : true;

// And type
export type And<A extends boolean, B extends boolean> = A extends true ? B : false;

// Or type
export type Or<A extends boolean, B extends boolean> = A extends true ? true : B;

// Equals type
export type Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? true : false;

// ==================== BRAND TYPES ====================

// Create branded type
export type Brand<T, B> = T & { __brand: B };

// Common branded types
export type UserId = Brand<string, 'UserId'>;
export type LeagueId = Brand<string, 'LeagueId'>;
export type PlayerId = Brand<string, 'PlayerId'>;
export type TeamId = Brand<string, 'TeamId'>;
export type DraftId = Brand<string, 'DraftId'>;
export type TradeId = Brand<string, 'TradeId'>;
export type MatchupId = Brand<string, 'MatchupId'>;

// Email type with validation
export type Email = Brand<string, 'Email'>;

// URL type with validation
export type URL = Brand<string, 'URL'>;

// Positive number
export type PositiveNumber = Brand<number, 'PositiveNumber'>;

// Percentage (0-100)
export type Percentage = Brand<number, 'Percentage'>;

// ==================== STATUS AND STATE TYPES ====================

// Loading states
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// CRUD operations
export type CrudOperation = 'create' | 'read' | 'update' | 'delete';

// Sort directions
export type SortDirection = 'asc' | 'desc';

// Compare result
export type CompareResult = -1 | 0 | 1;

// ==================== DISCRIMINATED UNIONS ====================

// Result type for operations that can fail
export type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

// Option type (similar to Result but for nullable values)
export type Option<T> = 
  | { some: true; value: T }
  | { some: false; value: null };

// Either type
export type Either<L, R> = 
  | { left: L; right?: never }
  | { left?: never; right: R };

// ==================== VALIDATION TYPES ====================

// Validation rule
export interface ValidationRule<T> {
  validate: (value: T) => boolean;
  message: string;

// Validation result
export type ValidationResult = 
  | { valid: true }
  | { valid: false; errors: string[] };

// Field validation result
export type FieldValidationResult<T> = {
  [K in keyof T]?: string[];
};

// ==================== DATE AND TIME TYPES ====================

// ISO date string
export type ISODateString = Brand<string, 'ISODateString'>;

// Unix timestamp
export type UnixTimestamp = Brand<number, 'UnixTimestamp'>;

// Time zone
export type TimeZone = string;

// Date range
export interface DateRange {
  start: Date;
  end: Date;

// ==================== PAGINATION TYPES ====================

export interface PaginationParams {
  page: number;
  limit: number;
  offset?: number;

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;

export interface PaginatedData<T> {
  items: T[];
  pagination: PaginationInfo;

// ==================== SORT AND FILTER TYPES ====================

export interface SortConfig<T = any> {
  field: keyof T | string;
  direction: SortDirection;

export interface FilterConfig<T = any> {
  field: keyof T | string;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'notIn';
  value: any;

export interface SearchConfig {
  query: string;
  fields?: string[];
  fuzzy?: boolean;

// ==================== CACHE TYPES ====================

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  tags?: string[];

export interface CacheConfig {
  ttl: number; // Time to live in seconds
  maxSize?: number; // Maximum number of entries
  tags?: string[]; // Tags for cache invalidation}

// ==================== ERROR TYPES ====================

export interface ErrorInfo {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
  stack?: string;}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;

// ==================== COLLECTION TYPES ====================

// Dictionary/Map type
export type Dictionary<T> = Record<string, T>;

// Lookup table
export type LookupTable<K extends string | number | symbol, V> = Record<K, V>;}

// Key-value pair
export interface KeyValuePair<K = string, V = any> {
  key: K;
  value: V;}

// ==================== COORDINATE AND GEOMETRY TYPES ====================

export interface Point {
  x: number;
  y: number;}

export interface Size {
  width: number;
  height: number;}

export interface Rectangle extends Point, Size {}

export interface Circle extends Point {
  radius: number;

// ==================== COLOR TYPES ====================

// Hex color
export type HexColor = Brand<string, 'HexColor'>;

// RGB color
export interface RGBColor {
  r: number;
  g: number;
  b: number;

// RGBA color
export interface RGBAColor extends RGBColor {
  a: number;

// HSL color
export interface HSLColor {
  h: number;
  s: number;
  l: number;}

// ==================== ENVIRONMENT TYPES ====================

export type Environment = 'development' | 'staging' | 'production' | 'test';}

export type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'trace';}

// ==================== EXPORT ALL ====================}

export type {
  Nullable,
  Optional,
  Maybe,
  NonEmptyArray,
  PartialBy,
  RequiredBy,
  KeysOfType,
  OptionalKeys,
  RequiredKeys,
  DeepPartial,
  DeepRequired,
  DeepReadonly,
  Mutable,
  DeepMutable,
  FunctionReturning,
  AsyncFunction,
  EventHandler,
  Callback,
  Awaited,
  PromiseOr,
  AsyncResult,
  Head,
  Tail,
  Last,
  TupleToUnion,
  UnionToTuple,
  ArrayElement,
  Capitalize,
  Uncapitalize,
  CamelCase,
  KebabCase,
  If,
  Not,
  And,
  Or,
  Equals,
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
  PositiveNumber,
  Percentage,
  LoadingState,
  CrudOperation,
  SortDirection,
  CompareResult,
  Result,
  Option,
  Either,
  ValidationRule,
  ValidationResult,
  FieldValidationResult,
  ISODateString,
  UnixTimestamp,
  TimeZone,
  DateRange,
  PaginationParams,
  PaginationInfo,
  PaginatedData,
  SortConfig,
  FilterConfig,
  SearchConfig,
  CacheEntry,
  CacheConfig,
  ErrorInfo,
  ValidationError,
  Dictionary,
  LookupTable,
  KeyValuePair,
  Point,
  Size,
  Rectangle,
  Circle,
  HexColor,
  RGBColor,
  RGBAColor,
  HSLColor,
  Environment,
  LogLevel,
};