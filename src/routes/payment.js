const express = require("express");
const paymentRoute = express.Router();
const { userAuth } = require("../middleWare/auth");
const razorpayInstance = require("../utils/razorpay");
const paymentCollectionModel = require("../models/paymentCollection");
const membershipAmount = require("../utils/constant");
console.log(membershipAmount);

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

module.exports = paymentRoute;
