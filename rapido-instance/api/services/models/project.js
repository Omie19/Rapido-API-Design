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
    queries = import_templates("sql.js")["project"];


var model = {
    "create": (project, callback) => {
        db.executeAsync(queries.insert, [
            project.name,
            project.description,
            project.createdby,
            project.vocabulary,
            project.treedata,
            project.apidetails
        ])
            .then(function(data) {
                if (data.rows && data.rows.length > 0) {
                    project.id = data.rows[0].id;
                    logger.debug("project created with Id", data.rows[0].id);
                    callback(null, project);
                } else {
                    callback(new Error("Could not create project with name" + project.name));
                }
                return;
            })
            .catch(function(err) {
                logger.error("Error creating project", err.message);
                callback(err);
            });
    },
    "read": (id, callback) => {
        db.executeAsync(queries.select, [id])
            .then(function(data) {                
                logger.debug("Project with id", id, "retrived.");
                return callback(null, data.rows[0]);
            })
            .catch(function(err) {
                logger.error("Error retrieving project with id ", id, err.message);
                callback(err);
            });
    },
    "update": (project, callback) => {
        var projectId = project.id;
        delete project.id;

        db.connection()("projects")
            .where("id", "=", projectId)
            .update(project)
            .returning("id")
            .then(function(data) {
                if (data) {
                    logger.debug("project update with Id", projectId);
                    project.id = projectId;
                    callback(null, project);
                } else {
                    callback(new Error("Could not update project with id" + projectId));
                }
                return;
            })
            .catch(function(err) {
                logger.error("Error updating project", err.message);
                callback(err);
            });
    },
    "delete": (id, callback) => {
        db.executeAsync(queries.delete, [id])
            .then(function(data) {
                logger.debug("Projects with id", id, "deleted.");
                return db.executeAsync(queries.removeAllTeams, [id]);
            })
            .then(function(){
                logger.debug("All teams for projects are removed", id, "deleted.");
                return callback(null, true);
            })
            .catch(function(err) {
                logger.error("Error deleting projects with id ", id, err.message);
                callback(err);
            });
    },
    "addTeam": function(projectid, team, callback) {
        db.executeAsync(queries.addTeam, [team.id, projectid, team.access || "WRITE"])
            .then(function(data) {
                logger.debug("Team", team.id, "added to project", projectid);
                return callback(null, true);
            })
            .catch(function(err) {
                logger.error("Error adding team to project", projectid, err.message);
                callback(err);
            });
    },
    "updateTeam": function(projectid, team, callback) {
        db.executeAsync(queries.updateTeam, [team.access  || "WRITE" , projectid, team.id])
            .then(function(data) {
                logger.debug("Team details for project", projectid, "updated");
                return callback(null, true);
            })
            .catch(function(err) {
                logger.error("Error updating team for project", projectid, err.message);
                callback(err);
            });
    },
    "getAllTeams": function(projectid, callback) {
        db.executeAsync(queries.getAllTeams, [projectid])
            .then(function(data) {
                logger.debug("All teams for project id", projectid, "retrived");
                return callback(null, data.rows);
            })
            .catch(function(err) {
                logger.error("Error retrieving all teams for project", projectid, err.message);
                callback(err);
            });
    },
    "removeTeam": function(projectid, teamid, callback) {
        db.executeAsync(queries.removeTeam, [projectid, teamid])
            .then(function(data) {
                logger.debug("team ", teamid, "removed from project", projectid);
                return callback(null, true);
            })
            .catch(function(err) {
                logger.error("Error removing team for project", projectid, err.message);
                callback(err);
            });
    },
    "addVocabulary": function(projectid, vocabulary, callback) {
        db.executeAsync(queries.addVocabulary, [vocabulary, projectid])
            .then(function(data) {
                logger.debug("vocabulary", vocabulary, "added to project", projectid);
                return callback(null, true);
            })
            .catch(function(err) {
                logger.error("Error adding vocabulary to project", projectid, err.message);
                callback(err);
            });
    },
    "removeVocabulary": function(projectid, vocabulary, callback) {
        db.executeAsync(queries.removeVocabulary, [vocabulary, projectid])
            .then(function(data) {
                logger.debug("vocabulary", vocabulary, "removed from project", projectid);
                return callback(null, true);
            })
            .catch(function(err) {
                logger.error("Error removing vocabulary to project", projectid, err.message);
                callback(err);
            });
    },

};

module.exports = promises.promisifyAll(model);
