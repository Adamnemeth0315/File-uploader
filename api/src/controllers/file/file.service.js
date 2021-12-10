const File = require('../../models/file.model');


exports.create = async fileData => {
    const file = new File(fileData);
    return await file.save();
};

exports.findAll = () => File.find();

exports.findOne = id => File.findById(id);

exports.delete = ( filename) => File.findOneAndDelete({filename:filename});