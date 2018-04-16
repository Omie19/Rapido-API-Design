/*
 * Name			: services/logger.js
 * Author		: Partha Mallik (parthapratim.mallik@ca.com)
 * Version		: 0.0.1
 * Description	: A winston logger to be used by the application
 *
 */

"use strict";

var winston = require("winston"),
    logger = null;

var _getLogger = function() {
    if (!logger) {
        logger = new(winston.Logger)({
            transports: [
                new(winston.transports.Console)(configurations["logger"])
            ]
        });
    }
    return logger;
};

exports.getLoggerObject = _getLogger;
