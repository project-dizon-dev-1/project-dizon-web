import { supabase } from '@/services/supabaseClient';
import { useQuery } from '@tanstack/react-query';
import useUserContext from './useUserContext';

// Service function to fetch village by main admin (superadmin)
const fetchVillageByMainAdmin = async (
  adminId: string
): Promise<any | null> => {
  const { data, error } = await supabase
    .from('village-list')
    .select('*')
    .eq('village_main_admin', adminId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching village:', error);
    throw new Error(error.message);
  }

  return data || null;
};

// Service function to fetch village by resident admin (via house)
const fetchVillageByResidentAdmin = async (
  adminId: string
): Promise<any | null> => {
  // First, get the house where user is the main POC
  const { data: houseData, error: houseError } = await supabase
    .from('house-list')
    .select('village_id')
    .eq('house_main_poc', adminId)
    .single();

  if (houseError && houseError.code !== 'PGRST116') {
    console.error('Error fetching house:', houseError);
    throw new Error(houseError.message);
  }

  if (!houseData || !houseData.village_id) {
    return null;
  }

  // Then fetch the village data using the village_id
  const { data: villageData, error: villageError } = await supabase
    .from('village-list')
    .select('*')
    .eq('id', houseData.village_id)
    .single();

  if (villageError && villageError.code !== 'PGRST116') {
    console.error('Error fetching village:', villageError);
    throw new Error(villageError.message);
  }

  return villageData || null;
};

// Combined fetch function
const fetchVillageByAdmin = async (
  adminId: string,
  role: string
): Promise<any | null> => {
  // If superadmin (main admin), fetch directly
  if (role === 'superadmin') {
    return fetchVillageByMainAdmin(adminId);
  }

  // For admin or resident, try main admin first, then house lookup
  const mainAdminVillage = await fetchVillageByMainAdmin(adminId);

  if (mainAdminVillage) {
    return mainAdminVillage;
  }

  // If not main admin, try fetching via house
  return fetchVillageByResidentAdmin(adminId);
};

// Hook
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
    staleTime: 1000 * 60 * 5,
  });
};
