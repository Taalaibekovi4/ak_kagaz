// src/api/index.js
import axios from "axios";

// Vite ENV
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://ak-kagaz.webtm.ru";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false
});

export default api;
