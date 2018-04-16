var schema = require("async-validator");
var logger = import_utils("logger.js").getLoggerObject();
var promises = require("bluebird");
var _ = require("lodash");


var model = {
    "user": {

    },
    "project": {

    }
};

module.exports = function(whichmodel, data, callback) {
    var descriptor = model[whichmodel];
    var validator = promises.promisifyAll(new schema(descriptor));
    validator.validateAsync(data)
        .then(function(){ callback(null,true);})
        .catch(function(err) {
            logger.error(err);
            callback({"code":400,"message":err[0].message});
        });
};
