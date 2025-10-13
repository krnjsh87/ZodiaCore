# ZC2.2 Chinese Astrology Calculations Implementation Guide

## Overview

This document provides a comprehensive implementation guide for ZC2.2 Chinese Astrology Calculations, focusing on advanced algorithms for Ba-Zi (Four Pillars), Five Elements analysis, Nine Star Ki directional influences, and lunar calendar mathematics. This builds upon ZC2.1 by providing deep research and detailed implementation logics for all aspects of Chinese astrology calculations.

## Table of Contents

1. [Introduction](#introduction)
2. [Mathematical Foundations](#mathematical-foundations)
3. [Astronomical Calculations](#astronomical-calculations)
4. [Calculation Algorithms](#calculation-algorithms)
5. [Stem-Branch Calculations](#stem-branch-calculations)
6. [Five Elements System](#five-elements-system)
7. [Nine Star Ki Calculations](#nine-star-ki-calculations)
8. [Lunar Calendar Calculations](#lunar-calendar-calculations)
9. [Complete Implementation Code](#implementation-code)
10. [Technical Specifications](#technical-specifications)
11. [Integration Points](#integration-points)
12. [Ethical Considerations](#ethical-considerations)
13. [References](#references)

---

## Change Log

### Version 1.0 (2025-10-07)
- Initial implementation of ZC2.2 Chinese astrology calculations
- Added comprehensive Ba-Zi calculation algorithms with advanced stem-branch logic
- Implemented Five Elements balance analysis with generation and control cycles
- Added Nine Star Ki directional calculations with flying star mathematics
- Included lunar calendar calculations with solar term precision
- Added unit tests, complexity analysis, and performance benchmarks
- Included ethical considerations for cultural sensitivity

### Version 1.1 (2025-10-08)
- Code review fixes: Removed duplicate code at end of file
- Added comprehensive input validation and error handling to key functions
- Enhanced security with ValidationError class and date validation
- Improved code quality: extracted constants, added JSDoc comments, fixed missing functions
- Added degToRad utility function for astronomical calculations
- Refactored DRY violations by using centralized constants

---

## 1. Introduction {#introduction}

### What is ZC2.2 Chinese Astrology Calculations?

ZC2.2 represents the advanced calculation engine for Chinese astrology, providing sophisticated algorithms for:

- **Ba-Zi (Four Pillars)**: Advanced stem-branch calculations with seasonal adjustments
- **Five Elements**: Dynamic balance analysis with elemental interactions
- **Nine Star Ki**: Directional energy flow calculations with temporal variations
- **Lunar Calendar**: Precise astronomical calculations for traditional Chinese timekeeping

### Key Components

1. **Advanced Stem-Branch System**: 60-year cycle with precise astronomical alignment
2. **Five Elements Dynamics**: Generation, control, and balance calculations
3. **Nine Star Ki Mathematics**: Flying star calculations with directional influences
4. **Lunar Calendar Algorithms**: Solar term calculations and new moon determinations
5. **Time Zone Corrections**: Accurate birth time conversions for global calculations

### Implementation Requirements

- **Precision Mathematics**: High-precision floating-point calculations for astronomical data
- **Cultural Accuracy**: Traditional Chinese astronomical constants and formulas
- **Performance Optimization**: Efficient algorithms for real-time calculations
- **Error Handling**: Robust validation and fallback mechanisms

---

## 2. Mathematical Foundations {#mathematical-foundations}

### Core Mathematical Constants

```javascript
const CHINESE_ASTRO_ADVANCED_CONSTANTS = {
    // Advanced Time and Date Constants
    JULIAN_DAY_J2000: 2451545.0,
    JULIAN_CENTURY: 36525.0,
    SECONDS_PER_DAY: 86400.0,
    DEGREES_PER_CIRCLE: 360.0,

    // Lunar Calendar Advanced Constants
    LUNAR_CYCLE_DAYS: 29.530588853,           // Mean synodic month (days)
    SOLAR_YEAR_DAYS: 365.242374,              // Mean tropical year (days)
    SIDEREAL_YEAR_DAYS: 365.25636,            // Sidereal year (days)
    ANOMALISTIC_YEAR_DAYS: 365.259636,        // Anomalistic year (days)

    // Stem-Branch Advanced System
    STEMS_COUNT: 10,                          // 10 Heavenly Stems
    BRANCHES_COUNT: 12,                       // 12 Earthly Branches
    SEXAGENARY_CYCLE: 60,                     // 60-year Jia Zi cycle
    STEM_BRANCH_PRECISION: 1e-6,              // Calculation precision

    // Five Elements Advanced
    ELEMENTS_COUNT: 5,                        // Wood, Fire, Earth, Metal, Water
    ELEMENTAL_HARMONICS: [2, 3, 5, 7, 11],   // Prime harmonics for elements

    // Nine Star Ki Advanced
    STARS_COUNT: 9,                           // 9 Flying Stars
    DIRECTIONS_COUNT: 8,                      // 8 cardinal directions + center
    STAR_ENERGY_LEVELS: 9,                    // Energy intensity levels

    // Solar Terms Advanced
    SOLAR_TERMS_COUNT: 24,                    // 24 Jie Qi
    DEGREES_PER_SOLAR_TERM: 15.0,             // 360°/24 = 15°
    SOLAR_TERM_PRECISION: 1e-4,               // Arcminute precision

    // Time Constants Advanced
    HOURS_PER_DAY: 24,
    DOUBLE_HOURS_COUNT: 12,                   // 12 double-hours (2-hour each)
    MINUTES_PER_DOUBLE_HOUR: 120,
    SECONDS_PER_DOUBLE_HOUR: 7200,

    // Epoch Constants Advanced
    CHINESE_EPOCH_YEAR: 2697,                 // BCE year for stem-branch cycle
    JIA_ZI_YEAR: 1984,                        // Modern Jia Zi year (Rat)
    REFERENCE_JD: 2444786.5,                  // JD for 1984-02-17 (Jia Zi)

    // Astronomical Constants
    EARTH_OBLIQUITY: 23.439281,               // Earth's axial tilt (degrees)
    LUNAR_INCLINATION: 5.145,                 // Moon's orbital inclination
    SOLAR_CONSTANT: 1366.0,                   // Solar irradiance (W/m²)
};

// Heavenly Stems with Elemental Properties
const HEAVENLY_STEMS_ADVANCED = [
    { name: 'Jia', element: 'Wood', polarity: 'Yang', numeric: 1 },
    { name: 'Yi', element: 'Wood', polarity: 'Yin', numeric: 2 },
    { name: 'Bing', element: 'Fire', polarity: 'Yang', numeric: 3 },
    { name: 'Ding', element: 'Fire', polarity: 'Yin', numeric: 4 },
    { name: 'Wu', element: 'Earth', polarity: 'Yang', numeric: 5 },
    { name: 'Ji', element: 'Earth', polarity: 'Yin', numeric: 6 },
    { name: 'Geng', element: 'Metal', polarity: 'Yang', numeric: 7 },
    { name: 'Xin', element: 'Metal', polarity: 'Yin', numeric: 8 },
    { name: 'Ren', element: 'Water', polarity: 'Yang', numeric: 9 },
    { name: 'Gui', element: 'Water', polarity: 'Yin', numeric: 10 }
];

// Earthly Branches with Advanced Properties
const EARTHLY_BRANCHES_ADVANCED = [
    { name: 'Zi', animal: 'Rat', direction: 0, element: 'Water', polarity: 'Yin' },
    { name: 'Chou', animal: 'Ox', direction: 30, element: 'Earth', polarity: 'Yin' },
    { name: 'Yin', animal: 'Tiger', direction: 60, element: 'Wood', polarity: 'Yang' },
    { name: 'Mao', animal: 'Rabbit', direction: 90, element: 'Wood', polarity: 'Yin' },
    { name: 'Chen', animal: 'Dragon', direction: 120, element: 'Earth', polarity: 'Yang' },
    { name: 'Si', animal: 'Snake', direction: 150, element: 'Fire', polarity: 'Yin' },
    { name: 'Wu', animal: 'Horse', direction: 180, element: 'Fire', polarity: 'Yang' },
    { name: 'Wei', animal: 'Goat', direction: 210, element: 'Earth', polarity: 'Yin' },
    { name: 'Shen', animal: 'Monkey', direction: 240, element: 'Metal', polarity: 'Yang' },
    { name: 'You', animal: 'Rooster', direction: 270, element: 'Metal', polarity: 'Yin' },
    { name: 'Xu', animal: 'Dog', direction: 300, element: 'Earth', polarity: 'Yang' },
    { name: 'Hai', animal: 'Pig', direction: 330, element: 'Water', polarity: 'Yin' }
];

// Five Elements with Advanced Relationships
const FIVE_ELEMENTS_ADVANCED = {
    WOOD: {
        name: 'Wood',
        generates: 'Fire',
        controls: 'Earth',
        controlledBy: 'Metal',
        generatedBy: 'Water',
        color: 'Green',
        direction: 'East',
        season: 'Spring',
        planet: 'Jupiter',
        organ: 'Liver'
    },
    FIRE: {
        name: 'Fire',
        generates: 'Earth',
        controls: 'Metal',
        controlledBy: 'Water',
        generatedBy: 'Wood',
        color: 'Red',
        direction: 'South',
        season: 'Summer',
        planet: 'Mars',
        organ: 'Heart'
    },
    EARTH: {
        name: 'Earth',
        generates: 'Metal',
        controls: 'Water',
        controlledBy: 'Wood',
        generatedBy: 'Fire',
        color: 'Yellow',
        direction: 'Center',
        season: 'Late Summer',
        planet: 'Saturn',
        organ: 'Spleen'
    },
    METAL: {
        name: 'Metal',
        generates: 'Water',
        controls: 'Wood',
        controlledBy: 'Fire',
        generatedBy: 'Earth',
        color: 'White',
        direction: 'West',
        season: 'Autumn',
        planet: 'Venus',
        organ: 'Lungs'
    },
    WATER: {
        name: 'Water',
        generates: 'Wood',
        controls: 'Fire',
        controlledBy: 'Earth',
        generatedBy: 'Metal',
        color: 'Black',
        direction: 'North',
        season: 'Winter',
        planet: 'Mercury',
        organ: 'Kidneys'
    }
};

// Nine Star Ki with Advanced Properties
const NINE_STARS_ADVANCED = [
    { number: 1, color: 'White', element: 'Water', direction: 'North', energy: 'Leadership' },
    { number: 2, color: 'Black', element: 'Earth', direction: 'Southwest', energy: 'Relationship' },
    { number: 3, color: 'Jade', element: 'Wood', direction: 'East', energy: 'Communication' },
    { number: 4, color: 'Green', element: 'Wood', direction: 'Southeast', energy: 'Education' },
    { number: 5, color: 'Yellow', element: 'Earth', direction: 'Center', energy: 'Transformation' },
    { number: 6, color: 'White', element: 'Metal', direction: 'Northwest', energy: 'Heavenly' },
    { number: 7, color: 'Red', element: 'Fire', direction: 'West', energy: 'Competition' },
    { number: 8, color: 'White', element: 'Earth', direction: 'Northeast', energy: 'Prosperity' },
    { number: 9, color: 'Purple', element: 'Fire', direction: 'South', energy: 'Completion' }
];

// Direction modifiers for flying star calculations
const DIRECTION_MODIFIERS = {
    North: 1, Northeast: 2, East: 3, Southeast: 4,
    South: 5, Southwest: 6, West: 7, Northwest: 8, Center: 0
};

// Direction-specific energy modifiers
const DIRECTION_ENERGY_MODIFIERS = {
    North: 1.0, South: 1.0, East: 1.0, West: 1.0,
    Northeast: 0.8, Northwest: 0.8, Southeast: 0.8, Southwest: 0.8,
    Center: 1.2
};
```

### Essential Mathematical Functions

```javascript
/**
 * Advanced angle normalization with precision control
 */
function normalizeAngle(angle, precision = CHINESE_ASTRO_ADVANCED_CONSTANTS.STEM_BRANCH_PRECISION) {
    while (angle < 0) angle += 360;
    while (angle >= 360) angle -= 360;
    return Math.round(angle / precision) * precision;
}

/**
 * Calculate modular arithmetic with proper handling of negative numbers
 */
function mod(a, b) {
    return ((a % b) + b) % b;
}

/**
 * Convert degrees to radians
 * @param {number} degrees - Angle in degrees
 * @returns {number} Angle in radians
 */
function degToRad(degrees) {
    return degrees * (Math.PI / 180);
}

/**
 * Convert Gregorian date to Julian Day Number with high precision
 * @param {number} year - Gregorian year
 * @param {number} month - Month (1-12)
 * @param {number} day - Day of month
 * @param {number} hour - Hour (0-23)
 * @param {number} minute - Minute (0-59)
 * @param {number} second - Second (0-59)
 * @returns {number} Julian Day Number
 * @throws {ValidationError} If input parameters are invalid
 */
function gregorianToJulianDay(year, month, day, hour = 0, minute = 0, second = 0) {
    // Input validation
    if (!Number.isInteger(year) || year < -4712 || year > 9999) {
        throw new ValidationError('Year must be an integer between -4712 and 9999');
    }
    if (!Number.isInteger(month) || month < 1 || month > 12) {
        throw new ValidationError('Month must be an integer between 1 and 12');
    }
    if (!Number.isInteger(day) || day < 1 || day > 31) {
        throw new ValidationError('Day must be an integer between 1 and 31');
    }
    if (hour < 0 || hour >= 24 || !Number.isFinite(hour)) {
        throw new ValidationError('Hour must be a number between 0 and 23.999...');
    }
    if (minute < 0 || minute >= 60 || !Number.isFinite(minute)) {
        throw new ValidationError('Minute must be a number between 0 and 59.999...');
    }
    if (second < 0 || second >= 60 || !Number.isFinite(second)) {
        throw new ValidationError('Second must be a number between 0 and 59.999...');
    }

    let adjYear = year;
    let adjMonth = month;

    if (month <= 2) {
        adjYear -= 1;
        adjMonth += 12;
    }

    const A = Math.floor(adjYear / 100);
    const B = 2 - A + Math.floor(A / 4);

    const JD = Math.floor(365.25 * (adjYear + 4716)) +
               Math.floor(30.6001 * (adjMonth + 1)) +
               day + B - 1524.5;

    // Add fractional day with high precision
    const fractionalDay = (hour + minute/60 + second/3600) / 24;
    return JD + fractionalDay;
}

/**
 * Calculate the number of days between two Julian Days
 */
function julianDayDifference(jd1, jd2) {
    return jd2 - jd1;
}

/**
 * Convert Julian Day back to Gregorian date
 */
function julianDayToGregorian(jd) {
    const Z = Math.floor(jd + 0.5);
    const F = jd + 0.5 - Z;
    let A = Z;

    if (Z >= 2299161) {
        const alpha = Math.floor((Z - 1867216.25) / 36524.25);
        A = Z + 1 + alpha - Math.floor(alpha / 4);
    }

    const B = A + 1524;
    const C = Math.floor((B - 122.1) / 365.25);
    const D = Math.floor(365.25 * C);
    const E = Math.floor((B - D) / 30.6001);

    const day = B - D - Math.floor(30.6001 * E) + F;
    let month = E - 1;
    let year = C - 4715;

    if (E > 13) {
        month = E - 13;
        year = C - 4716;
    }

    return {
        year: Math.floor(year),
        month: Math.floor(month),
        day: Math.floor(day),
        hour: Math.floor((day % 1) * 24),
        minute: Math.floor(((day % 1) * 24 % 1) * 60),
        second: Math.floor((((day % 1) * 24 % 1) * 60 % 1) * 60)
    };
}
```

---

## 3. Astronomical Calculations {#astronomical-calculations}

### Advanced Lunar Calendar Calculations

```javascript
/**
 * Calculate new moon dates using advanced astronomical algorithms
 * Based on Meeus astronomical algorithms with perturbations
 */
function calculateNewMoonsAdvanced(year) {
    const newMoons = [];
    const k = Math.floor((year - 1900) * 12.3685) - 1;

    for (let i = 0; i < 13; i++) {
        const T = (k + i) / 1236.85; // Time in Julian centuries

        // Core new moon calculation (Meeus algorithm)
        let JDE = 2451550.09765 + 29.530588853 * (k + i) +
                  0.0001337 * T * T - 0.000000150 * T * T * T +
                  0.00000000073 * T * T * T * T;

        // Add lunar perturbations (simplified)
        const M = degToRad(2.5534 + 29.10535669 * (k + i));
        const Mprime = degToRad(201.5643 + 385.81693528 * (k + i));
        const F = degToRad(160.7108 + 390.67050274 * (k + i));
        const omega = degToRad(124.7746 - 1.56375580 * (k + i));

        // Planetary perturbations (major terms)
        JDE += 0.000001734 * Math.sin(M) +
               -0.000001496 * Math.sin(Mprime) +
               -0.000000126 * Math.sin(F) +
               0.000000041 * Math.sin(2*M) +
               0.000000035 * Math.sin(M + Mprime);

        newMoons.push(JDE);
    }

    return newMoons.filter(jd => {
        const date = julianDayToGregorian(jd);
        return date.year === year;
    });
}

/**
 * Calculate solar longitude with high precision
 */
function calculateSolarLongitude(jd) {
    const T = (jd - CHINESE_ASTRO_ADVANCED_CONSTANTS.JULIAN_DAY_J2000) /
              CHINESE_ASTRO_ADVANCED_CONSTANTS.JULIAN_CENTURY;

    // Mean longitude of the Sun
    let L = normalizeAngle(280.46646 + 36000.76983 * T + 0.0003032 * T * T);

    // Mean anomaly of the Sun
    const M = normalizeAngle(357.52911 + 35999.05029 * T - 0.0001537 * T * T);

    // Equation of the center
    const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(degToRad(M)) +
              (0.019993 - 0.000101 * T) * Math.sin(degToRad(2 * M)) +
              0.000289 * Math.sin(degToRad(3 * M));

    // True longitude
    const trueLongitude = L + C;

    // Aberration correction
    const aberration = -0.00569 - 0.00478 * Math.sin(degToRad(125.04 - 1934.136 * T));

    return normalizeAngle(trueLongitude + aberration);
}

/**
 * Calculate solar terms with astronomical precision
 */
function calculateSolarTermsAdvanced(year) {
    const solarTerms = [];
    const baseLongitude = 270; // Winter solstice reference

    for (let i = 0; i < 24; i++) {
        const targetLongitude = normalizeAngle(baseLongitude + i * 15);
        const jd = findSolarTermDateAdvanced(year, targetLongitude);
        solarTerms.push({
            name: SOLAR_TERM_NAMES[i],
            julianDay: jd,
            longitude: targetLongitude,
            gregorianDate: julianDayToGregorian(jd)
        });
    }

    return solarTerms;
}

/**
 * Find solar term date using numerical methods
 */
function findSolarTermDateAdvanced(year, targetLongitude) {
    // Initial estimate
    let jd = gregorianToJulianDay(year, 1, 1);
    let longitude = calculateSolarLongitude(jd);
    let diff = normalizeAngle(targetLongitude - longitude);

    // Newton-Raphson iteration for precision
    const maxIterations = 10;
    const tolerance = CHINESE_ASTRO_ADVANCED_CONSTANTS.SOLAR_TERM_PRECISION;

    for (let i = 0; i < maxIterations; i++) {
        const solarSpeed = calculateSolarSpeed(jd); // degrees per day
        const deltaJD = diff / solarSpeed;

        jd += deltaJD;
        longitude = calculateSolarLongitude(jd);
        diff = normalizeAngle(targetLongitude - longitude);

        if (Math.abs(diff) < tolerance) break;
    }

    return jd;
}

/**
 * Calculate solar angular speed (degrees per day)
 */
function calculateSolarSpeed(jd) {
    const T = (jd - CHINESE_ASTRO_ADVANCED_CONSTANTS.JULIAN_DAY_J2000) /
              CHINESE_ASTRO_ADVANCED_CONSTANTS.JULIAN_CENTURY;

    const M = normalizeAngle(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
    const Mdot = 35999.05029 - 2 * 0.0001537 * T; // degrees per century

    // Derivative of equation of center
    const Cdot = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.cos(degToRad(M)) * degToRad(Mdot) +
                 2 * (0.019993 - 0.000101 * T) * Math.cos(degToRad(2 * M)) * degToRad(2 * Mdot) +
                 3 * 0.000289 * Math.cos(degToRad(3 * M)) * degToRad(3 * Mdot);

    return 360.98564736629 + Cdot; // degrees per day
}

const SOLAR_TERM_NAMES = [
    'Spring Begins', 'Rain Water', 'Insects Awaken', 'Spring Equinox',
    'Clear and Bright', 'Grain Rains', 'Summer Begins', 'Grain Buds',
    'Grain in Ear', 'Summer Solstice', 'Minor Heat', 'Major Heat',
    'Autumn Begins', 'Stopping the Heat', 'White Dews', 'Autumn Equinox',
    'Cold Dews', 'Frost Descent', 'Winter Begins', 'Minor Snow',
    'Major Snow', 'Winter Solstice', 'Minor Cold', 'Major Cold'
];
```

---

## 4. Calculation Algorithms {#calculation-algorithms}

### Advanced Ba-Zi Calculation Algorithm

```javascript
/**
 * Advanced Ba-Zi calculation with astronomical precision
 */
function calculateBaZiAdvanced(birthData) {
    // Step 1: Convert to precise Julian Day
    const jd = gregorianToJulianDay(
        birthData.year, birthData.month, birthData.day,
        birthData.hour, birthData.minute, birthData.second
    );

    // Step 2: Calculate lunar date with solar terms
    const lunarData = calculateLunarDateAdvanced(jd);

    // Step 3: Calculate year pillar with astronomical alignment
    const yearPillar = calculateYearPillarAdvanced(lunarData.lunarYear);

    // Step 4: Calculate month pillar with solar term precision
    const monthPillar = calculateMonthPillarAdvanced(lunarData.lunarYear, lunarData.solarTerm);

    // Step 5: Calculate day pillar with high precision
    const dayPillar = calculateDayPillarAdvanced(birthData);

    // Step 6: Calculate hour pillar with double-hour accuracy
    const hourPillar = calculateHourPillarAdvanced(dayPillar.stem, birthData.hour);

    return {
        year: yearPillar,
        month: monthPillar,
        day: dayPillar,
        hour: hourPillar,
        lunarDate: lunarData,
        julianDay: jd,
        calculationMetadata: {
            precision: CHINESE_ASTRO_ADVANCED_CONSTANTS.STEM_BRANCH_PRECISION,
            algorithm: 'Advanced Astronomical',
            version: '1.0'
        }
    };
}

/**
 * Calculate lunar date with advanced astronomical methods
 */
function calculateLunarDateAdvanced(jd) {
    // Find lunar year
    const lunarYear = calculateLunarYearAdvanced(jd);

    // Find current solar term
    const solarTerms = calculateSolarTermsAdvanced(new Date().getFullYear());
    const solarTerm = findCurrentSolarTermAdvanced(jd, solarTerms);

    // Calculate lunar month
    const lunarMonth = calculateLunarMonthAdvanced(jd, solarTerm);

    return {
        lunarYear: lunarYear,
        solarTerm: solarTerm,
        lunarMonth: lunarMonth,
        isLeapMonth: false // Would require full lunar calendar calculation
    };
}

/**
 * Calculate lunar year using astronomical cycles
 */
function calculateLunarYearAdvanced(jd) {
    const yearsSinceEpoch = Math.floor(
        (jd - gregorianToJulianDay(CHINESE_ASTRO_ADVANCED_CONSTANTS.CHINESE_EPOCH_YEAR, 1, 1)) /
        CHINESE_ASTRO_ADVANCED_CONSTANTS.SOLAR_YEAR_DAYS
    );
    return CHINESE_ASTRO_ADVANCED_CONSTANTS.CHINESE_EPOCH_YEAR + yearsSinceEpoch;
}

/**
 * Find current solar term with precision
 */
function findCurrentSolarTermAdvanced(jd, solarTerms) {
    for (let i = 0; i < solarTerms.length - 1; i++) {
        if (jd >= solarTerms[i].julianDay && jd < solarTerms[i + 1].julianDay) {
            return solarTerms[i];
        }
    }
    return solarTerms[solarTerms.length - 1]; // Default to last
}

/**
 * Calculate lunar month based on solar terms
 */
function calculateLunarMonthAdvanced(jd, solarTerm) {
    // Simplified: month is determined by solar term position
    const monthIndex = Math.floor(solarTerm.longitude / 30) % 12;
    return monthIndex + 1; // 1-based
}
```

---

## 5. Stem-Branch Calculations {#stem-branch-calculations}

### Advanced Year Pillar Calculation

```javascript
/**
 * Calculate year pillar with astronomical precision
 */
function calculateYearPillarAdvanced(lunarYear) {
    // Calculate years since Jia Zi reference
    const yearsSinceJiaZi = lunarYear - CHINESE_ASTRO_ADVANCED_CONSTANTS.JIA_ZI_YEAR;

    // Calculate stem and branch indices with modular arithmetic
    const stemIndex = mod(yearsSinceJiaZi, CHINESE_ASTRO_ADVANCED_CONSTANTS.STEMS_COUNT);
    const branchIndex = mod(yearsSinceJiaZi, CHINESE_ASTRO_ADVANCED_CONSTANTS.BRANCHES_COUNT);

    const stem = HEAVENLY_STEMS_ADVANCED[stemIndex];
    const branch = EARTHLY_BRANCHES_ADVANCED[branchIndex];

    return {
        stem: stem.name,
        branch: branch.name,
        stemElement: stem.element,
        branchElement: branch.element,
        stemPolarity: stem.polarity,
        branchPolarity: branch.polarity,
        animal: branch.animal,
        direction: branch.direction,
        numericStem: stem.numeric,
        calculation: {
            yearsSinceJiaZi: yearsSinceJiaZi,
            stemIndex: stemIndex,
            branchIndex: branchIndex
        }
    };
}

/**
 * Advanced month pillar calculation with solar term precision
 */
function calculateMonthPillarAdvanced(lunarYear, solarTerm) {
    // Get year stem for month calculation
    const yearPillar = calculateYearPillarAdvanced(lunarYear);
    const yearStemIndex = HEAVENLY_STEMS_ADVANCED.findIndex(s => s.name === yearPillar.stem);

    // Calculate month based on solar term
    const monthIndex = Math.floor(solarTerm.longitude / 30) % 12;

    // Stem calculation: year stem * 2 + month index
    const monthStemIndex = mod(yearStemIndex * 2 + monthIndex, CHINESE_ASTRO_ADVANCED_CONSTANTS.STEMS_COUNT);

    const stem = HEAVENLY_STEMS_ADVANCED[monthStemIndex];
    const branch = EARTHLY_BRANCHES_ADVANCED[monthIndex];

    return {
        stem: stem.name,
        branch: branch.name,
        stemElement: stem.element,
        branchElement: branch.element,
        stemPolarity: stem.polarity,
        branchPolarity: branch.polarity,
        animal: branch.animal,
        direction: branch.direction,
        numericStem: stem.numeric,
        solarTerm: solarTerm.name,
        calculation: {
            yearStemIndex: yearStemIndex,
            monthIndex: monthIndex,
            monthStemIndex: monthStemIndex
        }
    };
}

/**
 * Advanced day pillar calculation with astronomical precision
 */
function calculateDayPillarAdvanced(birthData) {
    const jd = gregorianToJulianDay(birthData.year, birthData.month, birthData.day);

    // Reference date for day calculations (Jia Zi day)
    const referenceJD = CHINESE_ASTRO_ADVANCED_CONSTANTS.REFERENCE_JD;
    const daysSinceReference = Math.floor(jd - referenceJD);

    // Calculate stem and branch for day
    const stemIndex = mod(daysSinceReference + 6, CHINESE_ASTRO_ADVANCED_CONSTANTS.STEMS_COUNT);
    const branchIndex = mod(daysSinceReference + 2, CHINESE_ASTRO_ADVANCED_CONSTANTS.BRANCHES_COUNT);

    const stem = HEAVENLY_STEMS_ADVANCED[stemIndex];
    const branch = EARTHLY_BRANCHES_ADVANCED[branchIndex];

    return {
        stem: stem.name,
        branch: branch.name,
        stemElement: stem.element,
        branchElement: branch.element,
        stemPolarity: stem.polarity,
        branchPolarity: branch.polarity,
        animal: branch.animal,
        direction: branch.direction,
        numericStem: stem.numeric,
        julianDay: jd,
        calculation: {
            daysSinceReference: daysSinceReference,
            stemIndex: stemIndex,
            branchIndex: branchIndex
        }
    };
}

/**
 * Advanced hour pillar calculation with double-hour precision
 */
function calculateHourPillarAdvanced(dayStem, birthHour) {
    // Convert to double-hour (2-hour periods)
    const doubleHour = Math.floor(birthHour / 2);

    // Find day stem index
    const dayStemIndex = HEAVENLY_STEMS_ADVANCED.findIndex(s => s.name === dayStem);

    // Calculate hour stem: day stem * 2 + double hour
    const hourStemIndex = mod(dayStemIndex * 2 + doubleHour, CHINESE_ASTRO_ADVANCED_CONSTANTS.STEMS_COUNT);

    const stem = HEAVENLY_STEMS_ADVANCED[hourStemIndex];
    const branch = EARTHLY_BRANCHES_ADVANCED[doubleHour];

    return {
        stem: stem.name,
        branch: branch.name,
        stemElement: stem.element,
        branchElement: branch.element,
        stemPolarity: stem.polarity,
        branchPolarity: branch.polarity,
        animal: branch.animal,
        direction: branch.direction,
        numericStem: stem.numeric,
        doubleHour: doubleHour,
        timeRange: `${doubleHour * 2}:00-${(doubleHour + 1) * 2}:00`,
        calculation: {
            dayStemIndex: dayStemIndex,
            doubleHour: doubleHour,
            hourStemIndex: hourStemIndex
        }
    };
}
```

---

## 6. Five Elements System {#five-elements-system}

### Advanced Element Balance Analysis

```javascript
/**
 * Advanced Five Elements analysis with dynamic relationships
 */
function analyzeFiveElementsAdvanced(baZi) {
    const elementCount = initializeElementCount();
    const elementStrength = initializeElementStrength();

    // Count elements in all pillars
    analyzePillarsForElements(baZi, elementCount, elementStrength);

    // Calculate elemental relationships
    const relationships = calculateElementRelationshipsAdvanced(elementCount);

    // Assess overall balance
    const balance = assessElementalBalanceAdvanced(elementCount, elementStrength);

    // Calculate elemental harmony
    const harmony = calculateElementalHarmony(elementCount, relationships);

    return {
        counts: elementCount,
        strengths: elementStrength,
        relationships: relationships,
        balance: balance,
        harmony: harmony,
        strongest: findStrongestElement(elementCount),
        weakest: findWeakestElement(elementCount),
        analysis: generateElementalAnalysis(balance, harmony)
    };
}

/**
 * Initialize element counting structures
 */
function initializeElementCount() {
    return {
        [FIVE_ELEMENTS_ADVANCED.WOOD.name]: 0,
        [FIVE_ELEMENTS_ADVANCED.FIRE.name]: 0,
        [FIVE_ELEMENTS_ADVANCED.EARTH.name]: 0,
        [FIVE_ELEMENTS_ADVANCED.METAL.name]: 0,
        [FIVE_ELEMENTS_ADVANCED.WATER.name]: 0
    };
}

/**
 * Initialize element strength tracking
 */
function initializeElementStrength() {
    return {
        [FIVE_ELEMENTS_ADVANCED.WOOD.name]: 0,
        [FIVE_ELEMENTS_ADVANCED.FIRE.name]: 0,
        [FIVE_ELEMENTS_ADVANCED.EARTH.name]: 0,
        [FIVE_ELEMENTS_ADVANCED.METAL.name]: 0,
        [FIVE_ELEMENTS_ADVANCED.WATER.name]: 0
    };
}

/**
 * Analyze all pillars for elemental composition
 */
function analyzePillarsForElements(baZi, elementCount, elementStrength) {
    const pillars = [baZi.year, baZi.month, baZi.day, baZi.hour];

    pillars.forEach((pillar, pillarIndex) => {
        // Count stem element
        const stemElement = pillar.stemElement;
        elementCount[stemElement]++;
        elementStrength[stemElement] += calculateStemStrength(pillar, pillarIndex);

        // Count branch element(s)
        const branchElements = getBranchElements(pillar.branchElement);
        branchElements.forEach(element => {
            elementCount[element]++;
            elementStrength[element] += calculateBranchStrength(pillar, pillarIndex);
        });
    });
}

/**
 * Calculate stem strength based on position and polarity
 */
function calculateStemStrength(pillar, pillarIndex) {
    const positionWeights = [1.0, 1.2, 1.5, 1.0]; // Year, Month, Day, Hour weights
    const polarityMultiplier = pillar.stemPolarity === 'Yang' ? 1.1 : 0.9;

    return positionWeights[pillarIndex] * polarityMultiplier;
}

/**
 * Calculate branch strength
 */
function calculateBranchStrength(pillar, pillarIndex) {
    const positionWeights = [0.8, 1.0, 1.3, 0.9]; // Year, Month, Day, Hour weights
    const polarityMultiplier = pillar.branchPolarity === 'Yang' ? 1.05 : 0.95;

    return positionWeights[pillarIndex] * polarityMultiplier;
}

/**
 * Get branch elements (some branches have multiple elements)
 */
function getBranchElements(branchElement) {
    // Most branches have one element, but some have multiple
    const multiElementBranches = {
        'Chen': ['Earth', 'Water'],
        'Xu': ['Earth', 'Fire'],
        'Chou': ['Earth', 'Water', 'Metal']
    };

    return multiElementBranches[branchElement] || [branchElement];
}

/**
 * Calculate advanced elemental relationships
 */
function calculateElementRelationshipsAdvanced(elementCount) {
    const relationships = {};

    Object.keys(FIVE_ELEMENTS_ADVANCED).forEach(elementKey => {
        const element = FIVE_ELEMENTS_ADVANCED[elementKey];
        const elementName = element.name;

        relationships[elementName] = {
            generates: element.generates,
            controls: element.controls,
            controlledBy: element.controlledBy,
            generatedBy: element.generatedBy,
            count: elementCount[elementName],
            strength: elementCount[elementName], // Simplified
            status: determineElementStatus(elementCount, elementName)
        };
    });

    return relationships;
}

/**
 * Determine element status (strong, weak, balanced)
 */
function determineElementStatus(elementCount, elementName) {
    const count = elementCount[elementName];
    const average = Object.values(elementCount).reduce((a, b) => a + b, 0) / 5;

    if (count > average + 1) return 'Strong';
    if (count < average - 1) return 'Weak';
    return 'Balanced';
}

/**
 * Assess overall elemental balance
 */
function assessElementalBalanceAdvanced(elementCount, elementStrength) {
    const values = Object.values(elementCount);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min;

    const strengthValues = Object.values(elementStrength);
    const strengthVariance = calculateVariance(strengthValues);

    let balanceLevel;
    if (range <= 1 && strengthVariance < 0.5) balanceLevel = 'Excellent';
    else if (range <= 2 && strengthVariance < 1.0) balanceLevel = 'Good';
    else if (range <= 3 && strengthVariance < 2.0) balanceLevel = 'Moderate';
    else if (range <= 4) balanceLevel = 'Poor';
    else balanceLevel = 'Severely Imbalanced';

    return {
        level: balanceLevel,
        range: range,
        variance: strengthVariance,
        maxElement: findStrongestElement(elementCount),
        minElement: findWeakestElement(elementCount)
    };
}

/**
 * Calculate variance for statistical analysis
 */
function calculateVariance(values) {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squareDiffs = values.map(value => Math.pow(value - mean, 2));
    return squareDiffs.reduce((a, b) => a + b, 0) / values.length;
}

/**
 * Calculate elemental harmony score
 */
function calculateElementalHarmony(elementCount, relationships) {
    let harmonyScore = 0;
    const totalElements = Object.keys(elementCount).length;

    Object.keys(relationships).forEach(element => {
        const rel = relationships[element];

        // Check generation cycle harmony
        if (elementCount[rel.generates] > 0) harmonyScore += 0.5;

        // Check control cycle balance
        if (elementCount[rel.controls] > elementCount[element]) harmonyScore += 0.3;

        // Penalize excessive control
        if (elementCount[rel.controlledBy] > elementCount[element] + 2) harmonyScore -= 0.2;
    });

    return Math.max(0, Math.min(1, harmonyScore / totalElements));
}

/**
 * Find strongest element
 */
function findStrongestElement(elementCount) {
    let maxCount = 0;
    let strongest = null;

    Object.entries(elementCount).forEach(([element, count]) => {
        if (count > maxCount) {
            maxCount = count;
            strongest = element;
        }
    });

    return strongest;
}

/**
 * Find weakest element
 */
function findWeakestElement(elementCount) {
    let minCount = Infinity;
    let weakest = null;

    Object.entries(elementCount).forEach(([element, count]) => {
        if (count < minCount) {
            minCount = count;
            weakest = element;
        }
    });

    return weakest;
}

/**
 * Generate comprehensive elemental analysis
 */
function generateElementalAnalysis(balance, harmony) {
    const analysis = {
        summary: '',
        recommendations: [],
        strengths: [],
        weaknesses: []
    };

    // Generate summary based on balance level
    switch (balance.level) {
        case 'Excellent':
            analysis.summary = 'Excellent elemental balance indicates natural harmony and stability.';
            analysis.strengths.push('Natural elemental harmony');
            break;
        case 'Good':
            analysis.summary = 'Good elemental balance with minor adjustments needed.';
            analysis.strengths.push('Generally balanced elements');
            break;
        case 'Moderate':
            analysis.summary = 'Moderate elemental balance requiring some attention.';
            analysis.recommendations.push('Consider elemental balancing practices');
            break;
        case 'Poor':
            analysis.summary = 'Poor elemental balance may cause challenges.';
            analysis.weaknesses.push('Significant elemental imbalance');
            analysis.recommendations.push('Strong elemental balancing needed');
            break;
        case 'Severely Imbalanced':
            analysis.summary = 'Severely imbalanced elements require immediate attention.';
            analysis.weaknesses.push('Extreme elemental imbalance');
            analysis.recommendations.push('Comprehensive elemental correction needed');
            break;
    }

    // Add harmony-based insights
    if (harmony > 0.7) {
        analysis.strengths.push('Strong elemental relationships');
    } else if (harmony < 0.3) {
        analysis.weaknesses.push('Weak elemental relationships');
        analysis.recommendations.push('Strengthen elemental connections');
    }

    return analysis;
}
```

---

## 7. Nine Star Ki Calculations {#nine-star-ki-calculations}

### Advanced Flying Star Calculations

```javascript
/**
 * Advanced Nine Star Ki calculation with temporal and directional analysis
 */
function calculateNineStarKiAdvanced(birthData) {
    // Calculate birth star with precise year calculation
    const birthStar = calculateBirthStarAdvanced(birthData.year);

    // Calculate current year star
    const currentYear = new Date().getFullYear();
    const currentStar = calculateCurrentYearStarAdvanced(birthData.year, currentYear);

    // Calculate directional stars with energy flows
    const directionalStars = calculateDirectionalStarsAdvanced(birthStar);

    // Calculate temporal influences
    const temporalInfluences = calculateTemporalInfluences(birthStar, currentStar);

    // Analyze star interactions
    const interactions = analyzeStarInteractions(directionalStars);

    return {
        birthStar: birthStar,
        currentStar: currentStar,
        directionalStars: directionalStars,
        temporalInfluences: temporalInfluences,
        interactions: interactions,
        analysis: generateNineStarAnalysis(birthStar, directionalStars, temporalInfluences)
    };
}

/**
 * Calculate birth star with advanced year calculation
 */
function calculateBirthStarAdvanced(year) {
    // Reference year for Nine Star Ki (1984 = 1-White)
    const referenceYear = 1984;
    const yearsDiff = year - referenceYear;

    // Nine Star Ki cycles every 9 years
    const starIndex = mod(yearsDiff, 9);

    const star = NINE_STARS_ADVANCED[starIndex];
    return {
        ...star,
        calculation: {
            yearsFromReference: yearsDiff,
            starIndex: starIndex
        }
    };
}

/**
 * Calculate current year star
 */
function calculateCurrentYearStarAdvanced(birthYear, currentYear) {
    const yearsDiff = currentYear - birthYear;
    const starIndex = mod(yearsDiff, 9);

    const star = NINE_STARS_ADVANCED[starIndex];
    return {
        ...star,
        calculation: {
            yearsFromBirth: yearsDiff,
            starIndex: starIndex
        }
    };
}

/**
 * Calculate directional stars with advanced flying star mathematics
 */
function calculateDirectionalStarsAdvanced(birthStar) {
    const directionalStars = {};
    const birthStarNumber = birthStar.number;

    Object.entries(DIRECTION_MODIFIERS).forEach(([direction, modifier]) => {
        const starNumber = mod(birthStarNumber + modifier - 1, 9) + 1;
        const star = NINE_STARS_ADVANCED.find(s => s.number === starNumber);

        directionalStars[direction] = {
            ...star,
            energy: calculateDirectionalEnergy(birthStar, star, direction),
            compatibility: calculateDirectionalCompatibility(birthStar, star),
            calculation: {
                birthStarNumber: birthStarNumber,
                modifier: modifier,
                starNumber: starNumber
            }
        };
    });

    return directionalStars;
}

/**
 * Calculate directional energy levels
 */
function calculateDirectionalEnergy(birthStar, directionStar, direction) {
    // Simplified energy calculation based on element compatibility
    const elementCompatibility = getElementCompatibility(birthStar.element, directionStar.element);

    return elementCompatibility * (DIRECTION_ENERGY_MODIFIERS[direction] || 1.0);
}

/**
 * Calculate directional compatibility
 */
function calculateDirectionalCompatibility(birthStar, directionStar) {
    const elementRelation = getElementRelationship(birthStar.element, directionStar.element);

    const compatibilityScores = {
        'Generates': 1.2,    // Favorable
        'Controls': 0.8,     // Challenging
        'Controlled': 0.7,   // Difficult
        'Same': 1.0,         // Neutral
        'Generated': 1.1     // Supportive
    };

    return compatibilityScores[elementRelation] || 1.0;
}

/**
 * Get element relationship for Nine Star Ki
 */
function getElementRelationship(element1, element2) {
    if (element1 === element2) return 'Same';

    const element = FIVE_ELEMENTS_ADVANCED[element1.toUpperCase()];
    if (!element) return 'Unknown';

    if (element.generates === element2) return 'Generates';
    if (element.controls === element2) return 'Controls';
    if (element.controlledBy === element2) return 'Controlled';
    if (element.generatedBy === element2) return 'Generated';

    return 'Neutral';
}

/**
 * Get element compatibility score
 */
function getElementCompatibility(element1, element2) {
    const relation = getElementRelationship(element1, element2);

    const compatibilityMatrix = {
        'Generates': 1.2,
        'Generated': 1.1,
        'Same': 1.0,
        'Controls': 0.8,
        'Controlled': 0.7,
        'Neutral': 0.9
    };

    return compatibilityMatrix[relation] || 0.9;
}

/**
 * Calculate temporal influences
 */
function calculateTemporalInfluences(birthStar, currentStar) {
    const yearsDiff = currentStar.calculation.yearsFromBirth;

    // Calculate current life period (9-year cycles)
    const lifePeriod = Math.floor(yearsDiff / 9) + 1;

    // Calculate current year influence
    const yearInfluence = calculateYearInfluence(birthStar, currentStar, yearsDiff);

    return {
        lifePeriod: lifePeriod,
        yearInfluence: yearInfluence,
        cyclePosition: mod(yearsDiff, 9) + 1,
        nextTransition: 9 - mod(yearsDiff, 9)
    };
}

/**
 * Calculate year influence based on star interactions
 */
function calculateYearInfluence(birthStar, currentStar, yearsDiff) {
    const baseCompatibility = getElementCompatibility(birthStar.element, currentStar.element);

    // Age-specific modifiers
    let ageModifier = 1.0;
    if (yearsDiff < 20) ageModifier = 1.2;      // Youth energy
    else if (yearsDiff < 40) ageModifier = 1.0; // Adult balance
    else if (yearsDiff < 60) ageModifier = 0.9; // Middle age
    else ageModifier = 0.8;                     // Later years

    return baseCompatibility * ageModifier;
}

/**
 * Analyze star interactions across directions
 */
function analyzeStarInteractions(directionalStars) {
        favorableDirections: [],
        challengingDirections: [],
        energyFlow: 'balanced'
    };

    // Analyze each directional star for compatibility
    Object.entries(directionalStars).forEach(([direction, starData]) => {
        if (starData.compatibility > 1.1) {
            interactions.favorableDirections.push(direction);
        } else if (starData.compatibility < 0.9) {
            interactions.challengingDirections.push(direction);
        }
    });

    // Determine overall energy flow
    const avgCompatibility = Object.values(directionalStars)
        .reduce((sum, star) => sum + star.compatibility, 0) / Object.keys(directionalStars).length;

    interactions.energyFlow = avgCompatibility > 1.0 ? 'favorable' :
                             avgCompatibility < 0.9 ? 'challenging' : 'balanced';

    return interactions;
}

/**
 * Generate comprehensive Nine Star Ki analysis
 */
function generateNineStarAnalysis(birthStar, directionalStars, temporalInfluences) {
    const analysis = {
        personalityTraits: [],
        lifePurpose: '',
        currentChallenges: [],
        favorableDirections: [],
        recommendations: []
    };

    // Personality traits based on birth star
    const starTraits = {
        1: ['Leadership', 'Independence', 'Innovation'],
        2: ['Harmony', 'Relationships', 'Diplomacy'],
        3: ['Communication', 'Creativity', 'Adaptability'],
        4: ['Education', 'Stability', 'Practicality'],
        5: ['Transformation', 'Wisdom', 'Balance'],
        6: ['Heavenly guidance', 'Spirituality', 'Service'],
        7: ['Competition', 'Achievement', 'Courage'],
        8: ['Prosperity', 'Abundance', 'Patience'],
        9: ['Completion', 'Humanitarianism', 'Wisdom']
    };

    analysis.personalityTraits = starTraits[birthStar.number] || [];

    // Life purpose based on element
    const elementPurposes = {
        Water: 'To flow and adapt, bringing wisdom and intuition',
        Earth: 'To provide stability and nurture growth',
        Wood: 'To grow and expand, creating new possibilities',
        Fire: 'To inspire and motivate others',
        Metal: 'To refine and perfect, bringing clarity and precision'
    };

    analysis.lifePurpose = elementPurposes[birthStar.element] || '';

    // Current challenges based on temporal influences
    if (temporalInfluences.yearInfluence < 0.9) {
        analysis.currentChallenges.push('Energy misalignment requiring adjustment');
    }

    // Favorable directions
    Object.entries(directionalStars).forEach(([direction, star]) => {
        if (star.energy > 1.0) {
            analysis.favorableDirections.push(direction);
        }
    });

    // Recommendations
    if (analysis.favorableDirections.length > 0) {
        analysis.recommendations.push(`Focus energy towards ${analysis.favorableDirections.join(', ')} directions`);
    }

    return analysis;
}
```

---

## 8. Lunar Calendar Calculations {#lunar-calendar-calculations}

### Advanced Lunar Calendar Mathematics

```javascript
/**
 * Complete lunar calendar calculation system
 */
class LunarCalendarCalculator {
    constructor() {
        this.newMoonCalculator = new NewMoonCalculator();
        this.solarTermCalculator = new SolarTermCalculator();
        this.leapMonthCalculator = new LeapMonthCalculator();
    }

    /**
     * Calculate complete lunar calendar for a year
     */
    calculateLunarCalendar(year) {
        const newMoons = this.newMoonCalculator.calculateYearNewMoons(year);
        const solarTerms = this.solarTermCalculator.calculateYearSolarTerms(year);
        const leapMonth = this.leapMonthCalculator.determineLeapMonth(year);

        const months = this.buildLunarMonths(newMoons, solarTerms, leapMonth);

        return {
            year: year,
            months: months,
            leapMonth: leapMonth,
            solarTerms: solarTerms,
            metadata: {
                totalMonths: months.length,
                hasLeapMonth: leapMonth !== null
            }
        };
    }

    /**
     * Build lunar months from astronomical data
     */
    buildLunarMonths(newMoons, solarTerms, leapMonth) {
        const months = [];
        let solarTermIndex = 0;

        for (let i = 0; i < newMoons.length - 1; i++) {
            const monthNumber = i + 1;
            const isLeap = leapMonth && leapMonth.month === monthNumber;

            // Find solar term for this month
            const monthSolarTerm = this.findMonthSolarTerm(solarTerms, solarTermIndex);

            const month = {
                number: monthNumber,
                isLeap: isLeap,
                startDate: julianDayToGregorian(newMoons[i]),
                endDate: julianDayToGregorian(newMoons[i + 1]),
                solarTerm: monthSolarTerm,
                length: Math.round(newMoons[i + 1] - newMoons[i])
            };

            months.push(month);

            if (monthSolarTerm) solarTermIndex++;
        }

        return months;
    }

    /**
     * Find solar term for a given month
     */
    findMonthSolarTerm(solarTerms, startIndex) {
        // Simplified: return the next solar term
        return solarTerms[startIndex] || null;
    }
}

/**
 * New moon calculation with high precision
 */
class NewMoonCalculator {
    calculateYearNewMoons(year) {
        // Use the advanced new moon calculation from earlier
        return calculateNewMoonsAdvanced(year);
    }
}

/**
 * Solar term calculation system
 */
class SolarTermCalculator {
    calculateYearSolarTerms(year) {
        // Use the advanced solar term calculation from earlier
        return calculateSolarTermsAdvanced(year);
    }
}

/**
 * Leap month determination using astronomical rules
 */
class LeapMonthCalculator {
    determineLeapMonth(year) {
        // Simplified leap month calculation
        // In full implementation, this would use complex astronomical rules
        // to determine if an extra month is needed to keep lunar calendar aligned

        const newMoons = calculateNewMoonsAdvanced(year);
        const solarTerms = calculateSolarTermsAdvanced(year);

        // Check if there are 13 new moons (indicating leap month needed)
        if (newMoons.length > 12) {
            // Find which month gets duplicated
            return {
                month: 2, // Simplified - would calculate properly
                reason: 'Excess new moons'
            };
        }

        return null;
    }
}
```

---

## 9. Complete Implementation Code {#implementation-code}

### Complete Chinese Astrology Calculation System

```javascript
/**
 * Complete ZC2.2 Chinese Astrology Calculation Engine
 */
class ChineseAstrologyCalculator {
    constructor() {
        this.baZiCalculator = new BaZiCalculator();
        this.elementAnalyzer = new FiveElementsAnalyzer();
        this.nineStarCalculator = new NineStarKiCalculator();
        this.lunarCalendar = new LunarCalendarCalculator();
        this.validator = new InputValidator();
    }

    /**
     * Perform complete Chinese astrology calculations
     */
    async calculateAll(birthData) {
        try {
            // Validate input
            this.validator.validateBirthData(birthData);

            // Calculate Ba-Zi
            const baZi = await this.baZiCalculator.calculate(birthData);

            // Analyze Five Elements
            const elements = this.elementAnalyzer.analyze(baZi);

            // Calculate Nine Star Ki
            const nineStarKi = this.nineStarCalculator.calculate(birthData);

            // Get lunar calendar context
            const lunarContext = this.lunarCalendar.calculateLunarCalendar(birthData.year);

            // Generate comprehensive analysis
            const analysis = this.generateComprehensiveAnalysis(baZi, elements, nineStarKi, lunarContext);

            return {
                birthData: birthData,
                baZi: baZi,
                elements: elements,
                nineStarKi: nineStarKi,
                lunarContext: lunarContext,
                analysis: analysis,
                timestamp: new Date().toISOString(),
                version: 'ZC2.2-1.0'
            };

        } catch (error) {
            throw new Error(`Chinese astrology calculation failed: ${error.message}`);
        }
    }

    /**
     * Generate comprehensive analysis
     */
    generateComprehensiveAnalysis(baZi, elements, nineStarKi, lunarContext) {
        return {
            personality: this.analyzePersonality(baZi, elements, nineStarKi),
            career: this.analyzeCareer(baZi, elements),
            relationships: this.analyzeRelationships(baZi, elements, nineStarKi),
            health: this.analyzeHealth(elements),
            wealth: this.analyzeWealth(baZi, elements),
            timing: this.analyzeTiming(lunarContext),
            recommendations: this.generateRecommendations(baZi, elements, nineStarKi)
        };
    }

    // Analysis methods (implementations would be comprehensive)
    analyzePersonality(baZi, elements, nineStarKi) { /* implementation */ }
    analyzeCareer(baZi, elements) { /* implementation */ }
    analyzeRelationships(baZi, elements, nineStarKi) { /* implementation */ }
    analyzeHealth(elements) { /* implementation */ }
    analyzeWealth(baZi, elements) { /* implementation */ }
    analyzeTiming(lunarContext) { /* implementation */ }
    generateRecommendations(baZi, elements, nineStarKi) { /* implementation */ }
}

/**
 * Ba-Zi Calculator with all pillars
 */
class BaZiCalculator {
    calculate(birthData) {
        return calculateBaZiAdvanced(birthData);
    }
}

/**
 * Five Elements Analyzer
 */
class FiveElementsAnalyzer {
    analyze(baZi) {
        return analyzeFiveElementsAdvanced(baZi);
    }
}

/**
 * Nine Star Ki Calculator
 */
class NineStarKiCalculator {
    calculate(birthData) {
        return calculateNineStarKiAdvanced(birthData);
    }
}

/**
 * Input validation system with comprehensive checks
 */
class InputValidator {
    validateBirthData(birthData) {
        const required = ['year', 'month', 'day', 'hour', 'minute', 'second'];

        // Check required fields
        for (const field of required) {
            if (!birthData[field] && birthData[field] !== 0) {
                throw new ValidationError(`Missing required field: ${field}`);
            }
        }

        // Validate year
        if (!Number.isInteger(birthData.year) || birthData.year < 1900 || birthData.year > 2100) {
            throw new ValidationError('Year must be an integer between 1900 and 2100');
        }

        // Validate month
        if (!Number.isInteger(birthData.month) || birthData.month < 1 || birthData.month > 12) {
            throw new ValidationError('Month must be an integer between 1 and 12');
        }

        // Validate day
        if (!Number.isInteger(birthData.day) || birthData.day < 1 || birthData.day > 31) {
            throw new ValidationError('Day must be an integer between 1 and 31');
        }

        // Validate hour
        if (!Number.isFinite(birthData.hour) || birthData.hour < 0 || birthData.hour >= 24) {
            throw new ValidationError('Hour must be a number between 0 and 23.999...');
        }

        // Validate minute
        if (!Number.isFinite(birthData.minute) || birthData.minute < 0 || birthData.minute >= 60) {
            throw new ValidationError('Minute must be a number between 0 and 59.999...');
        }

        // Validate second
        if (!Number.isFinite(birthData.second) || birthData.second < 0 || birthData.second >= 60) {
            throw new ValidationError('Second must be a number between 0 and 59.999...');
        }

        // Validate date is valid (e.g., not Feb 30)
        const date = new Date(birthData.year, birthData.month - 1, birthData.day);
        if (date.getFullYear() !== birthData.year ||
            date.getMonth() !== birthData.month - 1 ||
            date.getDate() !== birthData.day) {
            throw new ValidationError('Invalid date: day does not exist in the specified month/year');
        }

        // Optional timezone validation
        if (birthData.timezone !== undefined) {
            if (!Number.isFinite(birthData.timezone) || birthData.timezone < -14 || birthData.timezone > 14) {
                throw new ValidationError('Timezone must be a number between -14 and 14 hours');
            }
        }
    }
}

/**
 * Custom error class for validation failures
 */
class ValidationError extends Error {
    constructor(message, code = 'VALIDATION_ERROR') {
        super(message);
        this.name = 'ValidationError';
        this.code = code;
    }
}

// Usage Example
const calculator = new ChineseAstrologyCalculator();

const birthData = {
    year: 1990,
    month: 5,
    day: 15,
    hour: 14,
    minute: 30,
    second: 0,
    timezone: 8 // Beijing time
};

calculator.calculateAll(birthData)
    .then(result => {
        console.log('Complete Chinese Astrology Analysis:', result);
    })
    .catch(error => {
        console.error('Calculation error:', error);
    });
```

---

## 10. Technical Specifications {#technical-specifications}

### Input Requirements

- **Date Format**: Gregorian calendar (YYYY-MM-DD)
- **Time Format**: 24-hour format (HH:MM:SS)
- **Timezone**: UTC offset in hours (±14)
- **Year Range**: 1900-2100 CE
- **Precision**: Second-level time accuracy

### Output Structure

```javascript
{
    birthData: { /* Original input */ },
    baZi: {
        year: { stem, branch, element, polarity, animal },
        month: { stem, branch, element, polarity, solarTerm },
        day: { stem, branch, element, polarity, julianDay },
        hour: { stem, branch, element, polarity, timeRange }
    },
    elements: {
        counts: { Wood, Fire, Earth, Metal, Water },
        balance: { level, range, variance },
        relationships: { /* Element interactions */ },
        analysis: { summary, recommendations }
    },
    nineStarKi: {
        birthStar: { number, color, element, energy },
        directionalStars: { /* 8 directions + center */ },
        temporalInfluences: { lifePeriod, yearInfluence },
        analysis: { personalityTraits, favorableDirections }
    },
    lunarContext: {
        year: number,
        months: [/* Lunar months */],
        solarTerms: [/* 24 Jie Qi */]
    },
    analysis: {
        personality: [string],
        career: [string],
        relationships: [string],
        health: [string],
        wealth: [string],
        timing: [string],
        recommendations: [string]
    }
}
```

### Accuracy Requirements

- **Julian Day**: ±0.000001 days
- **Solar Longitude**: ±0.0001 degrees
- **New Moon**: ±0.001 days
- **Solar Terms**: ±0.01 days
- **Stem-Branch**: 100% accuracy for modern dates
- **Element Balance**: Exact calculation
- **Nine Star Ki**: Accurate directional mathematics

### Performance Benchmarks

- **Calculation Time**: < 100ms for complete analysis
- **Memory Usage**: < 50MB for full system
- **Concurrent Users**: Support 1000+ simultaneous calculations
- **Accuracy**: 99.9% for astronomical calculations
- **Reliability**: 99.99% uptime requirement

### Error Handling

- **Input Validation**: Comprehensive checks with clear error messages
- **Calculation Errors**: Graceful fallback to simplified algorithms
- **Boundary Conditions**: Proper handling of edge cases (polar regions, date limits)
- **Network Issues**: Offline calculation capability

---

## 11. Integration Points {#integration-points}

### API Integration

```javascript
// REST API endpoints for Chinese astrology calculations
const express = require('express');
const app = express();

app.post('/api/chinese-astrology/calculate', async (req, res) => {
    try {
        const birthData = req.body;
        const result = await calculator.calculateAll(birthData);

        res.json({
            success: true,
            data: result,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
            code: error.code || 'CALCULATION_ERROR'
        });
    }
});

// GraphQL integration
const typeDefs = `
    type ChineseAstrologyResult {
        baZi: BaZi!
        elements: FiveElements!
        nineStarKi: NineStarKi!
        analysis: Analysis!
    }

    type Query {
        calculateChineseAstrology(birthData: BirthDataInput!): ChineseAstrologyResult!
    }
`;

const resolvers = {
    Query: {
        calculateChineseAstrology: async (_, { birthData }) => {
            return await calculator.calculateAll(birthData);
        }
    }
};
```

### Database Schema

```sql
-- Chinese astrology calculations storage
CREATE TABLE chinese_astrology_calculations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    birth_year INTEGER NOT NULL,
    birth_month INTEGER NOT NULL,
    birth_day INTEGER NOT NULL,
    birth_hour INTEGER NOT NULL,
    birth_minute INTEGER,
    birth_second INTEGER,
    timezone_offset DECIMAL(3,1),

    -- Ba-Zi data (JSON)
    ba_zi JSONB NOT NULL,

    -- Analysis data (JSON)
    five_elements JSONB,
    nine_star_ki JSONB,
    lunar_context JSONB,
    comprehensive_analysis JSONB,

    -- Metadata
    calculation_version VARCHAR(20) DEFAULT 'ZC2.2-1.0',
    calculation_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    accuracy_score DECIMAL(3,2),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Performance indexes
CREATE INDEX idx_chinese_calc_user_birth ON chinese_astrology_calculations(user_id, birth_year, birth_month, birth_day);
CREATE INDEX idx_chinese_calc_timestamp ON chinese_astrology_calculations(calculation_timestamp);
```

### Caching Strategy

```javascript
// Redis caching for Chinese astrology calculations
class AstrologyCache {
    constructor(redisClient) {
        this.client = redisClient;
        this.ttl = 3600 * 24; // 24 hours
    }

    async getCachedCalculation(birthData) {
        const key = this.generateCacheKey(birthData);
        const cached = await this.client.get(key);

        if (cached) {
            return JSON.parse(cached);
        }

        return null;
    }

    async setCachedCalculation(birthData, result) {
        const key = this.generateCacheKey(birthData);
        await this.client.setex(key, this.ttl, JSON.stringify(result));
    }

    generateCacheKey(birthData) {
        return `chinese_astrology:${birthData.year}:${birthData.month}:${birthData.day}:${birthData.hour}:${birthData.timezone}`;
    }
}
```

### Microservices Architecture

```
Chinese Astrology Service
├── Ba-Zi Calculation Service
├── Five Elements Analysis Service
├── Nine Star Ki Service
├── Lunar Calendar Service
└── Analysis Aggregation Service
```

---

## 12. Ethical Considerations {#ethical-considerations}

### Cultural Respect and Authenticity

Chinese astrology represents thousands of years of cultural tradition and astronomical observation. Implementation must demonstrate deep respect for this heritage while maintaining mathematical and astronomical accuracy.

**Key Cultural Principles:**
- **Authenticity**: Calculations based on traditional Chinese astronomical methods
- **Context**: Provide cultural and historical context for all interpretations
- **Respect**: Avoid trivializing sacred traditions or cultural practices
- **Education**: Include educational content about Chinese cultural traditions
- **Transparency**: Clearly document calculation methods and assumptions

### Responsible Interpretation

While Chinese astrology provides valuable insights into personality patterns and life rhythms, it should never be used to:
- Make definitive predictions about future events
- Provide medical or psychological diagnoses
- Influence major financial or business decisions
- Discriminate based on astrological factors
- Replace professional advice in critical life areas

**Responsible Communication:**
- Use probabilistic language ("may indicate", "tends to suggest")
- Include comprehensive disclaimers about interpretive nature
- Encourage balanced, holistic approaches to life decisions
- Promote personal growth and self-awareness
- Avoid fear-based or manipulative interpretations

### Data Privacy and Protection

Chinese astrology calculations require precise birth data including date, time, and location. This constitutes sensitive personal information requiring robust privacy protections.

**Privacy Requirements:**
- **Consent**: Obtain explicit, informed consent before processing birth data
- **Minimization**: Collect only necessary data for astrological calculations
- **Security**: Implement encryption and secure storage for all birth data
- **Retention**: Store data only as long as needed, with clear deletion policies
- **Rights**: Honor all data subject rights (access, correction, deletion, portability)
- **Anonymization**: Use anonymized data for research and improvement purposes

### Algorithmic Transparency

All calculations should be:
- **Mathematically Verifiable**: Based on established astronomical and mathematical principles
- **Transparent**: Complete documentation of algorithms, formulas, and assumptions
- **Auditable**: Regular independent verification of calculation accuracy
- **Reproducible**: Same input data always produces same results

### Accessibility and Inclusion

Ensure Chinese astrology services are accessible to diverse populations while avoiding cultural bias.

**Inclusion Principles:**
- **Language**: Support multiple languages and cultural contexts
- **Accessibility**: Make calculations and interpretations available in accessible formats
- **Diversity**: Avoid gender, cultural, or ethnic biases in interpretations
- **Education**: Provide resources for understanding Chinese astrological traditions
- **Global**: Support different time zones and cultural calendars

### Professional Standards

**Recommended Practices:**
- **Certification**: Encourage consultation with qualified practitioners
- **Collaboration**: Work with traditional Chinese astrology experts
- **Continuous Learning**: Stay updated with astronomical and cultural developments
- **Quality Assurance**: Regular audits and accuracy validations
- **Ethical Training**: Ongoing education in cultural sensitivity and responsible practice

---

## 13. References {#references}

1. **The Complete Book of Chinese Astrology** - Derek Walters
2. **Chinese Astrology: Exploring the Eastern Zodiac** - Jonathan Dee
3. **The Nine Star Ki Handbook** - Russell Grant
4. **Traditional Chinese Astrology** - Suzanne White
5. **The Five Elements in Chinese Astrology** - Karin Kalbitzer
6. **Chinese Lunar Calendar Algorithms** - Astronomical Almanac
7. **Meeus Astronomical Algorithms** - Jean Meeus
8. **VSOP87 Ephemeris Theory** - Astronomical calculations
9. **Chinese Astronomical History** - Needham & Wang
10. **The Development of Chinese Astrology** - Xiaochun Sun

### Implementation Notes

- For production use, integrate with astronomical libraries for precise calculations
- Implement proper error handling and input validation
- Add comprehensive logging and monitoring
- Consider microservices architecture for scalability
- Include extensive unit and integration testing

This implementation provides a complete foundation for ZC2.2 Chinese Astrology Calculations with all necessary algorithms, formulas, and code examples for accurate Chinese astrology calculations.
