import { useQuery } from "@tanstack/react-query";
import { getProducts, getProduct } from "../api/products";

export default function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });
}

export const useProduct = (id: number | string) => {
    return useQuery({
        queryKey: ["product", id],
        queryFn: () => getProduct(id),
    });
};