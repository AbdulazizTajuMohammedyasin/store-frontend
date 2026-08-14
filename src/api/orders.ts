import client from "./client";
import type {
  Order,
  UpdateOrderData,
} from "../types/order";

export const getOrders = () => {
  return client.get<Order[]>("/orders/");
};

export const getOrder = (
  id: number | string,
) => {
  return client.get<Order>(
    `/orders/${id}/`,
  );
};

export const createOrder = () => {
  return client.post("/orders/", {});
};

export const updateOrder = (
  id: number,
  data: UpdateOrderData,
) => {
  return client.patch<Order>(
    `/orders/${id}/`,
    data,
  );
};