/*
 * Version		: 0.0.1
 * Description	: API calls related to project
 *
 */

"use strict";

var assert = require("chai").assert,
    path = require("path"),
    promises = require("bluebird"),
    httpRequest = promises.promisifyAll(require("../../utils/httpRequest.js")),
    promises = require("bluebird"),
    httpServer = require("../config.js").server.local;

var createProject = function(user, project,done) {
    var options = {
        "host": httpServer.host,
        "port": httpServer.port,
        "path": "/api/project",
        "method": "POST",
        "headers": {}
    };

    options.headers["Authorization"] = "Bearer " + user.token;
    options.data = JSON.stringify(project);

    httpRequest.postAsync(options)
        .then(function(response) {
            response = JSON.parse(response);
            assert.isObject(response, "Project creation response should be an object");
            done(null,response);
        })
        .catch(function(err) {
            done(err);
        });
};

var getUserProjects = function(user, done) {
    var options = {
        "host": httpServer.host,
        "port": httpServer.port,
        "path": "/api/project",
        "method": "GET",
        "headers": {}
    };

    options.headers["Authorization"] = "Bearer " + user.token;

    httpRequest.getAsync(options)
        .then(function(response) {
            response = JSON.parse(response);
            assert.isObject(response, "User projects should be an object");
            done(null,response);
        })
        .catch(function(err) {
            done(err);
        });
};

var getOneProject = function(user, project, done) {
    var options = {
        "host": httpServer.host,
        "port": httpServer.port,
        "path": "/api/project/" + project.id,
        "method": "GET",
        "headers": {}
    };

    options.headers["Authorization"] = "Bearer " + user.token;

    httpRequest.getAsync(options)
        .then(function(response) {
            response = JSON.parse(response);
            assert.isObject(response, "Get one project does not return object!");
            done(null, response);
        })
        .catch(function(err) {
            done(err);
        });
};

var updateProject = function(user, project, done) {
    var options = {
        "host": httpServer.host,
        "port": httpServer.port,
        "path": "/api/project/" + project.id,
        "method": "PUT",
        "headers": {}
    };

    options.headers["Authorization"] = "Bearer " + user.token;
    options.data = JSON.stringify(project);

    httpRequest.putAsync(options)
        .then(function(response) {
            response = JSON.parse(response);
            assert.isObject(response, "Update project does not return object!");
            done(null);
        })
        .catch(function(err) {
            done(err);
        });
};

var deleteProject = function(user, project, done) {
    var options = {
        "host": httpServer.host,
        "port": httpServer.port,
        "path": "/api/project/" + project.id,
        "method": "DELETE",
        "headers": {}
    };
    options.headers["Authorization"] = "Bearer " + user.token;

    httpRequest.deleteAsync(options)
        .then(function(response) {
            response = JSON.parse(response);
            assert.isObject(response, "Delete project does not return object!");
            done(null, response);
        })
        .catch(function(err) {
            done(err);
        });
};

var addTeam = function(user, project, team, done) {
    var options = {
        "host": httpServer.host,
        "port": httpServer.port,
        "path": "/api/project/" + project.id + "/team",
        "method": "POST",
        "headers": {}
    };
    options.headers["Authorization"] = "Bearer " + user.token;

    options.data = JSON.stringify(team);

    httpRequest.postAsync(options)
        .then(function(response) {
            response = JSON.parse(response);
            assert.isObject(response, "Add team to project does not return object!");
            done(null, response);
        })
        .catch(function(err) {
            done(err);
        });
};

var updateTeam = function(user, project, team, done) {
    var options = {
        "host": httpServer.host,
        "port": httpServer.port,
        "path": "/api/project/" + project.id + "/team/" + team.id,
        "method": "PUT",
        "headers": {}
    };
    options.headers["Authorization"] = "Bearer " + user.token;

    options.data = JSON.stringify(team);

    httpRequest.putAsync(options)
        .then(function(response) {
            response = JSON.parse(response);
            assert.isObject(response, "Update team for project does not return object!");
            done(null, response);
        })
        .catch(function(err) {
            done(err);
        });
};

module.exports = {
    "createProject" : createProject,
    "getUserProjects" : getUserProjects,
    "getOneProject" : getOneProject,
    "updateProject" : updateProject,
    "deleteProject" : deleteProject,
    "addTeam": addTeam,
    "updateTeam": updateTeam
};
