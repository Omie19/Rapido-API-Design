/*
 * Name			: index.js
 * Author		: Partha Mallik (parthapratim.mallik@ca.com)
 * Version		: 0.0.1
 * Description	: The http server to handle incoming requests
 *
 */

"use strict";
/*
 * declare import functions for easy require inside the applications.
 */
global.import_services = function(name) {
    return require(__dirname + '/api/services/' + name)
}

global.import_templates = function(name) {
    return require(__dirname + '/api/templates/' + name)
}

global.import_utils = function(name) {
    return require(__dirname + '/api/utils/' + name)
}

/*
 * Other global declarations
 */

global.configurations = import_utils('configurations.js')();

/*
 * Load the configurations and other
 * modules needed for setting up the express server
 */

var logger = import_utils('logger.js').getLoggerObject(),
    express = require('express'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    debounce = require('connect-debounce'),
    timeout = require('connect-timeout'),
    server = express(),
    mailer = require('express-mailer'),
    fs = require('fs');

var routes = __dirname + "/api/routes";

mailer.extend(server, configurations.email);
server.set('views', __dirname + "/api/views");
server.set('view engine', 'ejs');

server
    .use(debounce()) // To prevent DOS and DDOS attacks
    .use(cors()) // Enable CORS
    .use(timeout(10000)) // Do't want server to take more than 10 seconds to respond
    .use(bodyParser.json()) // Accepts json body max to 100 kb default
    .use(bodyParser.text()) // Accepts text body max to 100 kb default
    .use(bodyParser.urlencoded({
        'extended': true
    })); // Parse urlencoded body with qs library

/*
 * Load all the routes
 * Keeping it sync to ensure all routes are loaded before the server starts listening.
 */

server.use(function(req, res, next) {
    if(req.originalUrl == "/echo") {
        res.status(200).send();
    } else if(req.originalUrl.includes("/api")){
        logger.debug('\n**************** Incoming API request ****************',
            '\nRequest method:', req.method,
            '\nRequest path:', req.originalUrl,
            '\nRequest params:', req.params,
            '\nRequest query:', req.query,
            '\nRequest body:', req.body,
            '\n*******************************************************');
        next();
    } else {
        next();
    }
})

// All API routes

fs.readdirSync(routes).forEach(file => {
    var routeName = "/api/" + file.substr(0, file.length - 3),
        router = routes + "/" + file;
    logger.debug('Loading router router/' + file, 'for route', routeName);
    server.use(routeName, require(router));
});

// Web server ( SPA ) routes

logger.debug('Loading default router for SPA');
server.use((req, res, next) => {
    var resource = 'index.html';

    if(req.originalUrl.includes('.html')
        || req.originalUrl.includes('.woff2') || req.originalUrl.includes('.ttf')
        || req.originalUrl.includes('.eot') || req.originalUrl.includes('.svg')
    ) {
        resource = req.originalUrl.substring(req.originalUrl.lastIndexOf('/'));
        res.sendFile(__dirname + '/ui/build/' + resource);

    } else if(req.originalUrl.includes('.png')) {
          resource = req.originalUrl.substring(req.originalUrl.lastIndexOf('/'));
            res.sendFile(__dirname + '/ui/src/images' + resource);
    }else if(req.originalUrl.includes('.js')) {
        resource = req.originalUrl.substring(req.originalUrl.lastIndexOf('/'));
        resource = resource + '.gz';
        res.set('Content-Encoding', 'gzip');
        res.sendFile(__dirname + '/ui/build/' + resource);
    } else {
        res.sendFile(__dirname + '/ui/build/' + resource);
    }
    
 }); // Parse urlencoded body with qs library

server.listen(configurations['port'], function() {
    logger.info('Server started in', configurations['env'], 'mode.');
    logger.info('Database in use', configurations['database'].connection.host);
    logger.info('Listening on ', configurations['port']);
});
