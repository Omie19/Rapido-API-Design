/*
 * Version		: 0.0.1
 * Description	: Model for team management
 *
 */

"use strict";

var logger = import_utils("logger.js").getLoggerObject(),
    promises = require("bluebird"),
    db = promises.promisifyAll(import_utils("db.js")()),
    _ = require("lodash"),
    queries = import_templates("sql.js")["team"];


var model = {
    "create": function(team, callback) {
        db.executeAsync(queries.insert, [
            team.name,
            team.description,
            team.createdby,
            team.capacity
        ])
            .then(function(data) {
                if (data.rows && data.rows.length > 0) {
                    team.id = data.rows[0].id;
                    logger.debug("team created with Id", data.rows[0].id);
                    callback(null, team);
                } else {
                    callback(new Error("Could not create team with name" + team.name));
                    return;
                }
            })
            .catch(function(err) {
                logger.error("Error creating team", err.message);
                callback(err);
            });
    },
    "read": (teamid, callback) => {
        db.executeAsync(queries.select, [teamid])
            .then(function(data) {
                logger.debug("Team with id", teamid, "retrived.");
                return callback(null, data.rows[0]);
            })
            .catch(function(err) {
                logger.error("Error retrieving team with id", teamid, err.message);
                callback(err);
            });
    },

    "getAdmins" : function(teamid, callback) {
        db.executeAsync(queries.getOnlyAdmins, [teamid])
            .then(function(data) {
                logger.debug("Admins for", teamid, "retrived.");
                return callback(null, data.rows);
            })
            .catch(function(err) {
                logger.error("Error retrieving admins for team with id", teamid, err.message);
                callback(err);
            });
    },

    "getMembers" : function(teamid, callback) {
        db.executeAsync(queries.getOnlyMembers, [teamid])
            .then(function(data) {
                logger.debug("Members for", teamid, "retrived.");
                return callback(null, data.rows);
            })
            .catch(function(err) {
                logger.error("Error retrieving members for team with id", teamid, err.message);
                callback(err);
            });
    },

    "getAllMembers" : function(teamid, callback) {
        db.executeAsync(queries.getAllMembers, [teamid])
            .then(function(data) {
                logger.debug("All Members for", teamid, "retrived.");
                return callback(null, data.rows);
            })
            .catch(function(err) {
                logger.error("Error retrieving all members for team with id", teamid, err.message);
                callback(err);
            });
    },

    "getAllProjects" : function(teamid, callback) {
        db.executeAsync(queries.getAllProjects, [teamid])
            .then(function(data) {
                logger.debug("All Projects for", teamid, "retrived.");
                return callback(null, data.rows);
            })
            .catch(function(err) {
                logger.error("Error retrieving all projects for team with id", teamid, err.message);
                callback(err);
            });
    },

    "addMember": function(team, user, callback) {
        db.executeAsync(queries.getAllMembers, [team.id])
            .then(function(data) {
                _.each(data.rows, function(memeber, index) {
                    if(memeber.id == user.id) {
                        throw {"code": 201};
                    }
                });
                return db.executeAsync(queries.addMember, [user.id, team.id, user.access || "MEMBER"]);
            })
            .then(function(data) {
                logger.debug("User", user.id, "added to team", team.id);
                return callback(null, true);
            })
            .catch(function(err) {
                if(err.code && err.code == 201) {
                    callback(null, true);
                    return;
                }
                logger.error("Error adding user to team", team.id, err.message);
                callback(err);
            });
    },
    "updateMember": function(team, user, callback) {
        db.executeAsync(queries.updateMember, [user.access  || "MEMBER" , team.id, user.id])
            .then(function(data) {
                logger.debug("User role for", user.id, "updated to team", team.id);
                return callback(null, true);
            })
            .catch(function(err) {
                logger.error("Error updating user  role for team", team.id, err.message);
                callback(err);
            });
    },
    "removeMember": function(teamid, userid, callback) {
        db.executeAsync(queries.removeMember, [teamid, userid])
            .then(function(data) {
                logger.debug("User ", userid, "removed from team", teamid);
                return callback(null, true);
            })
            .catch(function(err) {
                logger.error("Error removing user for team", teamid, err.message);
                callback(err);
            });
    },
    "update": function(team, callback) {
        var teamid = team.id;
        delete team.id;

        db.connection()("teams")
            .where("id", "=", teamid)
            .update(team)
            .returning("id")
            .then(function(data) {
                if (data) {
                    logger.debug("team updated with id", teamid);
                    team.id = teamid;
                    callback(null, team);
                } else {
                    callback(new Error("Could not update team with id" + teamid));
                }
                return;
            })
            .catch(function(err) {
                logger.error("Error updating team", err.message);
                callback(err);
            });
    },
    "delete": function(teamid, callback) {
        db.executeAsync(queries.delete, [teamid])
            .then(function(data) {
                logger.debug("team", teamid, "deleted");
                return db.executeAsync(queries.removeAllProjects, [teamid]);
            })
            .then(function(data) {
                logger.debug("All project for team", teamid, "are removed");
                return callback(null, true);
            })
            .catch(function(err) {
                logger.error("Error deleting team", teamid, err.message);
                callback(err);
            });
    }
};

module.exports = promises.promisifyAll(model);
