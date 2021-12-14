const multer = require('multer');
const fs = require('fs');
const path = require('path');

const fileStorageEngine = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../../files'))
  },
  filename: (_req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + '--' + file.originalname)
  }
});

const uploadFile = multer({ 
  storage: fileStorageEngine,
  fileFilter(_req, file, cb) {
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

const existFolder = (req, _res) => {
  fs.access(req.body.destination, (err) => {
    if (err) {
      fs.mkdir(path.join(__dirname, '../../files', req.body.destination), (err) => {
        if (err) {
          return console.error(err);
        }
        console.log('Directory created successfully!');
      });
    }
    console.log('Folder is exist.')
  })
};

const fileMoveToCorrectFolder = (req, _res) => {
  const oldPath = req.file.destination;
  const newPathArray = req.file.destination.split('\\');
  const newPath = [...newPathArray, req.body.destination].join('\\');
  if (`${oldPath}\\` === newPath){
    console.log('same folder')
  } else {
    fs.copyFile(`${oldPath}\\${req.file.filename}`, `${newPath}\\${req.file.filename}`, err => {
      if (err) throw err;
      fs.unlink(`${oldPath}\\${req.file.filename}`, err => {
        if (err) throw err;
      });
    });
  }
}

module.exports = {
  uploadFile,
  existFolder,
  fileMoveToCorrectFolder,
};