import { Database } from "./database";

type House = Database["public"]["Tables"]["house-list"]["Row"];

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

export type { House, HouseSummary, FetchHouseCollectionQueryParams };
