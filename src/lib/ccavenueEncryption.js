import crypto from 'crypto';

const WORKING_KEY = process.env.CCA_WORKING_KEY || ''; 
const IV = Buffer.alloc(16, 0); // 16-byte IV (zeroes)

// Ensure the key is exactly 16 bytes
const formattedKey = Buffer.alloc(16);
const keyBuffer = Buffer.from(WORKING_KEY, 'utf-8');

keyBuffer.copy(formattedKey, 0, 0, Math.min(keyBuffer.length, formattedKey.length));

export function encrypt(text) {
    const cipher = crypto.createCipheriv('aes-128-cbc', formattedKey, IV);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

export function decrypt(encryptedText) {
    const decipher = crypto.createDecipheriv('aes-128-cbc', formattedKey, IV);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
