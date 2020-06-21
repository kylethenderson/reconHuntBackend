const Category = require('../../../models/category')

const getCategories = async (req, res, nexte) => {
	try {
		const response = await Category.find({});

		res.status(200).json(response);
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
};

module.exports = getCategories;