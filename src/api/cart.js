import { api, unwrap } from "./client";

// оформление заказа
export const createOrder = (payload) =>
  unwrap(api.post("/cart/orders/", payload));

/*
payload структура строго под твой Swagger:

{
  first_name: "",
  last_name: "",
  phone: "",
  email: "",
  extra_phone: "",
  person_type: "individual" | "legal",
  delivery_type: "pickup" | "courier",
  street: "",
  house: "",
  flat: "",
  delivery_comment: "",
  items: [
    { product_id: 1, quantity: 2 },
    ...
  ]
}
*/
