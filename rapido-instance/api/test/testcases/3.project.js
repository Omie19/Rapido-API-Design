/*
 * Version		: 0.0.1
 * Description	: Test cases for "/user"
 *
 */

"use strict";

var assert = require("chai").assert,
    promises = require("bluebird"),
    projects = require(__dirname + "/../config.js").projects,
    users = require(__dirname + "/../config.js").users,
    teams = require(__dirname + "/../config.js").teams,
    projectflow = promises.promisifyAll(require(__dirname + "/../apis/projectflow.js")),
    teamflow = promises.promisifyAll(require(__dirname + "/../apis/teamflow.js")),
    userflow = promises.promisifyAll(require(__dirname + "/../apis/userflow.js"));

describe("Project APIs", function() {
    before(function(done) {
        done();
    });

    var project = projects[0];
    var user = users[0];

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

    it("Create new project " + project.name, function(done) {
        projectflow.createProjectAsync(user, project)
            .then(function(response){
                assert.exists(response.id, "Successfully created project should have id returned");
                project.id = response.id;
                done();
            })
            .catch(function(err){
                done(err);
            });
    });

    it("Create a second project with same name should fail", function(done) {

        // Negetive testcase,
        // Call done when expected error

        projectflow.createProjectAsync(user, project)
            .then(function(response){
                done("Should not be creating project with existing name for same user");
            })
            .catch(function(err){
                assert.equal(500, err.code, "Internal server error should be thrown");
                done(null);
            });
    });

    it("Create a second project with different name", function(done) {
        projectflow.createProjectAsync(user, projects[1])
            .then(function(response){
                assert.exists(response.id, "Successfully created project should have id returned");
                projects[1].id = response.id;
                done();
            })
            .catch(function(err){
                done(err);
            });
    });

    it("Get all user projects", function(done) {
        projectflow.getUserProjectsAsync(user)
            .then(function(response){
                assert.equal(2, response.personal.length, "There should be exactly two projects");
                assert.isTrue((response.personal[0].name == projects[0].name || response.personal[0].name == projects[1].name), "Project name mismatch" + response.personal[0].name);
                assert.isTrue((response.personal[1].name == projects[0].name || response.personal[1].name == projects[1].name), "Project name mismatch" + response.personal[1].name);
                done();
            })
            .catch(function(err){
                done(err);
            });
    });

    it("Update one project", function(done) {
        project.name = "new project name";
        projectflow.updateProjectAsync(user, project)
            .then(function(response){
                done();
            })
            .catch(function(err){
                done(err);
            });
    });

    it("Get one project and verify update", function(done) {
        projectflow.getOneProjectAsync(user, project)
            .then(function(response){
                assert.equal(response.name, project.name, "Project name is not updated.");
                done();
            })
            .catch(function(err){
                done(err);
            });
    });

    it("Delete a project", function(done) {
        projectflow.deleteProjectAsync(user, project)
            .then(function(response){
                done();
            })
            .catch(function(err){
                done(err);
            });
    });

    it("Get all project should exclude the deleted project", function(done) {
        projectflow.getUserProjectsAsync(user)
            .then(function(response){
                assert.equal(1, response.personal.length, "There should be exactly one projects");
                assert.isTrue((response.personal[0].name == projects[1].name ), "Project name mismatch" + response.personal[0].name);
                done();
            })
            .catch(function(err){
                done(err);
            });
    });

    it("Add a member to users team", function(done) {
        var member = {
            "id": users[1].id,
            "access": "MEMBER"
        };
        teamflow.addMemberToTeamAsync(user, teams[0], member)
            .then(function(response){
                done();
            })
            .catch(function(err){
                done(err);
            });
    });

    it("Share a project within a team", function(done) {
        var team = {
            "id": teams[0].id,
            "access": "WRITE"
        };
        projectflow.addTeamAsync(user, projects[1], team)
            .then(function(response){
                done();
            })
            .catch(function(err){
                done(err);
            });
    });

    it("Change share priveledges of the team for the same project", function(done) {
        var team = {
            "id": teams[0].id,
            "access": "READ"
        };
        projectflow.updateTeamAsync(user, projects[1], team)
            .then(function(response){
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
