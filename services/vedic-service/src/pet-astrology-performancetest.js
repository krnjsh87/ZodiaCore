/**
 * ZC1.13 Pet Astrology - Performance Tests
 *
 * Comprehensive performance tests for the pet astrology system,
 * ensuring it meets scalability and response time requirements.
 *
 * @module pet-astrology-performance-test
 * @version 1.0.0
 */

const PetChartGenerator = require('./pet-chart-generator');
const PetBehavioralAnalyzer = require('./pet-behavioral-analyzer');
const PetHealthPredictor = require('./pet-health-predictor');

// Mock dependencies
jest.mock('./animal-classifications');
jest.mock('./breed-astrological-traits');
jest.mock('./pet-astrology-utils');

const { getSpeciesData } = require('./animal-classifications');
const { getBreedTraits } = require('./breed-astrological-traits');
const {
    calculateJulianDay,
    calculateLahiriAyanamsa,
    calculateGMST,
    calculateLST,
    calculateAscendant,
    calculatePlanetaryPositions,
    tropicalToSidereal,
    isValidDate,
    isValidTime
} = require('./pet-astrology-utils');

// Performance test configuration
const PERFORMANCE_THRESHOLDS = {
    CHART_GENERATION_MS: 200,
    ANALYSIS_MS: 50,
    MEMORY_MB: 100,
    CPU_PERCENT: 10
};

// Test data
const validPetData = {
    species: 'dog',
    breed: 'Golden Retriever',
    birthYear: 2020,
    birthMonth: 6,
    birthDay: 15,
    birthHour: 14,
    birthMinute: 30,
    birthLatitude: 40.7128,
    birthLongitude: -74.0060
};

const mockSpeciesData = {
    planetaryRuler: 'MOON',
    element: 'Water',
    nature: 'Loyal, protective, pack-oriented'
};

const mockBreedData = {
    sunSign: 'Leo',
    moonSign: 'Cancer',
    dominantPlanet: 'SUN',
    personality: 'Friendly, loyal, enthusiastic'
};

const mockPlanetaryPositions = {
    SUN: { longitude: 90.5, sign: 2, degree: 30.5, house: 1, strength: 85, influence: 'Leadership and confidence' },
    MOON: { longitude: 120.3, sign: 3, degree: 30.3, house: 2, strength: 75, influence: 'Emotional sensitivity' },
    MARS: { longitude: 180.7, sign: 5, degree: 30.7, house: 4, strength: 70, influence: 'Energy and protection' },
    MERCURY: { longitude: 60.2, sign: 1, degree: 30.2, house: 12, strength: 80, influence: 'Communication' },
    JUPITER: { longitude: 240.8, sign: 7, degree: 30.8, house: 6, strength: 90, influence: 'Health and wisdom' },
    VENUS: { longitude: 300.4, sign: 9, degree: 30.4, house: 8, strength: 65, influence: 'Affection' },
    SATURN: { longitude: 270.1, sign: 8, degree: 30.1, house: 7, strength: 55, influence: 'Discipline' },
    RAHU: { longitude: 45.6, sign: 1, degree: 15.6, house: 11, strength: 60, influence: 'Karmic patterns' },
    KETU: { longitude: 225.6, sign: 6, degree: 15.6, house: 5, strength: 50, influence: 'Spiritual liberation' }
};

// Performance monitoring utilities
class PerformanceMonitor {
    static startTimer() {
        return process.hrtime.bigint();
    }

    static endTimer(startTime) {
        const endTime = process.hrtime.bigint();
        return Number(endTime - startTime) / 1_000_000; // Convert to milliseconds
    }

    static getMemoryUsage() {
        const usage = process.memoryUsage();
        return {
            rss: usage.rss / 1024 / 1024, // MB
            heapTotal: usage.heapTotal / 1024 / 1024, // MB
            heapUsed: usage.heapUsed / 1024 / 1024, // MB
            external: usage.external / 1024 / 1024 // MB
        };
    }

