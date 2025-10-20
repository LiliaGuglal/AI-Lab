/**
 * Comprehensive validation utilities for KickAI Judge data models
 */

import { StrikeType, TargetZone, UserRole } from '../../../shared/types';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

/**
 * Common validation patterns and utilities
 */
export class ValidationUtils {
  
  /**
   * Validate UUID format
   */
  static isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate URL format
   */
  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate date is not in the future (for completed events)
   */
  static isValidPastDate(date: Date): boolean {
    return date <= new Date();
  }

  /**
   * Validate date is not too far in the past
   */
  static isReasonableDate(date: Date, maxYearsAgo: number = 10): boolean {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - maxYearsAgo);
    return date >= maxDate;
  }

  /**
   * Validate string length
   */
  static isValidLength(str: string, min: number, max: number): boolean {
    return str.length >= min && str.length <= max;
  }

  /**
   * Validate numeric range
   */
  static isInRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  }

  /**
   * Sanitize string input
   */
  static sanitizeString(input: string): string {
    return input.trim().replace(/\s+/g, ' ');
  }

  /**
   * Validate and sanitize name
   */
  static validateName(name: string): ValidationResult {
    const errors: string[] = [];
    const sanitized = this.sanitizeString(name);

    if (!sanitized) {
      errors.push('Name is required');
    } else if (sanitized.length < 2) {
      errors.push('Name must be at least 2 characters long');
    } else if (sanitized.length > 100) {
      errors.push('Name cannot exceed 100 characters');
    } else if (!/^[a-zA-Zа-яА-ЯіІїЇєЄ\s'-]+$/.test(sanitized)) {
      errors.push('Name contains invalid characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate weight (in kg)
   */
  static validateWeight(weight: number): ValidationResult {
    const errors: string[] = [];

    if (weight <= 0) {
      errors.push('Weight must be positive');
    } else if (weight < 40) {
      errors.push('Weight seems too low (minimum 40kg)');
    } else if (weight > 200) {
      errors.push('Weight seems too high (maximum 200kg)');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate reach (in cm)
   */
  static validateReach(reach: number): ValidationResult {
    const errors: string[] = [];

    if (reach <= 0) {
      errors.push('Reach must be positive');
    } else if (reach < 150) {
      errors.push('Reach seems too short (minimum 150cm)');
    } else if (reach > 250) {
      errors.push('Reach seems too long (maximum 250cm)');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate age
   */
  static validateAge(age: number): ValidationResult {
    const errors: string[] = [];

    if (age < 16) {
      errors.push('Fighter must be at least 16 years old');
    } else if (age > 60) {
      errors.push('Fighter age cannot exceed 60 years');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate strike type
   */
  static validateStrikeType(strikeType: string): ValidationResult {
    const errors: string[] = [];
    const validTypes: StrikeType[] = [
      'jab', 'hook', 'cross', 'uppercut', 'low_kick', 'high_kick', 'body_kick', 'knee', 'elbow'
    ];

    if (!validTypes.includes(strikeType as StrikeType)) {
      errors.push(`Invalid strike type: ${strikeType}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate target zone
   */
  static validateTargetZone(targetZone: string): ValidationResult {
    const errors: string[] = [];
    const validZones: TargetZone[] = ['head', 'body', 'legs', 'arms'];

    if (!validZones.includes(targetZone as TargetZone)) {
      errors.push(`Invalid target zone: ${targetZone}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate user role
   */
  static validateUserRole(role: string): ValidationResult {
    const errors: string[] = [];
    const validRoles: UserRole[] = ['judge', 'organizer', 'fan', 'fighter', 'admin'];

    if (!validRoles.includes(role as UserRole)) {
      errors.push(`Invalid user role: ${role}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate confidence score (0-1)
   */
  static validateConfidence(confidence: number): ValidationResult {
    const errors: string[] = [];

    if (confidence < 0 || confidence > 1) {
      errors.push('Confidence must be between 0 and 1');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate impact force (0-100)
   */
  static validateImpactForce(force: number): ValidationResult {
    const errors: string[] = [];

    if (force < 0 || force > 100) {
      errors.push('Impact force must be between 0 and 100');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate timestamp (seconds)
   */
  static validateTimestamp(timestamp: number, maxDuration: number = 300): ValidationResult {
    const errors: string[] = [];

    if (timestamp < 0) {
      errors.push('Timestamp cannot be negative');
    } else if (timestamp > maxDuration) {
      errors.push(`Timestamp cannot exceed ${maxDuration} seconds`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate video duration (seconds)
   */
  static validateVideoDuration(duration: number, minDuration: number = 1, maxDuration: number = 3600): ValidationResult {
    const errors: string[] = [];

    if (duration <= 0) {
      errors.push('Duration must be positive');
    } else if (duration < minDuration) {
      errors.push(`Duration must be at least ${minDuration} seconds`);
    } else if (duration > maxDuration) {
      errors.push(`Duration cannot exceed ${maxDuration} seconds`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate normalized coordinates (0-1)
   */
  static validateNormalizedCoordinate(coordinate: number): ValidationResult {
    const errors: string[] = [];

    if (coordinate < 0 || coordinate > 1) {
      errors.push('Coordinate must be between 0 and 1');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate color format (hex, rgb, or named)
   */
  static validateColor(color: string): ValidationResult {
    const errors: string[] = [];

    // Check hex colors
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
      return { isValid: true, errors: [] };
    }

    // Check rgb/rgba colors
    if (/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+)?\s*\)$/.test(color)) {
      return { isValid: true, errors: [] };
    }

    // Check named colors
    const namedColors = [
      'red', 'green', 'blue', 'yellow', 'orange', 'purple', 'pink', 'brown',
      'black', 'white', 'gray', 'grey', 'cyan', 'magenta', 'lime', 'navy'
    ];
    
    if (namedColors.includes(color.toLowerCase())) {
      return { isValid: true, errors: [] };
    }

    errors.push('Invalid color format (use hex, rgb, or named colors)');
    return {
      isValid: false,
      errors
    };
  }

  /**
   * Combine multiple validation results
   */
  static combineValidationResults(...results: ValidationResult[]): ValidationResult {
    const allErrors: string[] = [];
    const allWarnings: string[] = [];

    for (const result of results) {
      allErrors.push(...result.errors);
      if (result.warnings) {
        allWarnings.push(...result.warnings);
      }
    }

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings.length > 0 ? allWarnings : undefined
    };
  }

  /**
   * Validate required fields
   */
  static validateRequired(obj: any, requiredFields: string[]): ValidationResult {
    const errors: string[] = [];

    for (const field of requiredFields) {
      if (obj[field] === undefined || obj[field] === null || obj[field] === '') {
        errors.push(`${field} is required`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate object against schema
   */
  static validateSchema(obj: any, schema: Record<string, (value: any) => ValidationResult>): ValidationResult {
    const allResults: ValidationResult[] = [];

    for (const [field, validator] of Object.entries(schema)) {
      if (obj[field] !== undefined) {
        const result = validator(obj[field]);
        if (!result.isValid) {
          allResults.push({
            isValid: false,
            errors: result.errors.map(error => `${field}: ${error}`)
          });
        }
      }
    }

    return this.combineValidationResults(...allResults);
  }
}

/**
 * Specific validation schemas for common use cases
 */
export const ValidationSchemas = {
  /**
   * Fighter creation schema
   */
  fighterCreate: {
    name: (value: string) => ValidationUtils.validateName(value),
    weight: (value: number) => ValidationUtils.validateWeight(value),
    reach: (value: number) => ValidationUtils.validateReach(value),
    age: (value: number) => ValidationUtils.validateAge(value)
  },

  /**
   * Match event schema
   */
  matchEvent: {
    timestamp: (value: number) => ValidationUtils.validateTimestamp(value),
    strikeType: (value: string) => ValidationUtils.validateStrikeType(value),
    targetZone: (value: string) => ValidationUtils.validateTargetZone(value),
    confidence: (value: number) => ValidationUtils.validateConfidence(value),
    impactForce: (value: number) => ValidationUtils.validateImpactForce(value)
  },

  /**
   * Video clip schema
   */
  videoClip: {
    duration: (value: number) => ValidationUtils.validateVideoDuration(value, 1, 30),
    startTime: (value: number) => ValidationUtils.validateTimestamp(value, 7200) // 2 hours max
  },

  /**
   * Annotation schema
   */
  annotation: {
    positionX: (value: number) => ValidationUtils.validateNormalizedCoordinate(value),
    positionY: (value: number) => ValidationUtils.validateNormalizedCoordinate(value),
    color: (value: string) => ValidationUtils.validateColor(value)
  }
};