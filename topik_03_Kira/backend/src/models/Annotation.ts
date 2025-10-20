import { Annotation as IAnnotation } from '../../../shared/types';

/**
 * Annotation data model with validation
 */
export class Annotation implements IAnnotation {
  id: string;
  type: 'arrow' | 'highlight' | 'slowmotion' | 'circle' | 'text';
  position: { x: number; y: number };
  description: string;
  color?: string;
  size?: number;

  constructor(data: Partial<IAnnotation>) {
    this.id = data.id || '';
    this.type = data.type || 'highlight';
    this.position = data.position || { x: 0.5, y: 0.5 };
    this.description = data.description || '';
    this.color = data.color;
    this.size = data.size;
  }

  /**
   * Validate annotation data
   */
  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // ID validation
    if (!this.id || this.id.trim().length === 0) {
      errors.push('Annotation ID is required');
    }

    // Type validation
    const validTypes = ['arrow', 'highlight', 'slowmotion', 'circle', 'text'];
    if (!validTypes.includes(this.type)) {
      errors.push('Invalid annotation type');
    }

    // Position validation (normalized coordinates 0-1)
    if (this.position.x < 0 || this.position.x > 1) {
      errors.push('Annotation X position must be between 0 and 1');
    }

    if (this.position.y < 0 || this.position.y > 1) {
      errors.push('Annotation Y position must be between 0 and 1');
    }

    // Description validation
    if (!this.description || this.description.trim().length === 0) {
      errors.push('Annotation description is required');
    }

    if (this.description.length > 200) {
      errors.push('Annotation description cannot exceed 200 characters');
    }

    // Color validation (optional)
    if (this.color && !this.isValidColor(this.color)) {
      errors.push('Invalid color format (use hex, rgb, or named colors)');
    }

    // Size validation (optional)
    if (this.size !== undefined) {
      if (this.size < 1 || this.size > 100) {
        errors.push('Annotation size must be between 1 and 100');
      }
    }

    // Type-specific validations
    const typeValidation = this.validateByType();
    if (!typeValidation.isValid) {
      errors.push(...typeValidation.errors);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate annotation based on its type
   */
  private validateByType(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    switch (this.type) {
      case 'arrow':
        // Arrows should have direction information in description
        if (!this.description.toLowerCase().includes('удар') && 
            !this.description.toLowerCase().includes('рух') &&
            !this.description.toLowerCase().includes('напрямок')) {
          console.warn('Arrow annotation should describe direction or movement');
        }
        break;

      case 'highlight':
        // Highlights should specify what is being highlighted
        if (this.description.length < 5) {
          errors.push('Highlight annotation description should be more descriptive');
        }
        break;

      case 'slowmotion':
        // Slow motion annotations should indicate the action
        if (!this.description.toLowerCase().includes('повільно') &&
            !this.description.toLowerCase().includes('slow')) {
          console.warn('Slow motion annotation should indicate slow motion playback');
        }
        break;

      case 'circle':
        // Circles should have appropriate size
        if (this.size && (this.size < 10 || this.size > 50)) {
          console.warn('Circle annotation size should typically be between 10-50');
        }
        break;

      case 'text':
        // Text annotations should have meaningful content
        if (this.description.length < 3) {
          errors.push('Text annotation must have at least 3 characters');
        }
        break;
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate color format
   */
  private isValidColor(color: string): boolean {
    // Check hex colors
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
      return true;
    }

    // Check rgb/rgba colors
    if (/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+)?\s*\)$/.test(color)) {
      return true;
    }

    // Check named colors
    const namedColors = [
      'red', 'green', 'blue', 'yellow', 'orange', 'purple', 'pink', 'brown',
      'black', 'white', 'gray', 'grey', 'cyan', 'magenta', 'lime', 'navy'
    ];
    
    return namedColors.includes(color.toLowerCase());
  }

