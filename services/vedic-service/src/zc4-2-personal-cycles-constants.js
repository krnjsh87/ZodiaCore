/**
 * ZC4.2 Personal Year/Month/Day Cycles Constants
 * @version 1.0.0
 * @author ZodiaCore Development Team
 *
 * Centralized constants for the ZC4.2 Personal Cycles Calculator
 * Contains all cycle-related constants, interpretations, and configuration
 */

// Cycle ranges and periods
const CYCLE_CONSTANTS = {
    // Cycle ranges and periods
    SINGLE_DIGIT_MAX: 9,
    MASTER_NUMBERS: [11, 22, 33],
    CYCLE_TYPES: ['year', 'month', 'day'],

    // Year cycle properties
    YEAR_CYCLE_LENGTH: 9,
    YEAR_CYCLE_START: 1,

    // Month cycle properties
    MONTHS_PER_YEAR: 12,
    MONTH_CYCLE_MAX: 9,

    // Day cycle properties
    DAYS_PER_MONTH_MAX: 31,
    DAY_CYCLE_MAX: 9,

    // Cycle interpretations (1-9)
    CYCLE_INTERPRETATIONS: {
        1: { name: 'Initiation', qualities: ['Leadership', 'Independence', 'New Beginnings'] },
        2: { name: 'Cooperation', qualities: ['Balance', 'Harmony', 'Partnership'] },
        3: { name: 'Expression', qualities: ['Creativity', 'Communication', 'Social'] },
        4: { name: 'Stability', qualities: ['Foundation', 'Organization', 'Practicality'] },
        5: { name: 'Freedom', qualities: ['Change', 'Adventure', 'Versatility'] },
        6: { name: 'Responsibility', qualities: ['Service', 'Family', 'Community'] },
        7: { name: 'Analysis', qualities: ['Spirituality', 'Introspection', 'Wisdom'] },
        8: { name: 'Authority', qualities: ['Achievement', 'Material Success', 'Power'] },
        9: { name: 'Completion', qualities: ['Humanitarianism', 'Global Awareness', 'Endings'] }
    }
};

// Error messages for validation
const ERROR_MESSAGES = {
    INVALID_BIRTH_DATE: 'Invalid birth date provided. Expected format: YYYY-MM-DD or Date object',
    INVALID_TARGET_DATE: 'Invalid target date provided. Expected format: YYYY-MM-DD or Date object',
    INVALID_MONTH: 'Invalid month provided. Must be between 1 and 12',
    INVALID_DAY: 'Invalid day provided. Must be between 1 and 31',
    INVALID_NUMBER: 'Invalid number provided for calculation',
    FUTURE_BIRTH_DATE: 'Birth date cannot be in the future',
    INVALID_SYSTEM: 'Invalid numerological system specified'
};

// Month names for display
const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

// Day names for display
const DAY_NAMES = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

// Supported numerological systems
const NUMEROLOGICAL_SYSTEMS = {
    PYTHAGOREAN: 'pythagorean'
    // CHALDEAN: 'chaldean' // Future implementation
};

// Default calculation options
const DEFAULT_OPTIONS = {
    includeForecast: false,
    forecastMonths: 12,
    skipCache: false,
    system: NUMEROLOGICAL_SYSTEMS.PYTHAGOREAN
};

// Cache configuration
const CACHE_CONFIG = {
    MAX_SIZE: 1000,
    TTL: 3600000 // 1 hour in milliseconds
};

// Performance benchmarks
const PERFORMANCE_BENCHMARKS = {
    SINGLE_CALCULATION_MAX_MS: 1,
    COMPLETE_ANALYSIS_MAX_MS: 10,
    MONTHLY_ANALYSIS_MAX_MS: 50,
    FORECAST_MAX_MS_PER_MONTH: 100
};

module.exports = {
    CYCLE_CONSTANTS,
    ERROR_MESSAGES,
    MONTH_NAMES,
    DAY_NAMES,
    NUMEROLOGICAL_SYSTEMS,
    DEFAULT_OPTIONS,
    CACHE_CONFIG,
    PERFORMANCE_BENCHMARKS
};