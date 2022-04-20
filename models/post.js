const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    destination:{type: String},
    pickup:{type: String},
    date:{type: Date},
    price:{type: Number},
    user:{type: Schema.Types.ObjectId, ref: 'Person'}
})

const Post = mongoose.model('Post', postSchema);

module.exports = Post;