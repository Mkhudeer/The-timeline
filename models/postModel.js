const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
   post: {
  type: String,
  required: [true, "Post is required"],
  minlength: [25, "Post should be minimum 25 character"],
  trim: true
},
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'comment'
},
    ],
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('post', postSchema);