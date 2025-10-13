/**
 * ZC1.27 Yantra Data Encryption Utility
 * Provides encryption/decryption for sensitive Yantra data
 */

const crypto = require('crypto');

class YantraEncryption {
    constructor() {
        // In production, get from environment variables
        this.algorithm = 'aes-256-gcm';
        this.keyLength = 32; // 256 bits
        this.ivLength = 16; // 128 bits for GCM
        this.saltRounds = 10000;

        // Default key - in production, use environment variable
        this.secretKey = process.env.YANTRA_ENCRYPTION_KEY || 'default-key-change-in-production-32chars';
        this.ensureKeyLength();
    }

    /**
     * Ensure the encryption key is the correct length
     */
    ensureKeyLength() {
        if (this.secretKey.length !== this.keyLength) {
            // Hash the key to ensure correct length
            this.secretKey = crypto.scryptSync(this.secretKey, 'yantra-salt', this.keyLength);
        }
    }

    /**
     * Encrypt data
     * @param {string|Object} data - Data to encrypt
     * @returns {string} Encrypted data as base64 string
     */
    encrypt(data) {
        try {
            const text = typeof data === 'string' ? data : JSON.stringify(data);
            const iv = crypto.randomBytes(this.ivLength);
            const cipher = crypto.createCipher(this.algorithm, this.secretKey);

            let encrypted = cipher.update(text, 'utf8', 'hex');
            encrypted += cipher.final('hex');

            const authTag = cipher.getAuthTag();

            // Combine IV, auth tag, and encrypted data
            const result = Buffer.concat([iv, authTag, Buffer.from(encrypted, 'hex')]);

            return result.toString('base64');
        } catch (error) {
            throw new Error(`Encryption failed: ${error.message}`);
        }
    }

    /**
     * Decrypt data
     * @param {string} encryptedData - Base64 encrypted data
     * @returns {string|Object} Decrypted data
     */
    decrypt(encryptedData) {
        try {
            const buffer = Buffer.from(encryptedData, 'base64');

            // Extract IV, auth tag, and encrypted data
            const iv = buffer.subarray(0, this.ivLength);
            const authTag = buffer.subarray(this.ivLength, this.ivLength + 16);
            const encrypted = buffer.subarray(this.ivLength + 16);

            const decipher = crypto.createDecipher(this.algorithm, this.secretKey);
            decipher.setAuthTag(authTag);

            let decrypted = decipher.update(encrypted);
            decrypted = Buffer.concat([decrypted, decipher.final()]);

            const text = decrypted.toString('utf8');

            // Try to parse as JSON, return string if not JSON
            try {
                return JSON.parse(text);
            } catch {
                return text;
            }
        } catch (error) {
            throw new Error(`Decryption failed: ${error.message}`);
        }
    }

    /**
     * Hash sensitive identifiers for logging
     * @param {string} identifier - Identifier to hash
     * @returns {string} Hashed identifier
     */
    hashIdentifier(identifier) {
        return crypto.createHash('sha256').update(identifier).digest('hex').substring(0, 16);
    }

    /**
     * Generate a secure random token
     * @param {number} length - Token length
     * @returns {string} Random token
     */
    generateSecureToken(length = 32) {
        return crypto.randomBytes(length).toString('hex');
    }

    /**
     * Verify data integrity
     * @param {string} data - Original data
     * @param {string} hash - Expected hash
     * @returns {boolean} Integrity check result
     */
    verifyIntegrity(data, hash) {
        const calculatedHash = crypto.createHash('sha256').update(data).digest('hex');
        return crypto.timingSafeEqual(Buffer.from(calculatedHash), Buffer.from(hash));
    }

    /**
     * Create integrity hash for data
     * @param {string|Object} data - Data to hash
     * @returns {string} Integrity hash
     */
    createIntegrityHash(data) {
        const text = typeof data === 'string' ? data : JSON.stringify(data);
        return crypto.createHash('sha256').update(text).digest('hex');
    }
}

module.exports = YantraEncryption;