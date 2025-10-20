/**
 * KickAI Judge Data Models
 * 
 * This module exports all data models with validation for the KickAI Judge system.
 * Each model includes comprehensive validation, type safety, and utility methods.
 */

// Core entity models
export { Fighter, FighterValidation } from './Fighter';
export { Match, MatchValidation } from './Match';
export { Round, RoundValidation } from './Round';
export { MatchEvent, MatchEventValidation } from './MatchEvent';
export { VideoClip, VideoClipValidation } from './VideoClip';
export { Annotation, AnnotationValidation } from './Annotation';

// Validation utilities
export { ValidationUtils, ValidationSchemas } from './ValidationUtils';
export type { ValidationResult } from './ValidationUtils';

// Re-export shared types for convenience
export type {
  Fighter as IFighter,
  Match as IMatch,
  Round as IRound,
  MatchEvent as IMatchEvent,
  VideoClip as IVideoClip,
  Annotation as IAnnotation,
  MatchStatistics,
  VideoSource,
  MatchResult,
  ScoreCard,
  StrikeType,
  TargetZone,
  UserRole,
  ApiResponse,
  PaginatedResponse,
  LiveUpdate,
  User,
  UserPreferences,
  Tournament,
  TournamentSettings,
  PoseData,
  Landmark,
  StrikeDetection,
  Point,
  SystemConfig
} from '../../../shared/types';

/**
 * Model factory functions for creating instances with validation
 */
export class ModelFactory {
  
  /**
   * Create and validate a Fighter instance
   */
  static createFighter(data: Partial<import('../../../shared/types').Fighter>): Fighter {
    const fighter = new Fighter(data);
    const validation = fighter.validate();
    
    if (!validation.isValid) {
      throw new Error(`Invalid fighter data: ${validation.errors.join(', ')}`);
    }
    
    return fighter;
  }

  /**
   * Create and validate a Match instance
   */
  static createMatch(data: Partial<import('../../../shared/types').Match>): Match {
    const match = new Match(data);
    const validation = match.validate();
    
    if (!validation.isValid) {
      throw new Error(`Invalid match data: ${validation.errors.join(', ')}`);
    }
    
    return match;
  }

  /**
   * Create and validate a Round instance
   */
  static createRound(data: Partial<import('../../../shared/types').Round>): Round {
    const round = new Round(data);
    const validation = round.validate();
    
    if (!validation.isValid) {
      throw new Error(`Invalid round data: ${validation.errors.join(', ')}`);
    }
    
    return round;
  }

  /**
   * Create and validate a MatchEvent instance
   */
  static createMatchEvent(data: Partial<import('../../../shared/types').MatchEvent>): MatchEvent {
    const event = new MatchEvent(data);
    const validation = event.validate();
    
    if (!validation.isValid) {
      throw new Error(`Invalid match event data: ${validation.errors.join(', ')}`);
    }
    
    return event;
  }

  /**
   * Create and validate a VideoClip instance
   */
  static createVideoClip(data: Partial<import('../../../shared/types').VideoClip>): VideoClip {
    const clip = new VideoClip(data);
    const validation = clip.validate();
    
    if (!validation.isValid) {
      throw new Error(`Invalid video clip data: ${validation.errors.join(', ')}`);
    }
    
    return clip;
  }

  /**
   * Create and validate an Annotation instance
   */
  static createAnnotation(data: Partial<import('../../../shared/types').Annotation>): Annotation {
    const annotation = new Annotation(data);
    const validation = annotation.validate();
    
    if (!validation.isValid) {
      throw new Error(`Invalid annotation data: ${validation.errors.join(', ')}`);
    }
    
    return annotation;
  }
}

/**
 * Utility functions for working with models
 */
export class ModelUtils {
  
  /**
   * Generate a unique ID for entities
   */
  static generateId(prefix: string = ''): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`;
  }

  /**
   * Validate multiple models at once
   */
  static validateModels(...models: Array<{ validate(): ValidationResult }>): ValidationResult {
    const allErrors: string[] = [];
    
    for (const model of models) {
      const validation = model.validate();
      if (!validation.isValid) {
        allErrors.push(...validation.errors);
      }
    }
    
    return {
      isValid: allErrors.length === 0,
      errors: allErrors
    };
  }

  /**
   * Convert models to JSON for API responses
   */
  static toJSON<T>(model: { toJSON(): T }): T {
    return model.toJSON();
  }

  /**
   * Convert array of models to JSON
   */
  static arrayToJSON<T>(models: Array<{ toJSON(): T }>): T[] {
    return models.map(model => model.toJSON());
  }

  /**
   * Filter models by validation status
   */
  static filterValid<T extends { validate(): ValidationResult }>(models: T[]): T[] {
    return models.filter(model => model.validate().isValid);
  }

  /**
   * Get validation errors for array of models
   */
  static getValidationErrors<T extends { validate(): ValidationResult }>(models: T[]): string[] {
    const errors: string[] = [];
    
    models.forEach((model, index) => {
      const validation = model.validate();
      if (!validation.isValid) {
        errors.push(`Model ${index}: ${validation.errors.join(', ')}`);
      }
    });
    
    return errors;
  }
}

// Import the actual classes for the factory
import { Fighter } from './Fighter';
import { Match } from './Match';
import { Round } from './Round';
import { MatchEvent } from './MatchEvent';
import { VideoClip } from './VideoClip';
import { Annotation } from './Annotation';