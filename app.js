const express = require('express');
const helmet = require('helmet');
const logger = require('morgan');
const twitter = require('./routes/twitter');

require('dotenv').config();
const app = express();

async function main() {
  app.use(helmet());
  app.use(express.json());
  app.use(logger('dev'));

  // router
  app.get('/', function (req, res) {
    res.send('Ok');
  });
  app.use('/twitter', twitter);
}

main()
  .then()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

module.exports = app;
