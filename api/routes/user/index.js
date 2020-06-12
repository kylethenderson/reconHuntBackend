const router = require('express').Router();
const verifyToken = require('../../../scripts/verifyToken')

// import routes
const loginRoute = require('./login');
const logoutRoute = require('./logout');
const registerRoute = require('./register');
const resetPasswordRoute = require('./resetPassword');
const refreshTokenRoute = require('./refreshToken');
const userSettingRoute = require('./userSettings');

// server health check
router.get('/', (req, res) => {
    res.status(200).json('server running')
})

router.use('/login', loginRoute)
router.use('/logout', verifyToken, logoutRoute)
router.use('/register', registerRoute)
router.use('/resetPassword', resetPasswordRoute)
router.use('/refreshToken', refreshTokenRoute)
router.use('/settings', verifyToken, userSettingRoute )

module.exports = router;