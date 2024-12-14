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
    const videoPath = "chaiya-chaiya.mp4";
    const videoSize = fs.statSync("chaiya-chaiya.mp4").size;
    console.log(videoSize);

    const range = req?.headers?.range;
    if(!range) return res.status(400).json({"message": "Requires Range header"});
})



app.listen(3500, () => console.log(`Server running on the port 3500`));