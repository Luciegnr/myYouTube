const db = require("../models");
const User = db.user;
const Token = db.token;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt_decode = require("jwt-decode");
const Confirm = require("../adapters/video.encodingCall");

exports.signup = (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  if (!username || !email || !password) {
    res.status(400).send({
      message: "Bad Request",
      code: 400,
      data: [
        `missing fields :` +
        (username ? "" : " username") +
        (email ? "" : " email") +
        (password ? "" : " password"),
      ],
    });
    return;
  }
  const user = new User({
    username: username,
    pseudo: req.body.pseudo,
    email: email.toLowerCase(),
    password: bcrypt.hashSync(password, 8),
  });

  user.save((err, user) => {
    if (err) {
      res.status(400).send({ message: "Bad Request", code: 400, data: [err] });
      return;
    }

    user.save(async (err) => {
      if (err) {
        res
          .status(400)
          .send({ message: "Bad Request", code: 400, data: [err] });
        return;
      }
      await Confirm.ConfirmAccount(user.email, user.pseudo).then((res) => {
        console.log(res)
      }
      ).catch((err) => {
        console.log(err)
      }
      )
      res.status(201).send({
        message: "OK",
        data: {
          id: user.id,
          username: user.username,
          pseudo: user.pseudo,
          created_at: user.createdAt,
          email: user.email,
        },
      });
    });
  });
};

exports.auth = (req, res) => {
  const login = req.body.login;
  const password = req.body.password;
  if (!login || !password) {
    res.status(400).send({
      message: "Bad Request",
      code: 400,
      data: [
        `missing fields :` +
        (login ? "" : " login") +
        (password ? "" : " password"),
      ],
    });
    return;
  }
  User.findOne({
    pseudo: login,
  }).exec((err, user) => {
    if (err) {
      res.status(400).send({ message: "Bad Request", code: 400, data: [err] });
      return;
    }

    if (!user) {
      return res.status(400).send({
        message: "Bad Request",
        code: 400,
        data: "login incorrect",
      });
    }

    var passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res.status(400).send({
        message: "Bad Request",
        code: 400,
        data: "wrong password !",
      });
    }
    let data = {
      login: req.body.login,
      password: req.body.password,
      _id: user._id,
      email: user.email,
    };
    // FIXME : mettre un token plus court
    var token = jwt.sign(data, process.env.TOKEN_KEY, { expiresIn: "1500min" });
    res.status(200).send({
      message: "OK",
      data: {
        token: token,
        user: {
          id: user.id,
          username: user.username,
          pseudo: user.pseudo,
          created_at: user.createdAt,
          email: user.email,
        },
      },
    });
  });
};

exports.findOne = async (req, res) => {
  // Pour cette requete le token n'est pas obligatoire
  let token;
  let tokenChecked;
  if (req.get("Authorization")) {
    token = req.get("Authorization").replace("Bearer ", "");
  }

  const id = req.params.id;

  // Si on passe un token on verifie qu'il est relié au user id de notre req.paramas.id
  if (token) {
    const decoded = jwt_decode(token);
    if (decoded._id == id) {
      tokenChecked = true;
    }
  }
  // Si c'est le même user on retourne les infos du user avec son email puisque le user est le propriétaire
  if (tokenChecked) {
    User.findById(id)
      .then((data) => {
        if (!data) res.status(404).send({ message: "Not found" });
        else
          res.status(200).send({
            message: "OK",
            data: {
              id: data._id,
              username: data.username,
              pseudo: data.pseudo,
              created_at: data.createdAt,
              email: data.email,
            },
          });
      })
      .catch((err) => {
        res
          .status(400)
          .send({ message: "Bad Request", code: 400, data: [err] });
      });
  } else {
    // Sinon on retourne les données qui ne sont pas réservées qu'au propriétaire
    User.findById(id)
      .then((data) => {
        if (!data) res.status(404).send({ message: "Not found" });
        else
          res.status(200).send({
            message: "OK",
            data: {
              id: data._id,
              username: req.body.username || data.username,
              pseudo: req.body.pseudo || data.pseudo,
              created_at: data.createdAt,
            },
          });
      })
      .catch((err) => {
        res
          .status(400)
          .send({ message: "Bad Request", code: 400, data: [err] });
      });
  }
};

