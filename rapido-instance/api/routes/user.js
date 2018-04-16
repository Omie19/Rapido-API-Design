/*
 * Version		: 0.0.1
 * Description	: All routes for "/user"
 *
 */

"use strict";

var userService = import_services("userService.js"),
    authenticator = import_services("authenticator.js"),
    express = require("express"),
    router = express.Router();
/*
 * Middleware that is specific to this router
 * Perform authentication etc here.
 */
router.use(authenticator.initialize());

// Unprotected routes.

router.post("/", userService.register);  // create new user
router.get("/verify/:token", userService.verify); // activate via email
router.post("/forgotpassword", userService.forgotpassword); // get password recovery email
router.post("/resetpassword", userService.resetpassword); // reset password via token

// CRUD user
router.get("/", authenticator.authenticate, userService.fetch);   // search users by passing filters as ?filter=partha
router.get("/:id", authenticator.authenticate, userService.get);
router.put("/:id", authenticator.authenticate, userService.update);
router.delete("/:id", authenticator.authenticate, userService.delete);

// security
router.get("/:id/verifyemail", authenticator.authenticate, userService.verifyemail); // get email with verification link
router.delete("/:id/token/:secret", authenticator.authenticate, userService.invalidateTokenForUser);

module.exports = router;
