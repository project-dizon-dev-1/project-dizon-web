// src/services/villageServices.ts
import { axiosGet, axiosPost, axiosPut } from '@/lib/axios';
import { Database } from '@/types/database';

// -------------------- TYPES --------------------

// Full type returned by the backend
export type VillageRequest =
  Database['public']['Tables']['village-requests']['Row'];

// Payload for creating a village request
export type VillageRequestPayload = {
  name: string;
  village_address: string;
  requester_email: string;
  user_id: string;
  status?: string;
  address?: string;
};

// -------------------- VILLAGE REQUESTS --------------------

// ✅ Get a village request by email
export const getVillageRequestByEmail = async (
  email: string
): Promise<VillageRequest | null> => {
  if (!email) throw new Error('Email is required');
  const response = await axiosGet<VillageRequest | null>(
    `/village/request/email/${email}`
  );
  return response;
};

// ✅ Create a new village request
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

// -------------------- VILLAGE UPDATES --------------------

/**
 * ✅ Update a village (multipart/form-data)
 *
 * Frontend should create a `FormData` object before calling this function.
 *
 * @param villageId - The ID of the village to update
 * @param data - FormData containing the update fields
 *
 * @example
 * const formData = new FormData();
 * formData.append('village_name', 'Dizon Estate');
 * formData.append('village_description', 'Updated community info');
 * formData.append('village_address', 'Blk 1, Lot 10');
 * formData.append('village_logo', file); // optional image file
 *
 * await updateVillage('village-id-123', formData);
 *
 * Accepted FormData keys:
 * - `village_name`: string (optional)
 * - `village_description`: string (optional)
 * - `village_address`: string (optional)
 * - `village_logo`: File | Blob (optional)
 */
export const updateVillage = async (
  villageId: string,
  data: FormData
): Promise<any> => {
  const response = await axiosPut(`/village/update/${villageId}`, data);
  return response;
};
