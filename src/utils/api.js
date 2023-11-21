// utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/", // Your Django REST server URL
});

const attachTokenToHeader = (config) => {
  const accessToken = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).tokens.access
    : null;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
};

api.interceptors.request.use(attachTokenToHeader, (error) => Promise.reject(error));

export default api;
