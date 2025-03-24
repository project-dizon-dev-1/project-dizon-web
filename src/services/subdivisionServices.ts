import { axiosGet, axiosPut } from "@/lib/axios";
import {
  MonthlyTransactionData,
  SubdivisionPhases,
  TransactionSummary,
} from "@/types/HouseTypes";
import { configureCollectionSchemaType } from "@/validations/collectionSchema";

const fetchSubdivisionPhases = async (): Promise<SubdivisionPhases> => {
  return await axiosGet("/subdivision/phases");
};
const fetchSubdivisionSummary = async (): Promise<TransactionSummary> => {
  return await axiosGet("/subdivision/summary");
};
const fetchSubdivisionDashboard = async (): Promise<
  MonthlyTransactionData[]
> => {
  return await axiosGet("/subdivision/dashboard");
};

const upsertFixedDue = async (data: configureCollectionSchemaType) => {
  return await axiosPut("/subdivision/collection/upsert", data);
};

export {
  fetchSubdivisionPhases,
  fetchSubdivisionSummary,
  fetchSubdivisionDashboard,
  upsertFixedDue,
};
