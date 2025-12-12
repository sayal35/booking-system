const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  courtId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Court",
  },
  slotStart: { type: Date, required: true },
  slotEnd: { type: Date, required: true },
  status: { type: String, default: "confirmed" },
});

// Prevent double booking
bookingSchema.index({ courtId: 1, slotStart: 1 }, { unique: true });

module.exports = mongoose.model("Booking", bookingSchema);
