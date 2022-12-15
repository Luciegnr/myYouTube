const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const ffprobe = require('@ffprobe-installer/ffprobe');
ffmpeg.setFfprobePath(ffprobe.path);
ffmpeg.setFfmpegPath(ffmpegPath)
const videoUpdate = require("../adaptater/api.controller");



const fs = require("fs/promises");

class EncodingController {

    // check video size
    videoSize = async (pathVideo) => {
        return new Promise((resolve, reject) => {
            ffmpeg.ffprobe(pathVideo, function (err, metadata) {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    const video = metadata.streams[0].height
                    console.log(video)
                    resolve(video);
                }
            });
        })
    }

    // copy of the lower dimensions of the video
    videoLowerDimensions = async (videoDimension, pathVideo, id, token, email, name) => {
        try {
            let format = [];
            let path = [];

            switch (true) {

                // case 240:
                //     format.push({ p: "426x240" })
                //     break;
                case videoDimension <= 360:
                    format.push({ p: "426x240" })
                    break;
                case videoDimension <= 480:
                    format.push({ p: "426x240" }, { p: "640x360" })
                    break;
                case videoDimension <= 720:
                    format.push({ p: "426x240" }, { p: "640x360" }, { p: "854x480" })
                    break;
                case videoDimension <= 1080:
                    format.push({ p: "426x240" }, { p: "640x360" }, { p: "854x480" }, { p: "1280x720" })
                    break;
                case videoDimension <= 1440:
                    format.push({ p: "426x240" }, { p: "640x360" }, { p: "854x480" }, { p: "1280x720" }, { p: "1920x1080" })
                    break;
                case videoDimension <= 2160:
                    format.push({ p: "426x240" }, { p: "640x360" }, { p: "854x480" }, { p: "1280x720" }, { p: "1920x1080" }, { p: "2560x1440" })
                    break;
                default:
                    break;
            }

            console.log(videoDimension, format)

            return new Promise(async (resolve, reject) => {
                if (format.length <= 0) {
                    path.push({ [videoDimension]: pathVideo })
                    await videoUpdate.updateVideo(path, id, token).then((res) => {
                        resolve(res)
                    }
                    ).catch((err) => {
                        console.log(err)
                    }
                    )
                }
                else {
                    path.push({ [videoDimension]: pathVideo.substring(pathVideo.lastIndexOf("public"), pathVideo.length) })

                    let i = 0
                    for (const item of format) {
                        const sizee = item.p;
                        await ffmpeg(pathVideo)
                            .output(pathVideo + `-${sizee}.mp4`)
                            .videoCodec("libx264")
                            .size(sizee)
                            .on("error", function (err) {
                                console.log("An error occurred: " + err.message);
                            })
                            .on('error', function (err) {
                                console.log('An error occurred: ' + err.message);
                                reject(err);
                            })
                            .on('end', async function () {
                                let encode_path = pathVideo + `-${sizee}.mp4`
                                console.log(encode_path)
                                let index = sizee.split("x").pop()
                                path.push({ [index]: encode_path.substring(encode_path.lastIndexOf("public"), encode_path.length) })
                                console.log(path)
                                i++
                                if (i === format.length) {
                                    console.log(path)
                                    await videoUpdate.updateVideo(path, id, token).then(async (res) => {
                                        resolve(res)
                                        await videoUpdate.emailUpdate(name, email).then((res) => {
                                            console.log(res)
                                        }
                                        ).catch((err) => {
                                            console.log(err)
                                        }
                                        )
                                    }
                                    ).catch((err) => {
                                        console.log(err)
                                    }
                                    )
                                    resolve(path);
                                }
                            })
                            .run();
                    }
                }

            })
        } catch (err) {
            throw err;
        }
    }

    // encoding video
    encodingVideo = async (pathVideo, id, token, email, name ) => {
        try {
            const videoDimension = await this.videoSize(pathVideo);
            return new Promise(async (resolve, reject) => {
                await this.videoLowerDimensions(videoDimension, pathVideo, id, token, email, name).then(res => {
                    resolve(res);
                }).catch(err => {
                    throw err;
                })

            })
        } catch (err) {
            throw err;
        }
    }
}

const encodingController = new EncodingController();

module.exports = encodingController;
