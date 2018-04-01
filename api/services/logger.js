var winston = require('winston');
winston.emitErrs = true;
var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: '/var/logs/ddn/api/ddn-api.log',
            /*filename: 'ddn-api.log',*/
            handleExceptions: true,
            json: false,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false,
            formatter: function (options) {
                var date = new Date();
                var logMsgTime = date.getFullYear() + '-' + (date.getMonth() < 10 ? '0' : '') + (date.getMonth() + 1) + '-' +
                    (date.getDate() < 10 ? '0' : '') + date.getDate() + ' ' + (date.getHours() < 10 ? '0' : '') + (date.getHours()) + ':' +
                    (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + ':' + (date.getSeconds() < 10 ? '0' : '') + date.getSeconds() + ':' +
                    date.getMilliseconds();
                var logMsg = '[' + logMsgTime + ']' + '[' + (options.level).toUpperCase() + ']' + ' ' + options.message;
                return logMsg;
            }
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});

module.exports = logger;
module.exports.stream = {
    write: function (message, encoding) {
        logger.info(message);
    }
};
