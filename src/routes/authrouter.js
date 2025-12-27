const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authRouter = express.Router();
const User = require("../models/user");
const { validationSignUpData } = require("../utils/validation");
const { validateLoginEmail } = require("../utils/loginValidation");

// Helper to get cookie domain based on environment
const getCookieDomain = () => {
  return process.env.NODE_ENV === "production"
    ? process.env.COOKIE_DOMAIN
    : "localhost";
};

// SIGNUP
authRouter.post("/signup", async (req, res) => {
  try {
    validationSignUpData(req);

    const { name, userName, email, password, age, phoneno, gender } = req.body;

    // Hash password
    const saltRound = 10;
    const passwordHash = await bcrypt.hash(password, saltRound);

    // Create user
    const user = new User({
      name,
      userName,
      email,
      password: passwordHash,
      age,
      phoneno,
      gender,
    });

    const savedUser = await user.save();

    // Generate JWT
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      domain: getCookieDomain(),
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send sanitized user data
    const { password: pw, ...userData } = savedUser._doc;
    res.send({ message: "User registered successfully", data: userData });
  } catch (error) {
    res.status(400).send("Error in signup: " + error.message);
  }
});

// LOGIN
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    validateLoginEmail(email);

    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid credentials");

    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) throw new Error("Password is incorrect");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      domain: getCookieDomain(),
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: pw, ...userData } = user._doc;
    res.send({ message: "Login successful", data: userData });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

// LOGOUT
authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
    domain: getCookieDomain(),
    path: "/",
  });
  res.send("Logout successful");
});

module.exports = authRouter;
