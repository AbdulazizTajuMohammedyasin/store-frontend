import axios from "axios";

const client =  axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");

  const method = config.method?.toLowerCase();
  const url = config.url ?? "";

  // Public GET endpoints
  const isPublicGet =
    method === "get" &&
    (url.startsWith("/products/") ||
      url.startsWith("/collections/"));

  // Public POST endpoints
  const isPublicPost =
    method === "post" &&
    (url === "/auth/users/" ||
      url === "/auth/jwt/create/" ||
      url === "/auth/jwt/refresh/");

  if (token && !(isPublicGet || isPublicPost)) {
    config.headers.Authorization = `JWT ${token}`;
  }

  return config;
});

export default client;