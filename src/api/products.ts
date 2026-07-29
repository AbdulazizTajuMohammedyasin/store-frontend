import client from "./client";
import type { Product } from "../types";

export const getProducts = () => {
  return client.get<Product[]>("/products/");
};