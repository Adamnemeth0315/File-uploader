const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');

module.exports = async (req, res) => {
  const {username, password} = req.body;

  try {
    const user = await UserModel.findOne({username});
    if (!user) {
      throw new Error("User not found!");
    }

    console.log(user);

    const verified = await user.verifyPassword(password);
    if (!verified) {
      throw new Error('Incorrect password');
    }

    const accessToken = jwt.sign({
      username: username
    }, process.env.ACCESS_TOKEN_SECRET);

    res.json({
      user,
      accessToken
    });

  } catch(error) {
    res.status(404).json(error.message);
  }

};