import client from "./client";

import type {
    LoginData,
    RegisterData
} from "../types/auth";



export const registerUser = (data:RegisterData)=>{

    return client.post(
        "/auth/users/",
        data
    );

};



export const loginUser = (data:LoginData)=>{

    return client.post(
        "/auth/jwt/create/",
        data
    );

};



export const getCurrentUser = ()=>{

    return client.get(
        "/auth/users/me/"
    );

};