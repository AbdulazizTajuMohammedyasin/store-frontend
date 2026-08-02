import client from "./client";
import type { Cart } from "../types/cart";

export const getCart = () => {
  return client.get<Cart[]>("/cart/");
};

export const addToCart = (
  product_id: number,
  quantity: number
) => {
  return client.post("/cart-items/", {
    product_id,
    quantity,
  });
};

export const updateCartItem = (
  id: number,
  quantity: number
) => {
  return client.patch(`/cart-items/${id}/`, {
    quantity,
  });
};

export const deleteCartItem = (
  id: number
) => {
  return client.delete(`/cart-items/${id}/`);
};