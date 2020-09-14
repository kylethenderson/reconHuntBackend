const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
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
    zip: {
        type: String,
        required: true,
    },
    uuid: {
        type: String,
        required: true,
    },
    disclaimer: {
        accepted: {
            type: Boolean,
            default: false,
        },
        acceptedDate: {
            type: Date,
            default: null
        }
    },
    emailNotifications: {
        type: Boolean,
        default: true
    },
    permissions: Object,
    refreshToken: String,
    lastLogin: Date,
    lastActive: Date,
},
    { timestamps: true });

module.exports = mongoose.model('user', userSchema);

