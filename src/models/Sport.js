const mongoose = require("mongoose");

const sportSchema = new mongoose.Schema({
  name: { type: String, required: true },        
  type: { type: String, enum: ["indoor", "outdoor"], required: true }
});

module.exports = mongoose.model("Sport", sportSchema);
