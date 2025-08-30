/**
 * Secure 4-Digit Password Generator
 * Generates cryptographically secure random 4-digit passwords
 * Ensures no duplicates and avoids easily guessable patterns
 */

export interface PasswordGenerationOptions {
  excludePatterns?: string[];
  excludeExisting?: string[];
  maxAttempts?: number;
}

export class SecurePasswordGenerator {
  // Common patterns to avoid for security
  private static readonly WEAK_PATTERNS = [
    '0000', '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999',
    '1234', '4321', '2468', '1357', '9876', '6789', '3456', '7890', '0123',
    '1122', '2233', '3344', '4455', '5566', '6677', '7788', '8899', '9900',
    '1212', '2121', '3434', '4343', '5656', '6565', '7878', '8787', '9090',
    '0101', '1010', '2020', '3030', '4040', '5050', '6060', '7070', '8080', '9009'
  ];

  /**
   * Generate cryptographically secure 4-digit password
   */
  static generateSecure4DigitPassword(options: PasswordGenerationOptions = {}): string {
    const {
      excludePatterns = [],
      excludeExisting = [],
      maxAttempts = 1000
    } = options;

    const allExcluded = [
      ...this.WEAK_PATTERNS,
      ...excludePatterns,
      ...excludeExisting
    ];

    let attempts = 0;
    while (attempts < maxAttempts) {
      const password = this.generateRandom4Digit();
      
      if (!allExcluded.includes(password) && this.isSecurePattern(password)) {
        return password;
      }
      
      attempts++;
    }

    // Fallback: if we can't generate a secure password, throw error
    throw new Error('Unable to generate secure password after maximum attempts');
  }

  /**
   * Generate multiple unique secure passwords
   */
  static generateMultipleSecurePasswords(count: number, options: PasswordGenerationOptions = {}): string[] {
    const passwords: string[] = [];
    const excludeSet = new Set([
      ...this.WEAK_PATTERNS,
      ...(options.excludePatterns || []),
      ...(options.excludeExisting || [])
    ]);

    for (let i = 0; i < count; i++) {
      const password = this.generateSecure4DigitPassword({
        ...options,
        excludeExisting: Array.from(excludeSet)
      });
      
      passwords.push(password);
      excludeSet.add(password); // Ensure uniqueness
    }

    return passwords;
  }

  /**
   * Generate cryptographically secure random 4-digit number
   */
  private static generateRandom4Digit(): string {
    // Use crypto.getRandomValues for cryptographic security
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    
    // Convert to 4-digit string (0000-9999)
    const number = array[0] % 10000;
    return number.toString().padStart(4, '0');
  }

  /**
   * Check if pattern is considered secure
   */
  private static isSecurePattern(password: string): boolean {
    if (password.length !== 4) return false;
    
    // Check for sequential patterns
    if (this.hasSequentialDigits(password)) return false;
    
    // Check for too many repeated digits
    if (this.hasTooManyRepeats(password)) return false;
    
    return true;
  }

  /**
   * Check for sequential digits (ascending or descending)
   */
  private static hasSequentialDigits(password: string): boolean {
    let ascending = 0;
    let descending = 0;
    
    for (let i = 1; i < password.length; i++) {
      const current = parseInt(password[i]);
      const previous = parseInt(password[i - 1]);
      
      if (current === previous + 1) ascending++;
      if (current === previous - 1) descending++;
    }
    
    // If 3 or more digits are sequential, it's weak
    return ascending >= 3 || descending >= 3;
  }

  /**
   * Check for too many repeated digits
   */
  private static hasTooManyRepeats(password: string): boolean {
    const digitCount = new Map<string, number>();
    
    for (const digit of password) {
      digitCount.set(digit, (digitCount.get(digit) || 0) + 1);
    }
    
    // If any digit appears 3 or more times, it's weak
    return Array.from(digitCount.values()).some(count => count >= 3);
  }

  /**
   * Validate password strength
   */
  static validatePasswordStrength(password: string): {
    isValid: boolean;
    issues: string[];
    strength: 'weak' | 'medium' | 'strong';
  } {
    const issues: string[] = [];
    
    if (password.length !== 4) {
      issues.push('Password must be exactly 4 digits');
    }
    
    if (!/^\d{4}$/.test(password)) {
      issues.push('Password must contain only digits');
    }
    
    if (this.WEAK_PATTERNS.includes(password)) {
      issues.push('Password is a common weak pattern');
    }
    
    if (this.hasSequentialDigits(password)) {
      issues.push('Password contains too many sequential digits');
    }
    
    if (this.hasTooManyRepeats(password)) {
      issues.push('Password has too many repeated digits');
    }
    
    const isValid = issues.length === 0;
    const strength = isValid ? 'strong' : (issues.length === 1 ? 'medium' : 'weak');
    
    return { isValid, issues, strength };
  }

  /**
   * Log password generation for audit purposes (without exposing actual passwords)
   */
  static logPasswordGeneration(userId: string, success: boolean, attempts?: number): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      userId,
      action: 'password_generation',
      success,
      attempts: attempts || 1,
      // Never log actual passwords for security
      securityNote: 'Password values are never logged for security purposes'
    };
    
    console.log('Password Generation Event:', logEntry);
    
    // In production, this would go to a secure audit log
    if (typeof window !== 'undefined' && (window as any).__ASTRAL_AUDIT_LOG) {
      (window as any).__ASTRAL_AUDIT_LOG.push(logEntry);
    }
  }
}

export default SecurePasswordGenerator;