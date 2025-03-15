
import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./App.jsx";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("userEmail");
    const sessionExpiry = localStorage.getItem("sessionExpiry");

    if (token && userEmail && sessionExpiry) {
      if (new Date().getTime() < parseInt(sessionExpiry)) {
        verifyToken(token, userEmail);
      } else {
        handleLogout();
      }
    }
  }, []);

  const verifyToken = async (token, userEmail) => {
    try {
      const response = await axios.post(
        "http://localhost:9876/verify-token",
        { email: userEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.valid) {
        login(response.data.user, token);
        navigate("/user");
      } else {
        handleLogout();
      }
    } catch (error) {
      handleLogout();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("sessionExpiry");
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@iiit\.ac\.in$/;
    return re.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:9876/login", {
        email,
        password,
      });
      if (response.data.token) {
        const expiryTime = new Date().getTime() + 24 * 60 * 60 * 1000;
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("sessionExpiry", expiryTime.toString());
        login(response.data.user, response.data.token);
        navigate("/user");
      } else {
        setError("Invalid credentials.");
      }
    } catch (error) {
      console.error("Login failed", error);
      setError("Login failed. Please try again later.");
    }
  };

  return (
    <div className="login-container">
      <h2 style={{ color: "black" }}>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Login</button>
      </form>
      <style>
        {`
    body, html {
      margin: 0;
      padding: 0;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-size: cover;
    }

    form {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      max-width: 300px;
    }

    h2 {
      text-align: center;
      color: white;
      font-size: 24px;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    }

    input {
      width: 100%;
      padding: 10px;
      margin-bottom: 10px;
      border: 1px solid white;
      border-radius: 4px;
      font-size: 14px;
      background: rgba(255, 255, 255, 0.8);
    }

    button {
      width: 100%;
      padding: 10px;
      background-color: black;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }

    button:hover {
      background-color: rgb(137, 137, 137);
    }

    .error-message {
      color: red;
      text-align: center;
      margin-top: 10px;
    }
  `}
      </style>
    </div>
  );
}

export default Login;
