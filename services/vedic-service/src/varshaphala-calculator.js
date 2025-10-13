/**
 * ZodiaCore - Varshaphala Calculator
 *
 * Calculates annual horoscope predictions (Varshaphala) based on solar return charts.
 * Implements Muntha system and comprehensive yearly predictions.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { VARSHA_CONSTANTS, ASPECT_ORBS } = require('./dosha-constants');
const { calculateSolarReturn } = require('./return-chart-calculator');
const { calculateWholeSignHouses, getHouseFromLongitude } = require('./house-systems');
const { normalizeAngle } = require('./math-utils');

/**
 * Varshaphala Calculator Class
 * Handles annual horoscope calculations and predictions
 */
class VarshaphalaCalculator {
    constructor() {
        // Muntha significations by house
        this.munthaHouses = {
            1: 'Self, personality, health, new beginnings',
            2: 'Wealth, family, speech, food',
            3: 'Siblings, courage, short journeys, communication',
            4: 'Home, mother, emotions, property',
            5: 'Children, education, creativity, speculation',
            6: 'Enemies, health, service, daily routine',
            7: 'Marriage, partnerships, business, spouse',
            8: 'Longevity, secrets, occult, transformation',
            9: 'Fortune, father, spirituality, higher learning',
            10: 'Career, reputation, authority, public image',
            11: 'Gains, friends, hopes, elder siblings',
            12: 'Expenses, foreign lands, spirituality, losses'
        };

        // Planetary strengths for prediction weighting
        this.planetStrengths = {
            SUN: 1.2, MOON: 1.1, MARS: 1.3, MERCURY: 1.0,
            JUPITER: 1.4, VENUS: 1.1, SATURN: 1.3, RAHU: 1.2, KETU: 1.2
        };
    }

    /**
     * Calculate complete Varshaphala for a given year
     * @param {Object} natalChart - Natal birth chart
     * @param {number} returnYear - Year for Varshaphala
     * @param {number} latitude - Optional latitude override
     * @param {number} longitude - Optional longitude override
     * @returns {Object} Complete Varshaphala analysis
     */
    async calculateVarshaphala(natalChart, returnYear, latitude = null, longitude = null) {
        if (!this._validateInputs(natalChart, returnYear)) {
            throw new Error('Invalid input for Varshaphala calculation');
        }

        try {
            // Calculate solar return chart
            const returnChart = calculateSolarReturn(natalChart, returnYear, latitude, longitude);

            // Determine Muntha (annual significator)
            const muntha = this._determineMuntha(returnChart);

            // Analyze yearly planetary influences
            const yearlyPlanets = this._analyzeYearlyPlanets(returnChart, natalChart);

            // Calculate Muntha aspects and strength
            const munthaAnalysis = this._analyzeMunthaStrength(muntha, returnChart, natalChart);

            // Generate predictions for different life areas
            const predictions = this._generatePredictions(muntha, yearlyPlanets, returnChart, natalChart);

            // Determine key themes for the year
            const keyThemes = this._extractKeyThemes(muntha, predictions);

            return {
                returnYear: returnYear,
                returnChart: returnChart,
                muntha: muntha,
                munthaAnalysis: munthaAnalysis,
                yearlyPlanets: yearlyPlanets,
                predictions: predictions,
                keyThemes: keyThemes,
                overallRating: this._calculateOverallRating(munthaAnalysis, yearlyPlanets),
                favorablePeriods: this._identifyFavorablePeriods(returnChart, muntha),
                cautionaryPeriods: this._identifyCautionaryPeriods(returnChart, muntha)
            };
        } catch (error) {
            throw new Error(`Varshaphala calculation failed: ${error.message}`);
        }
    }

