import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

axios.defaults.withCredentials = true; 

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/check-session`, {
          method: "GET",
          credentials: "include", // 🔑 ensures cookies are sent
        });

        if (!res.ok) {
          setAuthenticated(false);
          return;
        }

        const data = await res.json();
        if (data.logged_in) {
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

    checkSession();
  }, []);


  if (loading) return <div>Loading...</div>;

  return authenticated ? children : <Navigate to="/" replace />;
}