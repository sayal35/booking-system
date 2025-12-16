const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user already exists (email or phone)
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "User with this email or phone already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role,
    });

    // Hide password in response
    const userResponse = { ...user._doc };
    delete userResponse.password;

    res.status(201).json({ success: true, user: userResponse });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create user", details: err.message });
  }
};

// Get all users (without passwords)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -role");
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
