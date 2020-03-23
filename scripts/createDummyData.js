const Post = require('../models/post');
const { v1: uuidv1 } = require('uuid');


const createPosts = async () => {
	for (let i = 0; i < 25; i++) {
		const uuid = uuidv1();

		const newPost = {
			title: `Post title ${i + 1}`,
			description: `This will be the description for post number ${i + 1}.
				This needs to be of sufficient length to be able to appropriately mock up the front end.
				It should probably be about 4 sentences long to test. Most should probably be shorter than this.
				But it's possible that someone might write a long paragraph about their property.`,
			area: 'Minneapolis, MN',
			available: {
				from: 'Sat Mar 21 2020 17:28:53 GMT-0700',
				to: 'Sat Mar 28 2020 17:28:53 GMT-0700'
			},
			category: {
				deer: {
					allowed: true,
					weapon: ['bow', 'rifle']
				},
				upland: {
					allowed: true,
				},
				turkey: {
					allowed: true,
				},
				varmint: {
					allowed: false,
				}
			},
			createdBy: 'username',
			createdOn: '3/15/2020',
			price: '250',
			huntableAcres: '100',
			uuid,
		}

		await Post.create(newPost);
	}
}

module.exports = { createPosts };