// ZC3.13 Western Relationship Counseling Marriage Timing Test Suite
// Comprehensive tests for marriage timing analysis

const {
    MarriageTimingAnalyzer,
    TransitCalculator,
    ProgressionCalculator
} = require('./western-relationship-counseling-timing');

describe('Marriage Timing Analyzer', () => {
    let synastry, composite, analyzer;

    beforeEach(() => {
        synastry = {
            interAspects: [],
            houseOverlays: []
        };

        composite = {
            positions: {},
            aspects: []
        };

        analyzer = new MarriageTimingAnalyzer(synastry, composite);
    });

    describe('Initialization', () => {
        test('should initialize with synastry and composite charts', () => {
            expect(analyzer.synastry).toBe(synastry);
            expect(analyzer.composite).toBe(composite);
            expect(analyzer.transitCalculator).toBeInstanceOf(TransitCalculator);
            expect(analyzer.progressionCalculator).toBeInstanceOf(ProgressionCalculator);
        });
    });

    describe('Marriage Timing Analysis', () => {
        test('should analyze complete marriage timing', () => {
            const currentDate = new Date('2024-01-15');
            const analysis = analyzer.analyzeMarriageTiming(currentDate);

            expect(analysis).toHaveProperty('currentTiming');
            expect(analysis).toHaveProperty('futureWindows');
            expect(analysis).toHaveProperty('challengingPeriods');
            expect(analysis).toHaveProperty('optimalDates');
            expect(analysis).toHaveProperty('counseling');
        });

        test('should analyze current timing', () => {
            const currentDate = new Date('2024-01-15');
            const timing = analyzer.analyzeCurrentTiming(currentDate);

            expect(timing).toHaveProperty('score');
            expect(timing).toHaveProperty('rating');
            expect(timing).toHaveProperty('factors');

            expect(typeof timing.score).toBe('number');
            expect(timing.score).toBeGreaterThanOrEqual(0);
            expect(timing.score).toBeLessThanOrEqual(100);
            expect(typeof timing.rating).toBe('string');
            expect(Array.isArray(timing.factors)).toBe(true);
        });

        test('should find future windows', () => {
            const startDate = new Date('2024-01-15');
            const windows = analyzer.findFutureWindows(startDate, 30);

            expect(Array.isArray(windows)).toBe(true);
            expect(windows.length).toBeLessThanOrEqual(10);

            windows.forEach(window => {
                expect(window).toHaveProperty('date');
                expect(window).toHaveProperty('score');
                expect(window).toHaveProperty('rating');
                expect(window.score).toBeGreaterThanOrEqual(70);
            });
        });

        test('should identify challenging periods', () => {
            const startDate = new Date('2024-01-15');
            const periods = analyzer.identifyChallengingPeriods(startDate, 60);

            expect(Array.isArray(periods)).toBe(true);

            periods.forEach(period => {
                expect(period).toHaveProperty('date');
                expect(period).toHaveProperty('score');
                expect(period).toHaveProperty('rating');
                expect(period).toHaveProperty('counseling');
                expect(period.score).toBeLessThanOrEqual(40);
            });
        });

        test('should calculate optimal dates', () => {
            const startDate = new Date('2024-01-15');
            const optimal = analyzer.calculateOptimalDates(startDate, 365);

            expect(Array.isArray(optimal)).toBe(true);

            optimal.forEach(date => {
                expect(date).toHaveProperty('date');
                expect(date).toHaveProperty('type');
                expect(date).toHaveProperty('significance');
            });
        });

        test('should generate timing counseling', () => {
            const date = new Date('2024-01-15');
            const counseling = analyzer.generateTimingCounseling(date);

            expect(counseling).toHaveProperty('currentAdvice');
            expect(counseling).toHaveProperty('longTermPlanning');
            expect(counseling).toHaveProperty('decisionMaking');

            expect(typeof counseling.currentAdvice).toBe('string');
            expect(typeof counseling.longTermPlanning).toBe('string');
            expect(typeof counseling.decisionMaking).toBe('string');
        });
    });

    describe('Transit Analysis', () => {
        test('should detect positive Venus transit', () => {
            const transits = [
                { planet: 'VENUS', aspect: 'TRINE' }
            ];

            expect(analyzer.hasPositiveVenusTransit(transits)).toBe(true);
        });

        test('should detect positive Jupiter transit', () => {
            const transits = [
                { planet: 'JUPITER', aspect: 'CONJUNCTION' }
            ];

            expect(analyzer.hasPositiveJupiterTransit(transits)).toBe(true);
        });

        test('should detect Saturn transit', () => {
            const transits = [
                { planet: 'SATURN', aspect: 'SQUARE' }
            ];

            expect(analyzer.hasSaturnTransit(transits)).toBe(true);
        });

        test('should detect challenging transits', () => {
            const transits = [
                { planet: 'SATURN', aspect: 'SQUARE' }
            ];

            expect(analyzer.hasChallengingTransits(transits)).toBe(true);
        });

        test('should not detect positive aspects for negative transits', () => {
            const transits = [
                { planet: 'VENUS', aspect: 'SQUARE' }
            ];

            expect(analyzer.hasPositiveVenusTransit(transits)).toBe(false);
        });
    });

    describe('Timing Ratings', () => {
        test('should rate excellent timing', () => {
            const rating = analyzer.getTimingRating(85);
            expect(rating).toBe('Excellent');
        });

        test('should rate very good timing', () => {
            const rating = analyzer.getTimingRating(75);
            expect(rating).toBe('Very Good');
        });

        test('should rate good timing', () => {
            const rating = analyzer.getTimingRating(65);
            expect(rating).toBe('Good');
        });

        test('should rate moderate timing', () => {
            const rating = analyzer.getTimingRating(55);
            expect(rating).toBe('Moderate');
        });

        test('should rate challenging timing', () => {
            const rating = analyzer.getTimingRating(45);
            expect(rating).toBe('Challenging');
        });

        test('should rate difficult timing', () => {
            const rating = analyzer.getTimingRating(35);
            expect(rating).toBe('Difficult');
        });
    });

    describe('Timing Factors', () => {
        test('should identify positive timing factors', () => {
            const transits = [
                { planet: 'VENUS', aspect: 'TRINE', description: 'Venus trine supports commitment' },
                { planet: 'JUPITER', aspect: 'CONJUNCTION', description: 'Jupiter conjunction brings expansion' }
            ];

            const progressions = {};
            const factors = analyzer.identifyTimingFactors(transits, progressions);

            expect(Array.isArray(factors)).toBe(true);
            expect(factors.length).toBe(2);

            factors.forEach(factor => {
                expect(factor).toHaveProperty('type', 'positive');
                expect(factor).toHaveProperty('description');
            });
        });

        test('should return empty array for no positive factors', () => {
            const transits = [
                { planet: 'SATURN', aspect: 'SQUARE' }
            ];

            const progressions = {};
            const factors = analyzer.identifyTimingFactors(transits, progressions);

            expect(Array.isArray(factors)).toBe(true);
            expect(factors.length).toBe(0);
        });
    });

    describe('Venus-Jupiter Alignment', () => {
        test('should detect Venus-Jupiter aligned dates', () => {
            // Test with day 15 (in the allowed days)
            const date = new Date('2024-01-15');
            expect(analyzer.isVenusJupiterAligned(date)).toBe(true);
        });

        test('should detect Venus-Jupiter aligned dates for day 22', () => {
            const date = new Date('2024-01-22');
            expect(analyzer.isVenusJupiterAligned(date)).toBe(true);
        });

        test('should not detect alignment for other days', () => {
            const date = new Date('2024-01-10');
            expect(analyzer.isVenusJupiterAligned(date)).toBe(false);
        });
    });

    describe('Counseling Advice', () => {
        test('should provide favorable timing advice', () => {
            const advice = analyzer.getCurrentTimingAdvice(75);

            expect(advice).toContain('favorable');
            expect(advice).toContain('relationship decisions');
        });

        test('should provide moderate timing advice', () => {
            const advice = analyzer.getCurrentTimingAdvice(55);

            expect(advice).toContain('moderate');
            expect(advice).toContain('awareness');
        });

        test('should provide caution timing advice', () => {
            const advice = analyzer.getCurrentTimingAdvice(35);

            expect(advice).toContain('caution');
            expect(advice).toContain('major relationship decisions');
        });

        test('should provide long-term planning advice', () => {
            const advice = analyzer.getLongTermPlanningAdvice(75);

            expect(advice).toContain('Consider moving forward');
        });

        test('should provide decision-making advice', () => {
            const advice = analyzer.getDecisionMakingAdvice(85);

            expect(advice).toContain('confidence');
            expect(advice).toContain('strongly supports');
        });
    });
});

describe('Transit Calculator', () => {
    let calculator;

    beforeEach(() => {
        calculator = new TransitCalculator();
    });

    describe('Transit Calculation', () => {
        test('should return transit data', () => {
            const transits = calculator.getTransits(new Date());

            expect(Array.isArray(transits)).toBe(true);
            expect(transits.length).toBeGreaterThan(0);

            transits.forEach(transit => {
                expect(transit).toHaveProperty('planet');
                expect(transit).toHaveProperty('aspect');
                expect(transit).toHaveProperty('strength');
            });
        });

        test('should include Venus and Jupiter transits', () => {
            const transits = calculator.getTransits(new Date());

            const hasVenus = transits.some(t => t.planet === 'VENUS');
            const hasJupiter = transits.some(t => t.planet === 'JUPITER');

            expect(hasVenus).toBe(true);
            expect(hasJupiter).toBe(true);
        });
    });
});

describe('Progression Calculator', () => {
    let calculator;

    beforeEach(() => {
        calculator = new ProgressionCalculator();
    });

    describe('Progression Calculation', () => {
        test('should return progression data', () => {
            const progressions = calculator.getProgressions(new Date());

            expect(typeof progressions).toBe('object');
        });
    });
});