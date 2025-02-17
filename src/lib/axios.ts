import { supabase } from "@/services/supabaseClient";
import axios from "axios";

let accessToken: string | null = null;

// Function to get the latest access token
const updateAccessToken = async () => {
  const { data } = await supabase.auth.getSession();
  accessToken = data?.session?.access_token || null;
};

// Initialize token on app startup
await updateAccessToken();

// Listen for token refresh events and update in memory
supabase.auth.onAuthStateChange((event, session) => {
  if (event === "TOKEN_REFRESHED" && session) {
    accessToken = session.access_token;
  }
});

// Axios instance
const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Axios request interceptor to always use the latest token
api.interceptors.request.use(
  async (config) => {
    if (!accessToken) {
      await updateAccessToken();
    }
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: unknown) => {
    // Narrowing type of `error` to `AxiosError`
    if (axios.isAxiosError(error)) {
      console.error("Request error:", error.response?.data?.message || error.message || "Unknown error");
    } else {
      console.error("Unexpected error:", error);
    }
    return Promise.reject(error);
  }
);

// Axios response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    // Narrowing type of `error` to `AxiosError`
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message || "Unknown error occurred";
      console.error("Response error:", errorMessage);
    } else {
      console.error("Unexpected error:", error);
    }
    return Promise.reject(error);
  }
);

// Update error handling for axios functions
export const axiosPost = async <T>(endpoint: string, data: any): Promise<T | null> => {
  try {
    const response = await api.post<T>(endpoint, data); // Pass `config` with `params` if needed
    return response.data;
  } catch (error: unknown) {
    // Narrowing type of `error` to `AxiosError`
    if (axios.isAxiosError(error)) {
      console.error("Error during POST request:", error.response?.data?.message || error.message || "Unknown error");
    } else {
      console.error("Unexpected error during POST request:", error);
    }
    throw error;
  }
};

export const axiosGet = async <T>(endpoint: string, config?: { params?: Record<string, string | undefined | null> }): Promise<T> => {
  try {
    const response = await api.get<T>(endpoint, config); // Pass `config` which includes `params`
    return response.data;
  } catch (error: unknown) {
    // Narrowing type of `error` to `AxiosError`
    if (axios.isAxiosError(error)) {
      console.error("Error during GET request:", error.response?.data?.message || error.message || "Unknown error");
    } else {
      console.error("Unexpected error during GET request:", error);
    }
    throw error;
  }
};

export const axiosPut = async <T>(endpoint: string, data: T,): Promise<T | null> => {
  try {
    const response = await api.put<T>(endpoint, data, ); 
    return response.data;
  } catch (error: unknown) {
    // Narrowing type of `error` to `AxiosError`
    if (axios.isAxiosError(error)) {
      console.error("Error during PUT request:", error.response?.data?.message || error.message || "Unknown error");
    } else {
      console.error("Unexpected error during PUT request:", error);
    }
    throw error;
  }
};

export const axiosDelete = async <T>(endpoint: string, config?: { params?: Record<string, string | undefined| null> }): Promise<T | null> => {
  try {
    const response = await api.delete<T>(endpoint, config); // Pass `config` with `params` if needed
    return response.data;
  } catch (error: unknown) {
    // Narrowing type of `error` to `AxiosError`
    if (axios.isAxiosError(error)) {
      console.error("Error during DELETE request:", error.response?.data?.message || error.message || "Unknown error");
    } else {
      console.error("Unexpected error during DELETE request:", error);
    }
    throw error;
  }
};

