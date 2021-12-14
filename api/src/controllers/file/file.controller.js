const createError = require('http-errors');
const fileService = require('./file.service');
const Model = require('../../models/file.model');
const { unlink } = require('fs');
const path = require('path');

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