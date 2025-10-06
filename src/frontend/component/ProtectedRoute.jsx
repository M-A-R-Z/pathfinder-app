// ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token"); // 👈 token from login
      if (!token) {
        setAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_BASE_URL}/check-session`, {
          headers: {
            Authorization: `Bearer ${token}`, // 👈 send token
          },
        });

        if (res.data.logged_in) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } catch (err) {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, [API_BASE_URL]);

  if (loading) return <div>Loading...</div>;

  return authenticated ? children : <Navigate to="/" replace />;
}
