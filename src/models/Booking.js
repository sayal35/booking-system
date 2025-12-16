const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courtId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Court",
      required: true,
    },
    slotStart: { type: Date, required: true },
    slotEnd: { type: Date, required: true },
    status: { type: String, default: "confirmed" },
  },
  { timestamps: true }
);

// Index for performance (not overlap logic)
bookingSchema.index({ courtId: 1, slotStart: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
