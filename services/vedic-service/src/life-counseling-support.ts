// Supporting classes for ZC3.14 Life Counseling System
// AspectCalculator, HouseAnalyzer, and other utility classes

import { BirthChart, Aspect, House } from './life-counseling-types';

/**
 * Aspect Calculator - calculates astrological aspects between planets
 */
export class AspectCalculator {
  private readonly ASPECT_TYPES = {
    CONJUNCTION: { angle: 0, orb: 8 },
    SEXTILE: { angle: 60, orb: 6 },
    SQUARE: { angle: 90, orb: 8 },
    TRINE: { angle: 120, orb: 8 },
    OPPOSITION: { angle: 180, orb: 8 },
    QUINCUNX: { angle: 150, orb: 5 }
  };

  private readonly ASPECT_WEIGHTS = {
    CONJUNCTION: 1.0,
    SEXTILE: 0.6,
    SQUARE: 0.4,
    TRINE: 0.8,
    OPPOSITION: 0.3,
    QUINCUNX: 0.2
  };

  /**
   * Calculate aspects for a specific planet
   */
  calculateAspectsForPlanet(birthChart: BirthChart, planet: string): Aspect[] {
    const aspects: Aspect[] = [];
    const planetLongitude = birthChart.planets[planet]?.longitude;

    if (!planetLongitude) return aspects;

    for (const [otherPlanet, position] of Object.entries(birthChart.planets)) {
      if (otherPlanet === planet) continue;

      const aspect = this.calculateAspect(planetLongitude, position.longitude);
      if (aspect) {
        aspects.push({
          planet: otherPlanet,
          aspect: aspect.type,
          orb: aspect.orb,
          strength: aspect.strength,
          applying: aspect.applying
        });
      }
    }

    return aspects;
  }

  /**
   * Calculate aspect between two longitudes
   */
  private calculateAspect(longitude1: number, longitude2: number): {
    type: string;
    orb: number;
    strength: number;
    applying: boolean;
  } | null {
    const diff = Math.abs(longitude1 - longitude2);
    const normalizedDiff = Math.min(diff, 360 - diff);

    for (const [aspectType, config] of Object.entries(this.ASPECT_TYPES)) {
      const orb = Math.abs(normalizedDiff - config.angle);
      if (orb <= config.orb) {
        return {
          type: aspectType,
          orb: orb,
          strength: this.ASPECT_WEIGHTS[aspectType as keyof typeof this.ASPECT_WEIGHTS] * (1 - orb / config.orb),
          applying: longitude1 < longitude2 // Simplified applying logic
        };
      }
    }

    return null;
  }

  /**
   * Calculate aspects to a house cusp
   */
  calculateAspectsToHouse(birthChart: BirthChart, houseNumber: number): Aspect[] {
    const aspects: Aspect[] = [];
    const house = birthChart.houses[houseNumber - 1];

    if (!house) return aspects;

    for (const [planet, position] of Object.entries(birthChart.planets)) {
      const aspect = this.calculateAspect(house.cusp, position.longitude);
      if (aspect) {
        aspects.push({
          planet: planet,
          aspect: aspect.type,
          orb: aspect.orb,
          strength: aspect.strength,
          applying: aspect.applying
        });
      }
    }

    return aspects;
  }
}

/**
 * House Analyzer - analyzes house placements and strengths
 */
export class HouseAnalyzer {
  /**
   * Get house data by house number
   */
  getHouse(houses: House[], houseNumber: number): House {
    return houses[houseNumber - 1] || {
      cusp: (houseNumber - 1) * 30,
      sign: this.getSignForLongitude((houseNumber - 1) * 30),
      planets: []
    };
  }

  /**
   * Calculate house strength based on planets and aspects
   */
  calculateHouseStrength(house: House, aspects: Aspect[]): number {
    let strength = 0.3; // Base strength

    // Planet influence
    strength += house.planets.length * 0.1;

    // Aspect influence
    strength += aspects.length * 0.05;

    // Ruler influence (simplified)
    const ruler = this.getRulingPlanet(house.sign);
    if (house.planets.includes(ruler)) {
      strength += 0.2;
    }

    return Math.min(1.0, strength);
  }

  /**
   * Get planets in a specific house
   */
  getPlanetsInHouse(birthChart: BirthChart, houseNumber: number): string[] {
    const planets: string[] = [];

    for (const [planet, position] of Object.entries(birthChart.planets)) {
      const house = this.getHouseForLongitude(birthChart, position.longitude);
      if (house === houseNumber) {
        planets.push(planet);
      }
    }

    return planets;
  }

