/**
 * ZC1.28 Charity Timing Constants
 * Centralized timing data for Panchang-based charity recommendations
 */

const AUSPICIOUS_TITHIS = {
    SUN: [1, 2, 3, 7, 8, 12, 13], // Pratipad, Dwitiya, Tritiya, etc.
    MOON: [2, 7, 12], // Shukla Paksha preferred
    MARS: [1, 8, 14, 15], // Amavasya, Ashtami
    MERCURY: [3, 8, 13], // Tritiya, Ashtami, Trayodashi
    JUPITER: [5, 10, 15], // Panchami, Dashami, Purnima
    VENUS: [6, 11, 13], // Shashthi, Ekadashi, Trayodashi
    SATURN: [3, 8, 14], // Tritiya, Ashtami, Chaturdashi
    RAHU: [4, 9, 14], // Chaturthi, Navami, Chaturdashi
    KETU: [4, 9, 14] // Similar to Rahu
};

const AUSPICIOUS_YOGAS = [
    'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma', 'Indra',
    'Vaidhriti', 'Vishkambha', 'Prithi', 'Ayushman'
];

const INAUSPICIOUS_YOGAS = [
    'Vyatipata', 'Parigha', 'Vaidhriti', 'Shakuni', 'Chatushpada'
];

const AUSPICIOUS_KARANAS = [
    'Bava', 'Balava', 'Kaulava', 'Taitila', 'Garaja', 'Vanija', 'Vishthi'
];

const NEUTRAL_NAKSHATRAS = ['Rohini', 'Hasta', 'Chitra', 'Uttara Phalguni'];

const STRONG_NAKSHATRAS = ['Rohini', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Uttara Ashadha', 'Uttara Bhadrapada'];

const TIMING_SCORES = {
    TITHI_AUSPICIOUS: 20,
    TITHI_NEUTRAL: 5,
    NAKSHATRA_AUSPICIOUS: 15,
    NAKSHATRA_NEUTRAL: 8,
    NAKSHATRA_INAUSPICIOUS: 3,
    YOGA_AUSPICIOUS: 12,
    YOGA_NEUTRAL: 6,
    YOGA_INAUSPICIOUS: 2,
    KARANA_AUSPICIOUS: 10,
    KARANA_NEUTRAL: 4,
    VARA_AUSPICIOUS: 18,
    VARA_NEUTRAL: 5
};

const TIMING_RATINGS = {
    EXCELLENT: { min: 70, label: 'Excellent' },
    VERY_GOOD: { min: 55, label: 'Very Good' },
    GOOD: { min: 40, label: 'Good' },
    FAIR: { min: 25, label: 'Fair' },
    POOR: { min: 0, label: 'Poor' }
};

const TIMING_RECOMMENDATIONS = {
    EXCELLENT: 'Highly auspicious - proceed immediately',
    VERY_GOOD: 'Very favorable - excellent timing',
    GOOD: 'Good timing - proceed with confidence',
    FAIR: 'Acceptable timing - proceed if convenient',
    POOR: 'Poor timing - consider waiting for better period'
};

// Week distribution for recommendations
const WEEK_DISTRIBUTION = {
    high: [0, 1],
    medium: [1, 2],
    low: [2, 3]
};

// Quantity descriptions
const QUANTITY_DESCRIPTIONS = {
    high: 'Larger quantity (e.g., 1kg rice, significant donation)',
    medium: 'Moderate quantity (e.g., 500g rice, meaningful donation)',
    low: 'Small quantity (e.g., 100g rice, symbolic donation)'
};

// Frequency descriptions
const FREQUENCY_DESCRIPTIONS = {
    immediate: 'As soon as possible',
    soon: 'Within 1-2 weeks',
    when_convenient: 'Monthly or as opportunity arises'
};

// Export the constants
module.exports = {
    AUSPICIOUS_TITHIS,
    AUSPICIOUS_YOGAS,
    INAUSPICIOUS_YOGAS,
    AUSPICIOUS_KARANAS,
    NEUTRAL_NAKSHATRAS,
    STRONG_NAKSHATRAS,
    TIMING_SCORES,
    TIMING_RATINGS,
    TIMING_RECOMMENDATIONS,
    WEEK_DISTRIBUTION,
    QUANTITY_DESCRIPTIONS,
    FREQUENCY_DESCRIPTIONS
};