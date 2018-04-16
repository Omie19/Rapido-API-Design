/*
 * Version		: 0.0.1
 * Description	: Model for user management
 *
 */

"use strict";

var logger = import_utils("logger.js").getLoggerObject(),
    promises = require("bluebird"),
    db = promises.promisifyAll(import_utils("db.js")()),
    queries = import_templates("sql.js")["user"];


var model = {
    "create": (user, callback) => {
        db.executeAsync(queries.insert, [user.email, user.password, user.firstname, user.lastname, user.isverified])
            .then(function(data){
                if(data.rows && data.rows.length > 0) {
                    logger.debug("user record created with Id", data.rows[0].id);
                    callback(null, data.rows[0].id);
                } else {
                    callback(new Error("Could not create user with email" + user.email));
                }
                return;
            })
            .catch(function(err){
                logger.error("Error creating user record", err.message);
                callback(err);
            });
    },
    "read": (user, callback) => {
        db.executeAsync(queries.select, [user.email])
            .then(function(data){
                if(data.rows && data.rows.length > 0) {
                    logger.debug("User with email", user.email, "fetched. Id", data.rows[0].id);
                    return callback(null, data.rows[0]);
                } else {
                    return callback(null, null);
                }
            })
            .catch(function(err){
                logger.error("Error while reading user record", err.message);
                callback(err);
            });
    },
    "search": (filter, callback) => {
        db.connection()("users")
            .where("email", "ilike", "%"+ filter +"%")
            .orWhere("firstname", "ilike", "%"+ filter +"%")
            .orWhere("lastname", "ilike", "%"+ filter +"%")
            .select("id", "email", "firstname", "lastname")
            .limit(15)
            .then(function(data){
                logger.debug("User search matched", data.length, "records");
                return callback(null, data);
            })
            .catch(function(err){
                logger.error("Error while searching user", err.message);
                callback(err);
            });
    },
    "readById": (user, callback) => {
        db.executeAsync(queries.selectById, [user.id])
            .then(function(data){
                if(data.rows && data.rows.length > 0) {
                    logger.debug("User with id", user.id, "fetched");
                    return callback(null, data.rows[0]);
                } else {
                    return callback(null, null);
                }
            })
            .catch(function(err){
                logger.error("Error while reading user record", err.message);
                callback(err);
            });
    },
    "update": (user, callback) => {
        var userid = user.id;
        delete user.id;

        db.connection()("users")
            .where("id", "=", userid)
            .update(user)
            .returning("id")
            .then(function(data) {
                if (data) {
                    logger.debug("profile save for", userid);
                    user.id = userid;
                    callback(null, user);
                } else {
                    callback(new Error("Could not update user with id" + userid));
                }
                return;
            })
            .catch(function(err) {
                logger.error("Error updatinng profile", err.message);
                callback(err);
            });
    },
    "deleteFromTokens": (user, callback) => {

        db.executeAsync(queries.deleteFromTokens, [user.id, user.secret])
            .then(function() {
                callback(null, true);
                return;
            })
            .catch(function(err) {
                logger.error("Error removing secret", err.message);
                callback(err);
            });
    },
    "deleteAllTokens": (user, callback) => {
        db.executeAsync(queries.deleteAllSecretsByUserId, [user.id])
            .then(function() {
                callback(null, true);
                return;
            })
            .catch(function(err) {
                logger.error("Error removing all secrets", err.message);
                callback(err);
            });
    },
    "createVerifyRecord": (user, callback) => {
        db.executeAsync(queries.selectFromVerifyByUserId, [user.id])
            .then(function(data) {
                if(data.rows && data.rows.length > 0) {
                    user.token = data.rows[0].verifytoken;
                    return;
                } else {
                    return db.executeAsync(queries.insertIntoVerify, [user.id, user.token]);
                }
            })
            .then(function(data){
                logger.debug("userverify record created with id", user.id);
                callback(null, user.token);
                return;
            })
            .catch(function(err){
                logger.error("Error creating userverify record", err.message);
                callback(err);
            });
    },
    "verify": (user, callback) => {
        db.executeAsync(queries.selectFromVerify, [user.token])
            .then(function(data){
                if(data.rows && data.rows.length > 0) {
                    logger.debug("User with id", data.rows[0].userid, "being verified");
                    return db.executeAsync(queries.setVerified, [true, data.rows[0].userid]);
                } else {
                    throw new Error ("token not found");
                }
            })
            .then(function(data) {
                if(data.rows && data.rows.length > 0) {
                    user.id = data.rows[0].id;
                    user.isverified = data.rows[0].isverified;
                    logger.debug("User with id", user.id, "verified");
                    return db.executeAsync(queries.deleteFromVerify, [user.id]);
                } else {
                    throw new Error ("user not found for verification");
                }
            })
            .then(function(){
                callback(null, user);
                return;
            })
            .catch(function(err){
                logger.error("Error activating user record", err.message);
                callback(err);
            });
    },
    "getActiveSecrets": (user, callback) => {
        db.executeAsync(queries.getActiveSecrets, [user.id])
            .then(function(data){
                if(data.rows && data.rows.length > 0) {
                    return callback(null, data.rows);
                } else {
                    callback(null, null);
                }
            })
            .catch(function(err){
                logger.error("Error checking user isActive", err.message);
                callback(err);
            });
    },
    "addToken": (user, callback) => {
        db.executeAsync(queries.insertIntoTokens, [user.id, user.secret])
            .then(function(data){
                return callback(null, true);
            })
            .catch(function(err){
                logger.error("Error adding token for user", user.id, err.message);
                callback(err);
            });
    }
};

module.exports = promises.promisifyAll(model);
