import axios from "axios";

const BASE_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/**
 * Server-side Axios instance (no Bearer token injection).
 * Used in Server Components / Server Actions.
 */
const apiServer = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default apiServer;
