const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: String,
  note: String,
  date: String,
  folder: String,
  font: String,
  bgColor: String,
  bgImage: String,
  images: [String],
  favorite: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Note', noteSchema);