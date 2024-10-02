const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  country: { type: String, required: true },
  level: { type: Number, default: 1 },
  experience: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
