"use strict";

var restify = require("restify");
var mongoose = require("mongoose");

var serverSetup = require("./configureServer");

var server = restify.createServer({
    name: "Restify-Mongoose Server",
    version: "1.0.0"
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
