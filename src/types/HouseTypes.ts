import { Database } from "./database";

type House = {
  id: string;
  house_family_name: string;
  house_phase: string;
  house_street: string;
  house_block: string;
  house_lot: string;
  house_main_poc: string | null;
};

type HouseDetails = Database["public"]["Tables"]["house-list"]["Row"];

type VehicleDetails = {
  created_at: Date;
  vehicle_name: string;
  vehicle_color: string;
  vehicle_plate_number: string;
  vehicle_sticker_expiration: Date | null;
  house_id: string;
  id: string;
};

type SubdivisionPhases = {
  phase_number: string;
  total_population: number;
}[];

type HouseSummary = {
  phase: string;
  totalResidents: number;
  paidResidentsCount: number;
  unpaidResidentsCount: number;
  dueAmountPerResident: number;
  totalPaidAmount: number;
  totalUnpaidAmount: number;
  totalExpectedAmount: number;
  paidResidentsPercentage: number;
  unpaidResidentsPercentage: number;
};

type FetchHouseCollectionQueryParams = {
  page: string;
  query?: string | null;
  phase?: string | null;
  street?: string | null;
  block?: string | null;
  lot?: string | null;
};
type MonthlyTransactionData = {
  month: number;
  year: number;
  period: string;
  INCOME: number;
  EXPENSE: number;
};

type TransactionSummary = {
  total_income: number;
  total_expense: number;
  net_total: number;
};

export type {
  TransactionSummary,
  MonthlyTransactionData,
  House,
  SubdivisionPhases,
  HouseDetails,
  HouseSummary,
  FetchHouseCollectionQueryParams,
  VehicleDetails,
};
