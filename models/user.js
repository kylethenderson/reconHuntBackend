const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    uuid: {
        type: String,
        required: true,
    }
},
    { timestamps: true });

module.exports = mongoose.model('user', userSchema);

