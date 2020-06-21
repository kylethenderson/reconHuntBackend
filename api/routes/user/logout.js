const User = require('../../../models/user');
const Log = require('../../../models/log')

const { v1: uuid } = require('uuid');

const logout = async (req, res) => {

    try {
        // ensure there's the user in question
        // if not, don't break, just return
        const user = await User.findOne({ uuid: req.jwt.id });

        if (!user) return res.status(200).json({
            message: 'user not found'
        })

        // clear the refresh token from user db
        await User.updateOne(
            { uuid: req.jwt.id },
            { $unset: { refreshToken: '' } },
            { upsert: true }
        )

        // log the logout event
        log = {
            event: 'logout',
            data: {
                user,
                uuid: req.jwt.uuid,
            },
            uuid: uuid(),
        };

        await Log.create(log);

        res.sendStatus(200);
    } catch (error) {
        console.log('Error logging out', error);
        return res.status(500).json({
            message: 'Error logging out',
            code: 'LOGOUTERROR'
        })
    }

};

module.exports = logout;