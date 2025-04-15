import React from "react";

type Phase = {
  id: string;
  name: string;
};

type Street = {
  created_at: Date;
  name: string;
  id: string;
  phase_id: string;
};

type Block = {
  created_at: Date;
  name: string;
  id: string;
  phase_id: string;
};

type Lot = {
  number: string;
  id: string;
  created_at: Date;
  block_id: string;
};
type fixedDueType = {
  amount?: number;
  due_date?: number;
  grace_period?: number;
};

type SubdivisionContextType = {
  phases: Phase[];
  streets?: Street[];
  blocks?: Block[];
  lots?: Lot[];
  setPhases: React.Dispatch<React.SetStateAction<Phase[]>>;
  setStreets?: React.Dispatch<React.SetStateAction<Street[]>>;
  setBlocks?: React.Dispatch<React.SetStateAction<Block[]>>;
  setLots?: React.Dispatch<React.SetStateAction<Lot[]>>;
  isLoading: boolean;
  refetchData: () => void;
};

export type { Phase, Street, Block, Lot, SubdivisionContextType, fixedDueType };
