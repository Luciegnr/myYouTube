const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

require("dotenv").config();
const port = 3000;
const host = "0.0.0.0";
app.use(bodyParser.json());

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.listen(port, host, () => console.log("Serveur started"));

app.get("/", (req, res) => {
  res.json({ message: "Mailer with postfix" });
});


const indexRouter = require("./route/index");
app.use(indexRouter);

require("./route");
module.exports = app;
