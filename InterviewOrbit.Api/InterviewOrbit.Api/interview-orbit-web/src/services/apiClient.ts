import axios from "axios";

// Single source of truth for the backend URL. Reads the Vite env var so the
// frontend always points at the configured backend; falls back to the
// documented dev port if the env var is missing.
export const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5158";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default apiClient;