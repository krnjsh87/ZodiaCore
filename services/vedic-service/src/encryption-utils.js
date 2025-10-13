/**
 * ZodiaCore - Encryption Utilities
 *
 * Secure encryption/decryption utilities for sensitive astrology data.
 * Implements AES-256-GCM encryption with proper key management.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const crypto = require('crypto');

/**
 * Encryption utility class for sensitive data
 */
class EncryptionUtils {
    constructor() {
        // Get encryption key from environment variables
        this.key = this.getEncryptionKey();
        this.algorithm = 'aes-256-gcm';
        this.keyLength = 32; // 256 bits
        this.ivLength = 16; // 128 bits for GCM
        this.tagLength = 16; // 128 bits authentication tag
    }

    /**
     * Get encryption key from environment or generate if not exists
     * @returns {Buffer} Encryption key
     */
    getEncryptionKey() {
        const envKey = process.env.ZC_ENCRYPTION_KEY;
        if (envKey) {
            // Use provided key, ensure it's 32 bytes
            return Buffer.from(envKey.padEnd(32, '0').slice(0, 32));
        }

        // Generate a key for development (NOT for production)
        if (process.env.NODE_ENV !== 'production') {
            console.warn('WARNING: Using generated encryption key. Set ZC_ENCRYPTION_KEY environment variable for production.');
            return crypto.randomBytes(this.keyLength);
        }

        throw new Error('ZC_ENCRYPTION_KEY environment variable must be set in production');
    }

    /**
     * Encrypt sensitive data
     * @param {string|object} data - Data to encrypt
     * @returns {string} Encrypted data as base64 string
     */
    encrypt(data) {
        try {
            // Convert object to JSON string if needed
            const dataString = typeof data === 'object' ? JSON.stringify(data) : String(data);

            // Generate random IV
            const iv = crypto.randomBytes(this.ivLength);

            // Create cipher
            const cipher = crypto.createCipher(this.algorithm, this.key);
            cipher.setAAD(Buffer.from('astrology-data')); // Additional authenticated data

            // Encrypt data
            let encrypted = cipher.update(dataString, 'utf8', 'hex');
            encrypted += cipher.final('hex');

            // Get authentication tag
            const tag = cipher.getAuthTag();

            // Combine IV, encrypted data, and tag
            const result = Buffer.concat([iv, Buffer.from(encrypted, 'hex'), tag]);

            return result.toString('base64');
        } catch (error) {
            console.error('Encryption failed:', error);
            throw new Error('Failed to encrypt data');
        }
    }

    /**
     * Decrypt sensitive data
     * @param {string} encryptedData - Encrypted data as base64 string
     * @returns {string|object} Decrypted data
     */
    decrypt(encryptedData) {
        try {
            // Decode from base64
            const encryptedBuffer = Buffer.from(encryptedData, 'base64');

            // Extract IV, encrypted data, and tag
            const iv = encryptedBuffer.slice(0, this.ivLength);
            const tag = encryptedBuffer.slice(-this.tagLength);
            const encrypted = encryptedBuffer.slice(this.ivLength, -this.tagLength);

            // Create decipher
            const decipher = crypto.createDecipher(this.algorithm, this.key);
            decipher.setAAD(Buffer.from('astrology-data'));
            decipher.setAuthTag(tag);

            // Decrypt data
            let decrypted = decipher.update(encrypted);
            decrypted = Buffer.concat([decrypted, decipher.final()]);

            const result = decrypted.toString('utf8');

            // Try to parse as JSON, return string if not JSON
            try {
                return JSON.parse(result);
            } catch {
                return result;
            }
        } catch (error) {
            console.error('Decryption failed:', error);
            throw new Error('Failed to decrypt data');
        }
    }

