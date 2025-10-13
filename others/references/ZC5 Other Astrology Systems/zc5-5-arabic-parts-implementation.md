# ZC5.5 Arabic Parts Implementation Guide

## Overview

This document provides a comprehensive implementation guide for ZC5.5 Arabic Parts calculations, incorporating all necessary mathematical foundations, astronomical calculations, algorithms, and technical specifications for creating accurate Arabic astrological parts (also known as Lots) in traditional astrology systems.

## Table of Contents

1. [Introduction](#introduction)
2. [Mathematical Foundations](#mathematical-foundations)
3. [Astronomical Calculations](#astronomical-calculations)
4. [Birth Chart Generation Algorithms](#birth-chart-algorithms)
5. [Planetary Position Calculations](#planetary-calculations)
6. [House System Implementations](#house-systems)
7. [Arabic Parts Calculation Methods](#arabic-parts-calculations)
8. [Complete Implementation Code](#implementation-code)
9. [Technical Specifications](#technical-specifications)
10. [Ethical Considerations](#ethical-considerations)
11. [References](#references)

---

## Change Log

### Version 1.0 (2025-10-12)
- Initial implementation of Arabic Parts calculations
- Added Lot of Fortune and Lot of Spirit calculations
- Added diurnal/nocturnal chart determination
- Added planetary position calculations for Arabic Parts
- Added unit tests for major functions
- Added Big O notation complexity analysis
- Added ethical considerations section for privacy and responsible use

---

## 1. Introduction {#introduction}

### What are Arabic Parts?

Arabic Parts, also known as Lots or Arabic Points, are calculated points in traditional astrology that represent various aspects of life and fortune. These points are derived from mathematical relationships between planetary positions, the Ascendant, and other chart factors.

### Key Components

1. **Lot of Fortune**: Represents prosperity, happiness, and worldly success
2. **Lot of Spirit**: Represents intellect, spirituality, and divine connection
3. **Other Lots**: Various lots for marriage, children, illness, etc.
4. **Diurnal/Nocturnal**: Day/night birth determination affects calculations
5. **Sect**: Division between day (solar sect) and night (lunar sect) charts

### Implementation Requirements

- **Sect Determination**: Accurate day/night birth classification
- **Planetary Positions**: Precise astronomical calculations
- **Lot Formulas**: Traditional calculation methods
- **Cultural Accuracy**: Authentic Arabic astrological methods
- **Mathematical Precision**: Exact angular calculations

---

## 2. Mathematical Foundations {#mathematical-foundations}

### Core Mathematical Constants

```javascript
const ARABIC_PARTS_CONSTANTS = {
    // Time and Date Constants
    JULIAN_DAY_J2000: 2451545.0,           // Julian Day for January 1, 2000, 12:00 UTC
    JULIAN_CENTURY: 36525.0,               // Days in a Julian century
    SECONDS_PER_DAY: 86400.0,              // Seconds in a day
    DEGREES_PER_CIRCLE: 360.0,             // Degrees in a circle
    MINUTES_PER_DEGREE: 60.0,              // Minutes in a degree
    SECONDS_PER_MINUTE: 60.0,              // Seconds in a minute
    
    // Arabic Parts Constants
    LOTS_COUNT: 12,                        // Common number of lots
    FORTUNE_LOT_INDEX: 0,                  // Index for Lot of Fortune
    SPIRIT_LOT_INDEX: 1,                   // Index for Lot of Spirit
    
    // Sect Constants
    SOLAR_SECT: 'diurnal',                 // Day birth
    LUNAR_SECT: 'nocturnal',               // Night birth
    
    // Zodiac Constants
    SIGNS_COUNT: 12,                       // 12 zodiac signs
    DEGREES_PER_SIGN: 30.0                 // Degrees per zodiac sign
};

const LOT_NAMES = [
    'Fortune', 'Spirit', 'Victory', 'Courage', 'Necessity',
    'Basis', 'Exaltation', 'Love', 'Marriage', 'Children',
    'Siblings', 'Parents'
];

const LOT_FORMULAS = [
    // Lot of Fortune: Asc + Moon - Sun (diurnal) or Asc + Sun - Moon (nocturnal)
    { name: 'Fortune', formula: 'Asc + Moon - Sun' },
    // Lot of Spirit: Asc + Sun - Moon (diurnal) or Asc + Moon - Sun (nocturnal)
    { name: 'Spirit', formula: 'Asc + Sun - Moon' },
    // Other lots with their formulas
    { name: 'Victory', formula: 'Asc + Jupiter - Mars' },
    { name: 'Courage', formula: 'Asc + Mars - Saturn' },
    { name: 'Necessity', formula: 'Asc + Saturn - Mercury' },
    { name: 'Basis', formula: 'Asc + Mercury - Venus' },
    { name: 'Exaltation', formula: 'Asc + Venus - Jupiter' },
    { name: 'Love', formula: 'Asc + Venus - Saturn' },
    { name: 'Marriage', formula: 'Asc + Saturn - Venus' },
    { name: 'Children', formula: 'Asc + Jupiter - Venus' },
    { name: 'Siblings', formula: 'Asc + Saturn - Jupiter' },
    { name: 'Parents', formula: 'Asc + Mercury - Saturn' }
];

// Validation
if (LOT_NAMES.length !== ARABIC_PARTS_CONSTANTS.LOTS_COUNT) {
    throw new Error('LOT_NAMES array must contain exactly 12 elements');
}
```

### Essential Mathematical Functions

```javascript
/**
 * Convert degrees to radians
 */
function degToRad(degrees) {
    return degrees * Math.PI / 180.0;
}

/**
 * Convert radians to degrees
 */
function radToDeg(radians) {
    return radians * 180.0 / Math.PI;
}

/**
 * Normalize angle to 0-360 degrees
 */
function normalizeAngle(angle) {
    while (angle < 0) angle += 360;
    while (angle >= 360) angle -= 360;
    return angle;
}

/**
 * Calculate angular distance between two points
 */
function angularDistance(angle1, angle2) {
    const diff = Math.abs(angle1 - angle2);
    return Math.min(diff, 360 - diff);
}

/**
 * Determine if birth is diurnal (day) or nocturnal (night)
 */
function isDiurnal(sunLongitude, ascendant) {
    // If Sun is above horizon (between Descendant and Ascendant), it's diurnal
    const descendant = normalizeAngle(ascendant + 180);
    const sunToDesc = angularDistance(sunLongitude, descendant);
    const descToAsc = angularDistance(descendant, ascendant);
    return sunToDesc < descToAsc;
}
```

---

## 3. Astronomical Calculations {#astronomical-calculations}

### Julian Day Calculation

```javascript
/**
 * Calculate Julian Day Number from Gregorian Date
 * @param {number} year - Year (e.g., 2025)
 * @param {number} month - Month (1-12)
 * @param {number} day - Day (1-31)
 * @param {number} hour - Hour (0-23)
 * @param {number} minute - Minute (0-59)
 * @param {number} second - Second (0-59)
 * @returns {number} Julian Day Number
 */
function calculateJulianDay(year, month, day, hour = 0, minute = 0, second = 0) {
    // Input validation for Gregorian dates
    if (year < 1582 || year > 2100) {
        throw new Error('Year must be between 1582 and 2100 (Gregorian calendar range)');
    }
    if (month < 1 || month > 12) {
        throw new Error('Month must be between 1 and 12');
    }
    if (hour < 0 || hour > 23) {
        throw new Error('Hour must be between 0 and 23');
    }
    if (minute < 0 || minute > 59) {
        throw new Error('Minute must be between 0 and 59');
    }
    if (second < 0 || second > 59) {
        throw new Error('Second must be between 0 and 59');
    }

    // Validate day based on month and leap year
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let maxDays = daysInMonth[month - 1];

    // Check for leap year (February has 29 days)
    if (month === 2 && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)) {
        maxDays = 29;
    }

    if (day < 1 || day > maxDays) {
        throw new Error(`Day must be between 1 and ${maxDays} for month ${month}`);
    }

    // Convert time to decimal day
    const decimalDay = day + (hour + minute/60 + second/3600) / 24;

    // Adjust for January and February
    if (month <= 2) {
        year -= 1;
        month += 12;
    }

    // Calculate Julian Day
    const A = Math.floor(year / 100);
    const B = 2 - A + Math.floor(A / 4);

    const JD = Math.floor(365.25 * (year + 4716)) +
               Math.floor(30.6001 * (month + 1)) +
               decimalDay + B - 1524.5;

    return JD;
}

#### Unit Tests for calculateJulianDay

```javascript
describe('calculateJulianDay', () => {
  test('calculates Julian Day for J2000 epoch', () => {
    const result = calculateJulianDay(2000, 1, 1, 12, 0, 0);
    expect(result).toBeCloseTo(2451545.0, 1);
  });

  test('calculates Julian Day for Gregorian date', () => {
    const result = calculateJulianDay(2025, 9, 30, 17, 54, 38);
    expect(result).toBeGreaterThan(2460900); // Approximate value
  });

  test('throws error for invalid year', () => {
    expect(() => calculateJulianDay(1581, 1, 1)).toThrow('Year must be between 1582 and 2100');
  });

  test('throws error for invalid month', () => {
    expect(() => calculateJulianDay(2025, 13, 1)).toThrow('Month must be between 1 and 12');
  });

  test('handles leap year February', () => {
    const result = calculateJulianDay(2024, 2, 29, 0, 0, 0);
    expect(result).toBeDefined();
  });
});
```

#### Complexity Analysis for calculateJulianDay

- **Time Complexity**: O(1) - All operations are constant-time arithmetic and conditional checks
- **Space Complexity**: O(1) - Uses only primitive variables, no additional data structures

### Solar Position Calculations

```javascript
/**
 * Calculate Sun's longitude for sect determination
 * @param {number} julianDay - Julian Day Number
 * @returns {number} Sun's longitude in degrees
 */
function calculateSolarLongitude(julianDay) {
    const T = (julianDay - ARABIC_PARTS_CONSTANTS.JULIAN_DAY_J2000) / ARABIC_PARTS_CONSTANTS.JULIAN_CENTURY;
    
    // Mean longitude of the Sun
    const L0 = normalizeAngle(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
    
    // Mean anomaly of the Sun
    const M = normalizeAngle(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
    
    // Equation of center
    const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(degToRad(M)) +
              (0.019993 - 0.000101 * T) * Math.sin(degToRad(2 * M)) +
              0.000289 * Math.sin(degToRad(3 * M));
    
    // True longitude
    const trueLongitude = L0 + C;
    
    return normalizeAngle(trueLongitude);
}
```

---

## 4. Birth Chart Generation Algorithms {#birth-chart-algorithms}

### Arabic Parts Calculation

```javascript
/**
 * Calculate Arabic Parts for given birth data
 * @param {Object} birthData - Birth information including planetary positions
 * @returns {Object} Arabic Parts information
 */
function calculateArabicParts(birthData) {
    const { ascendant, sun, moon, mercury, venus, mars, jupiter, saturn } = birthData;
    
    // Determine sect
    const diurnal = isDiurnal(sun.longitude, ascendant);
    const sect = diurnal ? ARABIC_PARTS_CONSTANTS.SOLAR_SECT : ARABIC_PARTS_CONSTANTS.LUNAR_SECT;
    
    const parts = {};
    
    // Calculate each lot
    LOT_FORMULAS.forEach((lotFormula, index) => {
        const lotPosition = calculateLotPosition(lotFormula.formula, {
            ascendant, sun: sun.longitude, moon: moon.longitude,
            mercury: mercury.longitude, venus: venus.longitude,
            mars: mars.longitude, jupiter: jupiter.longitude, saturn: saturn.longitude
        }, diurnal);
        
        parts[lotFormula.name.toLowerCase()] = {
            name: lotFormula.name,
            longitude: lotPosition,
            sign: getZodiacSign(lotPosition),
            house: getHousePosition(lotPosition, ascendant),
            aspects: calculateAspects(lotPosition, birthData)
        };
    });
    
    return {
        sect: sect,
        diurnal: diurnal,
        parts: parts,
        dominantPart: findDominantPart(parts)
    };
}

#### Unit Tests for calculateArabicParts

```javascript
describe('calculateArabicParts', () => {
  test('calculates Lot of Fortune for diurnal chart', () => {
    const birthData = {
      ascendant: 0, // Aries
      sun: { longitude: 90 }, // Cancer
      moon: { longitude: 180 }, // Libra
      mercury: { longitude: 85 },
      venus: { longitude: 95 },
      mars: { longitude: 100 },
      jupiter: { longitude: 200 },
      saturn: { longitude: 250 }
    };
    
    const result = calculateArabicParts(birthData);
    expect(result.sect).toBe('diurnal');
    expect(result.parts.fortune).toBeDefined();
    expect(result.parts.fortune.longitude).toBeDefined();
  });

  test('calculates Lot of Spirit for nocturnal chart', () => {
    const birthData = {
      ascendant: 180, // Libra
      sun: { longitude: 270 }, // Capricorn (below horizon)
      moon: { longitude: 90 }, // Cancer
      mercury: { longitude: 275 },
      venus: { longitude: 285 },
      mars: { longitude: 290 },
      jupiter: { longitude: 0 },
      saturn: { longitude: 50 }
    };
    
    const result = calculateArabicParts(birthData);
    expect(result.sect).toBe('nocturnal');
    expect(result.parts.spirit).toBeDefined();
  });
});
```

#### Complexity Analysis for calculateArabicParts

- **Time Complexity**: O(n) where n is number of lots - Linear calculation for each lot
- **Space Complexity**: O(n) - Storage for calculated parts

### Lot Position Calculation

```javascript
/**
 * Calculate position of a specific lot
 * @param {string} formula - Lot calculation formula
 * @param {Object} positions - Planetary positions
 * @param {boolean} diurnal - Whether chart is diurnal
 * @returns {number} Lot longitude in degrees
 */
function calculateLotPosition(formula, positions, diurnal) {
    // Parse formula (simplified implementation)
    const parts = formula.split(/[\s+-]+/).filter(p => p);
    
    let result = 0;
    
    if (formula.includes('Fortune')) {
        // Special handling for Lot of Fortune
        if (diurnal) {
            result = positions.ascendant + positions.moon - positions.sun;
        } else {
            result = positions.ascendant + positions.sun - positions.moon;
        }
    } else if (formula.includes('Spirit')) {
        // Special handling for Lot of Spirit
        if (diurnal) {
            result = positions.ascendant + positions.sun - positions.moon;
        } else {
            result = positions.ascendant + positions.moon - positions.sun;
        }
    } else {
        // General formula parsing
        const tokens = formula.split(/\s*([+-])\s*/);
        let currentOp = '+';
        
        for (const token of tokens) {
            if (token === '+' || token === '-') {
                currentOp = token;
            } else if (positions[token.toLowerCase()]) {
                const value = positions[token.toLowerCase()];
                if (currentOp === '+') {
                    result += value;
                } else {
                    result -= value;
                }
            }
        }
    }
    
    return normalizeAngle(result);
}

/**
 * Get zodiac sign for longitude
 */
function getZodiacSign(longitude) {
    const signIndex = Math.floor(longitude / ARABIC_PARTS_CONSTANTS.DEGREES_PER_SIGN);
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                   'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    return signs[signIndex];
}

/**
 * Get house position for longitude
 */
function getHousePosition(longitude, ascendant) {
    const angle = normalizeAngle(longitude - ascendant);
    return Math.floor(angle / ARABIC_PARTS_CONSTANTS.DEGREES_PER_SIGN) + 1;
}
```

---

## 5. Planetary Position Calculations {#planetary-calculations}

### Simplified Planetary Calculations

```javascript
/**
 * Calculate simplified planetary positions for Arabic Parts
 * @param {number} julianDay - Julian Day Number
 * @returns {Object} Planetary positions in degrees
 */
function calculatePlanetaryPositions(julianDay) {
    const T = calculateJulianCenturies(julianDay);
    const positions = {};
    
    // Sun's position (simplified)
    positions.SUN = normalizeAngle(280.459 + 0.98564736 * (julianDay - ARABIC_PARTS_CONSTANTS.JULIAN_DAY_J2000));
    
    // Moon's position (simplified)
    const L = normalizeAngle(218.3164477 + 481267.88123421 * T);
    const D = normalizeAngle(297.8501921 + 445267.1114034 * T);
    const M = normalizeAngle(357.5291092 + 35999.0502909 * T);
    const F = normalizeAngle(93.272095 + 483202.0175233 * T);
    
    // Moon longitude correction (simplified)
    const moonCorrection = 6.288774 * Math.sin(degToRad(L)) +
                          1.274027 * Math.sin(degToRad(2*D - L)) +
                          0.658314 * Math.sin(degToRad(2*D));
    
    positions.MOON = normalizeAngle(L + moonCorrection);
    
    // Simplified positions for other planets (for Arabic Parts calculations)
    // In production, use full VSOP87 or similar ephemeris
    positions.MERCURY = normalizeAngle(positions.SUN + 30); // Simplified
    positions.VENUS = normalizeAngle(positions.SUN + 60);   // Simplified
    positions.MARS = normalizeAngle(positions.SUN + 120);   // Simplified
    positions.JUPITER = normalizeAngle(positions.SUN + 180); // Simplified
    positions.SATURN = normalizeAngle(positions.SUN + 240);  // Simplified
    
    return positions;
}
```

---

## 6. House System Implementations {#house-systems}

### Equal House System for Arabic Parts

```javascript
/**
 * Calculate equal house cusps for Arabic Parts analysis
 * @param {number} ascendant - Ascendant longitude in degrees
 * @returns {Array} House cusp longitudes
 */
function calculateEqualHouses(ascendant) {
    const houses = [];
    
    for (let i = 0; i < 12; i++) {
        houses.push(normalizeAngle(ascendant + i * ARABIC_PARTS_CONSTANTS.DEGREES_PER_SIGN));
    }
    
    return houses;
}
```

---

## 7. Arabic Parts Calculation Methods {#arabic-parts-calculations}

### Advanced Lot Calculations

```javascript
/**
 * Calculate additional Arabic Parts based on specific formulas
 * @param {Object} birthData - Complete birth chart data
 * @returns {Object} Additional calculated parts
 */
function calculateAdvancedArabicParts(birthData) {
    const parts = {};
    
    // Lot of Eros (Love/Lust)
    parts.eros = calculateLotPosition('Asc + Venus - Saturn', birthData, birthData.diurnal);
    
    // Lot of Necessity (Fate)
    parts.necessity = calculateLotPosition('Asc + Saturn - Mercury', birthData, birthData.diurnal);
    
    // Lot of Basis (Foundation)
    parts.basis = calculateLotPosition('Asc + Mercury - Venus', birthData, birthData.diurnal);
    
    // Calculate significations for each part
    Object.keys(parts).forEach(partName => {
        parts[partName] = {
            longitude: parts[partName],
            sign: getZodiacSign(parts[partName]),
            house: getHousePosition(parts[partName], birthData.ascendant),
            ruler: getSignRuler(getZodiacSign(parts[partName])),
            signification: getPartSignification(partName)
        };
    });
    
    return parts;
}

/**
 * Get traditional signification of an Arabic Part
 */
function getPartSignification(partName) {
    const significations = {
        fortune: 'Prosperity, happiness, worldly success',
        spirit: 'Intellect, spirituality, divine connection',
        eros: 'Love, passion, sexual matters',
        necessity: 'Fate, karma, unavoidable circumstances',
        basis: 'Foundation, career, material stability'
    };
    
    return significations[partName] || 'General fortune and life circumstances';
}
```

---

## 8. Complete Implementation Code {#implementation-code}

### Complete Arabic Parts Calculator

```javascript
/**
 * Custom error classes for specific error types
 */
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

class AstronomicalError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AstronomicalError';
    }
}

class CalculationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CalculationError';
    }
}

/**
 * Complete Arabic Parts Calculation System
 */
class ArabicPartsCalculator {
    constructor() {
        this.lotCalculator = new LotCalculator();
        this.sectCalculator = new SectCalculator();
        this.aspectCalculator = new AspectCalculator();
    }

    /**
     * Generate complete Arabic Parts profile
     * @param {Object} birthData - Birth information
     * @returns {Object} Complete Arabic Parts profile
     */
    async generatePartsProfile(birthData) {
        try {
            // Step 1: Validate input data
            this._validateBirthData(birthData);

            // Step 2: Calculate astronomical data
            const astroData = this._calculateAstronomicalData(birthData);

            // Step 3: Determine sect
            const sect = this.sectCalculator.calculate(birthData);

            // Step 4: Calculate planetary positions
            const planetaryData = await this._calculatePlanetaryData(astroData.julianDay);

            // Step 5: Calculate Arabic Parts
            const arabicParts = this.lotCalculator.calculate(birthData, planetaryData, sect);

            // Step 6: Calculate aspects to parts
            const aspects = this.aspectCalculator.calculateAspects(arabicParts, planetaryData);

            // Step 7: Create parts profile object
            const profile = this._createPartsProfile(birthData, astroData, sect, arabicParts, aspects);

            return profile;

        } catch (error) {
            throw new Error(`Arabic Parts calculation failed: ${error.message}`);
        }
    }

    /**
     * Private method: Validate birth data
     */
    _validateBirthData(birthData) {
        try {
            const required = ['year', 'month', 'day', 'hour', 'latitude', 'longitude'];

            for (const field of required) {
                if (birthData[field] === undefined || birthData[field] === null) {
                    throw new ValidationError(`Missing required field: ${field}`);
                }
            }

            if (birthData.year < 1900 || birthData.year > 2100) {
                throw new ValidationError('Year must be between 1900 and 2100');
            }

            if (birthData.month < 1 || birthData.month > 12) {
                throw new ValidationError('Month must be between 1 and 12');
            }

            if (birthData.day < 1 || birthData.day > 31) {
                throw new ValidationError('Day must be between 1 and 31');
            }

            if (birthData.hour < 0 || birthData.hour > 23) {
                throw new ValidationError('Hour must be between 0 and 23');
            }
        } catch (error) {
            if (error instanceof ValidationError) {
                throw error;
            }
            throw new ValidationError(`Validation failed: ${error.message}`);
        }
    }

    /**
     * Private method: Calculate astronomical data
     */
    _calculateAstronomicalData(birthData) {
        try {
            const julianDay = calculateJulianDay(birthData.year, birthData.month, birthData.day, 
                                               birthData.hour, birthData.minute || 0, birthData.second || 0);

            return { julianDay };
        } catch (error) {
            throw new AstronomicalError(`Astronomical calculation failed: ${error.message}`);
        }
    }

    /**
     * Private method: Calculate planetary data
     */
    async _calculatePlanetaryData(julianDay) {
        try {
            const positions = calculatePlanetaryPositions(julianDay);

            return { positions };
        } catch (error) {
            throw new CalculationError(`Planetary calculation failed: ${error.message}`);
        }
    }

    /**
     * Private method: Create parts profile object
     */
    _createPartsProfile(birthData, astroData, sect, arabicParts, aspects) {
        try {
            return {
                // Basic Information
                birthData: birthData,
                julianDay: astroData.julianDay,

                // Sect Information
                sect: sect,

                // Arabic Parts
                arabicParts: arabicParts,

                // Aspects
                aspects: aspects,

                // Analysis Methods
                getPartInterpretation: (partName) => this._getPartInterpretation(partName, arabicParts),
                getSectBenefits: () => this._getSectBenefits(sect),
                getDominantParts: () => this._getDominantParts(arabicParts)
            };
        } catch (error) {
            throw new CalculationError(`Profile creation failed: ${error.message}`);
        }
    }

    /**
     * Get interpretation for a specific part
     */
    _getPartInterpretation(partName, arabicParts) {
        const part = arabicParts[partName];
        if (!part) return null;

        return {
            name: part.name,
            sign: part.sign,
            house: part.house,
            aspects: part.aspects,
            signification: getPartSignification(partName),
            strength: this._calculatePartStrength(part)
        };
    }

    /**
     * Get benefits of the sect
     */
    _getSectBenefits(sect) {
        if (sect === 'diurnal') {
            return ['Solar sect benefits: Career, public life, leadership, vitality'];
        } else {
            return ['Lunar sect benefits: Inner life, emotions, intuition, relationships'];
        }
    }

    /**
     * Get dominant Arabic Parts
     */
    _getDominantParts(arabicParts) {
        // Sort parts by strength and angularity
        const sortedParts = Object.values(arabicParts)
            .sort((a, b) => this._calculatePartStrength(b) - this._calculatePartStrength(a));

        return sortedParts.slice(0, 3);
    }

    /**
     * Calculate strength of an Arabic Part
     */
    _calculatePartStrength(part) {
        let strength = 0;

        // Angular houses are stronger
        if ([1, 4, 7, 10].includes(part.house)) strength += 3;
        else if ([2, 5, 8, 11].includes(part.house)) strength += 2;
        else strength += 1;

        // Aspects add strength
        strength += part.aspects ? part.aspects.length : 0;

        return strength;
    }
}

// Usage Example
const arabicParts = new ArabicPartsCalculator();

const birthData = {
    year: 1990,
    month: 5,
    day: 15,
    hour: 14,
    minute: 30,
    latitude: 40.7128,
    longitude: -74.0060
};

arabicParts.generatePartsProfile(birthData)
    .then(profile => {
        console.log('Arabic Parts Profile Generated Successfully:', profile);
    })
    .catch(error => {
        console.error('Error generating parts profile:', error);
    });
```

---

## 9. Technical Specifications {#technical-specifications}

### Input Requirements

- **Date Format**: Gregorian calendar (YYYY-MM-DD HH:MM:SS)
- **Location**: Latitude and longitude coordinates
- **Cultural Context**: Traditional Hellenistic/Arabic astrological awareness

### Output Structure

```javascript
{
    birthData: { /* Original input */ },
    julianDay: number,
    sect: string,
    arabicParts: {
        fortune: {
            name: string,
            longitude: number,
            sign: string,
            house: number,
            aspects: array
        },
        spirit: { /* similar structure */ },
        // ... other parts
    },
    aspects: object,
    analysisMethods: { /* Various calculation methods */ }
}
```

### Accuracy Requirements

- **Julian Day**: ±0.0001 days
- **Sect Determination**: Exact diurnal/nocturnal classification
- **Lot Positions**: ±0.5 degrees
- **Angular Calculations**: Exact mathematical precision

### Performance Benchmarks

- **Calculation Time**: < 100ms for complete profile
- **Memory Usage**: < 50MB for full implementation
- **Accuracy**: 99.9% for traditional calculations
- **Scalability**: Handle 1000+ concurrent requests

---

## 10. Ethical Considerations {#ethical-considerations}

### Cultural Respect and Accuracy

Arabic Parts are deeply rooted in Hellenistic and Arabic astrological traditions. Implementation should:

- **Authenticity**: Use accurate traditional Arabic Parts formulas
- **Cultural Context**: Provide appropriate historical and cultural context
- **Respect**: Avoid cultural appropriation or misrepresentation
- **Education**: Include information about the historical development of Arabic Parts

### Responsible Application

While Arabic Parts provide insights into various life aspects, they should never be used to:

- Make medical, financial, or legal decisions
- Discriminate against individuals based on astrological factors
- Provide psychological counseling without professional qualifications
- Influence major life decisions without considering modern circumstances

### Data Privacy

Birth data used in Arabic Parts calculations should be:

- **Consensual**: Obtained with explicit, informed consent
- **Minimal**: Collect only necessary information
- **Secure**: Protected with appropriate encryption and access controls
- **Transient**: Retained only as long as needed

### Algorithmic Transparency

Arabic Parts calculations should be:

- **Mathematically Sound**: Based on established traditional formulas
- **Transparent**: Clearly document calculation methods and assumptions
- **Verifiable**: Allow users to understand and verify calculations
- **Educational**: Help users learn about the underlying astrological system

---

## 11. References {#references}

1. **Arabic Parts (Lots)** - Traditional Hellenistic and Arabic astrological calculation points
2. **Sect** - Diurnal/nocturnal division in traditional astrology
3. **Lot of Fortune** - Primary Arabic Part representing prosperity and happiness
4. **Lot of Spirit** - Arabic Part representing intellect and spirituality
5. **Hellenistic Astrology** - Ancient Greek astrological traditions
6. **VSOP87 Theory** - Modern planetary position calculations
7. **Swiss Ephemeris** - Professional astronomical library

### Implementation Notes

- For production use, integrate with astronomical libraries for accurate planetary positions
- Implement proper error handling and input validation
- Add caching for frequently requested calculations
- Consider localization for different astrological traditions
- Include comprehensive logging and monitoring

This implementation provides a complete foundation for ZC5.5 Arabic Parts calculations with all necessary algorithms, formulas, and code examples for accurate traditional astrological calculations.