/**
 * Comprehensive Unit Tests for Yoga Formation Analyzer
 *
 * Tests the ZC1.24 Yoga Formation Analysis and Interpretation algorithms
 * including Raja Yoga, Dhana Yoga, Mahapurusha Yoga, and special yogas.
 * Covers all algorithms from the reference document with comprehensive edge cases.
 *
 * @module yoga-formation-analyzer-test
 * @version 2.0.0
 */

const {
    YogaDetector,
    YOGA_CONSTANTS,
    PLANETARY_RELATIONSHIPS,
    SIGN_LORDS,
    PLANETARY_DIGNITIES,
    YOGA_CATEGORIES,
    YOGA_STRENGTH_LEVELS,
    calculateDignityStrength,
    isInKendra,
    isInTrikona,
    calculateAspectStrength,
    getHouseLord,
    calculateYogaStrength
} = require('./yoga-formation-analyzer');

describe('Yoga Formation Analyzer - Comprehensive Test Suite', () => {
    // Sample birth charts for testing different scenarios
    const sampleBirthChart = {
        ascendant: { sign: 0 }, // Aries ascendant
        planets: {
            SUN: { longitude: 30, house: 1 },      // Leo in 1st
            MOON: { longitude: 33, house: 1 },     // Cancer in 1st
            MARS: { longitude: 0, house: 1 },      // Aries in 1st
            MERCURY: { longitude: 60, house: 2 },  // Virgo in 2nd
            JUPITER: { longitude: 240, house: 9 }, // Sagittarius in 9th
            VENUS: { longitude: 270, house: 10 },  // Capricorn in 10th
            SATURN: { longitude: 300, house: 11 }, // Aquarius in 11th
            RAHU: { longitude: 120, house: 4 },    // Taurus in 4th
            KETU: { longitude: 300, house: 10 }    // Aquarius in 10th
        }
    };

    // Chart for testing Kendra-Trikona Raja Yoga
    const kendraTrikonaChart = {
        ascendant: { sign: 0 }, // Aries ascendant
        planets: {
            SUN: { longitude: 30, house: 1 },
            MOON: { longitude: 33, house: 1 },
            MARS: { longitude: 0, house: 1 },      // Mars in Aries (own sign) in 1st
            MERCURY: { longitude: 150, house: 5 }, // Mercury in Leo (enemy) in 5th
            JUPITER: { longitude: 240, house: 9 }, // Jupiter in Sagittarius (own) in 9th
            VENUS: { longitude: 270, house: 10 },  // Venus in Capricorn (neutral) in 10th
            SATURN: { longitude: 300, house: 11 }, // Saturn in Aquarius (own) in 11th
            RAHU: { longitude: 120, house: 4 },
            KETU: { longitude: 300, house: 10 }
        }
    };

    // Chart for testing Dharma-Karma Raja Yoga
    const dharmaKarmaChart = {
        ascendant: { sign: 0 }, // Aries ascendant
        planets: {
            SUN: { longitude: 30, house: 1 },
            MOON: { longitude: 33, house: 1 },
            MARS: { longitude: 0, house: 1 },
            MERCURY: { longitude: 60, house: 2 },
            JUPITER: { longitude: 240, house: 9 }, // Jupiter (9th lord) in 9th
            VENUS: { longitude: 270, house: 10 },  // Venus (10th lord) in 10th
            SATURN: { longitude: 300, house: 11 },
            RAHU: { longitude: 120, house: 4 },
            KETU: { longitude: 300, house: 10 }
        }
    };

    // Chart for testing Pancha Mahapurusha Yoga
    const panchaMahapurushaChart = {
        ascendant: { sign: 9 }, // Capricorn ascendant
        planets: {
            SUN: { longitude: 30, house: 1 },
            MOON: { longitude: 33, house: 1 },
            MARS: { longitude: 270, house: 1 }, // Mars in Capricorn (exalted) in 1st (kendra)
            MERCURY: { longitude: 60, house: 2 },
            JUPITER: { longitude: 240, house: 9 },
            VENUS: { longitude: 270, house: 10 },
            SATURN: { longitude: 300, house: 11 },
            RAHU: { longitude: 120, house: 4 },
            KETU: { longitude: 300, house: 10 }
        }
    };

    // Chart for testing Gaja Kesari Yoga
    const gajaKesariChart = {
        ascendant: { sign: 0 },
        planets: {
            SUN: { longitude: 30, house: 1 },
            MOON: { longitude: 33, house: 1 },     // Moon in 1st
            MARS: { longitude: 0, house: 1 },
            MERCURY: { longitude: 60, house: 2 },
            JUPITER: { longitude: 240, house: 7 }, // Jupiter in 7th (kendra from Moon in 1st)
            VENUS: { longitude: 270, house: 10 },
            SATURN: { longitude: 300, house: 11 },
            RAHU: { longitude: 120, house: 4 },
            KETU: { longitude: 300, house: 10 }
        }
    };

    // Chart for testing Neecha Bhanga Yoga
    const neechaBhangaChart = {
        ascendant: { sign: 0 },
        planets: {
            SUN: { longitude: 180, house: 7 }, // Sun in Libra (debilitated) in 7th (kendra)
            MOON: { longitude: 33, house: 1 },
            MARS: { longitude: 0, house: 1 },
            MERCURY: { longitude: 60, house: 2 },
            JUPITER: { longitude: 240, house: 9 },
            VENUS: { longitude: 270, house: 10 },
            SATURN: { longitude: 300, house: 11 },
            RAHU: { longitude: 120, house: 4 },
            KETU: { longitude: 300, house: 10 }
        }
    };

    // Chart for testing Viparita Raja Yoga
    const viparitaRajaChart = {
        ascendant: { sign: 0 },
        planets: {
            SUN: { longitude: 30, house: 1 },
            MOON: { longitude: 33, house: 1 },
            MARS: { longitude: 0, house: 1 },
            MERCURY: { longitude: 60, house: 8 }, // Mercury in 8th (malefic house)
            JUPITER: { longitude: 240, house: 9 },
            VENUS: { longitude: 270, house: 10 },
            SATURN: { longitude: 300, house: 11 },
            RAHU: { longitude: 120, house: 4 },
            KETU: { longitude: 300, house: 10 }
        }
    };

    describe('YogaDetector Class', () => {
        test('should create YogaDetector instance with valid birth chart', () => {
            const detector = new YogaDetector(sampleBirthChart);
            expect(detector).toBeInstanceOf(YogaDetector);
            expect(detector.birthChart).toBe(sampleBirthChart);
        });

        test('should throw error with invalid birth chart', () => {
            expect(() => new YogaDetector(null)).toThrow('Birth chart validation failed');
            expect(() => new YogaDetector({})).toThrow('Birth chart validation failed');
            expect(() => new YogaDetector({ planets: {} })).toThrow('Birth chart validation failed');
        });

        test('should validate planet data correctly', () => {
            const invalidChart = {
                ascendant: { sign: 0 },
                planets: {
                    SUN: { longitude: 'invalid', house: 1 }
                }
            };
            expect(() => new YogaDetector(invalidChart)).toThrow('Birth chart validation failed');
        });

        test('should detect yogas successfully', () => {
            const detector = new YogaDetector(sampleBirthChart);
            const yogas = detector.detectAllYogas();
            expect(Array.isArray(yogas)).toBe(true);
            yogas.forEach(yoga => {
                expect(yoga).toHaveProperty('name');
                expect(yoga).toHaveProperty('strength');
                expect(yoga.strength).toBeGreaterThanOrEqual(0);
                expect(yoga.strength).toBeLessThanOrEqual(1);
            });
        });
    });

    describe('Utility Functions', () => {
        test('calculateDignityStrength should return correct multipliers', () => {
            expect(calculateDignityStrength('SUN', 0)).toBe(YOGA_CONSTANTS.EXALTED_MULTIPLIER); // Aries (exalted)
            expect(calculateDignityStrength('SUN', 5)).toBe(YOGA_CONSTANTS.OWN_SIGN_MULTIPLIER); // Leo (own sign)
            expect(calculateDignityStrength('SUN', 3)).toBe(YOGA_CONSTANTS.ENEMY_SIGN_MULTIPLIER); // Cancer (enemy)
            expect(calculateDignityStrength('SUN', 1)).toBe(1.0); // Taurus (neutral)
        });

        test('isInKendra should identify kendra houses', () => {
            expect(isInKendra(1)).toBe(true);
            expect(isInKendra(4)).toBe(true);
            expect(isInKendra(7)).toBe(true);
            expect(isInKendra(10)).toBe(true);
            expect(isInKendra(2)).toBe(false);
            expect(isInKendra(5)).toBe(false);
        });

        test('isInTrikona should identify trikona houses', () => {
            expect(isInTrikona(1)).toBe(true);
            expect(isInTrikona(5)).toBe(true);
            expect(isInTrikona(9)).toBe(true);
            expect(isInTrikona(2)).toBe(false);
            expect(isInTrikona(7)).toBe(false);
        });

        test('calculateAspectStrength should return correct aspect values', () => {
            expect(calculateAspectStrength(1, 7)).toBe(YOGA_CONSTANTS.FULL_ASPECT); // 7th aspect
            expect(calculateAspectStrength(1, 4)).toBe(YOGA_CONSTANTS.THREE_QUARTER_ASPECT); // 4th aspect
            expect(calculateAspectStrength(1, 5)).toBe(YOGA_CONSTANTS.HALF_ASPECT); // 5th aspect
            expect(calculateAspectStrength(1, 2)).toBe(YOGA_CONSTANTS.QUARTER_ASPECT); // 2nd aspect
            expect(calculateAspectStrength(1, 3)).toBe(0); // No aspect
        });

        test('getHouseLord should return correct house lords', () => {
            expect(getHouseLord(1, 0)).toBe('MARS'); // Aries ascendant, 1st lord Mars
            expect(getHouseLord(4, 0)).toBe('VENUS'); // Aries ascendant, 4th lord Venus
            expect(getHouseLord(7, 0)).toBe('VENUS'); // Aries ascendant, 7th lord Venus
            expect(getHouseLord(10, 0)).toBe('MARS'); // Aries ascendant, 10th lord Mars
        });

        test('calculateYogaStrength should compute average strength', () => {
            const strength = calculateYogaStrength(sampleBirthChart, ['SUN', 'MOON']);
            expect(typeof strength).toBe('number');
            expect(strength).toBeGreaterThanOrEqual(0);
            expect(strength).toBeLessThanOrEqual(1);
        });
    });

    describe('Yoga Detection Algorithms - Comprehensive Coverage', () => {
        describe('Raja Yoga Algorithms', () => {
            test('should detect Kendra-Trikona Raja Yoga with parivartana', () => {
                const detector = new YogaDetector(kendraTrikonaChart);
                const rajaYogas = detector.detectRajaYogas();

                const kendraTrikona = rajaYogas.find(yoga => yoga.name === 'Kendra-Trikona Raja Yoga');
                expect(kendraTrikona).toBeDefined();
                expect(kendraTrikona.type).toBe('PARIVARTANA');
                expect(kendraTrikona.strength).toBeGreaterThanOrEqual(YOGA_CONSTANTS.MINIMUM_YOGA_STRENGTH);
                expect(kendraTrikona.planets).toContain('MARS');
                expect(kendraTrikona.planets).toContain('JUPITER');
            });

            test('should detect Dharma-Karma Raja Yoga with mutual kendras', () => {
                const detector = new YogaDetector(dharmaKarmaChart);
                const rajaYogas = detector.detectRajaYogas();

                const dharmaKarma = rajaYogas.find(yoga => yoga.name === 'Dharma-Karma Raja Yoga');
                expect(dharmaKarma).toBeDefined();
                expect(dharmaKarma.type).toBe('MUTUAL_HOUSES');
                expect(dharmaKarma.strength).toBeGreaterThanOrEqual(YOGA_CONSTANTS.MINIMUM_YOGA_STRENGTH);
                expect(dharmaKarma.planets).toEqual(['JUPITER', 'VENUS']);
                expect(dharmaKarma.houses).toEqual([9, 10]);
            });

            test('should detect Dharma-Karma Raja Yoga with both lords in kendras', () => {
                const chartWithBothInKendras = {
                    ascendant: { sign: 0 },
                    planets: {
                        SUN: { longitude: 30, house: 1 },
                        MOON: { longitude: 33, house: 1 },
                        MARS: { longitude: 0, house: 1 },
                        MERCURY: { longitude: 60, house: 2 },
                        JUPITER: { longitude: 240, house: 4 }, // 9th lord in 4th (kendra)
                        VENUS: { longitude: 270, house: 7 },   // 10th lord in 7th (kendra)
                        SATURN: { longitude: 300, house: 11 },
                        RAHU: { longitude: 120, house: 4 },
                        KETU: { longitude: 300, house: 10 }
                    }
                };

                const detector = new YogaDetector(chartWithBothInKendras);
                const rajaYogas = detector.detectRajaYogas();

                const dharmaKarma = rajaYogas.find(yoga => yoga.name === 'Dharma-Karma Raja Yoga');
                expect(dharmaKarma).toBeDefined();
                expect(dharmaKarma.type).toBe('BOTH_IN_KENDRAS');
            });

            test('should detect Dharma-Karma Raja Yoga with mutual aspect', () => {
                const chartWithAspect = {
                    ascendant: { sign: 0 },
                    planets: {
                        SUN: { longitude: 30, house: 1 },
                        MOON: { longitude: 33, house: 1 },
                        MARS: { longitude: 0, house: 1 },
                        MERCURY: { longitude: 60, house: 2 },
                        JUPITER: { longitude: 240, house: 9 }, // 9th lord in 9th
                        VENUS: { longitude: 270, house: 3 },   // 10th lord in 3rd (aspects 9th)
                        SATURN: { longitude: 300, house: 11 },
                        RAHU: { longitude: 120, house: 4 },
                        KETU: { longitude: 300, house: 10 }
                    }
                };

                const detector = new YogaDetector(chartWithAspect);
                const rajaYogas = detector.detectRajaYogas();

                const dharmaKarma = rajaYogas.find(yoga => yoga.name === 'Dharma-Karma Raja Yoga');
                expect(dharmaKarma).toBeDefined();
                expect(dharmaKarma.type).toBe('MUTUAL_ASPECT');
            });

            test('should not detect weak Dharma-Karma combinations', () => {
                const weakChart = {
                    ascendant: { sign: 0 },
                    planets: {
                        SUN: { longitude: 30, house: 1 },
                        MOON: { longitude: 33, house: 1 },
                        MARS: { longitude: 0, house: 1 },
                        MERCURY: { longitude: 60, house: 2 },
                        JUPITER: { longitude: 240, house: 12 }, // 9th lord in 12th (weak)
                        VENUS: { longitude: 270, house: 8 },    // 10th lord in 8th (weak)
                        SATURN: { longitude: 300, house: 11 },
                        RAHU: { longitude: 120, house: 4 },
                        KETU: { longitude: 300, house: 10 }
                    }
                };

                const detector = new YogaDetector(weakChart);
                const rajaYogas = detector.detectRajaYogas();

                const dharmaKarma = rajaYogas.find(yoga => yoga.name === 'Dharma-Karma Raja Yoga');
                expect(dharmaKarma).toBeUndefined();
            });
        });

        describe('Dhana Yoga Algorithms', () => {
            test('should detect Labha-Dhana Yoga with mutual houses', () => {
                const labhaDhanaChart = {
                    ascendant: { sign: 0 },
                    planets: {
                        SUN: { longitude: 30, house: 1 },
                        MOON: { longitude: 33, house: 1 },
                        MARS: { longitude: 0, house: 1 },
                        MERCURY: { longitude: 60, house: 2 },  // 2nd lord in 2nd
                        JUPITER: { longitude: 240, house: 11 }, // 11th lord in 11th
                        VENUS: { longitude: 270, house: 10 },
                        SATURN: { longitude: 300, house: 11 },
                        RAHU: { longitude: 120, house: 4 },
                        KETU: { longitude: 300, house: 10 }
                    }
                };

                const detector = new YogaDetector(labhaDhanaChart);
                const dhanaYogas = detector.detectDhanaYogas();

                const labhaDhana = dhanaYogas.find(yoga => yoga.name === 'Labha-Dhana Yoga');
                expect(labhaDhana).toBeDefined();
                expect(labhaDhana.type).toBe('MUTUAL_HOUSES');
                expect(labhaDhana.strength).toBeGreaterThanOrEqual(YOGA_CONSTANTS.MINIMUM_YOGA_STRENGTH);
            });

            test('should detect Labha-Dhana Yoga with both lords in dhana houses', () => {
                const bothInDhanaChart = {
                    ascendant: { sign: 0 },
                    planets: {
                        SUN: { longitude: 30, house: 1 },
                        MOON: { longitude: 33, house: 1 },
                        MARS: { longitude: 0, house: 1 },
                        MERCURY: { longitude: 60, house: 11 }, // 2nd lord in 11th (dhana)
                        JUPITER: { longitude: 240, house: 2 },  // 11th lord in 2nd (dhana)
                        VENUS: { longitude: 270, house: 10 },
                        SATURN: { longitude: 300, house: 11 },
                        RAHU: { longitude: 120, house: 4 },
                        KETU: { longitude: 300, house: 10 }
                    }
                };

                const detector = new YogaDetector(bothInDhanaChart);
                const dhanaYogas = detector.detectDhanaYogas();

                const labhaDhana = dhanaYogas.find(yoga => yoga.name === 'Labha-Dhana Yoga');
                expect(labhaDhana).toBeDefined();
                expect(labhaDhana.type).toBe('BOTH_IN_DHANA_HOUSES');
            });

            test('should detect Jupiter-Venus Dhana Yoga in dhana houses', () => {
                const jupiterVenusChart = {
                    ascendant: { sign: 0 },
                    planets: {
                        SUN: { longitude: 30, house: 1 },
                        MOON: { longitude: 33, house: 1 },
                        MARS: { longitude: 0, house: 1 },
                        MERCURY: { longitude: 60, house: 2 },
                        JUPITER: { longitude: 240, house: 2 }, // Jupiter in 2nd (dhana)
                        VENUS: { longitude: 270, house: 11 },  // Venus in 11th (dhana)
                        SATURN: { longitude: 300, house: 11 },
                        RAHU: { longitude: 120, house: 4 },
                        KETU: { longitude: 300, house: 10 }
                    }
                };

                const detector = new YogaDetector(jupiterVenusChart);
                const dhanaYogas = detector.detectDhanaYogas();

                const jupiterVenus = dhanaYogas.find(yoga => yoga.name === 'Jupiter-Venus Dhana Yoga');
                expect(jupiterVenus).toBeDefined();
                expect(jupiterVenus.type).toBe('BOTH_IN_DHANA_HOUSES');
                expect(jupiterVenus.planets).toEqual(['JUPITER', 'VENUS']);
            });

            test('should detect Jupiter-Venus Dhana Yoga in trikona houses', () => {
                const jupiterVenusTrikonaChart = {
                    ascendant: { sign: 0 },
                    planets: {
                        SUN: { longitude: 30, house: 1 },
                        MOON: { longitude: 33, house: 1 },
                        MARS: { longitude: 0, house: 1 },
                        MERCURY: { longitude: 60, house: 2 },
                        JUPITER: { longitude: 240, house: 5 }, // Jupiter in 5th (trikona)
                        VENUS: { longitude: 270, house: 9 },   // Venus in 9th (trikona)
                        SATURN: { longitude: 300, house: 11 },
                        RAHU: { longitude: 120, house: 4 },
                        KETU: { longitude: 300, house: 10 }
                    }
                };

                const detector = new YogaDetector(jupiterVenusTrikonaChart);
                const dhanaYogas = detector.detectDhanaYogas();

                const jupiterVenus = dhanaYogas.find(yoga => yoga.name === 'Jupiter-Venus Dhana Yoga');
                expect(jupiterVenus).toBeDefined();
                expect(jupiterVenus.type).toBe('BOTH_IN_TRIKONA_HOUSES');
            });

            test('should detect Jupiter-Venus Dhana Yoga with mutual aspect', () => {
                const jupiterVenusAspectChart = {
                    ascendant: { sign: 0 },
                    planets: {
                        SUN: { longitude: 30, house: 1 },
                        MOON: { longitude: 33, house: 1 },
                        MARS: { longitude: 0, house: 1 },
                        MERCURY: { longitude: 60, house: 2 },
                        JUPITER: { longitude: 240, house: 9 }, // Jupiter in 9th
                        VENUS: { longitude: 270, house: 3 },   // Venus in 3rd (aspects 9th)
                        SATURN: { longitude: 300, house: 11 },
                        RAHU: { longitude: 120, house: 4 },
                        KETU: { longitude: 300, house: 10 }
                    }
                };

                const detector = new YogaDetector(jupiterVenusAspectChart);
                const dhanaYogas = detector.detectDhanaYogas();

                const jupiterVenus = dhanaYogas.find(yoga => yoga.name === 'Jupiter-Venus Dhana Yoga');
                expect(jupiterVenus).toBeDefined();
                expect(jupiterVenus.type).toBe('MUTUAL_ASPECT');
            });
        });

        describe('Mahapurusha Yoga Algorithms', () => {
            test('should detect Ruchaka Yoga (Mars Mahapurusha)', () => {
                const detector = new YogaDetector(panchaMahapurushaChart);
                const mahapurushaYogas = detector.detectMahapurushaYogas();

                const ruchaka = mahapurushaYogas.find(yoga => yoga.name === 'Ruchaka Yoga');
                expect(ruchaka).toBeDefined();
                expect(ruchaka.type).toBe('PANCHA_MAHAPURUSHA');
                expect(ruchaka.planet).toBe('MARS');
                expect(ruchaka.strength).toBe(YOGA_CONSTANTS.EXALTED_MULTIPLIER);
            });

            test('should detect Bhadra Yoga (Mercury Mahapurusha)', () => {
                const mercuryExaltedChart = {
                    ascendant: { sign: 5 }, // Virgo ascendant
                    planets: {
                        SUN: { longitude: 30, house: 1 },
                        MOON: { longitude: 33, house: 1 },
                        MARS: { longitude: 0, house: 1 },
                        MERCURY: { longitude: 150, house: 1 }, // Mercury in Virgo (exalted) in 1st (kendra)
                        JUPITER: { longitude: 240, house: 9 },
                        VENUS: { longitude: 270, house: 10 },
                        SATURN: { longitude: 300, house: 11 },
                        RAHU: { longitude: 120, house: 4 },
                        KETU: { longitude: 300, house: 10 }
                    }
                };

                const detector = new YogaDetector(mercuryExaltedChart);
                const mahapurushaYogas = detector.detectMahapurushaYogas();

                const bhadra = mahapurushaYogas.find(yoga => yoga.name === 'Bhadra Yoga');
                expect(bhadra).toBeDefined();
                expect(bhadra.planet).toBe('MERCURY');
                expect(bhadra.strength).toBe(YOGA_CONSTANTS.EXALTED_MULTIPLIER);
            });

            test('should detect Hamsa Yoga (Jupiter Mahapurusha)', () => {
                const jupiterOwnSignChart = {
                    ascendant: { sign: 8 }, // Sagittarius ascendant
                    planets: {
                        SUN: { longitude: 30, house: 1 },
                        MOON: { longitude: 33, house: 1 },
                        MARS: { longitude: 0, house: 1 },
                        MERCURY: { longitude: 60, house: 2 },
                        JUPITER: { longitude: 240, house: 1 }, // Jupiter in Sagittarius (own) in 1st (kendra)
                        VENUS: { longitude: 270, house: 10 },
                        SATURN: { longitude: 300, house: 11 },
                        RAHU: { longitude: 120, house: 4 },
                        KETU: { longitude: 300, house: 10 }
                    }
                };

                const detector = new YogaDetector(jupiterOwnSignChart);
                const mahapurushaYogas = detector.detectMahapurushaYogas();

                const hamsa = mahapurushaYogas.find(yoga => yoga.name === 'Hamsa Yoga');
                expect(hamsa).toBeDefined();
                expect(hamsa.planet).toBe('JUPITER');
                expect(hamsa.strength).toBe(YOGA_CONSTANTS.OWN_SIGN_MULTIPLIER);
            });

            test('should detect Malavya Yoga (Venus Mahapurusha)', () => {
                const venusOwnSignChart = {
                    ascendant: { sign: 6 }, // Libra ascendant
                    planets: {
                        SUN: { longitude: 30, house: 1 },
                        MOON: { longitude: 33, house: 1 },
                        MARS: { longitude: 0, house: 1 },
                        MERCURY: { longitude: 60, house: 2 },
                        JUPITER: { longitude: 240, house: 9 },
                        VENUS: { longitude: 180, house: 1 }, // Venus in Libra (own) in 1st (kendra)
                        SATURN: { longitude: 300, house: 11 },
                        RAHU: { longitude: 120, house: 4 },
                        KETU: { longitude: 300, house: 10 }
                    }
                };

                const detector = new YogaDetector(venusOwnSignChart);
                const mahapurushaYogas = detector.detectMahapurushaYogas();

                const malavya = mahapurushaYogas.find(yoga => yoga.name === 'Malavya Yoga');
                expect(malavya).toBeDefined();
                expect(malavya.planet).toBe('VENUS');
            });

            test('should detect Sasha Yoga (Saturn Mahapurusha)', () => {
                const saturnOwnSignChart = {
                    ascendant: { sign: 10 }, // Aquarius ascendant
                    planets: {
                        SUN: { longitude: 30, house: 1 },
                        MOON: { longitude: 33, house: 1 },
                        MARS: { longitude: 0, house: 1 },
                        MERCURY: { longitude: 60, house: 2 },
                        JUPITER: { longitude: 240, house: 9 },
                        VENUS: { longitude: 270, house: 10 },
                        SATURN: { longitude: 300, house: 1 }, // Saturn in Aquarius (own) in 1st (kendra)
                        RAHU: { longitude: 120, house: 4 },
                        KETU: { longitude: 300, house: 10 }
                    }
                };

                const detector = new YogaDetector(saturnOwnSignChart);
                const mahapurushaYogas = detector.detectMahapurushaYogas();

                const sasha = mahapurushaYogas.find(yoga => yoga.name === 'Sasha Yoga');
                expect(sasha).toBeDefined();
                expect(sasha.planet).toBe('SATURN');
            });

            test('should detect general Mahapurusha Yoga for Sun', () => {
                const sunOwnSignChart = {
                    ascendant: { sign: 4 }, // Leo ascendant
                    planets: {
                        SUN: { longitude: 120, house: 1 }, // Sun in Leo (own) in 1st (kendra)
                        MOON: { longitude: 33, house: 1 },
                        MARS: { longitude: 0, house: 1 },
                        MERCURY: { longitude: 60, house: 2 },
                        JUPITER: { longitude: 240, house: 9 },
                        VENUS: { longitude: 270, house: 10 },
                        SATURN: { longitude: 300, house: 11 },
                        RAHU: { longitude: 120, house: 4 },
                        KETU: { longitude: 300, house: 10 }
                    }
                };

                const detector = new YogaDetector(sunOwnSignChart);
                const mahapurushaYogas = detector.detectMahapurushaYogas();

                const sunMahapurusha = mahapurushaYogas.find(yoga => yoga.name === 'SUN Mahapurusha Yoga');
                expect(sunMahapurusha).toBeDefined();
                expect(sunMahapurusha.planet).toBe('SUN');
                expect(sunMahapurusha.type).toBe('GENERAL_MAHAPURUSHA');
            });

            test('should not detect Mahapurusha Yoga when planet not in kendra', () => {
                const marsNotInKendraChart = {
                    ascendant: { sign: 9 },
                    planets: {
                        SUN: { longitude: 30, house: 1 },
                        MOON: { longitude: 33, house: 1 },
                        MARS: { longitude: 270, house: 2 }, // Mars exalted but in 2nd (not kendra)
                        MERCURY: { longitude: 60, house: 2 },
                        JUPITER: { longitude: 240, house: 9 },
                        VENUS: { longitude: 270, house: 10 },
                        SATURN: { longitude: 300, house: 11 },
                        RAHU: { longitude: 120, house: 4 },
                        KETU: { longitude: 300, house: 10 }
                    }
                };

                const detector = new YogaDetector(marsNotInKendraChart);
                const mahapurushaYogas = detector.detectMahapurushaYogas();

                const ruchaka = mahapurushaYogas.find(yoga => yoga.name === 'Ruchaka Yoga');
                expect(ruchaka).toBeUndefined();
            });
        });

        describe('Special Yoga Algorithms', () => {
            test('should detect Gaja Kesari Yoga', () => {
                const detector = new YogaDetector(gajaKesariChart);
                const specialYogas = detector.detectSpecialYogas();

                const gajaKesari = specialYogas.find(yoga => yoga.name === 'Gaja Kesari Yoga');
                expect(gajaKesari).toBeDefined();
                expect(gajaKesari.type).toBe('MOON_JUPITER_KENDRA');
                expect(gajaKesari.planets).toEqual(['MOON', 'JUPITER']);
                expect(gajaKesari.strength).toBeGreaterThanOrEqual(YOGA_CONSTANTS.MINIMUM_YOGA_STRENGTH);
            });

            test('should detect Neecha Bhanga Raja Yoga with exalted dispositor', () => {
                const neechaBhangaExaltedDispositorChart = {
                    ascendant: { sign: 0 },
                    planets: {
                        SUN: { longitude: 180, house: 7 }, // Sun in Libra (debilitated) in 7th (kendra)
                        MOON: { longitude: 33, house: 1 },
                        MARS: { longitude: 0, house: 1 },
                        MERCURY: { longitude: 60, house: 2 },
                        JUPITER: { longitude: 240, house: 9 },
                        VENUS: { longitude: 180, house: 7 }, // Venus (Libra lord) in Libra (own sign = exalted for dispositor)
                        SATURN: { longitude: 300, house: 11 },
                        RAHU: { longitude: 120, house: 4 },
                        KETU: { longitude: 300, house: 10 }
                    }
                };

                const detector = new YogaDetector(neechaBhangaExaltedDispositorChart);
                const specialYogas = detector.detectSpecialYogas();

                const neechaBhanga = specialYogas.find(yoga => yoga.name === 'Neecha Bhanga Raja Yoga');
                expect(neechaBhanga).toBeDefined();
                expect(neechaBhanga.planet).toBe('SUN');
                expect(neechaBhanga.strength).toBeGreaterThan(0);
            });

            test('should detect Neecha Bhanga Raja Yoga in kendra house', () => {
                const detector = new YogaDetector(neechaBhangaChart);
                const specialYogas = detector.detectSpecialYogas();

                const neechaBhanga = specialYogas.find(yoga => yoga.name === 'Neecha Bhanga Raja Yoga');
                expect(neechaBhanga).toBeDefined();
                expect(neechaBhanga.planet).toBe('SUN');
                expect(neechaBhanga.house).toBe(7); // 7th house is kendra
            });

            test('should detect Viparita Raja Yoga in 6th house', () => {
                const detector = new YogaDetector(viparitaRajaChart);
                const specialYogas = detector.detectSpecialYogas();

                const viparita = specialYogas.find(yoga => yoga.name.includes('Viparita Raja Yoga'));
                expect(viparita).toBeDefined();
                expect(viparita.type).toBe('MALEFIC_HOUSE_BENEFIC');
                expect(viparita.house).toBe(8); // 8th house
                expect(viparita.planets).toContain('MERCURY');
            });

            test('should detect Viparita Raja Yoga in 12th house', () => {
                const twelfthHouseViparitaChart = {
                    ascendant: { sign: 0 },
                    planets: {
                        SUN: { longitude: 30, house: 1 },
                        MOON: { longitude: 33, house: 1 },
                        MARS: { longitude: 0, house: 1 },
                        MERCURY: { longitude: 60, house: 2 },
                        JUPITER: { longitude: 240, house: 12 }, // Jupiter in 12th (malefic house)
                        VENUS: { longitude: 270, house: 10 },
                        SATURN: { longitude: 300, house: 11 },
                        RAHU: { longitude: 120, house: 4 },
                        KETU: { longitude: 300, house: 10 }
                    }
                };

                const detector = new YogaDetector(twelfthHouseViparitaChart);
                const specialYogas = detector.detectSpecialYogas();

                const viparita = specialYogas.find(yoga => yoga.name === 'Viparita Raja Yoga (12th House)');
                expect(viparita).toBeDefined();
                expect(viparita.house).toBe(12);
                expect(viparita.planets).toContain('JUPITER');
            });

            test('should not detect Gaja Kesari Yoga when Moon and Jupiter not in kendra', () => {
                const noGajaKesariChart = {
                    ascendant: { sign: 0 },
                    planets: {
                        SUN: { longitude: 30, house: 1 },
                        MOON: { longitude: 33, house: 1 },     // Moon in 1st
                        MARS: { longitude: 0, house: 1 },
                        MERCURY: { longitude: 60, house: 2 },
                        JUPITER: { longitude: 240, house: 8 }, // Jupiter in 8th (not kendra from Moon)
                        VENUS: { longitude: 270, house: 10 },
                        SATURN: { longitude: 300, house: 11 },
                        RAHU: { longitude: 120, house: 4 },
                        KETU: { longitude: 300, house: 10 }
                    }
                };

                const detector = new YogaDetector(noGajaKesariChart);
                const specialYogas = detector.detectSpecialYogas();

                const gajaKesari = specialYogas.find(yoga => yoga.name === 'Gaja Kesari Yoga');
                expect(gajaKesari).toBeUndefined();
            });
        });

        describe('Yoga Strength and Effects Validation', () => {
            test('should calculate correct yoga strength levels', () => {
                const weakYoga = { strength: 0.65 };
                const moderateYoga = { strength: 0.75 };
                const strongYoga = { strength: 0.85 };
                const veryStrongYoga = { strength: 0.95 };

                expect(weakYoga.strength).toBeGreaterThanOrEqual(YOGA_STRENGTH_LEVELS.WEAK.min);
                expect(weakYoga.strength).toBeLessThanOrEqual(YOGA_STRENGTH_LEVELS.WEAK.max);

                expect(moderateYoga.strength).toBeGreaterThanOrEqual(YOGA_STRENGTH_LEVELS.MODERATE.min);
                expect(moderateYoga.strength).toBeLessThanOrEqual(YOGA_STRENGTH_LEVELS.MODERATE.max);

                expect(strongYoga.strength).toBeGreaterThanOrEqual(YOGA_STRENGTH_LEVELS.STRONG.min);
                expect(strongYoga.strength).toBeLessThanOrEqual(YOGA_STRENGTH_LEVELS.STRONG.max);

                expect(veryStrongYoga.strength).toBeGreaterThanOrEqual(YOGA_STRENGTH_LEVELS.VERY_STRONG.min);
                expect(veryStrongYoga.strength).toBeLessThanOrEqual(YOGA_STRENGTH_LEVELS.VERY_STRONG.max);
            });

            test('should return appropriate Raja Yoga effects based on strength', () => {
                const { getRajaYogaEffects } = require('./yoga-formation-analyzer');

                const weakEffects = getRajaYogaEffects(0.65);
                expect(weakEffects.power).toBe('Leadership potential');
                expect(weakEffects.career).toBe('Supervisory or team lead positions');

                const strongEffects = getRajaYogaEffects(0.85);
                expect(strongEffects.power).toBe('Strong leadership qualities');
                expect(strongEffects.career).toBe('Management positions, influential roles');

                const veryStrongEffects = getRajaYogaEffects(0.95);
                expect(veryStrongEffects.power).toBe('Exceptional leadership and authority');
                expect(veryStrongEffects.career).toBe('High-level executive positions, government roles');
            });

            test('should return appropriate Dhana Yoga effects based on strength', () => {
                const { getDhanaYogaEffects } = require('./yoga-formation-analyzer');

                const weakEffects = getDhanaYogaEffects(0.65);
                expect(weakEffects.wealth).toBe('Above average financial status');

                const strongEffects = getDhanaYogaEffects(0.85);
                expect(strongEffects.wealth).toBe('Strong financial position');

                const veryStrongEffects = getDhanaYogaEffects(0.95);
                expect(veryStrongEffects.wealth).toBe('Exceptional financial success and abundance');
            });

            test('should return appropriate Mahapurusha Yoga effects', () => {
                const { getMahapurushaEffects } = require('./yoga-formation-analyzer');

                const marsEffects = getMahapurushaEffects('MARS', 0.85);
                expect(marsEffects.qualities).toBe('Courage, leadership, military prowess');
                expect(marsEffects.career).toBe('Military, police, sports, surgery');

                const jupiterEffects = getMahapurushaEffects('JUPITER', 0.85);
                expect(jupiterEffects.qualities).toBe('Wisdom, spirituality, teaching ability');
                expect(jupiterEffects.career).toBe('Teaching, religion, law, counseling');
            });
        });
    });

    describe('Yoga Analysis with Specific Charts', () => {
        test('should detect Pancha Mahapurusha Yoga for exalted Mars in kendra', () => {
            const chartWithExaltedMars = {
                ascendant: { sign: 9 }, // Capricorn ascendant
                planets: {
                    SUN: { longitude: 30, house: 1 },
                    MOON: { longitude: 33, house: 1 },
                    MARS: { longitude: 270, house: 1 }, // Capricorn (exalted) in 1st (kendra)
                    MERCURY: { longitude: 60, house: 2 },
                    JUPITER: { longitude: 240, house: 9 },
                    VENUS: { longitude: 270, house: 10 },
                    SATURN: { longitude: 300, house: 11 }
                }
            };

            const detector = new YogaDetector(chartWithExaltedMars);
            const yogas = detector.detectAllYogas();

            const panchaMahapurusha = yogas.find(yoga => yoga.type === 'PANCHA_MAHAPURUSHA' && yoga.planet === 'MARS');
            expect(panchaMahapurusha).toBeDefined();
            expect(panchaMahapurusha.name).toBe('Ruchaka Yoga');
            expect(panchaMahapurusha.strength).toBeGreaterThan(YOGA_CONSTANTS.MINIMUM_YOGA_STRENGTH);
        });

        test('should detect Gaja Kesari Yoga when Moon and Jupiter are in kendra', () => {
            const chartWithGajaKesari = {
                ascendant: { sign: 0 },
                planets: {
                    SUN: { longitude: 30, house: 1 },
                    MOON: { longitude: 33, house: 1 }, // Moon in 1st
                    MARS: { longitude: 0, house: 1 },
                    MERCURY: { longitude: 60, house: 2 },
                    JUPITER: { longitude: 240, house: 7 }, // Jupiter in 7th (kendra from Moon in 1st)
                    VENUS: { longitude: 270, house: 10 },
                    SATURN: { longitude: 300, house: 11 }
                }
            };

            const detector = new YogaDetector(chartWithGajaKesari);
            const yogas = detector.detectAllYogas();

            const gajaKesari = yogas.find(yoga => yoga.name === 'Gaja Kesari Yoga');
            expect(gajaKesari).toBeDefined();
            expect(gajaKesari.type).toBe('MOON_JUPITER_KENDRA');
            expect(gajaKesari.strength).toBeGreaterThan(YOGA_CONSTANTS.MINIMUM_YOGA_STRENGTH);
        });

        test('should detect Neecha Bhanga Yoga for debilitated planet with cancellation', () => {
            const chartWithNeechaBhanga = {
                ascendant: { sign: 0 },
                planets: {
                    SUN: { longitude: 180, house: 7 }, // Libra (debilitated) in 7th (kendra)
                    MOON: { longitude: 33, house: 1 },
                    MARS: { longitude: 0, house: 1 },
                    MERCURY: { longitude: 60, house: 2 },
                    JUPITER: { longitude: 240, house: 9 },
                    VENUS: { longitude: 270, house: 10 },
                    SATURN: { longitude: 300, house: 11 }
                }
            };

            const detector = new YogaDetector(chartWithNeechaBhanga);
            const yogas = detector.detectAllYogas();

            const neechaBhanga = yogas.find(yoga => yoga.name === 'Neecha Bhanga Raja Yoga');
            expect(neechaBhanga).toBeDefined();
            expect(neechaBhanga.planet).toBe('SUN');
            expect(neechaBhanga.strength).toBeGreaterThan(0);
        });
    });

    describe('Yoga Summary and Filtering', () => {
        let detector;

        beforeEach(() => {
            detector = new YogaDetector(sampleBirthChart);
            detector.detectAllYogas();
        });

        test('should generate yoga summary', () => {
            const summary = detector.getYogaSummary();
            expect(summary).toHaveProperty('totalYogas');
            expect(summary).toHaveProperty('categories');
            expect(summary).toHaveProperty('dominantCategory');
            expect(typeof summary.totalYogas).toBe('number');
        });

        test('should filter yogas by strength', () => {
            const strongYogas = detector.getYogasByStrength(0.8);
            expect(Array.isArray(strongYogas)).toBe(true);
            strongYogas.forEach(yoga => {
                expect(yoga.strength).toBeGreaterThanOrEqual(0.8);
            });
        });

        test('should filter yogas by category', () => {
            const powerYogas = detector.getYogasByCategory('Power & Authority');
            expect(Array.isArray(powerYogas)).toBe(true);
            powerYogas.forEach(yoga => {
                expect(detector.getYogaCategory(yoga.name)).toBe('Power & Authority');
            });
        });
    });

    describe('Constants and Configuration', () => {
        test('YOGA_CONSTANTS should have all required properties', () => {
            expect(YOGA_CONSTANTS).toHaveProperty('KENDRA_HOUSES');
            expect(YOGA_CONSTANTS).toHaveProperty('TRIKONA_HOUSES');
            expect(YOGA_CONSTANTS).toHaveProperty('DHANA_HOUSES');
            expect(YOGA_CONSTANTS).toHaveProperty('MALEFIC_HOUSES');
            expect(YOGA_CONSTANTS).toHaveProperty('BENEFIC_HOUSES');
            expect(YOGA_CONSTANTS).toHaveProperty('EXALTED_MULTIPLIER');
            expect(YOGA_CONSTANTS).toHaveProperty('OWN_SIGN_MULTIPLIER');
            expect(YOGA_CONSTANTS).toHaveProperty('MINIMUM_YOGA_STRENGTH');
        });

        test('YOGA_CONSTANTS values should be valid', () => {
            expect(Array.isArray(YOGA_CONSTANTS.KENDRA_HOUSES)).toBe(true);
            expect(YOGA_CONSTANTS.KENDRA_HOUSES.length).toBe(4);
            expect(YOGA_CONSTANTS.EXALTED_MULTIPLIER).toBeGreaterThan(1);
            expect(YOGA_CONSTANTS.MINIMUM_YOGA_STRENGTH).toBeGreaterThan(0);
            expect(YOGA_CONSTANTS.MINIMUM_YOGA_STRENGTH).toBeLessThan(1);
        });
    });

    describe('Edge Cases and Boundary Conditions', () => {
        test('should handle planets at exact sign boundaries', () => {
            const boundaryChart = {
                ascendant: { sign: 0 },
                planets: {
                    SUN: { longitude: 29.9, house: 12 }, // Just before Aries end
                    MOON: { longitude: 30.1, house: 1 }, // Just after Aries start
                    MARS: { longitude: 0, house: 1 },
                    MERCURY: { longitude: 60, house: 2 },
                    JUPITER: { longitude: 240, house: 9 },
                    VENUS: { longitude: 270, house: 10 },
                    SATURN: { longitude: 300, house: 11 }
                }
            };

            const detector = new YogaDetector(boundaryChart);
            const yogas = detector.detectAllYogas();
            expect(Array.isArray(yogas)).toBe(true);
        });

        test('should handle planets at 0 and 360 degree boundaries', () => {
            const zeroDegreeChart = {
                ascendant: { sign: 0 },
                planets: {
                    SUN: { longitude: 0, house: 1 },   // Exactly 0 degrees
                    MOON: { longitude: 359.9, house: 12 }, // Almost 360 degrees
                    MARS: { longitude: 0, house: 1 },
                    MERCURY: { longitude: 60, house: 2 },
                    JUPITER: { longitude: 240, house: 9 },
                    VENUS: { longitude: 270, house: 10 },
                    SATURN: { longitude: 300, house: 11 }
                }
            };

            const detector = new YogaDetector(zeroDegreeChart);
            expect(() => detector.detectAllYogas()).not.toThrow();
        });

        test('should handle all planets in same house', () => {
            const allInOneHouseChart = {
                ascendant: { sign: 0 },
                planets: {
                    SUN: { longitude: 30, house: 1 },
                    MOON: { longitude: 33, house: 1 },
                    MARS: { longitude: 0, house: 1 },
                    MERCURY: { longitude: 60, house: 1 },
                    JUPITER: { longitude: 240, house: 1 },
                    VENUS: { longitude: 270, house: 1 },
                    SATURN: { longitude: 300, house: 1 }
                }
            };

            const detector = new YogaDetector(allInOneHouseChart);
            const yogas = detector.detectAllYogas();
            expect(Array.isArray(yogas)).toBe(true);
        });

        test('should handle empty planet data gracefully', () => {
            const minimalChart = {
                ascendant: { sign: 0 },
                planets: {
                    SUN: { longitude: 30, house: 1 },
                    MOON: { longitude: 33, house: 1 },
                    MARS: { longitude: 0, house: 1 },
                    MERCURY: { longitude: 60, house: 2 },
                    JUPITER: { longitude: 240, house: 9 },
                    VENUS: { longitude: 270, house: 10 },
                    SATURN: { longitude: 300, house: 11 }
                }
            };

            const detector = new YogaDetector(minimalChart);
            expect(() => detector.detectAllYogas()).not.toThrow();
        });

        test('should handle maximum house numbers', () => {
            const maxHouseChart = {
                ascendant: { sign: 0 },
                planets: {
                    SUN: { longitude: 30, house: 12 },
                    MOON: { longitude: 33, house: 12 },
                    MARS: { longitude: 0, house: 12 },
                    MERCURY: { longitude: 60, house: 12 },
                    JUPITER: { longitude: 240, house: 12 },
                    VENUS: { longitude: 270, house: 12 },
                    SATURN: { longitude: 300, house: 12 }
                }
            };

            const detector = new YogaDetector(maxHouseChart);
            expect(() => detector.detectAllYogas()).not.toThrow();
        });

        test('should handle minimum house numbers', () => {
            const minHouseChart = {
                ascendant: { sign: 0 },
                planets: {
                    SUN: { longitude: 30, house: 1 },
                    MOON: { longitude: 33, house: 1 },
                    MARS: { longitude: 0, house: 1 },
                    MERCURY: { longitude: 60, house: 1 },
                    JUPITER: { longitude: 240, house: 1 },
                    VENUS: { longitude: 270, house: 1 },
                    SATURN: { longitude: 300, house: 1 }
                }
            };

            const detector = new YogaDetector(minHouseChart);
            expect(() => detector.detectAllYogas()).not.toThrow();
        });
    });

    describe('Performance and Scalability Tests', () => {
        test('should handle multiple yoga detections efficiently', () => {
            const detector = new YogaDetector(sampleBirthChart);

            const startTime = Date.now();
            for (let i = 0; i < 100; i++) {
                detector.detectAllYogas();
            }
            const endTime = Date.now();
            const totalTime = endTime - startTime;

            // Should complete 100 detections in reasonable time (less than 1 second)
            expect(totalTime).toBeLessThan(1000);
        });

        test('should handle large birth chart data', () => {
            const largeChart = {
                ascendant: { sign: 0 },
                planets: {},
                strengths: {}
            };

            // Add many planets with detailed data
            const planets = ['SUN', 'MOON', 'MARS', 'MERCURY', 'JUPITER', 'VENUS', 'SATURN', 'RAHU', 'KETU'];
            planets.forEach((planet, index) => {
                largeChart.planets[planet] = {
                    longitude: index * 40,
                    house: (index % 12) + 1,
                    nakshatra: `Nakshatra${index}`,
                    pada: (index % 4) + 1
                };
                largeChart.strengths[planet] = {
                    overall: 0.8,
                    positional: 0.7,
                    temporal: 0.9
                };
            });

            const detector = new YogaDetector(largeChart);
            expect(() => detector.detectAllYogas()).not.toThrow();
        });

        test('should maintain performance with complex yoga combinations', () => {
            // Create a chart that triggers multiple yoga types
            const complexChart = {
                ascendant: { sign: 0 },
                planets: {
                    SUN: { longitude: 120, house: 4 }, // Leo in 4th (kendra)
                    MOON: { longitude: 33, house: 1 }, // Cancer in 1st
                    MARS: { longitude: 270, house: 10 }, // Capricorn (exalted) in 10th (kendra)
                    MERCURY: { longitude: 150, house: 5 }, // Virgo (exalted) in 5th (trikona)
                    JUPITER: { longitude: 240, house: 9 }, // Sagittarius (own) in 9th (trikona)
                    VENUS: { longitude: 180, house: 6 }, // Libra (own) in 6th (malefic)
                    SATURN: { longitude: 300, house: 11 }, // Aquarius (own) in 11th (dhana)
                    RAHU: { longitude: 120, house: 4 },
                    KETU: { longitude: 300, house: 10 }
                }
            };

            const detector = new YogaDetector(complexChart);
            const startTime = Date.now();
            const yogas = detector.detectAllYogas();
            const endTime = Date.now();

            expect(yogas.length).toBeGreaterThan(0);
            expect(endTime - startTime).toBeLessThan(100); // Should be fast
        });
    });

    describe('Integration Tests - Complete Workflow', () => {
        test('should provide complete yoga analysis workflow', () => {
            const detector = new YogaDetector(sampleBirthChart);

            // Step 1: Detect all yogas
            const yogas = detector.detectAllYogas();
            expect(Array.isArray(yogas)).toBe(true);

            // Step 2: Get summary
            const summary = detector.getYogaSummary();
            expect(summary).toHaveProperty('totalYogas');
            expect(summary).toHaveProperty('categories');
            expect(summary).toHaveProperty('dominantCategory');

            // Step 3: Filter by strength
            const strongYogas = detector.getYogasByStrength(0.8);
            expect(Array.isArray(strongYogas)).toBe(true);
            strongYogas.forEach(yoga => {
                expect(yoga.strength).toBeGreaterThanOrEqual(0.8);
            });

            // Step 4: Filter by category
            const powerYogas = detector.getYogasByCategory('Power & Authority');
            expect(Array.isArray(powerYogas)).toBe(true);

            // Verify data consistency
            expect(summary.totalYogas).toBe(yogas.length);
        });

        test('should handle yoga analysis for different ascendants', () => {
            const ascendants = [0, 3, 6, 9]; // Aries, Cancer, Libra, Capricorn

            ascendants.forEach(ascendantSign => {
                const chart = {
                    ascendant: { sign: ascendantSign },
                    planets: {
                        SUN: { longitude: 30, house: 1 },
                        MOON: { longitude: 33, house: 1 },
                        MARS: { longitude: 0, house: 1 },
                        MERCURY: { longitude: 60, house: 2 },
                        JUPITER: { longitude: 240, house: 9 },
                        VENUS: { longitude: 270, house: 10 },
                        SATURN: { longitude: 300, house: 11 }
                    }
                };

                const detector = new YogaDetector(chart);
                expect(() => {
                    const yogas = detector.detectAllYogas();
                    const summary = detector.getYogaSummary();
                }).not.toThrow();
            });
        });

        test('should maintain data integrity across multiple operations', () => {
            const detector = new YogaDetector(sampleBirthChart);

            // Perform multiple operations
            const yogas1 = detector.detectAllYogas();
            const summary1 = detector.getYogaSummary();
            const filtered1 = detector.getYogasByStrength(0.7);

            const yogas2 = detector.detectAllYogas(); // Should not change results
            const summary2 = detector.getYogaSummary();
            const filtered2 = detector.getYogasByStrength(0.7);

            // Results should be consistent
            expect(yogas1.length).toBe(yogas2.length);
            expect(summary1.totalYogas).toBe(summary2.totalYogas);
            expect(filtered1.length).toBe(filtered2.length);
        });
    });

    describe('Comprehensive Algorithm Validation', () => {
        test('should validate all yoga types from reference document', () => {
            const comprehensiveChart = {
                ascendant: { sign: 0 },
                planets: {
                    // Raja Yoga setup
                    SUN: { longitude: 120, house: 4 }, // Leo in 4th (kendra)
                    MOON: { longitude: 33, house: 1 }, // Cancer in 1st
                    MARS: { longitude: 270, house: 10 }, // Capricorn (exalted) in 10th (kendra)
                    MERCURY: { longitude: 150, house: 5 }, // Virgo (exalted) in 5th (trikona)
                    JUPITER: { longitude: 240, house: 9 }, // Sagittarius (own) in 9th (trikona)
                    VENUS: { longitude: 180, house: 6 }, // Libra (own) in 6th (malefic)
                    SATURN: { longitude: 300, house: 11 }, // Aquarius (own) in 11th (dhana)
                    RAHU: { longitude: 120, house: 4 },
                    KETU: { longitude: 300, house: 10 }
                }
            };

            const detector = new YogaDetector(comprehensiveChart);
            const yogas = detector.detectAllYogas();

            // Should detect multiple yoga types
            const yogaTypes = yogas.map(yoga => yoga.type);
            expect(yogaTypes.length).toBeGreaterThan(0);

            // Verify yoga structure
            yogas.forEach(yoga => {
                expect(yoga).toHaveProperty('name');
                expect(yoga).toHaveProperty('type');
                expect(yoga).toHaveProperty('planets');
                expect(yoga).toHaveProperty('strength');
                expect(yoga).toHaveProperty('description');
                expect(yoga).toHaveProperty('effects');
                expect(yoga.strength).toBeGreaterThanOrEqual(0);
                expect(yoga.strength).toBeLessThanOrEqual(1);
            });
        });

        test('should handle all planetary combinations correctly', () => {
            // Test various planetary dignity combinations
            const dignityTestChart = {
                ascendant: { sign: 0 },
                planets: {
                    SUN: { longitude: 0, house: 1 },     // Aries (exalted)
                    MOON: { longitude: 30, house: 1 },   // Taurus (exalted)
                    MARS: { longitude: 90, house: 3 },    // Cancer (debilitated)
                    MERCURY: { longitude: 120, house: 4 }, // Leo (enemy)
                    JUPITER: { longitude: 150, house: 5 }, // Virgo (debilitated)
                    VENUS: { longitude: 180, house: 6 },   // Libra (own)
                    SATURN: { longitude: 210, house: 7 },  // Scorpio (neutral)
                    RAHU: { longitude: 240, house: 8 },    // Sagittarius (debilitated)
                    KETU: { longitude: 270, house: 9 }     // Capricorn (exalted)
                }
            };

            const detector = new YogaDetector(dignityTestChart);
            expect(() => detector.detectAllYogas()).not.toThrow();

            const yogas = detector.detectAllYogas();
            expect(Array.isArray(yogas)).toBe(true);
        });

        test('should validate aspect calculations comprehensively', () => {
            const aspectTestChart = {
                ascendant: { sign: 0 },
                planets: {
                    SUN: { longitude: 30, house: 1 },
                    MOON: { longitude: 33, house: 1 },
                    MARS: { longitude: 0, house: 1 },
                    MERCURY: { longitude: 60, house: 2 },
                    JUPITER: { longitude: 240, house: 9 },
                    VENUS: { longitude: 270, house: 10 },
                    SATURN: { longitude: 300, house: 11 }
                }
            };

            const detector = new YogaDetector(aspectTestChart);

            // Test all aspect types
            expect(calculateAspectStrength(1, 7)).toBe(YOGA_CONSTANTS.FULL_ASPECT);
            expect(calculateAspectStrength(1, 4)).toBe(YOGA_CONSTANTS.THREE_QUARTER_ASPECT);
            expect(calculateAspectStrength(1, 5)).toBe(YOGA_CONSTANTS.HALF_ASPECT);
            expect(calculateAspectStrength(1, 2)).toBe(YOGA_CONSTANTS.QUARTER_ASPECT);
            expect(calculateAspectStrength(1, 3)).toBe(0);

            expect(() => detector.detectAllYogas()).not.toThrow();
        });
    });

    describe('Error Handling and Validation', () => {
        test('should handle errors in yoga detection gracefully', () => {
            const detector = new YogaDetector(sampleBirthChart);

            // Mock a function to throw an error
            const originalDetectRajaYogas = detector.detectRajaYogas;
            detector.detectRajaYogas = () => { throw new Error('Test error'); };

            expect(() => detector.detectAllYogas()).toThrow('Yoga detection failed');

            // Restore original function
            detector.detectRajaYogas = originalDetectRajaYogas;
        });

        test('should validate input ranges comprehensively', () => {
            // Test invalid longitudes
            const invalidLongitudeChart = {
                ascendant: { sign: 0 },
                planets: {
                    SUN: { longitude: 400, house: 1 } // Invalid longitude
                }
            };
            expect(() => new YogaDetector(invalidLongitudeChart)).toThrow('Birth chart validation failed');

            // Test negative longitude
            const negativeLongitudeChart = {
                ascendant: { sign: 0 },
                planets: {
                    SUN: { longitude: -10, house: 1 }
                }
            };
            expect(() => new YogaDetector(negativeLongitudeChart)).toThrow('Birth chart validation failed');

            // Test invalid house numbers
            const invalidHouseChart = {
                ascendant: { sign: 0 },
                planets: {
                    SUN: { longitude: 30, house: 15 } // Invalid house
                }
            };
            expect(() => new YogaDetector(invalidHouseChart)).toThrow('Birth chart validation failed');

            // Test invalid ascendant
            const invalidAscendantChart = {
                ascendant: { sign: 15 }, // Invalid sign
                planets: {
                    SUN: { longitude: 30, house: 1 }
                }
            };
            expect(() => new YogaDetector(invalidAscendantChart)).toThrow('Birth chart validation failed');
        });

        test('should handle missing optional planets', () => {
            const chartWithoutNodes = {
                ascendant: { sign: 0 },
                planets: {
                    SUN: { longitude: 30, house: 1 },
                    MOON: { longitude: 33, house: 1 },
                    MARS: { longitude: 0, house: 1 },
                    MERCURY: { longitude: 60, house: 2 },
                    JUPITER: { longitude: 240, house: 9 },
                    VENUS: { longitude: 270, house: 10 },
                    SATURN: { longitude: 300, house: 11 }
                    // No RAHU or KETU
                }
            };

            const detector = new YogaDetector(chartWithoutNodes);
            expect(() => detector.detectAllYogas()).not.toThrow();
        });

        test('should handle malformed planet data', () => {
            const malformedChart = {
                ascendant: { sign: 0 },
                planets: {
                    SUN: { longitude: 'invalid', house: 1 },
                    MOON: { longitude: 33, house: 1 },
                    MARS: { longitude: 0, house: 1 },
                    MERCURY: { longitude: 60, house: 2 },
                    JUPITER: { longitude: 240, house: 9 },
                    VENUS: { longitude: 270, house: 10 },
                    SATURN: { longitude: 300, house: 11 }
                }
            };

            expect(() => new YogaDetector(malformedChart)).toThrow('Birth chart validation failed');
        });

        test('should handle empty results gracefully', () => {
            const noYogaChart = {
                ascendant: { sign: 0 },
                planets: {
                    SUN: { longitude: 30, house: 12 }, // All in bad houses
                    MOON: { longitude: 33, house: 12 },
                    MARS: { longitude: 0, house: 12 },
                    MERCURY: { longitude: 60, house: 12 },
                    JUPITER: { longitude: 240, house: 12 },
                    VENUS: { longitude: 270, house: 12 },
                    SATURN: { longitude: 300, house: 12 }
                }
            };

            const detector = new YogaDetector(noYogaChart);
            const yogas = detector.detectAllYogas();
            expect(Array.isArray(yogas)).toBe(true);
            expect(yogas.length).toBe(0);
        });
    });

    describe('Constants and Data Integrity', () => {
        test('should validate all YOGA_CONSTANTS are properly defined', () => {
            expect(YOGA_CONSTANTS.KENDRA_HOUSES).toEqual([1, 4, 7, 10]);
            expect(YOGA_CONSTANTS.TRIKONA_HOUSES).toEqual([1, 5, 9]);
            expect(YOGA_CONSTANTS.DHANA_HOUSES).toEqual([2, 11]);
            expect(YOGA_CONSTANTS.MALEFIC_HOUSES).toEqual([6, 8, 12]);
            expect(YOGA_CONSTANTS.BENEFIC_HOUSES).toEqual([1, 2, 3, 4, 5, 7, 9, 10, 11]);
            expect(YOGA_CONSTANTS.EXALTED_MULTIPLIER).toBe(1.5);
            expect(YOGA_CONSTANTS.OWN_SIGN_MULTIPLIER).toBe(1.25);
            expect(YOGA_CONSTANTS.MINIMUM_YOGA_STRENGTH).toBe(0.6);
        });

        test('should validate PLANETARY_RELATIONSHIPS data structure', () => {
            const planets = ['SUN', 'MOON', 'MARS', 'MERCURY', 'JUPITER', 'VENUS', 'SATURN', 'RAHU', 'KETU'];

            planets.forEach(planet => {
                expect(PLANETARY_RELATIONSHIPS[planet]).toHaveProperty('friends');
                expect(PLANETARY_RELATIONSHIPS[planet]).toHaveProperty('enemies');
                expect(PLANETARY_RELATIONSHIPS[planet]).toHaveProperty('neutral');
                expect(Array.isArray(PLANETARY_RELATIONSHIPS[planet].friends)).toBe(true);
                expect(Array.isArray(PLANETARY_RELATIONSHIPS[planet].enemies)).toBe(true);
                expect(Array.isArray(PLANETARY_RELATIONSHIPS[planet].neutral)).toBe(true);
            });
        });

        test('should validate SIGN_LORDS array', () => {
            expect(SIGN_LORDS).toHaveLength(12);
            expect(SIGN_LORDS[0]).toBe('MARS');    // Aries
            expect(SIGN_LORDS[3]).toBe('MOON');    // Cancer
            expect(SIGN_LORDS[5]).toBe('MERCURY'); // Virgo
            expect(SIGN_LORDS[8]).toBe('JUPITER'); // Sagittarius
        });

        test('should validate PLANETARY_DIGNITIES structure', () => {
            const planets = ['SUN', 'MOON', 'MARS', 'MERCURY', 'JUPITER', 'VENUS', 'SATURN', 'RAHU', 'KETU'];

            planets.forEach(planet => {
                expect(PLANETARY_DIGNITIES[planet]).toHaveProperty('exaltation');
                expect(PLANETARY_DIGNITIES[planet]).toHaveProperty('debilitation');
                expect(typeof PLANETARY_DIGNITIES[planet].exaltation).toBe('number');
                expect(typeof PLANETARY_DIGNITIES[planet].debilitation).toBe('number');
            });
        });

        test('should validate YOGA_CATEGORIES structure', () => {
            expect(YOGA_CATEGORIES.RAJA_YOGA.name).toBe('Raja Yoga');
            expect(YOGA_CATEGORIES.DHANA_YOGA.name).toBe('Dhana Yoga');
            expect(YOGA_CATEGORIES.MAHAPURUSHA_YOGA.name).toBe('Mahapurusha Yoga');
            expect(YOGA_CATEGORIES.SPECIAL_YOGAS.name).toBe('Special Yogas');
        });

        test('should validate YOGA_STRENGTH_LEVELS ranges', () => {
            expect(YOGA_STRENGTH_LEVELS.WEAK.min).toBe(0.6);
            expect(YOGA_STRENGTH_LEVELS.WEAK.max).toBe(0.7);
            expect(YOGA_STRENGTH_LEVELS.MODERATE.min).toBe(0.7);
            expect(YOGA_STRENGTH_LEVELS.MODERATE.max).toBe(0.8);
            expect(YOGA_STRENGTH_LEVELS.STRONG.min).toBe(0.8);
            expect(YOGA_STRENGTH_LEVELS.STRONG.max).toBe(0.9);
            expect(YOGA_STRENGTH_LEVELS.VERY_STRONG.min).toBe(0.9);
            expect(YOGA_STRENGTH_LEVELS.VERY_STRONG.max).toBe(1.0);
        });
    });
});