/**
 * ZodiaCore - Dosha Analysis Engine
 *
 * Comprehensive analysis of various planetary doshas including Kalasarpa, Pitru,
 * Guru Chandal, and Sarp Dosha. Provides detailed calculations and remedies.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const {
    KALASARPA_CONSTANTS,
    PITRU_DOSHA_INDICATORS,
    GURU_CHANDAL_DOSHA,
    SARP_DOSHA_HOUSES,
    SARP_DOSHA_EFFECTS,
    DOSHA_INTENSITY_LEVELS,
    BENEFIC_PLANETS,
    MALEFIC_PLANETS,
    HOUSE_SYSTEM
} = require('./dosha-constants');
const { calculateWholeSignHouses } = require('./house-systems');
const { normalizeAngle } = require('./math-utils');

/**
 * Dosha Analysis Engine Class
 * Handles comprehensive dosha analysis for Vedic astrology
 */
class DoshaAnalysisEngine {
    constructor() {
        // Dosha analysis configuration
        this.doshaTypes = [
            'kalasarpa',
            'pitru',
            'guruChandal',
            'sarp'
        ];
    }

    /**
     * Perform complete dosha analysis for a birth chart
     * @param {Object} chart - Birth chart with planetary positions
     * @returns {Object} Complete dosha analysis
     */
    analyzeAllDoshas(chart) {
        if (!this._validateChart(chart)) {
            throw new Error('Invalid chart data provided for dosha analysis');
        }

        const results = {};

        // Analyze each dosha type
        results.kalasarpaDosha = this._analyzeKalasarpaDosha(chart);
        results.pitruDosha = this._analyzePitruDosha(chart);
        results.guruChandalDosha = this._analyzeGuruChandalDosha(chart);
        results.sarpDosha = this._analyzeSarpDosha(chart);

        // Calculate overall dosha impact
        results.overallAssessment = this._assessOverallDoshaImpact(results);
        results.remedies = this._generateComprehensiveRemedies(results);

        return results;
    }

    /**
     * Analyze Kalasarpa Dosha (all planets between Rahu and Ketu)
     * @private
     */
    _analyzeKalasarpaDosha(chart) {
        const rahu = chart.planets.RAHU;
        const ketu = chart.planets.KETU;

        if (!rahu || !ketu) {
            return { present: false, reason: 'Rahu or Ketu not found in chart' };
        }

        const rahuPos = rahu.longitude;
        const ketuPos = ketu.longitude;

        // Get all planets between Rahu and Ketu
        const planetsBetween = this._getPlanetsBetween(rahuPos, ketuPos, chart.planets);

        const minPlanets = KALASARPA_CONSTANTS.MIN_PLANETS_BETWEEN_RAHU_KETU;
        const isPresent = planetsBetween.length >= minPlanets;

        if (!isPresent) {
            return {
                present: false,
                planetsBetween: planetsBetween.length,
                required: minPlanets,
                planets: planetsBetween
            };
        }

        // Determine type and intensity
        const type = this._determineKalasarpaType(rahuPos, ketuPos);
        const intensity = this._calculateKalasarpaIntensity(planetsBetween, chart);
        const effects = this._analyzeKalasarpaEffects(type, intensity);
        const remedies = this._generateKalasarpaRemedies(type, intensity);

        return {
            present: true,
            type: type,
            intensity: intensity,
            intensityLevel: this._getIntensityLevel(intensity),
            planetsBetween: planetsBetween.length,
            planets: planetsBetween,
            effects: effects,
            remedies: remedies,
            rahuPosition: rahuPos,
            ketuPosition: ketuPos
        };
    }

