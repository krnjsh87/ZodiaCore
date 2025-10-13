/**
 * ZodiaCore - Nakshatra Calculation Methods
 *
 * Complete nakshatra system with 27 lunar mansions, lords, deities, and attributes.
 * Includes pada calculations and comprehensive nakshatra data.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { ASTRO_CONSTANTS, NAKSHATRA_LORDS, NAKSHATRA_NAMES } = require('./astro-constants');
const { normalizeAngle } = require('./math-utils');

/**
 * Nakshatra Calculator Class
 * Provides complete nakshatra calculations and attributes
 */
class NakshatraCalculator {
    constructor() {
        // Complete nakshatra data with all attributes
        this.nakshatraData = [
            {
                name: 'Ashwini',
                startDegree: 0,
                endDegree: 13.333333,
                lord: 'KETU',
                deity: 'Ashwini Kumaras',
                symbol: 'Horse Head',
                nature: 'Divine',
                quality: 'Rajas',
                caste: 'Vaishya',
                direction: 'South',
                animal: 'Horse (Male)',
                tree: 'Strychnine',
                favorable: ['Travel', 'Medicine', 'Healing'],
                unfavorable: ['Marriage', 'Investment']
            },
            {
                name: 'Bharani',
                startDegree: 13.333333,
                endDegree: 26.666667,
                lord: 'VENUS',
                deity: 'Yama',
                symbol: 'Yoni',
                nature: 'Human',
                quality: 'Tamas',
                caste: 'Mleccha',
                direction: 'South',
                animal: 'Elephant',
                tree: 'Hiptage',
                favorable: ['Courage', 'Strength', 'Endurance'],
                unfavorable: ['New beginnings', 'Marriage']
            },
            {
                name: 'Krittika',
                startDegree: 26.666667,
                endDegree: 40.0,
                lord: 'SUN',
                deity: 'Agni',
                symbol: 'Knife',
                nature: 'Divine',
                quality: 'Rajas',
                caste: 'Brahmin',
                direction: 'East',
                animal: 'Goat',
                tree: 'Peepal',
                favorable: ['Fire rituals', 'Purification', 'Leadership'],
                unfavorable: ['Delay', 'Procrastination']
            },
            {
                name: 'Rohini',
                startDegree: 40.0,
                endDegree: 53.333333,
                lord: 'MOON',
                deity: 'Brahma',
                symbol: 'Cart',
                nature: 'Human',
                quality: 'Sattva',
                caste: 'Brahmin',
                direction: 'East',
                animal: 'Cow',
                tree: 'Jamun',
                favorable: ['Growth', 'Prosperity', 'Arts'],
                unfavorable: ['Arguments', 'Conflicts']
            },
            {
                name: 'Mrigashira',
                startDegree: 53.333333,
                endDegree: 66.666667,
                lord: 'MARS',
                deity: 'Soma',
                symbol: 'Deer Head',
                nature: 'Divine',
                quality: 'Tamas',
                caste: 'Shudra',
                direction: 'South',
                animal: 'Deer',
                tree: 'Khair',
                favorable: ['Searching', 'Research', 'Travel'],
                unfavorable: ['Stability', 'Commitment']
            },
            {
                name: 'Ardra',
                startDegree: 66.666667,
                endDegree: 80.0,
                lord: 'RAHU',
                deity: 'Rudra',
                symbol: 'Teardrop',
                nature: 'Human',
                quality: 'Rajas',
                caste: 'Mleccha',
                direction: 'North',
                animal: 'Dog',
                tree: 'Babul',
                favorable: ['Transformation', 'Destruction of old'],
                unfavorable: ['Stability', 'Patience']
            },
            {
                name: 'Punarvasu',
                startDegree: 80.0,
                endDegree: 93.333333,
                lord: 'JUPITER',
                deity: 'Aditi',
                symbol: 'Bow',
                nature: 'Divine',
                quality: 'Sattva',
                caste: 'Brahmin',
                direction: 'North',
                animal: 'Cat',
                tree: 'Banyan',
                favorable: ['Renewal', 'Second chances', 'Learning'],
                unfavorable: ['Impulsiveness']
            },
            {
                name: 'Pushya',
                startDegree: 93.333333,
                endDegree: 106.666667,
                lord: 'SATURN',
                deity: 'Brihaspati',
                symbol: 'Flower',
                nature: 'Divine',
                quality: 'Sattva',
                caste: 'Vaishya',
                direction: 'East',
                animal: 'Goat',
                tree: 'Peepal',
                favorable: ['Nourishment', 'Care', 'Spirituality'],
                unfavorable: ['Aggression', 'Violence']
            },
            {
                name: 'Ashlesha',
                startDegree: 106.666667,
                endDegree: 120.0,
                lord: 'MERCURY',
                deity: 'Nagakanya',
                symbol: 'Serpent',
                nature: 'Divine',
                quality: 'Tamas',
                caste: 'Shudra',
                direction: 'South',
                animal: 'Cat',
                tree: 'Strychnine',
                favorable: ['Secrets', 'Mysteries', 'Healing'],
                unfavorable: ['Trust', 'Openness']
            },
            {
                name: 'Magha',
                startDegree: 120.0,
                endDegree: 133.333333,
                lord: 'KETU',
                deity: 'Pitris',
                symbol: 'Throne',
                nature: 'Human',
                quality: 'Rajas',
                caste: 'Kshatriya',
                direction: 'North',
                animal: 'Rat',
                tree: 'Banyan',
                favorable: ['Authority', 'Ancestors', 'Royalty'],
                unfavorable: ['Subordination']
            },
            {
                name: 'Purva Phalguni',
                startDegree: 133.333333,
                endDegree: 146.666667,
                lord: 'VENUS',
                deity: 'Bhaga',
                symbol: 'Bed',
                nature: 'Human',
                quality: 'Rajas',
                caste: 'Vaishya',
                direction: 'South',
                animal: 'Rat',
                tree: 'Palash',
                favorable: ['Pleasure', 'Marriage', 'Arts'],
                unfavorable: ['Conflict', 'Arguments']
            },
            {
                name: 'Uttara Phalguni',
                startDegree: 146.666667,
                endDegree: 160.0,
                lord: 'SUN',
                deity: 'Aryaman',
                symbol: 'Bed',
                nature: 'Human',
                quality: 'Sattva',
                caste: 'Brahmin',
                direction: 'North',
                animal: 'Bull',
                tree: 'Jamun',
                favorable: ['Friendship', 'Patronage', 'Service'],
                unfavorable: ['Selfishness']
            },
            {
                name: 'Hasta',
                startDegree: 160.0,
                endDegree: 173.333333,
                lord: 'MOON',
                deity: 'Savitar',
                symbol: 'Hand',
                nature: 'Human',
                quality: 'Rajas',
                caste: 'Vaishya',
                direction: 'West',
                animal: 'Buffalo',
                tree: 'Jamun',
                favorable: ['Skills', 'Crafts', 'Healing'],
                unfavorable: ['Overconfidence']
            },
            {
                name: 'Chitra',
                startDegree: 173.333333,
                endDegree: 186.666667,
                lord: 'MARS',
                deity: 'Vishwakarma',
                symbol: 'Pearl',
                nature: 'Human',
                quality: 'Rajas',
                caste: 'Kshatriya',
                direction: 'West',
                animal: 'Tiger',
                tree: 'Palash',
                favorable: ['Beauty', 'Artistry', 'Architecture'],
                unfavorable: ['Rudeness']
            },
            {
                name: 'Swati',
                startDegree: 186.666667,
                endDegree: 200.0,
                lord: 'RAHU',
                deity: 'Vayu',
                symbol: 'Coral',
                nature: 'Divine',
                quality: 'Sattva',
                caste: 'Vaishya',
                direction: 'North',
                animal: 'Buffalo',
                tree: 'Arjuna',
                favorable: ['Independence', 'Freedom', 'Balance'],
                unfavorable: ['Dependence', 'Restriction']
            },
            {
                name: 'Vishakha',
                startDegree: 200.0,
                endDegree: 213.333333,
                lord: 'JUPITER',
                deity: 'Indra',
                symbol: 'Arch',
                nature: 'Human',
                quality: 'Rajas',
                caste: 'Kshatriya',
                direction: 'West',
                animal: 'Tiger',
                tree: 'Kadam',
                favorable: ['Achievement', 'Goals', 'Leadership'],
                unfavorable: ['Manipulation']
            },
            {
                name: 'Anuradha',
                startDegree: 213.333333,
                endDegree: 226.666667,
                lord: 'SATURN',
                deity: 'Mitra',
                symbol: 'Lotus',
                nature: 'Human',
                quality: 'Sattva',
                caste: 'Vaishya',
                direction: 'West',
                animal: 'Deer',
                tree: 'Arjuna',
                favorable: ['Friendship', 'Devotion', 'Success'],
                unfavorable: ['Ego', 'Pride']
            },
            {
                name: 'Jyeshtha',
                startDegree: 226.666667,
                endDegree: 240.0,
                lord: 'MERCURY',
                deity: 'Indra',
                symbol: 'Umbrella',
                nature: 'Divine',
                quality: 'Rajas',
                caste: 'Kshatriya',
                direction: 'North',
                animal: 'Cat',
                tree: 'Mango',
                favorable: ['Eldership', 'Wisdom', 'Protection'],
                unfavorable: ['Youthful activities']
            },
            {
                name: 'Moola',
                startDegree: 240.0,
                endDegree: 253.333333,
                lord: 'KETU',
                deity: 'Nirriti',
                symbol: 'Bunch of roots',
                nature: 'Divine',
                quality: 'Tamas',
                caste: 'Shudra',
                direction: 'South',
                animal: 'Dog',
                tree: 'Babul',
                favorable: ['Research', 'Investigation', 'Transformation'],
                unfavorable: ['Superficiality']
            },
            {
                name: 'Purva Ashadha',
                startDegree: 253.333333,
                endDegree: 266.666667,
                lord: 'VENUS',
                deity: 'Apah',
                symbol: 'Elephant tusk',
                nature: 'Human',
                quality: 'Sattva',
                caste: 'Mleccha',
                direction: 'South',
                animal: 'Monkey',
                tree: 'Babul',
                favorable: ['Victory', 'Invincibility', 'Success'],
                unfavorable: ['Defeat', 'Surrender']
            },
            {
                name: 'Uttara Ashadha',
                startDegree: 266.666667,
                endDegree: 280.0,
                lord: 'SUN',
                deity: 'Vishwadevas',
                symbol: 'Elephant tusk',
                nature: 'Human',
                quality: 'Sattva',
                caste: 'Kshatriya',
                direction: 'North',
                animal: 'Mongoose',
                tree: 'Kadam',
                favorable: ['Truth', 'Honesty', 'Leadership'],
                unfavorable: ['Deception', 'Dishonesty']
            },
            {
                name: 'Shravana',
                startDegree: 280.0,
                endDegree: 293.333333,
                lord: 'MOON',
                deity: 'Vishnu',
                symbol: 'Ear',
                nature: 'Divine',
                quality: 'Sattva',
                caste: 'Brahmin',
                direction: 'North',
                animal: 'Monkey',
                tree: 'Peepal',
                favorable: ['Learning', 'Teaching', 'Spirituality'],
                unfavorable: ['Ignorance']
            },
            {
                name: 'Dhanishtha',
                startDegree: 293.333333,
                endDegree: 306.666667,
                lord: 'MARS',
                deity: 'Vasus',
                symbol: 'Drum',
                nature: 'Divine',
                quality: 'Rajas',
                caste: 'Vaishya',
                direction: 'West',
                animal: 'Lion',
                tree: 'Shami',
                favorable: ['Music', 'Arts', 'Prosperity'],
                unfavorable: ['Poverty', 'Debt']
            },
            {
                name: 'Shatabhisha',
                startDegree: 306.666667,
                endDegree: 320.0,
                lord: 'RAHU',
                deity: 'Varuna',
                symbol: 'Empty circle',
                nature: 'Human',
                quality: 'Rajas',
                caste: 'Shudra',
                direction: 'South',
                animal: 'Horse',
                tree: 'Neem',
                favorable: ['Healing', 'Mysticism', 'Secrets'],
                unfavorable: ['Revealing secrets']
            },
            {
                name: 'Purva Bhadrapada',
                startDegree: 320.0,
                endDegree: 333.333333,
                lord: 'JUPITER',
                deity: 'Aja Ekapada',
                symbol: 'Sword',
                nature: 'Human',
                quality: 'Tamas',
                caste: 'Mleccha',
                direction: 'East',
                animal: 'Lion',
                tree: 'Neem',
                favorable: ['Transformation', 'Spiritual growth'],
                unfavorable: ['Materialism']
            },
            {
                name: 'Uttara Bhadrapada',
                startDegree: 333.333333,
                endDegree: 346.666667,
                lord: 'SATURN',
                deity: 'Ahir Budhnya',
                symbol: 'Twin',
                nature: 'Human',
                quality: 'Sattva',
                caste: 'Brahmin',
                direction: 'West',
                animal: 'Cow',
                tree: 'Palash',
                favorable: ['Wisdom', 'Patience', 'Stability'],
                unfavorable: ['Impatience', 'Instability']
            },
            {
                name: 'Revati',
                startDegree: 346.666667,
                endDegree: 360.0,
                lord: 'MERCURY',
                deity: 'Pushan',
                symbol: 'Fish',
                nature: 'Divine',
                quality: 'Sattva',
                caste: 'Vaishya',
                direction: 'North',
                animal: 'Elephant',
                tree: 'Markandika',
                favorable: ['Wealth', 'Prosperity', 'Journey'],
                unfavorable: ['Poverty', 'Stagnation']
            }
        ];
    }

