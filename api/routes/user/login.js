const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const moment = require('moment');

const createTokens = require('../../../scripts/createTokens');
const UserAuth = require('../../../models/auth');
const User = require('../../../models/user');
const { TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;
const { loginValidation } = require('../../../scripts/validations')

router.get('/', (req, res) => {
    res.status(200).json('login route')
})

router.post('/', async (req, res) => {
    const { body } = req;

    try {
        // validate req.body data
        const { error } = loginValidation.validate(body);
        if (error) return res.status(400).json({
            message: error.details[0].message,
        })

        // ensure user is in auth collection
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

        // username and pass verified, lets get some more data
        const userData = await User.findOne({ uuid: user.uuid },
            { _id: 0, firstName: 1, lastName: 1, email: 1, phone: 1 });

        // prep data to be included in token
        // console.log(user);
        const tokenData = {
            uuid: user.uuid,
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
    } catch (error) {
        console.log('Error logging in', error);
        return res.status(500).json({
            code: 'LOGINERROR',
            message: 'Error logging in'
        })
    }


})

module.exports = router;