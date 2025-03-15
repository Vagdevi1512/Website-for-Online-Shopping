import React from "react";
import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>Welcome to Buy, Sell @ IIIT H</h1>

      <button onClick={() => navigate("/login")}>Login</button>
      <button onClick={() => navigate("/register")}>Register</button>

      <style>
        {`
          body {
            background-image: url("./src/assets/IIIT.jpg");
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
         }

         .container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 45vh;
  background-color: #f4f4f4;
  text-align: center;
  margin-top: 70vh; /* Pushes the container lower */
  transform: translateY(-50%); /* Keeps it centered */
}

          h1 {
            font-size: 2.5rem;
            margin-bottom: 20px;
            color: #333;
          }
          button {
            padding: 10px 20px;
            margin: 10px;
            font-size: 16px;
            color: white;
            background-color:rgb(0, 0, 0);
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }
          button:hover {
            background-color:rgb(122, 122, 122);
          }
        `}
      </style>
    </div>
  );
};

export default WelcomePage;
