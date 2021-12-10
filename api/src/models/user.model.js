const mongoose = require('mongoose');
const bcrypt = require('mongoose-bcrypt');

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
    timeStamps: true
  });

UserSchema.plugin(bcrypt);

module.exports = mongoose.model('User', UserSchema);
