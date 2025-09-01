/**
 * Password Update Utility
 * Provides easy interface to update user passwords and test the system
 */

import SimpleAuthService from '../services/simpleAuthService';
import SecurePasswordGenerator from './securePasswordGenerator';

export class PasswordUpdateUtility {
  /**
   * Execute the password generation process
   */
  static async executePasswordUpdate(): Promise<{
    success: boolean;
    message: string;
    report?: any;
    errors?: string[];
  }> {
    try {
      console.log('🚀 Starting password update utility...');
      
      // Initialize auth service first
      SimpleAuthService.initialize();
      
      // Generate security report before update
      const reportBefore = SimpleAuthService.generatePasswordSecurityReport();
      console.log('📊 Security Report (Before):', reportBefore);
      
      // Execute password generation
      SimpleAuthService.generateRandomPasswordsForUsers();
      
      // Generate security report after update
      const reportAfter = SimpleAuthService.generatePasswordSecurityReport();
      console.log('📊 Security Report (After):', reportAfter);
      
      // Get password status for verification
      const passwordStatus = SimpleAuthService.getUserPasswordStatus();
      console.log('📋 User Password Status:', passwordStatus);
      
      return {
        success: true,
        message: `Successfully updated passwords for ${reportAfter.securePasswords} users`,
        report: {
          before: reportBefore,
          after: reportAfter,
          userStatus: passwordStatus
        }
      };
      
      console.log(`🔐 Generated ${count} sample secure passwords`);
      passwords.forEach((password, index) => {
        const validation = SecurePasswordGenerator.validatePasswordStrength(password);
        console.log(`  ${index + 1}. ${password} - Strength: ${validation.strength}`);
      });
      
      return passwords;
    
    } catch (error) {
      console.error('Failed to generate sample passwords:', error);
      return [];
    }
  }

  /**
   * Check system compatibility
   */
  static checkSystemCompatibility(): {
    cryptoSupported: boolean;
    localStorageAvailable: boolean;
    webWorkerSupported: boolean;
    issues: string[];
  } {
    const issues: string[] = [];
    
    // Check crypto API
    const cryptoSupported = typeof crypto !== 'undefined' && 
                           typeof crypto.getRandomValues === 'function';
    if (!cryptoSupported) {
      issues.push('Crypto API not available - passwords may be less secure');
    }

    // Check localStorage
    let localStorageAvailable = false;
    try {

      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      localStorageAvailable = true;
    } catch (e) {
      console.error('localStorage error:', e);
      localStorageAvailable = false;
      issues.push('localStorage not available - session management may fail');
    }

    // Check Web Worker support (for future enhancements)
    const webWorkerSupported = typeof Worker !== 'undefined';
    if (!webWorkerSupported) {
      issues.push('Web Workers not supported - performance may be reduced');
    }

    const result = {
      cryptoSupported,
      localStorageAvailable,
      webWorkerSupported,
      issues
    };

    console.log('🔍 System Compatibility Check:', result);
    return result;
  }

  /**
   * Emergency reset (for development/testing only)
   */
  static emergencyReset(): void {
    console.warn('⚠️ EMERGENCY RESET: Resetting all users to defaults');
    SimpleAuthService.resetAllUsers();
    console.log('✅ Reset complete - all users restored to default state');
  }

  /**
   * Demo the complete password update workflow
   */
  static async demonstrateWorkflow(): Promise<void> {
    console.log('🎬 Starting Password Update Workflow Demo');
    console.log('================================================');

    // Step 1: Check compatibility
    console.log('\n1️⃣ Checking system compatibility...');
    this.checkSystemCompatibility();

    // Step 2: Test password validation
    console.log('\n2️⃣ Testing password validation...');
    this.testPasswordValidation();

    // Step 3: Generate sample passwords
    console.log('\n3️⃣ Generating sample secure passwords...');
    this.generateSamplePasswords(3);

    // Step 4: Execute password update
    console.log('\n4️⃣ Executing password update...');
    const result = await this.executePasswordUpdate();
    
    if (result.success) {
      console.log('✅ Workflow completed successfully!');
      console.log('📈 Summary:', result.message);
    } else {
      console.error('❌ Workflow failed:', result.errors);
    }

    console.log('\n================================================');
    console.log('🎬 Demo Complete');
  }
}

// Export convenience functions for direct use
export const executePasswordUpdate = () => PasswordUpdateUtility.executePasswordUpdate();
export const testPasswordValidation = () => PasswordUpdateUtility.testPasswordValidation();
export const demonstrateWorkflow = () => PasswordUpdateUtility.demonstrateWorkflow();

export default PasswordUpdateUtility;