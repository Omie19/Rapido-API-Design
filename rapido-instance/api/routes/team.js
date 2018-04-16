/*
 * Version		: 0.0.1
 * Description	: All routes for "/team"
 *
 */

"use strict";

var teamService = import_services("teamService.js"),
    authenticator = import_services("authenticator.js"),
    express = require("express"),
    router = express.Router();
/*
 * Middleware that is specific to this router
 * Perform authentication etc here.
 */
router.use(authenticator.initialize());

router.post("/", authenticator.authenticate, teamService.create); // Create a team
router.get("/", authenticator.authenticate, teamService.fetch); // get all relavant teams for current user
router.get("/:id", authenticator.authenticate, teamService.get); // get all details of a perticular team
router.put("/:id", authenticator.authenticate, teamService.update); // Update team name, description, capacity
router.delete("/:id", authenticator.authenticate, teamService.delete); // delete a team

router.post("/:id/member", authenticator.authenticate, teamService.addMember); // Add an user to a team
router.put("/:teamid/member/:userid", authenticator.authenticate, teamService.updateMember); // Change team member's permission
router.delete("/:teamid/member/:userid", authenticator.authenticate, teamService.removeMember); // Remove member from a team

module.exports = router;
