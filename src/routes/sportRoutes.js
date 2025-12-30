const express = require("express");
const router = express.Router();
const { createSport, getSports } = require("../controllers/sportController");

router.post("/", createSport);
router.get("/", getSports);

module.exports = router;
