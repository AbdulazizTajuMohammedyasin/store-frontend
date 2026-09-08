import client from "./client";
import type { Customer, UpdateCustomerMembershipData, CustomerAdmin } from "../types/customer";

export const getCurrentCustomer = () =>
  client.get<Customer>("/customers/me/");

export const updateCustomer = (data: FormData) =>
  client.patch<Customer>("/customers/me/", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getCustomers = async () => {
  const response = await client.get<CustomerAdmin[]>("/customers/");

  return response.data;
};

export const updateCustomerMembership = async (
  id: number,
  data: UpdateCustomerMembershipData,
) => {
  const response = await client.patch<CustomerAdmin>(
    `/customers/${id}/`,
    data,
  );
 
  return response.data;
};