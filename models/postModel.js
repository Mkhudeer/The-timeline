const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
   post: {
  type: String,
  required: [true, "Post is required"],
  minlength: [25, "Post should be minimum 25 character"],
  trim: true
}
},
    { timestamps: true }
);

module.exports = mongoose.model('post', postSchema);