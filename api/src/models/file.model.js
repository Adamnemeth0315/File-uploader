const mongoose = require('mongoose');

const FileSchema = mongoose.Schema({
  originalname: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
  },
  destination: String,
  path: String,
  size: Number,
  folder: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  mimetype: {
    type: String,
    required: true,
  }
}, {
    timeStamps: true
  });

module.exports = mongoose.model('File', FileSchema);