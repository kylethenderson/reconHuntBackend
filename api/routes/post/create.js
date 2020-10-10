const { v1: uuidv1 } = require('uuid');
const Post = require('../../../models/post');
const { postValidation } = require('../../../scripts/validations');
const gm = require('gm');


const create = async (req, res) => {
    const body = JSON.parse(req.body.data);

    const { error } = postValidation.validate(body);
    if (error) {
        console.log('validation error', error);
        return res.status(400).json({
            message: error.details[0].message
        })
    }
    const uuid = uuidv1();
    try {


        const newPost = {
            uuid,
            city: body.city,
            state: body.state,
            region: body.region,
            title: body.title,
            description: body.description,
            available: body.available,
            category: {},
            price: body.price,
            huntableAcres: body.huntableAcres,
            images: [],
            createdBy: req.jwt.uuid
        }

        body.category.forEach(item => {
            newPost.category[item] = {
                allowed: true,
            }
            if (item === 'deer') {
                newPost.category.deer.hasOptions = true;
                newPost.category.deer.options = {
                    hunting_methods: body.deerMethods
                };
            }
        })

        // const dbCategories = await Category.find({}, { "_id": 0, "name": 0, "invalid": 0 });
        // const categories = dbCategories.map(c => c.category)
        // categories.forEach(category => {
        //     if (body.category.includes(category)) newPost.category[category].allowed = true;
        //     else newPost.category[category].allowed = false;
        // })

        req.files.forEach(file => {
            const newFilename = `thumbnail_${file.filename}`
            gm(`${file.path}`)
                .resize(100)
                .noProfile()
                .write(`/opt/frontend/public/images/${newFilename}`, error => {
                    if (error) {
                        console.log(error);
                        throw new Error(error);
                    };
                });

            newPost.images.push({
                filename: file.filename,
            })
        });

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