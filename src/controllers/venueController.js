const Venue = require("../models/Venue");

// Create venue with image
exports.createVenue = async (req, res) => {
  try {
    const { name, location, sports } = req.body;

    const venue = await Venue.create({
      name,
      location,
      sports,
      image: req.file ? `/uploads/venues/${req.file.filename}` : null,
    });

    res.status(201).json({ success: true, venue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get venues by sport (with image)
exports.getVenuesBySport = async (req, res) => {
  try {
    const { sportId } = req.query;

    const venues = await Venue.find({ sports: sportId });
    res.json({ success: true, venues });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
