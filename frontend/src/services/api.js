import axios from "axios";
import { getToken } from "../utils/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getApiError = (error, fallback = "Something went wrong. Please try again.") => {
  if (!error?.response) return "Unable to reach the server. Please check your connection or API URL.";
  const data = error.response.data;
  if (typeof data?.message === "string") return data.message;
  if (typeof data?.error === "string") return data.error;
  if (data && typeof data === "object") {
    const first = Object.values(data).flat?.().find((value) => typeof value === "string");
    if (first) return first;
  }
  return fallback;
};

export const authApi = {
  register: (payload) => api.post("/auth/register", payload),
  login: (payload) => api.post("/auth/login", payload),
};

export const taskApi = {
  list: () => api.get("/tasks"),
  create: (payload) => api.post("/tasks", payload),
  update: (id, payload) => api.put(`/tasks/${id}`, payload),
  remove: (id) => api.delete(`/tasks/${id}`),
};

export const userApi = {
  list: () => api.get("/users"),
  remove: (id) => api.delete(`/users/${id}`),
};

export default api;
