/**
 * ZC1.28 Comprehensive Charity and Donation Guidance System Tests
 * Complete test suite covering all implementation guide code examples
 */

const VedicCharityGuidanceSystem = require('./vedic-charity-guidance-system');
const CharityRecommendationEngine = require('./charity-recommendation-engine');
const CharityTimingCalculator = require('./charity-timing-calculator');

describe('ZC1.28 Comprehensive Charity and Donation Guidance System', () => {
    let charitySystem;
    let mockBirthChart;

    beforeEach(() => {
        charitySystem = new VedicCharityGuidanceSystem();

        // Mock birth chart data based on implementation guide
        mockBirthChart = {
            planets: {
                SUN: {
                    name: 'SUN',
                    longitude: 150.5,
                    sign: 5, // Leo
                    house: 1,
                    nakshatra: 'Magha'
                },
                MOON: {
                    name: 'MOON',
                    longitude: 45.2,
                    sign: 1, // Taurus
                    house: 10,
                    nakshatra: 'Rohini'
                },
                MARS: {
                    name: 'MARS',
                    longitude: 300.8,
                    sign: 10, // Capricorn
                    house: 7,
                    nakshatra: 'Uttara Ashadha'
                },
                MERCURY: {
                    name: 'MERCURY',
                    longitude: 75.3,
                    sign: 2, // Gemini
                    house: 11,
                    nakshatra: 'Ardra'
                },
                JUPITER: {
                    name: 'JUPITER',
                    longitude: 225.7,
                    sign: 7, // Libra
                    house: 4,
                    nakshatra: 'Vishakha'
                },
                VENUS: {
                    name: 'VENUS',
                    longitude: 30.1,
                    sign: 0, // Aries
                    house: 9,
                    nakshatra: 'Ashwini'
                },
                SATURN: {
                    name: 'SATURN',
                    longitude: 270.4,
                    sign: 9, // Sagittarius
                    house: 6,
                    nakshatra: 'Moola'
                },
                RAHU: {
                    name: 'RAHU',
                    longitude: 180.6,
                    sign: 6, // Virgo
                    house: 2,
                    nakshatra: 'Hasta'
                },
                KETU: {
                    name: 'KETU',
                    longitude: 0.6,
                    sign: 0, // Aries
                    house: 8,
                    nakshatra: 'Ashwini'
                }
            }
        };
    });

    describe('Planetary Charity Constants', () => {
        test('should have complete SUN charity guidelines', () => {
            const sunCharity = charitySystem.recommendationEngine.planetaryCharities.SUN;

            expect(sunCharity).toBeDefined();
            expect(sunCharity.planet).toBe('SUN');
            expect(sunCharity.element).toBe('Fire');
            expect(sunCharity.direction).toBe('East');
            expect(sunCharity.color).toBe('Red');
            expect(sunCharity.metal).toBe('Gold');
            expect(sunCharity.gemstone).toBe('Ruby');

            expect(sunCharity.recommendedCharities).toHaveLength(4);
            expect(sunCharity.auspiciousDays).toEqual(['Sunday']);
            expect(sunCharity.auspiciousNakshatras).toEqual(['Krittika', 'Uttara Phalguni', 'Uttara Ashadha']);
            expect(sunCharity.bestTime).toBe('Sunrise to 10 AM');
        });

        test('should have complete MOON charity guidelines', () => {
            const moonCharity = charitySystem.recommendationEngine.planetaryCharities.MOON;

            expect(moonCharity).toBeDefined();
            expect(moonCharity.planet).toBe('MOON');
            expect(moonCharity.element).toBe('Water');
            expect(moonCharity.direction).toBe('North');
            expect(moonCharity.color).toBe('White');
            expect(moonCharity.metal).toBe('Silver');
            expect(moonCharity.gemstone).toBe('Pearl');

            expect(moonCharity.recommendedCharities).toHaveLength(4);
            expect(moonCharity.auspiciousDays).toEqual(['Monday']);
            expect(moonCharity.auspiciousNakshatras).toEqual(['Rohini', 'Hasta', 'Shravana']);
            expect(moonCharity.bestTime).toBe('Moonrise time');
        });

        test('should have complete planetary charity data for all planets', () => {
            const planets = ['SUN', 'MOON', 'MARS', 'MERCURY', 'JUPITER', 'VENUS', 'SATURN', 'RAHU', 'KETU'];

            planets.forEach(planet => {
                const charityData = charitySystem.recommendationEngine.planetaryCharities[planet];
                expect(charityData).toBeDefined();
                expect(charityData.planet).toBe(planet);
                expect(charityData.recommendedCharities).toBeInstanceOf(Array);
                expect(charityData.recommendedCharities.length).toBeGreaterThan(0);
                expect(charityData.auspiciousDays).toBeInstanceOf(Array);
                expect(charityData.auspiciousNakshatras).toBeInstanceOf(Array);
                expect(charityData.bestTime).toBeDefined();
            });
        });
    });

    describe('Planetary Strength Analysis Functions', () => {
        describe('calculatePlanetaryStrength', () => {
            test('should calculate strength for well-placed planet', () => {
                const sunPlanet = mockBirthChart.planets.SUN;
                const strength = charitySystem.recommendationEngine.calculatePlanetaryStrength(sunPlanet, mockBirthChart);

                expect(typeof strength).toBe('number');
                expect(strength).toBeGreaterThanOrEqual(0);
                expect(strength).toBeLessThanOrEqual(100);
            });

            test('should calculate strength for debilitated planet', () => {
                const debilitatedVenus = {
                    ...mockBirthChart.planets.VENUS,
                    sign: 6 // Virgo - Venus debilitation
                };
                const strength = charitySystem.recommendationEngine.calculatePlanetaryStrength(debilitatedVenus, mockBirthChart);

                expect(typeof strength).toBe('number');
                expect(strength).toBeGreaterThanOrEqual(0);
                expect(strength).toBeLessThanOrEqual(100);
            });

            test('should handle combust planets', () => {
                const combustMercury = {
                    ...mockBirthChart.planets.MERCURY,
                    longitude: mockBirthChart.planets.SUN.longitude + 0.5 // Close to Sun
                };
                const strength = charitySystem.recommendationEngine.calculatePlanetaryStrength(combustMercury, mockBirthChart);

                expect(typeof strength).toBe('number');
                expect(strength).toBeGreaterThanOrEqual(0);
            });
        });

        describe('identifyPlanetaryAfflictions', () => {
            test('should identify debilitation affliction', () => {
                const debilitatedSaturn = {
                    ...mockBirthChart.planets.SATURN,
                    sign: 0 // Aries - Saturn debilitation
                };
                const afflictions = charitySystem.recommendationEngine.identifyPlanetaryAfflictions(debilitatedSaturn, mockBirthChart);

                expect(Array.isArray(afflictions)).toBe(true);
                expect(afflictions.some(a => a.type === 'debilitation')).toBe(true);
            });

            test('should identify dusthana house affliction', () => {
                const dusthanaSaturn = {
                    ...mockBirthChart.planets.SATURN,
                    house: 8 // Dusthana house
                };
                const afflictions = charitySystem.recommendationEngine.identifyPlanetaryAfflictions(dusthanaSaturn, mockBirthChart);

                expect(Array.isArray(afflictions)).toBe(true);
                expect(afflictions.some(a => a.type === 'dusthana_house')).toBe(true);
            });

            test('should identify multiple afflictions', () => {
                const heavilyAfflicted = {
                    name: 'TEST_PLANET',
                    sign: 0, // Debilitated
                    house: 12, // Dusthana
                    longitude: 150.5
                };
                const afflictions = charitySystem.recommendationEngine.identifyPlanetaryAfflictions(heavilyAfflicted, mockBirthChart);

                expect(Array.isArray(afflictions)).toBe(true);
                expect(afflictions.length).toBeGreaterThan(1);
            });
        });

        describe('determineCharityNeeds', () => {
            test('should determine high priority for severely afflicted planet', () => {
                const strength = 25; // Low strength
                const afflictions = [
                    { type: 'debilitation', severity: 'high' },
                    { type: 'dusthana_house', severity: 'medium' }
                ];

                const needs = charitySystem.recommendationEngine.determineCharityNeeds(strength, afflictions, 'SATURN');

                expect(needs.priority).toBe('high');
                expect(needs.urgency).toBe('immediate');
                expect(Array.isArray(needs.charities)).toBe(true);
            });

            test('should determine low priority for well-placed planet', () => {
                const strength = 85; // High strength
                const afflictions = []; // No afflictions

                const needs = charitySystem.recommendationEngine.determineCharityNeeds(strength, afflictions, 'JUPITER');

                expect(needs.priority).toBe('low');
                expect(needs.urgency).toBe('when_convenient');
            });

            test('should include planet-specific charities', () => {
                const strength = 50;
                const afflictions = [{ type: 'dusthana_house', severity: 'low' }];

                const needs = charitySystem.recommendationEngine.determineCharityNeeds(strength, afflictions, 'SUN');

                expect(Array.isArray(needs.charities)).toBe(true);
                expect(needs.charities.length).toBeGreaterThan(0);
                expect(needs.charities[0]).toHaveProperty('item');
                expect(needs.charities[0]).toHaveProperty('recipient');
                expect(needs.charities[0]).toHaveProperty('significance');
            });
        });
    });

    describe('Charity Recommendation Engine', () => {
        let recommendationEngine;

        beforeEach(() => {
            recommendationEngine = new CharityRecommendationEngine();
        });

        describe('generateCharityGuidance', () => {
            test('should generate complete charity guidance', () => {
                const guidance = recommendationEngine.generateCharityGuidance(mockBirthChart);

                expect(guidance).toHaveProperty('planetaryAnalysis');
                expect(guidance).toHaveProperty('priorityPlanets');
                expect(guidance).toHaveProperty('recommendations');
                expect(guidance).toHaveProperty('auspiciousTiming');
                expect(guidance).toHaveProperty('monthlyPlan');
                expect(guidance).toHaveProperty('emergencyCharities');
            });

            test('should prioritize planets correctly', () => {
                const guidance = recommendationEngine.generateCharityGuidance(mockBirthChart);

                expect(Array.isArray(guidance.priorityPlanets)).toBe(true);
                expect(guidance.priorityPlanets.length).toBe(9); // All planets

                // Check sorting by priority
                for (let i = 1; i < guidance.priorityPlanets.length; i++) {
                    const current = guidance.priorityPlanets[i];
                    const previous = guidance.priorityPlanets[i - 1];
                    const currentPriority = { high: 3, medium: 2, low: 1 }[current.priority] || 0;
                    const previousPriority = { high: 3, medium: 2, low: 1 }[previous.priority] || 0;

                    expect(previousPriority).toBeGreaterThanOrEqual(currentPriority);
                }
            });

            test('should create detailed recommendations', () => {
                const guidance = recommendationEngine.generateCharityGuidance(mockBirthChart);

                expect(Array.isArray(guidance.recommendations)).toBe(true);
                guidance.recommendations.forEach(rec => {
                    expect(rec).toHaveProperty('planet');
                    expect(rec).toHaveProperty('priority');
                    expect(rec).toHaveProperty('urgency');
                    expect(rec).toHaveProperty('item');
                    expect(rec).toHaveProperty('recipient');
                    expect(rec).toHaveProperty('significance');
                    expect(rec).toHaveProperty('quantity');
                    expect(rec).toHaveProperty('frequency');
                    expect(rec).toHaveProperty('estimatedCost');
                });
            });

            test('should calculate auspicious timing', () => {
                const guidance = recommendationEngine.generateCharityGuidance(mockBirthChart);

                expect(guidance.auspiciousTiming).toBeDefined();
                Object.keys(guidance.auspiciousTiming).forEach(planet => {
                    const timing = guidance.auspiciousTiming[planet];
                    expect(timing).toHaveProperty('bestDays');
                    expect(timing).toHaveProperty('bestNakshatras');
                    expect(timing).toHaveProperty('bestTime');
                    expect(timing).toHaveProperty('nextAuspiciousDates');
                    expect(timing).toHaveProperty('planetaryPeriods');
                });
            });

            test('should create monthly charity plan', () => {
                const guidance = recommendationEngine.generateCharityGuidance(mockBirthChart);

                expect(Array.isArray(guidance.monthlyPlan)).toBe(true);
                guidance.monthlyPlan.forEach(week => {
                    expect(week).toHaveProperty('week');
                    expect(week).toHaveProperty('startDate');
                    expect(week).toHaveProperty('endDate');
                    expect(week).toHaveProperty('recommendations');
                    expect(week).toHaveProperty('focus');
                });
            });
        });

        describe('prioritizePlanets', () => {
            test('should sort planets by priority and affliction count', () => {
                const analysis = {
                    SUN: { charityPriority: 'high', afflictionCount: 2, strength: 30 },
                    MOON: { charityPriority: 'medium', afflictionCount: 1, strength: 60 },
                    JUPITER: { charityPriority: 'low', afflictionCount: 0, strength: 90 }
                };

                const prioritized = recommendationEngine.prioritizePlanets(analysis);

                expect(prioritized[0].name).toBe('SUN'); // High priority first
                expect(prioritized[1].name).toBe('MOON'); // Medium priority second
                expect(prioritized[2].name).toBe('JUPITER'); // Low priority last
            });

            test('should handle planets with same priority by affliction count', () => {
                const analysis = {
                    SATURN: { charityPriority: 'high', afflictionCount: 3, strength: 20 },
                    MARS: { charityPriority: 'high', afflictionCount: 1, strength: 40 }
                };

                const prioritized = recommendationEngine.prioritizePlanets(analysis);

                expect(prioritized[0].name).toBe('SATURN'); // More afflictions first
                expect(prioritized[1].name).toBe('MARS');
            });
        });

        describe('createRecommendations', () => {
            test('should create recommendations with proper quantities and frequencies', () => {
                const priorityPlanets = [
                    { name: 'SATURN', priority: 'high', urgency: 'immediate' },
                    { name: 'SUN', priority: 'medium', urgency: 'soon' }
                ];

                const recommendations = recommendationEngine.createRecommendations(priorityPlanets);

                expect(Array.isArray(recommendations)).toBe(true);
                recommendations.forEach(rec => {
                    expect(rec).toHaveProperty('quantity');
                    expect(rec).toHaveProperty('frequency');
                    expect(rec).toHaveProperty('estimatedCost');
                    expect(typeof rec.estimatedCost).toBe('number');
                });
            });

            test('should determine appropriate quantities based on priority', () => {
                const highPriority = [{ name: 'SATURN', priority: 'high', urgency: 'immediate' }];
                const mediumPriority = [{ name: 'SUN', priority: 'medium', urgency: 'soon' }];
                const lowPriority = [{ name: 'JUPITER', priority: 'low', urgency: 'when_convenient' }];

                const highRecs = recommendationEngine.createRecommendations(highPriority);
                const mediumRecs = recommendationEngine.createRecommendations(mediumPriority);
                const lowRecs = recommendationEngine.createRecommendations(lowPriority);

                // High priority should have higher quantities
                expect(highRecs[0].quantity).toBeGreaterThanOrEqual(mediumRecs[0].quantity);
            });
        });

        describe('calculateAuspiciousTiming', () => {
            test('should calculate timing for all priority planets', () => {
                const priorityPlanets = [
                    { name: 'SUN' },
                    { name: 'MOON' }
                ];
                const currentDate = new Date();

                const timing = recommendationEngine.calculateAuspiciousTiming(priorityPlanets, currentDate);

                expect(timing).toHaveProperty('SUN');
                expect(timing).toHaveProperty('MOON');

                expect(timing.SUN.bestDays).toEqual(['Sunday']);
                expect(timing.MOON.bestDays).toEqual(['Monday']);
            });

            test('should find next auspicious dates', () => {
                const priorityPlanets = [{ name: 'SUN' }];
                const currentDate = new Date('2024-01-01'); // Monday

                const timing = recommendationEngine.calculateAuspiciousTiming(priorityPlanets, currentDate);

                expect(Array.isArray(timing.SUN.nextAuspiciousDates)).toBe(true);
                expect(timing.SUN.nextAuspiciousDates.length).toBeGreaterThan(0);
            });
        });
    });

    describe('Timing Calculation Functions', () => {
        let timingCalculator;

        beforeEach(() => {
            timingCalculator = new CharityTimingCalculator();
        });

        describe('calculateCharityTiming', () => {
            test('should calculate timing score for panchang', () => {
                const mockPanchang = {
                    tithi: { number: 1 },
                    nakshatra: { number: 1 },
                    yoga: { number: 1 },
                    karana: { number: 1 },
                    vara: { number: 1 }
                };
                const sunCharity = charitySystem.recommendationEngine.planetaryCharities.SUN;

                const timing = timingCalculator.calculateCharityTiming(mockPanchang, sunCharity);

                expect(timing).toHaveProperty('totalScore');
                expect(timing).toHaveProperty('factors');
                expect(timing).toHaveProperty('rating');
                expect(timing).toHaveProperty('recommendation');
                expect(typeof timing.totalScore).toBe('number');
            });

            test('should handle auspicious tithi compatibility', () => {
                const auspiciousPanchang = {
                    tithi: { number: 1 }, // Auspicious for Sun
                    nakshatra: { number: 1 },
                    yoga: { number: 1 },
                    karana: { number: 1 },
                    vara: { number: 1 }
                };
                const sunCharity = charitySystem.recommendationEngine.planetaryCharities.SUN;

                const timing = timingCalculator.calculateCharityTiming(auspiciousPanchang, sunCharity);

                expect(timing.totalScore).toBeGreaterThan(0);
                expect(timing.factors.some(f => f.factor === 'tithi')).toBe(true);
            });
        });

        describe('calculateFavorableTransits', () => {
            test('should identify favorable transit positions', () => {
                const planet = 'SUN';
                const currentDate = new Date();
                const birthChart = mockBirthChart;

                const transits = timingCalculator.calculateFavorableTransits(planet, currentDate, birthChart);

                expect(Array.isArray(transits)).toBe(true);
                transits.forEach(transit => {
                    expect(transit).toHaveProperty('type');
                    expect(transit).toHaveProperty('strength');
                    expect(transit).toHaveProperty('reason');
                });
            });

            test('should handle well-placed transit planets', () => {
                // Mock transit calculation - in real implementation this would use ephemeris
                const planet = 'JUPITER';
                const currentDate = new Date();
                const birthChart = mockBirthChart;

                const transits = timingCalculator.calculateFavorableTransits(planet, currentDate, birthChart);

                expect(Array.isArray(transits)).toBe(true);
            });
        });

        describe('findRecommendedDates', () => {
            test('should find next auspicious dates within timeframe', () => {
                const planet = 'SUN';
                const startDate = new Date('2024-01-01'); // Monday
                const days = 30;

                const dates = timingCalculator.findRecommendedDates(planet, startDate, days);

                expect(Array.isArray(dates)).toBe(true);
                expect(dates.length).toBeGreaterThan(0);
                expect(dates.length).toBeLessThanOrEqual(days);

                // All dates should be Sundays (Sun's auspicious day)
                dates.forEach(date => {
                    expect(date.getDay()).toBe(0); // Sunday
                });
            });

            test('should respect timeframe limits', () => {
                const planet = 'SUN';
                const startDate = new Date();
                const days = 7;

                const dates = timingCalculator.findRecommendedDates(planet, startDate, days);

                expect(Array.isArray(dates)).toBe(true);
                dates.forEach(date => {
                    const diffTime = date.getTime() - startDate.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    expect(diffDays).toBeLessThanOrEqual(days);
                });
            });
        });
    });

    describe('Complete VedicCharityGuidanceSystem Integration', () => {
        describe('generateCharityGuidance', () => {
            test('should generate complete guidance with all components', async () => {
                const guidance = await charitySystem.generateCharityGuidance(mockBirthChart);

                expect(guidance).toHaveProperty('birthChart');
                expect(guidance).toHaveProperty('guidance');
                expect(guidance).toHaveProperty('timing');
                expect(guidance).toHaveProperty('panchang');
                expect(guidance).toHaveProperty('report');
                expect(guidance).toHaveProperty('implementation');

                // Check birth chart analysis
                expect(guidance.birthChart.planetaryAnalysis).toBeDefined();
                expect(Object.keys(guidance.birthChart.planetaryAnalysis)).toHaveLength(9);

                // Check report structure
                expect(guidance.report.summary).toHaveProperty('totalRecommendations');
                expect(guidance.report.summary).toHaveProperty('priorityBreakdown');
                expect(guidance.report.summary).toHaveProperty('estimatedMonthlyCost');
                expect(guidance.report.summary).toHaveProperty('timeCommitment');
            });

            test('should handle different birth chart configurations', async () => {
                // Test with different planetary positions
                const differentChart = {
                    planets: {
                        ...mockBirthChart.planets,
                        SUN: { ...mockBirthChart.planets.SUN, sign: 6 }, // Virgo (debilitated)
                        SATURN: { ...mockBirthChart.planets.SATURN, house: 8 } // Dusthana
                    }
                };

                const guidance = await charitySystem.generateCharityGuidance(differentChart);

                expect(guidance.guidance.recommendations.length).toBeGreaterThan(0);
                expect(guidance.report.summary.totalRecommendations).toBe(guidance.guidance.recommendations.length);
            });

            test('should include panchang data in guidance', async () => {
                const guidance = await charitySystem.generateCharityGuidance(mockBirthChart);

                expect(guidance.panchang).toHaveProperty('date');
                expect(guidance.panchang).toHaveProperty('tithi');
                expect(guidance.panchang).toHaveProperty('nakshatra');
                expect(guidance.panchang).toHaveProperty('yoga');
                expect(guidance.panchang).toHaveProperty('karana');
                expect(guidance.panchang).toHaveProperty('vara');
            });
        });

        describe('calculateComprehensiveTiming', () => {
            test('should integrate panchang and transit timing', async () => {
                const priorityPlanets = [
                    { name: 'SUN' },
                    { name: 'MOON' }
                ];
                const panchang = {
                    date: new Date(),
                    tithi: { number: 1, name: 'Pratipad' },
                    nakshatra: { number: 1, name: 'Ashwini' },
                    yoga: { number: 1, name: 'Vishkambha' },
                    karana: { number: 1, name: 'Bava' },
                    vara: { number: 1, name: 'Sunday' }
                };
                const currentDate = new Date();

                const timing = charitySystem.calculateComprehensiveTiming(priorityPlanets, panchang, currentDate, mockBirthChart);

                expect(timing).toHaveProperty('SUN');
                expect(timing).toHaveProperty('MOON');

                expect(timing.SUN).toHaveProperty('panchangTiming');
                expect(timing.SUN).toHaveProperty('transitTiming');
                expect(timing.SUN).toHaveProperty('overallScore');
                expect(timing.SUN).toHaveProperty('recommendedDates');
                expect(timing.SUN).toHaveProperty('immediateTiming');
            });

            test('should calculate overall timing scores', async () => {
                const priorityPlanets = [{ name: 'SUN' }];
                const panchang = {
                    date: new Date(),
                    tithi: { number: 1 },
                    nakshatra: { number: 1 },
                    yoga: { number: 1 },
                    karana: { number: 1 },
                    vara: { number: 1 }
                };
                const currentDate = new Date();

                const timing = charitySystem.calculateComprehensiveTiming(priorityPlanets, panchang, currentDate, mockBirthChart);

                expect(typeof timing.SUN.overallScore).toBe('number');
                expect(timing.SUN.overallScore).toBeGreaterThanOrEqual(0);
            });
        });

        describe('generateCharityReport', () => {
            test('should create comprehensive report with all sections', async () => {
                const guidance = await charitySystem.generateCharityGuidance(mockBirthChart);
                const report = guidance.report;

                expect(report).toHaveProperty('summary');
                expect(report).toHaveProperty('immediateActions');
                expect(report).toHaveProperty('monthlyPlan');
                expect(report).toHaveProperty('detailedRecommendations');
                expect(report).toHaveProperty('successFactors');
                expect(report).toHaveProperty('precautions');

                // Check success factors and precautions
                expect(Array.isArray(report.successFactors)).toBe(true);
                expect(Array.isArray(report.precautions)).toBe(true);
                expect(report.successFactors.length).toBeGreaterThan(0);
                expect(report.precautions.length).toBeGreaterThan(0);
            });

            test('should calculate accurate priority breakdown', async () => {
                const guidance = await charitySystem.generateCharityGuidance(mockBirthChart);
                const breakdown = guidance.report.summary.priorityBreakdown;

                const totalFromBreakdown = breakdown.high + breakdown.medium + breakdown.low;
                expect(totalFromBreakdown).toBe(guidance.report.summary.totalRecommendations);
            });

            test('should estimate realistic costs and time', async () => {
                const guidance = await charitySystem.generateCharityGuidance(mockBirthChart);

                expect(guidance.report.summary.estimatedMonthlyCost).toBeGreaterThanOrEqual(0);
                expect(guidance.report.summary.timeCommitment).toBeGreaterThanOrEqual(0);

                // Time commitment should be reasonable (less than 24 hours per month)
                expect(guidance.report.summary.timeCommitment).toBeLessThanOrEqual(1440); // 24 hours in minutes
            });
        });

        describe('createImplementationPlan', () => {
            test('should create phased implementation plan', async () => {
                const guidance = await charitySystem.generateCharityGuidance(mockBirthChart);
                const implementation = guidance.implementation;

                expect(implementation).toHaveProperty('phase1');
                expect(implementation).toHaveProperty('phase2');
                expect(implementation).toHaveProperty('phase3');
                expect(implementation).toHaveProperty('phase4');
                expect(implementation).toHaveProperty('tracking');

                // Check phase structure
                ['phase1', 'phase2', 'phase3', 'phase4'].forEach(phaseKey => {
                    const phase = implementation[phaseKey];
                    expect(phase).toHaveProperty('duration');
                    expect(phase).toHaveProperty('focus');
                    expect(phase).toHaveProperty('actions');
                    expect(phase).toHaveProperty('goal');
                });
            });

            test('should include tracking and review mechanisms', async () => {
                const guidance = await charitySystem.generateCharityGuidance(mockBirthChart);
                const tracking = guidance.implementation.tracking;

                expect(tracking).toHaveProperty('methods');
                expect(tracking).toHaveProperty('reviewFrequency');
                expect(tracking).toHaveProperty('adjustmentTriggers');

                expect(Array.isArray(tracking.methods)).toBe(true);
                expect(tracking.methods.length).toBeGreaterThan(0);
            });
        });

        describe('getPlanetSpecificGuidance', () => {
            test('should provide detailed planet-specific guidance', async () => {
                const guidance = await charitySystem.getPlanetSpecificGuidance('SUN', mockBirthChart);

                expect(guidance).toHaveProperty('planet', 'SUN');
                expect(guidance).toHaveProperty('planetaryData');
                expect(guidance).toHaveProperty('charityGuidelines');
                expect(guidance).toHaveProperty('currentTiming');
                expect(guidance).toHaveProperty('recommendedActions');
                expect(guidance).toHaveProperty('nextAuspiciousDates');

                expect(Array.isArray(guidance.recommendedActions)).toBe(true);
                expect(guidance.recommendedActions.length).toBeGreaterThan(0);
            });

            test('should handle all planets', async () => {
                const planets = ['SUN', 'MOON', 'MARS', 'MERCURY', 'JUPITER', 'VENUS', 'SATURN', 'RAHU', 'KETU'];

                for (const planet of planets) {
                    const guidance = await charitySystem.getPlanetSpecificGuidance(planet, mockBirthChart);
                    expect(guidance.planet).toBe(planet);
                    expect(guidance.charityGuidelines.planet).toBe(planet);
                }
            });
        });

        describe('getEmergencyCharities', () => {
            test('should identify emergency charities for critical afflictions', () => {
                const emergencies = charitySystem.getEmergencyCharities(mockBirthChart);

                expect(Array.isArray(emergencies)).toBe(true);
                // May be empty for well-placed chart, but should still be an array
            });

            test('should validate birth chart before processing', () => {
                expect(() => {
                    charitySystem.getEmergencyCharities(null);
                }).toThrow('Birth chart is required');
            });
        });
    });

    describe('Edge Cases and Error Handling', () => {
        test('should handle missing planetary data gracefully', async () => {
            const incompleteChart = {
                planets: {
                    SUN: mockBirthChart.planets.SUN
                    // Missing other planets
                }
            };

            await expect(
                charitySystem.generateCharityGuidance(incompleteChart)
            ).rejects.toThrow('Birth chart missing required planet');
        });

        test('should handle invalid planetary positions', async () => {
            const invalidChart = {
                planets: {
                    ...mockBirthChart.planets,
                    SUN: {
                        name: 'SUN',
                        longitude: 'invalid',
                        sign: 5,
                        house: 1
                    }
                }
            };

            await expect(
                charitySystem.generateCharityGuidance(invalidChart)
            ).rejects.toThrow('Invalid planetary data for SUN');
        });

        test('should handle empty birth chart', async () => {
            await expect(
                charitySystem.generateCharityGuidance({})
            ).rejects.toThrow('Birth chart is required');
        });

        test('should handle null birth chart', async () => {
            await expect(
                charitySystem.generateCharityGuidance(null)
            ).rejects.toThrow('Charity guidance generation failed');
        });

        test('should handle invalid planet names in specific guidance', async () => {
            await expect(
                charitySystem.getPlanetSpecificGuidance('INVALID_PLANET', mockBirthChart)
            ).rejects.toThrow('Charity data not available for planet INVALID_PLANET');
        });

        test('should handle missing planets in specific guidance', async () => {
            const incompleteChart = {
                planets: {
                    SUN: mockBirthChart.planets.SUN
                    // Missing MOON
                }
            };

            await expect(
                charitySystem.getPlanetSpecificGuidance('MOON', incompleteChart)
            ).rejects.toThrow('Planet MOON not found in birth chart');
        });
    });

    describe('Performance and Scalability', () => {
        test('should generate guidance within reasonable time', async () => {
            const startTime = Date.now();
            await charitySystem.generateCharityGuidance(mockBirthChart);
            const endTime = Date.now();

            const duration = endTime - startTime;
            expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
        });

        test('should handle multiple concurrent requests', async () => {
            const promises = [];
            for (let i = 0; i < 5; i++) {
                promises.push(charitySystem.generateCharityGuidance(mockBirthChart));
            }

            const results = await Promise.all(promises);

            expect(results).toHaveLength(5);
            results.forEach(result => {
                expect(result).toHaveProperty('guidance');
                expect(result).toHaveProperty('report');
            });
        });

        test('should maintain consistent results for same input', async () => {
            const result1 = await charitySystem.generateCharityGuidance(mockBirthChart);
            const result2 = await charitySystem.generateCharityGuidance(mockBirthChart);

            expect(result1.report.summary.totalRecommendations).toBe(result2.report.summary.totalRecommendations);
            expect(result1.report.summary.estimatedMonthlyCost).toBe(result2.report.summary.estimatedMonthlyCost);
        });
    });

    describe('Integration with External Systems', () => {
        test('should integrate with panchang calculation system', async () => {
            // Mock panchang integration
            const guidance = await charitySystem.generateCharityGuidance(mockBirthChart);

            expect(guidance).toHaveProperty('panchang');
            expect(guidance.panchang).toHaveProperty('tithi');
            expect(guidance.panchang).toHaveProperty('nakshatra');
            expect(guidance.panchang).toHaveProperty('vara');
        });

        test('should handle panchang calculation errors gracefully', async () => {
            // Test with panchang system temporarily unavailable
            const originalCalculatePanchang = charitySystem.calculatePanchang;
            charitySystem.calculatePanchang = async () => {
                throw new Error('Panchang service unavailable');
            };

            try {
                await expect(
                    charitySystem.generateCharityGuidance(mockBirthChart)
                ).rejects.toThrow('Charity guidance generation failed');
            } finally {
                charitySystem.calculatePanchang = originalCalculatePanchang;
            }
        });
    });

    describe('Data Validation and Sanitization', () => {
        test('should validate birth chart data types', () => {
            const invalidCharts = [
                { planets: null },
                { planets: undefined },
                { planets: 'invalid' },
                { planets: {} },
                { planets: { SUN: null } },
                { planets: { SUN: { longitude: null } } }
            ];

            invalidCharts.forEach(invalidChart => {
                expect(() => {
                    charitySystem.validateBirthChart(invalidChart);
                }).toThrow();
            });
        });

        test('should handle edge case planetary positions', () => {
            const edgeCaseChart = {
                planets: {
                    ...mockBirthChart.planets,
                    SUN: {
                        name: 'SUN',
                        longitude: 359.9, // Almost 360 degrees
                        sign: 11, // Pisces
                        house: 12
                    },
                    MOON: {
                        name: 'MOON',
                        longitude: 0.1, // Almost 0 degrees
                        sign: 0, // Aries
                        house: 1
                    }
                }
            };

            expect(() => {
                charitySystem.validateBirthChart(edgeCaseChart);
            }).not.toThrow();
        });

        test('should sanitize and normalize input data', async () => {
            // Test with string numbers that should be converted
            const stringChart = {
                planets: {
                    ...mockBirthChart.planets,
                    SUN: {
                        name: 'SUN',
                        longitude: '150.5', // String instead of number
                        sign: '5', // String instead of number
                        house: '1' // String instead of number
                    }
                }
            };

            // Should either handle conversion or throw clear error
            try {
                await charitySystem.generateCharityGuidance(stringChart);
            } catch (error) {
                expect(error.message).toContain('Invalid planetary data');
            }
        });
    });
});