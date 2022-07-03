const mongoose = require('mongoose');
const { regExpLink } = require('../utils/constants');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    maxLength: 30,
    required: true,
  },
  link: {
    type: String,
    validate: {
      validator: (v) => regExpLink.test(v),
      message: (props) => `${props.value} ссылка не валидна!`,
    },
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  likes: {
    type: Array(mongoose.Schema.Types.ObjectId),
    default: [],
    ref: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
