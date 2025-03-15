const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/place", authMiddleware, async (req, res) => {
  try {
    const { items, total } = req.body; 
    const buyerId = req.user.id;

    const itemsBySeller = {};
    items.forEach((item) => {
      if (!item.Seller_id) {
        throw new Error("Missing Seller_id for one or more items");
      }
      const sellerIdentifier = item.Seller_id;
      if (!itemsBySeller[sellerIdentifier]) {
        itemsBySeller[sellerIdentifier] = [];
      }
      itemsBySeller[sellerIdentifier].push(item);
    });

    const ordersCreated = [];
    for (const sellerIdentifier in itemsBySeller) {
      console.log("Processing seller identifier:", sellerIdentifier);

      // Lookup seller by email
      const sellerUser = await User.findOne({ email: sellerIdentifier });
      if (!sellerUser) {
        throw new Error(`Seller not found for email: ${sellerIdentifier}`);
      }

      const validSellerId = sellerUser._id; 
      const orderItems = itemsBySeller[sellerIdentifier];
      const amount = orderItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      console.log("Generated OTP before hashing:", otp);
      const otpToSend = otp;
      const hashedOtp = await bcrypt.hash(otp, 10);

      const newOrder = new Order({
        buyerId,
        sellerId: validSellerId,
        items: orderItems,
        amount,
        otp: hashedOtp,
        status: "pending",
      });

      await newOrder.save();
      ordersCreated.push(newOrder);

      newOrder.otp = otpToSend;
    }

    // Clear the buyer's cart
    await Cart.findOneAndUpdate({ userId: buyerId }, { items: [] });

    res.json({ success: true, orders: ordersCreated });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});



router.get("/history", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    // Buyer orders
    const pendingOrders = await Order.find({
      buyerId: userId,
      status: "pending",
    });
    const boughtOrders = await Order.find({
      buyerId: userId,
      status: "completed",
    });
    const soldOrders = await Order.find({
      sellerId: userId,
      status: "completed",
    });
    res.json({ pendingOrders, boughtOrders, soldOrders });
  } catch (error) {
    console.error("Error fetching orders history:", error);
    res.status(500).json({ message: "Error fetching orders history" });
  }
});

router.get("/deliver", authMiddleware, async (req, res) => {
  try {
    const sellerId = req.user.id;
    console.log("Deliver endpoint accessed by seller:", sellerId);

    const pendingOrders = await Order.find({
      sellerId,
      status: "pending",
    }).populate("buyerId", "email firstName lastName");

    console.log("Pending orders for seller", sellerId, ":", pendingOrders);
    res.json({ pendingOrders });
  } catch (error) {
    console.error("Error fetching deliver orders:", error);
    res.status(500).json({ message: "Error fetching deliver orders" });
  }
});


router.post("/complete", authMiddleware, async (req, res) => {
  try {
    const { orderId, otp } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    const isOtpValid = await bcrypt.compare(otp, order.otp);
    if (!isOtpValid) {
      return res.status(400).json({ message: "Incorrect OTP" });
    }
    order.status = "completed";
    await order.save();
    res.json({ message: "Order completed", order });
  } catch (error) {
    console.error("Error completing order:", error);
    res.status(500).json({ message: "Error completing order" });
  }
});

router.get("/history", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const pendingOrders = await Order.find({
      buyerId: userId,
      status: "pending",
    });
    const boughtOrders = await Order.find({
      buyerId: userId,
      status: "completed",
    });
    const soldOrders = await Order.find({
      sellerId: userId,
      status: "completed",
    });
    res.json({ pendingOrders, boughtOrders, soldOrders });
  } catch (error) {
    console.error("Error fetching orders history:", error);
    res.status(500).json({ message: "Error fetching orders history" });
  }
});

router.post("/regenerateOtp", authMiddleware, async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({ message: "OTP can only be regenerated for pending orders" });
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

    console.log("Generated OTP for order regeneration:", newOtp);

    const hashedOtp = await bcrypt.hash(newOtp, 10);

    order.otp = hashedOtp;
    await order.save();

    res.json({ success: true, message: "OTP has been successfully regenerated" });
  } catch (error) {
    console.error("Error regenerating OTP:", error);
    res.status(500).json({ message: "Error regenerating OTP" });
  }
});



module.exports = router;
