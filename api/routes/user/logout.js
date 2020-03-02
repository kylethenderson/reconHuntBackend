const router = require('express').Router();
const User = require('../../../models/user')


router.get('/', (req, res) => {
    res.status(200).json('logout route')
});

router.post('/', async (req, res) => {
    const user = req.user;

    // clear the refresh token from user db
    await User.updateOne(
        { uuid: user.id },
        { refreshToken: null }
    )
})

module.exports = router;