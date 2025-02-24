import axios from "axios";

// Create a custom Axios instance
const axiosInstance = axios.create({
    baseURL: 'https://apipos.shopcurations.shop', // Set your base URL here

    headers: {
        "Content-Type": "application/json", // Default headers
    },
});

// Add an interceptor to add the token to the request headers
axiosInstance.interceptors.request.use(
    (config) => {
        // Retrieve the token from localStorage
        const token = localStorage.getItem("token");

        // If the token exists, add it to the Authorization header
        if (token) {
            config.headers["Authorization"] = `${token}`;
        }

        return config;
    },
    (error) => {
        // If there was an error with the request, return the error
        return Promise.reject(error);
    }
);

// Add an interceptor to handle errors globally
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Remove invalid token from storage
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            // Redirect to login page
            window.location.href = "/login"; // หรือใช้ router.push("/login") ใน Vue
        }

        return Promise.reject(error);
    }
);

export const axiosPrivate = axiosInstance;
