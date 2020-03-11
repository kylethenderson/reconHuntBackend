const router = require('express').Router();
const User = require('../../../models/user')


router.get('/', (req, res) => {
    res.status(200).json('logout route')
});

router.post('/', async (req, res) => {

    // ensure there's the user in question
    // if not, don't break, just return
    const user = await User.findOne({ uuid: req.user.id });

    if (!user) return res.status(200).json({
        message: 'user not found'
    })

    // clear the refresh token from user db
    await User.updateOne(
        { uuid: req.user.id },
        { $unset: { refreshToken: '' } },
        { upsert: true }
    )
    res.sendStatus(200);
})

module.exports = router;