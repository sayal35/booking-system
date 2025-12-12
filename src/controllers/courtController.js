const Court = require("../models/Court");
const Booking = require("../models/Booking");
const { toUTC } = require("../utils/time");
const moment = require("moment-timezone");

exports.createCourt = async (req, res) => {
  try {
    const { name, sport, location, opensAt, closesAt } = req.body;
    const court = await Court.create({
      name,
      sport,
      location,
      opensAt,
      closesAt,
    });
    res.status(201).json({ success: true, court });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCourts = async (req, res) => {
  const courts = await Court.find();
  res.json({ success: true, courts });
};

// Get availability in 1-hour slots
exports.getAvailability = async (req, res) => {
  const { courtId } = req.params;
  const { date } = req.query;

  const court = await Court.findById(courtId);
  if (!court) return res.status(404).json({ error: "Court not found" });

  const slots = [];

  for (let h = court.opensAt; h < court.closesAt; h++) {
    const slotStart = toUTC(date, h);
    const slotEnd = toUTC(date, h + 1);

    const existing = await Booking.findOne({ courtId, slotStart });

    slots.push({
      startHour: h,
      endHour: h + 1,
      time_local: `${moment(slotStart)
        .tz("Asia/Kathmandu")
        .format("h A")} - ${moment(slotEnd)
        .tz("Asia/Kathmandu")
        .format("h A")}`,
      available: !existing,
    });
  }

  res.json(slots);
};

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
    res
      .status(500)
      .json({ error: "Failed to get schedule", details: err.message });
  }
};
