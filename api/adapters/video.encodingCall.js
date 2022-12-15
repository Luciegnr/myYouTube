const axios = require('axios');

class VideoEncodingCall {

    // encoding video
    encodingVideo = async (pathFile, videoId, token, email, name) => {
        try {
            const newPathFile = `${pathFile}`;
            await axios({
                method: 'post',
                url: "http://encoding:3000/encoding",
                data: {
                    pathFile: newPathFile,
                    folder: global.__basedir,
                    id: videoId,
                    token: token,
                    email: email,
                    name: name
                }
            });
            return true;
        } catch (err) {
            console.log(err);
        }
    };
    ConfirmAccount = async (email, pseudo) => {
        try {
            await axios({
                method: 'post',
                url: "http://mailer:3000/mailer/signin",
                data: {
                    email: email,
                    user: pseudo,
                },
            }).then((res) => {
                console.log(res)
            }).catch((err) => {
                console.log(err)
            })
            return true;
        } catch (error) {
            throw {
                status: error.response.status,
                message: error.response.data.message,
                code: error.response.data.code,
                detailedMessages: error.response.data.detailedMessages
            };
        }
    }

}

const videoEncodingCall = new VideoEncodingCall();

module.exports = videoEncodingCall;