    /**
     * Determine Muntha (annual significator) from return ascendant
     * @private
     */
    _determineMuntha(returnChart) {
        const ascendantSign = Math.floor(returnChart.ascendant.longitude / 30);
        const munthaPlanet = VARSHA_CONSTANTS.MUNTHA_MAPPING[ascendantSign];

        if (!munthaPlanet) {
            throw new Error(`Invalid ascendant sign for Muntha calculation: ${ascendantSign}. Valid signs are 0-11.`);
        }

        const munthaPosition = returnChart.planets[munthaPlanet];
        const munthaHouse = getHouseFromLongitude(munthaPosition.longitude, returnChart.houses);

        return {
            planet: munthaPlanet,
            position: munthaPosition,
            house: munthaHouse,
            sign: Math.floor(munthaPosition.longitude / 30),
            strength: this._calculateMunthaStrength(munthaPosition, returnChart),
            significance: this._analyzeMunthaSignificance(munthaPlanet, munthaHouse),
            aspects: this._getMunthaAspects(munthaPosition.longitude, returnChart.planets)
        };
    }

    /**
     * Calculate Muntha strength based on various factors
     * @private
     */
    _calculateMunthaStrength(munthaPosition, returnChart) {
        let strength = 1.0;

        // Base strength from planet type
        strength *= this.planetStrengths[munthaPosition.planet] || 1.0;

        // Sign dignity (simplified)
        const sign = Math.floor(munthaPosition.longitude / 30);
        if ([0, 3, 6, 9].includes(sign)) { // Cardinal signs
            strength *= 1.1;
        }

        // House placement strength
        const house = getHouseFromLongitude(munthaPosition.longitude, returnChart.houses);
        if ([1, 5, 9, 10].includes(house)) { // Kendra houses
            strength *= 1.2;
        } else if ([6, 8, 12].includes(house)) { // Dusthana houses
            strength *= 0.8;
        }

        // Aspect strength (simplified)
        const aspects = this._getMunthaAspects(munthaPosition.longitude, returnChart.planets);
        const beneficialAspects = aspects.filter(a => ['trine', 'sextile'].includes(a.type.toLowerCase()));
        const challengingAspects = aspects.filter(a => ['square', 'opposition'].includes(a.type.toLowerCase()));

        strength += beneficialAspects.length * 0.1;
        strength -= challengingAspects.length * 0.1;

        return Math.max(0.1, Math.min(2.0, strength));
    }

    /**
     * Analyze Muntha significance based on planet and house
     * @private
     */
    _analyzeMunthaSignificance(planet, house) {
        const significances = {
            SUN: {
                general: 'Leadership, authority, father, government',
                yearly: 'Career advancement, recognition, health focus'
            },
            MOON: {
                general: 'Emotions, mother, mind, public',
                yearly: 'Emotional stability, family matters, intuition'
            },
            MARS: {
                general: 'Energy, courage, siblings, conflicts',
                yearly: 'Action, competition, physical activities'
            },
            MERCURY: {
                general: 'Communication, intellect, business, education',
                yearly: 'Learning, communication, short journeys'
            },
            JUPITER: {
                general: 'Wisdom, prosperity, spirituality, children',
                yearly: 'Growth, expansion, spiritual development'
            },
            VENUS: {
                general: 'Love, beauty, luxury, partnerships',
                yearly: 'Relationships, creativity, material comforts'
            },
            SATURN: {
                general: 'Discipline, karma, longevity, hard work',
                yearly: 'Responsibilities, delays, spiritual lessons'
            },
            RAHU: {
                general: 'Ambition, foreign matters, innovation',
                yearly: 'New directions, unconventional paths'
            },
            KETU: {
                general: 'Spirituality, detachment, past life karma',
                yearly: 'Inner transformation, spiritual insights'
            }
        };

        const planetSig = significances[planet] || { general: 'General influence', yearly: 'General yearly themes' };
        const houseSig = this.munthaHouses[house] || 'General life areas';

        return {
            planetSignificance: planetSig,
            houseSignificance: houseSig,
            combinedTheme: `${planetSig.yearly} with focus on ${houseSig.toLowerCase()}`
        };
    }

