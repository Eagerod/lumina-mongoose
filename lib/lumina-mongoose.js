"use strict";

var restify = require("restify");
var mongoose = require("mongoose");
var async = require("async");

/**
    @class FetchContext
    @classdesc A simple container class that holds a description on how to
    fetch entities from a routing parameter.

    @property routeKey {String} The name of the property that will be extracted
    from the request routing parameters for an object ID to fetch from the
    database.
    @property model {Mongoose.Model} A Mongoose Model entity that will be used
    to fetch from the database.
    @property requestKey {String} The name of the property of the Restify
    request entity that the fetched entity will be put into.
*/
function FetchContext(routeKey, model, requestKey) {
    this.routeKey = routeKey;
    this.model = model;
    this.requestKey = requestKey;
}

FetchContext.prototype.run = function(req, cb) {
    var self = this;

    var objId = req.params[self.routeKey];

    if ( !mongoose.Types.ObjectId.isValid(objId) ) {
        return cb(new restify.NotFoundError("Object of type " + self.model.collectionName + " (" + objId + ") not found."));
    }

    var query = {
        _id: new mongoose.Types.ObjectId(objId)
    };
    self.model.findOne(query, function(err, object) {
        if ( err ) {
            return cb(err);
        }
        if ( object === null ) {
            return cb(new restify.NotFoundError("Object of type " + self.model.collectionName + " (" + objId + ") not found."));
        }
        req[self.requestKey] = object;
        cb();
    });
};

module.exports.FetchContext = FetchContext;
module.exports.fetchObjectsFromRoute = function() {
    return function(ctxs) {
        if ( !(ctxs instanceof Array) ) {
            throw new Error("FetchContexts must be an array.");
        }
        return function(req, res, next, pass) {
            async.each(ctxs, function(ctx, cb) {
                ctx.run(req, cb);
            },
            function(err) {
                if ( err ) {
                    return next(err);
                }
                return pass();
            });
        };
    };
};
