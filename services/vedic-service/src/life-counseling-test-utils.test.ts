// Test utilities and mock data for ZC3.14 Western Astrology Life Counseling System
// Provides comprehensive test helpers, mock data generators, and validation utilities

import { BirthChart, Aspect, CounselingRecommendation } from './life-counseling-types';

/**
 * Mock data generators for testing
 */
export class MockDataGenerator {
  /**
   * Generate a standard test birth chart
   */
  static createStandardTestChart(): BirthChart {
    return {
      planets: {
        SUN: { longitude: 15, latitude: 0, speed: 1, retrograde: false },      // Leo
        MOON: { longitude: 45, latitude: 0, speed: 1, retrograde: false },     // Virgo
        MERCURY: { longitude: 10, latitude: 0, speed: 1, retrograde: false },  // Cancer
        VENUS: { longitude: 25, latitude: 0, speed: 1, retrograde: false },    // Leo
        MARS: { longitude: 180, latitude: 0, speed: 1, retrograde: false },    // Aquarius
        JUPITER: { longitude: 90, latitude: 0, speed: 1, retrograde: false },   // Scorpio
        SATURN: { longitude: 270, latitude: 0, speed: 1, retrograde: false },   // Taurus
        URANUS: { longitude: 300, latitude: 0, speed: 1, retrograde: false },   // Gemini
        NEPTUNE: { longitude: 330, latitude: 0, speed: 1, retrograde: false },  // Cancer
        PLUTO: { longitude: 210, latitude: 0, speed: 1, retrograde: false }     // Pisces
      },
      houses: [
        { cusp: 0, sign: 'ARIES', planets: [] },
        { cusp: 30, sign: 'TAURUS', planets: ['SATURN'] },
        { cusp: 60, sign: 'GEMINI', planets: ['URANUS'] },
        { cusp: 90, sign: 'CANCER', planets: ['MERCURY', 'NEPTUNE'] },
        { cusp: 120, sign: 'LEO', planets: ['SUN', 'VENUS'] },
        { cusp: 150, sign: 'VIRGO', planets: ['MOON'] },
        { cusp: 180, sign: 'LIBRA', planets: [] },
        { cusp: 210, sign: 'SCORPIO', planets: ['JUPITER', 'PLUTO'] },
        { cusp: 240, sign: 'SAGITTARIUS', planets: [] },
        { cusp: 270, sign: 'CAPRICORN', planets: [] },
        { cusp: 300, sign: 'AQUARIUS', planets: ['MARS'] },
        { cusp: 330, sign: 'PISCES', planets: [] }
      ],
      angles: {
        ASC: 0,
        MC: 90,
        DSC: 180,
        IC: 270
      }
    };
  }

  /**
   * Generate a chart with strong career indicators
   */
  static createStrongCareerChart(): BirthChart {
    const baseChart = this.createStandardTestChart();
    return {
      ...baseChart,
      planets: {
        ...baseChart.planets,
        SATURN: { longitude: 280, latitude: 0, speed: 1, retrograde: false }, // 10th house
        JUPITER: { longitude: 100, latitude: 0, speed: 1, retrograde: false } // 10th house
      },
      houses: [
        ...baseChart.houses.slice(0, 9),
        { cusp: 270, sign: 'CAPRICORN', planets: ['SATURN', 'JUPITER'] }, // Strong 10th house
        ...baseChart.houses.slice(10)
      ]
    };
  }

