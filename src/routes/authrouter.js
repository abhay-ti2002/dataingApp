const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const { validationSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const { validateLoginEmail } = require("../utils/loginValidation");

authRouter.post("/singup", async (req, res) => {
  try {
    validationSignUpData(req);
    const { name, userName, email, password, age, phoneno, gender } = req.body;
    const saltRound = 10;
    const passwordHash = await bcrypt.hash(password, saltRound);
    const user = await new User({
      name,
      userName,
      email,
      password: passwordHash,
      age,
      phoneno,
      gender,
    });
    const saveUser = await user.save();
    const token = await saveUser.getJWT();
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.send({ message: "chlo bhai aaj ka task complete hua", data: saveUser });
  } catch (error) {
    res.status(400).send("Error in add a user data" + " " + error.message);
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
    const isValidatePassword = await user.validatePassword(password);
    // console.log("ghhg", isValidatePassword);
    if (isValidatePassword) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        httpOnly: true,
        secure: isProd, // true only in prod
        sameSite: isProd ? "none" : "lax",
        domain: isProd ? ".heartmatch.app" : undefined,
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
