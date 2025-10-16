// src/types/VillageTypes.ts
export type VillageRequestPayload = {
  name: string;
  village_address: string;
  requester_email: string;
  user_id: string;
  status?: string;
  address?: string;
};

export type VillageRequest = {
  id: number;
  name: string | null;
  village_address: string | null;
  requester_email: string | null;
  requested_by: string | null;
  requested_at: string;
  user_id: string | null;
  address: string | null;
  status: string | null;
};
