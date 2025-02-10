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
api.interceptors.request.use(async (config) => {
  if (!accessToken) {
    await updateAccessToken();
  }
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});

export const axiosPost = async <T>(endpoint: string, data: any): Promise<T | null> => {
  try {
    const response = await api.post<T>(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("Error creating:", error);
    throw error;
  }
};

export const axiosGet = async <T>(endpoint: string): Promise<T> => {
  try {
    const response = await api.get<T>(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error during GET request:', error);
    throw error; // or return a default value or handle the error accordingly
  }
};


export const axiosPut = async <T>(endpoint: string, data: T): Promise<T | null> => {
  try {
    const response = await api.put<T>(endpoint, data);
    return response.data;
  } catch (error) {
    console.error('Error during PUT request:', error);
    throw error; 
  }
};


export const axiosDelete = async <T>(endpoint: string): Promise<T | null> => {
  try {
    const response = await api.delete<T>(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error deleting:", error);
    throw error;
  }
};
