// src/api/pages.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://ak-kagaz.webtm.ru";

export const getPage = async (slug) => {
  const resp = await axios.get(`${API_BASE}/main/pages/${slug}/`);
  return resp.data;
};
