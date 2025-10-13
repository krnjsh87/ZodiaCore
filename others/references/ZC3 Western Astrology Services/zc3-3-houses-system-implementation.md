# ZC3.3 Houses System Implementation Guide

## Overview

This document provides a comprehensive implementation guide for ZC3.3 Houses System calculations, incorporating all necessary mathematical foundations, algorithms, and technical specifications for accurate house cusp calculations in Western astrology. The implementation covers eight major house systems: Placidus, Equal, Koch, Porphyry, Regiomontanus, Campanus, Morinus, and Topocentric.

## Table of Contents

1. [Introduction](#introduction)
2. [Mathematical Foundations](#mathematical-foundations)
3. [Placidus House System](#placidus-system)
4. [Equal House System](#equal-system)
5. [Koch House System](#koch-system)
6. [Porphyry House System](#porphyry-system)
7. [Regiomontanus House System](#regiomontanus-system)
8. [Campanus House System](#campanus-system)
9. [Morinus House System](#morinus-system)
10. [Topocentric House System](#topocentric-system)
11. [Complete Implementation Code](#implementation-code)
12. [Technical Specifications](#technical-specifications)
13. [Testing and Validation](#testing-validation)
14. [Ethical Considerations](#ethical-considerations)
15. [References](#references)

---

## Change Log

### Version 1.0 (2025-10-08)
- Initial implementation guide for Western astrology house systems
- Added comprehensive mathematical foundations for all major house systems
- Included detailed algorithms and formulas for Placidus, Equal, Koch, Porphyry, Regiomontanus, Campanus, Morinus, and Topocentric systems
- Implemented complete house system calculator with unit tests
- Added technical specifications and performance benchmarks
- Included ethical considerations for house system calculations

---

## 1. Introduction {#introduction}

### What are House Systems?

House systems in Western astrology divide the 360-degree ecliptic into twelve segments called houses, each representing different areas of life and experience. The houses are determined by the intersection of great circles passing through the celestial poles and the horizon, projected onto the ecliptic.

### Key Components

1. **Ascendant (1st House Cusp)**: The eastern horizon point where the ecliptic intersects the horizon
2. **Midheaven (10th House Cusp)**: The highest point of the ecliptic above the horizon
3. **House Cusps**: The twelve boundary points dividing the ecliptic into houses
4. **Angular Houses**: 1st, 4th, 7th, 10th houses (most influential)
5. **Succedent Houses**: 2nd, 5th, 8th, 11th houses (supporting)
6. **Cadent Houses**: 3rd, 6th, 9th, 12th houses (mental/learning)

### Major House Systems

Western astrology employs several house systems, each with different mathematical approaches:

- **Time-Based Systems**: Placidus, Koch, Morinus (divide time equally)
- **Space-Based Systems**: Equal, Porphyry (divide space equally)
- **Quadrant Systems**: Regiomontanus, Campanus (divide quadrants equally)
- **Modern Systems**: Topocentric (accounts for parallax)

### Implementation Requirements

- **Astronomical Accuracy**: Precise calculation of local sidereal time and obliquity
- **Geographical Considerations**: Latitude validation for different systems
- **Multiple Algorithms**: Support for all major house systems
- **High Precision**: ±0.01 degree accuracy for house cusps
- **Performance**: Fast calculations for real-time applications

---

## 2. Mathematical Foundations {#mathematical-foundations}

### Core Mathematical Constants

```javascript
// Import centralized constants (recommended for actual implementation)
const { ASTRO_CONSTANTS } = require('./astro-constants');

// For reference, the constants used are:
const HOUSE_SYSTEM_CONSTANTS = {
    // Time and Date Constants
    JULIAN_DAY_J2000: 2451545.0,           // Julian Day for January 1, 2000, 12:00 UTC
    JULIAN_CENTURY: 36525.0,               // Days in a Julian century
    SECONDS_PER_DAY: 86400.0,              // Seconds in a day
    DEGREES_PER_CIRCLE: 360.0,             // Degrees in a circle
    MINUTES_PER_DEGREE: 60.0,              // Minutes in a degree
    SECONDS_PER_MINUTE: 60.0,              // Seconds in a minute

    // Astrological Constants
    HOUSES_COUNT: 12,                      // 12 houses
    DEGREES_PER_SIGN: 30.0,                // Degrees in each sign
    QUADRANT_DEGREES: 90.0,                // Degrees in a quadrant

    // Earth and Astronomical Constants
    EARTH_OBLIQUITY: 23.43661,             // Earth's axial tilt in degrees (J2000)
    EARTH_RADIUS_KM: 6371.0,               // Earth's mean radius in kilometers
    ASTRONOMICAL_UNIT: 149597870.7,        // AU in kilometers

    // House System Specific Constants
    PLACIDUS_MAX_LATITUDE: 60.0,           // Maximum latitude for Placidus system
    KOCH_MAX_LATITUDE: 60.0,               // Maximum latitude for Koch system
    MORINUS_MAX_LATITUDE: 60.0,            // Maximum latitude for Morinus system
};

// Error message constants for consistent error handling
const HOUSE_SYSTEM_ERROR_MESSAGES = {
    INVALID_LATITUDE_RANGE: 'Latitude must be a number between -90 and 90',
    INVALID_OBLIQUITY_RANGE: 'Obliquity must be a number between 0 and 90',
    INVALID_LST: 'LST must be a valid number',
    INVALID_HOUSE_SYSTEM: 'Invalid house system',
    PLACIDUS_LATITUDE_LIMIT: 'Placidus house system is not valid for latitudes beyond ±60 degrees',
    KOCH_LATITUDE_LIMIT: 'Koch house system is not valid for latitudes beyond ±60 degrees',
    MORINUS_LATITUDE_LIMIT: 'Morinus house system is not valid for latitudes beyond ±60 degrees',
    FRACTION_OUT_OF_RANGE: 'Fraction f must be a number between 0 and 1',
    INVALID_RADIANS: ' must be a valid number'
};
```

const HOUSE_SYSTEMS = {
    PLACIDUS: 'placidus',
    EQUAL: 'equal',
    KOCH: 'koch',
    PORPHYRY: 'porphyry',
    REGIOMONTANUS: 'regiomontanus',
    CAMPANUS: 'campanus',
    MORINUS: 'morinus',
    TOPOCENTRIC: 'topocentric'
};
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
 * Calculate angular distance between two points (shortest path)
 */
function angularDistance(angle1, angle2) {
    let diff = Math.abs(angle1 - angle2);
    return Math.min(diff, 360 - diff);
}

/**
 * Calculate angular separation considering direction
 */
function angularSeparation(fromAngle, toAngle) {
    let diff = toAngle - fromAngle;
    while (diff < 0) diff += 360;
    while (diff >= 360) diff -= 360;
    return diff;
}

/**
 * Calculate obliquity of the ecliptic for a given Julian Day
 */
function calculateObliquity(julianDay) {
    const T = (julianDay - HOUSE_SYSTEM_CONSTANTS.JULIAN_DAY_J2000) / HOUSE_SYSTEM_CONSTANTS.JULIAN_CENTURY;
    // Simplified obliquity calculation (full calculation uses more terms)
    return HOUSE_SYSTEM_CONSTANTS.EARTH_OBLIQUITY - 0.0000004 * T;
}
```

---

## 3. Placidus House System {#placidus-system}

### Overview
The Placidus house system, developed by Placidus de Titus in the 17th century, is the most widely used time-based system in Western astrology. It divides the diurnal arc (time from sunrise to sunset) and nocturnal arc into twelve equal parts.

### Mathematical Foundation

The Placidus system uses the following key concepts:
- **Diurnal Arc**: Time from sunrise to sunset
- **Nocturnal Arc**: Time from sunset to sunrise
- **House Divisions**: Each house corresponds to an equal division of time

### Algorithm

```javascript
/**
 * Calculate Placidus House Cusps
 * @param {number} lst - Local Sidereal Time in degrees
 * @param {number} latitude - Geographical latitude in degrees
 * @param {number} obliquity - Obliquity of the ecliptic in degrees
 * @returns {Array} Array of 12 house cusps in degrees
 */
function calculatePlacidusHouses(lst, latitude, obliquity = HOUSE_SYSTEM_CONSTANTS.EARTH_OBLIQUITY) {
    // Validate latitude for Placidus system
    if (Math.abs(latitude) > HOUSE_SYSTEM_CONSTANTS.PLACIDUS_MAX_LATITUDE) {
        throw new Error(HOUSE_SYSTEM_ERROR_MESSAGES.PLACIDUS_LATITUDE_LIMIT);
    }

    const houses = new Array(12);
    const latRad = degToRad(latitude);
    const oblRad = degToRad(obliquity);

    // Calculate Ascendant and Midheaven
    const { ascendant, midheaven } = calculateAngularHouses(lst, latitude, obliquity);

    houses[0] = ascendant;  // 1st house
    houses[9] = midheaven;   // 10th house
    houses[6] = normalizeAngle(ascendant + 180); // 7th house
    houses[3] = normalizeAngle(midheaven + 180); // 4th house

    // Calculate intermediate houses using Placidus time divisions
    for (let i = 1; i <= 2; i++) {
        // 2nd and 3rd houses
        const ra2 = calculatePlacidusRA(i / 3, latRad, oblRad);
        houses[i] = normalizeAngle(radToDeg(ra2));

        // 11th and 12th houses
        const ra11 = calculatePlacidusRA(1 - i / 3, latRad, oblRad);
        houses[10 + i] = normalizeAngle(radToDeg(ra11) + 180);

        // 5th and 6th houses
        houses[i + 3] = normalizeAngle(houses[i] + 180);

        // 8th and 9th houses
        houses[i + 6] = normalizeAngle(houses[10 + i] + 180);
    }

    return houses;
}

/**
 * Calculate Right Ascension for Placidus house division
 * @param {number} f - Fraction (0-1)
 * @param {number} latRad - Latitude in radians
 * @param {number} oblRad - Obliquity in radians
 * @returns {number} Right Ascension in radians
 */
function calculatePlacidusRA(f, latRad, oblRad) {
    // Input validation
    if (typeof f !== 'number' || isNaN(f) || f < 0 || f > 1) {
        throw new Error(HOUSE_SYSTEM_ERROR_MESSAGES.FRACTION_OUT_OF_RANGE);
    }
    if (typeof latRad !== 'number' || isNaN(latRad)) {
        throw new Error(HOUSE_SYSTEM_ERROR_MESSAGES.INVALID_RADIANS.replace(' ', 'Latitude in radians'));
    }
    if (typeof oblRad !== 'number' || isNaN(oblRad)) {
        throw new Error(HOUSE_SYSTEM_ERROR_MESSAGES.INVALID_RADIANS.replace(' ', 'Obliquity in radians'));
    }

    const tanLat = Math.tan(latRad);
    const sinObl = Math.sin(oblRad);
    const cosObl = Math.cos(oblRad);

    // Calculate the argument for the arcsine
    const arg = sinObl * Math.sin(Math.PI * f / 2) / tanLat;

    if (Math.abs(arg) > 1) {
        // Handle polar regions where calculation becomes invalid
        return Math.PI / 2 * Math.sign(arg);
    }

    const declination = Math.asin(arg);
    const ra = Math.atan2(Math.sin(declination) * cosObl, Math.cos(declination));

    return ra;
}

/**
 * Calculate Ascendant for given LST and latitude
 */
function calculateAscendant(lst, latitude, obliquity = HOUSE_SYSTEM_CONSTANTS.EARTH_OBLIQUITY) {
    const lstRad = degToRad(lst);
    const latRad = degToRad(latitude);
    const oblRad = degToRad(obliquity);

    const ascendant = Math.atan2(
        Math.cos(lstRad),
        -Math.sin(lstRad) * Math.cos(oblRad) - Math.tan(latRad) * Math.sin(oblRad)
    );

    return normalizeAngle(radToDeg(ascendant));
}

/**
 * Calculate angular houses (Ascendant and Midheaven)
 * @param {number} lst - Local Sidereal Time in degrees
 * @param {number} latitude - Geographical latitude in degrees
 * @param {number} obliquity - Obliquity of the ecliptic in degrees
 * @returns {Object} Object with ascendant and midheaven properties
 */
function calculateAngularHouses(lst, latitude, obliquity = HOUSE_SYSTEM_CONSTANTS.EARTH_OBLIQUITY) {
    const ascendant = calculateAscendant(lst, latitude, obliquity);
    const midheaven = normalizeAngle(lst);
    return { ascendant, midheaven };
}
```

### Unit Tests for Placidus System

```javascript
describe('calculatePlacidusHouses', () => {
    test('calculates houses for equatorial latitude', () => {
        const lst = 90;
        const latitude = 0;
        const houses = calculatePlacidusHouses(lst, latitude);
        expect(houses).toHaveLength(12);
        expect(houses[0]).toBeCloseTo(90, 1); // Ascendant at equator
    });

    test('throws error for high latitude', () => {
        expect(() => calculatePlacidusHouses(90, 70)).toThrow('Placidus house system is not valid');
    });

    test('returns normalized angles', () => {
        const houses = calculatePlacidusHouses(400, 30);
        houses.forEach(house => {
            expect(house).toBeGreaterThanOrEqual(0);
            expect(house).toBeLessThan(360);
        });
    });
});
```

---

## 4. Equal House System {#equal-system}

### Overview
The Equal house system, also known as the Equal Division system, divides the ecliptic into twelve equal 30-degree segments starting from the Ascendant. It is one of the simplest and most ancient systems.

### Mathematical Foundation

The Equal system uses simple arithmetic division:
- Each house spans exactly 30 degrees
- House cusps are calculated as: Ascendant + (house_number - 1) × 30°

### Algorithm

```javascript
/**
 * Calculate Equal House Cusps
 * @param {number} ascendant - Ascendant longitude in degrees
 * @returns {Array} Array of 12 house cusps in degrees
 */
function calculateEqualHouses(ascendant) {
    const houses = [];

    for (let i = 0; i < 12; i++) {
        houses.push(normalizeAngle(ascendant + i * HOUSE_SYSTEM_CONSTANTS.DEGREES_PER_SIGN));
    }

    return houses;
}
```

### Unit Tests for Equal System

```javascript
describe('calculateEqualHouses', () => {
    test('calculates equal 30-degree divisions', () => {
        const ascendant = 0;
        const houses = calculateEqualHouses(ascendant);
        expect(houses[0]).toBe(0);   // 1st house
        expect(houses[3]).toBe(90);  // 4th house
        expect(houses[6]).toBe(180); // 7th house
        expect(houses[9]).toBe(270); // 10th house
    });

    test('handles angle wrapping', () => {
        const ascendant = 330;
        const houses = calculateEqualHouses(ascendant);
        expect(houses[0]).toBe(330);
        expect(houses[1]).toBe(0);   // Wraps around
        expect(houses[2]).toBe(30);
    });
});
```

---

## 5. Koch House System {#koch-system}

### Overview
The Koch house system, developed by Walter Koch in the 20th century, is similar to Placidus but uses a different mathematical approach. It is popular in German-speaking countries and provides more accurate house cusps in some latitudes.

### Mathematical Foundation

The Koch system uses trigonometric functions to calculate house positions based on the obliquity and latitude, similar to Placidus but with different formulas.

### Algorithm

```javascript
/**
 * Calculate Koch House Cusps
 * @param {number} lst - Local Sidereal Time in degrees
 * @param {number} latitude - Geographical latitude in degrees
 * @param {number} obliquity - Obliquity of the ecliptic in degrees
 * @returns {Array} Array of 12 house cusps in degrees
 */
function calculateKochHouses(lst, latitude, obliquity = HOUSE_SYSTEM_CONSTANTS.EARTH_OBLIQUITY) {
    // Validate latitude for Koch system
    if (Math.abs(latitude) > HOUSE_SYSTEM_CONSTANTS.KOCH_MAX_LATITUDE) {
        throw new Error('Koch house system is not valid for latitudes beyond ±60 degrees');
    }

    const houses = new Array(12);
    const latRad = degToRad(latitude);
    const oblRad = degToRad(obliquity);

    // Calculate Ascendant and Midheaven
    const ascendant = calculateAscendant(lst, latitude, obliquity);
    const midheaven = normalizeAngle(lst);

    houses[0] = ascendant;
    houses[9] = midheaven;

    // Koch system calculations
    const raAsc = degToRad(ascendant);
    const raMc = degToRad(midheaven);

    // Calculate house cusps using Koch formulas
    for (let i = 1; i < 12; i++) {
        if (i === 9) continue; // Skip MC

        const factor = i / 12;
        const ra = raAsc + factor * angularSeparation(raAsc, raMc);
        houses[i] = normalizeAngle(radToDeg(ra));
    }

    return houses;
}
```

---

## 6. Porphyry House System {#porphyry-system}

### Overview
The Porphyry house system, attributed to Porphyry of Tyre (3rd century CE), is a space-based system that divides each quadrant of the ecliptic into three equal parts of 30 degrees each.

### Mathematical Foundation

The Porphyry system divides the ecliptic into quadrants:
- 1st Quadrant: Ascendant to Midheaven (30° each for houses 1, 2, 3)
- 2nd Quadrant: Midheaven to Descendant (30° each for houses 4, 5, 6)
- 3rd Quadrant: Descendant to Nadir (30° each for houses 7, 8, 9)
- 4th Quadrant: Nadir to Ascendant (30° each for houses 10, 11, 12)

### Algorithm

```javascript
/**
 * Calculate Porphyry House Cusps
 * @param {number} ascendant - Ascendant longitude in degrees
 * @param {number} midheaven - Midheaven longitude in degrees
 * @returns {Array} Array of 12 house cusps in degrees
 */
function calculatePorphyryHouses(ascendant, midheaven) {
    const houses = new Array(12);

    // Set angular houses
    houses[0] = ascendant;   // 1st house
    houses[9] = midheaven;   // 10th house
    houses[6] = normalizeAngle(ascendant + 180); // 7th house
    houses[3] = normalizeAngle(midheaven + 180); // 4th house

    // Calculate intermediate houses (30° divisions within quadrants)
    for (let quadrant = 0; quadrant < 4; quadrant++) {
        const startHouse = quadrant * 3;
        const startAngle = houses[startHouse];
        const endAngle = houses[((startHouse + 3) % 12)];

        const angularDiff = angularSeparation(startAngle, endAngle);

        for (let i = 1; i < 3; i++) {
            const cuspAngle = normalizeAngle(startAngle + (angularDiff * i / 3));
            houses[startHouse + i] = cuspAngle;
        }
    }

    return houses;
}
```

---

## 7. Regiomontanus House System {#regiomontanus-system}

### Overview
The Regiomontanus house system, developed by Johannes Müller (Regiomontanus) in the 15th century, is a quadrant-based system that uses the prime vertical circle for house division.

### Mathematical Foundation

The Regiomontanus system projects the houses onto the prime vertical circle, which passes through the east, west, zenith, and nadir points.

### Algorithm

```javascript
/**
 * Calculate Regiomontanus House Cusps
 * @param {number} lst - Local Sidereal Time in degrees
 * @param {number} latitude - Geographical latitude in degrees
 * @param {number} obliquity - Obliquity of the ecliptic in degrees
 * @returns {Array} Array of 12 house cusps in degrees
 */
function calculateRegiomontanusHouses(lst, latitude, obliquity = HOUSE_SYSTEM_CONSTANTS.EARTH_OBLIQUITY) {
    const houses = new Array(12);
    const latRad = degToRad(latitude);
    const oblRad = degToRad(obliquity);

    // Calculate angular houses
    const ascendant = calculateAscendant(lst, latitude, obliquity);
    const midheaven = normalizeAngle(lst);

    houses[0] = ascendant;
    houses[9] = midheaven;
    houses[6] = normalizeAngle(ascendant + 180);
    houses[3] = normalizeAngle(midheaven + 180);

    // Regiomontanus uses rotation of the prime vertical
    for (let i = 1; i <= 2; i++) {
        const angle = (i * HOUSE_SYSTEM_CONSTANTS.DEGREES_PER_SIGN) * Math.PI / 180; // Convert to radians

        // Calculate house cusps using spherical trigonometry
        const ra = Math.atan2(
            Math.sin(angle) * Math.cos(latRad),
            Math.cos(angle)
        );

        houses[i] = normalizeAngle(radToDeg(ra));     // 2nd, 3rd houses
        houses[i + 3] = normalizeAngle(houses[i] + 180); // 5th, 6th houses
        houses[i + 6] = normalizeAngle(houses[i] + 180); // 8th, 9th houses
        houses[i + 9] = normalizeAngle(houses[i]);     // 11th, 12th houses
    }

    return houses;
}
```

---

## 8. Campanus House System {#campanus-system}

### Overview
The Campanus house system, developed by Johannes Campanus in the 13th century, is similar to Regiomontanus but uses a different projection method based on the celestial equator.

### Mathematical Foundation

The Campanus system projects houses onto the celestial equator rather than the prime vertical.

### Algorithm

```javascript
/**
 * Calculate Campanus House Cusps
 * @param {number} lst - Local Sidereal Time in degrees
 * @param {number} latitude - Geographical latitude in degrees
 * @param {number} obliquity - Obliquity of the ecliptic in degrees
 * @returns {Array} Array of 12 house cusps in degrees
 */
function calculateCampanusHouses(lst, latitude, obliquity = HOUSE_SYSTEM_CONSTANTS.EARTH_OBLIQUITY) {
    const houses = new Array(12);
    const latRad = degToRad(latitude);
    const oblRad = degToRad(obliquity);

    // Calculate angular houses
    const ascendant = calculateAscendant(lst, latitude, obliquity);
    const midheaven = normalizeAngle(lst);

    houses[0] = ascendant;
    houses[9] = midheaven;
    houses[6] = normalizeAngle(ascendant + 180);
    houses[3] = normalizeAngle(midheaven + 180);

    // Campanus uses equatorial projection
    for (let i = 1; i <= 2; i++) {
        const angle = (i * HOUSE_SYSTEM_CONSTANTS.DEGREES_PER_SIGN) * Math.PI / 180;

        // Different formula from Regiomontanus
        const ra = Math.atan2(
            Math.sin(angle),
            Math.cos(angle) * Math.cos(latRad)
        );

        houses[i] = normalizeAngle(radToDeg(ra));
        houses[i + 3] = normalizeAngle(houses[i] + 180);
        houses[i + 6] = normalizeAngle(houses[i] + 180);
        houses[i + 9] = normalizeAngle(houses[i]);
    }

    return houses;
}
```

---

## 9. Morinus House System {#morinus-system}

### Overview
The Morinus house system, developed by Jean-Baptiste Morin in the 17th century, is a time-based system similar to Placidus but uses different mathematical formulas.

### Mathematical Foundation

The Morinus system uses a different approach to time-based divisions compared to Placidus.

### Algorithm

```javascript
/**
 * Calculate Morinus House Cusps
 * @param {number} lst - Local Sidereal Time in degrees
 * @param {number} latitude - Geographical latitude in degrees
 * @param {number} obliquity - Obliquity of the ecliptic in degrees
 * @returns {Array} Array of 12 house cusps in degrees
 */
function calculateMorinusHouses(lst, latitude, obliquity = HOUSE_SYSTEM_CONSTANTS.EARTH_OBLIQUITY) {
    // Validate latitude for Morinus system
    if (Math.abs(latitude) > HOUSE_SYSTEM_CONSTANTS.MORINUS_MAX_LATITUDE) {
        throw new Error('Morinus house system is not valid for latitudes beyond ±60 degrees');
    }

    const houses = new Array(12);
    const latRad = degToRad(latitude);
    const oblRad = degToRad(obliquity);

    // Calculate Ascendant and Midheaven
    const ascendant = calculateAscendant(lst, latitude, obliquity);
    const midheaven = normalizeAngle(lst);

    houses[0] = ascendant;
    houses[9] = midheaven;

    // Morinus system uses different trigonometric calculations
    for (let i = 1; i <= 2; i++) {
        const f = i / 3;

        // Morinus-specific formula
        const tanLat = Math.tan(latRad);
        const sinObl = Math.sin(oblRad);
        const cosObl = Math.cos(oblRad);

        const arg = sinObl * Math.sin(Math.PI * f / 2) / tanLat;
        const decl = Math.asin(Math.max(-1, Math.min(1, arg)));
        const ra = Math.atan2(Math.sin(decl) * cosObl, Math.cos(decl));

        houses[i] = normalizeAngle(radToDeg(ra));
        houses[i + 6] = normalizeAngle(houses[i] + 180);
        houses[10 + i] = normalizeAngle(radToDeg(ra) + 180);
        houses[4 + i] = normalizeAngle(houses[10 + i] + 180);
    }

    return houses;
}
```

---

## 10. Topocentric House System {#topocentric-system}

### Overview
The Topocentric house system, developed by Jean-Baptiste Morin and modernized by astronomers, accounts for the parallax of the horizon due to the Earth's radius.

### Mathematical Foundation

The Topocentric system adjusts for the fact that the horizon is not at infinity but at the Earth's surface, affecting the apparent position of celestial bodies.

### Algorithm

```javascript
/**
 * Calculate Topocentric House Cusps
 * @param {number} lst - Local Sidereal Time in degrees
 * @param {number} latitude - Geographical latitude in degrees
 * @param {number} obliquity - Obliquity of the ecliptic in degrees
 * @param {number} altitude - Observer altitude in meters (optional)
 * @returns {Array} Array of 12 house cusps in degrees
 */
function calculateTopocentricHouses(lst, latitude, obliquity = HOUSE_SYSTEM_CONSTANTS.EARTH_OBLIQUITY, altitude = 0) {
    // Calculate parallax correction
    const parallaxCorrection = calculateParallaxCorrection(latitude, altitude);

    // Adjust latitude for parallax
    const adjustedLatitude = latitude + parallaxCorrection;

    // Use Placidus calculations with adjusted latitude
    return calculatePlacidusHouses(lst, adjustedLatitude, obliquity);
}

/**
 * Calculate parallax correction for topocentric system
 * @param {number} latitude - Latitude in degrees
 * @param {number} altitude - Altitude in meters
 * @returns {number} Parallax correction in degrees
 */
function calculateParallaxCorrection(latitude, altitude) {
    const latRad = degToRad(latitude);
    const earthRadius = HOUSE_SYSTEM_CONSTANTS.EARTH_RADIUS_KM * 1000; // Convert to meters
    const distanceToHorizon = Math.sqrt(earthRadius * earthRadius + altitude * altitude + 2 * earthRadius * altitude) - earthRadius;

    // Prevent division by zero or negative values
    if (distanceToHorizon <= 0) {
        return 0; // No parallax correction for invalid distances
    }

    // Simplified parallax calculation
    const parallax = Math.atan2(earthRadius, distanceToHorizon);
    return radToDeg(parallax) * Math.cos(latRad);
}
```

---

## 11. Complete Implementation Code {#implementation-code}

### Complete House System Calculator

```javascript
/**
 * Custom error classes for house system calculations
 */
class HouseSystemValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'HouseSystemValidationError';
    }
}

class HouseSystemCalculationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'HouseSystemCalculationError';
    }
}

/**
 * Complete Western Astrology House System Calculator
 */
class WesternHouseSystemCalculator {
    constructor() {
        this.supportedSystems = Object.values(HOUSE_SYSTEMS);
    }

    /**
     * Calculate house cusps using specified house system
     * @param {string} system - House system to use
     * @param {number} lst - Local Sidereal Time in degrees
     * @param {number} latitude - Geographical latitude in degrees
     * @param {number} obliquity - Obliquity of the ecliptic in degrees
     * @param {Object} options - Additional options
     * @returns {Object} House calculation results
     */
    calculateHouses(system, lst, latitude, obliquity = HOUSE_SYSTEM_CONSTANTS.EARTH_OBLIQUITY, options = {}) {
        try {
            // Validate inputs
            this._validateInputs(system, lst, latitude, obliquity);

            let houses;

            // Calculate houses based on system
            switch (system.toLowerCase()) {
                case HOUSE_SYSTEMS.PLACIDUS:
                    houses = calculatePlacidusHouses(lst, latitude, obliquity);
                    break;
                case HOUSE_SYSTEMS.EQUAL:
                    const ascendant = calculateAscendant(lst, latitude, obliquity);
                    houses = calculateEqualHouses(ascendant);
                    break;
                case HOUSE_SYSTEMS.KOCH:
                    houses = calculateKochHouses(lst, latitude, obliquity);
                    break;
                case HOUSE_SYSTEMS.PORPHYRY:
                    const asc = calculateAscendant(lst, latitude, obliquity);
                    const mc = normalizeAngle(lst);
                    houses = calculatePorphyryHouses(asc, mc);
                    break;
                case HOUSE_SYSTEMS.REGIOMONTANUS:
                    houses = calculateRegiomontanusHouses(lst, latitude, obliquity);
                    break;
                case HOUSE_SYSTEMS.CAMPANUS:
                    houses = calculateCampanusHouses(lst, latitude, obliquity);
                    break;
                case HOUSE_SYSTEMS.MORINUS:
                    houses = calculateMorinusHouses(lst, latitude, obliquity);
                    break;
                case HOUSE_SYSTEMS.TOPOCENTRIC:
                    houses = calculateTopocentricHouses(lst, latitude, obliquity, options.altitude || 0);
                    break;
                default:
                    throw new HouseSystemValidationError(`Unsupported house system: ${system}`);
            }

            // Format results
            return this._formatHouseResults(system, houses, lst, latitude, obliquity);

        } catch (error) {
            throw new Error(`House calculation failed: ${error.message}`);
        }
    }

    /**
     * Private method: Validate input parameters
     */
    _validateInputs(system, lst, latitude, obliquity) {
        if (!this.supportedSystems.includes(system.toLowerCase())) {
            throw new HouseSystemValidationError(`Invalid house system: ${system}`);
        }

        if (typeof lst !== 'number' || isNaN(lst)) {
            throw new HouseSystemValidationError('LST must be a valid number');
        }

        if (typeof latitude !== 'number' || isNaN(latitude) || Math.abs(latitude) > 90) {
            throw new HouseSystemValidationError('Latitude must be a number between -90 and 90');
        }

        if (typeof obliquity !== 'number' || isNaN(obliquity) || obliquity <= 0 || obliquity >= 90) {
            throw new HouseSystemValidationError('Obliquity must be a number between 0 and 90');
        }
    }

    /**
     * Private method: Format house calculation results
     */
    _formatHouseResults(system, houses, lst, latitude, obliquity) {
        const houseNames = [
            '1st House', '2nd House', '3rd House', '4th House', '5th House', '6th House',
            '7th House', '8th House', '9th House', '10th House', '11th House', '12th House'
        ];

        const formattedHouses = houses.map((cusp, index) => ({
            house: index + 1,
            name: houseNames[index],
            cusp: cusp,
            sign: Math.floor(cusp / 30),
            degree: cusp % 30
        }));

        return {
            system: system,
            calculationTime: new Date().toISOString(),
            input: {
                lst: lst,
                latitude: latitude,
                obliquity: obliquity
            },
            houses: formattedHouses,
            angularHouses: {
                ascendant: formattedHouses[0],
                midheaven: formattedHouses[9],
                descendant: formattedHouses[6],
                nadir: formattedHouses[3]
            }
        };
    }

    /**
     * Get which house a planet is in
     * @param {number} planetLongitude - Planet's longitude in degrees
     * @param {Array} houseCusps - Array of house cusps
     * @returns {number} House number (1-12)
     */
    getHouseFromLongitude(planetLongitude, houseCusps) {
        for (let i = 0; i < 12; i++) {
            const currentCusp = houseCusps[i];
            const nextCusp = houseCusps[(i + 1) % 12];

            if (this._isInHouse(planetLongitude, currentCusp, nextCusp)) {
                return i + 1;
            }
        }
        return 1; // Default to 1st house
    }

    /**
     * Private method: Check if longitude is in a house
     */
    _isInHouse(longitude, startCusp, endCusp) {
        longitude = normalizeAngle(longitude);
        startCusp = normalizeAngle(startCusp);
        endCusp = normalizeAngle(endCusp);

        if (startCusp < endCusp) {
            return longitude >= startCusp && longitude < endCusp;
        } else {
            // Handle wrap-around at 0/360 degrees
            return longitude >= startCusp || longitude < endCusp;
        }
    }
}

// Usage Example
const houseCalculator = new WesternHouseSystemCalculator();

const birthData = {
    lst: 120.5,      // Local Sidereal Time
    latitude: 40.7,  // New York latitude
    obliquity: 23.4  // Current obliquity
};

const placidusHouses = houseCalculator.calculateHouses('placidus', birthData.lst, birthData.latitude, birthData.obliquity);
console.log('Placidus Houses:', placidusHouses);

const equalHouses = houseCalculator.calculateHouses('equal', birthData.lst, birthData.latitude, birthData.obliquity);
console.log('Equal Houses:', equalHouses);
```

---

## 12. Technical Specifications {#technical-specifications}

### Input Requirements

- **Local Sidereal Time**: Degrees (0-360), calculated from Julian Day and longitude
- **Latitude**: Degrees (-90 to +90), geographical latitude of birth location
- **Obliquity**: Degrees (22-24), obliquity of the ecliptic
- **House System**: String identifier for supported systems

### Output Structure

```javascript
{
    system: "placidus",
    calculationTime: "2025-10-08T17:23:41.268Z",
    input: {
        lst: 120.5,
        latitude: 40.7,
        obliquity: 23.4
    },
    houses: [{
        house: 1,
        name: "1st House",
        cusp: 123.45,
        sign: 4,
        degree: 3.45
    }],
    angularHouses: {
        ascendant: { house: 1, name: "1st House", cusp: 123.45, sign: 4, degree: 3.45 },
        midheaven: { house: 10, name: "10th House", cusp: 234.56, sign: 7, degree: 24.56 },
        descendant: { house: 7, name: "7th House", cusp: 303.45, sign: 10, degree: 3.45 },
        nadir: { house: 4, name: "4th House", cusp: 54.56, sign: 1, degree: 24.56 }
    }
}
```

### Accuracy Requirements

- **House Cusps**: ±0.01 degrees for all systems
- **Angular Separation**: ±0.001 degrees for quadrant calculations
- **Angle Normalization**: Exact 0-360 degree range
- **Latitude Validation**: Proper error handling for invalid latitudes

### Performance Benchmarks

- **Single House Calculation**: < 1ms for all systems
- **Batch Processing**: < 10ms for 100 calculations
- **Memory Usage**: < 1MB for calculator instance
- **Concurrent Requests**: Support 1000+ simultaneous calculations

### Error Handling

- **Invalid House System**: Clear error for unsupported systems
- **Invalid Coordinates**: Validation for latitude, LST, obliquity ranges
- **Polar Region Issues**: Specific errors for systems invalid at high latitudes
- **Calculation Errors**: Fallback handling for mathematical edge cases

---

## 13. Testing and Validation {#testing-validation}

### Unit Test Suite

```javascript
describe('WesternHouseSystemCalculator', () => {
    let calculator;

    beforeEach(() => {
        calculator = new WesternHouseSystemCalculator();
    });

    test('calculates Placidus houses successfully', () => {
        const result = calculator.calculateHouses('placidus', 120, 40, 23.4);
        expect(result.system).toBe('placidus');
        expect(result.houses).toHaveLength(12);
        expect(result.angularHouses.ascendant).toBeDefined();
    });

    test('calculates Equal houses correctly', () => {
        const result = calculator.calculateHouses('equal', 120, 40, 23.4);
        // Equal houses should be exactly 30 degrees apart
        for (let i = 1; i < 12; i++) {
            const diff = angularDistance(result.houses[i-1].cusp, result.houses[i].cusp);
            expect(diff).toBeCloseTo(30, 1);
        }
    });

    test('throws error for invalid house system', () => {
        expect(() => calculator.calculateHouses('invalid', 120, 40, 23.4))
            .toThrow('Unsupported house system');
    });

    test('throws error for invalid latitude', () => {
        expect(() => calculator.calculateHouses('placidus', 120, 100, 23.4))
            .toThrow('Latitude must be between -90 and 90');
    });

    test('handles polar latitudes for Equal system', () => {
        const result = calculator.calculateHouses('equal', 120, 89, 23.4);
        expect(result.houses).toHaveLength(12);
    });

    test('calculates Porphyry houses correctly', () => {
        const result = calculator.calculateHouses('porphyry', 120, 40, 23.4);
        // Porphyry should have equal divisions within quadrants
        const asc = result.angularHouses.ascendant.cusp;
        const mc = result.angularHouses.midheaven.cusp;
        const quadrantSize = angularDistance(asc, mc);
        expect(quadrantSize).toBeGreaterThan(0);
    });

    test('getHouseFromLongitude works correctly', () => {
        const houses = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
        expect(calculator.getHouseFromLongitude(15, houses)).toBe(1);
        expect(calculator.getHouseFromLongitude(45, houses)).toBe(2);
        expect(calculator.getHouseFromLongitude(359, houses)).toBe(12);
    });
});

describe('Utility Functions', () => {
    describe('angularDistance', () => {
        test('calculates shortest distance between angles', () => {
            expect(angularDistance(0, 10)).toBe(10);
            expect(angularDistance(350, 10)).toBe(20); // Crossing 0/360 boundary
            expect(angularDistance(180, 0)).toBe(180);
            expect(angularDistance(10, 350)).toBe(20); // Reverse direction
        });
    });

    describe('angularSeparation', () => {
        test('calculates separation considering direction', () => {
            expect(angularSeparation(0, 90)).toBe(90);
            expect(angularSeparation(350, 10)).toBe(20); // Crossing boundary
            expect(angularSeparation(90, 0)).toBe(270); // Counter-clockwise
        });
    });
});

describe('House System Integration', () => {
    test('all house systems produce valid results', () => {
        const calculator = new WesternHouseSystemCalculator();
        const systems = ['placidus', 'equal', 'koch', 'porphyry', 'regiomontanus', 'campanus', 'morinus', 'topocentric'];

        systems.forEach(system => {
            const result = calculator.calculateHouses(system, 120, 40, 23.4);
            expect(result.houses).toHaveLength(12);
            expect(result.system).toBe(system);
        });
    });

    test('performance benchmark', () => {
        const calculator = new WesternHouseSystemCalculator();
        const startTime = Date.now();

        for (let i = 0; i < 100; i++) {
            calculator.calculateHouses('placidus', 120 + i, 40, 23.4);
        }

        const endTime = Date.now();
        expect(endTime - startTime).toBeLessThan(100); // Should complete in < 100ms
    });
});
```

### Validation Metrics

- **Test Coverage**: > 90% of all methods and functions
- **Accuracy Validation**: Compare against known astronomical calculations
- **Cross-System Consistency**: Verify angular relationships between systems
- **Edge Case Testing**: Polar regions, equator, exact angles

---

## 14. Ethical Considerations {#ethical-considerations}

### Accuracy and Transparency

House system calculations must be mathematically accurate and transparent in their methodology. Users should be informed about:

- **System Differences**: How different house systems can produce varying results
- **Accuracy Limitations**: The approximate nature of house cusp calculations
- **Historical Context**: The origins and intended use of each house system
- **Modern Applications**: Appropriate contexts for different systems

### Responsible Interpretation

House systems should be used responsibly in astrological practice:

- **Not Deterministic**: House positions indicate tendencies, not certainties
- **Cultural Sensitivity**: Respect for diverse astrological traditions
- **Client Autonomy**: Empower clients to make their own decisions
- **Professional Standards**: Adherence to ethical astrological practice guidelines

### Data Privacy

House calculations require geographical data:

- **Minimal Data Collection**: Only collect necessary location information
- **Purpose Limitation**: Use location data solely for astronomical calculations
- **Data Retention**: Store location data only as long as needed
- **Anonymization**: Remove personally identifiable information from results

### Algorithmic Accountability

- **Mathematical Verification**: All formulas should be verifiable and documented
- **Error Transparency**: Clear communication of calculation limitations
- **Continuous Validation**: Regular testing against astronomical standards
- **Open Source**: Consider making core algorithms available for peer review

---

## 15. References {#references}

1. **Placidus House System** - Placidus de Titus, "Primum Mobile", 17th century
2. **Equal House System** - Ancient astrological tradition
3. **Koch House System** - Walter Koch, 20th century German astrologer
4. **Porphyry House System** - Porphyry of Tyre, 3rd century CE
5. **Regiomontanus House System** - Johannes Müller (Regiomontanus), 15th century
6. **Campanus House System** - Johannes Campanus, 13th century
7. **Morinus House System** - Jean-Baptiste Morin, 17th century
8. **Topocentric House System** - Modern astronomical correction
9. **Astrological House Systems** - Various authors and practitioners
10. **Astronomical Algorithms** - Jean Meeus, "Astronomical Algorithms"

### Implementation Notes

- For production use, integrate with professional astronomical libraries for highest accuracy
- Implement proper caching for frequently requested calculations
- Add comprehensive logging and monitoring
- Consider microservices architecture for scalability
- Support both real-time and batch processing modes
- Include rate limiting to prevent abuse

This implementation provides a complete foundation for ZC3.3 Western astrology house systems with all necessary algorithms, formulas, and code examples for accurate house cusp calculations.