const router = require('express').Router();
const Post = require('../../../models/post');
const Log = require('../../../models/log');

const { v1: uuid } = require('uuid');

const view = async (req, res) => {
	console.log(req.query.id, req.jwt)
	try {
		const post = await Post.find({ uuid: req.query.id });
		if (!post.length) throw new Error();

		// log the single post view event
		log = {
			event: 'viewPost',
			data: {
				postId: req.query.id,
				user: {
					...req.jwt.user,
					uuid: req.jwt.uuid
				}
			},
			uuid: uuid(),
		};

		await Log.create(log);

		res.status(200).json(post[0]);
	} catch (error) {
		console.log('Error finding single post', error);
		res.status(400).json({
			message: 'Error finding single post',
			code: "NOPOST",
		})
	}
};

module.exports = view;