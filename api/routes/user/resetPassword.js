const router = require('express').Router();

router.get('/', (req, res) => {
    res.status(200).json('reset password route')
})

module.exports = router;