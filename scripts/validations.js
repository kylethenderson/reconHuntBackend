const Joi = require('@hapi/joi');

const registrationValidation = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().required().email(),
    phone: Joi.string().required(),
    password: Joi.string().required(),
});

const authValidation = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    uuid: Joi.string().required(),
});

const userValidation = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required().email(),
    phone: Joi.string().required(),
    uuid: Joi.string().required(),
});

const loginValidation = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
});

const postAvailableValidation = Joi.object({
    to: Joi.date().required(),
    from: Joi.date().required(),
})

const postCategoryValidation = Joi.object({
    deer: Joi.object().required(),
    upland: Joi.object().required(),
    turkey: Joi.object().required(),
    varmint: Joi.object().required(),
});

const postValidation = Joi.object({
    title: Joi.string().required(),
    area: Joi.string().required(),
    description: Joi.string().required(),
    available: postAvailableValidation,
    category: postCategoryValidation,
    createdBy: Joi.string().required(),
    price: Joi.string().required(),
    huntableAcres: Joi.string().required(),
    uuid: Joi.string().required(),
})

module.exports = { registrationValidation, authValidation, userValidation, loginValidation, postValidation };