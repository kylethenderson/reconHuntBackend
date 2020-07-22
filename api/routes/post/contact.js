// whatever imports you need
const { contactValidation } = require('../../../scripts/validations');
const Log = require('../../../models/log');
const { v1: uuid } = require('uuid')

const contact = async (req, res, next) => {
	const { body } = req;
	console.log(req.jwt);
	// validate the body
	const { error } = contactValidation.validate(body);
	if (error) return res.status(500).json({
		message: 'Error with body',
		code: 'EMAIL_ERROR'
	})

	try {
		//

		// we need to send the email.


		// then make a log of the event
		const log = {
			event: 'contact',
			data: {
				userUuid: req.jwt.uuid,
				userName: body.name,
				userEmail: body.email,
				message: body.message,
				postUuid: body.postId,
			},
			uuid: uuid(),
		}

		await Log.create(log);

		// then we can send the all good
		res.sendStatus(200);
	}
	catch (error) {
		console.log(error);
	}
	finally {
		//
	}






}

module.exports = contact;