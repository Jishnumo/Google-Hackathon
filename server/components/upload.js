const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, `${file.originalname}`);
  },
});


const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('File is not an image!'), false);
  }
};

//? Set upload configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = upload;
