const mongoose = require('mongoose');

const { Schema } = mongoose;

const categorySchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	category: String,
	invalid: {
		type: Boolean,
		required: true
	},
})

module.exports = mongoose.model('categories', categorySchema);



