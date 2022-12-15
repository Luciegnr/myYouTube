const mongoose = require("mongoose");

const Video = mongoose.Schema({
  name: { type: String, required: true },
  
  source: { type: String, required: true },
  created_at: { type: Date, required: true },
  views: { type: Number, required: true, default: 0 },
  enabled: { type: Boolean, required: true, default: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  duration: { type: Number },
  // REVIEW : modify format field
  formats: {},
});

module.exports = mongoose.model("Video", Video);
