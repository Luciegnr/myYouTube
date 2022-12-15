const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
global.__basedir = __dirname;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/public', express.static('public'));
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const clientOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose.connect(process.env.URL_MONGO, clientOptions);
// mongoose.connect("mongodb://127.0.0.1:27017/api", clientOptions);

const port = 3000;
const host = "0.0.0.0";
app.listen(port, host, () => console.log("Serveur started"));

app.use("/", require("./routes/user.routes.js"));
app.use("/", require("./routes/video.routes.js"));
app.use("/", require("./routes/comment.routes.js"));
app.get("welcome", function (req, res) {
  res.status(200).json({
    message: "Welcome",
  });
});
app.get("*", function (req, res) {
  res.status(404).json({
    message: "Not found",
  });
});


module.exports = app;