  /**
   * Determine which house a longitude falls into
   */
  private getHouseForLongitude(birthChart: BirthChart, longitude: number): number {
    const ascendant = birthChart.angles.ASC;

    // Normalize longitude relative to ascendant
    let relativeLongitude = longitude - ascendant;
    if (relativeLongitude < 0) relativeLongitude += 360;

    return Math.floor(relativeLongitude / 30) + 1;
  }

  /**
   * Get sign for longitude
   */
  private getSignForLongitude(longitude: number): string {
    const signs = ['ARIES', 'TAURUS', 'GEMINI', 'CANCER', 'LEO', 'VIRGO',
                   'LIBRA', 'SCORPIO', 'SAGITTARIUS', 'CAPRICORN', 'AQUARIUS', 'PISCES'];
    return signs[Math.floor(longitude / 30) % 12];
  }

  /**
   * Get ruling planet for sign
   */
  private getRulingPlanet(sign: string): string {
    const rulers: Record<string, string> = {
      'ARIES': 'MARS', 'TAURUS': 'VENUS', 'GEMINI': 'MERCURY', 'CANCER': 'MOON',
      'LEO': 'SUN', 'VIRGO': 'MERCURY', 'LIBRA': 'VENUS', 'SCORPIO': 'MARS',
      'SAGITTARIUS': 'JUPITER', 'CAPRICORN': 'SATURN', 'AQUARIUS': 'SATURN', 'PISCES': 'JUPITER'
    };
    return rulers[sign] || 'SUN';
  }
}

/**
 * Counseling Interpreter Base Class
 */
export abstract class CounselingInterpreter {
  protected aspectCalculator: AspectCalculator;
  protected houseAnalyzer: HouseAnalyzer;

  constructor() {
    this.aspectCalculator = new AspectCalculator();
    this.houseAnalyzer = new HouseAnalyzer();
  }

  /**
   * Interpret counseling profile
   */
  abstract interpretProfile(profile: any): any;
}

/**
 * Career Counseling Interpreter
 */
export class CareerCounselingInterpreter extends CounselingInterpreter {
  interpretProfile(profile: any): any {
    const positiveAspects = this.identifyPositiveAspects(profile);
    const challengingAspects = this.identifyChallengingAspects(profile);
    const overallScore = this.calculateOverallScore(profile, positiveAspects, challengingAspects);

    return {
      ...profile,
      overallScore,
      positiveAspects,
      challengingAspects,
      dominantThemes: this.identifyDominantThemes(profile),
      developmentAreas: this.identifyDevelopmentAreas(profile)
    };
  }

  private identifyPositiveAspects(profile: any): any[] {
    const positive: any[] = [];

    // Strong MC aspects
    if (profile.mcAnalysis.strength > 0.7) {
      positive.push({ type: 'strong_mc', description: 'Strong Midheaven indicates clear career direction' });
    }

    // Beneficial aspects to career planets
    profile.careerPlanets.forEach((planet: any) => {
      planet.aspects.forEach((aspect: any) => {
        if (aspect.aspect === 'TRINE' || aspect.aspect === 'CONJUNCTION') {
          positive.push({
            type: 'beneficial_aspect',
            planet: planet.planet,
            aspect: aspect,
            description: `${planet.planet} ${aspect.aspect.toLowerCase()} supports career success`
          });
        }
      });
    });

    return positive;
  }

  private identifyChallengingAspects(profile: any): any[] {
    const challenging: any[] = [];

    // Weak house strength
    if (profile.tenthHouse.strength < 0.4) {
      challenging.push({ type: 'weak_10th_house', description: 'Weak 10th house may indicate career uncertainty' });
    }

    // Difficult aspects to career planets
    profile.careerPlanets.forEach((planet: any) => {
      planet.aspects.forEach((aspect: any) => {
        if (aspect.aspect === 'SQUARE' || aspect.aspect === 'OPPOSITION') {
          challenging.push({
            type: 'challenging_aspect',
            planet: planet.planet,
            aspect: aspect,
            description: `${planet.planet} ${aspect.aspect.toLowerCase()} may create career obstacles`
          });
        }
      });
    });

    return challenging;
  }

  private calculateOverallScore(profile: any, positive: any[], challenging: any[]): number {
    let score = 50; // Base score

    score += positive.length * 5;
    score -= challenging.length * 3;

    // MC strength bonus
    score += profile.mcAnalysis.strength * 20;

    // 10th house strength bonus
    score += profile.tenthHouse.strength * 15;

    return Math.max(0, Math.min(100, score));
  }

  private identifyDominantThemes(profile: any): string[] {
    const themes: string[] = [];

    if (profile.mcAnalysis.rulingPlanet === 'SATURN') {
      themes.push('Structured career path');
    }

    if (profile.careerPlanets.some((p: any) => p.planet === 'JUPITER')) {
      themes.push('Growth and expansion opportunities');
    }

    return themes;
  }

