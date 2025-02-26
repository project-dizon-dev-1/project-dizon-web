import { axiosDelete, axiosGet, axiosPost, axiosPut } from "@/lib/axios";
import { Due, DueLog, totalDue } from "@/types/DueTypes";
import { PaginatedDataType, paginatedParams } from "@/types/paginatedType";
import { CollectionType } from "@/validations/collectionSchema";
import { dueType } from "@/validations/duesSchema";

const fetchDues = async (): Promise<Due[]> => {
  return await axiosGet(`/dues`);
};

const fetchTotalDue = async (): Promise<totalDue> => {
  return await axiosGet("/dues/total");
};

const fetchDueLogs = async ({
  page,
  pageSize,
}: paginatedParams): Promise<PaginatedDataType<DueLog>> => {
  return await axiosGet("/dues/logs", {
    params: { page, pageSize },
  });
};

const fetchFixedDue = async (): Promise<totalDue> => {
  return await axiosGet(`/dues/fixed-due`);
};

const addMultipleDues = async ({
  houseId,
  data,
}: {
  houseId: string;
  data: CollectionType;
}) => {
  return await axiosPost(`/dues/add/logs/${houseId}`, data);
};

const addDues = async (data: dueType) => {
  return await axiosPost("/dues/add", data);
};

const updateDues = async (dueId: string | undefined, payload: dueType) => {
  return await axiosPut(`/dues/update/${dueId}`, payload);
};

const ToggleDueActivation = async (dueId: string, dueIsActive: boolean) => {
  await axiosPut(`/dues/activation/${dueId}`, { dueIsActive });
};

const deleteDues = async (dueId: string) => {
  return await axiosDelete(`/dues/delete/${dueId}`);
};

export {
  fetchDueLogs,
  addDues,
  fetchFixedDue,
  fetchTotalDue,
  addMultipleDues,
  fetchDues,
  updateDues,
  deleteDues,
  ToggleDueActivation,
};
