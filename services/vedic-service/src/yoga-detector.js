/**
 * ZodiaCore - Yoga Detector
 *
 * Comprehensive Yoga detection system for Vedic astrology.
 * Detects Raja Yogas, Dhana Yogas, Arishta Yogas, and other planetary combinations.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { YOGA_STRENGTH_LEVELS } = require('./deep-horoscope-constants');
const { PLANETS } = require('./astro-constants');
const { isConjunct, hasAspect } = require('./astrology-utils');

/**
 * Comprehensive Yoga detection system
 */
class YogaDetector {
    constructor(birthChart) {
        this.birthChart = birthChart;
        this.yogaRules = this.loadYogaRules();
    }

    /**
     * Detect all applicable yogas in the chart
     * @returns {Object} All detected yogas categorized by type
     */
    detectAllYogas() {
        const yogas = {
            rajaYogas: this.detectRajaYogas(),
            dhanaYogas: this.detectDhanaYogas(),
            arishtaYogas: this.detectArishtaYogas(),
            nabhasYogas: this.detectNabhasYogas(),
            otherYogas: this.detectOtherYogas()
        };

        return yogas;
    }

    /**
     * Detect Raja Yogas (power and authority combinations)
     * @returns {Array} Array of detected Raja Yogas
     */
    detectRajaYogas() {
        const rajaYogas = [];

        // Kendra-Trikona Raja Yoga
        const kendraLords = this.getKendraLords();
        const trikonaLords = this.getTrikonaLords();

        for (const kendraLord of kendraLords) {
            for (const trikonaLord of trikonaLords) {
                if (this.arePlanetsConnected(kendraLord, trikonaLord)) {
                    rajaYogas.push({
                        name: 'Kendra-Trikona Raja Yoga',
                        type: 'Raja',
                        strength: this.calculateYogaStrength(kendraLord, trikonaLord),
                        planets: [kendraLord, trikonaLord],
                        effects: this.getRajaYogaEffects(kendraLord, trikonaLord),
                        activation: this.getYogaActivation(kendraLord, trikonaLord)
                    });
                }
            }
        }

        // Dharma-Karmadhipati Yoga
        if (this.isDharmaKarmadhipatiYoga()) {
            rajaYogas.push({
                name: 'Dharma-Karmadhipati Raja Yoga',
                type: 'Raja',
                strength: 'Strong',
                planets: [this.getDharmaLord(), this.getKarmaLord()],
                effects: 'Ethical success, respected profession, spiritual authority',
                activation: 'During periods of involved planets'
            });
        }

        // Other Raja Yogas
        const otherRajaYogas = this.detectOtherRajaYogas();
        rajaYogas.push(...otherRajaYogas);

        return rajaYogas;
    }

    /**
     * Detect Dhana Yogas (wealth combinations)
     * @returns {Array} Array of detected Dhana Yogas
     */
    detectDhanaYogas() {
        const dhanaYogas = [];

        // Classic Dhana Yoga
        if (this.isClassicDhanaYoga()) {
            dhanaYogas.push({
                name: 'Classic Dhana Yoga',
                type: 'Dhana',
                strength: this.calculateDhanaYogaStrength(),
                effects: 'Multiple income sources, financial prosperity',
                activation: 'During 2nd, 5th, 9th, 11th lord periods'
            });
        }

        // Lakshmi Yoga
        if (this.isLakshmiYoga()) {
            dhanaYogas.push({
                name: 'Lakshmi Yoga',
                type: 'Dhana',
                strength: 'Very Strong',
                effects: 'Extraordinary wealth through righteous means',
                activation: 'Throughout life with periodic peaks'
            });
        }

        // Other wealth yogas
        const otherDhanaYogas = this.detectOtherDhanaYogas();
        dhanaYogas.push(...otherDhanaYogas);

        return dhanaYogas;
    }

