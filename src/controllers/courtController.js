const Court = require("../models/Court");
const Booking = require("../models/Booking");
const { toUTC } = require("../utils/time");
const moment = require("moment-timezone");

/**
 * CREATE COURT
 * Court belongs to a Sport and a Venue
 */
exports.createCourt = async (req, res) => {
  try {
    const { name, sport, venue, opensAt, closesAt } = req.body;

    if (!name || !sport || !venue) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const court = await Court.create({
      name,
      sport,
      venue,
      opensAt,
      closesAt,
    });

    res.status(201).json({ success: true, court });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET COURTS
 * Filter by venue + sport (frontend friendly)
 */
exports.getCourts = async (req, res) => {
  try {
    const { venueId, sportId } = req.query;

    const filter = {};
    if (venueId) filter.venue = venueId;
    if (sportId) filter.sport = sportId;

    const courts = await Court.find(filter)
      .populate("venue", "name location")
      .populate("sport", "name type");

    res.json({ success: true, courts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET AVAILABILITY (OPTIMIZED)
 */
exports.getAvailability = async (req, res) => {
  try {
    const { courtId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: "Date is required" });
    }

    const court = await Court.findById(courtId);
    if (!court) return res.status(404).json({ error: "Court not found" });

    // Fetch all bookings for that day in ONE query
    const bookings = await Booking.find({
      courtId,
      slotStart: {
        $gte: toUTC(date, court.opensAt),
        $lt: toUTC(date, court.closesAt),
      },
    });

    const bookedSlots = new Set(bookings.map((b) => b.slotStart.getTime()));

    const slots = [];

    for (let h = court.opensAt; h < court.closesAt; h++) {
      const slotStart = toUTC(date, h);
      const slotEnd = toUTC(date, h + 1);

      slots.push({
        startHour: h,
        endHour: h + 1,
        time_local: `${moment(slotStart)
          .tz("Asia/Kathmandu")
          .format("h A")} - ${moment(slotEnd)
          .tz("Asia/Kathmandu")
          .format("h A")}`,
        available: !bookedSlots.has(slotStart.getTime()),
      });
    }

    res.json({ success: true, date, slots });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET COURT SCHEDULE
exports.getCourtSchedule = async (req, res) => {
  try {
    const { courtId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res
        .status(400)
        .json({ error: "Please provide a date in YYYY-MM-DD format" });
    }

    const court = await Court.findById(courtId);
    if (!court) return res.status(404).json({ error: "Court not found" });

    const slots = [];

    for (let h = court.opensAt; h < court.closesAt; h++) {
      const slotStart = toUTC(date, h);
      const slotEnd = toUTC(date, h + 1);

      const booking = await Booking.findOne({ courtId, slotStart }).populate(
        "userId",
        "name"
      );

      slots.push({
        time: `${moment(slotStart)
          .tz("Asia/Kathmandu")
          .format("h A")} - ${moment(slotEnd)
          .tz("Asia/Kathmandu")
          .format("h A")}`,
        available: !booking,
        username: booking && booking.userId ? booking.userId.name : null,
      });
    }

    res.json({
      success: true,
      date,
      court: court.name,
      schedule: slots,
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to get schedule",
      details: err.message,
    });
  }
};
