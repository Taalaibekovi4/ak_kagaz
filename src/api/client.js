// src/api/client.js
import axios from "axios";

// базовый URL бэка — либо из .env, либо дефолт
const baseURL =
  import.meta.env.VITE_API_BASE_URL || "https://ak-kagaz.webtm.ru/api";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// helper, чтобы доставать data
export const unwrap = (response) => {
  if (!response) return null;
  return response.data !== undefined ? response.data : response;
};

export default api;
