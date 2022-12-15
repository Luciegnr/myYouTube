const express = require("express");
const router = express.Router();
const encodingController = require("../controllers/encoding.controller.js");

router.post("/encoding", async (req, res, next) => {
    try {
        let id = await req.body.id;
        let token = await req.body.token;
        let path = await req.body.folder + "/" + req.body.pathFile;
        let email = await req.body.email;
        let name = await req.body.name;
        const pathVideo = path
        await encodingController.encodingVideo(pathVideo, id, token, email, name).then((data) => {
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

router.get("/welcome", (req, res) => {
    res.status(200).send("Welcome 🙌 ");
});
module.exports = router;
