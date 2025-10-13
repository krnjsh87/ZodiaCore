# ZC1.8 Synastry/Composite Chart Compatibility

## Overview

Synastry and composite charts are advanced astrological techniques used to analyze relationship compatibility between two individuals. Synastry compares the natal charts of two people to understand how their planets interact, while composite charts create a third chart representing the relationship itself.

This document provides comprehensive algorithms, implementation details, and technical specifications for calculating synastry and composite chart compatibility in the ZodiaCore astrology system.

## Table of Contents

1. [Synastry Chart Analysis](#synastry-chart-analysis)
2. [Composite Chart Generation](#composite-chart-generation)
3. [Compatibility Scoring Algorithms](#compatibility-scoring-algorithms)
4. [Aspect Analysis](#aspect-analysis)
5. [House Overlay Analysis](#house-overlay-analysis)
6. [Planetary Synergy Calculations](#planetary-synergy-calculations)
7. [Implementation Architecture](#implementation-architecture)
8. [API Specifications](#api-specifications)
9. [Database Schema](#database-schema)
10. [Testing and Validation](#testing-and-validation)

## 1. Synastry Chart Analysis

### Definition

Synastry is the comparison of two natal charts to determine relationship dynamics, compatibility, and potential challenges.

### Core Algorithm

```javascript
class SynastryAnalyzer {
    constructor(chart1, chart2) {
        this.chart1 = chart1;
        this.chart2 = chart2;
        this.aspects = [];
        this.overlay = [];
        this.composite = null;
    }

    /**
     * Calculate all synastry aspects between two charts
     */
    calculateSynastryAspects() {
        const aspects = [];
        const planets1 = Object.keys(this.chart1.planets);
        const planets2 = Object.keys(this.chart2.planets);

        for (const planet1 of planets1) {
            for (const planet2 of planets2) {
                const aspect = this.calculateAspect(
                    this.chart1.planets[planet1].longitude,
                    this.chart2.planets[planet2].longitude
                );

                if (aspect) {
                    aspects.push({
                        planet1: planet1,
                        planet2: planet2,
                        aspect: aspect.type,
                        orb: aspect.orb,
                        strength: this.calculateAspectStrength(aspect),
                        interpretation: this.getAspectInterpretation(planet1, planet2, aspect.type)
                    });
                }
            }
        }

        this.aspects = aspects;
        return aspects;
    }

    /**
     * Calculate aspect between two planetary positions
     */
    calculateAspect(longitude1, longitude2) {
        const diff = Math.abs(longitude1 - longitude2);
        const normalizedDiff = Math.min(diff, 360 - diff);

        const aspectTypes = [
            { type: 'conjunction', angle: 0, orb: 8 },
            { type: 'sextile', angle: 60, orb: 6 },
            { type: 'square', angle: 90, orb: 8 },
            { type: 'trine', angle: 120, orb: 8 },
            { type: 'opposition', angle: 180, orb: 8 }
        ];

        for (const aspectType of aspectTypes) {
            const orb = Math.abs(normalizedDiff - aspectType.angle);
            if (orb <= aspectType.orb) {
                return {
                    type: aspectType.type,
                    orb: orb,
                    exactness: 1 - (orb / aspectType.orb)
                };
            }
        }

        return null;
    }

    /**
     * Calculate aspect strength based on multiple factors
     */
    calculateAspectStrength(aspect) {
        let strength = aspect.exactness; // Base on orb tightness

        // Adjust for aspect type
        const aspectWeights = {
            'conjunction': 1.0,
            'trine': 0.9,
            'sextile': 0.8,
            'square': 0.6,
            'opposition': 0.7
        };

        strength *= aspectWeights[aspect.type] || 0.5;

        // Adjust for planetary nature
        // Benefic aspects get bonus, malefic get penalty

        return Math.max(0, Math.min(1, strength));
    }
}
```

### House Overlay Analysis

```javascript
/**
 * Calculate house overlays in synastry
 */
calculateHouseOverlays() {
    const overlays = [];

    for (const planet in this.chart2.planets) {
        const planetLongitude = this.chart2.planets[planet].longitude;
        const house = this.getHouseFromLongitude(planetLongitude, this.chart1.houses);

        overlays.push({
            planet: planet,
            house: house,
            sign: Math.floor(planetLongitude / 30),
            interpretation: this.getHouseOverlayInterpretation(planet, house)
        });
    }

    this.overlay = overlays;
    return overlays;
}
```

## 2. Composite Chart Generation

### Definition

A composite chart is created by calculating the midpoint between corresponding planets in two natal charts, representing the relationship as a separate entity.

### Midpoint Calculation Algorithm

```javascript
class CompositeChartGenerator {
    constructor(chart1, chart2) {
        this.chart1 = chart1;
        this.chart2 = chart2;
    }

    /**
     * Generate composite chart
     */
    generateCompositeChart() {
        const compositePlanets = {};
        const planets = Object.keys(this.chart1.planets);

        for (const planet of planets) {
            const pos1 = this.chart1.planets[planet].longitude;
            const pos2 = this.chart2.planets[planet].longitude;

            // Calculate midpoint
            let midpoint = (pos1 + pos2) / 2;

            // Handle 0°/360° crossover
            if (Math.abs(pos1 - pos2) > 180) {
                midpoint += 180;
            }

            midpoint = normalizeAngle(midpoint);

            compositePlanets[planet] = {
                longitude: midpoint,
                sign: Math.floor(midpoint / 30),
                degree: midpoint % 30,
                house: null // Will be calculated after ascendant
            };
        }

        // Calculate composite ascendant (relationship ascendant)
        const ascendant = this.calculateCompositeAscendant();
        const houses = this.calculateCompositeHouses(ascendant);

        // Assign houses to planets
        for (const planet in compositePlanets) {
            compositePlanets[planet].house = this.getHouseFromLongitude(
                compositePlanets[planet].longitude,
                houses
            );
        }

        return {
            planets: compositePlanets,
            ascendant: ascendant,
            houses: houses,
            aspects: this.calculateCompositeAspects(compositePlanets),
            interpretation: this.interpretCompositeChart(compositePlanets, houses)
        };
    }

    /**
     * Calculate composite ascendant
     */
    calculateCompositeAscendant() {
        // Method 1: Midpoint of both ascendants
        const asc1 = this.chart1.ascendant.longitude;
        const asc2 = this.chart2.ascendant.longitude;

        let compositeAsc = (asc1 + asc2) / 2;

        if (Math.abs(asc1 - asc2) > 180) {
            compositeAsc += 180;
        }

        return normalizeAngle(compositeAsc);
    }

    /**
     * Calculate composite aspects
     */
    calculateCompositeAspects(planets) {
        const aspects = [];
        const planetList = Object.keys(planets);

        for (let i = 0; i < planetList.length; i++) {
            for (let j = i + 1; j < planetList.length; j++) {
                const planet1 = planetList[i];
                const planet2 = planetList[j];

                const aspect = this.calculateAspect(
                    planets[planet1].longitude,
                    planets[planet2].longitude
                );

                if (aspect) {
                    aspects.push({
                        planets: [planet1, planet2],
                        aspect: aspect.type,
                        strength: aspect.exactness,
                        interpretation: this.getCompositeAspectInterpretation(planet1, planet2, aspect.type)
                    });
                }
            }
        }

        return aspects;
    }
}
```

## 3. Compatibility Scoring Algorithms

### Overall Compatibility Score

```javascript
class CompatibilityScorer {
    constructor(synastryData, compositeData) {
        this.synastry = synastryData;
        this.composite = compositeData;
        this.weights = {
            synastryAspects: 0.4,
            houseOverlays: 0.3,
            compositeAspects: 0.3
        };
    }

    /**
     * Calculate overall compatibility score
     */
    calculateOverallScore() {
        const synastryScore = this.calculateSynastryScore();
        const overlayScore = this.calculateOverlayScore();
        const compositeScore = this.calculateCompositeScore();

        const overallScore = (
            synastryScore * this.weights.synastryAspects +
            overlayScore * this.weights.houseOverlays +
            compositeScore * this.weights.compositeAspects
        );

        return {
            overall: Math.round(overallScore * 100) / 100,
            breakdown: {
                synastry: synastryScore,
                overlays: overlayScore,
                composite: compositeScore
            },
            interpretation: this.getCompatibilityInterpretation(overallScore),
            strengths: this.identifyStrengths(),
            challenges: this.identifyChallenges()
        };
    }

    /**
     * Calculate synastry aspect score
     */
    calculateSynastryScore() {
        if (!this.synastry.aspects || this.synastry.aspects.length === 0) {
            return 0.5; // Neutral score if no aspects
        }

        let totalScore = 0;
        let totalWeight = 0;

        const aspectScores = {
            'conjunction': 0.7,  // Can be good or challenging
            'trine': 0.9,        // Very positive
            'sextile': 0.8,      // Positive
            'square': 0.4,       // Challenging
            'opposition': 0.5    // Mixed
        };

        for (const aspect of this.synastry.aspects) {
            const baseScore = aspectScores[aspect.aspect] || 0.5;
            const weightedScore = baseScore * aspect.strength;
            totalScore += weightedScore;
            totalWeight += aspect.strength;
        }

        return totalWeight > 0 ? totalScore / totalWeight : 0.5;
    }

    /**
     * Calculate house overlay score
     */
    calculateOverlayScore() {
        if (!this.synastry.overlay || this.synastry.overlay.length === 0) {
            return 0.5;
        }

        const houseScores = {
            1: 0.8,   // Self - important
            2: 0.7,   // Resources
            3: 0.6,   // Communication
            4: 0.9,   // Home/family
            5: 0.8,   // Children/creativity
            6: 0.4,   // Health/service
            7: 0.9,   // Partnership
            8: 0.5,   // Transformation
            9: 0.8,   // Philosophy/spirituality
            10: 0.8, // Career
            11: 0.7, // Friends/hopes
            12: 0.5  // Spirituality/subconscious
        };

        let totalScore = 0;
        for (const overlay of this.synastry.overlay) {
            totalScore += houseScores[overlay.house] || 0.5;
        }

        return totalScore / this.synastry.overlay.length;
    }

    /**
     * Calculate composite chart score
     */
    calculateCompositeScore() {
        if (!this.composite.aspects || this.composite.aspects.length === 0) {
            return 0.5;
        }

        let totalScore = 0;
        const aspectScores = {
            'conjunction': 0.6,
            'trine': 0.8,
            'sextile': 0.7,
            'square': 0.4,
            'opposition': 0.5
        };

        for (const aspect of this.composite.aspects) {
            totalScore += aspectScores[aspect.aspect] || 0.5;
        }

        return totalScore / this.composite.aspects.length;
    }

    /**
     * Get compatibility interpretation
     */
    getCompatibilityInterpretation(score) {
        if (score >= 0.8) return "Excellent compatibility with strong harmonious connections";
        if (score >= 0.7) return "Good compatibility with positive potential";
        if (score >= 0.6) return "Moderate compatibility with some challenges to work through";
        if (score >= 0.5) return "Fair compatibility requiring effort and understanding";
        if (score >= 0.4) return "Challenging compatibility with significant differences";
        return "Poor compatibility with fundamental incompatibilities";
    }
}
```

## 4. Aspect Analysis

### Major Aspects

- **Conjunction (0°)**: Planets in the same sign, intense connection
- **Sextile (60°)**: Harmonious, supportive energy
- **Square (90°)**: Tension, growth opportunities
- **Trine (120°)**: Easy flow, natural harmony
- **Opposition (180°)**: Balance, awareness of differences

### Aspect Orbs

- Conjunction: ±8°
- Sextile: ±6°
- Square: ±8°
- Trine: ±8°
- Opposition: ±8°

## 5. House Overlay Analysis

### House Significance in Relationships

1. **1st House**: Self-image, appearance, first impressions
2. **2nd House**: Values, finances, self-worth
3. **3rd House**: Communication, siblings, short trips
4. **4th House**: Home, family, emotional security
5. **5th House**: Romance, children, creativity
6. **6th House**: Health, service, daily routines
7. **7th House**: Partnership, marriage, open enemies
8. **8th House**: Intimacy, shared resources, transformation
9. **9th House**: Philosophy, travel, higher learning
10. **10th House**: Career, reputation, public image
11. **11th House**: Friends, hopes, gains
12. **12th House**: Spirituality, subconscious, sacrifice

## 6. Planetary Synergy Calculations

### Planetary Compatibility Matrix

```javascript
const PLANETARY_COMPATIBILITY = {
    'SUN-MOON': 0.9,    // Ego and emotions - very compatible
    'SUN-MARS': 0.7,    // Action and drive
    'SUN-JUPITER': 0.8, // Leadership and wisdom
    'SUN-VENUS': 0.8,   // Self and love
    'SUN-MERCURY': 0.7, // Self and communication
    'SUN-SATURN': 0.5,  // Structure and discipline
    'MOON-SUN': 0.9,    // Emotions and self
    'MOON-MARS': 0.6,   // Emotions and action
    'MOON-JUPITER': 0.8, // Emotions and wisdom
    'MOON-VENUS': 0.9,  // Emotions and love
    'MOON-MERCURY': 0.7, // Emotions and communication
    'MOON-SATURN': 0.4, // Emotions and structure
    // Add all combinations...
};
```

## 7. Implementation Architecture

### Core Components

1. **SynastryCalculator**: Handles aspect calculations between charts
2. **CompositeGenerator**: Creates composite chart from two natal charts
3. **CompatibilityScorer**: Calculates overall compatibility scores
4. **AspectAnalyzer**: Analyzes planetary aspects and their meanings
5. **HouseOverlayAnalyzer**: Analyzes house placements in synastry
6. **InterpretationEngine**: Provides detailed interpretations

### Data Flow

```
Input: Two birth charts
    ↓
Synastry Analysis (aspects, overlays)
    ↓
Composite Chart Generation
    ↓
Compatibility Scoring
    ↓
Interpretation Generation
    ↓
Output: Detailed compatibility report
```

## 8. API Specifications

### REST API Endpoints

```javascript
// Calculate synastry compatibility
POST /api/v1/compatibility/synastry
{
    "chart1": { /* birth chart data */ },
    "chart2": { /* birth chart data */ }
}

// Generate composite chart
POST /api/v1/compatibility/composite
{
    "chart1": { /* birth chart data */ },
    "chart2": { /* birth chart data */ }
}

// Get detailed compatibility report
GET /api/v1/compatibility/report/:relationshipId
```

### Response Format

```json
{
    "relationshipId": "uuid",
    "overallScore": 0.75,
    "compatibility": "Good compatibility",
    "synastry": {
        "aspects": [...],
        "overlays": [...],
        "score": 0.8
    },
    "composite": {
        "planets": {...},
        "aspects": [...],
        "score": 0.7
    },
    "recommendations": [...],
    "challenges": [...],
    "strengths": [...]
}
```

## 9. Database Schema

### Tables

```sql
-- Relationships table
CREATE TABLE relationships (
    id UUID PRIMARY KEY,
    user1_id UUID NOT NULL,
    user2_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Compatibility scores
CREATE TABLE compatibility_scores (
    relationship_id UUID PRIMARY KEY REFERENCES relationships(id),
    overall_score DECIMAL(3,2),
    synastry_score DECIMAL(3,2),
    composite_score DECIMAL(3,2),
    overlay_score DECIMAL(3,2),
    interpretation TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Synastry aspects
CREATE TABLE synastry_aspects (
    id UUID PRIMARY KEY,
    relationship_id UUID REFERENCES relationships(id),
    planet1 VARCHAR(20),
    planet2 VARCHAR(20),
    aspect_type VARCHAR(20),
    orb DECIMAL(5,2),
    strength DECIMAL(3,2),
    interpretation TEXT
);

-- Composite planets
CREATE TABLE composite_planets (
    relationship_id UUID REFERENCES relationships(id),
    planet VARCHAR(20),
    longitude DECIMAL(7,4),
    sign INTEGER,
    house INTEGER,
    PRIMARY KEY (relationship_id, planet)
);
```

## 10. Testing and Validation

### Unit Tests

```javascript
describe('SynastryAnalyzer', () => {
    test('should calculate conjunction aspect correctly', () => {
        const analyzer = new SynastryAnalyzer(chart1, chart2);
        const aspect = analyzer.calculateAspect(0, 5); // 5° apart
        expect(aspect.type).toBe('conjunction');
        expect(aspect.orb).toBe(5);
    });

    test('should generate valid composite chart', () => {
        const generator = new CompositeChartGenerator(chart1, chart2);
        const composite = generator.generateCompositeChart();
        expect(composite.planets).toBeDefined();
        expect(composite.ascendant).toBeDefined();
    });
});
```

### Integration Tests

- Test with known compatible chart pairs
- Test with challenging aspect combinations
- Validate scoring algorithms against expert astrologer assessments
- Performance testing with large datasets

### Validation Criteria

- Aspect calculations within 1° accuracy
- Compatibility scores between 0.0 and 1.0
- Response time under 2 seconds for standard calculations
- Memory usage under 50MB for complex analyses

## Conclusion

This implementation provides a comprehensive system for synastry and composite chart compatibility analysis. The algorithms combine traditional astrological principles with modern computational methods to deliver accurate and meaningful relationship insights.

The modular architecture allows for easy extension and customization based on different astrological traditions and user requirements.