    static measureMemoryDelta(operation) {
        const before = this.getMemoryUsage();
        const result = operation();
        const after = this.getMemoryUsage();

        return {
            result,
            memoryDelta: {
                rss: after.rss - before.rss,
                heapTotal: after.heapTotal - before.heapTotal,
                heapUsed: after.heapUsed - before.heapUsed,
                external: after.external - before.external
            }
        };
    }
}

describe('Pet Astrology Performance Tests', () => {
    let chartGenerator;
    let behavioralAnalyzer;
    let healthPredictor;

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();

        // Setup mock returns
        getSpeciesData.mockReturnValue(mockSpeciesData);
        getBreedTraits.mockReturnValue(mockBreedData);
        calculateJulianDay.mockReturnValue(2459000);
        calculateLahiriAyanamsa.mockReturnValue(24.1);
        calculateGMST.mockReturnValue(100.5);
        calculateLST.mockReturnValue(75.3);
        calculateAscendant.mockReturnValue(90.5);
        calculatePlanetaryPositions.mockReturnValue({
            SUN: 90.5, MOON: 120.3, MARS: 180.7, MERCURY: 60.2,
            JUPITER: 240.8, VENUS: 300.4, SATURN: 270.1, RAHU: 45.6, KETU: 225.6
        });
        tropicalToSidereal.mockImplementation((tropical) => tropical);
        isValidDate.mockReturnValue(true);
        isValidTime.mockReturnValue(true);

        // Create system components
        chartGenerator = new PetChartGenerator();
        behavioralAnalyzer = new PetBehavioralAnalyzer({
            ascendant: { longitude: 90.0 },
            planets: mockPlanetaryPositions
        });
        healthPredictor = new PetHealthPredictor({
            ascendant: { longitude: 90.0 },
            planets: mockPlanetaryPositions
        });
    });

    describe('Chart Generation Performance', () => {
        test('should generate pet chart within performance threshold', () => {
            const startTime = PerformanceMonitor.startTimer();

            const chart = chartGenerator.generatePetChart(validPetData);

            const duration = PerformanceMonitor.endTimer(startTime);

            expect(duration).toBeLessThanOrEqual(PERFORMANCE_THRESHOLDS.CHART_GENERATION_MS);
            expect(chart).toBeDefined();
            expect(chart.petInfo).toEqual(validPetData);
        });

        test('should handle multiple chart generations efficiently', () => {
            const petVariations = [
                validPetData,
                { ...validPetData, species: 'cat', breed: 'Persian' },
                { ...validPetData, species: 'bird', breed: 'African Grey' },
                { ...validPetData, species: 'horse', breed: 'Arabian' },
                { ...validPetData, species: 'rabbit', breed: 'Mini Lop' }
            ];

            const startTime = PerformanceMonitor.startTimer();

            const charts = petVariations.map(pet => chartGenerator.generatePetChart(pet));

            const duration = PerformanceMonitor.endTimer(startTime);
            const avgDuration = duration / petVariations.length;

            expect(avgDuration).toBeLessThanOrEqual(PERFORMANCE_THRESHOLDS.CHART_GENERATION_MS);
            expect(charts).toHaveLength(petVariations.length);
            charts.forEach(chart => expect(chart).toBeDefined());
        });

        test('should maintain performance under load', () => {
            const iterations = 100;
            const durations = [];

            for (let i = 0; i < iterations; i++) {
                const startTime = PerformanceMonitor.startTimer();
                chartGenerator.generatePetChart({
                    ...validPetData,
                    name: `TestPet${i}`
                });
                const duration = PerformanceMonitor.endTimer(startTime);
                durations.push(duration);
            }

            const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
            const maxDuration = Math.max(...durations);
            const p95Duration = durations.sort((a, b) => a - b)[Math.floor(durations.length * 0.95)];

            expect(avgDuration).toBeLessThanOrEqual(PERFORMANCE_THRESHOLDS.CHART_GENERATION_MS);
            expect(maxDuration).toBeLessThan(PERFORMANCE_THRESHOLDS.CHART_GENERATION_MS * 2); // Allow some variance
            expect(p95Duration).toBeLessThanOrEqual(PERFORMANCE_THRESHOLDS.CHART_GENERATION_MS * 1.5);
        });
    });

    describe('Analysis Performance', () => {
        test('should perform behavioral analysis within threshold', () => {
            const startTime = PerformanceMonitor.startTimer();

            const profile = behavioralAnalyzer.generateBehavioralProfile(mockPlanetaryPositions, validPetData);

            const duration = PerformanceMonitor.endTimer(startTime);

            expect(duration).toBeLessThanOrEqual(PERFORMANCE_THRESHOLDS.ANALYSIS_MS);
            expect(profile).toHaveProperty('personalityType');
            expect(profile).toHaveProperty('temperament');
        });

        test('should perform health analysis within threshold', () => {
            const startTime = PerformanceMonitor.startTimer();

            const profile = healthPredictor.generateHealthProfile(mockPlanetaryPositions, validPetData);

            const duration = PerformanceMonitor.endTimer(startTime);

            expect(duration).toBeLessThanOrEqual(PERFORMANCE_THRESHOLDS.ANALYSIS_MS);
            expect(profile).toHaveProperty('overallHealth');
            expect(profile).toHaveProperty('potentialHealthIssues');
        });

        test('should handle complex analysis scenarios efficiently', () => {
            const complexPositions = {
                ...mockPlanetaryPositions,
                // Add more complex planetary configurations
                RAHU: { ...mockPlanetaryPositions.RAHU, strength: 95, house: 1 },
                KETU: { ...mockPlanetaryPositions.KETU, strength: 90, house: 7 },
                SATURN: { ...mockPlanetaryPositions.SATURN, strength: 85, house: 8 }
            };

            const startTime = PerformanceMonitor.startTimer();

            const behavioralProfile = behavioralAnalyzer.generateBehavioralProfile(complexPositions, validPetData);
            const healthProfile = healthPredictor.generateHealthProfile(complexPositions, validPetData);

            const duration = PerformanceMonitor.endTimer(startTime);

            expect(duration).toBeLessThanOrEqual(PERFORMANCE_THRESHOLDS.ANALYSIS_MS * 2); // Allow slightly more for complex analysis
            expect(behavioralProfile).toBeDefined();
            expect(healthProfile).toBeDefined();
        });
    });

    describe('Memory Usage Performance', () => {
        test('should maintain reasonable memory usage during chart generation', () => {
            const { memoryDelta } = PerformanceMonitor.measureMemoryDelta(() => {
                return chartGenerator.generatePetChart(validPetData);
            });

            expect(memoryDelta.heapUsed).toBeLessThan(PERFORMANCE_THRESHOLDS.MEMORY_MB);
            expect(memoryDelta.rss).toBeLessThan(PERFORMANCE_THRESHOLDS.MEMORY_MB * 2);
        });

        test('should not have memory leaks during repeated operations', () => {
            const initialMemory = PerformanceMonitor.getMemoryUsage();

            // Perform multiple operations
            for (let i = 0; i < 50; i++) {
                chartGenerator.generatePetChart({
                    ...validPetData,
                    name: `MemoryTest${i}`
                });
                behavioralAnalyzer.generateBehavioralProfile(mockPlanetaryPositions, validPetData);
                healthPredictor.generateHealthProfile(mockPlanetaryPositions, validPetData);
            }

            const finalMemory = PerformanceMonitor.getMemoryUsage();
            const memoryIncrease = {
                rss: finalMemory.rss - initialMemory.rss,
                heapUsed: finalMemory.heapUsed - initialMemory.heapUsed
            };

            // Allow for some memory increase but not excessive
            expect(memoryIncrease.heapUsed).toBeLessThan(PERFORMANCE_THRESHOLDS.MEMORY_MB * 2);
            expect(memoryIncrease.rss).toBeLessThan(PERFORMANCE_THRESHOLDS.MEMORY_MB * 3);
        });

        test('should handle large batch operations without excessive memory usage', () => {
            const batchSize = 20;
            const pets = Array.from({ length: batchSize }, (_, i) => ({
                ...validPetData,
                name: `BatchPet${i}`,
                species: i % 2 === 0 ? 'dog' : 'cat',
                breed: i % 2 === 0 ? 'Golden Retriever' : 'Persian'
            }));

            const { memoryDelta, result } = PerformanceMonitor.measureMemoryDelta(() => {
                return pets.map(pet => {
                    const chart = chartGenerator.generatePetChart(pet);
                    const behavioral = behavioralAnalyzer.generateBehavioralProfile(chart.planets, pet);
                    const health = healthPredictor.generateHealthProfile(chart.planets, pet);
                    return { chart, behavioral, health };
                });
            });

            expect(result).toHaveLength(batchSize);
            expect(memoryDelta.heapUsed).toBeLessThan(PERFORMANCE_THRESHOLDS.MEMORY_MB * 5); // Allow more for batch
            expect(memoryDelta.rss).toBeLessThan(PERFORMANCE_THRESHOLDS.MEMORY_MB * 8);
        });
    });

    describe('Concurrent Operations Performance', () => {
        test('should handle concurrent chart generations efficiently', async () => {
            const concurrentRequests = 10;
            const promises = [];

            const startTime = PerformanceMonitor.startTimer();

            for (let i = 0; i < concurrentRequests; i++) {
                promises.push(
                    Promise.resolve().then(() => {
                        return chartGenerator.generatePetChart({
                            ...validPetData,
                            name: `ConcurrentPet${i}`
                        });
                    })
                );
            }

            const results = await Promise.all(promises);
            const duration = PerformanceMonitor.endTimer(startTime);

            expect(results).toHaveLength(concurrentRequests);
            results.forEach(result => expect(result).toBeDefined());

            // Should complete within reasonable time for concurrent operations
            const expectedMaxDuration = PERFORMANCE_THRESHOLDS.CHART_GENERATION_MS * concurrentRequests * 0.8;
            expect(duration).toBeLessThanOrEqual(expectedMaxDuration);
        });

        test('should maintain performance under sustained load', async () => {
            const sustainedRequests = 50;
            const promises = [];
            const durations = [];

            for (let i = 0; i < sustainedRequests; i++) {
                promises.push(
                    Promise.resolve().then(() => {
                        const startTime = PerformanceMonitor.startTimer();
                        const result = chartGenerator.generatePetChart({
                            ...validPetData,
                            name: `SustainedPet${i}`
                        });
                        const duration = PerformanceMonitor.endTimer(startTime);
                        durations.push(duration);
                        return result;
                    })
                );
            }

            const results = await Promise.all(promises);

            expect(results).toHaveLength(sustainedRequests);
            results.forEach(result => expect(result).toBeDefined());

            const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
            const maxDuration = Math.max(...durations);

            expect(avgDuration).toBeLessThanOrEqual(PERFORMANCE_THRESHOLDS.CHART_GENERATION_MS);
            expect(maxDuration).toBeLessThanOrEqual(PERFORMANCE_THRESHOLDS.CHART_GENERATION_MS * 3); // Allow more variance under load
        });
    });

    describe('Scalability Performance', () => {
        test('should scale linearly with input complexity', () => {
            const simplePet = validPetData;
            const complexPet = {
                ...validPetData,
                name: 'Complex Pet with Very Long Name for Testing',
                additionalData: 'Extra data to increase complexity'.repeat(10)
            };

            // Simple pet
            const simpleStart = PerformanceMonitor.startTimer();
            const simpleResult = chartGenerator.generatePetChart(simplePet);
            const simpleDuration = PerformanceMonitor.endTimer(simpleStart);

            // Complex pet
            const complexStart = PerformanceMonitor.startTimer();
            const complexResult = chartGenerator.generatePetChart(complexPet);
            const complexDuration = PerformanceMonitor.endTimer(complexStart);

            // Complex should not be excessively slower
            expect(complexDuration).toBeLessThanOrEqual(simpleDuration * 2);
            expect(simpleResult).toBeDefined();
            expect(complexResult).toBeDefined();
        });

        test('should handle edge case data without performance degradation', () => {
            const edgeCases = [
                { ...validPetData, birthYear: 2000 }, // Oldest allowed
                { ...validPetData, birthYear: 2024 }, // Newest allowed
                { ...validPetData, birthLatitude: -89.999 }, // Extreme latitude
                { ...validPetData, birthLongitude: 179.999 }, // Extreme longitude
                { ...validPetData, species: 'reptile', breed: 'Tortoise' } // Different species
            ];

            const durations = [];

            edgeCases.forEach((petData, index) => {
                const startTime = PerformanceMonitor.startTimer();
                const result = chartGenerator.generatePetChart(petData);
                const duration = PerformanceMonitor.endTimer(startTime);

                durations.push(duration);
                expect(result).toBeDefined();
            });

            const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
            const maxDuration = Math.max(...durations);

            expect(avgDuration).toBeLessThanOrEqual(PERFORMANCE_THRESHOLDS.CHART_GENERATION_MS);
            expect(maxDuration).toBeLessThanOrEqual(PERFORMANCE_THRESHOLDS.CHART_GENERATION_MS * 2);
        });
    });

    describe('Resource Efficiency', () => {
        test('should minimize CPU usage during operations', () => {
            // Note: CPU usage testing is challenging in Jest environment
            // This is a placeholder for actual CPU monitoring in production
            const startTime = PerformanceMonitor.startTimer();

            for (let i = 0; i < 100; i++) {
                chartGenerator.generatePetChart({
                    ...validPetData,
                    name: `CPUTest${i}`
                });
            }

            const duration = PerformanceMonitor.endTimer(startTime);

            // Basic check that operations complete without excessive time
            expect(duration).toBeLessThan(10000); // 10 seconds for 100 operations
        });

        test('should clean up resources properly', () => {
            // Test that no global state is modified
            const initialGlobalCount = Object.keys(global).length;

            for (let i = 0; i < 10; i++) {
                chartGenerator.generatePetChart({
                    ...validPetData,
                    name: `CleanupTest${i}`
                });
            }

            const finalGlobalCount = Object.keys(global).length;

            // Global object should not grow significantly
            expect(finalGlobalCount - initialGlobalCount).toBeLessThanOrEqual(5);
        });
    });

    describe('Performance Benchmarks', () => {
        test('should meet all performance benchmarks', () => {
            const benchmarks = [];

            // Chart generation benchmark
            for (let i = 0; i < 20; i++) {
                const startTime = PerformanceMonitor.startTimer();
                chartGenerator.generatePetChart({
                    ...validPetData,
                    name: `Benchmark${i}`
                });
                const duration = PerformanceMonitor.endTimer(startTime);
                benchmarks.push({ operation: 'chart_generation', duration });
            }

            // Analysis benchmarks
            for (let i = 0; i < 20; i++) {
                const startTime = PerformanceMonitor.startTimer();
                behavioralAnalyzer.generateBehavioralProfile(mockPlanetaryPositions, validPetData);
                const duration = PerformanceMonitor.endTimer(startTime);
                benchmarks.push({ operation: 'behavioral_analysis', duration });
            }

            for (let i = 0; i < 20; i++) {
                const startTime = PerformanceMonitor.startTimer();
                healthPredictor.generateHealthProfile(mockPlanetaryPositions, validPetData);
                const duration = PerformanceMonitor.endTimer(startTime);
                benchmarks.push({ operation: 'health_analysis', duration });
            }

            // Calculate statistics
            const chartGenTimes = benchmarks.filter(b => b.operation === 'chart_generation').map(b => b.duration);
            const behavioralTimes = benchmarks.filter(b => b.operation === 'behavioral_analysis').map(b => b.duration);
            const healthTimes = benchmarks.filter(b => b.operation === 'health_analysis').map(b => b.duration);

            const calcStats = (times) => ({
                avg: times.reduce((sum, t) => sum + t, 0) / times.length,
                max: Math.max(...times),
                p95: times.sort((a, b) => a - b)[Math.floor(times.length * 0.95)]
            });

            const chartStats = calcStats(chartGenTimes);
            const behavioralStats = calcStats(behavioralTimes);
            const healthStats = calcStats(healthTimes);

            // Verify benchmarks
            expect(chartStats.avg).toBeLessThanOrEqual(PERFORMANCE_THRESHOLDS.CHART_GENERATION_MS);
            expect(chartStats.p95).toBeLessThanOrEqual(PERFORMANCE_THRESHOLDS.CHART_GENERATION_MS * 1.5);

            expect(behavioralStats.avg).toBeLessThanOrEqual(PERFORMANCE_THRESHOLDS.ANALYSIS_MS);
            expect(behavioralStats.p95).toBeLessThanOrEqual(PERFORMANCE_THRESHOLDS.ANALYSIS_MS * 2);

            expect(healthStats.avg).toBeLessThanOrEqual(PERFORMANCE_THRESHOLDS.ANALYSIS_MS);
            expect(healthStats.p95).toBeLessThanOrEqual(PERFORMANCE_THRESHOLDS.ANALYSIS_MS * 2);
        });

        test('should maintain performance consistency', () => {
            const runs = 5;
            const runTimes = [];

            for (let run = 0; run < runs; run++) {
                const startTime = PerformanceMonitor.startTimer();

                for (let i = 0; i < 10; i++) {
                    chartGenerator.generatePetChart({
                        ...validPetData,
                        name: `ConsistencyTest${run}-${i}`
                    });
                }

                const duration = PerformanceMonitor.endTimer(startTime);
                runTimes.push(duration);
            }

            const avgTime = runTimes.reduce((sum, t) => sum + t, 0) / runTimes.length;
            const variance = runTimes.reduce((sum, t) => sum + Math.pow(t - avgTime, 2), 0) / runTimes.length;
            const stdDev = Math.sqrt(variance);

            // Standard deviation should be reasonable (less than 20% of average)
            expect(stdDev / avgTime).toBeLessThan(0.2);
        });
    });

    describe('Load Testing Scenarios', () => {
        test('should handle burst load scenarios', () => {
            const burstSize = 50;
            const burstTimes = [];

            // Simulate burst load
            for (let burst = 0; burst < 3; burst++) {
                const startTime = PerformanceMonitor.startTimer();

                for (let i = 0; i < burstSize; i++) {
                    chartGenerator.generatePetChart({
                        ...validPetData,
                        name: `Burst${burst}-${i}`
                    });
                }

                const duration = PerformanceMonitor.endTimer(startTime);
                burstTimes.push(duration);
            }

            const avgBurstTime = burstTimes.reduce((sum, t) => sum + t, 0) / burstTimes.length;
            const maxBurstTime = Math.max(...burstTimes);

            // Should handle bursts reasonably well
            expect(avgBurstTime).toBeLessThan(5000); // 5 seconds for 50 operations
            expect(maxBurstTime).toBeLessThan(10000); // 10 seconds max for any burst
        });

        test('should recover quickly from load spikes', () => {
            // Heavy load
            const heavyStart = PerformanceMonitor.startTimer();
            for (let i = 0; i < 100; i++) {
                chartGenerator.generatePetChart({
                    ...validPetData,
                    name: `HeavyLoad${i}`
                });
            }
            const heavyDuration = PerformanceMonitor.endTimer(heavyStart);

            // Recovery load
            const recoveryStart = PerformanceMonitor.startTimer();
            for (let i = 0; i < 10; i++) {
                chartGenerator.generatePetChart({
                    ...validPetData,
                    name: `Recovery${i}`
                });
            }
            const recoveryDuration = PerformanceMonitor.endTimer(recoveryStart);

            // Recovery should be fast
            expect(recoveryDuration).toBeLessThan(PERFORMANCE_THRESHOLDS.CHART_GENERATION_MS * 10 * 0.5);
        });
    });
});