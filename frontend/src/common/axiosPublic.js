import axios from "axios";

// Create a custom Axios instance
const axiosInstance = axios.create({
  baseURL: 'https://apipos.shopcurations.shop', // Set your base URL here
  headers: {
    "Content-Type": "application/json", // Default headers
  },
});

export const axiosPublic = axiosInstance;
