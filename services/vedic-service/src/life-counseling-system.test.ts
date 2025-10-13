// Comprehensive test suite for ZC3.14 Western Astrology Life Counseling System
// Tests cover all analyzers, integration, performance, and edge cases

import { BirthChart } from './life-counseling-types';

// Mock data for testing
const createMockBirthChart = (): BirthChart => ({
  planets: {
    SUN: { longitude: 0, latitude: 0, speed: 1, retrograde: false },
    MOON: { longitude: 90, latitude: 0, speed: 1, retrograde: false },
    MERCURY: { longitude: 45, latitude: 0, speed: 1, retrograde: false },
    VENUS: { longitude: 135, latitude: 0, speed: 1, retrograde: false },
    MARS: { longitude: 180, latitude: 0, speed: 1, retrograde: false },
    JUPITER: { longitude: 225, latitude: 0, speed: 1, retrograde: false },
    SATURN: { longitude: 270, latitude: 0, speed: 1, retrograde: false },
    URANUS: { longitude: 315, latitude: 0, speed: 1, retrograde: false },
    NEPTUNE: { longitude: 45, latitude: 0, speed: 1, retrograde: false },
    PLUTO: { longitude: 90, latitude: 0, speed: 1, retrograde: false }
  },
  houses: [
    { cusp: 0, sign: 'ARIES', planets: ['SUN'] },
    { cusp: 30, sign: 'TAURUS', planets: ['VENUS'] },
    { cusp: 60, sign: 'GEMINI', planets: ['MERCURY'] },
    { cusp: 90, sign: 'CANCER', planets: ['MOON'] },
    { cusp: 120, sign: 'LEO', planets: [] },
    { cusp: 150, sign: 'VIRGO', planets: [] },
    { cusp: 180, sign: 'LIBRA', planets: [] },
    { cusp: 210, sign: 'SCORPIO', planets: ['MARS', 'PLUTO'] },
    { cusp: 240, sign: 'SAGITTARIUS', planets: ['JUPITER'] },
    { cusp: 270, sign: 'CAPRICORN', planets: ['SATURN'] },
    { cusp: 300, sign: 'AQUARIUS', planets: ['URANUS'] },
    { cusp: 330, sign: 'PISCES', planets: ['NEPTUNE'] }
  ],
  angles: {
    ASC: 0,
    MC: 90,
    DSC: 180,
    IC: 270
  }
});

const createStrongCareerChart = (): BirthChart => ({
  ...createMockBirthChart(),
  planets: {
    ...createMockBirthChart().planets,
    SATURN: { longitude: 280, latitude: 0, speed: 1, retrograde: false }, // 10th house
    JUPITER: { longitude: 100, latitude: 0, speed: 1, retrograde: false }  // 10th house
  },
  houses: [
    ...createMockBirthChart().houses.slice(0, 9),
    { cusp: 270, sign: 'CAPRICORN', planets: ['SATURN', 'JUPITER'] }, // Strong 10th house
    ...createMockBirthChart().houses.slice(10)
  ]
});

