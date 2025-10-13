/**
 * Western Astrology Transit Interpreter
 *
 * Provides interpretation framework for transit aspects, including life area correlations,
 * intensity calculations, and human-readable descriptions.
 *
 * @version 1.0.0
 * @since 2025-10-08
 */

const { PLANETARY_DATA } = require('./western-astro-constants');

/**
 * Transit Interpretation Engine
 */
class TransitInterpreter {
    constructor() {
        this.lifeAreaMappings = {
            SUN: ['identity', 'vitality', 'leadership', 'self-expression'],
            MOON: ['emotions', 'home', 'family', 'intuition'],
            MERCURY: ['communication', 'learning', 'travel', 'business'],
            VENUS: ['relationships', 'beauty', 'values', 'finances'],
            MARS: ['energy', 'action', 'conflict', 'passion'],
            JUPITER: ['growth', 'luck', 'philosophy', 'travel'],
            SATURN: ['responsibility', 'limitations', 'career', 'structure'],
            URANUS: ['innovation', 'freedom', 'technology', 'sudden changes'],
            NEPTUNE: ['spirituality', 'dreams', 'creativity', 'illusion'],
            PLUTO: ['transformation', 'power', 'death', 'rebirth']
        };

        this.aspectEffects = {
            CONJUNCTION: {
                effect: 'intensification',
                duration: 7, // days
                intensity: 'high'
            },
            SEXTILE: {
                effect: 'opportunity',
                duration: 5,
                intensity: 'medium'
            },
            SQUARE: {
                effect: 'challenge',
                duration: 10,
                intensity: 'high'
            },
            TRINE: {
                effect: 'harmony',
                duration: 8,
                intensity: 'medium'
            },
            OPPOSITION: {
                effect: 'awareness',
                duration: 12,
                intensity: 'high'
            },
            QUINCUNX: {
                effect: 'adjustment',
                duration: 5,
                intensity: 'medium'
            },
            SEMI_SEXTILE: {
                effect: 'subtle influence',
                duration: 3,
                intensity: 'low'
            },
            SEMI_SQUARE: {
                effect: 'minor tension',
                duration: 4,
                intensity: 'low'
            },
            QUINTILE: {
                effect: 'creative potential',
                duration: 4,
                intensity: 'medium'
            },
            SESQUIQUADRATE: {
                effect: 'friction',
                duration: 4,
                intensity: 'medium'
            },
            BIQUINTILE: {
                effect: 'talent expression',
                duration: 3,
                intensity: 'low'
            }
        };
    }

    /**
     * Interpret a transit aspect
     * @param {Object} transit - Transit aspect data
     * @returns {Object} Interpretation results
     */
    interpretTransit(transit) {
        const natalAreas = this.lifeAreaMappings[transit.natalPlanet] || [];
        const transitingAreas = this.lifeAreaMappings[transit.transitingPlanet] || [];
        const aspectEffect = this.aspectEffects[transit.aspect.toUpperCase()] || {};

        const affectedAreas = [...new Set([...natalAreas, ...transitingAreas])];
        const duration = this.calculateDuration(transit, aspectEffect);
        const intensity = this.calculateIntensity(transit, aspectEffect);

        return {
            affectedLifeAreas: affectedAreas,
            primaryEffect: aspectEffect.effect || 'neutral',
            duration: duration,
            intensity: intensity,
            description: this.generateDescription(transit, affectedAreas, aspectEffect),
            recommendations: this.generateRecommendations(transit, aspectEffect)
        };
    }

    /**
     * Calculate transit duration based on planets and aspect
     * @param {Object} transit - Transit data
     * @param {Object} aspectEffect - Aspect effect data
     * @returns {number} Duration in days
     */
    calculateDuration(transit, aspectEffect) {
        const baseDuration = aspectEffect.duration || 7;

        // Adjust for planetary speeds
        const natalSpeed = PLANETARY_DATA[transit.natalPlanet]?.meanMotion || 1;
        const transitSpeed = PLANETARY_DATA[transit.transitingPlanet]?.meanMotion || 1;

        // Slower planets have longer-lasting effects
        const speedFactor = Math.sqrt(natalSpeed / transitSpeed);

        return Math.round(baseDuration * speedFactor);
    }

    /**
     * Calculate transit intensity
     * @param {Object} transit - Transit data
     * @param {Object} aspectEffect - Aspect effect data
     * @returns {number} Intensity score (1-10)
     */
    calculateIntensity(transit, aspectEffect) {
        let intensity = transit.intensity || 5;

        // Adjust for orb (closer aspects are stronger)
        if (transit.orb < 1) intensity += 2;
        else if (transit.orb < 3) intensity += 1;
        else if (transit.orb > 5) intensity -= 1;

        // Outer planets have more profound effects
        const outerPlanets = ['SATURN', 'URANUS', 'NEPTUNE', 'PLUTO'];
        if (outerPlanets.includes(transit.transitingPlanet)) {
            intensity += 1;
        }

        return Math.max(1, Math.min(10, intensity));
    }

