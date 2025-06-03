import { supabase } from "@/services/supabaseClient";
import axios, { AxiosError } from "axios";

let accessToken: string | null = null;
let refreshInProgress = false;
let refreshPromise: Promise<string | null> | null = null;

// Function to get the latest access token
const updateAccessToken = async () => {
  if (refreshInProgress && refreshPromise) {
    return refreshPromise;
  }

  refreshInProgress = true;
  refreshPromise = (async () => {
    try {
      // Check if there's an existing session first
      const { data: sessionData } = await supabase.auth.getSession();

      // Only attempt to refresh if we have an existing session
      if (sessionData?.session) {
        // Force refresh the session
        const { data, error } = await supabase.auth.refreshSession();

        if (error) throw error;

        accessToken = data?.session?.access_token || null;
        return accessToken;
      } else {
        // No session exists, so don't try to refresh
        accessToken = null;
        return null;
      }
    } catch (error) {
      console.warn("Failed to refresh session token:", error);
      accessToken = null;
      return null;
    } finally {
      refreshInProgress = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

// Initialize token on app startup - but don't log an error if no session exists
(async () => {
  try {
    const { data } = await supabase.auth.getSession();
    accessToken = data?.session?.access_token || null;
  } catch (error) {
    console.warn("Could not get initial session:", error);
    accessToken = null;
  }
})();

// Listen for token refresh events and update in memory
supabase.auth.onAuthStateChange((event, session) => {
  if ((event === "TOKEN_REFRESHED" || event === "SIGNED_IN") && session) {
    accessToken = session.access_token;
  } else if (event === "SIGNED_OUT") {
    accessToken = null;
  }
});

// Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Axios request interceptor to always use the latest token
api.interceptors.request.use(
  async (config) => {
    try {
      if (!accessToken) {
        await updateAccessToken();
      }
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
    } catch (error) {
      console.warn("Error updating access token:", error);
    }

    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    const originalRequest = (error as AxiosError).config;

    // Check if error is due to expired token
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      originalRequest &&
      !(originalRequest as any)._retry
    ) {
      (originalRequest as any)._retry = true;

      try {
        // Force token refresh
        await updateAccessToken();

        // Update the authorization header
        if (accessToken) {
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        }

        // Retry the request with new token
        return axios(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// POST Request
export const axiosPost = async <T>(
  endpoint: string,
  data?: T
): Promise<T | null> => {
  try {
    const isFormData = data instanceof FormData;
    const response = await api.post<T>(endpoint, data, {
      headers: {
        ...(isFormData
          ? { "Content-Type": "multipart/form-data" }
          : { "Content-Type": "application/json" }),
      },
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      const errorMessage =
        responseData?.message || error.message || "Unknown error";
      const errorDetails = responseData?.errors
        ? JSON.stringify(responseData.errors, null, 2)
        : null;

      console.error("Error during POST request:", errorMessage);
      if (errorDetails) {
        console.error("Error details:", errorDetails);
      }

      throw new Error(
        errorDetails
          ? `${errorMessage} - Details: ${errorDetails}`
          : errorMessage
      );
    } else {
      console.error("Unexpected error during POST request:", error);
    }
    throw error;
  }
};

// GET Request
export const axiosGet = async <T>(
  endpoint: string,
  config?: { params?: Record<string, string | undefined | null> }
): Promise<T> => {
  try {
    const response = await api.get<T>(endpoint, config);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      const errorMessage =
        responseData?.message || error.message || "Unknown error";
      const errorDetails = responseData?.errors
        ? JSON.stringify(responseData.errors, null, 2)
        : null;

      console.error("Error during GET request:", errorMessage);
      if (errorDetails) {
        console.error("Error details:", errorDetails);
      }

      throw new Error(
        errorDetails
          ? `${errorMessage} - Details: ${errorDetails}`
          : errorMessage
      );
    } else {
      console.error("Unexpected error during GET request:", error);
    }
    throw error;
  }
};

// PUT Request
export const axiosPut = async <T>(
  endpoint: string,
  data?: T
): Promise<T | null> => {
  try {
    const isFormData = data instanceof FormData;

    const response = await api.put<T>(endpoint, data, {
      headers: {
        ...(isFormData
          ? { "Content-Type": "multipart/form-data" }
          : {
              "Content-Type": "application/json",
            }),
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      const errorMessage =
        responseData?.message || error.message || "Unknown error";
      const errorDetails = responseData?.errors
        ? JSON.stringify(responseData.errors, null, 2)
        : null;

      console.error("Error during PUT request:", errorMessage);
      if (errorDetails) {
        console.error("Error details:", errorDetails);
      }

      throw new Error(
        errorDetails
          ? `${errorMessage} - Details: ${errorDetails}`
          : errorMessage
      );
    } else {
      console.error("Unexpected error during PUT request:", error);
    }
    throw error;
  }
};

// DELETE Request
export const axiosDelete = async <T>(
  endpoint: string,
  data?: T
): Promise<T | null> => {
  try {
    const response = await api.delete<T>(endpoint, { data });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      const errorMessage =
        responseData?.message || error.message || "Unknown error";
      const errorDetails = responseData?.errors
        ? JSON.stringify(responseData.errors, null, 2)
        : null;

      console.error("Error during DELETE request:", errorMessage);
      if (errorDetails) {
        console.error("Error details:", errorDetails);
      }

      throw new Error(
        errorDetails
          ? `${errorMessage} - Details: ${errorDetails}`
          : errorMessage
      );
    } else {
      console.error("Unexpected error during DELETE request:", error);
    }
    throw error;
  }
};
