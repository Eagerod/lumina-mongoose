"use strict";

var request = require("request");
var mongoose = require("mongoose");
var ts = require("./testServer");

var server = ts.server;
var Entity = ts.Entity;

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
        test.expect(3)
        request({uri: "http://localhost:8080/fetch", method: "GET"}, function(err, resp, body) {
            if ( typeof body === "string" && body.length > 0 ) { // Request is a finicky package.
                body = JSON.parse(body);
            }
            test.ifError(err);
            test.equal(resp.statusCode, 200);
            test.deepEqual(body, {});
            test.done();
        });
    },
    "Fetches entity from route": function(test) {
        var obj = new Entity({name: "abc"});
        obj.save(function(err) {
            test.ifError(err);
            request({uri: "http://localhost:8080/fetch/" + obj.id, method: "GET"}, function(err, resp, body) {
                if ( typeof body === "string" && body.length > 0 ) { // Request is a finicky package.
                    body = JSON.parse(body);
                }
                test.ifError(err);
                test.equal(resp.statusCode, 200);
                test.deepEqual(body.name, obj.name);
                test.deepEqual(body._id, obj.id);
                test.done();
            });
        });
    }
};
