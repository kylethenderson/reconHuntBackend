const User = require('../../../models/user');
const jwt = require('jsonwebtoken')
const createTokens = require('../../../scripts/createTokens');

const { REFRESH_TOKEN_SECRET } = process.env;

const refreshToken = async (req, res) => {

    console.log('refreshing token')

    // is there a refreshToken?
    const checkToken = req.body.token;
    if (!checkToken) return res.sendStatus(401);

    try {
        // decode the token
        const decodedToken = jwt.decode(checkToken);

        // does the user in the token exist?
        // and does it match the last token we saved?
        const userObject = await User.findOne({ uuid: decodedToken.uuid });
        if (checkToken !== userObject.refreshToken) return res.sendStatus(403);

        const {
            firstName,
            lastName,
            email,
            phone,
            emailNotifications
        } = userObject;

        const userData = {
            firstName,
            lastName,
            email,
            phone,
            emailNotifications
        }

        // prep data to be included in new tokens
        // console.log(user);
        const tokenData = {
            uuid: userObject.uuid,
            user: userData,
            username: userObject.username,
        }

        // create the tokens. takes data and and expiry(optional)
        const { token, refreshToken } = createTokens(tokenData);

        // update user object with new refreshToken
        await User.updateOne(
            { uuid: userObject.uuid },
            {
                refreshToken,
                lastActive: new Date()
            }
        );

        return res.status(200).json({
            token,
            refreshToken
        });

    } catch (error) {
        console.log('Error in refresh token', error);
        // if client had a token but its expired, send that error to client
        if (error.name === 'TokenExpiredError') {
            return res.status(412).json({
                message: error.message,
                code: 'JWTEXPIRE'
            })
        }
        return res.status(500).json({
            message: 'Error in refresh token',
            code: 'RTERROR'
        })
    }
};

module.exports = refreshToken;