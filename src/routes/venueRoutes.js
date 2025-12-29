const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  createVenue,
  getVenuesBySport,
  getAllVenues,
} = require("../controllers/venueController");

// POST /api/venues
router.post("/", upload.single("image"), createVenue);

// GET /api/venues?sportId=...
router.get("/", getVenuesBySport);

// GET /api/venues/all
router.get("/all", getAllVenues);

module.exports = router;
