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
    const user = jwt.verify(checkToken, REFRESH_TOKEN_SECRET);
    if (!user) return res.sendStatus(403);

    // does the user in the token exist?
    const checkUser = await User.findOne({ uuid: user.id });
    if (checkToken !== checkUser.refreshToken) res.sendStatus(403);

    // refreshToken verified, pare down the data
    userData = { _id: checkUser._id, firstName: checkUser.firstName, lastName: checkUser.lastName, email: checkUser.email, phone: checkUser.phone };

    // prep data to be included in token
    // console.log(user);
    const tokenData = {
        id: user.uuid,
        user: userData,
        username: user.username,
    }
    const { token, refreshToken } = createTokens(tokenData);

    // update user object with refreshToken
    await User.updateOne(
        { uuid: user.uuid },
        {
            refreshToken,
            lastLogin: new Date()
        },
        {
            upsert: true
        }
    );

    res.status(200).json({
        token,
        refreshToken
    });
})

module.exports = router;