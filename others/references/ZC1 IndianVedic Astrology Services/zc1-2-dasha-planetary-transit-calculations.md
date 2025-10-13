# ZC1.2 Dasha & Planetary Transit Calculations Implementation Guide

## Overview

This document provides a comprehensive implementation guide for ZC1.2 Dasha & Planetary Transit calculations, incorporating all necessary mathematical foundations, astronomical calculations, algorithms, and technical specifications for accurate timing predictions in Vedic astrology.

## Table of Contents

1. [Introduction](#introduction)
2. [Mathematical Foundations](#mathematical-foundations)
3. [Dasha System Algorithms](#dasha-algorithms)
4. [Planetary Transit Calculations](#transit-calculations)
5. [Implementation Code](#implementation-code)
6. [Technical Specifications](#technical-specifications)
7. [References](#references)

---

## 1. Introduction {#introduction}

### What are Dasha and Planetary Transits?

**Dasha (Planetary Periods)**: The unique timing system of Vedic astrology that divides a person's life into planetary periods where specific planets govern different phases, bringing their karmic results to fruition.

**Planetary Transits**: The current positions of planets in the sky and their movement through zodiac signs, houses, and aspects, which influence daily life events.

### Key Components

1. **Vimshottari Dasha System**: 120-year cycle based on Moon's nakshatra at birth
2. **Antardasha (Sub-periods)**: Secondary planetary influences within Mahadasha
3. **Pratyantardasha**: Tertiary influences for precise timing
4. **Planetary Transits**: Current planetary positions and their effects
5. **Transit Predictions**: Daily, weekly, monthly, and yearly forecasts

### Implementation Requirements

- **Sidereal Zodiac**: Uses actual star positions with Ayanamsa correction
- **Precise Astronomical Calculations**: Accurate planetary positions
- **Multiple Dasha Systems**: Vimshottari as primary, others as secondary
- **Transit Analysis**: Real-time planetary position calculations
- **Prediction Engine**: Rule-based prediction generation

---

## 2. Mathematical Foundations {#mathematical-foundations}

### Core Constants for Dasha & Transit Calculations

```javascript
const ASTRO_CONSTANTS = {
    // Dasha Constants
    VIMSHOTTARI_CYCLE_YEARS: 120,          // Total cycle in years
    DASHA_YEAR_DAYS: 360,                  // Days per year in dasha calculations
    
    // Planetary Periods (Vimshottari)
    PLANETARY_PERIODS: {
        KETU: 7,     // Years
        VENUS: 20,
        SUN: 6,
        MOON: 10,
        MARS: 7,
        RAHU: 18,
        JUPITER: 16,
        SATURN: 19,
        MERCURY: 17
    },
    
    // Nakshatra Constants
    NAKSHATRAS_COUNT: 27,
    DEGREES_PER_NAKSHATRA: 13.333333333,
    
    // Transit Constants
    TRANSIT_ACCURACY_DEGREES: 0.01,       // Required accuracy for transits
    ASPECT_ORBS: {
        CONJUNCTION: 10,
        OPPOSITION: 10,
        TRINE: 8,
        SQUARE: 7,
        SEXTILE: 6
    }
};
```

### Essential Mathematical Functions

```javascript
/**
 * Calculate remaining degrees in nakshatra for dasha balance
 */
function calculateNakshatraRemainingDegrees(moonLongitude) {
    const nakshatraIndex = Math.floor(moonLongitude / ASTRO_CONSTANTS.DEGREES_PER_NAKSHATRA);
    const degreesInNakshatra = moonLongitude % ASTRO_CONSTANTS.DEGREES_PER_NAKSHATRA;
    return ASTRO_CONSTANTS.DEGREES_PER_NAKSHATRA - degreesInNakshatra;
}

/**
 * Convert dasha years to actual calendar days
 */
function dashaYearsToDays(years) {
    return years * ASTRO_CONSTANTS.DASHA_YEAR_DAYS;
}

/**
 * Calculate transit aspects between planets
 */
function calculateTransitAspect(planet1Longitude, planet2Longitude) {
    let angle = Math.abs(planet1Longitude - planet2Longitude);
    angle = Math.min(angle, 360 - angle); // Normalize to 0-180
    
    // Determine aspect type
    if (angle <= ASTRO_CONSTANTS.ASPECT_ORBS.CONJUNCTION) return 'CONJUNCTION';
    if (Math.abs(angle - 60) <= ASTRO_CONSTANTS.ASPECT_ORBS.SEXTILE) return 'SEXTILE';
    if (Math.abs(angle - 90) <= ASTRO_CONSTANTS.ASPECT_ORBS.SQUARE) return 'SQUARE';
    if (Math.abs(angle - 120) <= ASTRO_CONSTANTS.ASPECT_ORBS.TRINE) return 'TRINE';
    if (Math.abs(angle - 180) <= ASTRO_CONSTANTS.ASPECT_ORBS.OPPOSITION) return 'OPPOSITION';
    
    return 'NO_ASPECT';
}
```

---

## 3. Dasha System Algorithms {#dasha-algorithms}

### Vimshottari Dasha Calculation

```javascript
const { PLANETARY_PERIODS } = require('./astro-constants');

/**
 * Vimshottari Dasha Calculator
 * Handles dasha calculations, balances, and current dasha determination
 */
class VimshottariDasha {
    constructor() {
        this.totalCycleYears = 120; // Total Vimshottari cycle
        this.dashaOrder = ['KETU', 'VENUS', 'SUN', 'MOON', 'MARS', 'RAHU', 'JUPITER', 'SATURN', 'MERCURY'];
    }

    /**
     * Calculate dasha balance at birth
     * @param {Object} moonNakshatra - Moon's nakshatra information
     * @param {Date} birthDate - Birth date
     * @returns {Object} Dasha balance information
     */
    calculateDashaBalance(moonNakshatra, birthDate) {
        const nakshatraLord = moonNakshatra.lord;
        const degreesInNakshatra = moonNakshatra.degreesInNakshatra;
        const totalNakshatraDegrees = 13.333333; // 40 arcminutes = 13.333 degrees

        // Calculate remaining degrees in nakshatra
        const remainingDegrees = totalNakshatraDegrees - degreesInNakshatra;

        // Convert to time (1 degree = 1 day in dasha calculations)
        const remainingDays = remainingDegrees;

        // Get the period of the nakshatra lord
        const lordPeriod = PLANETARY_PERIODS[nakshatraLord];

        // Calculate balance years
        const balanceYears = (remainingDays / 360) * lordPeriod;

        return {
            lord: nakshatraLord,
            balanceYears: balanceYears,
            balanceDays: remainingDays,
            startingDasha: nakshatraLord
        };
    }

    /**
     * Generate mahadasha sequence
     * @param {Date} birthDate - Birth date
     * @param {Object} balance - Dasha balance
     * @returns {Array} Array of mahadashas
     */
    generateMahadashas(birthDate, balance) {
        const mahadashas = [];
        let currentDate = new Date(birthDate);

        // Start with the balance dasha
        if (balance.balanceYears > 0) {
            mahadashas.push({
                planet: balance.lord,
                startDate: new Date(currentDate),
                endDate: new Date(currentDate.getTime() + (balance.balanceYears * 365.25 * 24 * 60 * 60 * 1000)),
                years: balance.balanceYears,
                type: 'balance'
            });
            currentDate = mahadashas[mahadashas.length - 1].endDate;
        }

        // Generate full cycle mahadashas
        const startIndex = this.dashaOrder.indexOf(balance.lord);
        for (let i = 0; i < this.dashaOrder.length; i++) {
            const planetIndex = (startIndex + i + 1) % this.dashaOrder.length;
            const planet = this.dashaOrder[planetIndex];
            const period = PLANETARY_PERIODS[planet];

            // Skip if this was the balance dasha
            if (i === 0 && balance.balanceYears > 0) continue;

            mahadashas.push({
                planet: planet,
                startDate: new Date(currentDate),
                endDate: new Date(currentDate.getTime() + (period * 365.25 * 24 * 60 * 60 * 1000)),
                years: period,
                type: 'mahadasha'
            });
            currentDate = mahadashas[mahadashas.length - 1].endDate;
        }

        return mahadashas;
    }

    /**
     * Get current dasha for a given date
     * @param {Date} birthDate - Birth date
     * @param {Date} targetDate - Date to check
     * @param {Object} balance - Dasha balance
     * @returns {Object} Current dasha information
     */
    getCurrentDasha(birthDate, targetDate, balance) {
        const mahadashas = this.generateMahadashas(birthDate, balance);

        for (const dasha of mahadashas) {
            if (targetDate >= dasha.startDate && targetDate < dasha.endDate) {
                // Calculate progress within this dasha
                const totalDuration = dasha.endDate - dasha.startDate;
                const elapsed = targetDate - dasha.startDate;
                const progress = elapsed / totalDuration;

                return {
                    mahadasha: dasha.planet,
                    startDate: dasha.startDate,
                    endDate: dasha.endDate,
                    progress: progress,
                    remainingYears: dasha.years * (1 - progress),
                    antardasha: this.calculateAntardasha(dasha, targetDate)
                };
            }
        }

        return null; // Date is beyond the calculated period
    }

    /**
     * Calculate antardasha (sub-period) within a mahadasha
     * @param {Object} mahadasha - Mahadasha object
     * @param {Date} targetDate - Date to check
     * @returns {Object} Antardasha information
     */
    calculateAntardasha(mahadasha, targetDate) {
        const mahadashaDuration = mahadasha.years * 365.25 * 24 * 60 * 60 * 1000; // in milliseconds
        const elapsed = targetDate - mahadasha.startDate;
        const progress = elapsed / mahadashaDuration;

        // Find which antardasha period we're in
        let cumulativeProgress = 0;
        const mahadashaLord = mahadasha.planet;

        for (const antardashaLord of this.dashaOrder) {
            const antardashaPeriod = PLANETARY_PERIODS[antardashaLord];
            const antardashaPortion = antardashaPeriod / PLANETARY_PERIODS[mahadashaLord];
            const antardashaDuration = antardashaPortion * mahadashaDuration;

            if (progress <= cumulativeProgress + antardashaPortion) {
                const antardashaStart = new Date(mahadasha.startDate.getTime() + (cumulativeProgress * mahadashaDuration));
                const antardashaEnd = new Date(antardashaStart.getTime() + antardashaDuration);

                return {
                    planet: antardashaLord,
                    startDate: antardashaStart,
                    endDate: antardashaEnd,
                    progress: (progress - cumulativeProgress) / antardashaPortion
                };
            }

            cumulativeProgress += antardashaPortion;
        }

        return null;
    }

    /**
     * Get dasha effects and predictions
     * @param {string} planet - Planet name
     * @returns {Object} Dasha effects
     */
    getDashaEffects(planet) {
        // Simplified dasha effects - in production, this would be more comprehensive
        const effects = {
            SUN: {
                general: 'Leadership, authority, government matters',
                positive: 'Career advancement, recognition',
                negative: 'Health issues, conflicts with superiors',
                remedies: ['Sun worship', 'Donation of wheat', 'Wearing ruby']
            },
            MOON: {
                general: 'Emotions, mind, mother, home',
                positive: 'Mental peace, family harmony',
                negative: 'Mood swings, health issues',
                remedies: ['Moon worship', 'Donation of milk', 'Wearing pearl']
            },
            MARS: {
                general: 'Energy, courage, siblings, property',
                positive: 'Physical strength, new ventures',
                negative: 'Accidents, conflicts, surgery',
                remedies: ['Mars worship', 'Donation of red items', 'Wearing coral']
            },
            MERCURY: {
                general: 'Intelligence, communication, business',
                positive: 'Learning, writing, commerce',
                negative: 'Anxiety, speech issues',
                remedies: ['Mercury worship', 'Donation of green items', 'Wearing emerald']
            },
            JUPITER: {
                general: 'Wisdom, wealth, children, spirituality',
                positive: 'Prosperity, knowledge, marriage',
                negative: 'Overconfidence, weight gain',
                remedies: ['Jupiter worship', 'Donation of yellow items', 'Wearing yellow sapphire']
            },
            VENUS: {
                general: 'Love, beauty, luxury, spouse',
                positive: 'Relationships, arts, wealth',
                negative: 'Indulgence, health issues',
                remedies: ['Venus worship', 'Donation of white items', 'Wearing diamond']
            },
            SATURN: {
                general: 'Discipline, hard work, longevity',
                positive: 'Stability, spiritual growth',
                negative: 'Delays, obstacles, diseases',
                remedies: ['Saturn worship', 'Donation of black items', 'Wearing blue sapphire']
            },
            RAHU: {
                general: 'Ambition, foreign matters, technology',
                positive: 'Sudden gains, foreign travel',
                negative: 'Confusion, addiction, scandals',
                remedies: ['Rahu worship', 'Donation of black items', 'Wearing hessonite']
            },
            KETU: {
                general: 'Spirituality, detachment, past life karma',
                positive: 'Liberation, psychic abilities',
                negative: 'Health issues, mental confusion',
                remedies: ['Ketu worship', 'Donation of brown items', 'Wearing cat\'s eye']
            }
        };

        return effects[planet] || {
            general: 'General planetary influences',
            positive: 'Beneficial effects',
            negative: 'Challenging effects',
            remedies: ['General remedies', 'Consult astrologer']
        };
    }
}

module.exports = VimshottariDasha;
```

### Other Dasha Systems

#### Ashtottari Dasha (108-year cycle)
```javascript
const ASHTOTTARI_PERIODS = {
    SUN: 6, MOON: 15, MARS: 8, RAHU: 12, JUPITER: 19, SATURN: 17, MERCURY: 17, KETU: 7, VENUS: 21
};

class AshtottariDasha extends VimshottariDasha {
    constructor() {
        super();
        this.dashaSequence = ['SUN', 'MOON', 'MARS', 'RAHU', 'JUPITER', 'SATURN', 'MERCURY', 'KETU', 'VENUS'];
        this.dashaPeriods = ASHTOTTARI_PERIODS;
    }
}
```

#### Yogini Dasha (36-year cycle)
```javascript
const YOGINI_PERIODS = {
    MANGALA: 1, PINGALA: 2, DHANYA: 3, BHARAMA: 4, 
    INDRA: 5, VAYU: 6, ARK: 7, BHADRA: 8
};

class YoginiDasha {
    constructor() {
        this.dashaSequence = ['MANGALA', 'PINGALA', 'DHANYA', 'BHARAMA', 'INDRA', 'VAYU', 'ARK', 'BHADRA'];
        this.dashaPeriods = YOGINI_PERIODS;
    }
}
```

---

## 4. Planetary Transit Calculations {#transit-calculations}

### Transit Position Calculation

```javascript
const { normalizeAngle } = require('./math-utils');
const { calculateJulianDay, calculateLahiriAyanamsa } = require('./astronomical-calculations');
const { calculatePlanetaryPositions } = require('./planetary-calculator');
const { ASTRO_CONSTANTS } = require('./astro-constants');

/**
 * Transit Calculator
 * Calculates planetary transit positions and aspects
 */
class TransitCalculator {
    constructor() {
        // Constructor can be expanded for additional initialization
    }

    /**
     * Calculate transit positions for a given date
     * @param {Date} transitDate - Date for transit calculation
     * @returns {Promise<Object>} Transit planetary positions
     * @throws {Error} If input validation fails or calculation errors occur
     */
    async calculateTransitPositions(transitDate) {
        // Input validation
        if (!(transitDate instanceof Date) || isNaN(transitDate.getTime())) {
            throw new Error('Invalid transit date: must be a valid Date object');
        }

        try {
            const julianDay = calculateJulianDay(
                transitDate.getFullYear(),
                transitDate.getMonth() + 1, // JavaScript months are 0-based, convert to 1-based
                transitDate.getDate(),
                transitDate.getHours(),
                transitDate.getMinutes(),
                transitDate.getSeconds()
            );

            const tropicalPositions = await calculatePlanetaryPositions(julianDay);
            const ayanamsa = calculateLahiriAyanamsa(transitDate.getFullYear());

            // Convert to sidereal positions
            const siderealPositions = {};
            for (const planet in tropicalPositions) {
                if (typeof tropicalPositions[planet] !== 'number' || isNaN(tropicalPositions[planet])) {
                    throw new Error(`Invalid tropical position for planet ${planet}`);
                }
                siderealPositions[planet] = normalizeAngle(tropicalPositions[planet] - ayanamsa);
            }

            return siderealPositions;
        } catch (error) {
            throw new Error(`Transit position calculation failed: ${error.message}`);
        }
    }

    /**
     * Calculate transit aspects to natal planets
     * @param {Object} natalPositions - Birth chart planetary positions
     * @param {Object} transitPositions - Current transit positions
     * @returns {Array} Transit aspects
     * @throws {Error} If input validation fails
     */
    calculateTransitAspects(natalPositions, transitPositions) {
        // Input validation
        if (!natalPositions || typeof natalPositions !== 'object') {
            throw new Error('Invalid natal positions: must be an object');
        }
        if (!transitPositions || typeof transitPositions !== 'object') {
            throw new Error('Invalid transit positions: must be an object');
        }

        const aspects = [];
        let iterationCount = 0;

        // Note: For large datasets with many planets, consider async processing or worker threads
        for (const natalPlanet in natalPositions) {
            if (!natalPositions[natalPlanet] || typeof natalPositions[natalPlanet].longitude !== 'number') {
                throw new Error(`Invalid natal position for planet ${natalPlanet}`);
            }

            for (const transitPlanet in transitPositions) {
                // Bounds checking for loop iterations
                if (iterationCount >= 10000) {
                    throw new Error('Loop iteration limit exceeded in transit aspect calculation');
                }
                iterationCount++;

                if (typeof transitPositions[transitPlanet] !== 'number' || isNaN(transitPositions[transitPlanet])) {
                    throw new Error(`Invalid transit position for planet ${transitPlanet}`);
                }

                const aspect = this.calculateTransitAspect(
                    natalPositions[natalPlanet].longitude,
                    transitPositions[transitPlanet]
                );

                if (aspect !== 'NO_ASPECT') {
                    const orb = this.calculateAspectOrb(
                        natalPositions[natalPlanet].longitude,
                        transitPositions[transitPlanet],
                        aspect
                    );
                    aspects.push({
                        natalPlanet,
                        transitPlanet,
                        aspect,
                        orb,
                        strength: this.calculateAspectStrength(aspect, orb)
                    });
                }
            }
        }

        return aspects;
    }

    /**
     * Calculate transit aspect between two planets
     * @param {number} planet1Longitude - Longitude of first planet
     * @param {number} planet2Longitude - Longitude of second planet
     * @returns {string} Aspect type
     */
    calculateTransitAspect(planet1Longitude, planet2Longitude) {
        let angle = Math.abs(planet1Longitude - planet2Longitude);
        angle = Math.min(angle, 360 - angle); // Normalize to 0-180

        // Determine aspect type with proper orb handling
        const aspects = [
            { type: 'CONJUNCTION', angle: 0, orb: ASTRO_CONSTANTS.ASPECT_ORBS.CONJUNCTION },
            { type: 'SEXTILE', angle: 60, orb: ASTRO_CONSTANTS.ASPECT_ORBS.SEXTILE },
            { type: 'SQUARE', angle: 90, orb: ASTRO_CONSTANTS.ASPECT_ORBS.SQUARE },
            { type: 'TRINE', angle: 120, orb: ASTRO_CONSTANTS.ASPECT_ORBS.TRINE },
            { type: 'OPPOSITION', angle: 180, orb: ASTRO_CONSTANTS.ASPECT_ORBS.OPPOSITION }
        ];

        for (const aspect of aspects) {
            if (Math.abs(angle - aspect.angle) <= aspect.orb) {
                return aspect.type;
            }
        }

        return 'NO_ASPECT';
    }

    /**
     * Calculate precise orb for aspect
     * @param {number} longitude1 - First longitude
     * @param {number} longitude2 - Second longitude
     * @param {string} aspect - Aspect type
     * @returns {number} Orb value
     */
    calculateAspectOrb(longitude1, longitude2, aspect) {
        let angle = Math.abs(longitude1 - longitude2);
        angle = Math.min(angle, 360 - angle);

        const aspectAngles = {
            CONJUNCTION: 0,
            SEXTILE: 60,
            SQUARE: 90,
            TRINE: 120,
            OPPOSITION: 180
        };

        return Math.abs(angle - aspectAngles[aspect]);
    }

    /**
     * Calculate aspect strength based on orb
     * @param {string} aspect - Aspect type
     * @param {number} orb - Orb value
     * @returns {number} Strength (0-1)
     */
    calculateAspectStrength(aspect, orb) {
        const maxOrb = ASTRO_CONSTANTS.ASPECT_ORBS[aspect];
        if (maxOrb <= 0) return 0;
        return Math.max(0, (maxOrb - orb) / maxOrb);
    }
}

module.exports = TransitCalculator;
```

### Transit Prediction Engine

```javascript
const { getHouseEffect, getJupiterTransitEffect, getSaturnTransitEffect, getRahuTransitEffect } = require('./transit-predictions-config');

/**
 * Prediction Engine
 * Generates predictions based on current transits
 */
class PredictionEngine {
    constructor(birthChart, transitDate) {
        if (!birthChart || !transitDate) {
            throw new Error('Invalid birth chart or transit date provided');
        }
        this.birthChart = birthChart;
        this.transitDate = transitDate;
    }

    /**
     * Generate daily predictions based on Moon transits
     * @param {Object} transitPositions - Current transit positions
     * @returns {Array} Daily predictions
     */
    generateDailyPredictions(transitPositions) {
        try {
            const predictions = [];

            // Moon transit through houses
            const moonHouse = this.getHouseFromLongitude(transitPositions.MOON);

            predictions.push({
                type: 'DAILY',
                area: 'General',
                description: getHouseEffect(moonHouse),
                timing: 'Today',
                confidence: 0.7
            });

            return predictions;
        } catch (error) {
            throw new Error(`Daily prediction generation failed: ${error.message}`);
        }
    }

    /**
     * Generate major planetary transit effects
     * @param {Object} transitPositions - Current transit positions
     * @returns {Array} Major transit predictions
     */
    generateMajorTransitPredictions(transitPositions) {
        try {
            const predictions = [];

            // Jupiter transit effects (yearly)
            const jupiterHouse = this.getHouseFromLongitude(transitPositions.JUPITER);
            predictions.push(getJupiterTransitEffect(jupiterHouse));

            // Saturn transit effects (2.5 years)
            const saturnHouse = this.getHouseFromLongitude(transitPositions.SATURN);
            predictions.push(getSaturnTransitEffect(saturnHouse));

            // Rahu-Ketu transit effects (1.5 years)
            const rahuHouse = this.getHouseFromLongitude(transitPositions.RAHU);
            predictions.push(getRahuTransitEffect(rahuHouse));

            return predictions;
        } catch (error) {
            throw new Error(`Major transit prediction generation failed: ${error.message}`);
        }
    }

    /**
     * Get house number from longitude
     * @param {number} longitude - Planetary longitude in degrees
     * @returns {number} House number (1-12)
     * @throws {Error} If input validation fails
     */
    getHouseFromLongitude(longitude) {
        // Input validation
        if (typeof longitude !== 'number' || longitude < 0 || longitude >= 360) {
            throw new Error('Invalid longitude: must be a number between 0 and 360');
        }

        // Array bounds checking for house calculations
        if (!this.birthChart || !this.birthChart.houses || !Array.isArray(this.birthChart.houses) || this.birthChart.houses.length !== 12) {
            throw new Error('Invalid house cusps in birth chart: must be an array of exactly 12 elements');
        }

        // Validate each house cusp
        for (let i = 0; i < 12; i++) {
            if (typeof this.birthChart.houses[i] !== 'number' || isNaN(this.birthChart.houses[i])) {
                throw new Error(`Invalid house cusp at index ${i}: must be a valid number`);
            }
        }

        // Using birth chart's house cusps
        for (let i = 0; i < 12; i++) {
            // Bounds checking for array access
            if (i >= this.birthChart.houses.length) {
                throw new Error('Array bounds exceeded in house calculation');
            }

            const houseStart = this.birthChart.houses[i];
            const houseEnd = this.birthChart.houses[(i + 1) % 12];

            if (houseEnd > houseStart) {
                if (longitude >= houseStart && longitude < houseEnd) {
                    return i + 1;
                }
            } else {
                if (longitude >= houseStart || longitude < houseEnd) {
                    return i + 1;
                }
            }
        }
        return 1; // Default to first house if no match
    }
}

module.exports = PredictionEngine;
```

---

## 5. Implementation Code {#implementation-code}

### Complete Dasha & Transit Calculator

```javascript
/**
 * Complete Dasha & Planetary Transit Calculation System
 */
class DashaTransitCalculator {
     /**
      * Initialize the dasha and transit calculator
      */
     constructor() {
         this.dashaCalculator = new DashaCalculator();
         this.transitCalculator = new TransitCalculator();
         this.predictionEngine = null;
         this.periodAnalyzer = new PeriodAnalyzer();
     }

     /**
      * Calculate complete dasha and transit analysis for a birth chart
      * @param {Object} birthChart - Complete birth chart data
      * @param {Date} analysisDate - Date for transit analysis
      * @returns {Promise<Object>} Complete dasha and transit analysis
      * @throws {Error} If input validation fails or calculation errors occur
      */
     async calculateDashaTransits(birthChart, analysisDate = new Date()) {
         // Input validation using helper
         validateBirthChart(birthChart);
         validateAnalysisDate(analysisDate);

         try {
             // Get birth date using helper
             const birthDate = getBirthDate(birthChart);

             // Calculate current dasha
             const currentDasha = this.dashaCalculator.getCurrentDasha(
                 birthDate,
                 analysisDate,
                 birthChart.dasha.balance
             );

             // Calculate transit positions
             const transitPositions = await this.transitCalculator.calculateTransitPositions(analysisDate);

             // Calculate transit aspects
             const transitAspects = this.transitCalculator.calculateTransitAspects(
                 birthChart.planets,
                 transitPositions
             );

             // Initialize prediction engine with birth chart
             this.predictionEngine = new PredictionEngine(birthChart, analysisDate);

             // Generate predictions
             const dailyPredictions = await this.predictionEngine.generateDailyPredictions(transitPositions);
             const majorTransits = await this.predictionEngine.generateMajorTransitPredictions(transitPositions);

             // Analyze periods
             const favorablePeriods = this.periodAnalyzer.identifyFavorablePeriods(birthChart, analysisDate, currentDasha);
             const challengingPeriods = this.periodAnalyzer.identifyChallengingPeriods(birthChart, analysisDate, currentDasha);
             const periodStrength = this.periodAnalyzer.analyzePeriodStrength(birthChart, transitPositions, currentDasha);

             return {
                 // Current Dasha Information
                 currentDasha: currentDasha,

                 // Transit Information
                 transitPositions: transitPositions,
                 transitAspects: transitAspects,

                 // Predictions
                 predictions: {
                     daily: dailyPredictions,
                     major: majorTransits
                 },

                 // Period Analysis
                 periodAnalysis: {
                     favorablePeriods: favorablePeriods,
                     challengingPeriods: challengingPeriods,
                     strength: periodStrength
                 },

                 // Analysis Date
                 analysisDate: analysisDate,

                 // Methods
                 getDashaForDate: (date) => {
                     validateTargetDate(date);
                     return this.dashaCalculator.getCurrentDasha(
                         birthDate,
                         date,
                         birthChart.dasha.balance
                     );
                 },

                 getTransitsForDate: async (date) => {
                     validateTargetDate(date);
                     try {
                         const positions = await this.transitCalculator.calculateTransitPositions(date);
                         const aspects = this.transitCalculator.calculateTransitAspects(birthChart.planets, positions);
                         return { positions, aspects };
                     } catch (error) {
                         throw new Error(`Transit calculation for date failed: ${error.message}`);
                     }
                 }
             };

        } catch (error) {
            throw new Error(`Dasha & Transit calculation failed: ${error.message}`);
        }
    }

    /**
     * Generate comprehensive timing analysis
     */
    async generateTimingAnalysis(birthChart, futureDate) {
        try {
            const analysis = await this.calculateDashaTransits(birthChart, futureDate);

            return {
                date: futureDate,
                dasha: analysis.currentDasha,
                transits: analysis.transitPositions,
                aspects: analysis.transitAspects,
                predictions: analysis.predictions,
                periodAnalysis: analysis.periodAnalysis
            };
        } catch (error) {
            throw new Error(`Timing analysis generation failed: ${error.message}`);
        }
    }
}

module.exports = DashaTransitCalculator;

// Usage Example
const dashaTransitCalculator = new DashaTransitCalculator();

const birthChart = {
    // Complete birth chart data from ZC1.1
    birthData: { year: 1990, month: 5, day: 15, hour: 14, minute: 30, second: 0 },
    ascendant: { sign: 0 }, // Aries
    planets: { /* planetary positions */ },
    dasha: { balance: { /* dasha balance */ } },
    houses: [/* house cusps */]
};

dashaTransitCalculator.calculateDashaTransits(birthChart)
    .then(analysis => {
        console.log('Dasha & Transit Analysis:', analysis);
    })
    .catch(error => {
        console.error('Error:', error);
    });
```

---

## 6. Technical Specifications {#technical-specifications}

### Input Requirements

- **Birth Data**: Complete birth information (date, time, place)
- **Analysis Date**: Date for transit and dasha analysis
- **Time Zone**: UTC offset for accurate calculations
- **Ayanamsa**: Lahiri Ayanamsa for sidereal calculations

### Output Structure

```javascript
{
    currentDasha: {
        mahadasha: { lord, startDate, endDate, period },
        antardasha: { mahaLord, antarLord, startDate, endDate, period },
        description: "PLANET Mahadasha - PLANET Antardasha"
    },
    transitPositions: {
        SUN: longitude,
        MOON: longitude,
        // ... all planets
    },
    transitAspects: [{
        natalPlanet: "PLANET",
        transitPlanet: "PLANET", 
        aspect: "CONJUNCTION",
        orb: number,
        strength: number
    }],
    predictions: {
        daily: [{ type, area, description, timing, confidence }],
        major: [{ type, planet, area, description, timing, confidence }]
    }
}
```

### Accuracy Requirements

- **Dasha Timing**: ±1 day accuracy for major periods
- **Transit Positions**: ±0.01 degrees accuracy
- **Aspect Calculations**: ±0.5 degree orb accuracy
- **Prediction Confidence**: 70-90% based on planetary strengths

### Performance Benchmarks

- **Dasha Calculation**: < 50ms for complete 120-year cycle
- **Transit Calculation**: < 100ms for all planetary positions
- **Aspect Analysis**: < 20ms for full aspect calculation
- **Prediction Generation**: < 200ms for comprehensive analysis

### Error Handling

- **Invalid Dates**: Clear error messages for impossible dates
- **Missing Data**: Graceful handling of incomplete birth data
- **Calculation Errors**: Fallback to simplified algorithms
- **Boundary Conditions**: Proper handling of date edge cases

---

## 7. References {#references}

1. **Brihat Parashara Hora Shastra** - Classical Vedic astrology text on dasha systems
2. **Surya Siddhanta** - Ancient astronomical calculations
3. **Muhurta Chintamani** - Transit and timing calculations
4. **Jataka Parijata** - Advanced dasha calculations
5. **VSOP87 Theory** - Modern planetary position calculations
6. **Swiss Ephemeris** - Professional astronomical library
7. **Lahiri Ayanamsa** - Official Indian government standard

### Implementation Notes

- For production use, integrate with Swiss Ephemeris for accurate planetary positions
- Implement proper caching for frequently requested calculations
- Add comprehensive logging and monitoring
- Consider microservices architecture for scalability
- Include detailed error handling and input validation

This implementation provides a complete foundation for ZC1.2 Dasha & Planetary Transit calculations with all necessary algorithms, formulas, and code examples for accurate astrological timing predictions.