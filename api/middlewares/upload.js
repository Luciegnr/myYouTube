const util = require("util");
const multer = require("multer");
const fs = require("fs/promises");
const maxSize = 2 * 100024 * 100024;
// get random number
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
// let storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, __basedir + `/public/${getRandomInt(1, 10000)}`);
//   },
  
//   filename: (req, file, cb) => {
//     console.log(file.originalname);
//     cb(null, file.originalname);
//   },
// });

const videoStorage = multer.diskStorage({
  destination: async (req, file, callback) => {
    const publicDirectory = "public/videos/";
    const videoDirectory = publicDirectory + getRandomInt(1, 10000);
    // const videoDirectory = userDirectory + '/' + req.body.name

    for (const dir of [
      "public",
      publicDirectory,
      // userDirectory,
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
let uploadFile = multer({
  storage: videoStorage,
  limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
