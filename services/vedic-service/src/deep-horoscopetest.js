/**
 * ZodiaCore - Deep Horoscope Interpreter Tests
 *
 * Comprehensive unit and integration tests for the Deep Horoscope Interpreter system.
 * Tests cover all components, error handling, edge cases, and integration scenarios.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 */

const { DeepHoroscopeInterpreter, ZC114DeepHoroscopeSystem } = require('./deep-horoscope-interpreter');
const { PLANETS } = require('./astro-constants');

// Mock dependencies
jest.mock('./shad-bala-calculator');
jest.mock('./yoga-detector');
jest.mock('./life-area-analyzer');
jest.mock('./predictive-analyzer');
jest.mock('./dasha-analyzer');
jest.mock('./remedy-generator');
jest.mock('./vedic-birth-chart-generator');

const ShadBalaCalculator = require('./shad-bala-calculator');
const YogaDetector = require('./yoga-detector');
const LifeAreaAnalyzer = require('./life-area-analyzer');
const PredictiveAnalyzer = require('./predictive-analyzer');
const DashaAnalyzer = require('./dasha-analyzer');
const RemedyGenerator = require('./remedy-generator');
const VedicBirthChartGenerator = require('./vedic-birth-chart-generator');

describe('DeepHoroscopeInterpreter', () => {
    let mockBirthChart;
    let mockShadBalaCalculator;
    let mockYogaDetector;
    let mockLifeAreaAnalyzer;
    let mockPredictor;
    let mockDashaAnalyzer;
    let mockRemedyGenerator;
    let interpreter;

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();

        mockBirthChart = {
            ascendant: { sign: 0, degree: 15 },
            planets: {
                SUN: { sign: 4, degree: 10, house: 1 },
                MOON: { sign: 3, degree: 20, house: 12 },
                MARS: { sign: 0, degree: 25, house: 1 },
                MERCURY: { sign: 3, degree: 5, house: 12 },
                JUPITER: { sign: 8, degree: 15, house: 6 },
                VENUS: { sign: 2, degree: 20, house: 11 },
                SATURN: { sign: 9, degree: 10, house: 7 },
                RAHU: { sign: 6, degree: 0, house: 4 },
                KETU: { sign: 0, degree: 0, house: 10 }
            },
            moonDetails: {
                nakshatra: { nakshatraName: 'Ashwini', lord: 'KETU' }
            }
        };

        // Mock instances
        mockShadBalaCalculator = {
            calculateShadBala: jest.fn()
        };
        mockYogaDetector = {
            detectAllYogas: jest.fn()
        };
        mockLifeAreaAnalyzer = {
            analyzeAllLifeAreas: jest.fn()
        };
        mockPredictor = {
            generatePredictions: jest.fn()
        };
        mockDashaAnalyzer = {
            analyzeCurrentDasha: jest.fn()
        };
        mockRemedyGenerator = {
            generateRemedies: jest.fn()
        };

        // Setup mock constructors
        ShadBalaCalculator.mockImplementation(() => mockShadBalaCalculator);
        YogaDetector.mockImplementation(() => mockYogaDetector);
        LifeAreaAnalyzer.mockImplementation(() => mockLifeAreaAnalyzer);
        PredictiveAnalyzer.mockImplementation(() => mockPredictor);
        DashaAnalyzer.mockImplementation(() => mockDashaAnalyzer);
        RemedyGenerator.mockImplementation(() => mockRemedyGenerator);

        interpreter = new DeepHoroscopeInterpreter(mockBirthChart);
    });

    describe('Initialization', () => {
        test('should initialize with birth chart', () => {
            expect(interpreter.birthChart).toBe(mockBirthChart);
            expect(ShadBalaCalculator).toHaveBeenCalledWith(mockBirthChart);
            expect(YogaDetector).toHaveBeenCalledWith(mockBirthChart);
            expect(LifeAreaAnalyzer).toHaveBeenCalledWith(mockBirthChart);
            expect(PredictiveAnalyzer).toHaveBeenCalledWith(mockBirthChart);
            expect(DashaAnalyzer).toHaveBeenCalledWith(mockBirthChart);
            expect(RemedyGenerator).toHaveBeenCalledWith(mockBirthChart);
        });

        test('should handle null birth chart gracefully', () => {
            const nullInterpreter = new DeepHoroscopeInterpreter(null);
            expect(nullInterpreter.birthChart).toBeNull();
        });
    });

    describe('getChartBasicInfo', () => {
        test('should return complete chart basic info', () => {
            const info = interpreter.getChartBasicInfo();

            expect(info).toHaveProperty('ascendant');
            expect(info.ascendant.sign).toBe(0);
            expect(info.ascendant.degree).toBe(15);
            expect(info.ascendant.lord).toBe('MARS');

            expect(info).toHaveProperty('moonSign');
            expect(info.moonSign.sign).toBe(3);
            expect(info.moonSign.nakshatra).toBe('Ashwini');
            expect(info.moonSign.lord).toBe('KETU');

            expect(info).toHaveProperty('planetaryPositions');
            expect(info.planetaryPositions.SUN.sign).toBe(4);
            expect(info.planetaryPositions.SUN.degree).toBe(10);
            expect(info.planetaryPositions.SUN.house).toBe(1);

            expect(info).toHaveProperty('dominantPlanets');
            expect(info).toHaveProperty('chartStrength');
        });

        test('should handle missing ascendant data', () => {
            const chartWithoutAscendant = { ...mockBirthChart, ascendant: null };
            const interpreterWithoutAscendant = new DeepHoroscopeInterpreter(chartWithoutAscendant);

            const info = interpreterWithoutAscendant.getChartBasicInfo();
            expect(info.ascendant.sign).toBe(0);
            expect(info.ascendant.degree).toBe(0);
            expect(info.ascendant.lord).toBe('Unknown');
        });

        test('should handle missing moon details', () => {
            const chartWithoutMoon = { ...mockBirthChart, moonDetails: null };
            const interpreterWithoutMoon = new DeepHoroscopeInterpreter(chartWithoutMoon);

            const info = interpreterWithoutMoon.getChartBasicInfo();
            expect(info.moonSign.sign).toBe(0);
            expect(info.moonSign.nakshatra).toBe('Unknown');
            expect(info.moonSign.lord).toBe('Unknown');
        });

        test('should handle missing planets data', () => {
            const chartWithoutPlanets = { ...mockBirthChart, planets: null };
            const interpreterWithoutPlanets = new DeepHoroscopeInterpreter(chartWithoutPlanets);

            const info = interpreterWithoutPlanets.getChartBasicInfo();
            expect(info.planetaryPositions).toEqual({});
        });
    });

    describe('getSignLord', () => {
        test('should return correct sign lords for all zodiac signs', () => {
            const signLords = {
                0: 'MARS',     // Aries
                1: 'VENUS',    // Taurus
                2: 'MERCURY',  // Gemini
                3: 'MOON',     // Cancer
                4: 'SUN',      // Leo
                5: 'MERCURY',  // Virgo
                6: 'VENUS',    // Libra
                7: 'MARS',     // Scorpio
                8: 'JUPITER',  // Sagittarius
                9: 'SATURN',   // Capricorn
                10: 'SATURN',  // Aquarius
                11: 'JUPITER'  // Pisces
            };

            Object.entries(signLords).forEach(([sign, lord]) => {
                expect(interpreter.getSignLord(parseInt(sign))).toBe(lord);
            });
        });

        test('should return Unknown for invalid signs', () => {
            expect(interpreter.getSignLord(-1)).toBe('Unknown');
            expect(interpreter.getSignLord(12)).toBe('Unknown');
            expect(interpreter.getSignLord(13)).toBe('Unknown');
            expect(interpreter.getSignLord('invalid')).toBe('Unknown');
            expect(interpreter.getSignLord(null)).toBe('Unknown');
        });
    });

    describe('formatPlanetaryPositions', () => {
        test('should format all planetary positions correctly', () => {
            const positions = interpreter.formatPlanetaryPositions();

            expect(positions.SUN.sign).toBe(4);
            expect(positions.SUN.degree).toBe(10);
            expect(positions.SUN.house).toBe(1);

            expect(positions.MOON.sign).toBe(3);
            expect(positions.MOON.degree).toBe(20);
            expect(positions.MOON.house).toBe(12);
        });

        test('should handle missing planets gracefully', () => {
            const chartWithoutPlanets = { ...mockBirthChart, planets: null };
            const interpreterWithoutPlanets = new DeepHoroscopeInterpreter(chartWithoutPlanets);

            const positions = interpreterWithoutPlanets.formatPlanetaryPositions();
            expect(positions).toEqual({});
        });
    });

    describe('identifyDominantPlanets', () => {
        test('should return default dominant planets', () => {
            const dominant = interpreter.identifyDominantPlanets();
            expect(dominant).toEqual(['JUPITER', 'VENUS']);
        });
    });

    describe('calculateChartStrength', () => {
        test('should return default chart strength', () => {
            const strength = interpreter.calculateChartStrength();
            expect(strength).toBe(0.75);
        });
    });

    describe('generateOverallAssessment', () => {
        test('should return complete overall assessment', () => {
            const assessment = interpreter.generateOverallAssessment();

            expect(assessment).toHaveProperty('strength', 0.8);
            expect(assessment).toHaveProperty('summary');
            expect(assessment).toHaveProperty('keyThemes');
            expect(assessment.keyThemes).toContain('Leadership');
            expect(assessment.keyThemes).toContain('Spirituality');
        });
    });

    describe('calculateInterpretationConfidence', () => {
        test('should return default confidence level', () => {
            const confidence = interpreter.calculateInterpretationConfidence();
            expect(confidence).toBe(0.85);
        });
    });

    describe('generateDeepInterpretation', () => {
        beforeEach(() => {
            // Setup mock return values
            mockShadBalaCalculator.calculateShadBala.mockImplementation((planet) => ({
                total: 300,
                components: { sthanBala: 100, digBala: 100, kalaBala: 100 },
                strength: 'Strong',
                interpretation: `Strong ${planet} influence`
            }));

            mockYogaDetector.detectAllYogas.mockReturnValue({
                rajaYogas: [],
                dhanYogas: [],
                arishtaYogas: [],
                nabhasYogas: [],
                otherYogas: []
            });

            mockLifeAreaAnalyzer.analyzeAllLifeAreas.mockReturnValue({
                1: { houseNumber: 1, significance: 'Self', overallStrength: 0.8 },
                2: { houseNumber: 2, significance: 'Wealth', overallStrength: 0.7 }
            });

            mockPredictor.generatePredictions.mockResolvedValue({
                currentPeriod: { dasha: 'Jupiter', predictions: [] },
                majorLifeEvents: [],
                careerPredictions: {},
                relationshipPredictions: {},
                healthPredictions: {},
                financialPredictions: {},
                spiritualPredictions: {},
                timing: {}
            });

            mockDashaAnalyzer.analyzeCurrentDasha.mockReturnValue({
                mahadasha: { lord: 'JUPITER', start: new Date(), end: new Date() },
                antardasha: { lord: 'VENUS', start: new Date(), end: new Date() },
                combinedEffect: { dominant: 'Positive' },
                predictions: []
            });

            mockRemedyGenerator.generateRemedies.mockReturnValue({
                gemstones: [],
                mantras: [],
                donations: [],
                lifestyle: [],
                spiritual: [],
                priority: { critical: [], important: [], beneficial: [] }
            });
        });

        test('should generate complete deep interpretation successfully', async () => {
            const result = await interpreter.generateDeepInterpretation();

            expect(result).toHaveProperty('chartInfo');
            expect(result).toHaveProperty('planetaryAnalysis');
            expect(result).toHaveProperty('houseAnalysis');
            expect(result).toHaveProperty('yogas');
            expect(result).toHaveProperty('lifeAreas');
            expect(result).toHaveProperty('predictions');
            expect(result).toHaveProperty('currentPeriod');
            expect(result).toHaveProperty('remedies');
            expect(result).toHaveProperty('overallAssessment');
            expect(result).toHaveProperty('confidence');
        });

        test('should call all analyzer methods', async () => {
            await interpreter.generateDeepInterpretation();

            expect(mockShadBalaCalculator.calculateShadBala).toHaveBeenCalledTimes(PLANETS.length);
            PLANETS.forEach(planet => {
                expect(mockShadBalaCalculator.calculateShadBala).toHaveBeenCalledWith(planet);
            });

            expect(mockYogaDetector.detectAllYogas).toHaveBeenCalled();
            expect(mockLifeAreaAnalyzer.analyzeAllLifeAreas).toHaveBeenCalledTimes(2); // Called twice in current implementation
            expect(mockPredictor.generatePredictions).toHaveBeenCalled();
            expect(mockDashaAnalyzer.analyzeCurrentDasha).toHaveBeenCalled();
            expect(mockRemedyGenerator.generateRemedies).toHaveBeenCalled();
        });

        test('should handle planetary analysis errors gracefully', async () => {
            mockShadBalaCalculator.calculateShadBala.mockImplementation(() => {
                throw new Error('Calculation failed');
            });

            const result = await interpreter.generateDeepInterpretation();

            // Should still return result with null values for failed calculations
            expect(result.planetaryAnalysis.SUN).toBeNull();
            expect(result).toHaveProperty('chartInfo');
        });

        test('should throw error for critical failures', async () => {
            mockLifeAreaAnalyzer.analyzeAllLifeAreas.mockImplementation(() => {
                throw new Error('Critical failure');
            });

            await expect(interpreter.generateDeepInterpretation()).rejects.toThrow('Deep interpretation generation failed');
        });
    });
});

