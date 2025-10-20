/**
 * Example usage of KickAI Judge data models
 * This file demonstrates how to create and validate model instances
 */

import { 
  Fighter, 
  Match, 
  Round, 
  MatchEvent, 
  VideoClip, 
  Annotation,
  ModelFactory,
  ModelUtils
} from './index';

/**
 * Example: Creating and validating a Fighter
 */
export function createExampleFighter(): Fighter {
  const fighterData = {
    id: ModelUtils.generateId('fighter'),
    name: 'Олександр Петренко',
    weight: 75,
    stance: 'orthodox' as const,
    reach: 180,
    nationality: 'Україна',
    age: 28
  };

  try {
    const fighter = ModelFactory.createFighter(fighterData);
    console.log('✅ Fighter created successfully:', fighter.toJSON());
    return fighter;
  } catch (error) {
    console.error('❌ Fighter creation failed:', error);
    throw error;
  }
}

/**
 * Example: Creating a Match with two fighters
 */
export function createExampleMatch(): Match {
  const fighter1 = createExampleFighter();
  const fighter2 = ModelFactory.createFighter({
    id: ModelUtils.generateId('fighter'),
    name: 'Іван Коваленко',
    weight: 73,
    stance: 'southpaw' as const,
    reach: 175,
    nationality: 'Україна',
    age: 25
  });

  const matchData = {
    id: ModelUtils.generateId('match'),
    fighters: [fighter1.toJSON(), fighter2.toJSON()] as [any, any],
    rounds: [],
    tournament: 'Чемпіонат України 2024',
    date: new Date(),
    videoSources: [],
    status: 'scheduled' as const
  };

  try {
    const match = ModelFactory.createMatch(matchData);
    console.log('✅ Match created successfully:', match.toJSON());
    return match;
  } catch (error) {
    console.error('❌ Match creation failed:', error);
    throw error;
  }
}

/**
 * Example: Creating a Round with events
 */
export function createExampleRound(): Round {
  const roundData = {
    number: 1,
    duration: 180, // 3 minutes
    events: [],
    statistics: [],
    startTime: new Date(),
    endTime: undefined
  };

  try {
    const round = ModelFactory.createRound(roundData);
    
    // Add some example events
    const strikeEvent = ModelFactory.createMatchEvent({
      id: ModelUtils.generateId('event'),
      timestamp: 45, // 45 seconds into the round
      type: 'strike' as const,
      fighter: 'fighter-123',
      details: {
        strikeType: 'high_kick' as const,
        targetZone: 'head' as const,
        isClean: true,
        impactForce: 85,
        confidence: 0.92
      }
    });

    round.addEvent(strikeEvent);
    console.log('✅ Round created with events:', round.toJSON());
    return round;
  } catch (error) {
    console.error('❌ Round creation failed:', error);
    throw error;
  }
}

/**
 * Example: Creating a VideoClip with annotations
 */
export function createExampleVideoClip(): VideoClip {
  const clipData = {
    id: ModelUtils.generateId('clip'),
    startTime: 45,
    duration: 5,
    cameraAngle: 'front',
    annotations: [],
    url: 'https://example.com/video/clip-123.mp4',
    thumbnailUrl: 'https://example.com/video/thumb-123.jpg'
  };

  try {
    const clip = ModelFactory.createVideoClip(clipData);
    
    // Add annotation
    const annotation = ModelFactory.createAnnotation({
      id: ModelUtils.generateId('annotation'),
      type: 'arrow' as const,
      position: { x: 0.6, y: 0.3 },
      description: 'Чистий хай-кік в голову',
      color: '#ff0000',
      size: 20
    });

    clip.addAnnotation(annotation);
    console.log('✅ Video clip created with annotations:', clip.toJSON());
    return clip;
  } catch (error) {
    console.error('❌ Video clip creation failed:', error);
    throw error;
  }
}

/**
 * Example: Validation error handling
 */
export function demonstrateValidation(): void {
  console.log('\n🔍 Demonstrating validation...\n');

  // Valid fighter
  try {
    const validFighter = new Fighter({
      id: 'valid-fighter',
      name: 'Тест Боєць',
      weight: 70,
      stance: 'orthodox',
      reach: 175
    });
    
    const validation = validFighter.validate();
    console.log('✅ Valid fighter validation:', validation);
  } catch (error) {
    console.error('❌ Valid fighter error:', error);
  }

  // Invalid fighter
  try {
    const invalidFighter = new Fighter({
      id: '', // Invalid: empty ID
      name: 'A', // Invalid: too short
      weight: -10, // Invalid: negative weight
      stance: 'invalid' as any, // Invalid: wrong stance
      reach: 0 // Invalid: zero reach
    });
    
    const validation = invalidFighter.validate();
    console.log('❌ Invalid fighter validation:', validation);
  } catch (error) {
    console.error('❌ Invalid fighter error:', error);
  }

  // Invalid match event
  try {
    const invalidEvent = new MatchEvent({
      id: 'test-event',
      timestamp: -5, // Invalid: negative timestamp
      type: 'invalid' as any, // Invalid: wrong type
      fighter: '', // Invalid: empty fighter ID
      details: {
        impactForce: 150, // Invalid: over 100
        confidence: 1.5 // Invalid: over 1
      }
    });
    
    const validation = invalidEvent.validate();
    console.log('❌ Invalid event validation:', validation);
  } catch (error) {
    console.error('❌ Invalid event error:', error);
  }
}

/**
 * Run all examples
 */
export function runExamples(): void {
  console.log('🥊 KickAI Judge Data Models Examples\n');
  
  try {
    createExampleFighter();
    createExampleMatch();
    createExampleRound();
    createExampleVideoClip();
    demonstrateValidation();
    
    console.log('\n✅ All examples completed successfully!');
  } catch (error) {
    console.error('\n❌ Examples failed:', error);
  }
}

// Run examples if this file is executed directly
if (require.main === module) {
  runExamples();
}