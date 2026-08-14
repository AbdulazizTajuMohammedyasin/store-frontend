import client from "./client";
import type { Customer } from "../types/customer";

export const getCurrentCustomer = () =>
  client.get<Customer>("/customers/me/");

export const updateCustomer = (data: FormData) =>
  client.patch<Customer>("/customers/me/", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getCustomers = async () => {
  const response = await client.get<Customer[]>("/customers/");
 
  return response.data;
};