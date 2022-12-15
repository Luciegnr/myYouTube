const express = require("express");
const router = express.Router();

router.use("/", require("./mail"));

module.exports = router;
