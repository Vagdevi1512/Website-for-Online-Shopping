import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./App"; 

const Navbar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div>
      <nav className="navbar">
        
        <style>
          {`
            .navbar {
              position: fixed;
              left: 0;
              top: 0;
              height: 100vh;
              width: 150px;
              background-color:rgb(0, 0, 0);
              padding-top: 20px;
              display: flex;
              flex-direction: column;
              align-items: center;
              z-index: 1000;
            }
            .navbar-container {
              display: flex;
              flex-direction: column;
              width: 100%;
            }
            .navbar-link {
              color: white;
              text-decoration: none;
              padding: 10px;
              text-align: center;
              width: 90%;
              display: block;
            }
            .navbar-link:hover {
              background-color: #34495e;
            }
            .logout-link {
              margin-top: auto;
              background-color: #e74c3c;
            }
            .logout-link:hover {
              background-color: #c0392b;
            }
            .content {
              margin-left: 250px;
              padding: 20px;
            }
          `}
        </style>
        <div className="navbar-container">
          <Link to="/user" className="navbar-link">
            Home
          </Link>
          <Link to="/items" className="navbar-link">
            Search Items
          </Link>
          <Link to="/postItem" className="navbar-link">
            Post Item
          </Link>
          <Link to="/orders-history" className="navbar-link">
            Orders History
          </Link>
          <Link to="/deliver-items" className="navbar-link">
            Deliver Items
          </Link>
          <Link to="/cart" className="navbar-link">
            My Cart
          </Link>
          <Link to="/chat" className="navbar-link">
            Support
          </Link>
          <Link
            to="/login"
            className="navbar-link logout-link"
            onClick={handleLogout}
          >
            Logout
          </Link>
        </div>
      </nav>
      <div className="content">
      </div>
    </div>
  );
};

export default Navbar;
