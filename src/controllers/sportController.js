const Sport = require("../models/Sport");

exports.createSport = async (req, res) => {
  try {
    const { name, type, image } = req.body;

    if (!name || !type || !image) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const sport = await Sport.create({ name, type, image });

    res.status(201).json({ success: true, sport });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSports = async (req, res) => {
  const { type } = req.query;
  const filter = type ? { type } : {};
  const sports = await Sport.find(filter);
  res.json(sports);
};
