import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "https://crypto-nmz7.onrender.com";

const API = axios.create({ baseURL: API_URL });

// ✅ Automatically attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn("⚠️ No token found in localStorage!");
  }
  return config;
}, (error) => Promise.reject(error));


const useAuth = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getAdminProfile = async () => {
    const token = localStorage.getItem("token");
    console.log("Token being sent:", token); // ✅ Debugging
  
    if (!token) {
      console.error("🚨 No token found in localStorage! Redirecting to login.");
      navigate("/auth/login");
      return;
    }
  
    try {
      const { data } = await API.get("/api/auth/me");
      console.log("Profile data:", data);
      setProfile(data);
    } catch (error) {
      console.error("❌ API Request Failed:", error.response);
      if (error.response?.status === 401) {
        console.error("🚨 Unauthorized! Redirecting to login.");
        localStorage.removeItem("token");
        navigate("/auth/login");
      }
      setError(error.response?.data?.message || "Error fetching profile");
    }
  };
  

  // Login Handler
  const handleLogin = async (credentials) => {
    setLoading(true);
    setError("");

    try {
      const { data } = await API.post("/api/auth/login", credentials);
      localStorage.setItem("token", data.token);
      setProfile(data.admin);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (credentials) => {
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
  }
  
  // Update Admin Profile
  const updateAdminProfile = async (formData) => {
    setLoading(true);
    setError("");
    
    try {
      // Check if this is a password update
      const isPasswordUpdate = formData.get('currentPassword') && formData.get('newPassword');
      
      const { data } = await API.put(
        "/api/auth/profile", 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      // Update profile in state if this was a profile update
      if (data.user) {
        setProfile(data.user);
      }
      
      // If this was a password update, show success message
      if (isPasswordUpdate) {
        return { success: true, message: 'Password updated successfully' };
      }
      
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         (error.response?.data?.error || "Error updating profile");
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Logout Handler
  const logout = async () => {
    try {
      await API.post("/api/auth/logout");
      localStorage.removeItem("token");
      setProfile(null);
      navigate("/login");
    } catch (error) {
      console.error("❌ Logout failed:", error);
      setError("Logout failed. Please try again.");
    }
  };

  // Auto-fetch profile on mount
  useEffect(() => {
    if (localStorage.getItem("token")) getAdminProfile();
  }, []);

  return { profile, error, loading, handleLogin, handleRegister, getAdminProfile, updateAdminProfile, logout };
};

export default useAuth;