    /**
     * Detect Arishta Yogas (challenging combinations)
     * @returns {Array} Array of detected Arishta Yogas
     */
    detectArishtaYogas() {
        const arishtaYogas = [];

        // Pitri Dosh
        if (this.hasPitriDosh()) {
            arishtaYogas.push({
                name: 'Pitri Dosh',
                type: 'Arishta',
                strength: 'Moderate',
                effects: 'Ancestral karma, health issues, family problems',
                remedies: 'Ancestor worship, charity, spiritual practices'
            });
        }

        // Other Arishta Yogas
        const otherArishta = this.detectOtherArishtaYogas();
        arishtaYogas.push(...otherArishta);

        return arishtaYogas;
    }

    /**
     * Detect Nabhas Yogas (space/atmospheric combinations)
     * @returns {Array} Array of detected Nabhas Yogas
     */
    detectNabhasYogas() {
        const nabhasYogas = [];

        // Asraya Yoga
        if (this.hasAsrayaYoga()) {
            nabhasYogas.push({
                name: 'Asraya Yoga',
                type: 'Nabhas',
                strength: 'Strong',
                effects: 'Protection, stability, good fortune',
                activation: 'Throughout life'
            });
        }

        return nabhasYogas;
    }

    /**
     * Detect other miscellaneous yogas
     * @returns {Array} Array of other detected yogas
     */
    detectOtherYogas() {
        const otherYogas = [];

        // Gaja Kesari Yoga
        if (this.hasGajaKesariYoga()) {
            otherYogas.push({
                name: 'Gaja Kesari Yoga',
                type: 'Benefic',
                strength: 'Strong',
                effects: 'Intelligence, wisdom, success, good fortune',
                activation: 'Throughout life, especially Jupiter periods'
            });
        }

        // Panchmahapurusha Yoga
        const panchmahapurusha = this.detectPanchmahapurushaYoga();
        if (panchmahapurusha) {
            otherYogas.push(panchmahapurusha);
        }

        return otherYogas;
    }

    /**
     * Check if two planets are connected (conjunct or aspect)
     * @param {string} planet1 - First planet
     * @param {string} planet2 - Second planet
     * @returns {boolean} True if connected
     */
    arePlanetsConnected(planet1, planet2) {
        // Check conjunction
        if (this.arePlanetsConjunct(planet1, planet2)) {
            return true;
        }

        // Check mutual aspect
        if (this.haveMutualAspect(planet1, planet2)) {
            return true;
        }

        // Check exchange (Parivartana)
        if (this.haveSignExchange(planet1, planet2)) {
            return true;
        }

        return false;
    }

    /**
     * Check if planets are conjunct
     * @param {string} planet1 - First planet
     * @param {string} planet2 - Second planet
     * @returns {boolean} True if conjunct
     */
    arePlanetsConjunct(planet1, planet2) {
        const pos1 = this.birthChart.planets[planet1]?.longitude;
        const pos2 = this.birthChart.planets[planet2]?.longitude;

        if (!pos1 || !pos2) return false;

        return isConjunct(pos1, pos2, 10); // 10 degree orb
    }

    /**
     * Check if planets have mutual aspect
     * @param {string} planet1 - First planet
     * @param {string} planet2 - Second planet
     * @returns {boolean} True if mutual aspect
     */
    haveMutualAspect(planet1, planet2) {
        const pos1 = this.birthChart.planets[planet1]?.longitude;
        const pos2 = this.birthChart.planets[planet2]?.longitude;

        if (!pos1 || !pos2) return false;

        return hasAspect(pos1, pos2, [60, 90, 120, 180], 8); // Vedic aspects with 8° orb
    }

    /**
     * Check if planets have sign exchange
     * @param {string} planet1 - First planet
     * @param {string} planet2 - Second planet
     * @returns {boolean} True if sign exchange
     */
    haveSignExchange(planet1, planet2) {
        const sign1 = this.birthChart.planets[planet1]?.sign;
        const sign2 = this.birthChart.planets[planet2]?.sign;

        if (!sign1 || !sign2) return false;

        return sign1 === this.getPlanetSign(planet2) && sign2 === this.getPlanetSign(planet1);
    }

