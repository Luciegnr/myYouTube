const express = require("express");
const router = express.Router();
const controller = require("./controller/searchcontroller");

router.get('/testy', controller.searchVideo);

module.exports = router;
