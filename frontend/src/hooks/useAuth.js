import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.MODE === "development"
  ? "http://localhost:5001"
  : "https://crypto-nmz7.onrender.com";

const API = axios.create({ baseURL: API_URL });

// ✅ Automatically attach token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


const useAuth = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("token"));
  const navigate = useNavigate();

  const getAdminProfile = useCallback(async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      console.error("🚨 No token found! Redirecting to login.");
      navigate("/auth/login");
      return;
    }
  
    try {
      const { data } = await API.get("/api/auth/me");
      console.log("📦 API Response:", data);
  
      // Support both formats: { user: { ... } } and { ... }
      const userData = data?.user || data;
  
      if (!userData || typeof userData !== "object") {
        throw new Error("❌ Unexpected API response format.");
      }
  
      setProfile(userData);
    } catch (error) {
      console.error("❌ API Request Failed:", error.response || error.message);
      if (error.response?.status === 401) {
        console.error("🚨 Unauthorized! Redirecting to login.");
        localStorage.removeItem("token");
        navigate("/auth/login");
      }
      setError(error.response?.data?.message || "Error fetching profile");
    }
  }, [navigate]);
  

  const handleLogin = useCallback(async (credentials) => {
    setLoading(true);
    // console.log("Login credentials:", credentials);
    setError("");
  
    try {
      const { data } = await API.post("/api/auth/login", credentials);
      // console.log("Login response:", data);
      localStorage.setItem("token", data.token);
      // console.log("Token saved:", data.token);
      setProfile(data.user); // ✅ Save the user profile
  
      setIsAuthenticated(true);
  
      const role = data.user.type; // Make sure this is your role field
      let redirectPath = "/";
  
      if (role === "admin") redirectPath = "/admin/dashboard";
      else if (role === "payment_viewer") redirectPath = "/payment-viewer";
      else if (role === "user") redirectPath = "/profile";

  
      const from = new URLSearchParams(window.location.search).get("from") || redirectPath;
      navigate(from, { replace: true });
  
      return { success: true };

    } catch (err) {
      const errorMessage = err?.response?.data?.message || "Login failed. Please try again.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [navigate]);
  

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    setProfile(null);
    setIsAuthenticated(false);
    navigate("/login");
  }, [navigate]);

  const handleRegister = useCallback(async (credentials) => {
    setLoading(true);
    setError("");

    try {
      const response = await API.post("/api/auth/register", credentials);
      console.log("Registration successful:", response.data);
      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const updateAdminProfile = useCallback(async (formData) => {
    setLoading(true);
    setError("");

    try {
      const isPasswordUpdate = formData.get("currentPassword") && formData.get("newPassword");

      const { data } = await API.put("/api/auth/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.user) {
        setProfile(data.user);
      }

      if (isPasswordUpdate) {
        return { success: true, message: "Password updated successfully" };
      }

      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Error updating profile";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch profile on mount
  useEffect(() => {
    if (localStorage.getItem("token")) {
      getAdminProfile();
    }
  }, [getAdminProfile]);

  return {
    profile,
    error,
    loading,
    isAuthenticated,
    handleLogin,
    logout: handleLogout, // Expose as logout for backward compatibility
    handleLogout,         // Keep for backward compatibility
    handleRegister,
    updateAdminProfile,
    getAdminProfile,
  };
};

export default useAuth;
