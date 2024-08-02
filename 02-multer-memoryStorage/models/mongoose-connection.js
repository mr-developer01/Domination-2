const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/Shree-Multer-Memory-Storage");

const userSchema = mongoose.Schema({
  name: String,
  image: Buffer,
  mimetype: String
});

module.exports = mongoose.model("user", userSchema);
