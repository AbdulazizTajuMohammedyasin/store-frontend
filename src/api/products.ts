import client from "./client";
import type { Product, ProductParams } from "../types";



export const getProducts = (params?: ProductParams) => {
    return client.get<Product[]>("/products/", {
        params
    });
};

export const getProduct = (id: number | string) =>
    client.get<Product>("/products/"+id+"/");