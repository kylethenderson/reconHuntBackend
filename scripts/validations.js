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

module.exports = { registrationValidation, authValidation, userValidation, loginValidation };