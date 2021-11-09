const express = require('express');
const helmet = require('helmet');
const logger = require('morgan');
const multer = require('multer');
const WebSockets = require('./socket/socket');
const port = process.env.PORT || 5000;
const upload = multer();

// import routes
const twitter = require('./routes/twitter');

const app = express();

app.use(helmet());
app.use(express.json());
app.use(logger('dev'));
// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// for parsing multipart/form-data
app.use(upload.array());

// router
app.get('/', function (req, res) {
  res.send('Ok');
});
app.use('/twitter', twitter);

// launch ======================================================================
const server = app.listen(port);
console.log(`server working on ${port}`);

// Socket ======================================================================
global.io = require('socket.io')(server);
global.io.on('connection', WebSockets.connection);