    /**
     * Get aspects to Muntha from other planets
     * @private
     */
    _getMunthaAspects(munthaLongitude, planets) {
        const aspects = [];
        const aspectAngles = [
            { angle: 60, name: 'Sextile', strength: 0.8 },
            { angle: 90, name: 'Square', strength: 0.6 },
            { angle: 120, name: 'Trine', strength: 1.0 },
            { angle: 180, name: 'Opposition', strength: 0.5 }
        ];

        Object.keys(planets).forEach(planet => {
            if (planet === 'MUNTHA') return; // Skip if muntha is stored as planet

            const planetLongitude = planets[planet].longitude;
            const separation = Math.abs(normalizeAngle(planetLongitude - munthaLongitude));

            aspectAngles.forEach(aspect => {
                if (Math.abs(separation - aspect.angle) <= ASPECT_ORBS.WIDE) { // Wide aspect orb for varshaphala
                    aspects.push({
                        planet: planet,
                        type: aspect.name,
                        angle: aspect.angle,
                        separation: separation,
                        strength: aspect.strength,
                        influence: this._interpretAspect(planet, aspect.name)
                    });
                }
            });
        });

        return aspects;
    }

    /**
     * Analyze yearly planetary influences
     * @private
     */
    _analyzeYearlyPlanets(returnChart, natalChart) {
        const yearlyPlanets = {};

        Object.keys(returnChart.planets).forEach(planet => {
            const returnPos = returnChart.planets[planet];
            const natalPos = natalChart.planets[planet];

            const returnHouse = getHouseFromLongitude(returnPos.longitude, returnChart.houses);
            const natalHouse = getHouseFromLongitude(natalPos.longitude, natalChart.houses);

            yearlyPlanets[planet] = {
                returnPosition: returnPos,
                natalPosition: natalPos,
                returnHouse: returnHouse,
                natalHouse: natalHouse,
                houseChange: returnHouse !== natalHouse,
                aspects: this._getPlanetAspects(returnPos.longitude, returnChart.planets),
                strength: this._calculatePlanetStrength(returnPos, returnChart),
                influence: this._analyzePlanetInfluence(planet, returnHouse, natalHouse)
            };
        });

        return yearlyPlanets;
    }

    /**
     * Generate predictions based on Muntha and planetary positions
     * @private
     */
    _generatePredictions(muntha, yearlyPlanets, returnChart, natalChart) {
        const predictions = {
            career: [],
            finance: [],
            relationships: [],
            health: [],
            spiritual: [],
            general: []
        };

        // Career predictions (10th house focus)
        predictions.career = this._predictCareer(muntha, yearlyPlanets, returnChart);

        // Finance predictions (2nd, 11th houses)
        predictions.finance = this._predictFinance(muntha, yearlyPlanets, returnChart);

        // Relationship predictions (5th, 7th houses)
        predictions.relationships = this._predictRelationships(muntha, yearlyPlanets, returnChart);

        // Health predictions (1st, 6th, 8th houses)
        predictions.health = this._predictHealth(muntha, yearlyPlanets, returnChart);

        // Spiritual predictions (9th, 12th houses)
        predictions.spiritual = this._predictSpiritual(muntha, yearlyPlanets, returnChart);

        // General yearly predictions
        predictions.general = this._predictGeneral(muntha, yearlyPlanets, returnChart);

        return predictions;
    }

    /**
     * Predict career aspects
     * @private
     */
    _predictCareer(muntha, yearlyPlanets, returnChart) {
        const predictions = [];

        if (muntha.house === 10) {
            predictions.push('Significant career advancement possible');
        }

        const tenthHousePlanets = Object.values(yearlyPlanets).filter(p => p.returnHouse === 10);
        if (tenthHousePlanets.length > 0) {
            predictions.push('Career changes or new opportunities');
        }

        // Muntha-specific career predictions
        switch (muntha.planet) {
            case 'SUN':
                predictions.push('Leadership roles and authority positions');
                break;
            case 'JUPITER':
                predictions.push('Teaching, consulting, or advisory roles');
                break;
            case 'SATURN':
                predictions.push('Long-term career planning and discipline');
                break;
            case 'MERCURY':
                predictions.push('Communication-based career opportunities');
                break;
        }

        return predictions.length > 0 ? predictions : ['Stable career year with moderate growth'];
    }

