const db = require("../models");
const User = db.user;

checkDuplicateEmail = (req, res, next) => {
  // Email
  User.findOne({
    email: req.body.email,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user) {
      res.status(400).send({
        message: "Bad Request",
        code: 400,
        data: { message: "Email already in use" },
      });

      return;
    }

    next();
  });
};

checkDuplicateUsername = (req, res, next) => {
  // Email
  User.findOne({
    username: req.body.username,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user) {
      res.status(400).send({
        message: "Bad Request",
        code: 400,
        data: { message: "Username already in use" },
      });
      return;
    }

    next();
  });
};

checkDuplicatePseudo = (req, res, next) => {
  // Email
  User.findOne({
    pseudo: req.body.pseudo,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user) {
      res.status(400).send({
        message: "Bad Request",
        code: 400,
        data: { message: "Pseudo already in use" },
      });
      return;
    }

    next();
  });
};
const duplicate = {
  checkDuplicatePseudo,
  checkDuplicateEmail,
  checkDuplicateUsername,
};

module.exports = duplicate;
