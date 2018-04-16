/*
 * Name			: models/user.js
 * Author		: Partha Mallik (parthapratim.mallik@ca.com)
 * Version		: 0.0.1
 * Description	: Model for projects management
 *
 */

"use strict";
var logger = import_utils("logger.js").getLoggerObject(),
    promises = require("bluebird"),
    db = promises.promisifyAll(import_utils("db.js")()),
    queries = import_templates("sql.js")["auth"];


var model = {
    "myTeams": (userid, callback) => {
        db.executeAsync(queries.myteams, [userid])
            .then(function(data) {
                logger.debug("My teams for", userid, "fetched.");
                return callback(null, data.rows);
            })
            .catch(function(err) {
                logger.error("Error retrieving teams for user with id ", userid, err.message);
                callback(err);
            });
    },
    "teamsImoderate": (userid, callback) => {
        db.executeAsync(queries.teamsImoderate, [userid])
            .then(function(data) {
                logger.debug("Teams I moderate for", userid, "fetched.");
                return callback(null, data.rows);
            })
            .catch(function(err) {
                logger.error("Error retrieving teams I moderate for user with id ", userid, err.message);
                callback(err);
            });

    },
    "teamsIbelong": (userid, callback) => {
        db.executeAsync(queries.teamsIbelong, [userid])
            .then(function(data) {
                logger.debug("Teams I belong for", userid, "fetched.");
                return callback(null, data.rows);
            })
            .catch(function(err) {
                logger.error("Error retrieving teams I belong for user with id ", userid, err.message);
                callback(err);
            });
    },
    "myProjects": (userid, callback) => {
        db.executeAsync(queries.myProjects, [userid])
            .then(function(data) {
                logger.debug("My projects for", userid, "fetched.");
                return callback(null, data.rows);
            })
            .catch(function(err) {
                logger.error("Error retrieving projects for user with id ", userid, err.message);
                callback(err);
            });
    },
    "projectsIcanEdit": (userid, callback) => {
        db.executeAsync(queries.projectsIcanEdit, [userid, userid])
            .then(function(data) {
                logger.debug("Projects I can edit for", userid, "fetched.");
                return callback(null, data.rows);
            })
            .catch(function(err) {
                logger.error("Error retrieving projects I can edit for user with id ", userid, err.message);
                callback(err);
            });
    },
    "projectsIcanView": (userid, callback) => {
        db.executeAsync(queries.projectsIcanView, [userid, userid])
            .then(function(data) {
                logger.debug("Projects I can view for", userid, "fetched.");
                return callback(null, data.rows);
            })
            .catch(function(err) {
                logger.error("Error retrieving projects I can view for user with id ", userid, err.message);
                callback(err);
            });
    }
};

module.exports = promises.promisifyAll(model);
