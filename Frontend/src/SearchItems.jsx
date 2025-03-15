import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const SearchItems = () => {
  const [categories, setCategories] = useState([]); 
  const [selectedCategory, setSelectedCategory] = useState([]); 
  const [items, setItems] = useState([]);
  const [searchText, setSearchText] = useState(""); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`http://localhost:9876/categories`);
        const data = await response.json();
        console.log("Fetched categories:", data); 
        setCategories(data.map((category) => capitalize(category)));
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        let url = `http://localhost:9876/items`;

        if (searchText) {
          url += `?search=${searchText.toLowerCase()}`;
        }

        // Add category filter to URL
        if (selectedCategory.length > 0) {
          url += searchText
            ? `&categories=${selectedCategory.join(",").toLowerCase()}`
            : `?categories=${selectedCategory.join(",").toLowerCase()}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        console.log("Fetched items:", data); 
        setItems(data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, [searchText, selectedCategory]); 
  const capitalize = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

  const handleCategoryToggle = (category) => {
    setSelectedCategory((prevCategories) =>
      prevCategories.includes(category)
        ? prevCategories.filter((cat) => cat !== category)
        : [...prevCategories, category]
    );
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleItemClick = (itemId) => {
    navigate(`/item/${itemId}`);
  };

  return (
    <div>
      <Navbar/>
      <h1>Search Items</h1>      
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search items..."
          value={searchText}
          onChange={handleSearchChange}
        />
      </div>

      <div className="category-filter">
        <h3>Categories</h3>
        {categories.length > 0 ? (
          categories.map((category) => (
            <label key={category} className="category-label">
              <input
                type="checkbox"
                checked={selectedCategory.includes(category)}
                onChange={() => handleCategoryToggle(category)}
              />
              {category}
            </label>
          ))
        ) : (
          <p>No categories found.</p>
        )}
      </div>

      {/* Display Items */}
      <div className="items-list">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item._id}
              className="item-card"
              onClick={() => handleItemClick(item._id)}
            >
              <h3>{item.name || "Unnamed Item"}</h3>
              <p>Price: ₹{item.price !== undefined ? item.price : "N/A"}</p>
            </div>
          ))
        ) : (
          <p>No items found.</p>
        )}
      </div>

      <style jsx>{`
        body {
          background-image: url("./src/assets/food.jpeg");
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
        }
        h1 {
          text-align: center;
          margin-bottom: 20px;
          color: rgb(0, 0, 0);
        }

        .search-bar input {
          width: 100%;
          padding: 10px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 4px;
          margin-bottom: 20px;
        }

        .category-filter {
          margin-bottom: 20px;
          color: rgb(15, 1, 1);
        }

        .category-label {
          margin-right: 15px;
        }

        .items-list {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .item-card {
          background-color: white;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: transform 0.2s;
        }

        .item-card:hover {
          transform: scale(1.05);
        }

        .item-card h3 {
          font-size: 18px;
          margin-bottom: 10px;
        }

        .item-card p {
          font-size: 16px;
        }

        @media (max-width: 1200px) {
          .items-list {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 900px) {
          .items-list {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .items-list {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default SearchItems;