    /**
     * Encrypt birth details (sensitive personal information)
     * @param {Object} birthDetails - Birth details object
     * @returns {string} Encrypted birth details
     */
    encryptBirthDetails(birthDetails) {
        if (!birthDetails) return null;

        // Only encrypt sensitive fields
        const sensitiveData = {
            parents: birthDetails.parents,
            familyBackground: birthDetails.familyBackground,
            medicalHistory: birthDetails.medicalHistory,
            personalNotes: birthDetails.personalNotes
        };

        return this.encrypt(sensitiveData);
    }

    /**
     * Decrypt birth details
     * @param {string} encryptedDetails - Encrypted birth details
     * @returns {Object} Decrypted birth details
     */
    decryptBirthDetails(encryptedDetails) {
        if (!encryptedDetails) return null;
        return this.decrypt(encryptedDetails);
    }

    /**
     * Encrypt thumb impression data
     * @param {Object} thumbImpression - Thumb impression data
     * @returns {string} Encrypted thumb data
     */
    encryptThumbImpression(thumbImpression) {
        if (!thumbImpression) return null;
        return this.encrypt(thumbImpression);
    }

    /**
     * Decrypt thumb impression data
     * @param {string} encryptedThumb - Encrypted thumb data
     * @returns {Object} Decrypted thumb impression
     */
    decryptThumbImpression(encryptedThumb) {
        if (!encryptedThumb) return null;
        return this.decrypt(encryptedThumb);
    }

    /**
     * Generate a hash for data integrity verification
     * @param {any} data - Data to hash
     * @returns {string} SHA-256 hash
     */
    generateHash(data) {
        const dataString = typeof data === 'object' ? JSON.stringify(data) : String(data);
        return crypto.createHash('sha256').update(dataString).digest('hex');
    }

    /**
     * Verify data integrity using hash
     * @param {any} data - Data to verify
     * @param {string} expectedHash - Expected hash
     * @returns {boolean} True if hash matches
     */
    verifyHash(data, expectedHash) {
        const actualHash = this.generateHash(data);
        return crypto.timingSafeEqual(
            Buffer.from(actualHash, 'hex'),
            Buffer.from(expectedHash, 'hex')
        );
    }

    /**
     * Securely wipe sensitive data from memory
     * @param {Object} data - Data object to wipe
     */
    secureWipe(data) {
        if (typeof data === 'object' && data !== null) {
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    if (typeof data[key] === 'string') {
                        // Overwrite string with random data
                        data[key] = crypto.randomBytes(data[key].length).toString('hex').slice(0, data[key].length);
                    } else if (typeof data[key] === 'object') {
                        this.secureWipe(data[key]);
                    }
                    delete data[key];
                }
            }
        }
    }
}

/**
 * Secure data wrapper for encrypted storage
 */
class SecureDataWrapper {
    constructor(encryptionUtils) {
        this.encryption = encryptionUtils;
    }

    /**
     * Wrap data with encryption and integrity check
     * @param {any} data - Data to wrap
     * @returns {Object} Wrapped data with encryption and hash
     */
    wrap(data) {
        const encrypted = this.encryption.encrypt(data);
        const hash = this.encryption.generateHash(data);

        return {
            encrypted,
            hash,
            timestamp: new Date().toISOString(),
            version: '1.0'
        };
    }

    /**
     * Unwrap and verify data integrity
     * @param {Object} wrappedData - Wrapped data object
     * @returns {any} Decrypted data if integrity check passes
     */
    unwrap(wrappedData) {
        try {
            const decrypted = this.encryption.decrypt(wrappedData.encrypted);

            // Verify integrity
            if (!this.encryption.verifyHash(decrypted, wrappedData.hash)) {
                throw new Error('Data integrity check failed');
            }

            return decrypted;
        } catch (error) {
            console.error('Failed to unwrap secure data:', error);
            throw new Error('Secure data unwrap failed');
        }
    }
}

// Export singleton instances
const encryptionUtils = new EncryptionUtils();
const secureDataWrapper = new SecureDataWrapper(encryptionUtils);

module.exports = {
    EncryptionUtils,
    SecureDataWrapper,
    encryptionUtils,
    secureDataWrapper
};