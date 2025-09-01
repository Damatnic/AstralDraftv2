/**
 * Secure 4-Digit Password Generator
 * Generates cryptographically secure random 4-digit passwords
 * Ensures no duplicates and avoids easily guessable patterns
 */

export interface PasswordGenerationOptions {
}
  excludePatterns?: string[];
  excludeExisting?: string[];
  maxAttempts?: number;
}

export class SecurePasswordGenerator {
}
  // Common patterns to avoid for security
  private static readonly WEAK_PATTERNS = [
    &apos;0000&apos;, &apos;1111&apos;, &apos;2222&apos;, &apos;3333&apos;, &apos;4444&apos;, &apos;5555&apos;, &apos;6666&apos;, &apos;7777&apos;, &apos;8888&apos;, &apos;9999&apos;,
    &apos;1234&apos;, &apos;4321&apos;, &apos;2468&apos;, &apos;1357&apos;, &apos;9876&apos;, &apos;6789&apos;, &apos;3456&apos;, &apos;7890&apos;, &apos;0123&apos;,
    &apos;1122&apos;, &apos;2233&apos;, &apos;3344&apos;, &apos;4455&apos;, &apos;5566&apos;, &apos;6677&apos;, &apos;7788&apos;, &apos;8899&apos;, &apos;9900&apos;,
    &apos;1212&apos;, &apos;2121&apos;, &apos;3434&apos;, &apos;4343&apos;, &apos;5656&apos;, &apos;6565&apos;, &apos;7878&apos;, &apos;8787&apos;, &apos;9090&apos;,
    &apos;0101&apos;, &apos;1010&apos;, &apos;2020&apos;, &apos;3030&apos;, &apos;4040&apos;, &apos;5050&apos;, &apos;6060&apos;, &apos;7070&apos;, &apos;8080&apos;, &apos;9009&apos;
  ];

  /**
   * Generate cryptographically secure 4-digit password
   */
  static generateSecure4DigitPassword(options: PasswordGenerationOptions = {}): string {
}
    const {
}
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
}
      const password = this.generateRandom4Digit();
      
      if (!allExcluded.includes(password) && this.isSecurePattern(password)) {
}
        return password;
      }
      
      attempts++;
    }

    // Fallback: if we can&apos;t generate a secure password, throw error
    throw new Error(&apos;Unable to generate secure password after maximum attempts&apos;);
  }

  /**
   * Generate multiple unique secure passwords
   */
  static generateMultipleSecurePasswords(count: number, options: PasswordGenerationOptions = {}): string[] {
}
    const passwords: string[] = [];
    const excludeSet = new Set([
      ...this.WEAK_PATTERNS,
      ...(options.excludePatterns || []),
      ...(options.excludeExisting || [])
    ]);

    for (let i = 0; i < count; i++) {
}
      const password = this.generateSecure4DigitPassword({
}
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
}
    // Use crypto.getRandomValues for cryptographic security
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    
    // Convert to 4-digit string (0000-9999)
    const number = array[0] % 10000;
    return number.toString().padStart(4, &apos;0&apos;);
  }

  /**
   * Check if pattern is considered secure
   */
  private static isSecurePattern(password: string): boolean {
}
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
}
    let ascending = 0;
    let descending = 0;
    
    for (let i = 1; i < password.length; i++) {
}
      const current = parseInt(password[i]);
      const previous = parseInt(password[i - 1]);
      
      if (current === previous + 1) ascending++;
      if (current === previous - 1) descending++;
    }
    
    // If 3 or more digits are sequential, it&apos;s weak
    return ascending >= 3 || descending >= 3;
  }

  /**
   * Check for too many repeated digits
   */
  private static hasTooManyRepeats(password: string): boolean {
}
    const digitCount = new Map<string, number>();
    
    for (const digit of password) {
}
      digitCount.set(digit, (digitCount.get(digit) || 0) + 1);
    }
    
    // If any digit appears 3 or more times, it&apos;s weak
    return Array.from(digitCount.values()).some((count: any) => count >= 3);
  }

  /**
   * Validate password strength
   */
  static validatePasswordStrength(password: string): {
}
    isValid: boolean;
    issues: string[];
    strength: &apos;weak&apos; | &apos;medium&apos; | &apos;strong&apos;;
  } {
}
    const issues: string[] = [];
    
    if (password.length !== 4) {
}
      issues.push(&apos;Password must be exactly 4 digits&apos;);
    }
    
    if (!/^\d{4}$/.test(password)) {
}
      issues.push(&apos;Password must contain only digits&apos;);
    }
    
    if (this.WEAK_PATTERNS.includes(password)) {
}
      issues.push(&apos;Password is a common weak pattern&apos;);
    }
    
    if (this.hasSequentialDigits(password)) {
}
      issues.push(&apos;Password contains too many sequential digits&apos;);
    }
    
    if (this.hasTooManyRepeats(password)) {
}
      issues.push(&apos;Password has too many repeated digits&apos;);
    }
    
    const isValid = issues.length === 0;
    const strength = isValid ? &apos;strong&apos; : (issues.length === 1 ? &apos;medium&apos; : &apos;weak&apos;);
    
    return { isValid, issues, strength };
  }

  /**
   * Log password generation for audit purposes (without exposing actual passwords)
   */
  static logPasswordGeneration(userId: string, success: boolean, attempts?: number): void {
}
    const logEntry = {
}
      timestamp: new Date().toISOString(),
      userId,
      action: &apos;password_generation&apos;,
      success,
      attempts: attempts || 1,
      // Never log actual passwords for security
      securityNote: &apos;Password values are never logged for security purposes&apos;
    };
    
    console.log(&apos;Password Generation Event:&apos;, logEntry);
    
    // In production, this would go to a secure audit log
    if (typeof window !== &apos;undefined&apos; && (window as any).__ASTRAL_AUDIT_LOG) {
}
      (window as any).__ASTRAL_AUDIT_LOG.push(logEntry);
    }
  }
}

export default SecurePasswordGenerator;