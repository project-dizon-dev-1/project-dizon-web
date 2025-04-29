import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllPhases } from "@/services/subdivisionServices";
import { Phase } from "@/types/subdivisionTypes";
import useUserContext from "@/hooks/useUserContext";

// Define a simplified context type
interface PhaseContextType {
  phases: Phase[];
  setPhases: React.Dispatch<React.SetStateAction<Phase[]>>;
  isLoading: boolean;
  refetchPhases: () => void;
}

// Create context
const PhaseContext = createContext<PhaseContextType | undefined>(undefined);

// Provider component
interface PhaseProviderProps {
  children: ReactNode;
}

export const PhaseProvider = ({ children }: PhaseProviderProps) => {
  const { user } = useUserContext();
  const [phases, setPhases] = useState<Phase[]>([]);

  // Fetch phases using useQuery
  const {
    data: phasesData,
    isLoading,
    refetch: refetchPhases,
  } = useQuery({
    queryKey: ["phases"],
    queryFn: fetchAllPhases,
    enabled: !!user,
  });

  // Update state when data is fetched
  useEffect(() => {
    if (phasesData) setPhases(phasesData);
  }, [phasesData]);

  // Context value
  const value = {
    phases,
    setPhases,
    isLoading,
    refetchPhases,
  };

  return (
    <PhaseContext.Provider value={value}>{children}</PhaseContext.Provider>
  );
};

// Custom hook for using the context
export const usePhaseContext = () => {
  const context = useContext(PhaseContext);
  if (context === undefined) {
    throw new Error("usePhaseContext must be used within a PhaseProvider");
  }
  return context;
};
