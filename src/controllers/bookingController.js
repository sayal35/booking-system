const Booking = require("../models/Booking");
const Court = require("../models/Court");
const { toUTC } = require("../utils/time");
const moment = require("moment-timezone");

// CREATE BOOKING (1-hour or multi-hour safe)
exports.createBooking = async (req, res) => {
  try {
    const { userId, courtId, date, startHour, endHour } = req.body;

    if (!userId || !courtId || !date || startHour == null || endHour == null) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (startHour >= endHour) {
      return res.status(400).json({ error: "Invalid time range" });
    }

    const court = await Court.findById(courtId);
    if (!court) return res.status(404).json({ error: "Court not found" });

    // Opening hours check
    if (startHour < court.opensAt || endHour > court.closesAt) {
      return res.status(400).json({
        error: `Court open between ${court.opensAt} and ${court.closesAt}`,
      });
    }

    const slotStart = toUTC(date, startHour);
    const slotEnd = toUTC(date, endHour);

    // OVERLAP CHECK
    const overlapping = await Booking.findOne({
      courtId,
      $or: [
        { slotStart: { $lt: slotEnd, $gte: slotStart } },
        { slotEnd: { $gt: slotStart, $lte: slotEnd } },
        {
          $and: [
            { slotStart: { $lte: slotStart } },
            { slotEnd: { $gte: slotEnd } },
          ],
        },
      ],
    });

    if (overlapping) {
      return res.status(409).json({ error: "Selected time is already booked" });
    }

    const booking = await Booking.create({
      userId,
      courtId,
      slotStart,
      slotEnd,
    });

    res.status(201).json({
      success: true,
      booking: {
        id: booking._id,
        courtId: booking.courtId,
        userId: booking.userId,
        date,
        time_local: `${moment(slotStart)
          .tz("Asia/Kathmandu")
          .format("h A")} - ${moment(slotEnd)
          .tz("Asia/Kathmandu")
          .format("h A")}`,
        status: booking.status,
      },
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to create booking",
      details: err.message,
    });
  }
};

// GET BOOKINGS (ADMIN / DASHBOARD)
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name")
      .populate("courtId", "name");

    const formatted = bookings.map((b) => ({
      id: b._id,
      court: b.courtId ? b.courtId.name : "Unknown Court",
      username: b.userId ? b.userId.name : "Unknown User",
      date: moment(b.slotStart).tz("Asia/Kathmandu").format("YYYY-MM-DD"),
      time: `${moment(b.slotStart)
        .tz("Asia/Kathmandu")
        .format("h A")} - ${moment(b.slotEnd)
        .tz("Asia/Kathmandu")
        .format("h A")}`,
      status: b.status,
    }));

    res.json({ success: true, bookings: formatted });
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch bookings",
      details: err.message,
    });
  }
};

// GET BOOKINGS FOR A SPECIFIC USER WITH ACTIVE STATUS
exports.getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    const bookings = await Booking.find({ userId })
      .populate("courtId", "name venue")
      .populate("userId", "name");

    const now = new Date();

    const formatted = bookings.map((b) => {
      const isActive = b.slotEnd > now; // active if slotEnd is in the future
      return {
        id: b._id,
        court: b.courtId ? b.courtId.name : "Unknown Court",
        venue: b.courtId?.venue || "Unknown Venue",
        date: moment(b.slotStart).tz("Asia/Kathmandu").format("YYYY-MM-DD"),
        time: `${moment(b.slotStart)
          .tz("Asia/Kathmandu")
          .format("h A")} - ${moment(b.slotEnd)
          .tz("Asia/Kathmandu")
          .format("h A")}`,
        status: isActive ? "active" : "inactive",
      };
    });

    res.json({ success: true, bookings: formatted });
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch user bookings",
      details: err.message,
    });
  }
};
