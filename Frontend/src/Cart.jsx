import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch("http://localhost:9876/cart", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await response.json();
        setCart(data.items || []);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, []);

  useEffect(() => {
    const totalAmount = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotal(totalAmount);
  }, [cart]);

  const removeFromCart = async (itemId) => {
    try {
      await fetch("http://localhost:9876/cart/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ itemId }),
      });
      setCart(cart.filter((item) => item.itemId !== itemId));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      alert(
        "Your cart is empty. Please add items to the cart before placing an order."
      );
      return; 
    }

    try {
      const response = await fetch("http://localhost:9876/order/place", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ items: cart, total }),
      });
      const data = await response.json();
      console.log("Order response:", data); 
      if (data.success) {
        alert("Order placed successfully");
        setCart([]);
      } else {
        alert("Error placing order: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Error placing order: " + error.message);
    }
  };

  return (
    <div className="cart-container">
      <Navbar />
      <style>
        {`
          body {
            margin: 0;
            padding: 0;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            background-image: url("./src/assets/Cart.jpeg");
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
            background-repeat: no-repeat;
            text-align: center;
          }

          .cart-container {
            max-width: 600px;
            margin: auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 10px;
            box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.1);
            text-align: center;
            background-color: #ffffff; 
          }
          .cart-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            border-bottom: 1px solid #ddd;
          }
          .cart-item p {
            margin: 0;
          }
          .cart-button {
            background-color: #ff4d4d;
            color: white;
            border: none;
            padding: 5px 10px;
            cursor: pointer;
            border-radius: 5px;
          }
          .cart-button:hover {
            background-color: #cc0000;
          }
          .place-order {
            margin-top: 20px;
            background-color: #4CAF50;
            color: white;
            padding: 10px;
            border: none;
            cursor: pointer;
            border-radius: 5px;
            width: 100%;
          }
          .place-order:hover {
            background-color: #45a049;
          }
        `}
      </style>
      <h2>My Cart</h2>
      {cart.length > 0 ? (
        cart.map((item) => (
          <div key={item.itemId} className="cart-item">
            <p>
              {item.name} - ₹{item.price} x {item.quantity}
            </p>
            <button
              className="cart-button"
              onClick={() => removeFromCart(item.itemId)}
            >
              Remove
            </button>
          </div>
        ))
      ) : (
        <p>Your cart is empty</p>
      )}
      <h3>Total: ₹{total}</h3>
      <button className="place-order" onClick={placeOrder}>
        Place Order
      </button>
    </div>
  );
};

export default Cart;
