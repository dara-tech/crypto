import { useState, useCallback } from "react";

import axios from "axios";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "https://daracheol-6adc.onrender.com";

const API = axios.create({ baseURL: API_URL });

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

const useCampanies = () => {
  const [campanies, setCampanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Get all campanies
  const getCompanies = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/api/campanies");
      console.log("Fetched campanies:", data);
      setCampanies(data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch campanies");
    } finally {
      setLoading(false);
    }
  };

  // Get single campany
  const getCampany = async (id) => {
    try {
      const { data } = await API.get(`/api/campanies/${id}`);
      console.log("Fetched campany data:", data);
      return data;
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch campany");
      return null;
    }
  };

  // Create new campany
  const createCampany = async (campanyData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      
      // Handle basic fields
      Object.keys(campanyData).forEach(key => {
        if (key !== 'logo' && key !== 'heroImages' && key !== 'testimonialImages') {
          if (typeof campanyData[key] === 'object') {
            formData.append(key, JSON.stringify(campanyData[key]));
          } else {
            formData.append(key, campanyData[key]);
          }
        }
      });

      // Handle file uploads
      if (campanyData.logo) {
        formData.append('logo', campanyData.logo);
      }
      
      if (campanyData.heroImages) {
        campanyData.heroImages.forEach(image => {
          formData.append('heroImages', image);
        });
      }

      if (campanyData.testimonialImages) {
        campanyData.testimonialImages.forEach(image => {
          formData.append('testimonialImages', image);
        });
      }

      const { data } = await API.post("/api/campanies", formData);
      setCampanies([...campanies, data]);
      return data;
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create campany");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update campany
  const updateCampany = useCallback(async (id, campanyData) => {
    setLoading(true);
    try {
      // Convert FormData to regular object
      const formDataObj = {};
      for(let [key, value] of campanyData.entries()) {
        try {
          // Try to parse JSON strings
          formDataObj[key] = JSON.parse(value);
        } catch {
          // If not JSON, use raw value
          formDataObj[key] = value;
        }
      }

      if (campanyData.logo) {
        formDataObj.logo = campanyData.logo;
      } 
      
      if (campanyData.heroImages) {
        formDataObj.heroImages = campanyData.heroImages;
      }
      
      if (campanyData.testimonialImages) {
        formDataObj.testimonialImages = campanyData.testimonialImages;
      }
      
      const response = await API.put(`/api/campanies/${id}`, formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Update campanies state with new data
      setCampanies(prevCampanies => 
        prevCampanies.map(campany => 
          campany._id === id ? response.data : campany
        )
      );
      
      return response.data;
    } catch (err) {
      console.error("Update error:", err);
      setError(err?.response?.data?.message || "Failed to update campany");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete campany
  const deleteCampany = async (id) => {
    setLoading(true);
    try {
      await API.delete(`/api/campanies/${id}`);
      setCampanies(campanies.filter(campany => campany._id !== id));
      return true;
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete campany");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    campanies,
    loading,
    error,
    getCompanies,
    createCampany,
    updateCampany,
    deleteCampany
  };
};

export default useCampanies;
