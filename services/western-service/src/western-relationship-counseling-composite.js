// ZC3.13 Western Relationship Counseling Composite Chart Generator
// Generates composite charts with counseling focus

const { RELATIONSHIP_COUNSELING_CONSTANTS } = require('./western-relationship-counseling-constants');

/**
 * Counseling Composite Generator
 * Creates composite charts representing the relationship as a third entity
 */
class CounselingCompositeGenerator {
    constructor(chart1, chart2) {
        this.chart1 = chart1;
        this.chart2 = chart2;
        this.midpointCalculator = new CounselingMidpointCalculator();
        this.counselingAnalyzer = new CompositeCounselingAnalyzer();
    }

    /**
     * Generate complete counseling-focused composite chart
     */
    generateCounselingComposite() {
        const compositePositions = this.calculateCompositePositions();
        const compositeHouses = this.calculateCompositeHouses();
        const compositeAspects = this.calculateCompositeAspects(compositePositions);

        const counselingAnalysis = this.counselingAnalyzer.analyzeCompositeCounseling(
            compositePositions, compositeHouses, compositeAspects
        );

        return {
            type: 'counseling_composite',
            charts: {
                person1: this.chart1,
                person2: this.chart2
            },
            positions: compositePositions,
            houses: compositeHouses,
            aspects: compositeAspects,
            angularity: this.analyzeAngularity(compositePositions, compositeHouses),
            counseling: counselingAnalysis,
            generatedAt: new Date(),
            systemVersion: 'ZC3.13'
        };
    }

    calculateCompositePositions() {
        const positions = {};

        // Calculate planetary midpoints with counseling context
        for (const planet of Object.keys(this.chart1.planets)) {
            if (this.chart2.planets[planet]) {
                positions[planet] = {
                    longitude: this.midpointCalculator.calculateCounselingMidpoint(
                        this.chart1.planets[planet].longitude,
                        this.chart2.planets[planet].longitude,
                        'relationship'
                    ).longitude,
                    latitude: this.midpointCalculator.calculateCounselingMidpoint(
                        this.chart1.planets[planet].latitude || 0,
                        this.chart2.planets[planet].latitude || 0,
                        'relationship'
                    ).longitude,
                    speed: 0 // Composite planets don't move
                };
            }
        }

        // Calculate angle midpoints
        positions.ASC = {
            longitude: this.midpointCalculator.calculateCounselingMidpoint(
                this.chart1.ascendant.longitude,
                this.chart2.ascendant.longitude,
                'identity'
            ).longitude
        };

        positions.MC = {
            longitude: this.midpointCalculator.calculateCounselingMidpoint(
                this.chart1.midheaven.longitude,
                this.chart2.midheaven.longitude,
                'purpose'
            ).longitude
        };

        return positions;
    }

    calculateCompositeHouses() {
        // Simplified house calculation - in full implementation would use proper house system
        const ascendant = this.midpointCalculator.calculateCounselingMidpoint(
            this.chart1.ascendant.longitude,
            this.chart2.ascendant.longitude,
            'identity'
        ).longitude;

        // Generate houses using equal house system for simplicity
        const houses = [];
        for (let i = 0; i < 12; i++) {
            houses.push((ascendant + i * 30) % 360);
        }

        return houses;
    }

    calculateCompositeAspects(compositePositions) {
        const aspects = [];
        const planets = Object.keys(compositePositions);

        for (let i = 0; i < planets.length; i++) {
            for (let j = i + 1; j < planets.length; j++) {
                const planet1 = planets[i];
                const planet2 = planets[j];

                const aspect = this.findAspect(
                    compositePositions[planet1].longitude,
                    compositePositions[planet2].longitude
                );

                if (aspect) {
                    const counseling = this.getAspectCounseling(planet1, planet2, aspect.type);

                    aspects.push({
                        planets: [planet1, planet2],
                        aspect: aspect,
                        counseling: counseling
                    });
                }
            }
        }

        return aspects;
    }

    findAspect(pos1, pos2) {
        const angle = Math.abs(pos1 - pos2);
        const normalizedAngle = Math.min(angle, 360 - angle);

        const aspects = [
            { type: 'CONJUNCTION', angle: 0, orb: 8 },
            { type: 'SEXTILE', angle: 60, orb: 6 },
            { type: 'SQUARE', angle: 90, orb: 8 },
            { type: 'TRINE', angle: 120, orb: 8 },
            { type: 'OPPOSITION', angle: 180, orb: 8 }
        ];

        for (const aspect of aspects) {
            if (Math.abs(normalizedAngle - aspect.angle) <= aspect.orb) {
                return {
                    type: aspect.type,
                    angle: normalizedAngle,
                    orb: Math.abs(normalizedAngle - aspect.angle),
                    exact: Math.abs(normalizedAngle - aspect.angle) < 1
                };
            }
        }

        return null;
    }

    analyzeAngularity(compositePositions, compositeHouses) {
        const angularPlanets = [];
        let angularScore = 0;

        // Check which planets are angular (close to ASC, DSC, MC, IC)
        const angles = [compositeHouses[0], compositeHouses[3], compositeHouses[6], compositeHouses[9]];

        for (const [planet, position] of Object.entries(compositePositions)) {
            for (const angle of angles) {
                const distance = Math.min(
                    Math.abs(position.longitude - angle),
                    360 - Math.abs(position.longitude - angle)
                );

                if (distance <= 10) { // Within 10 degrees of an angle
                    angularPlanets.push(planet);
                    angularScore += (10 - distance) / 10; // Score based on closeness
                    break;
                }
            }
        }

        return {
            angularPlanets: angularPlanets,
            score: Math.min(100, angularScore * 25), // Scale to 0-100
            dominantAngular: angularPlanets.length > 0 ? angularPlanets[0] : null
        };
    }

