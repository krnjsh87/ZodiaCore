// Types for ZodiaCore Dasha & Planetary Transit Calculator (ZC1.2)

/**
 * Current Dasha Information
 */
export interface CurrentDasha {
  mahadasha: {
    planet: string;
    startDate: Date;
    endDate: Date;
    progress: number;
    remainingYears: number;
  };
  antardasha?: {
    planet: string;
    startDate: Date;
    endDate: Date;
    progress: number;
  };
}

/**
 * Transit Positions
 */
export interface TransitPositions {
  SUN: number;
  MOON: number;
  MARS: number;
  MERCURY: number;
  JUPITER: number;
  VENUS: number;
  SATURN: number;
  RAHU: number;
  KETU: number;
}

/**
 * Transit Aspect
 */
export interface TransitAspect {
  natalPlanet: string;
  transitPlanet: string;
  aspect: string;
  orb: number;
  strength: number;
}

/**
 * Prediction
 */
export interface Prediction {
  type: string;
  area: string;
  description: string;
  timing: string;
  confidence: number;
}

/**
 * Period Analysis
 */
export interface PeriodAnalysis {
  favorablePeriods: Array<{
    period: string;
    reason: string;
    strength: number;
  }>;
  challengingPeriods: Array<{
    period: string;
    reason: string;
    strength: number;
  }>;
  strength: {
    overall: number;
    planetary: Record<string, number>;
  };
}

/**
 * Complete Dasha & Transit Analysis
 */
export interface DashaTransitAnalysis {
  currentDasha: CurrentDasha;
  transitPositions: TransitPositions;
  transitAspects: TransitAspect[];
  predictions: {
    daily: Prediction[];
    major: Prediction[];
  };
  periodAnalysis: PeriodAnalysis;
  analysisDate: Date;
}

/**
 * Birth Data Input
 */
export interface BirthData {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  latitude: number;
  longitude: number;
  timezone?: number;
}

/**
 * Planetary Position Details
 */
export interface PlanetaryPosition {
  longitude: number;
  sign: number;
  degree: number;
  house: number;
  retrograde: boolean;
  nakshatra?: NakshatraDetails;
}

/**
 * Nakshatra Details
 */
export interface NakshatraDetails {
  nakshatraNumber: number;
  nakshatraName: string;
  nakshatra: number;
  pada: number;
  lord: string;
  degreesInNakshatra: number;
  degreesInPada: number;
  remainingDegrees: number;
  // Guna Milan properties
  caste?: string;
  gana?: string;
  yoni?: string;
  nadi?: string;
}

/**
 * Tithi Details
 */
export interface TithiDetails {
  number: number;
  name: string;
  progress: number;
  paksha: 'Shukla' | 'Krishna';
}

/**
 * Moon Details
 */
export interface MoonDetails {
  nakshatra: NakshatraDetails;
  tithi: TithiDetails;
}

/**
 * Dasha Balance
 */
export interface DashaBalance {
  lord: string;
  balanceYears: number;
  balanceDays: number;
}

/**
 * Mahadasha Period
 */
export interface MahadashaPeriod {
  planet: string;
  startDate: Date;
  endDate: Date;
  duration: number;
}

/**
 * Current Dasha
 */
export interface CurrentDasha {
  mahadasha: {
    planet: string;
    startDate: Date;
    endDate: Date;
    progress: number;
    remainingYears: number;
  };
  antardasha?: {
    planet: string;
    startDate: Date;
    endDate: Date;
    progress: number;
  };
}

/**
 * Dasha Information
 */
export interface DashaInfo {
  balance: DashaBalance;
  mahadashas: MahadashaPeriod[];
  current?: CurrentDasha;
}

/**
 * Divisional Chart
 */
export interface DivisionalChart {
  type: string;
  name: string;
  significance: string;
  divisor: number;
  positions: Record<string, number>; // Planet longitudes in degrees
  houses: number[]; // House cusps in degrees
}

/**
 * Planetary Strengths
 */
export interface PlanetaryStrengths {
  [planet: string]: {
    shadbala: number;
    dignity: number;
    aspectual: number;
    positional: number;
    overall: number;
  };
}

/**
 * Yoga Information
 */
export interface Yoga {
  name: string;
  type: string;
  planets: string[];
  strength: number;
  effects: string[];
}

/**
 * Yoga Analysis Result
 */
export interface YogaAnalysis {
  yogas: Array<{
    name: string;
    type: string;
    planets: string[];
    strength: number;
    description: string;
    effects: {
      power?: string;
      career?: string;
      wealth?: string;
      recognition?: string;
      duration?: string;
      wisdom?: string;
      fame?: string;
      transformation?: string;
      success?: string;
      intensity?: string;
      qualities?: string;
      personality?: string;
    };
    houses?: number[];
    house?: number;
    sign?: number;
    planet?: string;
  }>;
  summary: {
    totalYogas: number;
    categories: Record<string, number>;
    strongestYoga?: {
      name: string;
      type: string;
      planets: string[];
      strength: number;
      description: string;
      effects: any;
    };
    dominantCategory?: string;
  };
  success: boolean;
  error?: string;
}

/**
 * Complete Birth Chart Data
 */
export interface BirthChart {
   // Basic Information
   birthData: BirthData;
   julianDay: number;
   ayanamsa: number;
   lst: number;

   // Chart Elements
   ascendant: {
       longitude: number;
       sign: number;
       degree: number;
   };

   houses: number[]; // 12 house cusps

   planets: Record<string, PlanetaryPosition>;

   // Lunar Information
   moonDetails: MoonDetails;

   // Dasha Information
   dasha: DashaInfo;

   // Divisional Charts
   divisionalCharts: Record<string, DivisionalChart>;

   // Analysis
   yogas?: Yoga[];
   strengths: PlanetaryStrengths;
   predictions?: Prediction[];

   // Lal Kitab (optional)
   lalKitab?: {
       positions: Record<string, number>;
       debts: string[];
       remedies: string[];
   };

   // Methods
   getCurrentDasha?: (date: Date) => CurrentDasha;
   getHouseFromLongitude?: (longitude: number) => number;
   getPlanetInHouse?: (house: number) => string[];
   getAspectsToPoint?: (longitude: number) => Array<{
       planet: string;
       aspect: string;
       orb: number;
   }>;
}

/**
 * Western Birth Chart Data
 */
export interface WesternBirthChart {
   // Basic Information
   birthData: BirthData;
   julianDay: number;
   lst: number;

   // Chart Elements
   ascendant: {
       longitude: number;
       sign: number;
       degree: number;
   };

   midheaven: {
       longitude: number;
       sign: number;
       degree: number;
   };

   houses: number[]; // 12 house cusps

   planets: Record<string, {
       longitude: number;
       sign: number;
       degree: number;
       house: number;
       retrograde: boolean;
   }>;

   aspects: Array<{
       planet1: string;
       planet2: string;
       aspect: string;
       angle: number;
       orb: number;
       exact: boolean;
   }>;

   // Analysis (optional)
   dominantElements?: any;
   chartShape?: string;
   patterns?: any[];
}

/**
 * Divisional Chart Data
 */
export interface DivisionalChart {
  type: string;
  name: string;
  significance: string;
  divisor: number;
  positions: Record<string, number>; // Planet longitudes in degrees
  houses: number[]; // House cusps in degrees
}

/**
 * Varga Bala (Divisional Strength) Analysis
 */
export interface VargaBala {
  planet: string;
  score: number;
  maxScore: number;
  percentage: number;
  strength: string;
  breakdown: Record<string, number>; // Chart type weights
}

/**
 * Complete Divisional Charts Analysis
 */
export interface DivisionalChartsAnalysis {
  charts: Record<string, DivisionalChart>;
  vargaBala: Record<string, VargaBala>;
  analysisDate: Date;
}

/**
 * Muhurat Activity Types
 */
export type ActivityType = 'marriage' | 'business' | 'travel' | 'education' | 'medical' | 'health' | 'career' | 'finance' | 'general';

/**
 * Muhurat Preferences
 */
export interface MuhuratPreferences {
  latitude?: number;
  longitude?: number;
  minScore?: number;
  maxResults?: number;
  location?: string;
}

/**
 * Panchang Elements
 */
export interface PanchangElement {
  number: number;
  name: string;
  isAuspicious: boolean;
  lord?: string;
  nature?: string;
  paksha?: 'Shukla' | 'Krishna';
  progress?: number;
  pada?: number;
  strength?: number;
}

/**
 * Complete Panchang Data
 */
export interface PanchangData {
  date: Date;
  location: { latitude: number; longitude: number };
  sunrise: Date;
  tithi: PanchangElement;
  nakshatra: PanchangElement;
  yoga: PanchangElement;
  karana: PanchangElement;
  vara: PanchangElement;
  sunLongitude: number;
  moonLongitude: number;
  ayanamsa: number;
  muhurats: Muhurat[];
  auspiciousPeriods: AuspiciousPeriod[];
}

/**
 * Individual Muhurat
 */
export interface Muhurat {
  number: number;
  name: string;
  startTime: Date;
  endTime: Date;
  isAuspicious: boolean;
  rulingPlanet: string;
  duration: number; // in minutes
}

/**
 * Auspicious Period
 */
export interface AuspiciousPeriod {
  name: string;
  type: string;
  startTime: Date;
  endTime: Date;
  significance: string;
}

/**
 * Muhurat Score
 */
export interface MuhuratScore {
  totalScore: number;
  componentScores: {
    tithi: number;
    nakshatra: number;
    yoga: number;
    karana: number;
    vara: number;
    muhurat: number;
    planetary: number;
  };
  grade: string;
  recommendation: string;
}

/**
 * Muhurat Result
 */
export interface MuhuratResult {
  date: Date;
  timeSlot?: {
    startTime: Date;
    endTime: Date;
    period: string;
  };
  panchang: PanchangData;
  score: MuhuratScore;
  activityType: ActivityType;
  validation?: {
    isValid: boolean;
    validations: Record<string, { passed: boolean; message?: string }>;
    recommendations: string[];
  };
}

/**
 * Muhurat Report
 */
export interface MuhuratReport {
  date: Date;
  timeSlot?: {
    startTime: Date;
    endTime: Date;
    period: string;
  };
  activityType: ActivityType;
  panchang: {
    tithi: PanchangElement;
    nakshatra: PanchangElement;
    yoga: PanchangElement;
    karana: PanchangElement;
    vara: PanchangElement;
  };
  score: MuhuratScore;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  alternatives?: MuhuratResult[];
  remedies: string[];
  validation: {
    isValid: boolean;
    validations: Record<string, { passed: boolean; message?: string }>;
    recommendations: string[];
  };
}

/**
 * Horoscope Type
 */
export type HoroscopeType = 'daily' | 'weekly' | 'monthly' | 'yearly';

/**
 * Horoscope Category
 */
export interface HoroscopeCategory {
  score: number;
  rating: string;
  prediction: string;
  advice: string;
}

/**
 * Horoscope Predictions
 */
export interface HoroscopePredictions {
  overall: {
    score: number;
    rating: string;
    summary: string;
    keyInfluences: string[];
  };
  categories: {
    love: HoroscopeCategory;
    career: HoroscopeCategory;
    health: HoroscopeCategory;
    finance: HoroscopeCategory;
    family: HoroscopeCategory;
    spiritual: HoroscopeCategory;
  };
  auspiciousPeriods: Array<{
    name: string;
    start: number; // hours from midnight
    end: number; // hours from midnight
    significance: string;
  }>;
  challenges: Array<{
    name: string;
    start: number;
    end: number;
    significance: string;
  }>;
  remedies: string[];
}

/**
 * Daily Horoscope Specific Data
 */
export interface DailyHoroscopeData {
  moonSign: {
    signNumber: number;
    signName: string;
    longitude: number;
    degreeInSign: number;
  };
  tithi: {
    number: number;
    name: string;
    paksha: string;
    isAuspicious: boolean;
  };
  nakshatra: {
    nakshatraNumber: number;
    nakshatraName: string;
    lord: string;
  };
  yoga: {
    number: number;
    name: string;
    isAuspicious: boolean;
  };
  karana: {
    number: number;
    name: string;
    isAuspicious: boolean;
  };
  vara: {
    number: number;
    name: string;
    lord: string;
    isAuspicious: boolean;
  };
  auspiciousHours: Array<{
    name: string;
    start: number;
    end: number;
    significance: string;
  }>;
  challengingHours: Array<{
    name: string;
    start: number;
    end: number;
    significance: string;
  }>;
  lunarPhase: string;
}

/**
 * Weekly Horoscope Specific Data
 */
export interface WeeklyHoroscopeData {
  weeklyTransit: Array<{
    date: Date;
    moonSign: number;
    keyTransits: string[];
  }>;
  peakDays: Array<{
    date: Date;
    score: number;
    reason: string;
  }>;
  challengingDays: Array<{
    date: Date;
    score: number;
    reason: string;
  }>;
  bestActivities: string[];
}

/**
 * Monthly Horoscope Specific Data
 */
export interface MonthlyHoroscopeData {
  monthlyTransit: {
    sunTransit: {
      startSign: number;
      endSign: number;
      degreesTravelled: number;
    };
    moonTransits: Array<{
      date: Date;
      sign: number;
    }>;
    majorTransits: Array<{
      planet: string;
      date: Date;
      fromSign: number;
      toSign: number;
    }>;
  };
  lunarPhases: Array<{
    date: Date;
    phase: string;
    significance: string;
  }>;
  planetaryMovements: Array<{
    planet: string;
    movement: string;
    significance: string;
  }>;
  auspiciousDates: Array<{
    date: Date;
    reason: string;
    significance: string;
  }>;
  challengingPeriods: Array<{
    startDate: Date;
    endDate: Date;
    reason: string;
    significance: string;
  }>;
}

/**
 * Yearly Horoscope Specific Data
 */
export interface YearlyHoroscopeData {
  yearlyTransit: {
    jupiterTransit: {
      sign: number;
      signName: string;
      effect: string;
    };
    saturnTransit: {
      sign: number;
      signName: string;
      effect: string;
    };
    rahuKetuTransit: {
      position: string;
      effect: string;
    };
    solarReturns: Array<{
      date: Date;
      significance: string;
    }>;
  };
  dashaInfluence: {
    mahadasha: string;
    antardasha: string;
    influence: string;
    duration: {
      start: Date;
      end: Date;
    };
  };
  majorEvents: Array<{
    type: string;
    significance: string;
    timing: string;
  }>;
  lifeAreas: Array<{
    area: string;
    focus: string;
    opportunities: string[];
    challenges: string[];
  }>;
  remedies: string[];
}

/**
 * Complete Horoscope Data
 */
export interface Horoscope {
    type: HoroscopeType;
    dateRange: {
        start: Date;
        end: Date;
    };
    rashi?: string;
    animalSign?: string;
    predictions: HoroscopePredictions;
    transits?: {
        positions: TransitPositions;
        date: Date;
        ayanamsa: number;
        julianDay: number;
    };
    lunarData?: any;
    elementalBalance?: any;
    confidence: number;
    daily?: DailyHoroscopeData;
    weekly?: WeeklyHoroscopeData;
    monthly?: MonthlyHoroscopeData;
    yearly?: YearlyHoroscopeData;
}

/**
 * Western Horoscope Type
 */
export type WesternHoroscopeType = 'daily' | 'weekly' | 'monthly' | 'yearly';

/**
 * Western Daily Horoscope Specific Data
 */
