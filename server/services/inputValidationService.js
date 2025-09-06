/**
 * Input Validation and Sanitization Service
 * Provides comprehensive input validation, sanitization, and XSS prevention
 */

const validator = require('validator');
const DOMPurify = require('isomorphic-dompurify');
const xss = require('xss');
const sqlstring = require('sqlstring');

class InputValidationService {
  constructor() {
    this.xssOptions = {
      allowList: {
        'b': [],
        'i': [],
        'em': [],
        'strong': [],
        'u': [],
        'br': [],
        'p': [],
        'ul': [],
        'ol': [],
        'li': [],
        'h1': [],
        'h2': [],
        'h3': [],
        'h4': [],
        'h5': [],
        'h6': []
      },
      stripIgnoreTag: true,
      stripIgnoreTagBody: ['script', 'style', 'iframe', 'object', 'embed']
    };
  }

  /**
   * Comprehensive input sanitization
   */
  sanitizeInput(input, options = {}) {
    if (!input) return input;

    const {
      allowHTML = false,
      maxLength = 10000,
      allowSpecialChars = true,
      trimWhitespace = true
    } = options;

    let sanitized = input;

    // Trim whitespace if requested
    if (trimWhitespace && typeof sanitized === 'string') {
      sanitized = sanitized.trim();
    }

    // Length validation
    if (typeof sanitized === 'string' && sanitized.length > maxLength) {
      throw new Error(`Input exceeds maximum length of ${maxLength} characters`);
    }

    // HTML sanitization
    if (typeof sanitized === 'string') {
      if (allowHTML) {
        // Allow safe HTML tags
        sanitized = xss(sanitized, this.xssOptions);
      } else {
        // Strip all HTML
        sanitized = this.stripHTML(sanitized);
      }

      // Remove potentially dangerous characters if not allowed
      if (!allowSpecialChars) {
        sanitized = this.removeDangerousChars(sanitized);
      }

      // Escape for SQL (additional protection)
      sanitized = this.escapeSQLChars(sanitized);
    }

    return sanitized;
  }

  /**
   * Validate user registration data
   */
  validateRegistrationData(data) {
    const errors = [];

    // Username validation
    if (!data.username) {
      errors.push({ field: 'username', message: 'Username is required' });
    } else {
      if (data.username.length < 3) {
        errors.push({ field: 'username', message: 'Username must be at least 3 characters long' });
      }
      if (data.username.length > 30) {
        errors.push({ field: 'username', message: 'Username cannot exceed 30 characters' });
      }
      if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
        errors.push({ field: 'username', message: 'Username can only contain letters, numbers, and underscores' });
      }
    }

    // Email validation
    if (!data.email) {
      errors.push({ field: 'email', message: 'Email is required' });
    } else if (!validator.isEmail(data.email)) {
      errors.push({ field: 'email', message: 'Please provide a valid email address' });
    }

    // Password validation
    if (!data.password) {
      errors.push({ field: 'password', message: 'Password is required' });
    } else {
      const passwordErrors = this.validatePassword(data.password);
      errors.push(...passwordErrors);
    }

