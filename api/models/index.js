const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.token = require("./token.model");
db.video = require("./video.model");
db.comment = require("./comment.model");
module.exports = db;
