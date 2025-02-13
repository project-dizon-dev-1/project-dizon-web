import { axiosDelete, axiosGet, axiosPost, axiosPut } from "@/lib/axios";
import { Due, DueLog, totalDue } from "@/types/DueTypes";
import { CollectionType } from "@/validations/collectionSchema";
import { dueType } from "@/validations/duesSchema";

const fetchDues = async (): Promise<Due[]> => {
  return axiosGet("/dues/");
};

const fetchTotalDue = async (): Promise<totalDue> => {
  return axiosGet("/dues/total");
};
const fetchDueLogs = async (): Promise<DueLog[]> => {
  return axiosGet("/dues/logs");
};

const fetchFixedDue = async (): Promise<totalDue> => {
  return axiosGet("/dues/fixed-due");
};

const addMultipleDues = async ({
  houseId,
  data,
}: {
  houseId: string;
  data: CollectionType;
}) => {
  return axiosPost(`/dues/add/logs/${houseId}`, data);
};

const addDues = async (data: dueType) => {
  return axiosPost("/dues/add", data);
};
const updateDues = async (dueId: string | undefined, payload: dueType) => {
  return axiosPut(`/dues/update/${dueId}`, payload);
};
const ToggleDueActivation = async (dueId: string, dueIsActive: boolean) => {
  axiosPut(`/dues/activation/${dueId}`, { dueIsActive });
};
const deleteDues = async (dueId: string) => {
  return axiosDelete(`/dues/delete/${dueId}`);
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
