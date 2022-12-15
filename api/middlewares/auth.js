const db = require("../models");
const Token = db.token;
const jwt = require("jsonwebtoken");
const { isValidObjectId } = require("mongoose");
const Video = db.video;

Authenticate = async (req, res, next) => {
  var authHeader = req.get("Authorization");
  authHeader = authHeader.replace("Bearer ", "");
  if (authHeader == null) {
    res.send({ status: 401, message: "authorization missing" });
  }
  console.log(jwt.verify(authHeader, process.env.TOKEN_KEY));
  jwt.verify(authHeader, process.env.TOKEN_KEY, (err, user) => {
    if (err) {
      res.send({ status: 403, message: err.message });
    }
    return next();
  });
};

AuthenticateWithId = async (req, res, next) => {
  // Présence d'un token
  if (req.get("Authorization")) {
    const token = req.get("Authorization").replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Error. Need a token" });
    }
    req.token = token

    // Véracité du token
    jwt.verify(token, process.env.TOKEN_KEY, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: "Error bad token", err: err });
      } else {
        if (decodedToken._id !== req.params.id) {
          res.status(401).json({ message: "unauthorized" });
        } else {
          req.user_id = decodedToken._id;
          return next();
        }
      }
    });
  } else {
    return res.status(401).json({ message: "Error. Need a token" });
  }
};

isValid = (req, res, next) => {
  if (req.get("Authorization")) {
    let token = req.get("Authorization").replace("Bearer ", "");
    jwt.verify(token, process.env.TOKEN_KEY, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: "Error bad token", err: err });
      } else {
        req.user_id = decodedToken._id;
        return next();
      }
    });
  } else {
    return res.status(401).json({ message: "Error. Need a token" });
  }
};

isValidVideo = async (req, res, next) => {
  console.log("====================================================", req.get("Authorization"));
  let id = req.params.id;
  let video;
  if (isValidObjectId(id) === true) {
    video = await Video.findById(id);
  }

  if (video) {
    if (req.get("Authorization")) {
      let token = req.get("Authorization").replace("Bearer ", "");
      jwt
        .verify(token, process.env.TOKEN_KEY, async (err, decodedToken) => {
          if (err) {
            res.status(401).json({ message: "Error token invalid", err: err });
          } else {
            const video = await Video.findOne({ _id: req.params.id });

            if (video.user != decodedToken._id) {
              res.status(401).json({ message: "unauthorized" });
            } else {
              req.user_id = decodedToken._id;
              return next();
            }
          }
        })
        .catch((err) => {
          res.status(500).json({ message: "Error bad token", err: err });
        });
    } else {
      return res.status(401).json({ message: "Error. Need a token" });
    }
  } else {
    return res.status(404).json({ message: "Video not found" });
  }
};

const auth = {
  isValidVideo,
  isValid,
  Authenticate,
  AuthenticateWithId,
};

module.exports = auth;