export interface WesternDailyHoroscopeData {
    moonSign: {
        signNumber: number;
        signName: string;
        longitude: number;
        degreeInSign: number;
    };
    voidOfCourse: boolean;
    moonPhase: string;
    planetaryHours: Array<{
        planet: string;
        start: number;
        end: number;
        type: 'day' | 'night';
    }>;
    auspiciousHours: Array<{
        name: string;
        start: number;
        end: number;
        significance: string;
    }>;
    challengingHours: Array<{
        name: string;
        start: number;
        end: number;
        significance: string;
    }>;
}

/**
 * Western Weekly Horoscope Specific Data
 */
export interface WesternWeeklyHoroscopeData {
    weeklyTransit: Array<{
        date: Date;
        moonSign: number;
        keyAspects: Array<{
            natalPlanet: string;
            transitPlanet: string;
            aspect: string;
            strength: number;
        }>;
        voidOfCourse: boolean;
    }>;
    peakDays: Array<{
        date: Date;
        score: number;
        reason: string;
    }>;
    challengingDays: Array<{
        date: Date;
        score: number;
        reason: string;
    }>;
    bestActivities: string[];
}

/**
 * Western Monthly Horoscope Specific Data
 */
export interface WesternMonthlyHoroscopeData {
    monthlyTransit: {
        sunTransit: {
            startSign: number;
            endSign: number;
            degreesTravelled: number;
        };
        moonTransits: Array<{
            date: Date;
            sign: number;
        }>;
        majorAspects: Array<{
            planet: string;
            date: Date;
            fromSign: number;
            toSign: number;
        }>;
    };
    lunarPhases: Array<{
        date: Date;
        phase: string;
        significance: string;
    }>;
    planetaryMovements: Array<{
        planet: string;
        movement: string;
        significance: string;
    }>;
    retrogrades: Array<{
        planet: string;
        startDate: Date;
        endDate: Date;
        significance: string;
    }>;
    newMoon: Date | null;
    fullMoon: Date | null;
}

/**
 * Western Yearly Horoscope Specific Data
 */
export interface WesternYearlyHoroscopeData {
    yearlyTransit: {
        jupiterTransit: {
            sign: number;
            signName: string;
            effect: string;
        };
        saturnTransit: {
            sign: number;
            signName: string;
            effect: string;
        };
        uranusPlutoTransits: {
            uranus: {
                sign: number;
                effect: string;
            };
            pluto: {
                sign: number;
                effect: string;
            };
        };
        solarReturn: {
            date: Date;
            chart: any;
            themes: string[];
        };
    };
    majorAspects: Array<{
        type: string;
        significance: string;
        timing: Date;
    }>;
    retrogrades: Array<{
        planet: string;
        periods: Array<{
            start: Date;
            end: Date;
        }>;
        significance: string;
    }>;
    eclipses: Array<{
        date: Date;
        type: 'solar' | 'lunar';
        significance: string;
    }>;
    lifeAreas: Array<{
        area: string;
        focus: string;
        opportunities: string[];
        challenges: string[];
    }>;
}

/**
 * Complete Western Horoscope Data
 */
export interface WesternHoroscope {
    type: WesternHoroscopeType;
    dateRange: {
        start: Date;
        end: Date;
    };
    sunSign: string;
    moonSign: string;
    risingSign: string;
    predictions: {
        overall: {
            score: number;
            rating: string;
            summary: string;
            keyInfluences: string[];
        };
        categories: {
            love: {
                score: number;
                rating: string;
                prediction: string;
                advice: string;
            };
            career: {
                score: number;
                rating: string;
                prediction: string;
                advice: string;
            };
            health: {
                score: number;
                rating: string;
                prediction: string;
                advice: string;
            };
            finance: {
                score: number;
                rating: string;
                prediction: string;
                advice: string;
            };
            family: {
                score: number;
                rating: string;
                prediction: string;
                advice: string;
            };
            spiritual: {
                score: number;
                rating: string;
                prediction: string;
                advice: string;
            };
        };
        aspects: Array<{
            natalPlanet: string;
            transitPlanet: string;
            aspect: string;
            strength: number;
            applying: boolean;
        }>;
        voidOfCourse: Array<{
            date: Date;
            start: Date;
            end: Date;
        }>;
        challenges: Array<{
            type: string;
            description: string;
            severity: number;
        }>;
        opportunities: Array<{
            type: string;
            description: string;
            potential: number;
        }>;
    };
    transits: {
        positions: Record<string, number>;
        date: Date;
        julianDay: number;
        retrograde: Record<string, boolean>;
    };
    confidence: number;
    daily?: WesternDailyHoroscopeData;
    weekly?: WesternWeeklyHoroscopeData;
    monthly?: WesternMonthlyHoroscopeData;
    yearly?: WesternYearlyHoroscopeData;
}

/**
 * Chinese Horoscope Type
 */
export type ChineseHoroscopeType = 'daily' | 'weekly' | 'monthly' | 'yearly';

/**
 * Chinese Daily Horoscope Specific Data
 */
export interface ChineseDailyHoroscopeData {
   lunarPhase: string;
   solarTerm: any;
   lunarMansion: number;
   dayElement: string;
   auspiciousHours: Array<{
       name: string;
       start: number;
       end: number;
       significance: string;
   }>;
   challengingHours: Array<{
       name: string;
       start: number;
       end: number;
       significance: string;
   }>;
}

/**
 * Chinese Weekly Horoscope Specific Data
 */
export interface ChineseWeeklyHoroscopeData {
   weeklyLunar: Array<{
       date: Date;
       phase: string;
       mansion: number;
       element: string;
   }>;
   peakDays: Array<{
       date: Date;
       score: number;
       reason: string;
   }>;
   challengingDays: Array<{
       date: Date;
       score: number;
       reason: string;
   }>;
   bestActivities: string[];
}

/**
 * Chinese Monthly Horoscope Specific Data
 */
export interface ChineseMonthlyHoroscopeData {
   monthlyLunar: {
       newMoon: Date | null;
       fullMoon: Date | null;
       lunarMansion: number;
   };
   solarTerms: Array<{
       name: string;
       date: Date;
       longitude: number;
       significance: string;
   }>;
   lunarPhases: Array<{
       date: Date;
       phase: string;
       significance: string;
   }>;
   elementalShifts: any;
   auspiciousDates: Array<{
       date: Date;
       reason: string;
       significance: string;
   }>;
   challengingPeriods: Array<{
       startDate: Date;
       endDate: Date;
       reason: string;
       significance: string;
   }>;
}

/**
 * Chinese Yearly Horoscope Specific Data
 */
export interface ChineseYearlyHoroscopeData {
   yearlyLunar: {
       solarTerms: any[];
       lunarCycles: number;
       dominantElement: string;
   };
   animalSign: string;
   elementalTheme: string;
   majorEvents: Array<{
       type: string;
       significance: string;
       timing: string;
   }>;
   lifeAreas: Record<string, {
       influence: number;
       rating: string;
       specificGuidance: string;
       opportunities: string[];
       challenges: string[];
   }>;
   remedies: string[];
}

/**
 * Chinese Horoscope Data
 */
export interface ChineseHoroscope {
   type: ChineseHoroscopeType;
   dateRange: {
       start: Date;
       end: Date;
   };
   animalSign: string;
   predictions: HoroscopePredictions;
   lunarData: any;
   elementalBalance: any;
   confidence: number;
   daily?: ChineseDailyHoroscopeData;
   weekly?: ChineseWeeklyHoroscopeData;
   monthly?: ChineseMonthlyHoroscopeData;
   yearly?: ChineseYearlyHoroscopeData;
}

/**
 * Horoscope Request
 */
export interface HoroscopeRequest {
  type: HoroscopeType;
  date: Date;
  birthChart?: BirthChart;
}

/**
 * Synastry Aspect
 */
export interface SynastryAspect {
  planet1: string;
  planet2: string;
  aspect: string;
  orb: number;
  strength: number;
  interpretation: string;
}

/**
 * House Overlay
 */
export interface HouseOverlay {
  planet: string;
  house: number;
  sign: number;
  interpretation: string;
}

/**
 * Synastry Analysis
 */
export interface SynastryAnalysis {
  aspects: SynastryAspect[];
  overlays: HouseOverlay[];
  summary: {
    totalAspects: number;
    totalOverlays: number;
    keyThemes: string[];
  };
}

/**
 * Composite Planet
 */
export interface CompositePlanet {
  longitude: number;
  sign: number;
  degree: number;
  house: number;
}

/**
 * Composite Aspect
 */
export interface CompositeAspect {
  planets: string[];
  aspect: string;
  strength: number;
  interpretation: string;
}

/**
 * Composite Chart
 */
export interface CompositeChart {
  planets: Record<string, CompositePlanet>;
  ascendant: {
    longitude: number;
    sign: number;
    degree: number;
  };
  houses: number[];
  aspects: CompositeAspect[];
  interpretation: string[];
}

/**
 * Compatibility Analysis
 */
export interface CompatibilityAnalysis {
  overall: number;
  breakdown: {
    synastry: number;
    overlays: number;
    composite: number;
  };
  interpretation: string;
  strengths: string[];
  challenges: string[];
  recommendations: string[];
  summary: {
    overallScore: number;
    compatibility: string;
    confidence: string;
  };
  componentAnalysis: {
    synastry: {
      score: number;
      aspects: number;
      interpretation: string;
    };
    overlays: {
      score: number;
      overlays: number;
      interpretation: string;
    };
    composite: {
      score: number;
      aspects: number;
      interpretation: string;
    };
  };
  relationshipInsights: string[];
}

/**
 * Guna Milan Koota Score
 */
export interface GunaMilanKootaScore {
  kootaName: string;
  score: number;
  maxScore: number;
  percentage: number;
  interpretation: string;
}

/**
 * Guna Milan Recommendation
 */
export interface GunaMilanRecommendation {
  type: 'Critical' | 'Warning' | 'Positive' | 'Suggestion';
  message: string;
  remedies?: string[];
  suggestions?: string[];
}

/**
 * Guna Milan Exception
 */
export interface GunaMilanException {
  type: string;
  name: string;
  description: string;
  condition: string;
}

/**
 * Guna Milan Analysis Result
 */
export interface GunaMilanAnalysis {
  compatibilityId: string;
  bride: {
    nakshatra: string;
    lord: string;
    sign: number;
    caste?: string;
    gana?: string;
    yoni?: string;
    nadi?: string;
  };
  groom: {
    nakshatra: string;
    lord: string;
    sign: number;
    caste?: string;
    gana?: string;
    yoni?: string;
    nadi?: string;
  };
  scores: Record<string, number>; // Individual koota scores
  totalScore: number;
  maxScore: number;
  percentage: number;
  compatibility: string;
  recommendations: GunaMilanRecommendation[];
  exceptions: GunaMilanException[];
  remedies?: string[];
  analysis?: {
    strengths: string[];
    challenges: string[];
    luckyDates?: string[];
  };
}

/**
 * ZC1.10 Manglik Dosha Analysis
 */
