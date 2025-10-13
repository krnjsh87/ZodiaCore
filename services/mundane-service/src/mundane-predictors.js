/**
 * Mundane Astrology Predictors
 * ZC1.23 Complex Mundane Astrology Implementation
 *
 * This file contains predictor classes for transit analysis, dasha periods,
 * weather forecasting, and economic analysis in mundane astrology.
 */

const { CONFIG } = require('./mundane-astrology-constants');
const { Logger, MundaneAstrologyError } = require('./mundane-astrology-utils');
const { calculateJulianDay, calculatePlanetaryPositions, tropicalToSidereal, calculateNakshatra } = require('./mundane-astronomical-calculations');
const { calculateMundaneAspects } = require('./mundane-chart-generators');

/**
 * Advanced transit prediction system
 */
class TransitPredictor {
    constructor() {
        this.aspectOrbs = {
            conjunction: CONFIG.ASPECT_ORBS.conjunction,
            sextile: CONFIG.ASPECT_ORBS.sextile,
            square: CONFIG.ASPECT_ORBS.square,
            trine: CONFIG.ASPECT_ORBS.trine,
            opposition: CONFIG.ASPECT_ORBS.opposition
        };
    }

    /**
     * Predict timing of mundane events
     */
    predictEventTiming(radixChart, eventType, timeRange) {
        const predictions = [];

        for (let days = 0; days <= timeRange; days++) {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + days);

            const transits = this.calculateTransitsForDate(radixChart, futureDate);
            const aspects = calculateMundaneAspects(transits, radixChart);

            const relevantAspects = aspects.filter(aspect =>
                this.isRelevantForEvent(aspect, eventType)
            );

            if (relevantAspects.length > 0) {
                predictions.push({
                    date: futureDate,
                    aspects: relevantAspects,
                    probability: this.calculateEventProbability(relevantAspects, eventType),
                    description: this.generatePredictionDescription(relevantAspects, eventType)
                });
            }
        }

        return predictions.sort((a, b) => b.probability - a.probability);
    }

    calculateTransitsForDate(radixChart, date) {
        const jd = calculateJulianDay(
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds()
        );

        const positions = calculatePlanetaryPositions(jd);
        return tropicalToSidereal(positions, radixChart.ayanamsa);
    }

    isRelevantForEvent(aspect, eventType) {
        const eventRelevancies = {
            political: ['SUN', 'MARS', 'JUPITER', 'SATURN'],
            economic: ['MERCURY', 'JUPITER', 'SATURN', 'VENUS'],
            weather: ['MOON', 'SATURN', 'RAHU'],
            military: ['MARS', 'SATURN', 'SUN'],
            social: ['MOON', 'VENUS', 'MERCURY']
        };

        return eventRelevancies[eventType]?.includes(aspect.transitingPlanet) ||
               eventRelevancies[eventType]?.includes(aspect.radicalPlanet);
    }

    calculateEventProbability(aspects, eventType) {
        let probability = 0;

        for (const aspect of aspects) {
            const baseProb = this.getAspectProbability(aspect.aspect);
            const strength = aspect.strength / 100;
            probability += baseProb * strength;
        }

        // Cap at 95% and adjust for event type
        return Math.min(95, probability * this.getEventMultiplier(eventType));
    }

    getAspectProbability(aspect) {
        const probabilities = {
            'Conjunction': 0.8,
            'Opposition': 0.7,
            'Square': 0.6,
            'Trine': 0.5,
            'Sextile': 0.4
        };

        return probabilities[aspect] || 0.3;
    }

    getEventMultiplier(eventType) {
        return CONFIG.EVENT_MULTIPLIERS[eventType] || 1.0;
    }

    generatePredictionDescription(aspects, eventType) {
        if (aspects.length === 0) return 'No significant astrological influences';

        const aspect = aspects[0];
        const description = `${aspect.transitingPlanet} ${aspect.aspect.toLowerCase()} ${aspect.radicalPlanet}`;
        return `Potential ${eventType} event due to ${description}`;
    }
}

