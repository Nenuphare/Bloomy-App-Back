const crypto = require('crypto');

function generateShareCode() {
    // Generate a random value
    const randomValue = Math.random().toString(36).substring(2, 10); // 8 character random string

    // Generate a unique code based on the current time and the random value
    const currentTime = new Date().toISOString();
    const uniqueCode = crypto.createHash('sha256').update(currentTime + randomValue).digest('hex');

    // Take the first 8 characters of the hash as the share code
    const shareCode = uniqueCode.substring(0, 8);

    return shareCode;
}

module.exports = generateShareCode;