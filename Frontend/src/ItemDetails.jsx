import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ItemDetails = () => {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [cart, setCart] = useState([]); 

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await fetch(`http://localhost:9876/items/${itemId}`);
        const data = await response.json();
        setItem(data);
      } catch (error) {
        console.error("Error fetching item details:", error);
      }
    };

    fetchItemDetails();
  }, [itemId]);

  const handleAddToCart = async () => {
    if (item) {
      try {
        const response = await fetch("http://localhost:9876/cart/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            itemId: item._id,
            name: item.name,
            price: item.price,
            Seller_id: item.Seller_id,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          alert(data.message); 
          return;
        }

        console.log(data);
        alert(`${item.name} added to the cart!`);
      } catch (error) {
        console.error("Error adding to cart:", error);
        alert("An error occurred while adding the item to the cart.");
      }
    }
  };

  return (
    <div className="item-details-container">
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
            background-image: url("https://images.unsplash.com/photo-1494859802809-d069c3b71a8a?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWVhbHxlbnwwfHwwfHx8MA%3D%3D");
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
            background-repeat: no-repeat;
            text-align: center;
          }

          .item-details-container {
            max-width: 600px;
            margin: auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 10px;
            box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.1);
            text-align: center;
            background-color: white; /* Ensures solid background */
          }

          .item-details-container h1 {
            color: #333;
          }
          .item-details-container p {
            font-size: 16px;
            color: #555;
          }
          .add-to-cart-button {
            margin-top: 10px;
            background-color: #4CAF50;
            color: white;
            padding: 10px;
            border: none;
            cursor: pointer;
            border-radius: 5px;
            width: 100%;
          }
          .add-to-cart-button:hover {
            background-color: #45a049;
          }
        `}
      </style>
      {item ? (
        <div>
          <h1>{item.name || "Unnamed Item"}</h1>
          <p>Price: ₹{item.price !== undefined ? item.price : "N/A"}</p>
          <p>Description: {item.description || "No description available"}</p>
          <p>Vendor: {item.vendor || "Vendor information not available"}</p>
          <p>Seller ID: {item.Seller_id || "Unknown Seller"}</p>
          <button className="add-to-cart-button" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      ) : (
        <p>Loading item details...</p>
      )}
    </div>
  );
};

export default ItemDetails;
