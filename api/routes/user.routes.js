const express = require("express");
const router = express.Router();
const controller = require("../controllers/UserController");
const auth = require("../middlewares/auth");
const duplicate = require("../middlewares/duplicate");
const { body } = require("express-validator");

router.post(
  "/user",
  [
    duplicate.checkDuplicatePseudo,
    duplicate.checkDuplicateEmail,
    duplicate.checkDuplicateUsername,
  ],
  controller.signup
);
router.get("/test", (req, res) => {
  res.json({ message: "My Youtube API" });
});
router.post("/login", controller.auth);
router.post("/welcome", auth.Authenticate, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});

router.get("/users", controller.findAll);
router.get("/user/:id", auth.isValid, controller.findOne);

router.delete("/user/:id", auth.AuthenticateWithId, controller.delete);
router.put(
  "/user/:id",
  [
    auth.AuthenticateWithId,
    duplicate.checkDuplicateUsername,
    duplicate.checkDuplicateEmail,
    duplicate.checkDuplicatePseudo,
  ],
  [
    body("username")
      .isString()
      .optional()
      .matches(/^[a-zA-Z0-9_-]+$/, "g")
      .withMessage("username not valid"),
    body("email").isEmail().optional().withMessage("email not valid"),
  ],
  controller.update
);

// ajouter pour auth module dans nuxt
router.get("/user", auth.Authenticate, controller.me);

module.exports = router;
