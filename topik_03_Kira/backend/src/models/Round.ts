import { Round as IRound, MatchEvent, MatchStatistics } from '../../../shared/types';

/**
 * Round data model with validation
 */
export class Round implements IRound {
  number: number;
  duration: number; // seconds
  events: MatchEvent[];
  statistics: MatchStatistics[];
  startTime?: Date;
  endTime?: Date;

  constructor(data: Partial<IRound>) {
    this.number = data.number || 1;
    this.duration = data.duration || 180; // 3 minutes default
    this.events = data.events || [];
    this.statistics = data.statistics || [];
    this.startTime = data.startTime;
    this.endTime = data.endTime;
  }

  /**
   * Validate round data
   */
  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Round number validation
    if (this.number < 1 || this.number > 12) {
      errors.push('Round number must be between 1 and 12');
    }

    // Duration validation (30 seconds to 5 minutes)
    if (this.duration < 30 || this.duration > 300) {
      errors.push('Round duration must be between 30 and 300 seconds');
    }

    // Time validation
    if (this.startTime && this.endTime) {
      if (this.endTime <= this.startTime) {
        errors.push('End time must be after start time');
      }

      const actualDuration = (this.endTime.getTime() - this.startTime.getTime()) / 1000;
      if (Math.abs(actualDuration - this.duration) > 10) {
        errors.push('Actual duration does not match specified duration');
      }
    }

    // Events validation
    for (const event of this.events) {
      if (event.timestamp < 0 || event.timestamp > this.duration) {
        errors.push(`Event timestamp ${event.timestamp} is outside round duration`);
      }
    }

    // Statistics validation
    if (this.statistics.length > 2) {
      errors.push('Round cannot have statistics for more than 2 fighters');
    }

    for (const stat of this.statistics) {
      if (stat.roundNumber !== this.number) {
        errors.push('Statistics round number must match round number');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Add an event to the round
   */
  addEvent(event: MatchEvent): void {
    if (event.timestamp < 0 || event.timestamp > this.duration) {
      throw new Error('Event timestamp is outside round duration');
    }
    this.events.push(event);
    this.sortEvents();
  }

  /**
   * Sort events by timestamp
   */
  private sortEvents(): void {
    this.events.sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Get events by type
   */
  getEventsByType(type: string): MatchEvent[] {
    return this.events.filter(event => event.type === type);
  }

  /**
   * Get events by fighter
   */
  getEventsByFighter(fighterId: string): MatchEvent[] {
    return this.events.filter(event => event.fighter === fighterId);
  }

  /**
   * Get strikes count for a fighter
   */
  getStrikesCount(fighterId: string): number {
    return this.events.filter(
      event => event.type === 'strike' && event.fighter === fighterId
    ).length;
  }

  /**
   * Get clean hits count for a fighter
   */
  getCleanHitsCount(fighterId: string): number {
    return this.events.filter(
      event => event.type === 'strike' && 
               event.fighter === fighterId && 
               event.details.isClean === true
    ).length;
  }

  /**
   * Check if round is completed
   */
  isCompleted(): boolean {
    return this.endTime !== undefined;
  }

  /**
   * Get round progress (0-1)
   */
  getProgress(): number {
    if (!this.startTime) return 0;
    if (this.endTime) return 1;

    const elapsed = (Date.now() - this.startTime.getTime()) / 1000;
    return Math.min(elapsed / this.duration, 1);
  }

  /**
   * Get remaining time in seconds
   */
  getRemainingTime(): number {
    if (!this.startTime || this.endTime) return 0;
    
    const elapsed = (Date.now() - this.startTime.getTime()) / 1000;
    return Math.max(this.duration - elapsed, 0);
  }

  /**
   * Convert to plain object for API responses
   */
  toJSON(): IRound {
    return {
      number: this.number,
      duration: this.duration,
      events: this.events,
      statistics: this.statistics,
      startTime: this.startTime,
      endTime: this.endTime
    };
  }

  /**
   * Create Round from database row
   */
  static fromDatabase(row: any): Round {
    return new Round({
      number: row.number,
      duration: row.duration,
      events: row.events || [],
      statistics: row.statistics || [],
      startTime: row.start_time ? new Date(row.start_time) : undefined,
      endTime: row.end_time ? new Date(row.end_time) : undefined
    });
  }
}

/**
 * Round validation utility functions
 */
export const RoundValidation = {
  /**
   * Validate round creation data
   */
  validateCreate(data: Partial<IRound>): { isValid: boolean; errors: string[] } {
    const round = new Round(data);
    return round.validate();
  },

  /**
   * Validate round update data
   */
  validateUpdate(data: Partial<IRound>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (data.number !== undefined) {
      if (data.number < 1 || data.number > 12) {
        errors.push('Round number must be between 1 and 12');
      }
    }

    if (data.duration !== undefined) {
      if (data.duration < 30 || data.duration > 300) {
        errors.push('Round duration must be between 30 and 300 seconds');
      }
    }

    if (data.startTime && data.endTime) {
      if (data.endTime <= data.startTime) {
        errors.push('End time must be after start time');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Validate event timestamp
   */
  isValidEventTimestamp(timestamp: number, roundDuration: number): boolean {
    return timestamp >= 0 && timestamp <= roundDuration;
  },

  /**
   * Check if round duration is standard
   */
  isStandardDuration(duration: number): boolean {
    const standardDurations = [120, 180, 240]; // 2, 3, 4 minutes
    return standardDurations.includes(duration);
  }
};