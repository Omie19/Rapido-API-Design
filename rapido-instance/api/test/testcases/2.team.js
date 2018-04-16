/*
 * Version		: 0.0.1
 * Description	: Test cases for "/user"
 *
 */

"use strict";

var assert = require("chai").assert,
    promises = require("bluebird"),
    teams = require(__dirname + "/../config.js").teams,
    users = require(__dirname + "/../config.js").users,
    projectflow = promises.promisifyAll(require(__dirname + "/../apis/projectflow.js")),
    teamflow = promises.promisifyAll(require(__dirname + "/../apis/teamflow.js")),
    userflow = promises.promisifyAll(require(__dirname + "/../apis/userflow.js"));

describe("Team APIs", function() {
    before(function(done) {
        done();
    });

    // var project = projects[0];
    var user = users[0];
    var team = teams[0];

    it("Login user " + user.email, function(done) {
        userflow.loginUserAsync(user)
            .then(function(response){
                user.token = response.token;
                done();
            })
            .catch(function(err){
                done(err);
            });
    });

    it("Create new team " + team.name, function(done) {
        teamflow.createTeamAsync(user, team)
            .then(function(response){
                assert.exists(response.id, "Successfully created team should have id returned");
                team.id = response.id;
                done();
            })
            .catch(function(err){
                done(err);
            });
    });


    it("Create a second team with same name should fail", function(done) {

        // Negetive testcase,
        // Call done when expected error

        teamflow.createTeamAsync(user, team)
            .then(function(response){
                done("Should not be creating team with existing name for same user");
            })
            .catch(function(err){
                assert.equal(500, err.code, "Internal server error should be thrown");
                done(null);
            });
    });

    it("Create a second team with different name", function(done) {
        teamflow.createTeamAsync(user, teams[1])
            .then(function(response){
                teams[1].id = response.id;
                assert.exists(response.id, "Successfully created team should have id returned");
                done();
            })
            .catch(function(err){
                done(err);
            });
    });

    it("Get user teams", function(done) {
        teamflow.getUserTeamsAsync(user)
            .then(function(response){
                assert.equal(2, response.length, "There should be exactly two teams");
                assert.isTrue((response[0].name == teams[0].name || response[0].name == teams[1].name), "Team name mismatch" + response[0].name);
                assert.isTrue((response[1].name == teams[0].name || response[1].name == teams[1].name), "Team name mismatch" + response[1].name);
                done();
            })
            .catch(function(err){
                done(err);
            });
    });

    it("Update first team", function(done) {
        team.name = "got a new team";
        teamflow.updateTeamAsync(user, team)
            .then(function(response){
                assert.exists(response.id, "Successfully updated team should have id returned");
                done();
            })
            .catch(function(err){
                done(err);
            });
    });

    it("Retrive and verify update of team", function(done) {
        team.name = "got a new team";
        teamflow.getOneTeamAsync(user, team)
            .then(function(response){
                assert.equal(response.name, team.name, "Team name updation was not proper");
                done();
            })
            .catch(function(err){
                done(err);
            });
    });

    it("Create a new user with email " + users[1].email, function(done) {
        userflow.registerUserAsync(users[1])
            .then(function(response){
                assert.exists(response.id, "User should have an id after successful registration");
                users[1].id = response.id;
                done();
            })
            .catch(function(err){
                done(err);
            });
    });

    it("Add member to team", function(done) {
        var member = {
            "id": users[1].id,
            "access": "ADMIN"
        };
        teamflow.addMemberToTeamAsync(user, team, member)
            .then(function(response){
                done();
            })
            .catch(function(err){
                done(err);
            });
    });

    it("Update members role", function(done) {
        var member = {
            "id": users[1].id,
            "access": "MEMBER"
        };
        teamflow.updateMemberOfTeamAsync(user, team, member)
            .then(function(response){
                done();
            })
            .catch(function(err){
                done(err);
            });
    });

    it("Remove member", function(done) {
        var member = {
            "id": users[1].id
        };
        teamflow.removeMemberFromTeamAsync(user, team, member)
            .then(function(response){
                done();
            })
            .catch(function(err){
                done(err);
            });
    });

    it("Delete team and check", function(done) {
        var member = {
            "id": users[1].id
        };
        teamflow.deleteTeamAsync(user, teams[1])
            .then(function(response){
                teamflow.getOneTeamAsync(user, teams[1])
                    .then(function(response){
                        done("Team not deleted successfully");
                    })
                    .catch(function(err) {
                        assert.equal(500, err.code, "Internal server error should be thrown");
                        done(null);
                    });
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
