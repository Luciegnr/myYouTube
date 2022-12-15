const db = require("../models");
const Video = db.video;
const User = db.user;
const Comment = db.comment;
const fs = require("fs/promises");
const mongoose = require("mongoose");
const videoEncoding = require("../adapters/video.encodingCall");
const { readdirSync, rename } = require('fs');
const axios = require("axios");
const elastic = require("elasticsearch");
const elasticClient = elastic.Client({
  host: "elasticsearch:9200",

});
exports.postVideo = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);

    // TODO Voir pour modifier la video une fois l'encodage fini et pas avant

    const video = new Video({
      name: req.body.name,
      source: req.file.path,
      user: user._id,
      created_at: new Date(),
    });
    await video.save();

    const encoding = videoEncoding.encodingVideo(req.file.path, video._id, req.token, user.email, video.name);
    if (!encoding) {
      res.status(400).json({ message: "Bad Request", code: 400, data: "Encoding not working !" });
    }
    let data = {
      id: video._id,
      source: video.source,
      created_at: video.created_at,
      views: video.views,
      enabled: video.enabled,
      name: video.name,

      user: {
        id: user._id,
        username: user.username,
        pseudo: user.pseudo,
        created_at: user.createdAt,
        email: user.email,
      },
    }
    elasticClient
      .index({
        index: "videos",
        type: "video",
        id: `${video._id}`,
        body: {
          data
        },
      })
      .then((response) => {
        console.log(response);
        console.log({ message: "Indexing successful" });
      })
      .catch((err) => {
        console.log({ message: "Error" });
      });
    return res.status(201).json({
      message: "OK",
      data: data,
    });
  } catch (e) {
    res.status(400).json({ message: "Bad Request", code: 400, data: [e] });
  }
};

