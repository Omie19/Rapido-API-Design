/*
 * Version		: 0.0.1
 * Description	: Utility to generate export json
 *
 */

var _ = require("lodash");
var exportJson =  function exportJson() {}
var propertyObj = {};
// Create swagger file
exportJson.prototype.createSwagger = function (obj, reqProtocol, reqHost) {

    var swaggerDefinition = {
        info: {
            title: 'Rapido API',
            version: '1.0.0',
            description: 'Develop new apis',
        },
        schemes: ["https"],
        host: "jsonplaceholder.typicode.com",
        basePath: '/',
        swagger: '2.0'
    };
    var swaggerSpec = swaggerDefinition;
    var paths = {};
    var properties = {};
    var outerDefinitions = {};
    var definitions = {};
    var i = 2;
    _.each(obj, function (data, fullPath) {
        var methods = {};
        var parameters = [];
        var responses = {};
        var found = [],
            rxp = /{([^}]+)}/g,
            mat;
        var format = /[?]/;
        var formatparam = /[&]/;
        var innerparameters = [];
        /*Test url path contains path parameters */
        while (mat = rxp.exec(fullPath)) {
            found.push(mat[1]);
        }
        if (found != []) {
            _.each(found, function (val, i) {
                if ((typeof val) === "number") {
                    innerparameters.push({ "name": val, "in": "path", "description": "", "required": true, "type": "integer", "format": "int64" });
                }
                else {
                    innerparameters.push({ "name": val, "in": "path", "description": "", "required": true, "type": "string" });

                }

            })
        }


        /*Test url path contains query parameters */
        if (format.test(fullPath) === true) {
            var parametersquery = fullPath.substring(fullPath.indexOf("?") + 1);

            /*Test url path contains multiple query parameters */
            if (formatparam.test(parametersquery) === true) {

                var res = parametersquery.split("&");
                _.each(res, function (v, i) {
                    var resquery = v.split("=");
                    var isnum = /^\d+$/.test(parseInt(resquery[1]));
                    /*Test url path query parameters  datatype*/

                    if (isnum === true) {
                        innerparameters.push({ "name": resquery[0], "in": "query", "description": "", "required": true, "type": "integer", "format": "int64" });

                    } else {
                        innerparameters.push({ "name": resquery[0], "in": "query", "description": "", "required": true, "type": "string" });

                    }


                });
            } else {

                var resquery = parametersquery.split("=");
                var isnum = /^\d+$/.test(parseInt(resquery[1]));

                /*Test url path query parameters  datatype*/
                if (isnum === true) {
                    innerparameters.push({ "name": resquery[0], "in": "query", "description": "", "required": true, "type": "integer", "format": "int64" });

                } else {
                    innerparameters.push({ "name": resquery[0], "in": "query", "description": "", "required": true, "type": "string" });

                }

            }
        }

        _.each(obj[fullPath], function (innerData, method) {

/*           var firstParam = definition(innerData["fullPath"], i);
 */ 

        var firstParam = "data"+method+i;
 
    var definition1 = {};
            if (!isEmpty(innerData["responses"])) {
                propertyObj = definitionProperties(innerData["responses"], typeof innerData["responses"]);
            }
            if (!isEmpty(innerData.request)) {
                if (method != "GET") {
                    parameters.push({
                        "name": "body", "in": "body", "description": "", "required": true,
                        schema: {
                            $ref: '#/definitions/' + firstParam
                        }
                    });
                }
            }
            if (method === 'GET') {
                methods[method.toLowerCase()] = {
                    "tags": ["api"],
                    "summary": innerData.summary,
                    "description": innerData.summary,
                    "produces": [
                        "application/json",
                        "application/xml"
                    ],
                    "responses": {
                        "200": {
                            "description": "successfull",
                            "schema": {
                                "$ref": "#/definitions/" + firstParam
                            }
                        },
                        "400": {
                            "description": "Invalid ID supplied"
                        },
                        "404": {
                            "description": "Pet not found"
                        },
                        "405": {
                            "description": "Validation exception"
                        }
                    }



                }
            } else {
                methods[method.toLowerCase()] = {
                    "tags": ["api"],
                    "summary": innerData.summary,
                    "description": innerData.summary,
                    "produces": [
                        "application/json",
                        "application/xml"
                    ],
                    "consumes": [
                        "application/json",
                        "application/xml"
                    ],
                    "parameters": parameters,
                    "responses": {
                        "200": {
                            "description": "successfull",
                            "schema": {
                                "$ref": "#/definitions/" + firstParam
                            }
                        },
                        "400": {
                            "description": "Invalid ID supplied"
                        },
                        "404": {
                            "description": "Pet not found"
                        },
                        "405": {
                            "description": "Validation exception"
                        }
                    }
                }

            }

            definition1["type"] = (_.isArray(innerData["responses"])) ? "array" : typeof innerData["responses"];
            var prop = (definition1["type"] == "array" ? "items" : "properties");
            if(prop == "items") {
                var newPropObj = {};
                newPropObj.type = "object";
                newPropObj.properties = propertyObj;
                definition1[prop] = newPropObj;    
            } else {
                definition1[prop] = propertyObj;
            }
            
            definitions[firstParam] = definition1;
        });
    
        outerDefinitions = definitions;          
        if(!isEmpty(innerparameters)) {
            methods["parameters"]=innerparameters;
        }
        fullPath = fullPath.replace("?" + fullPath.substring(fullPath.indexOf("?") + 1), '');
        paths[fullPath.toLowerCase()] = methods;
        swaggerSpec["paths"] = paths;
        swaggerSpec["definitions"] = outerDefinitions;
        swaggerSpec["externalDocs"] = {
            "description": "Find out more about Api",
            "url": 'https://jsonplaceholder.typicode.com/'
        }
        i++;
        propertyObj = {};
    });
    return swaggerSpec;
}
var definition = function (path, i) {


    var splitString = path.split("/");
    var str = splitString[i];    
    
    if(str.indexOf("{") != -1) {
        var j = i+1;
        str = splitString[j];
    }
    if(str.indexOf("?") != -1) {
        var splitString = str.split("?");
        var str = splitString[0];
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
}
var isEmpty = function (obj) {
    var flag = true;
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            flag = false
    }
    return flag;
}
var definitionProperties = function (data, key) {

    var type = typeof data;
    if (_.isArray(data)) {
        arrayProperty(data);
    } else if (type === "object") {
        objectProperty(data);
    } else {
        propertyObj[key] = propertyData(data)
    }
    return propertyObj;
}
var arrayProperty = function (arr) {

    _.each(arr, function (value, index) {
        var type = typeof value;
        if (_.isArray(arr)) {
            return arrayProperty(value);
        } else if (type === "object") {
            objectProperty(value);
        } else {
            propertyObj[index] = propertyData(typeof value);
        }
    });
    return propertyObj;
}
var objectProperty = function (obj) {

    _.each(obj, function (value, index) {
        var type = typeof value;

        if (type === "object") {
            return objectProperty(value);
        } else {
            propertyObj[index] = propertyData(typeof value);
        }
    });
    return propertyObj;

}
var propertyData = function (type) {

    var newObj = {};
    if (type == "number") {
        newObj = { "type": "integer", "format": "int64" }
    }
    else {
        newObj = { "type": type }
    }
    return newObj;
}
// Create postmancollection file
exportJson.prototype.createPostmanCollection = function (obj, baseUrl) {
    var date = new Date();
    var timeStamp = date.getTime();
    var baseId = Math.random().toString(36).slice(2);
    var postmanSpec = {
        "id": baseId,
        "name": "RapidoApi",
        "description": "",
        "orders": [],
        "folders": [],
        "timestamp": timeStamp,
        "owner": "RapidoApi",
        "public": false,
        "requests": []
    };
    _.each(obj, function (pathData, fullPath) {
        _.each(pathData, function (data, method) {
            var incVal = Math.random().toString(36).slice(2);
            postmanSpec.orders.push(incVal);
            var url = "";
            var queryString = "";
            if (method.toLowerCase() == "get" || method.toLowerCase() == "delete") {
                _.each(data.request, function (value, index) {
                    queryString += index + "=" + value + "&"
                });
                var lastIndex = queryString.lastIndexOf("&");
                queryString = queryString.substring(0, lastIndex);
                url = baseUrl + fullPath + "?" + queryString;
            } else {
                url = baseUrl + fullPath;
            }
            postmanSpec.requests.push({
                "id": incVal,
                "headers": "Content-Type: application/json",
                "url": url,
                "pathVariables": {},
                "preRequestScript": null,
                "method": method,
                "collectionId": baseId,
                "data": [],
                "dataMode": "raw",
                "name": url,
                "description": data.description ? data.description : "",
                "descriptionFormat": "html",
                "time": timeStamp,
                "version": 2,
                "responses": [data.responses],
                "tests": null,
                "currentHelper": "normal",
                "helperAttributes": {},
                "rawModeData": JSON.stringify(data.request)
            });
        });
    });
    return postmanSpec;
}

module.exports = exportJson;