const express = require('express');
const axios = require('axios');
const fs = require('fs');
const bodyParser = require('body-parser');
const { post } = require("axios");
const zl = require("zip-lib")

require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Замените это на ваш домен
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
let IAM_TOKEN = {}
app.post('/test', (req, res) => {
    if (req.body !== undefined || req.body !== {}) {
        const FOLDER_ID = 'Ваш ID'
        let data = JSON.parse(Object.keys(req.body)[0])
        data.folderId = FOLDER_ID
        if (data.text === '') {
            return
        }
        function IAM_TOKEN_CHECK() {
            return axios.post('https://iam.api.cloud.yandex.net/iam/v1/tokens', {
                yandexPassportOauthToken: 'wdwdwdwdwdw'
            })
                .then(responseToken => {
                    const formattedDate = new Date(responseToken.data.expiresAt)
                    IAM_TOKEN.token = responseToken.data.iamToken
                    IAM_TOKEN.date = formattedDate
                    IAM_VOICE()
                })
        }
        function IAM_VOICE() {
            const params = new URLSearchParams();
            params.append('text', data.text);
            params.append('lang', data.lang);
            params.append('voice', data.voice);
            params.append('emotion', data.emotion);
            params.append('speed', data.speed)
            params.append('folderId', data.folderId)
            console.log(params)
            axios({
                method: 'POST',
                url: 'https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize',
                responseType: 'stream',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + IAM_TOKEN.token,
                },
                data: params
            }).then(r => {
                r.data.pipe(fs.createWriteStream('./newFile.mp3'))

            }).then(() => {
                const zip = setTimeout(() => {
                    zl.archiveFile('C:\\v\\newFile.mp3', 'voice.zip').then(() => {
                        console.log('done')
                    })
                    clearTimeout(zip)
                }, 1000)
            })
        }

        if (IAM_TOKEN.date && IAM_TOKEN.date > new Date()) {
            IAM_VOICE()
        } else {
            IAM_TOKEN_CHECK()
        }
    }
    res.status(200)
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});




