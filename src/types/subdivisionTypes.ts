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
  name: string;
  id: string;
};
type fixedDueType = {
  amount?: number;
  due_date?: number;
  grace_period?: number;
};

type PhaseContextType = {
  phases: Phase[];
  isLoading: boolean;
};

export type { Phase, Street, Block, Lot, PhaseContextType, fixedDueType };
