"use strict";

var Lumina = require("lumina");

var luminamongoose = require("../index");

var Entity = require("./entity");

var lumen = new Lumina();
lumen.use("fetchObjectsFromRoute", luminamongoose.fetchObjectsFromRoute());
lumen.use("fetchObjectsFromQuery", luminamongoose.fetchObjectsFromQuery());

function defaultHandler(req, res, next) {
    res.status(200);
    res.write("");
    res.end();
    return next();
}

function routes() {
    return [{
        method: "get",
        path: "/fetch"
    }, {
        method: "get",
        path: "/fetch/:fetchId",
        fetchObjectsFromRoute: [new luminamongoose.FetchContext("fetchId", Entity, "_fetched")],
        handler: function(req, res, next) {
            res.status(200);
            res.send(req._fetched || {});
            return next();
        }
    }, {
        method: "get",
        path: "/fetchall",
        fetchObjectsFromQuery: [new luminamongoose.FetchQueryContext({}, Entity, "_fetched")],
        handler: function(req, res, next) {
            res.status(200);
            res.send(req._fetched || []);
            return next();
        }
    }, {
        method: "get",
        path: "/fetchabc",
        fetchObjectsFromQuery: [new luminamongoose.FetchQueryContext({name: "abc"}, Entity, "_fetched")],
        handler: function(req, res, next) {
            res.status(200);
            res.send(req._fetched || []);
            return next();
        }
    }];
}

module.exports = function(server) {
    var rt = routes();
    for ( var i = 0; i < rt.length; ++i ) {
        var d = rt[i];
        var m = d.method;
        var r = d.path;
        delete d.method;
        delete d.path;
        d.handler = d.handler || defaultHandler;
        server[m](r, lumen.illuminate(d));
    }
    return server;
};

module.exports.lumen = lumen;
