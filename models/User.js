const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
  },
  deviceName: {
    type: String,
  },
});

module.exports = mongoose.model("User", UserSchema);
