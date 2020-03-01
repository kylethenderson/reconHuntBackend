const router = require('express').Router();
const verifyToken = require('../../../scripts/verifyToken')
const createPost = require('./create');

router.use('/create', verifyToken, createPost);

module.exports = router;