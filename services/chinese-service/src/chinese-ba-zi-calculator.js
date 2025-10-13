// Chinese Ba-Zi (Four Pillars) Calculator
// Module for calculating the four pillars of destiny: Year, Month, Day, Hour

const { HEAVENLY_STEMS, EARTHLY_BRANCHES, STEM_ELEMENTS, CHINESE_ASTRO_CONSTANTS } = require('./chinese-birth-chart-constants');
const { gregorianToJulianDay, mod, getAnimalSign } = require('./chinese-birth-chart-utils');
const { gregorianToLunar } = require('./chinese-lunar-calendar');

/**
 * Calculate complete Ba-Zi (Four Pillars) for birth data
 * @param {Object} birthData - Birth information
 * @returns {Object} Complete Ba-Zi chart
 */
function calculateBaZi(birthData) {
    // Step 1: Convert to lunar date and time
    const lunarData = gregorianToLunar(birthData);

    // Step 2: Calculate year pillar
    const yearPillar = calculateYearPillar(lunarData.lunarYear);

    // Step 3: Calculate month pillar
    const monthPillar = calculateMonthPillar(lunarData.lunarYear, lunarData.solarTerm);

    // Step 4: Calculate day pillar
    const dayPillar = calculateDayPillar(birthData);

    // Step 5: Calculate hour pillar
    const hourPillar = calculateHourPillar(dayPillar.stem, birthData.hour);

    return {
        year: yearPillar,
        month: monthPillar,
        day: dayPillar,
        hour: hourPillar,
        lunarDate: lunarData
    };
}

/**
 * Calculate year pillar stem and branch
 * @param {number} lunarYear - Lunar year
 * @returns {Object} Year pillar with stem and branch
 */
function calculateYearPillar(lunarYear) {
    // Calculate years since Jia Zi (1984)
    const yearsSinceJiaZi = lunarYear - CHINESE_ASTRO_CONSTANTS.JIA_ZI_YEAR;

    // Find stem index (10 stems cycle every 10 years)
    const stemIndex = mod(yearsSinceJiaZi, 10);

    // Find branch index (12 branches cycle every 12 years)
    const branchIndex = mod(yearsSinceJiaZi, 12);

    return {
        stem: HEAVENLY_STEMS[stemIndex],
        branch: EARTHLY_BRANCHES[branchIndex],
        element: STEM_ELEMENTS[HEAVENLY_STEMS[stemIndex]],
        animal: getAnimalSign(EARTHLY_BRANCHES[branchIndex])
    };
}

/**
 * Calculate month pillar
 * @param {number} lunarYear - Lunar year
 * @param {Object} solarTerm - Current solar term
 * @returns {Object} Month pillar
 */
function calculateMonthPillar(lunarYear, solarTerm) {
    // Month is determined by solar term
    const monthIndex = Math.floor(solarTerm.longitude / 30);

    // Stem calculation based on year stem and month
    const yearStemIndex = HEAVENLY_STEMS.indexOf(calculateYearPillar(lunarYear).stem);
    const monthStemIndex = mod(yearStemIndex * 2 + monthIndex, 10);

    return {
        stem: HEAVENLY_STEMS[monthStemIndex],
        branch: EARTHLY_BRANCHES[monthIndex],
        element: STEM_ELEMENTS[HEAVENLY_STEMS[monthStemIndex]],
        animal: getAnimalSign(EARTHLY_BRANCHES[monthIndex])
    };
}

/**
 * Calculate day pillar
 * @param {Object} birthData - Birth date and time
 * @returns {Object} Day pillar
 */
function calculateDayPillar(birthData) {
    const timezoneOffset = birthData.timezoneOffset || 0;
    const jd = gregorianToJulianDay(birthData.year, birthData.month, birthData.day, 0, 0, 0, timezoneOffset);

    // Calculate days since reference date
    const referenceJD = gregorianToJulianDay(2000, 1, 1, 0, 0, 0, timezoneOffset); // Jia Zi day reference
    const daysSinceReference = Math.floor(jd - referenceJD);

    // Find stem and branch for day
    const stemIndex = mod(daysSinceReference + 6, 10); // +6 to align with Jia Zi
    const branchIndex = mod(daysSinceReference + 2, 12); // +2 to align with Zi

    return {
        stem: HEAVENLY_STEMS[stemIndex],
        branch: EARTHLY_BRANCHES[branchIndex],
        element: STEM_ELEMENTS[HEAVENLY_STEMS[stemIndex]],
        animal: getAnimalSign(EARTHLY_BRANCHES[branchIndex])
    };
}

/**
 * Calculate hour pillar
 * @param {string} dayStem - Day stem
 * @param {number} hour - Birth hour (0-23)
 * @returns {Object} Hour pillar
 */
function calculateHourPillar(dayStem, hour) {
    // Convert hour to double-hour (2-hour periods)
    const doubleHour = Math.floor(hour / 2);

    // Find starting stem based on day stem
    const dayStemIndex = HEAVENLY_STEMS.indexOf(dayStem);
    const hourStemIndex = mod(dayStemIndex * 2 + doubleHour, 10);

    return {
        stem: HEAVENLY_STEMS[hourStemIndex],
        branch: EARTHLY_BRANCHES[doubleHour],
        element: STEM_ELEMENTS[HEAVENLY_STEMS[hourStemIndex]],
        animal: getAnimalSign(EARTHLY_BRANCHES[doubleHour])
    };
}

/**
 * Get double-hour range for a given hour
 * @param {number} hour - Hour (0-23)
 * @returns {Object} Double-hour information
 */
function getDoubleHourInfo(hour) {
    const doubleHour = Math.floor(hour / 2);
    const startHour = doubleHour * 2;
    const endHour = startHour + 1;

    return {
        doubleHour: doubleHour,
        range: `${startHour}:00-${endHour}:59`,
        branch: EARTHLY_BRANCHES[doubleHour],
        animal: getAnimalSign(EARTHLY_BRANCHES[doubleHour])
    };
}

/**
 * Validate Ba-Zi calculation
 * @param {Object} baZi - Ba-Zi chart
 * @returns {boolean} True if valid
 */
function validateBaZi(baZi) {
    const requiredPillars = ['year', 'month', 'day', 'hour'];
    const requiredFields = ['stem', 'branch', 'element', 'animal'];

    for (const pillar of requiredPillars) {
        if (!baZi[pillar]) return false;

        for (const field of requiredFields) {
            if (!baZi[pillar][field]) return false;
        }

        // Validate stems and branches are in correct arrays
        if (!HEAVENLY_STEMS.includes(baZi[pillar].stem)) return false;
        if (!EARTHLY_BRANCHES.includes(baZi[pillar].branch)) return false;
    }

    return true;
}

/**
 * Get Ba-Zi summary
 * @param {Object} baZi - Ba-Zi chart
 * @returns {string} Summary string
 */
function getBaZiSummary(baZi) {
    return `${baZi.year.stem}${baZi.year.branch} ${baZi.month.stem}${baZi.month.branch} ${baZi.day.stem}${baZi.day.branch} ${baZi.hour.stem}${baZi.hour.branch}`;
}

module.exports = {
    calculateBaZi,
    calculateYearPillar,
    calculateMonthPillar,
    calculateDayPillar,
    calculateHourPillar,
    getDoubleHourInfo,
    validateBaZi,
    getBaZiSummary
};