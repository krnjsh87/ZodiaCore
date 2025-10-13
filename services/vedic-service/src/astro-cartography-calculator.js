/**
 * Astro-cartography Calculator
 * Calculates planetary lines and their influences for astro-cartography analysis
 */
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

module.exports = AstroCartographyCalculator;