/*
 * Version		: 0.0.1
 * Description	: Utility to generate export json
 *
 */

"use strict";
var protocol = require("http"),
    statusCodes = require("http").STATUS_CODES;

/**
structure of the options paramater

{
    'host': "127.0.0.1",
    'port': "9001",
    'path': '/me',
    'method': 'PUT',
    'data': {}
};

**/

var _httpRequester = {
    "get": function (options, callback) {
        options.method = "GET";
        var request = protocol.request(options, function (response) {
            var data = null;
            response.setEncoding("utf8");
            response.on("data", function (chunk) {
                if (!data) data = chunk;
                else data += chunk;
            });

            response.on("end", function () {
                var errorObj = null;
                if (response.statusCode != "200") {
                    errorObj = {
                        "code": response.statusCode,
                        "path": options.path,
                        "message": statusCodes[response.statusCode]
                    };
                }
                if (callback) callback(errorObj, data);
            });
        });

        request.on("error", function (err) {
            if (callback) callback(err, null);
        });

        // Tell node we are done, so it actually executes
        request.end();
    },
    "post": function (options, callback) {
        options.method = "POST";
        if (!options.headers) options.headers = {};

        if (!options.headers["Content-Type"])
            options.headers["Content-Type"] = "application/json";

        if (!options.headers["Content-Length"])
            options.headers["Content-Length"] = Buffer.byteLength(options.data);

        // Here is the meat and potatoes for executing the request
        var request = protocol.request(options, function (response) {
            var data = null;
            response.setEncoding("utf8");
            response.on("data", function (chunk) {
                if (!data) data = chunk;
                else data += chunk;
            });

            response.on("end", function () {
                var errorObj = null;
                if (response.statusCode != "200") {
                    errorObj = {
                        "code": response.statusCode,
                        "path": options.path,
                        "message": statusCodes[response.statusCode]
                    };
                }
                if (callback) callback(errorObj, data);
            });
        });

        request.on("error", function (err) {
            if (callback) callback(err, null);
        });

        // Now that the infrastructure is setup, write the data
        request.write(options.data);

        // Tell node we are done, so it actually executes
        request.end();
    },
    "put": function (options, callback) {
        options.method = "PUT";
        if (!options.headers) options.headers = {};

        if (!options.headers["Content-Type"])
            options.headers["Content-Type"] = "application/json";

        if (!options.headers["Content-Length"])
            options.headers["Content-Length"] = Buffer.byteLength(options.data);

        // Here is the meat and potatoes for executing the request
        var request = protocol.request(options, function (response) {
            var data = null;
            response.setEncoding("utf8");
            response.on("data", function (chunk) {
                if (!data) data = chunk;
                else data += chunk;
            });

            response.on("end", function () {
                var errorObj = null;
                if (response.statusCode != "200") {
                    errorObj = {
                        "code": response.statusCode,
                        "path": options.path,
                        "message": statusCodes[response.statusCode]
                    };
                }
                if (callback) callback(errorObj, data);
            });
        });

        request.on("error", function (err) {
            if (callback) callback(err, null);
        });

        // Now that the infrastructure is setup, write the data
        request.write(options.data);

        // Tell node we are done, so it actually executes
        request.end();
    },
    "delete": function (options, callback) {
        options.method = "DELETE";
        var request = protocol.request(options, function (response) {
            var data = null;
            response.setEncoding("utf8");
            response.on("data", function (chunk) {
                if (!data) data = chunk;
                else data += chunk;
            });

            response.on("end", function () {
                var errorObj = null;
                if (response.statusCode != "200") {
                    errorObj = {
                        "code": response.statusCode,
                        "path": options.path,
                        "message": statusCodes[response.statusCode]
                    };
                }
                if (callback) callback(errorObj, data);
            });
        });

        request.on("error", function (err) {
            if (callback) callback(err, null);
        });

        // Tell node we are done, so it actually executes
        request.end();
    }
};

module.exports = _httpRequester;
