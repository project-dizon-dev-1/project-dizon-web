import { supabase } from "@/services/supabaseClient";
import axios, { AxiosError } from "axios";

let accessToken: string | null = null;
let tokenExpiresAt: number | null = null;
let refreshInProgress = false;
let refreshPromise: Promise<string | null> | null = null;

// Function to check if token is expired or will expire soon (within 1 minute)
const isTokenExpired = (): boolean => {
  if (!tokenExpiresAt) return true;
  return Date.now() >= tokenExpiresAt - 60000; // 1 minute buffer
};

// Function to get the latest access token
const updateAccessToken = async (): Promise<string | null> => {
  if (refreshInProgress && refreshPromise) {
    return refreshPromise;
  }

  refreshInProgress = true;
  refreshPromise = (async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();

      if (sessionData?.session) {
        const { data, error } = await supabase.auth.refreshSession();

        if (error) throw error;

        if (data?.session) {
          accessToken = data.session.access_token;
          tokenExpiresAt = data.session.expires_at
            ? data.session.expires_at * 1000
            : null;
          return accessToken;
        }
      }

      accessToken = null;
      tokenExpiresAt = null;
      return null;
    } catch (error) {
      console.warn("Failed to refresh session token:", error);
      accessToken = null;
      tokenExpiresAt = null;
      return null;
    } finally {
      refreshInProgress = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

// Initialize token on app startup
(async () => {
  try {
    const { data } = await supabase.auth.getSession();
    if (data?.session) {
      accessToken = data.session.access_token;
      tokenExpiresAt = data.session.expires_at
        ? data.session.expires_at * 1000
        : null;
    }
  } catch (error) {
    console.warn("Could not get initial session:", error);
    accessToken = null;
    tokenExpiresAt = null;
  }
})();

// Listen for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  if ((event === "TOKEN_REFRESHED" || event === "SIGNED_IN") && session) {
    accessToken = session.access_token;
    tokenExpiresAt = session.expires_at ? session.expires_at * 1000 : null;
  } else if (event === "SIGNED_OUT") {
    accessToken = null;
    tokenExpiresAt = null;
  }
});

// Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Single request interceptor - only refresh if token is expired
api.interceptors.request.use(
  async (config) => {
    try {
      // Only refresh if we don't have a token or it's expired
      if (!accessToken || isTokenExpired()) {
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

// Single response interceptor - handle 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    const originalRequest = (error as AxiosError).config;

    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      originalRequest &&
      !(originalRequest as any)._retry &&
      !originalRequest.url?.includes("/auth/") // Prevent infinite loop on auth endpoints
    ) {
      (originalRequest as any)._retry = true;

      try {
        // Force token refresh on 401
        accessToken = null; // Clear current token to force refresh
        tokenExpiresAt = null; // Clear expiration time too
        const newToken = await updateAccessToken();

        if (newToken && originalRequest.headers) {
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return api(originalRequest);
        } else {
          // If refresh failed or no token, sign out user
          console.warn("Token refresh failed, signing out user");
          await supabase.auth.signOut();
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // If refresh fails, sign out the user
        console.error("Token refresh failed:", refreshError);
        await supabase.auth.signOut();
        return Promise.reject(error);
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