  private identifyDevelopmentAreas(profile: any): string[] {
    const positiveAspects = this.identifyPositiveAspects(profile);
    const challengingAspects = this.identifyChallengingAspects(profile);
    const areas: string[] = [];

    if (profile.tenthHouse.strength < 0.5) {
      areas.push('Career foundation development');
    }

    if (challengingAspects.length > positiveAspects.length) {
      areas.push('Aspect harmonization');
    }

    return areas;
  }
}

/**
 * Financial Counseling Interpreter
 */
export class FinancialCounselingInterpreter extends CounselingInterpreter {
  interpretProfile(profile: any): any {
    const positiveAspects = this.identifyPositiveAspects(profile);
    const challengingAspects = this.identifyChallengingAspects(profile);
    const overallScore = this.calculateOverallScore(profile, positiveAspects, challengingAspects);

    return {
      ...profile,
      overallScore,
      positiveAspects,
      challengingAspects,
      dominantThemes: this.identifyDominantThemes(profile),
      developmentAreas: this.identifyDevelopmentAreas(profile)
    };
  }

  private identifyPositiveAspects(profile: any): any[] {
    const positive: any[] = [];

    // Strong 2nd house
    if (profile.secondHouse.strength > 0.7) {
      positive.push({ type: 'strong_2nd_house', description: 'Strong 2nd house indicates good financial foundation' });
    }

    // Beneficial Venus aspects
    profile.financialAspects.forEach((aspect: any) => {
      if (aspect.type === 'value_system' && (aspect.aspect.aspect === 'TRINE' || aspect.aspect.aspect === 'CONJUNCTION')) {
        positive.push({
          type: 'beneficial_venus',
          aspect: aspect,
          description: 'Harmonious Venus aspects support financial stability'
        });
      }
    });

    return positive;
  }

  private identifyChallengingAspects(profile: any): any[] {
    const challenging: any[] = [];

    // Weak 2nd house
    if (profile.secondHouse.strength < 0.4) {
      challenging.push({ type: 'weak_2nd_house', description: 'Weak 2nd house may indicate financial challenges' });
    }

    // Neptune aspects
    if (profile.financialAspects.some((a: any) => a.aspect.planet === 'NEPTUNE')) {
      challenging.push({ type: 'neptune_influence', description: 'Neptune aspects may indicate financial uncertainty' });
    }

    return challenging;
  }

  private calculateOverallScore(profile: any, positive: any[], challenging: any[]): number {
    let score = 50;

    score += positive.length * 5;
    score -= challenging.length * 4;

    score += profile.secondHouse.strength * 20;
    score += profile.eighthHouse.strength * 15;

    return Math.max(0, Math.min(100, score));
  }

  private identifyDominantThemes(profile: any): string[] {
    const themes: string[] = [];

    if (profile.secondHouse.ruler === 'VENUS') {
      themes.push('Value-based financial approach');
    }

    if (profile.financialAspects.some((a: any) => a.type === 'expansion_luck')) {
      themes.push('Growth-oriented investments');
    }

    return themes;
  }

  private identifyDevelopmentAreas(profile: any): string[] {
    const positiveAspects = this.identifyPositiveAspects(profile);
    const challengingAspects = this.identifyChallengingAspects(profile);
    const areas: string[] = [];

    if (profile.secondHouse.strength < 0.5) {
      areas.push('Financial foundation building');
    }

    if (challengingAspects.length > 2) {
      areas.push('Risk management strategies');
    }

    return areas;
  }
}

/**
 * Business Counseling Interpreter
 */
export class BusinessCounselingInterpreter extends CounselingInterpreter {
  interpretProfile(profile: any): any {
    const positiveAspects = this.identifyPositiveAspects(profile);
    const challengingAspects = this.identifyChallengingAspects(profile);
    const overallScore = this.calculateOverallScore(profile, positiveAspects, challengingAspects);

    return {
      ...profile,
      overallScore,
      positiveAspects,
      challengingAspects,
      dominantThemes: this.identifyDominantThemes(profile),
      developmentAreas: this.identifyDevelopmentAreas(profile)
    };
  }

  private identifyPositiveAspects(profile: any): any[] {
    const positive: any[] = [];

    // Strong 7th house for partnerships
    if (profile.seventhHouse.strength > 0.7) {
      positive.push({ type: 'strong_partnerships', description: 'Strong 7th house supports business partnerships' });
    }

    // Mars aspects for initiative
    profile.entrepreneurialAspects.forEach((aspect: any) => {
      if (aspect.type === 'initiative' && (aspect.aspect.aspect === 'TRINE' || aspect.aspect.aspect === 'CONJUNCTION')) {
        positive.push({
          type: 'strong_initiative',
          aspect: aspect,
          description: 'Beneficial Mars aspects support business initiative'
        });
      }
    });

    return positive;
  }

