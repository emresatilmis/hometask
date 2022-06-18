require('dotenv/config')
const express = require('express')
const multer = require('multer')
const AWS = require('aws-sdk')

const app = express()
const port = 3000

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET
})

const storage = multer.memoryStorage({
    destination: function (req, file, callback) {
        callback(null, '')
    }
})

const upload = multer({ storage }).single('image')

app.post('/image', upload, (req, res) => {

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: req.file.originalname,
        Body: req.file.buffer
    }

    s3.upload(params, (error, data) => {
        if (error) {
            res.send(error)
        }
        res.send(data)
    })
})

app.get('/image/:filename', (req, res) => {

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: req.params.filename,
    }

    s3.getObject(params, (error, data) => {
        if (error) {
            res.send(error)
        }
        res.send(data.Body)
    })
})

app.listen(port, () => {
    console.log(`Server is up at ${port}`)
})