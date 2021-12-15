const express = require('express');
const app = express();
const mongoose = require('mongoose');
require("dotenv").config();

const port = 3000;

const authentication = require('./auth/auth');

mongoURI = 'mongodb://dbadmin:adminpw@localhost:27017/admin';

mongoose.Promise = global.Promise;
const cors = require('cors');
app.use(cors());

mongoose.connect(mongoURI ,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then( () => console.log('MongoDB connection has been established successfully.'))
.catch( err => {
        console.error(err);
        process.exit();
    });

app.use(express.json());
//Authentication & registration
app.post('/login', require('./auth/login'));
app.use('/register', require('./controllers/user/user.routes'));

//File uploader endpoints
app.use('/single', authentication, require('./controllers/file/file.routes'));
app.use('/files', authentication, require('./controllers/file/file.routes'));
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
