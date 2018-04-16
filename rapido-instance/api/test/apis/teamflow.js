/*
 * Version		: 0.0.1
 * Description	: API calls related to team
 *
 */

"use strict";

var assert = require("chai").assert,
    path = require("path"),
    promises = require("bluebird"),
    httpRequest = promises.promisifyAll(require("../../utils/httpRequest.js")),
    promises = require("bluebird"),
    httpServer = require("../config.js").server.local;

var createTeam = function(user, team, done) {
    var options = {
        "host": httpServer.host,
        "port": httpServer.port,
        "path": "/api/team",
        "method": "POST",
        "headers": {}
    };

    options.headers["Authorization"] = "Bearer " + user.token;
    options.data = JSON.stringify(team);

    httpRequest.postAsync(options)
        .then(function(response) {
            response = JSON.parse(response);
            assert.isObject(response, "Team creation response should be an object");
            done(null,response);
        })
        .catch(function(err) {
            done(err);
        });
};

var getUserTeams = function(user, done) {
    var options = {
        "host": httpServer.host,
        "port": httpServer.port,
        "path": "/api/team",
        "method": "GET",
        "headers": {}
    };

    options.headers["Authorization"] = "Bearer " + user.token;

    httpRequest.getAsync(options)
        .then(function(response) {
            response = JSON.parse(response);
            assert.isArray(response, "User teams should be an array");
            done(null,response);
        })
        .catch(function(err) {
            done(err);
        });
};

var getOneTeam = function(user, team, done) {
    var options = {
        "host": httpServer.host,
        "port": httpServer.port,
        "path": "/api/team/" + team.id,
        "method": "GET",
        "headers": {}
    };

    options.headers["Authorization"] = "Bearer " + user.token;

    httpRequest.getAsync(options)
        .then(function(response) {
            response = JSON.parse(response);
            assert.isObject(response, "Get one team does not return object!");
            done(null, response);
        })
        .catch(function(err) {
            done(err);
        });
};

var updateTeam = function(user, team, done) {
    var options = {
        "host": httpServer.host,
        "port": httpServer.port,
        "path": "/api/team/" + team.id,
        "method": "PUT",
        "headers": {}
    };

    options.headers["Authorization"] = "Bearer " + user.token;
    options.data = JSON.stringify(team);

    httpRequest.putAsync(options)
        .then(function(response) {
            response = JSON.parse(response);
            assert.isObject(response, "Update team does not return object!");
            done(null, response);
        })
        .catch(function(err) {
            done(err);
        });
};

var addMemberToTeam = function(user, team, member, done) {
    var options = {
        "host": httpServer.host,
        "port": httpServer.port,
        "path": "/api/team/"+ team.id + "/member",
        "method": "POST",
        "headers": {}
    };

    options.headers["Authorization"] = "Bearer " + user.token;
    options.data = JSON.stringify(member);

    httpRequest.postAsync(options)
        .then(function(response) {
            response = JSON.parse(response);
            assert.isObject(response, "Member add to team response should be an object");
            done(null,response);
        })
        .catch(function(err) {
            done(err);
        });
};

var updateMemberOfTeam = function(user, team, member, done) {
    var options = {
        "host": httpServer.host,
        "port": httpServer.port,
        "path": "/api/team/"+ team.id + "/member/" + member.id,
        "method": "PUT",
        "headers": {}
    };

    options.headers["Authorization"] = "Bearer " + user.token;
    options.data = JSON.stringify(member);

    httpRequest.putAsync(options)
        .then(function(response) {
            response = JSON.parse(response);
            assert.isObject(response, "Member update on team response should be an object");
            done(null,response);
        })
        .catch(function(err) {
            done(err);
        });
};

var removeMemberFromTeam = function(user, team, member, done) {
    var options = {
        "host": httpServer.host,
        "port": httpServer.port,
        "path": "/api/team/"+ team.id + "/member/" + member.id,
        "method": "DELETE",
        "headers": {}
    };

    options.headers["Authorization"] = "Bearer " + user.token;

    httpRequest.deleteAsync(options)
        .then(function(response) {
            response = JSON.parse(response);
            assert.isObject(response, "delete member from team response should be an object");
            done(null,response);
        })
        .catch(function(err) {
            done(err);
        });
};

var deleteTeam = function(user, team, done) {
    var options = {
        "host": httpServer.host,
        "port": httpServer.port,
        "path": "/api/team/"+ team.id,
        "method": "DELETE",
        "headers": {}
    };

    options.headers["Authorization"] = "Bearer " + user.token;

    httpRequest.deleteAsync(options)
        .then(function(response) {
            response = JSON.parse(response);
            assert.isObject(response, "delete member from team response should be an object");
            done(null,response);
        })
        .catch(function(err) {
            done(err);
        });
};

module.exports = {
    "createTeam" : createTeam,
    "getUserTeams" : getUserTeams,
    "getOneTeam" : getOneTeam,
    "updateTeam" : updateTeam,
    "deleteTeam" : deleteTeam,
    "addMemberToTeam" : addMemberToTeam,
    "updateMemberOfTeam": updateMemberOfTeam,
    "removeMemberFromTeam": removeMemberFromTeam
};
