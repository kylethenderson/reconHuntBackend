const router = require('express').Router();
const verifyToken = require('../../../scripts/verifyToken');

// routes
const getCategories = require('./categories');

router.use('/categories', verifyToken, getCategories)

module.exports = router;