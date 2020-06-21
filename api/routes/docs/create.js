
// REQUIRE ALL THE LIBS!
const fs = require('fs');
const fsxtra = require('fsxtra');
const Joi = require('@hapi/joi');
const path = require('path');
const { v1: uuidv1 } = require('uuid');
const crypto = require('crypto');

////////////
// ROUTES //
////////////

const create = async (req, res, next) => {
	// assign variable
	const { logger } = req;
	try {
		// validate the data in the request body
		await Joi.validate(req.body, generalValidator);
	} catch (err) {
		logger.info(`${err.name}: ${err.details[0].message}`);
		return res.status(400).json({ [err.name]: err.details[0].message });
	}
	try {
		// assign variables
		const { uuid: userId } = req.jwt;
		const { uuid: orgId, name: orgName } = req.jwt.organization;
		const { originalname, buffer, mimetype } = req.file;
		const { metaData } = req.body;

		// validation
		if (!req.body.docType) {
			logger.info(`Error: Bad Request; 'req.body' must contain the key 'docType'`);
			return res.status(400).json({ Error: `Bad Request; 'req.body' must contain the key 'docType'` });
		}

		if (Object.keys(req.body).length < 2) {
			logger.info(`Error: Bad Request; 'req.body' must contain at least two keys`);
			return res.status(400).json({ Error: `Bad Request; 'req.body' must contain at least two keys` });
		}

		// construct the file name
		const fileName = new Date().toISOString().replace(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).(\d{3}Z)$/, '$1$2$3-$4$5$6$7') + '_' + originalname;

		const currentTime = new Date();

		// create the full path by joining docStoreRoot and currentTime string
		const fullDirPath = path.join(docStoreRoot, currentTime.getFullYear().toString(), (currentTime.getMonth() + 1).toString(), currentTime.getDate().toString());

		// create the file path in the file system
		await fsxtra.mktree(fullDirPath);

		// create file path
		const filePath = path.join(fullDirPath, fileName);

		// write to file system
		await fs.writeFileSync(filePath, buffer);

		// read file and hash
		const readDoc = await fs.readFileSync(filePath);
		const docHash = crypto.createHash('sha512');
		docHash.update(readDoc);
		const hash = docHash.digest('base64');

		// create db entry for document
		const result = await db.create({
			filePath: currentTime.getFullYear().toString() + '/' + (currentTime.getMonth() + 1).toString() + '/' + currentTime.getDate().toString() + '/' + fileName,
			fileName,
			fileType: mimetype,
			metaData: req.body,
			documentId: uuidv1(),
			createdAt: new Date(),
			hash
		});

		// call the eventTracker
		try {
			await eventTracker(req, orgId, userId, orgName);
		} catch (error) {
			logger.error(circularErrorFix(error));
		}

		// note what's happening
		logger.verbose(`saving file at path ${filePath}`);

		return res.status(201).json({ result });
	} catch (err) {
		return next(err);
	};
};

////////////////
// VALIDATION //
////////////////

const postValidator = Joi.object().keys({
	loadId: Joi.string().regex(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
	docType: Joi.string().valid('invoicing').required()
});


module.exports = create;