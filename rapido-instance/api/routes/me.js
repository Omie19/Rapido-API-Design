/*
 * Version		: 0.0.1
 * Description	: All routes for "/me"
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

router.get("/", authenticator.authenticate, function(request, response, next) {
    request.params.id = request.user.id;
    userService.get(request, response, next);
});

router.put("/", authenticator.authenticate, function(request, response, next) {
    request.params.id = request.user.id;
    userService.update(request, response, next);
});

router.delete("/", authenticator.authenticate, function(request, response, next) {
    request.params.id = request.user.id;
    userService.delete(request, response, next);
});

router.get("/verifyemail", authenticator.authenticate, function(request, response, next) {
    request.params.id = request.user.id;
    userService.verifyemail(request, response, next);
}); // get email with verification link

router.get("/logout", authenticator.authenticate, function(request, response, next) {
    request.params.id = request.user.id;
    request.params.secret = request.user.secret;
    if (request.query.all) {
        userService.invalidateAllTokenForUser(request, response, next);
    } else {
        userService.invalidateTokenForUser(request, response, next);
    }
});

router.put("/security", authenticator.authenticate, function(request, response, next) {
    request.params.id = request.user.id;
    userService.updateSecurity(request, response, next);
});

module.exports = router;
