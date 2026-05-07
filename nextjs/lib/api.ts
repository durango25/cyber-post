import axios from "axios";

/**
 * Client-side Axios instance.
 * All requests go through the Next.js API proxy (/api/proxy/...)
 * which injects the Bearer token server-side.
 */
const api = axios.create({
  baseURL: "/api/proxy",
  headers: {
    Accept: "application/json",
  },
});

export default api;
