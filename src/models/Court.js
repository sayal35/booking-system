const mongoose = require("mongoose");

const courtSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sport: { type: mongoose.Schema.Types.ObjectId, ref: "Sport", required: true },
  venue: { type: mongoose.Schema.Types.ObjectId, ref: "Venue", required: true },
  opensAt: Number,
  closesAt: Number,
});

module.exports = mongoose.model("Court", courtSchema);
