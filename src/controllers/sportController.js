const Sport = require("../models/Sport");

exports.createSport = async (req, res) => {
  try {
    const sport = await Sport.create(req.body);
    res.status(201).json(sport);
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
