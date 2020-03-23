const router = require('express').Router();
const Post = require('../../../models/post')

router.get('/', async (req, res) => {
	try {
		const post = await Post.find({ uuid: req.query.id });
		if (!post.length) throw new Error();
		res.status(200).json(post[0]);
	} catch (error) {
		console.log('Error finding single post', error);
		res.status(400).json({
			message: 'Error finding single post',
			code: "NOPOST",
		})
	}
})

module.exports = router;