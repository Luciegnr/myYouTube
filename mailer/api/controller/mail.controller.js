const nodemailer = require("../config/mailer.config");

exports.signin = async (req, res) => {
  var email = req.body.email;
  var user = req.body.user;

  nodemailer.signin(email, user);
  res.send({
    message: "Mail sent",
  });
};

exports.encoder = async (req, res) => {
  var email = req.body.email;
  var video = req.body.video
  nodemailer.encoder(email, video);
  res.send({
    message: "Mail encoder",
  });
};
