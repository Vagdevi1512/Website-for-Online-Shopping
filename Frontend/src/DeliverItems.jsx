import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";

const DeliverItems = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [otpInputs, setOtpInputs] = useState({});

  useEffect(() => {
    const fetchDeliverOrders = async () => {
      try {
        const res = await fetch("http://localhost:9876/order/deliver", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        setPendingOrders(data.pendingOrders || []);
      } catch (err) {
        console.error("Error fetching deliver orders:", err);
      }
    };
    fetchDeliverOrders();
  }, []);

  const handleCompleteOrder = async (orderId) => {
    try {
      const otp = otpInputs[orderId];
      const res = await fetch("http://localhost:9876/order/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ orderId, otp }),
      });
      const data = await res.json();
      if (data.message === "Order completed") {
        alert("Order completed successfully");
        setPendingOrders(
          pendingOrders.filter((order) => order._id !== orderId)
        );
      } else {
        alert(data.message || "Failed to complete order");
      }
    } catch (err) {
      console.error("Error completing order:", err);
    }
  };

  const handleOtpChange = (orderId, value) => {
    setOtpInputs({ ...otpInputs, [orderId]: value });
  };

  return (
    <div className="deliver-items-container">
      <Navbar />
      <style>
        {`
    body {
      background-image: url("./src/assets/Deliver.jpg");
      background-size: cover;
      background-position: center;
      background-attachment: fixed;
      margin: 0;
      padding: 0;
    }
    .deliver-items-container {
      max-width: 600px;
      margin: auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 10px;
      box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.1);
      text-align: center;
      background-color: #ffffff; /* Fully solid white background */
    }
    .order-card {
      border: 1px solid gray;
      padding: 10px;
      margin-bottom: 10px;
      border-radius: 5px;
      background-color: #f9f9f9;
    }
    .order-card input {
      margin-top: 5px;
      padding: 5px;
      width: 80%;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
    .complete-button {
      margin-top: 10px;
      background-color: #4CAF50;
      color: white;
      padding: 10px;
      border: none;
      cursor: pointer;
      border-radius: 5px;
      width: 100%;
    }
    .complete-button:hover {
      background-color: #45a049;
    }
  `}
      </style>

      <h2>Deliver Items</h2>
      {pendingOrders.length > 0 ? (
        pendingOrders.map((order) => (
          <div key={order._id} className="order-card">
            <p>
              <strong>Order ID:</strong> {order._id}
            </p>
            <p>
              <strong>Buyer:</strong>{" "}
              {order.buyerId ? order.buyerId.email : "Unknown"}
            </p>
            <p>
              <strong>Amount:</strong> ${order.amount}
            </p>
            <p>
              <strong>Items:</strong>
            </p>
            <ul>
              {order.items.map((item, index) => (
                <li
                  key={item.itemId}
                  style={{ listStyleType: "decimal", marginLeft: "20px" }}
                >
                  {index + 1}. {item.name} - {item.quantity} x ₹{item.price}
                </li>
              ))}
            </ul>

            <input
              type="text"
              placeholder="Enter OTP"
              value={otpInputs[order._id] || ""}
              onChange={(e) => handleOtpChange(order._id, e.target.value)}
            />
            <button
              className="complete-button"
              onClick={() => handleCompleteOrder(order._id)}
            >
              Complete Order
            </button>
          </div>
        ))
      ) : (
        <p>No pending orders for delivery</p>
      )}
    </div>
  );
};

export default DeliverItems;