    getAspectCounseling(planet1, planet2, aspectType) {
        const strength = this.getAspectStrength(aspectType);
        const description = `${planet1}-${planet2} ${aspectType.toLowerCase()} in composite chart`;
        const counseling = this.getCompositeAspectCounseling(planet1, planet2, aspectType);

        return {
            strength: strength,
            description: description,
            counseling: counseling
        };
    }

    getAspectStrength(aspectType) {
        const strengths = {
            'CONJUNCTION': 'excellent',
            'TRINE': 'strong',
            'SEXTILE': 'moderate',
            'SQUARE': 'challenging',
            'OPPOSITION': 'difficult'
        };
        return strengths[aspectType] || 'neutral';
    }

    getCompositeAspectCounseling(planet1, planet2, aspectType) {
        const counselingMap = {
            'SUN_MOON_CONJUNCTION': 'Strong identity and emotional unity in the relationship',
            'VENUS_MARS_TRINE': 'Harmonious balance of love and passion',
            'SATURN_PLUTO_SQUARE': 'Power struggles requiring conscious effort'
        };

        const key = `${planet1}_${planet2}_${aspectType}`.toUpperCase();
        return counselingMap[key] || 'Relationship aspect requiring attention and understanding';
    }
}

/**
 * Counseling Midpoint Calculator
 */
class CounselingMidpointCalculator {
    calculateCounselingMidpoint(pos1, pos2, context = 'relationship') {
        // Input validation
        if (typeof pos1 !== 'number' || typeof pos2 !== 'number' ||
            pos1 < 0 || pos1 >= 360 || pos2 < 0 || pos2 >= 360) {
            throw new Error('Invalid position values: positions must be numbers between 0 and 360');
        }

        const diff = Math.abs(pos1 - pos2);
        const minDiff = Math.min(diff, 360 - diff);

        let midpoint;
        if (diff <= 180) {
            midpoint = (pos1 + pos2) / 2;
        } else {
            const adjustedPos1 = pos1 > pos2 ? pos1 : pos1 + 360;
            midpoint = this.normalizeDegrees((adjustedPos1 + pos2) / 2);
        }

        // Apply counseling context adjustments
        const contextAdjustment = this.getContextAdjustment(context, minDiff);
        midpoint = this.normalizeDegrees(midpoint + contextAdjustment);

        return {
            longitude: midpoint,
            separation: minDiff,
            context: context,
            adjustment: contextAdjustment
        };
    }

    getContextAdjustment(context, separation) {
        const adjustments = {
            'romantic': separation > 90 ? 5 : 0,
            'marriage': separation > 120 ? -3 : 2,
            'business': separation > 60 ? 1 : -1,
            'friendship': 0,
            'identity': 0,
            'purpose': 0,
            'relationship': 0
        };
        return adjustments[context] || 0;
    }

    normalizeDegrees(degrees) {
        while (degrees < 0) degrees += 360;
        while (degrees >= 360) degrees -= 360;
        return degrees;
    }
}

/**
 * Composite Counseling Analyzer
 */
class CompositeCounselingAnalyzer {
    analyzeCompositeCounseling(compositePositions, compositeHouses, compositeAspects) {
        return {
            relationshipDynamics: this.analyzeRelationshipDynamics(compositeAspects),
            challenges: this.analyzeChallenges(compositeAspects),
            opportunities: this.analyzeOpportunities(compositeAspects),
            overallTheme: this.determineOverallTheme(compositePositions, compositeAspects)
        };
    }

    analyzeRelationshipDynamics(aspects) {
        const dynamics = [];

        const harmoniousAspects = aspects.filter(aspect =>
            ['CONJUNCTION', 'TRINE', 'SEXTILE'].includes(aspect.aspect.type)
        );

        const challengingAspects = aspects.filter(aspect =>
            ['SQUARE', 'OPPOSITION'].includes(aspect.aspect.type)
        );

        if (harmoniousAspects.length > challengingAspects.length) {
            dynamics.push('Relationship shows natural harmony and flow');
        }

        if (challengingAspects.length > 0) {
            dynamics.push('Relationship requires conscious effort and growth');
        }

        return dynamics;
    }

    analyzeChallenges(aspects) {
        const challenges = [];

        const challengingAspects = aspects.filter(aspect =>
            ['SQUARE', 'OPPOSITION'].includes(aspect.aspect.type)
        );

        if (challengingAspects.length > 3) {
            challenges.push('Multiple challenging aspects indicate areas needing attention');
        }

        return challenges;
    }

    analyzeOpportunities(aspects) {
        const opportunities = [];

        const positiveAspects = aspects.filter(aspect =>
            ['CONJUNCTION', 'TRINE', 'SEXTILE'].includes(aspect.aspect.type)
        );

        if (positiveAspects.length > 0) {
            opportunities.push('Strong harmonious aspects provide foundation for growth');
        }

        return opportunities;
    }

    determineOverallTheme(positions, aspects) {
        // Simplified theme determination
        const aspectCount = aspects.length;
        const positiveAspectCount = aspects.filter(aspect =>
            ['CONJUNCTION', 'TRINE', 'SEXTILE'].includes(aspect.aspect.type)
        ).length;

        if (positiveAspectCount > aspectCount * 0.6) {
            return 'Harmonious and supportive relationship';
        } else if (positiveAspectCount > aspectCount * 0.4) {
            return 'Balanced relationship with growth opportunities';
        } else {
            return 'Relationship requiring significant conscious effort';
        }
    }
}

module.exports = {
    CounselingCompositeGenerator,
    CounselingMidpointCalculator,
    CompositeCounselingAnalyzer
};