    /**
     * Calculate Nakshatra and Pada from lunar longitude
     * @param {number} moonLongitude - Moon's sidereal longitude in degrees
     * @returns {Object} Nakshatra details
     */
    calculateNakshatra(moonLongitude) {
        const normalizedLongitude = normalizeAngle(moonLongitude);

        // Each nakshatra spans 13°20' (800 arcminutes)
        const nakshatraIndex = Math.floor(normalizedLongitude / ASTRO_CONSTANTS.DEGREES_PER_NAKSHATRA);
        const remainingDegrees = normalizedLongitude % ASTRO_CONSTANTS.DEGREES_PER_NAKSHATRA;

        // Each nakshatra has 4 padas of 3°20' each
        const padaIndex = Math.floor(remainingDegrees / (ASTRO_CONSTANTS.DEGREES_PER_NAKSHATRA / 4)) + 1;
        const padaDegrees = remainingDegrees % (ASTRO_CONSTANTS.DEGREES_PER_NAKSHATRA / 4);

        return {
            nakshatraNumber: nakshatraIndex + 1,
            nakshatraName: NAKSHATRA_NAMES[nakshatraIndex],
            nakshatra: nakshatraIndex,
            pada: padaIndex,
            lord: NAKSHATRA_LORDS[nakshatraIndex],
            degreesInNakshatra: remainingDegrees,
            degreesInPada: padaDegrees,
            remainingDegrees: ASTRO_CONSTANTS.DEGREES_PER_NAKSHATRA - remainingDegrees
        };
    }

