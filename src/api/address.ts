// src/api/addresses.ts

import client from "./client";
import  type { Address } from "../types/address";

export const getAddresses = () =>
  client.get<Address[]>("/addresses/");

export const createAddress = (data: Omit<Address, "id">) =>
  client.post<Address>("/addresses/", data);

export const updateAddress = (
  id: number,
  data: Omit<Address, "id">
) => client.put<Address>(`/addresses/${id}/`, data);

export const deleteAddress = (id: number) =>
  client.delete(`/addresses/${id}/`);