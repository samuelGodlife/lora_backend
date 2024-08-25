const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
require("dotenv").config();

const router = express.Router();

// Register Route
router.post("/register", async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    console.log(req.body);
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ msg: "Email already exists", status: false, code: 200 });
    }

    user = new User({
      username,
      email,
      password,
      role,
    });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res
      .status(201)
      .json({ msg: "User registered successfully", status: true, code: 200 });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/", async (req, res) => {
  try {
    const user = await User.find();
    res.json({ msg: "Get Data Sukses", status: true, code: 200, data: user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);
  try {
    // Check if user exists
    let user = await User.findOne({ username });
    if (!user) {
      return res
        .status(400)
        .json({ msg: "E credentials", status: false, code: 200 });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ msg: "Invalid credentials", status: false, code: 200 });
    }

    // Return user data excluding password
    const userData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      deviceName: user.deviceName,
    };

    res.json({
      data: userData,
      msg: "Berhasil Login",
      status: true,
      code: 200,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Update a plant by ID
router.put("/update/:id", async (req, res) => {
  const { deviceName } = req.body;
  console.log(req.body);
  const plantFields = {};
  if (deviceName) plantFields.deviceName = deviceName;

  try {
    let plant = await User.findById(req.params.id);
    if (!plant) {
      return res
        .status(404)
        .json({ msg: "User not found", status: false, code: 404 });
    }

    plant = await User.findByIdAndUpdate(
      req.params.id,
      { $set: plantFields },
      { new: true }
    );

    res.json({ msg: "Sukses Edit Data", status: true, code: 200, data: plant });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