/**
 * Analyze national dashas for long-term trends
 */
class NationalDashaAnalyzer {
    constructor() {
        this.dashaSystem = new VimshottariDasha();
    }

    /**
     * Analyze current national dasha periods
     */
    analyzeNationalDasha(nationalChart, currentDate) {
        const moonNakshatra = calculateNakshatra(nationalChart.planets.MOON);
        const dashaBalance = this.dashaSystem.calculateDashaBalance(
            moonNakshatra,
            new Date(nationalChart.foundingData.foundingYear,
                    nationalChart.foundingData.foundingMonth - 1,
                    nationalChart.foundingData.foundingDay)
        );

        const currentDasha = this.dashaSystem.getCurrentDasha(
            new Date(nationalChart.foundingData.foundingYear,
                    nationalChart.foundingData.foundingMonth - 1,
                    nationalChart.foundingData.foundingDay),
            currentDate,
            dashaBalance
        );

        return {
            currentMahadasha: currentDasha.mahadasha,
            currentAntardasha: currentDasha.antardasha,
            effects: this.interpretDashaEffects(currentDasha),
            duration: currentDasha.remainingYears,
            strength: this.calculateDashaStrength(currentDasha, nationalChart)
        };
    }

    interpretDashaEffects(dasha) {
        const planetEffects = {
            Sun: 'Government stability, leadership focus',
            Moon: 'Public welfare, agricultural development',
            Mars: 'Military strength, industrial growth',
            Mercury: 'Economic development, technological progress',
            Jupiter: 'Religious harmony, legal reforms',
            Venus: 'Cultural development, diplomatic relations',
            Saturn: 'Economic planning, infrastructure development',
            Rahu: 'Technological innovation, foreign influence',
            Ketu: 'Spiritual growth, research activities'
        };

        return {
            mahadasha: planetEffects[dasha.mahadasha] || 'General national development',
            antardasha: planetEffects[dasha.antardasha] || 'Specific area focus',
            combined: `${planetEffects[dasha.mahadasha]} with ${planetEffects[dasha.antardasha]} emphasis`
        };
    }

    calculateDashaStrength(dasha, nationalChart) {
        // Simplified dasha strength calculation
        const planetStrengths = {
            Sun: 80, Moon: 75, Mars: 70, Mercury: 65, Jupiter: 85,
            Venus: 60, Saturn: 90, Rahu: 55, Ketu: 50
        };

        return planetStrengths[dasha.mahadasha] || 50;
    }
}

/**
 * Simplified Vimshottari Dasha System implementation
 */
class VimshottariDasha {
    constructor() {
        this.dashaPeriods = {
            Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16,
            Saturn: 19, Mercury: 17, Ketu: 7, Venus: 20
        };

        this.dashaOrder = ['Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury', 'Ketu', 'Venus'];
    }

    /**
     * Calculate dasha balance at birth
     * @param {number} moonNakshatra - Moon's nakshatra (0-26)
     * @param {Date} birthDate - Birth date
     * @returns {Object} Dasha balance
     */
    calculateDashaBalance(moonNakshatra, birthDate) {
        const nakshatraLord = this.getNakshatraLord(moonNakshatra);
        const period = this.dashaPeriods[nakshatraLord];
        const elapsed = this.calculateElapsedYears(birthDate);

        return {
            startingDasha: nakshatraLord,
            balance: period - (elapsed % period)
        };
    }

