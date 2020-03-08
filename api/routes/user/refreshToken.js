const router = require('express').Router();
const User = require('../../../models/user');
const createTokens = require('../../../scripts/createTokens');

router.post('/', async (req, res) => {
    // is there a refreshToken?
    const refreshToken = req.body.token;
    if (!refreshToken) return res.sendStatus(401);

    // is it a valid token?
    const user = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    if (!user) return res.sendStatus(403);

    // does the user in the token exist?
    const checkUser = await User.findOne({ uuid: user.id });
    if (refreshToken !== checkUser.refreshToken) res.sendStatus(403);

    // prep data to be included in token
    // console.log(user);
    const tokenData = {
        id: checkUser.uuid,
        username: checkUser.username,
    }
    const { token, refreshToken: newRefreshToken } = createTokens(tokenData);

    // update user's refreshToken with new one
    await User.updateOne(
        { uuid: checkUser.uuid },
        { refreshToken: newRefreshToken }
    )

    res.status(200).json({
        token,
        refreshToken: newRefreshToken
    });
})

module.exports = router;