    /**
     * Analyze Pitru Dosha (ancestral afflictions)
     * @private
     */
    _analyzePitruDosha(chart) {
        const doshaIndicators = [];
        const houses = calculateWholeSignHouses(chart.ascendant);

        // Check for Sun in 9th house
        const sunHouse = this._getHouseFromLongitude(chart.planets.SUN.longitude, houses);
        if (sunHouse === 9) {
            doshaIndicators.push({
                type: 'Sun in 9th',
                effect: PITRU_DOSHA_INDICATORS.SUN_IN_9TH,
                severity: 'High'
            });
        }

        // Check for Moon in 9th house
        const moonHouse = this._getHouseFromLongitude(chart.planets.MOON.longitude, houses);
        if (moonHouse === 9) {
            doshaIndicators.push({
                type: 'Moon in 9th',
                effect: PITRU_DOSHA_INDICATORS.MOON_IN_9TH,
                severity: 'High'
            });
        }

        // Check for Rahu in 9th house
        const rahuHouse = this._getHouseFromLongitude(chart.planets.RAHU.longitude, houses);
        if (rahuHouse === 9) {
            doshaIndicators.push({
                type: 'Rahu in 9th',
                effect: PITRU_DOSHA_INDICATORS.RAHU_IN_9TH,
                severity: 'High'
            });
        }

        // Check for Saturn in 9th house
        const saturnHouse = this._getHouseFromLongitude(chart.planets.SATURN.longitude, houses);
        if (saturnHouse === 9) {
            doshaIndicators.push({
                type: 'Saturn in 9th',
                effect: PITRU_DOSHA_INDICATORS.SATURN_IN_9TH,
                severity: 'Medium'
            });
        }

        const isPresent = doshaIndicators.length > 0;
        const intensity = this._calculatePitruIntensity(doshaIndicators);

        return {
            present: isPresent,
            indicators: doshaIndicators,
            intensity: intensity,
            intensityLevel: this._getIntensityLevel(intensity),
            effects: isPresent ? this._analyzePitruEffects(doshaIndicators) : [],
            remedies: isPresent ? this._generatePitruRemedies(intensity) : []
        };
    }

    /**
     * Analyze Guru Chandal Dosha (Jupiter-Saturn conjunction)
     * @private
     */
    _analyzeGuruChandalDosha(chart) {
        const jupiter = chart.planets.JUPITER;
        const saturn = chart.planets.SATURN;

        if (!jupiter || !saturn) {
            return { present: false, reason: 'Jupiter or Saturn not found' };
        }

        const separation = Math.abs(normalizeAngle(jupiter.longitude - saturn.longitude));
        const isConjunct = separation <= GURU_CHANDAL_DOSHA.CONJUNCTION_DEGREES;

        if (!isConjunct) {
            return {
                present: false,
                separation: separation,
                required: GURU_CHANDAL_DOSHA.CONJUNCTION_DEGREES
            };
        }

        const intensity = this._calculateGuruChandalIntensity(separation, chart);
        const effects = this._analyzeGuruChandalEffects(intensity);
        const remedies = this._generateGuruChandalRemedies(intensity);

        return {
            present: true,
            separation: separation,
            intensity: intensity,
            intensityLevel: this._getIntensityLevel(intensity),
            effects: effects,
            remedies: remedies,
            jupiterPosition: jupiter.longitude,
            saturnPosition: saturn.longitude
        };
    }

    /**
     * Analyze Sarp Dosha (Rahu/Ketu in 5th or 9th house)
     * @private
     */
    _analyzeSarpDosha(chart) {
        const houses = calculateWholeSignHouses(chart.ascendant);
        const sarpIndicators = [];

        // Check Rahu in 5th or 9th
        const rahuHouse = this._getHouseFromLongitude(chart.planets.RAHU.longitude, houses);
        if (SARP_DOSHA_HOUSES.includes(rahuHouse)) {
            sarpIndicators.push({
                planet: 'Rahu',
                house: rahuHouse,
                effect: SARP_DOSHA_EFFECTS[rahuHouse === 5 ? '5TH_HOUSE' : '9TH_HOUSE']
            });
        }

        // Check Ketu in 5th or 9th
        const ketuHouse = this._getHouseFromLongitude(chart.planets.KETU.longitude, houses);
        if (SARP_DOSHA_HOUSES.includes(ketuHouse)) {
            sarpIndicators.push({
                planet: 'Ketu',
                house: ketuHouse,
                effect: SARP_DOSHA_EFFECTS[ketuHouse === 5 ? '5TH_HOUSE' : '9TH_HOUSE']
            });
        }

        const isPresent = sarpIndicators.length > 0;
        const intensity = this._calculateSarpIntensity(sarpIndicators, chart);

        return {
            present: isPresent,
            indicators: sarpIndicators,
            intensity: intensity,
            intensityLevel: this._getIntensityLevel(intensity),
            effects: isPresent ? this._analyzeSarpEffects(sarpIndicators) : [],
            remedies: isPresent ? this._generateSarpRemedies(intensity) : []
        };
    }

