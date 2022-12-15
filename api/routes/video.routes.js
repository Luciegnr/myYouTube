const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

const multer = require("multer");
const path = require("path");
const controller = require("../controllers/VideoController");
const fs = require("fs/promises");

// Video Upload
const videoStorage = multer.diskStorage({
  destination: async (req, file, callback) => {
    const publicDirectory = "public/videos/";
    const userDirectory = publicDirectory + req.user_id;
    const videoDirectory = userDirectory + "/" + req.body.name;

    for (const dir of [
      "public",
      publicDirectory,
      userDirectory,
      videoDirectory,
    ]) {
      await fs
        .access(dir)
        .then()
        .catch(async () => {
          await fs.mkdir(dir);
        });
    }

    return callback(null, videoDirectory);
  },
  filename: (req, file, callback) => {
    const name =
      Date.now() +
      "_" +
      req.body.name +
      "." +
      file.originalname.split(".").pop();
    callback(null, name);
  },
});

const videoUpload = {
  storage: videoStorage,
  limits: {
    fileSize: 1000000000000000, // 10000000 Bytes = 10 MB
  },
  fileFilter: (req, file, callback) => {
    const typesAllowed = [".mp4", ".mkv", ".avi", ".MPEG-4"];
    const ext = path.extname(file.originalname);
    if (!typesAllowed.includes(ext)) {
      return callback("Please upload a correct extension Video");
    }

    callback(null, true);
  },
};

const getFile = async (req, res) => {
  var path = req.query.path
  if (path)
    res.sendFile(path, { root: global.__basedir });
}

router.post(
  "/user/:id/video",
  auth.AuthenticateWithId,
  multer(videoUpload).single("source"),
  controller.postVideo
);
router.get("/videos/search", controller.searchVideo) // get all infos about a video
router.get("/video/:id", controller.findOne) // get all infos about a video
router.get("/videos", controller.findAll);
router.get("/user/:id/videos", controller.findVideoByID);
router.delete("/video/:id", auth.isValidVideo, controller.deleteVideo);
router.patch("/video/:id", controller.encodeVideoById);
router.get('/video', getFile) // read video file
router.put("/video/:id", auth.isValidVideo, controller.updateVideo);

module.exports = router;
