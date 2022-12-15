const mongoose = require("mongoose");

const Comment = mongoose.Schema({
  body: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  video_id: { type: mongoose.Schema.Types.ObjectId, ref: "Video" },
});

module.exports = mongoose.model("Comment", Comment);