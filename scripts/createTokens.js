const jwt = require('jsonwebtoken')
const { TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

const createTokens = (data, expiry) => {
    
    // create token
    const token = jwt.sign(data, TOKEN_SECRET, {
        expiresIn: expiry ? `${expiry}` : '15m',
    });
    // create refresh token
    const newRefreshToken = jwt.sign(data, REFRESH_TOKEN_SECRET, {
        expiresIn: expiry ? `${expiry}` : '7d',
    })

    return { token, newRefreshToken };
}

module.exports = createTokens;