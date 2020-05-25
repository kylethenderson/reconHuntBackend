const mongoose = require('mongoose');

const { Schema } = mongoose;

const logSchema = new Schema({
	event: {
		type: String,
		required: true,
	},
	data: {
		type: Object,
		required: true
	},
	uuid: {
		type: String,
		required: true
	}
},
	{ timestamps: true });

module.exports = mongoose.model('log', logSchema);



