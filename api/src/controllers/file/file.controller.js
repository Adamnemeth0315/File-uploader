const createError = require('http-errors');
const fileService = require('./file.service');
const File = require('../../models/file.model');
const { uploadFile, existFolder, fileMoveToCorrectFolder } = require('./file.middleware');
const { unlink } = require('fs');
const path = require('path');
const multer = require('multer');

exports.findAll = (_req, res, _next) => {
  return fileService.findAll()
      .then( files => {
          res.json(files);
      });
}

exports.findOne = (req, res, next) => {
  return fileService.findOne(req.params.id)
    .then( file => {
      if (!file) {
        return next( new createError.NotFound("File is not found!"));
      }
      res.json(file);
    })
};

exports.upload = (req, res, next) => {
  uploadFile(req, res, function (err) {
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
}

exports.delete = (req, res, next) => {
  console.log('dest: ', req.query.folder);
  //Query paramként adom meg, hogy van-e folder, ha nincs akkor figyelmen kívül hagyja és a gyökérmappából törli a filet. 
  unlink(path.join(__dirname,`../../files/${req.query.folder}/${req.params.filename}`), (err) => {
    if (err) throw err;
    console.log('File deleted');
    return fileService.delete(req.params.filename)
      .then( () => {
        res.json({});
      })
      .catch( err => {
        return next (new createError.InternalServerError(err.message));
      })
  });
}