// src/api/catalog.js
import { api, unwrap } from "./client";

// список товаров
// params: { page, page_size, search, category, ... }
export const getProducts = async (params = {}) => {
  const res = await api.get("/catalog/products/", { params });
  return unwrap(res);
};

// один товар по id (если понадобится)
export const getProduct = async (id) => {
  if (!id) throw new Error("Product id is required");
  const res = await api.get(`/catalog/products/${id}/`);
  return unwrap(res);
};

// дерево категорий: GET /catalog/categories/tree/
export const getCategories = async (params = {}) => {
  const res = await api.get("/catalog/categories/tree/", { params });
  return unwrap(res);
};
