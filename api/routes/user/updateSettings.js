const User = require('../../../models/user');
const UserAuth = require('../../../models/auth')

const bcrypt = require('bcryptjs')

const updateSettings = async (req, res, next) => {
	console.log('updating user data', req.body, req.jwt);

	// validate body with joi
	const { body: validatedBody, jwt } = req;

	try {
		const {
			firstName,
			lastName,
			email,
			phone,
			emailNotifications,
			password,
			newPassword,
		} = validatedBody;

		// if user wants to update password, verify and update the auth object first;
		// don't want any other data updated if password is bad
		if (password && newPassword) {

			// use user.uuid to get auth creds
			const auth = await UserAuth.findOne({ uuid: jwt.uuid })
			if (!auth) return res.status(400).json({
				message: 'No user found.',
				code: 'NOUSER'
			});

			// verify the password they sent matches
			const validPass = await bcrypt.compare(validatedBody.password, auth.password);
			if (!validPass) return res.status(400).json({
				message: 'Invalid password',
				code: 'INVALIDCREDS'
			});

			// hash password to update
			const salt = await bcrypt.genSalt();
			const hashedPassword = await bcrypt.hash(validatedBody.newPassword, salt);

			await UserAuth.updateOne({ uuid: jwt.uuid }, { password: hashedPassword })
		}

		// update the rest of the user data
		await User.updateOne({ uuid: jwt.uuid }, {
			firstName: firstName.toLowerCase(),
			lastName: lastName.toLowerCase(),
			email: email.toLowerCase(),
			phone,
			emailNotifications
		});

		const updatedUser = await User.findOne({ uuid: jwt.uuid }, {
			firstName: 1,
			lastName: 1,
			email: 1,
			phone: 1,
			emailNotifications: 1
		})

		res.status(200).json(updatedUser);

	} catch (error) {
		console.log('Error updating user', error);
		res.status(400).json({
			code: "UPDATE_USER",
			message: 'Error updating user'
		})
	}

};

module.exports = updateSettings;