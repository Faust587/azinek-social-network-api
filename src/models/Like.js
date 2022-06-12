const { Schema, model } = require('mongoose');

const LikeSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  postId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Post',
  },
});

module.exports = model('Like', LikeSchema);
