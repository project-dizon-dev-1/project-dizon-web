import { axiosDelete, axiosGet, axiosPost, axiosPut } from "@/lib/axios";
import { Due, DueLog, totalDue } from "@/types/DueTypes";
import { PaginatedDataType, paginatedParams } from "@/types/paginatedType";
import { dueType } from "@/validations/duesSchema";

const fetchDues = async (): Promise<Due[]> => {
  return await axiosGet(`/dues`);
};

const fetchTotalDue = async (): Promise<totalDue> => {
  return await axiosGet("/dues/total");
};

const fetchDueLogs = async ({
  month,
  status,
  phase,
  query,
  page,
  pageSize,
}: paginatedParams): Promise<PaginatedDataType<DueLog>> => {
  return await axiosGet("/dues/logs", {
    params: { phase, month, status, query, page, pageSize },
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
  data: FormData;
}) => {
  return await axiosPost(`/dues/add/logs/${houseId}`, data);
};

const addDues = async ({
  categoryId,
  formData,
}: {
  categoryId: string;
  formData: dueType & { userName: string; userId: string | undefined };
}) => {
  return await axiosPost(`/dues/add/${categoryId}`, formData);
};

const updateDues = async (
  dueId: string | undefined,
  payload: dueType & { userName: string; userId: string | undefined }
) => {
  return await axiosPut(`/dues/update/${dueId}`, payload);
};

const ToggleDueActivation = async (dueId: string, dueIsActive: boolean) => {
  await axiosPut(`/dues/activation/${dueId}`, { dueIsActive });
};

const deleteDues = async ({
  dueId,
  payload,
}: {
  dueId: string;
  payload: { userName: string; userId: string | undefined };
}) => {
  return await axiosDelete(`/dues/delete/${dueId}`, payload);
};

const approveCollection = async ({
  collectionId,
  userId,
}: {
  collectionId: string | undefined;
  userId: string | undefined;
}) => {
  return await axiosPut(`/dues/${collectionId}/approve`, { userId });
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
  approveCollection,
};
