import { Match as IMatch, Fighter, Round, VideoSource, MatchResult } from '../../../shared/types';

/**
 * Match data model with validation
 */
export class Match implements IMatch {
  id: string;
  fighters: [Fighter, Fighter];
  rounds: Round[];
  tournament: string;
  date: Date;
  videoSources: VideoSource[];
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  result?: MatchResult;

  constructor(data: Partial<IMatch>) {
    this.id = data.id || '';
    this.fighters = data.fighters || [{} as Fighter, {} as Fighter];
    this.rounds = data.rounds || [];
    this.tournament = data.tournament || '';
    this.date = data.date || new Date();
    this.videoSources = data.videoSources || [];
    this.status = data.status || 'scheduled';
    this.result = data.result;
  }

  /**
   * Validate match data
   */
  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // ID validation
    if (!this.id || this.id.trim().length === 0) {
      errors.push('Match ID is required');
    }

    // Fighters validation
    if (!this.fighters || this.fighters.length !== 2) {
      errors.push('Match must have exactly 2 fighters');
    } else {
      if (!this.fighters[0] || !this.fighters[0].id) {
        errors.push('Fighter A is required');
      }
      if (!this.fighters[1] || !this.fighters[1].id) {
        errors.push('Fighter B is required');
      }
      if (this.fighters[0]?.id === this.fighters[1]?.id) {
        errors.push('Fighters must be different');
      }
    }

    // Tournament validation
    if (!this.tournament || this.tournament.trim().length === 0) {
      errors.push('Tournament is required');
    }

    // Date validation
    if (!this.date || isNaN(this.date.getTime())) {
      errors.push('Valid match date is required');
    }

    // Status validation
    const validStatuses = ['scheduled', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(this.status)) {
      errors.push('Invalid match status');
    }

    // Rounds validation
    if (this.rounds.length > 12) {
      errors.push('Match cannot have more than 12 rounds');
    }

    // Video sources validation
    if (this.videoSources.length > 10) {
      errors.push('Match cannot have more than 10 video sources');
    }

    // Result validation (if match is completed)
    if (this.status === 'completed' && !this.result) {
      errors.push('Completed match must have a result');
    }

    if (this.result) {
      const resultValidation = this.validateResult(this.result);
      if (!resultValidation.isValid) {
        errors.push(...resultValidation.errors);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate match result
   */
  private validateResult(result: MatchResult): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Winner validation
    if (!result.winner) {
      errors.push('Match result must have a winner');
    } else if (![this.fighters[0].id, this.fighters[1].id].includes(result.winner)) {
      errors.push('Winner must be one of the match fighters');
    }

    // Method validation
    const validMethods = ['decision', 'knockout', 'technical_knockout', 'disqualification'];
    if (!validMethods.includes(result.method)) {
      errors.push('Invalid result method');
    }

    // Round and time validation for early finishes
    if (['knockout', 'technical_knockout', 'disqualification'].includes(result.method)) {
      if (result.round === undefined || result.round < 1) {
        errors.push('Round number is required for early finish');
      }
      if (result.time === undefined || result.time < 0) {
        errors.push('Time is required for early finish');
      }
    }

    // Score cards validation
    if (result.method === 'decision' && (!result.scoreCards || result.scoreCards.length === 0)) {
      errors.push('Decision result must have score cards');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Add a round to the match
   */
  addRound(round: Round): void {
    if (this.rounds.length >= 12) {
      throw new Error('Cannot add more than 12 rounds to a match');
    }
    this.rounds.push(round);
  }

  /**
   * Get current round number
   */
  getCurrentRound(): number {
    return this.rounds.length;
  }

  /**
   * Check if match is active
   */
  isActive(): boolean {
    return this.status === 'in_progress';
  }

  /**
   * Check if match is finished
   */
  isFinished(): boolean {
    return ['completed', 'cancelled'].includes(this.status);
  }

  /**
   * Get match duration in minutes
   */
  getDuration(): number {
    return this.rounds.reduce((total, round) => total + (round.duration / 60), 0);
  }

  /**
   * Convert to plain object for API responses
   */
  toJSON(): IMatch {
    return {
      id: this.id,
      fighters: this.fighters,
      rounds: this.rounds,
      tournament: this.tournament,
      date: this.date,
      videoSources: this.videoSources,
      status: this.status,
      result: this.result
    };
  }

  /**
   * Create Match from database row
   */
  static fromDatabase(row: any): Match {
    return new Match({
      id: row.id,
      fighters: [row.fighter_a, row.fighter_b],
      rounds: row.rounds || [],
      tournament: row.tournament,
      date: new Date(row.date),
      videoSources: row.video_sources || [],
      status: row.status,
      result: row.result
    });
  }
}

/**
 * Match validation utility functions
 */
export const MatchValidation = {
  /**
   * Validate match creation data
   */
  validateCreate(data: Partial<IMatch>): { isValid: boolean; errors: string[] } {
    const match = new Match(data);
    return match.validate();
  },

  /**
   * Validate match update data
   */
  validateUpdate(data: Partial<IMatch>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (data.status !== undefined) {
      const validStatuses = ['scheduled', 'in_progress', 'completed', 'cancelled'];
      if (!validStatuses.includes(data.status)) {
        errors.push('Invalid match status');
      }
    }

    if (data.date !== undefined) {
      if (!data.date || isNaN(data.date.getTime())) {
        errors.push('Valid match date is required');
      }
    }

    if (data.tournament !== undefined) {
      if (!data.tournament || data.tournament.trim().length === 0) {
        errors.push('Tournament is required');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Check if match ID is valid format
   */
  isValidId(id: string): boolean {
    return /^[a-zA-Z0-9-_]{1,50}$/.test(id);
  },

  /**
   * Validate status transition
   */
  isValidStatusTransition(from: string, to: string): boolean {
    const validTransitions: Record<string, string[]> = {
      'scheduled': ['in_progress', 'cancelled'],
      'in_progress': ['completed', 'cancelled'],
      'completed': [],
      'cancelled': []
    };

    return validTransitions[from]?.includes(to) || false;
  }
};