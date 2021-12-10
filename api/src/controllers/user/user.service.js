const User = require('../../models/user.model');


exports.create = async userData => {
    const user = new User(userData);
    return await user.save();
};

exports.findAll = () => User.find();

exports.findOne = id => User.findById(id);

exports.delete = (id) => User.findByIdAndDelete(id);