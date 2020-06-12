const router = require('express').Router();

const User = require('../../../models/user');

router.get('/', (req, res, next) => {
	console.log('user settings get route', req.jwt);
	res.sendStatus(200);
})

router.put('/', async (req, res, next) => {
	console.log('updating user data', req.body, req.jwt);

	// validate body with joi
	validatedBody = req.body;

	try {
		const {
			firstName,
			lastName,
			email,
			phone
		} = validatedBody;

		await User.updateOne({ uuid: req.jwt.uuid }, {
			firstName: firstName.toLowerCase(),
			lastName: lastName.toLowerCase(),
			email: email.toLowerCase(),
			phone: phone
		});

		const updatedUser = await User.findOne({ uuid: req.jwt.uuid }, {
			firstName: 1,
			lastName: 1,
			email: 1,
			phone: 1
		})

		res.status(200).json(updatedUser);

	} catch (error) {
		console.log('Error updating user', error);
		res.status(400).json({
			code: "UPDATE_USER",
			message: 'Error updating user'
		})
	}

})

module.exports = router;