// whatever imports you need
const { contactValidation } = require('../../../scripts/validations');
const Log = require('../../../models/log');
const Post = require('../../../models/post');
const User = require('../../../models/user');
const { v1: uuid } = require('uuid');
const nodemailer = require('nodemailer');
const sendMail = require('../../../scripts/sendMail');

const fromAddress = 'recon.hunt.test@gmail.com'

const contact = async (req, res, next) => {
	const { body } = req;
	// validate the body
	const { error } = contactValidation.validate(body);
	if (error) return res.status(500).json({
		message: 'Error with body',
		code: 'EMAIL_ERROR'
	})

	// get the post so we can get the user from it
	const { postId } = body;
	const post = await Post.findOne(
		{ uuid: postId },
		{ createdBy: 1, city: 1, state: 1, _id: 0 }
	);
	if (!post) return res.status(500).json({
		code: 'NOPOST',
		message: 'Unable to find post.'
	})
	const { createdBy: userUuid, city, state } = post;

	const formattedCity = city.charAt(0).toUpperCase() + city.slice(1);

	// get the user info to contact
	const user = await User.findOne(
		{ uuid: userUuid },
		{ email: 1, username: 1 }
	);

	if (!user) return res.status(500).json({
		code: 'NOUSER',
		message: 'Unable to find user.'
	});

	const { email, username } = user;

	const formattedName = username.charAt(0).toUpperCase() + username.slice(1);

	// create the object to email
	// 
	const mailOptions = {
		to: email,
		subject: `Message from Recon Hunt`,
		html: `
			<h3>${req.jwt.user.firstName},</h3>
			<p>${formattedName} is interested in your ${formattedCity}, ${state} property.</p>
			<p>Continue the conversation by contacting them at ${body.email}.</p>
			<br />
			<h4>Thanks,</h4>
			<p>Your friends at Recon Hunt</p>
		`,
	};

	try {
		await sendMail(mailOptions);

		// then make a log of the event
		const log = {
			event: 'post_contact',
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
		res.status(200).json({ username });
	}
	catch (error) {
		console.log(error);
	}

}

module.exports = contact;