import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
const OrdersHistory = () => {
  const [tab, setTab] = useState("pending");
  const [pendingOrders, setPendingOrders] = useState([]);
  const [boughtOrders, setBoughtOrders] = useState([]);
  const [soldOrders, setSoldOrders] = useState([]);

  useEffect(() => {
    const fetchOrdersHistory = async () => {
      try {
        const res = await fetch("http://localhost:9876/order/history", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        setPendingOrders(data.pendingOrders || []);
        setBoughtOrders(data.boughtOrders || []);
        setSoldOrders(data.soldOrders || []);
      } catch (err) {
        console.error("Error fetching orders history:", err);
      }
    };
    fetchOrdersHistory();
  }, []);

  const regenerateOtp = async (orderId) => {
    try {
      const res = await fetch("http://localhost:9876/order/regenerateOtp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (data.success) {
        const updatedOrders = pendingOrders.map((order) => {
          if (order._id === orderId) {
            return { ...order, otp: data.newOtp }; 
          }
          return order;
        });
        setPendingOrders(updatedOrders);
      } else {
        console.error("Failed to regenerate OTP");
      }
    } catch (err) {
      console.error("Error regenerating OTP:", err);
    }
  };

  const renderOrders = (orders) => {
    return orders.map((order, index) => (
      <div key={order._id} className="order-container">
        <p>
          <strong>Order ID:</strong> {order._id}
        </p>
        <p>
          <strong>Amount:</strong> ${order.amount}
        </p>
        <p>
          <strong>Status:</strong> {order.status}
        </p>
        <p>
          <strong>Items:</strong>
        </p>
          {order.items.map((item, idx) => (
            <li key={item.itemId}>
              {idx + 1}. {item.name} - {item.quantity} x ₹{item.price}
            </li>
          ))}

        {order.status === "pending" && (
          <button onClick={() => regenerateOtp(order._id)}>
            Regenerate OTP
          </button>
        )}
      </div>
    ));
  };

  return (
    <div>
      <Navbar />
      <h2>Orders History</h2>
      <div className="tabs">
        <button onClick={() => setTab("pending")}>Pending Orders</button>
        <button onClick={() => setTab("bought")}>Bought Orders</button>
        <button onClick={() => setTab("sold")}>Sold Orders</button>
      </div>
      <div className="orders-container">
        {tab === "pending" && renderOrders(pendingOrders)}
        {tab === "bought" && renderOrders(boughtOrders)}
        {tab === "sold" && renderOrders(soldOrders)}
      </div>

      <style jsx>{`
        body {
          background-image: url("./src/assets/Order.jpeg");
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
        }
        h2 {
          text-align: center;
        }
        .tabs {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }
        .tabs button {
          margin: 0 10px;
          padding: 10px 20px;
          font-size: 16px;
          cursor: pointer;
          background-color: rgb(0, 0, 0);
          border: 1px solid #ddd;
        }
        .tabs button:hover {
          background-color: #ddd;
        }
        .orders-container {
          margin-top: 20px;
        }
        .order-container {
          border: 1px solid #ddd;
          padding: 15px;
          margin-bottom: 15px;
          background-color: #f9f9f9;
        }
        .order-container p {
          margin: 5px 0;
        }
        ol {
          padding-left: 20px;
        }
        ol li {
          margin-bottom: 8px;
        }
        button {
          margin-top: 10px;
          padding: 8px 15px;
          cursor: pointer;
          background-color: #4caf50;
          color: white;
          border: none;
        }
        button:hover {
          background-color: #45a049;
        }
      `}</style>
    </div>
  );
};

export default OrdersHistory;
