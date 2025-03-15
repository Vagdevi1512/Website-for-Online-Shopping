import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const PostItem = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    vendor: "",
    Seller_id: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) {
      setFormData((prevData) => ({
        ...prevData,
        Seller_id: email,
      }));
    } else {
      alert("You must be logged in to post an item.");
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Input validation
    const { name, price, description, category, vendor, Seller_id } = formData;
    if (!name || !price || !description || !category || !vendor || !Seller_id) {
      alert("Please fill in all the fields.");
      return;
    }

    try {
      const normalizedFormData = {
        ...formData,
        category: category.toLowerCase(),
      };

      const response = await fetch("http://localhost:9876/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(normalizedFormData),
      });

      if (response.ok) {
        const result = await response.json();
        alert("Item posted successfully!");

        setFormData({
          name: "",
          price: "",
          description: "",
          category: "",
          vendor: "",
          Seller_id: "",
        });

        navigate("/user");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error posting item:", error);
      alert("An error occurred while posting the item. Please try again.");
    }
  };

  return (
    <div className="form-container">
      <Navbar />
      <h1>Post a New Item</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Item Name:</label>
          <input
            type="text"
            name="name"
            placeholder="Enter item name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input
            type="number"
            name="price"
            placeholder="Enter price"
            value={formData.price}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            placeholder="Enter item description"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="form-group">
          <label>Category:</label>
          <input
            type="text"
            name="category"
            placeholder="Enter category (e.g., electronics, clothing)"
            value={formData.category}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Vendor:</label>
          <input
            type="text"
            name="vendor"
            placeholder="Enter vendor name"
            value={formData.vendor}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Seller_id:</label>
          <input
            type="text"
            name="Seller_id"
            value={formData.Seller_id}
            readOnly
          />
        </div>
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>

      <style jsx>{`
        body {
          background-image: url("./src/assets/Post.jpeg");
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
        }

        .form-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 10px 40px 20px 20px;
          background-color: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        h1 {
          text-align: center;
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 9px;
        }

        .form-group label {
          display: block;
          font-weight: bold;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 10px;
          margin-top: 5px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .form-group textarea {
          resize: vertical;
          height: 100px;
        }

        .form-group input[readonly] {
          background-color: #e9ecef;
        }

        .submit-button {
          width: 100%;
          padding: 12px;
          font-size: 16px;
          background-color: #4caf50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .submit-button:hover {
          background-color: #45a049;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          border-color: #4caf50;
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default PostItem;
