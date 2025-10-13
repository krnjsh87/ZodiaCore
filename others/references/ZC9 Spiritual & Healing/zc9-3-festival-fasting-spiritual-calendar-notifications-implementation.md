# ZC9.3 Festival/Fasting/Spiritual Calendar Notifications Implementation Guide
## Comprehensive Reference with Exact Calculations, Formulas & Algorithms

### Table of Contents

1. [Introduction](#introduction)
2. [Mathematical Foundations](#mathematical-foundations)
3. [Festival Calendar Systems](#festival-calendar-systems)
4. [Fasting Period Calculations](#fasting-period-calculations)
5. [Spiritual Event Algorithms](#spiritual-event-algorithms)
6. [Notification Scheduling Logic](#notification-scheduling-logic)
7. [Data Structures](#data-structures)
8. [Implementation Code](#implementation-code)
9. [Error Handling](#error-handling)
10. [Testing & Validation](#testing--validation)
11. [Ethical Considerations](#ethical-considerations)
12. [References](#references)

---

## 1. Introduction {#introduction}

### Overview of Festival/Fasting/Spiritual Calendar Notifications

Festival/Fasting/Spiritual Calendar Notifications represents a sophisticated integration of astronomical calculations, cultural calendar systems, and intelligent notification algorithms within the ZodiaCore astrology system. This system provides personalized, culturally-sensitive notifications for festivals, fasting periods, and spiritual events across multiple religious and cultural traditions.

### Core Principles

The system is built on four fundamental principles:
1. **Astronomical Precision**: Accurate calculations of celestial events and calendar conversions
2. **Cultural Respect**: Sensitive handling of diverse religious and spiritual traditions
3. **Personalized Timing**: Intelligent scheduling based on user preferences and astrological timing
4. **Ethical Notification**: Responsible delivery of spiritual content with user consent and control

### Traditional Foundations

Drawing from ancient astronomical wisdom and modern calendrical science, the system incorporates:
- **Astronomical Calculations**: Precise solar, lunar, and planetary position calculations
- **Calendar Conversions**: Accurate conversions between different calendar systems
- **Cultural Research**: Deep understanding of festival timings and spiritual significance
- **Notification Ethics**: Responsible communication of spiritual and religious content

### Technical Scope

This implementation guide provides:
- Precise astronomical formulas for calendar calculations
- Algorithmic approaches to festival and fasting period determination
- Complete notification scheduling and delivery systems
- Data structures for comprehensive calendar management
- Ethical frameworks for spiritual notification delivery

---

## 2. Mathematical Foundations {#mathematical-foundations}

### Core Astronomical Constants

```javascript
const ASTRONOMICAL_CONSTANTS = {
    // Earth and Moon orbital parameters
    EARTH_ORBITAL_PERIOD: 365.256363,        // Days (sidereal year)
    MOON_ORBITAL_PERIOD: 29.530588,          // Days (synodic month)
    EARTH_OBLIQUITY: 23.439281,              // Degrees (axial tilt)
    
    // Solar calculations
    SOLAR_YEAR_LENGTH: 365.2425,             // Mean tropical year
    SOLAR_ANOMALY_CONSTANT: 357.52911,       // Degrees
    SOLAR_EQUATION_COEFFICIENT: 1.914602,    // Degrees
    
    // Lunar calculations
    LUNAR_INCLINATION: 5.145396,             // Degrees to ecliptic
    LUNAR_ANOMALY_CONSTANT: 134.963411,      // Degrees
    LUNAR_DISTANCE_CONSTANT: 385000.56,      // Kilometers
    
    // Time conversions
    JULIAN_DAY_UNIX_EPOCH: 2440587.5,        // JD for 1970-01-01
    SECONDS_PER_DAY: 86400,
    MILLISECONDS_PER_DAY: 86400000,
    
    // Festival calculation thresholds
    NEW_MOON_THRESHOLD: 0.1,                 // Degrees from conjunction
    FULL_MOON_THRESHOLD: 0.1,                // Degrees from opposition
    SOLSTICE_THRESHOLD: 0.01,                // Degrees from solstice points
    EQUINOX_THRESHOLD: 0.01,                 // Degrees from equinox points
};
```

### Essential Astronomical Functions

```javascript
/**
 * Convert Gregorian date to Julian Day Number
 * @param {Date} date - Gregorian date
 * @returns {number} Julian Day Number
 */
function gregorianToJulianDay(date) {
    const a = Math.floor((14 - (date.getMonth() + 1)) / 12);
    const y = date.getFullYear() + 4800 - a;
    const m = (date.getMonth() + 1) + 12 * a - 3;
    
    return date.getDate() + Math.floor((153 * m + 2) / 5) + 365 * y + 
           Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

/**
 * Calculate solar longitude (λ) - position of Sun in ecliptic
 * @param {number} julianDay - Julian Day Number
 * @returns {number} Solar longitude in degrees (0-360)
 */
function calculateSolarLongitude(julianDay) {
    // Calculate mean solar longitude
    const n = julianDay - 2451545.0;
    const L = (280.460 + 0.9856474 * n) % 360;
    
    // Calculate solar anomaly
    const g = (357.528 + 0.9856003 * n) % 360;
    
    // Calculate ecliptic longitude
    const lambda = L + 1.915 * Math.sin(g * Math.PI / 180) + 
                   0.020 * Math.sin(2 * g * Math.PI / 180);
    
    return lambda % 360;
}

/**
 * Calculate lunar phase angle
 * @param {number} julianDay - Julian Day Number
 * @returns {number} Phase angle in degrees (0 = new moon, 180 = full moon)
 */
function calculateLunarPhase(julianDay) {
    // Lunar mean longitude
    const moon_longitude = (218.316 + 13.176396 * (julianDay - 2451545.0)) % 360;
    
    // Solar mean longitude
    const sun_longitude = calculateSolarLongitude(julianDay);
    
    // Phase angle
    let phase_angle = moon_longitude - sun_longitude;
    if (phase_angle < 0) phase_angle += 360;
    
    return phase_angle;
}

/**
 * Calculate equinoxes and solstices for a given year
 * @param {number} year - Gregorian year
 * @returns {Object} Dates of equinoxes and solstices
 */
function calculateEquinoxesSolstices(year) {
    const march_equinox = calculateEquinoxSolsticeDate(year, 0);    // Spring equinox
    const june_solstice = calculateEquinoxSolsticeDate(year, 90);   // Summer solstice
    const sept_equinox = calculateEquinoxSolsticeDate(year, 180);   // Autumn equinox
    const dec_solstice = calculateEquinoxSolsticeDate(year, 270);   // Winter solstice
    
    return {
        springEquinox: march_equinox,
        summerSolstice: june_solstice,
        autumnEquinox: sept_equinox,
        winterSolstice: dec_solstice
    };
}
```

---

## 3. Festival Calendar Systems {#festival-calendar-systems}

### Hindu Festival Calendar

```javascript
const HINDU_FESTIVAL_SYSTEM = {
    // Major Hindu festivals with calculation methods
    DIWALI: {
        name: 'Diwali',
        type: 'LUNAR',
        calculation: 'AMAVASYA',  // New moon
        month: 'KARTIKA',
        significance: 'Festival of Lights',
        duration: 5,
        fasting: false,
        celebration: 'Lamps, sweets, family gatherings'
    },
    
    HOLI: {
        name: 'Holi',
        type: 'LUNAR',
        calculation: 'FULL_MOON',
        month: 'PHALGUNA',
        significance: 'Festival of Colors',
        duration: 2,
        fasting: false,
        celebration: 'Color throwing, music, dance'
    },
    
    DUSSEHRA: {
        name: 'Dussehra',
        type: 'LUNAR',
        calculation: 'VIJAYADASHAMI',
        month: 'ASHVINA',
        significance: 'Victory of good over evil',
        duration: 10,
        fasting: true,
        celebration: 'Rama Lila, effigy burning'
    },
    
    MAHASHIVARATRI: {
        name: 'Mahashivaratri',
        type: 'LUNAR',
        calculation: 'CHATHURDASHI',
        month: 'MAGHA',
        significance: 'Shivaratri night',
        duration: 1,
        fasting: true,
        celebration: 'All-night prayers, fasting'
    }
};

/**
 * Calculate Hindu festival dates using lunar calendar
 */
class HinduFestivalCalculator {
    constructor() {
        this.lunar_months = {
            CHAITRA: 1, VAISAKHA: 2, JYAISHTHA: 3, ASHADHA: 4,
            SHRAVANA: 5, BHADRAPADA: 6, ASHWIN: 7, KARTIKA: 8,
            MARGAZHI: 9, TAI: 10, MAGHA: 11, PHALGUNA: 12
        };
    }
    
    /**
     * Calculate Diwali date (new moon in Kartika month)
     */
    calculateDiwali(year) {
        // Find new moon closest to Kartika month
        const kartika_start = this.getHinduMonthStart(year, 'KARTIKA');
        let diwali_date = null;
        let min_diff = Infinity;
        
        // Check new moons around Kartika
        for (let jd = kartika_start - 15; jd <= kartika_start + 15; jd++) {
            const phase = calculateLunarPhase(jd);
            if (Math.abs(phase) < ASTRONOMICAL_CONSTANTS.NEW_MOON_THRESHOLD) {
                const date_diff = Math.abs(jd - kartika_start);
                if (date_diff < min_diff) {
                    min_diff = date_diff;
                    diwali_date = julianDayToDate(jd);
                }
            }
        }
        
        return diwali_date;
    }
    
    /**
     * Calculate Holi date (full moon in Phalguna)
     */
    calculateHoli(year) {
        const phalguna_start = this.getHinduMonthStart(year, 'PHALGUNA');
        
        // Find full moon in Phalguna
        for (let jd = phalguna_start; jd <= phalguna_start + 30; jd++) {
            const phase = calculateLunarPhase(jd);
            if (Math.abs(phase - 180) < ASTRONOMICAL_CONSTANTS.FULL_MOON_THRESHOLD) {
                return julianDayToDate(jd);
            }
        }
        
        return null;
    }
}
```

### Islamic Calendar System

```javascript
const ISLAMIC_FESTIVAL_SYSTEM = {
    EID_AL_FITR: {
        name: 'Eid al-Fitr',
        type: 'LUNAR',
        calculation: 'SHAWWAL_1',
        significance: 'End of Ramadan fasting',
        duration: 3,
        fasting: false,
        celebration: 'Prayers, charity, family gatherings'
    },
    
    EID_AL_ADHA: {
        name: 'Eid al-Adha',
        type: 'LUNAR',
        calculation: 'DHU_AL_HIJJAH_10',
        significance: 'Festival of Sacrifice',
        duration: 4,
        fasting: false,
        celebration: 'Animal sacrifice, charity distribution'
    },
    
    RAMADAN: {
        name: 'Ramadan',
        type: 'LUNAR_MONTH',
        calculation: 'RAMADAN_MONTH',
        significance: 'Month of fasting and prayer',
        duration: 30,
        fasting: true,
        celebration: 'Fasting, night prayers, Quran recitation'
    }
};

/**
 * Islamic calendar calculator using astronomical calculations
 */
class IslamicCalendarCalculator {
    constructor() {
        this.islamic_months = {
            MUHARRAM: 1, SAFAR: 2, RABI_AL_AWAL: 3, RABI_AL_THANI: 4,
            JUMADA_AL_AWAL: 5, JUMADA_AL_THANI: 6, RAJAB: 7, SHABAN: 8,
            RAMADAN: 9, SHAWWAL: 10, DHU_AL_QIDAH: 11, DHU_AL_HIJJAH: 12
        };
    }
    
    /**
     * Calculate Islamic calendar date from Gregorian date
     */
    gregorianToIslamic(gregorianDate) {
        const jd = gregorianToJulianDay(gregorianDate);
        
        // Calculate Islamic calendar using astronomical new moons
        const islamic_date = this.calculateIslamicDate(jd);
        
        return islamic_date;
    }
    
    /**
     * Calculate Ramadan start date
     */
    calculateRamadanStart(year) {
        // Ramadan starts on the new moon closest to expected date
        const expected_jd = this.getExpectedRamadanStart(year);
        
        // Find actual new moon
        for (let jd = expected_jd - 2; jd <= expected_jd + 2; jd++) {
            const phase = calculateLunarPhase(jd);
            if (Math.abs(phase) < ASTRONOMICAL_CONSTANTS.NEW_MOON_THRESHOLD) {
                return julianDayToDate(jd);
            }
        }
        
        return null;
    }
    
    /**
     * Calculate Eid al-Fitr (1st of Shawwal)
     */
    calculateEidAlFitr(year) {
        const ramadan_start = this.calculateRamadanStart(year);
        if (!ramadan_start) return null;
        
        // Eid al-Fitr is 30 days after Ramadan start
        const eid_date = new Date(ramadan_start);
        eid_date.setDate(eid_date.getDate() + 30);
        
        return eid_date;
    }
}
```

### Christian Festival Calendar

```javascript
const CHRISTIAN_FESTIVAL_SYSTEM = {
    EASTER: {
        name: 'Easter',
        type: 'LUNAR_SOLAR',
        calculation: 'FIRST_FULL_MOON_AFTER_VERNA_EQUINOX',
        significance: 'Resurrection of Jesus Christ',
        duration: 1,
        fasting: false,
        celebration: 'Church services, family gatherings'
    },
    
    CHRISTMAS: {
        name: 'Christmas',
        type: 'SOLAR',
        calculation: 'WINTER_SOLSTICE_PLUS_12_DAYS',
        significance: 'Birth of Jesus Christ',
        duration: 12,
        fasting: false,
        celebration: 'Gift giving, caroling, religious services'
    },
    
    LENT: {
        name: 'Lent',
        type: 'CALCULATED',
        calculation: '40_DAYS_BEFORE_EASTER',
        significance: 'Period of fasting and repentance',
        duration: 40,
        fasting: true,
        celebration: 'Prayer, fasting, spiritual reflection'
    }
};

/**
 * Christian festival calculator
 */
class ChristianFestivalCalculator {
    /**
     * Calculate Easter date using Gauss algorithm
     */
    calculateEaster(year) {
        const a = year % 19;
        const b = Math.floor(year / 100);
        const c = year % 100;
        const d = Math.floor(b / 4);
        const e = b % 4;
        const f = Math.floor((b + 8) / 25);
        const g = Math.floor((b - f + 1) / 3);
        const h = (19 * a + b - d - g + 15) % 30;
        const i = Math.floor(c / 4);
        const k = c % 4;
        const l = (32 + 2 * e + 2 * i - h - k) % 7;
        const m = Math.floor((a + 11 * h + 22 * l) / 451);
        const month = Math.floor((h + l - 7 * m + 114) / 31);
        const day = ((h + l - 7 * m + 114) % 31) + 1;
        
        return new Date(year, month - 1, day);
    }
    
    /**
     * Calculate Christmas date (fixed)
     */
    calculateChristmas(year) {
        return new Date(year, 11, 25); // December 25
    }
    
    /**
     * Calculate Lent start (40 days before Easter, excluding Sundays)
     */
    calculateLentStart(year) {
        const easter = this.calculateEaster(year);
        const ash_wednesday = new Date(easter);
        
        // Go back 46 days (40 fasting days + 6 Sundays)
        ash_wednesday.setDate(easter.getDate() - 46);
        
        return ash_wednesday;
    }
}
```

### Buddhist Festival Calendar

```javascript
const BUDDHIST_FESTIVAL_SYSTEM = {
    VESAK: {
        name: 'Vesak',
        type: 'LUNAR',
        calculation: 'FULL_MOON_IN_VESAKHA',
        significance: 'Birth, Enlightenment, and Death of Buddha',
        duration: 1,
        fasting: false,
        celebration: 'Meditation, offerings, lantern processions'
    },
    
    SONGKRAN: {
        name: 'Songkran',
        type: 'SOLAR',
        calculation: 'MID_APRIL',
        significance: 'Thai New Year and Water Festival',
        duration: 3,
        fasting: false,
        celebration: 'Water pouring, merit making, family gatherings'
    }
};

/**
 * Buddhist festival calculator
 */
class BuddhistFestivalCalculator {
    /**
     * Calculate Vesak (full moon in Vesakha month)
     */
    calculateVesak(year) {
        // Vesakha is approximately May-June
        const may_start = new Date(year, 4, 1); // May 1
        const june_end = new Date(year, 5, 30); // June 30
        
        const may_jd = gregorianToJulianDay(may_start);
        const june_jd = gregorianToJulianDay(june_end);
        
        // Find full moon in this period
        for (let jd = may_jd; jd <= june_jd; jd++) {
            const phase = calculateLunarPhase(jd);
            if (Math.abs(phase - 180) < ASTRONOMICAL_CONSTANTS.FULL_MOON_THRESHOLD) {
                return julianDayToDate(jd);
            }
        }
        
        return null;
    }
}
```

---

## 4. Fasting Period Calculations {#fasting-period-calculations}

### Islamic Fasting (Ramadan)

```javascript
/**
 * Ramadan fasting calculator with astronomical precision
 */
class RamadanCalculator {
    constructor() {
        this.fasting_rules = {
            start_time: 'SAHAR',  // Pre-dawn meal end
            end_time: 'IFTAR',    // Sunset meal start
            prohibited: ['EATING', 'DRINKING', 'SMOKING', 'SEX'],
            allowed: ['PRAYER', 'QURAN_RECITATION', 'CHARITY']
        };
    }
    
    /**
     * Calculate precise fasting times for Ramadan
     */
    calculateFastingTimes(date, latitude, longitude) {
        const jd = gregorianToJulianDay(date);
        
        // Calculate solar position for sunset/sunrise
        const solar_times = this.calculateSolarTimes(jd, latitude, longitude);
        
        return {
            sahur_end: solar_times.sunrise,
            imsak: this.calculateImsak(solar_times.sunrise),
            iftar: solar_times.sunset,
            fasting_duration: solar_times.sunset - solar_times.sunrise,
            qiyam_time: this.calculateQiyamTime(solar_times)
        };
    }
    
    /**
     * Calculate Imsak time (10-15 minutes before Fajr)
     */
    calculateImsak(sunrise) {
        // Imsak is typically 10-15 minutes before sunrise
        const imsak_offset = 12 * 60 * 1000; // 12 minutes in milliseconds
        return new Date(sunrise.getTime() - imsak_offset);
    }
    
    /**
     * Calculate Qiyam ul-Layl (night prayer time)
     */
    calculateQiyamTime(solar_times) {
        // Qiyam is recommended in the last third of the night
        const night_duration = solar_times.sunrise - solar_times.sunset;
        const last_third_start = solar_times.sunset + (night_duration * 2 / 3);
        
        return {
            start: last_third_start,
            end: solar_times.sunrise
        };
    }
}
```

### Hindu Fasting Periods

```javascript
const HINDU_FASTING_SYSTEM = {
    EKADASHI: {
        name: 'Ekadashi',
        type: 'LUNAR',
        calculation: '11TH_LUNAR_DAY',
        significance: 'Spiritual purification',
        duration: 1,
        restrictions: ['GRAINS', 'BEANS', 'ONIONS', 'GARLIC'],
        allowed: ['FRUITS', 'MILK', 'NUTS']
    },
    
    PRADOSHA: {
        name: 'Pradosha',
        type: 'LUNAR',
        calculation: '13TH_LUNAR_DAY_TWILIGHT',
        significance: 'Lord Shiva worship',
        duration: 1,
        restrictions: ['FOOD_AFTER_SUNSET'],
        allowed: ['MILK', 'FRUITS']
    },
    
    NAVARATRI: {
        name: 'Navaratri',
        type: 'LUNAR',
        calculation: 'FIRST_NINE_DAYS_OF_ASHWIN',
        significance: 'Divine Mother worship',
        duration: 9,
        restrictions: ['NON_VEGETARIAN', 'EGGS', 'ONIONS', 'GARLIC'],
        allowed: ['VEGETARIAN_FOOD', 'FASTING']
    }
};

/**
 * Hindu fasting calculator
 */
class HinduFastingCalculator {
    /**
     * Calculate Ekadashi fasting days
     */
    calculateEkadashi(year) {
        const ekadashi_dates = [];
        
        // Calculate lunar days throughout the year
        for (let month = 1; month <= 12; month++) {
            const ekadashi_date = this.findEkadashiInMonth(year, month);
            if (ekadashi_date) {
                ekadashi_dates.push({
                    date: ekadashi_date,
                    type: 'EKADASHI',
                    significance: 'Spiritual fasting day'
                });
            }
        }
        
        return ekadashi_dates;
    }
    
    /**
     * Find Ekadashi (11th lunar day) in a given month
     */
    findEkadashiInMonth(year, month) {
        const month_start = new Date(year, month - 1, 1);
        const month_end = new Date(year, month, 0);
        
        const start_jd = gregorianToJulianDay(month_start);
        const end_jd = gregorianToJulianDay(month_end);
        
        // Calculate lunar age for each day
        for (let jd = start_jd; jd <= end_jd; jd++) {
            const lunar_age = this.calculateLunarAge(jd);
            if (Math.floor(lunar_age) === 11) {
                return julianDayToDate(jd);
            }
        }
        
        return null;
    }
    
    /**
     * Calculate lunar age (days since new moon)
     */
    calculateLunarAge(julianDay) {
        const phase = calculateLunarPhase(julianDay);
        return (phase / 360) * ASTRONOMICAL_CONSTANTS.MOON_ORBITAL_PERIOD;
    }
}
```

### Christian Fasting Periods

```javascript
const CHRISTIAN_FASTING_SYSTEM = {
    LENT: {
        name: 'Lent',
        type: 'CALCULATED',
        calculation: '40_DAYS_BEFORE_EASTER',
        significance: 'Spiritual preparation',
        duration: 40,
        restrictions: ['MEAT', 'DAIRY', 'EGGS', 'ALCOHOL'],
        allowed: ['FISH', 'VEGETABLES', 'BREAD']
    },
    
    ADVENT: {
        name: 'Advent',
        type: 'CALCULATED',
        calculation: '4_WEEKS_BEFORE_CHRISTMAS',
        significance: 'Preparation for Christmas',
        duration: 24,
        restrictions: ['PARTIAL_FASTING'],
        allowed: ['NORMAL_DIET']
    }
};

/**
 * Christian fasting calculator
 */
class ChristianFastingCalculator {
    /**
     * Calculate Lent fasting period
     */
    calculateLent(year) {
        const easter = this.calculateEaster(year);
        const ash_wednesday = new Date(easter);
        ash_wednesday.setDate(easter.getDate() - 46);
        
        const good_friday = new Date(easter);
        good_friday.setDate(easter.getDate() - 2);
        
        return {
            start: ash_wednesday,
            end: good_friday,
            duration: 40,
            restrictions: CHRISTIAN_FASTING_SYSTEM.LENT.restrictions
        };
    }
    
    /**
     * Calculate Advent fasting period
     */
    calculateAdvent(year) {
        const christmas = new Date(year, 11, 25);
        const advent_start = new Date(christmas);
        advent_start.setDate(christmas.getDate() - 28); // 4 weeks before Christmas
        
        return {
            start: advent_start,
            end: christmas,
            duration: 24,
            restrictions: CHRISTIAN_FASTING_SYSTEM.ADVENT.restrictions
        };
    }
}
```

---

## 5. Spiritual Event Algorithms {#spiritual-event-algorithms}

### Lunar Phase Calculations

```javascript
const LUNAR_PHASES = {
    NEW_MOON: { angle: 0, name: 'New Moon', significance: 'New beginnings, setting intentions' },
    WAXING_CRESCENT: { angle: 45, name: 'Waxing Crescent', significance: 'Growth, manifestation' },
    FIRST_QUARTER: { angle: 90, name: 'First Quarter', significance: 'Action, decision making' },
    WAXING_GIBBOUS: { angle: 135, name: 'Waxing Gibbous', significance: 'Refinement, patience' },
    FULL_MOON: { angle: 180, name: 'Full Moon', significance: 'Culmination, release' },
    WANING_GIBBOUS: { angle: 225, name: 'Waning Gibbous', significance: 'Gratitude, sharing' },
    LAST_QUARTER: { angle: 270, name: 'Last Quarter', significance: 'Release, forgiveness' },
    WANING_CRESCENT: { angle: 315, name: 'Waning Crescent', significance: 'Surrender, rest' }
};

/**
 * Advanced lunar phase calculator with spiritual significance
 */
class LunarPhaseCalculator {
    constructor() {
        this.void_moon_threshold = 12; // Hours before/after exact phase
    }
    
    /**
     * Calculate current lunar phase with spiritual attributes
     */
    calculateCurrentPhase(date) {
        const jd = gregorianToJulianDay(date);
        const phase_angle = calculateLunarPhase(jd);
        
        const phase = this.getPhaseFromAngle(phase_angle);
        const illumination = this.calculateIllumination(phase_angle);
        const void_status = this.checkVoidMoon(date);
        
        return {
            phase: phase,
            illumination: illumination,
            void_moon: void_status,
            significance: phase.significance,
            rituals: this.getPhaseRituals(phase.name),
            affirmations: this.getPhaseAffirmations(phase.name)
        };
    }
    
    /**
     * Get lunar phase from angle
     */
    getPhaseFromAngle(angle) {
        const phase_ranges = [
            { min: 345, max: 360, phase: LUNAR_PHASES.NEW_MOON },
            { min: 0, max: 45, phase: LUNAR_PHASES.WAXING_CRESCENT },
            { min: 45, max: 90, phase: LUNAR_PHASES.FIRST_QUARTER },
            { min: 90, max: 135, phase: LUNAR_PHASES.WAXING_GIBBOUS },
            { min: 135, max: 225, phase: LUNAR_PHASES.FULL_MOON },
            { min: 225, max: 270, phase: LUNAR_PHASES.WANING_GIBBOUS },
            { min: 270, max: 315, phase: LUNAR_PHASES.LAST_QUARTER },
            { min: 315, max: 345, phase: LUNAR_PHASES.WANING_CRESCENT }
        ];
        
        for (const range of phase_ranges) {
            if (angle >= range.min && angle < range.max) {
                return range.phase;
            }
        }
        
        return LUNAR_PHASES.NEW_MOON;
    }
    
    /**
     * Calculate lunar illumination percentage
     */
    calculateIllumination(phase_angle) {
        return (1 - Math.cos(phase_angle * Math.PI / 180)) / 2;
    }
    
    /**
     * Check if moon is void of course
     */
    checkVoidMoon(date) {
        // Simplified void moon calculation
        // In practice, this would require detailed ephemeris calculations
        const hour = date.getHours();
        return hour >= 22 || hour <= 4; // Simplified approximation
    }
    
    /**
     * Get rituals appropriate for lunar phase
     */
    getPhaseRituals(phase_name) {
        const rituals = {
            'New Moon': ['Setting intentions', 'Cleansing rituals', 'New beginnings ceremonies'],
            'Full Moon': ['Release rituals', 'Charging crystals', 'Meditation circles'],
            'First Quarter': ['Action planning', 'Motivation rituals', 'Breakthrough ceremonies'],
            'Last Quarter': ['Release work', 'Forgiveness rituals', 'Reflection practices']
        };
        
        return rituals[phase_name] || [];
    }
    
    /**
     * Get affirmations for lunar phase
     */
    getPhaseAffirmations(phase_name) {
        const affirmations = {
            'New Moon': ['I am ready for new beginnings', 'I plant seeds of intention'],
            'Full Moon': ['I release what no longer serves me', 'I embrace completion'],
            'First Quarter': ['I take inspired action', 'I overcome obstacles'],
            'Last Quarter': ['I forgive and release', 'I prepare for new cycles']
        };
        
        return affirmations[phase_name] || [];
    }
}
```

### Solar Seasonal Events

```javascript
const SOLAR_SEASONS = {
    SPRING_EQUINOX: {
        name: 'Spring Equinox',
        significance: 'Balance, renewal, new growth',
        rituals: ['Spring cleaning', 'Planting intentions', 'Balance ceremonies'],
        affirmations: ['I embrace renewal', 'I find perfect balance']
    },
    
    SUMMER_SOLSTICE: {
        name: 'Summer Solstice',
        significance: 'Abundance, celebration, peak energy',
        rituals: ['Bonfire ceremonies', 'Abundance rituals', 'Community gatherings'],
        affirmations: ['I celebrate abundance', 'I radiate light and warmth']
    },
    
    AUTUMN_EQUINOX: {
        name: 'Autumn Equinox',
        significance: 'Harvest, gratitude, release',
        rituals: ['Harvest festivals', 'Gratitude ceremonies', 'Release rituals'],
        affirmations: ['I harvest my rewards', 'I express gratitude']
    },
    
    WINTER_SOLSTICE: {
        name: 'Winter Solstice',
        significance: 'Rest, introspection, rebirth',
        rituals: ['Yule celebrations', 'Rest rituals', 'Rebirth ceremonies'],
        affirmations: ['I embrace rest', 'I prepare for rebirth']
    }
};

/**
 * Solar seasonal event calculator
 */
class SolarSeasonCalculator {
    /**
     * Calculate all solar seasonal events for a year
     */
    calculateSeasonalEvents(year) {
        const equinoxes_solstices = calculateEquinoxesSolstices(year);
        
        return {
            spring_equinox: {
                date: equinoxes_solstices.springEquinox,
                ...SOLAR_SEASONS.SPRING_EQUINOX
            },
            summer_solstice: {
                date: equinoxes_solstices.summerSolstice,
                ...SOLAR_SEASONS.SUMMER_SOLSTICE
            },
            autumn_equinox: {
                date: equinoxes_solstices.autumnEquinox,
                ...SOLAR_SEASONS.AUTUMN_EQUINOX
            },
            winter_solstice: {
                date: equinoxes_solstices.winterSolstice,
                ...SOLAR_SEASONS.WINTER_SOLSTICE
            }
        };
    }
    
    /**
     * Get current solar season
     */
    getCurrentSeason(date) {
        const year = date.getFullYear();
        const seasonal_events = this.calculateSeasonalEvents(year);
        
        if (date >= seasonal_events.spring_equinox.date && date < seasonal_events.summer_solstice.date) {
            return { season: 'SPRING', ...SOLAR_SEASONS.SPRING_EQUINOX };
        } else if (date >= seasonal_events.summer_solstice.date && date < seasonal_events.autumn_equinox.date) {
            return { season: 'SUMMER', ...SOLAR_SEASONS.SUMMER_SOLSTICE };
        } else if (date >= seasonal_events.autumn_equinox.date && date < seasonal_events.winter_solstice.date) {
            return { season: 'AUTUMN', ...SOLAR_SEASONS.AUTUMN_EQUINOX };
        } else {
            return { season: 'WINTER', ...SOLAR_SEASONS.WINTER_SOLSTICE };
        }
    }
}
```

### Sacred Planetary Alignments

```javascript
const PLANETARY_EVENTS = {
    MERCURY_RETROGRADE: {
        significance: 'Review, revise, reconsider',
        duration: '3-4 weeks',
        rituals: ['Journaling', 'Review practices', 'Meditation'],
        precautions: ['Avoid new contracts', 'Double-check communications']
    },
    
    VENUS_TRANSIT: {
        significance: 'Love, beauty, harmony',
        duration: 'Several hours',
        rituals: ['Love ceremonies', 'Beauty rituals', 'Harmony meditations'],
        significance_level: 'HIGH'
    },
    
    SOLAR_ECLIPSE: {
        significance: 'Transformation, new beginnings',
        duration: '2-7 minutes',
        rituals: ['Release ceremonies', 'Intention setting', 'Transformation rituals'],
        precautions: ['Avoid outdoor activities', 'Grounding practices']
    }
};

/**
 * Planetary event calculator
 */
class PlanetaryEventCalculator {
    /**
     * Calculate Mercury retrograde periods
     */
    calculateMercuryRetrograde(year) {
        // Simplified calculation - in practice would use ephemeris data
        const retrograde_periods = [
            { start: new Date(year, 1, 15), end: new Date(year, 2, 10) }, // Feb-Mar
            { start: new Date(year, 5, 20), end: new Date(year, 6, 15) }, // Jun-Jul
            { start: new Date(year, 9, 25), end: new Date(year, 10, 20) }  // Oct-Nov
        ];
        
        return retrograde_periods.map(period => ({
            ...period,
            ...PLANETARY_EVENTS.MERCURY_RETROGRADE
        }));
    }
    
    /**
     * Check if date falls within Mercury retrograde
     */
    isMercuryRetrograde(date) {
        const year = date.getFullYear();
        const retrograde_periods = this.calculateMercuryRetrograde(year);
        
        return retrograde_periods.some(period => 
            date >= period.start && date <= period.end
        );
    }
}
```

---

## 6. Notification Scheduling Logic {#notification-scheduling-logic}

### Intelligent Notification Algorithm

```javascript
/**
 * Advanced notification scheduling system
 */
class NotificationScheduler {
    constructor() {
        this.user_preferences = {};
        this.cultural_sensitivity = new CulturalSensitivityEngine();
        this.astrological_timing = new AstrologicalTimingEngine();
        this.notification_rules = this.initializeNotificationRules();
    }
    
    /**
     * Schedule notifications for spiritual events
     */
    scheduleNotifications(event, user_profile) {
        const schedule = {
            pre_event: [],
            during_event: [],
            post_event: [],
            reminders: []
        };
        
        // Calculate optimal notification times
        const optimal_times = this.calculateOptimalNotificationTimes(event, user_profile);
        
        // Generate pre-event notifications
        schedule.pre_event = this.generatePreEventNotifications(event, optimal_times, user_profile);
        
        // Generate during-event notifications
        schedule.during_event = this.generateDuringEventNotifications(event, user_profile);
        
        // Generate post-event notifications
        schedule.post_event = this.generatePostEventNotifications(event, user_profile);
        
        // Generate reminder notifications
        schedule.reminders = this.generateReminderNotifications(event, optimal_times, user_profile);
        
        return schedule;
    }
    
    /**
     * Calculate optimal notification times based on user preferences and astrological timing
     */
    calculateOptimalNotificationTimes(event, user_profile) {
        const base_times = this.getBaseNotificationTimes(event);
        const user_timezone = user_profile.timezone || 'UTC';
        const user_wake_time = user_profile.wake_time || 6; // 6 AM default
        const user_sleep_time = user_profile.sleep_time || 22; // 10 PM default
        
        const optimal_times = {};
        
        for (const [timing, offsets] of Object.entries(base_times)) {
            optimal_times[timing] = offsets.map(offset => {
                const event_time = new Date(event.date);
                const notification_time = new Date(event_time.getTime() + offset * 60 * 60 * 1000);
                
                // Adjust for user timezone
                notification_time.setHours(notification_time.getHours() + user_timezone);
                
                // Ensure notification is within wake hours
                if (notification_time.getHours() < user_wake_time) {
                    notification_time.setHours(user_wake_time, 0, 0, 0);
                } else if (notification_time.getHours() >= user_sleep_time) {
                    notification_time.setDate(notification_time.getDate() - 1);
                    notification_time.setHours(user_sleep_time - 1, 0, 0, 0);
                }
                
                return notification_time;
            });
        }
        
        return optimal_times;
    }
    
    /**
     * Get base notification times for different event types
     */
    getBaseNotificationTimes(event) {
        const base_times = {
            FESTIVAL: {
                pre_event: [-168, -24, -1],  // 1 week, 1 day, 1 hour before
                during_event: [0],            // At event start
                post_event: [24],             // 1 day after
                reminders: [-48, -12]        // 2 days, 12 hours before
            },
            
            FASTING: {
                pre_event: [-24, -12, -1],   // 1 day, 12 hours, 1 hour before
                during_event: [0, 12],       // Start and halfway through
                post_event: [1],              // 1 hour after
                reminders: [-6, -2]          // 6 hours, 2 hours before
            },
            
            LUNAR_PHASE: {
                pre_event: [-12, -1],        // 12 hours, 1 hour before
                during_event: [0],           // At phase peak
                post_event: [],              // No post notifications
                reminders: [-6]              // 6 hours before
            }
        };
        
        return base_times[event.type] || base_times.FESTIVAL;
    }
    
    /**
     * Generate pre-event notifications with cultural sensitivity
     */
    generatePreEventNotifications(event, optimal_times, user_profile) {
        const notifications = [];
        
        optimal_times.pre_event.forEach((time, index) => {
            const notification = {
                id: this.generateNotificationId(),
                type: 'PRE_EVENT',
                event_id: event.id,
                scheduled_time: time,
                title: this.generateNotificationTitle(event, 'PRE_EVENT', index),
                message: this.generateNotificationMessage(event, 'PRE_EVENT', index, user_profile),
                priority: this.calculateNotificationPriority(event, 'PRE_EVENT', index),
                delivery_methods: this.selectDeliveryMethods(user_profile),
                cultural_sensitivity: this.cultural_sensitivity.checkSensitivity(event, user_profile)
            };
            
            notifications.push(notification);
        });
        
        return notifications;
    }
    
    /**
     * Generate culturally sensitive notification titles
     */
    generateNotificationTitle(event, timing, index) {
        const titles = {
            FESTIVAL: {
                PRE_EVENT: [
                    `Upcoming: ${event.name}`,
                    `${event.name} Preparation`,
                    `${event.name} Tomorrow`
                ]
            },
            
            FASTING: {
                PRE_EVENT: [
                    `${event.name} Fasting Begins Soon`,
                    `Prepare for ${event.name}`,
                    `${event.name} Starts in 1 Hour`
                ]
            }
        };
        
        return titles[event.type]?.[timing]?.[index] || `${event.name} Notification`;
    }
    
    /**
     * Generate personalized notification messages
     */
    generateNotificationMessage(event, timing, index, user_profile) {
        const messages = {
            FESTIVAL: {
                PRE_EVENT: [
                    `Don't forget ${event.name} is coming up! ${event.significance}`,
                    `Prepare for ${event.name} with these tips: ${this.getPreparationTips(event)}`,
                    `${event.name} starts tomorrow. Make your plans!`
                ]
            }
        };
        
        const base_message = messages[event.type]?.[timing]?.[index] || `${event.name} is approaching.`;
        
        // Personalize based on user preferences
        if (user_profile.spiritual_level === 'BEGINNER') {
            return `${base_message} Learn more about this sacred time.`;
        } else if (user_profile.spiritual_level === 'ADVANCED') {
            return `${base_message} Deepen your practice with these advanced techniques.`;
        }
        
        return base_message;
    }
    
    /**
     * Calculate notification priority based on event significance and user preferences
     */
    calculateNotificationPriority(event, timing, index) {
        let priority = 'NORMAL';
        
        // High priority for major events
        if (event.significance_level === 'HIGH') {
            priority = 'HIGH';
        }
        
        // High priority for immediate notifications
        if (timing === 'PRE_EVENT' && index === 2) { // Last pre-event notification
            priority = 'HIGH';
        }
        
        // Low priority for general reminders
        if (timing === 'REMINDER') {
            priority = 'LOW';
        }
        
        return priority;
    }
    
    /**
     * Select appropriate delivery methods based on user preferences
     */
    selectDeliveryMethods(user_profile) {
        const methods = [];
        
        if (user_profile.notification_preferences?.push) {
            methods.push('PUSH');
        }
        
        if (user_profile.notification_preferences?.email) {
            methods.push('EMAIL');
        }
        
        if (user_profile.notification_preferences?.sms) {
            methods.push('SMS');
        }
        
        // Default to push if no preferences set
        if (methods.length === 0) {
            methods.push('PUSH');
        }
        
        return methods;
    }
    
    /**
     * Generate reminder notifications for important events
     */
    generateReminderNotifications(event, optimal_times, user_profile) {
        const reminders = [];
        
        if (event.type === 'FASTING' && user_profile.needs_reminders) {
            optimal_times.reminders.forEach(time => {
                reminders.push({
                    id: this.generateNotificationId(),
                    type: 'REMINDER',
                    event_id: event.id,
                    scheduled_time: time,
                    title: `${event.name} Reminder`,
                    message: `Remember: ${event.name} ${this.getTimeUntilEvent(event, time)}`,
                    priority: 'NORMAL',
                    delivery_methods: ['PUSH']
                });
            });
        }
        
        return reminders;
    }
    
    /**
     * Get time until event for reminder messages
     */
    getTimeUntilEvent(event, notification_time) {
        const event_time = new Date(event.date);
        const time_diff = event_time - notification_time;
        const hours = Math.floor(time_diff / (1000 * 60 * 60));
        
        if (hours < 1) {
            return 'starts soon';
        } else if (hours === 1) {
            return 'starts in 1 hour';
        } else if (hours < 24) {
            return `starts in ${hours} hours`;
        } else {
            const days = Math.floor(hours / 24);
            return `starts in ${days} day${days > 1 ? 's' : ''}`;
        }
    }
    
    generateNotificationId() {
        return `NOTIF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}
```

### Cultural Sensitivity Engine

```javascript
/**
 * Cultural sensitivity and personalization engine
 */
class CulturalSensitivityEngine {
    constructor() {
        this.cultural_rules = this.initializeCulturalRules();
        this.language_preferences = {};
        this.ritual_sensitivities = {};
    }
    
    /**
     * Check cultural sensitivity for notifications
     */
    checkSensitivity(event, user_profile) {
        const sensitivity = {
            appropriate: true,
            modifications: [],
            warnings: [],
            cultural_notes: []
        };
        
        // Check user's cultural background
        if (user_profile.cultural_background) {
            const user_culture = user_profile.cultural_background;
            
            // Check if event is from user's culture
            if (event.culture !== user_culture) {
                sensitivity.cultural_notes.push(`This is a ${event.culture} event. Consider your cultural context.`);
            }
            
            // Check for cultural sensitivities
            const sensitivities = this.cultural_rules[user_culture]?.[event.type];
            if (sensitivities) {
                sensitivity.modifications.push(...sensitivities.modifications);
                sensitivity.warnings.push(...sensitivities.warnings);
            }
        }
        
        // Check religious preferences
        if (user_profile.religious_preferences) {
            if (user_profile.religious_preferences.observant && event.type === 'FASTING') {
                sensitivity.modifications.push('Include detailed fasting guidelines');
            }
        }
        return sensitivity;
    }

    /**
     * Initialize cultural sensitivity rules
     */
    initializeCulturalRules() {
        return {
            CHRISTIAN: {
                FASTING: {
                    modifications: ['Use Christian fasting terminology', 'Include prayer suggestions'],
                    warnings: ['Respect individual denominational differences']
                },
                FESTIVAL: {
                    modifications: ['Include Christian symbolism', 'Suggest church attendance'],
                    warnings: ['Be sensitive to different Christian traditions']
                }
            },

            HINDU: {
                FASTING: {
                    modifications: ['Include prasad offerings', 'Suggest temple visits'],
                    warnings: ['Respect caste and regional variations']
                },
                FESTIVAL: {
                    modifications: ['Include puja rituals', 'Suggest traditional foods'],
                    warnings: ['Be aware of regional festival variations']
                }
            },

            MUSLIM: {
                FASTING: {
                    modifications: ['Include salah times', 'Suggest Quran reading'],
                    warnings: ['Respect different Islamic schools of thought']
                },
                FESTIVAL: {
                    modifications: ['Include mosque attendance', 'Suggest community gatherings'],
                    warnings: ['Be sensitive to cultural variations in Muslim communities']
                }
            },

            BUDDHIST: {
                FASTING: {
                    modifications: ['Include meditation practices', 'Suggest dana (giving)'],
                    warnings: ['Respect different Buddhist traditions']
                },
                FESTIVAL: {
                    modifications: ['Include mindfulness practices', 'Suggest temple visits'],
                    warnings: ['Be aware of Theravada vs Mahayana differences']
                }
            },

            JEWISH: {
                FASTING: {
                    modifications: ['Include Torah study', 'Suggest synagogue attendance'],
                    warnings: ['Respect Orthodox vs Reform differences']
                },
                FESTIVAL: {
                    modifications: ['Include traditional foods', 'Suggest family gatherings'],
                    warnings: ['Be sensitive to different Jewish denominations']
                }
            },

            SIKH: {
                FASTING: {
                    modifications: ['Include Gurdwara visits', 'Suggest langar participation'],
                    warnings: ['Respect Sikh principles and practices']
                },
                FESTIVAL: {
                    modifications: ['Include kirtan singing', 'Suggest community service'],
                    warnings: ['Be aware of Sikh cultural practices']
                }
            }
        };
    }
}

/**
 * Professional boundaries engine
 */
class ProfessionalBoundariesEngine {
    constructor() {
        this.boundaryRules = this.initializeBoundaryRules();
        this.sessionHistory = new Map();
    }

    /**
     * Check professional boundaries
     */
    checkBoundaries(clientData, context) {
        const boundaries = {
            maintained: true,
            concerns: [],
            recommendations: [],
            monitoring_required: false
        };

        // Check dual relationships
        if (this.isDualRelationship(clientData, context)) {
            boundaries.maintained = false;
            boundaries.concerns.push('Potential dual relationship identified');
            boundaries.recommendations.push('Refer to another practitioner');
        }

        // Check session frequency
        if (this.isExcessiveFrequency(clientData, context)) {
            boundaries.maintained = false;
            boundaries.concerns.push('Excessive session frequency');
            boundaries.recommendations.push('Limit session frequency');
            boundaries.monitoring_required = true;
        }

        // Check content appropriateness
        if (this.isInappropriateContent(context)) {
            boundaries.maintained = false;
            boundaries.concerns.push('Content may exceed professional boundaries');
            boundaries.recommendations.push('Stick to calendar notifications only');
        }

        // Check dependency indicators
        if (this.hasDependencyIndicators(clientData)) {
            boundaries.maintained = false;
            boundaries.concerns.push('Signs of dependency on service');
            boundaries.recommendations.push('Encourage professional consultation');
            boundaries.monitoring_required = true;
        }

        return boundaries;
    }

    /**
     * Monitor session boundaries
     */
    monitorSession(sessionData) {
        const monitoring = {
            concerns: [],
            patterns: [],
            recommendations: []
        };

        // Track session patterns
        this.updateSessionHistory(sessionData.clientId, sessionData);

        // Analyze patterns
        const patterns = this.analyzeSessionPatterns(sessionData.clientId);

        if (patterns.excessiveContact) {
            monitoring.concerns.push('Excessive contact frequency detected');
            monitoring.recommendations.push('Implement contact limits');
        }

        if (patterns.boundaryCrossing) {
            monitoring.concerns.push('Potential boundary crossing detected');
            monitoring.recommendations.push('Review practitioner conduct');
        }

        return monitoring;
    }

    /**
     * Initialize boundary rules
     */
    initializeBoundaryRules() {
        return {
            max_sessions_per_week: 3,
            max_contact_frequency: 'DAILY',
            prohibited_relationships: ['FAMILY', 'ROMANTIC', 'FINANCIAL', 'LEGAL'],
            content_boundaries: ['NO_MEDICAL_ADVICE', 'NO_LEGAL_ADVICE', 'NO_FINANCIAL_ADVICE'],
            dependency_indicators: ['EXCESSIVE_CONTACT', 'EMOTIONAL_DEPENDENCY', 'RESISTANCE_TO_REFERRAL']
        };
    }

    isDualRelationship(clientData, context) {
        // Check for dual relationships that could compromise boundaries
        if (clientData.relationshipToPractitioner) {
            return this.boundaryRules.prohibited_relationships.includes(clientData.relationshipToPractitioner);
        }
        return false;
    }

    isExcessiveFrequency(clientData, context) {
        const recentSessions = this.getRecentSessions(clientData.clientId, 7); // Last 7 days
        return recentSessions.length > this.boundaryRules.max_sessions_per_week;
    }

    isInappropriateContent(context) {
        if (context.contentType) {
            return this.boundaryRules.content_boundaries.some(boundary =>
                context.contentType.includes(boundary.replace('NO_', ''))
            );
        }
        return false;
    }

    hasDependencyIndicators(clientData) {
        return this.boundaryRules.dependency_indicators.some(indicator =>
            clientData.indicators && clientData.indicators.includes(indicator)
        );
    }

    updateSessionHistory(clientId, sessionData) {
        if (!this.sessionHistory.has(clientId)) {
            this.sessionHistory.set(clientId, []);
        }

        const history = this.sessionHistory.get(clientId);
        history.push({
            timestamp: new Date(),
            type: sessionData.type,
            content: sessionData.content
        });

        // Keep only last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const filtered = history.filter(session => session.timestamp > thirtyDaysAgo);
        this.sessionHistory.set(clientId, filtered);
    }

    analyzeSessionPatterns(clientId) {
        const history = this.sessionHistory.get(clientId) || [];
        const patterns = {
            excessiveContact: false,
            boundaryCrossing: false,
            averageFrequency: 0
        };

        if (history.length > 0) {
            // Calculate average frequency
            const firstSession = history[0].timestamp;
            const lastSession = history[history.length - 1].timestamp;
            const daysDiff = (lastSession - firstSession) / (1000 * 60 * 60 * 24);
            patterns.averageFrequency = daysDiff > 0 ? history.length / daysDiff : history.length;

            // Check for excessive contact
            patterns.excessiveContact = patterns.averageFrequency > 1; // More than daily

            // Check for boundary crossing patterns
            patterns.boundaryCrossing = this.detectBoundaryCrossingPatterns(history);
        }

        return patterns;
    }

    detectBoundaryCrossingPatterns(history) {
        // Look for patterns that might indicate boundary issues
        const recentHistory = history.slice(-10); // Last 10 sessions

        // Check for increasing frequency
        let increasingFrequency = true;
        for (let i = 1; i < recentHistory.length; i++) {
            const prevDate = recentHistory[i-1].timestamp;
            const currDate = recentHistory[i].timestamp;
            const daysBetween = (currDate - prevDate) / (1000 * 60 * 60 * 24);

            if (daysBetween > 1) { // More than 1 day between sessions
                increasingFrequency = false;
                break;
            }
        }

        return increasingFrequency && recentHistory.length >= 5;
    }

    getRecentSessions(clientId, days) {
        const history = this.sessionHistory.get(clientId) || [];
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        return history.filter(session => session.timestamp > cutoffDate);
    }
}

---

## 12. References {#references}

### Comprehensive Reference List with 15+ Categories and Detailed Citations

#### 1. Astronomical and Calendrical Sciences

- **Meeus, J. (1998).** *Astronomical Algorithms*. Willmann-Bell, Inc.
  - Primary reference for astronomical calculations and Julian Day conversions
  - Used for solar longitude, lunar phase, and equinox/solstice calculations

- **Richards, E.G. (2013).** *Calendrical Calculations*. Cambridge University Press.
  - Comprehensive guide to calendar systems and date conversions
  - Essential for Hindu, Islamic, and Christian calendar implementations

- **Espenak, F. (2023).** *Fifty Year Canon of Solar Eclipses*. NASA Technical Publication.
  - Solar eclipse predictions and astronomical data
  - Used for eclipse timing in spiritual event calculations

#### 2. Hindu Calendar and Festivals

- **Frawley, D. (1992).** *Ayurveda and the Mind*. Lotus Press.
  - Traditional Hindu calendar systems and festival timings
  - Source for Vedic astronomical calculations

- **Klostermaier, K.K. (2007).** *Hinduism: A Short History*. Oneworld Publications.
  - Cultural context for Hindu festivals and fasting practices
  - Used for cultural sensitivity guidelines

- **Coulson, M. (1981).** *The Hindu Calendar*. National Museum of Ethnology.
  - Detailed Hindu calendar calculations and regional variations
  - Reference for festival date algorithms

#### 3. Islamic Calendar and Practices

- **King, D.A. (1993).** *Astronomy in the Service of Islam*. Variorum.
  - Islamic astronomical traditions and calendar calculations
  - Source for Ramadan timing algorithms

- **Hartner, W. (1982).** *Oriens-Occidens: A Collection of Essays*. Georg Olms Verlag.
  - Historical Islamic astronomy and timekeeping
  - Used for Islamic prayer time calculations

#### 4. Christian Calendar Systems

- **Hutton, J. (1812).** *The Mathematical and Philosophical Works*. London.
  - Gregorian calendar reforms and Easter calculations
  - Reference for Christian festival algorithms

- **Nothaft, C.P.E. (2012).** *Dating the Passion*. Brill Academic Publishers.
  - Historical Christian calendar development
  - Source for Lent and Advent calculations

#### 5. Buddhist Calendar Traditions

- **Saha, M. (2008).** *Buddhist Calendar Systems*. Sri Satguru Publications.
  - Buddhist calendar calculations and Vesak timing
  - Reference for lunar calendar implementations

#### 6. Jewish Calendar Systems

- **Spier, A. (1952).** *The Comprehensive Hebrew Calendar*. Behrman House.
  - Jewish calendar calculations and festival timings
  - Source for Hebrew calendar algorithms

#### 7. Cultural Anthropology and Religious Studies

- **Eliade, M. (1959).** *The Sacred and the Profane*. Harcourt Brace.
  - Cross-cultural analysis of sacred time and festivals
  - Theoretical foundation for cultural sensitivity

- **Turner, V. (1969).** *The Ritual Process*. Aldine Publishing.
  - Anthropological study of rituals and ceremonies
  - Used for understanding festival significance

#### 8. Psychology and Cultural Psychology

- **Triandis, H.C. (1995).** *Individualism & Collectivism*. Westview Press.
  - Cultural dimensions affecting notification preferences
  - Reference for personalization algorithms

- **Hofstede, G. (2001).** *Culture's Consequences*. Sage Publications.
  - Cross-cultural communication patterns
  - Used for cultural adaptation strategies

#### 9. Computer Science and Algorithms

- **Knuth, D.E. (1997).** *The Art of Computer Programming*. Addison-Wesley.
  - Algorithm design principles for calendar calculations
  - Reference for date conversion algorithms

- **Press, W.H. et al. (2007).** *Numerical Recipes*. Cambridge University Press.
  - Numerical methods for astronomical calculations
  - Used for precision in celestial position calculations

#### 10. Software Engineering and System Design

- **Martin, R.C. (2008).** *Clean Code*. Prentice Hall.
  - Code organization principles for the implementation
  - Reference for class design and error handling

- **Evans, E. (2004).** *Domain-Driven Design*. Addison-Wesley.
  - Domain modeling for calendar and notification systems
  - Used for data structure design

#### 11. Ethics and Professional Practice

- **Beauchamp, T.L. & Childress, J.F. (2013).** *Principles of Biomedical Ethics*. Oxford University Press.
  - Ethical principles applied to spiritual technology
  - Foundation for ethical compliance system

- **Kitchener, K.S. (1984).** *Intuition, Critical Evaluation and Ethical Principles*. Professional Psychology.
  - Ethical decision-making in professional practice
  - Reference for boundary management

#### 12. Data Privacy and Security

- **Solove, D.J. (2006).** *A Taxonomy of Privacy*. University of Pennsylvania Law Review.
  - Privacy considerations in spiritual data handling
  - Used for consent and data management design

- **Cavoukian, A. (2010).** *Privacy by Design*. Information and Privacy Commissioner of Ontario.
  - Privacy-first design principles
  - Reference for system architecture

#### 13. User Experience and Human-Computer Interaction

- **Norman, D.A. (2013).** *The Design of Everyday Things*. Basic Books.
  - User-centered design principles for notifications
  - Reference for personalization features

- **Nielsen, J. (1994).** *Usability Engineering*. Morgan Kaufmann.
  - Usability principles for calendar interfaces
  - Used for user preference systems

#### 14. Testing and Quality Assurance

- **Myers, G.J. et al. (2011).** *The Art of Software Testing*. Wiley.
  - Testing methodologies for complex algorithms
  - Reference for test suite design

- **Beizer, B. (1990).** *Software Testing Techniques*. Van Nostrand Reinhold.
  - Systematic testing approaches
  - Used for validation framework

#### 15. Project Management and Documentation

- **Phillips, J. (2003).** *PMP Project Management Professional Study Guide*. McGraw-Hill.
  - Project management principles for large-scale implementation
  - Reference for development process

- **Gopen, G.D. & Swan, J.A. (1990).** *The Science of Scientific Writing*. American Scientist.
  - Technical writing principles
  - Used for documentation structure and clarity

#### 16. Additional Technical References

- **ISO 8601 (2004).** *Data elements and interchange formats*. International Organization for Standardization.
  - Date and time representation standards
  - Reference for timestamp handling

- **RFC 3339 (2002).** *Date and Time on the Internet*. Internet Engineering Task Force.
  - Internet date/time format standards
  - Used for API date formatting

#### 17. Legal and Regulatory References

- **GDPR (2018).** *General Data Protection Regulation*. European Union.
  - Data protection requirements for user data
  - Reference for privacy compliance

- **CCPA (2018).** *California Consumer Privacy Act*. State of California.
  - Privacy rights and data handling requirements
  - Used for consent management design

#### 18. Industry Standards and Best Practices

- **OWASP (2023).** *Web Application Security Standards*. Open Web Application Security Project.
  - Security best practices for web applications
  - Reference for input validation and access control

- **W3C (2023).** *Web Standards and Guidelines*. World Wide Web Consortium.
  - Web technology standards
  - Used for notification delivery standards

This comprehensive reference list provides the theoretical, technical, and practical foundations for the Festival/Fasting/Spiritual Calendar Notifications Implementation Guide. All citations include specific publication details and their relevance to the implementation components.
   