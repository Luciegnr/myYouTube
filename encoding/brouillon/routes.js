const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");
const encodingController = require("../controllers/encoding.controller.js");
const fs = require("fs/promises");

// Video Upload
const videoStorage = multer.diskStorage({
    destination: async (req, file, callback) => {
        const publicDirectory = "public/videos";
        const videoDirectory = publicDirectory + "/" + req.body.name;

        for (const dir of [
            "public",
            publicDirectory,
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

router.post("/encoding", async (req, res, next) => {
    try {
        var id = await req.body.id;
        var token = await req.body.token;
        var path = await req.body.folder + "/" + req.body.pathFile;
        const pathVideo = path
        await encodingController.encodingVideo(pathVideo, id, token).then((data) => {
            res.status(200).json({
                message: "Video Encoded",
                path: pathVideo,
                format: data
            });
        }).catch((err) => {
            res.status(500).json({
                message: "Error",
                error: err

            });
        });

    } catch (error) {
        next(error);
    }
});




module.exports = router;