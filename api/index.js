const router = require('express').Router();

// middleware
const verifyToken = require('../scripts/verifyToken');

// import routes
const user = require('./routes/user');
const post = require('./routes/post');
const data = require('./routes/data');
const docs = require('./routes/docs');

// user routes
router.post('/login', user.login)
router.post('/logout', verifyToken, user.logout)
router.post('/register', user.register)
router.post('/resetPassword', user.resetPassword)
router.post('/refreshToken', user.refreshToken)
router.put('/settings', verifyToken, user.updateSettings)

// post routes
router.post('/create', verifyToken, post.create);
router.get('/list', verifyToken, post.list);
router.get('/view', verifyToken, post.view);

// data routes
router.get('/data', verifyToken, data.getCategories)

// document routes
// define storage
const multer = require('multer');
const storage = multer.memoryStorage();

// initialize upload
const upload = multer({ storage });


router.post('/docs/create', upload.single('file'), docs.create)

module.exports = router;