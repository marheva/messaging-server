import multer from "multer";

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/csv");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const multerUpload = multer({ storage: multerStorage }).single("file");

export { multerUpload };
