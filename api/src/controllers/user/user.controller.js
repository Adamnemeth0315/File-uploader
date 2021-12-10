const createError = require('http-errors');
const userService = require('./user.service');
const Model = require('../../models/user.model');
const jwt = require('jsonwebtoken');

exports.findAll = (req, res, next) => {
  return userService.findAll()
      .then( users => {
          res.json(users);
      });
}

exports.findOne = (req, res, next) => {
  return userService.findOne(req.params.id)
    .then( user => {
      if (!user) {
        return next( new createError.NotFound("User is not found!"));
      }
      res.json(user);
    })
};

exports.create = (req, res, next) => {
  const validationErrors = new Model(req.body).validateSync();
    if (validationErrors) {
        return next(
            new createError.BadRequest(validationErrors)
        );
    }

    return userService.create(req.body)
    .then(createdUser => {
    res.status(201);
    res.json(createdUser);
    })
    .catch(err => next(new createError.InternalServerError(err.message)));
  }