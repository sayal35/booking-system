const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  createVenue,
  getVenuesBySport,
} = require("../controllers/venueController");

// POST /api/venues
router.post("/", upload.single("image"), createVenue);

// GET /api/venues?sportId=...
router.get("/", getVenuesBySport);

module.exports = router;
