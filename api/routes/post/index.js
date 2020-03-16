const router = require('express').Router();
const verifyToken = require('../../../scripts/verifyToken')
const createPost = require('./create');
const listPost = require('./list')

router.use('/create', verifyToken, createPost);
router.use('/list', verifyToken, listPost);


module.exports = router;