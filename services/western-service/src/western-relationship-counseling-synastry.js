// ZC3.13 Western Relationship Counseling Synastry Generator
// Generates detailed synastry analysis with counseling implications

const { RELATIONSHIP_COUNSELING_CONSTANTS } = require('./western-relationship-counseling-constants');

/**
 * Counseling Synastry Generator
 * Creates comprehensive inter-chart aspect analysis with counseling focus
 */
class CounselingSynastryGenerator {
    constructor(chart1, chart2) {
        this.chart1 = chart1;
        this.chart2 = chart2;
        this.aspectCalculator = new AspectCalculator();
        this.houseOverlayAnalyzer = new HouseOverlayAnalyzer();
        this.counselingInterpreter = new CounselingInterpreter();
    }

    /**
     * Generate complete counseling-focused synastry analysis
     */
    generateCounselingSynastry() {
        const interAspects = this.calculateInterAspects();
        const houseOverlays = this.calculateHouseOverlays();
        const vertexConnections = this.calculateVertexConnections();
        const lunarNodeConnections = this.calculateLunarNodeConnections();

        const counselingInsights = this.counselingInterpreter.analyzeSynastryCounseling(
            interAspects, houseOverlays, vertexConnections, lunarNodeConnections
        );

        return {
            type: 'counseling_synastry',
            charts: {
                person1: this.chart1,
                person2: this.chart2
            },
            interAspects: interAspects,
            houseOverlays: houseOverlays,
            vertexConnections: vertexConnections,
            lunarNodeConnections: lunarNodeConnections,
            counseling: counselingInsights,
            compatibility: this.calculateCompatibilityScore(interAspects, houseOverlays),
            generatedAt: new Date(),
            systemVersion: 'ZC3.13'
        };
    }

    calculateInterAspects() {
        const aspects = [];

        // Planet-to-planet aspects with counseling context
        for (const planet1 of Object.keys(this.chart1.planets)) {
            for (const planet2 of Object.keys(this.chart2.planets)) {
                const aspect = this.aspectCalculator.findAspect(
                    this.chart1.planets[planet1].longitude,
                    this.chart2.planets[planet2].longitude
                );

                if (aspect) {
                    const counseling = this.counselingInterpreter.interpretAspect(
                        planet1, planet2, aspect
                    );

                    aspects.push({
                        from: { person: 1, planet: planet1 },
                        to: { person: 2, planet: planet2 },
                        aspect: aspect,
                        counseling: counseling
                    });
                }
            }
        }

        return aspects;
    }

    calculateHouseOverlays() {
        const overlays = [];

        // Planets in partner's houses with counseling implications
        for (const planet of Object.keys(this.chart1.planets)) {
            const house = this.getHouseForPosition(
                this.chart1.planets[planet].longitude,
                this.chart2.houses
            );

            const counseling = this.counselingInterpreter.interpretHouseOverlay(
                planet, house, 'person1_to_person2'
            );

            overlays.push({
                person: 1,
                planet: planet,
                house: house,
                significance: RELATIONSHIP_COUNSELING_CONSTANTS.HOUSE_COUNSELING_WEIGHTS[house] || 0.1,
                counseling: counseling
            });
        }

        // Person 2's planets in Person 1's houses
        for (const planet of Object.keys(this.chart2.planets)) {
            const house = this.getHouseForPosition(
                this.chart2.planets[planet].longitude,
                this.chart1.houses
            );

            const counseling = this.counselingInterpreter.interpretHouseOverlay(
                planet, house, 'person2_to_person1'
            );

            overlays.push({
                person: 2,
                planet: planet,
                house: house,
                significance: RELATIONSHIP_COUNSELING_CONSTANTS.HOUSE_COUNSELING_WEIGHTS[house] || 0.1,
                counseling: counseling
            });
        }

        return overlays;
    }

    calculateVertexConnections() {
        // Simplified vertex connections - in full implementation would calculate actual vertex positions
        return [];
    }

    calculateLunarNodeConnections() {
        // Simplified lunar node connections
        return [];
    }

    getHouseForPosition(longitude, houses) {
        for (let i = 0; i < houses.length; i++) {
            const cusp = houses[i];
            const nextCusp = houses[(i + 1) % houses.length];

            if (this.isInHouse(longitude, cusp, nextCusp)) {
                return i + 1;
            }
        }
        return 1;
    }

    isInHouse(longitude, cusp1, cusp2) {
        if (cusp1 < cusp2) {
            return longitude >= cusp1 && longitude < cusp2;
        } else {
            return longitude >= cusp1 || longitude < cusp2;
        }
    }

    calculateCompatibilityScore(interAspects, houseOverlays) {
        let totalScore = 50; // Base score

        // Aspect scoring
        const positiveAspects = interAspects.filter(aspect =>
            ['CONJUNCTION', 'TRINE', 'SEXTILE'].includes(aspect.aspect.type)
        );
        const challengingAspects = interAspects.filter(aspect =>
            ['SQUARE', 'OPPOSITION'].includes(aspect.aspect.type)
        );

        totalScore += positiveAspects.length * 5;
        totalScore -= challengingAspects.length * 3;

        // House overlay scoring
        const significantOverlays = houseOverlays.filter(overlay => overlay.significance > 0.7);
        totalScore += significantOverlays.length * 2;

        return Math.max(0, Math.min(100, totalScore));
    }
}

