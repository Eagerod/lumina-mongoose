"use strict";

var async = require("async");
var mock = require("nodeunit-mock");
var request = require("request");

var Entity = require("./entity");

function testRoute(test, route, expectStatusCode, expectBody) {
    var testCount = 6;
    test.expect(testCount);
    request({uri: "http://localhost:8080/fetch" + route, method: "GET"}, function(err, resp, body) {
        if ( typeof body === "string" && body.length > 0 ) { // Request is a finicky package.
            body = JSON.parse(body);
        }
        test.ifError(err);
        test.equal(resp.statusCode, expectStatusCode);
        test.equal(expectBody.name, body.name);
        test.equal(expectBody._id, body._id);
        test.equal(expectBody.code, body.code);
        test.equal(expectBody.message, body.message);
        test.done();
    });
}

module.exports.FetchContext = {
    "Succeeds on non-running route": function(test) {
        testRoute(test, "", 200, {});
    },
    "Fetches entity from route": function(test) {
        var obj = new Entity({name: "abc"});
        obj.save(function(err) {
            if ( err ) {
                console.log(err);
                test.ok(false);
                return test.done();
            }
            testRoute(test, "/" + obj.id, 200, {name: "abc", _id: obj.id});
        });
    },
    "Entity not found": function(test) {
        testRoute(test, "/507f1f77bcf86cd799439011", 404, {code: "NotFoundError", message: "Object of type Entity (507f1f77bcf86cd799439011) not found."});
    },
    "Invalid object Id": function(test) {
        testRoute(test, "/abc123", 404, {code: "NotFoundError", message: "Object of type Entity (abc123) not found."});
    },
    "Datastore failure": function(test) {
        mock(test, Entity, "findOne", function(query, cb) {
            return cb(new Error("Failed to database"));
        });
        testRoute(test, "/507f1f77bcf86cd799439011", 500, {code: "InternalError", message: "Failed to database"});
    }
};

module.exports.FetchQueryContext = {
    "Fetches entities from route": function(test) {
        var objs = [];
        objs.push(new Entity({name: "abc"}));
        objs.push(new Entity({name: "123"}));
        async.eachSeries(objs, function(obj, cb) {
            obj.save(cb);
        }, function(err) {
            if ( err ) {
                console.log(err);
                test.ok(false);
                return test.done();
            }
            testRoute(test, "all", 200, [{name: "abc", _id: objs[0].id}, {name: "123", _id: objs[1].id}]);
        });
    },
    "Fetches actually applies query": function(test) {
        var objs = [];
        objs.push(new Entity({name: "abc"}));
        objs.push(new Entity({name: "123"}));
        async.eachSeries(objs, function(obj, cb) {
            obj.save(cb);
        }, function(err) {
            if ( err ) {
                console.log(err);
                test.ok(false);
                return test.done();
            }
            testRoute(test, "abc", 200, [{name: "abc", _id: objs[0].id}]);
        });
    }
};
