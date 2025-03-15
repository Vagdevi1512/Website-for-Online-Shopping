const express = require("express");
const Cart = require("../models/Cart");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate(
      "items.itemId"
    );

    if (!cart) {
      return res.json({ items: [] }); 
    }

    res.json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Error fetching cart" });
  }
});

router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { itemId, name, price, quantity, Seller_id } = req.body;
    const userEmail = req.user.email;

    // Prevent user from adding their own item
    if (userEmail === Seller_id) {
      return res
        .status(400)
        .json({ message: "You cannot add your own product to the cart." });
    }

    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.itemId.toString() === itemId
    );

    if (existingItem) {
      existingItem.quantity += 1; 
    } else {
      cart.items.push({ itemId, name, price, Seller_id, quantity: 1 });
    }

    await cart.save();
    res.json({ message: "Item added to cart", cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Error adding to cart" });
  }
});

router.post("/update", authMiddleware, async (req, res) => {
  const { itemId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.itemId.toString() === itemId
    );

    if (itemIndex >= 0) {
      if (cart.items[itemIndex].quantity > 1) {
        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        return res.status(200).json({ message: "Cart updated", cart });
      } else {
        // If quantity is 1, remove the item completely
        cart.items.splice(itemIndex, 1);
        await cart.save();
        return res
          .status(200)
          .json({ message: "Item removed from cart", cart });
      }
    } else {
      return res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (error) {
    console.error("Error updating cart:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/remove", authMiddleware, async (req, res) => {
  try {
    const { itemId } = req.body;

    // Find the cart for the user
    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const result = await Cart.updateOne(
      { userId: req.user.id },
      { $pull: { items: { itemId: itemId } } }
    );

    console.log("Remove Result:", result); 
    if (result.modifiedCount > 0) {
      return res.json({ message: "Item removed successfully", cart });
    } else {
      return res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (error) {
    console.error("Error removing from cart:", error);
    return res.status(500).json({ message: "Error removing from cart" });
  }
});

module.exports = router;
