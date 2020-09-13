const mailer = require('nodemailer');

const { user, pass } = process.env.EMAIL_SETTINGS;

const sendMail = async (options) => {
	const { to, subject, html } = options;

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
			host: 'smtp.gmail.com',
			port: 587,
			secure: false,
			auth: {
				user,
				pass
			}
		});

		// send mail with defined transport object
		await transporter.sendMail(mailOptions);
	} catch (error) {
		throw new Error(error);
	}
}
module.exports = sendMail;