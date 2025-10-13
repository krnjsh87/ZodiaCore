/**
 * Location Analyzer
 * Analyzes astrological compatibility of specific locations
 */
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

        const lines = this.cartography && this.cartography.lines ? this.cartography.lines : [];
        for (const line of lines) {
            const distance = this.calculateLineDistance(latitude, longitude, line.latitude, line.longitude);
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
        if (!this.relocation || !this.relocation.generateRelocationChart) {
            return {
                ascendantSign: 0,
                angularPlanets: [],
                houseChanges: {},
                score: 50 // Default score
            };
        }

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
        const geomagneticScore = Math.cos(this.degToRad(Math.abs(latitude))) * 10;
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

    /**
     * Calculate distance from birth location to planetary line
     */
    calculateLineDistance(birthLat, birthLon, lineLat, lineLon) {
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
            return this.calculateGreatCircleDistance(birthLat, birthLon, lineLat, lineLon);
        }
    }

    /**
     * Calculate great circle distance between two points
     */
    calculateGreatCircleDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in kilometers
        const dLat = this.degToRad(lat2 - lat1);
        const dLon = this.degToRad(lon2 - lon1);

        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(this.degToRad(lat1)) * Math.cos(this.degToRad(lat2)) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;

        return distance;
    }

    /**
     * Generate recommendations based on score and purpose
     */
    generateRecommendations(overallScore, purpose) {
        const recommendations = [];

        if (overallScore > 80) {
            recommendations.push({
                type: 'excellent',
                message: `Excellent astrological compatibility for ${purpose} - strong planetary support`,
                action: 'Proceed with confidence'
            });
        } else if (overallScore > 60) {
            recommendations.push({
                type: 'good',
                message: `Good compatibility with some beneficial influences`,
                action: 'Consider timing and preparation'
            });
        } else if (overallScore > 40) {
            recommendations.push({
                type: 'moderate',
                message: `Moderate compatibility - balance of positive and challenging influences`,
                action: 'Focus on personal growth opportunities'
            });
        } else {
            recommendations.push({
                type: 'challenging',
                message: `Challenging location astrologically - significant growth opportunities`,
                action: 'Consider alternative locations or extended preparation'
            });
        }

        return recommendations;
    }

    /**
     * Calculate best times for location changes
     */
    calculateBestTimes(latitude, longitude) {
        // Simplified - in practice, would analyze transits and progressions
        const bestTimes = [
            { period: 'Spring Equinox', strength: 0.8 },
            { period: 'Full Moon', strength: 0.7 },
            { period: 'Jupiter Transit', strength: 0.9 },
            { period: 'Personal New Moon', strength: 0.6 }
        ];

        return bestTimes;
    }

    /**
     * Convert degrees to radians
     */
    degToRad(degrees) {
        return degrees * (Math.PI / 180);
    }
}

module.exports = LocationAnalyzer;