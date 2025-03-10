import { supabase } from "@/services/supabaseClient";
import axios from "axios";

let accessToken: string | null = null;

// Function to get the latest access token
const updateAccessToken = async () => {
  const { data } = await supabase.auth.getSession();
  accessToken = data?.session?.access_token || null;
};

// Initialize token on app startup
updateAccessToken();

// Listen for token refresh events and update in memory
supabase.auth.onAuthStateChange((event, session) => {
  if (event === "TOKEN_REFRESHED" && session) {
    accessToken = session.access_token;
  }
});

// Axios instance
const api = axios.create({
  baseURL: "https://estateflow.onrender.com",
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
    if (axios.isAxiosError(error)) {
      console.error(
        "Request error:",
        error.response?.data?.message || error.message || "Unknown error"
      );
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
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      const errorMessage =
        responseData?.message || error.message || "Unknown error occurred";
      const errorDetails = responseData?.errors
        ? JSON.stringify(responseData.errors, null, 2)
        : null;

      console.error("Response error:", errorMessage);
      if (errorDetails) {
        console.error("Error details:", errorDetails);
      }

      throw new Error(
        errorDetails
          ? `${errorMessage} - Details: ${errorDetails}`
          : errorMessage
      );
    } else {
      console.error("Unexpected error:", error);
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
  data: T
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
  config?: { params?: Record<string, string | undefined | null> }
): Promise<T | null> => {
  try {
    const response = await api.delete<T>(endpoint, config);
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