  /**
   * Generate a chart with challenging aspects
   */
  static createChallengingChart(): BirthChart {
    return {
      planets: {
        SUN: { longitude: 90, latitude: 0, speed: 1, retrograde: false },       // Scorpio (square to MC)
        MOON: { longitude: 180, latitude: 0, speed: 1, retrograde: false },     // Aquarius
        MERCURY: { longitude: 270, latitude: 0, speed: 1, retrograde: false },  // Taurus
        VENUS: { longitude: 0, latitude: 0, speed: 1, retrograde: false },      // Aries
        MARS: { longitude: 45, latitude: 0, speed: 1, retrograde: false },      // Virgo
        JUPITER: { longitude: 135, latitude: 0, speed: 1, retrograde: false },  // Sagittarius
        SATURN: { longitude: 225, latitude: 0, speed: 1, retrograde: false },   // Pisces
        URANUS: { longitude: 315, latitude: 0, speed: 1, retrograde: false },   // Cancer
        NEPTUNE: { longitude: 45, latitude: 0, speed: 1, retrograde: false },   // Virgo
        PLUTO: { longitude: 135, latitude: 0, speed: 1, retrograde: false }     // Sagittarius
      },
      houses: [
        { cusp: 0, sign: 'ARIES', planets: ['VENUS'] },
        { cusp: 30, sign: 'TAURUS', planets: ['MERCURY'] },
        { cusp: 60, sign: 'GEMINI', planets: [] },
        { cusp: 90, sign: 'CANCER', planets: ['URANUS'] },
        { cusp: 120, sign: 'LEO', planets: [] },
        { cusp: 150, sign: 'VIRGO', planets: ['MARS', 'NEPTUNE'] },
        { cusp: 180, sign: 'LIBRA', planets: [] },
        { cusp: 210, sign: 'SCORPIO', planets: ['SUN'] },
        { cusp: 240, sign: 'SAGITTARIUS', planets: ['JUPITER', 'PLUTO'] },
        { cusp: 270, sign: 'CAPRICORN', planets: [] },
        { cusp: 300, sign: 'AQUARIUS', planets: ['MOON'] },
        { cusp: 330, sign: 'PISCES', planets: ['SATURN'] }
      ],
      angles: {
        ASC: 0,
        MC: 90,
        DSC: 180,
        IC: 270
      }
    };
  }

  /**
   * Generate mock aspects
   */
  static createMockAspects(): Aspect[] {
    return [
      {
        planet: 'SUN',
        aspect: 'TRINE',
        orb: 2.5,
        strength: 0.85,
        applying: true
      },
      {
        planet: 'MOON',
        aspect: 'SQUARE',
        orb: 1.8,
        strength: 0.65,
        applying: false
      },
      {
        planet: 'SATURN',
        aspect: 'CONJUNCTION',
        orb: 0.5,
        strength: 0.95,
        applying: true
      }
    ];
  }

  /**
   * Generate mock counseling recommendations
   */
  static createMockRecommendations(): CounselingRecommendation[] {
    return [
      {
        type: 'career_path',
        priority: 'high',
        advice: 'Consider structured career paths in government, administration, or technology',
        reasoning: 'Saturn-ruled MC suggests success through discipline and innovation'
      },
      {
        type: 'skill_development',
        priority: 'medium',
        advice: 'Develop communication and analytical skills for career advancement',
        reasoning: 'Mercury dominance indicates success in communication-based careers'
      },
      {
        type: 'timing',
        priority: 'low',
        advice: 'Monitor transits to these aspects for career opportunities',
        reasoning: 'Strong vocational aspects indicate timing-sensitive career moves'
      }
    ];
  }
}

/**
 * Test validation utilities
 */
export class ValidationUtils {
  /**
   * Validate birth chart structure
   */
  static validateBirthChart(chart: BirthChart): boolean {
    if (!chart.planets || !chart.houses || !chart.angles) {
      return false;
    }

    // Check required planets
    const requiredPlanets = ['SUN', 'MOON', 'MERCURY', 'VENUS', 'MARS', 'JUPITER', 'SATURN'];
    for (const planet of requiredPlanets) {
      if (!chart.planets[planet]) {
        return false;
      }
    }

    // Check house structure
    if (chart.houses.length !== 12) {
      return false;
    }

    // Check angles
    if (!chart.angles.ASC || !chart.angles.MC) {
      return false;
    }

    return true;
  }

  /**
   * Validate aspect structure
   */
  static validateAspect(aspect: Aspect): boolean {
    return !!(
      aspect.planet &&
      aspect.aspect &&
      typeof aspect.orb === 'number' &&
      typeof aspect.strength === 'number' &&
      typeof aspect.applying === 'boolean'
    );
  }

  /**
   * Validate counseling recommendation structure
   */
  static validateRecommendation(rec: CounselingRecommendation): boolean {
    return !!(
      rec.type &&
      ['high', 'medium', 'low'].includes(rec.priority) &&
      rec.advice &&
      rec.reasoning
    );
  }

  /**
   * Validate score ranges
   */
  static validateScore(score: number, min: number = 0, max: number = 100): boolean {
    return typeof score === 'number' && score >= min && score <= max;
  }

  /**
   * Validate timing analysis structure
   */
  static validateTimingAnalysis(timing: any): boolean {
    return !!(
      timing.currentPeriod &&
      timing.upcomingOpportunities &&
      timing.challengingPeriods &&
      timing.optimalTiming
    );
  }
}

/**
 * Performance testing utilities
 */
