// src/api/news.js
import { api, unwrap } from "./client";

// список новостей: GET /main/news/
export const getNewsList = async (params = {}) => {
  const res = await api.get("/main/news/", { params });
  return unwrap(res); // вернёт data
};

// детальная новость: GET /main/news/{slug}/
export const getNewsDetail = async (slug) => {
  if (!slug) {
    throw new Error("Slug is required for getNewsDetail");
  }
  const res = await api.get(`/main/news/${slug}/`);
  return unwrap(res); // вернёт data
};
