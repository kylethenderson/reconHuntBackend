const router = require('express').Router();
const Post = require('../../../models/post');
const Log = require('../../../models/log')

const { v1: uuid } = require('uuid')

router.get('/', async (req, res) => {
	console.log(req.query);

	try {
		const posts = await Post.find({});
		if (!posts.length) throw new Error();

		// log the search event
        log = {
            event: 'search',
            data: req.query,
            uuid: uuid(),
        };

        await Log.create(log);
		res.status(200).json(posts);

	} catch (error) {
		console.log('Error getting posts', error)
		res.status(500).json({
			message: 'Error fetching posts',
			code: "NOPOSTS",
		})
	}
})

module.exports = router;