const express = require("express");
const router = express.Router();
const {
  createCourt,
  getCourts,
  getAvailability,
  getCourtSchedule,
} = require("../controllers/courtController");

router.post("/", createCourt); // Create court
router.get("/", getCourts); // Courts by venue + sport
router.get("/:courtId/availability", getAvailability); // Available slots
router.get("/:courtId/schedule", getCourtSchedule); // Full schedule

module.exports = router;
