const axios = require('axios');

class VideoUpdateCall {

    // encoding video
    updateVideo = async (format, videoId, token) => {
        try {
            await axios({
                method: 'put',
                url: "http://api-node-1:3000/video/" + videoId,
                data: {
                    formats: format,
                },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then((res) => {
                // console.log(res)
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
    };
    emailUpdate = async (video, email) => {
        try {
            await axios({
                method: 'post',
                url: "http://mailer:3000/mailer/encoder",
                data: {
                    video: video,
                    email: email
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

const videoUpdateCall = new VideoUpdateCall();

module.exports = videoUpdateCall;