    /**
     * Get current dasha
     * @param {Date} birthDate - Birth date
     * @param {Date} currentDate - Current date
     * @param {Object} balance - Dasha balance
     * @returns {Object} Current dasha info
     */
    getCurrentDasha(birthDate, currentDate, balance) {
        const totalYears = this.calculateElapsedYears(birthDate, currentDate);
        let remainingYears = totalYears;

        // Start from balance
        let currentLord = balance.startingDasha;
        let dashaYears = balance.balance;

        if (remainingYears < dashaYears) {
            return {
                mahadasha: currentLord,
                antardasha: currentLord,
                remainingYears: dashaYears - remainingYears
            };
        }

        remainingYears -= dashaYears;

        // Cycle through dasha order
        for (const lord of this.dashaOrder) {
            if (remainingYears <= 0) break;

            dashaYears = this.dashaPeriods[lord];
            if (remainingYears < dashaYears) {
                return {
                    mahadasha: lord,
                    antardasha: lord,
                    remainingYears: dashaYears - remainingYears
                };
            }
            remainingYears -= dashaYears;
        }

        return { mahadasha: 'Venus', antardasha: 'Venus', remainingYears: 0 };
    }

    getNakshatraLord(nakshatra) {
        const lords = ['Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury', 'Ketu', 'Venus'];
        return lords[nakshatra % 9];
    }

    calculateElapsedYears(startDate, endDate = new Date()) {
        const diffTime = Math.abs(endDate - startDate);
        return diffTime / (1000 * 60 * 60 * 24 * 365.25);
    }
}

/**
 * Weather prediction using astrological indicators
 */
class WeatherPredictor {
    constructor() {
        this.weatherIndicators = {
            moon: {
                signs: {
                    0: 'Cold and dry', 1: 'Variable', 2: 'Stormy', 3: 'Showers',
                    4: 'Fair weather', 5: 'Hot and humid', 6: 'Windy', 7: 'Cloudy',
                    8: 'Clear skies', 9: 'Pleasant', 10: 'Unsettled', 11: 'Cold fronts'
                }
            },
            saturn: {
                aspects: {
                    conjunction: 'Cold weather',
                    square: 'Severe weather',
                    opposition: 'Extreme conditions'
                }
            },
            rahu: {
                influence: 'Unpredictable weather, fog, precipitation'
            }
        };
    }

    predictWeather(transits, latitude, longitude) {
        const weather = {
            location: { latitude, longitude },
            predictions: [],
            confidence: 0
        };

        // Analyze lunar position
        const moonSign = Math.floor(transits.positions.MOON / 30);
        const moonWeather = this.weatherIndicators.moon.signs[moonSign];

        // Analyze Saturn aspects
        const saturnAspects = transits.aspects.filter(a => a.transitingPlanet === 'SATURN');
        const saturnWeather = saturnAspects.length > 0 ?
            this.weatherIndicators.saturn.aspects[saturnAspects[0].aspect.toLowerCase()] : null;

        // Analyze Rahu influence
        const rahuAspects = transits.aspects.filter(a => a.transitingPlanet === 'RAHU');
        const rahuWeather = rahuAspects.length > 0 ?
            this.weatherIndicators.rahu.influence : null;

        // Seasonal adjustments
        const season = this.getSeason(latitude, new Date());
        const seasonalAdjustment = this.getSeasonalWeather(season);

        weather.predictions = [
            { type: 'Lunar', prediction: moonWeather, strength: 70 },
            { type: 'Saturn', prediction: saturnWeather, strength: saturnWeather ? 80 : 0 },
            { type: 'Rahu', prediction: rahuWeather, strength: rahuWeather ? 60 : 0 },
            { type: 'Seasonal', prediction: seasonalAdjustment, strength: 90 }
        ].filter(p => p.prediction);

        weather.confidence = weather.predictions.length > 0 ?
            weather.predictions.reduce((sum, p) => sum + p.strength, 0) / weather.predictions.length : 0;

        return weather;
    }

    getSeason(latitude, date) {
        const month = date.getMonth() + 1;
        const isNorthern = latitude > 0;

        if (isNorthern) {
            if (month >= 3 && month <= 5) return 'spring';
            if (month >= 6 && month <= 8) return 'summer';
            if (month >= 9 && month <= 11) return 'autumn';
            return 'winter';
        } else {
            if (month >= 3 && month <= 5) return 'autumn';
            if (month >= 6 && month <= 8) return 'winter';
            if (month >= 9 && month <= 11) return 'spring';
            return 'summer';
        }
    }

