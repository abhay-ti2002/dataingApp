const express = require("express"); 
const userRouter = express.Router();

const { userAuth } = require("../middleWare/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

const User_Safe_Data = "name userName age gender photourl about skills";
//get all the pending connection requets for the loggedIn user
userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connection = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId");

    res.status(200).json({
      message: "Data pending list",
      data: connection,
    });
  } catch (error) {
    res.status(400).send("file error in user router");
  }
});

userRouter.get("/user/connection", userAuth, async (req, res) => {
  try {
    const logginInUser = req.user;
    console.log(logginInUser._id);
    const connection = await ConnectionRequestModel.find({
      $or: [
        { toUserId: logginInUser._id, status: "accepted" },
        { fromUserId: logginInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", User_Safe_Data)
      .populate("toUserId", User_Safe_Data);

    const data = connection.map((row) => {
      // console.log(
      //   JSON.stringify(row.fromUserId._id)
      // );
      if (
        JSON.stringify(row.fromUserId._id) === JSON.stringify(logginInUser._id)
      ) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.status(200).json({
      message: "Accepted",
      data: data,
    });
  } catch (error) {
    res.status(400).send("Error in user router");
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggInUser = req.user;
    console.log({ toUserId: loggInUser._id });

    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    let skip = (page - 1) * limit;

    //find all the connection requests send and recieve both
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggInUser._id }, { toUserId: loggInUser._id }],
    }).select("fromUserId toUserId");

    const hideUserFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });

    console.log("hidde", hideUserFromFeed);

    const users = await User.find({
      $and: [
        {
          _id: {
            $nin: Array.from(hideUserFromFeed),
          },
        },
        {
          _id: {
            $ne: loggInUser._id,
          },
        },
      ],
    })
      .select(User_Safe_Data)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    console.log(users);

    res.status(200).json({ data: users });
  } catch (error) {
    res.status(404).json({ message: "Error in feed api" + error.message });
  }
});

module.exports = userRouter;
