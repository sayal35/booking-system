const Sport = require("../models/Sport");

exports.createSport = async (req, res) => {
  try {
    const { name, type } = req.body;

    const sport = await Sport.create({
      name,
      type,
      image: req.file ? `/uploads/sports/${req.file.filename}` : null,
    });

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
