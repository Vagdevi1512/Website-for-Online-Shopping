import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import './App.css'; 

const User = () => {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const email = localStorage.getItem("userEmail"); 
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (email) {
      fetchUserData();
    }
  }, [email]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(
        `http://localhost:9876/user?email=${email}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      if (response.ok) {
        setUser(result);
        setFormData(result);
      } else {
        alert(result.message || "Error fetching user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      alert("An error occurred while fetching user details.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:9876/user", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setUser(result);
        setIsEditing(false);
        alert("User updated successfully");
      } else {
        alert(result.message || "Error updating user");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      alert("An error occurred while updating user details.");
    }
  };

  return (
    <div className="user-container">
      <Navbar />
      <h1>IIIT H Buy and Sell</h1>
      <h2>Profile</h2>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            name="firstName"
            value={formData.firstName || ""}
            placeholder="First Name"
            onChange={handleChange}
            required
          />
          <input
            name="lastName"
            value={formData.lastName || ""}
            placeholder="Last Name"
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            value={formData.email || ""}
            placeholder="Email"
            disabled
          />
          <input
            name="age"
            type="number"
            value={formData.age || ""}
            placeholder="Age"
            onChange={handleChange}
            required
          />
          <input
            name="contactNumber"
            value={formData.contactNumber || ""}
            placeholder="Contact Number"
            onChange={handleChange}
            required
          />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <div>
          <p>
            <strong>First Name:</strong> {user.firstName}
          </p>
          <p>
            <strong>Last Name:</strong> {user.lastName}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Age:</strong> {user.age}
          </p>
          <p>
            <strong>Contact Number:</strong> {user.contactNumber}
          </p>
          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
        </div>
      )}

      <style jsx>{`
         body {
            margin: 0;
            padding: 0;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            background-image: url("./src/assets/User.jpeg");
            // background-size: ;
            background-position: center;
            background-attachment: fixed;
            background-repeat: no-repeat;
            text-align: center;
          }

        .user-container {
          width: 140%;
          max-width: 1000px;
          margin: 20px auto;
          padding: 20px 20px 70px 20px;
          background-color: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .user-container h1 {
          text-align: center;
          font-size: 24px;
          color: #333;
          margin-bottom: 20px;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        form input {
          padding: 10px;
          font-size: 24px;
          border: 1px solid #ccc;
          border-radius: 4px;
          width: 100%;
        }

        form button {
          padding: 10px;
          font-size: 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        form button[type="submit"] {
          background-color: #28a745;
          color: white;
        }

        form button[type="button"] {
          background-color: #dc3545;
          color: white;
        }

        form button:hover {
          opacity: 0.8;
        }

        div {
          font-size: 20px;
        }

        div p {
          margin: 20px 0;
        }

        button {
          font-size: 20px;
          padding: 8px 15px;
          border: none;
          background-color: #007bff;
          color: white;
          border-radius: 4px;
          cursor: pointer;
        }

        button:hover {
          background-color:rgb(55, 118, 186);
        }
      `}</style>
    </div>
  );
};

export default User;