    // Display name validation (optional)
    if (data.displayName) {
      if (data.displayName.length > 50) {
        errors.push({ field: 'displayName', message: 'Display name cannot exceed 50 characters' });
      }
      data.displayName = this.sanitizeInput(data.displayName, {
        allowHTML: false,
        maxLength: 50,
        allowSpecialChars: false
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData: {
        username: this.sanitizeInput(data.username, { allowHTML: false, maxLength: 30, allowSpecialChars: false }),
        email: validator.normalizeEmail(data.email),
        password: data.password, // Don't sanitize passwords
        displayName: data.displayName
      }
    };
  }

  /**
   * Validate password strength
   */
  validatePassword(password) {
    const errors = [];

    if (password.length < 8) {
      errors.push({ field: 'password', message: 'Password must be at least 8 characters long' });
    }

    if (password.length > 128) {
      errors.push({ field: 'password', message: 'Password cannot exceed 128 characters' });
    }

    if (!/[a-z]/.test(password)) {
      errors.push({ field: 'password', message: 'Password must contain at least one lowercase letter' });
    }

    if (!/[A-Z]/.test(password)) {
      errors.push({ field: 'password', message: 'Password must contain at least one uppercase letter' });
    }

    if (!/\d/.test(password)) {
      errors.push({ field: 'password', message: 'Password must contain at least one number' });
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push({ field: 'password', message: 'Password must contain at least one special character' });
    }

    // Check for common patterns
    const commonPatterns = [
      /(.)\1{2,}/, // Repeated characters
      /123|234|345|456|567|678|789|890/, // Sequential numbers
      /abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i // Sequential letters
    ];

    commonPatterns.forEach(pattern => {
      if (pattern.test(password)) {
        errors.push({ field: 'password', message: 'Password contains predictable patterns' });
      }
    });

    return errors;
  }

  /**
   * Validate league creation data
   */
  validateLeagueData(data) {
    const errors = [];
    const sanitized = {};

    // League name
    if (!data.name) {
      errors.push({ field: 'name', message: 'League name is required' });
    } else {
      sanitized.name = this.sanitizeInput(data.name, {
        allowHTML: false,
        maxLength: 100,
        allowSpecialChars: true
      });
    }

    // Description (optional)
    if (data.description) {
      sanitized.description = this.sanitizeInput(data.description, {
        allowHTML: true,
        maxLength: 5000,
        allowSpecialChars: true
      });
    }

    // Team count validation
    if (data.maxTeams) {
      if (!Number.isInteger(data.maxTeams) || data.maxTeams < 4 || data.maxTeams > 32) {
        errors.push({ field: 'maxTeams', message: 'Maximum teams must be between 4 and 32' });
      } else {
        sanitized.maxTeams = data.maxTeams;
      }
    }

    // Scoring settings
    if (data.scoringType && !['standard', 'ppr', 'half-ppr'].includes(data.scoringType)) {
      errors.push({ field: 'scoringType', message: 'Invalid scoring type' });
    } else {
      sanitized.scoringType = data.scoringType;
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData: sanitized
    };
  }

  /**
   * Validate and sanitize user profile data
   */
  validateProfileData(data) {
    const errors = [];
    const sanitized = {};

    // Display name
    if (data.displayName) {
      if (data.displayName.length > 50) {
        errors.push({ field: 'displayName', message: 'Display name cannot exceed 50 characters' });
      } else {
        sanitized.displayName = this.sanitizeInput(data.displayName, {
          allowHTML: false,
          maxLength: 50,
          allowSpecialChars: true
        });
      }
    }

    // Bio (optional)
    if (data.bio) {
      sanitized.bio = this.sanitizeInput(data.bio, {
        allowHTML: true,
        maxLength: 1000,
        allowSpecialChars: true
      });
    }

    // Avatar (validate URL or emoji)
    if (data.avatar) {
      if (validator.isURL(data.avatar)) {
        // Validate image URL
        if (!this.isValidImageURL(data.avatar)) {
          errors.push({ field: 'avatar', message: 'Avatar must be a valid image URL' });
        } else {
          sanitized.avatar = data.avatar;
        }
      } else if (this.isEmoji(data.avatar)) {
        sanitized.avatar = data.avatar;
      } else {
        errors.push({ field: 'avatar', message: 'Avatar must be a valid URL or emoji' });
      }
    }

    // Favorite teams (array validation)
    if (data.favoriteTeams && Array.isArray(data.favoriteTeams)) {
      if (data.favoriteTeams.length > 5) {
        errors.push({ field: 'favoriteTeams', message: 'Cannot have more than 5 favorite teams' });
      } else {
        sanitized.favoriteTeams = data.favoriteTeams.map(team => 
          this.sanitizeInput(team, { allowHTML: false, maxLength: 50, allowSpecialChars: false })
        );
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData: sanitized
    };
  }

  /**
   * Validate search queries
   */
  validateSearchQuery(query, options = {}) {
    const {
      maxLength = 100,
      minLength = 1,
      allowSpecialChars = false
    } = options;

    const errors = [];

    if (!query || typeof query !== 'string') {
      errors.push({ field: 'query', message: 'Search query is required' });
      return { isValid: false, errors, sanitizedQuery: '' };
    }

    if (query.length < minLength) {
      errors.push({ field: 'query', message: `Query must be at least ${minLength} characters long` });
    }

    if (query.length > maxLength) {
      errors.push({ field: 'query', message: `Query cannot exceed ${maxLength} characters` });
    }

    // Sanitize the query
    let sanitizedQuery = this.sanitizeInput(query, {
      allowHTML: false,
      maxLength,
      allowSpecialChars,
      trimWhitespace: true
    });

    // Remove SQL injection patterns
    sanitizedQuery = this.removeSQLInjectionPatterns(sanitizedQuery);

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedQuery
    };
  }

  /**
   * Validate API request data
   */
  validateAPIRequest(data, schema) {
    const errors = [];
    const sanitized = {};

    Object.keys(schema).forEach(field => {
      const fieldSchema = schema[field];
      const value = data[field];

      // Required field validation
      if (fieldSchema.required && (value === undefined || value === null || value === '')) {
        errors.push({ field, message: `${field} is required` });
        return;
      }

      if (value !== undefined && value !== null) {
        // Type validation
        if (fieldSchema.type && typeof value !== fieldSchema.type) {
          errors.push({ field, message: `${field} must be of type ${fieldSchema.type}` });
          return;
        }

        // Length validation for strings
        if (typeof value === 'string') {
          if (fieldSchema.minLength && value.length < fieldSchema.minLength) {
            errors.push({ field, message: `${field} must be at least ${fieldSchema.minLength} characters long` });
          }
          if (fieldSchema.maxLength && value.length > fieldSchema.maxLength) {
            errors.push({ field, message: `${field} cannot exceed ${fieldSchema.maxLength} characters` });
          }
        }

        // Range validation for numbers
        if (typeof value === 'number') {
          if (fieldSchema.min !== undefined && value < fieldSchema.min) {
            errors.push({ field, message: `${field} must be at least ${fieldSchema.min}` });
          }
          if (fieldSchema.max !== undefined && value > fieldSchema.max) {
            errors.push({ field, message: `${field} cannot exceed ${fieldSchema.max}` });
          }
        }

        // Enum validation
        if (fieldSchema.enum && !fieldSchema.enum.includes(value)) {
          errors.push({ field, message: `${field} must be one of: ${fieldSchema.enum.join(', ')}` });
        }

        // Custom validation
        if (fieldSchema.validate && typeof fieldSchema.validate === 'function') {
          const customError = fieldSchema.validate(value);
          if (customError) {
            errors.push({ field, message: customError });
          }
        }

        // Sanitize the value
        if (typeof value === 'string') {
          sanitized[field] = this.sanitizeInput(value, {
            allowHTML: fieldSchema.allowHTML || false,
            maxLength: fieldSchema.maxLength || 10000,
            allowSpecialChars: fieldSchema.allowSpecialChars !== false
          });
        } else {
          sanitized[field] = value;
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData: sanitized
    };
  }

  /**
   * Helper methods
   */
  stripHTML(input) {
    return input.replace(/<[^>]*>/g, '');
  }

  removeDangerousChars(input) {
    // Remove characters commonly used in attacks
    return input.replace(/[<>'"&]/g, '');
  }

  escapeSQLChars(input) {
    return sqlstring.escape(input).slice(1, -1); // Remove surrounding quotes
  }

  removeSQLInjectionPatterns(input) {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
      /(--|\*\/|\*\*)/g,
      /(\bOR\b|\bAND\b).*(\b=\b)/gi,
      /['"`;\\]/g
    ];

    let sanitized = input;
    sqlPatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });

    return sanitized;
  }

  isValidImageURL(url) {
    const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|svg|webp)(\?.*)?$/i;
    return imageExtensions.test(url);
  }

  isEmoji(text) {
    const emojiRegex = /^[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e0}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]+$/u;
    return emojiRegex.test(text);
  }

  /**
   * File upload validation
   */
  validateFileUpload(file, options = {}) {
    const {
      maxSize = 5 * 1024 * 1024, // 5MB default
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif'],
      allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif']
    } = options;

    const errors = [];

    if (!file) {
      errors.push({ field: 'file', message: 'File is required' });
      return { isValid: false, errors };
    }

    // Size validation
    if (file.size > maxSize) {
      errors.push({ 
        field: 'file', 
        message: `File size cannot exceed ${Math.round(maxSize / 1024 / 1024)}MB` 
      });
    }

    // Type validation
    if (!allowedTypes.includes(file.mimetype)) {
      errors.push({ 
        field: 'file', 
        message: `File type must be one of: ${allowedTypes.join(', ')}` 
      });
    }

    // Extension validation
    const fileExt = '.' + file.originalname.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(fileExt)) {
      errors.push({ 
        field: 'file', 
        message: `File extension must be one of: ${allowedExtensions.join(', ')}` 
      });
    }

    // Filename validation
    const sanitizedFilename = this.sanitizeFilename(file.originalname);
    
    return {
      isValid: errors.length === 0,
      errors,
      sanitizedFilename
    };
  }

  sanitizeFilename(filename) {
    // Remove dangerous characters and normalize
    return filename
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/_{2,}/g, '_')
      .substring(0, 255);
  }
}

module.exports = new InputValidationService();