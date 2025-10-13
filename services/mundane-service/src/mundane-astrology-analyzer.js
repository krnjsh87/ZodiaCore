/**
 * Mundane Astrology Analyzer
 * ZC1.23 Complex Mundane Astrology Implementation
 *
 * This file contains the main analyzer class that orchestrates mundane astrology
 * analysis including chart generation, transit calculations, and prediction algorithms.
 */

const { CONFIG, MUNDANE_CONSTANTS } = require('./mundane-astrology-constants');
const { Logger, ValidationUtils, MundaneAstrologyError } = require('./mundane-astrology-utils');
const { calculateJulianDay, calculatePlanetaryPositions, tropicalToSidereal } = require('./mundane-astronomical-calculations');
const { calculateNationalHoroscope, calculateMundaneAspects } = require('./mundane-chart-generators');

/**
 * Simple LRU Cache implementation
 */
class LRUCache {
    constructor(maxSize = 100) {
        this.maxSize = maxSize;
        this.cache = new Map();
    }

    get(key) {
        if (this.cache.has(key)) {
            // Move to end (most recently used)
            const value = this.cache.get(key);
            this.cache.delete(key);
            this.cache.set(key, value);
            return value;
        }
        return null;
    }

    set(key, value) {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        } else if (this.cache.size >= this.maxSize) {
            // Remove least recently used
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        this.cache.set(key, value);
    }

    clear() {
        this.cache.clear();
    }

    size() {
        return this.cache.size;
    }
}

/**
 * Generate comprehensive mundane analysis for a location
 */
class MundaneAstrologyAnalyzer {
    constructor() {
        this.nationalCharts = new LRUCache(CONFIG.MAX_CACHE_SIZE);
        this.eventCharts = new LRUCache(CONFIG.MAX_CACHE_SIZE);

        // Set up periodic cache cleanup
        setInterval(() => {
            // Cache is self-managing with LRU, but we can add TTL if needed
            Logger.debug('Cache cleanup check', {
                nationalChartsSize: this.nationalCharts.size(),
                eventChartsSize: this.eventCharts.size()
            });
        }, CONFIG.CACHE_CLEANUP_INTERVAL_MS);
    }

    /**
     * Analyze current mundane influences for a region
     */
    async analyzeRegion(regionData) {
        const analysis = {
            region: regionData.name,
            timestamp: new Date(),
            nationalHoroscope: null,
            currentTransits: null,
            weatherForecast: null,
            economicIndicators: null,
            politicalForecast: null,
            riskAssessment: null
        };

        // Generate or retrieve national horoscope
        analysis.nationalHoroscope = await this.getNationalHoroscope(regionData);

        // Calculate current planetary transits
        analysis.currentTransits = this.calculateCurrentTransits(analysis.nationalHoroscope);

        // Analyze weather patterns
        analysis.weatherForecast = this.analyzeWeatherPatterns(
            analysis.currentTransits,
            regionData.latitude,
            regionData.longitude
        );

        // Economic analysis
        analysis.economicIndicators = this.analyzeEconomicIndicators(
            analysis.currentTransits,
            analysis.nationalHoroscope
        );

        // Political forecasting
        analysis.politicalForecast = this.forecastPoliticalEvents(
            analysis.currentTransits,
            analysis.nationalHoroscope
        );

        // Risk assessment
        analysis.riskAssessment = this.assessRegionalRisks(
            analysis.currentTransits,
            regionData
        );

        return analysis;
    }

    async getNationalHoroscope(regionData) {
        const cacheKey = `${regionData.country}_${regionData.chartType || 'default'}`;

        const cached = this.nationalCharts.get(cacheKey);
        if (cached) {
            Logger.debug('Retrieved national horoscope from cache', { cacheKey });
            return cached;
        }

        const horoscope = calculateNationalHoroscope(regionData);
        this.nationalCharts.set(cacheKey, horoscope);
        Logger.debug('Cached new national horoscope', { cacheKey });

        return horoscope;
    }

    calculateCurrentTransits(nationalHoroscope) {
        const now = new Date();
        const currentJD = calculateJulianDay(
            now.getFullYear(),
            now.getMonth() + 1,
            now.getDate(),
            now.getHours(),
            now.getMinutes(),
            now.getSeconds()
        );

        const currentPositions = calculatePlanetaryPositions(currentJD);
        const siderealPositions = tropicalToSidereal(currentPositions, nationalHoroscope.ayanamsa);

        const transits = {};
        for (const planet in siderealPositions) {
            transits[planet] = {
                longitude: siderealPositions[planet],
                aspectToAscendant: this.calculateAspect(
                    siderealPositions[planet],
                    nationalHoroscope.ascendant
                ),
                aspectToMidheaven: this.calculateAspect(
                    siderealPositions[planet],
                    nationalHoroscope.midheaven
                ),
                house: this.getHouseFromLongitude(
                    siderealPositions[planet],
                    nationalHoroscope.houses
                )
            };
        }

        return {
            julianDay: currentJD,
            positions: siderealPositions,
            transits: transits,
            aspects: calculateMundaneAspects(siderealPositions, nationalHoroscope)
        };
    }

