const express = require("express");
const router = express.Router();
const { createSport, getSports } = require("../controllers/sportController");
const upload = require("../middleware/upload");

router.post("/", upload.single("image"), createSport);
router.get("/", getSports);

module.exports = router;
