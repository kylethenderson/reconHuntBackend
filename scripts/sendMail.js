const mailer = require('nodemailer');
require('dotenv').config();

const { user, pass } = process.env.EMAIL_SETTINGS;

console.log(user, pass);

const sendMail = async (options) => {
	const { to, subject, html } = options;

	fromAddress = process.env.CONTACT_EMAIL;

	const mailOptions = {
		from: `"Recon Hunt" <${fromAddress}>`,
		to,
		subject,
		html
	}

	try {
		//
		// create reusable transporter object using the default SMTP transport
		const transporter = mailer.createTransport({
			host: 'email-smtp.us-east-2.amazonaws.com',
			port: 465,
			secure: true,
			auth: { user, pass },
			tls: {
				// do not fail on invalid certs
				rejectUnauthorized: false
			}
		});

		// send mail with defined transport object
		await transporter.sendMail(mailOptions);
	} catch (error) {
		throw new Error(error);
	}
}
module.exports = sendMail;