import { MatchEvent as IMatchEvent, VideoClip, StrikeType, TargetZone } from '../../../shared/types';

/**
 * MatchEvent data model with validation
 */
export class MatchEvent implements IMatchEvent {
  id: string;
  timestamp: number; // seconds from round start
  type: 'strike' | 'foul' | 'knockdown' | 'clinch' | 'break';
  fighter: string; // fighter ID
  details: {
    strikeType?: StrikeType;
    targetZone?: TargetZone;
    isClean?: boolean;
    impactForce?: number; // 0-100 scale
    confidence?: number; // AI confidence 0-1
  };
  videoClip?: VideoClip;

  constructor(data: Partial<IMatchEvent>) {
    this.id = data.id || '';
    this.timestamp = data.timestamp || 0;
    this.type = data.type || 'strike';
    this.fighter = data.fighter || '';
    this.details = data.details || {};
    this.videoClip = data.videoClip;
  }

  /**
   * Validate match event data
   */
  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // ID validation
    if (!this.id || this.id.trim().length === 0) {
      errors.push('Event ID is required');
    }

    // Timestamp validation
    if (this.timestamp < 0) {
      errors.push('Event timestamp cannot be negative');
    }

    if (this.timestamp > 300) { // 5 minutes max
      errors.push('Event timestamp cannot exceed 300 seconds');
    }

    // Type validation
    const validTypes = ['strike', 'foul', 'knockdown', 'clinch', 'break'];
    if (!validTypes.includes(this.type)) {
      errors.push('Invalid event type');
    }

    // Fighter validation
    if (!this.fighter || this.fighter.trim().length === 0) {
      errors.push('Fighter ID is required');
    }

    // Details validation based on event type
    if (this.type === 'strike') {
      const strikeValidation = this.validateStrikeDetails();
      if (!strikeValidation.isValid) {
        errors.push(...strikeValidation.errors);
      }
    }

    // Video clip validation
    if (this.videoClip) {
      const clipValidation = this.validateVideoClip(this.videoClip);
      if (!clipValidation.isValid) {
        errors.push(...clipValidation.errors);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate strike-specific details
   */
  private validateStrikeDetails(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Strike type validation
    if (this.details.strikeType) {
      const validStrikeTypes: StrikeType[] = [
        'jab', 'hook', 'cross', 'uppercut', 'low_kick', 'high_kick', 'body_kick', 'knee', 'elbow'
      ];
      if (!validStrikeTypes.includes(this.details.strikeType)) {
        errors.push('Invalid strike type');
      }
    }

    // Target zone validation
    if (this.details.targetZone) {
      const validTargetZones: TargetZone[] = ['head', 'body', 'legs', 'arms'];
      if (!validTargetZones.includes(this.details.targetZone)) {
        errors.push('Invalid target zone');
      }
    }

    // Impact force validation
    if (this.details.impactForce !== undefined) {
      if (this.details.impactForce < 0 || this.details.impactForce > 100) {
        errors.push('Impact force must be between 0 and 100');
      }
    }

    // Confidence validation
    if (this.details.confidence !== undefined) {
      if (this.details.confidence < 0 || this.details.confidence > 1) {
        errors.push('Confidence must be between 0 and 1');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate video clip data
   */
  private validateVideoClip(clip: VideoClip): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!clip.id || clip.id.trim().length === 0) {
      errors.push('Video clip ID is required');
    }

    if (clip.startTime < 0) {
      errors.push('Video clip start time cannot be negative');
    }

    if (clip.duration <= 0 || clip.duration > 30) {
      errors.push('Video clip duration must be between 0 and 30 seconds');
    }

    if (!clip.cameraAngle || clip.cameraAngle.trim().length === 0) {
      errors.push('Video clip camera angle is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if event is a strike
   */
  isStrike(): boolean {
    return this.type === 'strike';
  }

  /**
   * Check if strike is clean
   */
  isCleanStrike(): boolean {
    return this.type === 'strike' && this.details.isClean === true;
  }

  /**
   * Get strike points based on type and target
   */
  getStrikePoints(): number {
    if (this.type !== 'strike' || !this.details.isClean) {
      return 0;
    }

    // Point system: High-kick (3pts), Body shots (2pts), Jabs (1pt)
    switch (this.details.strikeType) {
      case 'high_kick':
        return 3;
      case 'hook':
      case 'cross':
      case 'uppercut':
      case 'body_kick':
      case 'knee':
        return 2;
      case 'jab':
      case 'low_kick':
        return 1;
      case 'elbow':
        return 2;
      default:
        return 1;
    }
  }

  /**
   * Check if event has high confidence
   */
  hasHighConfidence(): boolean {
    return (this.details.confidence || 0) >= 0.8;
  }

  /**
   * Convert to plain object for API responses
   */
  toJSON(): IMatchEvent {
    return {
      id: this.id,
      timestamp: this.timestamp,
      type: this.type,
      fighter: this.fighter,
      details: this.details,
      videoClip: this.videoClip
    };
  }

  /**
   * Create MatchEvent from database row
   */
  static fromDatabase(row: any): MatchEvent {
    return new MatchEvent({
      id: row.id,
      timestamp: row.timestamp,
      type: row.type,
      fighter: row.fighter_id,
      details: row.details || {},
      videoClip: row.video_clip
    });
  }
}

/**
 * MatchEvent validation utility functions
 */
export const MatchEventValidation = {
  /**
   * Validate event creation data
   */
  validateCreate(data: Partial<IMatchEvent>): { isValid: boolean; errors: string[] } {
    const event = new MatchEvent(data);
    return event.validate();
  },

  /**
   * Validate event update data
   */
  validateUpdate(data: Partial<IMatchEvent>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (data.timestamp !== undefined) {
      if (data.timestamp < 0 || data.timestamp > 300) {
        errors.push('Event timestamp must be between 0 and 300 seconds');
      }
    }

    if (data.type !== undefined) {
      const validTypes = ['strike', 'foul', 'knockdown', 'clinch', 'break'];
      if (!validTypes.includes(data.type)) {
        errors.push('Invalid event type');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Check if event ID is valid format
   */
  isValidId(id: string): boolean {
    return /^[a-zA-Z0-9-_]{1,50}$/.test(id);
  },

  /**
   * Generate event ID
   */
  generateId(matchId: string, roundNumber: number, timestamp: number): string {
    return `${matchId}-r${roundNumber}-${Math.floor(timestamp * 10)}`;
  },

  /**
   * Check if strike type is valid for target zone
   */
  isValidStrikeTargetCombination(strikeType: StrikeType, targetZone: TargetZone): boolean {
    const validCombinations: Record<StrikeType, TargetZone[]> = {
      'jab': ['head', 'body'],
      'hook': ['head', 'body'],
      'cross': ['head', 'body'],
      'uppercut': ['head', 'body'],
      'low_kick': ['legs'],
      'high_kick': ['head'],
      'body_kick': ['body'],
      'knee': ['head', 'body'],
      'elbow': ['head', 'body']
    };

    return validCombinations[strikeType]?.includes(targetZone) || false;
  }
};