    /**
     * Calculate yoga strength based on planetary conditions
     * @param {string} planet1 - First planet
     * @param {string} planet2 - Second planet
     * @returns {string} Strength level
     */
    calculateYogaStrength(planet1, planet2) {
        let strength = 0;

        // Exaltation or own sign
        if (this.isExalted(planet1) || this.isInOwnSign(planet1)) strength += 2;
        if (this.isExalted(planet2) || this.isInOwnSign(planet2)) strength += 2;

        // Benefic aspects
        if (this.hasBeneficAspects(planet1)) strength += 1;
        if (this.hasBeneficAspects(planet2)) strength += 1;

        // No malefic aspects
        if (!this.hasMaleficAspects(planet1)) strength += 1;
        if (!this.hasMaleficAspects(planet2)) strength += 1;

        if (strength >= 5) return YOGA_STRENGTH_LEVELS.VERY_STRONG;
        if (strength >= 3) return YOGA_STRENGTH_LEVELS.STRONG;
        if (strength >= 2) return YOGA_STRENGTH_LEVELS.MODERATE;
        return YOGA_STRENGTH_LEVELS.WEAK;
    }

    // Helper methods for specific yoga detections

    getKendraLords() {
        const kendraHouses = [1, 4, 7, 10];
        return kendraHouses.map(house => this.getHouseLord(house)).filter(Boolean);
    }

    getTrikonaLords() {
        const trikonaHouses = [1, 5, 9];
        return trikonaHouses.map(house => this.getHouseLord(house)).filter(Boolean);
    }

    getHouseLord(house) {
        // Simplified house lord calculation
        const houseLords = {
            1: 'MARS', 2: 'VENUS', 3: 'MERCURY', 4: 'MOON',
            5: 'SUN', 6: 'MERCURY', 7: 'VENUS', 8: 'MARS',
            9: 'JUPITER', 10: 'SATURN', 11: 'SATURN', 12: 'JUPITER'
        };
        return houseLords[house];
    }

    isDharmaKarmadhipatiYoga() {
        const dharmaLord = this.getDharmaLord();
        const karmaLord = this.getKarmaLord();
        return this.arePlanetsConnected(dharmaLord, karmaLord);
    }

    getDharmaLord() {
        return this.getHouseLord(9);
    }

    getKarmaLord() {
        return this.getHouseLord(10);
    }

    isClassicDhanaYoga() {
        const secondLord = this.getHouseLord(2);
        const eleventhLord = this.getHouseLord(11);

        // Check if lords are connected or in good houses
        return this.arePlanetsConnected(secondLord, eleventhLord) ||
               this.isPlanetInGoodHouse(secondLord) ||
               this.isPlanetInGoodHouse(eleventhLord);
    }

    isLakshmiYoga() {
        // Venus and Moon in kendra from lagna or each other
        const venusHouse = this.birthChart.planets.VENUS?.house;
        const moonHouse = this.birthChart.planets.MOON?.house;

        const kendraHouses = [1, 4, 7, 10];
        return kendraHouses.includes(venusHouse) && kendraHouses.includes(moonHouse);
    }

    hasGajaKesariYoga() {
        const moonHouse = this.birthChart.planets.MOON?.house;
        const jupiterHouse = this.birthChart.planets.JUPITER?.house;

        // Moon and Jupiter in kendra or trikona from each other
        const goodHouses = [1, 4, 5, 7, 9, 10];
        return goodHouses.includes(moonHouse) && goodHouses.includes(jupiterHouse);
    }

    detectPanchmahapurushaYoga() {
        // Check for Bhadra Yoga (Mercury in own sign in kendra)
        if (this.isBhadraYoga()) {
            return {
                name: 'Bhadra Yoga',
                type: 'Panchmahapurusha',
                strength: 'Strong',
                effects: 'Intelligence, communication skills, success in business',
                activation: 'Mercury periods'
            };
        }

        // Other Panchmahapurusha Yogas can be added here
        return null;
    }

