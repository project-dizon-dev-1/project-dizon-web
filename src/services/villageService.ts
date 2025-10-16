// src/services/villageServices.ts
import { axiosGet, axiosPost } from '@/lib/axios';
import { Database } from '@/types/database';

// Full type returned by the backend
export type VillageRequest =
  Database['public']['Tables']['village-requests']['Row'];

// Type for frontend payload (fields required to create a request)
export type VillageRequestPayload = {
  name: string;
  village_address: string;
  requester_email: string;
  user_id: string;
  status?: string;
  address?: string;
};

// Get a village request by email
export const getVillageRequestByEmail = async (
  email: string
): Promise<VillageRequest | null> => {
  if (!email) throw new Error('Email is required');
  const response = await axiosGet<VillageRequest | null>(
    `/village/request/email/${email}`
  );
  return response;
};

// Create a new village request
export const createVillageRequest = async (
  payload: VillageRequestPayload
): Promise<VillageRequest> => {
  if (!payload.name || !payload.requester_email || !payload.user_id) {
    throw new Error('Name, requester_email, and user_id are required');
  }

  const response = await axiosPost<VillageRequest>(
    '/village/request/create',
    payload as any
  );

  if (!response) {
    throw new Error('No data returned from server');
  }

  return response;
};
