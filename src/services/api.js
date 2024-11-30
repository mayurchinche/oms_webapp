import axios from 'axios';

// Set the base URL of your API
const API_BASE_URL = "https://ordermanagementservice-backend.onrender.com/api/core/api";
// const API_BASE_URL = "http://127.0.0.1:5000/api/core/api";

// Set up a reusable axios instance with default headers
const apiInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'accept': 'application/json',
    'Authorization': "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb250YWN0X251bWJlciI6Iis5MTk2NTc0OTEyODgiLCJyb2xlIjoibWFuYWdlciIsImV4cCI6MTczMzAyMzc5Nn0.FcELRJtbbvrrUbvf8sABhr-msyUTRoashWgxm_-HLVE",
    'role': 'manager',  // Replace with the dynamic role if needed
  },
});

// Function to fetch cost analysis highlights
export const getCostHighlights = async (startDate, endDate) => {
  try {
    // Make the GET request with query parameters
    const response = await apiInstance.get('/cost-analysis/highlights', {
      params: { start_date: startDate, end_date: endDate }
    });
    return response.data;  // Returning the data from the response
  } catch (error) {
    console.error("Error fetching cost highlights:", error);
    throw error;  // Re-throw the error for further handling if necessary
  }
};
// Fetch price trend
export const getPriceTrend = async (startDate, endDate, interval) => {
    try {
      const response = await apiInstance.get('/cost-analysis/get_price_trend', {
        params: { start_date: startDate, end_date: endDate, interval: interval },
      });
      return response.data; // Returning the data from the response
    } catch (error) {
      console.error("Error fetching price trend:", error);
      throw error;
    }
  };
  
  // Function to fetch supplier performance
export const getSupplierPerformance = async (startDate, endDate) => {
    try {
      const response = await apiInstance.get('/core/api/supplier-performance', {
        params: { start_date: startDate, end_date: endDate },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching supplier performance:", error);
      throw error;
    }
  };
  