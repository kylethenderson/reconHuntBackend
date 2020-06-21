const router = require('express').Router();
const { v1: uuidv1 } = require('uuid');
const Post = require('../../../models/post');
const Category = require('../../../models/category')
const { postValidation } = require('../../../scripts/validations');

router.get('/', (req, res) => {
    res.send('create post route');
})

const create = async (req, res) => {
    console.log(req.jwt, req.body);

    const { error } = postValidation.validate(req.body);
    if (error) {
        console.log('validation error', error);
        return res.status(400).json({
            message: error.details[0].message
        })
    }
    const uuid = uuidv1();
    try {

        const dbCategories = await Category.find({}, { "_id": 0, "name": 0, "invalid": 0 });
        const categories = dbCategories.map(c => c.category)

        const newPost = {
            uuid,
            city: req.body.city,
            state: req.body.state,
            region: req.body.region,
            title: req.body.title,
            description: req.body.description,
            available: req.body.available,
            category: {
                deer: {
                    methods: req.body.deerMethods
                },
                upland: {},
                turkey: {},
                varmint: {},
                waterFowl: {},
                fish: {},
                guidedHunt: {},
            },
            price: req.body.price,
            huntableAcres: req.body.huntableAcres,
            createdBy: req.jwt.uuid
        }

        categories.forEach(category => {
            if (req.body.category.includes(category)) newPost.category[category].allowed = true;
            else newPost.category[category].allowed = false;
        })

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
};

module.exports = create;