/**
 * ZodiaCore - ZC1.22 Counseling API Integration Tests
 *
 * Comprehensive integration tests for ZC122CounselingAPI
 * Tests API endpoints, error handling, performance, and data flow
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 */

const ZC122CounselingAPI = require('./zc1-22-counseling-api');

describe('ZC122CounselingAPI - Integration Tests', () => {
    // Mock data for testing
    const mockBirthChart = {
        planets: {
            SUN: { house: 5, sign: 4, longitude: 120.5 },
            MOON: { house: 7, sign: 3, longitude: 95.2 },
            MARS: { house: 1, sign: 0, longitude: 15.8 },
            MERCURY: { house: 4, sign: 2, longitude: 75.3 },
            JUPITER: { house: 9, sign: 8, longitude: 248.1 },
            VENUS: { house: 3, sign: 1, longitude: 45.7 },
            SATURN: { house: 10, sign: 9, longitude: 301.4 },
            RAHU: { house: 11, sign: 0, longitude: 23.1 },
            KETU: { house: 5, sign: 6, longitude: 203.1 }
        },
        ascendant: { sign: 0, longitude: 0 },
        moonNakshatra: { nakshatra: 1, pada: 1 },
        birthDate: new Date('1990-01-01')
    };

    const currentDate = new Date('2024-01-01');

    // Test API instance
    let api;

    beforeEach(() => {
        api = new ZC122CounselingAPI();
    });

    afterEach(() => {
        // Clear analyses map after each test
        api.analyses.clear();
    });

    describe('Career Timing Analysis Integration', () => {
        test('should perform complete career timing analysis', async () => {
            const request = {
                birthChart: mockBirthChart,
                currentDate: currentDate.toISOString(),
                analysisType: 'comprehensive'
            };

            const result = await api.analyzeCareerTiming(request);

            expect(result).toHaveProperty('analysisId');
            expect(result).toHaveProperty('timestamp');
            expect(result).toHaveProperty('type', 'career');
            expect(result).toHaveProperty('career');
            expect(result).toHaveProperty('overallScore');
            expect(result).toHaveProperty('luckyPeriods');
            expect(result).toHaveProperty('remedies');
            expect(result).toHaveProperty('success', true);

            // Verify analysis is stored
            expect(api.analyses.has(result.analysisId)).toBe(true);
        });

        test('should handle career analysis with default parameters', async () => {
            const request = { birthChart: mockBirthChart };

            const result = await api.analyzeCareerTiming(request);

            expect(result.success).toBe(true);
            expect(result.type).toBe('career');
            expect(typeof result.overallScore).toBe('number');
        });

        test('should reject career analysis without birth chart', async () => {
            const request = { currentDate: currentDate.toISOString() };

            await expect(api.analyzeCareerTiming(request)).rejects.toThrow('Birth chart is required');
        });

        test('should generate career remedies based on analysis', async () => {
            const request = { birthChart: mockBirthChart };

            const result = await api.analyzeCareerTiming(request);

            expect(result.remedies).toHaveProperty('immediate');
            expect(result.remedies).toHaveProperty('shortTerm');
            expect(result.remedies).toHaveProperty('longTerm');
            expect(result.remedies).toHaveProperty('preventive');

            expect(Array.isArray(result.remedies.immediate)).toBe(true);
            expect(Array.isArray(result.remedies.shortTerm)).toBe(true);
        });
    });

    describe('Financial Prosperity Analysis Integration', () => {
        test('should perform complete financial prosperity analysis', async () => {
            const request = {
                birthChart: mockBirthChart,
                currentDate: currentDate.toISOString()
            };

            const result = await api.analyzeFinancialProsperity(request);

            expect(result).toHaveProperty('analysisId');
            expect(result).toHaveProperty('type', 'finance');
            expect(result).toHaveProperty('finance');
            expect(result).toHaveProperty('overallScore');
            expect(result).toHaveProperty('luckyPeriods');
            expect(result).toHaveProperty('remedies');
            expect(result).toHaveProperty('success', true);

            // Verify analysis is stored
            expect(api.analyses.has(result.analysisId)).toBe(true);
        });

        test('should generate financial remedies', async () => {
            const request = { birthChart: mockBirthChart };

            const result = await api.analyzeFinancialProsperity(request);

            expect(result.remedies).toHaveProperty('immediate');
            expect(result.remedies.immediate.length).toBeGreaterThan(0);
            expect(result.remedies.immediate[0]).toHaveProperty('type');
            expect(result.remedies.immediate[0]).toHaveProperty('action');
            expect(result.remedies.immediate[0]).toHaveProperty('area', 'finance');
        });

        test('should reject financial analysis without birth chart', async () => {
            const request = {};

            await expect(api.analyzeFinancialProsperity(request)).rejects.toThrow('Birth chart is required');
        });
    });

    describe('Business Success Analysis Integration', () => {
        test('should perform complete business success analysis', async () => {
            const request = {
                birthChart: mockBirthChart,
                currentDate: currentDate.toISOString()
            };

            const result = await api.analyzeBusinessSuccess(request);

            expect(result).toHaveProperty('analysisId');
            expect(result).toHaveProperty('type', 'business');
            expect(result).toHaveProperty('business');
            expect(result).toHaveProperty('overallScore');
            expect(result).toHaveProperty('luckyPeriods');
            expect(result).toHaveProperty('remedies');
            expect(result).toHaveProperty('success', true);

            // Verify analysis is stored
            expect(api.analyses.has(result.analysisId)).toBe(true);
        });

        test('should generate business remedies', async () => {
            const request = { birthChart: mockBirthChart };

            const result = await api.analyzeBusinessSuccess(request);

            expect(result.remedies).toHaveProperty('immediate');
            expect(result.remedies.immediate[0]).toHaveProperty('area', 'business');
            expect(result.remedies.immediate[0].action).toContain('Ganapataye');
        });

        test('should reject business analysis without birth chart', async () => {
            const request = { currentDate: currentDate.toISOString() };

            await expect(api.analyzeBusinessSuccess(request)).rejects.toThrow('Birth chart is required');
        });
    });

    describe('Medical Counseling Integration', () => {
        test('should perform complete medical counseling analysis', async () => {
            const request = {
                birthChart: mockBirthChart,
                currentDate: currentDate.toISOString(),
                healthConcerns: ['chronic_pain', 'mental_health']
            };

            const result = await api.provideMedicalCounseling(request);

            expect(result).toHaveProperty('analysisId');
            expect(result).toHaveProperty('type', 'medical');
            expect(result).toHaveProperty('medical');
            expect(result).toHaveProperty('overallScore');
            expect(result).toHaveProperty('luckyPeriods');
            expect(result).toHaveProperty('remedies');
            expect(result).toHaveProperty('success', true);

            // Verify analysis is stored
            expect(api.analyses.has(result.analysisId)).toBe(true);
        });

        test('should handle medical counseling with empty health concerns', async () => {
            const request = {
                birthChart: mockBirthChart,
                currentDate: currentDate.toISOString(),
                healthConcerns: []
            };

            const result = await api.provideMedicalCounseling(request);

            expect(result.success).toBe(true);
            expect(result.type).toBe('medical');
        });

        test('should generate medical remedies', async () => {
            const request = { birthChart: mockBirthChart };

            const result = await api.provideMedicalCounseling(request);

            expect(result.remedies).toHaveProperty('immediate');
            expect(result.remedies.immediate[0]).toHaveProperty('area', 'medical');
            expect(result.remedies.immediate[0].action).toContain('Dhanvantre');
        });

        test('should reject medical counseling without birth chart', async () => {
            const request = { healthConcerns: ['chronic_pain'] };

            await expect(api.provideMedicalCounseling(request)).rejects.toThrow('Birth chart is required');
        });
    });

    describe('Comprehensive Analysis Integration', () => {
        test('should perform comprehensive analysis combining all areas', async () => {
            const request = {
                birthChart: mockBirthChart,
                currentDate: currentDate.toISOString(),
                analysisType: 'comprehensive'
            };

            const result = await api.performComprehensiveAnalysis(request);

            expect(result).toHaveProperty('analysisId');
            expect(result).toHaveProperty('type', 'comprehensive');
            expect(result).toHaveProperty('career');
            expect(result).toHaveProperty('finance');
            expect(result).toHaveProperty('business');
            expect(result).toHaveProperty('medical');
            expect(result).toHaveProperty('overallScore');
            expect(result).toHaveProperty('luckyPeriods');
            expect(result).toHaveProperty('remedies');
            expect(result).toHaveProperty('summary');
            expect(result).toHaveProperty('success', true);

            // Verify analysis is stored
            expect(api.analyses.has(result.analysisId)).toBe(true);
        });

        test('should calculate correct overall score from individual analyses', async () => {
            const request = { birthChart: mockBirthChart };

            const result = await api.performComprehensiveAnalysis(request);

            expect(typeof result.overallScore).toBe('number');
            expect(result.overallScore).toBeGreaterThanOrEqual(0);
            expect(result.overallScore).toBeLessThanOrEqual(1);
        });

        test('should combine lucky periods from all analyses', async () => {
            const request = { birthChart: mockBirthChart };

            const result = await api.performComprehensiveAnalysis(request);

            expect(Array.isArray(result.luckyPeriods)).toBe(true);
            // Should have lucky periods from all four analysis types
        });

        test('should generate comprehensive remedies', async () => {
            const request = { birthChart: mockBirthChart };

            const result = await api.performComprehensiveAnalysis(request);

            expect(result.remedies).toHaveProperty('immediate');
            expect(result.remedies).toHaveProperty('shortTerm');
            expect(result.remedies).toHaveProperty('longTerm');
            expect(result.remedies).toHaveProperty('preventive');

            // Should have remedies from all areas
            const allRemedies = [
                ...result.remedies.immediate,
                ...result.remedies.shortTerm,
                ...result.remedies.longTerm,
                ...result.remedies.preventive
            ];

            const areas = allRemedies.map(r => r.area);
            expect(areas).toContain('career');
            expect(areas).toContain('finance');
            expect(areas).toContain('business');
            expect(areas).toContain('medical');
        });

        test('should identify overall strengths and challenges', async () => {
            const request = { birthChart: mockBirthChart };

            const result = await api.performComprehensiveAnalysis(request);

            expect(result.summary).toHaveProperty('strengths');
            expect(result.summary).toHaveProperty('challenges');
            expect(result.summary).toHaveProperty('recommendations');

            expect(Array.isArray(result.summary.strengths)).toBe(true);
            expect(Array.isArray(result.summary.challenges)).toBe(true);
            expect(Array.isArray(result.summary.recommendations)).toBe(true);
        });

        test('should reject comprehensive analysis without birth chart', async () => {
            const request = {};

            await expect(api.performComprehensiveAnalysis(request)).rejects.toThrow('Birth chart is required');
        });
    });

    describe('Analysis Report Retrieval', () => {
        test('should retrieve stored analysis report', async () => {
            // First create an analysis
            const createRequest = { birthChart: mockBirthChart };
            const createdResult = await api.analyzeCareerTiming(createRequest);

            // Then retrieve it
            const retrievedResult = await api.getAnalysisReport(createdResult.analysisId);

            expect(retrievedResult).toEqual(createdResult);
            expect(retrievedResult.analysisId).toBe(createdResult.analysisId);
        });

        test('should throw error for non-existent analysis ID', async () => {
            const nonExistentId = 'non-existent-id';

            await expect(api.getAnalysisReport(nonExistentId)).rejects.toThrow('Analysis not found');
        });
    });

    describe('Remedy Generation Integration', () => {
        test('should generate career remedies with proper structure', async () => {
            const mockAnalysisResult = {
                overallScore: 0.5,
                yogas: [],
                timing: { current: null, upcoming: [] },
                recommendations: []
            };

            const remedies = api.generateCareerRemedies(mockAnalysisResult);

            expect(remedies).toHaveProperty('immediate');
            expect(remedies).toHaveProperty('shortTerm');
            expect(remedies).toHaveProperty('longTerm');
            expect(remedies).toHaveProperty('preventive');

            remedies.immediate.forEach(remedy => {
                expect(remedy).toHaveProperty('type');
                expect(remedy).toHaveProperty('action');
                expect(remedy).toHaveProperty('duration');
                expect(remedy).toHaveProperty('priority');
                expect(remedy).toHaveProperty('area', 'career');
                expect(remedy).toHaveProperty('category');
            });
        });

        test('should generate financial remedies with proper structure', async () => {
            const mockAnalysisResult = {
                overallScore: 0.6,
                prosperity: {},
                yogas: [],
                spendingPatterns: {}
            };

            const remedies = api.generateFinancialRemedies(mockAnalysisResult);

            expect(remedies.immediate[0]).toHaveProperty('area', 'finance');
            expect(remedies.immediate[0].action).toContain('Lakshmiyei');
        });

        test('should generate business remedies with proper structure', async () => {
            const mockAnalysisResult = {
                overallScore: 0.7,
                potential: {},
                entrepreneurialYogas: [],
                timing: {}
            };

            const remedies = api.generateBusinessRemedies(mockAnalysisResult);

            expect(remedies.immediate[0]).toHaveProperty('area', 'business');
            expect(remedies.immediate[0].action).toContain('Ganapataye');
        });

        test('should generate medical remedies with proper structure', async () => {
            const mockAnalysisResult = {
                overallScore: 0.8,
                healthStatus: 'good',
                riskPeriods: [],
                remedialMeasures: []
            };

            const remedies = api.generateMedicalRemedies(mockAnalysisResult);

            expect(remedies.immediate[0]).toHaveProperty('area', 'medical');
            expect(remedies.immediate[0].action).toContain('Dhanvantre');
        });

        test('should generate comprehensive remedies combining all areas', async () => {
            const mockAnalysisResults = {
                career: { overallScore: 0.5 },
                finance: { overallScore: 0.6 },
                business: { overallScore: 0.7 },
                medical: { overallScore: 0.8 }
            };

            const remedies = api.generateComprehensiveRemedies(mockAnalysisResults);

            expect(remedies.immediate.length).toBeGreaterThan(0);
            expect(remedies.shortTerm.length).toBeGreaterThan(0);
            expect(remedies.longTerm.length).toBeGreaterThan(0);
            expect(remedies.preventive.length).toBeGreaterThan(0);
        });
    });

    describe('Performance Monitoring', () => {
        test('should record performance metrics for analyses', async () => {
            const request = { birthChart: mockBirthChart };

            await api.analyzeCareerTiming(request);

            const stats = api.getAnalysisStats();
            expect(stats.performanceMetrics).toHaveProperty('career_timing_analysis');
            expect(stats.performanceMetrics.career_timing_analysis.count).toBe(1);
            expect(stats.performanceMetrics.career_timing_analysis.averageDuration).toBeGreaterThan(0);
        });

        test('should track multiple analysis types', async () => {
            const request = { birthChart: mockBirthChart };

            await api.analyzeCareerTiming(request);
            await api.analyzeFinancialProsperity(request);
            await api.analyzeBusinessSuccess(request);
            await api.provideMedicalCounseling(request);

            const stats = api.getAnalysisStats();
            expect(stats.analysisTypes.career).toBe(1);
            expect(stats.analysisTypes.finance).toBe(1);
            expect(stats.analysisTypes.business).toBe(1);
            expect(stats.analysisTypes.medical).toBe(1);
        });

        test('should provide comprehensive analysis statistics', () => {
            const stats = api.getAnalysisStats();

            expect(stats).toHaveProperty('totalAnalyses');
            expect(stats).toHaveProperty('analysisTypes');
            expect(stats).toHaveProperty('performanceMetrics');
            expect(stats).toHaveProperty('uptime');
            expect(stats).toHaveProperty('memoryUsage');

            expect(typeof stats.totalAnalyses).toBe('number');
            expect(typeof stats.uptime).toBe('number');
            expect(typeof stats.memoryUsage).toBe('object');
        });
    });

    describe('Health Check', () => {
        test('should provide health check status', () => {
            const health = api.healthCheck();

            expect(health).toHaveProperty('status', 'healthy');
            expect(health).toHaveProperty('timestamp');
            expect(health).toHaveProperty('version');
            expect(health).toHaveProperty('services');
            expect(health).toHaveProperty('stats');

            expect(health.services).toHaveProperty('careerTimingAnalyzer', 'available');
            expect(health.services).toHaveProperty('financialProsperityAnalyzer', 'available');
            expect(health.services).toHaveProperty('businessSuccessAnalyzer', 'available');
            expect(health.services).toHaveProperty('medicalAstrologyCounselor', 'available');
        });
    });

    describe('Error Handling and Validation', () => {
        test('should handle invalid birth chart data gracefully', async () => {
            const invalidChart = { planets: null, ascendant: null };
            const request = { birthChart: invalidChart };

            await expect(api.analyzeCareerTiming(request)).rejects.toThrow();
        });

        test('should handle malformed current date', async () => {
            const request = {
                birthChart: mockBirthChart,
                currentDate: 'invalid-date'
            };

            // Should handle gracefully by using default date
            const result = await api.analyzeCareerTiming(request);
            expect(result.success).toBe(true);
        });

        test('should handle concurrent analysis requests', async () => {
            const request = { birthChart: mockBirthChart };
            const promises = [
                api.analyzeCareerTiming(request),
                api.analyzeFinancialProsperity(request),
                api.analyzeBusinessSuccess(request),
                api.provideMedicalCounseling(request)
            ];

            const results = await Promise.all(promises);

            results.forEach(result => {
                expect(result.success).toBe(true);
                expect(result).toHaveProperty('analysisId');
            });
        });

        test('should handle comprehensive analysis with parallel processing', async () => {
            const request = { birthChart: mockBirthChart };

            const result = await api.performComprehensiveAnalysis(request);

            expect(result.success).toBe(true);
            expect(result).toHaveProperty('career');
            expect(result).toHaveProperty('finance');
            expect(result).toHaveProperty('business');
            expect(result).toHaveProperty('medical');
        });
    });

    describe('Data Persistence and Retrieval', () => {
        test('should store and retrieve multiple analyses', async () => {
            const request = { birthChart: mockBirthChart };

            // Create multiple analyses
            const careerResult = await api.analyzeCareerTiming(request);
            const financeResult = await api.analyzeFinancialProsperity(request);
            const businessResult = await api.analyzeBusinessSuccess(request);

            // Verify all are stored
            expect(api.analyses.size).toBe(3);

            // Retrieve and verify each
            const retrievedCareer = await api.getAnalysisReport(careerResult.analysisId);
            const retrievedFinance = await api.getAnalysisReport(financeResult.analysisId);
            const retrievedBusiness = await api.getAnalysisReport(businessResult.analysisId);

            expect(retrievedCareer.type).toBe('career');
            expect(retrievedFinance.type).toBe('finance');
            expect(retrievedBusiness.type).toBe('business');
        });

        test('should maintain analysis data integrity', async () => {
            const request = { birthChart: mockBirthChart };

            const originalResult = await api.analyzeCareerTiming(request);
            const retrievedResult = await api.getAnalysisReport(originalResult.analysisId);

            // Deep comparison to ensure data integrity
            expect(retrievedResult).toEqual(originalResult);
            expect(retrievedResult.timestamp).toBe(originalResult.timestamp);
            expect(retrievedResult.overallScore).toBe(originalResult.overallScore);
        });
    });

    describe('Performance and Scalability', () => {
        test('should complete career analysis within reasonable time', async () => {
            const request = { birthChart: mockBirthChart };
            const startTime = Date.now();

            await api.analyzeCareerTiming(request);

            const duration = Date.now() - startTime;
            expect(duration).toBeLessThan(5000); // 5 seconds max
        });

        test('should handle multiple sequential analyses efficiently', async () => {
            const request = { birthChart: mockBirthChart };
            const analyses = [];

            for (let i = 0; i < 5; i++) {
                const result = await api.analyzeCareerTiming(request);
                analyses.push(result);
            }

            expect(analyses.length).toBe(5);
            analyses.forEach(analysis => {
                expect(analysis.success).toBe(true);
                expect(analysis).toHaveProperty('analysisId');
            });
        });

        test('should maintain performance under load', async () => {
            const request = { birthChart: mockBirthChart };
            const startTime = Date.now();

            // Perform comprehensive analysis (tests parallel processing)
            await api.performComprehensiveAnalysis(request);

            const duration = Date.now() - startTime;
            expect(duration).toBeLessThan(10000); // 10 seconds max for comprehensive analysis
        });
    });
});