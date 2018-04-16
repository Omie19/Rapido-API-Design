/*
 * Version		: 0.0.1
 * Description	: API calls related to user
 *
 */

"use strict";

var assert = require("chai").assert,
    path = require("path"),
    promises = require("bluebird"),
    httpRequest = promises.promisifyAll(require("../../utils/httpRequest.js")),
    promises = require("bluebird"),
    httpServer = require("../config.js").server.local;

var registerUser = function(user, done) {
    var options = {
        "host": httpServer.host,
        "port": httpServer.port,
        "path": "/api/user",
        "method": "POST"
    };
    options.data = JSON.stringify(user);
    httpRequest.postAsync(options)
        .then(function(response) {
            response = JSON.parse(response);
            assert.isObject(response, "create user response is not an object");
            done(null, response);
        })
        .catch(function(err) {
            done(err);
        });
};

var loginUser = function(user, done) {
    var options = {
        "host": httpServer.host,
        "port": httpServer.port,
        "path": "/api/login",
        "method": "POST"
    };

    options.data = JSON.stringify({
        "email": user.email,
        "password": user.password
    });

    httpRequest.postAsync(options)
        .then(function(response) {
            response = JSON.parse(response);
            assert.isObject(response, "Login does not return user object!");
            done(null, response);
        })
        .catch(function(err) {
            done(err);
        });
};

var getProfile = function(user, done) {
    var options = {
        "host": httpServer.host,
        "port": httpServer.port,
        "path": "/api/me",
        "method": "GET",
        "headers": {}
    };

    options.headers["Authorization"] = "Bearer " + user.token;

    httpRequest.getAsync(options)
        .then(function(response) {
            response = JSON.parse(response);
            assert.isObject(response, "Me does not return user object!");
            done(null, response);
        })
        .catch(function(err) {
            done(err);
        });
};

var updateProfile = function(user, done) {
    var options = {
        "host": httpServer.host,
        "port": httpServer.port,
        "path": "/api/me",
        "method": "PUT",
        "headers": {}
    };
    options.headers["Authorization"] = "Bearer " + user.token;
    options.data = JSON.stringify(user);

    httpRequest.putAsync(options)
        .then(function(response) {
            response = JSON.parse(response);
            assert.isObject(response, "Update profile does not return object!");
            var getProfileAsync = promises.promisify(getProfile);
            return getProfileAsync(user);
        })
        .then(function(response) {
            done(null, response);
        })
        .catch(function(err) {
            done(err);
        });
};

var updateSecurity = function(user, password, done) {
    var options = {
        "host": httpServer.host,
        "port": httpServer.port,
        "path": "/api/me/security",
        "method": "PUT",
        "headers": {}
    };

    options.headers["Authorization"] = "Bearer " + user.token;
    options.data = JSON.stringify({
        "old-password": user.password,
        "new-password": password
    });

    httpRequest.putAsync(options)
        .then(function(response) {
            response = JSON.parse(response);
            assert.isObject(response, "Update security does not return object!");
            done(null, response);
        })
        .catch(function(err) {
            done(err);
        });
};

var logoutUser = function(user, done) {
    var options = {
        "host": httpServer.host,
        "port": httpServer.port,
        "path": "/api/me/logout",
        "method": "GET",
        "headers": {}
    };

    options.headers["Authorization"] = "Bearer " + user.token;

    httpRequest.getAsync(options)
        .then(function(response) {
            response = JSON.parse(response);
            assert.isObject(response, "Logout response is not an object");
            done(null, response);
        })
        .catch(function(err) {
            done(err);
        });
};

module.exports = {
    "registerUser": registerUser,
    "loginUser": loginUser,
    "getProfile": getProfile,
    "updateProfile": updateProfile,
    "updateSecurity": updateSecurity,
    "logoutUser": logoutUser
};