    calculateAspect(pos1, pos2) {
        const separation = Math.min(Math.abs(pos1 - pos2), 360 - Math.abs(pos1 - pos2));

        if (separation < 8) return 'Conjunction';
        if (Math.abs(separation - 60) < 6) return 'Sextile';
        if (Math.abs(separation - 90) < 8) return 'Square';
        if (Math.abs(separation - 120) < 8) return 'Trine';
        if (Math.abs(separation - 180) < 8) return 'Opposition';

        return 'No major aspect';
    }

    getHouseFromLongitude(longitude, houses) {
        for (let i = 0; i < houses.length; i++) {
            const nextHouse = houses[(i + 1) % 12];
            if (this.isInHouse(longitude, houses[i], nextHouse)) {
                return i + 1;
            }
        }
        return 1; // Default to 1st house
    }

    isInHouse(longitude, cusp1, cusp2) {
        if (cusp1 < cusp2) {
            return longitude >= cusp1 && longitude < cusp2;
        } else {
            return longitude >= cusp1 || longitude < cusp2;
        }
    }

    analyzeWeatherPatterns(transits, latitude, longitude) {
        // Simplified weather analysis based on lunar position
        const moonSign = Math.floor(transits.positions.MOON / 30);
        const weatherTypes = [
            'Cold and dry', 'Variable', 'Stormy', 'Showers',
            'Fair weather', 'Hot and humid', 'Windy', 'Cloudy',
            'Clear skies', 'Pleasant', 'Unsettled', 'Cold fronts'
        ];

        return {
            location: { latitude, longitude },
            primaryInfluence: weatherTypes[moonSign] || 'Variable conditions',
            confidence: 0.7,
            factors: ['Lunar position', 'Seasonal patterns']
        };
    }

    analyzeEconomicIndicators(transits, nationalHoroscope) {
        // Simplified economic analysis
        const aspects = transits.aspects;
        let economicStrength = 50;

        // Jupiter aspects indicate economic prosperity
        const jupiterAspects = aspects.filter(a => a.transitingPlanet === 'JUPITER');
        if (jupiterAspects.length > 0) {
            economicStrength += 20;
        }

        // Saturn aspects indicate economic challenges
        const saturnAspects = aspects.filter(a => a.transitingPlanet === 'SATURN');
        if (saturnAspects.length > 0) {
            economicStrength -= 15;
        }

        return {
            indicators: ['Market trends', 'Currency stability', 'Investment climate'],
            strength: economicStrength,
            outlook: economicStrength > 60 ? 'Positive' : economicStrength > 40 ? 'Neutral' : 'Challenging'
        };
    }

    forecastPoliticalEvents(transits, nationalHoroscope) {
        // Simplified political forecasting
        const aspects = transits.aspects;
        const politicalAspects = aspects.filter(a =>
            ['SUN', 'MARS', 'SATURN'].includes(a.transitingPlanet) ||
            ['SUN', 'MARS', 'SATURN'].includes(a.radicalPlanet)
        );

        return {
            events: politicalAspects.length > 0 ? ['Leadership changes', 'Policy shifts'] : ['Stability'],
            probability: Math.min(95, politicalAspects.length * 25),
            timeframe: 'Next 3-6 months'
        };
    }

    assessRegionalRisks(transits, regionData) {
        // Simplified risk assessment
        const aspects = transits.aspects;
        let riskLevel = 'Low';

        const challengingAspects = aspects.filter(a =>
            ['Square', 'Opposition'].includes(a.aspect)
        );

        if (challengingAspects.length > 3) {
            riskLevel = 'High';
        } else if (challengingAspects.length > 1) {
            riskLevel = 'Medium';
        }

        return {
            risks: challengingAspects.length > 0 ? ['Political instability', 'Economic challenges'] : ['Minor fluctuations'],
            level: riskLevel,
            factors: challengingAspects.map(a => `${a.transitingPlanet} ${a.aspect} ${a.radicalPlanet}`)
        };
    }
}

module.exports = {
    MundaneAstrologyAnalyzer,
    LRUCache
};