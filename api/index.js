const router = require('express').Router();

// import routes
const userRoute = require('./routes/user/index')
const postRoute = require('./routes/post/index')
const dataRoute = require('./routes/data/index')

router.use('/user', userRoute);
router.use('/post', postRoute);
router.use('/data', dataRoute)

module.exports = router;