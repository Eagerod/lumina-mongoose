"use strict";

var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var serverSetup = require("./configureServer");

var server = express();

server.use(bodyParser.json());

serverSetup(server);

server.use(function(err, req, res, next) { // eslint-disable-line no-unused-vars
    res.status(500).send({code: "InternalError", message: err.message});
});

module.exports = require("./luminaConfig");

module.exports.setUp = function(done) {
    this.express = server.listen(8080, function() {
        mongoose.connect("mongodb://localhost:27017/luminamongoosetestdb");
        mongoose.connection.once("open", done);
    });
};

module.exports.tearDown = function(done) {
    this.express.close(function() {
        mongoose.connection.close(done);
    });
};
