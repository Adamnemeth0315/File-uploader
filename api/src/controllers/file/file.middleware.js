const multer = require('multer');

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '/files'))
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '--' + file.originalname)
  }
});

const uploadFiles = multer({ 
  storage: fileStorageEngine,
  fileFilter(req, file, cb) {
    if( 
        file.mimetype == "application/pdf"
      || file.mimetype == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
      || file.mimetype == "image/png" 
      ) {
      cb(null , true);
    } else {
      cb(null, false)
      return cb(new Error('Only .pdf, .xlsx and .png format allowed!'));
    }
}
}).array('files', 3);

module.exports = uploadFiles;