// ZC3.13 Western Relationship Counseling Compatibility Test Suite
// Comprehensive tests for compatibility analysis and counseling

const {
    CounselingCompatibilityAnalyzer,
    CounselingScoringEngine,
    RelationshipCounselingAdvisor
} = require('./western-relationship-counseling-compatibility');

describe('Counseling Compatibility Analyzer', () => {
    let synastry, composite, analyzer;

    beforeEach(() => {
        synastry = {
            interAspects: [
                { from: { planet: 'SUN' }, to: { planet: 'MOON' }, aspect: { type: 'TRINE', orb: 1 },
                  counseling: { strength: 'excellent' } },
                { from: { planet: 'VENUS' }, to: { planet: 'MARS' }, aspect: { type: 'SQUARE', orb: 2 },
                  counseling: { strength: 'challenging' } }
            ],
            houseOverlays: [
                { house: 7, significance: 0.9, counseling: {} },
                { house: 4, significance: 0.5, counseling: {} }
            ],
            counseling: {
                communication: { insights: ['Good communication potential'] },
                emotional: { insights: ['Strong emotional bond'] },
                intimacy: { insights: [] },
                growth: { insights: [] },
                challenges: []
            }
        };

        composite = {
            aspects: [
                { aspect: { type: 'CONJUNCTION' }, counseling: { strength: 'excellent' } },
                { aspect: { type: 'TRINE' }, counseling: { strength: 'strong' } }
            ],
            angularity: { score: 75 }
        };

        analyzer = new CounselingCompatibilityAnalyzer(synastry, composite);
    });

    describe('Initialization', () => {
        test('should initialize with synastry and composite charts', () => {
            expect(analyzer.synastry).toBe(synastry);
            expect(analyzer.composite).toBe(composite);
            expect(analyzer.scoringEngine).toBeInstanceOf(CounselingScoringEngine);
            expect(analyzer.counselingAdvisor).toBeInstanceOf(RelationshipCounselingAdvisor);
        });
    });

    describe('Compatibility Calculation', () => {
        test('should calculate overall compatibility score', () => {
            const result = analyzer.calculateCounselingCompatibility();

            expect(result).toHaveProperty('overall');
            expect(result).toHaveProperty('breakdown');
            expect(result).toHaveProperty('rating');
            expect(result).toHaveProperty('strengths');
            expect(result).toHaveProperty('challenges');
            expect(result).toHaveProperty('counseling');
            expect(result).toHaveProperty('recommendations');

            expect(typeof result.overall).toBe('number');
            expect(result.overall).toBeGreaterThanOrEqual(0);
            expect(result.overall).toBeLessThanOrEqual(100);
        });

        test('should calculate breakdown scores', () => {
            const result = analyzer.calculateCounselingCompatibility();

            expect(result.breakdown).toHaveProperty('synastry');
            expect(result.breakdown).toHaveProperty('composite');
            expect(result.breakdown).toHaveProperty('dynamics');
            expect(result.breakdown).toHaveProperty('timing');

            Object.values(result.breakdown).forEach(score => {
                expect(typeof score).toBe('number');
                expect(score).toBeGreaterThanOrEqual(0);
                expect(score).toBeLessThanOrEqual(100);
            });
        });

        test('should generate compatibility rating', () => {
            const result = analyzer.calculateCounselingCompatibility();

            expect(typeof result.rating).toBe('string');
            expect(result.rating.length).toBeGreaterThan(0);
        });

        test('should identify strengths and challenges', () => {
            const result = analyzer.calculateCounselingCompatibility();

            expect(Array.isArray(result.strengths)).toBe(true);
            expect(Array.isArray(result.challenges)).toBe(true);
        });

        test('should generate recommendations', () => {
            const result = analyzer.calculateCounselingCompatibility();

            expect(Array.isArray(result.recommendations)).toBe(true);
            expect(result.recommendations.length).toBeGreaterThan(0);
        });
    });

    describe('Synastry Compatibility Analysis', () => {
        test('should analyze synastry aspects', () => {
            const score = analyzer.analyzeSynastryCompatibility();

            expect(typeof score).toBe('number');
            expect(score).toBeGreaterThanOrEqual(0);
            expect(score).toBeLessThanOrEqual(100);
        });

        test('should score aspects with counseling multipliers', () => {
            const aspects = [
                { aspect: { type: 'TRINE' }, counseling: { strength: 'excellent' } },
                { aspect: { type: 'SQUARE' }, counseling: { strength: 'challenging' } }
            ];

            const score = analyzer.scoreAspects(aspects);

            expect(typeof score).toBe('number');
            expect(score).toBeGreaterThan(0);
        });

        test('should score house overlays', () => {
            const overlays = [
                { significance: 0.9 },
                { significance: 0.7 },
                { significance: 0.3 }
            ];

            const score = analyzer.scoreHouseOverlays(overlays);

            expect(typeof score).toBe('number');
            expect(score).toBeGreaterThanOrEqual(0);
            expect(score).toBeLessThanOrEqual(100);
        });

        test('should score counseling factors', () => {
            const counseling = {
                communication: { insights: ['test'] },
                emotional: { insights: ['test'] },
                challenges: []
            };

            const score = analyzer.scoreCounselingFactors(counseling);

            expect(typeof score).toBe('number');
            expect(score).toBeGreaterThan(50); // Base score of 50 plus bonuses
        });
    });

    describe('Composite Compatibility Analysis', () => {
        test('should analyze composite aspects', () => {
            const score = analyzer.analyzeCompositeCompatibility();

            expect(typeof score).toBe('number');
            expect(score).toBeGreaterThanOrEqual(0);
            expect(score).toBeLessThanOrEqual(100);
        });

        test('should score composite aspects', () => {
            const aspects = [
                { aspect: { type: 'CONJUNCTION' }, counseling: { strength: 'excellent' } },
                { aspect: { type: 'SQUARE' }, counseling: { strength: 'challenging' } }
            ];

            const score = analyzer.scoreCompositeAspects(aspects);

            expect(typeof score).toBe('number');
            expect(score).toBeGreaterThan(0);
        });
    });

    describe('Counseling Multipliers', () => {
        test('should apply correct multipliers for aspect strengths', () => {
            expect(analyzer.getCounselingMultiplier('excellent')).toBe(1.2);
            expect(analyzer.getCounselingMultiplier('strong')).toBe(1.1);
            expect(analyzer.getCounselingMultiplier('moderate')).toBe(1.0);
            expect(analyzer.getCounselingMultiplier('challenging')).toBe(0.9);
            expect(analyzer.getCounselingMultiplier('difficult')).toBe(0.8);
            expect(analyzer.getCounselingMultiplier('unknown')).toBe(1.0);
        });

        test('should identify positive aspects', () => {
            expect(analyzer.isPositiveAspect('CONJUNCTION')).toBe(true);
            expect(analyzer.isPositiveAspect('TRINE')).toBe(true);
            expect(analyzer.isPositiveAspect('SEXTILE')).toBe(true);
            expect(analyzer.isPositiveAspect('SQUARE')).toBe(false);
            expect(analyzer.isPositiveAspect('OPPOSITION')).toBe(false);
        });
    });

    describe('Compatibility Rating', () => {
        test('should rate exceptional compatibility', () => {
            const rating = analyzer.getCompatibilityRating(95);
            expect(rating).toBe('Exceptional Soul Mate Potential');
        });

        test('should rate very strong compatibility', () => {
            const rating = analyzer.getCompatibilityRating(85);
            expect(rating).toBe('Very Strong Compatibility');
        });

        test('should rate strong compatibility', () => {
            const rating = analyzer.getCompatibilityRating(75);
            expect(rating).toBe('Strong Compatibility with Growth');
        });

        test('should rate moderate compatibility', () => {
            const rating = analyzer.getCompatibilityRating(60);
            expect(rating).toBe('Moderate Compatibility');
        });

        test('should rate challenging compatibility', () => {
            const rating = analyzer.getCompatibilityRating(50);
            expect(rating).toBe('Challenging but Rewarding');
        });

        test('should rate growth-oriented compatibility', () => {
            const rating = analyzer.getCompatibilityRating(35);
            expect(rating).toBe('Growth-Oriented Relationship');
        });
    });

    describe('Strengths Identification', () => {
        test('should identify exceptional harmonious connections', () => {
            const strengths = analyzer.identifyStrengths();

            expect(Array.isArray(strengths)).toBe(true);
            // Should include strength from excellent aspect
            expect(strengths.some(strength =>
                strength.includes('Exceptional harmonious connections')
            )).toBe(true);
        });

        test('should identify beneficial house placements', () => {
            const strengths = analyzer.identifyStrengths();

            expect(strengths.some(strength =>
                strength.includes('Beneficial house placements')
            )).toBe(true);
        });

        test('should identify harmonious composite aspects', () => {
            const strengths = analyzer.identifyStrengths();

            expect(strengths.some(strength =>
                strength.includes('Harmonious composite chart')
            )).toBe(true);
        });
    });

    describe('Challenges Identification', () => {
        test('should identify multiple challenging aspects', () => {
            const challengingSynastry = {
                ...synastry,
                interAspects: [
                    { aspect: { type: 'SQUARE' }, counseling: { strength: 'challenging' } },
                    { aspect: { type: 'OPPOSITION' }, counseling: { strength: 'challenging' } },
                    { aspect: { type: 'SQUARE' }, counseling: { strength: 'challenging' } },
                    { aspect: { type: 'SQUARE' }, counseling: { strength: 'challenging' } }
                ]
            };

            const testAnalyzer = new CounselingCompatibilityAnalyzer(challengingSynastry, composite);
            const challenges = testAnalyzer.identifyChallenges();

            expect(challenges.some(challenge =>
                challenge.includes('Multiple challenging aspects')
            )).toBe(true);
        });

        test('should identify composite chart challenges', () => {
            const challengingComposite = {
                ...composite,
                aspects: [
                    { aspect: { type: 'SQUARE' }, counseling: { strength: 'difficult' } },
                    { aspect: { type: 'OPPOSITION' }, counseling: { strength: 'difficult' } },
                    { aspect: { type: 'SQUARE' }, counseling: { strength: 'difficult' } }
                ]
            };

            const testAnalyzer = new CounselingCompatibilityAnalyzer(synastry, challengingComposite);
            const challenges = testAnalyzer.identifyChallenges();

            expect(challenges.some(challenge =>
                challenge.includes('composite chart shows areas')
            )).toBe(true);
        });
    });

    describe('Recommendations Generation', () => {
        test('should recommend counseling for low scores', () => {
            const recommendations = analyzer.generateRecommendations(45);

            expect(recommendations.some(rec =>
                rec.advice.includes('couples counseling')
            )).toBe(true);
        });

        test('should recommend check-ins for moderate scores', () => {
            const recommendations = analyzer.generateRecommendations(65);

            expect(recommendations.some(rec =>
                rec.advice.includes('check-ins')
            )).toBe(true);
        });

        test('should recommend maintaining harmony for high scores', () => {
            const recommendations = analyzer.generateRecommendations(85);

            expect(recommendations.some(rec =>
                rec.advice.includes('nurturing')
            )).toBe(true);
        });
    });
});

