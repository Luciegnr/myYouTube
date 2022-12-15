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

app.get("/test", (req, res) => {
  res.json({ message: "Mailer with postfix" });
});


app.use("/", require("./routes/encoding.routes.js"));

// si l'endpoint n'existe pas
// app.use("*", (req, res) => {
//   res.status(404).json({
//     message: "j'en ai marre",
//   });
// });

module.exports = app;
