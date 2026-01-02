const express = require("express");
const connectionRouter = express.Router();

const { userAuth } = require("../middleWare/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

connectionRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(404)
          .json({ message: "Invalid Status type:" + " " + status });
      }

      const checkUserIdExistsOrNot = await User.findById(toUserId);

      if (!checkUserIdExistsOrNot) {
        return res.status(404).send({ message: "user is not found" });
      }

      const existingConnecting = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId: fromUserId, toUserId: toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnecting) {
        return res
          .status(400)
          .send({ message: "Connection is already exists" });
      }

      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message: connectionRequest.status,
        data,
      });
    } catch (error) {
      res.status(500).send("not connection requests" + "  " + error.message);
    }
  }
);

connectionRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const logginUserId = req.user;
      const { status, requestId } = req.params;
      //check status allowed
      const allowedStatus = ["accepted", "rejected"];
      
      if (!allowedStatus.includes(status)) {
        return res.status(404).json({ message: "status is not valid", status });
      }
      
      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId: logginUserId._id,
        status: "interested",
      });
      // console.log(connectionRequest);

      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request is not valid!" });
      }
 
      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.status(200).json({ message: "Connection is status", data });
    } catch (err) {
      return res.status(400).send("Error in request Api!");
    }
  }
);

module.exports = connectionRouter;
