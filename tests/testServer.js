"use strict";

var restify = require("restify");
var mongoose = require("mongoose");
var Lumina = require("lumina");
var luminamongoose = require("..");

var entitySchema = new mongoose.Schema({"name": String});
var Entity = mongoose.model("Entity", entitySchema);

module.exports.Entity = Entity;

var server = restify.createServer({
    name: "Mongoose-Fetch Server",
    version: "1.0.0"
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

var lumen = new Lumina();
lumen.use("fetchObjectsFromRoute", luminamongoose.fetchObjectsFromRoute());

function defaultHandler(req, res, next) {
    res.send(req._fetched || {});
    return next();
}

var routes = [{
    method: "get",
    path: "/fetch"
}, {
    method: "get",
    path: "/fetch/:fetchId",
    fetchObjectsFromRoute: [new luminamongoose.FetchContext("fetchId", Entity, "_fetched")]
}];

for ( var i = 0; i < routes.length; ++i ) {
    var d = routes[i];
    var m = d.method;
    var r = d.path;
    delete d.method;
    delete d.path;
    d.handler = defaultHandler;
    server[m](r, lumen.illuminate(d));
}

module.exports.server = server;
module.exports.lumen = lumen;
