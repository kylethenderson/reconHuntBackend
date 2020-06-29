const mongoose = require('mongoose');

const { Schema } = mongoose;

const postSchema = new Schema({
	title: String,
	city: String,
	state: String,
	region: String,
	description: String,
	available: Object,
	createdBy: String,
	category: Array,
	uuid: String,
	price: String,
	huntableAcres: String,
	images: Array,
	active: {
		type: Boolean,
		default: true
	}
}, { timestamps: true });

module.exports = mongoose.model('post', postSchema);