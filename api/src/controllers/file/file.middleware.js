const multer = require('multer');

const upload = multer({ 
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
}).single('file');

module.exports = upload;