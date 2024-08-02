const express = require("express");
const app = express();
const ejs = require("ejs");
const upload = require("./multer");
const userModel = require("./models/mongoose-connection");

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
    try {
      console.log(req.file);
      if (!req.file) {
        return res.redirect("/");
      }
      const user = await userModel.create({
        name: "Koi pic",
        image: req.file.buffer,
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
