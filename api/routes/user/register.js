const router = require('express').Router();
const { v1: uuidv1 } = require('uuid');
const bcrypt = require('bcryptjs');

// import models
const User = require('../../../models/user');
const UserAuth = require('../../../models/auth');

const { registrationValidation, userValidation } = require('../../../scripts/validations');

// routes
router.get('/', (req, res) => {
    res.status(200).json('register route')
});

// register route - creates documents in auth collection and user collection
router.post('/', async (req, res) => {
    const { body } = req;

    // ensure username isn't already used
    const usernameExists = await UserAuth.findOne({ username: body.username })
    if (usernameExists) return res.status(409).json({
        message: 'Username unavailable',
        code: 'USEREXISTS',
    })

    // hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(body.password, salt);

    // create user uuid
    const uuid = uuidv1();

    // create auth object to save
    const userAuth = {
        username: body.username,
        password: hashedPassword,
        uuid,
    };

    // validate user auth data
    const { error: authError } = registrationValidation.validate(userAuth);
    if (authError) return res.status(400).send({
        message: authError.details[0].message
    });

    // save auth object into auth collection
    try {
        await UserAuth.create(userAuth);
    } catch (error) {
        return res.status(400).send({
            message: 'Error saving user auth',
            error: error,
        })
    }

    // create user object to save
    const user = {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone && body.phone,
        uuid,
    };

    // validate user object data
    const { error: userError } = userValidation.validate(user);
    if (userError) return res.status(400).send({
        message: userError.details[0].message
    });

    // save new user object
    try {
        await User.create(user);
        return res.status(201).json({
            message: 'Registration complete',
        })

    } catch (error) {
        return res.status(400).send({
            message: 'Error creating registration',
            error: error,
        })
    }
})

module.exports = router;