    /**
     * Predict financial aspects
     * @private
     */
    _predictFinance(muntha, yearlyPlanets, returnChart) {
        const predictions = [];

        const wealthHouses = [2, 11];
        const wealthPlanets = Object.values(yearlyPlanets).filter(p =>
            wealthHouses.includes(p.returnHouse)
        );

        if (wealthPlanets.length > 0) {
            predictions.push('Financial opportunities available');
        }

        if (muntha.planet === 'JUPITER') {
            predictions.push('Prosperity and financial growth');
        } else if (muntha.planet === 'SATURN') {
            predictions.push('Financial discipline and careful planning needed');
        }

        return predictions.length > 0 ? predictions : ['Moderate financial stability'];
    }

    /**
     * Predict relationship aspects
     * @private
     */
    _predictRelationships(muntha, yearlyPlanets, returnChart) {
        const predictions = [];

        if (muntha.house === 7) {
            predictions.push('Important relationship developments');
        }

        if (muntha.planet === 'VENUS') {
            predictions.push('Harmonious relationships and romance');
        } else if (muntha.planet === 'MARS') {
            predictions.push('Dynamic relationship changes possible');
        }

        return predictions.length > 0 ? predictions : ['Stable relationship period'];
    }

    /**
     * Predict health aspects
     * @private
     */
    _predictHealth(muntha, yearlyPlanets, returnChart) {
        const predictions = [];

        const healthHouses = [1, 6, 8];
        const healthPlanets = Object.values(yearlyPlanets).filter(p =>
            healthHouses.includes(p.returnHouse)
        );

        if (healthPlanets.length > 0) {
            predictions.push('Pay attention to health matters');
        }

        if (muntha.planet === 'MARS') {
            predictions.push('High energy but potential for accidents');
        } else if (muntha.planet === 'SATURN') {
            predictions.push('Chronic health issues may surface');
        }

        return predictions.length > 0 ? predictions : ['Generally good health year'];
    }

    /**
     * Predict spiritual aspects
     * @private
     */
    _predictSpiritual(muntha, yearlyPlanets, returnChart) {
        const predictions = [];

        if (muntha.house === 9) {
            predictions.push('Spiritual growth and higher learning');
        }

        if (muntha.planet === 'JUPITER') {
            predictions.push('Deep spiritual insights and wisdom');
        } else if (muntha.planet === 'KETU') {
            predictions.push('Spiritual transformation and detachment');
        }

        return predictions.length > 0 ? predictions : ['Moderate spiritual development'];
    }

    /**
     * General yearly predictions
     * @private
     */
    _predictGeneral(muntha, yearlyPlanets, returnChart) {
        const predictions = [];

        if (muntha.strength > 1.5) {
            predictions.push('Generally favorable year with good opportunities');
        } else if (muntha.strength < 0.8) {
            predictions.push('Challenging year requiring patience and perseverance');
        } else {
            predictions.push('Balanced year with mixed experiences');
        }

        // Add Muntha-specific general predictions
        switch (muntha.planet) {
            case 'JUPITER':
                predictions.push('Year of expansion and positive growth');
                break;
            case 'SATURN':
                predictions.push('Year of learning important life lessons');
                break;
            case 'RAHU':
                predictions.push('Year of new directions and innovation');
                break;
        }

        return predictions;
    }

    /**
     * Extract key themes for the year
     * @private
     */
    _extractKeyThemes(muntha, predictions) {
        const themes = [];

        // Muntha-based themes
        themes.push(muntha.significance.combinedTheme);

        // Add themes from predictions
        Object.values(predictions).forEach(category => {
            if (category.length > 0) {
                themes.push(category[0]); // Take first prediction from each category
            }
        });

        return themes.slice(0, 5); // Limit to 5 key themes
    }

    /**
     * Calculate overall yearly rating
     * @private
     */
    _calculateOverallRating(munthaAnalysis, yearlyPlanets) {
        let rating = 5; // Base rating (1-10 scale)

        // Muntha strength influence
        rating += (munthaAnalysis.strength - 1.0) * 2;

        // Beneficial planet influences
        const beneficialPlanets = ['JUPITER', 'VENUS'];
        const beneficialCount = Object.values(yearlyPlanets).filter(p =>
            beneficialPlanets.includes(p.planet) && [1, 5, 9, 10].includes(p.returnHouse)
        ).length;
        rating += beneficialCount * 0.5;

        // Challenging planet influences
        const challengingPlanets = ['SATURN', 'MARS', 'RAHU', 'KETU'];
        const challengingCount = Object.values(yearlyPlanets).filter(p =>
            challengingPlanets.includes(p.planet) && [6, 8, 12].includes(p.returnHouse)
        ).length;
        rating -= challengingCount * 0.3;

        return Math.max(1, Math.min(10, Math.round(rating)));
    }