    /**
     * Get planets between two points on the zodiac
     * @private
     */
    _getPlanetsBetween(startPos, endPos, planets) {
        const planetsBetween = [];

        // Normalize positions
        const normalizedStart = normalizeAngle(startPos);
        const normalizedEnd = normalizeAngle(endPos);

        // Check each planet
        Object.keys(planets).forEach(planet => {
            if (planet === 'RAHU' || planet === 'KETU') return; // Exclude nodes themselves

            const planetPos = normalizeAngle(planets[planet].longitude);

            // Check if planet is between Rahu and Ketu
            if (this._isBetween(normalizedStart, normalizedEnd, planetPos)) {
                planetsBetween.push({
                    name: planet,
                    longitude: planetPos,
                    type: BENEFIC_PLANETS.includes(planet) ? 'benefic' : 'malefic'
                });
            }
        });

        return planetsBetween;
    }

    /**
     * Check if a position is between two points (handling 360° wraparound)
     * @private
     */
    _isBetween(start, end, position) {
        if (start < end) {
            return position >= start && position <= end;
        } else {
            // Handle wraparound (e.g., 350° to 10°)
            return position >= start || position <= end;
        }
    }

    /**
     * Determine Kalasarpa Dosha type
     * @private
     */
    _determineKalasarpaType(rahuPos, ketuPos) {
        // Simplified classification based on positions
        const rahuSign = Math.floor(rahuPos / 30);
        const ketuSign = Math.floor(ketuPos / 30);

        if (rahuSign === 0 || ketuSign === 0) return 'Capricorn Axis';
        if (rahuSign === 6 || ketuSign === 6) return 'Libra Axis';
        if (rahuSign === 3 || ketuSign === 3) return 'Cancer Axis';
        if (rahuSign === 9 || ketuSign === 9) return 'Capricorn Axis';

        return 'Standard';
    }

    /**
     * Calculate Kalasarpa Dosha intensity
     * @private
     */
    _calculateKalasarpaIntensity(planetsBetween, chart) {
        let intensity = planetsBetween.length * 2; // Base intensity from planet count

        // Adjust based on benefic/malefic planets
        const beneficCount = planetsBetween.filter(p => p.type === 'benefic').length;
        const maleficCount = planetsBetween.filter(p => p.type === 'malefic').length;

        intensity += maleficCount * 1.5; // Malefics increase intensity
        intensity -= beneficCount * 1;  // Benefics decrease intensity

        // Adjust based on house placements (simplified)
        const houses = calculateWholeSignHouses(chart.ascendant);
        planetsBetween.forEach(planet => {
            const house = this._getHouseFromLongitude(planet.longitude, houses);
            if ([6, 8, 12].includes(house)) { // Dusthana houses
                intensity += 1;
            }
        });

        return Math.min(10, Math.max(1, intensity));
    }

    /**
     * Analyze Kalasarpa effects
     * @private
     */
    _analyzeKalasarpaEffects(type, intensity) {
        const effects = [
            'Delays in major life events',
            'Obstacles in career and relationships',
            'Spiritual and psychological challenges'
        ];

        if (intensity >= 7) {
            effects.push('Severe life obstacles');
            effects.push('Need for strong spiritual practices');
        }

        if (type === 'Capricorn Axis') {
            effects.push('Career and authority challenges');
        } else if (type === 'Libra Axis') {
            effects.push('Relationship and partnership issues');
        }

        return effects;
    }

    /**
     * Generate Kalasarpa remedies
     * @private
     */
    _generateKalasarpaRemedies(type, intensity) {
        const remedies = {
            spiritual: [],
            ritual: [],
            gemstone: [],
            mantra: []
        };

        remedies.spiritual = [
            'Regular meditation and spiritual practices',
            'Chanting mantras for Rahu and Ketu',
            'Visiting temples and holy places'
        ];

        remedies.ritual = [
            'Kalasarpa Dosha Nivaran Puja',
            'Donation of black items',
            'Feeding the poor and needy'
        ];

        remedies.gemstone = [
            'Hessonite (Gomed) for Rahu',
            'Cats eye (Lehsunia) for Ketu'
        ];

        remedies.mantra = [
            'Om Rahave Namaha (Rahu mantra)',
            'Om Ketave Namaha (Ketu mantra)',
            'Maha Mrityunjaya Mantra'
        ];

        if (intensity >= 8) {
            remedies.ritual.push('Special pujas and ceremonies');
        }

        return remedies;
    }

