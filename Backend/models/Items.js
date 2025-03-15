const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  vendor: { type: String, required: true },
  Seller_id: {
    type: String,
    required: true,
    match: /^[a-zA-Z0-9._%+-]+@iiit\.ac\.in$/,
  },
});

module.exports = mongoose.model("Item", itemSchema);
