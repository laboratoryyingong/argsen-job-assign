/**
 * argsen job assign 
 * @author yin_gong<max.g.laboratory@gmail.com>
 */

const ENV = require('./const.js');

/**
 * express server
 */
const express = require('express');
const app = express();

/**
 * log & debug
 */
const chalk = require('chalk');
const winston = require('winston');
const logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({ level: 'debug' }),
    //   new (winston.transports.File)({ filename: __dirname + '/app/log/' + 'speech_log.log' })
    ]
});

/**
 * ssl option
 */
const sslOptions = {
    key: ENV.KEY,
    cert: ENV.CERT
}

/**
 * routes
 */

const api = require(__dirname + '/routes/api');
const router = require(__dirname + '/routes/web');

app.use('/api', api);
app.use('/', router);

const PORT = ENV.PORT;
const server = require('https').createServer(sslOptions, app);

server.listen(PORT);

logger.debug(chalk.white('------ Argsen job assign server on port : ' + PORT + ' ------ '));
