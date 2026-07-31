import axios from "axios";

const client = axios.create({
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


client.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config as typeof error.config & {
      _retry?: boolean;
    };

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem("refresh");

      if (!refresh) {
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/jwt/refresh/`,
          {
            refresh,
          }
        );

        const newAccessToken = response.data.access;

        localStorage.setItem("access", newAccessToken);

        originalRequest.headers.Authorization = `JWT ${newAccessToken}`;

        return client(originalRequest);

      } catch (refreshError) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default client;