const router = require('express').Router();
const verifyToken = require('../../../scripts/verifyToken')
const createPost = require('./create');
const listPost = require('./list')
const searchPost = require('./search')

router.use('/create', verifyToken, createPost);
router.use('/list', verifyToken, listPost);
router.use('/search', verifyToken, searchPost);


module.exports = router;