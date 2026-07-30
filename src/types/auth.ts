export interface User {
    id: number;
    username: string;
    email: string;
}


export interface LoginData {
    username: string;
    password: string;
}


export interface RegisterData {
    email: string;
    username: string;
    password: string;
    re_password: string;
}


export interface TokenResponse {
    access: string;
    refresh: string;
}