require('dotenv').config();
const Log = require('../../../models/log');
const joi = require('@hapi/joi');
const sendMail = require('../../../scripts/sendMail')
const { v1: uuid } = require('uuid');

const contactEmail = process.env.CONTACT_EMAIL

const contactValidation = joi.object({
	title: joi.string().required(),
	message: joi.string().required(),
})

const contact = async (req, res, next) => {
	const { body } = req;
	const { user } = req.jwt

	console.log('the body is')
	console.log(body)
	console.log('the jwt is')
	console.log(req.jwt)


	const { error } = contactValidation.validate(body);
	if (error) return res.status(400).json({
		message: 'Error with body',
		code: 'EMAIL_ERROR',
	});

	const mailOptions = {
		to: contactEmail,
		subject: 'New Contact Email',
		html: `
			<p>${body.message}</p>
			<p>
			From,
			<br>
			${user.firstName} ${user.lastName}
			<br>
			${user.email}
			<br>
			${req.jwt.username}
			</p>
		`
	};

	try {
		await sendMail(mailOptions);

		const log = {
			event: 'user_contact',
			data: {
				userUuid: req.jwt.uuid,
				username: req.jwt.username,
				userEmail: user.email,
				message: body.message,
			},
			uuid: uuid(),
		}

		await Log.create(log)

		res.sendStatus(200);

	} catch (error) {
		console.log(error);
		res.status(400).json({
			message: 'Error sending contact email',
			code: 'EMAIL_ERROR'
		});
	}

}

module.exports = contact;