const express = require('express');
const path = require('path');
const fs = require('fs');
const { MongoClient, GridFSBucket } = require('mongodb');
const url = 'mongodb://localhost:27017/';
const client = new MongoClient(url);
const db = client.db("video-stream");
const bucket = new GridFSBucket(db);
const app = express();

//middleware in express
app.use(express.json());

//to server static files
app.use(express.static(path.join(__dirname, 'public')));

// DB connect
app.get('/init-mongo', async (req, res) => {
    try {
        await client.connect();
        const videoUploadStream = bucket.openUploadStream('youtube');
        const videoReadStream = fs.createReadStream('./chaiya-chaiya.mp4');
        videoReadStream.pipe(videoUploadStream);
        res.status(200).send("Done...");
    } catch (error) {
        console.log(error.message);
        res.json(error);
    } finally {
        await client.close();
    }
})

//video streaming route on the same server
app.get('/mongo-video', async (req, res) => {
    const range = req?.headers?.range;
    if(!range) return res.status(400).json({"message": "Requires Range header"});

    try {
        await client.connect();
        const video = await db.collection('fs.files').findOne({});
        if(!video) {
            res.status(404).send("No videos Uploaded");
            return;
        } 
        //Taking video size from the mongo
        const videoSize = video.length;
        console.log(videoSize);
        const start = Number(range.replace(/\D/g, ""));
        const end =  videoSize -1;
        const contentLength = end - start + 1;

        const headers =  {
            "Content-Range": `bytes ${start}-${end}/${videoSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": contentLength,
            "Content-Type": "video/mp4"
        };
        // http headers for the partial content
        res.writeHead(206, headers);
        const downloadStream = bucket.openDownloadStreamByName('youtube', { start });

        // streaming the video
        downloadStream.pipe(res);
    } catch (error) {
        console.log(error.message);
        res.status(400).json(error.message);
    } 
})

app.listen(3500, () => console.log(`Server running on the port 3500`));