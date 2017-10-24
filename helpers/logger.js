const winston = require('winston');
const moment = require('moment');
const dotenv = require('dotenv');
const constants = require('../constants/constants');

const { Logger, transports } = winston;
dotenv.config();
const consoleTransOpts = getTransportOptions(constants.logTransport.console);
const fileTransOpts = getTransportOptions(constants.logTransport.file);
const colors = getCustomColors();
const logger = new Logger({
  transports: [
    new transports.Console(consoleTransOpts),
    new transports.File(fileTransOpts),
  ],
});
winston.addColors(colors);

function getTransportOptions(transport) {
  let level = process.env.LOG_LEVEL;
  let filename = null;
  let colorize = true;
  if (transport === constants.logTransport.file) {
    level = process.env.LOG_ERR_LEVEL;
    filename = process.env.LOG_FILE;
    colorize = false;
  }
  return {
    level,
    filename,
    colorize,
    handleExceptions: true,
    humanReadableUnhandledException: true,
    json: false,
    exitOnError: false,
    timestamp() {
      const wrappedNow = moment(new Date());
      return `\n${wrappedNow.format('YYYY-MM-DD hh:mm:ss')}`;
    },
    // formatter(options) {
    //   const now = this.timestamp();
    //   const upperCaseLevel = options.level.toUpperCase();
    //   const message = options.message ? options.message : '';
    //   const meta = options.meta ? options.meta : '';
    //   return `${now} ${upperCaseLevel} > ${message}\n\t${JSON.stringify(meta)}\n`;
    // },
  };
}

function getCustomColors() {
  return {
    verbose: 'blue',
    debug: 'blue',
    info: 'green',
    warn: 'yellow',
    error: 'red',
  };
}

logger.stream = {
  write(message, encoding) {
    logger.info(message);
  },
};

module.exports = logger;
