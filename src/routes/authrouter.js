const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const { validationSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const { validateLoginEmail } = require("../utils/loginValidation");
const { sendEmail } = require("../utils/sendEmail");

authRouter.post("/singup", async (req, res) => {
  try {
    validationSignUpData(req);
    const { name, userName, email, password } = req.body;

    //check if email is alredy exists
    const existsingUser = await User.findOne({ email });
    if (existsingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    //hash password
    const saltRound = 10;
    const passwordHash = await bcrypt.hash(password, saltRound);
    // const isProd = process.env.NODE_ENV === "production";

    //Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashOtp = await bcrypt.hash(otp, saltRound);

    const user = await new User({
      name,
      userName,
      email,
      password: passwordHash,
      emailOtp: hashOtp,
      emailOtpExpire: Date.now() + 60 * 1000,
      isEmailVerification: false,
    });

    await user.save();

    //send otp email
    await sendEmail(email, otp);

    // const token = await saveUser.getJWT();
    // res.cookie("token", token, {
    //   httpOnly: true,
    //   // secure: true,
    //   // sameSite: "None",
    //   // domain: isProd ? ".heartmatch.app" : undefined,
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    // });

    res.status(201).json({
      message: "OTP sent to your email. Please verify.",
    });
  } catch (error) {
    res.status(400).json({
      message: "Signup failed",
      error: error.message,
    });
  }
});

// -------------------------verify-otp------------------------

authRouter.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.emailOtpExpire < Date.now()) {
      return res.status(404).json({ message: "Otp Expired" });
    }

    const isValidOtp = await bcrypt.compare(otp, user.emailOtp);

    if (!isValidOtp) {
      return res.status(404).json({ message: "Invalid otp" });
    }

    user.isEmailVerification = true;
    user.emailOtpExpire = undefined;
    user.emailOtp = undefined;

    await user.save();

    // const isProd = process.env.NODE_ENV === "production";
    const token = await user.getJWT();
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      domain: isProd ? ".heartmatch.app" : undefined,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Email verified successfully", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const isProd = process.env.NODE_ENV === "production";
    const { email, password } = req.body;
    validateLoginEmail(email);
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid credential");
    }

    if (!user.isEmailVerification) {
      return res
        .status(401)
        .json({ message: "Please verify your email before login" });
    }

    const isValidatePassword = await user.validatePassword(password);
    // console.log("ghhg", isValidatePassword);
    if (isValidatePassword) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        httpOnly: true,
        secure: isProd, // true only in prod
        sameSite: isProd ? "none" : "lax",
        domain: isProd ? ".heartmatch.app" : undefined, //this is not Work in localhost
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.send(user);
    } else {
      throw new Error("password is not correct and account is not exists");
    }
  } catch (error) {
    res.status(400).send("Error:" + " " + error.massage);
  }
});

// ----------------------------resend-otp-----------------------------------

// logic for resent- otp

// -----------------------------logout-api--------------------------------

authRouter.post("/logout", (req, res) => {
  const isProd = process.env.NODE_ENV === "production";

  res.cookie("token", null, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    domain: isProd ? ".heartmatch.app" : undefined,
    path: "/",
  });
  res.send("Logout Successfuly");
});

module.exports = authRouter;
