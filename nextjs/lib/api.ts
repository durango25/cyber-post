import axios from "axios";
import { getSession } from "next-auth/react";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

api.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.user?.token) {
    config.headers.Authorization = `Bearer ${session.user.token}`;
  }
  return config;
});

export default api;
