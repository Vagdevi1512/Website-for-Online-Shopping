
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sellerId: { type: String, required: true },
  items: [
    {
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  amount: { type: Number, required: true },
  otp: { type: String, required: true }, 
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", OrderSchema);