describe('Life Counseling System - Unit Tests', () => {
  let mockChart: BirthChart;
  let strongCareerChart: BirthChart;

  beforeEach(() => {
    mockChart = createMockBirthChart();
    strongCareerChart = createStrongCareerChart();
  });

  describe('AspectCalculator', () => {
    let aspectCalculator: AspectCalculator;

    beforeEach(() => {
      aspectCalculator = new AspectCalculator();
    });

    it('should calculate conjunction aspect correctly', () => {
      const aspects = aspectCalculator.calculateAspectsForPlanet(mockChart, 'SUN');
      expect(aspects.length).toBeGreaterThan(0);

      const conjunction = aspects.find(a => a.aspect === 'CONJUNCTION');
      expect(conjunction).toBeDefined();
      expect(conjunction!.orb).toBeLessThan(8);
    });

    it('should calculate trine aspect correctly', () => {
      const aspects = aspectCalculator.calculateAspectsForPlanet(mockChart, 'SUN');
      const trine = aspects.find(a => a.aspect === 'TRINE');
      expect(trine).toBeDefined();
      expect(trine!.strength).toBeGreaterThan(0.7);
    });

    it('should handle planets with no aspects', () => {
      const isolatedChart: BirthChart = {
        ...mockChart,
        planets: {
          SUN: { longitude: 0, latitude: 0, speed: 1, retrograde: false },
          MOON: { longitude: 200, latitude: 0, speed: 1, retrograde: false } // No major aspects
        }
      };

      const aspects = aspectCalculator.calculateAspectsForPlanet(isolatedChart, 'SUN');
      expect(aspects.length).toBe(0);
    });

    it('should calculate applying vs separating aspects', () => {
      const aspects = aspectCalculator.calculateAspectsForPlanet(mockChart, 'SUN');
      aspects.forEach(aspect => {
        expect(aspect.applying).toBeDefined();
        expect(typeof aspect.applying).toBe('boolean');
      });
    });
  });

  describe('HouseAnalyzer', () => {
    let houseAnalyzer: HouseAnalyzer;

    beforeEach(() => {
      houseAnalyzer = new HouseAnalyzer();
    });

    it('should get house data correctly', () => {
      const tenthHouse = houseAnalyzer.getHouse(mockChart.houses, 10);
      expect(tenthHouse.cusp).toBe(270);
      expect(tenthHouse.sign).toBe('CAPRICORN');
      expect(tenthHouse.planets).toContain('SATURN');
    });

    it('should calculate house strength accurately', () => {
      const tenthHouse = houseAnalyzer.getHouse(mockChart.houses, 10);
      const aspects = []; // Mock aspects
      const strength = houseAnalyzer.calculateHouseStrength(tenthHouse, aspects);

      expect(strength).toBeGreaterThan(0);
      expect(strength).toBeLessThanOrEqual(1);
    });

    it('should get planets in house correctly', () => {
      const planetsInTenth = houseAnalyzer.getPlanetsInHouse(mockChart, 10);
      expect(planetsInTenth).toContain('SATURN');
      expect(planetsInTenth).toHaveLength(1);
    });

    it('should handle empty houses', () => {
      const planetsInFifth = houseAnalyzer.getPlanetsInHouse(mockChart, 5);
      expect(planetsInFifth).toHaveLength(0);
    });
  });

  describe('CareerCounselingAnalyzer', () => {
    let analyzer: CareerCounselingAnalyzer;

    beforeEach(() => {
      analyzer = new CareerCounselingAnalyzer(mockChart);
    });

    it('should analyze career potential successfully', async () => {
      const result = await analyzer.analyzeCareerPotential();

      expect(result).toHaveProperty('type', 'career_counseling');
      expect(result).toHaveProperty('profile');
      expect(result).toHaveProperty('recommendations');
      expect(result).toHaveProperty('timing');
      expect(result).toHaveProperty('generatedAt');
      expect(result).toHaveProperty('systemVersion', 'ZC3.14');
    });

    it('should identify career planets correctly', () => {
      const careerPlanets = (analyzer as any).identifyCareerPlanets();
      expect(Array.isArray(careerPlanets)).toBe(true);
      expect(careerPlanets.length).toBeGreaterThan(0);

      careerPlanets.forEach(planet => {
        expect(planet).toHaveProperty('planet');
        expect(planet).toHaveProperty('weight');
        expect(planet).toHaveProperty('house');
        expect(planet).toHaveProperty('aspects');
        expect(planet).toHaveProperty('significance');
      });
    });

    it('should generate appropriate career recommendations', () => {
      const profile = (analyzer as any).counselingInterpreter.interpretCareerProfile({
        mcAnalysis: { sign: 'CAPRICORN', rulingPlanet: 'SATURN' },
        tenthHouse: { strength: 0.8 },
        careerPlanets: [{ planet: 'SATURN', significance: 0.9 }],
        vocationalAspects: [],
        careerTiming: {}
      });

      const recommendations = (analyzer as any).generateCareerRecommendations(profile);
      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBeGreaterThan(0);

      recommendations.forEach(rec => {
        expect(rec).toHaveProperty('type');
        expect(rec).toHaveProperty('priority');
        expect(rec).toHaveProperty('advice');
        expect(rec).toHaveProperty('reasoning');
      });
    });

    it('should handle strong career chart', async () => {
      const strongAnalyzer = new CareerCounselingAnalyzer(strongCareerChart);
      const result = await strongAnalyzer.analyzeCareerPotential();

      expect(result.profile.overallScore).toBeGreaterThan(70);
    });

    it('should handle weak career chart', async () => {
      const weakChart: BirthChart = {
        ...mockChart,
        houses: mockChart.houses.map(h => ({ ...h, planets: [] })) // Remove all planets from houses
      };

      const weakAnalyzer = new CareerCounselingAnalyzer(weakChart);
      const result = await weakAnalyzer.analyzeCareerPotential();

      expect(result).toBeDefined();
      expect(result.profile).toBeDefined();
    });
  });

  describe('FinancialCounselingAnalyzer', () => {
    let analyzer: FinancialCounselingAnalyzer;

    beforeEach(() => {
      analyzer = new FinancialCounselingAnalyzer(mockChart);
    });

    it('should analyze financial potential successfully', async () => {
      const result = await analyzer.analyzeFinancialPotential();

      expect(result).toHaveProperty('type', 'financial_counseling');
      expect(result).toHaveProperty('profile');
      expect(result).toHaveProperty('recommendations');
      expect(result).toHaveProperty('timing');
      expect(result).toHaveProperty('riskAssessment');
    });

    it('should assess financial risks correctly', () => {
      const profile = {
        financialAspects: [
          { aspect: { planet: 'NEPTUNE' }, significance: 0.8 },
          { aspect: { planet: 'URANUS' }, significance: 0.7 }
        ],
        secondHouse: { strength: 0.6 },
        eighthHouse: { strength: 0.5 }
      };

      const riskAssessment = (analyzer as any).assessFinancialRisks(profile);
      expect(riskAssessment).toHaveProperty('score');
      expect(riskAssessment).toHaveProperty('level');
      expect(riskAssessment).toHaveProperty('factors');
      expect(riskAssessment.score).toBeGreaterThan(50); // Neptune and Uranus increase risk
    });

    it('should generate financial recommendations based on Venus ruler', () => {
      const profile = {
        secondHouse: { ruler: 'VENUS', strength: 0.8 },
        wealthPlanets: [{ planet: 'VENUS', significance: 0.9 }],
        financialAspects: [],
        eighthHouse: { strength: 0.6 }
      };

      const recommendations = (analyzer as any).generateFinancialRecommendations(profile);
      expect(recommendations.some(r => r.type === 'investment_style')).toBe(true);
    });

    it('should handle Jupiter dominant financial profile', () => {
      const profile = {
        wealthPlanets: [{ planet: 'JUPITER', significance: 0.95 }],
        secondHouse: { strength: 0.7 },
        financialAspects: [],
        eighthHouse: { strength: 0.6 }
      };

      const recommendations = (analyzer as any).generateFinancialRecommendations(profile);
      expect(recommendations.some(r => r.type === 'risk_tolerance')).toBe(true);
    });
  });

  describe('BusinessCounselingAnalyzer', () => {
    let analyzer: BusinessCounselingAnalyzer;

    beforeEach(() => {
      analyzer = new BusinessCounselingAnalyzer(mockChart);
    });

    it('should analyze business potential successfully', async () => {
      const result = await analyzer.analyzeBusinessPotential();

      expect(result).toHaveProperty('type', 'business_counseling');
      expect(result).toHaveProperty('profile');
      expect(result).toHaveProperty('recommendations');
      expect(result).toHaveProperty('timing');
      expect(result).toHaveProperty('partnershipAnalysis');
    });

    it('should assess partnership compatibility', () => {
      const profile = {
        seventhHouse: { strength: 0.8 },
        businessPlanets: [{ planet: 'VENUS' }],
        entrepreneurialAspects: [{ type: 'expansion', significance: 0.8 }]
      };

      const compatibility = (analyzer as any).assessPartnershipCompatibility(profile);
      expect(compatibility).toBeGreaterThan(50);
      expect(compatibility).toBeLessThanOrEqual(100);
    });

    it('should recommend partnership types based on rulers', () => {
      const profile = {
        seventhHouse: { ruler: 'VENUS' },
        businessPlanets: [{ planet: 'MERCURY' }],
        entrepreneurialAspects: []
      };

      const types = (analyzer as any).recommendPartnershipTypes(profile);
      expect(types).toContain('Equal partnership with shared values');
      expect(types).toContain('Strategic alliance for market expansion');
    });

    it('should generate business recommendations for strong 3rd house', () => {
      const profile = {
        thirdHouse: { strength: 0.85 },
        seventhHouse: { strength: 0.6 },
        eleventhHouse: { strength: 0.7 },
        businessPlanets: [],
        entrepreneurialAspects: []
      };

      const recommendations = (analyzer as any).generateBusinessRecommendations(profile);
      expect(recommendations.some(r => r.type === 'business_type')).toBe(true);
    });
  });

  describe('MedicalCounselingAnalyzer', () => {
    let analyzer: MedicalCounselingAnalyzer;

    beforeEach(() => {
      analyzer = new MedicalCounselingAnalyzer(mockChart);
    });

    it('should analyze health potential successfully', async () => {
      const result = await analyzer.analyzeHealthPotential();

      expect(result).toHaveProperty('type', 'medical_counseling');
      expect(result).toHaveProperty('profile');
      expect(result).toHaveProperty('recommendations');
      expect(result).toHaveProperty('timing');
      expect(result).toHaveProperty('preventiveCare');
      expect(result).toHaveProperty('healingModalities');
    });

    it('should recommend preventive care based on planetary influences', () => {
      const profile = {
        healthPlanets: [{ planet: 'MARS' }, { planet: 'SATURN' }],
        sixthHouse: { strength: 0.7 },
        twelfthHouse: { strength: 0.6 },
        medicalAspects: []
      };

      const preventiveCare = (analyzer as any).recommendPreventiveCare(profile);
      expect(preventiveCare.some(c => c.area === 'acute_conditions')).toBe(true);
      expect(preventiveCare.some(c => c.area === 'chronic_conditions')).toBe(true);
    });

    it('should suggest healing modalities based on elemental balance', () => {
      const profile = {
        healthPlanets: [{ planet: 'SUN' }, { planet: 'MARS' }, { planet: 'JUPITER' }], // Fire element
        sixthHouse: { strength: 0.7 },
        medicalAspects: []
      };

      const modalities = (analyzer as any).suggestHealingModalities(profile);
      expect(modalities.some(m => m.type === 'cooling_therapies')).toBe(true);
    });

    it('should generate medical recommendations for Mercury ruler', () => {
      const profile = {
        sixthHouse: { ruler: 'MERCURY', strength: 0.8 },
        healthPlanets: [{ planet: 'MERCURY', significance: 0.9 }],
        medicalAspects: [],
        twelfthHouse: { strength: 0.6 }
      };

      const recommendations = (analyzer as any).generateMedicalRecommendations(profile);
      expect(recommendations.some(r => r.type === 'health_focus')).toBe(true);
    });
  });

  describe('Counseling Interpreters', () => {
    describe('CareerCounselingInterpreter', () => {
      let interpreter: CareerCounselingInterpreter;

      beforeEach(() => {
        interpreter = new CareerCounselingInterpreter();
      });

      it('should interpret career profile correctly', () => {
        const profile = {
          mcAnalysis: { sign: 'CAPRICORN', rulingPlanet: 'SATURN', strength: 0.8 },
          tenthHouse: { strength: 0.75 },
          careerPlanets: [
            { planet: 'SATURN', significance: 0.9, aspects: [] },
            { planet: 'JUPITER', significance: 0.7, aspects: [] }
          ],
          vocationalAspects: [],
          careerTiming: {}
        };

        const result = interpreter.interpretProfile(profile);
        expect(result).toHaveProperty('overallScore');
        expect(result).toHaveProperty('positiveAspects');
        expect(result).toHaveProperty('challengingAspects');
        expect(result).toHaveProperty('dominantThemes');
        expect(result).toHaveProperty('developmentAreas');
        expect(result.overallScore).toBeGreaterThan(70);
      });

      it('should identify positive and challenging aspects', () => {
        const profile = {
          mcAnalysis: { strength: 0.8 },
          tenthHouse: { strength: 0.4 },
          careerPlanets: [
            { planet: 'SATURN', aspects: [{ aspect: 'TRINE', strength: 0.8 }] },
            { planet: 'MARS', aspects: [{ aspect: 'SQUARE', strength: 0.6 }] }
          ],
          vocationalAspects: [],
          careerTiming: {}
        };

        const result = interpreter.interpretProfile(profile);
        expect(result.positiveAspects.length).toBeGreaterThan(0);
        expect(result.challengingAspects.length).toBeGreaterThan(0);
      });
    });

    describe('FinancialCounselingInterpreter', () => {
      let interpreter: FinancialCounselingInterpreter;

      beforeEach(() => {
        interpreter = new FinancialCounselingInterpreter();
      });

      it('should interpret financial profile with risk factors', () => {
        const profile = {
          secondHouse: { strength: 0.6, ruler: 'VENUS' },
          eighthHouse: { strength: 0.7 },
          wealthPlanets: [{ planet: 'VENUS', significance: 0.8, aspects: [] }],
          financialAspects: [
            { type: 'value_system', aspect: { planet: 'VENUS', aspect: 'TRINE' }, significance: 0.8 },
            { type: 'expansion_luck', aspect: { planet: 'JUPITER', aspect: 'CONJUNCTION' }, significance: 0.9 }
          ],
          wealthTiming: {}
        };

        const result = interpreter.interpretProfile(profile);
        expect(result.overallScore).toBeGreaterThan(60);
        expect(result.positiveAspects.length).toBeGreaterThan(0);
      });
    });

    describe('BusinessCounselingInterpreter', () => {
      let interpreter: BusinessCounselingInterpreter;

      beforeEach(() => {
        interpreter = new BusinessCounselingInterpreter();
      });

      it('should interpret business profile with partnership focus', () => {
        const profile = {
          thirdHouse: { strength: 0.7, ruler: 'MERCURY' },
          seventhHouse: { strength: 0.8, ruler: 'VENUS' },
          eleventhHouse: { strength: 0.6 },
          businessPlanets: [{ planet: 'MERCURY', significance: 0.85, aspects: [] }],
          entrepreneurialAspects: [
            { type: 'initiative', aspect: { planet: 'MARS', aspect: 'TRINE' }, significance: 0.8 }
          ],
          marketTiming: {}
        };

        const result = interpreter.interpretProfile(profile);
        expect(result.overallScore).toBeGreaterThan(65);
        expect(result.dominantThemes).toContain('Communication-driven business');
      });
    });

    describe('MedicalCounselingInterpreter', () => {
      let interpreter: MedicalCounselingInterpreter;

      beforeEach(() => {
        interpreter = new MedicalCounselingInterpreter();
      });

      it('should interpret health profile with preventive focus', () => {
        const profile = {
          sixthHouse: { strength: 0.75, ruler: 'MERCURY' },
          twelfthHouse: { strength: 0.6 },
          healthPlanets: [{ planet: 'SATURN', significance: 0.8, aspects: [] }],
          medicalAspects: [
            { type: 'chronic_conditions', aspect: { planet: 'SATURN', aspect: 'SQUARE' }, significance: 0.7 }
          ],
          healthTiming: {}
        };

        const result = interpreter.interpretProfile(profile);
        expect(result.challengingAspects.length).toBeGreaterThan(0);
        expect(result.developmentAreas).toContain('Preventive care focus');
      });
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle incomplete birth chart gracefully', async () => {
      const incompleteChart: BirthChart = {
        planets: {},
        houses: [],
        angles: { ASC: 0, MC: 90 }
      };

      const analyzer = new CareerCounselingAnalyzer(incompleteChart);
      const result = await analyzer.analyzeCareerPotential();

      expect(result).toBeDefined();
      expect(result.type).toBe('career_counseling');
    });

    it('should handle missing planetary data', async () => {
      const chartWithoutSaturn: BirthChart = {
        ...mockChart,
        planets: { ...mockChart.planets }
      };
      delete chartWithoutSaturn.planets.SATURN;

      const analyzer = new CareerCounselingAnalyzer(chartWithoutSaturn);
      const result = await analyzer.analyzeCareerPotential();

      expect(result).toBeDefined();
      expect(result.profile).toBeDefined();
    });

    it('should handle extreme longitude values', () => {
      const aspectCalculator = new AspectCalculator();
      const chartWithExtremeLongitudes: BirthChart = {
        ...mockChart,
        planets: {
          SUN: { longitude: 359.9, latitude: 0, speed: 1, retrograde: false },
          MOON: { longitude: 0.1, latitude: 0, speed: 1, retrograde: false }
        }
      };

      const aspects = aspectCalculator.calculateAspectsForPlanet(chartWithExtremeLongitudes, 'SUN');
      expect(aspects.length).toBeGreaterThan(0);
    });

    it('should handle retrograde planets correctly', () => {
      const chartWithRetrograde: BirthChart = {
        ...mockChart,
        planets: {
          ...mockChart.planets,
          MERCURY: { longitude: 45, latitude: 0, speed: -1, retrograde: true }
        }
      };

      const analyzer = new CareerCounselingAnalyzer(chartWithRetrograde);
      expect(async () => {
        await analyzer.analyzeCareerPotential();
      }).not.toThrow();
    });
  });

  describe('Performance Tests', () => {
    it('should complete analysis within performance benchmarks', async () => {
      const startTime = Date.now();

      const analyzer = new CareerCounselingAnalyzer(mockChart);
      await analyzer.analyzeCareerPotential();

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(2000); // Should complete within 2 seconds
    });

    it('should handle multiple concurrent analyses', async () => {
      const promises = Array(5).fill(null).map(() => {
        const analyzer = new CareerCounselingAnalyzer(mockChart);
        return analyzer.analyzeCareerPotential();
      });

      const startTime = Date.now();
      const results = await Promise.all(promises);
      const endTime = Date.now();

      expect(results).toHaveLength(5);
      results.forEach(result => {
        expect(result.type).toBe('career_counseling');
      });

      const totalDuration = endTime - startTime;
      expect(totalDuration).toBeLessThan(5000); // Should complete within 5 seconds for 5 analyses
    });
  });
});