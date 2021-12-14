const express = require('express');
const controller = require('./file.controller');

const router = express.Router();

router.post('/', (req, res, next) => {
  return controller.upload(req, res, next);
});

router.get('/', (req, res, next) => {
  return controller.findAll(req, res, next);
});

router.get('/:id', (req, res, next) => {
  return controller.findOne(req, res, next);
});

router.delete('/:filename', (req, res, next) => {
  return controller.delete(req, res, next);
});

module.exports = router;