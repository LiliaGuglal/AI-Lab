import { VideoClip as IVideoClip, Annotation } from '../../../shared/types';

/**
 * VideoClip data model with validation
 */
export class VideoClip implements IVideoClip {
  id: string;
  startTime: number; // seconds
  duration: number; // seconds
  cameraAngle: string;
  annotations: Annotation[];
  url?: string;
  thumbnailUrl?: string;

  constructor(data: Partial<IVideoClip>) {
    this.id = data.id || '';
    this.startTime = data.startTime || 0;
    this.duration = data.duration || 5;
    this.cameraAngle = data.cameraAngle || '';
    this.annotations = data.annotations || [];
    this.url = data.url;
    this.thumbnailUrl = data.thumbnailUrl;
  }

  /**
   * Validate video clip data
   */
  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // ID validation
    if (!this.id || this.id.trim().length === 0) {
      errors.push('Video clip ID is required');
    }

    // Start time validation
    if (this.startTime < 0) {
      errors.push('Video clip start time cannot be negative');
    }

    // Duration validation (3-10 seconds for key moments)
    if (this.duration <= 0 || this.duration > 30) {
      errors.push('Video clip duration must be between 0 and 30 seconds');
    }

    if (this.duration < 3 || this.duration > 10) {
      // Warning for non-standard durations
      console.warn('Video clip duration should typically be between 3-10 seconds for key moments');
    }

    // Camera angle validation
    if (!this.cameraAngle || this.cameraAngle.trim().length === 0) {
      errors.push('Camera angle is required');
    }

    const validAngles = ['front', 'side', 'corner', 'overhead', 'close-up', 'wide'];
    if (!validAngles.includes(this.cameraAngle.toLowerCase())) {
      console.warn(`Camera angle '${this.cameraAngle}' is not a standard angle`);
    }

    // URL validation
    if (this.url && !this.isValidUrl(this.url)) {
      errors.push('Invalid video URL format');
    }

    if (this.thumbnailUrl && !this.isValidUrl(this.thumbnailUrl)) {
      errors.push('Invalid thumbnail URL format');
    }

    // Annotations validation
    for (let i = 0; i < this.annotations.length; i++) {
      const annotation = this.annotations[i];
      const annotationValidation = this.validateAnnotation(annotation);
      if (!annotationValidation.isValid) {
        errors.push(...annotationValidation.errors.map(err => `Annotation ${i + 1}: ${err}`));
      }
    }

    if (this.annotations.length > 20) {
      errors.push('Video clip cannot have more than 20 annotations');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate annotation data
   */
  private validateAnnotation(annotation: Annotation): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!annotation.id || annotation.id.trim().length === 0) {
      errors.push('Annotation ID is required');
    }

    const validTypes = ['arrow', 'highlight', 'slowmotion', 'circle', 'text'];
    if (!validTypes.includes(annotation.type)) {
      errors.push('Invalid annotation type');
    }

    if (annotation.position.x < 0 || annotation.position.x > 1) {
      errors.push('Annotation X position must be between 0 and 1');
    }

    if (annotation.position.y < 0 || annotation.position.y > 1) {
      errors.push('Annotation Y position must be between 0 and 1');
    }

    if (!annotation.description || annotation.description.trim().length === 0) {
      errors.push('Annotation description is required');
    }

    if (annotation.description.length > 200) {
      errors.push('Annotation description cannot exceed 200 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate URL format
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Add annotation to video clip
   */
  addAnnotation(annotation: Annotation): void {
    const validation = this.validateAnnotation(annotation);
    if (!validation.isValid) {
      throw new Error(`Invalid annotation: ${validation.errors.join(', ')}`);
    }

    if (this.annotations.length >= 20) {
      throw new Error('Cannot add more than 20 annotations to a video clip');
    }

    this.annotations.push(annotation);
  }

  /**
   * Remove annotation by ID
   */
  removeAnnotation(annotationId: string): boolean {
    const index = this.annotations.findIndex(a => a.id === annotationId);
    if (index !== -1) {
      this.annotations.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Get annotations by type
   */
  getAnnotationsByType(type: string): Annotation[] {
    return this.annotations.filter(annotation => annotation.type === type);
  }

  /**
   * Get end time of the clip
   */
  getEndTime(): number {
    return this.startTime + this.duration;
  }

  /**
   * Check if clip is ready for viewing
   */
  isReady(): boolean {
    return !!this.url;
  }

  /**
   * Get file size estimate in MB (rough calculation)
   */
  getEstimatedSize(): number {
    // Rough estimate: 1 second of 1080p video ≈ 8MB
    return this.duration * 8;
  }

  /**
   * Convert to plain object for API responses
   */
  toJSON(): IVideoClip {
    return {
      id: this.id,
      startTime: this.startTime,
      duration: this.duration,
      cameraAngle: this.cameraAngle,
      annotations: this.annotations,
      url: this.url,
      thumbnailUrl: this.thumbnailUrl
    };
  }

  /**
   * Create VideoClip from database row
   */
  static fromDatabase(row: any): VideoClip {
    return new VideoClip({
      id: row.id,
      startTime: row.start_time,
      duration: row.duration,
      cameraAngle: row.camera_angle,
      annotations: row.annotations || [],
      url: row.url,
      thumbnailUrl: row.thumbnail_url
    });
  }
}

/**
 * VideoClip validation utility functions
 */
export const VideoClipValidation = {
  /**
   * Validate video clip creation data
   */
  validateCreate(data: Partial<IVideoClip>): { isValid: boolean; errors: string[] } {
    const clip = new VideoClip(data);
    return clip.validate();
  },

  /**
   * Validate video clip update data
   */
  validateUpdate(data: Partial<IVideoClip>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (data.startTime !== undefined && data.startTime < 0) {
      errors.push('Video clip start time cannot be negative');
    }

    if (data.duration !== undefined) {
      if (data.duration <= 0 || data.duration > 30) {
        errors.push('Video clip duration must be between 0 and 30 seconds');
      }
    }

    if (data.url !== undefined && data.url && !VideoClipValidation.isValidUrl(data.url)) {
      errors.push('Invalid video URL format');
    }

    if (data.thumbnailUrl !== undefined && data.thumbnailUrl && !VideoClipValidation.isValidUrl(data.thumbnailUrl)) {
      errors.push('Invalid thumbnail URL format');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Check if video clip ID is valid format
   */
  isValidId(id: string): boolean {
    return /^[a-zA-Z0-9-_]{1,50}$/.test(id);
  },

  /**
   * Validate URL format
   */
  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Generate video clip ID
   */
  generateId(matchId: string, eventId: string, cameraAngle: string): string {
    return `${matchId}-${eventId}-${cameraAngle.toLowerCase()}`;
  },

  /**
   * Check if duration is appropriate for clip type
   */
  isAppropriateLength(duration: number, clipType: 'highlight' | 'controversy' | 'summary'): boolean {
    switch (clipType) {
      case 'highlight':
        return duration >= 3 && duration <= 8;
      case 'controversy':
        return duration >= 5 && duration <= 15;
      case 'summary':
        return duration >= 10 && duration <= 30;
      default:
        return duration >= 3 && duration <= 10;
    }
  },

  /**
   * Validate camera angle
   */
  isValidCameraAngle(angle: string): boolean {
    const validAngles = ['front', 'side', 'corner', 'overhead', 'close-up', 'wide'];
    return validAngles.includes(angle.toLowerCase());
  }
};