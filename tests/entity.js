"use strict";

var mongoose = require("mongoose");

var entitySchema = new mongoose.Schema({"name": String});
module.exports = mongoose.model("Entity", entitySchema);
