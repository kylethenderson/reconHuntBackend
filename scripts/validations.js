const joi = require('@hapi/joi');

const registrationValidation = joi.object({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    username: joi.string().required(),
    email: joi.string().required().email(),
    phone: joi.string().required(),
    password: joi.string().required(),
});

const authValidation = joi.object({
    password: joi.string().required(),
    uuid: joi.string().required(),
});

const userValidation = joi.object({
    username: joi.string().required(),
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    email: joi.string().required().email(),
    phone: joi.string().required(),
    disclaimer: joi.object().required(),
    emailNotifications: joi.boolean().required(),
    uuid: joi.string().required(),
});

const loginValidation = joi.object({
    username: joi.string().required(),
    password: joi.string().required(),
});

const postAvailableValidation = joi.object({
    to: joi.date().required(),
    from: joi.date().required(),
})

const postValidation = joi.object({
    title: joi.string().required(),
    city: joi.string(),
    state: joi.string().required(),
    region: joi.string().required(),
    description: joi.string().required(),
    available: postAvailableValidation,
    category: joi.array().items(joi.string()).required(),
    price: joi.string().required(),
    huntableAcres: joi.string().required(),
    deerMethods: joi.array(),
})

module.exports = { registrationValidation, authValidation, userValidation, loginValidation, postValidation };