    getSeasonalWeather(season) {
        const seasonalWeather = {
            spring: 'Variable weather, possible rain',
            summer: 'Warm to hot, possible thunderstorms',
            autumn: 'Cooling temperatures, windy',
            winter: 'Cold weather, possible snow'
        };

        return seasonalWeather[season];
    }
}

/**
 * Economic analysis using astrological indicators
 */
class EconomicAnalyzer {
    constructor() {
        this.economicIndicators = {
            jupiter: {
                aspects: {
                    conjunction: 'Economic expansion',
                    trine: 'Market growth',
                    sextile: 'Stable growth'
                }
            },
            saturn: {
                aspects: {
                    conjunction: 'Economic contraction',
                    square: 'Market volatility',
                    opposition: 'Recession indicators'
                }
            },
            mercury: {
                aspects: {
                    conjunction: 'Trading activity',
                    square: 'Market fluctuations',
                    trine: 'Commercial success'
                }
            }
        };
    }

    analyzeEconomy(transits, nationalHoroscope) {
        const analysis = {
            indicators: [],
            predictions: [],
            confidence: 0
        };

        // Analyze Jupiter aspects (expansion/growth)
        const jupiterAspects = transits.aspects.filter(a => a.transitingPlanet === 'JUPITER');
        if (jupiterAspects.length > 0) {
            const aspect = jupiterAspects[0];
            analysis.indicators.push({
                planet: 'Jupiter',
                aspect: aspect.aspect,
                effect: this.economicIndicators.jupiter.aspects[aspect.aspect.toLowerCase()] || 'Economic influence',
                strength: aspect.strength
            });
        }

        // Analyze Saturn aspects (contraction/challenges)
        const saturnAspects = transits.aspects.filter(a => a.transitingPlanet === 'SATURN');
        if (saturnAspects.length > 0) {
            const aspect = saturnAspects[0];
            analysis.indicators.push({
                planet: 'Saturn',
                aspect: aspect.aspect,
                effect: this.economicIndicators.saturn.aspects[aspect.aspect.toLowerCase()] || 'Economic pressure',
                strength: aspect.strength
            });
        }

        // Analyze Mercury aspects (commerce/trade)
        const mercuryAspects = transits.aspects.filter(a => a.transitingPlanet === 'MERCURY');
        if (mercuryAspects.length > 0) {
            const aspect = mercuryAspects[0];
            analysis.indicators.push({
                planet: 'Mercury',
                aspect: aspect.aspect,
                effect: this.economicIndicators.mercury.aspects[aspect.aspect.toLowerCase()] || 'Commercial activity',
                strength: aspect.strength
            });
        }

        // Generate predictions
        analysis.predictions = this.generateEconomicPredictions(analysis.indicators);
        analysis.confidence = analysis.indicators.length > 0 ?
            analysis.indicators.reduce((sum, i) => sum + i.strength, 0) / analysis.indicators.length : 0;

        return analysis;
    }

    generateEconomicPredictions(indicators) {
        const predictions = [];

        for (const indicator of indicators) {
            if (indicator.planet === 'Jupiter' && ['Conjunction', 'Trine', 'Sextile'].includes(indicator.aspect)) {
                predictions.push('Economic growth expected');
            } else if (indicator.planet === 'Saturn' && ['Conjunction', 'Square', 'Opposition'].includes(indicator.aspect)) {
                predictions.push('Economic challenges ahead');
            } else if (indicator.planet === 'Mercury') {
                predictions.push('Market volatility in commercial sectors');
            }
        }

        return predictions.length > 0 ? predictions : ['Stable economic conditions'];
    }
}

module.exports = {
    TransitPredictor,
    NationalDashaAnalyzer,
    VimshottariDasha,
    WeatherPredictor,
    EconomicAnalyzer
};