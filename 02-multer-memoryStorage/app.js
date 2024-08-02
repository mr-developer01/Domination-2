const express = require("express");
const app = express();
const ejs = require("ejs");
const upload = require("./multer");
const userModel = require("./models/mongoose-connection");
const sharp = require("sharp");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index");
});

app.post(
  "/upload",
  upload.single("imageNameValuefromInput"),
  async (req, res) => {
    if (!req.file) {
      return res.send("Chose a file...");
    }

    let newBuffer = req.file.buffer;
    try {
      console.log(typeof req.file.size);

      if (req.file.size > 2097152) {
        newBuffer = await sharp(req.file.buffer)
          .resize({ width: 1920 })
          .toBuffer()
      }

      console.log(`Purana size of image ${req.file.size}`);
      console.log(
        `Size of image before upload to database is ${
          Buffer.byteLength(newBuffer) / 1048576
        }`
      );
      console.log();

      const user = await userModel.create({
        name: "Check Krne ke liye",
        image: newBuffer,
        mimetype: req.file.mimetype,
      });
      res.send("File Uploaded!!");
    } catch (error) {
      res.send(error.message);
    }
  }
);

app.get("/show", async (req, res) => {
  const files = await userModel.find();
  // console.log(files);
  res.render("show", { files });
});

app.listen(3000);
