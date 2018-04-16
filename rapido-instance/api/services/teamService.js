/*
 * Version		: 0.0.1
 * Description	: Management of all team related APIs
 *
 */

"use strict";

var logger = import_utils("logger.js").getLoggerObject(),
    schema = require("async-validator"),
    _ = require("lodash"),
    bcrypt = require("bcrypt"),
    model = require(__dirname + "/models/team.js"),
    usermodel = require(__dirname + "/models/user.js"),
    auth = require(__dirname + "/models/authorize.js"),
    promises = require("bluebird"),
    exportJson = import_utils("exportLoader.js");

var teamService = {
    "create": function(request, response, next) {
        var team = {};
        team.name = request.body.name;
        team.description = request.body.description || "";
        team.capacity = request.body.capacity || configurations.team.size;
        team.createdby = request.user.id;

        var descriptor = {
            "team": {
                "type": "object",
                "required": true,
                "fields": {
                    "name": {
                        "required": true,
                        "message": "team requires a name"
                    }
                }
            }
        };
        var validator = promises.promisifyAll(new schema(descriptor));

        validator.validateAsync({
            "team": team
        })
            .then(function() {
                return auth.myTeamsAsync(request.user.id);
            })
            .then(function(results) {
                _.each(results, function(result, index) {
                    if (result.name == team.name) {
                        throw new Error("team " + team.name + " already exists for user " + team.createdby);
                    }
                });
                return model.createAsync(team);
            })
            .then(function(data) {
                response.status(200).json({
                    "id": data.id
                });
            })
            .catch(function(err) {
                logger.error(err);
                var httpCode = 400;
                if (err instanceof Error) { // 400 for validation error;
                    httpCode = 500;
                    err = {
                        "code": err.code,
                        "message": "Can not create team"
                    };
                }
                response.status(httpCode).json(err);
            });

    },
    "fetch": function(request, response, next) {

        var allTeams = [],
            promiseResolutions = [];

        promiseResolutions.push(auth.myTeamsAsync(request.user.id));
        promiseResolutions.push(auth.teamsImoderateAsync(request.user.id));
        promiseResolutions.push(auth.teamsIbelongAsync(request.user.id));

        promises.all(promiseResolutions)
            .then(function(results) {
                _.each(results[0], function(team, index) {
                    team.ownership = "OWN";
                    allTeams.push(team);
                });
                _.each(results[1], function(team, index) {
                    team.ownership = "ADMIN";
                    allTeams.push(team);
                });
                _.each(results[2], function(team, index) {
                    team.ownership = "MEMBER";
                    allTeams.push(team);
                });
                response.status(200).json(allTeams);
            })
            .catch(function(err) {
                logger.error(err);
                response.status(500).json({
                    "code": err.code,
                    "message": "Can not fetch teams for user " + request.user.id
                });
            });
    },

    "get": function(request, response, next) {

        var allMyTeams = [],
            allTeamsIamAdmin = [],
            allTeamsIamMember = [],
            promiseResolutions = [],
            access = "NONE",
            team = {};

        promiseResolutions.push(auth.myTeamsAsync(request.user.id));
        promiseResolutions.push(auth.teamsImoderateAsync(request.user.id));
        promiseResolutions.push(auth.teamsIbelongAsync(request.user.id));

        promises.all(promiseResolutions)
            .then(function(results) {
                _.each(results[0], function(result, index) {
                    allMyTeams.push(result.id.toString());
                });
                _.each(results[1], function(result, index) {
                    allTeamsIamAdmin.push(result.id.toString());
                });
                _.each(results[2], function(result, index) {
                    allTeamsIamMember.push(result.id.toString());
                });

                if(_.indexOf(allMyTeams, request.params.id) >=0 ) {
                    access = "OWN";
                } else if(_.indexOf(allTeamsIamAdmin, request.params.id) >= 0 ) {
                    access = "ADMIN";
                } else if(_.indexOf(allTeamsIamMember, request.params.id) >= 0 ) {
                    access = "MEMBER";
                } else {
                    throw new Error("User " + request.user.id + " does not have access to team " + request.params.id);
                }

                return model.readAsync(request.params.id);

            })
            .then(function(result) {
                team = result;
                team.access = access;
                promiseResolutions = [];

                promiseResolutions.push(model.getAllMembersAsync(team.id));
                promiseResolutions.push(usermodel.readByIdAsync({"id": team.createdby}));
                return promises.all(promiseResolutions);
            })
            .then(function(results) {
                team.memebers = [];
                _.each(results[0], function(member, index) {
                    team.memebers.push(member);
                });

                team.memebers.push({
                    "id": results[1].id,
                    "email": results[1].email,
                    "access": "OWNER"
                });
                delete team.createdby;
                return model.getAllProjectsAsync(team.id);
            })
            .then(function(projects){
                team.projects = [];
                _.each(projects, function(project, index) {
                    team.projects.push(project);
                });
                response.status(200).json(team);
            })
            .catch(function(err) {
                logger.error(err);
                response.status(500).json({
                    "code": err.code,
                    "message": "Can not get team with id" + request.params.id
                });
            });
    },

    "update": function(request, response, next) {

        var allTeams = [],
            promiseResolutions = [],
            team = {};

        team.id = request.params.id;

        if(request.body.name) {
            team.name = request.body.name;
        }
        if(request.body.description) {
            team.description = request.body.description;
        }
        if(request.body.capacity) {
            team.name = request.body.name;
        }
        if(request.body.capacity) {
            team.capacity = request.body.capacity;
        }

        promiseResolutions.push(auth.myTeamsAsync(request.user.id));
        promiseResolutions.push(auth.teamsImoderateAsync(request.user.id));

        promises.all(promiseResolutions)
            .then(function(results) {
                _.each(results[0], function(result, index) {
                    if (result.name == team.name && team.id != result.id) {
                        throw new Error("team " + team.name + " already exists for different team id " + result.id);
                    }
                    allTeams.push(result.id.toString());
                });
                _.each(results[1], function(result, index) {
                    allTeams.push(result.id.toString());
                });

                if(_.indexOf(allTeams, request.params.id ) < 0) {
                    throw new Error("user " + request.user.id + " does not have admin access to team " + request.params.id);
                } else {
                    return model.updateAsync(team);
                }
            })
            .then(function(result) {
                response.status(200).json({
                    "id": result.id
                });
            })
            .catch(function(err) {
                logger.error(err);
                var httpCode = 400;
                if (err instanceof Error) { // 400 for validation error;
                    httpCode = 500;
                    err = {
                        "code": err.code,
                        "message": "Can not update team with id " + team.id
                    };
                }
                response.status(httpCode).json(err);
            });
    },
    "delete": function(request, response, next) {

        var allTeams = [],
            promiseResolutions = [];

        promiseResolutions.push(auth.myTeamsAsync(request.user.id));
        promiseResolutions.push(auth.teamsImoderateAsync(request.user.id));

        promises.all(promiseResolutions)
            .then(function(results) {
                _.each(results[0], function(result, index) {
                    allTeams.push(result.id.toString());
                });
                _.each(results[1], function(result, index) {
                    allTeams.push(result.id.toString());
                });

                if(_.indexOf(allTeams, request.params.id ) < 0) {
                    throw new Error("user " + request.user.id + " does not have admin access to team " + request.params.id);
                } else {
                    return model.deleteAsync(request.params.id);
                }
            })
            .then(function(result) {
                response.status(200).json({"id": request.params.id});
            })
            .catch(function(err) {
                logger.error(err);
                response.status(500).json({
                    "code": err.code,
                    "message": "Can not delete team " + request.params.id
                });
            });
    },
    "addMember": function(request, response, next) {

        var allTeams = [],
            promiseResolutions = [],
            team = {
                "id": request.params.id
            },
            member = {
                "id": request.body.id,
                "access": request.body.access
            };

        promiseResolutions.push(auth.myTeamsAsync(request.user.id));
        promiseResolutions.push(auth.teamsImoderateAsync(request.user.id));

        promises.all(promiseResolutions)
            .then(function(results) {
                _.each(results[0], function(result, index) {
                    allTeams.push(result.id.toString());
                });
                _.each(results[1], function(result, index) {
                    allTeams.push(result.id.toString());
                });

                if(_.indexOf(allTeams, request.params.id ) < 0) {
                    throw new Error("user " + request.user.id + " does not have admin access to team " + request.params.id);
                } else {
                    return model.addMemberAsync(team, member);
                }
            })
            .then(function(result) {
                response.status(200).json({"id": member.id});
            })
            .catch(function(err) {
                logger.error(err);
                response.status(500).json({
                    "code": err.code,
                    "message": "Can not add member to team " + request.params.id
                });
            });
    },
    "updateMember": function(request, response, next) {

        var allTeams = [],
            promiseResolutions = [],
            team = {
                "id": request.params.teamid
            },
            member = {
                "id": request.params.userid,
                "access": request.body.access
            };

        promiseResolutions.push(auth.myTeamsAsync(request.user.id));
        promiseResolutions.push(auth.teamsImoderateAsync(request.user.id));
        promiseResolutions.push(model.readAsync(request.params.teamid));

        promises.all(promiseResolutions)
            .then(function(results) {
                _.each(results[0], function(result, index) {
                    allTeams.push(result.id.toString());
                });
                _.each(results[1], function(result, index) {
                    allTeams.push(result.id.toString());
                });

                if(_.indexOf(allTeams, request.params.teamid ) < 0) {
                    throw new Error("user " + request.user.id + " does not have admin access to team " + request.params.teamid);
                } else if (results[2].createdby == member.id) {
                    throw new Error("Can not update owner of a team" + request.params.teamid);
                } else {
                    return model.updateMemberAsync(team, member);
                }
            })
            .then(function(result) {
                response.status(200).json({"id": member.id});
            })
            .catch(function(err) {
                logger.error(err);
                response.status(500).json({
                    "code": err.code,
                    "message": "Can not update member for team " + request.params.teamid
                });
            });
    },
    "removeMember": function(request, response, next) {

        var allTeams = [],
            promiseResolutions = [],
            teamid = request.params.teamid,
            memberid = request.params.userid;

        promiseResolutions.push(auth.myTeamsAsync(request.user.id));
        promiseResolutions.push(auth.teamsImoderateAsync(request.user.id));
        promiseResolutions.push(model.readAsync(request.params.teamid));


        promises.all(promiseResolutions)
            .then(function(results) {
                _.each(results[0], function(result, index) {
                    allTeams.push(result.id.toString());
                });
                _.each(results[1], function(result, index) {
                    allTeams.push(result.id.toString());
                });

                if(_.indexOf(allTeams, request.params.teamid ) < 0) {
                    throw new Error("user " + request.user.id + " does not have admin access to team " + request.params.teamid);
                } else if (results[2].createdby == memberid) {
                    throw new Error("Can not remove owner of a team" + request.params.teamid);
                } else {
                    return model.removeMemberAsync(teamid, memberid);
                }
            })
            .then(function(result) {
                response.status(200).json({"id": memberid});
            })
            .catch(function(err) {
                logger.error(err);
                response.status(500).json({
                    "code": err.code,
                    "message": "Can not remove member from team " + request.params.teamid
                });
            });
    }
};

module.exports = teamService;
