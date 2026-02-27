const express = require("express");
const paymentRoute = express.Router();
const { userAuth } = require("../middleWare/auth");
const User = require("../models/user");
const razorpayInstance = require("../utils/razorpay");
const paymentCollectionModel = require("../models/paymentCollection");
const membershipAmount = require("../utils/constant");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
// console.log(membershipAmount);

paymentRoute.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { memberShipType } = req.body;
    const { userName, email } = req.user;

    const order = await razorpayInstance.orders.create({
      amount: membershipAmount[memberShipType] * 100,
      currency: "INR",
      receipt: "receipt#1",
      partial_payment: false,
      notes: {
        userName,
        email,
        memberShipType: memberShipType,
      },
    });

    //   save in db
    // console.log(order);
    const { id, status, amount, currency, receipt, notes } = order;
    // console.log(notes);
    const paymentDetails = new paymentCollectionModel({
      userId: req.user._id,
      orderId: id,
      status,
      amount,
      currency,
      receipt,
      notes,
    });

    // console.log(paymentDetails);
    const savePayment = await paymentDetails.save();
    //return back to frontend
    res.json({ savePayment, keyId: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

paymentRoute.post("/payment/webhook", async (req, res) => {
  
  try {
    /* NODE SDK: https://github.com/razorpay/razorpay-node */
    const webhookSignature = req.get["X-Razorpay-Signature"];
    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET,
    );
    console.log("Webhook Validity:", isWebhookValid);
    // #webhook_body should be raw webhook request body

    if (!isWebhookValid) {
      return res.status(400).json({ msg: "Invalid webhook signature" });
    }

    const paymentDetails = req.body.payload.payment.entity;

    const payment = await paymentCollectionModel.findOne({
      orderId: paymentDetails.order_id,
    });

    if (!payment) {
      return res.status(404).json({ msg: "Payment not found" });
    }

    payment.status = paymentDetails.status;
    await payment.save();

    const user = await User.findOne({ _id: payment.userId });
    user.isPremium = true;
    user.membershipType = payment.notes.memberShipType;
    await user.save();

    // if (request.body.event === "payment.captured") {
    //   // payment.status = "captured";
    // }
    // if (req.body.event === "payment.failed") {
    //   // payment.status = "failed";
    // }
    res.json({ message: "Webhook received and validated" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

module.exports = paymentRoute;