describe('Relationship Counseling Advisor', () => {
    let advisor;

    beforeEach(() => {
        advisor = new RelationshipCounselingAdvisor();
    });

    describe('Counseling Plan Generation', () => {
        test('should generate comprehensive counseling plan', () => {
            const plan = advisor.generateCounselingPlan(75, 70, 80, 75, 70);

            expect(plan).toHaveProperty('overallAssessment');
            expect(plan).toHaveProperty('modulePlans');
            expect(plan).toHaveProperty('timeline');
            expect(plan).toHaveProperty('professionalReferral');
            expect(plan).toHaveProperty('selfHelp');
        });

        test('should assess overall relationship', () => {
            const assessment = advisor.assessOverallRelationship(85);

            expect(assessment).toHaveProperty('type', 'Exceptional Compatibility');
            expect(assessment).toHaveProperty('description');
            expect(assessment).toHaveProperty('counseling');
        });

        test('should create counseling timeline', () => {
            const timeline = advisor.createCounselingTimeline(75);

            expect(Array.isArray(timeline)).toBe(true);
            expect(timeline.length).toBeGreaterThan(0);

            timeline.forEach(phase => {
                expect(phase).toHaveProperty('phase');
                expect(phase).toHaveProperty('duration');
                expect(phase).toHaveProperty('focus');
            });
        });

        test('should assess professional referral need', () => {
            const referral = advisor.assessProfessionalNeed(45);

            expect(referral).toHaveProperty('recommended', true);
            expect(referral).toHaveProperty('urgency', 'High');
            expect(referral).toHaveProperty('type', 'Couples Counseling');
        });

        test('should generate self-help plan', () => {
            const selfHelp = advisor.generateSelfHelpPlan(75);

            expect(selfHelp).toHaveProperty('books');
            expect(selfHelp).toHaveProperty('exercises');
            expect(selfHelp).toHaveProperty('practices');

            expect(Array.isArray(selfHelp.books)).toBe(true);
            expect(Array.isArray(selfHelp.exercises)).toBe(true);
        });
    });

    describe('Counseling Modules', () => {
        test('should have all required counseling modules', () => {
            expect(advisor.counselingModules).toHaveProperty('communication');
            expect(advisor.counselingModules).toHaveProperty('emotional');
            expect(advisor.counselingModules).toHaveProperty('intimacy');
            expect(advisor.counselingModules).toHaveProperty('conflict');
            expect(advisor.counselingModules).toHaveProperty('growth');
        });

        test('should generate communication module plan', () => {
            const plan = advisor.counselingModules.communication.generatePlan(70, 80, 75, 70);

            expect(plan).toHaveProperty('priority');
            expect(plan).toHaveProperty('plan');
            expect(Array.isArray(plan.plan)).toBe(true);
        });

        test('should generate emotional module plan', () => {
            const plan = advisor.counselingModules.emotional.generatePlan(70, 80, 75, 70);

            expect(plan).toHaveProperty('priority');
            expect(plan).toHaveProperty('plan');
        });

        test('should generate conflict resolution plan', () => {
            const plan = advisor.counselingModules.conflict.generatePlan(50, 60, 55, 50);

            expect(plan.priority).toBe('high');
            expect(plan.plan).toContain('Learn de-escalation techniques');
        });
    });
});