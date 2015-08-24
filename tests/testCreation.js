"use strict";

var lumen = require("./configureServer").lumen;

module.exports = {
    "Poorly constructed lumina function": function(test) {
        test.expect(1);
        test.throws(function() {
            lumen.illuminate({
                fetchObjectsFromRoute: {},
                handler: function(req, res, next) {
                    res.send(200);
                    return next();
                }
            });
        });
        test.done();
    }
};
