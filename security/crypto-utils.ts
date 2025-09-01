/**
 * Cryptographic Utilities
 * Enterprise-grade encryption and hashing functions
 */

import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// Constants for encryption
const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16; // 128 bits
const TAG_LENGTH = 16; // 128 bits
const SALT_LENGTH = 32; // 256 bits

/**
 * Generate cryptographically secure random bytes
 */
export function generateSecureRandom(length: number): string {
  return crypto.randomBytes(length).toString('hex');

/**
 * Generate a secure API key
 */
export function generateApiKey(): string {
  return generateSecureRandom(32); // 64 hex characters

/**
 * Generate a secure session ID
 */
export function generateSessionId(): string {
  return generateSecureRandom(24); // 48 hex characters

/**
 * Generate a secure JWT secret
 */
export function generateJwtSecret(): string {
  return generateSecureRandom(64); // 128 hex characters

/**
 * Hash password with bcrypt (secure for authentication)
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12; // High security, slower but safer
  return bcrypt.hash(password, saltRounds);

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);

/**
 * Derive encryption key from password using PBKDF2
 */
export function deriveKey(password: string, salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(password, salt, 100000, KEY_LENGTH, 'sha256');

/**
 * Encrypt sensitive data (for database storage)
 */
export function encryptSensitiveData(text: string, password: string): string {
  const salt = crypto.randomBytes(SALT_LENGTH);
  const key = deriveKey(password, salt);
  const iv = crypto.randomBytes(IV_LENGTH);
  
  const cipher = crypto.createCipher(ALGORITHM, key);
  cipher.setAAD(salt); // Additional authenticated data
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const tag = cipher.getAuthTag();
  
  // Combine salt, iv, tag, and encrypted data
  const combined = Buffer.concat([salt, iv, tag, Buffer.from(encrypted, 'hex')]);
  return combined.toString('base64');

/**
 * Decrypt sensitive data
 */
export function decryptSensitiveData(encryptedData: string, password: string): string {
  const combined = Buffer.from(encryptedData, 'base64');
  
  const salt = combined.subarray(0, SALT_LENGTH);
  const iv = combined.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const tag = combined.subarray(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
  const encrypted = combined.subarray(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
  
  const key = deriveKey(password, salt);
  
  const decipher = crypto.createDecipher(ALGORITHM, key);
  decipher.setAuthTag(tag);
  decipher.setAAD(salt);
  
  let decrypted = decipher.update(encrypted, undefined, 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;

/**
 * Create secure hash for data integrity
 */
export function createSecureHash(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');

/**
 * Create HMAC for message authentication
 */
export function createHMAC(data: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(data).digest('hex');

/**
 * Verify HMAC signature
 */
export function verifyHMAC(data: string, signature: string, secret: string): boolean {
  const expectedSignature = createHMAC(data, secret);
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );

/**
 * Generate time-based one-time password (TOTP) secret
 */
export function generateTOTPSecret(): string {
  return generateSecureRandom(20); // 160-bit secret

/**
 * Encrypt PII data for GDPR compliance
 */
export function encryptPII(data: any, encryptionKey: string): string {
  const jsonData = JSON.stringify(data);
  return encryptSensitiveData(jsonData, encryptionKey);

/**
 * Decrypt PII data
 */
export function decryptPII(encryptedData: string, encryptionKey: string): any {
  const decryptedJson = decryptSensitiveData(encryptedData, encryptionKey);
  return JSON.parse(decryptedJson);

/**
 * Anonymize user data (for analytics)
 */
export function anonymizeUserData(userData: any): any {
  const anonymized = { ...userData };
  
  // Remove or hash PII fields
  if (anonymized.email) {
    anonymized.email = createSecureHash(anonymized.email).substring(0, 16);
  }
  if (anonymized.name) {
    anonymized.name = createSecureHash(anonymized.name).substring(0, 16);
  }
  if (anonymized.ip) {
    anonymized.ip = createSecureHash(anonymized.ip).substring(0, 16);
  }
  
  // Remove sensitive fields entirely
  delete anonymized.password;
  delete anonymized.ssn;
  delete anonymized.creditCard;
  delete anonymized.phone;
  delete anonymized.address;
  
  return anonymized;

/**
 * Generate secure file upload token
 */
export function generateUploadToken(userId: string, filename: string): string {
  const data = `${userId}:${filename}:${Date.now()}`;
  const hash = createSecureHash(data);
  return Buffer.from(`${data}:${hash}`).toString('base64');

/**
 * Verify file upload token
 */
export function verifyUploadToken(token: string, userId: string, filename: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const parts = decoded.split(':');
    
    if (parts.length !== 4) return false;
    
    const [tokenUserId, tokenFilename, timestamp, hash] = parts;
    
    // Verify user and filename match
    if (tokenUserId !== userId || tokenFilename !== filename) return false;
    
    // Verify token is not expired (24 hours)
    const tokenTime = parseInt(timestamp);
    const currentTime = Date.now();
    if (currentTime - tokenTime > 24 * 60 * 60 * 1000) return false;
    
    // Verify hash integrity
    const expectedHash = createSecureHash(`${tokenUserId}:${tokenFilename}:${timestamp}`);
    return hash === expectedHash;
  } catch {
    return false;
  }

/**
 * Secure key rotation utility
 */
export class SecureKeyManager {
  private currentKey: string;
  private previousKeys: string[] = [];
  
  constructor(initialKey?: string) {
    this.currentKey = initialKey || generateSecureRandom(32);
  }
  
  rotateKey(): string {
    this.previousKeys.push(this.currentKey);
    this.currentKey = generateSecureRandom(32);
    
    // Keep only last 5 keys for decryption compatibility
    if (this.previousKeys.length > 5) {
      this.previousKeys.shift();
    }
    
    return this.currentKey;
  }
  
  getCurrentKey(): string {
    return this.currentKey;
  }
  
  encrypt(data: string): string {
    return encryptSensitiveData(data, this.currentKey);
  }
  
  decrypt(encryptedData: string): string {
    // Try current key first
    try {
      return decryptSensitiveData(encryptedData, this.currentKey);
    } catch {
      // Try previous keys
      for (const key of this.previousKeys) {
        try {
          return decryptSensitiveData(encryptedData, key);
        } catch {
          continue;
        }
      }
      throw new Error('Unable to decrypt data with any available key');
    }
  }

// Export singleton instance for application use
export const appKeyManager = new SecureKeyManager(
  process.env.MASTER_ENCRYPTION_KEY || generateSecureRandom(32)
);