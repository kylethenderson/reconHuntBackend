const mongoose = require('mongoose');

const { Schema } = mongoose;

const postSchema = new Schema({
    
});

module.exports = mongoose.model('post', postSchema);