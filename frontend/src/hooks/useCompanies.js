import { useState, useCallback } from "react";

import axios from "axios";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "https://crypto-nmz7.onrender.com";

const API = axios.create({ baseURL: API_URL });

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

const useCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Get all companies
  const getCompanies = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/api/companies");
      console.log("Fetched companies:", data);
      setCompanies(data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  };

  // Get single company
  const getCompany = async (id) => {
    try {
      const { data } = await API.get(`/api/companies/${id}`);
      console.log("Fetched company data:", data);
      return data;
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch company");
      return null;
    }
  };

  // Create new company
  const createCompany = async (companyData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      
      // Handle basic fields
      Object.keys(companyData).forEach(key => {
        if (key !== 'logo' && key !== 'heroImages' && key !== 'testimonialImages') {
          if (typeof companyData[key] === 'object') {
            formData.append(key, JSON.stringify(companyData[key]));
          } else {
            formData.append(key, companyData[key]);
          }
        }
      });

      // Handle file uploads
      if (companyData.logo) {
        formData.append('logo', companyData.logo);
      }
      
      if (companyData.heroImages) {
        companyData.heroImages.forEach(image => {
          formData.append('heroImages', image);
        });
      }

      if (companyData.testimonialImages) {
        companyData.testimonialImages.forEach(image => {
          formData.append('testimonialImages', image);
        });
      }

      const { data } = await API.post("/api/companies", formData);
      setCompanies([...companies, data]);
      return data;
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create company");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update company
  const updateCompany = useCallback(async (id, companyData) => {
    setLoading(true);
    try {
      // Convert FormData to regular object
      const formDataObj = {};
      for(let [key, value] of companyData.entries()) {
        try {
          // Try to parse JSON strings
          formDataObj[key] = JSON.parse(value);
        } catch {
          // If not JSON, use raw value
          formDataObj[key] = value;
        }
      }

      if (companyData.logo) {
        formDataObj.logo = companyData.logo;
      } 
      
      if (companyData.heroImages) {
        formDataObj.heroImages = companyData.heroImages;
      }
      
      if (companyData.testimonialImages) {
        formDataObj.testimonialImages = companyData.testimonialImages;
      }
      
      const response = await API.put(`/api/companies/${id}`, formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Update companies state with new data
      setCompanies(prevCompanies => 
        prevCompanies.map(company => 
          company._id === id ? response.data : company
        )
      );
      
      return response.data;
    } catch (err) {
      console.error("Update error:", err);
      setError(err?.response?.data?.message || "Failed to update company");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete company
  const deleteCompany = async (id) => {
    setLoading(true);
    try {
      await API.delete(`/api/companies/${id}`);
      setCompanies(companies.filter(company => company._id !== id));
      return true;
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete company");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    companies,
    loading,
    error,
    getCompanies,
    getCompany,
    createCompany,
    updateCompany,
    deleteCompany
  };
};

export default useCompanies;
