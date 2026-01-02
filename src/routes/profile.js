const express = require("express");
const profileRouter = express.Router();

const { userAuth } = require("../middleWare/auth");
const { validateProfileEditData } = require("../utils/validateProfileUpdate");



profileRouter.get("/profile/view", userAuth, async (req, res) => {
  
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(505).send("Token is not find" + " " + error);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {

  try {
    //data validate
    if (!validateProfileEditData(req)) {
      throw new Error("data is not match or valid");
    }
    //upadate profile
    const user = req.user;
    // console.log("edit", user);
    // user.about = req.body.about;//bad practice
    Object.keys(req.body).forEach((key) => ( user[key] = req.body[key]));
    await user.save();
    res.json({
      message:"Upadate date for user profile",
      data: user
    });
  } catch (error) {
    res.status(204).send("No content" + " " + error.message);
  }
});

module.exports = profileRouter;
