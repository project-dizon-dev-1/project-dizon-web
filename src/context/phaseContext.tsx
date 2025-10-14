import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllPhases } from '@/services/subdivisionServices';
import { Phase } from '@/types/subdivisionTypes';
import { useVillageByAdmin } from '@/hooks/use-village-admin';

// Define context type
interface PhaseContextType {
  phases: Phase[];
  setPhases: React.Dispatch<React.SetStateAction<Phase[]>>;
  isLoading: boolean;
  refetchPhases: () => void;
}

// Create context
const PhaseContext = createContext<PhaseContextType | undefined>(undefined);

interface PhaseProviderProps {
  children: ReactNode;
}

export const PhaseProvider = ({ children }: PhaseProviderProps) => {
  const [phases, setPhases] = useState<Phase[]>([]);

  // ✅ Get the village managed by this admin
  const { data: village, isLoading: isVillageLoading } = useVillageByAdmin();
  const villageId = village?.id;

  // ✅ Fetch phases only for that village
  const {
    data: phasesData,
    isLoading: isPhasesLoading,
    refetch: refetchPhases,
  } = useQuery({
    queryKey: ['phases', villageId],
    queryFn: () => fetchAllPhases(villageId),
    enabled: !!villageId, // only run when villageId is available
  });

  useEffect(() => {
    if (phasesData) setPhases(phasesData);
  }, [phasesData]);

  const value = {
    phases,
    setPhases,
    isLoading: isVillageLoading || isPhasesLoading,
    refetchPhases,
  };

  return (
    <PhaseContext.Provider value={value}>{children}</PhaseContext.Provider>
  );
};

// Hook to consume the context
export const usePhaseContext = () => {
  const context = useContext(PhaseContext);
  if (context === undefined) {
    throw new Error('usePhaseContext must be used within a PhaseProvider');
  }
  return context;
};