    /**
     * Get complete nakshatra information
     * @param {number} longitude - Lunar longitude in degrees
     * @returns {Object} Complete nakshatra information
     */
    getNakshatraInfo(longitude) {
        const basicInfo = this.calculateNakshatra(longitude);
        const detailedInfo = this.nakshatraData[basicInfo.nakshatra];

        return {
            ...basicInfo,
            ...detailedInfo
        };
    }

    /**
     * Get nakshatra by number (1-27)
     * @param {number} number - Nakshatra number (1-27)
     * @returns {Object} Nakshatra data
     */
    getNakshatraByNumber(number) {
        if (number < 1 || number > 27) {
            throw new Error('Nakshatra number must be between 1 and 27');
        }
        return this.nakshatraData[number - 1];
    }

    /**
     * Get nakshatra by name
     * @param {string} name - Nakshatra name
     * @returns {Object} Nakshatra data
     */
    getNakshatraByName(name) {
        const nakshatra = this.nakshatraData.find(n => n.name.toLowerCase() === name.toLowerCase());
        if (!nakshatra) {
            throw new Error(`Nakshatra '${name}' not found`);
        }
        return nakshatra;
    }

    /**
     * Get all nakshatras ruled by a planet
     * @param {string} planet - Planet name
     * @returns {Array} Array of nakshatra objects
     */
    getNakshatrasByLord(planet) {
        return this.nakshatraData.filter(n => n.lord === planet.toUpperCase());
    }

