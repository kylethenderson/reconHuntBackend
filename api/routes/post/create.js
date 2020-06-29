const router = require('express').Router();
const { v1: uuidv1 } = require('uuid');
const Post = require('../../../models/post');
const Category = require('../../../models/category')
const { postValidation } = require('../../../scripts/validations');


const create = async (req, res) => {
    const body = JSON.parse(req.body.data);
    console.log(body);

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
            category: [],
            price: body.price,
            huntableAcres: body.huntableAcres,
            images: [],
            createdBy: req.jwt.uuid
        }

        const categories = body.category.map(item => {
            const obj = {
                name: item
            };
            if (item === 'deer') {
                obj.methods = body.deerMethods;
            }
            return obj;
        })

        newPost.category = categories;

        // const dbCategories = await Category.find({}, { "_id": 0, "name": 0, "invalid": 0 });
        // const categories = dbCategories.map(c => c.category)
        // categories.forEach(category => {
        //     if (body.category.includes(category)) newPost.category[category].allowed = true;
        //     else newPost.category[category].allowed = false;
        // })

        req.files.forEach(file => {
            newPost.images.push({
                uuid: file.filename,
                path: file.path
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