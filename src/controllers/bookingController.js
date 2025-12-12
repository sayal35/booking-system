// Create a booking with 1-hour interval
const Booking = require("../models/Booking");
const { toUTC } = require("../utils/time");
const moment = require("moment-timezone"); // ✅ add this

// Create a booking
exports.createBooking = async (req, res) => {
  try {
    const { userId, courtId, date, startHour, endHour } = req.body;

    const slotStart = toUTC(date, startHour);
    const slotEnd = toUTC(date, endHour);

    const booking = await Booking.create({
      userId,
      courtId,
      slotStart,
      slotEnd,
    });

    res.json({
      success: true,
      booking: {
        _id: booking._id,
        userId: booking.userId,
        courtId: booking.courtId,
        slotStartUTC: booking.slotStart,
        slotEndUTC: booking.slotEnd,
        time_local: `${moment(booking.slotStart)
          .tz("Asia/Kathmandu")
          .format("h A")} - ${moment(booking.slotEnd)
          .tz("Asia/Kathmandu")
          .format("h A")}`,
        status: booking.status,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "This slot is already booked" });
    }
    res
      .status(500)
      .json({ error: "Failed to create booking", details: err.message });
  }
};

// Get all bookings
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("userId", "name");

    const formattedBookings = bookings.map((b) => ({
      date: moment(b.slotStart).tz("Asia/Kathmandu").format("YYYY-MM-DD"), // ✅ add date
      time: `${moment(b.slotStart)
        .tz("Asia/Kathmandu")
        .format("h A")} - ${moment(b.slotEnd)
        .tz("Asia/Kathmandu")
        .format("h A")}`,
      username: b.userId ? b.userId.name : "Unknown User",
    }));

    res.json({
      success: true,
      bookings: formattedBookings,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch bookings", details: err.message });
  }
};
