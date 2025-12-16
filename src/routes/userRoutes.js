const express = require("express");
const router = express.Router();
const { createUser, getUsers } = require("../controllers/userController");

router.post("/", createUser); // Create user
router.get("/", getUsers); // Get all users

module.exports = router;
