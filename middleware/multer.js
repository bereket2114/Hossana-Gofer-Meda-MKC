const multer = require("multer");
const path = require("path");

module.exports = multer({
  //this must be memoryStorage not diskStorage. So req.file.buffer exists when we use in our controller file.
  storage: multer.memoryStorage(), //This tells to not store the uploaded image or any media file in my local disk, let it empty.
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname).toLowerCase();  // I am creating variable that takes the file from local file manager.
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {     // This if() makes sure what type of file (image) must be uploaded.
      cb(new Error("File type is not supported"), false);
      return;
    }
//Else if the file the user from his local file manager is the right file type, make the error parameter part null(empty) and make it true.
    cb(null, true); 
  },
});