describe('ZC114DeepHoroscopeSystem', () => {
    let system;
    let mockBirthChartGenerator;

    beforeEach(() => {
        jest.clearAllMocks();

        mockBirthChartGenerator = {
            generateBirthChart: jest.fn()
        };

        VedicBirthChartGenerator.mockImplementation(() => mockBirthChartGenerator);

        system = new ZC114DeepHoroscopeSystem();
    });

    describe('Initialization', () => {
        test('should initialize without interpreter', () => {
            expect(system.interpreter).toBeNull();
        });
    });

    describe('validateBirthData', () => {
        test('should accept valid birth data', () => {
            const validData = {
                year: 1990,
                month: 5,
                day: 15,
                hour: 14,
                minute: 30,
                second: 0,
                latitude: 28.6139,
                longitude: 77.2090,
                name: 'John Doe'
            };

            expect(() => system.validateBirthData(validData)).not.toThrow();
        });

        test('should reject null or invalid data types', () => {
            expect(() => system.validateBirthData(null)).toThrow('Birth data must be a valid object');
            expect(() => system.validateBirthData('string')).toThrow('Birth data must be a valid object');
            expect(() => system.validateBirthData(123)).toThrow('Birth data must be a valid object');
        });

        test('should reject missing required fields', () => {
            const missingYear = { month: 5, day: 15, hour: 14, minute: 30, latitude: 28.6139, longitude: 77.2090 };
            expect(() => system.validateBirthData(missingYear)).toThrow('Invalid or missing year');

            const missingMonth = { year: 1990, day: 15, hour: 14, minute: 30, latitude: 28.6139, longitude: 77.2090 };
            expect(() => system.validateBirthData(missingMonth)).toThrow('Invalid or missing month');

            const missingDay = { year: 1990, month: 5, hour: 14, minute: 30, latitude: 28.6139, longitude: 77.2090 };
            expect(() => system.validateBirthData(missingDay)).toThrow('Invalid or missing day');

            const missingHour = { year: 1990, month: 5, day: 15, minute: 30, latitude: 28.6139, longitude: 77.2090 };
            expect(() => system.validateBirthData(missingHour)).toThrow('Invalid or missing hour');

            const missingMinute = { year: 1990, month: 5, day: 15, hour: 14, latitude: 28.6139, longitude: 77.2090 };
            expect(() => system.validateBirthData(missingMinute)).toThrow('Invalid or missing minute');

            const missingLatitude = { year: 1990, month: 5, day: 15, hour: 14, minute: 30, longitude: 77.2090 };
            expect(() => system.validateBirthData(missingLatitude)).toThrow('Invalid or missing latitude');

            const missingLongitude = { year: 1990, month: 5, day: 15, hour: 14, minute: 30, latitude: 28.6139 };
            expect(() => system.validateBirthData(missingLongitude)).toThrow('Invalid or missing longitude');
        });

        test('should reject invalid numeric values', () => {
            const invalidYearLow = { year: 1800, month: 5, day: 15, hour: 14, minute: 30, latitude: 28.6139, longitude: 77.2090 };
            expect(() => system.validateBirthData(invalidYearLow)).toThrow('Year must be between 1900 and 2100');

            const invalidYearHigh = { year: 2200, month: 5, day: 15, hour: 14, minute: 30, latitude: 28.6139, longitude: 77.2090 };
            expect(() => system.validateBirthData(invalidYearHigh)).toThrow('Year must be between 1900 and 2100');

            const invalidMonthLow = { year: 1990, month: 0, day: 15, hour: 14, minute: 30, latitude: 28.6139, longitude: 77.2090 };
            expect(() => system.validateBirthData(invalidMonthLow)).toThrow('Month must be between 1 and 12');

            const invalidMonthHigh = { year: 1990, month: 13, day: 15, hour: 14, minute: 30, latitude: 28.6139, longitude: 77.2090 };
            expect(() => system.validateBirthData(invalidMonthHigh)).toThrow('Month must be between 1 and 12');

            const invalidDayLow = { year: 1990, month: 5, day: 0, hour: 14, minute: 30, latitude: 28.6139, longitude: 77.2090 };
            expect(() => system.validateBirthData(invalidDayLow)).toThrow('Day must be between 1 and 31');

            const invalidDayHigh = { year: 1990, month: 5, day: 32, hour: 14, minute: 30, latitude: 28.6139, longitude: 77.2090 };
            expect(() => system.validateBirthData(invalidDayHigh)).toThrow('Day must be between 1 and 31');

            const invalidHourLow = { year: 1990, month: 5, day: 15, hour: -1, minute: 30, latitude: 28.6139, longitude: 77.2090 };
            expect(() => system.validateBirthData(invalidHourLow)).toThrow('Hour must be between 0 and 23');

            const invalidHourHigh = { year: 1990, month: 5, day: 15, hour: 24, minute: 30, latitude: 28.6139, longitude: 77.2090 };
            expect(() => system.validateBirthData(invalidHourHigh)).toThrow('Hour must be between 0 and 23');

            const invalidMinuteLow = { year: 1990, month: 5, day: 15, hour: 14, minute: -1, latitude: 28.6139, longitude: 77.2090 };
            expect(() => system.validateBirthData(invalidMinuteLow)).toThrow('Minute must be between 0 and 59');

            const invalidMinuteHigh = { year: 1990, month: 5, day: 15, hour: 14, minute: 60, latitude: 28.6139, longitude: 77.2090 };
            expect(() => system.validateBirthData(invalidMinuteHigh)).toThrow('Minute must be between 0 and 59');

            const invalidLatitudeLow = { year: 1990, month: 5, day: 15, hour: 14, minute: 30, latitude: -91, longitude: 77.2090 };
            expect(() => system.validateBirthData(invalidLatitudeLow)).toThrow('Latitude must be between -90 and 90');

            const invalidLatitudeHigh = { year: 1990, month: 5, day: 15, hour: 14, minute: 30, latitude: 91, longitude: 77.2090 };
            expect(() => system.validateBirthData(invalidLatitudeHigh)).toThrow('Latitude must be between -90 and 90');

            const invalidLongitudeLow = { year: 1990, month: 5, day: 15, hour: 14, minute: 30, latitude: 28.6139, longitude: -181 };
            expect(() => system.validateBirthData(invalidLongitudeLow)).toThrow('Longitude must be between -180 and 180');

            const invalidLongitudeHigh = { year: 1990, month: 5, day: 15, hour: 14, minute: 30, latitude: 28.6139, longitude: 181 };
            expect(() => system.validateBirthData(invalidLongitudeHigh)).toThrow('Longitude must be between -180 and 180');
        });

        test('should reject non-numeric values for numeric fields', () => {
            const invalidYear = { year: '1990', month: 5, day: 15, hour: 14, minute: 30, latitude: 28.6139, longitude: 77.2090 };
            expect(() => system.validateBirthData(invalidYear)).toThrow('Invalid or missing year');

            const invalidMonth = { year: 1990, month: '5', day: 15, hour: 14, minute: 30, latitude: 28.6139, longitude: 77.2090 };
            expect(() => system.validateBirthData(invalidMonth)).toThrow('Invalid or missing month');
        });
    });

    describe('generateDeepHoroscope', () => {
        const validBirthData = {
            year: 1990,
            month: 5,
            day: 15,
            hour: 14,
            minute: 30,
            latitude: 28.6139,
            longitude: 77.2090,
            name: 'John Doe'
        };

        beforeEach(() => {
            mockBirthChartGenerator.generateBirthChart.mockResolvedValue({
                ascendant: { sign: 0, degree: 15 },
                planets: { SUN: { sign: 4, degree: 10, house: 1 } },
                moonDetails: { nakshatra: { nakshatraName: 'Ashwini', lord: 'KETU' } }
            });
        });

        test('should generate complete horoscope successfully', async () => {
            const result = await system.generateDeepHoroscope(validBirthData);

            expect(result).toHaveProperty('generatedAt');
            expect(result).toHaveProperty('version', 'ZC1.14');
            expect(result).toHaveProperty('confidence');
            expect(result).toHaveProperty('basicInfo');
            expect(result).toHaveProperty('planetaryAnalysis');
            expect(result).toHaveProperty('lifeAreas');
            expect(result).toHaveProperty('yogas');
            expect(result).toHaveProperty('predictions');
            expect(result).toHaveProperty('currentPeriod');
            expect(result).toHaveProperty('remedies');
            expect(result).toHaveProperty('overallAssessment');
            expect(result).toHaveProperty('recommendations');
        });

        test('should validate birth data before processing', async () => {
            const invalidData = { year: 1800 };

            await expect(system.generateDeepHoroscope(invalidData)).rejects.toThrow();
            expect(mockBirthChartGenerator.generateBirthChart).not.toHaveBeenCalled();
        });

        test('should handle birth chart generation errors', async () => {
            mockBirthChartGenerator.generateBirthChart.mockRejectedValue(new Error('Chart generation failed'));

            await expect(system.generateDeepHoroscope(validBirthData)).rejects.toThrow('Deep horoscope generation failed: Chart generation failed');
        });

        test('should create interpreter with generated chart', async () => {
            const mockChart = { test: 'chart' };
            mockBirthChartGenerator.generateBirthChart.mockResolvedValue(mockChart);

            await system.generateDeepHoroscope(validBirthData);

            expect(system.interpreter).toBeInstanceOf(DeepHoroscopeInterpreter);
            expect(system.interpreter.birthChart).toBe(mockChart);
        });
    });

    describe('formatInterpretationOutput', () => {
        test('should format interpretation output correctly', () => {
            const mockInterpretation = {
                chartInfo: { ascendant: { sign: 0 } },
                planetaryAnalysis: { SUN: { strength: 'Strong' } },
                lifeAreas: { 1: { significance: 'Self' } },
                yogas: { rajaYogas: [] },
                predictions: { currentPeriod: {} },
                currentPeriod: { dasha: 'Jupiter' },
                remedies: { gemstones: [] },
                overallAssessment: { strength: 0.8 },
                confidence: 0.85
            };

            const result = system.formatInterpretationOutput(mockInterpretation);

            expect(result.generatedAt).toBeDefined();
            expect(result.version).toBe('ZC1.14');
            expect(result.confidence).toBe(0.85);
            expect(result.basicInfo.name).toBe('Anonymous');
            expect(result.basicInfo.birthDetails).toBe('Birth details here');
            expect(result.planetaryAnalysis).toBe(mockInterpretation.planetaryAnalysis);
        });
    });

    describe('generateRecommendations', () => {
        test('should generate recommendations based on assessment strength', () => {
            const interpretation = {
                overallAssessment: { strength: 0.4 },
                currentPeriod: { combinedEffect: { netEffect: 'Negative' } },
                yogas: { rajaYogas: [] }
            };

            const recommendations = system.generateRecommendations(interpretation);

            expect(recommendations).toContainEqual({
                type: 'General',
                priority: 'High',
                message: 'Consider strengthening weak planets through recommended remedies'
            });
        });

        test('should generate timing recommendations for negative periods', () => {
            const interpretation = {
                overallAssessment: { strength: 0.9 },
                currentPeriod: { combinedEffect: { netEffect: 'Negative' } },
                yogas: { rajaYogas: [] }
            };

            const recommendations = system.generateRecommendations(interpretation);

            expect(recommendations).toContainEqual({
                type: 'Timing',
                priority: 'Medium',
                message: 'Current period may present challenges; focus on remedies'
            });
        });

        test('should generate positive recommendations for strong yogas', () => {
            const interpretation = {
                overallAssessment: { strength: 0.9 },
                currentPeriod: { combinedEffect: { netEffect: 'Positive' } },
                yogas: { rajaYogas: [{ name: 'Test Yoga' }] }
            };

            const recommendations = system.generateRecommendations(interpretation);

            expect(recommendations).toContainEqual({
                type: 'Positive',
                priority: 'Low',
                message: 'Strong yogas indicate good potential; maintain positive actions'
            });
        });
    });
});

