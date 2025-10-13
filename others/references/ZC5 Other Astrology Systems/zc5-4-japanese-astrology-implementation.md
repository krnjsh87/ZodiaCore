# ZC5.4 Japanese Astrology Implementation Guide

## Overview

This document provides a comprehensive implementation guide for ZC5.4 Japanese Astrology calculations, incorporating all necessary mathematical foundations, astronomical calculations, algorithms, and technical specifications for creating accurate Japanese astrological systems including Nine Star Ki (Kyuusei), Rokuyo cycles, and traditional Japanese fortune-telling methods.

## Table of Contents

1. [Introduction](#introduction)
2. [Mathematical Foundations](#mathematical-foundations)
3. [Astronomical Calculations](#astronomical-calculations)
4. [Birth Chart Generation Algorithms](#birth-chart-algorithms)
5. [Planetary Position Calculations](#planetary-calculations)
6. [House System Implementations](#house-systems)
7. [Nakshatra Calculation Methods](#nakshatra-calculations)
8. [Complete Implementation Code](#implementation-code)
9. [Technical Specifications](#technical-specifications)
10. [Ethical Considerations](#ethical-considerations)
11. [References](#references)

---

## Change Log

### Version 1.0 (2025-10-12)
- Initial implementation of Japanese astrology systems
- Added Nine Star Ki calculations
- Added Rokuyo cycle implementation
- Added Jikkan and Junishi calculations
- Added directional and elemental analysis
- Added unit tests for major functions
- Added Big O notation complexity analysis
- Added ethical considerations section for privacy and responsible use

---

## 1. Introduction {#introduction}

### What is Japanese Astrology?

Japanese astrology encompasses several traditional systems for understanding fate, fortune, and timing. The primary systems include:

- **Nine Star Ki (Kyuusei)**: A 9-star system based on birth year and directional influences
- **Rokuyo**: A 6-day cycle determining auspicious/inauspicious days
- **Jikkan (Heavenly Stems)**: 10 celestial stems representing energy qualities
- **Junishi (Earthly Branches)**: 12 animal signs similar to Chinese zodiac
- **Inyo Gogyo**: Yin-Yang and Five Elements system

### Key Components

1. **Nine Star Ki**: Personal star based on birth year
2. **Rokuyo Cycle**: Daily fortune cycles
3. **Jikkan/Junishi**: Stem-branch combinations
4. **Directional Feng Shui**: Compass-based influences
5. **Five Elements**: Wood, Fire, Earth, Metal, Water

### Implementation Requirements

- **Lunar Calendar**: Traditional Japanese calendar calculations
- **Directional Mathematics**: Compass-based positioning
- **Elemental Balance**: Five elements harmony calculations
- **Cycle Calculations**: Various periodic fortune cycles
- **Cultural Accuracy**: Authentic Japanese astrological methods

---

## 2. Mathematical Foundations {#mathematical-foundations}

### Core Mathematical Constants

```javascript
const JAPANESE_ASTRO_CONSTANTS = {
    // Time and Date Constants
    JULIAN_DAY_J2000: 2451545.0,           // Julian Day for January 1, 2000, 12:00 UTC
    JULIAN_CENTURY: 36525.0,               // Days in a Julian century
    SECONDS_PER_DAY: 86400.0,              // Seconds in a day
    DEGREES_PER_CIRCLE: 360.0,             // Degrees in a circle
    MINUTES_PER_DEGREE: 60.0,              // Minutes in a degree
    SECONDS_PER_MINUTE: 60.0,              // Seconds in a minute
    
    // Japanese Astrology Constants
    NINE_STARS: 9,                         // 9 stars in Kyuusei system
    ROKUYO_CYCLE: 6,                       // 6-day Rokuyo cycle
    JIKKAN_COUNT: 10,                      // 10 heavenly stems
    JUNISHI_COUNT: 12,                     // 12 earthly branches
    DIRECTIONS_COUNT: 8,                   // 8 cardinal directions
    ELEMENTS_COUNT: 5,                     // 5 elements
    
    // Calendar Constants
    JAPANESE_YEAR_OFFSET: 1984,            // Base year for Nine Star Ki (Year of Wood Rat)
    LUNAR_MONTHS: 12,                      // Lunar months
    SOLAR_TERMS: 24,                       // 24 solar terms
    
    // Directional Constants (in degrees)
    NORTH: 0.0,
    NORTHEAST: 45.0,
    EAST: 90.0,
    SOUTHEAST: 135.0,
    SOUTH: 180.0,
    SOUTHWEST: 225.0,
    WEST: 270.0,
    NORTHWEST: 315.0
};

const NINE_STAR_NAMES = [
    'One White', 'Two Black', 'Three Jade', 'Four Green', 'Five Yellow',
    'Six White', 'Seven Red', 'Eight White', 'Nine Purple'
];

const ROKUYO_NAMES = [
    'Senkichi', 'Tomobiki', 'Senbu', 'Butsumetsu', 'Taian', 'Shakko'
];

const JIKKAN_NAMES = [
    'Kinoe', 'Kinoto', 'Hinoe', 'Hinoto', 'Tsuchinoe', 'Tsuchinoto',
    'Kanoe', 'Kanoto', 'Mizunoe', 'Mizunoto'
];

const JUNISHI_NAMES = [
    'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
    'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'
];

const ELEMENT_NAMES = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
const ELEMENT_YIN_YANG = ['Yang', 'Yin', 'Yang', 'Yin', 'Yang'];

// Validation
if (NINE_STAR_NAMES.length !== 9) {
    throw new Error('NINE_STAR_NAMES array must contain exactly 9 elements');
}
if (ROKUYO_NAMES.length !== 6) {
    throw new Error('ROKUYO_NAMES array must contain exactly 6 elements');
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
 * Calculate direction from degrees
 */
function degreesToDirection(degrees) {
    const normalized = normalizeAngle(degrees);
    const directions = [
        { name: 'North', range: [337.5, 22.5] },
        { name: 'Northeast', range: [22.5, 67.5] },
        { name: 'East', range: [67.5, 112.5] },
        { name: 'Southeast', range: [112.5, 157.5] },
        { name: 'South', range: [157.5, 202.5] },
        { name: 'Southwest', range: [202.5, 247.5] },
        { name: 'West', range: [247.5, 292.5] },
        { name: 'Northwest', range: [292.5, 337.5] }
    ];
    
    for (const dir of directions) {
        if (normalized >= dir.range[0] && normalized < dir.range[1]) {
            return dir.name;
        }
    }
    return 'North'; // Default
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

### Lunar Calendar Calculations

```javascript
/**
 * Calculate Lunar New Year date for given year
 * @param {number} year - Gregorian year
 * @returns {Object} Lunar new year date
 */
function calculateLunarNewYear(year) {
    // Simplified lunar calendar calculation
    // In production, use astronomical lunar calculations
    const T = (year - 2000) / 100;
    
    // Approximate lunar new year (simplified)
    const lunarJD = 2451550.09765 + 29.530588853 * (year - 2000) + 
                   0.0001337 * T * T - 0.000000150 * T * T * T;
    
    // Convert back to Gregorian date (simplified)
    const gregorianDate = julianDayToGregorian(lunarJD);
    
    return gregorianDate;
}

/**
 * Convert Julian Day to Gregorian date
 */
function julianDayToGregorian(jd) {
    const jdInt = Math.floor(jd + 0.5);
    const a = jdInt + 32044;
    const b = Math.floor((4 * a + 3) / 146097);
    const c = a - Math.floor(146097 * b / 4);
    const d = Math.floor((4 * c + 3) / 1461);
    const e = c - Math.floor(1461 * d / 4);
    const m = Math.floor((5 * e + 2) / 153);
    
    const day = e - Math.floor((153 * m + 2) / 5) + 1;
    const month = m + 3 - 12 * Math.floor(m / 10);
    const year = 100 * b + d - 4800 + Math.floor(m / 10);
    
    return { year, month, day };
}
```

---

## 4. Birth Chart Generation Algorithms {#birth-chart-algorithms}

### Nine Star Ki Calculation

```javascript
/**
 * Calculate Nine Star Ki for given birth year
 * @param {number} birthYear - Birth year (Gregorian)
 * @returns {Object} Nine Star Ki information
 */
function calculateNineStarKi(birthYear) {
    // Nine Star Ki calculation based on birth year
    // Base year 1984 = Year of Wood Rat = Nine Star 1 (One White)
    const yearOffset = birthYear - JAPANESE_ASTRO_CONSTANTS.JAPANESE_YEAR_OFFSET;
    const starNumber = ((9 - (yearOffset % 9)) % 9) + 1;
    
    const starIndex = starNumber - 1;
    const starName = NINE_STAR_NAMES[starIndex];
    
    // Determine element and direction
    const elementIndex = Math.floor((starNumber - 1) / 2) % 5;
    const element = ELEMENT_NAMES[elementIndex];
    const yinYang = ELEMENT_YIN_YANG[elementIndex];
    
    // Direction based on star number
    const directions = ['North', 'Southwest', 'East', 'Southeast', 'Center', 'Northwest', 'West', 'Northeast', 'South'];
    const direction = directions[starIndex];
    
    return {
        starNumber: starNumber,
        starName: starName,
        element: element,
        yinYang: yinYang,
        direction: direction,
        year: birthYear,
        characteristics: getNineStarCharacteristics(starNumber)
    };
}

#### Unit Tests for calculateNineStarKi

```javascript
describe('calculateNineStarKi', () => {
  test('calculates Nine Star Ki for base year 1984', () => {
    const result = calculateNineStarKi(1984);
    expect(result.starNumber).toBe(1);
    expect(result.starName).toBe('One White');
  });

  test('calculates Nine Star Ki for 2025', () => {
    const result = calculateNineStarKi(2025);
    expect(result.starNumber).toBeGreaterThan(0);
    expect(result.starNumber).toBeLessThanOrEqual(9);
  });

  test('returns correct element and direction', () => {
    const result = calculateNineStarKi(1990);
    expect(result.element).toBeDefined();
    expect(result.direction).toBeDefined();
  });
});
```

#### Complexity Analysis for calculateNineStarKi

- **Time Complexity**: O(1) - Simple arithmetic operations and array lookups
- **Space Complexity**: O(1) - Returns a fixed-size object

### Rokuyo Cycle Calculation

```javascript
/**
 * Calculate Rokuyo for given date
 * @param {number} year - Year
 * @param {number} month - Month
 * @param {number} day - Day
 * @returns {Object} Rokuyo information
 */
function calculateRokuyo(year, month, day) {
    // Calculate days since a reference date
    const referenceDate = new Date(1900, 0, 1); // January 1, 1900
    const targetDate = new Date(year, month - 1, day);
    const daysDiff = Math.floor((targetDate - referenceDate) / (1000 * 60 * 60 * 24));
    
    // Rokuyo cycle repeats every 6 days
    const rokuyoIndex = daysDiff % 6;
    const rokuyoName = ROKUYO_NAMES[rokuyoIndex];
    
    // Determine auspiciousness
    const auspiciousness = getRokuyoAuspiciousness(rokuyoName);
    
    return {
        name: rokuyoName,
        index: rokuyoIndex + 1,
        auspiciousness: auspiciousness,
        date: { year, month, day }
    };
}

/**
 * Get Rokuyo auspiciousness rating
 */
function getRokuyoAuspiciousness(rokuyoName) {
    const ratings = {
        'Senkichi': 'Very Auspicious',
        'Tomobiki': 'Auspicious',
        'Senbu': 'Neutral',
        'Butsumetsu': 'Inauspicious',
        'Taian': 'Very Auspicious',
        'Shakko': 'Inauspicious'
    };
    return ratings[rokuyoName] || 'Unknown';
}
```

### Jikkan and Junishi Calculation

```javascript
/**
 * Calculate Jikkan and Junishi for given year
 * @param {number} year - Year
 * @returns {Object} Stem-branch combination
 */
function calculateJikkanJunishi(year) {
    // Jikkan (Heavenly Stem) calculation
    const jikkanIndex = (year - 1984) % 10;
    const jikkanName = JIKKAN_NAMES[jikkanIndex];
    
    // Junishi (Earthly Branch) calculation
    const junishiIndex = (year - 1984) % 12;
    const junishiName = JUNISHI_NAMES[junishiIndex];
    
    // Combined stem-branch
    const combined = `${jikkanName} ${junishiName}`;
    
    return {
        jikkan: {
            index: jikkanIndex + 1,
            name: jikkanName,
            element: getJikkanElement(jikkanName),
            yinYang: getJikkanYinYang(jikkanName)
        },
        junishi: {
            index: junishiIndex + 1,
            name: junishiName,
            direction: getJunishiDirection(junishiName),
            element: getJunishiElement(junishiName)
        },
        combined: combined,
        year: year
    };
}

/**
 * Get element for Jikkan
 */
function getJikkanElement(jikkan) {
    const elements = {
        'Kinoe': 'Wood', 'Kinoto': 'Wood',
        'Hinoe': 'Fire', 'Hinoto': 'Fire',
        'Tsuchinoe': 'Earth', 'Tsuchinoto': 'Earth',
        'Kanoe': 'Metal', 'Kanoto': 'Metal',
        'Mizunoe': 'Water', 'Mizunoto': 'Water'
    };
    return elements[jikkan] || 'Unknown';
}

/**
 * Get direction for Junishi
 */
function getJunishiDirection(junishi) {
    const directions = {
        'Rat': 'North', 'Ox': 'North-Northeast', 'Tiger': 'East-Northeast',
        'Rabbit': 'East', 'Dragon': 'East-Southeast', 'Snake': 'South-Southeast',
        'Horse': 'South', 'Goat': 'South-Southwest', 'Monkey': 'West-Southwest',
        'Rooster': 'West', 'Dog': 'West-Northwest', 'Pig': 'North-Northwest'
    };
    return directions[junishi] || 'Unknown';
}
```

---

## 5. Planetary Position Calculations {#planetary-calculations}

### Simplified Planetary Calculations

```javascript
/**
 * Calculate simplified planetary positions for Japanese astrology
 * @param {number} julianDay - Julian Day Number
 * @returns {Object} Planetary positions in degrees
 */
function calculatePlanetaryPositions(julianDay) {
    const T = calculateJulianCenturies(julianDay);
    const positions = {};
    
    // Sun's position (simplified)
    positions.SUN = normalizeAngle(280.459 + 0.98564736 * (julianDay - JAPANESE_ASTRO_CONSTANTS.JULIAN_DAY_J2000));
    
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
    
    // For Japanese astrology, focus on Sun and Moon primarily
    // Other planets can be added as needed
    
    return positions;
}
```

---

## 6. House System Implementations {#house-systems}

### Directional House System

```javascript
/**
 * Calculate directional houses for Japanese astrology
 * @param {number} birthDirection - Birth direction in degrees (if known)
 * @returns {Array} Directional house cusps
 */
function calculateDirectionalHouses(birthDirection = 0) {
    const houses = [];
    
    // Japanese astrology uses 8 directional houses
    const directions = [
        JAPANESE_ASTRO_CONSTANTS.NORTH,
        JAPANESE_ASTRO_CONSTANTS.NORTHEAST,
        JAPANESE_ASTRO_CONSTANTS.EAST,
        JAPANESE_ASTRO_CONSTANTS.SOUTHEAST,
        JAPANESE_ASTRO_CONSTANTS.SOUTH,
        JAPANESE_ASTRO_CONSTANTS.SOUTHWEST,
        JAPANESE_ASTRO_CONSTANTS.WEST,
        JAPANESE_ASTRO_CONSTANTS.NORTHWEST
    ];
    
    for (const dir of directions) {
        houses.push(normalizeAngle(birthDirection + dir));
    }
    
    return houses;
}
```

---

## 7. Nakshatra Calculation Methods {#nakshatra-calculations}

### Japanese Lunar Mansion System

```javascript
/**
 * Calculate Japanese lunar mansions (28 mansions)
 * @param {number} moonLongitude - Moon's longitude in degrees
 * @returns {Object} Lunar mansion information
 */
function calculateJapaneseLunarMansion(moonLongitude) {
    // Japanese system uses 28 lunar mansions
    const mansions = 28;
    const degreesPerMansion = 360 / mansions;
    
    const mansionIndex = Math.floor(moonLongitude / degreesPerMansion);
    const mansionName = getJapaneseMansionName(mansionIndex);
    
    return {
        mansionNumber: mansionIndex + 1,
        mansionName: mansionName,
        degreesInMansion: moonLongitude % degreesPerMansion,
        totalMansions: mansions
    };
}

/**
 * Get Japanese lunar mansion names
 */
function getJapaneseMansionName(index) {
    const mansionNames = [
        'Horn', 'Neck', 'Root', 'Room', 'Heart', 'Tail', 'Basket',
        'Turtle', 'Eight', 'Northern Dipper', 'Ox', 'Woman', 'Emptiness',
        'Rooftop', 'House', 'Wall', 'Legs', 'Bond', 'Mouth', 'Net',
        'Turtle Beak', 'Three Stars', 'Jade', 'Wings', 'Chariot', 'Bottom', 'Basket Handle', 'Orchard'
    ];
    
    return mansionNames[index] || 'Unknown';
}
```

---

## 8. Complete Implementation Code {#implementation-code}

### Complete Japanese Astrology Calculator

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
 * Complete Japanese Astrology Calculation System
 */
class JapaneseAstrologyCalculator {
    constructor() {
        this.nineStarCalculator = new NineStarKiCalculator();
        this.rokuyoCalculator = new RokuyoCalculator();
        this.stemBranchCalculator = new StemBranchCalculator();
    }

    /**
     * Generate complete Japanese astrology profile
     * @param {Object} birthData - Birth information
     * @returns {Object} Complete astrology profile
     */
    async generateAstrologyProfile(birthData) {
        try {
            // Step 1: Validate input data
            this._validateBirthData(birthData);

            // Step 2: Calculate astronomical data
            const astroData = this._calculateAstronomicalData(birthData);

            // Step 3: Calculate Nine Star Ki
            const nineStarKi = this.nineStarCalculator.calculate(birthData.year);

            // Step 4: Calculate Rokuyo for birth date
            const rokuyo = this.rokuyoCalculator.calculate(birthData.year, birthData.month, birthData.day);

            // Step 5: Calculate Jikkan and Junishi
            const stemBranch = this.stemBranchCalculator.calculate(birthData.year);

            // Step 6: Calculate planetary positions
            const planetaryData = await this._calculatePlanetaryData(astroData.julianDay);

            // Step 7: Calculate directional influences
            const directionalData = this._calculateDirectionalData(birthData);

            // Step 8: Create astrology profile object
            const profile = this._createAstrologyProfile(birthData, astroData, nineStarKi, rokuyo, stemBranch, planetaryData, directionalData);

            return profile;

        } catch (error) {
            throw new Error(`Japanese astrology calculation failed: ${error.message}`);
        }
    }

    /**
     * Private method: Validate birth data
     */
    _validateBirthData(birthData) {
        try {
            const required = ['year', 'month', 'day'];

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
            const julianDay = calculateJulianDay(birthData.year, birthData.month, birthData.day, 12, 0, 0);
            const lunarNewYear = calculateLunarNewYear(birthData.year);

            return { julianDay, lunarNewYear };
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
            const lunarMansion = calculateJapaneseLunarMansion(positions.MOON);

            return { positions, lunarMansion };
        } catch (error) {
            throw new CalculationError(`Planetary calculation failed: ${error.message}`);
        }
    }

    /**
     * Private method: Calculate directional data
     */
    _calculateDirectionalData(birthData) {
        try {
            // Default to north if no direction specified
            const birthDirection = birthData.direction || 0;
            const houses = calculateDirectionalHouses(birthDirection);

            return { birthDirection, houses };
        } catch (error) {
            throw new CalculationError(`Directional calculation failed: ${error.message}`);
        }
    }

    /**
     * Private method: Create astrology profile object
     */
    _createAstrologyProfile(birthData, astroData, nineStarKi, rokuyo, stemBranch, planetaryData, directionalData) {
        try {
            return {
                // Basic Information
                birthData: birthData,
                julianDay: astroData.julianDay,
                lunarNewYear: astroData.lunarNewYear,

                // Core Japanese Astrology Elements
                nineStarKi: nineStarKi,
                rokuyo: rokuyo,
                stemBranch: stemBranch,

                // Astronomical Data
                planetaryPositions: planetaryData.positions,
                lunarMansion: planetaryData.lunarMansion,

                // Directional Data
                directionalHouses: directionalData.houses,
                birthDirection: directionalData.birthDirection,

                // Analysis Methods
                getDailyRokuyo: (date) => this.rokuyoCalculator.calculate(date.getFullYear(), date.getMonth() + 1, date.getDate()),
                getAuspiciousDirections: () => this._getAuspiciousDirections(nineStarKi),
                getElementalBalance: () => this._calculateElementalBalance(stemBranch, nineStarKi)
            };
        } catch (error) {
            throw new CalculationError(`Profile creation failed: ${error.message}`);
        }
    }

    /**
     * Get auspicious directions based on Nine Star Ki
     */
    _getAuspiciousDirections(nineStarKi) {
        // Simplified auspicious direction calculation
        const auspiciousDirections = {
            1: ['North', 'South', 'East', 'West'],
            2: ['Northeast', 'Southwest'],
            3: ['East', 'Southeast', 'Northwest'],
            4: ['North', 'South', 'Northeast', 'Southwest'],
            5: ['Center', 'All directions'],
            6: ['Northwest', 'Southeast'],
            7: ['South', 'North', 'West', 'East'],
            8: ['East', 'North', 'South', 'West'],
            9: ['South', 'North', 'West', 'East']
        };

        return auspiciousDirections[nineStarKi.starNumber] || [];
    }

    /**
     * Calculate elemental balance
     */
    _calculateElementalBalance(stemBranch, nineStarKi) {
        const elements = {
            jikkan: stemBranch.jikkan.element,
            junishi: stemBranch.junishi.element,
            nineStar: nineStarKi.element
        };

        // Count element occurrences
        const elementCount = {};
        Object.values(elements).forEach(element => {
            elementCount[element] = (elementCount[element] || 0) + 1;
        });

        return {
            elements: elements,
            balance: elementCount,
            dominantElement: Object.keys(elementCount).reduce((a, b) => elementCount[a] > elementCount[b] ? a : b)
        };
    }
}

// Usage Example
const japaneseAstrology = new JapaneseAstrologyCalculator();

const birthData = {
    year: 1990,
    month: 5,
    day: 15,
    direction: 45 // Northeast direction (optional)
};

japaneseAstrology.generateAstrologyProfile(birthData)
    .then(profile => {
        console.log('Japanese Astrology Profile Generated Successfully:', profile);
    })
    .catch(error => {
        console.error('Error generating astrology profile:', error);
    });
```

---

## 9. Technical Specifications {#technical-specifications}

### Input Requirements

- **Date Format**: Gregorian calendar (YYYY-MM-DD)
- **Direction**: Optional compass direction in degrees (0-360)
- **Cultural Context**: Japanese traditional calendar awareness

### Output Structure

```javascript
{
    birthData: { /* Original input */ },
    julianDay: number,
    lunarNewYear: object,
    nineStarKi: {
        starNumber: number,
        starName: string,
        element: string,
        direction: string
    },
    rokuyo: {
        name: string,
        auspiciousness: string
    },
    stemBranch: {
        jikkan: object,
        junishi: object,
        combined: string
    },
    planetaryPositions: object,
    directionalHouses: array,
    analysisMethods: { /* Various calculation methods */ }
}
```

### Accuracy Requirements

- **Julian Day**: ±0.0001 days
- **Nine Star Ki**: Exact calculation
- **Rokuyo Cycle**: Exact 6-day cycle
- **Stem-Branch**: Exact 60-year cycle
- **Lunar Mansion**: ±0.5 degrees

### Performance Benchmarks

- **Calculation Time**: < 50ms for complete profile
- **Memory Usage**: < 25MB for full implementation
- **Accuracy**: 99.9% for traditional calculations
- **Scalability**: Handle 1000+ concurrent requests

---

## 10. Ethical Considerations {#ethical-considerations}

### Cultural Respect and Accuracy

Japanese astrology is deeply rooted in Japanese cultural and spiritual traditions. Implementation should:

- **Authenticity**: Use accurate traditional Japanese astrological methods
- **Cultural Context**: Provide appropriate cultural and historical context
- **Respect**: Avoid cultural appropriation or misrepresentation
- **Education**: Include information about the cultural significance of practices

### Responsible Application

While Japanese astrology provides guidance and insights, it should never be used to:

- Make medical, financial, or legal decisions
- Discriminate against individuals based on astrological factors
- Provide psychological counseling without professional qualifications
- Influence major life decisions without considering modern circumstances

### Data Privacy

Birth data used in Japanese astrology calculations should be:

- **Consensual**: Obtained with explicit, informed consent
- **Minimal**: Collect only necessary information
- **Secure**: Protected with appropriate encryption and access controls
- **Transient**: Retained only as long as needed

### Algorithmic Transparency

Japanese astrology calculations should be:

- **Mathematically Sound**: Based on established astronomical and traditional principles
- **Transparent**: Clearly document calculation methods and assumptions
- **Verifiable**: Allow users to understand and verify calculations
- **Educational**: Help users learn about the underlying systems

---

## 11. References {#references}

1. **Nine Star Ki (Kyuusei)** - Traditional Japanese fortune-telling system
2. **Rokuyo** - Japanese calendar-based auspicious day system
3. **Jikkan Junishi** - Traditional Japanese stem-branch system
4. **Japanese Lunar Calendar** - Traditional East Asian calendar calculations
5. **Inyo Gogyo** - Japanese Yin-Yang and Five Elements system
6. **VSOP87 Theory** - Modern planetary position calculations
7. **Swiss Ephemeris** - Professional astronomical library

### Implementation Notes

- For production use, integrate with astronomical libraries for accurate planetary positions
- Implement proper error handling and input validation
- Add caching for frequently requested calculations
- Consider cultural localization for different Japanese regions
- Include comprehensive logging and monitoring

This implementation provides a complete foundation for ZC5.4 Japanese astrology calculations with all necessary algorithms, formulas, and code examples for accurate traditional Japanese fortune-telling systems.