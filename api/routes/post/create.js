const router = require('express').Router();

router.get('/', (req, res) => {
    res.send('create post route');
})

router.post('/', (req, res) => {
    console.log(req.user);
    res.status(201).json({
        message: 'post created!'
    });
})

module.exports = router;