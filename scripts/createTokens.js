const jwt = require('jsonwebtoken')
const { TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

const createTokens = (data, expiry) => {

    // create token
    const token = jwt.sign(data, TOKEN_SECRET, {
        algorithm: 'HS256',
        expiresIn: expiry ? `${expiry}` : '15m',
    });
    // create refresh token
    const refreshToken = jwt.sign(data, REFRESH_TOKEN_SECRET, {
        algorithm: 'HS256',
        expiresIn: expiry ? `${expiry}` : '7d',
    })

    return { token, refreshToken };
}

module.exports = createTokens;