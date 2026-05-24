import axios from "axios";
import { API_URL } from "./constants";

const api = axios.create({
    baseURL: API_URL
});

api.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization =
            `Bearer ${token}`;
    }

    return config;
});

// Response interceptor
api.interceptors.response.use(
    (response) => response,

    (error) => {

        if (error.response?.status === 401) {

            // Remove invalid session
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("username");
            localStorage.removeItem("fullname");

            // Redirect to login page
            window.location.href = "/";
        }

        return Promise.reject(error);
    }
);
export default api;