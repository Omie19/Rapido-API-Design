/*
 * Version		: 0.0.1
 * Description	: All routes for "/login"
 *
 */

"use strict";

var authenticator = import_services("authenticator.js"),
    express = require("express"),
    router = express.Router();

router.use(authenticator.initialize());
router.post("/", authenticator.login);

router.get("/github", authenticator.authenticateViaGithub);
router.get("/github/callback", authenticator.authenticateViaGithub, authenticator.loginWithoutPassword);

module.exports = router;
