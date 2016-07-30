"use strict";

var restify = require("restify");
var mongoose = require("mongoose");

var serverSetup = require("./configureServer");

var server = restify.createServer({
    name: "Restify-Mongoose Server",
    version: "1.0.0",
    formatters: {
        "application/json": function(req, res, body, cb) {
            // Have to also set up a custom formatter for errors, since we want restify and express to behave
            // simliarly enough that they can be tested with the same tests.
            if (body instanceof Error) {
                res.statusCode = 500;

                body = {
                    code: "InternalError",
                    message: body.message
                };
            }
            var data = JSON.stringify(body);
            res.setHeader("Content-Length", Buffer.byteLength(data));

            return cb(null, data);
        }
    }
});

server.use(restify.bodyParser());

serverSetup(server);

module.exports = require("./luminaConfig");

module.exports.setUp = function(done) {
    server.listen(8080, function() {
        mongoose.connect("mongodb://localhost:27017/luminamongoosetestdb");
        mongoose.connection.once("open", done);
    });
};

module.exports.tearDown = function(done) {
    server.close(function() {
        mongoose.connection.close(done);
    });
};
