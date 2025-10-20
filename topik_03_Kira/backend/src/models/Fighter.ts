import { Fighter as IFighter } from '../../../shared/types';

/**
 * Fighter data model with validation
 */
export class Fighter implements IFighter {
  id: string;
  name: string;
  weight: number;
  stance: 'orthodox' | 'southpaw';
  reach: number;
  nationality?: string;
  age?: number;

  constructor(data: Partial<IFighter>) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.weight = data.weight || 0;
    this.stance = data.stance || 'orthodox';
    this.reach = data.reach || 0;
    this.nationality = data.nationality;
    this.age = data.age;
  }

  /**
   * Validate fighter data
   */
  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // ID validation
    if (!this.id || this.id.trim().length === 0) {
      errors.push('Fighter ID is required');
    }

    // Name validation
    if (!this.name || this.name.trim().length < 2) {
      errors.push('Fighter name must be at least 2 characters long');
    }

    if (this.name && this.name.length > 100) {
      errors.push('Fighter name cannot exceed 100 characters');
    }

    // Weight validation (in kg)
    if (this.weight <= 0 || this.weight > 200) {
      errors.push('Fighter weight must be between 1 and 200 kg');
    }

    // Stance validation
    if (!['orthodox', 'southpaw'].includes(this.stance)) {
      errors.push('Fighter stance must be either orthodox or southpaw');
    }

    // Reach validation (in cm)
    if (this.reach <= 0 || this.reach > 250) {
      errors.push('Fighter reach must be between 1 and 250 cm');
    }

    // Age validation (optional)
    if (this.age !== undefined && (this.age < 16 || this.age > 60)) {
      errors.push('Fighter age must be between 16 and 60 years');
    }

    // Nationality validation (optional)
    if (this.nationality && this.nationality.length > 50) {
      errors.push('Nationality cannot exceed 50 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Convert to plain object for API responses
   */
  toJSON(): IFighter {
    return {
      id: this.id,
      name: this.name,
      weight: this.weight,
      stance: this.stance,
      reach: this.reach,
      nationality: this.nationality,
      age: this.age
    };
  }

  /**
   * Create Fighter from database row
   */
  static fromDatabase(row: any): Fighter {
    return new Fighter({
      id: row.id,
      name: row.name,
      weight: row.weight,
      stance: row.stance,
      reach: row.reach,
      nationality: row.nationality,
      age: row.age
    });
  }
}

/**
 * Fighter validation utility functions
 */
export const FighterValidation = {
  /**
   * Validate fighter creation data
   */
  validateCreate(data: Partial<IFighter>): { isValid: boolean; errors: string[] } {
    const fighter = new Fighter(data);
    return fighter.validate();
  },

  /**
   * Validate fighter update data
   */
  validateUpdate(data: Partial<IFighter>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Only validate provided fields for updates
    if (data.name !== undefined) {
      if (!data.name || data.name.trim().length < 2) {
        errors.push('Fighter name must be at least 2 characters long');
      }
      if (data.name.length > 100) {
        errors.push('Fighter name cannot exceed 100 characters');
      }
    }

    if (data.weight !== undefined) {
      if (data.weight <= 0 || data.weight > 200) {
        errors.push('Fighter weight must be between 1 and 200 kg');
      }
    }

    if (data.stance !== undefined) {
      if (!['orthodox', 'southpaw'].includes(data.stance)) {
        errors.push('Fighter stance must be either orthodox or southpaw');
      }
    }

    if (data.reach !== undefined) {
      if (data.reach <= 0 || data.reach > 250) {
        errors.push('Fighter reach must be between 1 and 250 cm');
      }
    }

    if (data.age !== undefined) {
      if (data.age < 16 || data.age > 60) {
        errors.push('Fighter age must be between 16 and 60 years');
      }
    }

    if (data.nationality !== undefined && data.nationality.length > 50) {
      errors.push('Nationality cannot exceed 50 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Check if fighter ID is valid format
   */
  isValidId(id: string): boolean {
    return /^[a-zA-Z0-9-_]{1,50}$/.test(id);
  }
};