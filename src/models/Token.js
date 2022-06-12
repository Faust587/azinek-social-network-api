const { Schema, model } = require('mongoose');

const TokenSchema = new Schema({
  accessToken: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    unique: true,
    required: true,
    ref: 'User',
  },
});

module.exports = model('Token', TokenSchema);
