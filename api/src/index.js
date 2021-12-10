const express = require('express');
const multer = require('multer');
const fs = require('fs');
const File = require('./models/file.model');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
require("dotenv").config();

const authentication = require('./auth/auth');

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '/files'))
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '--' + file.originalname)
  }
});

mongoURI = 'mongodb://dbadmin:adminpw@localhost:27017/admin';
//Itt ellenőrzöm hogy a mappa létezik-e már vagy sem, ha nem akkor létrehozom, ha létezik akkor logolom hogy már létezik. 
const existFolder = (req, res) => {
  fs.access(req.body.destination, (err) => {
    if (err) {
      fs.mkdir(path.join(__dirname, '/files', req.body.destination), (err) => {
        if (err) {
            return console.error(err);
        }
        console.log('Directory created successfully!');
      });
    }
    console.log('Folder is exist.')
  })
};

const fileMoveToCorrectFolder = (req, res) => {
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

mongoose.Promise = global.Promise;
const cors = require('cors');

const port = 3000;
app.use(cors());

mongoose.connect('mongodb://dbadmin:adminpw@localhost:27017/admin',{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then( () => console.log('MongoDB connection has been established successfully.'))
.catch( err => {
        console.error(err);
        process.exit();
    });

app.use(express.json());

app.post('/login', require('./auth/login'));
app.use('/register', require('./controllers/user/user.routes'));



app.post('/single', (req, res) => {

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      res.send(err)
    } else if (err) {
      res.send(err)
    }
    existFolder(req, res);
    const file = new File(req.file);
    if (req.body?.destination) {
      file.folder =  req.body.destination;
    } 
    file.save().then(createdFile => {
      //Itt átalakítom objecté az adatot ami jön és már tudom módosítani. Ehhez a toObject metódust használom.
      const resData = { file: { ...createdFile.toObject() } };
      
      res.status(201).json(resData);
      fileMoveToCorrectFolder(req, res); 
    })
    .catch( err => {
      next(new createError.InternalServerError(err.message));
    })
  });

})

app.get('/', (_req, res) => {
  res.send('File Uploader')
});
app.use('/files', require('./controllers/file/file.routes'));
app.use('/users', authentication, require('./controllers/user/user.routes'));

app.use( (err, _req, res, _next) => {
  const status = err.status || 500;
  res.status(status);
  res.json({
      hasError: true,
      message: err.message
  });
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});