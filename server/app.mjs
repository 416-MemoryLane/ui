import express from "express";
import fs from "fs";
import cors from "cors";

import multer from "multer";

const app = express();
app.use(express.json());
app.use(cors());

const port = 4321;
const ALBUM_DIR = "./albums";
const STATIC_PATH = "/static";

app.use(STATIC_PATH, express.static(ALBUM_DIR));

app.get("/albums", (req, res) => {
  const albums = fs.readdirSync(ALBUM_DIR);
  const struct = albums.map((albumName) => {
    const images = fs.readdirSync(`${ALBUM_DIR}/${albumName}`);
    return {
      title: albumName,
      images: images.map(
        (fileName) => `${STATIC_PATH}/${albumName}/${fileName}`
      ),
    };
  });
  res.status(200).send(struct);
});

app.get("/albums/:id", (req, res) => {
  const { id } = req.params;
  console.log(id);
  res.send(id);
});

app.post("/albums/:albumName/images", (req, res) => {
  const { albumName } = req.params;
  var albumPath = `${ALBUM_DIR}/${albumName}`;
  if (!fs.existsSync(albumPath)) {
    fs.mkdirSync(albumPath);
  }
  var storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, albumPath);
    },
    filename: function (req, file, callback) {
      callback(null, file.originalname);
    },
  });
  var upload = multer({ storage: storage }).single("myfile");
  upload(req, res, function (err) {
    if (err) {
      return res.end("Error uploading file.");
    }
    res.end("File is uploaded successfully!");
  });
});

app.listen(port, () => {
  console.log("Server running on port " + port);
});
