import client from "./client";
import type { Order } from "../types/order";

export const getOrders = () => {
  return client.get<Order[]>("/orders/");
};

export const getOrder = (
  id: number | string
) => {
  return client.get<Order>(
    `/orders/${id}/`
  );
};

export const createOrder = () => {
  return client.post("/orders/", {});
};