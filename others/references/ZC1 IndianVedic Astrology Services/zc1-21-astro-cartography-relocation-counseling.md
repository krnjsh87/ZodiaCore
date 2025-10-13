# ZC1.21 Astro-cartography/Relocation Counseling Implementation Guide

## Overview

Astro-cartography and relocation counseling are advanced astrological techniques that analyze how planetary influences change based on geographical location. Astro-cartography maps planetary lines across the world to identify favorable locations for travel, relocation, and life changes, while relocation astrology involves casting birth charts for different locations to understand local planetary effects.

This document provides comprehensive algorithms, implementation details, and technical specifications for calculating astro-cartography lines, relocation charts, and counseling recommendations in the ZodiaCore astrology system.

## Table of Contents

1. [Astro-cartography Fundamentals](#astro-cartography-fundamentals)
2. [Relocation Astrology Principles](#relocation-astrology-principles)
3. [Planetary Line Calculations](#planetary-line-calculations)
4. [Relocation Chart Generation](#relocation-chart-generation)
5. [Location Analysis Algorithms](#location-analysis-algorithms)
6. [Counseling Recommendation Engine](#counseling-recommendation-engine)
7. [Implementation Architecture](#implementation-architecture)
8. [API Specifications](#api-specifications)
9. [Database Schema](#database-schema)
10. [Testing and Validation](#testing-and-validation)

## 1. Astro-cartography Fundamentals

### Definition

Astro-cartography is a locational astrology technique that maps planetary lines across the Earth's surface. These lines represent positions where specific planetary influences are activated, creating zones of opportunity, challenge, or transformation.

### Core Concepts

- **Planetary Lines**: Vertical lines on the world map where a planet's influence is strongest
- **Parallels**: Horizontal lines representing planetary declinations
- **Angles**: Lines at 90°, 45°, and 135° from the birth location
- **Orb of Influence**: The width of influence around each line (typically 1-2°)

### Types of Lines

#### Major Planetary Lines
- **Sun Lines**: Vitality, leadership, recognition
- **Moon Lines**: Emotional well-being, family, intuition
- **Mercury Lines**: Communication, business, learning
- **Venus Lines**: Love, beauty, finances, relationships
- **Mars Lines**: Energy, action, conflict, physical activity
- **Jupiter Lines**: Expansion, luck, spirituality, travel
- **Saturn Lines**: Discipline, responsibility, career, limitations
- **Uranus Lines**: Innovation, change, technology, freedom
- **Neptune Lines**: Spirituality, creativity, confusion, inspiration
- **Pluto Lines**: Transformation, power, rebirth, intensity

#### Line Classifications
- **Conjunction Lines**: Direct planetary influence (most powerful)
- **Opposition Lines**: Challenging or balancing influence
- **Square Lines**: Tension and growth opportunities
- **Trine Lines**: Harmonious and supportive influence
- **Sextile Lines**: Cooperative and helpful influence

## 2. Relocation Astrology Principles

### Definition

Relocation astrology involves recalculating a birth chart for different geographical locations to understand how local planetary influences affect various life areas.

### Key Principles

- **Local Space**: Each location has its own astrological "personality"
- **Time Zone Effects**: Different time zones create different chart dynamics
- **House System Changes**: Houses shift based on latitude and longitude
- **Angular Planets**: Planets near angles (1st, 4th, 7th, 10th houses) gain strength

### Relocation Methods

#### 1. Birth Time Adjustment
- Adjust birth time for local time zone
- Recalculate entire chart for new location
- Maintain original planetary positions

#### 2. Local Horizon Method
- Calculate rising sign for new location
- Adjust houses while keeping planets fixed
- Focus on angular relationships

#### 3. Astro-cartography Integration
- Combine relocation charts with planetary lines
- Identify locations where multiple beneficial lines converge
- Avoid areas with challenging line concentrations

## 3. Planetary Line Calculations

### Core Algorithm

```javascript
class AstroCartographyCalculator {
    constructor(birthChart) {
        this.validateBirthChart(birthChart);
        this.birthChart = birthChart;
        this.earthRadius = 6371; // km
        this.lines = [];
    }

    /**
     * Validate birth chart input
     */
    validateBirthChart(birthChart) {
        if (!birthChart || !birthChart.planets) {
            throw new Error('Invalid birth chart: missing planets data');
        }
        const requiredPlanets = ['SUN', 'MOON', 'MERCURY', 'VENUS', 'MARS', 'JUPITER', 'SATURN'];
        for (const planet of requiredPlanets) {
            if (!birthChart.planets[planet] || typeof birthChart.planets[planet].longitude !== 'number') {
                throw new Error(`Invalid birth chart: missing or invalid ${planet} data`);
            }
        }
    }

    /**
     * Calculate all planetary lines for a birth chart
     */
    calculateAllLines() {
        const planets = Object.keys(this.birthChart.planets);
        const lines = [];

        for (const planet of planets) {
            const planetData = this.birthChart.planets[planet];
            const planetLines = this.calculatePlanetLines(planet, planetData);
            lines.push(...planetLines);
        }

        this.lines = lines;
        return lines;
    }

    /**
     * Calculate lines for a specific planet
     */
    calculatePlanetLines(planetName, planetData) {
        const lines = [];
        const longitude = planetData.longitude;
        const latitude = planetData.latitude || 0; // Declination

        // Conjunction line (most important)
        lines.push({
            planet: planetName,
            type: 'conjunction',
            longitude: longitude,
            latitude: null, // Vertical line
            influence: 'direct',
            strength: 1.0,
            description: this.getLineDescription(planetName, 'conjunction')
        });

        // Opposition line
        const oppositionLon = (longitude + 180) % 360;
        lines.push({
            planet: planetName,
            type: 'opposition',
            longitude: oppositionLon,
            latitude: null,
            influence: 'challenging',
            strength: 0.8,
            description: this.getLineDescription(planetName, 'opposition')
        });

        // Square lines
        const square1Lon = (longitude + 90) % 360;
        const square2Lon = (longitude + 270) % 360;

        lines.push({
            planet: planetName,
            type: 'square',
            longitude: square1Lon,
            latitude: null,
            influence: 'growth',
            strength: 0.6,
            description: this.getLineDescription(planetName, 'square')
        });

        lines.push({
            planet: planetName,
            type: 'square',
            longitude: square2Lon,
            latitude: null,
            influence: 'growth',
            strength: 0.6,
            description: this.getLineDescription(planetName, 'square')
        });

        // Trine lines
        const trine1Lon = (longitude + 120) % 360;
        const trine2Lon = (longitude + 240) % 360;

        lines.push({
            planet: planetName,
            type: 'trine',
            longitude: trine1Lon,
            latitude: null,
            influence: 'harmonious',
            strength: 0.7,
            description: this.getLineDescription(planetName, 'trine')
        });

        lines.push({
            planet: planetName,
            type: 'trine',
            longitude: trine2Lon,
            latitude: null,
            influence: 'harmonious',
            strength: 0.7,
            description: this.getLineDescription(planetName, 'trine')
        });

        // Sextile lines
        const sextile1Lon = (longitude + 60) % 360;
        const sextile2Lon = (longitude + 300) % 360;

        lines.push({
            planet: planetName,
            type: 'sextile',
            longitude: sextile1Lon,
            latitude: null,
            influence: 'supportive',
            strength: 0.5,
            description: this.getLineDescription(planetName, 'sextile')
        });

        lines.push({
            planet: planetName,
            type: 'sextile',
            longitude: sextile2Lon,
            latitude: null,
            influence: 'supportive',
            strength: 0.5,
            description: this.getLineDescription(planetName, 'sextile')
        });

        return lines;
    }

    /**
     * Get line description based on planet and aspect
     */
    getLineDescription(planet, aspectType) {
        const descriptions = {
            'SUN': {
                'conjunction': 'Leadership, vitality, recognition, and self-expression',
                'opposition': 'Challenges to ego, need for balance in authority',
                'square': 'Growth through overcoming obstacles to self-identity',
                'trine': 'Natural flow of creative and leadership energy',
                'sextile': 'Opportunities for self-development and recognition'
            },
            'MOON': {
                'conjunction': 'Emotional sensitivity, family connections, intuition',
                'opposition': 'Emotional challenges, need for emotional balance',
                'square': 'Growth through emotional processing and healing',
                'trine': 'Natural emotional harmony and family support',
                'sextile': 'Supportive emotional environment and nurturing'
            },
            'MERCURY': {
                'conjunction': 'Communication, learning, business, and intellectual pursuits',
                'opposition': 'Communication challenges, need for clear expression',
                'square': 'Growth through overcoming mental obstacles',
                'trine': 'Natural flow of communication and learning',
                'sextile': 'Opportunities for education and skill development'
            },
            'VENUS': {
                'conjunction': 'Love, beauty, finances, relationships, and harmony',
                'opposition': 'Relationship challenges, need for balance in partnerships',
                'square': 'Growth through overcoming financial or relationship obstacles',
                'trine': 'Natural flow of love and financial abundance',
                'sextile': 'Opportunities for romance and financial gain'
            },
            'MARS': {
                'conjunction': 'Energy, action, courage, physical activity, and drive',
                'opposition': 'Conflicts, need for controlled energy',
                'square': 'Growth through overcoming aggression or impatience',
                'trine': 'Natural flow of physical energy and motivation',
                'sextile': 'Opportunities for physical achievement and leadership'
            },
            'JUPITER': {
                'conjunction': 'Expansion, luck, wisdom, spirituality, and travel',
                'opposition': 'Excessive optimism, need for realistic goals',
                'square': 'Growth through overcoming limitations in belief systems',
                'trine': 'Natural flow of abundance and spiritual growth',
                'sextile': 'Opportunities for learning and philosophical development'
            },
            'SATURN': {
                'conjunction': 'Discipline, responsibility, career, structure, and limitations',
                'opposition': 'Authority issues, need for self-discipline',
                'square': 'Growth through overcoming fears and restrictions',
                'trine': 'Natural flow of achievement and stability',
                'sextile': 'Opportunities for career advancement and maturity'
            },
            'URANUS': {
                'conjunction': 'Innovation, freedom, technology, change, and rebellion',
                'opposition': 'Sudden changes, need for stability',
                'square': 'Growth through embracing innovation and change',
                'trine': 'Natural flow of creative and technological breakthroughs',
                'sextile': 'Opportunities for progressive change and liberation'
            },
            'NEPTUNE': {
                'conjunction': 'Spirituality, creativity, intuition, dreams, and compassion',
                'opposition': 'Illusions, need for grounding',
                'square': 'Growth through overcoming confusion and escapism',
                'trine': 'Natural flow of artistic and spiritual inspiration',
                'sextile': 'Opportunities for creative expression and healing'
            },
            'PLUTO': {
                'conjunction': 'Transformation, power, rebirth, intensity, and depth',
                'opposition': 'Power struggles, need for empowerment',
                'square': 'Growth through profound transformation',
                'trine': 'Natural flow of deep psychological insight',
                'sextile': 'Opportunities for healing and personal evolution'
            }
        };

        return descriptions[planet]?.[aspectType] || `${planet} ${aspectType} influence`;
    }
}
```

### Geographic Coordinate Conversion

```javascript
/**
 * Convert planetary longitude to geographic coordinates
 */
function planetaryLongitudeToGeoCoordinates(longitude, latitude = null) {
    // For vertical lines, longitude maps directly to geographic longitude
    // For horizontal lines (parallels), we need latitude calculation

    if (latitude === null) {
        // Vertical line - same longitude everywhere
        return {
            longitude: longitude,
            latitude: null, // Represents all latitudes
            type: 'meridian'
        };
    } else {
        // Horizontal line - parallel of latitude
        return {
            longitude: null, // Represents all longitudes
            latitude: latitude,
            type: 'parallel'
        };
    }
}

/**
 * Calculate distance from birth location to planetary line
 */
function calculateLineDistance(birthLat, birthLon, lineLat, lineLon) {
    if (lineLat === null) {
        // Vertical line - calculate longitudinal distance
        let distance = Math.abs(lineLon - birthLon);
        if (distance > 180) distance = 360 - distance;
        return distance;
    } else if (lineLon === null) {
        // Horizontal line - calculate latitudinal distance
        return Math.abs(lineLat - birthLat);
    } else {
        // Point location - calculate great circle distance
        return calculateGreatCircleDistance(birthLat, birthLon, lineLat, lineLon);
    }
}

/**
 * Calculate great circle distance between two points
 */
function calculateGreatCircleDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = degToRad(lat2 - lat1);
    const dLon = degToRad(lon2 - lon1);

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) *
              Math.sin(dLon/2) * Math.sin(dLon/2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    return distance;
}

/**
 * Convert degrees to radians
 */
function degToRad(degrees) {
    return degrees * (Math.PI / 180);
}

/**
 * Calculate Julian Day from date
 */
function calculateJulianDayFromDate(date) {
    const a = Math.floor((14 - (date.getMonth() + 1)) / 12);
    const y = date.getFullYear() + 4800 - a;
    const m = (date.getMonth() + 1) + 12 * a - 3;

    return date.getDate() + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

/**
 * Calculate Greenwich Mean Sidereal Time
 */
function calculateGMST(julianDay) {
    const T = (julianDay - 2451545.0) / 36525.0;
    const gmst = 18.697374558 + 8640184.812866 * T + 0.093104 * T * T - 6.2e-6 * T * T * T;
    return gmst % 24; // hours
}

/**
 * Calculate rising sign (ascendant) for given LST and latitude
 */
function calculateRisingSign(lst, latitude) {
    // Simplified calculation - in practice, use astronomical algorithms
    const obliquity = 23.439281; // obliquity of ecliptic
    const latRad = degToRad(latitude);
    const tanLat = Math.tan(latRad);
    const sinObl = Math.sin(degToRad(obliquity));

    const ascendant = Math.atan2(-Math.cos(degToRad(lst * 15)), sinObl * tanLat + Math.cos(degToRad(obliquity)));
    return normalizeAngle(radToDeg(ascendant));
}

/**
 * Convert radians to degrees
 */
function radToDeg(radians) {
    return radians * (180 / Math.PI);
}

/**
 * Normalize angle to 0-360 degrees
 */
function normalizeAngle(angle) {
    while (angle < 0) angle += 360;
    return angle % 360;
}

/**
 * Calculate Whole Sign houses
 */
function calculateWholeSignHouses(ascendant) {
    const houses = [];
    for (let i = 0; i < 12; i++) {
        houses.push((ascendant + i * 30) % 360);
    }
    return houses;
}

/**
 * Get house from longitude
 */
function getHouseFromLongitude(longitude, houses) {
    for (let i = 0; i < 12; i++) {
        const nextHouse = houses[(i + 1) % 12];
        if (longitude >= houses[i] && longitude < nextHouse) {
            return i + 1;
        }
    }
    return 12; // Default to 12th house
}

/**
 * Get house lord
 */
function getHouseLord(house, ascendant) {
    // Simplified - in Vedic astrology, house lords depend on ascendant sign
    const sign = Math.floor(ascendant / 30);
    const lords = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];
    return lords[(sign + house - 1) % 12];
}

/**
 * Calculate angularity
 */
function calculateAngularity(longitude, houses) {
    const angles = [houses[0], houses[3], houses[6], houses[9]]; // 1st, 4th, 7th, 10th
    let minDistance = 360;
    for (const angle of angles) {
        const distance = Math.min(Math.abs(longitude - angle), 360 - Math.abs(longitude - angle));
        minDistance = Math.min(minDistance, distance);
    }
    return minDistance;
}

/**
 * Get angle type
 */
function getAngleType(longitude, houses) {
    const angles = [
        { cusp: houses[0], type: 'ascendant' },
        { cusp: houses[3], type: 'imum coeli' },
        { cusp: houses[6], type: 'descendant' },
        { cusp: houses[9], type: 'midheaven' }
    ];

    let closest = { type: 'unknown', distance: 360 };
    for (const angle of angles) {
        const distance = Math.min(Math.abs(longitude - angle.cusp), 360 - Math.abs(longitude - angle.cusp));
        if (distance < closest.distance) {
            closest = { type: angle.type, distance };
        }
    }
    return closest.type;
}

/**
 * Get house change significance
 */
function getHouseChangeSignificance(planet, fromHouse, toHouse) {
    const significances = {
        'SUN': { 1: 'Identity and self-expression', 5: 'Creativity and children', 9: 'Spirituality and travel', 10: 'Career and authority' },
        'MOON': { 1: 'Emotional foundation', 4: 'Home and family', 7: 'Partnerships', 10: 'Public life' },
        // Add for other planets
    };
    return significances[planet]?.[toHouse] || `${planet} in house ${toHouse}`;
}
```

## 4. Relocation Chart Generation

### Relocation Algorithm

```javascript
class RelocationChartGenerator {
    constructor(birthChart) {
        this.birthChart = birthChart;
    }

    /**
     * Generate relocation chart for new location
     */
    generateRelocationChart(newLatitude, newLongitude, newTimezone = null) {
        // Adjust birth time for new timezone if provided
        const adjustedBirthTime = this.adjustBirthTimeForTimezone(newTimezone);

        // Calculate local sidereal time for new location
        const lst = this.calculateLocalSiderealTime(adjustedBirthTime, newLongitude);

        // Calculate new ascendant
        const newAscendant = this.calculateAscendant(lst, newLatitude);

        // Calculate new houses (using Whole Sign or Placidus)
        const newHouses = this.calculateHouses(newAscendant, newLatitude, newLongitude);

        // Planetary positions remain the same (geocentric)
        const planets = this.birthChart.planets;

        // Calculate new planetary house positions
        const relocatedPlanets = this.calculateRelocatedPlanets(planets, newHouses);

        return {
            originalChart: this.birthChart,
            relocationLocation: {
                latitude: newLatitude,
                longitude: newLongitude,
                timezone: newTimezone
            },
            adjustedBirthTime: adjustedBirthTime,
            ascendant: newAscendant,
            houses: newHouses,
            planets: relocatedPlanets,
            analysis: this.analyzeRelocationChanges(this.birthChart, relocatedPlanets, newHouses)
        };
    }

    /**
     * Adjust birth time for new timezone
     */
    adjustBirthTimeForTimezone(newTimezone) {
        if (!newTimezone) return this.birthChart.birthData.time;

        const birthTimezone = this.birthChart.birthData.timezone || 0;
        const timezoneDiff = newTimezone - birthTimezone;

        const adjustedTime = new Date(this.birthChart.birthData.time);
        adjustedTime.setHours(adjustedTime.getHours() + timezoneDiff);

        return adjustedTime;
    }

    /**
     * Calculate local sidereal time for new location
     */
    calculateLocalSiderealTime(time, longitude) {
        const julianDay = calculateJulianDayFromDate(time);
        const gmst = calculateGMST(julianDay);
        const lst = gmst + (longitude / 15.0); // 15 degrees per hour

        return normalizeAngle(lst * 15.0); // Convert back to degrees
    }

    /**
     * Calculate ascendant for new location
     */
    calculateAscendant(lst, latitude) {
        // Use astronomical calculation for rising sign
        return calculateRisingSign(lst, latitude);
    }

    /**
     * Calculate houses for new location
     */
    calculateHouses(ascendant, latitude, longitude) {
        // Use Whole Sign houses for Vedic compatibility
        return calculateWholeSignHouses(ascendant);
    }

    /**
     * Calculate new house positions for planets
     */
    calculateRelocatedPlanets(planets, houses) {
        const relocatedPlanets = {};

        for (const [planetName, planetData] of Object.entries(planets)) {
            const house = getHouseFromLongitude(planetData.longitude, houses);

            relocatedPlanets[planetName] = {
                ...planetData,
                house: house,
                houseLord: getHouseLord(house, ascendant),
                angularity: calculateAngularity(planetData.longitude, houses)
            };
        }

        return relocatedPlanets;
    }

    /**
     * Analyze changes from relocation
     */
    analyzeRelocationChanges(originalChart, relocatedPlanets, newHouses) {
        const changes = {
            houseChanges: {},
            angularPlanets: [],
            strengthenedPlanets: [],
            weakenedPlanets: []
        };

        for (const [planetName, planetData] of Object.entries(relocatedPlanets)) {
            const originalHouse = originalChart.planets[planetName].house;
            const newHouse = planetData.house;

            if (originalHouse !== newHouse) {
                changes.houseChanges[planetName] = {
                    from: originalHouse,
                    to: newHouse,
                    significance: this.getHouseChangeSignificance(planetName, originalHouse, newHouse)
                };
            }

            // Check for angularity
            if (planetData.angularity < 5) { // Within 5 degrees of angle
                changes.angularPlanets.push({
                    planet: planetName,
                    angle: this.getAngleType(planetData.longitude, newHouses),
                    strength: 1 - (planetData.angularity / 5)
                });
            }
        }

        return changes;
    }
}
```

## 5. Location Analysis Algorithms

### Location Scoring System

```javascript
class LocationAnalyzer {
    constructor(astroCartographyData, relocationData) {
        this.cartography = astroCartographyData;
        this.relocation = relocationData;
    }

    /**
     * Analyze a specific location for astrological compatibility
     */
    analyzeLocation(latitude, longitude, purpose = 'general') {
        const lineInfluences = this.calculateLineInfluences(latitude, longitude);
        const relocationScore = this.analyzeRelocationChart(latitude, longitude);
        const localFactors = this.calculateLocalFactors(latitude, longitude);

        const overallScore = this.calculateOverallScore(lineInfluences, relocationScore, localFactors, purpose);

        return {
            location: { latitude, longitude },
            purpose: purpose,
            lineInfluences: lineInfluences,
            relocationScore: relocationScore,
            localFactors: localFactors,
            overallScore: overallScore,
            recommendations: this.generateRecommendations(overallScore, purpose),
            bestTimes: this.calculateBestTimes(latitude, longitude)
        };
    }

    /**
     * Calculate influences from planetary lines at location
     */
    calculateLineInfluences(latitude, longitude) {
        const influences = {
            beneficial: [],
            challenging: [],
            neutral: [],
            totalScore: 0
        };

        for (const line of this.cartography.lines) {
            const distance = calculateLineDistance(latitude, longitude, line.latitude, line.longitude);
            const orb = this.getOrbOfInfluence(line.planet, line.type);

            if (distance <= orb) {
                const influence = {
                    planet: line.planet,
                    type: line.type,
                    distance: distance,
                    strength: line.strength * (1 - distance / orb),
                    description: line.description
                };

                if (this.isBeneficialInfluence(line.planet, line.type)) {
                    influences.beneficial.push(influence);
                    influences.totalScore += influence.strength;
                } else if (this.isChallengingInfluence(line.planet, line.type)) {
                    influences.challenging.push(influence);
                    influences.totalScore -= influence.strength * 0.5;
                } else {
                    influences.neutral.push(influence);
                }
            }
        }

        return influences;
    }

    /**
     * Get orb of influence for planetary line
     */
    getOrbOfInfluence(planet, lineType) {
        const baseOrbs = {
            'conjunction': 2.0,  // 2 degrees
            'opposition': 1.5,
            'trine': 1.0,
            'square': 1.0,
            'sextile': 0.8
        };

        // Adjust based on planet
        const planetMultipliers = {
            'SUN': 1.2,
            'MOON': 1.0,
            'MERCURY': 0.8,
            'VENUS': 1.0,
            'MARS': 1.1,
            'JUPITER': 1.3,
            'SATURN': 1.4,
            'URANUS': 1.2,
            'NEPTUNE': 1.1,
            'PLUTO': 1.5
        };

        return baseOrbs[lineType] * (planetMultipliers[planet] || 1.0);
    }

    /**
     * Analyze relocation chart for location
     */
    analyzeRelocationChart(latitude, longitude) {
        const relocationChart = this.relocation.generateRelocationChart(latitude, longitude);

        return {
            ascendantSign: Math.floor(relocationChart.ascendant / 30),
            angularPlanets: relocationChart.analysis.angularPlanets,
            houseChanges: relocationChart.analysis.houseChanges,
            score: this.scoreRelocationChart(relocationChart)
        };
    }

    /**
     * Calculate local astrological factors
     */
    calculateLocalFactors(latitude, longitude) {
        return {
            latitudeInfluence: this.analyzeLatitude(latitude),
            longitudeInfluence: this.analyzeLongitude(longitude),
            geomagneticFactors: this.calculateGeomagneticFactors(latitude, longitude),
            culturalFactors: this.analyzeCulturalFactors(latitude, longitude)
        };
    }

    /**
     * Check if influence is beneficial
     */
    isBeneficialInfluence(planet, type) {
        const beneficialAspects = ['trine', 'sextile'];
        const beneficialPlanets = ['JUPITER', 'VENUS'];
        return beneficialAspects.includes(type) || beneficialPlanets.includes(planet);
    }

    /**
     * Check if influence is challenging
     */
    isChallengingInfluence(planet, type) {
        const challengingAspects = ['opposition', 'square'];
        const challengingPlanets = ['SATURN', 'MARS', 'PLUTO'];
        return challengingAspects.includes(type) || challengingPlanets.includes(planet);
    }

    /**
     * Analyze latitude influence
     */
    analyzeLatitude(latitude) {
        if (latitude > 60) return { influence: 'cold', score: -10 };
        if (latitude < -60) return { influence: 'cold', score: -10 };
        if (Math.abs(latitude) < 30) return { influence: 'tropical', score: 5 };
        return { influence: 'temperate', score: 0 };
    }

    /**
     * Analyze longitude influence
     */
    analyzeLongitude(longitude) {
        // Simplified - could include cultural or geomagnetic analysis
        return { influence: 'neutral', score: 0 };
    }

    /**
     * Calculate geomagnetic factors
     */
    calculateGeomagneticFactors(latitude, longitude) {
        // Simplified geomagnetic field strength approximation
        const geomagneticScore = Math.cos(degToRad(Math.abs(latitude))) * 10;
        return { strength: geomagneticScore, score: geomagneticScore > 5 ? 2 : 0 };
    }

    /**
     * Analyze cultural factors
     */
    analyzeCulturalFactors(latitude, longitude) {
        // Placeholder for cultural analysis
        return { factors: [], score: 0 };
    }

    /**
     * Score relocation chart
     */
    scoreRelocationChart(relocationChart) {
        let score = 50; // Base score
        score += relocationChart.analysis.angularPlanets.length * 5;
        score -= relocationChart.analysis.houseChanges.length * 2;
        return Math.max(0, Math.min(100, score));
    }

    /**
     * Get purpose multiplier
     */
    getPurposeMultiplier(purpose) {
        const multipliers = {
            'career': 1.2,
            'relationship': 1.1,
            'health': 1.3,
            'spiritual': 1.4,
            'general': 1.0
        };
        return multipliers[purpose] || 1.0;
    }

    /**
     * Calculate overall location score
     */
    calculateOverallScore(lineInfluences, relocationScore, localFactors, purpose) {
        const weights = {
            lineInfluences: 0.4,
            relocationScore: 0.4,
            localFactors: 0.2
        };

        let score = 0;
        score += lineInfluences.totalScore * weights.lineInfluences;
        score += relocationScore.score * weights.relocationScore;
        score += localFactors.latitudeInfluence.score * weights.localFactors;
        score += localFactors.geomagneticFactors.score * weights.localFactors;

        // Adjust for purpose
        score *= this.getPurposeMultiplier(purpose);

        return Math.max(0, Math.min(100, score * 25)); // Scale to 0-100
    }
}
```

## 6. Counseling Recommendation Engine

### Recommendation Generation

```javascript
class CounselingEngine {
    constructor() {
        this.recommendations = [];
    }

    /**
     * Generate comprehensive counseling recommendations
     */
    generateCounseling(locationAnalysis, userProfile) {
        const recommendations = {
            immediate: [],
            shortTerm: [],
            longTerm: [],
            precautions: [],
            optimalTiming: []
        };

        // Analyze line influences
        const lineRecommendations = this.analyzeLineInfluences(locationAnalysis.lineInfluences);
        recommendations.immediate.push(...lineRecommendations.immediate);
        recommendations.precautions.push(...lineRecommendations.precautions);

        // Analyze relocation factors
        const relocationRecommendations = this.analyzeRelocationFactors(locationAnalysis.relocationScore);
        recommendations.shortTerm.push(...relocationRecommendations.shortTerm);
        recommendations.longTerm.push(...relocationRecommendations.longTerm);

        // Generate timing recommendations
        recommendations.optimalTiming = this.generateTimingRecommendations(locationAnalysis.bestTimes);

        // Personalize based on user profile
        const personalizedRecommendations = this.personalizeRecommendations(recommendations, userProfile);

        return {
            recommendations: personalizedRecommendations,
            summary: this.generateSummary(locationAnalysis),
            actionPlan: this.createActionPlan(personalizedRecommendations)
        };
    }

    /**
     * Check if influence is beneficial
     */
    isBeneficialInfluence(planet, type) {
        const beneficialAspects = ['trine', 'sextile'];
        const beneficialPlanets = ['JUPITER', 'VENUS'];
        return beneficialAspects.includes(type) || beneficialPlanets.includes(planet);
    }

    /**
     * Get planet purpose
     */
    getPlanetPurpose(planet) {
        const purposes = {
            'SUN': 'leadership and self-expression',
            'MOON': 'emotional well-being and family',
            'MERCURY': 'communication and learning',
            'VENUS': 'relationships and finances',
            'MARS': 'action and physical activity',
            'JUPITER': 'expansion and spirituality',
            'SATURN': 'discipline and career',
            'URANUS': 'innovation and freedom',
            'NEPTUNE': 'creativity and intuition',
            'PLUTO': 'transformation and power'
        };
        return purposes[planet] || 'personal growth';
    }

    /**
     * Get beneficial action
     */
    getBeneficialAction(planet, type) {
        const actions = {
            'SUN': 'Take leadership roles and express your authentic self',
            'VENUS': 'Focus on relationships and creative pursuits',
            'JUPITER': 'Expand your horizons through travel or learning'
        };
        return actions[planet] || 'Embrace the positive energy for growth';
    }

    /**
     * Get challenge description
     */
    getChallengeDescription(planet) {
        const descriptions = {
            'MARS': 'increased conflict or aggression',
            'SATURN': 'challenges with authority or limitations',
            'PLUTO': 'intense transformation or power struggles'
        };
        return descriptions[planet] || 'challenging situations';
    }

    /**
     * Get remedy for challenge
     */
    getRemedyForChallenge(planet, type) {
        const remedies = {
            'MARS': 'Practice patience and channel energy constructively',
            'SATURN': 'Focus on discipline and long-term planning',
            'PLUTO': 'Embrace change and seek deep understanding'
        };
        return remedies[planet] || 'Seek balance and self-awareness';
    }

    /**
     * Analyze planetary line influences for recommendations
     */
    analyzeLineInfluences(lineInfluences) {
        const recommendations = {
            immediate: [],
            precautions: []
        };

        // Beneficial lines
        for (const influence of lineInfluences.beneficial) {
            if (influence.strength > 0.7) {
                recommendations.immediate.push({
                    type: 'opportunity',
                    planet: influence.planet,
                    aspect: influence.type,
                    message: `Strong ${influence.planet} ${influence.type} line - excellent for ${this.getPlanetPurpose(influence.planet)}`,
                    action: this.getBeneficialAction(influence.planet, influence.type)
                });
            }
        }

        // Challenging lines
        for (const influence of lineInfluences.challenging) {
            if (influence.strength > 0.6) {
                recommendations.precautions.push({
                    type: 'caution',
                    planet: influence.planet,
                    aspect: influence.type,
                    message: `Challenging ${influence.planet} ${influence.type} influence - be prepared for ${this.getChallengeDescription(influence.planet)}`,
                    remedy: this.getRemedyForChallenge(influence.planet, influence.type)
                });
            }
        }

        return recommendations;
    }

    /**
     * Get angular benefit
     */
    getAngularBenefit(planet) {
        const benefits = {
            'SUN': 'leadership and vitality',
            'MOON': 'emotional expression',
            'MARS': 'energy and drive',
            'SATURN': 'discipline and structure'
        };
        return benefits[planet] || 'personal power';
    }

    /**
     * Analyze relocation chart factors
     */
    analyzeRelocationFactors(relocationScore) {
        const recommendations = {
            shortTerm: [],
            longTerm: []
        };

        // Angular planets
        for (const angular of relocationScore.angularPlanets) {
            if (angular.strength > 0.8) {
                recommendations.shortTerm.push({
                    type: 'strength',
                    planet: angular.planet,
                    message: `${angular.planet} is strongly angular - enhanced ${this.getAngularBenefit(angular.planet)}`,
                    duration: '3-6 months'
                });
            }
        }

        // House changes
        for (const [planet, change] of Object.entries(relocationScore.houseChanges)) {
            recommendations.longTerm.push({
                type: 'transition',
                planet: planet,
                message: `${planet} moves from house ${change.from} to ${change.to} - ${change.significance}`,
                duration: '6-12 months'
            });
        }

        return recommendations;
    }

    /**
     * Get recommended activities
     */
    getRecommendedActivities(strength) {
        if (strength > 0.8) return ['Major decisions', 'New beginnings', 'Travel'];
        if (strength > 0.6) return ['Important meetings', 'Career moves', 'Relationships'];
        return ['Routine activities', 'Planning', 'Preparation'];
    }

    /**
     * Generate timing recommendations
     */
    generateTimingRecommendations(bestTimes) {
        return bestTimes.map(time => ({
            period: time.period,
            strength: time.strength,
            activities: this.getRecommendedActivities(time.strength),
            description: `Favorable period for ${time.period} with ${Math.round(time.strength * 100)}% strength`
        }));
    }

    /**
     * Personalize recommendations based on user profile
     */
    personalizeRecommendations(recommendations, userProfile) {
        // Adjust based on user's goals, current life situation, etc.
        const personalized = { ...recommendations };

        if (userProfile.careerFocus) {
            // Add career-specific recommendations
            personalized.immediate.unshift({
                type: 'career',
                message: 'Focus on career development during this relocation',
                priority: 'high'
            });
        }

        if (userProfile.relationshipStatus) {
            // Add relationship-specific advice
            personalized.shortTerm.push({
                type: 'relationships',
                message: 'Pay attention to relationship dynamics in new location',
                priority: 'medium'
            });
        }

        return personalized;
    }

    /**
     * Create actionable plan
     */
    createActionPlan(recommendations) {
        return {
            immediate: recommendations.immediate.slice(0, 3),
            weekly: recommendations.shortTerm.slice(0, 2),
            monthly: recommendations.longTerm.slice(0, 2),
            ongoing: recommendations.precautions
        };
    }
}
```

## 7. Implementation Architecture

### Core Components

1. **AstroCartographyCalculator**: Calculates planetary lines and their influences
2. **RelocationChartGenerator**: Generates charts for different locations
3. **LocationAnalyzer**: Analyzes specific locations for compatibility
4. **CounselingEngine**: Generates personalized recommendations
5. **GeographicDatabase**: Stores location data and cultural factors
6. **TimingCalculator**: Determines optimal timing for moves

### Data Flow

```
Birth Chart Input
        ↓
Calculate Planetary Lines (Astro-cartography)
        ↓
Generate Relocation Charts for Target Locations
        ↓
Analyze Location Compatibility
        ↓
Generate Counseling Recommendations
        ↓
Output: Comprehensive Relocation Report
```

## 8. API Specifications

### REST API Endpoints

All endpoints require JWT authentication via Authorization header: `Bearer <token>`

```javascript
// Calculate astro-cartography for birth chart
POST /api/v1/astro-cartography
Authorization: Bearer <jwt_token>
{
    "birthChart": { /* birth chart data */ },
    "options": {
        "includeParallels": true,
        "lineTypes": ["conjunction", "opposition", "trine"],
        "orbSize": 2.0
    }
}

// Generate relocation chart
POST /api/v1/relocation/chart
{
    "birthChart": { /* birth chart data */ },
    "location": {
        "latitude": 40.7128,
        "longitude": -74.0060,
        "timezone": -5
    }
}

// Analyze location compatibility
POST /api/v1/location/analysis
{
    "birthChart": { /* birth chart data */ },
    "location": {
        "latitude": 40.7128,
        "longitude": -74.0060
    },
    "purpose": "career",
    "userProfile": { /* optional user data */ }
}

// Get counseling recommendations
GET /api/v1/counseling/recommendations/:analysisId
```

### Response Format

```json
{
    "analysisId": "uuid",
    "location": {
        "latitude": 40.7128,
        "longitude": -74.0060,
        "name": "New York City"
    },
    "astroCartography": {
        "lines": [...],
        "influences": {
            "beneficial": [...],
            "challenging": [...],
            "score": 75
        }
    },
    "relocationChart": {
        "ascendant": 120.5,
        "houses": [...],
        "planets": {...},
        "analysis": {...}
    },
    "counseling": {
        "overallScore": 82,
        "recommendations": {
            "immediate": [...],
            "shortTerm": [...],
            "longTerm": [...],
            "precautions": [...]
        },
        "optimalTiming": [...],
        "actionPlan": {...}
    },
    "confidence": 0.95
}
```

## 9. Database Schema

### Tables

```sql
-- Astro-cartography analyses
CREATE TABLE astro_cartography_analyses (
    id UUID PRIMARY KEY,
    birth_chart_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for astro_cartography_analyses
CREATE INDEX idx_astro_analyses_birth_chart ON astro_cartography_analyses(birth_chart_id);
CREATE INDEX idx_astro_analyses_created ON astro_cartography_analyses(created_at);

-- Planetary lines
CREATE TABLE planetary_lines (
    id UUID PRIMARY KEY,
    analysis_id UUID REFERENCES astro_cartography_analyses(id),
    planet VARCHAR(20),
    line_type VARCHAR(20),
    longitude DECIMAL(7,4),
    latitude DECIMAL(7,4),
    influence_type VARCHAR(20),
    strength DECIMAL(3,2),
    description TEXT
);

-- Indexes for planetary_lines
CREATE INDEX idx_planetary_lines_analysis ON planetary_lines(analysis_id);
CREATE INDEX idx_planetary_lines_longitude ON planetary_lines(longitude);
CREATE INDEX idx_planetary_lines_planet ON planetary_lines(planet);

-- Relocation analyses
CREATE TABLE relocation_analyses (
    id UUID PRIMARY KEY,
    birth_chart_id UUID NOT NULL,
    location_name VARCHAR(100),
    latitude DECIMAL(8,5),
    longitude DECIMAL(8,5),
    timezone_offset INTEGER,
    analysis_date TIMESTAMP DEFAULT NOW()
);

-- Location compatibility scores
CREATE TABLE location_compatibility (
    id UUID PRIMARY KEY,
    relocation_id UUID REFERENCES relocation_analyses(id),
    purpose VARCHAR(50),
    line_score DECIMAL(5,2),
    relocation_score DECIMAL(5,2),
    local_score DECIMAL(5,2),
    overall_score DECIMAL(5,2),
    recommendation TEXT
);

-- Counseling recommendations
CREATE TABLE counseling_recommendations (
    id UUID PRIMARY KEY,
    compatibility_id UUID REFERENCES location_compatibility(id),
    recommendation_type VARCHAR(20),
    priority VARCHAR(10),
    message TEXT,
    action_plan JSONB,
    timeframe VARCHAR(20)
);
```

## 10. Testing and Validation

### Unit Tests

```javascript
describe('AstroCartographyCalculator', () => {
    test('should calculate Sun conjunction line correctly', () => {
        const birthChart = createTestBirthChart();
        const calculator = new AstroCartographyCalculator(birthChart);

        const lines = calculator.calculatePlanetLines('SUN', birthChart.planets.SUN);

        expect(lines).toHaveLength(6); // conjunction, opposition, 2 squares, 2 trines
        expect(lines[0].type).toBe('conjunction');
        expect(lines[0].longitude).toBe(birthChart.planets.SUN.longitude);
    });

    test('should generate valid relocation chart', () => {
        const birthChart = createTestBirthChart();
        const generator = new RelocationChartGenerator(birthChart);

        const relocationChart = generator.generateRelocationChart(40.7128, -74.0060);

        expect(relocationChart.ascendant).toBeDefined();
        expect(relocationChart.houses).toHaveLength(12);
        expect(relocationChart.planets).toBeDefined();
    });
});

describe('LocationAnalyzer', () => {
    test('should analyze location with multiple line influences', () => {
        const cartographyData = createTestCartographyData();
        const relocationData = createTestRelocationData();
        const analyzer = new LocationAnalyzer(cartographyData, relocationData);

        const analysis = analyzer.analyzeLocation(40.7128, -74.0060, 'career');

        expect(analysis.overallScore).toBeGreaterThanOrEqual(0);
        expect(analysis.overallScore).toBeLessThanOrEqual(100);
        expect(analysis.lineInfluences).toBeDefined();
        expect(analysis.relocationScore).toBeDefined();
    });

    test('should handle invalid coordinates', () => {
        const analyzer = new LocationAnalyzer({}, {});

        expect(() => analyzer.analyzeLocation(91, 0)).toThrow('Invalid latitude');
        expect(() => analyzer.analyzeLocation(0, 181)).toThrow('Invalid longitude');
    });

    test('should calculate line influences correctly', () => {
        const cartographyData = createTestCartographyData();
        const analyzer = new LocationAnalyzer(cartographyData, {});

        const influences = analyzer.calculateLineInfluences(40.7128, -74.0060);

        expect(influences.beneficial).toBeDefined();
        expect(influences.challenging).toBeDefined();
        expect(influences.totalScore).toBeGreaterThanOrEqual(0);
    });

    test('should apply purpose multipliers', () => {
        const analyzer = new LocationAnalyzer({}, {});

        expect(analyzer.getPurposeMultiplier('career')).toBe(1.2);
        expect(analyzer.getPurposeMultiplier('health')).toBe(1.3);
        expect(analyzer.getPurposeMultiplier('unknown')).toBe(1.0);
    });
});
```

### Validation Criteria

- **Line Calculations**: Planetary lines within 0.1° accuracy
- **Relocation Charts**: House cusps within 1° accuracy
- **Location Scores**: Scores between 0-100 with logical distribution
- **Recommendation Generation**: Relevant recommendations for different purposes
- **Timing Calculations**: Accurate best time periods

### Integration Tests

- Test with real birth charts and known favorable locations
- Validate against professional astrologer assessments
- Performance testing with multiple location analyses
- Cross-platform compatibility testing

## Conclusion

This implementation provides a comprehensive astro-cartography and relocation counseling system that combines traditional astrological principles with modern computational methods. The modular architecture allows for easy integration with existing astrology systems and provides detailed analysis for location-based astrological counseling.

The system enables users to make informed decisions about travel, relocation, and life changes based on their unique astrological blueprint and geographical influences.