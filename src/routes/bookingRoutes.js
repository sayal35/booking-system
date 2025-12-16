const express = require("express");
const router = express.Router();
const {
  createBooking,
  getBookings,
  getUserBookings,
  getAdminBookingsByDate,
} = require("../controllers/bookingController");

router.post("/", createBooking); // Book a slot
router.get("/", getBookings); // All bookings (admin)
router.get("/user/:userId", getUserBookings); //user-specific
router.get("/:courtId", getAdminBookingsByDate);

module.exports = router;
