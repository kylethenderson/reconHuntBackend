const jwt = require('jsonwebtoken')

const { TOKEN_SECRET: secret } = process.env;

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // if there's no authorization header, give 'em the boot!
    if (!authHeader) return res.status(401).json({
        message: 'Access denied',
    })

    // no token? also boot them bitches!
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({
        message: 'Access denied',
    })
    // oh, cool, you got a token, lets verify it
    try {
        const user = jwt.verify(token, secret);
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: 'Invalid token',
        })
    }
}

module.exports = verifyToken;