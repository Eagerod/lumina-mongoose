"use strict";

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

module.exports = {
    "Succeeds on non-running route": function(test) {
        testRoute(test, "", 200, {});
    },
    "Fetches entity from route": function(test) {
        var obj = new Entity({name: "abc"});
        obj.save(function(err) {
            if ( err ) {
                console.log(err);
                test.ok(false);
            }
            testRoute(test, "/" + obj.id, 200, {name: "abc", _id: obj.id});
        });
    },
    "Entity not found": function(test) {
        testRoute(test, "/507f1f77bcf86cd799439011", 404, {code: "NotFoundError", message: "Object of type Entity (507f1f77bcf86cd799439011) not found."});
    },
    "Invalid object Id": function(test) {
        testRoute(test, "/abc123", 404, {code: "NotFoundError", message: "Object of type Entity (abc123) not found."});
    }
};