    /**
     * Calculate Pitru Dosha intensity
     * @private
     */
    _calculatePitruIntensity(indicators) {
        let intensity = 0;

        indicators.forEach(indicator => {
            if (indicator.severity === 'High') {
                intensity += 3;
            } else if (indicator.severity === 'Medium') {
                intensity += 2;
            } else {
                intensity += 1;
            }
        });

        return Math.min(10, intensity);
    }

    /**
     * Analyze Pitru Dosha effects
     * @private
     */
    _analyzePitruEffects(indicators) {
        const effects = [];

        indicators.forEach(indicator => {
            effects.push(indicator.effect);
        });

        // Additional general effects
        effects.push('Ancestral karma affecting current life');
        effects.push('Challenges in father-child relationships');
        effects.push('Obstacles in spiritual progress');

        return effects;
    }

    /**
     * Generate Pitru Dosha remedies
     * @private
     */
    _generatePitruRemedies(intensity) {
        const remedies = {
            ritual: [],
            spiritual: [],
            charitable: []
        };

        remedies.ritual = [
            'Pitru Paksha ceremonies',
            'Tarpan rituals for ancestors',
            'Shradh ceremonies'
        ];

        remedies.spiritual = [
            'Regular ancestor prayers',
            'Visiting ancestral temples',
            'Chanting Pitru mantras'
        ];

        remedies.charitable = [
            'Donation to Brahmins',
            'Feeding the poor',
            'Planting trees in ancestors\' names'
        ];

        return remedies;
    }

    /**
     * Calculate Guru Chandal intensity
     * @private
     */
    _calculateGuruChandalIntensity(separation, chart) {
        let intensity = 10 - (separation * 2); // Closer conjunction = higher intensity

        // Adjust based on signs and houses
        const jupiterSign = Math.floor(chart.planets.JUPITER.longitude / 30);
        const saturnSign = Math.floor(chart.planets.SATURN.longitude / 30);

        // Enemy signs increase intensity
        if ([3, 6, 9].includes(jupiterSign)) intensity += 1; // Jupiter enemies
        if ([1, 4, 7, 10].includes(saturnSign)) intensity += 1; // Saturn enemies

        return Math.min(10, Math.max(1, intensity));
    }

    /**
     * Analyze Guru Chandal effects
     * @private
     */
    _analyzeGuruChandalEffects(intensity) {
        const effects = [];

        GURU_CHANDAL_DOSHA.EFFECTS.CAREER && effects.push(GURU_CHANDAL_DOSHA.EFFECTS.CAREER);
        GURU_CHANDAL_DOSHA.EFFECTS.WEALTH && effects.push(GURU_CHANDAL_DOSHA.EFFECTS.WEALTH);
        GURU_CHANDAL_DOSHA.EFFECTS.HEALTH && effects.push(GURU_CHANDAL_DOSHA.EFFECTS.HEALTH);

        if (intensity >= 7) {
            effects.push('Major life challenges');
            effects.push('Need for spiritual guidance');
        }

        return effects;
    }

    /**
     * Generate Guru Chandal remedies
     * @private
     */
    _generateGuruChandalRemedies(intensity) {
        const remedies = {
            ritual: [],
            gemstone: [],
            mantra: []
        };

        remedies.ritual = [
            'Jupiter-Saturn specific pujas',
            'Donation of yellow and blue items',
            'Fasting on Thursdays and Saturdays'
        ];

        remedies.gemstone = [
            'Yellow Sapphire (for Jupiter)',
            'Blue Sapphire (for Saturn)'
        ];

        remedies.mantra = [
            'Om Brim Brihaspataye Namaha (Jupiter)',
            'Om Sham Shanaischaraye Namaha (Saturn)'
        ];

        return remedies;
    }

    /**
     * Calculate Sarp Dosha intensity
     * @private
     */
    _calculateSarpIntensity(indicators, chart) {
        let intensity = indicators.length * 3; // Base intensity

        // 9th house is more severe than 5th
        indicators.forEach(indicator => {
            if (indicator.house === 9) {
                intensity += 2;
            }
        });

        // Adjust based on planet (Rahu is stronger than Ketu)
        const rahuCount = indicators.filter(i => i.planet === 'Rahu').length;
        intensity += rahuCount;

        return Math.min(10, intensity);
    }

