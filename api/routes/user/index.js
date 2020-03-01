const router = require('express').Router();

// import routes
const loginRoute = require('./login')
const logoutRoute = require('./logout')
const registerRoute = require('./register')
const resetPasswordRoute = require('./resetPassword')

// server health check
router.get('/', (req, res) => {
    res.status(200).json('server running')
})

router.use('/login', loginRoute)
router.use('/logout', logoutRoute)
router.use('/register', registerRoute)
router.use('/resetPassword', resetPasswordRoute)



module.exports = router;