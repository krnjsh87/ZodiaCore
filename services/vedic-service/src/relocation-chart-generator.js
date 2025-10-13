/**
 * Relocation Chart Generator
 * Generates birth charts for different geographical locations
 */
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
        const julianDay = this.calculateJulianDayFromDate(time);
        const gmst = this.calculateGMST(julianDay);
        const lst = gmst + (longitude / 15.0); // 15 degrees per hour

        return this.normalizeAngle(lst * 15.0); // Convert back to degrees
    }

    /**
     * Calculate ascendant for new location
     */
    calculateAscendant(lst, latitude) {
        // Use astronomical calculation for rising sign
        return this.calculateRisingSign(lst, latitude);
    }

    /**
     * Calculate houses for new location
     */
    calculateHouses(ascendant, latitude, longitude) {
        // Use Whole Sign houses for Vedic compatibility
        return this.calculateWholeSignHouses(ascendant);
    }

    /**
     * Calculate new house positions for planets
     */
    calculateRelocatedPlanets(planets, houses) {
        const relocatedPlanets = {};

        for (const [planetName, planetData] of Object.entries(planets)) {
            const house = this.getHouseFromLongitude(planetData.longitude, houses);

            relocatedPlanets[planetName] = {
                ...planetData,
                house: house,
                houseLord: this.getHouseLord(house, houses[0]), // ascendant
                angularity: this.calculateAngularity(planetData.longitude, houses)
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

    /**
     * Calculate Julian Day from date
     */
    calculateJulianDayFromDate(date) {
        const a = Math.floor((14 - (date.getMonth() + 1)) / 12);
        const y = date.getFullYear() + 4800 - a;
        const m = (date.getMonth() + 1) + 12 * a - 3;

        return date.getDate() + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    }

    /**
     * Calculate Greenwich Mean Sidereal Time
     */
    calculateGMST(julianDay) {
        const T = (julianDay - 2451545.0) / 36525.0;
        const gmst = 18.697374558 + 8640184.812866 * T + 0.093104 * T * T - 6.2e-6 * T * T * T;
        return gmst % 24; // hours
    }

    /**
     * Calculate rising sign (ascendant) for given LST and latitude
     */
    calculateRisingSign(lst, latitude) {
        // Simplified calculation - in practice, use astronomical algorithms
        const obliquity = 23.439281; // obliquity of ecliptic
        const latRad = this.degToRad(latitude);
        const tanLat = Math.tan(latRad);
        const sinObl = Math.sin(this.degToRad(obliquity));

        const ascendant = Math.atan2(-Math.cos(this.degToRad(lst * 15)), sinObl * tanLat + Math.cos(this.degToRad(obliquity)));
        return this.normalizeAngle(this.radToDeg(ascendant));
    }

    /**
     * Calculate Whole Sign houses
     */
    calculateWholeSignHouses(ascendant) {
        const houses = [];
        for (let i = 0; i < 12; i++) {
            houses.push((ascendant + i * 30) % 360);
        }
        return houses;
    }

    /**
     * Get house from longitude
     */
    getHouseFromLongitude(longitude, houses) {
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
    getHouseLord(house, ascendant) {
        // Simplified - in Vedic astrology, house lords depend on ascendant sign
        const sign = Math.floor(ascendant / 30);
        const lords = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];
        return lords[(sign + house - 1) % 12];
    }

    /**
     * Calculate angularity
     */
    calculateAngularity(longitude, houses) {
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
    getAngleType(longitude, houses) {
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
    getHouseChangeSignificance(planet, fromHouse, toHouse) {
        const significances = {
            'SUN': { 1: 'Identity and self-expression', 5: 'Creativity and children', 9: 'Spirituality and travel', 10: 'Career and authority' },
            'MOON': { 1: 'Emotional foundation', 4: 'Home and family', 7: 'Partnerships', 10: 'Public life' },
            // Add for other planets
        };
        return significances[planet]?.[toHouse] || `${planet} in house ${toHouse}`;
    }

    /**
     * Convert degrees to radians
     */
    degToRad(degrees) {
        return degrees * (Math.PI / 180);
    }

    /**
     * Convert radians to degrees
     */
    radToDeg(radians) {
        return radians * (180 / Math.PI);
    }

    /**
     * Normalize angle to 0-360 degrees
     */
    normalizeAngle(angle) {
        while (angle < 0) angle += 360;
        return angle % 360;
    }
}

module.exports = RelocationChartGenerator;