// Core entity interfaces for KickAI Judge system

export interface Fighter {
  id: string;
  name: string;
  weight: number;
  stance: 'orthodox' | 'southpaw';
  reach: number;
  nationality?: string;
  age?: number;
}

export interface Match {
  id: string;
  fighters: [Fighter, Fighter];
  rounds: Round[];
  tournament: string;
  date: Date;
  videoSources: VideoSource[];
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  result?: MatchResult;
}

export interface Round {
  number: number;
  duration: number; // seconds
  events: MatchEvent[];
  statistics: MatchStatistics[];
  startTime?: Date;
  endTime?: Date;
}

export interface MatchEvent {
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
}

export interface VideoClip {
  id: string;
  startTime: number; // seconds
  duration: number; // seconds
  cameraAngle: string;
  annotations: Annotation[];
  url?: string;
  thumbnailUrl?: string;
}

export interface Annotation {
  id: string;
  type: 'arrow' | 'highlight' | 'slowmotion' | 'circle' | 'text';
  position: { x: number; y: number };
  description: string;
  color?: string;
  size?: number;
}

export interface MatchStatistics {
  fighterId: string;
  roundNumber: number;
  totalStrikes: number;
  cleanHits: number;
  strikesByType: {
    jab: number;
    hook: number;
    cross: number;
    lowKick: number;
    highKick: number;
    knee: number;
    elbow: number;
  };
  activityPercentage: number; // 0-100
  dominanceScore: number; // calculated score
  points: number; // total points for round
}

export interface VideoSource {
  id: string;
  cameraId: string;
  angle: string; // 'front', 'side', 'corner', etc.
  resolution: string; // '1080p', '4K', etc.
  fps: number;
  url?: string;
  isActive: boolean;
}

export interface MatchResult {
  winner: string; // fighter ID
  method: 'decision' | 'knockout' | 'technical_knockout' | 'disqualification';
  round?: number;
  time?: number; // seconds into round
  scoreCards: ScoreCard[];
}

export interface ScoreCard {
  judgeId: string;
  judgeName: string;
  roundScores: number[]; // scores for each round
  totalScore: [number, number]; // [fighter1, fighter2]
}

// Enums and Types
export type StrikeType = 'jab' | 'hook' | 'cross' | 'uppercut' | 'low_kick' | 'high_kick' | 'body_kick' | 'knee' | 'elbow';

export type TargetZone = 'head' | 'body' | 'legs' | 'arms';

export type UserRole = 'judge' | 'organizer' | 'fan' | 'fighter' | 'admin';

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Real-time Updates
export interface LiveUpdate {
  type: 'match_event' | 'statistics_update' | 'round_end' | 'match_end';
  matchId: string;
  data: any;
  timestamp: Date;
}

// User and Authentication
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  preferences: UserPreferences;
  createdAt: Date;
  lastLogin?: Date;
}

export interface UserPreferences {
  language: 'uk' | 'en' | 'ru';
  notifications: boolean;
  theme: 'light' | 'dark';
  timezone: string;
}

// Tournament Management
export interface Tournament {
  id: string;
  name: string;
  organizer: string;
  startDate: Date;
  endDate: Date;
  location: string;
  matches: Match[];
  status: 'upcoming' | 'active' | 'completed';
  settings: TournamentSettings;
}

export interface TournamentSettings {
  roundDuration: number; // seconds
  numberOfRounds: number;
  scoringSystem: 'traditional' | 'ai_assisted';
  videoQuality: 'hd' | '4k';
  cameraCount: number;
}

// Computer Vision Types
export interface PoseData {
  landmarks: Landmark[];
  confidence: number;
  timestamp: number;
}

export interface Landmark {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

export interface StrikeDetection {
  type: StrikeType;
  confidence: number;
  trajectory: Point[];
  impactPoint?: Point;
  targetZone: TargetZone;
  isClean: boolean;
}

export interface Point {
  x: number;
  y: number;
  z?: number;
}

// Configuration Types
export interface SystemConfig {
  processing: {
    maxConcurrentMatches: number;
    videoBufferSize: number;
    aiConfidenceThreshold: number;
  };
  storage: {
    videoRetentionDays: number;
    maxFileSize: number;
    compressionQuality: number;
  };
  api: {
    rateLimit: number;
    timeout: number;
    maxPayloadSize: number;
  };
}