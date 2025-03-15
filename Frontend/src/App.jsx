import React, { useEffect, useState, createContext } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";

import WelcomePage from "./Welcomepage";
import Login from "./Login";
import Register from "./Register";
import PostItem from "./PostItem";
import SearchItems from "./SearchItems";
import ItemDetails from "./ItemDetails";
import User from "./User";
import Cart from "./Cart";
import DeliverItems from "./DeliverItems";
import OrdersHistory from "./OrderHistory";
import Chat from "./Chat";
import './App.css';

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:9876/validate-token", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser(response.data);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

const ProtectedRoute = ({ element }) => {
  const { user, isLoading } = React.useContext(AuthContext);
  const location = useLocation();

  if (isLoading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return element;
};

const PublicRoute = ({ element }) => {
  const { user } = React.useContext(AuthContext);

  if (user) {
    return <Navigate to="/user" replace />;
  }

  return element;
};

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:9876/")
      .then((response) => {
        setMessage(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <AuthProvider>
      <Router>

        <div className="App">
          <h1>{message}</h1>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route
              path="/login"
              element={<PublicRoute element={<Login />} />}
            />
            <Route
              path="/register"
              element={<PublicRoute element={<Register />} />}
            />

            <Route
              path="/postItem"
              element={<ProtectedRoute element={<PostItem />} />}
            />
            <Route
              path="/items"
              element={<ProtectedRoute element={<SearchItems />} />}
            />
            <Route
              path="/item/:itemId"
              element={<ProtectedRoute element={<ItemDetails />} />}
            />
            <Route
              path="/user"
              element={<ProtectedRoute element={<User />} />}
            />
            <Route
              path="/cart"
              element={<ProtectedRoute element={<Cart />} />}
            />
            <Route
              path="/orders-history"
              element={<ProtectedRoute element={<OrdersHistory />} />}
            />
            <Route
              path="/deliver-items"
              element={<ProtectedRoute element={<DeliverItems />} />}
            />
            <Route
              path="/chat"
              element={<ProtectedRoute element={<Chat />} />}
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
