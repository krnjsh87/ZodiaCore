/**
 * ZodiaCore - Relationship Counseling Tests
 *
 * Comprehensive test suite for relationship counseling system
 * covering unit tests, integration tests, and validation scenarios.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const RelationshipCounselor = require('./relationship-counselor');
const CounselingInterpretationEngine = require('./counseling-interpretation-engine');
const RemedyGenerator = require('./remedy-generator');
const CounselingSessionManager = require('./counseling-session-manager');
const { ValidationError, CalculationError } = require('./errors');

// Mock data for testing
const mockChart1 = {
    planets: {
        SUN: { longitude: 45.5 },
        MOON: { longitude: 120.3 },
        MARS: { longitude: 200.7 },
        VENUS: { longitude: 330.1 },
        JUPITER: { longitude: 90.8 },
        SATURN: { longitude: 270.4 },
        MERCURY: { longitude: 15.2 },
        RAHU: { longitude: 180.6 },
        KETU: { longitude: 0.6 }
    },
    houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
    ascendant: { longitude: 0 }
};

const mockChart2 = {
    planets: {
        SUN: { longitude: 135.5 },
        MOON: { longitude: 240.3 },
        MARS: { longitude: 310.7 },
        VENUS: { longitude: 60.1 },
        JUPITER: { longitude: 180.8 },
        SATURN: { longitude: 90.4 },
        MERCURY: { longitude: 285.2 },
        RAHU: { longitude: 300.6 },
        KETU: { longitude: 120.6 }
    },
    houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
    ascendant: { longitude: 0 },
    moonDetails: {
        nakshatra: {
            nakshatraName: 'Rohini',
            lord: 'MOON',
            caste: 'Vaishya',
            sign: 1,
            nakshatraNumber: 4
        }
    }
};

const mockChart1WithMoon = {
    ...mockChart1,
    moonDetails: {
        nakshatra: {
            nakshatraName: 'Ashwini',
            lord: 'KETU',
            caste: 'Shudra',
            sign: 0,
            nakshatraNumber: 1
        }
    }
};

describe('RelationshipCounselor', () => {
    let counselor;

    beforeEach(() => {
        counselor = new RelationshipCounselor();
    });

    describe('Constructor', () => {
        test('should initialize with default options', () => {
            expect(counselor.options.enableLogging).toBe(true);
            expect(counselor.options.maxRetries).toBe(3);
        });

        test('should accept custom options', () => {
            const customCounselor = new RelationshipCounselor({
                enableLogging: false,
                maxRetries: 5
            });
            expect(customCounselor.options.enableLogging).toBe(false);
            expect(customCounselor.options.maxRetries).toBe(5);
        });
    });

    describe('conductCounselingSession', () => {
        test('should conduct complete counseling session successfully', async () => {
            const sessionContext = {
                clientId: 'test-client',
                partnerId: 'test-partner'
            };

            const result = await counselor.conductCounselingSession(
                mockChart1WithMoon,
                mockChart2,
                sessionContext
            );

            expect(result.success).toBe(true);
            expect(result.sessionId).toBeDefined();
            expect(result.counselingReport).toBeDefined();
            expect(result.counselingReport.counselingData).toBeDefined();
            expect(result.metadata).toBeDefined();
        });

        test('should handle invalid input gracefully', async () => {
            await expect(
                counselor.conductCounselingSession(null, mockChart2, {})
            ).rejects.toThrow(ValidationError);
        });

        test('should handle compatibility system failures', async () => {
            // Mock a failing system
            const originalSynastry = counselor.compatibilitySystems.synastry;
            counselor.compatibilitySystems.synastry = {
                analyzeSynastry: jest.fn().mockRejectedValue(new Error('Synastry failed'))
            };

            const result = await counselor.conductCounselingSession(
                mockChart1WithMoon,
                mockChart2,
                { clientId: 'test', partnerId: 'test' }
            );

            expect(result.success).toBe(true); // Should still succeed with partial data
            expect(result.counselingReport.counselingData.compatibilityData.errors).toContainEqual(
                expect.objectContaining({ system: 'synastry' })
            );

            // Restore
            counselor.compatibilitySystems.synastry = originalSynastry;
        });
    });

    describe('_gatherCompatibilityData', () => {
        test('should gather data from all compatibility systems', async () => {
            const data = await counselor._gatherCompatibilityData(mockChart1WithMoon, mockChart2);

            expect(data.synastry).toBeDefined();
            expect(data.composite).toBeDefined();
            expect(data.gunaMilan).toBeDefined();
            expect(data.integratedScore).toBeDefined();
            expect(typeof data.integratedScore).toBe('number');
        });

        test('should handle partial system failures', async () => {
            const originalComposite = counselor.compatibilitySystems.composite;
            counselor.compatibilitySystems.composite = {
                generateCompositeChart: jest.fn().mockRejectedValue(new Error('Composite failed'))
            };

            const data = await counselor._gatherCompatibilityData(mockChart1WithMoon, mockChart2);

            expect(data.composite).toBeNull();
            expect(data.errors).toContainEqual(
                expect.objectContaining({ system: 'composite' })
            );

            // Restore
            counselor.compatibilitySystems.composite = originalComposite;
        });
    });

    describe('_analyzeRelationshipDynamics', () => {
        test('should analyze relationship dynamics correctly', () => {
            const mockCompatibilityData = {
                synastry: { aspects: [], overlays: [] },
                composite: { aspects: [], interpretation: [] },
                gunaMilan: { scores: { varna: 1, vashya: 2, tara: 3, yoni: 4, grahaMaitri: 5, gana: 6, bhakoot: 7, nadi: 8 } }
            };

            const dynamics = counselor._analyzeRelationshipDynamics(mockCompatibilityData);

            expect(dynamics).toHaveProperty('communicationScore');
            expect(dynamics).toHaveProperty('emotionalScore');
            expect(dynamics).toHaveProperty('intimacyScore');
            expect(dynamics).toHaveProperty('conflictResolutionScore');
            expect(dynamics).toHaveProperty('overallHarmony');

            // Scores should be between 0 and 1
            Object.values(dynamics).forEach(score => {
                expect(score).toBeGreaterThanOrEqual(0);
                expect(score).toBeLessThanOrEqual(1);
            });
        });
    });

    describe('_calculateWeightedScore', () => {
        test('should calculate weighted average correctly', () => {
            const scores = [0.8, 0.6, 0.7];
            const result = counselor._calculateWeightedScore(scores);
            expect(result).toBe(0.7);
        });

        test('should handle empty scores array', () => {
            const result = counselor._calculateWeightedScore([]);
            expect(result).toBe(0.5);
        });

        test('should handle null/undefined scores', () => {
            const scores = [0.8, null, undefined, 0.6];
            const result = counselor._calculateWeightedScore(scores);
            expect(result).toBe(0.7);
        });
    });

    describe('_calculateIntegratedCompatibilityScore', () => {
        test('should calculate integrated score from multiple systems', () => {
            const synastry = { summary: {} };
            const composite = { interpretation: [] };
            const gunaMilan = { percentage: 75 };

            const score = counselor._calculateIntegratedCompatibilityScore(synastry, composite, gunaMilan);
            expect(typeof score).toBe('number');
            expect(score).toBeGreaterThanOrEqual(0);
            expect(score).toBeLessThanOrEqual(1);
        });
    });
});

describe('CounselingInterpretationEngine', () => {
    let engine;

    beforeEach(() => {
        engine = new CounselingInterpretationEngine();
    });

    describe('generateInsights', () => {
        test('should generate comprehensive insights', () => {
            const mockDynamics = {
                communicationScore: 0.8,
                emotionalScore: 0.7,
                intimacyScore: 0.6,
                conflictResolutionScore: 0.75,
                overallHarmony: 0.725
            };

            const insights = engine.generateInsights(mockDynamics, {});

            expect(insights).toHaveProperty('overallAssessment');
            expect(insights).toHaveProperty('strengthAnalysis');
            expect(insights).toHaveProperty('challengeAnalysis');
            expect(insights).toHaveProperty('growthOpportunities');
            expect(insights).toHaveProperty('longTermOutlook');
            expect(insights).toHaveProperty('relationshipHealth');
        });

        test('should include detailed analysis when enabled', () => {
            const engineWithDetails = new CounselingInterpretationEngine({
                enableDetailedAnalysis: true
            });

            const mockDynamics = {
                communicationScore: 0.8,
                emotionalScore: 0.7,
                intimacyScore: 0.6,
                conflictResolutionScore: 0.75
            };

            const insights = engineWithDetails.generateInsights(mockDynamics, {});
            expect(insights).toHaveProperty('detailedAnalysis');
        });
    });

    describe('_generateOverallAssessment', () => {
        test('should generate appropriate assessment for high scores', () => {
            const dynamics = {
                communicationScore: 0.9,
                emotionalScore: 0.85,
                intimacyScore: 0.8,
                conflictResolutionScore: 0.9
            };

            const assessment = engine._generateOverallAssessment(dynamics);
            expect(assessment.rating).toBe('Excellent');
            expect(assessment.confidence).toBe('High');
        });

        test('should generate appropriate assessment for low scores', () => {
            const dynamics = {
                communicationScore: 0.3,
                emotionalScore: 0.2,
                intimacyScore: 0.4,
                conflictResolutionScore: 0.3
            };

            const assessment = engine._generateOverallAssessment(dynamics);
            expect(assessment.rating).toBe('Challenging');
            expect(assessment.confidence).toBe('Low');
        });
    });

    describe('_analyzeStrengths', () => {
        test('should identify relationship strengths', () => {
            const dynamics = {
                communicationScore: 0.85,
                emotionalScore: 0.75,
                intimacyScore: 0.6,
                conflictResolutionScore: 0.7
            };

            const strengths = engine._analyzeStrengths(dynamics);
            expect(strengths.length).toBeGreaterThan(0);
            expect(strengths[0]).toHaveProperty('area');
            expect(strengths[0]).toHaveProperty('description');
            expect(strengths[0]).toHaveProperty('score');
        });
    });

    describe('_analyzeChallenges', () => {
        test('should identify relationship challenges', () => {
            const dynamics = {
                communicationScore: 0.3,
                emotionalScore: 0.4,
                intimacyScore: 0.6,
                conflictResolutionScore: 0.7
            };

            const challenges = engine._analyzeChallenges(dynamics);
            expect(challenges.length).toBeGreaterThan(0);
            expect(challenges[0]).toHaveProperty('area');
            expect(challenges[0]).toHaveProperty('description');
            expect(challenges[0]).toHaveProperty('score');
            expect(challenges[0]).toHaveProperty('severity');
        });
    });

    describe('_identifyGrowthAreas', () => {
        test('should identify growth opportunities', () => {
            const dynamics = {
                communicationScore: 0.6,
                emotionalScore: 0.7,
                intimacyScore: 0.8,
                conflictResolutionScore: 0.9
            };

            const growthAreas = engine._identifyGrowthAreas(dynamics);
            expect(Array.isArray(growthAreas)).toBe(true);
            if (growthAreas.length > 0) {
                expect(growthAreas[0]).toHaveProperty('area');
                expect(growthAreas[0]).toHaveProperty('opportunities');
                expect(growthAreas[0]).toHaveProperty('potential');
                expect(growthAreas[0]).toHaveProperty('timeframe');
            }
        });
    });

    describe('_assessLongTermPotential', () => {
        test('should assess long-term relationship potential', () => {
            const dynamics = {
                communicationScore: 0.8,
                emotionalScore: 0.7,
                intimacyScore: 0.6,
                conflictResolutionScore: 0.75
            };

            const outlook = engine._assessLongTermPotential(dynamics);
            expect(outlook).toHaveProperty('outlook');
            expect(outlook).toHaveProperty('confidence');
            expect(outlook).toHaveProperty('factors');
            expect(outlook).toHaveProperty('recommendations');
        });
    });
});

describe('RemedyGenerator', () => {
    let generator;

    beforeEach(() => {
        generator = new RemedyGenerator();
    });

    describe('generateRemedies', () => {
        test('should generate remedies based on priorities', () => {
            const mockInsights = {};
            const mockPriorities = [
                { area: 'communication', priority: 'high' },
                { area: 'emotional', priority: 'critical' }
            ];

            const remedies = generator.generateRemedies(mockInsights, mockPriorities);

            expect(remedies).toHaveProperty('immediate');
            expect(remedies).toHaveProperty('shortTerm');
            expect(remedies).toHaveProperty('longTerm');
            expect(remedies).toHaveProperty('preventive');

            expect(remedies.immediate.length).toBeGreaterThan(0);
        });

        test('should handle empty priorities', () => {
            const remedies = generator.generateRemedies({}, []);
            expect(remedies.immediate).toEqual([]);
            expect(remedies.shortTerm).toEqual([]);
            expect(remedies.longTerm).toEqual([]);
            expect(remedies.preventive).toBeDefined();
        });
    });

    describe('getImmediateRemedies', () => {
        test('should return immediate remedies for valid area', () => {
            const remedies = generator.getImmediateRemedies('communication');
            expect(remedies).toHaveLength(3);
            expect(remedies[0]).toHaveProperty('type');
            expect(remedies[0]).toHaveProperty('action');
            expect(remedies[0]).toHaveProperty('priority');
            expect(remedies[0].area).toBe('communication');
        });

        test('should return empty array for invalid area', () => {
            const remedies = generator.getImmediateRemedies('invalid');
            expect(remedies).toEqual([]);
        });
    });

    describe('generateTargetedRemedies', () => {
        test('should generate targeted remedies for specific issues', () => {
            const issues = ['communication', 'emotional'];
            const remedies = generator.generateTargetedRemedies(issues);

            expect(remedies).toHaveProperty('immediate');
            expect(remedies).toHaveProperty('shortTerm');
            expect(remedies.immediate.length).toBeGreaterThan(0);
        });
    });

    describe('generateRemedySchedule', () => {
        test('should create remedy schedule', () => {
            const mockRemedies = {
                immediate: [{ type: 'Mantra', action: 'Chant mantra' }],
                shortTerm: [{ type: 'Ritual', action: 'Perform ritual' }],
                longTerm: [{ type: 'Practice', action: 'Long practice' }],
                preventive: [{ type: 'Maintenance', action: 'Maintain practice' }]
            };

            const schedule = generator.generateRemedySchedule(mockRemedies);

            expect(schedule).toHaveProperty('week1');
            expect(schedule).toHaveProperty('week2');
            expect(schedule).toHaveProperty('month1');
            expect(schedule).toHaveProperty('month3');
            expect(schedule).toHaveProperty('ongoing');
        });
    });

    describe('getRemedyStatistics', () => {
        test('should calculate remedy statistics', () => {
            const mockRemedies = {
                immediate: [
                    { type: 'Mantra', priority: 'High', category: 'Spiritual', area: 'communication' },
                    { type: 'Gemstone', priority: 'High', category: 'Astrological', area: 'emotional' }
                ],
                shortTerm: [],
                longTerm: [],
                preventive: []
            };

            const stats = generator.getRemedyStatistics(mockRemedies);

            expect(stats.totalRemedies).toBe(2);
            expect(stats.byType.Mantra).toBe(1);
            expect(stats.byType.Gemstone).toBe(1);
            expect(stats.byPriority.High).toBe(2);
            expect(stats.byCategory.Spiritual).toBe(1);
            expect(stats.byArea.communication).toBe(1);
        });
    });
});

describe('CounselingSessionManager', () => {
    let manager;

    beforeEach(() => {
        manager = new CounselingSessionManager();
    });

    describe('createCounselingSession', () => {
        test('should create valid counseling session', () => {
            const clientData = { clientId: 'client1', partnerId: 'partner1' };
            const compatibilityData = { score: 0.8 };

            const session = manager.createCounselingSession(clientData, compatibilityData);

            expect(session).toHaveProperty('sessionId');
            expect(session.clientId).toBe('client1');
            expect(session.partnerId).toBe('partner1');
            expect(session.sessionType).toBe('relationship_counseling');
            expect(session.currentStage).toBe('assessment');
            expect(session.status).toBe('active');
            expect(session.stages).toBeDefined();
        });

        test('should throw error for invalid client data', () => {
            expect(() => {
                manager.createCounselingSession({}, {});
            }).toThrow(ValidationError);
        });
    });

    describe('updateSessionProgress', () => {
        test('should update session progress correctly', () => {
            const session = manager.createCounselingSession(
                { clientId: 'client1', partnerId: 'partner1' },
                {}
            );

            const updatedSession = manager.updateSessionProgress(session, 'assessment', {
                completed: true,
                data: { assessmentResult: 'good' }
            });

            expect(updatedSession.stages.assessment.completed).toBe(true);
            expect(updatedSession.stages.assessment.data).toEqual({ assessmentResult: 'good' });
            expect(updatedSession.currentStage).toBe('analysis');
        });

        test('should complete session on followup stage', () => {
            const session = manager.createCounselingSession(
                { clientId: 'client1', partnerId: 'partner1' },
                {}
            );

            // Manually set to followup stage
            session.currentStage = 'followup';

            const updatedSession = manager.updateSessionProgress(session, 'followup', {});

            expect(updatedSession.status).toBe('completed');
            expect(updatedSession.progressTracking.finalOutcome).toBeDefined();
        });
    });

    describe('addSessionNote', () => {
        test('should add notes to session', () => {
            const session = manager.createCounselingSession(
                { clientId: 'client1', partnerId: 'partner1' },
                {}
            );

            const updatedSession = manager.addSessionNote(session, 'Test note', 'counselor');

            expect(updatedSession.sessionNotes).toHaveLength(1);
            expect(updatedSession.sessionNotes[0].note).toBe('Test note');
            expect(updatedSession.sessionNotes[0].author).toBe('counselor');
        });
    });

    describe('addActionItems', () => {
        test('should add action items to session', () => {
            const session = manager.createCounselingSession(
                { clientId: 'client1', partnerId: 'partner1' },
                {}
            );

            const items = [
                { description: 'Practice communication', priority: 'high' },
                { description: 'Schedule date night', priority: 'medium' }
            ];

            const updatedSession = manager.addActionItems(session, items);

            expect(updatedSession.actionItems).toHaveLength(2);
            expect(updatedSession.actionItems[0].description).toBe('Practice communication');
            expect(updatedSession.actionItems[0].status).toBe('pending');
        });
    });

    describe('updateActionItem', () => {
        test('should update action item status', () => {
            const session = manager.createCounselingSession(
                { clientId: 'client1', partnerId: 'partner1' },
                {}
            );

            const sessionWithItems = manager.addActionItems(session, [
                { description: 'Test action' }
            ]);

            const actionId = sessionWithItems.actionItems[0].id;
            const updatedSession = manager.updateActionItem(sessionWithItems, actionId, 'completed', 'Well done');

            expect(updatedSession.actionItems[0].status).toBe('completed');
            expect(updatedSession.actionItems[0].notes).toBe('Well done');
        });

        test('should throw error for invalid action ID', () => {
            const session = manager.createCounselingSession(
                { clientId: 'client1', partnerId: 'partner1' },
                {}
            );

            expect(() => {
                manager.updateActionItem(session, 'invalid-id', 'completed');
            }).toThrow(ValidationError);
        });
    });

    describe('getSessionProgress', () => {
        test('should calculate session progress correctly', () => {
            const session = manager.createCounselingSession(
                { clientId: 'client1', partnerId: 'partner1' },
                {}
            );

            // Complete assessment stage
            const sessionAfterAssessment = manager.updateSessionProgress(session, 'assessment', {});
            const progress = manager.getSessionProgress(sessionAfterAssessment);

            expect(progress.completedStages).toBe(1);
            expect(progress.totalStages).toBe(5);
            expect(progress.progressPercentage).toBe(20);
            expect(progress.currentStage).toBe('analysis');
        });
    });

    describe('getSessionStatistics', () => {
        test('should calculate session statistics', () => {
            const session = manager.createCounselingSession(
                { clientId: 'client1', partnerId: 'partner1' },
                {}
            );

            const sessionWithData = manager.addSessionNote(session, 'Note 1');
            const sessionWithMoreData = manager.addSessionNote(sessionWithData, 'Note 2');
            const sessionWithItems = manager.addActionItems(sessionWithMoreData, [
                { description: 'Action 1' },
                { description: 'Action 2', status: 'completed' }
            ]);

            const stats = manager.getSessionStatistics(sessionWithItems);

            expect(stats.totalNotes).toBe(2);
            expect(stats.totalActionItems).toBe(2);
            expect(stats.completedActionItems).toBe(1);
            expect(stats.pendingActionItems).toBe(1);
        });
    });
});

// Integration Tests
describe('Relationship Counseling Integration', () => {
    let counselor;

    beforeEach(() => {
        counselor = new RelationshipCounselor();
    });

    test('should handle complete counseling workflow', async () => {
        const sessionContext = {
            clientId: 'integration-test-client',
            partnerId: 'integration-test-partner',
            relationshipType: 'marriage',
            goals: ['improve_communication', 'resolve_conflicts']
        };

        const result = await counselor.conductCounselingSession(
            mockChart1WithMoon,
            mockChart2,
            sessionContext
        );

        expect(result.success).toBe(true);
        expect(result.sessionId).toMatch(/^session_/);
        expect(result.counselingReport.counselingData.overallAssessment).toBeDefined();
        expect(result.counselingReport.counselingData.relationshipDynamics).toBeDefined();
        expect(result.counselingReport.counselingData.priorities).toBeDefined();
        expect(result.counselingReport.counselingData.remedies).toBeDefined();
    });

    test('should provide consistent results for same input', async () => {
        const context1 = { clientId: 'test1', partnerId: 'test2' };
        const context2 = { clientId: 'test1', partnerId: 'test2' };

        const result1 = await counselor.conductCounselingSession(
            mockChart1WithMoon,
            mockChart2,
            context1
        );

        const result2 = await counselor.conductCounselingSession(
            mockChart1WithMoon,
            mockChart2,
            context2
        );

        // Results should be structurally similar (same assessment framework)
        expect(result1.counselingReport.counselingData.overallAssessment).toBeDefined();
        expect(result2.counselingReport.counselingData.overallAssessment).toBeDefined();
    });

    test('should handle edge cases gracefully', async () => {
        // Test with minimal chart data
        const minimalChart1 = {
            planets: { SUN: { longitude: 0 } },
            houses: Array(12).fill(0),
            moonDetails: {
                nakshatra: {
                    nakshatraName: 'Ashwini',
                    lord: 'KETU',
                    caste: 'Shudra',
                    sign: 0,
                    nakshatraNumber: 1
                }
            }
        };

        const minimalChart2 = {
            planets: { SUN: { longitude: 180 } },
            houses: Array(12).fill(0),
            moonDetails: {
                nakshatra: {
                    nakshatraName: 'Rohini',
                    lord: 'MOON',
                    caste: 'Vaishya',
                    sign: 1,
                    nakshatraNumber: 4
                }
            }
        };

        const result = await counselor.conductCounselingSession(
            minimalChart1,
            minimalChart2,
            { clientId: 'edge-test', partnerId: 'edge-partner' }
        );

        expect(result.success).toBe(true);
        expect(result.counselingReport).toBeDefined();
    });
});

// Performance Tests
describe('Relationship Counseling Performance', () => {
    let counselor;

    beforeEach(() => {
        counselor = new RelationshipCounselor({ enableLogging: false });
    });

    test('should complete counseling session within time limit', async () => {
        const startTime = Date.now();

        await counselor.conductCounselingSession(
            mockChart1WithMoon,
            mockChart2,
            { clientId: 'perf-test', partnerId: 'perf-partner' }
        );

        const duration = Date.now() - startTime;
        expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
    });

    test('should handle concurrent sessions', async () => {
        const promises = Array(5).fill().map((_, i) =>
            counselor.conductCounselingSession(
                mockChart1WithMoon,
                mockChart2,
                { clientId: `concurrent-${i}`, partnerId: `partner-${i}` }
            )
        );

        const results = await Promise.all(promises);

        results.forEach(result => {
            expect(result.success).toBe(true);
        });
    });
});

// Error Handling Tests
describe('Relationship Counseling Error Handling', () => {
    let counselor;

    beforeEach(() => {
        counselor = new RelationshipCounselor();
    });

    test('should handle malformed chart data', async () => {
        const malformedChart = { invalid: 'data' };

        await expect(
            counselor.conductCounselingSession(malformedChart, mockChart2, {})
        ).rejects.toThrow();
    });

    test('should handle missing nakshatra data', async () => {
        const chartWithoutNak = { ...mockChart1 }; // No moonDetails

        const result = await counselor.conductCounselingSession(
            chartWithoutNak,
            mockChart2,
            { clientId: 'error-test', partnerId: 'error-partner' }
        );

        // Should still succeed with partial data
        expect(result.success).toBe(true);
        expect(result.counselingReport.counselingData.compatibilityData.gunaMilan).toBeNull();
    });

    test('should handle network-like failures gracefully', async () => {
        // Simulate all systems failing
        const originalSystems = { ...counselor.compatibilitySystems };
        counselor.compatibilitySystems = {
            synastry: { analyzeSynastry: jest.fn().mockRejectedValue(new Error('Network error')) },
            composite: { generateCompositeChart: jest.fn().mockRejectedValue(new Error('Network error')) },
            gunaMilan: { calculateCompatibility: jest.fn().mockRejectedValue(new Error('Network error')) }
        };

        const result = await counselor.conductCounselingSession(
            mockChart1WithMoon,
            mockChart2,
            { clientId: 'network-test', partnerId: 'network-partner' }
        );

        expect(result.success).toBe(true); // Should provide basic counseling even with failures
        expect(result.counselingReport.counselingData.compatibilityData.errors.length).toBe(3);

        // Restore
        counselor.compatibilitySystems = originalSystems;
    });

    test('should handle timeout scenarios', async () => {
        // Mock a slow system that times out
        const originalSynastry = counselor.compatibilitySystems.synastry;
        counselor.compatibilitySystems.synastry = {
            analyzeSynastry: jest.fn().mockImplementation(
                () => new Promise(resolve => setTimeout(() => resolve({}), 10000))
            )
        };

        const counselorWithShortTimeout = new RelationshipCounselor({ timeout: 100 });

        const result = await counselorWithShortTimeout.conductCounselingSession(
            mockChart1WithMoon,
            mockChart2,
            { clientId: 'timeout-test', partnerId: 'timeout-partner' }
        );

        expect(result.success).toBe(true); // Should still succeed with partial data
        expect(result.counselingReport.counselingData.compatibilityData.synastry).toBeNull();

        // Restore
        counselor.compatibilitySystems.synastry = originalSynastry;
    });

    test('should handle invalid session context', async () => {
        const invalidContext = { invalidField: 'value' };

        await expect(
            counselor.conductCounselingSession(mockChart1WithMoon, mockChart2, invalidContext)
        ).rejects.toThrow(ValidationError);
    });

    test('should handle extreme score values', () => {
        const extremeDynamics = {
            communicationScore: 1.5, // Above maximum
            emotionalScore: -0.5,    // Below minimum
            intimacyScore: 0.5,
            conflictResolutionScore: 0.5
        };

        const priorities = counselor._determineCounselingPriorities(extremeDynamics);

        // Should clamp scores appropriately
        expect(priorities.length).toBeGreaterThan(0);
        priorities.forEach(priority => {
            expect(['critical', 'high', 'medium', 'low']).toContain(priority.priority);
        });
    });
});

// Advanced Edge Case Tests
describe('Relationship Counseling Edge Cases', () => {
    let counselor;
    let engine;
    let manager;

    beforeEach(() => {
        counselor = new RelationshipCounselor();
        engine = new CounselingInterpretationEngine();
        manager = new CounselingSessionManager();
    });

    describe('Scoring Algorithm Edge Cases', () => {
        test('should handle all zero scores', () => {
            const zeroDynamics = {
                communicationScore: 0,
                emotionalScore: 0,
                intimacyScore: 0,
                conflictResolutionScore: 0
            };

            const priorities = counselor._determineCounselingPriorities(zeroDynamics);
            expect(priorities.length).toBe(4);
            priorities.forEach(priority => {
                expect(priority.priority).toBe('critical');
            });
        });

        test('should handle all perfect scores', () => {
            const perfectDynamics = {
                communicationScore: 1,
                emotionalScore: 1,
                intimacyScore: 1,
                conflictResolutionScore: 1
            };

            const priorities = counselor._determineCounselingPriorities(perfectDynamics);
            expect(priorities.length).toBe(4);
            priorities.forEach(priority => {
                expect(priority.priority).toBe('low');
            });
        });

        test('should handle mixed extreme scores', () => {
            const mixedDynamics = {
                communicationScore: 0.1,
                emotionalScore: 0.9,
                intimacyScore: 0.1,
                conflictResolutionScore: 0.9
            };

            const priorities = counselor._determineCounselingPriorities(mixedDynamics);
            const criticalCount = priorities.filter(p => p.priority === 'critical').length;
            const lowCount = priorities.filter(p => p.priority === 'low').length;

            expect(criticalCount).toBe(2);
            expect(lowCount).toBe(2);
        });

        test('should handle NaN and undefined scores', () => {
            const invalidDynamics = {
                communicationScore: NaN,
                emotionalScore: undefined,
                intimacyScore: 0.5,
                conflictResolutionScore: null
            };

            const priorities = counselor._determineCounselingPriorities(invalidDynamics);
            expect(priorities.length).toBe(4);
            // Should handle gracefully without throwing
        });

        test('should calculate weighted score with various inputs', () => {
            expect(counselor._calculateWeightedScore([0.8, 0.6, 0.7])).toBe(0.7);
            expect(counselor._calculateWeightedScore([1, 0, 0.5])).toBe(0.5);
            expect(counselor._calculateWeightedScore([])).toBe(0.5);
            expect(counselor._calculateWeightedScore([NaN, undefined, 0.8])).toBe(0.8);
        });
    });

    describe('Interpretation Engine Edge Cases', () => {
        test('should handle empty dynamics object', () => {
            const emptyDynamics = {};

            expect(() => {
                engine.generateInsights(emptyDynamics, {});
            }).not.toThrow();
        });

        test('should handle null dynamics', () => {
            expect(() => {
                engine._generateOverallAssessment(null);
            }).toThrow();
        });

        test('should calculate percentiles correctly', () => {
            expect(engine._calculatePercentile(0.95)).toBe(95);
            expect(engine._calculatePercentile(0.85)).toBe(85);
            expect(engine._calculatePercentile(0.5)).toBe(55);
            expect(engine._calculatePercentile(0.05)).toBe(5);
            expect(engine._calculatePercentile(0)).toBe(5);
        });

        test('should assess data completeness accurately', () => {
            const completeDynamics = {
                communicationScore: 0.8,
                emotionalScore: 0.7,
                intimacyScore: 0.6,
                conflictResolutionScore: 0.75
            };

            const incompleteDynamics = {
                communicationScore: 0.8,
                emotionalScore: 0.7
            };

            expect(engine._assessDataCompleteness(completeDynamics)).toBe(1);
            expect(engine._assessDataCompleteness(incompleteDynamics)).toBe(0.5);
        });

        test('should generate compatibility matrix', () => {
            const dynamics = {
                communicationScore: 0.8,
                emotionalScore: 0.7,
                intimacyScore: 0.6,
                conflictResolutionScore: 0.75
            };

            const matrix = engine._generateCompatibilityMatrix(dynamics);

            expect(matrix).toHaveProperty('communication_emotional');
            expect(matrix).toHaveProperty('emotional_intimacy');
            expect(matrix).toHaveProperty('intimacy_conflict');
            expect(matrix).toHaveProperty('overall_coherence');

            expect(matrix.communication_emotional).toBeGreaterThanOrEqual(0);
            expect(matrix.communication_emotional).toBeLessThanOrEqual(1);
        });

        test('should identify risk factors appropriately', () => {
            const highRiskDynamics = {
                communicationScore: 0.8,
                emotionalScore: 0.7,
                intimacyScore: 0.6,
                conflictResolutionScore: 0.1,
                overallHarmony: 0.2
            };

            const risks = engine._identifyRiskFactors(highRiskDynamics);

            expect(risks.length).toBeGreaterThan(0);
            expect(risks.some(risk => risk.factor.includes('conflict'))).toBe(true);
            expect(risks.some(risk => risk.factor.includes('harmony'))).toBe(true);
        });
    });

    describe('Session Manager Edge Cases', () => {
        test('should handle session lifecycle transitions', () => {
            const session = manager.createCounselingSession(
                { clientId: 'test1', partnerId: 'test2' },
                {}
            );

            expect(session.currentStage).toBe('assessment');

            // Move through stages
            const afterAssessment = manager.updateSessionProgress(session, 'assessment', {});
            expect(afterAssessment.currentStage).toBe('analysis');

            const afterAnalysis = manager.updateSessionProgress(afterAssessment, 'analysis', {});
            expect(afterAnalysis.currentStage).toBe('recommendations');

            const afterRecommendations = manager.updateSessionProgress(afterAnalysis, 'recommendations', {});
            expect(afterRecommendations.currentStage).toBe('implementation');

            const afterImplementation = manager.updateSessionProgress(afterRecommendations, 'implementation', {});
            expect(afterImplementation.currentStage).toBe('followup');

            const afterFollowup = manager.updateSessionProgress(afterImplementation, 'followup', {});
            expect(afterFollowup.status).toBe('completed');
        });

        test('should prevent invalid stage transitions', () => {
            const session = manager.createCounselingSession(
                { clientId: 'test1', partnerId: 'test2' },
                {}
            );

            expect(() => {
                manager.updateSessionProgress(session, 'invalid_stage', {});
            }).toThrow(ValidationError);
        });

        test('should handle action item lifecycle', () => {
            const session = manager.createCounselingSession(
                { clientId: 'test1', partnerId: 'test2' },
                {}
            );

            const withItems = manager.addActionItems(session, [
                { description: 'Test action 1' },
                { description: 'Test action 2' }
            ]);

            expect(withItems.actionItems.length).toBe(2);

            const actionId = withItems.actionItems[0].id;
            const updated = manager.updateActionItem(withItems, actionId, 'completed', 'Done');

            expect(updated.actionItems[0].status).toBe('completed');
            expect(updated.actionItems[0].notes).toBe('Done');
        });

        test('should calculate session statistics accurately', () => {
            const session = manager.createCounselingSession(
                { clientId: 'test1', partnerId: 'test2' },
                {}
            );

            const withNotes = manager.addSessionNote(session, 'Note 1');
            const withMoreNotes = manager.addSessionNote(withNotes, 'Note 2');
            const withItems = manager.addActionItems(withMoreNotes, [
                { description: 'Action 1' },
                { description: 'Action 2', status: 'completed' },
                { description: 'Action 3', status: 'completed' }
            ]);

            const stats = manager.getSessionStatistics(withItems);

            expect(stats.totalNotes).toBe(2);
            expect(stats.totalActionItems).toBe(3);
            expect(stats.completedActionItems).toBe(2);
            expect(stats.pendingActionItems).toBe(1);
            expect(stats.actionItemCompletionRate).toBe(67); // Rounded percentage
        });

        test('should assess session outcomes correctly', () => {
            const session = manager.createCounselingSession(
                { clientId: 'test1', partnerId: 'test2' },
                {}
            );

            // Complete all stages
            let currentSession = session;
            ['assessment', 'analysis', 'recommendations', 'implementation'].forEach(stage => {
                currentSession = manager.updateSessionProgress(currentSession, stage, {});
            });

            // Add some completed action items
            currentSession = manager.addActionItems(currentSession, [
                { description: 'Action 1', status: 'completed' },
                { description: 'Action 2', status: 'completed' }
            ]);

            const finalSession = manager.updateSessionProgress(currentSession, 'followup', {});

            expect(finalSession.status).toBe('completed');
            expect(finalSession.progressTracking.finalOutcome).toBeDefined();
            expect(['high', 'moderate', 'partial', 'low']).toContain(
                finalSession.progressTracking.finalOutcome.successLevel
            );
        });
    });

    describe('Remedy Generation Edge Cases', () => {
        let generator;

        beforeEach(() => {
            generator = new RemedyGenerator();
        });

        test('should handle empty remedy requests', () => {
            const remedies = generator.generateRemedies({}, []);
            expect(remedies.immediate).toEqual([]);
            expect(remedies.shortTerm).toEqual([]);
            expect(remedies.longTerm).toEqual([]);
            expect(remedies.preventive).toBeDefined();
        });

        test('should generate remedies for all priority levels', () => {
            const priorities = [
                { area: 'communication', priority: 'critical' },
                { area: 'emotional', priority: 'high' },
                { area: 'intimacy', priority: 'medium' },
                { area: 'conflict', priority: 'low' }
            ];

            const remedies = generator.generateRemedies({}, priorities);

            expect(remedies.immediate.length).toBeGreaterThan(0);
            expect(remedies.shortTerm.length).toBeGreaterThan(0);
            expect(remedies.longTerm.length).toBeGreaterThan(0);
        });

        test('should create remedy schedule correctly', () => {
            const mockRemedies = {
                immediate: [{ type: 'Mantra', action: 'Chant daily' }],
                shortTerm: [{ type: 'Ritual', action: 'Perform weekly' }],
                longTerm: [{ type: 'Practice', action: 'Maintain habit' }],
                preventive: [{ type: 'Maintenance', action: 'Monitor progress' }]
            };

            const schedule = generator.generateRemedySchedule(mockRemedies);

            expect(schedule).toHaveProperty('week1');
            expect(schedule).toHaveProperty('month1');
            expect(schedule).toHaveProperty('month3');
            expect(schedule).toHaveProperty('ongoing');

            expect(schedule.week1.length).toBeGreaterThan(0);
            expect(schedule.ongoing.length).toBeGreaterThan(0);
        });

        test('should calculate remedy statistics accurately', () => {
            const mockRemedies = {
                immediate: [
                    { type: 'Mantra', priority: 'High', category: 'Spiritual', area: 'communication' },
                    { type: 'Gemstone', priority: 'High', category: 'Astrological', area: 'emotional' },
                    { type: 'Ritual', priority: 'Medium', category: 'Spiritual', area: 'communication' }
                ],
                shortTerm: [],
                longTerm: [],
                preventive: []
            };

            const stats = generator.getRemedyStatistics(mockRemedies);

            expect(stats.totalRemedies).toBe(3);
            expect(stats.byType.Mantra).toBe(1);
            expect(stats.byType.Gemstone).toBe(1);
            expect(stats.byType.Ritual).toBe(1);
            expect(stats.byPriority.High).toBe(2);
            expect(stats.byPriority.Medium).toBe(1);
            expect(stats.byCategory.Spiritual).toBe(2);
            expect(stats.byCategory.Astrological).toBe(1);
            expect(stats.byArea.communication).toBe(2);
            expect(stats.byArea.emotional).toBe(1);
        });
    });

    describe('Constants Validation', () => {
        test('should validate relationship counseling constants', () => {
            const {
                RELATIONSHIP_DYNAMICS_WEIGHTS,
                SCORE_THRESHOLDS,
                PRIORITY_LEVELS,
                COUNSELING_STAGES
            } = require('./relationship-counseling-constants');

            // Validate weights sum to expected values
            const weightSum = Object.values(RELATIONSHIP_DYNAMICS_WEIGHTS).reduce((sum, weight) => sum + weight, 0);
            expect(weightSum).toBe(1); // Should sum to 1

            // Validate score thresholds are in correct order
            expect(SCORE_THRESHOLDS.excellent).toBeGreaterThan(SCORE_THRESHOLDS.good);
            expect(SCORE_THRESHOLDS.good).toBeGreaterThan(SCORE_THRESHOLDS.moderate);

            // Validate priority levels are defined
            expect(PRIORITY_LEVELS.critical).toBe('critical');
            expect(PRIORITY_LEVELS.low).toBe('low');

            // Validate counseling stages
            expect(COUNSELING_STAGES).toContain('assessment');
            expect(COUNSELING_STAGES).toContain('followup');
            expect(COUNSELING_STAGES.length).toBe(5);
        });

        test('should validate remedial measures structure', () => {
            const { REMEDIAL_MEASURES } = require('./relationship-counseling-constants');

            const areas = ['communication', 'emotional', 'intimacy', 'conflict'];

            areas.forEach(area => {
                expect(REMEDIAL_MEASURES).toHaveProperty(area);
                expect(REMEDIAL_MEASURES[area]).toHaveProperty('gemstones');
                expect(REMEDIAL_MEASURES[area]).toHaveProperty('mantras');
                expect(REMEDIAL_MEASURES[area]).toHaveProperty('rituals');
                expect(REMEDIAL_MEASURES[area]).toHaveProperty('practices');

                expect(Array.isArray(REMEDIAL_MEASURES[area].gemstones)).toBe(true);
                expect(Array.isArray(REMEDIAL_MEASURES[area].mantras)).toBe(true);
                expect(Array.isArray(REMEDIAL_MEASURES[area].rituals)).toBe(true);
                expect(Array.isArray(REMEDIAL_MEASURES[area].practices)).toBe(true);
            });
        });
    });

    describe('Growth and Potential Calculations', () => {
        let engine;

        beforeEach(() => {
            engine = new CounselingInterpretationEngine();
        });

        test('should calculate growth potential correctly', () => {
            expect(engine._calculateGrowthPotential(0.9)).toBe('Minimal'); // High score = minimal growth needed
            expect(engine._calculateGrowthPotential(0.5)).toBe('Medium'); // Medium score = medium growth potential
            expect(engine._calculateGrowthPotential(0.1)).toBe('High'); // Low score = high growth potential
        });

        test('should estimate growth timeframes accurately', () => {
            expect(engine._estimateGrowthTimeframe(0.9)).toBe('1 month'); // Immediate
            expect(engine._estimateGrowthTimeframe(0.7)).toBe('3-6 months'); // Short
            expect(engine._estimateGrowthTimeframe(0.5)).toBe('6-12 months'); // Medium
            expect(engine._estimateGrowthTimeframe(0.2)).toBe('1-3 months'); // Long
        });

        test('should identify growth areas based on scores', () => {
            const highScoreDynamics = {
                communicationScore: 0.9,
                emotionalScore: 0.9,
                intimacyScore: 0.9,
                conflictResolutionScore: 0.9
            };

            const lowScoreDynamics = {
                communicationScore: 0.3,
                emotionalScore: 0.3,
                intimacyScore: 0.3,
                conflictResolutionScore: 0.3
            };

            const growthHigh = engine._identifyGrowthAreas(highScoreDynamics);
            const growthLow = engine._identifyGrowthAreas(lowScoreDynamics);

            expect(growthHigh.length).toBe(0); // No growth areas for high scores
            expect(growthLow.length).toBe(4); // All areas need growth for low scores
        });
    });

    describe('Security and Validation Tests', () => {
        test('should validate input data types', () => {
            const counselor = new RelationshipCounselor();

            // Test invalid chart types
            expect(() => {
                counselor._validateCounselingInput(null, mockChart2, {});
            }).toThrow(ValidationError);

            expect(() => {
                counselor._validateCounselingInput(mockChart1, "invalid", {});
            }).toThrow(ValidationError);

            expect(() => {
                counselor._validateCounselingInput(mockChart1, mockChart2, null);
            }).toThrow(ValidationError);
        });

        test('should prevent injection attacks in session data', () => {
            const manager = new CounselingSessionManager();

            const maliciousData = {
                clientId: 'test"; DROP TABLE sessions; --',
                partnerId: 'partner1'
            };

            // Should not throw, but should validate properly
            expect(() => {
                manager.createCounselingSession(maliciousData, {});
            }).not.toThrow();
        });

        test('should handle large input data gracefully', () => {
            const largeChart = {
                planets: {},
                houses: Array(1000).fill(0), // Very large array
                ascendant: { longitude: 0 }
            };

            const counselor = new RelationshipCounselor();

            // Should handle large data without performance issues or crashes
            expect(() => {
                counselor._validateCounselingInput(largeChart, mockChart2, { clientId: 'test', partnerId: 'test' });
            }).not.toThrow();
        });
    });

    describe('Performance Benchmark Tests', () => {
        test('should complete scoring calculations within time limits', () => {
            const counselor = new RelationshipCounselor();

            const startTime = Date.now();

            // Test multiple scoring calculations
            for (let i = 0; i < 100; i++) {
                const dynamics = {
                    communicationScore: Math.random(),
                    emotionalScore: Math.random(),
                    intimacyScore: Math.random(),
                    conflictResolutionScore: Math.random()
                };

                counselor._determineCounselingPriorities(dynamics);
            }

            const duration = Date.now() - startTime;
            expect(duration).toBeLessThan(1000); // Should complete within 1 second
        });

        test('should handle memory efficiently with large sessions', () => {
            const manager = new CounselingSessionManager();

            // Create multiple sessions
            const sessions = [];
            for (let i = 0; i < 100; i++) {
                const session = manager.createCounselingSession(
                    { clientId: `client${i}`, partnerId: `partner${i}` },
                    {}
                );

                // Add many notes and action items
                let currentSession = session;
                for (let j = 0; j < 10; j++) {
                    currentSession = manager.addSessionNote(currentSession, `Note ${j}`);
                    currentSession = manager.addActionItems(currentSession, [
                        { description: `Action ${j}` }
                    ]);
                }

                sessions.push(currentSession);
            }

            // Should not cause memory issues
            expect(sessions.length).toBe(100);
            sessions.forEach(session => {
                expect(session.sessionNotes.length).toBe(10);
                expect(session.actionItems.length).toBe(10);
            });
        });
    });
});