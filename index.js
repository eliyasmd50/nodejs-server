const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

//middleware in express
app.use(express.json());

//to server static files
app.use(express.static(path.join(__dirname, 'public')));

//video streaming route on the same server
app.get('/video', (req, res) => {
    const range = req?.headers?.range;
    if(!range) return res.status(400).json({"message": "Requires Range header"});

    const videoPath = "chaiya-chaiya.mp4";
    const videoSize = fs.statSync("chaiya-chaiya.mp4").size;

    //Parse Range for video
    const CHUNK_SIZE = 10 ** 6; //1 MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize -1);
    const contentLength = end - start + 1;

    const headers =  {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4"
    }
    res.writeHead(206, headers);

    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
})



app.listen(3500, () => console.log(`Server running on the port 3500`));