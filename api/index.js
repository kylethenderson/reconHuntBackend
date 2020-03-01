const router = require('express').Router();

// import routes
const userRoute = require('./routes/user/index')
const postRoute = require('./routes/post/index')

router.use('/user', userRoute);
router.use('/post', postRoute);

module.exports = router;