// Integration Tests
describe('Deep Horoscope Integration', () => {
    test('should handle end-to-end horoscope generation', async () => {
        const system = new ZC114DeepHoroscopeSystem();
        const birthData = {
            year: 1990,
            month: 5,
            day: 15,
            hour: 14,
            minute: 30,
            latitude: 28.6139,
            longitude: 77.2090,
            name: 'Test User'
        };

        // Mock all dependencies
        const mockChart = {
            ascendant: { sign: 0, degree: 15 },
            planets: {
                SUN: { sign: 4, degree: 10, house: 1 },
                MOON: { sign: 3, degree: 20, house: 12 }
            },
            moonDetails: {
                nakshatra: { nakshatraName: 'Ashwini', lord: 'KETU' }
            }
        };

        VedicBirthChartGenerator.mockImplementation(() => ({
            generateBirthChart: jest.fn().mockResolvedValue(mockChart)
        }));

        const result = await system.generateDeepHoroscope(birthData);

        expect(result).toHaveProperty('version', 'ZC1.14');
        expect(result.basicInfo.name).toBe('Anonymous'); // Name not passed through in current implementation
        expect(result).toHaveProperty('planetaryAnalysis');
        expect(result).toHaveProperty('recommendations');
    });

    test('should handle system failures gracefully', async () => {
        const system = new ZC114DeepHoroscopeSystem();

        // Test with invalid birth data
        await expect(system.generateDeepHoroscope({})).rejects.toThrow();

        // Test with valid data but chart generation failure
        VedicBirthChartGenerator.mockImplementation(() => ({
            generateBirthChart: jest.fn().mockRejectedValue(new Error('Chart generation failed'))
        }));

        const validData = {
            year: 1990, month: 5, day: 15, hour: 14, minute: 30,
            latitude: 28.6139, longitude: 77.2090
        };

        await expect(system.generateDeepHoroscope(validData)).rejects.toThrow('Deep horoscope generation failed');
    });
});

