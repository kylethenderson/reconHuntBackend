const mongoose = require('mongoose');

const { Schema } = mongoose;

const postSchema = new Schema({
	title: String,
	area: String,
	description: String,
	available: Object,
	createdBy: String,
	category: Object,
	uuid: String,
	price: String,
	huntableAcres: String
});

module.exports = mongoose.model('post', postSchema);