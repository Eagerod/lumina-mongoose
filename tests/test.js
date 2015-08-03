"use strict";

var request = require("request");
var mongoose = require("mongoose");
var ts = require("./testServer");

var server = ts.server;
var Entity = ts.Entity;

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

module.exports = {
    setUp: function(done) {
        mongoose.connect("mongodb://localhost:27017");
        mongoose.connection.once("open", function() {
            server.listen(8080, function() {
                done();
            });
        });
    },
    tearDown: function(done) {
        mongoose.connection.close(function() {
            server.close(function() {
                done();
            });
        });
    },
    "Succeeds on non-running route": function(test) {
        testRoute(test, "", 200, {});
    },
    "Fetches entity from route": function(test) {
        var obj = new Entity({name: "abc"});
        obj.save(function() {
            testRoute(test, "/" + obj.id, 200, {name: "abc", _id: obj.id});
        });
    },
    "Entity not found": function(test) {
        testRoute(test, "/507f1f77bcf86cd799439011", 404, {code: "NotFoundError", message: "Object of type Entity (507f1f77bcf86cd799439011) not found."});
    },
    "Invalid object Id": function(test) {
        testRoute(test, "/abc123", 404, {code: "NotFoundError", message: "Object of type Entity (abc123) not found."});
    },
    "Poorly constructed lumina function": function(test) {
        test.expect(1);
        test.throws(function() {
            ts.lumen.illuminate({
                fetchObjectsFromRoute : {},
                handler: function(req, res, next) {
                    res.send(200);
                    return next();
                }
            });
        });
        test.done();
    }
};