export class PerfUtils {
  private static measurements: number[] = [];

  static startMeasurement(): void {
    this.measurements.push(performance.now());
  }

  static endMeasurement(): number {
    const start = this.measurements.pop();
    if (start === undefined) {
      throw new Error('No measurement started');
    }
    return performance.now() - start;
  }

  static async measureAsync<T>(fn: () => Promise<T>): Promise<{ result: T; duration: number }> {
    this.startMeasurement();
    const result = await fn();
    const duration = this.endMeasurement();
    return { result, duration };
  }

  static measureSync<T>(fn: () => T): { result: T; duration: number } {
    this.startMeasurement();
    const result = fn();
    const duration = this.endMeasurement();
    return { result, duration };
  }

  static assertPerformance(duration: number, maxDuration: number, operation: string): void {
    if (duration > maxDuration) {
      throw new Error(`${operation} took ${duration}ms, exceeding limit of ${maxDuration}ms`);
    }
  }
}

/**
 * Test data constants
 */
export const TEST_CONSTANTS = {
  PERFORMANCE_THRESHOLDS: {
    SIMPLE_ANALYSIS: 500,    // ms
    MEDIUM_ANALYSIS: 1000,   // ms
    COMPLEX_ANALYSIS: 2000,  // ms
    CONCURRENT_LOAD: 3000,   // ms for 5 concurrent
    MEMORY_LIMIT: 50 * 1024 * 1024 // 50MB
  },
  ACCURACY_THRESHOLDS: {
    SCORE_TOLERANCE: 5,      // points
    PASS_RATE_MINIMUM: 85    // percentage
  },
  VALIDATION_RULES: {
    MIN_PLANETS: 7,
    REQUIRED_HOUSES: 12,
    MAX_ORB_DEGREES: 8,
    MIN_STRENGTH: 0,
    MAX_STRENGTH: 1
  }
};

/**
 * Edge case test data generators
 */
export class EdgeCaseGenerators {
  /**
   * Generate chart with extreme longitudes
   */
  static createExtremeLongitudeChart(): BirthChart {
    const chart = MockDataGenerator.createStandardTestChart();
    return {
      ...chart,
      planets: {
        ...chart.planets,
        SUN: { ...chart.planets.SUN, longitude: 359.9 },
        MOON: { ...chart.planets.MOON, longitude: 0.1 }
      }
    };
  }

  /**
   * Generate chart with retrograde planets
   */
  static createRetrogradeChart(): BirthChart {
    const chart = MockDataGenerator.createStandardTestChart();
    return {
      ...chart,
      planets: {
        ...chart.planets,
        MERCURY: { ...chart.planets.MERCURY, retrograde: true, speed: -1 },
        VENUS: { ...chart.planets.VENUS, retrograde: true, speed: -0.5 }
      }
    };
  }

  /**
   * Generate minimal valid chart
   */
  static createMinimalChart(): BirthChart {
    return {
      planets: {
        SUN: { longitude: 0, latitude: 0, speed: 1, retrograde: false },
        MOON: { longitude: 90, latitude: 0, speed: 1, retrograde: false },
        MERCURY: { longitude: 45, latitude: 0, speed: 1, retrograde: false },
        VENUS: { longitude: 135, latitude: 0, speed: 1, retrograde: false },
        MARS: { longitude: 180, latitude: 0, speed: 1, retrograde: false },
        JUPITER: { longitude: 225, latitude: 0, speed: 1, retrograde: false },
        SATURN: { longitude: 270, latitude: 0, speed: 1, retrograde: false }
      },
      houses: Array.from({ length: 12 }, (_, i) => ({
        cusp: i * 30,
        sign: ['ARIES', 'TAURUS', 'GEMINI', 'CANCER', 'LEO', 'VIRGO',
               'LIBRA', 'SCORPIO', 'SAGITTARIUS', 'CAPRICORN', 'AQUARIUS', 'PISCES'][i],
        planets: []
      })),
      angles: {
        ASC: 0,
        MC: 90,
        DSC: 180,
        IC: 270
      }
    };
  }

  /**
   * Generate invalid chart for error testing
   */
  static createInvalidChart(): any {
    return {
      planets: { SUN: { longitude: 400 } }, // Invalid longitude
      houses: [],
      angles: {}
    };
  }
}

// Export for use in tests
export {
  MockDataGenerator as default,
  ValidationUtils as TestValidators,
  PerfUtils as PerformanceUtils,
  TEST_CONSTANTS,
  EdgeCaseGenerators
};