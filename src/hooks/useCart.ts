import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
    getCart,
    addToCart,
    updateCartItem,
    deleteCartItem
} from "../api/cart";
import { useAuth } from "../context/AuthContext";



export const useCart = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ["cart"],
        queryFn: getCart,
        enabled: !!user,
    });

};



export const useAddToCart = () => {

    const queryClient = useQueryClient();


    return useMutation({

        mutationFn: ({
            product_id,
            quantity
        }: {
            product_id: number;
            quantity: number;
        }) =>
            addToCart(product_id, quantity),



        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey:["cart"]
            });

        }

    });

};



export const useUpdateCartItem = () => {

    const queryClient = useQueryClient();


    return useMutation({

        mutationFn: ({
            id,
            quantity
        }: {
            id:number;
            quantity:number;
        }) =>
            updateCartItem(id, quantity),


        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey:["cart"]
            });

        }

    });

};



export const useDeleteCartItem = () => {

    const queryClient = useQueryClient();


    return useMutation({

        mutationFn: (id:number) =>
            deleteCartItem(id),


        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey:["cart"]
            });

        }

    });

};