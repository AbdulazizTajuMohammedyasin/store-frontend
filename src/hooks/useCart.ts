import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
    getCart,
    addToCart,
    updateCartItem,
    deleteCartItem
} from "../api/cart";



export const useCart = () => {

    return useQuery({
        queryKey: ["cart"],
        queryFn: getCart
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