/**
 * Simple Aspect Calculator for demonstration
 */
class AspectCalculator {
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
                    applying: normalizedAngle < aspect.angle
                };
            }
        }

        return null;
    }
}

/**
 * House Overlay Analyzer
 */
class HouseOverlayAnalyzer {
    // Placeholder for house overlay analysis
}

/**
 * Counseling Interpreter for aspects and overlays
 */
class CounselingInterpreter {
    interpretAspect(planet1, planet2, aspect) {
        // Simplified counseling interpretation
        const strength = this.getAspectStrength(aspect.type);
        const description = this.getAspectDescription(planet1, planet2, aspect.type);
        const counseling = this.getAspectCounseling(planet1, planet2, aspect.type);

        return {
            strength: strength,
            description: description,
            counseling: counseling
        };
    }

    interpretHouseOverlay(planet, house, direction) {
        const interpretation = `Planet ${planet} in house ${house} (${direction})`;
        const advice = this.getHouseOverlayAdvice(planet, house);

        return {
            interpretation: interpretation,
            advice: advice
        };
    }

    analyzeSynastryCounseling(interAspects, houseOverlays, vertexConnections, lunarNodeConnections) {
        return {
            communication: {
                insights: this.analyzeCommunication(interAspects),
                recommendations: []
            },
            emotional: {
                insights: this.analyzeEmotional(interAspects),
                recommendations: []
            },
            intimacy: {
                insights: this.analyzeIntimacy(interAspects),
                recommendations: []
            },
            growth: {
                insights: this.analyzeGrowth(interAspects),
                recommendations: []
            },
            challenges: this.identifyChallenges(interAspects, houseOverlays)
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

    getAspectDescription(planet1, planet2, aspectType) {
        return `${planet1}-${planet2} ${aspectType.toLowerCase()} aspect`;
    }

    getAspectCounseling(planet1, planet2, aspectType) {
        const counselingMap = {
            'SUN_MOON_CONJUNCTION': 'Deep emotional and identity harmony',
            'VENUS_MARS_SQUARE': 'Passion with conflict potential',
            'MERCURY_SATURN_OPPOSITION': 'Communication differences requiring patience'
        };

        const key = `${planet1}_${planet2}_${aspectType}`.toUpperCase();
        return counselingMap[key] || 'Monitor and communicate openly';
    }

    getHouseOverlayAdvice(planet, house) {
        const adviceMap = {
            'VENUS_7': 'Strong romantic connection in partnership',
            'MARS_1': 'Dynamic energy in personal identity',
            'SATURN_4': 'Commitment to family and home'
        };

        const key = `${planet}_${house}`;
        return adviceMap[key] || `Consider the influence of ${planet} in house ${house}`;
    }

    analyzeCommunication(aspects) {
        const communicationPlanets = ['MERCURY', 'SUN', 'MOON'];
        const insights = [];

        for (const aspect of aspects) {
            if (communicationPlanets.includes(aspect.from.planet) ||
                communicationPlanets.includes(aspect.to.planet)) {
                insights.push(`${aspect.from.planet}-${aspect.to.planet} aspect affects communication`);
            }
        }

        return insights;
    }

    analyzeEmotional(aspects) {
        const emotionalPlanets = ['MOON', 'VENUS', 'NEPTUNE'];
        const insights = [];

        for (const aspect of aspects) {
            if (emotionalPlanets.includes(aspect.from.planet) ||
                emotionalPlanets.includes(aspect.to.planet)) {
                insights.push(`${aspect.from.planet}-${aspect.to.planet} aspect influences emotional connection`);
            }
        }

        return insights;
    }

    analyzeIntimacy(aspects) {
        const intimacyPlanets = ['VENUS', 'MARS', 'PLUTO'];
        const insights = [];

        for (const aspect of aspects) {
            if (intimacyPlanets.includes(aspect.from.planet) ||
                intimacyPlanets.includes(aspect.to.planet)) {
                insights.push(`${aspect.from.planet}-${aspect.to.planet} aspect affects intimacy`);
            }
        }

        return insights;
    }

    analyzeGrowth(aspects) {
        const growthPlanets = ['JUPITER', 'SATURN', 'URANUS'];
        const insights = [];

        for (const aspect of aspects) {
            if (growthPlanets.includes(aspect.from.planet) ||
                growthPlanets.includes(aspect.to.planet)) {
                insights.push(`${aspect.from.planet}-${aspect.to.planet} aspect supports growth`);
            }
        }

        return insights;
    }

    identifyChallenges(aspects, overlays) {
        const challenges = [];

        const challengingAspects = aspects.filter(aspect =>
            ['SQUARE', 'OPPOSITION'].includes(aspect.aspect.type)
        );

        if (challengingAspects.length > 3) {
            challenges.push('Multiple challenging aspects require attention');
        }

        return challenges;
    }
}

module.exports = {
    CounselingSynastryGenerator,
    AspectCalculator,
    CounselingInterpreter
};