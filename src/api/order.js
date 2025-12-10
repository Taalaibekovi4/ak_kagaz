// src/api/order.js
import { api, unwrap } from "./client";

/*
Swagger: POST /cart/orders/

{
  first_name: string,
  last_name: string,
  phone: string,
  email: string,
  extra_phone: string,
  person_type: "individual" | "legal",
  delivery_type: "pickup" | "courier",
  street: string,
  house: string,
  flat: string,
  delivery_comment: string,
  items: [
    { product_id: number, quantity: number },
    ...
  ]
}
*/

export async function createOrder(payload) {
  const response = await api.post("/cart/orders/", payload);
  return unwrap(response);
}
