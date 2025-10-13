/**
 * ZodiaCore - Panchang Calculator Tests
 *
 * Comprehensive test suite for Panchang calculations including all five elements,
 * auspicious periods, festivals, lunar phases, and mathematical foundations.
 * Based on ZC1.5 Panchang Calendar Details Implementation Guide.
 *
 * @version 1.1.0
 * @author ZodiaCore Development Team
 */

const PanchangCalculator = require('./panchang-calculator');
const { calculateLahiriAyanamsa } = require('./astronomical-calculations');
const { normalizeAngle } = require('./math-utils');

describe('PanchangCalculator', () => {
    let calculator;

    beforeEach(() => {
        calculator = new PanchangCalculator();
    });

    describe('calculatePanchang', () => {
        test('should calculate complete Panchang for a given date and location', async () => {
            const date = new Date('2025-01-01');
            const latitude = 28.6139;
            const longitude = 77.2090;

            const result = await calculator.calculatePanchang(date, latitude, longitude);

            expect(result).toHaveProperty('date');
            expect(result).toHaveProperty('location');
            expect(result).toHaveProperty('julianDay');
            expect(result).toHaveProperty('ayanamsa');
            expect(result).toHaveProperty('tithi');
            expect(result).toHaveProperty('vara');
            expect(result).toHaveProperty('nakshatra');
            expect(result).toHaveProperty('yoga');
            expect(result).toHaveProperty('karana');
            expect(result).toHaveProperty('sunrise');
            expect(result).toHaveProperty('sunset');
            expect(result).toHaveProperty('dayLength');
            expect(result).toHaveProperty('moonPhase');
            expect(result).toHaveProperty('auspiciousPeriods');
            expect(result).toHaveProperty('inauspiciousPeriods');
            expect(result).toHaveProperty('festivals');
        });

        test('should handle different locations correctly', async () => {
            const date = new Date('2025-01-01');
            const delhi = { lat: 28.6139, lon: 77.2090 };
            const london = { lat: 51.5074, lon: -0.1278 };

            const resultDelhi = await calculator.calculatePanchang(date, delhi.lat, delhi.lon);
            const resultLondon = await calculator.calculatePanchang(date, london.lat, london.lon);

            // Sunrise/sunset times should be different
            expect(resultDelhi.sunrise).not.toBe(resultLondon.sunrise);
            expect(resultDelhi.sunset).not.toBe(resultLondon.sunset);
        });
    });

    describe('calculateTithi', () => {
        test('should calculate Tithi correctly', () => {
            const sunLongitude = 280;
            const moonLongitude = 295;

            const result = calculator.calculateTithi(sunLongitude, moonLongitude);

            expect(result).toHaveProperty('number');
            expect(result).toHaveProperty('name');
            expect(result).toHaveProperty('paksha');
            expect(result).toHaveProperty('progress');
            expect(result).toHaveProperty('isAuspicious');
        });

        test('should determine Paksha correctly', () => {
            // Shukla Paksha (1-15)
            const shukla = calculator.calculateTithi(0, 30);
            expect(shukla.paksha).toBe('Shukla');

            // Krishna Paksha (16-30)
            const krishna = calculator.calculateTithi(0, 330);
            expect(krishna.paksha).toBe('Krishna');
        });
    });

    describe('calculateNakshatra', () => {
        test('should calculate Nakshatra correctly', () => {
            const moonLongitude = 45; // Should be in Bharani

            const result = calculator.calculateNakshatra(moonLongitude);

            expect(result).toHaveProperty('number');
            expect(result).toHaveProperty('name');
            expect(result).toHaveProperty('lord');
            expect(result).toHaveProperty('pada');
            expect(result).toHaveProperty('isAuspicious');
        });

        test('should calculate Pada correctly', () => {
            const moonLongitude = 13.333; // End of first pada

            const result = calculator.calculateNakshatra(moonLongitude);

            expect(result.pada).toBe(1);
        });
    });

    describe('calculateYoga', () => {
        test('should calculate Yoga correctly', () => {
            const sunLongitude = 30;
            const moonLongitude = 45;

            const result = calculator.calculateYoga(sunLongitude, moonLongitude);

            expect(result).toHaveProperty('number');
            expect(result).toHaveProperty('name');
            expect(result).toHaveProperty('isAuspicious');
            expect(result).toHaveProperty('strength');
        });
    });

    describe('calculateKarana', () => {
        test('should calculate Karana correctly', () => {
            const sunLongitude = 30;
            const moonLongitude = 45;

            const result = calculator.calculateKarana(sunLongitude, moonLongitude);

            expect(result).toHaveProperty('number');
            expect(result).toHaveProperty('name');
            expect(result).toHaveProperty('isAuspicious');
            expect(result).toHaveProperty('type');
        });
    });

    describe('calculateVara', () => {
        test('should calculate weekday correctly', () => {
            const date = new Date('2025-01-01'); // Wednesday

            const result = calculator.calculateVara(date);

            expect(result).toHaveProperty('number');
            expect(result).toHaveProperty('name');
            expect(result).toHaveProperty('englishName');
            expect(result).toHaveProperty('lord');
            expect(result).toHaveProperty('isAuspicious');
            expect(result.englishName).toBe('Wednesday');
        });
    });

    describe('calculateSunriseSunset', () => {
        test('should calculate sunrise and sunset times', () => {
            const date = new Date('2025-01-01');
            const latitude = 28.6139;
            const longitude = 77.2090;

            const result = calculator.calculateSunriseSunset(date, latitude, longitude);

            expect(result).toHaveProperty('sunrise');
            expect(result).toHaveProperty('sunset');
            expect(result).toHaveProperty('dayLength');
            expect(result.sunrise).toBeLessThan(result.sunset);
            expect(result.dayLength).toBeGreaterThan(0);
        });
    });

    describe('calculateLunarPhase', () => {
        test('should determine lunar phase correctly', () => {
            // New Moon (0 degrees separation)
            const newMoon = calculator.calculateLunarPhase(0, 0);
            expect(newMoon).toBe('New Moon');

            // Full Moon (180 degrees separation)
            const fullMoon = calculator.calculateLunarPhase(0, 180);
            expect(fullMoon).toBe('Full Moon');

            // First Quarter (90 degrees)
            const firstQuarter = calculator.calculateLunarPhase(0, 90);
            expect(firstQuarter).toBe('First Quarter');
        });
    });

    describe('calculateAuspiciousPeriods', () => {
        test('should return auspicious periods', () => {
            const solarTimes = { sunrise: 6, sunset: 18 };
            const date = new Date('2025-01-01');

            const result = calculator.calculateAuspiciousPeriods(solarTimes, date);

            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBeGreaterThan(0);
            expect(result[0]).toHaveProperty('name');
            expect(result[0]).toHaveProperty('type');
            expect(result[0]).toHaveProperty('startTime');
            expect(result[0]).toHaveProperty('endTime');
        });
    });

    describe('calculateInauspiciousPeriods', () => {
        test('should return inauspicious periods', () => {
            const solarTimes = { sunrise: 6, sunset: 18 };
            const date = new Date('2025-01-01');

            const result = calculator.calculateInauspiciousPeriods(solarTimes, date);

            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBeGreaterThan(0);
            expect(result[0]).toHaveProperty('name');
            expect(result[0]).toHaveProperty('type');
            expect(result[0]).toHaveProperty('startTime');
            expect(result[0]).toHaveProperty('endTime');
        });
    });

    describe('detectFestivals', () => {
        test('should detect Diwali on Krishna Paksha 15', () => {
            const panchang = {
                tithi: { paksha: 'Krishna', adjustedNumber: 15 }
            };

            const result = calculator.detectFestivals(panchang);

            expect(result).toContainEqual({
                name: 'Diwali',
                type: 'Lunar',
                significance: 'Festival of Lights'
            });
        });

        test('should detect Janmashtami on Krishna Paksha 8', () => {
            const panchang = {
                tithi: { paksha: 'Krishna', adjustedNumber: 8 }
            };

            const result = calculator.detectFestivals(panchang);

            expect(result).toContainEqual({
                name: 'Janmashtami',
                type: 'Lunar',
                significance: 'Lord Krishna\'s Birthday'
            });
        });

        test('should return empty array when no festivals', () => {
            const panchang = {
                tithi: { paksha: 'Shukla', adjustedNumber: 1 }
            };

            const result = calculator.detectFestivals(panchang);

            expect(result).toEqual([]);
        });
    });

    describe('angularSeparation', () => {
        test('should calculate minimum angular separation', () => {
            const separation1 = calculator.angularSeparation(0, 10);
            expect(separation1).toBe(10);

            const separation2 = calculator.angularSeparation(350, 10);
            expect(separation2).toBe(20); // Minimum of 340 and 20
        });
    });

    describe('getRahuKaalHours', () => {
        test('should return correct Rahu Kaal hours for each weekday', () => {
            const sunday = calculator.getRahuKaalHours(0);
            expect(sunday).toEqual({ start: 4.5, end: 6 });

            const monday = calculator.getRahuKaalHours(1);
            expect(monday).toEqual({ start: 7.5, end: 9 });

            const saturday = calculator.getRahuKaalHours(6);
            expect(saturday).toEqual({ start: 7.5, end: 9 });
        });
    });

    describe('dateToJulianDay', () => {
        test('should convert date to Julian Day', () => {
            const date = new Date('2025-01-01');
            const jd = calculator.dateToJulianDay(date);

            expect(jd).toBeGreaterThan(2451545); // J2000 epoch
            expect(typeof jd).toBe('number');
        });

        test('should handle leap years correctly', () => {
            const leapYear = new Date('2024-02-29');
            const nonLeapYear = new Date('2023-02-28');

            const jdLeap = calculator.dateToJulianDay(leapYear);
            const jdNonLeap = calculator.dateToJulianDay(nonLeapYear);

            expect(jdLeap).toBeGreaterThan(jdNonLeap);
        });

        test('should handle different times of day', () => {
            const noon = new Date('2025-01-01T12:00:00');
            const midnight = new Date('2025-01-01T00:00:00');

            const jdNoon = calculator.dateToJulianDay(noon);
            const jdMidnight = calculator.dateToJulianDay(midnight);

            expect(jdNoon).toBeCloseTo(jdMidnight + 0.5, 5); // Half day difference
        });
    });

    // Mathematical Foundations Tests
    describe('Mathematical Foundations', () => {
        describe('Angle Normalization', () => {
            test('should normalize angles to 0-360 range', () => {
                // Test positive angles
                expect(normalizeAngle(390)).toBe(30);
                expect(normalizeAngle(720)).toBe(0);

                // Test negative angles
                expect(normalizeAngle(-30)).toBe(330);
                expect(normalizeAngle(-390)).toBe(330);
            });

            test('should handle edge cases', () => {
                expect(normalizeAngle(0)).toBe(0);
                expect(normalizeAngle(360)).toBe(0);
                expect(normalizeAngle(359.999)).toBeCloseTo(359.999, 3);
            });
        });

        describe('Coordinate Validation', () => {
            test('should validate latitude ranges in Panchang calculation', async () => {
                const date = new Date('2025-01-01');

                // Valid latitudes
                await expect(calculator.calculatePanchang(date, 0, 0)).resolves.toBeDefined();
                await expect(calculator.calculatePanchang(date, 90, 0)).resolves.toBeDefined();
                await expect(calculator.calculatePanchang(date, -90, 0)).resolves.toBeDefined();

                // Invalid latitudes should throw
                await expect(calculator.calculatePanchang(date, 91, 0)).rejects.toThrow();
                await expect(calculator.calculatePanchang(date, -91, 0)).rejects.toThrow();
            });

            test('should validate longitude ranges in Panchang calculation', async () => {
                const date = new Date('2025-01-01');

                // Valid longitudes
                await expect(calculator.calculatePanchang(date, 0, 0)).resolves.toBeDefined();
                await expect(calculator.calculatePanchang(date, 0, 180)).resolves.toBeDefined();
                await expect(calculator.calculatePanchang(date, 0, -180)).resolves.toBeDefined();

                // Invalid longitudes should throw
                await expect(calculator.calculatePanchang(date, 0, 181)).rejects.toThrow();
                await expect(calculator.calculatePanchang(date, 0, -181)).rejects.toThrow();
            });
        });

        describe('Angular Separation', () => {
            test('should calculate minimum angular separation', () => {
                expect(calculator.angularSeparation(0, 10)).toBe(10);
                expect(calculator.angularSeparation(350, 10)).toBe(20); // Minimum of 340° and 20°
                expect(calculator.angularSeparation(180, 0)).toBe(180);
                expect(calculator.angularSeparation(359, 1)).toBe(2); // Minimum of 358° and 2°
            });

            test('should handle same positions', () => {
                expect(calculator.angularSeparation(0, 0)).toBe(0);
                expect(calculator.angularSeparation(180, 180)).toBe(0);
            });
        });
    });

    // Ayanamsa Calculation Tests
    describe('Ayanamsa Calculations', () => {
        test('should calculate Lahiri Ayanamsa for different years', () => {
            const ayanamsa1900 = calculateLahiriAyanamsa(1900);
            const ayanamsa2000 = calculateLahiriAyanamsa(2000);
            const ayanamsa2025 = calculateLahiriAyanamsa(2025);

            // Ayanamsa should increase over time due to precession
            expect(ayanamsa2000).toBeGreaterThan(ayanamsa1900);
            expect(ayanamsa2025).toBeGreaterThan(ayanamsa2000);

            // Should be within reasonable ranges
            expect(ayanamsa2025).toBeGreaterThan(20);
            expect(ayanamsa2025).toBeLessThan(30);
        });

        test('should handle edge years', () => {
            expect(() => calculateLahiriAyanamsa(0)).not.toThrow();
            expect(() => calculateLahiriAyanamsa(3000)).not.toThrow();
        });
    });

    // Enhanced Panchang Element Tests
    describe('Enhanced Panchang Elements', () => {
        describe('Tithi Calculations - Edge Cases', () => {
            test('should handle Tithi transitions correctly', () => {
                // Test boundary between Tithis
                const sun = 0;
                const moon = 11.9; // Just before Tithi 2
                const tithi1 = calculator.calculateTithi(sun, moon);
                expect(tithi1.number).toBe(1);

                const moon2 = 12.1; // Just after Tithi 2 starts
                const tithi2 = calculator.calculateTithi(sun, moon2);
                expect(tithi2.number).toBe(2);
            });

            test('should handle full lunar cycle (30 Tithis)', () => {
                const sun = 0;
                for (let i = 0; i < 30; i++) {
                    const moon = i * 12;
                    const tithi = calculator.calculateTithi(sun, moon);
                    expect(tithi.number).toBe((i % 15) + 1);
                    expect(tithi.paksha).toBe(i < 15 ? 'Shukla' : 'Krishna');
                }
            });

            test('should calculate Tithi progress accurately', () => {
                const sun = 0;
                const moon = 6; // Halfway through first Tithi
                const tithi = calculator.calculateTithi(sun, moon);

                expect(tithi.progress).toBeCloseTo(0.5, 2);
            });
        });

        describe('Nakshatra Calculations - Edge Cases', () => {
            test('should handle Nakshatra transitions', () => {
                // Test boundary between Ashwini and Bharani
                const moon1 = 13.332; // Just before Bharani
                const nakshatra1 = calculator.calculateNakshatra(moon1);
                expect(nakshatra1.name).toBe('Ashwini');

                const moon2 = 13.334; // Just after Bharani starts
                const nakshatra2 = calculator.calculateNakshatra(moon2);
                expect(nakshatra2.name).toBe('Bharani');
            });

            test('should calculate correct Pada for all positions', () => {
                const degreesPerNakshatra = 360 / 27;
                const degreesPerPada = degreesPerNakshatra / 4;

                for (let i = 0; i < 27; i++) {
                    for (let pada = 0; pada < 4; pada++) {
                        const moon = i * degreesPerNakshatra + pada * degreesPerPada + 0.1;
                        const nakshatra = calculator.calculateNakshatra(moon);
                        expect(nakshatra.pada).toBe(pada + 1);
                    }
                }
            });

            test('should handle full zodiac cycle', () => {
                for (let i = 0; i < 27; i++) {
                    const moon = i * (360 / 27) + 0.1;
                    const nakshatra = calculator.calculateNakshatra(moon);
                    expect(nakshatra.number).toBe(i + 1);
                }
            });
        });

        describe('Yoga Calculations - Edge Cases', () => {
            test('should handle Yoga transitions', () => {
                const sun = 0;
                const moon = 13.332; // Just before second Yoga
                const yoga1 = calculator.calculateYoga(sun, moon);
                expect(yoga1.number).toBe(1);

                const moon2 = 13.334; // Just after second Yoga starts
                const yoga2 = calculator.calculateYoga(sun, moon2);
                expect(yoga2.number).toBe(2);
            });

            test('should calculate Yoga strength correctly', () => {
                // Test strong Yogas
                const strongYogas = [3, 6, 11, 12, 15, 16, 18, 21, 23, 24, 25, 26];
                strongYogas.forEach(yogaNum => {
                    const strength = calculator.calculateYogaStrength(yogaNum);
                    expect(strength).toBe(0.9);
                });

                // Test weak Yogas
                const weakYogas = [1, 9, 10, 13, 14, 17, 19, 20, 22, 27];
                weakYogas.forEach(yogaNum => {
                    const strength = calculator.calculateYogaStrength(yogaNum);
                    expect(strength).toBe(0.3);
                });
            });
        });

        describe('Karana Calculations - Edge Cases', () => {
            test('should handle Karana transitions', () => {
                const sun = 0;
                const moon = 5.9; // Just before second Karana
                const karana1 = calculator.calculateKarana(sun, moon);
                expect(karana1.number).toBe(1);

                const moon2 = 6.1; // Just after second Karana starts
                const karana2 = calculator.calculateKarana(sun, moon2);
                expect(karana2.number).toBe(2);
            });

            test('should identify Fixed and Variable Karanas', () => {
                for (let i = 0; i < 60; i++) {
                    const sun = 0;
                    const moon = i * 6;
                    const karana = calculator.calculateKarana(sun, moon);

                    if (karana.number % 11 === 0) {
                        expect(karana.type).toBe('Fixed');
                    } else {
                        expect(karana.type).toBe('Variable');
                    }
                }
            });
        });
    });

    // Error Handling Tests
    describe('Error Handling', () => {
        test('should handle invalid dates gracefully', async () => {
            const invalidDate = new Date('invalid');

            await expect(calculator.calculatePanchang(invalidDate, 28.6139, 77.2090))
                .rejects.toThrow();
        });

        test('should validate coordinates in calculatePanchang', async () => {
            const date = new Date('2025-01-01');

            await expect(calculator.calculatePanchang(date, 91, 77.2090))
                .rejects.toThrow();

            await expect(calculator.calculatePanchang(date, 28.6139, 181))
                .rejects.toThrow();
        });

        test('should handle extreme coordinate values', async () => {
            const date = new Date('2025-01-01');

            // Should handle polar regions
            await expect(calculator.calculatePanchang(date, 89.9, 0)).resolves.toBeDefined();
            await expect(calculator.calculatePanchang(date, -89.9, 0)).resolves.toBeDefined();
        });
    });

    // Boundary Condition Tests
    describe('Boundary Conditions', () => {
        test('should handle polar region sunrise/sunset', () => {
            const date = new Date('2025-06-21'); // Summer solstice

            // North Pole - should have continuous daylight
            const northPole = calculator.calculateSunriseSunset(date, 90, 0);
            expect(northPole.dayLength).toBeGreaterThan(20); // Very long day

            // South Pole - should have continuous night
            const southPole = calculator.calculateSunriseSunset(date, -90, 0);
            expect(southPole.dayLength).toBeLessThan(4); // Very short day
        });

        test('should handle leap year dates', async () => {
            const leapDate = new Date('2024-02-29');
            const panchang = await calculator.calculatePanchang(leapDate, 28.6139, 77.2090);

            expect(panchang.date.getFullYear()).toBe(2024);
            expect(panchang.date.getMonth()).toBe(1); // February (0-indexed)
            expect(panchang.date.getDate()).toBe(29);
        });

        test('should handle historical dates', async () => {
            const historicalDate = new Date('1900-01-01');
            const panchang = await calculator.calculatePanchang(historicalDate, 28.6139, 77.2090);

            expect(panchang).toHaveProperty('julianDay');
            expect(panchang.julianDay).toBeGreaterThan(2410000); // Historical JD
        });

        test('should handle future dates', async () => {
            const futureDate = new Date('2050-12-31');
            const panchang = await calculator.calculatePanchang(futureDate, 28.6139, 77.2090);

            expect(panchang).toHaveProperty('julianDay');
            expect(panchang.julianDay).toBeGreaterThan(2460000); // Future JD
        });
    });

    // Performance Tests
    describe('Performance Benchmarks', () => {
        test('should calculate Panchang within time limits', async () => {
            const date = new Date('2025-01-01');
            const startTime = Date.now();

            const panchang = await calculator.calculatePanchang(date, 28.6139, 77.2090);
            const endTime = Date.now();

            const duration = endTime - startTime;
            expect(duration).toBeLessThan(100); // Should complete in under 100ms
            expect(panchang).toBeDefined();
        });

        test('should handle bulk calculations efficiently', async () => {
            const dates = [];
            for (let i = 0; i < 30; i++) {
                dates.push(new Date(2025, 0, i + 1)); // January 2025
            }

            const startTime = Date.now();
            const promises = dates.map(date =>
                calculator.calculatePanchang(date, 28.6139, 77.2090)
            );

            const results = await Promise.all(promises);
            const endTime = Date.now();

            const duration = endTime - startTime;
            expect(duration).toBeLessThan(2000); // Should complete in under 2 seconds
            expect(results).toHaveLength(30);
            results.forEach(result => expect(result).toBeDefined());
        });
    });

    // Integration Tests
    describe('Integration Tests', () => {
        test('should generate consistent Panchang data structure', async () => {
            const date = new Date('2025-01-15');
            const panchang = await calculator.calculatePanchang(date, 28.6139, 77.2090);

            // Verify all required properties exist
            const requiredProperties = [
                'date', 'location', 'julianDay', 'ayanamsa',
                'tithi', 'vara', 'nakshatra', 'yoga', 'karana',
                'sunrise', 'sunset', 'dayLength', 'moonPhase',
                'auspiciousPeriods', 'inauspiciousPeriods', 'festivals'
            ];

            requiredProperties.forEach(prop => {
                expect(panchang).toHaveProperty(prop);
            });

            // Verify Panchang elements have required sub-properties
            expect(panchang.tithi).toHaveProperty('number');
            expect(panchang.tithi).toHaveProperty('name');
            expect(panchang.tithi).toHaveProperty('paksha');
            expect(panchang.nakshatra).toHaveProperty('number');
            expect(panchang.nakshatra).toHaveProperty('name');
            expect(panchang.yoga).toHaveProperty('number');
            expect(panchang.yoga).toHaveProperty('name');
        });

        test('should maintain data consistency across calculations', async () => {
            const date1 = new Date('2025-01-01');
            const date2 = new Date('2025-01-02');

            const panchang1 = await calculator.calculatePanchang(date1, 28.6139, 77.2090);
            const panchang2 = await calculator.calculatePanchang(date2, 28.6139, 77.2090);

            // Julian days should be consecutive
            expect(panchang2.julianDay - panchang1.julianDay).toBeCloseTo(1, 1);

            // Ayanamsa should be very similar (minimal change in one day)
            expect(Math.abs(panchang2.ayanamsa - panchang1.ayanamsa)).toBeLessThan(0.001);
        });
    });

    // Validation Against Reference Data
    describe('Validation Against Reference Data', () => {
        test('should match known astronomical data for J2000 epoch', () => {
            const j2000 = new Date('2000-01-01T12:00:00Z');
            const jd = calculator.dateToJulianDay(j2000);

            // J2000.0 epoch should be 2451545.0
            expect(jd).toBeCloseTo(2451545.0, 1);
        });

        test('should validate Tithi against traditional calculations', () => {
            // Known test case: New Moon
            const sun = 0;
            const moon = 0;
            const tithi = calculator.calculateTithi(sun, moon);

            expect(tithi.number).toBe(1);
            expect(tithi.paksha).toBe('Shukla');
            expect(tithi.adjustedNumber).toBe(1);
        });

        test('should validate Nakshatra positions', () => {
            // Ashwini starts at 0°
            const ashwini = calculator.calculateNakshatra(0);
            expect(ashwini.name).toBe('Ashwini');
            expect(ashwini.number).toBe(1);

            // Bharani starts around 13.33°
            const bharani = calculator.calculateNakshatra(13.5);
            expect(bharani.name).toBe('Bharani');
            expect(bharani.number).toBe(2);
        });

        test('should validate sunrise/sunset for known location', () => {
            const date = new Date('2025-01-01');
            const delhi = { lat: 28.6139, lon: 77.2090 };
            const solarTimes = calculator.calculateSunriseSunset(date, delhi.lat, delhi.lon);

            // Delhi in January should have sunrise around 7 AM and sunset around 6 PM
            expect(solarTimes.sunrise).toBeGreaterThan(6);
            expect(solarTimes.sunrise).toBeLessThan(8);
            expect(solarTimes.sunset).toBeGreaterThan(17);
            expect(solarTimes.sunset).toBeLessThan(19);
        });
    });

    // Additional Activity Tests
    describe('Activity Recommendations', () => {
        test('should provide auspicious activities based on Panchang', async () => {
            const date = new Date('2025-01-01');
            const panchang = await calculator.calculatePanchang(date, 28.6139, 77.2090);

            const auspiciousActivities = calculator.getAuspiciousActivities(panchang);
            const inauspiciousActivities = calculator.getInauspiciousActivities(panchang);

            expect(Array.isArray(auspiciousActivities)).toBe(true);
            expect(Array.isArray(inauspiciousActivities)).toBe(true);

            // Should have some recommendations
            expect(auspiciousActivities.length + inauspiciousActivities.length).toBeGreaterThan(0);
        });

        test('should recommend activities based on element auspiciousness', async () => {
            // Create mock Panchang with all auspicious elements
            const mockPanchang = {
                tithi: { isAuspicious: true },
                nakshatra: { isAuspicious: true },
                yoga: { isAuspicious: true },
                vara: { isAuspicious: true }
            };

            const activities = calculator.getAuspiciousActivities(mockPanchang);
            expect(activities.length).toBeGreaterThan(2); // Should recommend multiple activities
        });
    });
});