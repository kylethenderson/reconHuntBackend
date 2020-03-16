const router = require('express').Router();

router.get('/', (req, res) => {
	const posts = [
		{
			title: 'title',
			message: 'message',
			area: 'area',
			createdBy: 'username',
			createdOn: '3/15/2020',
		},
		{
			title: 'title',
			message: 'message',
			area: 'area',
			createdBy: 'username',
			createdOn: '3/15/2020',
		},
		{
			title: 'title',
			message: 'message',
			area: 'area',
			createdBy: 'username',
			createdOn: '3/15/2020',
		},
		{
			title: 'title',
			message: 'message',
			area: 'area',
			createdBy: 'username',
			createdOn: '3/15/2020',
		}
	]
	res.status(200).json(posts);
})

router.post('/', (req, res) => {
	console.log(req.user);
	res.status(201).json({
		message: 'post created!'
	});
})

module.exports = router;