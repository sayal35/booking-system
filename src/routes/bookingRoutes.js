const express = require("express");
const router = express.Router();
const {
  createBooking,
  getBookings,
  getUserBookings,
} = require("../controllers/bookingController");

router.post("/", createBooking); // Book a slot
router.get("/", getBookings); // All bookings (admin)
router.get("/user/:userId", getUserBookings); //user-specific

module.exports = router;
