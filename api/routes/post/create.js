const router = require('express').Router();
const { v1: uuidv1 } = require('uuid');
const Post = require('../../../models/post')
const { postValidation } = require('../../../scripts/validations')

router.get('/', (req, res) => {
    res.send('create post route');
})

router.post('/', async (req, res) => {
    console.log(req.user, req.body);

    const { error } = postValidation.validate(req.body);
    if (error) return res.status(400).json({
        message: error.details[0].message
    })
    const uuid = uuidv1();

    const newPost = {
        uuid,
        area: req.body.area,
        title: req.body.title,
        description: req.body.description,
        available: req.body.available,
        category: {
            deer: {
                methods: req.body.deerMethods
            },
            upland: {},
            turkey: {},
            varmint: {}
        },
        price: req.body.price,
        huntableAcres: req.body.huntableAcres,
        createdBy: req.user.uuid
    }

    const categories = ["deer", "upland", "turkey", "varmint", 'waterFowl'];

    categories.forEach(category => {
        if (req.body.category.includes(category)) newPost.category[category].allowed = true;
        else newPost.category[category].allowed = false;
    })

    try {
        await Post.create(newPost)

    } catch (error) {
        console.log('Error creating post', error);
        return res.status(400).json({
            message: 'Error creating post',
            code: 'POSTERROR'
        })
    }

    res.status(201).json({
        message: 'post created!'
    });
})

module.exports = router;