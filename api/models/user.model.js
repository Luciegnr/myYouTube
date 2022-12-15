const mongoose = require("mongoose");

const User = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      match: /^[a-zA-Z0-9_-]+$/,
    },

    pseudo: {
      type: String,
    },

    email: {
      type: String,
      required: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },

    password: {
      type: String,
      required: true,
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("User", User);
