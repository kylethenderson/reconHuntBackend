const router = require('express').Router();
const Post = require('../../../models/post');
const Log = require('../../../models/log');

const { v1: uuid } = require('uuid');

const list = async (req, res) => {
	const { skip, sort, itemsPerPage, search, filterState, filterRegion, filterCategory } = req.query;
	const defaultSearch = (skip === '0' && sort === 'descending' && itemsPerPage === '25' && !search && !filterState && !filterRegion && !filterCategory);

	// build out the match object for the aggregate
	const match = {};
	if (filterState) match.state = filterState;
	if (filterRegion) match.region = filterRegion;

	let orQuery = [];
	if (filterCategory) filterCategory.forEach(item => {
		const searchString = `category.${item}.allowed`;
		const orObject = {
			[searchString]: true
		}
		orQuery.push(orObject);

		match["$or"] = orQuery;
	})

	const aggregate = [];
	aggregate.push({ "$match": match });
	aggregate.push({ $sort: { createdAt: -1 } });
	if (defaultSearch) aggregate.push({ $limit: 25 })

	try {
		const posts = await Post.aggregate(aggregate);

		// log the search event if its not just the default
		if (!defaultSearch) {
			const log = {
				event: 'search',
				data: req.query,
				uuid: uuid(),
			};
			await Log.create(log);
		}

		res.status(200).json(posts);

	} catch (error) {
		console.log('Error getting posts', error)
		res.status(500).json({
			message: 'Error fetching posts',
			code: "NOPOSTS",
		})
	}
};

module.exports = list;