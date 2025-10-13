/**
 * Feng Shui Input Validator
 * ZC2.5 Feng Shui Remedies and Guidance Implementation
 *
 * This class validates all input data for Feng Shui calculations,
 * ensuring data integrity and preventing invalid calculations.
 */

const { BAGUA_AREAS } = require('./feng-shui-constants');

class FengShuiValidator {
    /**
     * Validate property data
     * @param {object} propertyData - Property information
     * @throws {ValidationError} If validation fails
     */
    validatePropertyData(propertyData) {
        if (!propertyData) {
            throw new ValidationError('Property data is required');
        }

        if (!propertyData.layout) {
            throw new ValidationError('Property layout is required');
        }

        if (typeof propertyData.facingDirection !== 'number') {
            throw new ValidationError('Facing direction must be a number in degrees');
        }

        if (propertyData.facingDirection < 0 || propertyData.facingDirection >= 360) {
            throw new ValidationError('Facing direction must be between 0 and 360 degrees');
        }

        if (!propertyData.location || !propertyData.location.latitude || !propertyData.location.longitude) {
            throw new ValidationError('Property location with latitude and longitude is required');
        }

        if (propertyData.location.latitude < -90 || propertyData.location.latitude > 90) {
            throw new ValidationError('Latitude must be between -90 and 90 degrees');
        }

        if (propertyData.location.longitude < -180 || propertyData.location.longitude > 180) {
            throw new ValidationError('Longitude must be between -180 and 180 degrees');
        }

        // Validate layout dimensions
        if (propertyData.layout.width && propertyData.layout.width <= 0) {
            throw new ValidationError('Property width must be positive');
        }

        if (propertyData.layout.length && propertyData.layout.length <= 0) {
            throw new ValidationError('Property length must be positive');
        }

        if (propertyData.layout.floors && propertyData.layout.floors <= 0) {
            throw new ValidationError('Number of floors must be positive');
        }
    }

    /**
     * Validate personal data
     * @param {object} personalData - Personal information
     * @throws {ValidationError} If validation fails
     */
    validatePersonalData(personalData) {
        // Personal data is optional but should be validated if provided
        if (!personalData) return;

        if (personalData.birthData) {
            if (!personalData.birthData.year || !personalData.birthData.month || !personalData.birthData.day) {
                throw new ValidationError('Complete birth data (year, month, day) is required');
            }

            const year = personalData.birthData.year;
            const month = personalData.birthData.month;
            const day = personalData.birthData.day;

            if (year < 1900 || year > new Date().getFullYear()) {
                throw new ValidationError('Birth year must be between 1900 and current year');
            }

            if (month < 1 || month > 12) {
                throw new ValidationError('Birth month must be between 1 and 12');
            }

            if (day < 1 || day > 31) {
                throw new ValidationError('Birth day must be between 1 and 31');
            }

            // Validate date exists
            const birthDate = new Date(year, month - 1, day);
            if (birthDate.getFullYear() !== year || birthDate.getMonth() !== month - 1 || birthDate.getDate() !== day) {
                throw new ValidationError('Invalid birth date');
            }

            if (personalData.birthData.hour !== undefined) {
                if (personalData.birthData.hour < 0 || personalData.birthData.hour > 23) {
                    throw new ValidationError('Birth hour must be between 0 and 23');
                }
            }
        }

        if (personalData.preferences) {
            if (personalData.preferences.budget !== undefined && personalData.preferences.budget < 0) {
                throw new ValidationError('Budget must be non-negative');
            }
        }
    }

    /**
     * Validate Bagua area
     * @param {string} area - Area name
     * @throws {ValidationError} If validation fails
     */
    validateArea(area) {
        const validAreas = BAGUA_AREAS.map(a => a.name);
        if (!validAreas.includes(area)) {
            throw new ValidationError(`Invalid area: ${area}. Valid areas: ${validAreas.join(', ')}`);
        }
    }

    /**
     * Validate timeframe data
     * @param {object} timeframe - Timeframe information
     * @throws {ValidationError} If validation fails
     */
    validateTimeframe(timeframe) {
        if (!timeframe) return;

        if (timeframe.year) {
            const currentYear = new Date().getFullYear();
            if (timeframe.year < 1900 || timeframe.year > currentYear + 10) {
                throw new ValidationError(`Year must be between 1900 and ${currentYear + 10}`);
            }
        }

        if (timeframe.month && (timeframe.month < 1 || timeframe.month > 12)) {
            throw new ValidationError('Month must be between 1 and 12');
        }

        if (timeframe.day && (timeframe.day < 1 || timeframe.day > 31)) {
            throw new ValidationError('Day must be between 1 and 31');
        }

        if (timeframe.analysisType && !['annual', 'monthly', 'daily'].includes(timeframe.analysisType)) {
            throw new ValidationError('Analysis type must be annual, monthly, or daily');
        }
    }

    /**
     * Validate remedy data
     * @param {object} remedy - Remedy information
     * @throws {ValidationError} If validation fails
     */
    validateRemedy(remedy) {
        if (!remedy) {
            throw new ValidationError('Remedy data is required');
        }

        if (!remedy.type) {
            throw new ValidationError('Remedy type is required');
        }

        const validTypes = ['Bagua', 'Elemental', 'Flying Stars', 'Directional', 'Personal'];
        if (!validTypes.includes(remedy.type)) {
            throw new ValidationError(`Invalid remedy type: ${remedy.type}. Valid types: ${validTypes.join(', ')}`);
        }

        if (remedy.effectiveness !== undefined) {
            if (typeof remedy.effectiveness !== 'number' || remedy.effectiveness < 0 || remedy.effectiveness > 1) {
                throw new ValidationError('Effectiveness must be a number between 0 and 1');
            }
        }

        if (remedy.priority && !['Critical', 'High', 'Medium', 'Low'].includes(remedy.priority)) {
            throw new ValidationError('Priority must be Critical, High, Medium, or Low');
        }
    }

    /**
     * Validate analysis results
     * @param {object} analysis - Analysis results
     * @throws {ValidationError} If validation fails
     */
    validateAnalysis(analysis) {
        if (!analysis) {
            throw new ValidationError('Analysis results are required');
        }

        if (!analysis.bagua || !analysis.elemental || !analysis.flyingStars) {
            throw new ValidationError('Complete analysis results are required');
        }

        // Validate Bagua analysis
        if (!analysis.bagua.areas || typeof analysis.bagua.areas !== 'object') {
            throw new ValidationError('Bagua areas analysis is required');
        }

        // Validate elemental analysis
        if (typeof analysis.elemental.harmonyScore !== 'number') {
            throw new ValidationError('Elemental harmony score must be a number');
        }

        // Validate Flying Stars analysis
        if (typeof analysis.flyingStars.overallRating !== 'number') {
            throw new ValidationError('Flying Stars rating must be a number');
        }
    }
}

module.exports = FengShuiValidator;