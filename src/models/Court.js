const mongoose = require("mongoose");

const courtSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sport: { type: String, required: true },
  location: String,
  opensAt: { type: Number, default: 8 },
  closesAt: { type: Number, default: 22 }
});

module.exports = mongoose.model("Court", courtSchema);
