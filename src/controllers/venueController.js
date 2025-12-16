const Venue = require("../models/Venue");

exports.createVenue = async (req, res) => {
  try {
    const venue = await Venue.create(req.body);
    res.status(201).json(venue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getVenuesBySport = async (req, res) => {
  const { sportId } = req.query;
  const venues = await Venue.find({ sports: sportId });
  res.json(venues);
};