    /**
     * Generate human-readable description
     * @param {Object} transit - Transit data
     * @param {Array} affectedAreas - Affected life areas
     * @param {Object} aspectEffect - Aspect effect data
     * @returns {string} Description text
     */
    generateDescription(transit, affectedAreas, aspectEffect) {
        const planet1 = PLANETARY_DATA[transit.natalPlanet]?.name || transit.natalPlanet;
        const planet2 = PLANETARY_DATA[transit.transitingPlanet]?.name || transit.transitingPlanet;

        return `${planet2} is transiting in ${transit.aspect} to your natal ${planet1}, ` +
               `affecting ${affectedAreas.slice(0, 2).join(' and ')}. ` +
               `This ${aspectEffect.effect || 'influence'} may last approximately ${transit.duration || 7} days.`;
    }

    /**
     * Generate recommendations based on transit
     * @param {Object} transit - Transit data
     * @param {Object} aspectEffect - Aspect effect data
     * @returns {Array} Array of recommendation strings
     */
    generateRecommendations(transit, aspectEffect) {
        const recommendations = [];

        switch (aspectEffect.effect) {
            case 'challenge':
                recommendations.push('Focus on patience and learning from difficulties');
                recommendations.push('Practice mindfulness and stress management');
                break;
            case 'opportunity':
                recommendations.push('Be open to new possibilities and connections');
                recommendations.push('Take calculated risks when opportunities arise');
                break;
            case 'harmony':
                recommendations.push('Enjoy the flow and natural progress');
                recommendations.push('Use this time for creative or relationship building');
                break;
            case 'awareness':
                recommendations.push('Pay attention to relationship dynamics and personal growth');
                recommendations.push('Consider seeking counsel for important decisions');
                break;
            case 'intensification':
                recommendations.push('Focus on self-awareness and personal development');
                recommendations.push('Use this energy for important projects or changes');
                break;
            case 'adjustment':
                recommendations.push('Be flexible and willing to make necessary changes');
                recommendations.push('Address any imbalances in your life');
                break;
            default:
                recommendations.push('Stay aware of changes in your life');
                recommendations.push('Journal your experiences during this transit');
        }

        return recommendations;
    }

    /**
     * Analyze multiple transits for overall influence
     * @param {Array} transits - Array of transit aspects
     * @returns {Object} Overall transit analysis
     */
    analyzeTransitPeriod(transits) {
        const totalIntensity = transits.reduce((sum, t) => sum + (t.intensity || 5), 0);
        const averageIntensity = totalIntensity / transits.length;

        const dominantAreas = {};
        transits.forEach(transit => {
            const areas = this.lifeAreaMappings[transit.natalPlanet] || [];
            areas.forEach(area => {
                dominantAreas[area] = (dominantAreas[area] || 0) + 1;
            });
        });

        const topAreas = Object.entries(dominantAreas)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([area]) => area);

        return {
            periodIntensity: averageIntensity,
            dominantLifeAreas: topAreas,
            transitCount: transits.length,
            overallTheme: this.determineOverallTheme(transits)
        };
    }

    /**
     * Determine overall theme of transit period
     * @param {Array} transits - Array of transit aspects
     * @returns {string} Theme description
     */
    determineOverallTheme(transits) {
        const aspectCounts = {};
        transits.forEach(transit => {
            aspectCounts[transit.aspect] = (aspectCounts[transit.aspect] || 0) + 1;
        });

        const dominantAspect = Object.entries(aspectCounts)
            .sort(([,a], [,b]) => b - a)[0]?.[0];

        switch (dominantAspect) {
            case 'SQUARE': return 'challenging growth period';
            case 'TRINE': return 'harmonious flow period';
            case 'OPPOSITION': return 'balancing and awareness period';
            case 'CONJUNCTION': return 'intense transformation period';
            case 'SEXTILE': return 'opportunistic development period';
            case 'QUINCUNX': return 'adjustment and realignment period';
            default: return 'mixed influences period';
        }
    }

    /**
     * Get life area keywords for a planet
     * @param {string} planet - Planet name
     * @returns {Array} Array of life area keywords
     */
    getLifeAreas(planet) {
        return this.lifeAreaMappings[planet] || [];
    }

    /**
     * Get aspect effect information
     * @param {string} aspect - Aspect name
     * @returns {Object} Aspect effect data
     */
    getAspectEffect(aspect) {
        return this.aspectEffects[aspect.toUpperCase()] || {};
    }
}

module.exports = TransitInterpreter;