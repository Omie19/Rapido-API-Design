/*
 * Version		: 0.0.1
 * Description	: Authentication service using passport js
 *
 */

"use strict";

var logger = import_utils("logger.js").getLoggerObject(),
    schema = require("async-validator"),
    bcrypt = require("bcrypt"),
    _ = require("lodash"),
    uuidv4 = require("uuid/v4"),
    usermodel = require(__dirname + "/models/user.js"),
    promises = require("bluebird"),
    passport = require("passport"),
    jwtPassport = require("passport-jwt"),
    jwt = require("jsonwebtoken"),
    githubPassport = require("passport-github2"),
    localOpts = {};

localOpts.jwtFromRequest = jwtPassport.ExtractJwt.fromAuthHeaderAsBearerToken();
localOpts.secretOrKey = configurations.jwt.secret;

// Add local Strategy
passport.use(new jwtPassport.Strategy(localOpts, function(payload, callback) {
    usermodel.getActiveSecretsAsync(payload)
        .then(function(activeSecrets) {
            if(_.map(activeSecrets, "secret").indexOf(payload.secret) >= 0) {
                return callback(null, payload);
            } else {
                return callback(null, false);
            }
        });
}));

// Add github Strategy
passport.use(new githubPassport.Strategy(configurations.github, function(accessToken, refreshToken, profile, callback) {
    callback(null, {"firstname": profile.displayName, "email": profile.emails[0].value, "accessToken": accessToken, "username": profile.username});
}));

var authService = {
    "initialize": function() {
        return passport.initialize();
    },
    "authenticate": function(request,response,next) {
        passport.authenticate("jwt", {
            "session": false
        }, function(err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return response.status(401).json({"error":"unauthorized access"});
            }
            request.user = user;
            next();
        })(request, response, next);
    },
    "login": function(request, response, next) {
        var user = {};
        user.email = request.body.email;
        user.password = request.body.password;

        var descriptor = {
            "user": {
                "type": "object",
                "required": true,
                "fields": {
                    "email": {
                        "type": "email",
                        "required": true,
                        "message": "email missing or not valid"
                    },
                    "password": {
                        "required": true,
                        "message": "password missing"
                    }
                }
            }
        };
        var validator = promises.promisifyAll(new schema(descriptor));

        validator.validateAsync({
            "user": user
        })
            .then(function() {
                return usermodel.readAsync(user);
            })
            .then(function(userData) {
                if (userData) {
                    var suppliedpassword = user.password;
                    user = userData;
                    return bcrypt.compare(suppliedpassword, user.password);
                } else {
                    throw new Error("user with email " + user.email + " not resgitered");
                }
            })
            .then(function(validPassword) {
                if(validPassword) {
                    user.secret = uuidv4();
                    return usermodel.addTokenAsync(user);
                } else {
                    throw new Error("incorrect password");
                }
            })
            .then(function() {
                var token = jwt.sign({
                    "id": user.id,
                    "secret": user.secret
                }, configurations.jwt.secret, {
                    "expiresIn": configurations.jwt.expiry
                });
                delete user.password;
                delete user.secret;
                delete user.createdat;
                delete user.modifiedat;
                response.json({
                    "token": token,
                    "user": user
                });
            })
            .catch(function(err) {
                logger.error("Error while login:", err.message);
                response.status(401).json({
                    "message": "unauthorized access"
                });
            });
    },
    "loginWithoutPassword": function(request, response, next) {
        var user = {};
        user.email = request.user.email;
        user.password ="";
        user.firstname = request.user.firstname;
        user.lastname = "";
        user.isverified = false;

        usermodel.readAsync(user)
            .then(function(userData) {
                if (!userData) {
                    return usermodel.createAsync(user);
                } else {
                    user = userData;
                    return userData.id;
                }
            })
            .then(function(id) {
                user.id = id;
                user.secret = uuidv4();
                return usermodel.addTokenAsync(user);
            })
            .then(function() {
             
                var token = jwt.sign({
                    "id": user.id,
                    "secret": user.secret,
                    "githubToken": request.user.accessToken,
                    "githubUser": request.user.username
                }, configurations.jwt.secret, {
                    "expiresIn": configurations.jwt.expiry
                });

                response.redirect("/auth?token=" + token);
            })
            .catch(function(err) {
                logger.error("Error while login:", err.message);
                response.status(401).json({
                    "message": "unauthorized access"
                });
            });
    },

    "authenticateViaGithub": function(request,response,next) {
        passport.authenticate("github", {
            "scope": [ "user:email", "repo" ],
            "session": false
        }, function(err, user, info) {
            logger.info("#####", user,"######");
            if (err) {
                return next(err);
            }
            if (!user || !user.email) {
                return response.status(401).json({"error":"Either email not available or not authorized"});
            }
            request.user = user;
            logger.debug("Github user authenticated, passing to next handler.");
            next();
        })(request, response, next);
    }
};

module.exports = authService;
