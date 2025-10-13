# ZC3.4 Aspects and Their Interpretations

## Overview

This document provides a comprehensive implementation guide for ZC3.4 Aspects and Their Interpretations, incorporating all necessary mathematical foundations, algorithms, and technical specifications for accurate aspect calculations and interpretations in Western astrology. The implementation covers major and minor aspects, aspect calculation algorithms, interpretation frameworks, planetary combinations, aspect patterns, and complete code examples for the ZodiaCore system.

## Table of Contents

1. [Introduction](#introduction)
2. [Mathematical Foundations](#mathematical-foundations)
3. [Major Aspects](#major-aspects)
4. [Minor Aspects](#minor-aspects)
5. [Aspect Calculation Algorithms](#aspect-calculation-algorithms)
6. [Interpretation Frameworks](#interpretation-frameworks)
7. [Planetary Combinations and Effects](#planetary-combinations)
8. [Aspect Patterns and Configurations](#aspect-patterns)
9. [Complete Implementation Code](#implementation-code)
10. [Technical Specifications](#technical-specifications)
11. [Testing and Validation](#testing-validation)
12. [Ethical Considerations](#ethical-considerations)
13. [References](#references)

---

## Change Log

### Version 1.0 (2025-10-08)
- Initial implementation guide for Western astrology aspects
- Added comprehensive mathematical foundations for aspect calculations
- Included detailed algorithms and formulas for major and minor aspects
- Implemented complete aspect calculator with unit tests
- Added technical specifications and performance benchmarks
- Included ethical considerations for aspect interpretations

---

## 1. Introduction {#introduction}

### What are Aspects in Western Astrology?

Aspects in Western astrology are angular relationships between celestial bodies (planets, luminaries, and points) as seen from Earth. These relationships create energetic connections that influence how planetary energies interact and manifest in a person's life, personality, and experiences. Aspects are fundamental to chart interpretation, revealing the dynamics between different life areas and psychological drives.

### Key Components

1. **Aspect Angle**: The geometric angle between two celestial bodies
2. **Orb**: The allowable deviation from the exact aspect angle
3. **Aspect Type**: Major (conjunction, sextile, square, trine, opposition) or minor aspects
4. **Applying/Separating**: Whether the aspect is forming or dissolving
5. **Strength**: Determined by orb size, planetary dignity, and chart context

### Major vs Minor Aspects

Western astrology distinguishes between major and minor aspects based on their traditional importance and frequency:

- **Major Aspects**: Most influential, occur frequently, form the foundation of chart interpretation
- **Minor Aspects**: Less common, more subtle influences, require tighter orbs

### Implementation Requirements

- **Astronomical Accuracy**: Precise calculation of planetary longitudes and angular separations
- **Orb Management**: Configurable orbs for different aspect types and chart types
- **Multiple Algorithms**: Support for aspect detection, strength calculation, and interpretation
- **High Precision**: ±0.1 degree accuracy for aspect angles
- **Performance**: Fast calculations for real-time chart analysis

---

## 2. Mathematical Foundations {#mathematical-foundations}

### Core Mathematical Constants

```javascript
const ASPECT_CONSTANTS = {
    // Aspect Angles (in degrees)
    CONJUNCTION: 0,
    SEMI_SEXTILE: 30,
    SEMI_SQUARE: 45,
    SEXTILE: 60,
    SQUARE: 90,
    TRINE: 120,
    SESQUI_SQUARE: 135,
    QUINCUNX: 150,
    OPPOSITION: 180,

    // Default Orbs (in degrees)
    MAJOR_ORB: 8.0,
    MINOR_ORB: 2.0,
    CONJUNCTION_ORB: 10.0,
    OPPOSITION_ORB: 10.0,

    // Aspect Types
    MAJOR_ASPECTS: ['conjunction', 'sextile', 'square', 'trine', 'opposition'],
    MINOR_ASPECTS: ['semi-sextile', 'semi-square', 'sesqui-square', 'quincunx'],

    // Planetary Constants
    PLANETS: ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'],
    LUMINARIES: ['sun', 'moon'],
    PERSONAL_PLANETS: ['sun', 'moon', 'mercury', 'venus', 'mars'],
    SOCIAL_PLANETS: ['jupiter', 'saturn'],
    TRANSPERSONAL_PLANETS: ['uranus', 'neptune', 'pluto'],

    // Mathematical Constants
    DEGREES_PER_CIRCLE: 360.0,
    MAX_ORB: 15.0,
    MIN_ORB: 0.5
};

const ASPECT_TYPES = {
    CONJUNCTION: 'conjunction',
    SEMI_SEXTILE: 'semi-sextile',
    SEMI_SQUARE: 'semi-square',
    SEXTILE: 'sextile',
    SQUARE: 'square',
    TRINE: 'trine',
    SESQUI_SQUARE: 'sesqui-square',
    QUINCUNX: 'quincunx',
    OPPOSITION: 'opposition'
};
```

### Essential Mathematical Functions

```javascript
/**
 * Calculate the angular distance between two longitudes (shortest path)
 */
function angularDistance(lon1, lon2) {
    let diff = Math.abs(lon1 - lon2);
    return Math.min(diff, 360 - diff);
}

/**
 * Calculate angular separation considering direction
 */
function angularSeparation(fromLon, toLon) {
    let diff = toLon - fromLon;
    while (diff < 0) diff += 360;
    while (diff >= 360) diff -= 360;
    return diff;
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
 * Check if two angles are within orb of each other
 */
function withinOrb(angle1, angle2, orb) {
    return angularDistance(angle1, angle2) <= orb;
}

/**
 * Calculate aspect strength based on orb
 */
function calculateAspectStrength(exactAngle, actualSeparation, maxOrb) {
    const orbUsed = angularDistance(exactAngle, actualSeparation);
    return Math.max(0, (maxOrb - orbUsed) / maxOrb);
}

/**
 * Determine if aspect is applying or separating
 */
function isApplying(planet1Speed, planet2Speed, separation) {
    // Simplified: if faster planet is moving toward slower one
    const avgSpeed = (planet1Speed + planet2Speed) / 2;
    return planet1Speed > avgSpeed && separation < 180;
}
```

---

## 3. Major Aspects {#major-aspects}

### Conjunction (0°)

#### Overview
The conjunction occurs when two planets are at the same longitude, creating a merger of their energies. This is the most powerful aspect, amplifying both planets' influences.

#### Mathematical Foundation
- **Exact Angle**: 0°
- **Default Orb**: 10° (widest orb due to power)
- **Strength**: Maximum when exact, decreases with separation

#### Algorithm

```javascript
/**
 * Check for conjunction aspect
 */
function checkConjunction(lon1, lon2, orb = ASPECT_CONSTANTS.CONJUNCTION_ORB) {
    const separation = angularDistance(lon1, lon2);
    if (separation <= orb) {
        return {
            type: ASPECT_TYPES.CONJUNCTION,
            angle: 0,
            separation: separation,
            strength: calculateAspectStrength(0, separation, orb),
            exact: separation === 0
        };
    }
    return null;
}
```

#### Interpretation Framework
- **Energy**: Fusion, unity, intensification
- **Personality**: Amplified traits of both planets
- **Life Areas**: Combined planetary domains
- **Challenges**: Overwhelm, lack of balance
- **Strengths**: Focus, power, synthesis

### Sextile (60°)

#### Overview
The sextile creates a harmonious connection between planets in compatible elements, offering opportunities for growth and cooperation.

#### Mathematical Foundation
- **Exact Angle**: 60°
- **Default Orb**: 6°
- **Elements**: Fire-Air, Earth-Water compatibility

#### Algorithm

```javascript
/**
 * Check for sextile aspect
 */
function checkSextile(lon1, lon2, orb = ASPECT_CONSTANTS.MAJOR_ORB) {
    const angles = [60, 300]; // 60° and 300° (360-60)
    for (const angle of angles) {
        const separation = angularDistance(lon1, lon2);
        const diff = angularDistance(angle, separation);
        if (diff <= orb) {
            return {
                type: ASPECT_TYPES.SEXTILE,
                angle: angle,
                separation: separation,
                strength: calculateAspectStrength(angle, separation, orb),
                exact: diff === 0
            };
        }
    }
    return null;
}
```

#### Interpretation Framework
- **Energy**: Opportunity, cooperation, ease
- **Personality**: Natural talents, social skills
- **Life Areas**: Learning, communication, relationships
- **Challenges**: Complacency, missed opportunities
- **Strengths**: Balance, adaptability, growth

### Square (90°)

#### Overview
The square creates tension between planets in incompatible elements, driving action and transformation through conflict.

#### Mathematical Foundation
- **Exact Angle**: 90°
- **Default Orb**: 8°
- **Elements**: All element combinations except sextile/trine

#### Algorithm

```javascript
/**
 * Check for square aspect
 */
function checkSquare(lon1, lon2, orb = ASPECT_CONSTANTS.MAJOR_ORB) {
    const angles = [90, 270]; // 90° and 270°
    for (const angle of angles) {
        const separation = angularDistance(lon1, lon2);
        const diff = angularDistance(angle, separation);
        if (diff <= orb) {
            return {
                type: ASPECT_TYPES.SQUARE,
                angle: angle,
                separation: separation,
                strength: calculateAspectStrength(angle, separation, orb),
                exact: diff === 0
            };
        }
    }
    return null;
}
```

#### Interpretation Framework
- **Energy**: Tension, conflict, action
- **Personality**: Drive, determination, challenges
- **Life Areas**: Crisis, transformation, achievement
- **Challenges**: Frustration, resistance, burnout
- **Strengths**: Motivation, growth, resilience

### Trine (120°)

#### Overview
The trine creates flowing harmony between planets in the same element, providing natural talents and ease.

#### Mathematical Foundation
- **Exact Angle**: 120°
- **Default Orb**: 8°
- **Elements**: Fire-Fire, Earth-Earth, Air-Air, Water-Water

#### Algorithm

```javascript
/**
 * Check for trine aspect
 */
function checkTrine(lon1, lon2, orb = ASPECT_CONSTANTS.MAJOR_ORB) {
    const angles = [120, 240]; // 120° and 240°
    for (const angle of angles) {
        const separation = angularDistance(lon1, lon2);
        const diff = angularDistance(angle, separation);
        if (diff <= orb) {
            return {
                type: ASPECT_TYPES.TRINE,
                angle: angle,
                separation: separation,
                strength: calculateAspectStrength(angle, separation, orb),
                exact: diff === 0
            };
        }
    }
    return null;
}
```

#### Interpretation Framework
- **Energy**: Harmony, flow, talent
- **Personality**: Natural abilities, confidence
- **Life Areas**: Success, creativity, relationships
- **Challenges**: Complacency, lack of motivation
- **Strengths**: Ease, creativity, stability

### Opposition (180°)

#### Overview
The opposition creates awareness through contrast, balancing complementary energies across the zodiac.

#### Mathematical Foundation
- **Exact Angle**: 180°
- **Default Orb**: 10°
- **Polarity**: Yang-Yin, conscious-unconscious balance

#### Algorithm

```javascript
/**
 * Check for opposition aspect
 */
function checkOpposition(lon1, lon2, orb = ASPECT_CONSTANTS.OPPOSITION_ORB) {
    const separation = angularDistance(lon1, lon2);
    const diff = angularDistance(180, separation);
    if (diff <= orb) {
        return {
            type: ASPECT_TYPES.OPPOSITION,
            angle: 180,
            separation: separation,
            strength: calculateAspectStrength(180, separation, orb),
            exact: diff === 0
        };
    }
    return null;
}
```

#### Interpretation Framework
- **Energy**: Awareness, balance, integration
- **Personality**: Relationships, projection, growth
- **Life Areas**: Partnerships, self-awareness, choices
- **Challenges**: Conflict, indecision, extremes
- **Strengths**: Balance, awareness, cooperation

---

## 4. Minor Aspects {#minor-aspects}

### Semi-Sextile (30°)

#### Overview
The semi-sextile creates subtle adjustments between adjacent signs, offering minor opportunities for growth.

#### Mathematical Foundation
- **Exact Angle**: 30°
- **Default Orb**: 2°
- **Sign Relationship**: Adjacent signs

### Semi-Square (45°)

#### Overview
The semi-square creates mild tension, encouraging small adjustments and learning experiences.

#### Mathematical Foundation
- **Exact Angle**: 45°
- **Default Orb**: 2°
- **Element Relationship**: Mixed elements

### Sesqui-Square (135°)

#### Overview
The sesqui-square combines square and semi-square energies, creating persistent but manageable challenges.

#### Mathematical Foundation
- **Exact Angle**: 135°
- **Default Orb**: 2°
- **Complex Relationship**: Square + semi-square

### Quincunx (150°)

#### Overview
The quincunx creates adjustment needs between incompatible elements, requiring conscious integration.

#### Mathematical Foundation
- **Exact Angle**: 150°
- **Default Orb**: 2°
- **Element Relationship**: Incompatible elements

---

## 5. Aspect Calculation Algorithms {#aspect-calculation-algorithms}

### Complete Aspect Detection Algorithm

```javascript
/**
 * Find all aspects between two planets
 */
function findAspectsBetweenPlanets(planet1, planet2, customOrbs = {}) {
    const aspects = [];
    const lon1 = planet1.longitude;
    const lon2 = planet2.longitude;

    // Define aspect checkers with their angles and default orbs
    const aspectCheckers = [
        { type: ASPECT_TYPES.CONJUNCTION, checker: checkConjunction, orb: customOrbs.conjunction || ASPECT_CONSTANTS.CONJUNCTION_ORB },
        { type: ASPECT_TYPES.SEXTILE, checker: checkSextile, orb: customOrbs.sextile || ASPECT_CONSTANTS.MAJOR_ORB },
        { type: ASPECT_TYPES.SQUARE, checker: checkSquare, orb: customOrbs.square || ASPECT_CONSTANTS.MAJOR_ORB },
        { type: ASPECT_TYPES.TRINE, checker: checkTrine, orb: customOrbs.trine || ASPECT_CONSTANTS.MAJOR_ORB },
        { type: ASPECT_TYPES.OPPOSITION, checker: checkOpposition, orb: customOrbs.opposition || ASPECT_CONSTANTS.OPPOSITION_ORB },
        { type: ASPECT_TYPES.SEMI_SEXTILE, checker: (lon1, lon2, orb) => checkMinorAspect(lon1, lon2, 30, orb), orb: customOrbs['semi-sextile'] || ASPECT_CONSTANTS.MINOR_ORB },
        { type: ASPECT_TYPES.SEMI_SQUARE, checker: (lon1, lon2, orb) => checkMinorAspect(lon1, lon2, 45, orb), orb: customOrbs['semi-square'] || ASPECT_CONSTANTS.MINOR_ORB },
        { type: ASPECT_TYPES.SESQUI_SQUARE, checker: (lon1, lon2, orb) => checkMinorAspect(lon1, lon2, 135, orb), orb: customOrbs['sesqui-square'] || ASPECT_CONSTANTS.MINOR_ORB },
        { type: ASPECT_TYPES.QUINCUNX, checker: (lon1, lon2, orb) => checkMinorAspect(lon1, lon2, 150, orb), orb: customOrbs.quincunx || ASPECT_CONSTANTS.MINOR_ORB }
    ];

    for (const { type, checker, orb } of aspectCheckers) {
        const aspect = checker(lon1, lon2, orb);
        if (aspect) {
            aspects.push({
                ...aspect,
                planets: [planet1.name, planet2.name],
                applying: isApplying(planet1.speed, planet2.speed, aspect.separation)
            });
        }
    }

    return aspects;
}

/**
 * Check for minor aspect
 */
function checkMinorAspect(lon1, lon2, targetAngle, orb) {
    const separation = angularDistance(lon1, lon2);
    const diff = angularDistance(targetAngle, separation);
    if (diff <= orb) {
        return {
            type: getAspectTypeFromAngle(targetAngle),
            angle: targetAngle,
            separation: separation,
            strength: calculateAspectStrength(targetAngle, separation, orb),
            exact: diff === 0
        };
    }
    return null;
}

/**
 * Get aspect type from angle
 */
function getAspectTypeFromAngle(angle) {
    const normalized = normalizeAngle(angle);
    switch (normalized) {
        case 30: return ASPECT_TYPES.SEMI_SEXTILE;
        case 45: return ASPECT_TYPES.SEMI_SQUARE;
        case 135: return ASPECT_TYPES.SESQUI_SQUARE;
        case 150: return ASPECT_TYPES.QUINCUNX;
        default: return 'unknown';
    }
}
```

### Batch Aspect Calculation

```javascript
/**
 * Calculate all aspects in a chart
 */
function calculateAllAspects(planets, customOrbs = {}) {
    const aspects = [];

    for (let i = 0; i < planets.length; i++) {
        for (let j = i + 1; j < planets.length; j++) {
            const planetAspects = findAspectsBetweenPlanets(planets[i], planets[j], customOrbs);
            aspects.push(...planetAspects);
        }
    }

    return aspects.sort((a, b) => b.strength - a.strength); // Sort by strength
}
```

---

## 6. Interpretation Frameworks {#interpretation-frameworks}

### Aspect Strength Assessment

```javascript
/**
 * Calculate overall aspect strength considering multiple factors
 */
function calculateOverallAspectStrength(aspect, chartContext) {
    let strength = aspect.strength;

    // Orb factor (already included in aspect.strength)

    // Planetary dignity factor
    const dignityFactor = calculateDignityFactor(aspect.planets, chartContext);
    strength *= dignityFactor;

    // House placement factor
    const houseFactor = calculateHouseFactor(aspect.planets, chartContext);
    strength *= houseFactor;

    // Sign compatibility factor
    const signFactor = calculateSignCompatibility(aspect.planets, aspect.type);
    strength *= signFactor;

    return Math.min(1.0, Math.max(0.0, strength));
}

/**
 * Calculate planetary dignity factor
 */
function calculateDignityFactor(planetNames, chartContext) {
    // Simplified dignity calculation
    let totalDignity = 0;
    for (const name of planetNames) {
        const planet = chartContext.planets.find(p => p.name === name);
        if (planet) {
            totalDignity += planet.dignity || 0.5; // 0-1 scale
        }
    }
    return totalDignity / planetNames.length;
}
```

### Aspect Interpretation Engine

```javascript
/**
 * Generate aspect interpretation
 */
function interpretAspect(aspect, chartContext) {
    const interpretation = {
        aspect: aspect,
        summary: generateAspectSummary(aspect),
        personality: generatePersonalityImpact(aspect),
        lifeAreas: generateLifeAreaImpact(aspect),
        challenges: generateChallenges(aspect),
        strengths: generateStrengths(aspect),
        advice: generateAdvice(aspect, chartContext)
    };

    return interpretation;
}

/**
 * Generate aspect summary
 */
function generateAspectSummary(aspect) {
    const planet1 = aspect.planets[0];
    const planet2 = aspect.planets[1];
    const type = aspect.type;

    const summaries = {
        conjunction: `${planet1} and ${planet2} energies merge, creating intense focus in ${getCombinedDomains(planet1, planet2)}.`,
        sextile: `${planet1} and ${planet2} work harmoniously, offering opportunities in ${getCombinedDomains(planet1, planet2)}.`,
        square: `${planet1} and ${planet2} create dynamic tension, driving growth through ${getCombinedDomains(planet1, planet2)} challenges.`,
        trine: `${planet1} and ${planet2} flow naturally together, bringing ease in ${getCombinedDomains(planet1, planet2)}.`,
        opposition: `${planet1} and ${planet2} balance each other, highlighting ${getCombinedDomains(planet1, planet2)} polarities.`
    };

    return summaries[type] || `${planet1} and ${planet2} form a ${type} aspect.`;
}
```

---

## 7. Planetary Combinations and Effects {#planetary-combinations}

### Sun Aspects

```javascript
const SUN_ASPECT_INTERPRETATIONS = {
    conjunction: {
        moon: "Identity and emotions are deeply intertwined",
        mercury: "Communication expresses core identity",
        venus: "Values and self-expression are unified",
        mars: "Willpower and action are strongly aligned",
        jupiter: "Confidence and expansion work together",
        saturn: "Identity development requires discipline",
        uranus: "Individuality seeks freedom and innovation",
        neptune: "Identity includes spiritual or creative dimensions",
        pluto: "Transformation of core self and power"
    },
    square: {
        moon: "Emotional needs conflict with self-expression",
        mercury: "Communication challenges self-concept",
        venus: "Values create tension with identity",
        mars: "Willpower conflicts with action orientation",
        jupiter: "Confidence issues with expansion",
        saturn: "Identity development faces restrictions",
        uranus: "Individuality rebels against norms",
        neptune: "Identity confused with ideals",
        pluto: "Power struggles transform identity"
    }
    // Similar patterns for other aspects
};
```

### Personal Planet Combinations

```javascript
const PERSONAL_PLANET_COMBINATIONS = {
    'sun-moon': {
        conjunction: "Unified personality and emotional nature",
        sextile: "Harmonious balance of identity and feelings",
        square: "Tension between self and emotional needs",
        trine: "Natural flow between identity and emotions",
        opposition: "Balance between self and others' needs"
    },
    'mercury-venus': {
        conjunction: "Communication and values are integrated",
        sextile: "Social communication flows easily",
        square: "Communication conflicts with values",
        trine: "Artistic expression through words",
        opposition: "Communication vs relationship needs"
    }
    // Add more combinations
};
```

---

## 8. Aspect Patterns and Configurations {#aspect-patterns}

### Grand Trine

```javascript
/**
 * Detect grand trine pattern
 */
function detectGrandTrine(planets, aspects) {
    const trines = aspects.filter(a => a.type === ASPECT_TYPES.TRINE);

    // Find three planets forming mutual trines
    for (let i = 0; i < planets.length; i++) {
        for (let j = i + 1; j < planets.length; j++) {
            for (let k = j + 1; k < planets.length; k++) {
                const planet1 = planets[i];
                const planet2 = planets[j];
                const planet3 = planets[k];

                const trine12 = trines.find(t => t.planets.includes(planet1.name) && t.planets.includes(planet2.name));
                const trine13 = trines.find(t => t.planets.includes(planet1.name) && t.planets.includes(planet3.name));
                const trine23 = trines.find(t => t.planets.includes(planet2.name) && t.planets.includes(planet3.name));

                if (trine12 && trine13 && trine23) {
                    return {
                        type: 'grand-trine',
                        planets: [planet1.name, planet2.name, planet3.name],
                        element: getCommonElement([planet1.sign, planet2.sign, planet3.sign]),
                        strength: (trine12.strength + trine13.strength + trine23.strength) / 3
                    };
                }
            }
        }
    }

    return null;
}
```

### T-Square

```javascript
/**
 * Detect T-square pattern
 */
function detectTSquare(planets, aspects) {
    const squares = aspects.filter(a => a.type === ASPECT_TYPES.SQUARE);
    const oppositions = aspects.filter(a => a.type === ASPECT_TYPES.OPPOSITION);

    // Find opposition with both ends squared to same planet
    for (const opp of oppositions) {
        const [planet1, planet2] = opp.planets;

        const square1 = squares.find(s => s.planets.includes(planet1) && !s.planets.includes(planet2));
        const square2 = squares.find(s => s.planets.includes(planet2) && !s.planets.includes(planet1));

        if (square1 && square2) {
            const apex = square1.planets.find(p => !opp.planets.includes(p));
            return {
                type: 't-square',
                planets: [planet1, planet2, apex],
                opposition: opp,
                squares: [square1, square2],
                strength: (opp.strength + square1.strength + square2.strength) / 3
            };
        }
    }

    return null;
}
```

### Other Patterns

- **Grand Cross**: Four planets in square aspect
- **Yod (Finger of God)**: Two planets in sextile with both quincunx to third planet
- **Mystic Rectangle**: Two oppositions connected by sextiles/trines
- **Kite**: Grand trine with opposition

---

## 9. Complete Implementation Code {#implementation-code}

### Complete Western Astrology Aspect Calculator

```javascript
/**
 * Custom error classes for aspect calculations
 */
class AspectValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AspectValidationError';
    }
}

class AspectCalculationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AspectCalculationError';
    }
}

/**
 * Complete Western Astrology Aspect Calculator
 */
class WesternAspectCalculator {
    constructor() {
        this.supportedAspects = Object.values(ASPECT_TYPES);
    }

    /**
     * Calculate all aspects in a birth chart
     * @param {Array} planets - Array of planet objects with name, longitude, speed
     * @param {Object} options - Calculation options
     * @returns {Object} Aspect calculation results
     */
    calculateAspects(planets, options = {}) {
        try {
            // Validate inputs
            this._validateInputs(planets, options);

            const customOrbs = options.orbs || {};
            const aspects = calculateAllAspects(planets, customOrbs);

            // Detect patterns
            const patterns = this._detectPatterns(planets, aspects);

            // Generate interpretations
            const interpretations = aspects.map(aspect => interpretAspect(aspect, { planets }));

            // Format results
            return this._formatAspectResults(planets, aspects, patterns, interpretations, options);

        } catch (error) {
            throw new Error(`Aspect calculation failed: ${error.message}`);
        }
    }

    /**
     * Private method: Validate input parameters
     */
    _validateInputs(planets, options) {
        if (!Array.isArray(planets) || planets.length < 2) {
            throw new AspectValidationError('At least 2 planets required for aspect calculation');
        }

        for (const planet of planets) {
            if (!planet.name || typeof planet.longitude !== 'number' || isNaN(planet.longitude)) {
                throw new AspectValidationError('Each planet must have name and valid longitude');
            }
        }

        if (options.orbs) {
            for (const [aspect, orb] of Object.entries(options.orbs)) {
                if (typeof orb !== 'number' || orb < 0 || orb > ASPECT_CONSTANTS.MAX_ORB) {
                    throw new AspectValidationError(`Invalid orb for ${aspect}: ${orb}`);
                }
            }
        }
    }

    /**
     * Private method: Detect aspect patterns
     */
    _detectPatterns(planets, aspects) {
        const patterns = [];

        // Detect grand trines
        const grandTrine = detectGrandTrine(planets, aspects);
        if (grandTrine) patterns.push(grandTrine);

        // Detect T-squares
        const tSquare = detectTSquare(planets, aspects);
        if (tSquare) patterns.push(tSquare);

        // Add more pattern detection as needed

        return patterns;
    }

    /**
     * Private method: Format aspect calculation results
     */
    _formatAspectResults(planets, aspects, patterns, interpretations, options) {
        const formattedAspects = aspects.map((aspect, index) => ({
            id: index + 1,
            planets: aspect.planets,
            type: aspect.type,
            angle: aspect.angle,
            separation: aspect.separation,
            strength: aspect.strength,
            applying: aspect.applying,
            interpretation: interpretations[index]
        }));

        return {
            calculationTime: new Date().toISOString(),
            input: {
                planetCount: planets.length,
                options: options
            },
            aspects: formattedAspects,
            patterns: patterns,
            summary: {
                totalAspects: aspects.length,
                majorAspects: aspects.filter(a => ASPECT_CONSTANTS.MAJOR_ASPECTS.includes(a.type)).length,
                minorAspects: aspects.filter(a => ASPECT_CONSTANTS.MINOR_ASPECTS.includes(a.type)).length,
                averageStrength: aspects.reduce((sum, a) => sum + a.strength, 0) / aspects.length
            }
        };
    }

    /**
     * Get aspects for specific planet
     * @param {string} planetName - Name of the planet
     * @param {Array} aspects - All aspects in chart
     * @returns {Array} Aspects involving the planet
     */
    getAspectsForPlanet(planetName, aspects) {
        return aspects.filter(aspect => aspect.planets.includes(planetName));
    }

    /**
     * Get aspects between two specific planets
     * @param {string} planet1 - First planet name
     * @param {string} planet2 - Second planet name
     * @param {Array} aspects - All aspects in chart
     * @returns {Array} Aspects between the planets
     */
    getAspectsBetweenPlanets(planet1, planet2, aspects) {
        return aspects.filter(aspect =>
            aspect.planets.includes(planet1) && aspect.planets.includes(planet2)
        );
    }
}

// Usage Example
const aspectCalculator = new WesternAspectCalculator();

const planets = [
    { name: 'sun', longitude: 120.5, speed: 1.0, sign: 'leo' },
    { name: 'moon', longitude: 180.3, speed: 13.2, sign: 'virgo' },
    { name: 'mercury', longitude: 115.7, speed: 1.4, sign: 'leo' },
    { name: 'venus', longitude: 90.2, speed: 1.2, sign: 'cancer' },
    { name: 'mars', longitude: 240.8, speed: 0.5, sign: 'scorpio' }
];

const aspectResults = aspectCalculator.calculateAspects(planets);
console.log('Aspect Analysis:', aspectResults);
```

---

## 10. Technical Specifications {#technical-specifications}

### Input Requirements

- **Planetary Longitudes**: Degrees (0-360), calculated from ephemeris data
- **Planet Speeds**: Degrees per day for applying/separating determination
- **Aspect Orbs**: Degrees (0.5-15), configurable per aspect type
- **Planet Names**: String identifiers for supported celestial bodies

### Output Structure

```javascript
{
    calculationTime: "2025-10-08T17:27:56.956Z",
    input: {
        planetCount: 10,
        options: { orbs: { conjunction: 8.0 } }
    },
    aspects: [{
        id: 1,
        planets: ["sun", "venus"],
        type: "sextile",
        angle: 60,
        separation: 58.7,
        strength: 0.82,
        applying: true,
        interpretation: {
            summary: "Sun and Venus work harmoniously...",
            personality: "...",
            lifeAreas: "...",
            challenges: "...",
            strengths: "...",
            advice: "..."
        }
    }],
    patterns: [{
        type: "grand-trine",
        planets: ["sun", "venus", "mars"],
        element: "fire",
        strength: 0.75
    }],
    summary: {
        totalAspects: 15,
        majorAspects: 12,
        minorAspects: 3,
        averageStrength: 0.68
    }
}
```

### Accuracy Requirements

- **Aspect Detection**: ±0.1 degree precision for angle calculations
- **Strength Calculation**: ±0.01 unit accuracy for strength values
- **Orb Application**: Exact orb boundary handling
- **Pattern Detection**: 100% accuracy for geometric pattern recognition

### Performance Benchmarks

- **Single Chart Analysis**: < 50ms for 10 planets
- **Batch Processing**: < 500ms for 100 charts
- **Memory Usage**: < 2MB for calculator instance
- **Concurrent Requests**: Support 1000+ simultaneous calculations

### Error Handling

- **Invalid Planets**: Clear validation for planet data completeness
- **Invalid Orbs**: Range checking for orb values
- **Calculation Errors**: Fallback handling for edge cases
- **Pattern Detection**: Graceful handling of complex configurations

---

## 11. Testing and Validation {#testing-validation}

### Unit Test Suite

```javascript
describe('WesternAspectCalculator', () => {
    let calculator;

    beforeEach(() => {
        calculator = new WesternAspectCalculator();
    });

    test('calculates conjunction correctly', () => {
        const planets = [
            { name: 'sun', longitude: 100, speed: 1.0 },
            { name: 'venus', longitude: 102, speed: 1.2 }
        ];
        const result = calculator.calculateAspects(planets);
        expect(result.aspects).toHaveLength(1);
        expect(result.aspects[0].type).toBe('conjunction');
        expect(result.aspects[0].strength).toBeCloseTo(0.8, 1);
    });

    test('calculates sextile aspects', () => {
        const planets = [
            { name: 'sun', longitude: 0, speed: 1.0 },
            { name: 'venus', longitude: 60, speed: 1.2 }
        ];
        const result = calculator.calculateAspects(planets);
        expect(result.aspects[0].type).toBe('sextile');
        expect(result.aspects[0].exact).toBe(true);
    });

    test('handles custom orbs', () => {
        const planets = [
            { name: 'sun', longitude: 0, speed: 1.0 },
            { name: 'venus', longitude: 5, speed: 1.2 }
        ];
        const result = calculator.calculateAspects(planets, { orbs: { conjunction: 3.0 } });
        expect(result.aspects[0].type).toBe('conjunction');
    });

    test('throws error for invalid planets', () => {
        expect(() => calculator.calculateAspects([])).toThrow('At least 2 planets required');
        expect(() => calculator.calculateAspects([{ name: 'sun' }])).toThrow('At least 2 planets required');
    });

    test('detects grand trine pattern', () => {
        const planets = [
            { name: 'sun', longitude: 0, speed: 1.0, sign: 'aries' },
            { name: 'venus', longitude: 120, speed: 1.2, sign: 'leo' },
            { name: 'mars', longitude: 240, speed: 0.5, sign: 'sagittarius' }
        ];
        const result = calculator.calculateAspects(planets);
        expect(result.patterns).toHaveLength(1);
        expect(result.patterns[0].type).toBe('grand-trine');
    });

    test('getAspectsForPlanet works correctly', () => {
        const planets = [
            { name: 'sun', longitude: 0, speed: 1.0 },
            { name: 'venus', longitude: 60, speed: 1.2 },
            { name: 'mars', longitude: 90, speed: 0.5 }
        ];
        const result = calculator.calculateAspects(planets);
        const sunAspects = calculator.getAspectsForPlanet('sun', result.aspects);
        expect(sunAspects).toHaveLength(2); // sextile and square
    });
});

describe('Aspect Calculation Integration', () => {
    test('full chart analysis produces valid results', () => {
        const calculator = new WesternAspectCalculator();
        const planets = [
            { name: 'sun', longitude: 120.5, speed: 1.0 },
            { name: 'moon', longitude: 180.3, speed: 13.2 },
            { name: 'mercury', longitude: 115.7, speed: 1.4 },
            { name: 'venus', longitude: 90.2, speed: 1.2 },
            { name: 'mars', longitude: 240.8, speed: 0.5 },
            { name: 'jupiter', longitude: 300.1, speed: 0.1 },
            { name: 'saturn', longitude: 45.6, speed: 0.05 }
        ];

        const result = calculator.calculateAspects(planets);
        expect(result.aspects.length).toBeGreaterThan(0);
        expect(result.summary.totalAspects).toBe(result.aspects.length);
        expect(result.summary.averageStrength).toBeGreaterThan(0);
    });

    test('performance benchmark', () => {
        const calculator = new WesternAspectCalculator();
        const planets = Array.from({ length: 10 }, (_, i) => ({
            name: `planet${i}`,
            longitude: i * 36,
            speed: 1.0
        }));

        const startTime = Date.now();
        for (let i = 0; i < 100; i++) {
            calculator.calculateAspects(planets);
        }
        const endTime = Date.now();
        expect(endTime - startTime).toBeLessThan(2000); // Should complete in < 2 seconds
    });
});
```

### Validation Metrics

- **Test Coverage**: > 90% of all methods and functions
- **Accuracy Validation**: Compare against known astrological calculations
- **Integration Testing**: Full chart analysis with real planetary data
- **Performance Testing**: Benchmark against time and memory constraints

---

## 12. Ethical Considerations {#ethical-considerations}

### Accuracy and Transparency

Aspect calculations must be mathematically accurate and transparent in their methodology. Users should be informed about:

- **Orb Variations**: How different astrologers use different orbs
- **Interpretation Subjectivity**: Aspects provide tendencies, not certainties
- **Context Dependency**: Aspect meaning varies by chart context
- **Cultural Differences**: Various astrological traditions interpret aspects differently

### Responsible Interpretation

Aspect analysis should be used responsibly in astrological practice:

- **Not Deterministic**: Aspects indicate potentials and challenges
- **Holistic Approach**: Consider entire chart, not isolated aspects
- **Client Autonomy**: Empower clients to make their own life decisions
- **Professional Ethics**: Adhere to ethical astrological counseling standards

### Data Privacy

Aspect calculations require precise birth data:

- **Minimal Data Collection**: Only collect necessary birth information
- **Purpose Limitation**: Use birth data solely for astronomical calculations
- **Data Retention**: Store birth data only as long as needed for calculations
- **Anonymization**: Remove personally identifiable information from interpretations

### Algorithmic Accountability

- **Mathematical Verification**: All angle calculations should be verifiable
- **Error Transparency**: Clear communication of calculation limitations
- **Continuous Validation**: Regular testing against astronomical standards
- **Open Source**: Consider making core algorithms available for peer review

---

## 13. References {#references}

1. **The Only Astrology Book You'll Ever Need** - Joanna Martine Woolfolk
2. **Parker's Astrology** - Julia and Derek Parker
3. **Aspects in Astrology** - Sue Tompkins
4. **The Astrologer's Handbook** - Frances Sakoian and Louis Sakoian
5. **Aspects and Personality** - Karen Hamaker-Zondag
6. **Astrological Aspects** - Walter Koch
7. **The Inner Sky** - Steven Forrest
8. **Aspects: The Fundamentals of Astrology** - Anthony Louis
9. **Planetary Aspects** - Jessica Lanyadoo
10. **The Astrology of 2012 and Beyond** - Russell Grant

### Implementation Notes

- For production use, integrate with professional ephemeris libraries for highest accuracy
- Implement proper caching for frequently requested aspect calculations
- Add comprehensive logging and monitoring for aspect analysis
- Consider microservices architecture for scalability
- Support both real-time and batch processing modes
- Include rate limiting to prevent abuse

This implementation provides a complete foundation for ZC3.4 Western astrology aspects with all necessary algorithms, formulas, and code examples for accurate aspect calculations and interpretations in the ZodiaCore system.