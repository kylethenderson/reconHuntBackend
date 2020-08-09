const mailer = require('nodemailer');

const fromAddress = 'recon.hunt.test@gmail.com'

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
				user: fromAddress,
				pass: 'reconHunt123'
			}
		});

		// send mail with defined transport object
		await transporter.sendMail(mailOptions);
	} catch (error) {
		throw new Error(error);
	}
}
module.exports = sendMail;