    /**
     * Identify favorable periods
     * @private
     */
    _identifyFavorablePeriods(returnChart, muntha) {
        // Simplified - in practice would analyze transits and progressions
        const periods = [];

        if (muntha.planet === 'JUPITER') {
            periods.push('Spring season generally favorable');
        } else if (muntha.planet === 'VENUS') {
            periods.push('Venus-ruled periods favorable for relationships');
        }

        return periods.length > 0 ? periods : ['Generally balanced throughout the year'];
    }

    /**
     * Identify cautionary periods
     * @private
     */
    _identifyCautionaryPeriods(returnChart, muntha) {
        const periods = [];

        if (muntha.planet === 'SATURN') {
            periods.push('Exercise caution during Saturn-ruled periods');
        } else if (muntha.planet === 'MARS') {
            periods.push('Be careful with impulsive decisions');
        }

        return periods.length > 0 ? periods : ['No major cautionary periods identified'];
    }

    /**
     * Get aspects for a planet
     * @private
     */
    _getPlanetAspects(planetLongitude, allPlanets) {
        // Simplified aspect calculation
        const aspects = [];
        const aspectAngles = [60, 90, 120, 180];

        Object.keys(allPlanets).forEach(otherPlanet => {
            if (otherPlanet === 'MUNTHA') return;

            const otherLongitude = allPlanets[otherPlanet].longitude;
            const separation = Math.abs(normalizeAngle(otherLongitude - planetLongitude));

            aspectAngles.forEach(angle => {
                if (Math.abs(separation - angle) <= 8) {
                    aspects.push({
                        planet: otherPlanet,
                        type: this._getAspectName(angle),
                        separation: separation
                    });
                }
            });
        });

        return aspects;
    }

    /**
     * Calculate planet strength in return chart
     * @private
     */
    _calculatePlanetStrength(planetPosition, returnChart) {
        let strength = 1.0;

        const house = getHouseFromLongitude(planetPosition.longitude, returnChart.houses);
        if ([1, 5, 9].includes(house)) strength *= 1.2;
        if ([6, 8, 12].includes(house)) strength *= 0.8;

        return strength;
    }

    /**
     * Analyze planet influence
     * @private
     */
    _analyzePlanetInfluence(planet, returnHouse, natalHouse) {
        const houseChanged = returnHouse !== natalHouse;
        const influence = {
            primary: this.munthaHouses[returnHouse] || 'General influence',
            change: houseChanged,
            significance: houseChanged ? 'New areas of focus' : 'Continued focus'
        };

        return influence;
    }

    /**
     * Interpret aspect influence
     * @private
     */
    _interpretAspect(planet, aspectType) {
        const interpretations = {
            'Sextile': 'Supportive and harmonious',
            'Square': 'Challenging and dynamic',
            'Trine': 'Beneficial and flowing',
            'Opposition': 'Balancing and awareness-bringing'
        };

        return interpretations[aspectType] || 'Neutral influence';
    }

    /**
     * Get aspect name from angle
     * @private
     */
    _getAspectName(angle) {
        switch (angle) {
            case 60: return 'Sextile';
            case 90: return 'Square';
            case 120: return 'Trine';
            case 180: return 'Opposition';
            default: return 'Unknown';
        }
    }

    /**
     * Validate input parameters
     * @private
     */
    _validateInputs(natalChart, returnYear) {
        return natalChart &&
               natalChart.planets &&
               natalChart.planets.SUN &&
               natalChart.ayanamsa !== undefined &&
               returnYear &&
               returnYear >= 1900 &&
               returnYear <= 2100;
    }
}

module.exports = VarshaphalaCalculator;