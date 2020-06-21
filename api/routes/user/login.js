const bcrypt = require('bcryptjs');
const { v1: uuid } = require('uuid');

const createTokens = require('../../../scripts/createTokens');
const UserAuth = require('../../../models/auth');
const User = require('../../../models/user');
const Log = require('../../../models/log')
const { TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;
const { loginValidation } = require('../../../scripts/validations')

const login = async (req, res) => {
    const { body } = req;

    try {
        // validate req.body data
        const { error } = loginValidation.validate(body);
        if (error) return res.status(400).json({
            message: error.details[0].message,
        })

        // ensure user is in auth collection
        const user = await User.findOne({ username: body.username })
        if (!user) return res.status(400).json({
            message: 'Invalid username or password',
            code: 'INVALIDCREDS'
        });

        // use user.uuid to get auth creds
        const auth = await UserAuth.findOne({ uuid: user.uuid })
        if (!user) return res.status(400).json({
            message: 'Invalid username or password',
            code: 'INVALIDCREDS'
        });

        // validate password
        const validPass = await bcrypt.compare(body.password, auth.password);
        if (!validPass) return res.status(400).json({
            message: 'Invalid username or password',
            code: 'INVALIDCREDS'
        });

        // username and pass verified, lets get some more data
        const userData = await User.findOne({ uuid: user.uuid },
            { _id: 0, firstName: 1, lastName: 1, email: 1, phone: 1, emailNotifications: 1 });

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

        // log the login event
        log = {
            event: 'login',
            data: {
                ...userData,
                uuid: user.uuid,
            },
            uuid: uuid(),
        };

        await Log.create(log);

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


};

module.exports = login;