const mongoose = require("mongoose");
const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", //userSchema which collection is referance
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", //userSchema
      required: true,
    },
    status: {
      type: String,

      required: true,
      enum: {
        values: ["interested", "ignored", "accepted", "rejected"],
        message: `{Value} is not correct`,
      },
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1});

connectionRequestSchema.pre("save", function (next) {
  //check fromuserId and touserId is not same
  const connectionRequest = this;

  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("YOu cannot send a request to yourSelf!");
  }

  next();
});

const ConnectionRequestModel = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema,
);

module.exports = ConnectionRequestModel;
