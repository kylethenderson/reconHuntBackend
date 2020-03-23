const router = require('express').Router();
const { v1: uuidv1 } = require('uuid');

router.get('/', (req, res) => {
    res.send('create post route');
})

router.post('/', (req, res) => {
    console.log(req.user, req.body);

    const uuid = uuidv1();

    res.status(201).json({
        message: 'post created!'
    });
})

module.exports = router;