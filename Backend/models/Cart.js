const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true,
      },
      name: String,
      price: Number,
      quantity: { type: Number, default: 1 },
      Seller_id: {
        type: String,
      },
    },
  ],
});
const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;
