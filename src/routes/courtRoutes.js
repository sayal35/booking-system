const express = require("express");
const router = express.Router();
const courtController = require("../controllers/courtController");

router.post("/", courtController.createCourt);
router.get("/", courtController.getCourts);
router.get("/:courtId/availability", courtController.getAvailability);

router.get("/:courtId/schedule", courtController.getCourtSchedule);


module.exports = router;