export interface ManglikDoshaAnalysis {
  isManglik: boolean;
  intensity: number;
  cancellations: string[];
  remedies: Array<{
    type: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  effects: string[];
}

/**
 * ZC1.10 Nadi Compatibility Analysis
 */
export interface NadiCompatibilityAnalysis {
  compatible: boolean;
  score: number;
  maxScore: number;
  percentage: number;
  brideNadi: string;
  groomNadi: string;
  analysis: {
    type: string;
    benefits?: string[];
    concerns?: string[];
    complementaryTraits?: string[];
    recommendations?: string[];
  };
  remedies: Array<{
    type: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

/**
 * ZC1.10 General Dosha Analysis
 */
export interface GeneralDoshaAnalysis {
  kalasarpa: {
    present: boolean;
    type?: string;
    intensity: number;
    effects: string[];
    remedies: Array<{
      type: string;
      description: string;
    }>;
  };
  pitru: {
    present: boolean;
    intensity: number;
    effects: string[];
    remedies: Array<{
      type: string;
      description: string;
    }>;
  };
  guruChandal: {
    present: boolean;
    intensity: number;
    effects: string[];
    remedies: Array<{
      type: string;
      description: string;
    }>;
  };
  overallImpact: string;
  remedies: Array<{
    type: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

/**
 * ZC1.10 Varsha Analysis
 */
export interface VarshaAnalysis {
  returnChart: {
    ascendant: {
      longitude: number;
      sign: number;
      degree: number;
    };
    houses: number[];
    planets: Record<string, {
      longitude: number;
      sign: number;
      degree: number;
      house: number;
    }>;
  };
  muntha: {
    planet: string;
    position: {
      longitude: number;
      sign: number;
      degree: number;
      house: number;
    };
    strength: number;
    significance: string;
  };
  predictions: string[];
  keyThemes: string[];
}

/**
 * ZC1.10 Complete Analysis Result
 */
export interface ZC110Analysis {
  analysisId: string;
  timestamp: string;
  results: {
    manglikAnalysis: ManglikDoshaAnalysis;
    nadiAnalysis?: NadiCompatibilityAnalysis;
    doshaAnalysis: GeneralDoshaAnalysis;
    varshaAnalysis?: VarshaAnalysis;
  };
  recommendations: string[];
  remedies: Array<{
    category: string;
    items: Array<{
      type: string;
      description: string;
      priority: 'high' | 'medium' | 'low';
    }>;
  }>;
}

/**
 * ZC1.11 Lucky Number & Auspicious Timing Analysis
 */
export interface NumerologyProfile {
  systems: {
    vedic: {
      lifePath: {
        lifePathNumber: number;
        components: {
          day: number;
          month: number;
          year: number;
          total: number;
        };
        significance: {
          name: string;
          qualities: string[];
        };
      };
      destiny: {
        destinyNumber: number;
        nameSum: number;
        system: string;
        significance: {
          name: string;
          qualities: string[];
        };
      };
      soulUrge: {
        soulUrgeNumber: number;
        vowelSum: number;
        significance: {
          name: string;
          qualities: string[];
        };
      };
      personality: {
        personalityNumber: number;
        consonantSum: number;
        significance: {
          name: string;
          qualities: string[];
        };
      };
    };
    pythagorean: {
      lifePath: {
        lifePathNumber: number;
        components: {
          day: number;
          month: number;
          year: number;
          total: number;
        };
        significance: {
          name: string;
          qualities: string[];
        };
      };
      destiny: {
        destinyNumber: number;
        nameSum: number;
        system: string;
        significance: {
          name: string;
          qualities: string[];
        };
      };
      soulUrge: {
        soulUrgeNumber: number;
        vowelSum: number;
        significance: {
          name: string;
          qualities: string[];
        };
      };
      personality: {
        personalityNumber: number;
        consonantSum: number;
        significance: {
          name: string;
          qualities: string[];
        };
      };
    };
  };
  luckyNumbers: {
    primary: number[];
    secondary: number[];
    all: number[];
  };
  challengeNumbers: {
    first: number;
    second: number;
    third: number;
    fourth: number;
  };
}

export interface LuckyNumberCategories {
  primary: {
    numbers: number[];
    significance: Array<{
      number: number;
      significance: {
        name: string;
        qualities: string[];
      };
    }>;
  };
  secondary: {
    numbers: number[];
    significance: Array<{
      number: number;
      significance: {
        name: string;
        qualities: string[];
      };
      type: string;
    }>;
  };
  compound: {
    numbers: number[];
    significance: Array<{
      number: number;
      significance: {
        name: string;
        qualities: string[];
      };
      type: string;
    }>;
  };
  planetary: {
    numbers: number[];
    rulingPlanet: string;
    friendlyPlanets: string[];
    significance: Array<{
      number: number;
      planet: string;
      relation: string;
    }>;
  };
  activity: {
    numbers: number[];
    activity: string;
    baseNumbers: number[];
    personalNumbers: number[];
    significance: Array<{
      number: number;
      significance: {
        name: string;
        qualities: string[];
      };
      activity: string;
    }>;
  };
  timing: {
    numbers: number[];
    date: string;
    significance: Array<{
      number: number;
      significance: {
        name: string;
        qualities: string[];
      };
      type: string;
    }>;
  };
}

export interface LuckyNumberProfile {
  profile: NumerologyProfile;
  categories: LuckyNumberCategories;
  recommendations: string[];
}

export interface ActivityRecommendations {
  activityType: string;
  luckyNumbers: Array<{
    number: number;
    priority: string;
    reason: string;
  }>;
  auspiciousMonths: number[];
  preferredNakshatras: string[];
  timingPreferences: {
    numerologyWeight: number;
    timingWeight: number;
    preferredMonths: number[];
    dateRange: {
      start: Date;
      end: Date;
    } | null;
  };
  numerologyInsights: string[];
  precautions: string[];
}

export interface IntegratedTimingResult {
  date: Date;
  timeSlot?: {
    startTime: Date;
    endTime: Date;
    period: string;
  };
  score: {
    totalScore: number;
    componentScores: {
      tithi: number;
      nakshatra: number;
      yoga: number;
      karana: number;
      vara: number;
      muhurat: number;
      planetary: number;
    };
    grade: string;
    recommendation: string;
  };
  activityType: ActivityType;
  panchang: {
    tithi: PanchangElement;
    nakshatra: PanchangElement;
    yoga: PanchangElement;
    karana: PanchangElement;
    vara: PanchangElement;
  };
  numerology: {
    dateNumbers: number[];
    compatibilityScore: number;
    luckyNumberMatch: Array<{
      number: number;
      type: string;
      significance: {
        name: string;
        qualities: string[];
      };
    }>;
  };
  adjustedScore: {
    totalScore: number;
    componentScores: {
      tithi: number;
      nakshatra: number;
      yoga: number;
      karana: number;
      vara: number;
      muhurat: number;
      planetary: number;
    };
    numerologyCompatibility: number;
    combinedScore: number;
    grade: string;
    recommendation: string;
  };
}

export interface IntegratedAnalysis {
  numerologyProfile: LuckyNumberProfile;
  auspiciousTimings: MuhuratResult[];
  integratedRecommendations: IntegratedTimingResult[];
  personalizedReport: {
    summary: {
      activityType: string;
      primaryLuckyNumbers: number[];
      recommendedDate: Date | null;
      compatibilityScore: number;
    };
    numerologyInsights: string[];
    timingInsights: string[];
    recommendations: string[];
    precautions: string[];
  };
}

export interface ComprehensiveReport {
  executiveSummary: {
    overview: string;
    keyFindings: string[];
    recommendations: string[];
  };
  numerologySection: {
    title: string;
    profile: NumerologyProfile;
    insights: string[];
  };
  timingSection: {
    title: string;
    recommendations: IntegratedTimingResult[];
    insights: string[];
  };
  activitySection: {
    title: string;
    recommendations: ActivityRecommendations;
    insights: string[];
  };
  recommendations: Array<{
    category: string;
    items: string[];
  }>;
  precautions: string[];
}

export interface ZC111Analysis {
  numerologyProfile: LuckyNumberProfile;
  activityRecommendations: ActivityRecommendations;
  integratedAnalysis: IntegratedAnalysis;
  comprehensiveReport: ComprehensiveReport;
  metadata: {
    generatedAt: string;
    systemVersion: string;
    activityType: string;
    dateRange: {
      start: Date;
      end: Date;
    };
  };
}

export interface ZC111QuickAnalysis {
  luckyNumbers: number[];
  lifePathNumber: number;
  destinyNumber: number;
  activityGuidance: ActivityRecommendations;
  quickTips: string[];
}

/**
 * ZC1.12 Medical Astrology Profile Types
 */

/**
 * Ayurvedic Constitution Balance
 */
export interface AyurvedicConstitution {
  VATA: number;    // Percentage (0-100)
  PITTA: number;   // Percentage (0-100)
  KAPHA: number;   // Percentage (0-100)
}

/**
 * Planetary Health Analysis
 */
export interface PlanetaryHealth {
  strength: number;
  house: number;
  sign: number;
  aspects: Array<{
    planet: string;
    aspect: string;
    separation: number;
    nature: string;
  }>;
  bodyParts: string[];
  diseases: string[];
  constitution: string;
  overallHealth: string;
}

/**
 * Disease Risk Assessment
 */
export interface DiseaseRisk {
  planet: string;
  bodyParts: string[];
  diseases: string[];
  severity: 'High' | 'Medium' | 'Low';
  likelihood: number;
}

/**
 * Current Health Assessment
 */
export interface CurrentHealthAssessment {
  overallHealth: string;
  riskLevel: string;
  activeRisks: number;
  constitutionBalance: AyurvedicConstitution;
  recommendations: Array<{
    type: string;
    priority: string;
    advice: string;
  }>;
}

/**
 * Future Health Prediction
 */
export interface HealthPrediction {
  period: {
    planet: string;
    subPlanet?: string;
    start: string;
    end: string;
    years: number;
  };
  risks: Array<{
    planet: string;
    diseases: string[];
    likelihood: number;
    bodyParts: string[];
  }>;
  severity: string;
  recommendations: Array<{
    type: string;
    bodyParts: string[];
    frequency: string;
    specialist: string[];
  }>;
}

/**
 * Gemstone Therapy Recommendation
 */
export interface GemstoneTherapy {
  planet: string;
  gemstone: {
    name: string;
    weight: string;
    metal: string;
    finger: string;
  };
  purpose: string;
  wearingInstructions: string;
  duration: string;
}

/**
 * Mantra Therapy Recommendation
 */
export interface MantraTherapy {
  planet: string;
  mantra: {
    mantra: string;
    count: number;
    time: string;
    duration: string;
  };
  purpose: string;
  benefits: string;
}

/**
 * Color Therapy Recommendation
 */
export interface ColorTherapy {
  planet: string;
  colors: string[];
  usage: string;
}

/**
 * Dietary Recommendations
 */
export interface DietaryRecommendations {
  foods: string[];
  avoid: string[];
  herbs: string[];
}

/**
 * Charitable Activity Recommendation
 */
export interface CharitableActivity {
  planet: string;
  activities: string[];
  frequency: string;
}

/**
 * Medical Integration Recommendation
 */
export interface MedicalIntegration {
  diseases: string[];
  specialists: string[];
  monitoring: string;
  integration: string;
}

/**
 * Remedial Recommendations
 */
export interface RemedialRecommendations {
  gemstoneTherapy: GemstoneTherapy[];
  mantraTherapy: MantraTherapy[];
  colorTherapy: ColorTherapy[];
  dietaryRecommendations: DietaryRecommendations;
  lifestyleModifications: string[];
  charitableActivities: CharitableActivity[];
  medicalIntegration: MedicalIntegration[];
}

/**
 * Medical Integration Profile
 */
export interface MedicalIntegrationProfile {
  patientProfile: {
    name: string;
    age: number;
    constitution: AyurvedicConstitution;
    dominantDosha: string;
  };
  astrologicalRisks: DiseaseRisk[];
  medicalCorrelations: Array<{
    astrologicalRisk: DiseaseRisk;
    medicalConditions: Array<{
      name: string;
      treatment: string;
    }>;
    correlationStrength: string;
    explanation: string;
  }>;
  integratedRecommendations: Array<{
    condition: string;
    conventionalTreatment: string;
    astrologicalSupport: {
      gemstones: GemstoneTherapy[];
      mantras: MantraTherapy[];
      diet: DietaryRecommendations;
      lifestyle: string[];
    };
    integratedApproach: {
      primaryTreatment: string;
      astrologicalEnhancement: string;
      timing: string;
      complementary: string;
      monitoring: string;
    };
  }>;
  monitoringSchedule: {
    regularCheckups: Array<{
      condition: string;
      frequency: string;
      specialist: string;
    }>;
    highRiskPeriods: Array<{
      period: any;
      risks: any[];
      additionalMonitoring: string;
    }>;
    preventiveScreenings: any[];
  };
  preventiveMeasures: Array<{
    type: string;
    dosha?: string;
    planet?: string;
    measures: string[];
  }>;
}

/**
 * Complete Medical Astrology Profile
 */
export interface MedicalAstrologyProfile {
  constitution: AyurvedicConstitution;
  planetaryHealth: Record<string, PlanetaryHealth>;
  diseaseRisks: DiseaseRisk[];
  currentHealth: CurrentHealthAssessment;
  futurePredictions: HealthPrediction[];
  remedies: RemedialRecommendations;
  medicalIntegration?: MedicalIntegrationProfile;
  generatedAt: string;
  systemVersion: string;
}

/**
 * API Response wrapper
 */
/**
 * ZC1.13 Pet Astrology Profile Types
 */

/**
 * Animal Classification
 */
export interface AnimalClassification {
  planetaryRuler: string;
  element: string;
  nature: string;
  breeds: string[];
}

/**
 * Breed Astrological Traits
 */
export interface BreedAstrologicalTraits {
  sunSign: string;
  moonSign: string;
  dominantPlanet: string;
  personality: string;
  healthConcerns: string[];
  trainingStyle: string;
  energyLevel: string;
}

/**
 * Animal Zodiac Characteristics
 */
export interface AnimalZodiacCharacteristics {
  traits: string;
  compatibility: string;
  challenges: string;
  training: string;
}

/**
 * Pet Birth Data
 */
export interface PetBirthData {
  name: string;
  species: string;
  breed?: string;
  birthDate: Date;
  birthTime?: string;
  birthLocation?: {
    latitude: number;
    longitude: number;
  };
  ownerName?: string;
}

/**
 * Pet Chart Analysis
 */
export interface PetChartAnalysis {
  ascendant: {
    sign: string;
    degree: number;
    lord: string;
  };
  moonSign: string;
  sunSign: string;
  dominantPlanets: string[];
  favorablePlanets: string[];
  challengingPlanets: string[];
}

/**
 * Pet Behavioral Profile
 */
export interface PetBehavioralProfile {
  temperament: string;
  energyLevel: string;
  socialNature: string;
  intelligence: string;
  loyalty: string;
  adaptability: string;
  behavioralTendencies: Array<{
    trait: string;
    strength: number;
    description: string;
  }>;
}

/**
 * Pet Health Analysis
 */
export interface PetHealthAnalysis {
  overallHealth: string;
  constitution: string;
  vulnerableAreas: string[];
  commonHealthIssues: Array<{
    condition: string;
    likelihood: number;
    prevention: string[];
  }>;
  dietaryRecommendations: {
    preferredFoods: string[];
    foodsToAvoid: string[];
    supplements: string[];
  };
  careSchedule: {
    exercise: string;
    grooming: string;
    veterinary: string;
  };
}

/**
 * Pet Training Analysis
 */
export interface PetTrainingAnalysis {
  learningStyle: string;
  bestMethods: string[];
  optimalTiming: string[];
  challenges: string[];
  recommendedActivities: string[];
  trainingTips: string[];
}

/**
 * Pet Compatibility Analysis
 */
export interface PetCompatibilityAnalysis {
  ownerCompatibility: {
    score: number;
    factors: string[];
    recommendations: string[];
  };
  familyCompatibility: {
    score: number;
    considerations: string[];
  };
  otherPets: {
    compatibleSpecies: string[];
    compatibilityNotes: string[];
  };
}

/**
 * Pet Astrological Remedies
 */
export interface PetAstrologicalRemedies {
  gemstones: Array<{
    stone: string;
    purpose: string;
    placement: string;
  }>;
  colors: string[];
  mantras: Array<{
    mantra: string;
    purpose: string;
    timing: string;
  }>;
  rituals: Array<{
    ritual: string;
    frequency: string;
    benefits: string;
  }>;
  charitableActs: string[];
}

/**
 * Complete Pet Astrology Profile
 */
export interface PetAstrologyProfile {
  petInfo: PetBirthData;
  chartAnalysis: PetChartAnalysis;
  behavioralProfile: PetBehavioralProfile;
  healthAnalysis: PetHealthAnalysis;
  trainingAnalysis: PetTrainingAnalysis;
  compatibilityAnalysis: PetCompatibilityAnalysis;
  remedies: PetAstrologicalRemedies;
  predictions: Array<{
    period: string;
    prediction: string;
    advice: string;
  }>;
  generatedAt: string;
  systemVersion: string;
}

/**
 * ZC3.11 Western Pet Astrology Types
 */

/**
 * Western Pet Birth Data Input
 */
export interface WesternPetBirthData {
  species: string;
  breed?: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
  birthMinute: number;
  birthSecond?: number;
  birthLatitude: number;
  birthLongitude: number;
  birthTimezone?: number;
  name?: string;
  ownerName?: string;
}

/**
 * Western Pet Chart Analysis
 */
export interface WesternPetChartAnalysis {
  julianDay: number;
  lst: number;
  ascendant: {
    longitude: number;
    sign: number;
    degree: number;
  };
  midheaven: {
    longitude: number;
    sign: number;
    degree: number;
  };
  planets: Record<string, {
    longitude: number;
    sign: number;
    degree: number;
    house: number;
    strength: number;
    influence: string;
  }>;
  houses: number[];
  aspects: Array<{
    planets: string[];
    aspect: string;
    angle: number;
    orb: number;
    applying: boolean;
  }>;
  speciesTraits: {
    species: string;
    breed: string;
    element: string;
    modality: string;
    rulingPlanet: string;
    nature: string;
    breedTraits: any;
    compatibility: string[];
  };
}

/**
 * Western Pet Behavioral Profile
 */
export interface WesternPetBehavioralProfile {
  personalityType: string;
  temperament: {
    energy: number;
    aggression: number;
    anxiety: number;
    sociability: number;
    adaptability: number;
  };
  socialBehavior: {
    humanBonding: number;
    animalInteractions: number;
    territoriality: number;
    packMentality: number;
  };
  activityLevel: string;
  learningStyle: string;
  stressIndicators: string[];
  behavioralChallenges: string[];
  positiveTraits: string[];
}

/**
 * Western Pet Health Analysis
 */
export interface WesternPetHealthAnalysis {
  overallHealth: {
    status: string;
    score: number;
  };
  potentialHealthIssues: Array<{
    condition: string;
    affectedPlanets: string[];
    affectedHouses: number[];
    likelihood: string;
    preventiveMeasures: string[];
  }>;
  wellnessIndicators: {
    vitality: number;
    immunity: number;
    digestion: number;
    mentalHealth: number;
    energy: number;
  };
  preventiveCare: Array<{
    type: string;
    frequency: string;
    importance: string;
  }>;
  longevityFactors: {
    score: number;
    estimatedLifespan: number;
    longevityFactors: string[];
  };
  seasonalHealth: Array<{
    season: string;
    healthIndex: number;
    recommendations: string[];
  }>;
  vaccinationTiming: Array<{
    timing: string;
    reason: string;
    priority: string;
  }>;
  dietaryNeeds: {
    primaryElements: Record<string, number>;
    nutritionalFocus: string[];
    feedingSchedule: {
      mealsPerDay: number;
      timing: string[];
      portionControl: string;
    };
    supplements: Array<{
      name: string;
      reason: string;
      frequency: string;
    }>;
    restrictions: string[];
  };
}

/**
 * Western Pet Training Analysis
 */
export interface WesternPetTrainingAnalysis {
  lunarPhases: {
    suitability: string;
    reason: string;
    activities?: string[];
    alternative?: string;
  };
  planetaryTransits: Array<{
    planet: string;
    timing: string;
    reason: string;
    suitability: string;
  }>;
  dailyTiming: Array<{
    timeOfDay: string;
    planetaryRuler: string;
    energy: string;
    suitableFor: string[];
  }>;
  weeklyTiming: Array<{
    day: string;
    rulingPlanet: string;
    trainingFocus: string;
    energyLevel: string;
  }>;
  seasonalTiming: Array<{
    season: string;
    rulingPlanets: string[];
    characteristics: string;
    trainingApproach: string;
  }>;
}

/**
 * Western Pet Care Recommendations
 */
export interface WesternPetCareRecommendations {
  dailyCare: {
    feeding: {
      mealsPerDay: number;
      optimalTimes: string[];
      specialConsiderations: string[];
    };
    exercise: {
      duration: string;
      frequency: string;
      type: string;
      specialActivities: string[];
    };
    grooming: {
      brushing: string;
      bathing: string;
      nailTrimming: string;
      dentalCare: string;
      specialCare?: string[];
    };
    mentalStimulation: string[];
    bonding: string[];
  };
  weeklyCare: {
    deepCleaning: string;
    weightCheck: string;
    trainingSessions: string;
    socialActivities: string;
    healthMonitoring: string;
  };
  monthlyCare: {
    veterinaryCheck: string;
    grooming: string;
    trainingReview: string;
    nutritionReview: string;
    environmentalEnrichment: string;
  };
  seasonalAdjustments: Record<string, {
    focus: string;
    adjustments: string[];
  }>;
  planetaryAdjustments: Array<{
    planet: string;
    adjustment: string;
    reason: string;
  }>;
}

/**
 * Complete Western Pet Astrology Profile
 */
export interface WesternPetAstrologyProfile {
  petInfo: WesternPetBirthData;
  astrologicalChart: WesternPetChartAnalysis;
  behavioralProfile: WesternPetBehavioralProfile;
  healthProfile: WesternPetHealthAnalysis;
  trainingProfile: WesternPetTrainingAnalysis;
  careRecommendations: WesternPetCareRecommendations;
  generatedAt: string;
  systemVersion: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * ZC1.14 Deep Horoscope Life Interpretation Types
 */

/**
 * Deep Horoscope Chart Info
 */
export interface DeepHoroscopeChartInfo {
  ascendant: {
    sign: number;
    degree: number;
    lord: string;
  };
  moonSign: {
    sign: number;
    nakshatra: string;
    lord: string;
  };
  planetaryPositions: Record<string, {
    sign: number;
    degree: number;
    house: number;
  }>;
  dominantPlanets: string[];
  chartStrength: number;
}

/**
 * Planetary Analysis
 */
export interface PlanetaryAnalysis {
  [planet: string]: {
    total: number;
    components: {
      sthanBala: number;
      digBala: number;
      kalaBala: number;
      chestaBala: number;
      naisargikaBala: number;
      drigBala: number;
    };
    strength: string;
    interpretation: string;
  };
}

/**
 * Life Area Analysis
 */
export interface LifeAreaAnalysis {
  houseNumber: number;
  significance: string;
  lord: string;
  lordStrength: number;
  planets: string[];
  aspects: Array<{
    planet: string;
    type: string;
  }>;
  overallStrength: number;
  predictions: {
    general: string;
    career?: string;
    marriage?: string;
    health?: string;
    finance?: string;
    timing: string;
  };
  favorablePeriods: string[];
  challenges: string[];
}

/**
 * Yoga Analysis
 */
export interface YogaAnalysis {
  rajaYogas: Array<{
    name: string;
    type: string;
    strength: string;
    planets: string[];
    effects: string;
    activation: string;
  }>;
  dhanYogas: Array<{
    name: string;
    type: string;
    strength: string;
    effects: string;
    activation: string;
  }>;
  arishtaYogas: Array<{
    name: string;
    type: string;
    strength: string;
    effects: string;
    activation: string;
  }>;
  nabhasYogas: Array<{
    name: string;
    type: string;
    strength: string;
    effects: string;
    activation: string;
  }>;
  otherYogas: Array<{
    name: string;
    type: string;
    strength: string;
    effects: string;
    activation: string;
  }>;
}

/**
 * Life Area Assessments
 */
export interface LifeAreaAssessments {
  [houseNumber: number]: LifeAreaAnalysis;
}

/**
 * Predictive Analysis
 */
export interface PredictiveAnalysis {
  currentPeriod: {
    dasha: {
      lord: string;
      start: string;
      end: string;
      duration: number;
      strength: number;
      effects: {
        positive: string;
        negative: string;
        areas: string;
      };
    };
    antardasha: {
      lord: string;
      start: string;
      end: string;
      duration: number;
      strength: number;
      effects: {
        positive: string;
        negative: string;
        areas: string;
      };
    };
    combinedEffect: {
      dominant: any;
      combined: any;
      netEffect: string;
    };
    predictions: string[];
    duration: number;
  };
  majorLifeEvents: Array<{
    type: string;
    timing: {
      start: string;
      end: string;
    };
    confidence: number;
    description: string;
  }>;
  careerPredictions: {
    suitableCareers: string[];
    successPeriods: Array<{
      period: string;
      opportunities: string[];
    }>;
    challenges: string[];
    peakPeriods: string[];
    overall: string;
  };
  relationshipPredictions: {
    marriage: {
      timing: {
        start: string;
        end: string;
      };
      confidence: number;
      conditions: string[];
    };
    compatibility: string;
    challenges: string[];
    favorablePeriods: string[];
    overall: string;
  };
  healthPredictions: {
    generalHealth: string;
    potentialIssues: Array<{
      condition: string;
      likelihood: number;
      prevention: string[];
    }>;
    strongPeriods: string[];
    vulnerablePeriods: string[];
    longevity: string;
    remedies: string[];
  };
  financialPredictions: {
    overall: string;
    peakPeriods: string[];
    challengingPeriods: string[];
    investmentAdvice: string[];
  };
  spiritualPredictions: {
    development: string;
    practices: string[];
    challenges: string[];
    guidance: string;
  };
  timing: {
    favorableMonths: number[];
    challengingMonths: number[];
    bestAges: string[];
    lifeStages: Array<{
      stage: string;
      characteristics: string[];
      opportunities: string[];
    }>;
  };
}

/**
 * ZC1.29 Fasting Vrata Recommendations Types
 */

/**
 * Tithi Information for Fasting
 */
export interface FastingTithiInfo {
  number: number;
  name: string;
  paksha: 'Shukla' | 'Krishna';
  progress: number;
  fastingRecommended: boolean;
  significance: string;
  rules?: string[];
  duration?: string;
  rituals?: string[];
}

/**
 * Planetary Fasting Recommendation
 */
export interface PlanetaryFastingRecommendation {
  planet: string;
  recommendedDay: string;
  fastingType: string;
  duration: number;
  mantras: string[];
  benefits: string[];
  nextDate: Date;
  birthChartInfluence: any;
}

/**
 * Remedial Fasting Recommendation
 */
export interface RemedialFastingRecommendation {
  condition: string;
  fasting: string;
  rules: string[];
  duration: number;
  frequency: string;
}

/**
 * Individual Fasting Vrata Recommendation
 */
export interface FastingVrataRecommendation {
  type: 'TITHI' | 'PLANETARY' | 'REMEDIAL';
  priority: 'HIGHEST' | 'HIGH' | 'MEDIUM' | 'LOW';
  tithi?: FastingTithiInfo;
  planet?: string;
  fastingType?: string;
  duration?: number;
  rules?: string[];
  benefits?: string[];
  significance?: string;
  nextDate?: Date;
}

/**
 * Complete Fasting Recommendations Response
 */
export interface FastingRecommendations {
  currentDate: Date;
  tithiInfo: FastingTithiInfo;
  planetaryFasting: Record<string, PlanetaryFastingRecommendation>;
  remedialFasting: RemedialFastingRecommendation[];
  recommendedVratas: FastingVrataRecommendation[];
  nextFavorableDates: Record<string, Date>;
  personalized?: any;
}

/**
 * Fasting Completion Tracking
 */
export interface FastingCompletion {
  userId: string;
  vrataType: string;
  completed: boolean;
  completionDate: Date;
  notes?: string;
}

/**
 * User Fasting Statistics
 */
export interface FastingStatistics {
  totalFasts: number;
  completedFasts: number;
  successRate: number;
  favoriteVrata: string;
  lastUpdated: Date;
}

/**
 * Fasting API Response
 */
export interface FastingApiResponse {
  success: boolean;
  recommendations?: FastingRecommendations;
  statistics?: FastingStatistics;
  completion?: FastingCompletion;
  error?: string;
  timestamp: Date;
  userId: string;
}

/**
 * Remedial Recommendations
 */
export interface RemedialRecommendations {
  gemstones: Array<{
    planet: string;
    stone: string;
    weight: string;
    metal: string;
    finger: string;
    purpose: string;
    wearingInstructions: string;
  }>;
  mantras: Array<{
    planet: string;
    mantra: string;
    count: number;
    time: string;
    duration: string;
    purpose: string;
    benefits: string;
  }>;
  donations: Array<{
    planet: string;
    items: string[];
    frequency: string;
    purpose: string;
    benefits: string;
  }>;
  lifestyle: Array<{
    type: string;
    recommendation: string;
    method: string;
    duration: string;
    priority: string;
  }>;
  spiritual: Array<{
    type: string;
    recommendation: string;
    method: string;
    benefit: string;
  }>;
  priority: {
    critical: string[];
    important: string[];
    beneficial: string[];
  };
}

/**
 * ZC3.10 Western Medical Astrology Profile Types
 */

/**
 * Western Planetary Health Analysis
 */
export interface WesternPlanetaryHealth {
  dignity: number;
  aspects: Array<{
    planet: string;
    aspect: string;
    orb: number;
    influence: number;
  }>;
  house: number;
  healthScore: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  bodyParts: string[];
  potentialIssues: string[];
}

/**
 * Western Sign Health Analysis
 */
export interface WesternSignHealth {
  bodyParts: string[];
  systems: string[];
  planets: string[];
  strength: number;
  healthScore: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  potentialIssues: string[];
}

/**
 * Western House Health Analysis
 */
export interface WesternHouseHealth {
  planets: string[];
  significator: string;
  healthFocus: string;
  healthScore: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
}

/**
 * Western Aspect Health Impact
 */
export interface WesternAspectHealth {
  planets: string[];
  aspect: {
    type: string;
    orb: number;
  };
  healthImpact: number;
  description: string;
}

/**
 * Western Constitution Analysis
 */
export interface WesternConstitution {
  sunSign: string;
  moonSign: string;
  ascendant: string;
  temperament: Record<string, number>;
  constitutionType: 'CHOLERIC' | 'PHLEGMATIC' | 'SANGUINE' | 'MELANCHOLIC';
  strengths: string[];
  vulnerabilities: string[];
}

/**
 * Western Overall Risk Assessment
 */
export interface WesternOverallRisk {
  score: number;
  level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  breakdown: {
    planetary: number;
    sign: number;
    house: number;
    aspect: number;
  };
}

/**
 * Western Health Analysis
 */
export interface WesternHealthAnalysis {
  planetaryHealth: Record<string, WesternPlanetaryHealth>;
  signHealth: Record<string, WesternSignHealth>;
  houseHealth: Record<number, WesternHouseHealth>;
  aspectHealth: WesternAspectHealth[];
  constitution: WesternConstitution;
  overallRisk: WesternOverallRisk;
  recommendations: string[];
  generatedAt: Date;
}

/**
 * Western Disease Correlation
 */
export interface WesternDiseaseCorrelation {
  condition: string;
  indicator: string;
  type: 'planetary' | 'sign' | 'aspect_pattern';
  strength: number;
  modern_equivalent: string;
  description: string;
}

/**
 * Western Remedial Recommendations
 */
export interface WesternRemedialRecommendations {
  lifestyle: string[];
  dietary: string[];
  herbal: string[];
  gemstone: Array<{
    name: string;
    properties: string;
  }>;
  color: string[];
  planetary: Array<{
    mantra: string;
    practice: string;
    charity: string;
  }>;
  preventive: string[];
}

/**
 * Complete Western Medical Astrology Profile
 */
export interface WesternMedicalAstrologyProfile {
  birthChart: any; // Western birth chart data
  healthAnalysis: WesternHealthAnalysis;
  diseaseCorrelations: WesternDiseaseCorrelation[];
  remedies: WesternRemedialRecommendations;
  disclaimer: string;
  generatedAt: string;
  systemVersion: string;
}

/**
 * Overall Assessment
 */
export interface OverallAssessment {
  strength: number;
  summary: string;
  keyThemes: string[];
  dominantInfluences: string[];
  lifePurpose: string;
  karmicLessons: string[];
  recommendations: string[];
}

/**
 * Complete Deep Horoscope Interpretation
 */
export interface DeepHoroscopeInterpretation {
  // Metadata
  generatedAt: string;
  version: string;
  confidence: number;

  // Basic Information
  basicInfo: {
    name?: string;
    birthDetails: string;
    chartInfo: DeepHoroscopeChartInfo;
  };

  // Planetary Analysis
  planetaryAnalysis: PlanetaryAnalysis;

  // Life Areas
  lifeAreas: LifeAreaAssessments;

  // Yogas and Combinations
  yogas: YogaAnalysis;

  // Predictions
  predictions: PredictiveAnalysis;

  // Current Period
  currentPeriod: PredictiveAnalysis['currentPeriod'];

  // Remedies
  remedies: RemedialRecommendations;

  // Overall Assessment
  overallAssessment: OverallAssessment;

  // Recommendations
  recommendations: Array<{
    type: string;
    priority: string;
    message: string;
  }>;
}

/**
 * ZC1.15 Advanced Astrology Consultation Types
 */

/**
 * KP Analysis Result
 */
export interface KPAnalysis {
  rulingPlanets: {
    ascendantSubLord: string;
    moonSubLord: string;
    dayLord: string;
    signLord: string;
  };
  eventAnalyses: Record<string, {
    success: boolean;
    probability: number;
    timing: Array<{
      significator: string;
      startDate: Date;
      endDate: Date;
      confidence: number;
    }>;
    analysis: string;
  }>;
  significators: Record<string, string[]>;
  predictions: Array<{
    type: string;
    probability: number;
    timing: any[];
    significance: string;
  }>;
  success: boolean;
  error?: string;
}

/**
 * Nadi Reading Result
 */
export interface NadiReading {
  thumbAnalysis: {
    impressionType: string;
    dominantTraits: string[];
    rulingPlanets: string[];
    lifePath: {
      path: string;
      challenges: string[];
      strengths: string[];
      career: string[];
    };
    predictions: Array<{
      type: string;
      prediction: string;
      strength: number;
      timing: {
        earlyLife: boolean;
        middleLife: boolean;
        laterLife: boolean;
      };
    }>;
  };
  leafMatch: {
    isMatched: boolean;
    matchScore: number;
    matchingCriteria: Record<string, boolean>;
    predictedContent?: {
      pastLife: string;
      currentLife: string;
      futureEvents: Array<{
        age: number;
        event: string;
      }>;
      remedies: string[];
    };
  };
  lifePredictions: Array<{
    age: number;
    event: string;
  }>;
  compatibility: {
    score: number;
    analysis: string;
  };
  success: boolean;
  error?: string;
}

/**
 * Lal Kitab Analysis Result
 */
export interface LalKitabAnalysis {
  houseAnalysis: Record<number, {
    name: string;
    karaka: string;
    planets: string[];
    lord: string;
    strength: number;
    predictions: {
      positive: string;
      challenges: string;
    };
  }>;
  planetAnalysis: Record<string, {
    strength: number;
    isStrong: boolean;
    benefits: string;
  }>;
  blindPlanets: Array<{
    planet: string;
    blindHouse: number;
    issue: string;
    remedy: string;
  }>;
  sleepingPlanets: Array<{
    type: string;
    planets: string[];
    effect: string;
    remedy: string;
  }>;
  remedies: {
    immediate: string[];
    weekly: string[];
    monthly: string[];
    permanent: string[];
  };
  predictions: {
    shortTerm: string[];
    mediumTerm: string[];
    longTerm: string[];
  };
  overallHealth: {
    score: number;
    rating: string;
    recommendations: string[];
  };
  analysis: string;
  success: boolean;
  error?: string;
}

/**
 * Varshaphal Analysis Result
 */
export interface VarshaphalAnalysis {
  year: number;
  solarReturn: {
    time: Date;
    ascendant: {
      longitude: number;
      sign: number;
      degree: number;
    };
    planets: Record<string, {
      longitude: number;
      sign: number;
      degree: number;
      house: number;
    }>;
    houses: number[];
    aspects: Array<{
      planet1: string;
      planet2: string;
      aspect: string;
      orb: number;
      strength: number;
    }>;
  };
  muntha: {
    longitude: number;
    sign: number;
    degree: number;
    house: number;
    significance: string;
  };
  tajikYogas: Array<{
    name: string;
    type: string;
    strength: number;
    effects: string[];
    duration: string;
    remedies?: string[];
  }>;
  predictions: {
    overall: {
      score: number;
      rating: string;
      description: string;
    };
    monthly: Array<{
      month: number;
      period: string;
      focus: string;
      strength: string;
      keyEvents: string[];
      advice: string;
    }>;
    career: string;
    finance: string;
    health: string;
    relationships: string;
    spiritual: string;
  };
  keyPeriods: Array<{
    name: string;
    start: Date;
    duration: string;
    significance: string;
    strength: string;
  }>;
  remedies: {
    general: string[];
    monthly: Array<{
      month: number;
      remedies: string[];
    }>;
    specific: string[];
  };
  analysis: string;
  success: boolean;
  error?: string;
}

/**
 * Integrated Predictions
 */
export interface IntegratedPredictions {
  shortTerm: Array<{
    type: string;
    prediction: string;
    source: string;
    timeframe?: string;
    period?: string;
    confidence?: number;
  }>;
  mediumTerm: Array<{
    type: string;
    prediction: string;
    source: string;
    timeframe?: string;
    period?: string;
    confidence?: number;
  }>;
  longTerm: Array<{
    type: string;
    prediction: string;
    source: string;
    timeframe?: string;
    period?: string;
    confidence?: number;
  }>;
  confidence: number;
  keyThemes: string[];
  agreements: Array<{
    theme: string;
    systems: string[];
    count: number;
  }>;
  conflicts: Array<{
    theme: string;
    conflictingSystems: string[];
    issue: string;
  }>;
}

/**
 * Integrated Remedies
 */
export interface IntegratedRemedies {
  immediate: string[];
  weekly: string[];
  monthly: string[];
  annual: string[];
  permanent: string[];
  priority: {
    critical: string[];
    important: string[];
    routine: string[];
  };
}

/**
 * Timing Analysis
 */
export interface TimingAnalysis {
  favorable: Array<{
    event: string;
    period: any;
    type: string;
    source: string;
  }>;
  challenging: Array<{
    event: string;
    period: any;
    type: string;
    source: string;
  }>;
  peak: Array<{
    name: string;
    start: Date;
    duration: string;
    significance: string;
    strength: string;
  }>;
  transitions: Array<{
    type: string;
    description: string;
    source: string;
  }>;
  recommendations: string[];
}

/**
 * Consultation Metadata
 */
export interface ConsultationMetadata {
  processingTime: number;
  timestamp: string;
  systemsUsed: string[];
  accuracy: string;
  recommendations: string[];
}

/**
 * Complete Advanced Astrology Consultation Result
 */
export interface AdvancedConsultationResult {
  kpAnalysis?: KPAnalysis;
  nadiReading?: NadiReading;
  lalKitabAnalysis?: LalKitabAnalysis;
  varshaphal?: VarshaphalAnalysis;
  integratedPredictions: IntegratedPredictions;
  remedies: IntegratedRemedies;
  timing: TimingAnalysis;
  metadata: ConsultationMetadata;
  requestId: string;
  success: boolean;
  error?: {
    message: string;
    code: string;
    details?: any;
  };
}

/**
 * Advanced Consultation Options
 */
export interface AdvancedConsultationOptions {
  includeKP?: boolean;
  includeNadi?: boolean;
  includeLalKitab?: boolean;
  includeVarshaphal?: boolean;
  currentTime?: Date;
  year?: number;
  thumbImpression?: {
    shape: string;
    lines: Record<string, number>;
    mounts: Record<string, number>;
  };
  birthDetails?: {
    date: Date;
    time: string;
    place: string;
    parents: {
      father: string;
      mother: string;
    };
  };
}

/**
 * ZC1.16 Personalized Dasha Guidance Types
 */

export interface DashaAnalysis {
  mahadasha: {
    planet: string;
    strength: number;
    significations: string[];
    favorableAreas: string[];
    challenges: string[];
    overallRating: number;
  };
  antardasha: {
    mahaLord: string;
    antarLord: string;
    compatibility: number;
    specificEffects: string;
    dominantInfluence: string;
  };
  combinedInfluence: {
    overall: string;
    dominant: string;
    intensity: number;
  };
  remainingPeriod: {
    days: number;
    endDate: Date;
  };
  nextTransitions: Array<{
    type: string;
    date: Date;
    newLord: string;
  }>;
}

export interface OverallGuidance {
  theme: string;
  opportunities: string[];
  challenges: string[];
  generalAdvice: string;
  confidence: number;
}

export interface LifeAreaGuidance {
  influence: number;
  rating: string;
  specificGuidance: string;
  recommendedActions: string[];
}

export interface CareerGuidance {
  overallStrength: number;
  suitableFields: string[];
  currentOpportunities: string[];
  challenges: string[];
  timingAdvice: string;
  recommendedActions: string[];
}

export interface RelationshipGuidance {
  overallStrength: number;
  marriageTiming: {
    likelihood: string;
    timeframe: string;
    favorableFactors?: string[];
    preparationAdvice?: string;
  };
  compatibilityFactors: {
    emotional: number;
    intellectual: number;
    physical: number;
  };
  currentRelationshipStatus: string;
  advice: string[];
  remedies: string[];
}

export interface RemedialGuidance {
  primaryPlanet: string;
  secondaryPlanet: string;
  recommendedRemedies: Array<{
    planet: string;
    remedies: Array<{
      gemstone?: string;
      mantra?: string;
      donation?: string;
      fasting?: string;
      other?: string[];
    }>;
    priority: string;
    reason: string;
  }>;
  implementationSchedule: {
    immediate: {
      timeframe: string;
      actions: string[];
    };
    shortTerm: {
      timeframe: string;
      actions: string[];
    };
    longTerm: {
      timeframe: string;
      actions: string[];
    };
  };
  expectedBenefits: string;
}

export interface TimingRecommendations {
  dailyTiming: {
    bestHours: string[];
    favorableActivities: string[];
    auspiciousYoga: string;
    recommendedActions: string[];
  };
  weeklyTiming: {
    bestDays: string[];
    favorableActivities: string[];
  };
  monthlyTiming: {
    bestDates: number[];
    favorableActivities: string[];
  };
  majorActivities: {
    marriage: string;
    business: string;
    travel: string;
  };
  avoidancePeriods: string[];
}

export interface PersonalizedDashaGuidance {
  currentPeriod: {
    dasha: DashaAnalysis;
    overallGuidance: OverallGuidance;
    lifeAreaGuidance: {
      career: LifeAreaGuidance;
      relationships: LifeAreaGuidance;
      health: LifeAreaGuidance;
      finance: LifeAreaGuidance;
      spiritual: LifeAreaGuidance;
      education: LifeAreaGuidance;
    };
    careerGuidance: CareerGuidance;
    relationshipGuidance: RelationshipGuidance;
    predictions: {
      shortTerm: string;
      mediumTerm: string;
      longTerm: string;
    };
    remedies: RemedialGuidance;
    timingRecommendations: TimingRecommendations;
  };
  upcomingPeriods: Array<{
    period: string;
    startDate: Date;
    expectedChanges: string;
  }>;
  longTermOutlook: {
    overallTrend: string;
    keyMilestones: string[];
    preparationNeeded: string[];
  };
  metadata: {
    analysisDate: string;
    birthChartId: string;
    systemVersion: string;
    confidence: number;
    generatedAt: string;
  };
}

/**
 * ZC1.17 Parenting and Childbirth Astrology Types
 */

/**
 * Conception Timing Window
 */
export interface ConceptionWindow {
  date: Date;
  lunarPhase: number;
  planetaryScore: number;
  fertilityScore: number;
  recommended: boolean;
}

/**
 * Fertility Analysis
 */
export interface FertilityAnalysis {
  fertilityScore: number;
  fertilityLevel: string;
  factors: {
    fifthHouse: {
      score: number;
      factors: string[];
      lord: string;
      lordPosition: any;
    };
    fertilityPlanets: {
      score: number;
    };
    hormonalBalance: {
      score: number;
    };
    cycleAnalysis?: any;
    compatibility?: {
      score: number;
    };
  };
  recommendations: string[];
  timeWindows?: any[];
}

/**
 * Childbirth Prediction
 */
export interface ChildbirthPrediction {
  expectedDate: Date;
  dateRange: {
    earliest: Date;
    latest: Date;
  };
  gestationDays: number;
  complications: {
    risk: number;
    complications: string[];
    recommendations: string[];
    riskLevel: string;
  };
  gender: {
    predicted: string;
    confidence: number;
    methods: {
      moon: { male: number; female: number };
      fifthLord: { male: number; female: number };
      planetary: { male: number; female: number };
    };
  };
  healthAssessment: {
    overall: string;
    concerns: string[];
    recommendations: string[];
  };
  confidence: number;
}

/**
 * D7 Chart Analysis
 */
export interface D7ChartAnalysis {
  d7Chart: {
    positions: Record<string, {
      longitude: number;
      sign: number;
      degree: number;
      house: number;
    }>;
    ascendant: {
      longitude: number;
      sign: number;
    };
    houses: number[];
  };
  physicalCharacteristics: {
    height: string;
    build: string;
    complexion: string;
    hair: string;
    eyes: string;
    health: string;
  };
  mentalCharacteristics: {
    intelligence: string;
    temperament: string;
    creativity: string;
    determination: string;
    spirituality: string;
  };
  healthAnalysis: {
    overall: string;
    concerns: string[];
  };
  careerPotential: string;
  relationshipPatterns: string;
  lifeSpan: string;
  overallStrength: number;
}

/**
 * Parent-Child Compatibility
 */
export interface ParentChildCompatibility {
  overallScore: number;
  breakdown: {
    planetary: number;
    house: number;
    nakshatra: number;
    aspect: number;
  };
  recommendations: string[];
  challenges: string[];
}

/**
 * Remedial Measures
 */
export interface RemedialMeasures {
  gemstones: Array<{
    gemstone: string;
    planet: string;
    purpose: string;
    wearing: string;
    duration: string;
  }>;
  mantras: Array<{
    mantra: string;
    deity: string;
    purpose: string;
    repetitions: string;
    duration: string;
  }>;
  rituals: Array<{
    ritual: string;
    frequency: string;
    benefits: string;
  }>;
  lifestyle: string[];
  donations: string[];
  priority: string;
  timeline: string;
}

/**
 * Complete Parenting Analysis
 */
export interface ParentingAnalysis {
  timestamp: Date;
  analysisType: string;
  results: {
    conceptionTiming?: {
      motherWindows: ConceptionWindow[];
      fatherWindows: ConceptionWindow[];
      optimalWindows: Array<{
        date: Date;
        combinedScore: number;
        motherScore: number;
        fatherScore: number;
      }>;
      recommendations: string[];
    };
    fertility?: {
      mother: FertilityAnalysis;
      father: FertilityAnalysis;
      combined: {
        score: number;
      };
      recommendations: string[];
    };
    childbirth?: ChildbirthPrediction;
    childAstrology?: D7ChartAnalysis;
    compatibility?: {
      mother: ParentChildCompatibility;
      father: ParentChildCompatibility;
      overall: {
        score: number;
      };
    };
    remedies?: Record<string, RemedialMeasures>;
  };
  disclaimer: string;
}

/**
 * Parenting Analysis Request
 */
export interface ParentingAnalysisRequest {
  parentCharts: {
    mother: BirthChart;
    father: BirthChart;
  };
  childChart?: BirthChart;
  analysisType: string;
}

/**
 * ZC1.19 Personalized Remedy, Mantra, Pooja Prescription Types
 */

/**
 * Planetary Affliction Data
 */
export interface PlanetaryAffliction {
  planet: string;
  score: number;
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'NONE';
  aspects: Array<{
    planet: string;
    aspect: string;
    orb: number;
    strength: number;
  }>;
  conjunctions: Array<{
    planet: string;
    separation: number;
    nature: string;
  }>;
  house: {
    house: number;
    significance: string;
    strength: number;
  };
  dignity: {
    dignity: string;
    score: number;
    factors: string[];
  };
  primaryIssues: string[];
}

/**
 * Charity Planetary Affliction (different from general PlanetaryAffliction)
 */
export interface CharityPlanetaryAffliction {
  type: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
}

/**
 * Mantra Prescription
 */
export interface MantraPrescription {
  mantra: string;
  type: string;
  planet: string;
  deity: string;
  repetitions: number;
  timing: string;
  duration: string;
  procedure: {
    preparation: string[];
    chanting: string[];
    completion: string[];
  };
  precautions: string[];
  effectiveness: number;
}

/**
 * Pooja Prescription
 */
export interface PoojaPrescription {
  name: string;
  planet: string;
  duration: string;
  materials: string[];
  procedure: string[];
  frequency: string;
  duration_weeks: number;
  auspicious_dates: Array<{
    date: Date;
    significance: string;
  }>;
  benefits: string[];
  cost_estimate: number;
  priest_requirements: string[];
}

/**
 * Gemstone Prescription
 */
export interface GemstonePrescription {
  primary: {
    name: string;
    quality: string;
    weight: string;
    wearing_finger: string;
    wearing_day: string;
    wearing_time: string;
    metal: string;
    mantra: string;
    duration: string;
    benefits: string[];
    precautions: string[];
    quality_required: string;
    certification: string;
    purification: string;
  };
  alternatives: Array<{
    name: string;
    quality: string;
    weight: string;
    benefits: string[];
  }>;
  wearing_instructions: {
    preparation: string[];
    daily_care: string[];
    special_care: string[];
  };
  maintenance: string[];
  cost_estimate: number;
}

/**
 * Yantra Prescription
 */
export interface YantraPrescription {
  name: string;
  material: string;
  size: string;
  installation: string;
  energization: string;
  benefits: string[];
  maintenance: string;
  cost: number;
  energization_procedure: string[];
  installation_instructions: string[];
  worship_procedure: string[];
  duration: string;
}

/**
 * Charity Prescription
 */
export interface CharityPrescription {
  type: string;
  items: string[];
  recipients: string;
  timing: string;
  quantity: number;
  benefits: string;
  planet: string;
  karmic_benefit: number;
  frequency: string;
}

/**
 * Planetary Remedies
 */
export interface PlanetaryRemedies {
  mantras: MantraPrescription[];
  poojas: PoojaPrescription[];
  gemstones: GemstonePrescription[];
  yantras: YantraPrescription[];
  charities: CharityPrescription[];
}

/**
 * Remedy Timing Information
 */
export interface RemedyTiming {
  overall_auspicious_period: {
    start: Date;
    end: Date;
    quality: string;
    significance: string;
  };
  planetary_timings: Record<string, {
    best_days: string[];
    best_times: string[];
    favorable_moons: string[];
  }>;
  lunar_phases: Array<{
    phase: string;
    dates: Date[];
    suitability: string;
  }>;
}

/**
 * Implementation Phase
 */
export interface ImplementationPhase {
  name: string;
  duration: string;
  activities: string[];
}

/**
 * Implementation Plan
 */
export interface ImplementationPlan {
  phases: ImplementationPhase[];
  monitoring: {
    frequency: string;
    methods: string[];
    adjustments: string;
  };
  success_metrics: string[];
}

/**
 * Complete ZC1.19 Remedy Prescription
 */
export interface ZC119RemedyPrescription {
  timestamp: Date;
  chart: BirthChart;
  afflictions: Record<string, PlanetaryAffliction>;
  remedies: Record<string, PlanetaryRemedies>;
  timing: RemedyTiming;
  cost_estimate: number;
  duration: string;
  implementation_plan: ImplementationPlan;
}

/**
 * ZC1.21 Astro-cartography Types
 */

/**
 * Planetary Line Data
 */
export interface PlanetaryLine {
  planet: string;
  type: 'conjunction' | 'opposition' | 'square' | 'trine' | 'sextile';
  longitude: number;
  latitude?: number; // null for vertical lines
  influence: 'direct' | 'challenging' | 'growth' | 'harmonious' | 'supportive';
  strength: number;
  description: string;
}

/**
 * Astro-cartography Analysis Result
 */
export interface AstroCartographyAnalysis {
  birthChart: BirthChart;
  lines: PlanetaryLine[];
  analysisDate: Date;
  totalLines: number;
  linesByPlanet: Record<string, PlanetaryLine[]>;
  linesByType: Record<string, PlanetaryLine[]>;
}

/**
 * Relocation Chart Data
 */
export interface RelocationChart {
  originalChart: BirthChart;
  relocationLocation: {
    latitude: number;
    longitude: number;
    timezone?: number;
    name?: string;
  };
  adjustedBirthTime: Date;
  ascendant: number;
  houses: number[];
  planets: Record<string, PlanetaryPosition & {
    house: number;
    houseLord: string;
    angularity: number;
  }>;
  analysis: {
    houseChanges: Record<string, {
      from: number;
      to: number;
      significance: string;
    }>;
    angularPlanets: Array<{
      planet: string;
      angle: string;
      strength: number;
    }>;
    strengthenedPlanets: string[];
    weakenedPlanets: string[];
  };
}

/**
 * Location Compatibility Analysis
 */
export interface LocationCompatibilityAnalysis {
  location: {
    latitude: number;
    longitude: number;
    name?: string;
  };
  purpose: 'general' | 'career' | 'relationship' | 'health' | 'spiritual';
  astroCartography: {
    lines: PlanetaryLine[];
    influences: {
      beneficial: Array<{
        planet: string;
        type: string;
        distance: number;
        strength: number;
        description: string;
      }>;
      challenging: Array<{
        planet: string;
        type: string;
        distance: number;
        strength: number;
        description: string;
      }>;
      neutral: PlanetaryLine[];
      totalScore: number;
    };
  };
  relocationChart: {
    ascendantSign: number;
    angularPlanets: Array<{
      planet: string;
      angle: string;
      strength: number;
    }>;
    houseChanges: Record<string, {
      from: number;
      to: number;
      significance: string;
    }>;
    score: number;
  };
  localFactors: {
    latitudeInfluence: {
      influence: string;
      score: number;
    };
    longitudeInfluence: {
      influence: string;
      score: number;
    };
    geomagneticFactors: {
      strength: number;
      score: number;
    };
    culturalFactors: {
      factors: string[];
      score: number;
    };
  };
  overallScore: number;
  recommendations: Array<{
    type: string;
    message: string;
    priority?: string;
  }>;
  bestTimes: Array<{
    period: string;
    strength: number;
    activities: string[];
    description: string;
  }>;
  confidence: number;
}

/**
 * Counseling Recommendation
 */
export interface CounselingRecommendation {
  type: 'opportunity' | 'caution' | 'strength' | 'transition' | 'career' | 'relationships';
  planet?: string;
  aspect?: string;
  message: string;
  action?: string;
  remedy?: string;
  duration?: string;
  priority?: 'high' | 'medium' | 'low';
}

/**
 * Action Plan Item
 */
export interface ActionPlanItem {
  timeframe: 'immediate' | 'weekly' | 'monthly' | 'ongoing';
  type: string;
  message: string;
  priority?: 'high' | 'medium' | 'low';
}

/**
 * Complete Counseling Report
 */
export interface CounselingReport {
  recommendations: {
    immediate: CounselingRecommendation[];
    shortTerm: CounselingRecommendation[];
    longTerm: CounselingRecommendation[];
    precautions: CounselingRecommendation[];
    optimalTiming: Array<{
      period: string;
      strength: number;
      activities: string[];
      description: string;
    }>;
  };
  summary: {
    overallScore: number;
    keyStrengths: string[];
    mainChallenges: string[];
    recommendedActions: string[];
  };
  actionPlan: {
    immediate: ActionPlanItem[];
    weekly: ActionPlanItem[];
    monthly: ActionPlanItem[];
    ongoing: ActionPlanItem[];
  };
}

/**
 * Complete Astro-cartography and Relocation Analysis
 */
export interface AstroCartographyRelocationAnalysis {
  analysisId: string;
  birthChart: BirthChart;
  astroCartography: AstroCartographyAnalysis;
  relocationAnalyses: LocationCompatibilityAnalysis[];
  counseling: CounselingReport;
  generatedAt: Date;
  confidence: number;
}

/**
 * ZC1.22 Career, Finance, Business, and Medical Astrology Counseling Types
 */

/**
 * Career Timing Analysis
 */
export interface CareerTimingAnalysis {
  timing: {
    currentPeriod: string;
    upcomingOpportunities: Array<{
      period: string;
      strength: number;
      activities: string[];
    }>;
    challenges: string[];
  };
  yogas: Array<{
    name: string;
    strength: number;
    effects: string;
  }>;
  recommendations: Array<{
    type: string;
    priority: string;
    advice: string;
  }>;
  dashaAnalysis: {
    current: any;
    upcoming: any[];
  };
  transitAnalysis: {
    favorable: any[];
    challenging: any[];
  };
}

/**
 * Financial Prosperity Analysis
 */
export interface FinancialProsperityAnalysis {
  prosperity: {
    wealthPotential: number;
    incomeSources: string[];
    spendingPatterns: any;
  };
  yogas: Array<{
    name: string;
    strength: number;
    description: string;
  }>;
  spendingPatterns: {
    expenditureLord: string;
    spendingTendencies: string[];
    savingsPotential: number;
  };
  investmentTiming: any[];
}

/**
 * Business Success Analysis
 */
export interface BusinessSuccessAnalysis {
  potential: number;
  entrepreneurialYogas: Array<{
    name: string;
    strength: number;
    description: string;
  }>;
  timing: any[];
  recommendations: Array<{
    type: string;
    priority: string;
    advice: string;
  }>;
}

/**
 * Medical Astrology Counseling
 */
export interface MedicalAstrologyCounseling {
  healthStatus: string;
  riskPeriods: Array<{
    period: string;
    risk: string;
    focus: string;
  }>;
  precautions: string[];
  remedialMeasures: Array<{
    type: string;
    description: string;
  }>;
}

/**
 * Comprehensive Counseling Analysis
 */
export interface ZC122CounselingAnalysis {
  analysisId: string;
  timestamp: string;
  career: CareerTimingAnalysis;
  finance: FinancialProsperityAnalysis;
  business: BusinessSuccessAnalysis;
  medical: MedicalAstrologyCounseling;
  overallScore: number;
  luckyPeriods: Array<{
    period: string;
    significance: string;
  }>;
  remedies: Array<{
    type: string;
    description: string;
    target: string;
    priority: string;
  }>;
  success: boolean;
}

/**
 * ZC3.2 Western Transit Analysis Types
 */

export interface WesternTransitAspect {
  natalPlanet: string;
  transitingPlanet: string;
  aspect: string;
  exactAngle: number;
  orb: number;
  intensity: number;
  isExact: boolean;
  julianDay: number;
  interpretation?: {
    affectedLifeAreas: string[];
    primaryEffect: string;
    duration: number;
    intensity: number;
    description: string;
    recommendations: string[];
  };
}

export interface WesternTransitAnalysis {
  // Metadata
  analysisDate: string;
  birthChart: {
    date: {
      year: number;
      month: number;
      day: number;
      hour: number;
      minute: number;
      second: number;
    };
    ascendant: {
      longitude: number;
      sign: number;
      degree: number;
    };
  };

  // Current transits
  activeTransits: Array<WesternTransitAspect & { interpretation: any }>;

  // Future predictions
  upcomingTransits: WesternTransitAspect[];

  // Period analysis
  periodAnalysis: {
    periodIntensity: number;
    dominantLifeAreas: string[];
    transitCount: number;
    overallTheme: string;
  };

  // Summary statistics
  summary: {
    totalActiveTransits: number;
    averageIntensity: number;
    dominantAspects: Array<{
      aspect: string;
      count: number;
    }>;
    affectedLifeAreas: string[];
  };

  // Options used
  analysisOptions: {
    lookAheadDays: number;
    lookBackDays: number;
    minIntensity: number;
    includeMinorAspects: boolean;
  };
}

/**
 * ZC1.23 Complex Mundane Astrology Types
 */

/**
 * National Data for Mundane Astrology
 */
export interface NationalData {
  countryName: string;
  foundingYear: number;
  foundingMonth: number;
  foundingDay: number;
  foundingHour?: number;
  foundingMinute?: number;
  foundingSecond?: number;
  capitalLatitude: number;
  capitalLongitude: number;
  chartType?: 'Inception' | 'Independence' | 'Republic' | 'Current';
}

/**
 * Region Data for Mundane Analysis
 */
export interface RegionData {
  name: string;
  latitude: number;
  longitude: number;
}

/**
 * Mundane Astrology Request
 */
export interface MundaneAstrologyRequest {
  region: RegionData;
  nationalData?: NationalData;
  type: 'basic' | 'comprehensive' | 'collaborative';
  timeRange?: number; // days
  predictions?: ('political' | 'economic' | 'weather' | 'military' | 'social')[];
  dashaAnalysis?: boolean;
  weatherAnalysis?: boolean;
  economicAnalysis?: boolean;
  historicalValidation?: boolean;
}

/**
 * National Horoscope for Mundane Analysis
 */
export interface NationalHoroscope {
  type: 'National';
  country: string;
  foundingData: NationalData;
  julianDay: number;
  ayanamsa: number;
  lst: number;
  ascendant: number;
  houses: number[];
  planets: Record<string, {
    longitude: number;
    sign: number;
    degree: number;
    house: number;
    retrograde?: boolean;
  }>;
  midheaven: number;
}

/**
 * Current Transits for Mundane Analysis
 */
export interface MundaneTransits {
  julianDay: number;
  positions: Record<string, number>;
  aspects: Array<{
    transitingPlanet: string;
    radicalPlanet: string;
    aspect: string;
    separation: number;
    exactness: number;
    strength: number;
  }>;
  strength: number;
}

/**
 * Mundane Prediction
 */
export interface MundanePrediction {
  date: Date;
  aspects: Array<{
    transitingPlanet: string;
    radicalPlanet: string;
    aspect: string;
    separation: number;
    exactness: number;
    strength: number;
  }>;
  probability: number;
  description: string;
}

/**
 * Weather Forecast for Mundane Analysis
 */
export interface MundaneWeatherForecast {
  location: {
    latitude: number;
    longitude: number;
  };
  predictions: Array<{
    type: string;
    prediction: string;
    strength: number;
  }>;
  confidence: number;
}

/**
 * Economic Analysis for Mundane Astrology
 */
export interface MundaneEconomicAnalysis {
  indicators: string[];
  prediction: string;
  trends?: Array<{
    period: string;
    trend: string;
    confidence: number;
  }>;
}

/**
 * Political Forecast for Mundane Astrology
 */
export interface MundanePoliticalForecast {
  events: string[];
  probability: number;
  keyInfluences?: Array<{
    planet: string;
    influence: string;
    strength: number;
  }>;
}

/**
 * Dasha Analysis for Nations
 */
export interface NationalDashaAnalysis {
  currentMahadasha: string;
  currentAntardasha: string;
  effects: {
    mahadasha: string;
    antardasha: string;
    combined: string;
  };
  duration: number;
  strength: number;
}

/**
 * Historical Validation Result
 */
export interface HistoricalValidation {
  event: string;
  date: string;
  predictedAspects: any[];
  actualAspects: any;
  accuracy: number;
  analysis: string;
}

/**
 * Mundane Astrology Analysis Results
 */
export interface MundaneAstrologyResults {
  nationalHoroscope?: NationalHoroscope;
  currentTransits: MundaneTransits;
  predictions?: Record<string, MundanePrediction[]>;
  dashaAnalysis?: NationalDashaAnalysis;
  weatherForecast?: MundaneWeatherForecast;
  economicAnalysis?: MundaneEconomicAnalysis;
  politicalForecast?: MundanePoliticalForecast;
  historicalValidation?: HistoricalValidation[];
}

/**
 * Complete Mundane Astrology Analysis
 */
export interface MundaneAstrologyAnalysis {
  timestamp: Date;
  region: RegionData;
  analysisType: string;
  timeRange: number;
  results: MundaneAstrologyResults;
  collaborativeInsights?: any; // For A2A/MCP integration
  analysisType_extended?: 'collaborative';
}

/**
 * ZC1.25 Lal Kitab Karmic Debt Analysis Types
 */

/**
 * Intensity Level for Rina Analysis
 */
export interface RinaIntensity {
  value: number; // 1-4
  description: string;
}

/**
 * Individual Rina Analysis Result
 */
export interface RinaAnalysis {
  type: string;
  present: boolean;
  intensity: RinaIntensity;
  score: number; // 0-4
  indicators: string[];
  effects: string[];
  remedies: {
    daily: string[];
    weekly: string[];
    monthly: string[];
    oneTime: string[];
  };
}

/**
 * Karmic Burden Assessment
 */
export interface KarmicBurden {
  level: 'High' | 'Moderate' | 'Low' | 'Minimal';
  description: string;
  priority: 'Critical' | 'Important' | 'Optional' | 'None';
  recommendation: string;
}

/**
 * Comprehensive Lal Kitab Karmic Debt Analysis
 */
export interface LalKitabKarmicDebtAnalysis {
  pitruRina: RinaAnalysis;
  matruRina: RinaAnalysis;
  bhratruRina: RinaAnalysis;
  putraRina: RinaAnalysis;
  summary: {
    totalActiveRinas: number;
    totalScore: number;
    averageIntensity: number;
    dominantRina: string | null;
    karmicBurden: KarmicBurden;
  };
  recommendations: string[];
  comprehensiveRemedies: {
    daily: string[];
    weekly: string[];
    monthly: string[];
    general: string[];
  };
}

/**
 * ZC1.27 Yantra Sacred Geometry Types
 */

/**
 * Yantra Configuration
 */
export interface YantraConfig {
  name: string;
  geometry: string;
  purpose: string;
  elements: string[];
  mantra: string;
  activation?: string;
  usage?: string;
  contraindications?: string[];
  planet?: string;
  cost?: number;
  material?: string;
  size?: string;
}

/**
 * Yantra Geometry Data
 */
export interface YantraGeometry {
  bindu?: { x: number; y: number };
  triangles?: Array<{
    points: Array<{ x: number; y: number }>;
    path?: string;
  }>;
  circles?: Array<{
    center: { x: number; y: number };
    radius: number;
    style?: 'filled' | 'outline';
  }>;
  lotusPetals?: Array<{
    path: string;
  }>;
  rays?: Array<{
    start: { x: number; y: number };
    end: { x: number; y: number };
  }>;
  outerSquare?: {
    points: Array<{ x: number; y: number }>;
  };
  maxSize?: number;
}

/**
 * Yantra Item with Geometry
 */
export interface YantraItem {
  type: string;
  name: string;
  purpose: string;
  geometry: YantraGeometry;
  svg: string;
  elements: string[];
  mantra: string;
  activation?: string;
  usage?: string;
  cost?: number;
  material?: string;
  size?: string;
}

/**
 * Yantra Recommendation
 */
export interface YantraRecommendation {
  yantra: YantraConfig;
  score: number;
  reasons: string[];
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
}

/**
 * Yantra Package
 */
export interface YantraPackage {
  primary?: YantraItem;
  secondary?: YantraItem[];
  complementary?: YantraItem[];
  materials: {
    yantras: Array<{
      name: string;
      material: string;
      size: string;
      cost: number;
    }>;
    ritual: string[];
    optional: string[];
  };
  totalCost: number;
}

/**
 * Meditation Step
 */
export interface MeditationStep {
  step: number;
  instruction: string;
  purpose: string;
}

/**
 * Activation Ritual
 */
export interface ActivationRitual {
  materials: string[];
  steps: string[];
  duration: string;
  bestTime: string;
}

/**
 * Daily Practice Schedule
 */
export interface DailyPracticeSchedule {
  monday: { duration: number; focus: string };
  tuesday: { duration: number; focus: string };
  wednesday: { duration: number; focus: string };
  thursday: { duration: number; focus: string };
  friday: { duration: number; focus: string };
  saturday: { duration: number; focus: string };
  sunday: { duration: number; focus: string };
}

/**
 * Practice Duration
 */
export interface PracticeDuration {
  daily: number;
  weekly: number;
  monthly: number;
  schedule: DailyPracticeSchedule;
}

/**
 * Meditation Guidelines
 */
export interface MeditationGuidelines {
  preparation: MeditationStep[];
  activation: ActivationRitual;
  dailyPractice: {
    duration: PracticeDuration;
    mantras: string[];
    visualization: string[];
  };
  completion: MeditationStep[];
}

/**
 * Validity Period
 */
export interface ValidityPeriod {
  start: string;
  end: string;
  daysValid: number;
  basedOn: string;
}

/**
 * Yantra Guidance Package
 */
export interface YantraGuidance {
  userId: string;
  birthChart: BirthChart;
  recommendations: {
    primary?: YantraRecommendation;
    secondary?: YantraRecommendation[];
    complementary?: YantraRecommendation[];
  };
  yantraPackage: YantraPackage;
  practiceGuidelines: MeditationGuidelines;
  validityPeriod: ValidityPeriod;
  generatedAt: string;
  version: string;
  metadata: {
    version: string;
    engine: string;
    options: Record<string, any>;
    performance: {
      cacheEnabled: boolean;
      parallelProcessing: boolean;
      optimizationLevel: string;
    };
    disclaimers: string[];
  };
}

/**
 * ZC2.5 Feng Shui Remedies and Guidance Types
 */

/**
 * Property Data Input for Feng Shui Analysis
 */
export interface FengShuiPropertyData {
  layout: {
    width: number; // in feet/meters
    length: number; // in feet/meters
    floors: number;
    facingDirection: number; // degrees (0-360)
    rooms: Array<{
      name: string;
      area: number; // square feet/meters
      direction: number; // degrees
      purpose?: string;
    }>;
  };
  location: {
    latitude: number;
    longitude: number;
    address?: string;
    city?: string;
    country?: string;
  };
}

/**
 * Personal Data for Feng Shui Analysis (Optional)
 */
export interface FengShuiPersonalData {
  birthData?: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    timezone?: string;
  };
  preferences?: {
    budget?: number;
    style?: string;
    colors?: string[];
    elements?: string[];
  };
}

/**
 * Timeframe for Feng Shui Analysis
 */
export interface FengShuiTimeframe {
  year: number;
  month?: number;
  day?: number;
  analysisType: 'annual' | 'monthly' | 'daily';
}

/**
 * Bagua Area Analysis
 */
export interface BaguaAreaAnalysis {
  name: string;
  chinese: string;
  direction: number | null;
  element: string;
  aspect: string;
  energyLevel: number; // 0-1 scale
  issues: string[];
  remedies: string[];
  recommendations: Array<{
    type: string;
    priority: 'High' | 'Medium' | 'Low';
    description: string;
    remedies: string[];
  }>;
}

/**
 * Elemental Balance Analysis
 */
export interface ElementalBalanceAnalysis {
  counts: Record<string, number>;
  strongest: string | null;
  weakest: string | null;
  balance: string;
  relationships: Record<string, {
    generates: string;
    controlledBy: string;
    controls: string;
    generatedBy: string;
  }>;
  imbalances: Array<{
    element: string;
    severity: 'High' | 'Medium' | 'Low';
    description: string;
  }>;
  harmonyScore: number; // 0-10 scale
}

/**
 * Flying Stars Analysis
 */
export interface FlyingStarsAnalysis {
  annual: {
    period: number;
    mountainStar: number;
    waterStar: number;
    rating: number;
    influences: string[];
  };
  monthly?: {
    period: number;
    mountainStar: number;
    waterStar: number;
    rating: number;
    influences: string[];
  };
  daily?: {
    period: number;
    mountainStar: number;
    waterStar: number;
    rating: number;
    influences: string[];
  };
  recommendations: Array<{
    type: string;
    star: number;
    timeframe: string;
    description: string;
    remedies: string[];
    effectiveness: number;
    urgency: 'High' | 'Medium' | 'Low';
  }>;
  overallRating: number;
}

/**
 * Feng Shui Remedy
 */
export interface FengShuiRemedy {
  id: string;
  type: string;
  element?: string;
  direction?: number;
  area?: string;
  description: string;
  items: Array<{
    type: string; // 'Color', 'Shape', 'Material', etc.
    item: string;
    placement: string;
    cost?: number;
  }>;
  effectiveness: number; // 0-1 scale
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  implementation: {
    immediateEffect: boolean;
    shortTermEffect: boolean;
    longTermEffect: boolean;
    timeRequired: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    cost: number;
  };
  status?: 'pending' | 'implemented' | 'completed';
  updatedAt?: string;
}

/**
 * Feng Shui Analysis Results
 */
export interface FengShuiAnalysis {
  bagua: Record<string, BaguaAreaAnalysis>;
  elemental: ElementalBalanceAnalysis;
  flyingStars: FlyingStarsAnalysis;
  directional: {
    facingDirection: number;
    optimalDirections: number[];
    challengingDirections: number[];
    recommendations: string[];
  };
  personal?: {
    birthElement?: string;
    compatibleElements: string[];
    personalRemedies: FengShuiRemedy[];
  };
  overall: {
    score: number; // 0-10 scale
    rating: string;
    summary: string;
    keyIssues: string[];
    strengths: string[];
    opportunities: string[];
  };
}

/**
 * Feng Shui Implementation Plan
 */
export interface FengShuiImplementationPlan {
  phases: Array<{
    name: string;
    duration: string;
    remedies: FengShuiRemedy[];
    description: string;
    estimatedCost: number;
    timeRequired: string;
  }>;
  timeline: {
    startDate: Date;
    endDate: Date;
    milestones: Array<{
      date: Date;
      phase: string;
      description: string;
    }>;
  };
  dependencies: Record<string, string[]>;
  resources: {
    totalCost: number;
    materials: Array<{
      item: string;
      quantity: number;
      cost: number;
    }>;
    tools: string[];
    expertise: string[];
  };
}

/**
 * Feng Shui Maintenance Schedule
 */
export interface FengShuiMaintenanceSchedule {
  daily: string[];
  weekly: string[];
  monthly: string[];
  quarterly: string[];
  annual: string[];
  seasonal: Record<string, string[]>;
}

/**
 * Feng Shui Expected Outcomes
 */
export interface FengShuiExpectedOutcomes {
  immediate: {
    timeframe: string;
    effects: Array<{
      area: string;
      effect: string;
      confidence: number;
    }>;
  };
  shortTerm: {
    timeframe: string;
    effects: Array<{
      area: string;
      effect: string;
      confidence: number;
    }>;
  };
  longTerm: {
    timeframe: string;
    effects: Array<{
      area: string;
      effect: string;
      confidence: number;
    }>;
  };
  overall: {
    confidence: number;
    summary: string;
    disclaimer: string;
  };
}

/**
 * Complete Feng Shui Guidance Results
 */
export interface FengShuiGuidance {
  propertyData: FengShuiPropertyData;
  personalData?: FengShuiPersonalData;
  timeframe: FengShuiTimeframe;
  analysis: FengShuiAnalysis;
  remedies: FengShuiRemedy[];
  guidance: {
    implementationPlan: FengShuiImplementationPlan;
    maintenanceSchedule: FengShuiMaintenanceSchedule;
    expectedOutcomes: FengShuiExpectedOutcomes;
  };
  generatedAt: string;
  version: string;
  metadata: {
    calculationMethod: string;
    accuracy: string;
    culturalNotes: string[];
    ethicalConsiderations: string[];
  };
}

/**
 * Yantra Geometry Generation Request
 */
export interface YantraGeometryRequest {
  yantraType: string;
  size?: number;
  options?: Record<string, any>;
}

/**
 * Yantra Geometry Response
 */
export interface YantraGeometryResponse {
  yantraType: string;
  geometry: YantraGeometry;
  svg: string;
  size: number;
  generatedAt: string;
}

/**
 * ZC2.1 Chinese Birth Chart Types
 */

/**
 * Chinese Birth Data Input
 */
export interface ChineseBirthData {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  timezoneOffset?: number;
}

/**
 * Heavenly Stem
 */
export interface HeavenlyStem {
  name: string;
  element: string;
  yinYang: 'Yang' | 'Yin';
}

/**
 * Earthly Branch
 */
export interface EarthlyBranch {
  name: string;
  animal: string;
  element: string;
  direction: string;
}

/**
 * Ba-Zi Pillar
 */
export interface BaZiPillar {
  stem: HeavenlyStem;
  branch: EarthlyBranch;
  element: string;
  animal: string;
}

/**
 * Complete Ba-Zi Chart
 */
export interface BaZiChart {
  year: BaZiPillar;
  month: BaZiPillar;
  day: BaZiPillar;
  hour: BaZiPillar;
  lunarDate: {
    lunarYear: number;
    solarTerm: {
      name: string;
      longitude: number;
    };
    isLeapMonth: boolean;
  };
}

/**
 * Five Elements Analysis
 */
export interface FiveElementsAnalysis {
  counts: Record<string, number>;
  strongest: string | null;
  weakest: string | null;
  balance: string;
  relationships: Record<string, {
    generates: string;
    controlledBy: string;
    controls: string;
    generatedBy: string;
  }>;
}

/**
 * Nine Star Ki Analysis
 */
export interface NineStarKiAnalysis {
  birthStar: string;
  currentStar: string;
  directions: Record<string, string>;
  analysis: {
    personality: string[];
    career: string[];
    health: string[];
    luckyDirections: string[];
  };
}

/**
 * Chinese Birth Chart Interpretations
 */
export interface ChineseInterpretations {
  personality: string[];
  career: string[];
  relationships: string[];
  health: string[];
  lucky: {
    elements: string[];
    directions: string[];
    remedies: string[];
  };
}

/**
 * Complete Chinese Birth Chart
 */
export interface ChineseBirthChart {
  birthData: ChineseBirthData;
  baZi: BaZiChart;
  fiveElements: FiveElementsAnalysis;
  nineStarKi: NineStarKiAnalysis;
  interpretations: ChineseInterpretations;
  metadata: {
    calculationMethod: string;
    algorithmVersion: string;
    accuracy: string;
    lastUpdated: string;
    disclaimer: string;
  };
  getElementBalance: () => FiveElementsAnalysis;
  getLuckyDirections: () => string[];
  getPersonalityTraits: () => string[];
  getCareerGuidance: () => string[];
  getHealthInsights: () => string[];
  getRelationshipAdvice: () => string[];
  getLuckyElements: () => string[];
}

/**
 * ZC3.4 Western Aspect Calculator Types
 */

/**
 * Western Aspect Result
 */
export interface WesternAspectResult {
  id: number;
  planets: string[];
  type: string;
  angle: number;
  separation: number;
  strength: number;
  applying: boolean;
  interpretation: {
    aspect: any;
    summary: string;
    personality: string;
    lifeAreas: string;
    challenges: string;
    strengths: string;
    advice: string;
  };
}

/**
 * Western Aspect Pattern
 */
export interface WesternAspectPattern {
  type: string;
  planets: string[];
  element?: string;
  strength: number;
}

/**
 * Western Aspect Analysis Summary
 */
export interface WesternAspectSummary {
  totalAspects: number;
  majorAspects: number;
  minorAspects: number;
  averageStrength: number;
}

/**
 * Complete Western Aspect Analysis Result
 */
export interface WesternAspectAnalysis {
  calculationTime: string;
  input: {
    planetCount: number;
    options: any;
  };
  aspects: WesternAspectResult[];
  patterns: WesternAspectPattern[];
  summary: WesternAspectSummary;
}

/**
 * ZC3.8 Western Return Chart Types
 */

/**
 * Return Chart Type
 */
export type ReturnChartType = 'solar' | 'lunar';

/**
 * Return Chart Position
 */
export interface ReturnChartPosition {
  longitude: number;
  sign: number;
  degree: number;
  house: number;
  retrograde?: boolean;
}

/**
 * Return Chart Aspect
 */
export interface ReturnChartAspect {
  planet1: string;
  planet2: string;
  aspect: string;
  angle: number;
  orb: number;
  strength: number;
  exact: boolean;
}

/**
 * Return Chart Angularity Analysis
 */
export interface ReturnChartAngularity {
  angularPlanets: string[];
  score: number;
  dominantAngular: string;
}

/**
 * Return Chart Data
 */
export interface ReturnChartData {
  time: Date;
  location: {
    latitude: number;
    longitude: number;
  };
  positions: Record<string, ReturnChartPosition>;
  houses: number[];
  aspects: ReturnChartAspect[];
  angularity: ReturnChartAngularity;
}

/**
 * Return Chart Theme
 */
export interface ReturnChartTheme {
  type: string;
  house?: number;
  planet?: string;
  aspect?: ReturnChartAspect;
  description: string;
}

/**
 * Return Chart Interpretation
 */
export interface ReturnChartInterpretation {
  overall: {
    score: number;
    rating: string;
    summary: string;
    keyInfluences: string[];
  };
  planetary: Record<string, {
    influence: string;
    strength: number;
    themes: string[];
  }>;
  aspects: {
    major: ReturnChartAspect[];
    analysis: string;
  };
  houses: Record<number, {
    significance: string;
    planets: string[];
    themes: string[];
  }>;
  themes: ReturnChartTheme[];
  predictions: Array<{
    timeframe: string;
    area: string;
    prediction: string;
    confidence: number;
  }>;
}

/**
 * Return Chart Validation
 */
export interface ReturnChartValidation {
  isValid: boolean;
  validations: Record<string, {
    passed: boolean;
    error?: string;
    expected?: number;
    actual?: number;
  }>;
  accuracy: string;
}

/**
 * Complete Return Chart Result
 */
export interface ReturnChart {
  type: ReturnChartType;
  year?: number;
  month?: number;
  returnTime: Date;
  chart: ReturnChartData;
  interpretation: ReturnChartInterpretation;
  validityPeriod: {
    start: Date;
    end: Date;
  };
  validation: ReturnChartValidation;
  generatedAt: Date;
  systemVersion: string;
}

/**
 * Combined Return Charts Analysis
 */
export interface CombinedReturnCharts {
  solar: ReturnChart;
  lunar: ReturnChart;
  combinedAnalysis: {
    harmony: number;
    conflicts: string[];
    opportunities: string[];
    challenges: string[];
    overallTheme: string;
  };
  generatedAt: Date;
}

/**
 * Return Chart Request
 */
export interface ReturnChartRequest {
  type: ReturnChartType;
  targetDate: Date;
  castingLocation?: {
    latitude: number;
    longitude: number;
  };
}

/**
 * ZC3.5 Western Birth Chart Analysis Types
 */

/**
 * Planetary Analysis Result
 */
export interface PlanetaryAnalysisResult {
  planet: string;
  sign: string;
  house: number;
  strength: number;
  keywords: string[];
  personality: string[];
  lifeAreas: string[];
  challenges: string[];
  potentials: string[];
}

/**
 * House Analysis Result
 */
export interface HouseAnalysisResult {
  house: number;
  sign: string;
  ruler: string;
  planets: string[];
  aspects: any[];
  strength: number;
  themes: string[];
  interpretation: string;
}

/**
 * Chart Pattern
 */
export interface ChartPattern {
  type: string;
  planets: string[];
  element?: string;
  strength: number;
  description?: string;
}

/**
 * Synthesis Result
 */
export interface SynthesisResult {
  personalityProfile: {
    coreIdentity: string;
    emotionalNature: string;
    mentalProcesses: string;
    socialStyle: string;
    lifeApproach: string;
  };
  lifePurpose: string;
  challenges: string[];
  potentials: string[];
  lifePath: string;
  relationships: string;
  career: string;
  spirituality: string;
}

/**
 * Western Birth Chart Analysis Result
 */
export interface WesternBirthChartAnalysis {
  analysisTime: string;
  birthData: BirthData;
  options: {
    framework?: string;
    houseSystem?: string;
  };
  positions: {
    planets: Array<{
      name: string;
      longitude: number;
      sign: string;
      house?: number;
      speed?: number;
    }>;
    points: Array<{
      name: string;
      longitude: number;
    }>;
  };
  houses: Array<{
    number: number;
    cusp: number;
    sign: string;
    ruler: string;
  }>;
  aspects: any[];
  patterns: ChartPattern[];
  planetaryAnalysis: PlanetaryAnalysisResult[];
  houseAnalysis: HouseAnalysisResult[];
  synthesis: SynthesisResult;
  summary: {
    dominantPlanets: string[];
    dominantHouses: number[];
    chartShape: {
      shape: string;
      concentration: string;
    };
    aspectBalance: Record<string, number>;
    overallStrength: number;
  };
}

/**
 * ZC1.28 Charity and Donation Guidance Types
 */

/**
 * Planetary Charity Data
 */
export interface PlanetaryCharityData {
  planet: string;
  element: string;
  direction: string;
  color: string;
  metal: string;
  gemstone: string;
  recommendedCharities: Array<{
    item: string;
    recipient: string;
    significance: string;
  }>;
  auspiciousDays: string[];
  auspiciousNakshatras: string[];
  bestTime: string;
}

/**
 * Charity Planetary Affliction (different from general PlanetaryAffliction)
 */
export interface CharityPlanetaryAffliction {
  type: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
}

/**
 * Charity Priority Levels
 */
export type CharityPriority = 'high' | 'medium' | 'low';

/**
 * Charity Urgency Levels
 */
export type CharityUrgency = 'immediate' | 'soon' | 'when_convenient';

/**
 * Planetary Analysis for Charity
 */
export interface PlanetaryCharityAnalysis {
  strength: number;
  afflictions: CharityPlanetaryAffliction[];
  charityPriority: CharityPriority;
  recommendedCharities: Array<{
    item: string;
    recipient: string;
    significance: string;
  }>;
  urgency: CharityUrgency;
}

/**
 * Charity Recommendation
 */
export interface CharityRecommendation {
  planet: string;
  priority: CharityPriority;
  urgency: CharityUrgency;
  item: string;
  recipient: string;
  significance: string;
  quantity: number;
  frequency: string;
  estimatedCost: number;
}

/**
 * Auspicious Timing for Charity
 */
export interface CharityTiming {
  bestDays: string[];
  bestNakshatras: string[];
  bestTime: string;
  nextAuspiciousDates: Date[];
  planetaryPeriods: Array<{
    planet: string;
    period: string;
    strength: number;
  }>;
}

/**
 * Monthly Charity Plan Item
 */
export interface MonthlyCharityPlanItem {
  week: number;
  startDate: Date;
  endDate: Date;
  recommendations: CharityRecommendation[];
  focus: string;
}

/**
 * Emergency Charity Action
 */
export interface EmergencyCharityAction {
  planet: string;
  immediateAction: {
    item: string;
    recipient: string;
    significance: string;
  };
  reason: string;
  timeFrame: string;
}

/**
 * Charity Guidance Analysis
 */
export interface CharityGuidanceAnalysis {
  planetaryAnalysis: Record<string, PlanetaryCharityAnalysis>;
  priorityPlanets: Array<{
    name: string;
    priority: CharityPriority;
    urgency: CharityUrgency;
    strength: number;
    afflictionCount: number;
  }>;
  recommendations: CharityRecommendation[];
  auspiciousTiming: Record<string, CharityTiming>;
  monthlyPlan: MonthlyCharityPlanItem[];
  emergencyCharities: EmergencyCharityAction[];
}

/**
 * Complete Charity Guidance Result
 */
export interface CharityGuidanceResult {
  birthChart: {
    analysisDate: Date;
    planetaryAnalysis: Record<string, PlanetaryCharityAnalysis>;
  };
  guidance: CharityGuidanceAnalysis;
  timing: Record<string, {
    panchangTiming: any;
    transitTiming: any;
    overallScore: number;
    recommendedDates: Date[];
    immediateTiming: any;
  }>;
  panchang: any;
  report: {
    summary: {
      totalRecommendations: number;
      priorityBreakdown: Record<CharityPriority, number>;
      estimatedMonthlyCost: number;
      timeCommitment: number;
    };
    immediateActions: EmergencyCharityAction[];
    monthlyPlan: MonthlyCharityPlanItem[];
    detailedRecommendations: Array<CharityRecommendation & {
      timing: any;
      panchangCompatibility: any;
    }>;
    successFactors: string[];
    precautions: string[];
  };
  implementation: {
    phase1: {
      duration: string;
      focus: string;
      actions: EmergencyCharityAction[];
      goal: string;
    };
    phase2: {
      duration: string;
      focus: string;
      actions: CharityRecommendation[];
      goal: string;
    };
    phase3: {
      duration: string;
      focus: string;
      actions: CharityRecommendation[];
      goal: string;
    };
    phase4: {
      duration: string;
      focus: string;
      actions: CharityRecommendation[];
      goal: string;
    };
    tracking: {
      methods: string[];
      reviewFrequency: string;
      adjustmentTriggers: string[];
    };
  };
/**
 * ZC3.13 Western Relationship/Marriage/Compatibility Counseling Types
 */

/**
 * Counseling Aspect
 */
export interface CounselingAspect {
  planet1: string;
  planet2: string;
  aspect: string;
  angle: number;
  orb: number;
  applying: boolean;
  counseling: {
    strength: 'excellent' | 'strong' | 'moderate' | 'challenging' | 'difficult';
    description: string;
    counseling: string;
  };
}

/**
 * House Overlay
 */
export interface CounselingHouseOverlay {
  person: 1 | 2;
  planet: string;
  house: number;
  significance: number;
  counseling: {
    interpretation: string;
    advice: string;
  };
}

/**
 * Counseling Synastry Analysis
 */
export interface CounselingSynastry {
  type: string;
  charts: {
    person1: WesternBirthChart;
    person2: WesternBirthChart;
  };
  interAspects: CounselingAspect[];
  houseOverlays: CounselingHouseOverlay[];
  vertexConnections: any[];
  lunarNodeConnections: any[];
  counseling: {
    communication: { insights: string[] };
    emotional: { insights: string[] };
    intimacy: { insights: string[] };
    growth: { insights: string[] };
    challenges: string[];
  };
  compatibility: {
    score: number;
    rating: string;
  };
  generatedAt: Date;
  systemVersion: string;
}

/**
 * Counseling Composite Position
 */
export interface CounselingCompositePosition {
  longitude: number;
  latitude?: number;
  speed?: number;
}

/**
 * Counseling Composite Analysis
 */
export interface CounselingComposite {
  type: string;
  charts: {
    person1: WesternBirthChart;
    person2: WesternBirthChart;
  };
  positions: Record<string, CounselingCompositePosition>;
  houses: number[];
  aspects: CounselingAspect[];
  angularity: {
    angularPlanets: string[];
    score: number;
  };
  counseling: {
    relationshipDynamics: string[];
    challenges: string[];
    opportunities: string[];
  };
  generatedAt: Date;
  systemVersion: string;
}

/**
 * Counseling Compatibility Analysis
 */
export interface CounselingCompatibility {
  overall: number;
  breakdown: {
    synastry: number;
    composite: number;
    dynamics: number;
    timing: number;
  };
  rating: string;
  strengths: string[];
  challenges: string[];
  counseling: {
    plan: string[];
    priorities: string[];
  };
  recommendations: string[];
}

/**
 * Counseling Plan
 */
export interface CounselingPlan {
  overallAssessment: {
    type: string;
    description: string;
    counseling: string;
  };
  modulePlans: {
    communication: { plan: string[]; priority: string };
    emotional: { plan: string[]; priority: string };
    intimacy: { plan: string[]; priority: string };
    conflict: { plan: string[]; priority: string };
    growth: { plan: string[]; priority: string };
  };
  timeline: Array<{
    phase: string;
    duration: string;
    focus: string;
  }>;
  professionalReferral: {
    recommended: boolean;
    urgency: string;
    type: string;
    reason: string;
  };
  selfHelp: {
    books: string[];
    exercises: string[];
    practices: string[];
  };
}

/**
 * Marriage Timing Analysis
 */
export interface MarriageTimingAnalysis {
  currentTiming: {
    score: number;
    rating: string;
    factors: Array<{
      type: string;
      description: string;
    }>;
  };
  futureWindows: Array<{
    date: string;
    score: number;
    rating: string;
  }>;
  challengingPeriods: Array<{
    date: string;
    score: number;
    rating: string;
    counseling: string;
  }>;
  optimalDates: Array<{
    date: string;
    type: string;
    significance: string;
  }>;
  counseling: {
    currentAdvice: string;
    longTermPlanning: string;
    decisionMaking: string;
  };
}

/**
 * Complete Western Relationship Counseling Analysis
 */
export interface WesternRelationshipCounseling {
  synastry: CounselingSynastry;
  composite: CounselingComposite;
  compatibility: CounselingCompatibility;
  counseling: CounselingPlan;
  marriageTiming: MarriageTimingAnalysis;
  summary: {
    overallCompatibility: string;
    relationshipType: string;
    counselingApproach: string;
    currentTiming: string;
    keyStrengths: string[];
    mainChallenges: string[];
    professionalCounseling: string;
  };
  recommendations: Array<{
    type: string;
    category: string;
    advice: string;
  }>;
  generatedAt: Date;
  systemVersion: string;
}

/**
 * ZC4.2 Personal Cycles Analysis Types
 */

/**
 * Personal Cycle Data
 */
export interface PersonalCycleData {
  personalYear?: number;
  personalMonth?: number;
  personalDay?: number;
  components?: {
    birthMonth?: number;
    birthDay?: number;
    currentYear?: number;
    currentMonth?: number;
    currentDay?: number;
    total?: number;
  };
  interpretation?: {
    name: string;
    qualities: string[];
  };
  cyclePosition?: {
    yearsSinceBirth?: number;
    cyclePosition?: number;
    nextCycleStart?: number;
  };
  monthName?: string;
  dayOfWeek?: string;
  isMasterNumber?: boolean;
}

/**
 * Cycle Compatibility Analysis
 */
export interface CycleCompatibility {
  yearMonth: {
    compatible: boolean;
    difference: number;
  };
  monthDay: {
    compatible: boolean;
    difference: number;
  };
  yearDay: {
    compatible: boolean;
    difference: number;
  };
  overallHarmony: string;
}

/**
 * Cycle Recommendations
 */
export interface CycleRecommendations {
  decisionMaking?: string[];
  relationshipTiming?: string[];
  careerPlanning?: string[];
  healthWellness?: string[];
  spiritualGrowth?: string[];
  keyThemes?: string[];
}

/**
 * Cycle System Analysis
 */
export interface CycleSystemAnalysis {
  cycles: {
    year: PersonalCycleData;
    month: PersonalCycleData;
    day: PersonalCycleData;
  };
  compatibility: CycleCompatibility;
  recommendations: CycleRecommendations;
}

/**
 * Cycle Interpretations
 */
export interface CycleInterpretations {
  overall: string;
  timing: string[];
  opportunities: string[];
  challenges: string[];
  relationships: string[];
  career: string[];
  health: string[];
  spiritual: string[];
}

/**
 * Cycle Forecast Item
 */
export interface CycleForecastItem {
  date: string;
  yearCycle: number;
  monthCycle: number;
  compatibility: string;
  keyThemes: string[];
}

/**
 * Cycle Forecast
 */
export interface CycleForecast {
  birthDate: string;
  forecastPeriod: string;
  forecasts: CycleForecastItem[];
  summary: {
    overallTrend: string;
    keyPeriods: string[];
    recommendations: string[];
  };
}

/**
 * Cycle Integration Data
 */
export interface CycleIntegration {
  lifePathCompatibility?: {
    score: number;
    analysis: string;
  };
  numerologyProfile?: {
    compatibleNumbers: number[];
    dominantCycles: string[];
  };
}

/**
 * Complete Personal Cycles Analysis
 */
export interface PersonalCyclesAnalysis {
  birthDate: string;
  targetDate: string;
  timestamp: string;
  cycles: {
    pythagorean: CycleSystemAnalysis;
    chaldean?: CycleSystemAnalysis;
  };
  interpretations: CycleInterpretations;
  forecast?: CycleForecast;
  integration: CycleIntegration;
}