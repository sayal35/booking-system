const mongoose = require("mongoose");

const venueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String },
  sports: [{ type: mongoose.Schema.Types.ObjectId, ref: "Sport" }],
  image: { type: String },
});

module.exports = mongoose.model("Venue", venueSchema);
