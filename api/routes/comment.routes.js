const express = require("express");
const router = express.Router();
const controller = require("../controllers/CommentController");
const auth = require("../middlewares/auth");
const { body } = require("express-validator");

router.post("/video/:id/comment", auth.isValid, controller.create);
router.get("/video/:id/comments", auth.isValid, controller.findID);


module.exports = router;
