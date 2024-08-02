const multer = require("multer");
const storage = multer.memoryStorage();
const path = require("path");

const fileFilter = (req, file, cb) => {
  const extName = [".png", ".jpg", ".jpeg", ".webp"];
  const ext = path.extname(file.originalname);
  const included = extName.includes(ext);

  included ? cb(null, true) : cb(new Error("Only png/jpg/jpeg/webp are allows"));

  console.log(file, "Comming from multer");
};

const upload = multer({ storage: storage, fileFilter: fileFilter, limits: {fileSize: 2*1024*1024} });

module.exports = upload;
