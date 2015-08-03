"use strict";

var code = require("..");

module.exports = {
    "Application Start": {
        "Throws Exception": function(test) {
            test.expect(1);
            test.throws(function() {
                code();
            });
            test.done();
        }
    }
};
