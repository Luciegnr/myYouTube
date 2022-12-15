const db = require("../models");
const Video = db.video;
const User = db.user;
const Token = db.token;
const Comment = db.comment;
const fs = require("fs/promises");

exports.create = async (req, res) => {
  const videoId = req.params.id;

  const user = await User.findById(req.user_id);

  Video.findById(videoId).exec((err, video) => {
    if (err) {
      res.status(400).send({ message: "Bad Request", code: 400, data: [err] });
      return;
    }

    if (!video) {
      return res.status(404).send({ message: "Not found" });
    }

    const comment = new Comment({
      body: req.body.body,
      user: req.user_id,
      video_id: video,
    });

    comment.save((err, comment) => {
      if (err) {
        res
          .status(400)
          .send({ message: "Bad Request", code: 400, data: [err] });
        return;
      }
      comment.save((err) => {
        if (err) {
          res
            .status(400)
            .send({ message: "Bad Request", code: 400, data: [err] });
          return;
        }

        res.status(201).send({
          message: "OK",
          data: {
            id: comment.id,
            body: comment.body,
            user: {
              id: user._id,
              username: user.username,
              pseudo: user.pseudo,
              created_at: user.createdAt,
              email: user.email,
            },
          },
        });
      });
    });
  });
};

exports.findID = async (req, res) => {
  const page = parseInt(req.body.page || 1);
  const limit = parseInt(req.body.perPage || 5);
  const skipIndex = (page - 1) * limit;
  const nbComment = await Comment.find({
    video_id: req.params.id,
  }).countDocuments();
  const total_pages = Math.ceil(nbComment / limit);

  // Si le paramètre page est égale à 0 ou qu'il est supérieur au nombre de page existantes, vous devez retourner un code HTTP 400
  if (page === 0 || page > total_pages || nbComment === 0) {
    res.status(404).send({ message: "Not found" });
  } else
    try {
      const results = await Comment.find({ video_id: req.params.id })
        .select({ id: "$_id", _id: 0, body: "$body", user: "$user" })
        // sortir par id décroissant
        .sort({ _id: -1 })
        .limit(limit)
        .skip(skipIndex)
        .populate("user", {
          created_at: "$createdAt",
          pseudo: "$pseudo",
          username: "$username",
          id: "$_id",
          _id: 0,
        })
        .exec();
      res.status(200).send({
        message: "OK",
        data: results,

        pager: {
          current: page,
          total: total_pages,
        },
      });
    } catch (e) {
      res.status(400).json({ message: "Bad Request", code: 400, data: [e] });
    }
};
