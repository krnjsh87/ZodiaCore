/**
 * Transit Analysis Constants and Configuration
 * ZC1.26 Transit Analysis and Alerts Implementation
 */

// Transit Constants
const TRANSIT_CONSTANTS = {
    // Time and Precision Constants
    MAX_ITERATIONS: 100,                    // Maximum iterations for convergence
    CONVERGENCE_THRESHOLD: 0.001,           // Degrees for transit calculation accuracy
    TIME_STEP_MINUTES: 1,                   // Minute increments for search
    SECONDS_PER_MINUTE: 60.0,               // Time conversion
    MINUTES_PER_HOUR: 60.0,                 // Time conversion
    HOURS_PER_DAY: 24.0,                    // Time conversion

    // Aspect Constants
    MAJOR_ASPECTS: [0, 60, 90, 120, 180],  // Major aspect angles
    MINOR_ASPECTS: [30, 45, 135, 150],     // Minor aspect angles
    DEFAULT_ORB: 5.0,                       // Default orb for aspects
    EXACT_ORB: 1.0,                         // Orb for exact aspects

    // Transit Periods (approximate days)
    SATURN_TRANSIT_PERIOD: 900,             // ~2.5 years per sign
    JUPITER_TRANSIT_PERIOD: 360,            // ~1 year per sign
    MARS_TRANSIT_PERIOD: 45,                // ~45 days per sign
    VENUS_TRANSIT_PERIOD: 30,               // ~30 days per sign
    MERCURY_TRANSIT_PERIOD: 30,             // ~30 days per sign

    // Alert Thresholds
    CRITICAL_TRANSIT_DAYS: 30,              // Days before critical transit
    MAJOR_TRANSIT_DAYS: 7,                  // Days before major transit
    MINOR_TRANSIT_DAYS: 1,                  // Days before minor transit
};

// Environment-based configuration
const CONFIG = {
    // Load from environment variables with defaults
    AYANAMSA_VALUE: parseFloat(process.env.AYANAMSA_VALUE || '23.5'),
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    CACHE_TTL_MINUTES: parseInt(process.env.CACHE_TTL_MINUTES || '60'),
    ALERT_EMAIL_ENABLED: process.env.ALERT_EMAIL_ENABLED === 'true',
    ALERT_SMS_ENABLED: process.env.ALERT_SMS_ENABLED === 'false',
    DATABASE_URL: process.env.DATABASE_URL || 'sqlite:transits.db',
    EPHEMERIS_DATA_PATH: process.env.EPHEMERIS_DATA_PATH || './ephemeris'
};

// Alert Configuration Constants
const ALERT_CONFIG = {
    // Alert Types
    TRANSIT_ENTRY: 'transit_entry',
    TRANSIT_EXIT: 'transit_exit',
    ASPECT_FORMATION: 'aspect_formation',
    ASPECT_SEPARATION: 'aspect_separation',
    CRITICAL_PERIOD: 'critical_period',

    // Priority Levels
    CRITICAL: 'critical',
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low',

    // Notification Channels
    EMAIL: 'email',
    SMS: 'sms',
    PUSH: 'push',
    IN_APP: 'in_app',

    // Timing Thresholds (days)
    IMMEDIATE: 0,
    SOON: 1,
    UPCOMING: 7,
    ADVANCE: 30
};

module.exports = {
    TRANSIT_CONSTANTS,
    CONFIG,
    ALERT_CONFIG
};