import { supabase } from '@/services/supabaseClient';
import { useQuery } from '@tanstack/react-query';
import useUserContext from './useUserContext';

// Service function (only accepts valid string)
const fetchVillageByAdmin = async (adminId: string): Promise<any | null> => {
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

// Hook
export const useVillageByAdmin = () => {
  const { user } = useUserContext();
  const adminId = user?.id ?? null; // fallback to null

  return useQuery({
    queryKey: ['village-by-admin', adminId],
    queryFn: async () => {
      if (!adminId) return null; // skip if no user
      return fetchVillageByAdmin(adminId);
    },
    enabled: !!adminId, // prevent query if no ID
    staleTime: 1000 * 60 * 5,
  });
};
