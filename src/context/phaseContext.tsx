import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useQueries } from "@tanstack/react-query";
import {
  fetchAllPhases,
  // fetchAllStreets,
  // fetchAllBlocks,
  // fetchAllLots,
} from "@/services/subdivisionServices";
import {
  // Block,
  // Lot,
  // Street,
  Phase,
  SubdivisionContextType,
} from "@/types/subdivisionTypes";

// Create context
const SubdivisionContext = createContext<SubdivisionContextType | undefined>(
  undefined
);

// Provider component
interface SubdivisionProviderProps {
  children: ReactNode;
}

export const SubdivisionProvider = ({ children }: SubdivisionProviderProps) => {
  const [phases, setPhases] = useState<Phase[]>([]);
  // const [streets, setStreets] = useState<Street[]>([]);
  // const [blocks, setBlocks] = useState<Block[]>([]);
  // const [lots, setLots] = useState<Lot[]>([]);

  // Fetch all data using useQueries
  const results = useQueries({
    queries: [
      {
        queryKey: ["phases"],
        queryFn: fetchAllPhases,
      },
      // {
      //   queryKey: ["streets"],
      //   queryFn: fetchAllStreets,
      // },
      // {
      //   queryKey: ["blocks"],
      //   queryFn: fetchAllBlocks,
      // },
      // {
      //   queryKey: ["lots"],
      //   queryFn: fetchAllLots,
      // },
    ],
  });

  // Extract data and loading states
  const [phasesResult] = results;

  const isLoading = results.some((result) => result.isLoading);

  const refetchData = () => {
    results.forEach((result) => result.refetch());
  };

  // Update state when data is fetched
  useEffect(() => {
    if (phasesResult.data) setPhases(phasesResult.data);
    // if (streetsResult.data) setStreets(streetsResult.data);
    // if (blocksResult.data) setBlocks(blocksResult.data);
    // if (lotsResult.data) setLots(lotsResult.data);
  }, [
    phasesResult.data,
    // streetsResult.data,
    // blocksResult.data,
    // lotsResult.data,
  ]);

  // Context value
  const value = {
    phases,
    // streets,
    // blocks,
    // lots,
    setPhases,
    // setStreets,
    // setBlocks,
    // setLots,
    isLoading,
    refetchData,
  };

  return (
    <SubdivisionContext.Provider value={value}>
      {children}
    </SubdivisionContext.Provider>
  );
};

// Custom hook for using the context
export const useSubdivisionContext = () => {
  const context = useContext(SubdivisionContext);
  if (context === undefined) {
    throw new Error(
      "useSubdivisionContext must be used within a SubdivisionProvider"
    );
  }
  return context;
};
