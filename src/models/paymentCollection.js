const mongoose = require("mongoose");

const paymentCollectionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    paymentId: {
      type: String,
    },
    orderId: { type: String, require: true },
    status: {
      type: String,
      require: true,
    },
    amount: { type: Number, require: true },
    currency: { type: String, require: true },
    recepit: { type: String, require: true },
    notes: {
      userName: { type: String },
      memberShipType: { type: String, default: "Free" },
    },
  },
  { timestamps: true },
);

const paymentCollectionModel = mongoose.model(
  "payment",
  paymentCollectionSchema
);

module.exports = paymentCollectionModel;