exports.findAll = async (req, res) => {
  const page = parseInt(req.body.page || 1);
  const limit = parseInt(req.body.perPage || 5);
  const skipIndex = (page - 1) * limit;
  const nbUsers = await User.countDocuments();
  const total_pages = Math.ceil(nbUsers / limit);

  const filter = req.body;
  let where = {};
  if (filter.pseudo) {
    where.pseudo = { $regex: filter.pseudo };
  }
  // Si le paramètre page est égale à 0 ou qu'il est supérieur au nombre de page existantes, vous devez retourner un code HTTP 400
  if (page === 0 || page > total_pages || nbUsers === 0) {
    res.status(404).send({ message: "Not found" });
  } else
    try {
      const allUser = [];
      const results = await User.find(where)
        // sortir par id décroissant
        .sort({ _id: -1 })
        .limit(limit)
        .skip(skipIndex)
        .exec();
      for (const user of results) {
        let userData = {
          id: user._id,
          username: user.username,
          pseudo: user.pseudo,
          created_at: user.createdAt,
          email: user.email,
        };
        allUser.push(userData);
      }
      res.status(200).send({
        message: "OK",
        data: allUser,
        pager: {
          current: page,
          total: total_pages,
        },
      });
    } catch (err) {
      res.status(400).json({ message: "Bad Request", code: 400, data: [err] });
    }
};

//delete user
exports.delete = async (req, res) => {
  const id = req.params.id;

  const user = await User.findById(id);

  if (user) {
    try {
      await User.findByIdAndDelete(id);
      // supprimer le fichier du filesystem
      const videos = await Video.find({ user: id });
      const arr = [];
      for (let i = 0; i < videos.length; i++) {
        arr.push(videos[i]._id);
      }
      await Comment.deleteMany({ video_id: arr });
      await Comment.deleteMany({ user: id });
      await Video.deleteMany({ user: id });

      return res.status(204).send();
    } catch (e) {
      res.status(400).json({ message: "Bad Request", code: 400, data: [e] });
    }
  } else {
    return res.status(404).send({ message: "Not found" });
  }
};

// Update user id
exports.update = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res
      .status(400)
      .json({ message: "Bad request", code: 400, data: errors.array() });
  } else {
    if (!req.body) {
      return res.status(400).send({
        message: "Bad request",
        code: 400,
        data: "Data to update can not be empty!",
      });
    }
    const id = req.params.id;
    const password = req.body.password;
    var user = {};

    if (password) {
      user = {
        username: req.body.username,
        pseudo: req.body.pseudo,
        email: req.body.email,
        password: bcrypt.hashSync(password, 8),
      };
    } else {
      user = {
        username: req.body.username,
        pseudo: req.body.pseudo,
        email: req.body.email,
      };
    }
    User.findByIdAndUpdate(id, user, { useFindAndModify: false })
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `Not found`,
          });
        } else
          res.status(200).send({
            message: "OK",
            data: {
              id: data._id,
              username: req.body.username || data.username,
              pseudo: req.body.pseudo || data.pseudo,
              created_at: data.createdAt,
              email: req.body.email || data.email,
            },
          });
      })
      .catch((err) => {
        res.status(400).send({
          message: "Bad Request",
          code: 400,
          data: [err],
        });
      });
  }
};

exports.me = async (req, res) => {
  const token = req.get("Authorization");
  var decoded = jwt_decode(token);
  await User.findById({ _id: decoded._id })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: "data not found",
        });
      } else
        res.status(200).send({
          message: "OK",
          data: {
            id: data._id,
            username: data.username,
            pseudo: data.pseudo,
            created_at: data.createdAt,
            email: data.email,
          },
        });
    })
    .catch((err) => {
      res.status(400).send({
        message: "Bad Request",
        code: 400,
        data: [err],
      });
    });
};