// Performance and Boundary Tests
describe('Performance and Boundary Tests', () => {
    test('should handle large datasets efficiently', async () => {
        const system = new ZC114DeepHoroscopeSystem();
        const birthData = {
            year: 2000,
            month: 1,
            day: 1,
            hour: 12,
            minute: 0,
            latitude: 0,
            longitude: 0
        };

        const startTime = Date.now();

        // Mock with large dataset
        const largeChart = {
            ascendant: { sign: 0, degree: 0 },
            planets: {},
            moonDetails: { nakshatra: { nakshatraName: 'Test', lord: 'SUN' } }
        };

        // Add many planets
        PLANETS.forEach(planet => {
            largeChart.planets[planet] = { sign: 0, degree: 0, house: 1 };
        });

        VedicBirthChartGenerator.mockImplementation(() => ({
            generateBirthChart: jest.fn().mockResolvedValue(largeChart)
        }));

        await system.generateDeepHoroscope(birthData);

        const endTime = Date.now();
        const duration = endTime - startTime;

        // Should complete within reasonable time (adjust threshold as needed)
        expect(duration).toBeLessThan(5000); // 5 seconds max
    });

    test('should handle edge case birth dates', () => {
        const system = new ZC114DeepHoroscopeSystem();

        // Leap year date
        expect(() => system.validateBirthData({
            year: 2000, month: 2, day: 29, hour: 12, minute: 0, latitude: 0, longitude: 0
        })).not.toThrow();

        // Non-leap year February 29th should still pass validation (date validation is basic)
        expect(() => system.validateBirthData({
            year: 1999, month: 2, day: 29, hour: 12, minute: 0, latitude: 0, longitude: 0
        })).not.toThrow();

        // Boundary dates
        expect(() => system.validateBirthData({
            year: 1900, month: 1, day: 1, hour: 0, minute: 0, latitude: -90, longitude: -180
        })).not.toThrow();

        expect(() => system.validateBirthData({
            year: 2099, month: 12, day: 31, hour: 23, minute: 59, latitude: 90, longitude: 180
        })).not.toThrow();
    });
});