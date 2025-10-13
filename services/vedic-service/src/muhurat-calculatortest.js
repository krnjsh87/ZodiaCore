/**
 * ZodiaCore - Muhurat Calculator Tests
 *
 * Unit tests for the Muhurat calculation system.
 * Tests cover Panchang calculations, Muhurat scoring, and specialized calculators.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const VedicMuhuratSystem = require('./vedic-muhurat-system');
const PanchangCalculator = require('./panchang-calculator');
const MuhuratCalculator = require('./muhurat-calculator');
const MuhuratScorer = require('./muhurat-scorer');

describe('Muhurat Calculator Tests', () => {
    let muhuratSystem;
    let panchangCalculator;
    let muhuratCalculator;
    let muhuratScorer;

    beforeEach(() => {
        muhuratSystem = new VedicMuhuratSystem();
        panchangCalculator = new PanchangCalculator();
        muhuratCalculator = new MuhuratCalculator();
        muhuratScorer = new MuhuratScorer();
    });

    describe('PanchangCalculator', () => {
        test('should calculate basic Panchang elements', async () => {
            const date = new Date('2025-01-01');
            const panchang = await panchangCalculator.calculatePanchang(date, 28.6139, 77.2090);

            expect(panchang).toHaveProperty('tithi');
            expect(panchang).toHaveProperty('nakshatra');
            expect(panchang).toHaveProperty('yoga');
            expect(panchang).toHaveProperty('karana');
            expect(panchang).toHaveProperty('vara');
            expect(panchang).toHaveProperty('sunLongitude');
            expect(panchang).toHaveProperty('moonLongitude');
        });

        test('should calculate Tithi correctly', async () => {
            const date = new Date('2025-01-01');
            const panchang = await panchangCalculator.calculatePanchang(date, 28.6139, 77.2090);

            expect(panchang.tithi).toHaveProperty('number');
            expect(panchang.tithi).toHaveProperty('name');
            expect(panchang.tithi).toHaveProperty('paksha');
            expect(panchang.tithi).toHaveProperty('isAuspicious');
        });

        test('should calculate Nakshatra correctly', async () => {
            const date = new Date('2025-01-01');
            const panchang = await panchangCalculator.calculatePanchang(date, 28.6139, 77.2090);

            expect(panchang.nakshatra).toHaveProperty('number');
            expect(panchang.nakshatra).toHaveProperty('name');
            expect(panchang.nakshatra).toHaveProperty('lord');
            expect(panchang.nakshatra).toHaveProperty('pada');
        });
    });

    describe('MuhuratCalculator', () => {
        test('should calculate daily Muhurats', () => {
            const date = new Date('2025-01-01');
            const sunrise = new Date(date);
            sunrise.setHours(6, 0, 0, 0);

            const muhurats = muhuratCalculator.calculateDailyMuhurats(sunrise, date);

            expect(muhurats).toHaveLength(30);
            expect(muhurats[0]).toHaveProperty('number', 1);
            expect(muhurats[0]).toHaveProperty('name');
            expect(muhurats[0]).toHaveProperty('startTime');
            expect(muhurats[0]).toHaveProperty('endTime');
        });

        test('should identify auspicious periods', () => {
            const date = new Date('2025-01-01');
            const sunrise = new Date(date);
            sunrise.setHours(6, 0, 0, 0);
            const planetaryPositions = {}; // Mock

            const periods = muhuratCalculator.identifyAuspiciousPeriods(date, sunrise, planetaryPositions);

            expect(periods.length).toBeGreaterThan(0);
            expect(periods[0]).toHaveProperty('name');
            expect(periods[0]).toHaveProperty('startTime');
            expect(periods[0]).toHaveProperty('endTime');
        });
    });

    describe('MuhuratScorer', () => {
        test('should calculate Muhurat score', async () => {
            const date = new Date('2025-01-01');
            const panchang = await panchangCalculator.calculatePanchang(date, 28.6139, 77.2090);

            const score = muhuratScorer.calculateMuhuratScore(panchang, 'marriage');

            expect(score).toHaveProperty('totalScore');
            expect(score).toHaveProperty('componentScores');
            expect(score).toHaveProperty('grade');
            expect(score).toHaveProperty('recommendation');
        });

        test('should identify strengths and weaknesses', async () => {
            const date = new Date('2025-01-01');
            const panchang = await panchangCalculator.calculatePanchang(date, 28.6139, 77.2090);

            const strengths = muhuratScorer.identifyStrengths(panchang, 'marriage');
            const weaknesses = muhuratScorer.identifyWeaknesses(panchang, 'marriage');

            expect(Array.isArray(strengths)).toBe(true);
            expect(Array.isArray(weaknesses)).toBe(true);
        });
    });

    describe('VedicMuhuratSystem', () => {
        test('should find auspicious muhurats', async () => {
            const startDate = new Date('2025-01-01');
            const endDate = new Date('2025-01-05');

            const results = await muhuratSystem.findAuspiciousMuhurat(
                'marriage',
                startDate,
                endDate,
                { minScore: 0.5, maxResults: 3 }
            );

            expect(Array.isArray(results)).toBe(true);
            if (results.length > 0) {
                expect(results[0]).toHaveProperty('date');
                expect(results[0]).toHaveProperty('score');
                expect(results[0]).toHaveProperty('panchang');
            }
        });

        test('should get Panchang for date', async () => {
            const date = new Date('2025-01-01');
            const panchang = await muhuratSystem.getPanchang(date);

            expect(panchang).toHaveProperty('tithi');
            expect(panchang).toHaveProperty('nakshatra');
            expect(panchang).toHaveProperty('yoga');
            expect(panchang).toHaveProperty('karana');
            expect(panchang).toHaveProperty('vara');
        });

        test('should get daily Muhurats', async () => {
            const date = new Date('2025-01-01');
            const muhurats = await muhuratSystem.getDailyMuhurats(date);

            expect(Array.isArray(muhurats)).toBe(true);
            expect(muhurats).toHaveLength(30);
        });

        test('should generate Muhurat report', async () => {
            const date = new Date('2025-01-01');
            const panchang = await panchangCalculator.calculatePanchang(date, 28.6139, 77.2090);
            const score = muhuratScorer.calculateMuhuratScore(panchang, 'marriage');

            const selectedMuhurat = {
                date: date,
                panchang: panchang,
                score: score
            };

            const report = await muhuratSystem.generateMuhuratReport(selectedMuhurat, 'marriage');

            expect(report).toHaveProperty('date');
            expect(report).toHaveProperty('panchang');
            expect(report).toHaveProperty('score');
            expect(report).toHaveProperty('recommendation');
            expect(report).toHaveProperty('validation');
        });

        test('should return health status', () => {
            const health = muhuratSystem.getHealthStatus();

            expect(health).toHaveProperty('status');
            expect(health).toHaveProperty('version');
            expect(health).toHaveProperty('components');
            expect(health).toHaveProperty('supportedActivities');
        });
    });

    describe('Specialized Calculators', () => {
        test('should have marriage calculator', () => {
            expect(muhuratSystem.specializedCalculators).toHaveProperty('marriage');
        });

        test('should have business calculator', () => {
            expect(muhuratSystem.specializedCalculators).toHaveProperty('business');
        });

        test('should have travel calculator', () => {
            expect(muhuratSystem.specializedCalculators).toHaveProperty('travel');
        });
    });
});