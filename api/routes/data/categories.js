const router = require('express').Router();

const Category = require('../../../models/category')

router.get('/', async (req, res) => {
	try {
		const response = await Category.find({});

		res.status(200).json(response);
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
});

module.exports = router;