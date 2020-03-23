const router = require('express').Router();
const User = require('../../../models/user');
const jwt = require('jsonwebtoken')
const createTokens = require('../../../scripts/createTokens');

const { REFRESH_TOKEN_SECRET } = process.env;

router.post('/', async (req, res) => {

    // is there a refreshToken?
    const checkToken = req.body.token;
    if (!checkToken) return res.sendStatus(401);

    // is it a valid token?
    const verifiedToken = jwt.verify(checkToken, REFRESH_TOKEN_SECRET);
    if (!verifiedToken) return res.sendStatus(403);

    // does the user in the token exist?
    const userObject = await User.findOne({ uuid: verifiedToken.id });
    console.log(userObject);
    if (checkToken !== userObject.refreshToken) return res.sendStatus(403);

    // refreshToken verified, pare down the data
    userData = { _id: userObject._id, firstName: userObject.firstName, lastName: userObject.lastName, email: userObject.email, phone: userObject.phone };

    // prep data to be included in token
    // console.log(user);
    const tokenData = {
        id: userObject.uuid,
        user: userData,
        username: userObject.username,
    }
    const { token, refreshToken } = createTokens(tokenData);

    // update user object with refreshToken
    await User.updateOne(
        { uuid: userObject.uuid },
        {
            refreshToken,
            lastLogin: new Date()
        }
    );

    res.status(200).json({
        token,
        refreshToken
    });
})

module.exports = router;