exports.findAll = async (req, res) => {
  const page = parseInt(req.body.page || 1);
  const limit = parseInt(req.body.perPage || 5);
  const skipIndex = (page - 1) * limit;
  const nbVideo = await Video.countDocuments();
  const total_pages = Math.ceil(nbVideo / limit);

  const filter = req.body;
  let where = {};
  if (filter.name) {
    where.name = { $regex: filter.name };
  }
  if (filter.duration) {
    var min = 10 * Math.floor(filter.duration / 10);
    var max = min + 10;
    where.duration = { $gte: min, $lte: max };
  }
  if (filter.user) {
    const user = await User.find({
      pseudo: { $regex: filter.user, $options: "i" },
    });
    const arr = [];
    for (let i = 0; i < user.length; i++) {
      arr.push(user[i]._id);
    }
    where.user = arr;
  }
  // Si le paramètre page est égale à 0 ou qu'il est supérieur au nombre de page existantes, vous devez retourner un code HTTP 400
  if (page === 0 || page > total_pages || nbVideo === 0) {
    res.status(404).send({ message: "Page not found" });
  } else
    try {
      const results = await Video.find(where)
        .select({
          id: "$_id",
          name: "$name",
          source: "$source",
          created_at: "$created_at",
          views: "$views",
          enabled: "$enabled",
          formats: "$formats",
        })
        .sort({ _id: -1 }) // sortir par id décroissant
        .limit(limit)
        .skip(skipIndex)
        .populate({
          path: "user",
          select: {
            createdAt: "$createdAt",
            pseudo: "$pseudo",
            username: "$username",
            id: "$_id",
          },
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


exports.findVideoByID = async (req, res) => {
  const page = req.body.page;
  const perPage = req.body.perPage || 5;
  const userId = req.params.id;
  const filter = {
    user: new mongoose.Types.ObjectId(userId),
  };
  const nbVideo = await Video.countDocuments(filter);
  const nbPages = Math.ceil(nbVideo / perPage);
  if (page > nbPages || page === 0) {
    res.status(400).send({
      message: "Bad Request",
      code: 400,
      data: [],
    });
  } else {
    try {
      const videos = await Video.find(filter)
        .limit(perPage)
        .skip(perPage * ((page || 1) - 1));

      const user = await User.findById(userId);

      const response = {
        message: "OK",
        data: videos.map((video) => {
          return {
            id: video._id,
            source: video.source,
            created_at: video.created_at,
            views: video.views,
            enabled: video.enabled,
            user: {
              id: user._id,
              username: user.username,
              pseudo: user.pseudo,
              created_at: user.createdAt,
              email: user.email,
            },
            formats: {
              1080: video.formats["1080"],
              720: video.formats["720"],
              480: video.formats["480"],
              360: video.formats["360"],
              240: video.formats["240"],
              144: video.formats["144"],
            },
          };
        }),
        pager: {
          current: page,
          total: nbPages,
        },
      };

      res.status(200).send(response);
    } catch (e) {
      res.status(400).json({ message: "Bad Request", code: 400, data: [e] });
    }
  }
};

exports.findOne = async (req, res) => {
  const id = req.params.id;
  const video = await Video.findOne({
    _id: id,
  }).populate({
    path: "user"
  })
  if (!video) {
    return res.status(404).send({
      message: "Video not found",
    });
  }
  res.status(200).send({
    message: "OK",
    data: {
      video
    },
  });
}

exports.deleteVideo = async (req, res) => {
  try {
    const id = req.params.id;
    // supprimer le fichier de la BDD
    const video = await Video.findByIdAndDelete(id);
    // supprimer le fichier du filesystem
    await fs.unlink(video.source, () => {
      return res
        .status(400)
        .json({ message: "Bad request", code: 400, data: ["Bad request"] });
    });
    await Comment.deleteMany({ video_id: id });

    return res.status(204).send();
  } catch (e) {
    res.status(400).json({ message: "Bad Request", code: 400, data: [e] });
  }
};

// REVIEW : Not use
exports.encodeVideoById = async (req, res) => {
  const { id } = req.params;
  const { format, file } = req.body;

  if (!["1080", "720", "480", "360", "240", "144"].includes(format)) {
    return res.status(400).send({
      message: "Bad request",
      code: 404,
      data: ["Format not authorized"],
    });
  }
  try {
    const video = await Video.findById(id);
    const user = await User.findById(video.user);
    let path = video.source.split("/");
    const dateNow = Date.now();
    const videoName = dateNow + "_" + path.pop().split("_").slice(-1).join("");

    path = [...path, format].join("/");

    await fs
      .access(path)
      .then()
      .catch(async () => await fs.mkdir(path));

    path = [path, videoName].join("/");

    fs.copyFile(file, path, 0);

    video.formats[format] = path;
    await video.save();

    res.send({
      message: "OK",
      data: {
        id: video._id,
        source: video.source,
        created_at: video.created_at,
        views: video.views,
        enabled: video.enabled,
        user: {
          id: user._id,
          username: user.username,
          pseudo: user.pseudo,
          created_at: user.createdAt,
          email: user.email,
        },
        formats: {
          1080: video.formats["1080"],
          720: video.formats["720"],
          480: video.formats["480"],
          360: video.formats["360"],
          240: video.formats["240"],
          144: video.formats["144"],
        },
      },
    });
  } catch (e) {
    res.status(400).json({ message: "Bad Request", code: 400, data: [e] });
  }
};

exports.updateVideo = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Bad request"
    })
  }
  let source
  let format
  const _id = req.params.id;
  const { name } = req.body
  let Arrayformats = []


  const video = await Video.findOne({ _id: _id })
  if (!video) {
    return res.status(404).send({
      message: "Video not found",
    });
  }
  let str = video.source
  let currentPath = str.substring(0, str.lastIndexOf("/"));

  let basePath = currentPath.substring(0, currentPath.lastIndexOf("/") + 1) + name;

  if (name) {
    await fs.rename(currentPath, basePath, function (err) {
      if (err) throw err
      console.log('Rename complete!')
    }
    )

    const files = readdirSync(basePath);

    files.forEach(file => rename(
      basePath + `/${file}`,
      basePath + `/${file.replace(video.name, req.body.name)}`,
      err => {
        if (err) throw err;
      }

    ));
    source = basePath + "/" + (video.source.split("/").pop()).replace(video.name, req.body.name);



    video.formats.forEach((obj) => {
      Object.keys(obj).forEach((key) => {
        let newPath = basePath + "/" + (obj[key].split("/").pop()).replace(video.name, req.body.name);

        Arrayformats.push({ [key]: newPath })
        format = Arrayformats
      });
    });


  }

  const videoUpdate = {
    name: req.body.name,
    formats: req.body.formats || format,
    source: source
  };

  const ckeck = await Video.findByIdAndUpdate(_id, videoUpdate, { new: true })
  if (!ckeck) {
    return res.status(404).send({
      message: "Video not found",
    });
  }

  elasticClient.update({
    index: "videos",
    type: "video",
    id: _id,
    body: {
      doc: {
        data: {
          "source": ckeck.source,
          "created_at": ckeck.created_at,
          "views": ckeck.views,
          "enabled": ckeck.enabled,
          "name": ckeck.name,
          "formats": ckeck.formats
        }
      }
    },
  })
  res.status(200).send({
    message: "OK",
    data: {
      id: ckeck._id,
      name: ckeck.name,
      source: ckeck.source,
      created_at: ckeck.created_at,
      views: ckeck.views,
      enabled: ckeck.enabled,
      formats: ckeck.formats
    },
  });

}

exports.searchVideo = async (req, res) => {
  const date = req.query.date;
  const name = req.query.name;



  await axios({
    method: 'get',
    url: `http://search:3000/testy?video=${name ? name : ''}&date=${date ? date : ''}`,
    // data: {
    //   source: req.file.path,
    //   folder: global.__basedir
    // }

  })
    .then(function (response) {
      res.send(response.data);
      console.log("finnnnnnnn")
    })
    .catch(function (error) {
      res.send(error);
      console.log(error);
    });
}