  /**
   * Get default color for annotation type
   */
  getDefaultColor(): string {
    const defaultColors = {
      arrow: '#ff0000',      // Red
      highlight: '#ffff00',  // Yellow
      slowmotion: '#00ff00', // Green
      circle: '#0000ff',     // Blue
      text: '#ffffff'        // White
    };

    return defaultColors[this.type] || '#ffffff';
  }

  /**
   * Get default size for annotation type
   */
  getDefaultSize(): number {
    const defaultSizes = {
      arrow: 20,
      highlight: 30,
      slowmotion: 25,
      circle: 25,
      text: 16
    };

    return defaultSizes[this.type] || 20;
  }

  /**
   * Convert position to pixel coordinates
   */
  toPixelPosition(videoWidth: number, videoHeight: number): { x: number; y: number } {
    return {
      x: Math.round(this.position.x * videoWidth),
      y: Math.round(this.position.y * videoHeight)
    };
  }

  /**
   * Check if annotation is visible at given video dimensions
   */
  isVisible(videoWidth: number, videoHeight: number): boolean {
    const pixelPos = this.toPixelPosition(videoWidth, videoHeight);
    const size = this.size || this.getDefaultSize();
    
    return pixelPos.x >= 0 && 
           pixelPos.y >= 0 && 
           pixelPos.x + size <= videoWidth && 
           pixelPos.y + size <= videoHeight;
  }

  /**
   * Convert to plain object for API responses
   */
  toJSON(): IAnnotation {
    return {
      id: this.id,
      type: this.type,
      position: this.position,
      description: this.description,
      color: this.color,
      size: this.size
    };
  }

  /**
   * Create Annotation from database row
   */
  static fromDatabase(row: any): Annotation {
    return new Annotation({
      id: row.id,
      type: row.type,
      position: { x: row.position_x, y: row.position_y },
      description: row.description,
      color: row.color,
      size: row.size
    });
  }
}

/**
 * Annotation validation utility functions
 */
export const AnnotationValidation = {
  /**
   * Validate annotation creation data
   */
  validateCreate(data: Partial<IAnnotation>): { isValid: boolean; errors: string[] } {
    const annotation = new Annotation(data);
    return annotation.validate();
  },

  /**
   * Validate annotation update data
   */
  validateUpdate(data: Partial<IAnnotation>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (data.type !== undefined) {
      const validTypes = ['arrow', 'highlight', 'slowmotion', 'circle', 'text'];
      if (!validTypes.includes(data.type)) {
        errors.push('Invalid annotation type');
      }
    }

    if (data.position !== undefined) {
      if (data.position.x < 0 || data.position.x > 1) {
        errors.push('Annotation X position must be between 0 and 1');
      }
      if (data.position.y < 0 || data.position.y > 1) {
        errors.push('Annotation Y position must be between 0 and 1');
      }
    }

    if (data.description !== undefined) {
      if (!data.description || data.description.trim().length === 0) {
        errors.push('Annotation description is required');
      }
      if (data.description.length > 200) {
        errors.push('Annotation description cannot exceed 200 characters');
      }
    }

    if (data.size !== undefined && (data.size < 1 || data.size > 100)) {
      errors.push('Annotation size must be between 1 and 100');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Check if annotation ID is valid format
   */
  isValidId(id: string): boolean {
    return /^[a-zA-Z0-9-_]{1,50}$/.test(id);
  },

  /**
   * Generate annotation ID
   */
  generateId(clipId: string, type: string, index: number): string {
    return `${clipId}-${type}-${index}`;
  },

  /**
   * Validate position is within bounds
   */
  isValidPosition(x: number, y: number): boolean {
    return x >= 0 && x <= 1 && y >= 0 && y <= 1;
  },

  /**
   * Convert pixel position to normalized coordinates
   */
  pixelToNormalized(pixelX: number, pixelY: number, videoWidth: number, videoHeight: number): { x: number; y: number } {
    return {
      x: Math.max(0, Math.min(1, pixelX / videoWidth)),
      y: Math.max(0, Math.min(1, pixelY / videoHeight))
    };
  }
};