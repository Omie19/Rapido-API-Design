/*
 * Version		: 0.0.1
 * Description	: Test cases for "/user"
 *
 */

"use strict";

var assert = require("chai").assert,
    promises = require("bluebird"),
    users = require(__dirname + "/../config.js").users,
    userflow = promises.promisifyAll(require(__dirname + "/../apis/userflow.js"));

describe("User APIs", function() {
    before(function(done) {
        done();
    });

    var user = users[0];

    it("Registering user with email " + user.email, function(done) {
        userflow.registerUserAsync(user)
            .then(function(response){
                assert.exists(response.id, "User should have an id after successful registration");
                user.id = response.id;
                done();
            })
            .catch(function(err){
                done(err);
            });
    });

    it("Login", function(done) {
        userflow.loginUserAsync(user)
            .then(function(response){
                assert.exists(response.token, "Login should return bearer token");
                assert.exists(response.user.id, "Login should return user id");
                assert.equal(response.user.email, user.email, "Login should return user email back");
                assert.equal(response.user.firstname, user.firstname, "Login should return user firstname");
                assert.equal(response.user.lastname, user.lastname, "Login should return user lastname");
                assert.isFalse(response.user.isverified, "Login should return user user status");
                user.token = response.token;
                done();
            })
            .catch(function(err){
                done(err);
            });
    });

    it("Access a protected resource using token", function(done) {
        userflow.getProfileAsync(user)
            .then(function(response){
                assert.exists(response.id, "Me should return user id");
                assert.equal(response.email, user.email, "Me should return user email back");
                assert.equal(response.firstname, user.firstname, "Me should return user firstname");
                assert.equal(response.lastname, user.lastname, "Me should return user lastname");
                assert.isFalse(response.isverified, "Me should return user user status");
                done();
            })
            .catch(function(err){
                done(err);
            });
    });

    it("Invalidate a token", function(done) {
        userflow.logoutUserAsync(user)
            .then(function(response){
                done();
            })
            .catch(function(err){
                done(err);
            });
    });

    it("Access a protected resource using token should fail now", function(done) {
        // Negetive testcase,
        // Call done when expected error

        userflow.getProfileAsync(user)
            .then(function(response){
                done("Able to access resource after logout");
            })
            .catch(function(err){
                assert.equal(401, err.code, "Unauthorized access should return 401 error");
                delete user.token;
                done(null);
            });
    });

    it("Login again", function(done) {
        userflow.loginUserAsync(user)
            .then(function(response){
                assert.exists(response.token, "Login should return bearer token");
                assert.exists(response.user.id, "Login should return user id");
                assert.equal(response.user.email, user.email, "Login should return user email back");
                assert.equal(response.user.firstname, user.firstname, "Login should return user firstname");
                assert.equal(response.user.lastname, user.lastname, "Login should return user lastname");
                assert.isFalse(response.user.isverified, "Login should return user user status");
                user.token = response.token;
                done();
            })
            .catch(function(err){
                done(err);
            });
    });

    it("Update firstname, lastname and verify", function(done) {
        user.firstname = "New firstname";
        user.lastname = "New lastname";

        userflow.updateProfileAsync(user)
            .then(function(response){
                assert.exists(response.id, "User should have an id after successful registration");
                done();
            })
            .catch(function(err){
                done(err);
            });
    });

    it("Update password", function(done) {
        userflow.updateSecurityAsync(user, "newpassword")
            .then(function(response){
                done();
            })
            .catch(function(err){
                done(err);
            });
    });

    it("All tokens should automatically be invalidated now", function(done) {
        // Negetive testcase,
        // call done when expected error
        userflow.getProfileAsync(user)
            .then(function(response){
                done("Able to access resource after update password");
            })
            .catch(function(err){
                assert.equal(401, err.code, "Unauthorized access should return 401 error");
                delete user.token;
                done(null);
            });
    });

    it("Able to login with new password", function(done) {
        user.password = "newpassword";
        userflow.loginUserAsync(user)
            .then(function(response){
                assert.exists(response.token, "Login should return bearer token");
                assert.exists(response.user.id, "Login should return user id");
                assert.equal(response.user.email, user.email, "Login should return user email back");
                assert.equal(response.user.firstname, user.firstname, "Login should return user firstname");
                assert.equal(response.user.lastname, user.lastname, "Login should return user lastname");
                assert.isFalse(response.user.isverified, "Login should return user user status");
                user.token = response.token;
                done();
            })
            .catch(function(err){
                done(err);
            });
    });

    it("Able to access resource with new token", function(done) {
        userflow.getProfileAsync(user)
            .then(function(response){
                assert.exists(response.id, "Me should return user id");
                assert.equal(response.email, user.email, "Me should return user email back");
                assert.equal(response.firstname, user.firstname, "Me should return user firstname");
                assert.equal(response.lastname, user.lastname, "Me should return user lastname");
                assert.isFalse(response.isverified, "Me should return user user status");
                done();
            })
            .catch(function(err){
                done(err);
            });
    });

    it("Logout", function(done) {
        userflow.logoutUserAsync(user)
            .then(function(response){
                done();
            })
            .catch(function(err){
                done(err);
            });
    });

    after(function(done) {
        done();
    });
});
