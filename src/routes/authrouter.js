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
    await user.save();
    res.send("chlo bhai aaj ka task complete hua");
  } catch (error) {
    res.status(400).send("Error in add a user data" + " " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    validateLoginEmail(email);
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid credential");
    }
    const isValidatePassword = user.validatePassword(password);

    if (isValidatePassword) {
      const token = await user.getJWT();
      res.cookie("token", token);
      res.send(user);
    } else {
      throw new Error("password is not correct and account is not exists");
    }
  } catch (error) {
    res.status(400).send("Error:" + " " + error.massage);
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null);
  res.send("Logout Successfuly");
});

module.exports = authRouter;
