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

export type { House,HouseSummary };
