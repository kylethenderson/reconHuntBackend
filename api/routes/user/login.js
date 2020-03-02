const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const moment = require('moment');

const createTokens = require('../../../scripts/createTokens');
const UserAuth = require('../../../models/auth');
const User = require('../../../models/auth');
const { TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;
const { loginValidation } = require('../../../scripts/validations')

router.get('/', (req, res) => {
    res.status(200).json('login route')
})

router.post('/', async (req, res) => {
    const { body } = req;

    // validate req.body data
    const { error } = loginValidation.validate(body);
    if (error) return res.status(400).json({
        message: error.details[0].message,
    })

    // ensure user is in collection
    const user = await UserAuth.findOne({ username: body.username })
    if (!user) return res.status(400).json({
        message: 'Invalid username or password',
        code: 'INVALIDCREDS'
    });

    // validate password
    const validPass = await bcrypt.compare(body.password, user.password);
    if (!validPass) return res.status(400).json({
        message: 'Invalid username or password',
        code: 'INVALIDCREDS'
    });

    // prep data to be included in token
    // console.log(user);
    const tokenData = {
        id: user.uuid,
        username: user.username,
    }
    const { token, newRefreshToken } = createTokens(tokenData);

    // update user object with refreshToken
    await User.updateOne(
        { uuid: user.uuid },
        { refreshToken }
    );

    res.status(200).json({
        token,
        newRefreshToken
    });

})

module.exports = router;