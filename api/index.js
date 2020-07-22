const express = require('express')
const router = express.Router();

// middleware
const verifyToken = require('../scripts/verifyToken');

router.get('/', (req, res) => {
	return res.status(200).json({
		code: 'ALLGOOD',
		message: 'Server is up and running',
	})
})

// import functions for routes
const user = require('./routes/user');
const post = require('./routes/post');
const data = require('./routes/data');

// user routes
router.post('/user/login', user.login)
router.post('/user/logout', verifyToken, user.logout)
router.post('/user/register', user.register)
router.post('/user/resetPassword', user.resetPassword)
router.post('/user/refreshToken', user.refreshToken)
router.put('/user/settings', verifyToken, user.updateSettings)

// upload file middleware
const upload = require('../scripts/uploadImages')

// post routes
router.post('/post/create', verifyToken, upload.array('image', 6), post.create);
router.get('/post/list', verifyToken, post.list);
router.get('/post/view', verifyToken, post.view);
router.post('/post/contact', verifyToken, post.contact);

// data routes
router.get('/data', verifyToken, data.getCategories)

module.exports = router;