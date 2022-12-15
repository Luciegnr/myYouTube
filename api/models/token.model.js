const mongoose = require("mongoose");

const Token = mongoose.Schema({
  code: {
    type: String,
    required: true,
  },

  user_id: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: '2h', // this is the expiry time in seconds
  },
});

module.exports = mongoose.model("Token", Token);
