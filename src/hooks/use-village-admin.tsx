import { supabase } from '@/services/supabaseClient';
import { useQuery } from '@tanstack/react-query';
import useUserContext from './useUserContext';

// 🔹 Helper: Generate signed URL if logo exists
const generateSignedVillageLogoUrl = async (villageData: any) => {
  if (!villageData?.village_logo_url) return villageData;

  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from('files') // ✅ your bucket name (update if different)
    .createSignedUrl(villageData.village_logo_url, 60 * 60 * 24); // valid for 24h

  if (signedUrlError) {
    console.warn('Failed to generate signed URL:', signedUrlError.message);
    return villageData;
  }

  return {
    ...villageData,
    village_logo_signed_url: signedUrlData.signedUrl,
  };
};

// 🔹 Fetch village where user is the main admin (superadmin)
const fetchVillageByMainAdmin = async (
  adminId: string
): Promise<any | null> => {
  const { data, error } = await supabase
    .from('village-list')
    .select('*')
    .eq('village_main_admin', adminId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching village (main admin):', error);
    throw new Error(error.message);
  }

  if (!data) return null;
  return await generateSignedVillageLogoUrl(data);
};

// 🔹 Fetch village where user is a resident admin (linked via house)
const fetchVillageByResidentAdmin = async (
  adminId: string
): Promise<any | null> => {
  // Step 1: Find the house where user is main POC
  const { data: houseData, error: houseError } = await supabase
    .from('house-list')
    .select('village_id')
    .eq('house_main_poc', adminId)
    .single();

  if (houseError && houseError.code !== 'PGRST116') {
    console.error('Error fetching house:', houseError);
    throw new Error(houseError.message);
  }

  if (!houseData?.village_id) return null;

  // Step 2: Fetch the village using that ID
  const { data: villageData, error: villageError } = await supabase
    .from('village-list')
    .select('*')
    .eq('id', houseData.village_id)
    .single();

  if (villageError && villageError.code !== 'PGRST116') {
    console.error('Error fetching village (resident admin):', villageError);
    throw new Error(villageError.message);
  }

  if (!villageData) return null;
  return await generateSignedVillageLogoUrl(villageData);
};

// 🔹 Unified fetcher for any admin type
const fetchVillageByAdmin = async (
  adminId: string,
  role: string
): Promise<any | null> => {
  if (role === 'superadmin') {
    return fetchVillageByMainAdmin(adminId);
  }

  // Try main admin first (in case user has multiple roles)
  const mainAdminVillage = await fetchVillageByMainAdmin(adminId);
  if (mainAdminVillage) return mainAdminVillage;

  // Then fallback to resident admin
  return fetchVillageByResidentAdmin(adminId);
};

// 🔹 React Query Hook
export const useVillageByAdmin = () => {
  const { user } = useUserContext();
  const adminId = user?.id ?? null;
  const role = user?.role ?? '';

  return useQuery({
    queryKey: ['village-by-admin', adminId],
    queryFn: async () => {
      if (!adminId) return null;
      return fetchVillageByAdmin(adminId, role);
    },
    enabled: !!adminId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
