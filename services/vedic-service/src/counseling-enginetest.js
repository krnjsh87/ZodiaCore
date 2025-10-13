const CounselingEngine = require('./counseling-engine');

/**
 * Test suite for CounselingEngine
 * Tests personalized counseling recommendations generation
 */
describe('CounselingEngine', () => {
    let engine;
    let mockLocationAnalysis;

    beforeEach(() => {
        engine = new CounselingEngine();

        mockLocationAnalysis = {
            lineInfluences: {
                beneficial: [
                    { planet: 'JUPITER', type: 'trine', strength: 0.8, description: 'Expansion and luck' },
                    { planet: 'VENUS', type: 'sextile', strength: 0.7, description: 'Harmony and relationships' }
                ],
                challenging: [
                    { planet: 'SATURN', type: 'square', strength: 0.6, description: 'Discipline and structure' }
                ]
            },
            relocationScore: {
                angularPlanets: [
                    { planet: 'SUN', angle: 'midheaven', strength: 0.9 },
                    { planet: 'MARS', angle: 'ascendant', strength: 0.8 }
                ],
                houseChanges: {
                    MOON: { from: 4, to: 7, significance: 'Emotional foundation to partnerships' }
                }
            },
            bestTimes: [
                { period: 'Spring Equinox', strength: 0.8 },
                { period: 'Full Moon', strength: 0.7 }
            ]
        };
    });

    describe('Constructor', () => {
        test('should create counseling engine', () => {
            expect(engine).toBeDefined();
            expect(engine.recommendations).toEqual([]);
        });
    });

    describe('generateCounseling', () => {
        test('should generate complete counseling recommendations', () => {
            const userProfile = { careerFocus: true };
            const result = engine.generateCounseling(mockLocationAnalysis, userProfile);

            expect(result).toBeDefined();
            expect(result.recommendations).toBeDefined();
            expect(result.summary).toBeDefined();
            expect(result.actionPlan).toBeDefined();
        });

        test('should handle missing user profile', () => {
            const result = engine.generateCounseling(mockLocationAnalysis);

            expect(result).toBeDefined();
            expect(result.recommendations.immediate).toBeDefined();
        });

        test('should personalize recommendations based on user profile', () => {
            const careerProfile = { careerFocus: true };
            const relationshipProfile = { relationshipStatus: 'single' };

            const careerResult = engine.generateCounseling(mockLocationAnalysis, careerProfile);
            const relationshipResult = engine.generateCounseling(mockLocationAnalysis, relationshipProfile);

            expect(careerResult.recommendations.immediate.some(rec => rec.type === 'career')).toBe(true);
            expect(relationshipResult.recommendations.shortTerm.some(rec => rec.type === 'relationships')).toBe(true);
        });
    });

    describe('analyzeLineInfluences', () => {
        test('should analyze beneficial line influences', () => {
            const result = engine.analyzeLineInfluences(mockLocationAnalysis.lineInfluences);

            expect(result.immediate).toHaveLength(2);
            expect(result.immediate[0].type).toBe('opportunity');
            expect(result.immediate[0].planet).toBe('JUPITER');
            expect(result.immediate[0].message).toContain('excellent for expansion and spirituality');
        });

        test('should analyze challenging line influences', () => {
            const result = engine.analyzeLineInfluences(mockLocationAnalysis.lineInfluences);

            expect(result.precautions).toHaveLength(1);
            expect(result.precautions[0].type).toBe('caution');
            expect(result.precautions[0].planet).toBe('SATURN');
            expect(result.precautions[0].message).toContain('be prepared for challenges with authority');
        });

        test('should handle empty influences', () => {
            const emptyInfluences = { beneficial: [], challenging: [] };
            const result = engine.analyzeLineInfluences(emptyInfluences);

            expect(result.immediate).toHaveLength(0);
            expect(result.precautions).toHaveLength(0);
        });
    });

    describe('getPlanetPurpose', () => {
        test('should return correct planet purposes', () => {
            expect(engine.getPlanetPurpose('SUN')).toBe('leadership and self-expression');
            expect(engine.getPlanetPurpose('MOON')).toBe('emotional well-being and family');
            expect(engine.getPlanetPurpose('VENUS')).toBe('relationships and finances');
            expect(engine.getPlanetPurpose('MARS')).toBe('action and physical activity');
            expect(engine.getPlanetPurpose('JUPITER')).toBe('expansion and spirituality');
            expect(engine.getPlanetPurpose('SATURN')).toBe('discipline and career');
            expect(engine.getPlanetPurpose('URANUS')).toBe('innovation and freedom');
            expect(engine.getPlanetPurpose('NEPTUNE')).toBe('creativity and intuition');
            expect(engine.getPlanetPurpose('PLUTO')).toBe('transformation and power');
        });

        test('should return default for unknown planet', () => {
            expect(engine.getPlanetPurpose('UNKNOWN')).toBe('personal growth');
        });
    });

    describe('getBeneficialAction', () => {
        test('should return appropriate beneficial actions', () => {
            expect(engine.getBeneficialAction('SUN', 'conjunction')).toBe('Embrace the positive energy for growth');
            expect(engine.getBeneficialAction('VENUS', 'trine')).toBe('Focus on relationships and creative pursuits');
            expect(engine.getBeneficialAction('JUPITER', 'sextile')).toBe('Expand your horizons through travel or learning');
        });
    });

    describe('getChallengeDescription', () => {
        test('should return appropriate challenge descriptions', () => {
            expect(engine.getChallengeDescription('MARS')).toBe('increased conflict or aggression');
            expect(engine.getChallengeDescription('SATURN')).toBe('challenges with authority or limitations');
            expect(engine.getChallengeDescription('PLUTO')).toBe('intense transformation or power struggles');
        });

        test('should return default for unknown planet', () => {
            expect(engine.getChallengeDescription('UNKNOWN')).toBe('challenging situations');
        });
    });

    describe('getRemedyForChallenge', () => {
        test('should return appropriate remedies', () => {
            expect(engine.getRemedyForChallenge('MARS', 'square')).toBe('Practice patience and channel energy constructively');
            expect(engine.getRemedyForChallenge('SATURN', 'opposition')).toBe('Focus on discipline and long-term planning');
            expect(engine.getRemedyForChallenge('PLUTO', 'conjunction')).toBe('Embrace change and seek deep understanding');
        });

        test('should return default remedy', () => {
            expect(engine.getRemedyForChallenge('UNKNOWN', 'trine')).toBe('Seek balance and self-awareness');
        });
    });

    describe('analyzeRelocationFactors', () => {
        test('should analyze angular planets', () => {
            const result = engine.analyzeRelocationFactors(mockLocationAnalysis.relocationScore);

            expect(result.shortTerm).toHaveLength(2);
            expect(result.shortTerm[0].type).toBe('strength');
            expect(result.shortTerm[0].planet).toBe('SUN');
            expect(result.shortTerm[0].message).toContain('enhanced leadership and vitality');
        });

        test('should analyze house changes', () => {
            const result = engine.analyzeRelocationFactors(mockLocationAnalysis.relocationScore);

            expect(result.longTerm).toHaveLength(1);
            expect(result.longTerm[0].type).toBe('transition');
            expect(result.longTerm[0].planet).toBe('MOON');
            expect(result.longTerm[0].message).toContain('Emotional foundation to partnerships');
        });

        test('should handle empty relocation factors', () => {
            const emptyFactors = { angularPlanets: [], houseChanges: {} };
            const result = engine.analyzeRelocationFactors(emptyFactors);

            expect(result.shortTerm).toHaveLength(0);
            expect(result.longTerm).toHaveLength(0);
        });
    });

    describe('getRecommendedActivities', () => {
        test('should return activities based on strength', () => {
            expect(engine.getRecommendedActivities(0.9)).toEqual(['Major decisions', 'New beginnings', 'Travel']);
            expect(engine.getRecommendedActivities(0.7)).toEqual(['Important meetings', 'Career moves', 'Relationships']);
            expect(engine.getRecommendedActivities(0.5)).toEqual(['Routine activities', 'Planning', 'Preparation']);
        });
    });

    describe('generateTimingRecommendations', () => {
        test('should generate timing recommendations', () => {
            const result = engine.generateTimingRecommendations(mockLocationAnalysis.bestTimes);

            expect(result).toHaveLength(2);
            expect(result[0].period).toBe('Spring Equinox');
            expect(result[0].strength).toBe(0.8);
            expect(result[0].activities).toEqual(['Major decisions', 'New beginnings', 'Travel']);
            expect(result[0].description).toContain('80% strength');
        });
    });

    describe('personalizeRecommendations', () => {
        test('should add career-specific recommendations', () => {
            const recommendations = {
                immediate: [],
                shortTerm: [],
                longTerm: [],
                precautions: [],
                optimalTiming: []
            };
            const userProfile = { careerFocus: true };

            const result = engine.personalizeRecommendations(recommendations, userProfile);

            expect(result.immediate).toHaveLength(1);
            expect(result.immediate[0].type).toBe('career');
            expect(result.immediate[0].message).toContain('career development');
        });

        test('should add relationship-specific recommendations', () => {
            const recommendations = {
                immediate: [],
                shortTerm: [],
                longTerm: [],
                precautions: [],
                optimalTiming: []
            };
            const userProfile = { relationshipStatus: 'single' };

            const result = engine.personalizeRecommendations(recommendations, userProfile);

            expect(result.shortTerm).toHaveLength(1);
            expect(result.shortTerm[0].type).toBe('relationships');
            expect(result.shortTerm[0].message).toContain('relationship dynamics');
        });

        test('should handle missing user profile', () => {
            const recommendations = {
                immediate: [{ type: 'test' }],
                shortTerm: [],
                longTerm: [],
                precautions: [],
                optimalTiming: []
            };

            const result = engine.personalizeRecommendations(recommendations);

            expect(result.immediate).toHaveLength(1);
            expect(result.immediate[0].type).toBe('test');
        });
    });

    describe('createActionPlan', () => {
        test('should create actionable plan from recommendations', () => {
            const recommendations = {
                immediate: [{ type: 'test1' }, { type: 'test2' }, { type: 'test3' }, { type: 'test4' }],
                shortTerm: [{ type: 'test5' }, { type: 'test6' }],
                longTerm: [{ type: 'test7' }, { type: 'test8' }],
                precautions: [{ type: 'caution1' }]
            };

            const result = engine.createActionPlan(recommendations);

            expect(result.immediate).toHaveLength(3); // Limited to 3
            expect(result.weekly).toHaveLength(2); // Limited to 2
            expect(result.monthly).toHaveLength(2); // Limited to 2
            expect(result.ongoing).toHaveLength(1); // All precautions
        });
    });

    describe('generateSummary', () => {
        test('should generate summary for high score', () => {
            const analysis = { overallScore: 85 };
            const summary = engine.generateSummary(analysis);

            expect(summary.overallScore).toBe(85);
            expect(summary.summaryText).toContain('Excellent astrological compatibility');
            expect(summary.keyStrengths).toBeDefined();
            expect(summary.mainChallenges).toBeDefined();
            expect(summary.recommendedActions).toBeDefined();
        });

        test('should generate summary for moderate score', () => {
            const analysis = { overallScore: 55 };
            const summary = engine.generateSummary(analysis);

            expect(summary.summaryText).toContain('Moderate compatibility');
        });

        test('should generate summary for low score', () => {
            const analysis = { overallScore: 25 };
            const summary = engine.generateSummary(analysis);

            expect(summary.summaryText).toContain('Challenging location astrologically');
        });
    });

    describe('extractKeyStrengths', () => {
        test('should extract strengths from analysis', () => {
            const analysis = {
                lineInfluences: { beneficial: [{ planet: 'JUPITER', type: 'trine' }] },
                relocationScore: { angularPlanets: [{ planet: 'SUN', angle: 'midheaven' }] }
            };

            const strengths = engine.extractKeyStrengths(analysis);

            expect(strengths).toContain('JUPITER trine influence');
            expect(strengths).toContain('Angular SUN for enhanced leadership and vitality');
        });
    });

    describe('extractMainChallenges', () => {
        test('should extract challenges from analysis', () => {
            const analysis = {
                lineInfluences: { challenging: [{ planet: 'SATURN', type: 'square' }] }
            };

            const challenges = engine.extractMainChallenges(analysis);

            expect(challenges).toContain('SATURN square influence');
        });
    });

    describe('extractRecommendedActions', () => {
        test('should extract actions based on score', () => {
            expect(engine.extractRecommendedActions({ overallScore: 85 })).toContain('Proceed with confidence');
            expect(engine.extractRecommendedActions({ overallScore: 65 })).toContain('Consider timing carefully');
            expect(engine.extractRecommendedActions({ overallScore: 35 })).toContain('Prepare thoroughly for challenges');
        });
    });

    describe('Edge Cases', () => {
        test('should handle empty location analysis', () => {
            const emptyAnalysis = {
                lineInfluences: { beneficial: [], challenging: [] },
                relocationScore: { angularPlanets: [], houseChanges: {} },
                bestTimes: []
            };

            const result = engine.generateCounseling(emptyAnalysis);

            expect(result.recommendations.immediate).toHaveLength(0);
            expect(result.recommendations.precautions).toHaveLength(0);
            expect(result.summary).toBeDefined();
        });

        test('should handle undefined user profile properties', () => {
            const recommendations = {
                immediate: [],
                shortTerm: [],
                longTerm: [],
                precautions: [],
                optimalTiming: []
            };
            const userProfile = { careerFocus: undefined, relationshipStatus: null };

            const result = engine.personalizeRecommendations(recommendations, userProfile);

            expect(result.immediate).toHaveLength(0);
            expect(result.shortTerm).toHaveLength(0);
        });

        test('should handle malformed best times', () => {
            const malformedBestTimes = [
                { period: 'Test', strength: 'invalid' },
                { period: 'Test2', strength: 0.5 }
            ];

            const result = engine.generateTimingRecommendations(malformedBestTimes);

            expect(result).toHaveLength(2);
            expect(result[0].description).toContain('NaN% strength');
            expect(result[1].description).toContain('50% strength');
        });
    });

    describe('Integration', () => {
        test('should perform complete counseling workflow', () => {
            const userProfile = { careerFocus: true, relationshipStatus: 'married' };
            const result = engine.generateCounseling(mockLocationAnalysis, userProfile);

            // Verify all components are present
            expect(result.recommendations.immediate).toBeDefined();
            expect(result.recommendations.shortTerm).toBeDefined();
            expect(result.recommendations.longTerm).toBeDefined();
            expect(result.recommendations.precautions).toBeDefined();
            expect(result.recommendations.optimalTiming).toBeDefined();

            expect(result.summary.overallScore).toBeDefined();
            expect(result.summary.summaryText).toBeDefined();
            expect(result.summary.keyStrengths).toBeDefined();
            expect(result.summary.mainChallenges).toBeDefined();
            expect(result.summary.recommendedActions).toBeDefined();

            expect(result.actionPlan.immediate).toBeDefined();
            expect(result.actionPlan.weekly).toBeDefined();
            expect(result.actionPlan.monthly).toBeDefined();
            expect(result.actionPlan.ongoing).toBeDefined();
        });

        test('should produce consistent results for same input', () => {
            const result1 = engine.generateCounseling(mockLocationAnalysis);
            const result2 = engine.generateCounseling(mockLocationAnalysis);

            expect(result1.summary.overallScore).toBe(result2.summary.overallScore);
            expect(result1.recommendations.immediate).toEqual(result2.recommendations.immediate);
        });

        test('should handle different user profiles differently', () => {
            const profile1 = { careerFocus: true };
            const profile2 = { relationshipStatus: 'single' };

            const result1 = engine.generateCounseling(mockLocationAnalysis, profile1);
            const result2 = engine.generateCounseling(mockLocationAnalysis, profile2);

            expect(result1.recommendations.immediate.some(r => r.type === 'career')).toBe(true);
            expect(result2.recommendations.shortTerm.some(r => r.type === 'relationships')).toBe(true);
        });
    });
});