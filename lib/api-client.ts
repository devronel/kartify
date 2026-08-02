import axios, { AxiosError } from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true, // sends/receives cookies cross-origin
});

// --- Reads a cookie value by name (used to grab the CSRF token) ---
function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

// --- Request interceptor — attach CSRF token automatically on state-changing requests ---
apiClient.interceptors.request.use((config) => {
  const method = config.method?.toUpperCase();

  if (method && ["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    const csrfToken = getCookie("XSRF-TOKEN");
    if (csrfToken) {
      config.headers["X-XSRF-TOKEN"] = csrfToken;
    }
  }

  return config;
});

// --- Response interceptor — normalize error handling ---
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export async function ensureCsrfCookie() {
  await apiClient.get("/api/csrf-cookie");
}

export function isAxiosError<T = unknown>( error: unknown ): error is AxiosError<T> {
  return axios.isAxiosError(error);
}

export default apiClient;