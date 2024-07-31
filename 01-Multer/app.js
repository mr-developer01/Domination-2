const express = require("express");
const app = express();
const userModel = require("./models/mongoose-connection");
const ejs = require("ejs");
const upload = require("./multer");

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.post(
  "/upload",
  upload.single("imageNameValuefromInput"),
  async (req, res) => {
    console.log(req.file);

    try {
      if (!req.file) {
        return res.redirect("/");
      }
      // `req.file` contains information about the uploaded file
      const user = await userModel.create({
        name: "Rahul",
        image: req.file.filename,
      });
      res.send({ msg: "File uploaded successfully", user });
    } catch (error) {
      res.send(error.message);
    }
  }
);

app.listen(3000);