    /**
     * Analyze Sarp Dosha effects
     * @private
     */
    _analyzeSarpEffects(indicators) {
        const effects = [];

        indicators.forEach(indicator => {
            effects.push(indicator.effect);
        });

        effects.push('Spiritual and karmic challenges');
        effects.push('Obstacles in life progression');

        return effects;
    }

    /**
     * Generate Sarp Dosha remedies
     * @private
     */
    _generateSarpRemedies(intensity) {
        const remedies = {
            ritual: [],
            gemstone: [],
            mantra: []
        };

        remedies.ritual = [
            'Sarp Dosha Nivaran Puja',
            'Donation of milk and snakes',
            'Worship of Lord Shiva'
        ];

        remedies.gemstone = [
            'Hessonite (Gomed) for Rahu',
            'Cats eye (Lehsunia) for Ketu'
        ];

        remedies.mantra = [
            'Om Rahave Namaha',
            'Om Ketave Namaha',
            'Maha Mrityunjaya Mantra'
        ];

        return remedies;
    }

    /**
     * Assess overall dosha impact
     * @private
     */
    _assessOverallDoshaImpact(doshaResults) {
        let totalIntensity = 0;
        let doshaCount = 0;

        Object.values(doshaResults).forEach(dosha => {
            if (dosha.present && dosha.intensity) {
                totalIntensity += dosha.intensity;
                doshaCount++;
            }
        });

        const averageIntensity = doshaCount > 0 ? totalIntensity / doshaCount : 0;

        let assessment = 'Low dosha impact';
        if (averageIntensity >= 7) {
            assessment = 'High dosha impact - comprehensive remedies recommended';
        } else if (averageIntensity >= 4) {
            assessment = 'Moderate dosha impact - remedial measures advised';
        }

        return {
            totalDoshas: doshaCount,
            averageIntensity: averageIntensity,
            assessment: assessment,
            severity: this._getIntensityLevel(averageIntensity)
        };
    }

    /**
     * Generate comprehensive remedies
     * @private
     */
    _generateComprehensiveRemedies(doshaResults) {
        const remedies = {
            spiritual: [],
            ritual: [],
            gemstone: [],
            lifestyle: []
        };

        // Collect remedies from all present doshas
        Object.values(doshaResults).forEach(dosha => {
            if (dosha.present && dosha.remedies) {
                Object.keys(remedies).forEach(category => {
                    if (dosha.remedies[category]) {
                        remedies[category].push(...dosha.remedies[category]);
                    }
                });
            }
        });

        // Remove duplicates and limit to most important
        Object.keys(remedies).forEach(category => {
            remedies[category] = [...new Set(remedies[category])].slice(0, 5);
        });

        return remedies;
    }

    /**
     * Get house from longitude
     * @private
     */
    _getHouseFromLongitude(longitude, houses) {
        if (!houses || houses.length !== HOUSE_SYSTEM.EXPECTED_HOUSES) {
            throw new Error(`Invalid houses array: must contain ${HOUSE_SYSTEM.EXPECTED_HOUSES} house cusps, got ${houses ? houses.length : 0}`);
        }

        for (let i = 0; i < houses.length; i++) {
            const currentHouse = houses[i];
            const nextHouse = houses[(i + 1) % houses.length];

            if (nextHouse > currentHouse) {
                if (longitude >= currentHouse && longitude < nextHouse) {
                    return i + 1;
                }
            } else {
                if (longitude >= currentHouse || longitude < nextHouse) {
                    return i + 1;
                }
            }
        }
        return 1;
    }

    /**
     * Get intensity level description
     * @private
     */
    _getIntensityLevel(intensity) {
        if (intensity <= DOSHA_INTENSITY_LEVELS.MILD.max) return 'Mild';
        if (intensity <= DOSHA_INTENSITY_LEVELS.MODERATE.max) return 'Moderate';
        if (intensity <= DOSHA_INTENSITY_LEVELS.SEVERE.max) return 'Severe';
        return 'Critical';
    }

    /**
     * Validate chart data
     * @private
     */
    _validateChart(chart) {
        return chart &&
               chart.planets &&
               chart.ascendant !== undefined &&
               chart.planets.SUN &&
               chart.planets.MOON &&
               chart.planets.RAHU &&
               chart.planets.KETU;
    }
}

module.exports = DoshaAnalysisEngine;