    /**
     * Calculate pada strength based on position in pada
     * @param {number} degreesInPada - Degrees into the pada
     * @returns {number} Strength score (0-1)
     */
    calculatePadaStrength(degreesInPada) {
        const padaSize = ASTRO_CONSTANTS.DEGREES_PER_NAKSHATRA / 4;
        const position = degreesInPada / padaSize;

        // Strength is highest at the beginning of pada and decreases
        return Math.max(0, 1 - position * 0.5);
    }

    /**
     * Get favorable activities for a nakshatra
     * @param {number} longitude - Lunar longitude in degrees
     * @returns {Array} Array of favorable activities
     */
    getFavorableActivities(longitude) {
        const info = this.getNakshatraInfo(longitude);
        return info.favorable || [];
    }

    /**
     * Get unfavorable activities for a nakshatra
     * @param {number} longitude - Lunar longitude in degrees
     * @returns {Array} Array of unfavorable activities
     */
    getUnfavorableActivities(longitude) {
        const info = this.getNakshatraInfo(longitude);
        return info.unfavorable || [];
    }

    /**
     * Check if an activity is favorable for the current nakshatra
     * @param {number} longitude - Lunar longitude in degrees
     * @param {string} activity - Activity to check
     * @returns {boolean} True if favorable
     */
    isActivityFavorable(longitude, activity) {
        const favorable = this.getFavorableActivities(longitude);
        return favorable.some(act => act.toLowerCase().includes(activity.toLowerCase()));
    }
}

module.exports = NakshatraCalculator;