    isBhadraYoga() {
        const mercury = this.birthChart.planets.MERCURY;
        if (!mercury) return false;

        const kendraHouses = [1, 4, 7, 10];
        return kendraHouses.includes(mercury.house) && this.isInOwnSign('MERCURY');
    }

    hasPitriDosh() {
        // Sun and Rahu conjunction or aspect
        return this.arePlanetsConjunct('SUN', 'RAHU') ||
               this.haveMutualAspect('SUN', 'RAHU');
    }

    hasAsrayaYoga() {
        // All planets in 7 houses or less
        const occupiedHouses = new Set();
        for (const planet of PLANETS) {
            const house = this.birthChart.planets[planet]?.house;
            if (house) occupiedHouses.add(house);
        }
        return occupiedHouses.size <= 7;
    }

    // Utility methods

    isExalted(planet) {
        const planetData = this.birthChart.planets[planet];
        if (!planetData) return false;

        const exaltations = {
            SUN: 0, MOON: 1, MARS: 9, MERCURY: 5,
            JUPITER: 3, VENUS: 11, SATURN: 6
        };
        return exaltations[planet] === planetData.sign;
    }

    isInOwnSign(planet) {
        const planetData = this.birthChart.planets[planet];
        if (!planetData) return false;

        const ownSigns = {
            SUN: [4], MOON: [3], MARS: [0, 7], MERCURY: [2, 5],
            JUPITER: [8, 11], VENUS: [1, 6], SATURN: [9, 10]
        };
        return (ownSigns[planet] || []).includes(planetData.sign);
    }

    hasBeneficAspects(planet) {
        // Simplified check
        return this.getBeneficAspects(planet).length > 0;
    }

    hasMaleficAspects(planet) {
        return this.getMaleficAspects(planet).length > 0;
    }

    getBeneficAspects(planet) {
        const benefics = ['JUPITER', 'VENUS'];
        return this.getAspects(planet).filter(aspect => benefics.includes(aspect.planet));
    }

    getMaleficAspects(planet) {
        const malefics = ['MARS', 'SATURN', 'RAHU', 'KETU'];
        return this.getAspects(planet).filter(aspect => malefics.includes(aspect.planet));
    }

    getAspects(planet) {
        // Simplified aspect detection
        const aspects = [];
        const planetPos = this.birthChart.planets[planet]?.longitude;

        if (!planetPos) return aspects;

        for (const otherPlanet of PLANETS) {
            if (otherPlanet === planet) continue;

            const otherPos = this.birthChart.planets[otherPlanet]?.longitude;
            if (!otherPos) continue;

            if (hasAspect(planetPos, otherPos, [60, 90, 120, 180], 8)) {
                aspects.push({ planet: otherPlanet });
            }
        }

        return aspects;
    }

    isPlanetInGoodHouse(planet) {
        const house = this.birthChart.planets[planet]?.house;
        const goodHouses = [1, 2, 4, 5, 7, 9, 10, 11];
        return goodHouses.includes(house);
    }

    getPlanetSign(planet) {
        return this.birthChart.planets[planet]?.sign;
    }

    // Placeholder methods for additional yogas
    detectOtherRajaYogas() { return []; }
    detectOtherDhanaYogas() { return []; }
    detectOtherArishtaYogas() { return []; }

    // Effect and activation methods
    getRajaYogaEffects(planet1, planet2) {
        return `Power, authority, success in career, leadership qualities through ${planet1} and ${planet2} combination`;
    }

    getYogaActivation(planet1, planet2) {
        return `During ${planet1} and ${planet2} periods, and when both planets are strong`;
    }

    calculateDhanaYogaStrength() {
        // Simplified strength calculation
        return 'Strong';
    }

    loadYogaRules() {
        // Placeholder for loading yoga rules from external source
        return {};
    }
}

module.exports = YogaDetector;