const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
   body: {
  type: String,
  
},
   post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'post'
   },
createdAt: {
    type: Date,
    default: Date.now()
}
})

module.exports = mongoose.model('comment', commentSchema);