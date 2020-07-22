const Post = require('../../../models/post');
const Log = require('../../../models/log');

const { v1: uuid } = require('uuid');

const list = async (req, res) => {
	const { skip, sort, itemsPerPage, search, filterState, filterRegion, filterCategory } = req.query;
	const defaultSearch = (skip === '0' && sort === 'descending' && itemsPerPage === '25' && !search && !filterState && !filterRegion && !filterCategory);


	const limit = 25;
	let total = 0;

	// build out the match object for the aggregate
	const query = {};

	if (filterState) query.state = filterState;
	if (filterRegion) query.region = filterRegion;

	let orQuery = [];
	if (filterCategory) filterCategory.forEach(item => {
		const searchString = `category.${item}`;
		const orObject = {
			[searchString]: { $exists: true }
		}
		orQuery.push(orObject);

		query["$or"] = orQuery;
	})

	const aggregate = [];
	aggregate.push({ "$match": query });
	aggregate.push({ $sort: { createdAt: -1 } });

	// limit to 25 results 
	aggregate.push({ $limit: Number(skip * limit) + limit })
	aggregate.push({ $skip: Number(skip * limit) })

	try {
		const total = await Post.count(query);
		console.log(total)
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

		const resObject = {
			total,
			posts
		};
		res.status(200).json(resObject);

	} catch (error) {
		console.log('Error getting posts', error)
		res.status(500).json({
			message: 'Error fetching posts',
			code: "NOPOSTS",
		})
	}
};

module.exports = list;