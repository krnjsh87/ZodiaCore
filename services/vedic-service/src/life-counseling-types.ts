// TypeScript types for ZC3.14 Life Counseling System

export interface PlanetaryPosition {
  longitude: number;
  latitude?: number;
  speed?: number;
  retrograde?: boolean;
}

export interface House {
  cusp: number;
  sign: string;
  planets: string[];
}

export interface BirthChart {
  planets: Record<string, PlanetaryPosition>;
  houses: House[];
  angles: {
    ASC: number;
    MC: number;
    DSC?: number;
    IC?: number;
  };
}

export interface Aspect {
  planet: string;
  aspect: string;
  orb: number;
  strength: number;
  applying?: boolean;
}

export interface CounselingRecommendation {
  type: string;
  priority: 'high' | 'medium' | 'low';
  advice: string;
  reasoning: string;
}

export interface TimingAnalysis {
  currentPeriod: {
    rating: string;
    score: number;
    factors: Array<{
      date: string;
      strength: number;
      description: string;
    }>;
  };
  upcomingOpportunities: Array<{
    date: string;
    type: string;
    strength: number;
    description: string;
  }>;
  challengingPeriods: Array<{
    date: string;
    type: string;
    severity: number;
    description: string;
  }>;
  optimalTiming: {
    score: number;
    periods: Array<{
      start: string;
      end: string;
      rating: string;
    }>;
  };
}

export interface CareerCounselingAnalysis {
  type: 'career_counseling';
  profile: {
    mcAnalysis: {
      longitude: number;
      sign: string;
      rulingPlanet: string;
      house: number;
      significance: number;
      interpretation: string;
    };
    tenthHouse: {
      cusp: number;
      sign: string;
      planets: string[];
      aspects: Aspect[];
      strength: number;
    };
    careerPlanets: Array<{
      planet: string;
      weight: number;
      house: number;
      aspects: Aspect[];
      significance: number;
    }>;
    vocationalAspects: Array<{
      type: string;
      aspect: Aspect;
      significance: number;
    }>;
  };
  recommendations: CounselingRecommendation[];
  timing: TimingAnalysis;
  generatedAt: Date;
  systemVersion: string;
}

export interface FinancialCounselingAnalysis {
  type: 'financial_counseling';
  profile: {
    secondHouse: {
      cusp: number;
      sign: string;
      planets: string[];
      aspects: Aspect[];
      strength: number;
      ruler: string;
    };
    eighthHouse: {
      cusp: number;
      sign: string;
      planets: string[];
      aspects: Aspect[];
      strength: number;
      ruler: string;
    };
    wealthPlanets: Array<{
      planet: string;
      weight: number;
      house: number;
      aspects: Aspect[];
      significance: number;
    }>;
    financialAspects: Array<{
      type: string;
      aspect: Aspect;
      significance: number;
    }>;
  };
  recommendations: CounselingRecommendation[];
  timing: TimingAnalysis;
  riskAssessment: {
    score: number;
    level: string;
    factors: string[];
  };
  generatedAt: Date;
  systemVersion: string;
}

export interface BusinessCounselingAnalysis {
  type: 'business_counseling';
  profile: {
    thirdHouse: {
      cusp: number;
      sign: string;
      planets: string[];
      aspects: Aspect[];
      strength: number;
      ruler: string;
    };
    seventhHouse: {
      cusp: number;
      sign: string;
      planets: string[];
      aspects: Aspect[];
      strength: number;
      ruler: string;
    };
    eleventhHouse: {
      cusp: number;
      sign: string;
      planets: string[];
      aspects: Aspect[];
      strength: number;
      ruler: string;
    };
    businessPlanets: Array<{
      planet: string;
      weight: number;
      house: number;
      aspects: Aspect[];
      significance: number;
    }>;
    entrepreneurialAspects: Array<{
      type: string;
      aspect: Aspect;
      significance: number;
    }>;
  };
  recommendations: CounselingRecommendation[];
  timing: TimingAnalysis;
  partnershipAnalysis: {
    compatibility: number;
    recommendedTypes: string[];
    potentialChallenges: string[];
    successFactors: string[];
  };
  generatedAt: Date;
  systemVersion: string;
}

export interface MedicalCounselingAnalysis {
  type: 'medical_counseling';
  profile: {
    sixthHouse: {
      cusp: number;
      sign: string;
      planets: string[];
      aspects: Aspect[];
      strength: number;
      ruler: string;
    };
    twelfthHouse: {
      cusp: number;
      sign: string;
      planets: string[];
      aspects: Aspect[];
      strength: number;
      ruler: string;
    };
    healthPlanets: Array<{
      planet: string;
      weight: number;
      house: number;
      aspects: Aspect[];
      significance: number;
    }>;
    medicalAspects: Array<{
      type: string;
      aspect: Aspect;
      significance: number;
    }>;
  };
  recommendations: CounselingRecommendation[];
  timing: TimingAnalysis;
  preventiveCare: Array<{
    area: string;
    recommendation: string;
    frequency: string;
  }>;
  healingModalities: Array<{
    type: string;
    examples: string[];
    reasoning: string;
  }>;
  generatedAt: Date;
  systemVersion: string;
}

export interface LifeBalanceAssessment {
  career: {
    strength: number;
    harmony: number;
    development: string[];
  };
  finance: {
    strength: number;
    harmony: number;
    development: string[];
  };
  business: {
    strength: number;
    harmony: number;
    development: string[];
  };
  medical: {
    strength: number;
    harmony: number;
    development: string[];
  };
}

export interface IntegratedCounselingResults {
  overallLifePotential: {
    score: number;
    rating: string;
    breakdown: Record<string, number>;
  };
  lifeBalance: LifeBalanceAssessment;
  timingIntegration: {
    currentPeriod: {
      rating: string;
      score: number;
      factors: Array<{
        date: string;
        strength: number;
        description: string;
      }>;
    };
    upcomingOpportunities: Array<{
      date: string;
      type: string;
      strength: number;
      description: string;
    }>;
    challengingPeriods: Array<{
      date: string;
      type: string;
      severity: number;
      description: string;
    }>;
    optimalLifeTiming: {
      score: number;
      periods: Array<{
        start: string;
        end: string;
        rating: string;
      }>;
    };
  };
  holisticRecommendations: CounselingRecommendation[];
}

export interface LifeCounselingSummary {
  overallPotential: string;
  lifeBalance: {
    career: string;
    finance: string;
    business: string;
    medical: string;
  };
  currentTiming: string;
  keyFocusAreas: string[];
  lifePurpose: string;
}

export interface CompleteLifeCounselingAnalysis {
  career: CareerCounselingAnalysis;
  finance: FinancialCounselingAnalysis;
  business: BusinessCounselingAnalysis;
  medical: MedicalCounselingAnalysis;
  integrated: IntegratedCounselingResults;
  summary: LifeCounselingSummary;
  recommendations: CounselingRecommendation[];
  generatedAt: Date;
  systemVersion: string;
}

export interface CounselingApiRequest {
  birthChart: BirthChart;
  currentDate?: Date;
  preferences?: {
    includeTiming?: boolean;
    includeRecommendations?: boolean;
    detailLevel?: 'basic' | 'detailed' | 'comprehensive';
  };
}

export interface CounselingApiResponse {
  success: boolean;
  data?: CompleteLifeCounselingAnalysis;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata: {
    processingTime: number;
    systemVersion: string;
    timestamp: Date;
  };
}