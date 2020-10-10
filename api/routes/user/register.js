const { v1: uuidv1 } = require('uuid');
const bcrypt = require('bcryptjs');

// import models
const User = require('../../../models/user');
const UserAuth = require('../../../models/auth');

const { registrationValidation, userValidation, authValidation } = require('../../../scripts/validations');

// register route - creates documents in auth collection and user collection
const register = async (req, res) => {
    const { body } = req;
    const { error: bodyError } = registrationValidation.validate(body);
    if (bodyError) {
        return res.status(400).send({
            message: bodyError.details[0].message
        })
    }

    try {
        // ensure username isn't already used
        const usernameExists = await User.findOne({ username: body.username })
        if (usernameExists) return res.status(409).send({
            message: 'Username unavailable',
            code: 'USEREXISTS',
        })

        //ensure email isn't already used
        const emailExists = await User.findOne({ email: body.email })
        if (emailExists) return res.status(409).send({
            message: 'Email in use',
            code: 'EMAILEXISTS',
        })

        // hash password
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(body.password, salt);

        // create user uuid
        const uuid = uuidv1();

        // create auth object to save
        const userAuth = {
            password: hashedPassword,
            uuid,
        };

        // validate user auth data
        const { error: authError } = authValidation.validate(userAuth);
        if (authError) return res.status(400).send({
            message: authError.details[0].message
        });

        // create user object to save
        const user = {
            username: body.username,
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            phone: body.phone && body.phone,
            zip: body.zip,
            disclaimer: {
                accepted: body.accepted,
                acceptedDate: body.accepted ? new Date() : null
            },
            emailNotifications: true,
            uuid,
        };

        // validate user object data
        const { error: userError } = userValidation.validate(user);
        if (userError) return res.status(400).send({
            message: userError.details[0].message
        });

        // save auth and user objects
        await UserAuth.create(userAuth);
        await User.create(user);

        return res.status(201).send({
            message: 'Registration complete',
        })
    } catch (error) {
        console.log('Error registering user', error);
        return res.status(500).json({
            message: 'Error creating registration',
            code: 'REGISTERERROR'
        })
    }

};

module.exports = register;