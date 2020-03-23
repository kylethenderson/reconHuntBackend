const router = require('express').Router();
const Post = require('../../../models/post')

router.get('/', async (req, res) => {
	try {
		const posts = await Post.find({});
		if (!posts.length) throw new Error();
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