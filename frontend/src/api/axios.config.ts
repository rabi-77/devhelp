import axios from "axios";
import { storage } from "@/utils/storage";
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
let isRefreshing = false;
let failedQueue: any[] = [];
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};
const PUBLIC_ROUTES = [
  "/auth/login",
  "/auth/signup",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/validate-invite",
  "/auth/accept-invitation",
  "/super-admin/login",
];
const isPublicRoute = (url: string) => {
  return PUBLIC_ROUTES.some((route) => url.includes(route));
};
const getLoginPage = () => {
  const user = storage.getUser();
  if (user?.role === "super_admin") {
    return "/super-admin/login";
  }
  return "/login";
};
const isOnLoginPage = () => {
  const pathname = window.location.pathname;
  return (
    pathname === "/login" ||
    pathname === "/super-admin/login" ||
    pathname === "/signup"
  );
};
apiClient.interceptors.request.use((config) => {
  const token = storage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401) {
      if (isPublicRoute(originalRequest.url)) {
        return Promise.reject(error);
      }
      if (isOnLoginPage()) {
        return Promise.reject(error);
      }
      if (!originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return apiClient(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }
        originalRequest._retry = true;
        isRefreshing = true;
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/refresh`,
            {},
            { withCredentials: true },
          );
          const { accessToken } = response.data.data;
          storage.setToken(accessToken);
          processQueue(null, accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          storage.clear();
          const loginPage = getLoginPage();
          window.location.href = loginPage;
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
    }
    return Promise.reject(error);
  },
);
export default apiClient;
