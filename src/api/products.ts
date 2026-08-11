import client from "./client";
import type { Product, ProductParams, PaginatedResponse } from "../types";



export const getProducts = (params?: ProductParams) => {
    return client.get<PaginatedResponse<Product>>("/products/", {
        params
    });
};

export const getProduct = (id: number | string) =>
    client.get<Product>("/products/"+id+"/");

export const createProduct = (product: {
  title: string;
  description: string;
  inventory: number;
  price: number;
  collection: number;
}) => {
  return client.post("/products/", product);
};