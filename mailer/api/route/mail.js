const controller = require("../controller/mail.controller");
const express = require("express");
const router = express.Router();

router.post("/mailer/signin", controller.signin);
router.post("/mailer/encoder", controller.encoder);

module.exports = router;