  private identifyChallengingAspects(profile: any): any[] {
    const challenging: any[] = [];

    // Weak 3rd house
    if (profile.thirdHouse.strength < 0.4) {
      challenging.push({ type: 'weak_local_business', description: 'Weak 3rd house may limit local business success' });
    }

    // Challenging partnership aspects
    if (profile.seventhHouse.strength < 0.5) {
      challenging.push({ type: 'partnership_challenges', description: 'Weak 7th house may indicate partnership difficulties' });
    }

    return challenging;
  }

  private calculateOverallScore(profile: any, positive: any[], challenging: any[]): number {
    let score = 50;

    score += positive.length * 5;
    score -= challenging.length * 3;

    score += profile.thirdHouse.strength * 15;
    score += profile.seventhHouse.strength * 15;
    score += profile.eleventhHouse.strength * 10;

    return Math.max(0, Math.min(100, score));
  }

  private identifyDominantThemes(profile: any): string[] {
    const themes: string[] = [];

    if (profile.thirdHouse.ruler === 'MERCURY') {
      themes.push('Communication-driven business');
    }

    if (profile.entrepreneurialAspects.some((a: any) => a.type === 'innovation')) {
      themes.push('Innovative business ventures');
    }

    return themes;
  }

  private identifyDevelopmentAreas(profile: any): string[] {
    const areas: string[] = [];

    if (profile.thirdHouse.strength < 0.5) {
      areas.push('Local market development');
    }

    if (profile.seventhHouse.strength < 0.5) {
      areas.push('Partnership building');
    }

    return areas;
  }
}

/**
 * Medical Counseling Interpreter
 */
export class MedicalCounselingInterpreter extends CounselingInterpreter {
  interpretProfile(profile: any): any {
    const positiveAspects = this.identifyPositiveAspects(profile);
    const challengingAspects = this.identifyChallengingAspects(profile);
    const overallScore = this.calculateOverallScore(profile, positiveAspects, challengingAspects);

    return {
      ...profile,
      overallScore,
      positiveAspects,
      challengingAspects,
      dominantThemes: this.identifyDominantThemes(profile),
      developmentAreas: this.identifyDevelopmentAreas(profile)
    };
  }

  private identifyPositiveAspects(profile: any): any[] {
    const positive: any[] = [];

    // Strong 6th house
    if (profile.sixthHouse.strength > 0.7) {
      positive.push({ type: 'strong_6th_house', description: 'Strong 6th house supports health maintenance' });
    }

    // Beneficial Jupiter aspects
    profile.medicalAspects.forEach((aspect: any) => {
      if (aspect.aspect.planet === 'JUPITER' && (aspect.aspect.aspect === 'TRINE' || aspect.aspect.aspect === 'CONJUNCTION')) {
        positive.push({
          type: 'beneficial_jupiter',
          aspect: aspect,
          description: 'Jupiter aspects support healing and recovery'
        });
      }
    });

    return positive;
  }

  private identifyChallengingAspects(profile: any): any[] {
    const challenging: any[] = [];

    // Saturn aspects for chronic conditions
    profile.medicalAspects.forEach((aspect: any) => {
      if (aspect.type === 'chronic_conditions') {
        challenging.push({
          type: 'saturn_influence',
          aspect: aspect,
          description: 'Saturn aspects may indicate chronic health patterns'
        });
      }
    });

    // Weak 6th house
    if (profile.sixthHouse.strength < 0.4) {
      challenging.push({ type: 'weak_6th_house', description: 'Weak 6th house may indicate health vulnerabilities' });
    }

    return challenging;
  }

  private calculateOverallScore(profile: any, positive: any[], challenging: any[]): number {
    let score = 50;

    score += positive.length * 5;
    score -= challenging.length * 4;

    score += profile.sixthHouse.strength * 20;
    score += profile.twelfthHouse.strength * 15;

    return Math.max(0, Math.min(100, score));
  }

  private identifyDominantThemes(profile: any): string[] {
    const themes: string[] = [];

    if (profile.sixthHouse.ruler === 'MERCURY') {
      themes.push('Nervous system focus');
    }

    if (profile.medicalAspects.some((a: any) => a.type === 'chronic_conditions')) {
      themes.push('Chronic health management');
    }

    return themes;
  }

  private identifyDevelopmentAreas(profile: any): string[] {
    const positiveAspects = this.identifyPositiveAspects(profile);
    const challengingAspects = this.identifyChallengingAspects(profile);
    const areas: string[] = [];

    if (profile.sixthHouse.strength < 0.5) {
      areas.push('Health routine development');
    }

    if (challengingAspects.length > 2) {
      areas.push('Preventive care focus');
    }

    return areas;
  }
}