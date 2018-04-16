/*
 * Version		: 0.0.1
 * Description	: All interaction with the postgres DB
 *
 */

"use strict";

var logger = import_utils("logger.js").getLoggerObject(),
    promises = require("bluebird"),
    bookshelf = require("bookshelf"),
    knex = require("knex"),
    databaseConnection = null;

var _init = function() {
    databaseConnection = bookshelf(knex(configurations.database));
    databaseConnection.knex.client.on("notice", function(msg) {
        logger.info("Postgres message on notice", msg);
    });
    databaseConnection.knex.client.on("error", function(err) {
        logger.error("Postgres error", err);
    });
};

var _dbOperations = {
    "execute": function(query, bindings, callback) {
        logger.debug("Executing raw query", query);
        databaseConnection.knex.raw(query, bindings)
            .then(function(result) {
                return callback(null, result);
            })
            .catch(function(err) {
                logger.error("Could not run query", query, "Error:", err);
                callback(err);
            });
    },
    "connection": function() {
        return databaseConnection.knex;
    }
};

var _operationController = function() {
    if (!databaseConnection) {
        _init();
    }
    return _dbOperations;
};

module.exports = _operationController;
