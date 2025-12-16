const express = require("express");
const router = express.Router();
const {
  createVenue,
  getVenuesBySport,
} = require("../controllers/venueController");

router.post("/", createVenue);
router.get("/", getVenuesBySport);

module.exports = router;
