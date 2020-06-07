const router = require('express').Router();
const verifyToken = require('../../../scripts/verifyToken')

// routes
const createPost = require('./create');
const listPost = require('./list')
const viewSingle = require('./viewSingle')

router.use('/create', verifyToken, createPost);
router.use('/list', verifyToken, listPost);
router.use('/view', verifyToken, viewSingle);


module.exports = router;