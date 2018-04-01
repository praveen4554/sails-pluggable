var winston = require('winston');
require('winston-daily-rotate-file');

var customLogger = new winston.Logger({
     transports: [
         new (winston.transports.DailyRotateFile)({
             level: 'info',
             name: 'ddn.log',
             colorize: true,
             filename: './ddn.log',
             datePattern: '.yyyy-MM-ddTdd',
             zippedArchive: true,
             maxFiles: 10,
             maxsize: 536870912
         }),
     ],
});
// customLogger.error('Hello World!');
module.exports.log = {

    /***************************************************************************
     *                                                                          *
     * Valid `level` configs: i.e. the minimum log level to capture with        *
     * sails.log.*()                                                            *
     *                                                                          *
     * The order of precedence for log levels from lowest to highest is:        *
     * silly, verbose, info, debug, warn, error                                 *
     *                                                                          *
     * You may also set the level to "silent" to suppress all logs.             *
     *                                                                          *
     ***************************************************************************/
  // custom: customLogger
};
